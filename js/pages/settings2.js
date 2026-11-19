(function () {
  const A = App;
  const me = () => A.state.user;
  Object.assign(A.icons, {
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    chev: '<path d="M15 18l-6-6 6-6"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/>',
    users: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8"/>',
    uplus: '<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M11 18h2"/>'
  });

  const ENABLED = new Set(['posts', 'notifs', 'security', 'private', 'comments', 'mentions', 'dms']);
  const DEF = { notif_likes: true, notif_comments: true, notif_follows: true, notif_reposts: true, notif_mentions: true, notif_messages: true,
    who_can_comment: 'everyone', who_can_mention: 'everyone', who_can_message: 'everyone' };
  const sw = on => `<span class="sw ${on ? 'on' : ''}"></span>`;
  const empty = t => `<div class="empty">${t}</div>`;
  const sk = n => '<div class="sk" style="height:60px;margin:12px 0 8px"></div>'.repeat(n);

  async function getSettings() {
    const { data } = await A.sb.from('user_settings').select('*').eq('user_id', me().id).maybeSingle();
    return Object.assign({}, DEF, data || {});
  }
  async function saveSettings(patch) {
    const { error } = await A.sb.from('user_settings').upsert({ user_id: me().id, ...patch }, { onConflict: 'user_id' });
    return !error;
  }

  /* ---------- الإشعارات ---------- */
  async function notifs(body) {
    body.innerHTML = sk(2);
    const s = await getSettings();
    const items = [['notif_likes', 'الإعجابات', 'عندما يعجب أحدهم بمنشورك'], ['notif_comments', 'التعليقات والردود', 'عندما يعلّق أحدهم على منشورك أو يرد عليك'],
      ['notif_follows', 'المتابعون الجدد', 'المتابعة الجديدة وطلبات المتابعة'], ['notif_reposts', 'إعادة النشر', 'عندما يعيد أحدهم نشر منشورك'],
      ['notif_mentions', 'الإشارات (@)', 'عندما يشير إليك أحدهم في منشور'], ['notif_messages', 'الرسائل', 'عند وصول رسالة جديدة']];
    body.innerHTML = `<div class="set-sec">أبلغني عند</div><div class="set-card">${items.map(([k, l, d]) =>
      `<button class="sr" data-k="${k}"><span class="sr-l">${l}<span class="sr-s">${d}</span></span>${sw(s[k])}</button>`).join('')}</div>
      <div class="set-note">تُطبَّق هذه الخيارات من السيرفر: لن تصلك إشعارات من الأنواع التي أوقفتها.</div>`;
    body.onclick = async e => {
      const b = e.target.closest('[data-k]');
      if (!b) return;
      const el = b.querySelector('.sw'), v = el.classList.toggle('on');
      if (!(await saveSettings({ [b.dataset.k]: v }))) { el.classList.toggle('on'); A.toast('تعذر الحفظ', 'err'); }
    };
  }

  /* ---------- صلاحيات التعليق / الذكر / الرسائل ---------- */
  const PERM = {
    comments: ['who_can_comment', 'من يستطيع التعليق على منشوراتك؟'],
    mentions: ['who_can_mention', 'من يستطيع الإشارة إليك (@) في منشوراته؟'],
    dms: ['who_can_message', 'من يستطيع مراسلتك؟']
  };
  const OPTS = [['everyone', 'الجميع'], ['following', 'الحسابات التي أتابعها فقط'], ['nobody', 'لا أحد']];
  async function perm(body, key) {
    const [col, head] = PERM[key];
    body.innerHTML = sk(1);
    const s = await getSettings();
    const draw = cur => {
      body.innerHTML = `<div class="set-sec">${head}</div><div class="set-card">${OPTS.map(([k, l]) =>
        `<button class="sr" data-v="${k}"><span class="sr-l">${l}</span>${k === cur ? `<span class="chk">${A.icon('check')}</span>` : ''}</button>`).join('')}</div>
        <div class="set-note">يُطبَّق هذا الخيار من السيرفر على الجميع.</div>`;
    };
    draw(s[col]);
    body.onclick = async e => {
      const r = e.target.closest('[data-v]');
      if (!r) return;
      if (await saveSettings({ [col]: r.dataset.v })) { s[col] = r.dataset.v; draw(r.dataset.v); A.toast('تم الحفظ', 'ok'); }
      else A.toast('تعذر الحفظ', 'err');
    };
  }

  /* ---------- حساب خاص + طلبات المتابعة ---------- */
  async function privatePage(body) {
    const p = A.state.profile || {};
    body.innerHTML = `<div class="set-sec">خصوصية الحساب</div><div class="set-card">
      <button class="sr" id="pv"><span class="sr-i">${A.icon('lock')}</span><span class="sr-l">حساب خاص<span class="sr-s">لا يرى منشوراتك إلا من توافق على متابعته</span></span>${sw(p.is_private)}</button>
      <button class="sr" id="rq"><span class="sr-i">${A.icon('uplus')}</span><span class="sr-l">طلبات المتابعة</span><span class="sr-v" id="rqn"></span><span class="sr-c">${A.icon('chev')}</span></button></div>
      <div class="set-note">عند جعل الحساب عاماً تُقبل طلبات المتابعة المعلّقة تلقائياً. المتابعون الحاليون يبقون كما هم.</div>`;
    A.sb.from('follows').select('follower_id', { count: 'exact', head: true }).eq('following_id', me().id).eq('status', 'pending')
      .then(({ count }) => { const n = body.querySelector('#rqn'); if (n && count) n.textContent = count; });
    body.querySelector('#rq').onclick = () => { location.hash = '#/settings/requests'; };
    body.querySelector('#pv').onclick = async e => {
      const el = e.currentTarget.querySelector('.sw'), v = el.classList.toggle('on');
      const { error } = await A.sb.from('profiles').update({ is_private: v }).eq('id', me().id);
      if (error) { el.classList.toggle('on'); return A.toast('تعذر الحفظ', 'err'); }
      await A.loadProfile();
      A.toast(v ? 'أصبح حسابك خاصاً' : 'أصبح حسابك عاماً', 'ok');
    };
  }

  async function requests(body) {
    body.innerHTML = sk(2);
    const { data, error } = await A.sb.from('follows')
      .select('created_at,u:profiles!follows_follower_id_fkey(id,username,display_name,avatar_url,is_verified)')
      .eq('following_id', me().id).eq('status', 'pending').order('created_at', { ascending: false }).limit(100);
    if (error) { body.innerHTML = empty('تعذر التحميل'); return; }
    const rows = (data || []).filter(x => x.u);
    if (!rows.length) { body.innerHTML = empty('لا توجد طلبات متابعة'); return; }
    body.innerHTML = `<div class="set-sec">${rows.length} طلب</div><div class="set-card" id="rl">${rows.map(({ u }) =>
      `<div class="sr" data-id="${u.id}">${A.avatar(u, 44)}<div class="sr-l"><div class="p-name">${A.esc(u.display_name || u.username)}${u.is_verified ? A.verified : ''}</div>
      <div class="p-sub" style="direction:ltr;text-align:right">@${A.esc(u.username)}</div></div>
      <div class="rq-btns"><button class="btn sm" data-ok="${u.id}">قبول</button><button class="btn ghost sm" data-no="${u.id}">رفض</button></div></div>`).join('')}</div>`;
    const list = body.querySelector('#rl');
    list.onclick = async e => {
      const ok = e.target.closest('[data-ok]'), no = e.target.closest('[data-no]');
      const id = (ok || no || {}).dataset ? (ok ? ok.dataset.ok : no.dataset.no) : null;
      if (!id) return;
      const btns = e.target.closest('.sr').querySelectorAll('button');
      btns.forEach(b => (b.disabled = true));
      const r = ok ? await A.sb.from('follows').update({ status: 'accepted' }).eq('follower_id', id).eq('following_id', me().id)
                   : await A.sb.from('follows').delete().eq('follower_id', id).eq('following_id', me().id);
      if (r.error) { btns.forEach(b => (b.disabled = false)); return A.toast('تعذر تنفيذ العملية', 'err'); }
      e.target.closest('.sr').remove();
      A.toast(ok ? 'تم قبول الطلب' : 'تم رفض الطلب', 'ok');
      if (!list.children.length) body.innerHTML = empty('لا توجد طلبات متابعة');
      A.loadProfile();
    };
  }

  /* ---------- الأمان والجلسات ---------- */
  function device(ua) {
    ua = ua || '';
    const os = /Android/i.test(ua) ? 'Android' : /iPhone|iPad/i.test(ua) ? 'iOS' : /Windows/i.test(ua) ? 'Windows' : /Mac OS/i.test(ua) ? 'macOS' : /Linux/i.test(ua) ? 'Linux' : 'جهاز';
    const br = /Edg/i.test(ua) ? 'Edge' : /SamsungBrowser/i.test(ua) ? 'Samsung Browser' : /Firefox/i.test(ua) ? 'Firefox'
      : /; wv\)/i.test(ua) ? 'متصفح التطبيق' : /Chrome/i.test(ua) ? 'Chrome' : /Safari/i.test(ua) ? 'Safari' : 'متصفح';
    return `${br} · ${os}`;
  }
  async function security(body) {
    body.innerHTML = sk(2);
    const [s, ses] = await Promise.all([A.sb.rpc('my_sessions'), A.sb.auth.getSession()]);
    let cur = null;
    try {
      const t = ses.data.session.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      cur = JSON.parse(atob(t + '='.repeat((4 - (t.length % 4)) % 4))).session_id;
    } catch (e) {}
    if (s.error) { body.innerHTML = empty('تعذر تحميل الجلسات'); return; }
    const list = s.data || [];
    body.innerHTML = `<div class="set-sec">الأجهزة المسجّلة (${list.length})</div><div class="set-card" id="ss">${list.map(x => `
      <div class="sr" data-id="${x.id}"><span class="sr-i">${A.icon('phone')}</span>
        <span class="sr-l">${A.esc(device(x.user_agent))}${x.id === cur ? '<span class="here">هذا الجهاز</span>' : ''}
          <span class="sr-s">آخر نشاط: ${A.timeAgo(x.last_active)}${x.ip ? ' · ' + A.esc(x.ip) : ''}</span></span>
        ${x.id === cur ? '' : `<button class="btn ghost sm" data-end="${x.id}" style="margin:0">إنهاء</button>`}</div>`).join('')}</div>
      <div class="set-sec">إجراءات</div><div class="set-card">
        <button class="sr" id="so-oth"><span class="sr-l">تسجيل الخروج من الأجهزة الأخرى<span class="sr-s">يبقى هذا الجهاز مسجّلاً</span></span></button>
        <button class="sr" id="so-all"><span class="sr-l">تسجيل الخروج من كل الأجهزة</span></button>
        <button class="sr" id="pw"><span class="sr-l">تغيير كلمة المرور</span><span class="sr-c">${A.icon('chev')}</span></button></div>
      <div class="set-note">إنهاء جلسة يمنع تجديد دخول ذلك الجهاز، وقد يبقى نشطاً لدقائق قليلة حتى انتهاء صلاحية جلسته الحالية. إن شككت باختراق حسابك غيّر كلمة المرور فوراً.</div>`;
    body.querySelector('#ss').onclick = async e => {
      const b = e.target.closest('[data-end]');
      if (!b) return;
      b.disabled = true;
      const { error } = await A.sb.rpc('revoke_session', { sid: b.dataset.end });
      if (error) { b.disabled = false; return A.toast('تعذر إنهاء الجلسة', 'err'); }
      b.closest('.sr').remove(); A.toast('تم إنهاء الجلسة', 'ok');
    };
    body.querySelector('#so-oth').onclick = async () => {
      if (!confirm('الخروج من كل الأجهزة الأخرى؟')) return;
      const { error } = await A.sb.auth.signOut({ scope: 'others' });
      if (error) return A.toast('تعذر تنفيذ العملية', 'err');
      A.toast('تم تسجيل الخروج من الأجهزة الأخرى', 'ok'); security(body);
    };
    body.querySelector('#so-all').onclick = async () => {
      if (confirm('سيتم تسجيل خروجك من كل الأجهزة بما فيها هذا الجهاز. متابعة؟')) await A.sb.auth.signOut({ scope: 'global' });
    };
    body.querySelector('#pw').onclick = () => { location.hash = '#/settings/account'; };
  }

  /* ---------- إدارة المنشورات ---------- */
  const VIS = { public: ['عام', 'globe'], followers: ['المتابعون', 'users'], private: ['أنا فقط', 'lock'] };
  const PAGE = 20;
  const pathOf = url => { const i = url.indexOf('/posts/'); return i < 0 ? null : decodeURIComponent(url.slice(i + 7).split('?')[0]); };

  async function posts(body) {
    const S = { tab: 'pub', list: [], more: false };
    body.innerHTML = `<div class="tabs set-pad"><button class="tab on" data-t="pub">المنشورات</button><button class="tab" data-t="draft">المسودات</button></div><div id="mp"></div>`;
    const box = body.querySelector('#mp');

    function row(p) {
      const m = [...(p.media || [])].sort((a, b) => a.position - b.position)[0];
      const th = m ? (m.type === 'video' ? `<video src="${A.esc(m.url)}#t=0.1" muted preload="metadata"></video>` : `<img loading="lazy" src="${A.esc(m.url)}" alt="">`) : A.icon('edit');
      const txt = p.repost_of ? 'إعادة نشر لمنشور' : (p.content || '').replace(/\s+/g, ' ').slice(0, 90) || 'وسائط بدون نص';
      const v = VIS[p.visibility] || VIS.public;
      return `<button class="mp" data-id="${p.id}"><div class="mp-th">${th}</div><div class="mp-b"><div class="mp-t">${A.esc(txt)}</div>
        <div class="mp-m"><span>${A.icon(v[1])} ${v[0]}</span><span>${new Date(p.created_at).toLocaleDateString('ar-IQ')}</span><span>♥ ${p.likes_count}</span><span>💬 ${p.comments_count}</span></div></div>
        <span class="sr-c">${A.icon('chev')}</span></button>`;
    }
    function draw() {
      box.innerHTML = S.list.length ? `<div class="set-card">${S.list.map(row).join('')}</div>` + (S.more ? '<button class="btn ghost block" id="mp-more" style="margin-top:12px">عرض المزيد</button>' : '')
        : empty(S.tab === 'draft' ? 'لا توجد مسودات' : 'لا توجد منشورات بعد');
    }
    async function load(reset) {
      if (reset) { S.list = []; box.innerHTML = sk(3); }
      const from = S.list.length;
      const { data, error } = await A.sb.from('posts')
        .select('id,content,visibility,is_draft,repost_of,likes_count,comments_count,created_at,media:post_media(url,type,position)')
        .eq('user_id', me().id).eq('is_draft', S.tab === 'draft').order('created_at', { ascending: false }).range(from, from + PAGE - 1);
      if (error) { box.innerHTML = empty('تعذر التحميل'); return; }
      S.list = S.list.concat(data); S.more = data.length === PAGE; draw();
    }

    async function remove(p) {
      if (!confirm('حذف هذا المنشور نهائياً؟ لا يمكن التراجع.')) return;
      const paths = (p.media || []).map(m => pathOf(m.url)).filter(Boolean);
      const { error } = await A.sb.from('posts').delete().eq('id', p.id);
      if (error) return A.toast('تعذر الحذف', 'err');
      if (paths.length) A.sb.storage.from('posts').remove(paths);
      S.list = S.list.filter(x => x.id !== p.id); draw(); A.toast('تم الحذف', 'ok'); A.loadProfile();
    }
    function editText(p) {
      const sh = A.sheet(`<h3>تعديل النص</h3><div class="field"><textarea id="ed-t" maxlength="2000" style="min-height:140px">${A.esc(p.content || '')}</textarea></div><button class="btn block" id="ed-s">حفظ</button>`);
      sh.el.querySelector('#ed-s').onclick = async e => {
        const t = sh.el.querySelector('#ed-t').value.trim();
        if (!t && !(p.media || []).length) return A.toast('اكتب نصاً أو أبقِ وسائط في المنشور', 'err');
        e.target.disabled = true;
        const { error } = await A.sb.from('posts').update({ content: t || null }).eq('id', p.id);
        if (error) { e.target.disabled = false; return A.toast('تعذر الحفظ', 'err'); }
        p.content = t || null; sh.close(); draw(); A.toast('تم تعديل المنشور', 'ok');
      };
    }
    function pickVis(p) {
      const sh = A.sheet(`<h3>من يستطيع رؤية المنشور؟</h3>${Object.entries(VIS).map(([k, v]) =>
        `<button class="opt ${p.visibility === k ? 'on' : ''}" data-v="${k}">${A.icon(v[1])}<div>${v[0]}</div></button>`).join('')}`);
      sh.el.onclick = async e => {
        const b = e.target.closest('[data-v]');
        if (!b) return;
        const { error } = await A.sb.from('posts').update({ visibility: b.dataset.v }).eq('id', p.id);
        sh.close();
        if (error) return A.toast('تعذر التغيير', 'err');
        p.visibility = b.dataset.v; draw(); A.toast('تم تغيير الخصوصية', 'ok');
      };
    }
    async function publish(p) {
      const { error } = await A.sb.from('posts').update({ is_draft: false }).eq('id', p.id);
      if (error) return A.toast('تعذر النشر', 'err');
      S.list = S.list.filter(x => x.id !== p.id); draw(); A.toast('تم نشر المسودة', 'ok'); A.loadProfile();
    }
    function options(p) {
      const row = (k, ic, t) => `<button class="opt" data-k="${k}">${A.icon(ic)}<div>${t}</div></button>`;
      let h = '';
      if (p.is_draft) h += row('publish', 'check', 'نشر الآن');
      if (!p.repost_of) h += row('edit', 'edit', 'تعديل النص') + row('vis', 'globe', 'تغيير الخصوصية');
      h += row('del', 'trash', p.repost_of ? 'إلغاء إعادة النشر' : 'حذف');
      const sh = A.sheet(`<h3>خيارات المنشور</h3>${h}`);
      sh.el.onclick = e => {
        const b = e.target.closest('[data-k]');
        if (!b) return;
        sh.close();
        ({ publish, edit: editText, vis: pickVis, del: remove })[b.dataset.k](p);
      };
    }

    body.querySelectorAll('.tab').forEach(t => t.onclick = () => {
      S.tab = t.dataset.t;
      body.querySelectorAll('.tab').forEach(x => x.classList.toggle('on', x === t));
      load(true);
    });
    box.onclick = e => {
      if (e.target.closest('#mp-more')) return load(false);
      const r = e.target.closest('.mp');
      if (r) { const p = S.list.find(x => x.id === r.dataset.id); if (p) options(p); }
    };
    load(true);
  }

  /* ---------- ربط الصفحات الجديدة بالإعدادات ---------- */
  const PAGES = {
    posts: { title: 'إدارة المنشورات', draw: posts },
    notifs: { title: 'الإشعارات', draw: notifs },
    security: { title: 'الأمان والأذونات', draw: security },
    private: { title: 'حساب خاص', draw: privatePage },
    requests: { title: 'طلبات المتابعة', draw: requests, back: 'private' },
    comments: { title: 'تعليقات', draw: (b) => perm(b, 'comments') },
    mentions: { title: 'الذِكر', draw: (b) => perm(b, 'mentions') },
    dms: { title: 'الرسائل الخاصة', draw: (b) => perm(b, 'dms') }
  };

  const base = A.pages.settings.render;
  A.pages.settings.render = function (view, param) {
    const key = (param || '').split('/')[0], pg = PAGES[key];
    if (!pg) {
      base.call(this, view, param);
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