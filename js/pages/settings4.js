(function () {
  const A = App, P = A.posts;
  const me = () => A.state.user;
  Object.assign(A.icons, {
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    check: '<path d="M20 6L9 17l-5-5"/>'
  });
  const ENABLED = new Set(['followlist', 'liked']);
  const OPTS = [['everyone', 'الجميع'], ['followers', 'متابعيّ'], ['me', 'أنا فقط']];
  const DEF = { who_see_following: 'everyone', who_see_likes: 'me' };
  const sk = n => '<div class="sk" style="height:60px;margin:12px 0 8px"></div>'.repeat(n);

  async function getSettings() {
    const { data } = await A.sb.from('user_settings').select('who_see_following,who_see_likes').eq('user_id', me().id).maybeSingle();
    return Object.assign({}, DEF, data || {});
  }
  async function saveSettings(patch) {
    const { error } = await A.sb.from('user_settings').upsert({ user_id: me().id, ...patch }, { onConflict: 'user_id' });
    return !error;
  }

  // بطاقة الخصوصية (تُرسم في أعلى الصفحة)
  function privacyCard(box, col, head, cur, note) {
    const draw = v => {
      box.innerHTML = `<div class="set-sec">${head}</div><div class="set-card">${OPTS.map(([k, l]) =>
        `<button class="sr" data-v="${k}"><span class="sr-l">${l}</span>${k === v ? `<span class="chk">${A.icon('check')}</span>` : ''}</button>`).join('')}</div>
        <div class="set-note">${note}</div>`;
    };
    draw(cur);
    box.onclick = async e => {
      const r = e.target.closest('[data-v]');
      if (!r) return;
      if (await saveSettings({ [col]: r.dataset.v })) { draw(r.dataset.v); A.toast('تم الحفظ', 'ok'); }
      else A.toast('تعذر الحفظ', 'err');
    };
  }

  /* ---------- قائمة المتابعة ---------- */
  async function followlist(body) {
    body.innerHTML = sk(2);
    const s = await getSettings();
    body.innerHTML = '<div id="pv"></div><div id="fl"></div>';
    privacyCard(body.querySelector('#pv'), 'who_see_following', 'من يستطيع رؤية قائمة من تتابعهم؟', s.who_see_following,
      'يُطبَّق من السيرفر. ملاحظة: إخفاء قائمتك يخفي ظهورك أيضاً في قوائم المتابعين عند الآخرين، أما الأعداد فتبقى ظاهرة.');
    const box = body.querySelector('#fl');
    box.innerHTML = sk(1);
    const { data, error } = await A.sb.from('follows')
      .select('u:profiles!follows_following_id_fkey(id,username,display_name,avatar_url,is_verified)')
      .eq('follower_id', me().id).eq('status', 'accepted').order('created_at', { ascending: false }).limit(100);
    if (error) { box.innerHTML = '<div class="empty">تعذر تحميل القائمة</div>'; return; }
    const rows = (data || []).map(x => x.u).filter(Boolean);
    const draw = () => {
      box.innerHTML = `<div class="set-sec">الحسابات التي تتابعها (${rows.length})</div>` + (rows.length ? `<div class="set-card" id="fl-l">${rows.map(u =>
        `<div class="sr" data-id="${u.id}" data-u="${A.esc(u.username)}">${A.avatar(u, 42)}<div class="sr-l"><div class="p-name">${A.esc(u.display_name || u.username)}${u.is_verified ? A.verified : ''}</div>
        <div class="p-sub" style="direction:ltr;text-align:right">@${A.esc(u.username)}</div></div><button class="btn ghost sm" data-un="${u.id}" style="margin:0">إلغاء المتابعة</button></div>`).join('')}</div>`
        : '<div class="empty">لا تتابع أحداً بعد</div>');
    };
    draw();
    box.onclick = async e => {
      const b = e.target.closest('[data-un]');
      if (b) {
        b.disabled = true;
        const { error: er } = await A.sb.from('follows').delete().eq('follower_id', me().id).eq('following_id', b.dataset.un);
        if (er) { b.disabled = false; return A.toast('تعذر إلغاء المتابعة', 'err'); }
        rows.splice(rows.findIndex(x => x.id === b.dataset.un), 1); draw(); A.loadProfile();
        return A.toast('تم إلغاء المتابعة', 'ok');
      }
      const r = e.target.closest('[data-u]');
      if (r) location.hash = '#/u/' + encodeURIComponent(r.dataset.u);
    };
  }

  /* ---------- المنشورات التي أعجبتك ---------- */
  async function liked(body) {
    body.innerHTML = sk(2);
    const s = await getSettings();
    body.innerHTML = '<div id="pv"></div><div class="set-sec">منشوراتك المعجب بها</div><div id="ll"></div>';
    privacyCard(body.querySelector('#pv'), 'who_see_likes', 'من يستطيع رؤية المنشورات التي أعجبتك؟', s.who_see_likes,
      'يُطبَّق من السيرفر. أنت تراها دائماً، والاختيار يحدد من يستطيع رؤيتها غيرك.');
    const box = body.querySelector('#ll');
    box.innerHTML = P.skeleton(1);
    const { data, error } = await A.sb.from('likes').select(`created_at,post:posts(${P.SEL})`)
      .eq('user_id', me().id).order('created_at', { ascending: false }).limit(30);
    if (error) { box.innerHTML = '<div class="empty">تعذر تحميل المنشورات</div>'; return; }
    const list = (data || []).map(x => x.post).filter(p => p && (!p.repost_of || p.original));
    if (!list.length) { box.innerHTML = '<div class="empty">لم تعجب بأي منشور بعد</div>'; return; }
    const st = await P.state(list);
    box.innerHTML = list.map(p => P.html(p, st)).join('');
    P.bind(box);
  }

  const PAGES = {
    followlist: { title: 'قائمة المتابعة', draw: followlist },
    liked: { title: 'المنشورات التي أعجبتك', draw: liked }
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
    view.querySelector('#s-back').onclick = () => { location.hash = '#/settings'; };
    pg.draw(view.querySelector('#s-body'), key);
  };
})();