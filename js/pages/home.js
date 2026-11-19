(function () {
  const A = App, P = A.posts;
  const me = () => A.state.user;
  Object.assign(A.icons, {
    grp: '<path d="M9 11a3 3 0 100-6 3 3 0 000 6zM3 20a6 6 0 0112 0M17 11a2.5 2.5 0 100-5M21 19a5 5 0 00-4-4.9"/>',
    fwd: '<path d="M14 9V5l7 7-7 7v-4c-5 0-8 1.5-11 5 1-6 4-10 11-11z"/>',
    link: '<path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1"/><path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>',
    download: '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    heartx: '<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 000-7.8z"/><path d="M4 4l16 16"/>',
    zap: '<path d="M13 2L3 14h8l-1 8 10-12h-8z"/>',
    play: '<path d="M6 4l14 8-14 8z" fill="currentColor"/>',
    send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
    dots: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>'
  });

  const css = `
body[data-page="home"]{overflow:hidden}
body[data-page="home"] main{padding:0;animation:none}
body[data-page="home"] .topbar{position:fixed;top:0;left:0;right:0;max-width:560px;margin:0 auto;z-index:20;background:linear-gradient(rgba(0,0,0,.62),transparent);border:0;backdrop-filter:none;-webkit-backdrop-filter:none}
body[data-page="home"] .topbar .icon-btn{color:#fff}
body[data-page="home"] .topbar .logo{background:none;-webkit-background-clip:border-box;background-clip:border-box;color:#fff}
.tt{position:fixed;top:0;bottom:calc(var(--nav-h) + env(safe-area-inset-bottom));left:0;right:0;max-width:560px;margin:0 auto;background:#000;overflow-y:scroll;scroll-snap-type:y mandatory;overscroll-behavior:contain;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.tt::-webkit-scrollbar{display:none}
.tt-tabs{position:fixed;top:var(--tb,62px);left:0;right:0;max-width:560px;margin:0 auto;display:flex;justify-content:center;gap:20px;padding:6px 10px;z-index:19;pointer-events:none}
.tt-tabs button{pointer-events:auto;color:rgba(255,255,255,.65);font-weight:800;font-size:16.5px;padding:2px 4px;border-bottom:2px solid transparent;text-shadow:0 1px 4px rgba(0,0,0,.8)}
.tt-tabs button.on{color:#fff;border-color:#fff}
.tt .tt-i.post{position:relative;height:100%;scroll-snap-align:start;scroll-snap-stop:always;background:#000;border-radius:0;box-shadow:none;padding:0;margin:0;animation:none;overflow:hidden;color:#fff;contain:layout paint}
.tt-i::after{content:'';position:absolute;left:0;right:0;bottom:0;height:42%;background:linear-gradient(transparent,rgba(0,0,0,.65));pointer-events:none;z-index:1}
.tt-m{position:absolute;inset:0;background:#000}
.tt-ph{position:absolute;inset:0;background:#000}
.tt-pst,.tt-img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;background:transparent}
.tt-v{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;background:transparent;opacity:0;transition:opacity .12s}
.tt-v.rdy{opacity:1}
.tt-sp{position:absolute;inset:0;margin:auto;width:38px;height:38px;opacity:0;transition:opacity .15s;z-index:2;pointer-events:none}
.tt-sp .loader{width:38px;height:38px;border-width:3px}
.tt-i.buf .tt-sp{opacity:1;transition-delay:.8s}
.tt-v::-webkit-media-controls,.tt-v::-webkit-media-controls-panel,.tt-v::-webkit-media-controls-start-playback-button,.tt-v::-webkit-media-controls-overlay-play-button,.tt-v::-webkit-media-controls-enclosure{display:none!important;-webkit-appearance:none;opacity:0}
.tt-pp{position:absolute;inset:0;margin:auto;width:84px;height:84px;display:grid;place-items:center;opacity:0;transition:.2s;color:#fff;pointer-events:none;z-index:2}
.tt-pp .ic{width:70px;height:70px}
.tt-i.paused .tt-pp{opacity:.85}
.tt-car{position:absolute;inset:0;display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}
.tt-car::-webkit-scrollbar{display:none}
.tt-car img{flex:none;width:100%;height:100%;object-fit:contain;scroll-snap-align:center}
.tt-cnt{position:absolute;top:calc(var(--tb,62px) + 46px);left:50%;transform:translateX(-50%);z-index:2;background:rgba(0,0,0,.5);border-radius:12px;padding:2px 12px;font-size:12.5px;font-weight:700}
.tt-txtbg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:100px 22px 130px 84px;text-align:center;font-size:24px;font-weight:800;line-height:1.8;word-break:break-word;white-space:pre-wrap;overflow:hidden}
.tt-rp{position:absolute;top:calc(var(--tb,62px) + 46px);right:12px;z-index:2;background:rgba(0,0,0,.45);padding:3px 12px;border-radius:14px;font-size:12.5px;display:flex;gap:5px;align-items:center}
.tt-rp .ic{width:14px;height:14px}
.tt-act{--ac:var(--primary-2,#E5B53D);--ac2:var(--primary,#14A585);position:absolute;left:8px;bottom:18px;z-index:2;display:flex;flex-direction:column;align-items:center;gap:6px;padding:0}
.tt-av{position:relative;width:46px;height:46px;margin-bottom:12px;cursor:pointer}
.tt-av .avatar{border-radius:50%!important;border:2px solid var(--ac);box-shadow:0 0 0 3px rgba(0,0,0,.3)}

.tt-plus{position:absolute;bottom:-11px;left:50%;transform:translateX(-50%);width:20px;height:20px;padding:0;border-radius:50%;border:2px solid #000;box-sizing:content-box;background:var(--grad,var(--ac));color:var(--on-primary,#fff);display:grid;place-items:center;font-size:15px;font-weight:900;line-height:1;box-shadow:0 2px 6px rgba(0,0,0,.45)}
.tt-b{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;color:#fff;font-weight:700;font-size:11.5px;font-variant-numeric:tabular-nums;text-shadow:0 1px 3px rgba(0,0,0,.7);width:48px;padding:6px 0 4px;border-radius:18px;transition:background .2s}
.tt-b .ic{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:1.9;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6));transition:transform .2s,stroke .2s,fill .2s}
.tt-b:active{background:color-mix(in srgb,var(--ac) 22%,transparent)}
.tt-b:active .ic{transform:scale(.85)}
.tt-b.like.on .ic{fill:var(--ac);stroke:var(--ac);filter:drop-shadow(0 0 6px color-mix(in srgb,var(--ac) 75%,transparent))}
.tt-b.like.on{color:var(--ac)}
.tt-b.save.on .ic{fill:var(--ac2);stroke:var(--ac2);filter:drop-shadow(0 0 6px color-mix(in srgb,var(--ac2) 70%,transparent))}
.tt-b.pop .ic{animation:pop .3s}
.tt-cap{position:absolute;right:12px;left:78px;bottom:14px;z-index:2;text-shadow:0 1px 3px rgba(0,0,0,.8)}
.tt-name{font-weight:800;font-size:16px;display:flex;align-items:center;gap:4px;cursor:pointer}
.tt-txt{margin-top:4px;font-size:15px;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;white-space:pre-wrap;word-break:break-word}
.tt-txt.open{display:block;max-height:38vh;overflow-y:auto}
.tt .tag,.tt .mention{color:#fff;font-weight:800}
.tt-bar{position:absolute;left:0;right:0;bottom:0;height:3px;background:rgba(255,255,255,.25);z-index:3}
.tt-bar i{display:block;height:100%;width:0;background:#fff}
.tt-burst{position:absolute;width:90px;height:90px;margin:-45px 0 0 -45px;color:var(--primary-2,#E5B53D);pointer-events:none;z-index:4;animation:burst .7s ease-out forwards}
.tt-burst .ic{width:90px;height:90px;fill:var(--primary-2,#E5B53D);stroke:var(--primary-2,#E5B53D);filter:drop-shadow(0 0 14px var(--primary-2,#E5B53D))}
@keyframes burst{0%{transform:scale(.3);opacity:1}60%{transform:scale(1.2);opacity:1}100%{transform:scale(1.5) translateY(-30px);opacity:0}}
.tt-load,.tt-empty{height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;color:#fff;text-align:center;padding:20px;line-height:1.9}
.sh-lbl{font-weight:700;margin:4px 2px 8px}
.sh-row{display:flex;gap:14px;overflow-x:auto;padding:4px 2px 14px;scrollbar-width:none}
.sh-row::-webkit-scrollbar{display:none}
.sh-c{flex:none;width:68px;display:flex;flex-direction:column;align-items:center;gap:6px;font-size:12px;font-weight:600;text-align:center}
.sh-c:active{transform:scale(.94)}
.sh-c i{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;color:#fff;font-style:normal;background:var(--chip)}
.sh-c i .ic{width:26px;height:26px}
.sh-c span{max-width:68px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sh-sep{height:1px;background:var(--line);margin:2px 0 12px}`;
  const stl = document.createElement('style');
  stl.textContent = css;
  document.head.appendChild(stl);

  const GR = ['linear-gradient(135deg,#0E7C66,#14A585)', 'linear-gradient(135deg,#1D4ED8,#7C3AED)', 'linear-gradient(135deg,#B45309,#D4A017)', 'linear-gradient(135deg,#9D174D,#E11D48)', 'linear-gradient(135deg,#0F172A,#334155)'];
  const gradient = id => GR[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % GR.length];
  const hidden = { get() { try { return JSON.parse(localStorage.getItem('hidden_posts') || '[]'); } catch (e) { return []; } }, add(id) { try { localStorage.setItem('hidden_posts', JSON.stringify([id, ...this.get()].slice(0, 300))); } catch (e) {} } };
  const cacheGet = t => { try { return JSON.parse(localStorage.getItem('ttc_' + t) || 'null'); } catch (e) { return null; } };
  const cacheSet = (t, l) => { try { localStorage.setItem('ttc_' + t, JSON.stringify(l.slice(0, 12))); } catch (e) {} };

  const NOPOSTER = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  const srcOf = p => (p.repost_of && p.original ? p.original : p);
  const idOf = p => srcOf(p).id;
  const hasVid = p => (srcOf(p).media || []).some(m => m.type === 'video');

  // حالة الصفحة: F = بيانات التغذية، V = مجمع الفيديو (السابق/الحالي/التالي فقط)
  const F = { off: 0, seed: Math.floor(Math.random() * 1e6), rpcFail: false, tab: 'foryou', queue: [], cursor: null, loading: false, done: false, ids: new Set(), map: new Map(), folIds: null, token: 0,
    st: { liked: new Set(), saved: new Set(), reposted: new Set() }, fol: new Set() };
  const V = { els: [], vids: new Map(), cur: -1, obs: null };
  let unlocked = false, justUnlocked = false, lastTap = 0, tapT = null;
  const active = () => unlocked || !!(navigator.userActivation && navigator.userActivation.hasBeenActive);
  const feedEl = () => document.getElementById('tt');

  /* ================= مجمع الفيديو ================= */
  function fit(v) { v.style.objectFit = v.videoHeight && v.videoHeight >= v.videoWidth * 1.15 ? 'cover' : 'contain'; }

  function mount(i, eager) {
    const it = V.els[i];
    if (!it) return null;
    let v = V.vids.get(i);
    if (v) { if (eager && v.preload !== 'auto') v.preload = 'auto'; return v; }
    const m = it.querySelector('.tt-m'), src = m && m.dataset.vsrc;
    if (!src) return null;
    v = document.createElement('video');
    v.className = 'tt-v';
    v.poster = NOPOSTER;
    v.loop = true; v.muted = true; v.playsInline = true; v.controls = false; v.disablePictureInPicture = true;
    v.setAttribute('playsinline', ''); v.setAttribute('webkit-playsinline', ''); v.setAttribute('x5-playsinline', '');
    v.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
    v.preload = eager ? 'auto' : 'metadata';
    v.addEventListener('loadedmetadata', () => fit(v));
    v.addEventListener('loadeddata', () => { fit(v); v.classList.add('rdy'); });
    v.addEventListener('playing', () => { v.classList.add('rdy'); it.classList.remove('buf'); });
    v.addEventListener('waiting', () => { if (V.vids.get(V.cur) === v && !v.paused) it.classList.add('buf'); });
    v.addEventListener('canplay', () => { if (!v.paused) it.classList.remove('buf'); });
    v.addEventListener('error', () => {
      if (v._r) return;
      v._r = 1;
      setTimeout(() => { if (!v.isConnected) return; v.load(); if (V.vids.get(V.cur) === v) playCur(); }, 800);
    });
    v.src = src + '#t=0.001';
    m.insertBefore(v, m.querySelector('.tt-pp'));
    V.vids.set(i, v);
    return v;
  }
  function unmount(i) {
    const v = V.vids.get(i);
    if (!v) return;
    V.vids.delete(i);
    try { v.pause(); } catch (e) {}
    v.removeAttribute('src');
    try { v.load(); } catch (e) {}
    v.remove();
  }
  function teardown() { [...V.vids.keys()].forEach(unmount); V.cur = -1; }

  function playCur() {
    const v = V.vids.get(V.cur), it = V.els[V.cur];
    if (!v || !it || it.classList.contains('paused')) return;
    v.volume = 1; v.muted = !active();
    if (v.readyState < 3) it.classList.add('buf');
    const p = v.play();
    if (p && p.catch) p.catch(() => { v.muted = true; const q = v.play(); if (q && q.catch) q.catch(() => {}); });
  }

  function activate(i) {
    if (i < 0 || i >= V.els.length || i === V.cur) return;
    V.cur = i;
    V.els[i].classList.remove('paused');
    V.vids.forEach((v, k) => { if (k !== i) v.pause(); });
    const keep = new Set([i - 1, i, i + 1]);
    [...V.vids.keys()].forEach(k => { if (!keep.has(k)) unmount(k); });
    const cv = mount(i, true);
    playCur();
    // الفيديو التالي يُحمَّل مسبقاً (preload=auto) فور جاهزية إطار الحالي الأول، ثم السابق
    const warm = () => { if (V.cur !== i) return; mount(i + 1, true); mount(i - 1, false); };
    if (!cv || cv.readyState >= 2) warm(); else cv.addEventListener('loadeddata', warm, { once: true });
    if (i >= V.els.length - 4) more();
  }
  function makeObserver(root) {
    return new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting && e.intersectionRatio >= 0.6) activate(+e.target.dataset.i); });
    }, { root, threshold: [0.6] });
  }
  function reindex() {
    const f = feedEl();
    if (!f) return;
    [...V.vids.keys()].forEach(unmount);
    V.els = [...f.querySelectorAll('.tt-i')];
    V.els.forEach((el, k) => { el.dataset.i = k; });
    V.cur = -1;
    if (V.els.length) activate(Math.max(0, Math.min(V.els.length - 1, Math.round(f.scrollTop / f.clientHeight))));
  }

  // أول لمسة تفتح الصوت لكل الفيديوهات وتبقى مفتوحة
  function unlock() {
    if (unlocked) return;
    unlocked = true;
    const v = V.vids.get(V.cur), it = V.els[V.cur];
    justUnlocked = !!(v && v.muted);
    if (justUnlocked) setTimeout(() => { justUnlocked = false; }, 450);
    V.vids.forEach(x => { x.volume = 1; x.muted = false; });
    if (v && v.paused && it && !it.classList.contains('paused')) v.play().catch(() => {});
  }
  ['click', 'touchend', 'pointerup', 'keydown'].forEach(t => document.addEventListener(t, unlock, { capture: true, passive: true }));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) V.vids.forEach(v => v.pause()); else playCur();
  });
  // عند مغادرة الرئيسية يجب إيقاف الفيديو فوراً (العنصر المحذوف قد يكمل الصوت)
  window.addEventListener('hashchange', () => setTimeout(() => { if (!feedEl()) teardown(); }, 0));

  /* ================= جلب البيانات ================= */
  /* خوارزمية «لك»: ترتيب من الخادم حسب اهتماماتك وتفاعلك وجودة المنشور */
  async function rankedChunk() {
    const N = 30;
    const { data: rk, error: re } = await A.sb.rpc('feed_foryou', { p_limit: N, p_offset: F.off, p_seed: F.seed, p_media: F.tab === 'community' ? 'image' : 'any' });
    if (re) { F.rpcFail = true; console.error(re); return null; }
    if (!rk.length && F.off === 0) return null;
    F.off += N; if (rk.length < N) F.done = true;
    if (!rk.length) return [];
    const ids = rk.map(r => r.post_id);
    const { data, error } = await A.sb.from('posts').select(P.SEL).in('id', ids);
    if (error) throw error;
    const mp = new Map(data.map(p => [p.id, p])), hid = new Set(hidden.get());
    return ids.map(i => mp.get(i)).filter(p => p && (!p.repost_of || p.original) && !hid.has(idOf(p)));
  }
  async function fetchChunk() {
    if (F.tab !== 'following' && !F.rpcFail && !F.legacy) {
      const r = await rankedChunk();
      if (r) return r;
      F.legacy = true;
    }
    let q = A.sb.from('posts').select(P.SEL).eq('is_draft', false).order('created_at', { ascending: false }).limit(40);
    if (F.cursor) q = q.lt('created_at', F.cursor);
    if (F.tab === 'following') {
      if (!F.folIds) {
        const { data: f } = await A.sb.from('follows').select('following_id').eq('follower_id', me().id).eq('status', 'accepted');
        F.folIds = (f || []).map(x => x.following_id);
      }
      if (!F.folIds.length) { F.done = true; return []; }
      q = q.in('user_id', F.folIds);
    }
    const { data, error } = await q;
    if (error) throw error;
    if (data.length < 40) F.done = true;
    if (data.length) F.cursor = data[data.length - 1].created_at;
    const hid = new Set(hidden.get());
    const list = data.filter(p => (!p.repost_of || p.original) && !hid.has(idOf(p)));
    if (F.tab === 'community') return list.filter(p => { const m = srcOf(p).media || []; return m.length && !m.some(x => x.type === 'video'); });
    if (F.tab === 'foryou') list.sort((a, b) => P.score(b) * (hasVid(b) ? 1.3 : 1) - P.score(a) * (hasVid(a) ? 1.3 : 1));
    return list;
  }

  async function applyState(list) {
    const my = F.token;
    try {
      const authors = [...new Set(list.map(p => srcOf(p).author.id))];
      const [st, fl] = await Promise.all([P.state(list), A.sb.from('follows').select('following_id').eq('follower_id', me().id).in('following_id', authors)]);
      if (my !== F.token) return;
      st.liked.forEach(id => F.st.liked.add(id)); st.saved.forEach(id => F.st.saved.add(id)); st.reposted.forEach(id => F.st.reposted.add(id));
      (fl.data || []).forEach(x => F.fol.add(x.following_id));
      const f = feedEl();
      if (!f) return;
      st.liked.forEach(id => f.querySelectorAll(`.tt-i[data-id="${id}"] .like`).forEach(b => b.classList.add('on')));
      st.saved.forEach(id => f.querySelectorAll(`.tt-i[data-id="${id}"] .save`).forEach(b => b.classList.add('on')));
      (fl.data || []).forEach(x => f.querySelectorAll(`.tt-i[data-uid="${x.following_id}"] .tt-plus`).forEach(b => b.remove()));
    } catch (e) { console.error(e); }
  }

  /* ================= الرسم ================= */
  function mediaHTML(s, m, vid) {
    if (vid) return `<div class="tt-ph"></div>${vid.poster_url ? `<img class="tt-pst" src="${A.esc(vid.poster_url)}" alt="" decoding="async">` : ''}<div class="tt-pp">${A.icon('play')}</div><div class="tt-sp"><div class="loader"></div></div>`;
    if (m.length === 1) return `<img class="tt-img" src="${A.esc(m[0].url)}" alt="" decoding="async">`;
    if (m.length > 1) return `<div class="tt-car">${m.map(x => `<img src="${A.esc(x.url)}" alt="" decoding="async">`).join('')}</div><span class="tt-cnt">1/${m.length}</span>`;
    return `<div class="tt-txtbg" style="background:${gradient(s.id)}"><div>${A.linkify(s.content || '')}</div></div>`;
  }
  function item(p, i) {
    const isR = !!(p.repost_of && p.original), s = srcOf(p), u = s.author || {}, id = s.id, mine = u.id === me().id;
    const m = [...(s.media || [])].sort((a, b) => a.position - b.position), vid = m.find(x => x.type === 'video');
    return `<section class="tt-i post" data-vp="1" data-i="${i}" data-id="${id}" data-uid="${A.esc(u.id || '')}">
      <div class="tt-m"${vid ? ` data-vsrc="${A.esc(vid.url)}"` : ''}>${mediaHTML(s, m, vid)}</div>
      ${isR ? `<div class="tt-rp">${A.icon('repeat')} ${A.esc(p.author.display_name || p.author.username)} أعاد النشر</div>` : ''}
      <div class="tt-act">
        <div class="tt-av" data-user="${A.esc(u.username)}">${A.avatar(u, 52)}${!mine && !F.fol.has(u.id) ? '<b class="tt-plus" data-act="follow">+</b>' : ''}</div>
        <button class="tt-b like ${F.st.liked.has(id) ? 'on' : ''}" data-act="like">${A.icon('heart')}<span class="cnt">${s.likes_count}</span></button>
        <button class="tt-b" data-act="comment">${A.icon('comment')}<span>${s.comments_count}</span></button>
        <button class="tt-b save ${F.st.saved.has(id) ? 'on' : ''}" data-act="save">${A.icon('bookmark')}<span>&nbsp;</span></button>
        <button class="tt-b" data-act="share">${A.icon('fwd')}<span>${s.reposts_count || '&nbsp;'}</span></button>
      </div>
      <div class="tt-cap"><div class="tt-name" data-user="${A.esc(u.username)}">${A.esc(u.display_name || u.username)}${u.is_verified ? A.verified : ''}<small style="opacity:.75;font-weight:600">· ${A.timeAgo(s.created_at)}</small></div>
        ${s.content && m.length ? `<div class="tt-txt">${A.linkify(s.content)}</div>` : ''}</div>
      ${vid ? '<div class="tt-bar"><i></i></div>' : ''}</section>`;
  }
  function renderBatch(list) {
    const f = feedEl();
    if (!f) return;
    const fresh = list.filter(p => !F.ids.has(idOf(p)));
    if (!fresh.length) return;
    if (!V.els.length) f.innerHTML = '';
    const start = V.els.length;
    f.insertAdjacentHTML('beforeend', fresh.map((p, k) => { F.ids.add(idOf(p)); F.map.set(idOf(p), p); return item(p, start + k); }).join(''));
    const all = f.querySelectorAll('.tt-i');
    for (let k = start; k < all.length; k++) { V.els.push(all[k]); if (V.obs) V.obs.observe(all[k]); }
    applyState(fresh);
  }
  function resetDom() {
    teardown();
    V.els = []; F.ids = new Set(); F.map = new Map();
    const f = feedEl();
    if (f) f.innerHTML = '';
  }

  async function more() {
    if (F.loading) return;
    if (F.queue.length) {
      renderBatch(F.queue.splice(0, 8));
      if (F.queue.length >= 8 || F.done) return;
    }
    if (F.done) return;
    F.loading = true;
    const my = F.token;
    try {
      const raw = await fetchChunk();
      if (my !== F.token) return;
      F.queue.push(...raw.filter(p => !F.ids.has(idOf(p))));
      if (F.queue.length && V.cur >= V.els.length - 3) renderBatch(F.queue.splice(0, 8));
    } catch (e) { console.error(e); }
    if (my === F.token) F.loading = false;
  }

  async function loadFeed(force) {
    const f = feedEl();
    if (!f) return;
    const my = ++F.token;
    if (V.obs) V.obs.disconnect();
    V.obs = makeObserver(f);
    teardown();
    V.els = []; F.ids = new Set(); F.map = new Map(); F.queue = []; F.cursor = null; F.done = false; F.loading = false; F.folIds = null; F.off = 0; F.legacy = false; F.seed = Math.floor(Math.random() * 1e6);
    const cached = force ? null : cacheGet(F.tab);
    f.innerHTML = '<div class="tt-load"><div class="loader"></div></div>';
    if (cached && cached.length) renderBatch(cached.slice(0, 8));
    let raw;
    try { raw = await fetchChunk(); } catch (e) {
      console.error(e);
      if (my !== F.token) return;
      if (!V.els.length) {
        f.innerHTML = '<div class="tt-empty">تعذر تحميل المنشورات<button class="btn sm" id="retry">إعادة المحاولة</button></div>';
        document.getElementById('retry').onclick = () => loadFeed(true);
      }
      return;
    }
    if (my !== F.token) return;
    const shown = V.els.length > 0;
    if (!raw.length && !shown) {
      f.innerHTML = `<div class="tt-empty">${F.tab === 'following' ? 'تابع بعض الحسابات لتظهر منشوراتهم هنا' : 'لا توجد منشورات بعد، كن أول من ينشر!'}</div>`;
      return;
    }
    if (shown) {
      const same = raw.slice(0, 5).every(p => F.ids.has(idOf(p)));
      if (!same && V.cur <= 0) { resetDom(); renderBatch(raw.slice(0, 8)); F.queue = raw.slice(8); f.scrollTop = 0; }
      else F.queue = raw.filter(p => !F.ids.has(idOf(p)));
    } else { renderBatch(raw.slice(0, 8)); F.queue = raw.slice(8); }
    cacheSet(F.tab, raw);
  }

  /* ================= التفاعلات ================= */
  async function tog(btn, table, id, withCount) {
    const on = btn.classList.toggle('on');
    btn.classList.add('pop'); setTimeout(() => btn.classList.remove('pop'), 300);
    const c = btn.querySelector('.cnt');
    if (withCount && c) c.textContent = Math.max(0, +c.textContent + (on ? 1 : -1));
    const set = table === 'likes' ? F.st.liked : F.st.saved;
    on ? set.add(id) : set.delete(id);
    const k = { user_id: me().id, post_id: id };
    const r = on ? await A.sb.from(table).insert(k) : await A.sb.from(table).delete().match(k);
    if (r.error) {
      btn.classList.toggle('on', !on);
      on ? set.delete(id) : set.add(id);
      if (withCount && c) c.textContent = Math.max(0, +c.textContent + (on ? -1 : 1));
      A.toast('تعذر تنفيذ العملية', 'err');
    }
  }
  async function follow(b, it) {
    const uid = it.dataset.uid;
    b.style.pointerEvents = 'none';
    const { error } = await A.sb.from('follows').insert({ follower_id: me().id, following_id: uid });
    if (error) { b.style.pointerEvents = ''; return A.toast('تعذر المتابعة', 'err'); }
    F.fol.add(uid);
    feedEl().querySelectorAll(`.tt-i[data-uid="${uid}"] .tt-plus`).forEach(x => x.remove());
  }
  function togglePlay(it) {
    const v = it.querySelector('video');
    if (!v) return;
    if (v.paused) { it.classList.remove('paused'); playCur(); } else { v.pause(); it.classList.add('paused'); }
  }
  function doubleLike(it, e) {
    const b = it.querySelector('[data-act="like"]');
    if (b && !b.classList.contains('on')) tog(b, 'likes', it.dataset.id, true);
    const r = it.getBoundingClientRect(), d = document.createElement('div');
    d.className = 'tt-burst';
    d.style.left = (e.clientX - r.left) + 'px'; d.style.top = (e.clientY - r.top) + 'px';
    d.innerHTML = A.icon('heart');
    it.appendChild(d);
    setTimeout(() => d.remove(), 750);
  }
  function mediaTap(it, e) {
    if (justUnlocked) return;
    const now = Date.now();
    if (now - lastTap < 300) { clearTimeout(tapT); lastTap = 0; doubleLike(it, e); return; }
    lastTap = now;
    tapT = setTimeout(() => togglePlay(it), 260);
  }

  /* ================= نافذة المشاركة ================= */
  const extOf = u => (u.split('?')[0].match(/\.([a-z0-9]{2,4})$/i) || [, 'bin'])[1];
  async function download(s) {
    for (const m of (s.media || [])) {
      try {
        const b = await (await fetch(m.url)).blob(), nm = `ane-iraqi-${s.id.slice(0, 6)}.${extOf(m.url)}`;
        if (m.type !== 'video' && /^image\//.test(b.type)) { await A.saveImage(b, nm); continue; }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(b); a.download = nm;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      } catch (e) { window.open(m.url, '_blank'); }
    }
    if (!(s.media || []).every(m => m.type !== 'video')) A.toast('جاري التنزيل', 'ok');
  }
  async function removePost(id, it) {
    if (!confirm('حذف المنشور نهائياً؟ لا يمكن التراجع.')) return;
    const { data: media } = await A.sb.from('post_media').select('url,poster_url').eq('post_id', id);
    const { error } = await A.sb.from('posts').delete().eq('id', id);
    if (error) return A.toast('تعذر حذف المنشور', 'err');
    const pth = u => { if (!u) return null; const i = u.indexOf('/posts/'); return i < 0 ? null : decodeURIComponent(u.slice(i + 7).split('?')[0]); };
    const paths = (media || []).flatMap(m => [pth(m.url), pth(m.poster_url)]).filter(Boolean);
    if (paths.length) A.sb.storage.from('posts').remove(paths);
    it.remove(); if (!it._ext) reindex(); A.toast('تم حذف المنشور', 'ok'); A.loadProfile();
  }
  async function repost(id) {
    if (F.st.reposted.has(id)) return A.toast('أعدت نشر هذا المنشور مسبقاً');
    const { error } = await A.sb.from('posts').insert({ user_id: me().id, repost_of: id, visibility: 'public' });
    if (error) return A.toast('تعذر إعادة النشر', 'err');
    F.st.reposted.add(id);
    A.toast('تمت إعادة النشر', 'ok');
  }
  async function sendTo(uid, url) {
    const { data: cid, error } = await A.sb.rpc('start_conversation', { other: uid });
    if (error || !cid) return A.toast('لا يمكن مراسلة هذا الحساب', 'err');
    return sendConv(cid, url);
  }
  async function sendConv(cid, url) {
    const { error } = await A.sb.from('messages').insert({ conversation_id: cid, sender_id: me().id, content: '🔗 ' + url });
    A.toast(error ? 'تعذر الإرسال (قد تكون المجموعة مقيّدة)' : 'تم إرسال المنشور', error ? 'err' : 'ok');
  }
  const loadImg = u => new Promise((res, rej) => { const im = new Image(); im.crossOrigin = 'anonymous'; im.onload = () => res(im); im.onerror = rej; im.src = u; });
  const cv = n => (getComputedStyle(document.documentElement).getPropertyValue(n) || '').trim();
  /* بطاقة صورة للمنشور */
  async function postCard(s) {
    const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'), p1 = cv('--primary') || '#14A585', p2 = cv('--primary-2') || '#E5B53D';
    const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#0b0f0e'); bg.addColorStop(1, '#16201d');
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    const bar = g.createLinearGradient(0, 0, W, 0); bar.addColorStop(0, p1); bar.addColorStop(1, p2);
    g.fillStyle = bar; g.fillRect(0, 0, W, 14);
    g.direction = 'rtl'; g.textAlign = 'right'; g.textBaseline = 'alphabetic';
    const u = s.author || {}, PAD = 70;
    g.fillStyle = '#fff'; g.font = '800 46px sans-serif'; g.fillText(u.display_name || u.username || '', W - PAD, 120);
    g.fillStyle = 'rgba(255,255,255,.55)'; g.font = '500 32px sans-serif'; g.fillText('@' + (u.username || ''), W - PAD, 168);
    let y = 240;
    const img = (s.media || []).find(m => m.type !== 'video');
    if (img) {
      try {
        const im = await loadImg(img.url), bw = W - PAD * 2, bh = Math.min(700, bw * im.naturalHeight / im.naturalWidth);
        g.save(); g.beginPath(); g.roundRect(PAD, y, bw, bh, 36); g.clip();
        const k = Math.max(bw / im.naturalWidth, bh / im.naturalHeight), dw = im.naturalWidth * k, dh = im.naturalHeight * k;
        g.drawImage(im, PAD + (bw - dw) / 2, y + (bh - dh) / 2, dw, dh); g.restore(); y += bh + 50;
      } catch (e) {}
    }
    const txt = (s.content || '').replace(/\s+\n/g, '\n').trim();
    if (txt) {
      g.fillStyle = '#fff'; const fs = img ? 38 : 54; g.font = `700 ${fs}px sans-serif`;
      const maxW = W - PAD * 2, lines = [];
      txt.split('\n').forEach(par => { let line = ''; par.split(' ').forEach(w => { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }); lines.push(line); });
      const lh = fs * 1.7, maxL = Math.floor((H - 190 - y) / lh);
      lines.slice(0, maxL).forEach((l, i) => g.fillText(i === maxL - 1 && lines.length > maxL ? l + ' …' : l, W - PAD, y + fs + i * lh));
    }
    g.fillStyle = bar; g.fillRect(PAD, H - 130, W - PAD * 2, 3);
    g.textAlign = 'center'; g.direction = 'rtl'; g.font = '800 44px sans-serif'; g.fillStyle = p2; g.fillText('أني عراقي', W / 2, H - 55);
    return new Promise(r => c.toBlob(r, 'image/png'));
  }
  // حفظ الصورة فعلياً بالجهاز (تنزيل مباشر، تظهر بالمعرض/التنزيلات)
  // الحفظ بالمعرض: مشاركة ملف النظام (فيها «حفظ بالمعرض») وإلا معاينة بضغطة مطوّلة للحفظ
  function saveImage(b, name) { return A.saveImage(b, name); }
  A.saveImage = async (b, name) => {
    try {
      const f = new File([b], name, { type: b.type || 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f] }); return; }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    const url = URL.createObjectURL(b);
    const sh = A.sheet(`<h3>حفظ الصورة</h3><img src="${url}" alt="" style="width:100%;border-radius:14px;max-height:52vh;object-fit:contain;-webkit-touch-callout:default;-webkit-user-select:auto;user-select:auto"><div class="p-sub" style="margin:10px 2px 12px;text-align:center;line-height:1.7">اضغط مطوّلاً على الصورة واختر «تنزيل الصورة» لتنحفظ بمعرض الصور</div><button class="btn block" data-dl>تنزيل مباشر</button>`, { tall: true });
    sh.el.addEventListener('click', e => {
      if (!e.target.closest('[data-dl]')) return;
      const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      A.toast('جاري التنزيل', 'ok');
    });
  };
  async function shareCard(s) {
    A.toast('جاري تجهيز الصورة...');
    let b = null;
    try { b = await postCard(s); } catch (e) { console.error(e); }
    if (!b) return A.toast('تعذر إنشاء الصورة', 'err');
    saveImage(b, `ane-iraqi-${s.id.slice(0, 6)}.png`);
  }
  /* ملصق من صورة المنشور */
  async function makeSticker(s) {
    const m = (s.media || []).find(x => x.type !== 'video');
    if (!m) return A.toast('المنشور ما بيه صورة', 'err');
    try {
      const im = await loadImg(m.url), k = Math.min(1, 512 / Math.max(im.naturalWidth, im.naturalHeight)), c = document.createElement('canvas');
      c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      const b = await new Promise(r => c.toBlob(r, 'image/webp', .9));
      if (!b || b.size > 2097152) return A.toast('الصورة كبيرة على ملصق', 'err');
      const path = `${me().id}/${Date.now()}.webp`;
      const up = await A.sb.storage.from('stickers').upload(path, b, { contentType: 'image/webp' });
      if (up.error) return A.toast('تعذر رفع الملصق', 'err');
      const { error } = await A.sb.from('user_stickers').insert({ path });
      A.toast(error ? 'تعذر حفظ الملصق' : 'انضافت الصورة لملصقاتك', error ? 'err' : 'ok');
    } catch (e) { A.toast('تعذر إنشاء الملصق', 'err'); }
  }
  async function blockUser(u) {
    if (!u || !u.id) return;
    if (!confirm(`حظر @${u.username}؟ ما راح تشوف منشوراته وما يكدر يراسلك.`)) return;
    const { error } = await A.sb.from('user_blocks').insert({ blocker_id: me().id, blocked_id: u.id });
    A.toast(error && !/duplicate/i.test(error.message || '') ? 'تعذر الحظر' : 'تم حظر الحساب', error ? 'err' : 'ok');
  }
  function shareSheet(it) {
    const p = F.map.get(it.dataset.id), s = p && srcOf(p);
    if (s) shareSheetFor(s, it);
  }
  async function notInterested(id) {
    hidden.add(id);
    const { error } = await A.sb.from('post_feedback').upsert({ user_id: me().id, post_id: id, kind: 'not_interested' }, { onConflict: 'user_id,post_id' });
    if (error) console.error(error);
  }
  // يُستخدم أيضاً من صفحة الريلز: it = عنصر يدعم remove() فقط
  A.sharePost = (s, it) => shareSheetFor(s, it || { remove() {}, _ext: true });
  async function fillRecipients(sh) {
    const people = [], seen = new Set();
    const add = (id2, name, av) => { if (id2 && !seen.has(id2) && id2 !== me().id && people.length < 24) { seen.add(id2); people.push({ id: id2, display_name: name, avatar_url: av }); } };
    const [cs, gs, fl] = await Promise.all([
      A.sb.rpc('my_conversations'), A.sb.rpc('my_groups'),
      A.sb.from('follows').select('u:profiles!follows_following_id_fkey(id,username,display_name,avatar_url)').eq('follower_id', me().id).eq('status', 'accepted').limit(24)
    ]);
    const groups = (gs.data || []).slice(0, 8);
    (cs.data || []).forEach(x => add(x.other_id, x.other_name || x.other_username, x.other_avatar));
    (fl.data || []).forEach(x => x.u && add(x.u.id, x.u.display_name || x.u.username, x.u.avatar_url));
    const ct = sh.el.querySelector('#sh-ct');
    if (!ct) return;
    const html = groups.map(g => `<button class="sh-c" data-conv="${g.conv_id}">${A.avatar({ display_name: g.name, avatar_url: g.avatar_url }, 56)}<span>${A.esc(g.name || 'مجموعة')}</span></button>`).join('') +
      people.map(u => `<button class="sh-c" data-send="${u.id}">${A.avatar(u, 56)}<span>${A.esc(u.display_name || '')}</span></button>`).join('');
    ct.innerHTML = html || '<div class="p-sub" style="padding:8px">تابع بعض الحسابات أو ابدأ محادثة لتظهر هنا</div>';
  }
  // مشاركة رابط عام (قناة، كروب...) بنفس شاشة مشاركة المنشورات
  async function linkCard(o) {
    const W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d'), p1 = cv('--primary') || '#14A585', p2 = cv('--primary-2') || '#E5B53D';
    const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#0b0f0e'); bg.addColorStop(1, '#16201d');
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    const bar = g.createLinearGradient(0, 0, W, 0); bar.addColorStop(0, p1); bar.addColorStop(1, p2);
    g.fillStyle = bar; g.fillRect(0, 0, W, 14);
    g.direction = 'rtl'; g.textAlign = 'center'; g.textBaseline = 'alphabetic';
    const cx = W / 2, R = 190, cy = 420;
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.clip();
    let ok = false;
    if (o.avatar_url) { try { const im = await loadImg(o.avatar_url), k = Math.max(R * 2 / im.naturalWidth, R * 2 / im.naturalHeight); g.drawImage(im, cx - im.naturalWidth * k / 2, cy - im.naturalHeight * k / 2, im.naturalWidth * k, im.naturalHeight * k); ok = true; } catch (e) {} }
    if (!ok) { g.fillStyle = bar; g.fillRect(cx - R, cy - R, R * 2, R * 2); g.fillStyle = '#fff'; g.font = '800 200px sans-serif'; g.fillText((o.name || '?').trim().charAt(0), cx, cy + 70); }
    g.restore();
    g.lineWidth = 8; g.strokeStyle = p2; g.beginPath(); g.arc(cx, cy, R + 12, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#fff'; g.font = '800 70px sans-serif';
    const nm = (o.name || '').length > 26 ? o.name.slice(0, 25) + '…' : (o.name || '');
    g.fillText(nm, cx, 740);
    g.fillStyle = 'rgba(255,255,255,.6)'; g.font = '500 40px sans-serif'; g.fillText(o.sub || '', cx, 810);
    if (o.desc) {
      g.fillStyle = 'rgba(255,255,255,.85)'; g.font = '500 40px sans-serif';
      const lines = []; let line = '';
      o.desc.replace(/\s+/g, ' ').trim().split(' ').forEach(w => { const t = line ? line + ' ' + w : w; if (g.measureText(t).width > W - 200 && line) { lines.push(line); line = w; } else line = t; });
      lines.push(line);
      lines.slice(0, 4).forEach((l, i) => g.fillText(i === 3 && lines.length > 4 ? l + ' …' : l, cx, 900 + i * 62));
    }
    g.fillStyle = bar; g.fillRect(100, H - 130, W - 200, 3);
    g.fillStyle = p2; g.font = '800 44px sans-serif'; g.fillText('أني عراقي', cx, H - 55);
    return new Promise(r => c.toBlob(r, 'image/png'));
  }
  A.shareLink = function (o) {
    const url = o.url, text = o.text || 'أني عراقي';
    const cb = (k, b, l) => `<button class="sh-c" data-k="${k}"><i style="background:none;box-shadow:none">${A.brandIcon(b, 56)}</i><span>${l}</span></button>`;
    const c = (k, bg, ic, l) => `<button class="sh-c" data-k="${k}"><i style="background:${bg}">${A.icon(ic)}</i><span>${l}</span></button>`;
    const MSG = { bg: 'linear-gradient(135deg,#00B2FF,#006AFF 55%,#A033FF)', gl: 'rgba(0,132,255,.7)', svg: '<path d="M12 3C7 3 3.200 6.700 3.200 11.400c0 2.600 1.200 4.900 3.100 6.400V21l3-1.700c.9.2 1.700.4 2.700.4 5 0 8.800-3.700 8.800-8.300S17 3 12 3z" fill="#fff"/><path d="M6.800 14l3.500-3.700 2.500 2.300 3.800-2.300-3.800 4.100-2.500-2.300z" fill="#0A7CFF"/>' };
    const sh = A.sheet(`<h3>${A.esc(o.title || 'مشاركة')}</h3><div class="sh-lbl">إرسال إلى</div><div class="sh-row" id="sh-ct"><div class="sk" style="height:76px;width:100%"></div></div>
      <div class="sh-sep"></div><div class="sh-row">${c('copy', '#3B82F6', 'link', 'نسخ الرابط')}${cb('wa', A.brand('wa.me'), 'WhatsApp')}${cb('tg', A.brand('t.me'), 'Telegram')}${cb('ms', MSG, 'Messenger')}${c('more', '#6B7280', 'dots', 'المزيد')}</div>
      <div class="sh-row">${c('card', 'var(--grad)', 'image', 'حفظ كصورة')}${c('txt', 'var(--chip)', 'copy', 'نسخ النص')}</div>`);
    sh.el.onclick = async e => {
      const to = e.target.closest('[data-send]'), gr = e.target.closest('[data-conv]');
      if (to) { sh.close(); const { data: cid, error } = await A.sb.rpc('start_conversation', { other: to.dataset.send }); if (error || !cid) return A.toast('لا يمكن مراسلة هذا الحساب', 'err'); return sendConvMsg(cid, url); }
      if (gr) { sh.close(); return sendConvMsg(gr.dataset.conv, url); }
      const b = e.target.closest('[data-k]'); if (!b) return;
      const k = b.dataset.k; sh.close();
      if (k === 'copy') navigator.clipboard.writeText(url).then(() => A.toast('تم نسخ الرابط', 'ok'), () => A.toast('تعذر النسخ', 'err'));
      else if (k === 'wa') window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url), '_blank');
      else if (k === 'tg') window.open('https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text), '_blank');
      else if (k === 'ms') location.href = 'fb-messenger://share/?link=' + encodeURIComponent(url);
      else if (k === 'more') moreShare(url, text);
      else if (k === 'txt') navigator.clipboard.writeText(text + '\n' + url).then(() => A.toast('تم نسخ النص', 'ok'), () => A.toast('تعذر النسخ', 'err'));
      else if (k === 'card') {
        A.toast('جاري تجهيز الصورة...');
        let bl = null;
        try { bl = await linkCard(o); } catch (er) { console.error(er); }
        if (!bl) return A.toast('تعذر إنشاء الصورة', 'err');
        saveImage(bl, 'ane-iraqi-' + Date.now().toString(36) + '.png');
      }
    };
    fillRecipients(sh);
  };
  async function sendConvMsg(cid, url) {
    const { error } = await A.sb.from('messages').insert({ conversation_id: cid, sender_id: me().id, content: '🔗 ' + url });
    A.toast(error ? 'تعذر الإرسال (قد تكون المجموعة مقيّدة)' : 'تم الإرسال', error ? 'err' : 'ok');
  }
  // اختيارات مشاركة إضافية
  function moreShare(url, text) {
    const eu = encodeURIComponent(url), et = encodeURIComponent(text), both = encodeURIComponent(text + ' ' + url);
    const VB = { bg: 'linear-gradient(135deg,#9A7BFF,#6B4FE0)', gl: 'rgba(115,96,242,.7)', svg: '<path d="M12 3.5c-4.4 0-7.5 2.2-7.5 6.7 0 2.700 1 4.500 2.700 5.600V20l3-2.400c.6.1 1.200.1 1.800.1 4.400 0 7.500-2.500 7.500-6.800S16.400 3.500 12 3.500z" fill="none" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/><path d="M9.300 8.300c-.4.3-.5.8-.3 1.300.8 2 2.200 3.200 4.200 4 .5.2 1-.1 1.300-.5l.2-.4c.1-.3 0-.5-.2-.6l-1-.6c-.2-.1-.5 0-.6.200l-.2.300c-1-.4-1.700-1.100-2.100-2.100l.3-.2c.2-.1.300-.4.200-.6l-.5-1c-.1-.2-.4-.3-.6-.2z" fill="#fff"/>' };
    const SM = { bg: 'linear-gradient(135deg,#3FE07C,#1C9E4B)', gl: 'rgba(52,199,89,.7)', svg: '<path d="M4 6.500A2.500 2.500 0 016.500 4h11A2.500 2.500 0 0120 6.500v8a2.500 2.500 0 01-2.500 2.500H11l-4.500 3.500V17A2.500 2.500 0 014 14.500z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M8 9h8M8 12.200h5" stroke="#fff" stroke-width="1.800" stroke-linecap="round"/>' };
    const L = [
      ['فيسبوك', A.brand('facebook.com'), 'https://www.facebook.com/sharer/sharer.php?u=' + eu],
      ['X (تويتر)', A.brand('x.com'), 'https://twitter.com/intent/tweet?text=' + et + '&url=' + eu],
      ['سناب شات', A.brand('snapchat.com'), 'https://www.snapchat.com/scan?attachmentUrl=' + eu],
      ['فايبر', VB, 'viber://forward?text=' + both],
      ['لينكدإن', A.brand('linkedin.com'), 'https://www.linkedin.com/sharing/share-offsite/?url=' + eu],
      ['ريديت', A.brand('reddit.com'), 'https://www.reddit.com/submit?url=' + eu + '&title=' + et],
      ['بريد إلكتروني', A.brand('a@b.co'), 'mailto:?subject=' + et + '&body=' + both],
      ['رسالة SMS', SM, 'sms:?&body=' + both]
    ];
    const sh = A.sheet(`<h3>المزيد من الخيارات</h3><div class="sh-row" style="flex-wrap:wrap;row-gap:14px">${L.map((x, i) => `<button class="sh-c" data-i="${i}"><i style="background:none;box-shadow:none">${A.brandIcon(x[1], 56)}</i><span>${x[0]}</span></button>`).join('')}
      ${navigator.share ? '<button class="sh-c" data-i="sys"><i style="background:var(--grad)">' + A.icon('send') + '</i><span>تطبيقات أخرى</span></button>' : ''}
      <button class="sh-c" data-i="copy"><i style="background:#3B82F6">${A.icon('link')}</i><span>نسخ الرابط</span></button></div>`);
    sh.el.onclick = e => {
      const b = e.target.closest('[data-i]'); if (!b) return;
      const i = b.dataset.i; sh.close();
      if (i === 'sys') navigator.share({ title: 'أني عراقي', text, url }).catch(() => {});
      else if (i === 'copy') navigator.clipboard.writeText(url).then(() => A.toast('تم نسخ الرابط', 'ok'), () => A.toast('تعذر النسخ', 'err'));
      else { const u = L[+i][2]; if (/^https?:/.test(u)) window.open(u, '_blank'); else location.href = u; }
    };
  }
  async function shareSheetFor(s, it) {
    const id = s.id;
    const au = s.author || {}, mine = au.id === me().id, hasMedia = (s.media || []).length > 0, hasImg = (s.media || []).some(m => m.type !== 'video');
    const url = location.href.split('#')[0] + '#/post/' + id, text = 'شاهد هذا المنشور على أني عراقي';
    const c = (k, bg, ic, l) => `<button class="sh-c" data-k="${k}"><i style="background:${bg}">${A.icon(ic)}</i><span>${l}</span></button>`;
    const cb = (k, b, l) => `<button class="sh-c" data-k="${k}"><i style="background:none;box-shadow:none">${A.brandIcon(b, 56)}</i><span>${l}</span></button>`;
    const MSG = { bg: 'linear-gradient(135deg,#00B2FF,#006AFF 55%,#A033FF)', gl: 'rgba(0,132,255,.7)', svg: '<path d="M12 3C7 3 3.200 6.700 3.200 11.400c0 2.600 1.200 4.900 3.100 6.400V21l3-1.700c.9.2 1.700.4 2.700.4 5 0 8.800-3.700 8.800-8.300S17 3 12 3z" fill="#fff"/><path d="M6.800 14l3.500-3.700 2.500 2.300 3.800-2.300-3.800 4.100-2.500-2.300z" fill="#0A7CFF"/>' };
    const apps = (mine ? '' : c('repost', '#FFC107', 'repeat', 'إعادة النشر')) + c('copy', '#3B82F6', 'link', 'نسخ الرابط') +
      cb('wa', A.brand('wa.me'), 'WhatsApp') + cb('tg', A.brand('t.me'), 'Telegram') + cb('ms', MSG, 'Messenger') + c('more', '#6B7280', 'dots', 'المزيد');
    const acts = c('card', 'var(--grad)', 'image', 'حفظ كصورة') + (hasMedia ? c('dl', 'var(--chip)', 'download', 'تنزيل') : '') +
      (hasImg ? c('stk', 'var(--chip)', 'smile', 'إنشاء ملصق') : '') + (s.content ? c('txt', 'var(--chip)', 'copy', 'نسخ النص') : '') +
      c('grp', 'var(--chip)', 'grp', 'إنشاء مجموعة') + (mine ? '' : c('user', 'var(--chip)', 'user', 'الحساب')) +
      (mine ? c('del', '#E5484D', 'trash', 'حذف') : c('hide', 'var(--chip)', 'heartx', 'غير مهتم') + c('blk', 'var(--chip)', 'blk', 'حظر') + c('rep', 'var(--chip)', 'flag', 'إبلاغ'));
    const sh = A.sheet(`<h3>مشاركة</h3><div class="sh-lbl">إرسال إلى</div><div class="sh-row" id="sh-ct"><div class="sk" style="height:76px;width:100%"></div></div>
      <div class="sh-sep"></div><div class="sh-row">${apps}</div><div class="sh-row">${acts}</div>`);
    sh.el.onclick = e => {
      const to = e.target.closest('[data-send]'), gr = e.target.closest('[data-conv]');
      if (to) { sh.close(); return sendTo(to.dataset.send, url); }
      if (gr) { sh.close(); return sendConv(gr.dataset.conv, url); }
      const b = e.target.closest('[data-k]');
      if (!b) return;
      const k = b.dataset.k;
      sh.close();
      if (k === 'repost') repost(id);
      else if (k === 'copy') navigator.clipboard.writeText(url).then(() => A.toast('تم نسخ الرابط', 'ok'), () => A.toast('تعذر النسخ', 'err'));
      else if (k === 'wa') window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + url), '_blank');
      else if (k === 'tg') window.open('https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text), '_blank');
      else if (k === 'ms') location.href = 'fb-messenger://share/?link=' + encodeURIComponent(url);
      else if (k === 'more') moreShare(url, text);
      else if (k === 'card') shareCard(s);
      else if (k === 'stk') makeSticker(s);
      else if (k === 'txt') navigator.clipboard.writeText(s.content).then(() => A.toast('تم نسخ النص', 'ok'), () => A.toast('تعذر النسخ', 'err'));
      else if (k === 'grp') A.createGroup ? A.createGroup() : A.toast('غير متاح', 'err');
      else if (k === 'user') location.hash = '#/u/' + encodeURIComponent(au.username);
      else if (k === 'blk') blockUser(au);
      else if (k === 'dl') download(s);
      else if (k === 'del') removePost(id, it);
      else if (k === 'hide') { notInterested(id); it.remove(); if (!it._ext) reindex(); A.toast('تم إخفاء المنشور وسنقلّل مثله', 'ok'); }
      else if (k === 'rep') A.report('post', id);
    };
    fillRecipients(sh);
  }

  /* ================= الصفحة ================= */
  A.pages.home = {
    render(view) {
      view.innerHTML = `<div class="tt-tabs"><button data-t="foryou">لك</button><button data-t="following">أتابع</button><button data-t="community">مجتمع</button></div><div class="tt" id="tt"></div>`;
      const tb = document.querySelector('.topbar');
      view.style.setProperty('--tb', (tb ? tb.offsetHeight : 62) + 'px');
      const sync = () => view.querySelectorAll('.tt-tabs button').forEach(b => b.classList.toggle('on', b.dataset.t === F.tab));
      sync();
      view.querySelectorAll('.tt-tabs button').forEach(b => b.onclick = () => { if (F.tab === b.dataset.t) return; F.tab = b.dataset.t; sync(); loadFeed(); });
      const feed = feedEl();
      feed.addEventListener('click', e => {
        const it = e.target.closest('.tt-i');
        if (!it) return;
        const a = e.target.closest('[data-act]');
        if (a) {
          const k = a.dataset.act, id = it.dataset.id;
          if (k === 'like') return tog(a, 'likes', id, true);
          if (k === 'save') return tog(a, 'saved_posts', id, false);
          if (k === 'comment') return A.comments && A.comments.open(id);
          if (k === 'share') return shareSheet(it);
          if (k === 'follow') return follow(a, it);
        }
        const u = e.target.closest('[data-user]');
        if (u) { const n = u.dataset.user; location.hash = A.state.profile && n === A.state.profile.username ? '#/profile' : '#/u/' + encodeURIComponent(n); return; }
        const tx = e.target.closest('.tt-txt');
        if (tx && !e.target.closest('.tag,.mention')) { tx.classList.toggle('open'); return; }
        if (e.target.closest('.tt-m')) mediaTap(it, e);
      });
      feed.addEventListener('timeupdate', e => {
        const v = e.target;
        if (v.tagName !== 'VIDEO' || !v.duration) return;
        const bar = v.closest('.tt-i').querySelector('.tt-bar i');
        if (bar) bar.style.width = (v.currentTime / v.duration * 100) + '%';
      }, true);
      feed.addEventListener('load', e => {
        const t = e.target;
        if (t.tagName === 'IMG' && (t.classList.contains('tt-pst') || t.classList.contains('tt-img'))) t.style.objectFit = t.naturalHeight >= t.naturalWidth * 1.15 ? 'cover' : 'contain';
      }, true);
      feed.addEventListener('scroll', e => {
        const c = e.target;
        if (!c.classList || !c.classList.contains('tt-car')) return;
        const n = Math.round(Math.abs(c.scrollLeft) / c.clientWidth) + 1;
        const lb = c.parentNode.querySelector('.tt-cnt');
        if (lb) lb.textContent = `${n}/${c.children.length}`;
      }, true);
      loadFeed();
    },
    refresh() { return loadFeed(true); }
  };
})();