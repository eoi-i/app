(function () {
  const A = App, P = A.posts;
  const me = () => A.state.user;
  Object.assign(A.icons, {
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
    hash: '<path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    play: '<path d="M6 4l14 8-14 8z" fill="currentColor"/>',
    layers: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2h3"/>'
  });

  const USEL = 'id,username,display_name,avatar_url,is_verified,category,followers_count';
  const hasVid = p => (p.media || []).some(m => m.type === 'video');
  const store = {
    get() { try { return JSON.parse(localStorage.getItem('recent_q') || '[]'); } catch (e) { return []; } },
    set(a) { try { localStorage.setItem('recent_q', JSON.stringify(a.slice(0, 8))); } catch (e) {} }
  };
  const remember = s => {
    s = (s || '').trim();
    if (s.length < 2) return;
    store.set([s, ...store.get().filter(x => x !== s)]);
  };
  const sk = n => '<div class="sk" style="height:60px;margin-bottom:8px"></div>'.repeat(n);

  /* ---------- شبكة المنشورات (مثل إنستغرام) ---------- */
  const GR = ['linear-gradient(135deg,#0E7C66,#14A585)', 'linear-gradient(135deg,#1D4ED8,#7C3AED)', 'linear-gradient(135deg,#B45309,#D4A017)', 'linear-gradient(135deg,#9D174D,#E11D48)', 'linear-gradient(135deg,#0F172A,#334155)'];
  const gradient = id => GR[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % GR.length];
  const fmt = n => n >= 1e6 ? (n / 1e6).toFixed(1) + ' م' : n >= 1e3 ? (n / 1e3).toFixed(1) + ' ألف' : String(n);
  const cut = (t, n) => { t = (t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n) + '…' : t; };

  function tile(p, i, total) {
    const m = [...(p.media || [])].sort((a, b) => a.position - b.position)[0];
    const big = total >= 6 && i % 9 === 1 ? ' big' : '';
    let inner, badge = '';
    if (m) {
      inner = m.type === 'video' ? `<video src="${A.esc(m.url)}#t=0.1" muted playsinline preload="metadata"></video>` : `<img loading="lazy" src="${A.esc(m.url)}" alt="">`;
      badge = m.type === 'video' ? A.icon('play') : p.media.length > 1 ? A.icon('layers') : '';
    } else inner = `<div class="xtx" style="background:${gradient(p.id)}"><span>${A.esc(cut(p.content, 120))}</span></div>`;
    return `<button class="xt${big}" data-pid="${p.id}">${inner}${badge ? `<span class="xb">${badge}</span>` : ''}${p.likes_count ? `<span class="xn">${A.icon('heart')}${fmt(p.likes_count)}</span>` : ''}</button>`;
  }
  const grid = list => `<div class="xg">${list.map((p, i) => tile(p, i, list.length)).join('')}</div>`;
  const openPost = (post, st, list) => { if (A.openReel && A.hasVideo(post)) return A.openReel(list || [post], post.id, st); const sh = A.sheet(P.html(post, st)); P.bind(sh.el); };

  // الضغط على #هاشتاغ داخل أي منشور يفتح صفحته
  document.addEventListener('click', e => {
    const t = e.target.closest('.tag');
    if (!t || t.closest('.cr')) return;
    document.querySelectorAll('.fx').forEach(x => x.remove());
    location.hash = '#/tag/' + encodeURIComponent(t.textContent.replace(/^#/, '').toLowerCase());
  });

  async function onFollow(btn) {
    const id = btn.dataset.follow, on = btn.dataset.on === '1';
    btn.disabled = true;
    const r = on ? await A.sb.from('follows').delete().eq('follower_id', me().id).eq('following_id', id)
                 : await A.sb.from('follows').insert({ follower_id: me().id, following_id: id });
    btn.disabled = false;
    if (r.error) return A.toast('تعذر تنفيذ العملية', 'err');
    btn.dataset.on = on ? '0' : '1';
    btn.textContent = on ? 'متابعة' : 'تتابعه ✓';
    btn.classList.toggle('ghost', !on);
  }

  const WHY = { follows_me: 'يتابعك', mutual: 'يتابعه أشخاص تتابعهم', interest: 'يشبه اهتماماتك', category: 'من مجال تتابعه', active: 'نشط مؤخراً', popular: 'حساب رائج' };
  const sugCard = (u, follow) => `<div class="sug mini">${A.avatar(u, 44)}
    <div class="n">${A.esc(u.display_name || u.username)}${u.is_verified ? A.verified : ''}</div>
    <div class="u">@${A.esc(u.username)}</div>
    ${u.reason ? `<div class="u" style="font-size:11px;opacity:.8">${WHY[u.reason] || ''}</div>` : ''}
    ${follow ? `<button class="btn sm" data-follow="${u.id}">متابعة</button>` : ''}</div>`;

  /* ============ صفحة الاستكشاف ============ */
  A.pages.explore = {
    render(view) {
      const S = { cat: 'all', q: '', tab: 'accounts', term: '', seq: 0, fseq: 0, xseq: 0, badges: [], bu: {}, list: [], st: null, t: null };
      view.innerHTML = `<div class="ex-search">${A.icon('search')}<input id="ex-q" placeholder="ابحث عن حسابات أو منشورات أو #هاشتاغ" autocomplete="off" enterkeyhint="search"><button id="ex-x" hidden aria-label="مسح">${A.icon('x')}</button></div><div id="ex-body"></div>`;
      const q = s => view.querySelector(s), body = q('#ex-body'), inp = q('#ex-q');
      P.bind(view);

      function drawRecent() {
        const rc = store.get(), el = q('#ex-recent');
        if (!el) return;
        el.innerHTML = rc.length ? `<div class="sec-row"><div class="sec-title">عمليات بحث سابقة</div><button data-clr>مسح</button></div>
          <div class="rc">${rc.map(x => `<button data-rq="${A.esc(x)}">${A.esc(x)}</button>`).join('')}</div>` : '';
      }
      function drawCats() {
        const el = q('#ex-cats');
        if (!el) return;
        el.innerHTML = ''; el.style.display = 'none'; return;
        const cats = [['all', 'الكل'], ['image', 'صور'], ['video', 'فيديو'], ['text', 'نصوص'], ...S.badges.map(b => ['b:' + b.id, b.name_ar])];
        el.innerHTML = cats.map(([k, l]) => `<button class="cat ${S.cat === k ? 'on' : ''}" data-cat="${k}">${A.esc(l)}</button>`).join('');
      }
      async function badgeUsers(cat) {
        if (S.bu[cat]) return S.bu[cat];
        const { data } = await A.sb.from('user_badges').select('user_id').eq('badge_id', cat.slice(2)).limit(100);
        return (S.bu[cat] = (data || []).map(x => x.user_id));
      }
      async function loadExtra() {
        const box = q('#ex-extra'), my = ++S.xseq;
        if (!box) return;
        if (S.cat === 'all') {
          const t = await A.sb.rpc('trending_hashtags', { lim: 10 });
          if (my !== S.xseq || !box.isConnected) return;
          let h = '';
          if (t.data && t.data.length) h += `<div class="sec-title sec-ic">${A.icon('hash')} الهاشتاغات الرائجة</div><div class="tgs">${t.data.map(x =>
            `<button class="tg" data-tag="${A.esc(x.tag)}"><b>#${A.esc(x.tag)}</b><small>${x.posts} منشور</small></button>`).join('')}</div>`;
          box.innerHTML = h;
        } else if (S.cat.startsWith('b:')) {
          const ids = await badgeUsers(S.cat);
          if (!ids.length) { box.innerHTML = ''; return; }
          const { data } = await A.sb.from('profiles').select(USEL).in('id', ids).eq('is_banned', false).order('followers_count', { ascending: false }).limit(12);
          if (my !== S.xseq || !box.isConnected) return;
          box.innerHTML = data && data.length ? `<div class="sec-title sm">حسابات التصنيف</div><div class="strip">${data.map(u => sugCard(u, false)).join('')}</div>` : '';
        } else box.innerHTML = '';
      }
      async function loadFeed() {
        const box = q('#ex-feed'), my = ++S.fseq;
        if (!box) return;
        box.innerHTML = sk(3);
        try {
          let list;
          const base = () => A.sb.from('posts').select(P.SEL).eq('is_draft', false).eq('visibility', 'public').is('repost_of', null);
          if (S.cat.startsWith('b:')) {
            const ids = await badgeUsers(S.cat);
            if (!ids.length) { box.innerHTML = '<div class="empty">لا توجد حسابات في هذا التصنيف بعد.<br>تُضاف الشارات من لوحة الإدارة.</div>'; return; }
            const r = await base().in('user_id', ids).order('created_at', { ascending: false }).limit(60);
            if (r.error) throw r.error;
            list = r.data;
          } else {
            const media = { image: 'image', video: 'video', text: 'text' }[S.cat] || 'any';
            let ids = null;
            const tr = await A.sb.rpc('trending_posts', { p_hours: 24 * 14, p_limit: 60, p_media: media });
            if (!tr.error && tr.data && tr.data.length) ids = tr.data.map(x => x.post_id);
            if (ids) {
              const r0 = await A.sb.from('posts').select(P.SEL).in('id', ids);
              if (r0.error) throw r0.error;
              const mp = new Map(r0.data.map(p => [p.id, p]));
              list = ids.map(i => mp.get(i)).filter(Boolean);
              S.ranked = true;
            } else {
              const top = () => base().order('likes_count', { ascending: false }).order('comments_count', { ascending: false }).limit(90);
              let r = await top().gte('created_at', new Date(Date.now() - 14 * 864e5).toISOString());
              if (r.error) throw r.error;
              if (r.data.length < 5) { r = await top(); if (r.error) throw r.error; }
              list = r.data; S.ranked = false;
            }
          }
          if (S.cat === 'image') list = list.filter(p => p.media.length && !hasVid(p));
          else if (S.cat === 'video') list = list.filter(hasVid);
          else if (S.cat === 'text') list = list.filter(p => !p.media.length);
          if (!S.ranked) list.sort((a, b) => P.score(b) - P.score(a));
          list = list.slice(0, 60);
          const st = await P.state(list);
          if (my !== S.fseq || !box.isConnected) return;
          S.list = list; S.st = st;
          box.innerHTML = list.length ? grid(list) : '<div class="empty">لا توجد منشورات في هذا التصنيف بعد</div>';
        } catch (e) {
          console.error(e);
          box.innerHTML = '<div class="empty">تعذر التحميل<br><button class="btn sm" id="ex-retry">إعادة المحاولة</button></div>';
          q('#ex-retry').onclick = loadFeed;
        }
      }
      function home() {
        body.innerHTML = '<div id="ex-recent"></div><div class="ex-cats" id="ex-cats"></div><div id="ex-extra"></div><div id="ex-feed"></div>';
        drawRecent(); drawCats(); loadExtra(); loadFeed();
        if (!S.badges.length) {
          A.sb.from('badges').select('id,key,name_ar').neq('key', 'verified').order('name_ar').then(({ data }) => {
            if (data && data.length) { S.badges = data; drawCats(); }
          });
        }
      }

      async function doTab() {
        const my = ++S.seq, term = S.term, box = q('#ex-res');
        if (!box) return;
        view.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab === S.tab));
        if (!term) { box.innerHTML = '<div class="empty">اكتب كلمة للبحث</div>'; return; }
        box.innerHTML = sk(4);
        const esc = term.replace(/[\\%_]/g, '\\$&');
        try {
          let h = '';
          if (S.tab === 'accounts') {
            let rows;
            const rk = await A.sb.rpc('search_accounts_ranked', { term, lim: 30 });
            if (!rk.error) rows = (rk.data || []).filter(u => u.id !== me().id);
            else {
              const [a, b] = await Promise.all([
                A.sb.from('profiles').select(USEL).ilike('username', esc + '%').eq('is_banned', false).limit(15),
                A.sb.from('profiles').select(USEL).ilike('display_name', '%' + esc + '%').eq('is_banned', false).limit(15)
              ]);
              if (a.error || b.error) throw a.error || b.error;
              const seen = new Set();
              rows = [...a.data, ...b.data].filter(u => u.id !== me().id && !seen.has(u.id) && seen.add(u.id)).sort((x, y) => y.followers_count - x.followers_count);
            }
            if (my !== S.seq) return;
            h = rows.length ? rows.map(u => `<button class="urow" data-u="${A.esc(u.username)}">${A.avatar(u, 46)}<div>
              <div class="p-name">${A.esc(u.display_name || u.username)}${u.is_verified ? A.verified : ''}${A.catBadge(u.category, 15)}</div>
              <div class="p-sub" style="direction:ltr;text-align:right">@${A.esc(u.username)} · ${u.followers_count} متابِع</div></div></button>`).join('')
              : '<div class="empty">لا توجد حسابات مطابقة</div>';
          } else if (S.tab === 'posts') {
            let r;
            const rk = await A.sb.rpc('search_posts_ranked', { term, lim: 60 });
            if (!rk.error && rk.data && rk.data.length) {
              const ids = rk.data.map(x => x.post_id), q2 = await A.sb.from('posts').select(P.SEL).in('id', ids);
              if (q2.error) throw q2.error;
              const mp = new Map(q2.data.map(p => [p.id, p]));
              r = { data: ids.map(i => mp.get(i)).filter(Boolean) };
            } else {
              r = await A.sb.from('posts').select(P.SEL).ilike('content', '%' + esc + '%').eq('is_draft', false)
                .eq('visibility', 'public').is('repost_of', null).order('created_at', { ascending: false }).limit(60);
              if (r.error) throw r.error;
            }
            if (my !== S.seq) return;
            const st = await P.state(r.data);
            S.list = r.data; S.st = st;
            h = r.data.length ? grid(r.data) : '<div class="empty">لا توجد منشورات مطابقة</div>';
          } else {
            const r = await A.sb.rpc('search_hashtags', { term: esc.toLowerCase(), lim: 20 });
            if (r.error) throw r.error;
            h = r.data.length ? r.data.map(t => `<button class="hrow" data-tag="${A.esc(t.tag)}"><div class="hi">${A.icon('hash')}</div>
              <div><div class="p-name">#${A.esc(t.tag)}</div><div class="p-sub">${t.posts} منشور</div></div></button>`).join('')
              : '<div class="empty">لا توجد هاشتاغات مطابقة</div>';
          }
          if (my === S.seq && box.isConnected) box.innerHTML = h;
        } catch (e) {
          console.error(e);
          if (my === S.seq) box.innerHTML = '<div class="empty">تعذر البحث، تحقق من الاتصال</div>';
        }
      }
      function runSearch() {
        const raw = S.q.trim();
        let term = raw;
        if (raw[0] === '#') { S.tab = 'tags'; term = raw.slice(1); }
        else if (raw[0] === '@') { S.tab = 'accounts'; term = raw.slice(1); }
        S.term = term.trim();
        if (!q('#ex-res')) {
          body.innerHTML = `<div class="tabs"><button class="tab" data-tab="accounts">حسابات</button><button class="tab" data-tab="posts">منشورات</button><button class="tab" data-tab="tags">هاشتاغ</button></div><div id="ex-res"></div>`;
        }
        doTab();
      }
      function onInput() {
        S.q = inp.value;
        q('#ex-x').hidden = !S.q;
        clearTimeout(S.t);
        if (!S.q.trim()) { S.seq++; home(); return; }
        S.t = setTimeout(runSearch, 320);
      }

      inp.oninput = onInput;
      inp.onkeydown = e => { if (e.key === 'Enter') { remember(S.q); inp.blur(); } };
      q('#ex-x').onclick = () => { inp.value = ''; onInput(); inp.focus(); };

      view.addEventListener('click', e => {
        const f = e.target.closest('[data-follow]');
        if (f) return onFollow(f);
        const c = e.target.closest('[data-cat]');
        if (c) { S.cat = c.dataset.cat; drawCats(); loadExtra(); loadFeed(); return; }
        const g = e.target.closest('[data-tag]');
        if (g) { remember('#' + g.dataset.tag); location.hash = '#/tag/' + encodeURIComponent(g.dataset.tag); return; }
        const u = e.target.closest('[data-u]');
        if (u) { remember(S.q); location.hash = '#/u/' + encodeURIComponent(u.dataset.u); return; }
        const r = e.target.closest('[data-rq]');
        if (r) { inp.value = r.dataset.rq; onInput(); return; }
        if (e.target.closest('[data-clr]')) { store.set([]); drawRecent(); return; }
        const t = e.target.closest('[data-tab]');
        if (t) { S.tab = t.dataset.tab; doTab(); return; }
        const m = e.target.closest('.xt[data-pid]');
        if (m) { const post = S.list.find(x => x.id === m.dataset.pid); if (post) openPost(post, S.st, S.list); }
      });
      home();
    },
    refresh() { const v = document.getElementById('view'); if (v) A.pages.explore.render(v); }
  };

  /* ============ صفحة الهاشتاغ ============ */
  A.pages.tag = {
    async render(view, tag) {
      tag = (tag || '').toLowerCase();
      let mode = 'new', list = [], st = null;
      view.innerHTML = `<div class="ch-top"><button class="icon-btn" id="tg-back" aria-label="رجوع">${A.icon('arrow')}</button>
        <div><div class="tag-title">#${A.esc(tag)}</div><div class="p-sub" id="tg-n"></div></div></div>
        <div class="tabs"><button class="tab on" data-m="new">الأحدث</button><button class="tab" data-m="top">الأبرز</button></div><div id="tg-list">${sk(3)}</div>`;
      const q = s => view.querySelector(s);
      q('#tg-back').onclick = () => { history.length > 1 ? history.back() : (location.hash = '#/explore'); };
      let shown = [];
      const draw = () => {
        shown = [...list].sort(mode === 'top' ? (a, b) => P.score(b) - P.score(a) : (a, b) => new Date(b.created_at) - new Date(a.created_at));
        q('#tg-list').innerHTML = grid(shown);
      };
      view.querySelectorAll('.tab').forEach(b => b.onclick = () => {
        mode = b.dataset.m;
        view.querySelectorAll('.tab').forEach(x => x.classList.toggle('on', x === b));
        draw();
      });
      view.addEventListener('click', e => {
        const m = e.target.closest('.xt[data-pid]');
        if (m) { const post = shown.find(x => x.id === m.dataset.pid); if (post) openPost(post, st, shown); }
      });
      try {
        const ids = await A.sb.rpc('tag_post_ids', { t: tag, lim: 60 });
        if (ids.error) throw ids.error;
        if (!ids.data.length) { q('#tg-list').innerHTML = '<div class="empty">لا توجد منشورات بهذا الهاشتاغ بعد</div>'; q('#tg-n').textContent = '0 منشور'; return; }
        const r = await A.sb.from('posts').select(P.SEL).in('id', ids.data);
        if (r.error) throw r.error;
        list = r.data;
        st = await P.state(list);
        q('#tg-n').textContent = `${list.length}${ids.data.length >= 60 ? '+' : ''} منشور`;
        draw();
      } catch (e) {
        console.error(e);
        q('#tg-list').innerHTML = '<div class="empty">تعذر التحميل</div>';
      }
    }
  };
})();