(function () {
  const A = App, P = A.posts;
  Object.assign(A.icons, {
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
    mail: '<path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"/><path d="M22 6l-10 7L2 6"/>',
    ban: '<circle cx="12" cy="12" r="10"/><path d="M4.9 4.9l14.2 14.2"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
    play: '<path d="M6 4l14 8-14 8z" fill="currentColor"/>'
  });

  const stl = document.createElement('style');
  stl.textContent = `
.pg{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;border-radius:12px;overflow:hidden}
.pt{position:relative;display:block;width:100%;aspect-ratio:3/4;background:#000;overflow:hidden;padding:0}
.pt img,.pt video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.pt::after{content:'';position:absolute;left:0;right:0;bottom:0;height:38%;background:linear-gradient(transparent,rgba(0,0,0,.6));pointer-events:none}
.pt-b{position:absolute;top:7px;inset-inline-start:7px;z-index:2;width:16px;height:16px;border-radius:5px;background:#fff;box-shadow:0 0 3px rgba(0,0,0,.5)}
.pt-v{position:absolute;bottom:6px;inset-inline-start:7px;z-index:2;display:flex;align-items:center;gap:3px;color:#fff;font-weight:800;font-size:13px;text-shadow:0 1px 3px rgba(0,0,0,.8)}
.pt-v .ic{width:14px;height:14px}
.pt-tx{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:10px;text-align:center;color:#fff;font-weight:700;font-size:12.5px;line-height:1.5}
.pt-tx span{display:-webkit-box;-webkit-line-clamp:6;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word}
.ig-top{display:flex;align-items:flex-end;gap:14px;padding:0 2px;margin-top:-40px;position:relative;z-index:2}
.ig-av{flex:none;padding:3px;border-radius:50%;background:linear-gradient(135deg,#0E7C66,#14A585 55%,#E5B53D);box-shadow:0 10px 24px -10px rgba(20,165,133,.8)}
.ig-av .avatar{display:block;border:3px solid var(--bg);box-sizing:content-box}
.ig-st{flex:1;display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding-bottom:2px;text-align:center}
.ig-st>*{padding:6px 2px;border-radius:14px;background:none;color:inherit;font:inherit}
.ig-st b{display:block;font-size:19px;font-weight:800;line-height:1.3}
.ig-st span{display:block;font-size:12.5px;color:var(--muted);font-weight:600}
.ig-st button:active{background:var(--chip)}
.ig-nm{display:flex;align-items:center;gap:6px;margin:12px 2px 0;font-size:18px;font-weight:800;line-height:1.4}
.ig-nm .vb{width:18px;height:18px}
.pf-cat{margin:1px 2px 0!important}
.pf-bio{margin:6px 2px 0!important;line-height:1.75}
.pf-pins{display:flex;gap:6px;overflow-x:auto;margin:8px 2px 0;padding-bottom:4px;scrollbar-width:none}.pf-pins::-webkit-scrollbar{display:none}
.pf-pins button{flex:none;display:flex;align-items:center;gap:7px;padding:5px 9px 5px 11px;border-radius:12px;background:var(--chip);border:1px solid var(--line);color:var(--text);text-align:start;max-width:170px}
.pf-pins button:active{background:color-mix(in srgb,var(--primary) 14%,var(--chip))}
.pf-pins span{min-width:0}.pf-pins b{display:block;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.pf-pins small{display:block;font-size:10.5px;color:var(--muted)}
.pf-chips{margin:10px 2px 0!important}
.ig-act{display:flex;gap:8px;margin:14px 2px 18px}
#pf-follow:not(.ghost){background:linear-gradient(135deg,#0E7C66,#14A585);color:#fff;box-shadow:0 10px 22px -10px rgba(20,165,133,.9)}
.pf-dash+.tabs,.ig-act+.tabs{margin-top:0}
.ig-act .btn{flex:1 1 0;min-width:0;box-sizing:border-box;overflow:hidden;padding:10px 6px;font-size:13.5px;font-weight:800;border-radius:14px;display:flex;align-items:center;justify-content:center;gap:6px;white-space:nowrap}
.ig-act .btn .ic{width:18px;height:18px}
.ig-act .btn.sq{flex:none;width:46px;padding:10px 0}
.pf-dash{margin:12px 0 18px!important;width:100%!important;padding:12px 16px!important;border-radius:18px!important}
.pf-dash b{font-size:15px!important}
.pf-dash .ic{width:40px!important;height:40px!important;padding:9px;border-radius:13px;background:rgba(255,255,255,.2)}
.ig-act+.tabs,.pf-dash+.tabs{margin-top:0}
.prof-cover{height:118px!important}`;
  document.head.appendChild(stl);

  const me = () => A.state.user;
  const USEL = 'id,username,display_name,bio,avatar_url,cover_url,is_verified,is_banned,followers_count,following_count,posts_count,category,ai_creator';
  const REASONS = ['محتوى مسيء', 'حساب مزيف أو انتحال', 'إعلان مزعج (سبام)', 'تحرش أو تهديد', 'أخرى'];
  const GR = ['linear-gradient(135deg,#0E7C66,#14A585)', 'linear-gradient(135deg,#1D4ED8,#7C3AED)', 'linear-gradient(135deg,#B45309,#D4A017)', 'linear-gradient(135deg,#9D174D,#E11D48)', 'linear-gradient(135deg,#0F172A,#334155)'];
  const gradient = id => GR[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % GR.length];
  const fmt = n => { n = n || 0; return n >= 1e6 ? (n / 1e6).toFixed(1) + ' م' : n >= 1e3 ? (n / 1e3).toFixed(1) + ' ألف' : String(n); };
  const cut = (t, n) => { t = (t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n) + '…' : t; };
  const host = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; } };
  let cur = null;
  const $ = s => cur.view.querySelector(s);

  const go = u => {
    const n = u.toLowerCase();
    location.hash = A.state.profile && n === A.state.profile.username ? '#/profile' : '#/u/' + encodeURIComponent(n);
  };

  // فتح الملف الشخصي عند الضغط على اسم/صورة/إشارة @
  document.addEventListener('click', e => {
    const m = e.target.closest('.mention');
    let name = null;
    if (m) name = m.textContent.slice(1);
    else {
      const h = e.target.closest('.p-head, .sug');
      if (!h || e.target.closest('button') || h.closest('.cr')) return;
      const t = (h.querySelector('.p-sub, .u') || {}).textContent || '';
      const mm = t.match(/@([a-zA-Z0-9_.]+)/);
      if (mm) name = mm[1];
    }
    if (!name) return;
    document.querySelectorAll('.fx').forEach(x => x.remove());
    go(name);
  });

  function openSheet(html) {
    const fx = document.createElement('div');
    fx.className = 'fx';
    fx.innerHTML = `<div class="sheet-bg"><div class="sheet">${html}</div></div>`;
    document.body.appendChild(fx);
    const close = () => fx.remove();
    fx.firstChild.onclick = e => { if (e.target === fx.firstChild) close(); };
    return { el: fx.querySelector('.sheet'), close };
  }

  async function renderProfile(view, username) {
    view.innerHTML = `<div class="sk" style="height:130px;border-radius:18px"></div>
      <div class="sk" style="width:84px;height:84px;border-radius:50%;margin:-36px 14px 0"></div>
      <div class="sk" style="height:16px;width:50%;margin:14px"></div>`;
    const { data: p, error } = await A.sb.from('profiles').select(USEL).eq('username', (username || '').toLowerCase()).maybeSingle();
    if (error || !p) {
      view.innerHTML = '<div class="empty">الحساب غير موجود<br><button class="btn sm" onclick="history.back()">رجوع</button></div>';
      return;
    }
    const isOwn = p.id === me().id;
    const [bd, fl, bl, lk, ct, pn, fm] = await Promise.all([
      A.sb.from('user_badges').select('badge:badges(key,name_ar,color)').eq('user_id', p.id),
      isOwn ? null : A.sb.from('follows').select('follower_id').eq('follower_id', me().id).eq('following_id', p.id).maybeSingle(),
      isOwn ? null : A.sb.from('user_blocks').select('blocked_id').eq('blocker_id', me().id).eq('blocked_id', p.id).maybeSingle(),
      A.sb.from('profile_links').select('id,title,url').eq('user_id', p.id).order('position').order('created_at'),
      A.sb.from('profile_contacts').select('email,phone,show').eq('user_id', p.id).maybeSingle(),
      A.sb.rpc('profile_pins_of', { uid: p.id }),
      isOwn ? null : A.sb.from('follows').select('status').eq('follower_id', p.id).eq('following_id', me().id).maybeSingle()
    ]);
    cur = { view, p, isOwn, tab: 'posts', list: [], st: null,
      badges: (bd.data || []).map(x => x.badge).filter(Boolean),
      pins: pn.data || [], links: lk.data || [], contact: ct.data && (ct.data.email || ct.data.phone) && (isOwn ? ct.data.show : true) ? ct.data : null,
      following: !!(fl && fl.data), followsMe: !!(fm && fm.data && fm.data.status !== 'pending'), blocked: !!(bl && bl.data) };
    if (!isOwn) A.sb.rpc('record_profile_visit', { p_profile: p.id }).then(() => {});
    draw();
  }

  function draw() {
    const { p, isOwn, badges, following, blocked } = cur;
    const fLabel = () => cur.following ? 'تتابعه ✓' : cur.followsMe ? 'رد المتابعة' : 'متابعة';
    const acts = isOwn
      ? `<button class="btn ghost" id="pf-edit">تعديل الملف</button><button class="btn ghost" id="pf-share">مشاركة الملف</button>`
      : blocked ? '<button class="btn ghost" id="pf-unblock">إلغاء الحظر</button>'
      : `<button class="btn ${following ? 'ghost' : ''}" id="pf-follow" data-fm="${cur.followsMe ? 1 : 0}">${fLabel()}</button><button class="btn ghost" id="pf-msg">${A.icon('mail')}مراسلة</button>`;
    cur.view.innerHTML = `
      <div class="pf-cover"><div class="prof-cover" style="${p.cover_url ? `background-image:url('${A.esc(p.cover_url)}')` : 'background:linear-gradient(135deg,#0B5F4F,#14A585 65%,#E5B53D)'}"></div>
        ${isOwn ? '' : `<button class="icon-btn back" id="pf-back" aria-label="رجوع">${A.icon('arrow')}</button><button class="icon-btn more" id="pf-more" aria-label="المزيد">${A.icon('more')}</button>`}</div>
      <div class="ig-top"><div class="ig-av">${A.avatar(p, 86)}</div>
        <div class="ig-st"><div><b>${fmt(p.posts_count)}</b><span>منشور</span></div>
          <button data-l="followers"><b id="st-fl">${fmt(p.followers_count)}</b><span>متابعين</span></button>
          <button data-l="following"><b>${fmt(p.following_count)}</b><span>أتابعه</span></button></div></div>
      <div class="ig-nm">${A.esc(p.display_name)}${p.is_verified ? A.verified : ''}${A.catBadge(p.category, 20)}${p.is_banned ? '<span class="p-sub">· حساب موقوف</span>' : ''}</div>
      ${p.ai_creator ? '<div class="pf-ai" style="margin-inline:2px">منشئ محتوى بالذكاء الاصطناعي</div>' : ''}
      ${badges.length ? `<div class="badges" style="margin-inline:2px">${badges.map(b => `<span class="bd"><i style="background:${A.esc(b.color)}"></i>${A.esc(b.name_ar)}</span>`).join('')}</div>` : ''}
      ${p.bio ? `<div class="pf-bio">${A.linkify(p.bio)}</div>` : ''}
      ${cur.links.length || cur.contact ? `<div class="pf-chips">${cur.links.length ? `<button id="pf-links">${A.brandIcon(cur.links[0].url)}<span>${A.esc(cur.links[0].title || host(cur.links[0].url))}${cur.links.length > 1 ? '</span><span style="direction:rtl">و ' + (cur.links.length - 1) + ' آخرين' : ''}</span></button>` : ''}${cur.contact ? `<button id="pf-contact">${A.brandIcon(cur.contact.email ? 'a@b.co' : '+9647700000000')}<span style="direction:rtl">خيارات الاتصال</span></button>` : ''}</div>` : ''}
      ${cur.pins.length ? `<div class="pf-pins">${cur.pins.map(x => `<button data-pin="${x.kind === 'channel' ? 'c' : 'g'}/${A.esc(x.route_key)}">${A.avatar({ avatar_url: x.avatar_url, display_name: x.name, username: x.name }, 28)}<span><b>${A.esc(x.name || '')}</b><small>${x.kind === 'channel' ? 'قناة' : 'كروب'} · ${fmt(x.members)} عضو</small></span></button>`).join('')}</div>` : ''}
      <div class="ig-act">${acts}</div>
      ${isOwn ? `<button class="pf-dash" id="pf-dash"><div><b>إحصائيات حسابي</b><small id="pf-dash-v">جاري التحميل...</small></div>${A.icon('chart')}</button>` : ''}
      <div class="tabs"><button class="tab on" data-t="posts">المنشورات</button><button class="tab" data-t="media">الوسائط</button><button class="tab" data-t="reposts">إعادة النشر</button>${isOwn ? '<button class="tab" data-t="saved">المحفوظات</button>' : ''}</div>
      <div id="pf-list"></div>`;

    cur.view.querySelectorAll('.tab').forEach(b => b.onclick = () => {
      cur.tab = b.dataset.t;
      cur.view.querySelectorAll('.tab').forEach(x => x.classList.toggle('on', x === b));
      loadTab();
    });
    cur.view.querySelectorAll('[data-l]').forEach(b => b.onclick = () => showList(b.dataset.l));
    const on = (id, fn) => { const e = $(id); if (e) e.onclick = fn; };
    cur.view.querySelectorAll('[data-pin]').forEach(b => b.onclick = () => { location.hash = '#/' + b.dataset.pin; });
    on('#pf-back', () => history.back());
    on('#pf-edit', () => A.profileEdit(cur.p, async () => { await A.loadProfile(); renderProfile(cur.view, A.state.profile.username); }));
    on('#pf-dash', () => A.profileInsights());
    on('#pf-share', () => A.shareProfile(cur.p.username, openSheet, cur.p));
    on('#pf-links', () => A.profileLinksSheet(cur.links, openSheet));
    on('#pf-contact', () => A.profileContactSheet(cur.contact, openSheet));
    on('#pf-follow', e => toggleFollow(e.currentTarget));
    on('#pf-msg', () => A.startChat(cur.p.id));
    on('#pf-more', openMenu);
    on('#pf-unblock', unblock);
    if (isOwn) A.sb.rpc('profile_insights', { p_days: 30 }).then(r => { const e = $('#pf-dash-v'); if (e) e.textContent = r.data ? `${(r.data.views || 0).toLocaleString('en-US')} مشاهدة خلال آخر 30 يوماً` : 'اضغط لعرض الإحصائيات'; });
    const box = $('#pf-list');
    P.bind(box);
    box.addEventListener('click', e => {
      const t = e.target.closest('[data-pid]');
      if (!t) return;
      const post = cur.list.find(x => x.id === t.dataset.pid);
      if (!post) return;
      if (A.openReel && A.hasVideo(post)) return A.openReel(cur.list, post.id, cur.st);
      const sh = openSheet(P.html(post, cur.st));
      P.bind(sh.el);
    });
    loadTab();
  }

  // مربع في شبكة المنشورات: الصور بعلامة بيضاء صغيرة، الفيديو بدون علامة، وتحته عدد المشاهدات
  function tile(p) {
    const s = p.repost_of && p.original ? p.original : p;
    const m = [...(s.media || [])].sort((a, b) => a.position - b.position);
    const vid = m.find(x => x.type === 'video');
    let inner, badge = '';
    if (vid) inner = `<video src="${A.esc(vid.url)}#t=0.1" muted playsinline preload="metadata"></video>`;
    else if (m.length) { inner = `<img loading="lazy" src="${A.esc(m[0].url)}" alt="">`; badge = '<span class="pt-b"></span>'; }
    else inner = `<div class="pt-tx" style="background:${gradient(s.id)}"><span>${A.esc(cut(s.content, 90))}</span></div>`;
    return `<button class="pt" data-pid="${p.id}">${inner}${badge}<span class="pt-v">${A.icon('play')} ${fmt(s.views_count)}</span></button>`;
  }

  async function loadTab() {
    const box = $('#pf-list'), t = cur.tab;
    box.innerHTML = P.skeleton(2);
    try {
      let list;
      if (t === 'saved') {
        const { data, error } = await A.sb.from('saved_posts').select(`post:posts(${P.SEL},views_count)`).eq('user_id', me().id).order('created_at', { ascending: false }).limit(60);
        if (error) throw error;
        list = (data || []).map(x => x.post).filter(x => x && (!x.repost_of || x.original));
      } else {
        let qy = A.sb.from('posts').select(P.SEL + ',views_count').eq('user_id', cur.p.id).eq('is_draft', false).order('created_at', { ascending: false }).limit(60);
        qy = t === 'reposts' ? qy.not('repost_of', 'is', null) : qy.is('repost_of', null);
        const { data, error } = await qy;
        if (error) throw error;
        list = (data || []).filter(x => (t === 'reposts' ? !!x.original : true));
        if (t === 'media') list = list.filter(x => x.media && x.media.length);
      }
      cur.list = list;
      if (!list.length) {
        const msg = { saved: 'لا توجد منشورات محفوظة', media: 'لا توجد صور أو فيديوهات', reposts: 'لا توجد منشورات معاد نشرها', posts: 'لا توجد منشورات بعد' };
        box.innerHTML = `<div class="empty">${msg[t]}</div>`;
        return;
      }
      cur.st = await P.state(list);
      box.innerHTML = `<div class="pg">${list.map(tile).join('')}</div>`;
    } catch (e) {
      console.error(e);
      box.innerHTML = '<div class="empty">تعذر التحميل<br><button class="btn sm" id="pf-retry">إعادة المحاولة</button></div>';
      $('#pf-retry').onclick = loadTab;
    }
  }

  async function toggleFollow(btn) {
    const on = cur.following;
    btn.disabled = true;
    const r = on ? await A.sb.from('follows').delete().eq('follower_id', me().id).eq('following_id', cur.p.id)
                 : await A.sb.from('follows').insert({ follower_id: me().id, following_id: cur.p.id });
    btn.disabled = false;
    if (r.error) return A.toast('تعذر تنفيذ العملية', 'err');
    cur.following = !on;
    cur.p.followers_count = Math.max(0, cur.p.followers_count + (on ? -1 : 1));
    btn.textContent = cur.following ? 'تتابعه ✓' : cur.followsMe ? 'رد المتابعة' : 'متابعة';
    btn.classList.toggle('ghost', cur.following);
    $('#st-fl').textContent = cur.p.followers_count;
  }

  async function showList(kind) {
    const fol = kind === 'followers';
    const sh = openSheet(`<h3>${fol ? 'المتابعين' : 'أتابعه'}</h3><div class="empty">جاري التحميل...</div>`);
    const { data, error } = await A.sb.from('follows')
      .select(`u:profiles!${fol ? 'follows_follower_id_fkey' : 'follows_following_id_fkey'}(id,username,display_name,avatar_url,is_verified,category)`)
      .eq(fol ? 'following_id' : 'follower_id', cur.p.id).order('created_at', { ascending: false }).limit(60);
    if (error) { sh.close(); return A.toast('تعذر التحميل', 'err'); }
    const rows = (data || []).map(x => x.u).filter(Boolean);
    sh.el.innerHTML = `<h3>${fol ? 'المتابعين' : 'أتابعه'}</h3>` + (rows.length ? rows.map(u =>
      `<button class="urow" data-go="${A.esc(u.username)}">${A.avatar(u, 40)}<div><div class="p-name">${A.esc(u.display_name || u.username)}${u.is_verified ? A.verified : ''}${A.catBadge(u.category, 15)}</div><div class="p-sub">@${A.esc(u.username)}</div></div></button>`).join('') : '<div class="empty">القائمة فارغة</div>');
    sh.el.onclick = e => { const b = e.target.closest('[data-go]'); if (b) { sh.close(); go(b.dataset.go); } };
  }

  function openMenu() {
    const sh = openSheet(`<h3>@${A.esc(cur.p.username)}</h3>
      <button class="opt" id="m-block">${A.icon('ban')}<div>${cur.blocked ? 'إلغاء حظر الحساب' : 'حظر الحساب'}<small>${cur.blocked ? 'سيعود ظهور منشوراته لك' : 'لن ترى منشوراته ولن يراسلك'}</small></div></button>
      <button class="opt" id="m-share">${A.icon('share')}<div>مشاركة الملف الشخصي</div></button>
      <button class="opt" id="m-report">${A.icon('flag')}<div>الإبلاغ عن الحساب<small>تُراجع البلاغات من الإدارة</small></div></button>`);
    sh.el.querySelector('#m-block').onclick = async () => { sh.close(); cur.blocked ? unblock() : block(); };
    sh.el.querySelector('#m-share').onclick = () => { sh.close(); A.shareProfile(cur.p.username, openSheet, cur.p); };
    sh.el.querySelector('#m-report').onclick = () => { sh.close(); report(); };
  }

  async function block() {
    if (!confirm(`حظر @${cur.p.username}؟`)) return;
    const { error } = await A.sb.from('user_blocks').insert({ blocker_id: me().id, blocked_id: cur.p.id });
    if (error) return A.toast('تعذر الحظر', 'err');
    await A.sb.from('follows').delete().eq('follower_id', me().id).eq('following_id', cur.p.id);
    A.toast('تم حظر الحساب', 'ok');
    location.hash = '#/home';
  }
  async function unblock() {
    const { error } = await A.sb.from('user_blocks').delete().eq('blocker_id', me().id).eq('blocked_id', cur.p.id);
    if (error) return A.toast('تعذر إلغاء الحظر', 'err');
    A.toast('تم إلغاء الحظر', 'ok');
    renderProfile(cur.view, cur.p.username);
  }
  function report() {
    const sh = openSheet(`<h3>سبب الإبلاغ</h3>${REASONS.map(r => `<button class="opt" data-r="${A.esc(r)}"><div>${A.esc(r)}</div></button>`).join('')}`);
    sh.el.onclick = async e => {
      const b = e.target.closest('[data-r]');
      if (!b) return;
      sh.close();
      const { error } = await A.sb.from('reports').insert({ reporter_id: me().id, target_type: 'user', target_id: cur.p.id, reason: b.dataset.r });
      A.toast(error ? 'تعذر إرسال البلاغ' : 'تم إرسال البلاغ، شكراً لك', error ? 'err' : 'ok');
    };
  }

  const refresh = () => cur && renderProfile(cur.view, cur.p.username);
  A.pages.profile = { render(v) { renderProfile(v, A.state.profile.username); }, refresh };
  A.pages.u = { render(v, param) { renderProfile(v, param); }, refresh };
})();