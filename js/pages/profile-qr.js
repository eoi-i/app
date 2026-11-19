(function () {
  const A = App;
  Object.assign(A.icons, {
    dl: '<path d="M12 3v12M7 11l5 5 5-5M4 20h16"/>',
    qrlink: '<path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1"/><path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>',
    shr: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4"/>'
  });

  const stl = document.createElement('style');
  stl.textContent = `
.qr{--g1:#0E7C66;--g2:#14A585;direction:rtl;display:flex;flex-direction:column;align-items:center;padding:4px 0 30px}
.qr-cv{width:100%;max-width:360px;aspect-ratio:1080/1440;border-radius:26px;box-shadow:0 24px 50px -22px rgba(20,165,133,.9),0 0 0 1px rgba(255,255,255,.06);animation:qrIn .6s cubic-bezier(.2,.9,.3,1) both;display:block;background:#0E7C66}
@keyframes qrIn{from{opacity:0;transform:translateY(18px) scale(.96)}}
.qr-act{width:100%;max-width:360px;margin-top:16px;padding:16px 8px 12px;border-radius:24px;background:var(--card);border:1px solid var(--line);box-shadow:var(--shadow);display:grid;grid-template-columns:repeat(3,1fr);gap:6px;animation:qrIn .6s .12s cubic-bezier(.2,.9,.3,1) both}
.qr-act button{display:flex;flex-direction:column;align-items:center;gap:8px;font-weight:700;font-size:12.5px;color:var(--text);text-align:center;line-height:1.4;padding:0 2px}
.qr-act i{width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:var(--chip);border:1px solid var(--line);transition:.2s}
.qr-act button:active i{transform:scale(.92);background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff}
.qr-act .ic{width:24px;height:24px}
@media (prefers-reduced-motion:reduce){.qr-cv,.qr-act{animation:none}}`;
  document.head.appendChild(stl);

  const profileUrl = u => location.href.split('#')[0] + '#/u/' + encodeURIComponent(u);

  const loadImg = src => new Promise(res => {
    if (!src) return res(null);
    const im = new Image();
    im.crossOrigin = 'anonymous';
    const t = setTimeout(() => res(null), 3000);
    im.onload = () => { clearTimeout(t); res(im); };
    im.onerror = () => { clearTimeout(t); res(null); };
    im.src = src;
  });

  const rr = (c, x, y, w, h, r) => {
    r = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  };

  async function draw(cv, p, url) {
    const W = 1080, H = 1440, c = cv.getContext('2d');
    cv.width = W; cv.height = H;
    try { await document.fonts.load('800 60px Cairo'); await document.fonts.load('700 36px Cairo'); } catch (e) {}
    // خلفية متدرجة
    let g = c.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#0B5F4F'); g.addColorStop(.55, '#0E7C66'); g.addColorStop(1, '#14A585');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    // زخارف
    const orb = (x, y, r, col) => { const rg = c.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, col); rg.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = rg; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); };
    orb(W * .9, H * .06, 420, 'rgba(229,181,61,.45)');
    orb(W * .08, H * .95, 380, 'rgba(255,255,255,.22)');
    c.strokeStyle = 'rgba(255,255,255,.07)'; c.lineWidth = 3;
    for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(W * .5, H * .52, 470 + i * 70, 0, 7); c.stroke(); }

    c.direction = 'rtl'; c.textAlign = 'center'; c.fillStyle = '#fff';
    c.font = '800 70px Cairo, sans-serif';
    c.fillText('أني عراقي', W / 2, 150);
    c.fillStyle = '#F3D27A'; c.fillRect(W / 2 - 40, 178, 80, 6);

    // البطاقة البيضاء
    const cx = 100, cy = 250, cw = W - 200, ch = 960;
    c.save(); c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowBlur = 60; c.shadowOffsetY = 26;
    rr(c, cx, cy, cw, ch, 70); c.fillStyle = '#fff'; c.fill(); c.restore();

    // QR
    const qr = qrcode(0, 'H'); qr.addData(url); qr.make();
    const n = qr.getModuleCount(), size = 700, m = size / n, qx = (W - size) / 2, qy = cy + 70;
    const inFinder = (r, k) => (r < 7 && k < 7) || (r < 7 && k >= n - 7) || (r >= n - 7 && k < 7);
    const mid = n / 2, lg = n * 0.115; // مساحة الشعار بالوسط
    c.fillStyle = '#0B3D33';
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) {
      if (!qr.isDark(r, k) || inFinder(r, k)) continue;
      if (Math.abs(r + .5 - mid) < lg && Math.abs(k + .5 - mid) < lg) continue;
      rr(c, qx + k * m + .4, qy + r * m + .4, m - .8, m - .8, m * .3); c.fill();
    }
    const finder = (r0, k0) => {
      const x = qx + k0 * m, y = qy + r0 * m;
      rr(c, x, y, 7 * m, 7 * m, m * 2.2); c.fillStyle = '#0B3D33'; c.fill();
      rr(c, x + m, y + m, 5 * m, 5 * m, m * 1.5); c.fillStyle = '#fff'; c.fill();
      rr(c, x + 2 * m, y + 2 * m, 3 * m, 3 * m, m); c.fillStyle = '#0B3D33'; c.fill();
    };
    finder(0, 0); finder(0, n - 7); finder(n - 7, 0);

    // شعار الوسط: صورة المستخدم أو حرف
    const lr = lg * m * 1.02, lx = W / 2, ly = qy + size / 2;
    c.beginPath(); c.arc(lx, ly, lr + 12, 0, 7); c.fillStyle = '#fff'; c.fill();
    const im = await loadImg(p.avatar_url);
    c.save(); c.beginPath(); c.arc(lx, ly, lr, 0, 7); c.clip();
    if (im) { const s = Math.max(lr * 2 / im.width, lr * 2 / im.height); c.drawImage(im, lx - im.width * s / 2, ly - im.height * s / 2, im.width * s, im.height * s); }
    else {
      const lg2 = c.createLinearGradient(lx - lr, ly - lr, lx + lr, ly + lr); lg2.addColorStop(0, '#0E7C66'); lg2.addColorStop(1, '#14A585');
      c.fillStyle = lg2; c.fillRect(lx - lr, ly - lr, lr * 2, lr * 2);
      c.fillStyle = '#fff'; c.font = '800 ' + Math.round(lr * 1.15) + 'px Cairo, sans-serif'; c.textBaseline = 'alphabetic';
      c.fillText(((p.display_name || p.username || '?').trim().charAt(0) || '?').toUpperCase(), lx, ly + lr * .4);
    }
    c.restore();

    // الاسم
    c.fillStyle = '#0B3D33'; c.textAlign = 'center';
    c.font = '800 62px Cairo, sans-serif';
    let nm = p.display_name || p.username;
    while (c.measureText(nm).width > cw - 100 && nm.length > 3) nm = nm.slice(0, -2);
    if (nm !== (p.display_name || p.username)) nm += '…';
    c.fillText(nm, W / 2, qy + size + 105);
    c.fillStyle = '#5B7A72'; c.font = '700 42px Cairo, sans-serif'; c.direction = 'ltr';
    c.fillText('@' + p.username, W / 2, qy + size + 168);
    c.direction = 'rtl';

    c.fillStyle = 'rgba(255,255,255,.92)'; c.font = '700 40px Cairo, sans-serif';
    c.fillText('امسح الرمز لزيارة الملف الشخصي', W / 2, H - 120);
  }

  A.shareProfile = async function (username, openSheet, prof) {
    let p = prof;
    if (!p || !p.username) {
      const me = A.state.profile;
      if (me && me.username === username) p = me;
      else { const { data } = await A.sb.from('profiles').select('username,display_name,avatar_url').eq('username', username).maybeSingle(); p = data || { username }; }
    }
    const url = profileUrl(p.username);
    const el = document.createElement('div');
    el.className = 'cr';
    el.style.zIndex = 85;
    el.innerHTML = `<div class="cr-head"><button class="icon-btn" data-x aria-label="رجوع">${A.icon('arrow')}</button><div class="cr-title">مشاركة الملف الشخصي</div><span style="width:44px"></span></div>
      <div class="cr-body"><div class="qr"><canvas class="qr-cv"></canvas>
        <div class="qr-act"><button data-k="dl"><i>${A.icon('dl')}</i>تنزيل الصورة</button><button data-k="copy"><i>${A.icon('qrlink')}</i>نسخ الرابط</button><button data-k="share"><i>${A.icon('shr')}</i>مشاركة الصورة</button></div></div></div>`;
    document.body.appendChild(el);
    el.querySelector('[data-x]').onclick = () => el.remove();
    const cv = el.querySelector('canvas');
    try { await draw(cv, p, url); } catch (e) { console.error(e); A.toast('تعذر إنشاء الرمز', 'err'); }

    const blob = () => new Promise(r => cv.toBlob(r, 'image/png'));
    const fname = 'ani-iraqi-' + p.username + '.png';
    const download = async () => {
      const b = await blob(); if (!b) return A.toast('تعذر إنشاء الصورة', 'err');
      A.saveImage(b, fname);
    };
    el.querySelector('.qr-act').onclick = async e => {
      const b = e.target.closest('[data-k]');
      if (!b) return;
      const k = b.dataset.k;
      if (k === 'dl') return download();
      if (k === 'copy') return navigator.clipboard.writeText(url).then(() => A.toast('تم نسخ الرابط', 'ok'), () => A.toast('تعذر النسخ', 'err'));
      const bl = await blob();
      const f = bl && new File([bl], fname, { type: 'image/png' });
      const text = 'تابعني على أني عراقي\n' + url;
      try {
        if (f && navigator.canShare && navigator.canShare({ files: [f] })) await navigator.share({ files: [f], text, title: 'أني عراقي' });
        else if (navigator.share) await navigator.share({ text, url, title: 'أني عراقي' });
        else { await navigator.clipboard.writeText(url); A.toast('تم نسخ الرابط', 'ok'); }
      } catch (err) { if (err && err.name !== 'AbortError') A.toast('تعذر المشاركة', 'err'); }
    };
  };
})();
