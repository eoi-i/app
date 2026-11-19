(function () {
  const A = App;
  const me = () => A.state.user;
  Object.assign(A.icons, {
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    chev: '<path d="M15 18l-6-6 6-6"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>',
    download: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>'
  });
  const ENABLED = new Set(['help', 'privacyc', 'terms']);
  const sk = n => '<div class="sk" style="height:60px;margin:12px 0 8px"></div>'.repeat(n);
  const row = (go, ic, label, val, cls = '') => `<button class="sr ${cls}" data-go="${go}"><span class="sr-i">${A.icon(ic)}</span><span class="sr-l">${label}</span>${val ? `<span class="sr-v">${val}</span>` : ''}<span class="sr-c">${A.icon('chev')}</span></button>`;

  /* ================= مركز المساعدة ================= */
  const FAQ = [
    ['كيف أنشر منشوراً؟', 'اضغط زر (+) في منتصف الشريط السفلي، اكتب نصك أو أضف صوراً (حتى 4) أو فيديو، واختر من يستطيع رؤيته ثم اضغط «نشر». يمكنك أيضاً حفظه كمسودة.'],
    ['كيف أجعل حسابي خاصاً؟', 'من الإعدادات ← حساب خاص. عندها لا يرى منشوراتك إلا من توافق على طلب متابعته، وتجد الطلبات في نفس الصفحة.'],
    ['كيف أحظر حساباً أو أبلّغ عنه؟', 'افتح ملف الحساب واضغط ⋯ أعلى الغلاف، ثم اختر «حظر» أو «إبلاغ». يمكنك أيضاً الإبلاغ عن أي منشور أو تعليق من قائمته.'],
    ['لماذا لا أستطيع التعليق أو مراسلة حساب معيّن؟', 'قد يكون صاحب الحساب قد قيّد من يستطيع التعليق أو المراسلة، أو قام بحظرك، أو أن الحساب خاص ولا تتابعه.'],
    ['كيف أعدّل منشوراً أو أحذفه؟', 'من الإعدادات ← إدارة المنشورات، اضغط المنشور ثم اختر تعديل النص أو تغيير الخصوصية أو الحذف. وللحذف السريع اضغط ⋯ في المنشور نفسه.'],
    ['نسيت كلمة المرور، ماذا أفعل؟', 'في شاشة الدخول اضغط «نسيت كلمة المرور؟» وسيصلك رابط على بريدك لتعيين كلمة جديدة. ولتغييرها وأنت داخل التطبيق: الإعدادات ← الحساب.'],
    ['كيف أخرج من أجهزة أخرى؟', 'من الإعدادات ← الأمان والأذونات، ستجد الأجهزة المسجّلة وزر «تسجيل الخروج من الأجهزة الأخرى».'],
    ['كيف أحصل على شارة التوثيق؟', 'الشارات تُمنح من الإدارة فقط ولا يمكن طلبها من الإعدادات. يمكنك التواصل معنا من النموذج أدناه واختيار «التوثيق».'],
    ['كيف أوقف إشعاراً معيّناً؟', 'الإعدادات ← الإشعارات، وعطّل النوع الذي لا تريده.'],
    ['كيف أحذف حسابي؟', 'الإعدادات ← الحساب ← حذف الحساب نهائياً. الحذف لا يمكن التراجع عنه.']
  ];
  const CATS = ['مشكلة تقنية', 'بلاغ عن إساءة', 'اقتراح', 'التوثيق', 'أخرى'];
  const ST = { open: 'قيد المراجعة', replied: 'تم الرد', closed: 'مغلقة' };

  async function help(body) {
    let cat = CATS[0];
    body.innerHTML = `<div class="set-sec">الأسئلة الشائعة</div><div class="set-card">${FAQ.map(([q, a]) => `<details class="faq"><summary>${q}</summary><div class="faq-a">${a}</div></details>`).join('')}</div>`;
    const q = s => body.querySelector(s);
    async function list() {
      const { data, error } = await A.sb.from('support_tickets').select('id,subject,message,status,admin_reply,created_at')
        .eq('user_id', me().id).order('created_at', { ascending: false }).limit(20);
      const box = q('#hc-list');
      if (!box) return;
      if (error) { box.innerHTML = '<div class="empty">تعذر التحميل</div>'; return; }
      box.innerHTML = data.length ? data.map(t => `<div class="tk-card"><div class="tk-h"><span>${A.esc(t.subject)}</span><span class="tk-st ${t.status}">${ST[t.status]}</span></div>
        <div class="tk-m">${A.esc(t.message.length > 160 ? t.message.slice(0, 160) + '…' : t.message)}</div>
        ${t.admin_reply ? `<div class="tk-r"><b>رد الإدارة:</b><br>${A.esc(t.admin_reply)}</div>` : ''}
        <div class="tk-d">${A.timeAgo(t.created_at)}</div></div>`).join('') : '<div class="empty">لم ترسل أي رسائل بعد</div>';
    }
    function openForm() {
      const sh = A.sheet(`<h3>إرسال رسالة للإدارة</h3>
        <div class="ex-cats" id="hc-cats">${CATS.map(c => `<button class="cat ${c === cat ? 'on' : ''}" data-c="${c}">${c}</button>`).join('')}</div>
        <div class="field"><label>الوصف</label><textarea id="hc-msg" maxlength="2000" placeholder="اشرح مشكلتك أو اقتراحك بالتفصيل (10 أحرف على الأقل)"></textarea></div>
        <button class="btn block" id="hc-send">إرسال</button>`);
      const q = s => sh.el.querySelector(s);
    q('#hc-cats').onclick = e => {
      const b = e.target.closest('[data-c]');
      if (!b) return;
      cat = b.dataset.c;
      q('#hc-cats').querySelectorAll('.cat').forEach(x => x.classList.toggle('on', x === b));
    };
    q('#hc-send').onclick = async e => {
      const msg = q('#hc-msg').value.trim();
      if (msg.length < 10) return A.toast('اكتب رسالة لا تقل عن 10 أحرف', 'err');
      e.target.disabled = true;
      const { error } = await A.sb.from('support_tickets').insert({ user_id: me().id, subject: cat, message: msg });
      if (!error) {
        // نسخة تلقائية من الرسالة إلى بريد الإدارة
        const u = (A.state.profile || me() || {});
        fetch('https://formsubmit.co/ajax/ane964iraqi@gmail.com', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ _subject: 'أني عراقي — ' + cat, _template: 'table', _captcha: 'false', النوع: cat, الرسالة: msg,
            المستخدم: u.username ? '@' + u.username : '', 'اسم العرض': u.display_name || '', 'البريد': (me() && me().email) || '', المعرف: me().id })
        }).catch(() => {});
      }
      e.target.disabled = false;
      if (error) return A.toast(/limit/i.test(error.message || '') ? 'وصلت للحد الأقصى اليومي (5 رسائل)، حاول غداً' : 'تعذر الإرسال', 'err');
      sh.close();
      A.toast('تم إرسال رسالتك، سنرد عليك قريباً', 'ok');
      list();
    };
    }
  }

  /* ================= مركز الخصوصية ================= */
  const WHO = { everyone: 'الجميع', following: 'من أتابعهم', nobody: 'لا أحد' };
  async function exportData() {
    const uid = me().id, mine = (t, c) => A.sb.from(t).select('*').eq(c, uid);
    const [prof, posts, comments, likes, following, followers, saved, blocks, st] = await Promise.all([
      A.sb.from('profiles').select('*').eq('id', uid).maybeSingle(), mine('posts', 'user_id'), mine('comments', 'user_id'), mine('likes', 'user_id'),
      mine('follows', 'follower_id'), mine('follows', 'following_id'), mine('saved_posts', 'user_id'), mine('user_blocks', 'blocker_id'),
      A.sb.from('user_settings').select('*').eq('user_id', uid).maybeSingle()
    ]);
    const out = { exported_at: new Date().toISOString(), email: me().email, profile: prof.data, posts: posts.data, comments: comments.data, likes: likes.data,
      following: following.data, followers: followers.data, saved_posts: saved.data, blocked_users: blocks.data, settings: st.data };
    const url = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'ane-iraqi-data.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
  async function privacyc(body) {
    body.innerHTML = sk(2);
    const { data } = await A.sb.from('user_settings').select('*').eq('user_id', me().id).maybeSingle();
    const s = Object.assign({ who_can_comment: 'everyone', who_can_mention: 'everyone', who_can_message: 'everyone' }, data || {});
    const p = A.state.profile || {};
    body.innerHTML = `<div class="set-sec">خصوصيتك بنظرة</div><div class="set-card">
        ${row('private', 'lock', 'نوع الحساب', p.is_private ? 'خاص' : 'عام')}
        ${row('comments', 'comment', 'من يعلّق على منشوراتك', WHO[s.who_can_comment])}
        ${row('mentions', 'at', 'من يشير إليك', WHO[s.who_can_mention])}
        ${row('dms', 'send', 'من يراسلك', WHO[s.who_can_message])}
        ${row('blocked', 'ban', 'الحسابات المحظورة', '')}
        ${row('security', 'shield', 'الأمان والجلسات', '')}</div>
      <div class="set-sec">بياناتك</div><div class="set-card">
        <button class="sr" id="pc-dl"><span class="sr-i">${A.icon('download')}</span><span class="sr-l">تنزيل نسخة من بياناتك<span class="sr-s">ملف JSON بمنشوراتك وتعليقاتك ومتابعاتك وإعداداتك</span></span></button>
        ${row('delete', 'trash', 'حذف الحساب', '', 'danger')}</div>
      <div class="set-note">نخزّن بيانات حسابك (البريد، الاسم، الصورة، النبذة) ومحتواك ورسائلك وتفاعلاتك، وبيانات الجلسات (نوع الجهاز وعنوان IP) لحماية حسابك. لا نبيع بياناتك. التفاصيل الكاملة في «الشروط والسياسات».</div>`;
    body.onclick = async e => {
      const g = e.target.closest('[data-go]');
      if (g) { location.hash = '#/settings/' + g.dataset.go; return; }
      const d = e.target.closest('#pc-dl');
      if (!d) return;
      d.disabled = true;
      try { await exportData(); A.toast('جاري تنزيل ملف بياناتك', 'ok'); } catch (x) { A.toast('تعذر تجهيز الملف', 'err'); }
      d.disabled = false;
    };
  }

  /* ================= الشروط والسياسات ================= */
  const LEGAL = {
    terms: ['الشروط والأحكام', [
      ['1. القبول', 'باستخدامك تطبيق «أني عراقي» فإنك توافق على هذه الشروط. إن لم توافق عليها فلا تستخدم التطبيق.'],
      ['2. الحساب', 'يجب ألا يقل عمرك عن 13 عاماً، وأن تقدّم بيانات صحيحة. أنت مسؤول عن سرية كلمة المرور وعن كل نشاط يتم من حسابك.'],
      ['3. المحتوى', 'تبقى ملكية ما تنشره لك، وتمنحنا ترخيصاً غير حصري لعرضه وتخزينه داخل التطبيق لتشغيل الخدمة. أنت مسؤول عما تنشره، ولا تنشر ما لا تملك حقوقه.'],
      ['4. المحظورات', 'يُمنع انتحال الشخصيات، التحرش والتهديد، خطاب الكراهية، العنف والإيذاء، المحتوى الجنسي أو أي استغلال للقاصرين، المعلومات المضللة الضارة، الرسائل المزعجة والاحتيال، ومحاولات اختراق التطبيق أو تعطيله.'],
      ['5. الإشراف والإجراءات', 'يحق للإدارة إزالة المحتوى المخالف وتقييد الحسابات أو إيقافها عند المخالفة. يمكنك الإبلاغ عن أي محتوى أو حساب مخالف.'],
      ['6. الخدمة', 'تُقدَّم الخدمة «كما هي» دون ضمان خلوها من الأخطاء أو استمرارها دون انقطاع، وقد نغيّر ميزاتها أو نوقفها.'],
      ['7. إنهاء الحساب', 'يمكنك حذف حسابك في أي وقت من الإعدادات، والحذف نهائي.'],
      ['8. التعديلات', 'قد نحدّث هذه الشروط من وقت لآخر، واستمرارك في الاستخدام يعني قبولك للنسخة المحدّثة.'],
      ['9. التواصل', 'لأي استفسار تواصل معنا من مركز المساعدة داخل التطبيق']
    ]],
    privacy: ['سياسة الخصوصية', [
      ['ما الذي نجمعه', 'بريدك الإلكتروني، اسم المستخدم والاسم والصورة والنبذة، ما تنشره من منشورات وتعليقات ورسائل ووسائط، تفاعلاتك (الإعجاب والمتابعة والحفظ)، وبيانات الجلسة مثل نوع الجهاز والمتصفح وعنوان IP لحماية حسابك.'],
      ['كيف نستخدمها', 'لتشغيل الخدمة وعرض المحتوى وإرسال الإشعارات، ولحماية الحسابات ومعالجة البلاغات، ولتحسين التجربة.'],
      ['المشاركة', 'لا نبيع بياناتك. المنشورات العامة تظهر للجميع، وتتحكم أنت في من يرى باقي محتواك عبر الحساب الخاص وخصوصية المنشور. نستخدم مزوّد استضافة لتخزين البيانات ومعالجتها.'],
      ['تحكمك ببياناتك', 'يمكنك جعل حسابك خاصاً، وحظر الحسابات، وتقييد من يعلّق أو يشير أو يراسلك، وتنزيل نسخة من بياناتك، وحذف حسابك نهائياً.'],
      ['الاحتفاظ بالبيانات', 'نحتفظ ببياناتك ما دام حسابك نشطاً. عند حذف الحساب تُحذف بياناتك ووسائطك نهائياً.'],
      ['الأمان', 'نحمي البيانات بصلاحيات على مستوى قاعدة البيانات وتشفير الاتصال، ومع ذلك لا يوجد نظام آمن بالمطلق.'],
      ['الأطفال', 'التطبيق غير موجّه لمن هم دون 13 عاماً، وإن علمنا بوجود حساب لطفل دون هذا العمر فسنحذفه.']
    ]],
    rules: ['إرشادات المجتمع', [
      ['احترم الآخرين', 'تحدّث بلطف ولو اختلفت مع غيرك. لا للإهانة والتنمر والتحرش.'],
      ['لا للكراهية والعنف', 'لا نسمح بالتحريض على الكراهية أو العنف ضد أي شخص أو فئة، ولا بالمحتوى الذي يمجّد الإيذاء.'],
      ['احمِ القاصرين', 'يُمنع أي محتوى يستغل الأطفال أو يعرّضهم للخطر، وسيتم الإبلاغ عنه وحذفه فوراً.'],
      ['كن صادقاً', 'لا تنتحل شخصية أحد ولا تنشر معلومات مضللة تضر الناس أو تحتال عليهم.'],
      ['احترم الخصوصية', 'لا تنشر معلومات خاصة بغيرك (أرقام هواتف، عناوين، صور خاصة) دون إذنه.'],
      ['بلّغ عن المخالفات', 'إن رأيت ما يخالف هذه الإرشادات فاستخدم زر الإبلاغ، وتراجع الإدارة كل بلاغ.']
    ]]
  };
  function terms(body) {
    let k = 'terms';
    const draw = () => {
      const [title, secs] = LEGAL[k];
      body.innerHTML = `<div class="tabs set-pad"><button class="tab ${k === 'terms' ? 'on' : ''}" data-k="terms">الشروط</button><button class="tab ${k === 'privacy' ? 'on' : ''}" data-k="privacy">الخصوصية</button><button class="tab ${k === 'rules' ? 'on' : ''}" data-k="rules">الإرشادات</button></div>
        <div class="legal card"><h2 style="font-size:18px;font-weight:800;margin:0">${title}</h2><div class="upd">آخر تحديث: نوفمبر 2026</div>
        ${secs.map(([h, t]) => `<h3>${h}</h3><p>${t}</p>`).join('')}</div>`;
    };
    draw();
    body.onclick = e => { const t = e.target.closest('[data-k]'); if (t) { k = t.dataset.k; draw(); } };
  }

  /* ================= حذف الحساب ================= */
  async function wipeFiles(uid) {
    const listAll = async (bucket, prefix) => {
      const out = [], { data } = await A.sb.storage.from(bucket).list(prefix, { limit: 1000 });
      for (const it of data || []) {
        const p = `${prefix}/${it.name}`;
        if (it.id) out.push(p); else out.push(...await listAll(bucket, p));
      }
      return out;
    };
    const rm = async (bucket, paths) => { for (let i = 0; i < paths.length; i += 100) await A.sb.storage.from(bucket).remove(paths.slice(i, i + 100)); };
    for (const b of ['avatars', 'covers', 'posts']) {
      try { const f = await listAll(b, uid); if (f.length) await rm(b, f); } catch (e) {}
    }
    try {
      const { data: cs } = await A.sb.rpc('my_conversations');
      for (const c of cs || []) {
        const { data } = await A.sb.storage.from('chat').list(c.conv_id, { limit: 1000, search: uid });
        const mine = (data || []).filter(f => f.name.startsWith(uid + '_')).map(f => `${c.conv_id}/${f.name}`);
        if (mine.length) await rm('chat', mine);
      }
    } catch (e) {}
  }
  function del(body) {
    body.innerHTML = `<div class="warn" style="margin-top:12px"><b>تنبيه: الحذف نهائي ولا يمكن التراجع عنه</b>
        <ul><li>ملفك الشخصي وصورتك وغلافك</li><li>كل منشوراتك وتعليقاتك وإعجاباتك</li><li>رسائلك ومحادثاتك والوسائط التي أرسلتها</li><li>متابعوك ومتابعاتك وكل بياناتك</li></ul></div>
      <div class="card" style="margin-top:12px">
        <div class="field"><label>كلمة المرور</label><input id="d-pw" type="password" autocomplete="current-password"></div>
        <div class="field"><label>للتأكيد اكتب كلمة: حذف</label><input id="d-w" autocomplete="off"></div>
        <button class="btn danger block" id="d-go" disabled>حذف حسابي نهائياً</button></div><div id="d-layer"></div>`;
    const q = s => body.querySelector(s), go = q('#d-go');
    const check = () => { go.disabled = !(q('#d-pw').value && q('#d-w').value.trim() === 'حذف'); };
    q('#d-pw').oninput = check; q('#d-w').oninput = check;
    const busy = m => { q('#d-layer').innerHTML = m ? `<div class="busy"><div class="loader"></div><div>${m}</div></div>` : ''; };
    go.onclick = async () => {
      go.disabled = true; busy('جاري التحقق...');
      const { error: pe } = await A.sb.auth.signInWithPassword({ email: me().email, password: q('#d-pw').value });
      if (pe) { busy(false); check(); return A.toast('كلمة المرور غير صحيحة', 'err'); }
      const uid = me().id;
      busy('جاري حذف ملفاتك...');
      await wipeFiles(uid);
      busy('جاري حذف حسابك...');
      const { error } = await A.sb.rpc('delete_my_account');
      if (error) { busy(false); check(); return A.toast('تعذر حذف الحساب، حاول مرة أخرى', 'err'); }
      await A.sb.auth.signOut({ scope: 'local' });
      A.toast('تم حذف حسابك نهائياً', 'ok');
    };
  }

  /* ================= الربط بالإعدادات ================= */
  const PAGES = {
    help: { title: 'مركز المساعدة', draw: help },
    privacyc: { title: 'مركز الخصوصية', draw: privacyc },
    terms: { title: 'الشروط والسياسات', draw: terms },
    delete: { title: 'حذف الحساب', draw: del, back: 'account' }
  };
  const prev = A.pages.settings.render;
  A.pages.settings.render = function (view, param) {
    const key = (param || '').split('/')[0], pg = PAGES[key];
    if (!pg) {
      prev.call(this, view, param);
      view.querySelectorAll('.sr.soon').forEach(r => {
        if (!ENABLED.has(r.dataset.k)) return;
        r.classList.remove('soon'); r.removeAttribute('data-soon');
        const v = r.querySelector('.sr-v'); if (v) v.remove();
      });
      return;
    }
    view.innerHTML = `<div class="set"><div class="set-head"><button class="icon-btn" id="s-back" aria-label="رجوع">${A.icon('arrow')}</button><h1>${pg.title}</h1></div><div class="set-body" id="s-body"></div></div>`;
    view.querySelector('#s-back').onclick = () => { location.hash = pg.back ? '#/settings/' + pg.back : '#/settings'; };
    pg.draw(view.querySelector('#s-body'), key);
  };
})();