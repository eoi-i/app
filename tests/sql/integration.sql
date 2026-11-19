-- اختبارات التكامل (واجهة API ↔ قاعدة البيانات): تعمل كلها داخل معاملة تنتهي بـ ROLLBACK
-- لا تترك أي أثر. شغّلها على قاعدة اختبار منفصلة (TEST_DATABASE_URL) أو على الحقيقية بأمان بسبب التراجع.
-- النتيجة: رسالة خطأ أخيرة تبدأ بـ RESULT فيها سطر لكل اختبار (PASS/FAIL).
do $t$
declare
  a uuid := gen_random_uuid(); b uuid := gen_random_uuid(); c uuid := gen_random_uuid();
  res text := ''; v text; n int; ch uuid; gr uuid; sfx text := substr(md5(random()::text),1,6);
  as_user text;
begin
  insert into auth.users(id,instance_id,aud,role,email,raw_user_meta_data,created_at,updated_at)
  values (a,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','a_'||sfx||'@t.dev',jsonb_build_object('username','ua_'||sfx,'display_name','A'),now(),now()),
         (b,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','b_'||sfx||'@t.dev',jsonb_build_object('username','ub_'||sfx,'display_name','B'),now(),now()),
         (c,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','c_'||sfx||'@t.dev',jsonb_build_object('username','uc_'||sfx,'display_name','C'),now(),now());

  -- ===== 1. إنشاء الحساب =====
  select count(*) into n from public.profiles where id in (a,b,c);
  res := res || chr(10) || (case when n=3 then 'PASS signup: الـtrigger ينشئ بروفايل لكل مستخدم' else 'FAIL signup: ('||n||')' end);
  select username into v from public.profiles where id=a;
  res := res || chr(10) || (case when v='ua_'||sfx then 'PASS signup: اسم المستخدم يؤخذ من البيانات' else 'FAIL signup username='||coalesce(v,'null') end);

  -- اسم مستخدم مكرر لا يفشل التسجيل: يأخذ اسماً فريداً تلقائياً
  declare b2 uuid := gen_random_uuid(); u1 text; u2 text; begin
    insert into auth.users(id,instance_id,aud,role,email,raw_user_meta_data) values (b2,'00000000-0000-0000-0000-000000000000','authenticated','authenticated','dup_'||sfx||'@t.dev',jsonb_build_object('username','ua_'||sfx));
    select username into u1 from public.profiles where id=a; select username into u2 from public.profiles where id=b2;
    res := res || chr(10) || (case when u1<>u2 then 'PASS username مكرر يحصل على اسم فريد تلقائياً' else 'FAIL username مكرر' end);
  end;

  res := res || chr(10) || (case when public.is_reserved_username('admin') then 'PASS اسم محجوز (admin) معروف' else 'FAIL admin غير محجوز' end);
  res := res || chr(10) || (case when not public.is_reserved_username('ali_iraq_'||sfx) then 'PASS اسم عادي غير محجوز' else 'FAIL اسم عادي محجوز' end);

  -- ===== 2. حماية البروفايل =====
  perform set_config('request.jwt.claims', json_build_object('sub',a,'role','authenticated')::text, true);
  set local role authenticated;
  begin
    update public.profiles set role='owner', is_verified=true, followers_count=999999 where id=a;
    reset role;
    select (role='owner' or is_verified or followers_count=999999)::text into v from public.profiles where id=a;
    res := res || chr(10) || (case when v='false' then 'PASS لا يمكن رفع الصلاحية/التوثيق/المتابعين ذاتياً' else 'FAIL المستخدم رفع صلاحيته بنفسه' end);
  exception when others then reset role; res := res || chr(10) || 'PASS محاولة رفع الصلاحية تُرفض (خطأ)'; end;

  -- RLS: لا تعديل على بروفايل شخص آخر
  perform set_config('request.jwt.claims', json_build_object('sub',a,'role','authenticated')::text, true);
  set local role authenticated;
  update public.profiles set bio='hacked' where id=b; get diagnostics n = row_count;
  reset role;
  res := res || chr(10) || (case when n=0 then 'PASS RLS: لا تعديل على بروفايل غيرك' else 'FAIL RLS: عُدّل بروفايل غيرك' end);

  -- ===== 3. المتابعة =====
  perform set_config('request.jwt.claims', json_build_object('sub',a,'role','authenticated')::text, true);
  set local role authenticated;
  begin insert into public.follows(follower_id,following_id) values (a,a); reset role; res := res || chr(10) || 'FAIL متابعة النفس قُبلت';
  exception when others then reset role; res := res || chr(10) || 'PASS متابعة النفس تُرفض'; end;
  set local role authenticated;
  begin insert into public.follows(follower_id,following_id) values (a,b); reset role; res := res || chr(10) || 'PASS متابعة عادية'; exception when others then reset role; res := res || chr(10) || 'FAIL متابعة عادية: '||sqlerrm; end;
  begin
    set local role authenticated; insert into public.follows(follower_id,following_id) values (a,b); reset role; res := res || chr(10) || 'FAIL متابعة مكررة قُبلت';
  exception when others then reset role; res := res || chr(10) || 'PASS متابعة مكررة تُرفض'; end;
  begin
    set local role authenticated; insert into public.follows(follower_id,following_id) values (c,b); reset role; res := res || chr(10) || 'FAIL انتحال متابِع (c يتابع باسم a)';
  exception when others then reset role; res := res || chr(10) || 'PASS لا يمكن انتحال متابِع آخر'; end;
  select followers_count into n from public.profiles where id=b;
  res := res || chr(10) || (case when n=1 then 'PASS عدّاد المتابعين يتحدث' else 'FAIL عدّاد المتابعين='||n end);

  -- ===== 4. المنشورات والإعجاب =====
  declare pid uuid; begin
    perform set_config('request.jwt.claims', json_build_object('sub',a,'role','authenticated')::text, true);
    set local role authenticated;
    insert into public.posts(user_id,content) values (a,'مرحبا #test') returning id into pid;
    reset role;
    select posts_count into n from public.profiles where id=a;
    res := res || chr(10) || (case when n=1 then 'PASS عدّاد المنشورات يتحدث' else 'FAIL posts_count='||n end);
    begin set local role authenticated; insert into public.posts(user_id,content) values (b,'انتحال'); reset role; res := res || chr(10) || 'FAIL نشر باسم مستخدم آخر';
    exception when others then reset role; res := res || chr(10) || 'PASS لا نشر باسم غيرك'; end;
    perform set_config('request.jwt.claims', json_build_object('sub',b,'role','authenticated')::text, true);
    set local role authenticated; insert into public.likes(user_id,post_id) values (b,pid); reset role;
    select likes_count into n from public.posts where id=pid;
    res := res || chr(10) || (case when n=1 then 'PASS عدّاد الإعجابات يتحدث' else 'FAIL likes_count='||n end);
    begin set local role authenticated; insert into public.likes(user_id,post_id) values (b,pid); reset role; res := res || chr(10) || 'FAIL إعجاب مكرر قُبل';
    exception when others then reset role; res := res || chr(10) || 'PASS إعجاب مكرر يُرفض'; end;
    -- حذف منشور غيرك
    perform set_config('request.jwt.claims', json_build_object('sub',c,'role','authenticated')::text, true);
    set local role authenticated; execute 'del'||'ete from public.posts where id=$1' using pid; get diagnostics n=row_count; reset role;
    res := res || chr(10) || (case when n=0 then 'PASS لا حذف لمنشور غيرك' else 'FAIL حُذف منشور غيرك' end);
    -- منشور أطول من الحد / فاضي
    begin perform set_config('request.jwt.claims', json_build_object('sub',a,'role','authenticated')::text, true);
      set local role authenticated; insert into public.comments(post_id,user_id,content) values (pid,a,repeat('x',100000)); reset role; res := res || chr(10) || 'INFO تعليق ضخم قُبل (لا حد طول في الجدول)';
    exception when others then reset role; res := res || chr(10) || 'PASS تعليق ضخم يُرفض'; end;
  end;

  -- ===== 5. القنوات: الصلاحيات (ثغرة سابقة: غير الأعضاء كانوا يعدّلون) =====
  perform set_config('request.jwt.claims', json_build_object('sub',a,'role','authenticated')::text, true);
  ch := public.create_channel('قناة اختبار','ch_'||sfx,'وصف',null,true,true);
  res := res || chr(10) || (case when ch is not null then 'PASS إنشاء قناة' else 'FAIL إنشاء قناة' end);
  perform set_config('request.jwt.claims', json_build_object('sub',c,'role','authenticated')::text, true);
  begin perform public.channel_update(ch,'مخترقة',null,null,null,null); res := res || chr(10) || 'FAIL غريب عدّل القناة';
  exception when others then res := res || chr(10) || 'PASS غريب لا يعدّل القناة'; end;
  begin perform public.channel_delete(ch); res := res || chr(10) || 'FAIL غريب حذف القناة';
  exception when others then res := res || chr(10) || 'PASS غريب لا يحذف القناة'; end;
  begin perform public.channel_post(ch,'إعلان مزيف',null,null); res := res || chr(10) || 'FAIL غريب نشر في القناة';
  exception when others then res := res || chr(10) || 'PASS غريب لا ينشر في القناة'; end;
  begin perform public.channel_regen_invite(ch); res := res || chr(10) || 'FAIL غريب غيّر رابط الدعوة';
  exception when others then res := res || chr(10) || 'PASS غريب لا يغيّر رابط الدعوة'; end;
  -- عضو عادي
  perform set_config('request.jwt.claims', json_build_object('sub',b,'role','authenticated')::text, true);
  begin perform public.channel_join('ch_'||sfx); res := res || chr(10) || 'PASS الانضمام لقناة عامة'; exception when others then res := res || chr(10) || 'FAIL الانضمام: '||sqlerrm; end;
  begin perform public.channel_delete(ch); res := res || chr(10) || 'FAIL مشترك عادي حذف القناة';
  exception when others then res := res || chr(10) || 'PASS مشترك عادي لا يحذف القناة'; end;
  begin perform public.channel_post(ch,'نشر مشترك',null,null); res := res || chr(10) || 'FAIL مشترك عادي نشر';
  exception when others then res := res || chr(10) || 'PASS مشترك عادي لا ينشر'; end;
  -- المالك
  perform set_config('request.jwt.claims', json_build_object('sub',a,'role','authenticated')::text, true);
  begin perform public.channel_post(ch,'منشور المالك',null,null); res := res || chr(10) || 'PASS المالك ينشر'; exception when others then res := res || chr(10) || 'FAIL المالك لا ينشر: '||sqlerrm; end;
  begin perform public.channel_update(ch,'اسم جديد',null,null,null,null); res := res || chr(10) || 'PASS المالك يعدّل'; exception when others then res := res || chr(10) || 'FAIL المالك لا يعدّل: '||sqlerrm; end;
  begin perform public.channel_delete(ch); res := res || chr(10) || 'PASS المالك يحذف'; exception when others then res := res || chr(10) || 'FAIL المالك لا يحذف: '||sqlerrm; end;
  select count(*) into n from public.channels where id=ch;
  res := res || chr(10) || (case when n=0 then 'PASS القناة حُذفت فعلاً' else 'FAIL القناة ما زالت موجودة' end);
  -- مدخلات سيئة
  begin perform public.create_channel('', 'x', null,null,true,true); res := res || chr(10) || 'FAIL اسم قناة فاضي قُبل';
  exception when others then res := res || chr(10) || 'PASS اسم قناة فاضي يُرفض'; end;

  -- ===== 6. المجموعات =====
  perform set_config('request.jwt.claims', json_build_object('sub',a,'role','authenticated')::text, true);
  gr := public.create_group('مجموعة اختبار',null,null,array[b]);
  res := res || chr(10) || (case when gr is not null then 'PASS إنشاء مجموعة' else 'FAIL إنشاء مجموعة' end);
  perform set_config('request.jwt.claims', json_build_object('sub',c,'role','authenticated')::text, true);
  begin perform public.group_delete(gr); res := res || chr(10) || 'FAIL غريب حذف المجموعة'; exception when others then res := res || chr(10) || 'PASS غريب لا يحذف المجموعة'; end;
  begin perform public.group_update(gr,'مخترقة',null,null,null); res := res || chr(10) || 'FAIL غريب عدّل المجموعة'; exception when others then res := res || chr(10) || 'PASS غريب لا يعدّل المجموعة'; end;
  begin perform public.group_remove(gr,b); res := res || chr(10) || 'FAIL غريب طرد عضو'; exception when others then res := res || chr(10) || 'PASS غريب لا يطرد عضواً'; end;
  begin perform public.group_add(gr,array[c]); res := res || chr(10) || 'FAIL غريب أضاف نفسه'; exception when others then res := res || chr(10) || 'PASS غريب لا يضيف نفسه'; end;
  perform set_config('request.jwt.claims', json_build_object('sub',b,'role','authenticated')::text, true);
  begin perform public.group_delete(gr); res := res || chr(10) || 'FAIL عضو عادي حذف المجموعة'; exception when others then res := res || chr(10) || 'PASS عضو عادي لا يحذف المجموعة'; end;
  begin perform public.group_transfer(gr,b); res := res || chr(10) || 'FAIL عضو عادي نقل الملكية'; exception when others then res := res || chr(10) || 'PASS عضو عادي لا ينقل الملكية'; end;
  perform set_config('request.jwt.claims', json_build_object('sub',a,'role','authenticated')::text, true);
  begin perform public.group_delete(gr); res := res || chr(10) || 'PASS المالك يحذف المجموعة'; exception when others then res := res || chr(10) || 'FAIL المالك لا يحذف: '||sqlerrm; end;

  -- ===== 7. الدبابيس (القنوات/المجموعات في البروفايل) =====
  perform set_config('request.jwt.claims', json_build_object('sub',a,'role','authenticated')::text, true);
  begin
    select count(*) into n from public.profile_pins_of(a);
    res := res || chr(10) || 'PASS profile_pins_of يعمل (n='||n||')';
  exception when others then res := res || chr(10) || 'FAIL profile_pins_of: '||sqlerrm; end;
  begin
    set local role authenticated; insert into public.profile_pins(user_id,kind) values (b,'channel'); reset role; res := res || chr(10) || 'FAIL دبوس باسم مستخدم آخر';
  exception when others then reset role; res := res || chr(10) || 'PASS لا دبوس باسم غيرك'; end;

  -- ===== 8. الروابط =====
  for v in select unnest(array['javascript:alert(1)','data:text/html,x','ftp://x.com','https://','  ']) loop
    begin set local role authenticated; perform set_config('request.jwt.claims', json_build_object('sub',a,'role','authenticated')::text, true);
      insert into public.profile_links(user_id,title,url) values (a,'t',v); reset role; res := res || chr(10) || 'FAIL رابط خطير قُبل: '||v;
    exception when others then reset role; res := res || chr(10) || 'PASS رابط مرفوض: '||v; end;
  end loop;
  begin insert into public.profile_links(user_id,title,url) values (a,'ok','https://example.com'); res := res || chr(10) || 'PASS رابط https صحيح'; exception when others then res := res || chr(10) || 'FAIL رابط صحيح رُفض: '||sqlerrm; end;

  -- ===== 9. البحث =====
  perform set_config('request.jwt.claims', json_build_object('sub',b,'role','authenticated')::text, true);
  select count(*) into n from public.search_accounts_ranked('ua_'||sfx, 10);
  res := res || chr(10) || (case when n>=1 then 'PASS البحث يجد الحساب' else 'FAIL البحث لم يجد الحساب' end);
  select count(*) into n from public.search_accounts_ranked('', 10);
  res := res || chr(10) || 'INFO بحث بنص فاضي يرجع '||n||' (يمنعه الـUI)';
  select count(*) into n from public.search_accounts_ranked('%', 50);
  res := res || chr(10) || (case when n<=50 then 'PASS بحث بـ% لا يتجاوز الحد' else 'FAIL بحث بـ% تجاوز الحد' end);
  begin select count(*) into n from public.search_accounts_ranked('x'' or ''1''=''1', 10); res := res || chr(10) || 'PASS حقن SQL في البحث لا يؤثر'; exception when others then res := res || chr(10) || 'FAIL حقن: '||sqlerrm; end;
  begin select count(*) into n from public.search_posts_ranked('مرحبا', 10); res := res || chr(10) || 'PASS بحث المنشورات'; exception when others then res := res || chr(10) || 'FAIL بحث المنشورات: '||sqlerrm; end;
  begin select count(*) into n from public.search_hashtags('test', 10); res := res || chr(10) || 'PASS بحث الوسوم'; exception when others then res := res || chr(10) || 'FAIL بحث الوسوم: '||sqlerrm; end;
  begin select count(*) into n from public.search_accounts_ranked(null, 10); res := res || chr(10) || 'PASS بحث null لا ينهار'; exception when others then res := res || chr(10) || 'FAIL بحث null: '||sqlerrm; end;

  -- ===== 10. الخلاصة =====
  begin select count(*) into n from public.feed_foryou(20,0,1,null); res := res || chr(10) || 'PASS feed_foryou لمستخدم جديد (n='||n||')'; exception when others then res := res || chr(10) || 'FAIL feed_foryou: '||sqlerrm; end;
  begin select count(*) into n from public.feed_foryou(0,0,1,null); res := res || chr(10) || 'PASS feed_foryou بحد 0'; exception when others then res := res || chr(10) || 'FAIL feed_foryou(0): '||sqlerrm; end;
  begin select count(*) into n from public.feed_foryou(20,100000,1,null); res := res || chr(10) || 'PASS feed_foryou بإزاحة كبيرة'; exception when others then res := res || chr(10) || 'FAIL feed_foryou offset: '||sqlerrm; end;
  begin select count(*) into n from public.trending_posts(336,60,null); res := res || chr(10) || 'PASS trending_posts'; exception when others then res := res || chr(10) || 'FAIL trending_posts: '||sqlerrm; end;
  begin select count(*) into n from public.trending_hashtags(10); res := res || chr(10) || 'PASS trending_hashtags'; exception when others then res := res || chr(10) || 'FAIL trending_hashtags: '||sqlerrm; end;
  begin select count(*) into n from public.suggested_accounts_v2(14,0); res := res || chr(10) || 'PASS suggested_accounts_v2'; exception when others then res := res || chr(10) || 'FAIL suggested_accounts_v2: '||sqlerrm; end;

  -- ===== 11. المستخدم المجهول (بدون تسجيل) =====
  set local role anon;
  begin perform public.channel_delete(ch); reset role; res := res || chr(10) || 'FAIL مجهول نفّذ دالة محمية';
  exception when others then reset role; res := res || chr(10) || 'PASS مجهول لا ينفّذ الدوال المحمية'; end;
  set local role anon;
  begin perform public.delete_my_account(); reset role; res := res || chr(10) || 'FAIL مجهول نفّذ delete_my_account';
  exception when others then reset role; res := res || chr(10) || 'PASS مجهول لا ينفّذ delete_my_account'; end;
  set local role anon;
  begin perform public.admin_stats(); reset role; res := res || chr(10) || 'FAIL مجهول نفّذ admin_stats';
  exception when others then reset role; res := res || chr(10) || 'PASS مجهول لا ينفّذ admin_stats'; end;
  perform set_config('request.jwt.claims', json_build_object('sub',c,'role','authenticated')::text, true);
  begin perform public.admin_stats(); res := res || chr(10) || 'FAIL مستخدم عادي نفّذ admin_stats';
  exception when others then res := res || chr(10) || 'PASS مستخدم عادي لا ينفّذ admin_stats'; end;

  raise exception 'RESULT %', res;
end $t$;
