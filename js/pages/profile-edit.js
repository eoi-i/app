(function () {
  const A = App;
  const me = () => A.state.user;
  Object.assign(A.icons, {
    chev: '<path d="M15 5l-7 7 7 7"/>',
    link: '<path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1"/><path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>',
    phone: '<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>'
  });

  const stl = document.createElement('style');
  stl.textContent = `
.pe{z-index:70}
.pe-row{display:flex;align-items:center;gap:10px;width:100%;padding:15px 4px;text-align:start;border-bottom:1px solid var(--line);font-weight:700;font-size:15.5px}
.pe-row span{flex:1}
.pe-row em{font-style:normal;color:var(--muted);font-weight:600;font-size:14px;max-width:45%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pe-row .ic{width:18px;height:18px;color:var(--muted)}
.pe-row small{display:block;color:var(--muted);font-weight:500;font-size:12.5px;margin-top:2px;line-height:1.5}
.pe-sec{font-weight:800;margin:18px 2px 4px}
.pe-sw{position:relative;width:46px;height:27px;flex:none}
.pe-sw input{position:absolute;inset:0;opacity:0;width:100%;height:100%;margin:0;cursor:pointer;z-index:2}
.pe-sw i{position:absolute;inset:0;border-radius:20px;background:var(--line);transition:.2s}
.pe-sw i::after{content:'';position:absolute;top:3px;inset-inline-start:3px;width:21px;height:21px;border-radius:50%;background:#fff;transition:.2s}
.pe-sw input:checked+i{background:var(--primary-2)}
.pe-sw input:checked+i::after{inset-inline-start:22px}
.pe-li{display:flex;align-items:center;gap:10px;padding:10px 4px;border-bottom:1px solid var(--line)}
.pe-li div{flex:1;min-width:0}
.pe-li b{display:block}
.pe-li .pn-av{flex:none;width:40px;height:40px;display:block}.pe-li .pn-av *{flex:none;min-width:0}
.pe-li small{display:block;color:var(--muted);direction:ltr;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pe-chips{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 16px}
.pe-chips button{padding:8px 14px;border-radius:20px;background:var(--chip);font-weight:700;font-size:14px}
.pe-chips button.on{background:var(--primary-2);color:#fff}
.pe-hint{color:var(--muted);font-size:13px;line-height:1.7;margin:6px 2px 12px}
.pf-cat{margin:2px 14px 0;color:var(--muted);font-size:14px}
.pf-ai{display:inline-flex;align-items:center;gap:5px;margin:8px 14px 0;padding:3px 12px;border-radius:12px;background:var(--chip);font-size:12.5px;font-weight:700}
.pf-chips{display:flex;flex-wrap:wrap;gap:8px;margin:10px 14px 0}
.pf-chips button{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:20px;background:var(--chip);font-weight:700;font-size:13.5px;max-width:100%}
.pf-chips .ic{width:16px;height:16px}
.pf-chips span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;direction:ltr}
.bi{flex:none;display:grid;place-items:center;width:var(--s,46px);height:var(--s,46px);border-radius:calc(var(--s,46px)*.3);background:var(--bg);color:#fff;box-shadow:0 8px 18px -8px var(--gl,rgba(0,0,0,.5)),inset 0 1px 0 rgba(255,255,255,.25);position:relative;overflow:hidden}
.bi::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.28),transparent 55%);pointer-events:none}
.bi svg{width:56%;height:56%;position:relative;z-index:1}
.lk-h{display:flex;align-items:center;gap:10px;margin:0 0 4px}
.lk-h h3{margin:0!important;flex:1}
.lk-n{padding:3px 11px;border-radius:12px;background:var(--chip);font-size:12.5px;font-weight:800;color:var(--muted)}
.lk-sub{color:var(--muted);font-size:12.5px;margin:0 2px 14px}
.lk-card{display:flex;align-items:center;gap:13px;padding:12px;margin-bottom:10px;border-radius:20px;background:var(--card);border:1px solid var(--line);box-shadow:var(--shadow);text-decoration:none;color:inherit;opacity:0;transform:translateY(12px);animation:lkIn .45s cubic-bezier(.2,.9,.3,1) forwards;animation-delay:calc(var(--i,0)*70ms);transition:transform .15s,border-color .2s}
.lk-card:active{transform:scale(.98);border-color:var(--primary-2)}
@keyframes lkIn{to{opacity:1;transform:none}}
.lk-card .mid{flex:1;min-width:0}
.lk-card b{display:block;font-size:15.5px;font-weight:800;line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lk-card small{display:block;color:var(--muted);font-size:12.5px;direction:ltr;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:1px}
.lk-card .go{width:34px;height:34px;border-radius:12px;display:grid;place-items:center;background:var(--chip);color:var(--muted);flex:none}
.lk-card .go .ic{width:17px;height:17px}
.lk-pv{display:flex;align-items:center;gap:10px;margin:-4px 0 12px;padding:8px 10px;border-radius:14px;background:var(--chip);font-size:13.5px;font-weight:700;min-height:44px}
.lk-pv em{font-style:normal;color:var(--muted);font-weight:600;font-size:12.5px}
.pe-li .bi{--s:42px}
.pf-chips button .bi{--s:24px;margin-inline-end:-2px;box-shadow:none}
@media (prefers-reduced-motion:reduce){.lk-card{animation-duration:.01ms}}`;
  document.head.appendChild(stl);

  /* ===== شعارات المواقع والتطبيقات تلقائياً من الرابط ===== */
  const G = (bg, gl, svg, name) => ({ bg, gl, svg, name });
  const BR = {
    telegram: G('linear-gradient(135deg,#2AABEE,#1E88C7)', 'rgba(42,171,238,.7)', '<path d="M21.5 3.5L2.8 10.7c-.9.4-.9 1.1-.2 1.3l4.8 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3-14.3c.3-1.2-.4-1.8-1.4-1.4zM8.6 13.3l9.7-6.1c.5-.3.9-.1.6.2l-8 7.2-.3 3.3z" fill="#fff"/>', 'تيليغرام'),
    whatsapp: G('linear-gradient(135deg,#34E27A,#128C7E)', 'rgba(37,211,102,.7)', '<path d="M3 21l1.6-4.8A9 9 0 118 19.4z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.3-2-1-.9.8c-1-.4-2-1.4-2.4-2.4l.8-.9-1-2z" fill="#fff"/>', 'واتساب'),
    instagram: G('linear-gradient(45deg,#F9A433,#E1306C 50%,#7F3FBF)', 'rgba(225,48,108,.7)', '<rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="#fff" stroke-width="2"/><circle cx="17" cy="7" r="1.2" fill="#fff"/>', 'إنستغرام'),
    facebook: G('linear-gradient(135deg,#2D88FF,#1259C3)', 'rgba(24,119,242,.7)', '<path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.4 1.5-1.4h1.6V4.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.1H7.8v3h2.6V21z" fill="#fff"/>', 'فيسبوك'),
    x: G('linear-gradient(135deg,#2B2B2B,#000)', 'rgba(0,0,0,.6)', '<path d="M5 4.5l14 15M19 4.5l-14 15" stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none"/>', 'إكس'),
    youtube: G('linear-gradient(135deg,#FF3B30,#C4160B)', 'rgba(255,0,0,.6)', '<rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="#fff"/><path d="M10 9l5 3-5 3z" fill="#E02B20"/>', 'يوتيوب'),
    tiktok: G('linear-gradient(135deg,#25F4EE -40%,#111 40%,#FE2C55 140%)', 'rgba(254,44,85,.55)', '<path d="M14 3v10.2a3.2 3.2 0 11-3.2-3.2" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M14 3c.4 2.4 2 4 4.5 4.2" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>', 'تيك توك'),
    snapchat: G('linear-gradient(135deg,#FFFC00,#F5D800)', 'rgba(255,252,0,.55)', '<path d="M12 3c-2.8 0-4.5 2-4.5 4.7v2.2c-.8.2-1.8.4-1.8.9s.9.8 1.7 1c-.5 1.5-1.6 2.4-2.7 2.7.5.8 1.8.9 2.7 1.1.4.8.8 1.5 1.6 1.5.8 0 1.3-.7 3-.7s2.2.7 3 .7c.8 0 1.2-.7 1.6-1.5.9-.2 2.2-.3 2.7-1.1-1.1-.3-2.2-1.2-2.7-2.7.8-.2 1.7-.5 1.7-1s-1-.7-1.8-.9V7.7C16.5 5 14.8 3 12 3z" fill="#fff" stroke="#111" stroke-width="1.3" stroke-linejoin="round"/>', 'سناب شات'),
    discord: G('linear-gradient(135deg,#7289FF,#4752C4)', 'rgba(88,101,242,.7)', '<path d="M7 6.5c1.5-.7 3-1 5-1s3.5.3 5 1c1.5 2.5 2.3 5.2 2.5 8.5-1.2 1-2.5 1.7-4 2.1l-.9-1.6c.5-.2 1-.4 1.4-.7-.3-.2-.6-.4-.9-.5-2.2 1-4.6 1-6.8 0-.3.1-.6.3-.9.5.4.3.9.5 1.4.7L7.2 17c-1.5-.4-2.8-1.1-4-2.1C3.300 11.700 4.100 9 5.500 6.500z" fill="#fff"/><circle cx="9.3" cy="12" r="1.2" fill="#5865F2"/><circle cx="14.7" cy="12" r="1.2" fill="#5865F2"/>', 'ديسكورد'),
    github: G('linear-gradient(135deg,#3B4048,#14171B)', 'rgba(0,0,0,.6)', '<path d="M12 2.5a9.5 9.5 0 00-3 18.5c.5.1.7-.2.7-.5v-1.7c-2.7.6-3.3-1.2-3.3-1.2-.4-1.100-1.100-1.400-1.100-1.400-.9-.6.1-.6.1-.6 1 .1 1.500 1 1.500 1 .9 1.500 2.300 1.100 2.900.8.1-.7.4-1.100.6-1.300-2.200-.3-4.500-1.100-4.500-4.900 0-1.100.4-2 1-2.600-.1-.3-.4-1.300.1-2.600 0 0 .8-.3 2.700 1a9.200 9.200 0 015 0c1.900-1.300 2.700-1 2.700-1 .5 1.300.2 2.300.1 2.600.6.7 1 1.600 1 2.600 0 3.800-2.300 4.600-4.500 4.900.4.3.7.9.7 1.800v2.700c0 .3.2.6.7.5A9.500 9.500 0 0012 2.500z" fill="#fff"/>', 'جيت هب'),
    linkedin: G('linear-gradient(135deg,#2F8AD8,#0A66C2)', 'rgba(10,102,194,.7)', '<text x="12" y="17.2" text-anchor="middle" font-size="13.5" font-weight="800" font-family="Arial,sans-serif" fill="#fff">in</text>', 'لينكدإن'),
    twitch: G('linear-gradient(135deg,#A970FF,#6B2FD6)', 'rgba(145,70,255,.7)', '<path d="M4 3h17v11l-5 5h-4l-3 3v-3H4z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><path d="M12 7.5v4M16 7.500v4" stroke="#fff" stroke-width="2" stroke-linecap="round"/>', 'تويتش'),
    spotify: G('linear-gradient(135deg,#2EE36F,#128F3F)', 'rgba(29,185,84,.7)', '<circle cx="12" cy="12" r="9.5" fill="none" stroke="#fff" stroke-width="2"/><path d="M7 9.5c3.500-1 7-.6 10 1M7.500 12.800c2.800-.8 5.500-.5 8 .9M8 15.800c2.200-.6 4.200-.4 6.200.7" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>', 'سبوتيفاي'),
    threads: G('linear-gradient(135deg,#333,#000)', 'rgba(0,0,0,.6)', '<text x="12" y="17.5" text-anchor="middle" font-size="16" font-weight="800" font-family="Arial,sans-serif" fill="#fff">@</text>', 'ثريدز'),
    reddit: G('linear-gradient(135deg,#FF6A33,#E03D00)', 'rgba(255,69,0,.7)', '<ellipse cx="12" cy="14" rx="7.500" ry="5" fill="#fff"/><circle cx="9.500" cy="13.500" r="1.200" fill="#E03D00"/><circle cx="14.500" cy="13.500" r="1.200" fill="#E03D00"/><circle cx="17.500" cy="6" r="1.500" fill="#fff"/><path d="M12 9l1-4 4.500 1" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>', 'ريديت'),
    pinterest: G('linear-gradient(135deg,#FF3A4B,#B8001A)', 'rgba(230,0,35,.7)', '<text x="12" y="18" text-anchor="middle" font-size="16" font-weight="800" font-family="Arial,sans-serif" fill="#fff">P</text>', 'بنترست'),
    mail: G('linear-gradient(135deg,#FF6B5E,#D93025)', 'rgba(217,48,37,.6)', '<rect x="3" y="5.500" width="18" height="13" rx="3" fill="none" stroke="#fff" stroke-width="2"/><path d="M4 8l8 5.500L20 8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>', 'البريد الإلكتروني'),
    phone: G('linear-gradient(135deg,#34D27B,#12894A)', 'rgba(22,163,74,.65)', '<path d="M5 3.500h3.500l1.500 4-2 1.300a11 11 0 005.200 5.200l1.300-2 4 1.500V17a2.500 2.500 0 01-2.500 2.500C9.800 19.500 4.500 14.200 4.500 6A2.500 2.500 0 015 3.500z" fill="#fff"/>', 'رقم الهاتف'),
    web: G('linear-gradient(135deg,#14A585,#0E7C66)', 'rgba(20,165,133,.65)', '<circle cx="12" cy="12" r="9" fill="none" stroke="#fff" stroke-width="2"/><path d="M3 12h18M12 3c3 3.500 3 14.500 0 18M12 3c-3 3.500-3 14.500 0 18" fill="none" stroke="#fff" stroke-width="1.8"/>', 'موقع إلكتروني')
  };
  const HOSTS = [[/(^|\.)(t\.me|telegram\.me|telegram\.org|telegram\.dog)$/, 'telegram'], [/(^|\.)(wa\.me|whatsapp\.com)$/, 'whatsapp'], [/(^|\.)(instagram\.com|instagr\.am)$/, 'instagram'], [/(^|\.)(facebook\.com|fb\.com|fb\.me|fb\.watch)$/, 'facebook'], [/(^|\.)(x\.com|twitter\.com)$/, 'x'], [/(^|\.)(youtube\.com|youtu\.be)$/, 'youtube'], [/(^|\.)tiktok\.com$/, 'tiktok'], [/(^|\.)snapchat\.com$/, 'snapchat'], [/(^|\.)(discord\.gg|discord\.com|discordapp\.com)$/, 'discord'], [/(^|\.)github\.com$/, 'github'], [/(^|\.)(linkedin\.com|lnkd\.in)$/, 'linkedin'], [/(^|\.)(twitch\.tv)$/, 'twitch'], [/(^|\.)(spotify\.com|spoti\.fi)$/, 'spotify'], [/(^|\.)(threads\.net|threads\.com)$/, 'threads'], [/(^|\.)(reddit\.com|redd\.it)$/, 'reddit'], [/(^|\.)(pinterest\.com|pin\.it)$/, 'pinterest']];
  A.brand = url => {
    const u = String(url || '').trim();
    let k = 'web';
    if (/^mailto:/i.test(u) || /^[^\s@\/]+@[^\s@\/]+\.[^\s@\/]+$/.test(u)) k = 'mail';
    else if (/^tel:/i.test(u) || /^\+?[\d\s\-()]{7,}$/.test(u)) k = 'phone';
    else {
      let h = '';
      try { h = new URL(/^[a-z]+:/i.test(u) ? u : 'https://' + u).hostname.toLowerCase(); } catch (e) {}
      const m = HOSTS.find(x => x[0].test(h));
      if (m) k = m[1];
    }
    return { key: k, ...BR[k] };
  };
  A.brandIcon = (url, size) => { const b = typeof url === 'string' ? A.brand(url) : url; return `<span class="bi" style="--bg:${b.bg};--gl:${b.gl};${size ? '--s:' + size + 'px' : ''}"><svg viewBox="0 0 24 24" aria-hidden="true">${b.svg}</svg></span>`; };
  Object.assign(A.icons, { ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>' });

  const CATS = ['منظمة سياسية', 'حركة مدنية', 'صانع محتوى', 'كاتب', 'شاعر', 'فنان', 'مصمم', 'مبرمج', 'مطوّر ألعاب', 'صحفي', 'رياضي', 'موسيقي', 'مصوّر', 'مدوّن', 'متجر', 'شركة', 'مؤسسة تعليمية', 'شخصية عامة'];
  const MAX_LINKS = 5;

  const pathIn = (bucket, url) => {
    if (!url) return null;
    const i = url.indexOf('/' + bucket + '/');
    return i < 0 ? null : decodeURIComponent(url.slice(i + bucket.length + 2).split('?')[0]);
  };
  async function prep(file, max, square) {
    const bmp = await createImageBitmap(file);
    let sx = 0, sy = 0, sw = bmp.width, sh = bmp.height;
    if (square) { const s = Math.min(sw, sh); sx = (sw - s) / 2; sy = (sh - s) / 2; sw = sh = s; }
    const k = Math.min(1, max / Math.max(sw, sh));
    const c = document.createElement('canvas');
    c.width = Math.round(sw * k); c.height = Math.round(sh * k);
    c.getContext('2d').drawImage(bmp, sx, sy, sw, sh, 0, 0, c.width, c.height);
    return new Promise((res, rej) => c.toBlob(b => b ? res(b) : rej(new Error('blob')), 'image/jpeg', 0.88));
  }
  const fixUrl = u => {
    u = (u || '').trim();
    if (!u) return null;
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    try { const x = new URL(u); return /^https?:$/.test(x.protocol) && x.hostname.includes('.') ? x.href : null; } catch (e) { return null; }
  };

  // صفحة كاملة فوق الصفحة الحالية
  function page(title, body, action) {
    const el = document.createElement('div');
    el.className = 'cr pe';
    el.style.zIndex = 70 + document.querySelectorAll('.pe').length;
    el.innerHTML = `<div class="cr-head"><button class="icon-btn" data-x aria-label="رجوع">${A.icon('arrow')}</button><div class="cr-title">${title}</div>${action || '<span style="width:44px"></span>'}</div><div class="cr-body">${body}</div><div class="ep-layer"></div>`;
    document.body.appendChild(el);
    const q = s => el.querySelector(s);
    return { el, q, close: () => el.remove(), busy: m => { q('.ep-layer').innerHTML = m ? `<div class="busy"><div class="loader"></div><div>${m}</div></div>` : ''; } };
  }
  const sw = (id, on) => `<label class="pe-sw"><input type="checkbox" id="${id}" ${on ? 'checked' : ''}><i></i></label>`;

  A.profileEdit = async function (p0, done) {
    const uid = me().id;
    const S = { p: { ...p0 }, links: [], pins: [], contact: { email: '', phone: '', show: false }, av: null, cv: null, dirty: false };
    const [l, c] = await Promise.all([
      A.sb.from('profile_links').select('id,title,url,position').eq('user_id', uid).order('position').order('created_at'),
      A.sb.from('profile_contacts').select('email,phone,show').eq('user_id', uid).maybeSingle()
    ]);
    S.links = l.data || [];
    { const pr = await A.sb.from('profile_pins').select('id,kind,channel_id,conversation_id').eq('user_id', uid).order('position').order('created_at'); S.pins = pr.data || []; }
    if (c.data) S.contact = { email: c.data.email || '', phone: c.data.phone || '', show: !!c.data.show };

    const P = page('تعديل الملف الشخصي', `
      <div class="prof-cover" id="ep-cover" style="${S.p.cover_url ? `background-image:url('${A.esc(S.p.cover_url)}')` : ''}"></div>
      <div class="prof-top"><div id="ep-av">${A.avatar(S.p, 84)}</div></div>
      <div class="ep-pick"><button class="btn ghost" id="ep-pa">${A.icon('camera')} تغيير الصورة</button><button class="btn ghost" id="ep-pc">${A.icon('image')} تغيير الغلاف</button></div>
      <div class="field"><label>الاسم</label><input id="ep-name" maxlength="50" value="${A.esc(S.p.display_name)}"></div>
      <div class="field"><label>اسم المستخدم</label><input id="ep-user" dir="ltr" maxlength="30" autocapitalize="none" value="${A.esc(S.p.username)}"></div>
      <div class="field"><label>السيرة الذاتية</label><textarea id="ep-bio" maxlength="300">${A.esc(S.p.bio || '')}</textarea></div>
      <button class="pe-row" data-r="links"><span>الروابط</span><em id="v-links"></em>${A.icon('chev')}</button>
      <button class="pe-row" data-r="pins"><span>القنوات والمجموعات</span><em id="v-pins"></em>${A.icon('chev')}</button>
      <button class="pe-row" data-r="cat"><span>الفئة</span><em id="v-cat"></em>${A.icon('chev')}</button>
      <button class="pe-row" data-r="contact"><span>خيارات الاتصال</span><em id="v-contact"></em>${A.icon('chev')}</button>
      <div class="pe-row"><span>منشئ محتوى باستخدام الذكاء الاصطناعي<small>أضف هذه التسمية إذا كان ملفك الشخصي يعرض شخصًا تم إنشاؤه بواسطة الذكاء الاصطناعي.</small></span>${sw('ep-ai', S.p.ai_creator)}</div>
      <input type="file" id="ep-fa" accept="image/jpeg,image/png,image/webp" hidden>
      <input type="file" id="ep-fc" accept="image/jpeg,image/png,image/webp" hidden>`,
      '<button class="btn sm" id="ep-save" style="margin:0">حفظ</button>');
    const q = P.q;
    const close = () => { P.close(); if (S.dirty && done) done(); };
    q('[data-x]').onclick = close;

    const vals = () => {
      q('#v-links').textContent = S.links.length || '';
      q('#v-pins').textContent = S.pins.length || '';
      q('#v-cat').innerHTML = S.p.category ? `${A.esc(S.p.category)}${A.catBadge(S.p.category, 18)}` : '';
      q('#v-contact').textContent = S.contact.show ? 'ظاهرة' : 'مخفية';
    };
    vals();

    q('#ep-pa').onclick = () => q('#ep-fa').click();
    q('#ep-pc').onclick = () => q('#ep-fc').click();
    q('#ep-fa').onchange = e => {
      const f = e.target.files[0]; e.target.value = '';
      if (!f) return;
      S.av = f;
      q('#ep-av').innerHTML = `<img class="avatar" style="width:84px;height:84px" src="${URL.createObjectURL(f)}" alt="">`;
    };
    q('#ep-fc').onchange = e => {
      const f = e.target.files[0]; e.target.value = '';
      if (!f) return;
      S.cv = f;
      q('#ep-cover').style.backgroundImage = `url('${URL.createObjectURL(f)}')`;
    };

    const upd = async obj => { const { error } = await A.sb.from('profiles').update(obj).eq('id', uid); if (!error) { Object.assign(S.p, obj); S.dirty = true; } return error; };

    q('[data-r="links"]').onclick = () => linksPage();
    q('[data-r="cat"]').onclick = () => catPage();
    q('[data-r="pins"]').onclick = () => pinsPage();

    /* ===== القنوات والمجموعات ===== */
    async function pinsPage() {
      const MAXP = 6;
      const L = page('القنوات والمجموعات', `<div class="pe-hint">اعرض قنواتك أو كروباتك اللي أنت منشئها بملفك الشخصي، وأي زائر يكدر يدخل عليها بضغطة (حتى ${MAXP}). الكروب يظهر للزوار فقط إذا مفعّل «الانضمام عبر الرابط».</div><div id="pn-list"><div class="loader" style="margin:20px auto"></div></div><div id="pn-add"></div>`);
      L.q('[data-x]').onclick = L.close;
      const [ch, gr] = await Promise.all([
        A.sb.from('channels').select('id,name,avatar_url,is_public').eq('owner_id', uid).order('created_at', { ascending: false }),
        A.sb.from('conversations').select('id,name,avatar_url').eq('is_group', true).eq('created_by', uid).order('created_at', { ascending: false })
      ]);
      const mine = [...(ch.data || []).map(x => ({ kind: 'channel', cid: x.id, name: x.name, av: x.avatar_url })), ...(gr.data || []).map(x => ({ kind: 'group', cid: x.id, name: x.name, av: x.avatar_url }))];
      const find = p => mine.find(m => m.cid === (p.kind === 'channel' ? p.channel_id : p.conversation_id));
      const row = (m, btn) => `<div class="pe-li"><span class="pn-av">${A.avatar({ avatar_url: m.av, display_name: m.name, username: m.name }, 40)}</span><div><b>${A.esc(m.name || 'بدون اسم')}</b><small style="direction:rtl;text-align:right">${m.kind === 'channel' ? 'قناة' : 'كروب'}</small></div>${btn}</div>`;
      const draw = () => {
        L.q('#pn-list').innerHTML = S.pins.map(p => { const m = find(p); return m ? row(m, `<button class="icon-btn" data-del="${p.id}" aria-label="إزالة">${A.icon('trash')}</button>`) : ''; }).join('') || '<div class="empty">ما أضفت شي بعد</div>';
        const free = mine.filter(m => !S.pins.some(p => (p.kind === 'channel' ? p.channel_id : p.conversation_id) === m.cid));
        L.q('#pn-add').innerHTML = S.pins.length >= MAXP ? `<div class="pe-hint">وصلت للحد الأقصى (${MAXP}).</div>` :
          `<div class="pe-sec">أضف من قنواتك وكروباتك</div>` + (free.map(m => row(m, `<button class="btn sm" data-add="${m.kind}:${m.cid}" style="margin:0">إضافة</button>`)).join('') || '<div class="pe-hint">ما عندك قنوات أو كروبات أنت منشئها لم تُضف.</div>');
        vals();
      };
      draw();
      L.el.onclick = async e => {
        const d = e.target.closest('[data-del]');
        if (d) {
          const { error } = await A.sb.from('profile_pins').delete().eq('id', d.dataset.del);
          if (error) return A.toast('تعذر الإزالة', 'err');
          S.pins = S.pins.filter(x => x.id !== d.dataset.del); S.dirty = true; return draw();
        }
        const a = e.target.closest('[data-add]');
        if (a) {
          const [kind, cid] = a.dataset.add.split(':');
          a.disabled = true;
          const { data, error } = await A.sb.from('profile_pins').insert({ kind, channel_id: kind === 'channel' ? cid : null, conversation_id: kind === 'group' ? cid : null, position: S.pins.length }).select('id,kind,channel_id,conversation_id').single();
          if (error) { a.disabled = false; return A.toast('تعذرت الإضافة', 'err'); }
          S.pins.push(data); S.dirty = true; draw(); A.toast('تمت الإضافة لملفك', 'ok');
        }
      };
    }
    q('[data-r="contact"]').onclick = () => contactPage();

    /* ===== الروابط ===== */
    function linksPage() {
      const L = page('الروابط', `<div class="pe-hint">أضف حتى ${MAX_LINKS} روابط تظهر في ملفك الشخصي (تيليغرام، ديسكورد، تيك توك، موقعك...).</div><div id="lk-list"></div><div id="lk-form"></div>`);
      const draw = () => {
        L.q('#lk-list').innerHTML = S.links.map(x => `<div class="pe-li">${A.brandIcon(x.url)}<div><b>${A.esc(x.title)}</b><small>${A.esc(x.url)}</small></div><button class="icon-btn" data-del="${x.id}" aria-label="حذف">${A.icon('trash')}</button></div>`).join('') || '<div class="empty">لا توجد روابط بعد</div>';
        L.q('#lk-form').innerHTML = S.links.length >= MAX_LINKS ? `<div class="pe-hint">وصلت للحد الأقصى (${MAX_LINKS} روابط).</div>` :
          `<div class="pe-sec">رابط جديد</div><div class="field"><label>الرابط</label><input id="lk-u" dir="ltr" maxlength="300" placeholder="t.me/name" autocapitalize="none"></div><div class="lk-pv" id="lk-pv"><em>الصق الرابط وسيظهر شعار التطبيق تلقائياً</em></div>
           <div class="field"><label>العنوان (اختياري)</label><input id="lk-t" maxlength="40" placeholder="مثال: قناتي على تيليغرام"></div><button class="btn block" id="lk-add">إضافة الرابط</button>`;
        vals();
      };
      draw();
      L.el.oninput = e => {
        if (e.target.id !== 'lk-u') return;
        const v = e.target.value.trim(), pv = L.q('#lk-pv'), ti = L.q('#lk-t');
        if (!v) { pv.innerHTML = '<em>الصق الرابط وسيظهر شعار التطبيق تلقائياً</em>'; ti.placeholder = 'مثال: قناتي على تيليغرام'; return; }
        const b = A.brand(v);
        pv.innerHTML = `${A.brandIcon(b, 32)}<span>${b.name}</span>`;
        ti.placeholder = b.name;
      };
      L.q('[data-x]').onclick = L.close;
      L.el.onclick = async e => {
        const d = e.target.closest('[data-del]');
        if (d) {
          const { error } = await A.sb.from('profile_links').delete().eq('id', d.dataset.del);
          if (error) return A.toast('تعذر الحذف', 'err');
          S.links = S.links.filter(x => x.id !== d.dataset.del); S.dirty = true; return draw();
        }
        if (e.target.closest('#lk-add')) {
          const u = fixUrl(L.q('#lk-u').value), t = L.q('#lk-t').value.trim() || (u ? A.brand(u).name : '');
          if (!u) return A.toast('الرابط غير صحيح', 'err');
          const { data, error } = await A.sb.from('profile_links').insert({ user_id: uid, title: t, url: u, position: S.links.length }).select('id,title,url,position').single();
          if (error) return A.toast('تعذر إضافة الرابط', 'err');
          S.links.push(data); S.dirty = true; draw(); A.toast('تمت إضافة الرابط', 'ok');
        }
      };
    }

    /* ===== الفئة ===== */
    function catPage() {
      const cur = S.p.category || '';
      const C = page('الفئة', `<div class="pe-hint">لكل فئة شعار يظهر جنب اسمك (بدون كلمة) ويوضح نوع حسابك.</div>
        <div class="pe-chips">${CATS.map(x => `<button data-c="${A.esc(x)}" class="${x === cur ? 'on' : ''}" style="display:inline-flex;align-items:center;gap:6px"><span>${A.esc(x)}</span>${A.catBadge(x, 20).replace('margin-inline-start:4px', 'margin:0')}</button>`).join('')}</div>
        <div class="field"><label>أو اكتب فئة خاصة بك</label><input id="ct-c" maxlength="40" value="${A.esc(CATS.includes(cur) ? '' : cur)}"></div>
        <button class="btn block" id="ct-save">حفظ</button><button class="btn ghost block" id="ct-clr" style="margin-top:8px">إزالة الفئة</button>`);
      C.q('[data-x]').onclick = C.close;
      const save = async v => {
        const err = await upd({ category: v || null });
        if (err) return A.toast('تعذر الحفظ', 'err');
        vals(); C.close(); A.toast('تم الحفظ', 'ok');
      };
      C.el.onclick = e => {
        const b = e.target.closest('[data-c]');
        if (b) return save(b.dataset.c);
        if (e.target.closest('#ct-save')) return save(C.q('#ct-c').value.trim());
        if (e.target.closest('#ct-clr')) return save('');
      };
    }

    /* ===== خيارات الاتصال ===== */
    function contactPage() {
      const K = page('خيارات الاتصال', `<div class="pe-hint">أضف بريداً أو رقم هاتف ليتواصل معك الناس من ملفك الشخصي. لا تظهر لأحد إلا إذا فعّلت العرض.</div>
        <div class="field"><label>البريد الإلكتروني</label><input id="kc-e" dir="ltr" type="email" maxlength="120" autocapitalize="none" value="${A.esc(S.contact.email)}"></div>
        <div class="field"><label>رقم الهاتف</label><input id="kc-p" dir="ltr" type="tel" maxlength="30" value="${A.esc(S.contact.phone)}"></div>
        <div class="pe-row"><span>عرض جهات الاتصال في ملفي</span>${sw('kc-s', S.contact.show)}</div>
        <button class="btn block" id="kc-save" style="margin-top:14px">حفظ</button>`);
      K.q('[data-x]').onclick = K.close;
      K.q('#kc-save').onclick = async () => {
        const email = K.q('#kc-e').value.trim(), phone = K.q('#kc-p').value.trim(), show = K.q('#kc-s').checked;
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return A.toast('البريد الإلكتروني غير صحيح', 'err');
        if (phone && !/^[+0-9\s-]{6,30}$/.test(phone)) return A.toast('رقم الهاتف غير صحيح', 'err');
        if (show && !email && !phone) return A.toast('أضف بريداً أو رقماً أولاً', 'err');
        const { error } = await A.sb.from('profile_contacts').upsert({ user_id: uid, email: email || null, phone: phone || null, show, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
        if (error) return A.toast('تعذر الحفظ', 'err');
        S.contact = { email, phone, show }; S.dirty = true; vals(); K.close(); A.toast('تم الحفظ', 'ok');
      };
    }

    /* ===== حفظ الصفحة الرئيسية ===== */
    q('#ep-save').onclick = async () => {
      const name = q('#ep-name').value.trim(), user = q('#ep-user').value.trim().toLowerCase(), bio = q('#ep-bio').value.trim();
      if (!name) return A.toast('اكتب اسمك', 'err');
      if (!/^[a-z0-9_.]{3,30}$/.test(user)) return A.toast('اسم المستخدم: 3-30 حرفاً إنجليزياً أو أرقاماً أو _ .', 'err');
      P.busy('جاري الحفظ...');
      const upd2 = { display_name: name, username: user, bio: bio || null, ai_creator: q('#ep-ai').checked }, fresh = [], old = [];
      try {
        if (S.av) {
          const blob = await prep(S.av, 512, true), path = `${uid}/${Date.now()}.jpg`;
          const { error } = await A.sb.storage.from('avatars').upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' });
          if (error) throw error;
          fresh.push(['avatars', path]);
          upd2.avatar_url = A.sb.storage.from('avatars').getPublicUrl(path).data.publicUrl;
          old.push(['avatars', S.p.avatar_url]);
        }
        if (S.cv) {
          const blob = await prep(S.cv, 1280, false), path = `${uid}/${Date.now()}.jpg`;
          const { error } = await A.sb.storage.from('covers').upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' });
          if (error) throw error;
          fresh.push(['covers', path]);
          upd2.cover_url = A.sb.storage.from('covers').getPublicUrl(path).data.publicUrl;
          old.push(['covers', S.p.cover_url]);
        }
        const { error } = await A.sb.from('profiles').update(upd2).eq('id', uid);
        if (error) throw error;
      } catch (e) {
        console.error(e);
        fresh.forEach(([b, path]) => A.sb.storage.from(b).remove([path]));
        P.busy(false);
        return A.toast(e.code === '23505' ? 'اسم المستخدم مستخدم، اختر اسماً آخر' : 'تعذر الحفظ، تأكد من الصورة والاتصال', 'err');
      }
      old.forEach(([b, url]) => { const path = pathIn(b, url); if (path && path.startsWith(uid + '/')) A.sb.storage.from(b).remove([path]); });
      P.close();
      A.toast('تم حفظ الملف الشخصي', 'ok');
      if (done) done();
    };
  };

  // عرض الروابط وجهات الاتصال في ملف أي حساب
  A.profileLinksSheet = (links, openSheet) => openSheet(`<div class="lk-h"><h3>الروابط</h3><span class="lk-n">${links.length}</span></div><div class="lk-sub">اضغط على أي رابط للانتقال إليه</div>${links.map((x, i) => { const b = A.brand(x.url); return `<a class="lk-card" style="--i:${i}" href="${A.esc(x.url)}" target="_blank" rel="noopener noreferrer nofollow">${A.brandIcon(b)}<div class="mid"><b>${A.esc(x.title || b.name)}</b><small>${A.esc(x.url.replace(/^https?:\/\//, ''))}</small></div><span class="go">${A.icon('ext')}</span></a>`; }).join('')}`);
  A.profileContactSheet = (c, openSheet) => {
    const rows = [];
    if (c.email) rows.push(['mailto:' + c.email, c.email, 'mail']);
    if (c.phone) rows.push(['tel:' + c.phone, c.phone, 'phone']);
    return openSheet(`<div class="lk-h"><h3>خيارات الاتصال</h3><span class="lk-n">${rows.length}</span></div><div class="lk-sub">تواصل مباشرة بضغطة واحدة</div>${rows.map(([href, val, k], i) => `<a class="lk-card" style="--i:${i}" href="${A.esc(href)}">${A.brandIcon({ key: k, ...BR[k] })}<div class="mid"><b>${BR[k].name}</b><small>${A.esc(val)}</small></div><span class="go">${A.icon('ext')}</span></a>`).join('')}`);
  };
})();
