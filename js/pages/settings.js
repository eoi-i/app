(function () {
  const A = App;
  const me = () => A.state.user;
  const LS = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  Object.assign(A.icons, {
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>',
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    chev: '<path d="M15 18l-6-6 6-6"/>',
    check: '<path d="M20 6L9 17l-5-5"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    shield: '<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
    person: '<circle cx="12" cy="4" r="2"/><path d="M5 8l7 1 7-1M12 9v5M9 22l3-8 3 8"/>',
    zap: '<path d="M13 2L3 14h8l-1 8 10-12h-8z"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 015 .5c0 1.7-2.5 2-2.5 3.5M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    logout: '<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>',
    font: '<path d="M2 19L8 5l6 14M4.5 14h7"/><circle cx="18" cy="15.5" r="3"/><path d="M21 12.5V19"/>'
  });

  /* ---------- المظهر وإمكانية الوصول (تُطبَّق عند التشغيل) ---------- */
  const MODES = { auto: 'حسب الجهاز', light: 'فاتح', dark: 'داكن' };
  const mode = () => LS.get('theme_mode') || 'auto';
  function applyMode() {
    const m = mode();
    const dark = m === 'dark' || (m === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    A.theme.set(dark ? 'dark' : 'light');
    const b = document.getElementById('b-theme');
    if (b) b.innerHTML = A.icon(dark ? 'sun' : 'moon');
  }
  const initBase = A.theme.init.bind(A.theme);
  A.theme.init = function () { initBase(); applyMode(); };
  const toggleBase = A.theme.toggle.bind(A.theme);
  A.theme.toggle = function () { toggleBase(); LS.set('theme_mode', document.documentElement.dataset.theme); };
  try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (mode() === 'auto') applyMode(); }); } catch (e) {}
  /* ---------- الخطوط وسهولة القراءة: حجم النص / نص عريض / تباين عالٍ ---------- */
  // 8 خطوط عربية (الأول هو الخط الافتراضي للتطبيق)
  const FONTS = [
    ['cairo', 'Cairo', 'القاهرة (الافتراضي)', 'Cairo:wght@400;600;700;800'],
    ['amiri', 'Amiri', 'نسخ أميري', 'Amiri:wght@400;700'],
    ['ruqaa', 'Aref Ruqaa', 'رقعة', 'Aref+Ruqaa:wght@400;700'],
    ['kufi', 'Reem Kufi', 'كوفي', 'Reem+Kufi:wght@400;700'],
    ['lalezar', 'Lalezar', 'لالزار الزخرفي', 'Lalezar'],
    ['rakkas', 'Rakkas', 'رَكّاس', 'Rakkas'],
    ['katibeh', 'Katibeh', 'كاتبة', 'Katibeh'],
    ['lateef', 'Lateef', 'لطيف', 'Lateef:wght@400;700']
  ];
  const loadFonts = ids => FONTS.filter(f => ids.includes(f[0]) && !document.getElementById('ff-' + f[0])).forEach(f => {
    const l = document.createElement('link');
    l.id = 'ff-' + f[0]; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + f[3] + '&display=swap';
    document.head.appendChild(l);
  });
  function applyAccess() {
    const r = document.documentElement, fk = LS.get('a11y_font') || 'cairo', f = FONTS.find(x => x[0] === fk) || FONTS[0];
    if (f[0] === 'cairo') { r.removeAttribute('data-font'); r.style.removeProperty('--ff'); }
    else { loadFonts([f[0]]); r.setAttribute('data-font', f[0]); r.style.setProperty('--ff', "'" + f[1] + "'"); }
    r.style.zoom = ''; LS.del('a11y_zoom');
    r.classList.toggle('a11y-bold', LS.get('a11y_bold') === '1');
    r.classList.toggle('a11y-hc', LS.get('a11y_hc') === '1');
    r.classList.remove('rm'); LS.del('reduce_motion');
  }
  applyAccess();

  // زر الإعدادات في الشريط العلوي
  const baseShell = A.buildShell;
  A.buildShell = function () {
    baseShell.apply(this, arguments);
    const top = document.querySelector('.top-actions');
    if (!top) return;
    const b = document.createElement('button');
    b.className = 'icon-btn'; b.id = 'b-set'; b.setAttribute('aria-label', 'الإعدادات');
    b.innerHTML = A.icon('gear');
    b.onclick = () => { location.hash = '#/settings'; };
    top.insertBefore(b, document.getElementById('b-theme'));
  };

  /* ---------- القائمة الرئيسية (الرمز 's' = قريباً) ---------- */
  const MENU = [
    ['الحساب', [['account', 'user', 'معلومات الحساب'], ['security', 'shield', 'الأمان والأذونات', 's'], ['shareprofile', 'share', 'مشاركة الملف الشخصي']]],
    ['الخصوصية والتفاعل', [['private', 'lock', 'حساب خاص', 's'], ['blocked', 'ban', 'الحسابات المحظورة'], ['dms', 'send', 'الرسائل الخاصة'],
      ['comments', 'comment', 'التعليقات', 's'], ['mentions', 'at', 'الإشارات', 's']]],
    ['النشاط', [['posts', 'grid', 'إدارة المنشورات', 's'], ['liked', 'heart', 'المنشورات التي أعجبتني', 's'], ['followlist', 'users', 'قائمة المتابعة', 's'], ['notifs', 'bell', 'الإشعارات', 's']]],
    ['التخصيص', [['display', 'moon', 'العرض'], ['language', 'globe', 'اللغة'], ['access', 'font', 'الخطوط وسهولة القراءة'], ['storage', 'trash', 'تحرير المساحة']]],
    ['الدعم والمعلومات', [['help', 'help', 'مركز المساعدة', 's'], ['privacyc', 'shield', 'مركز الخصوصية', 's'], ['terms', 'info', 'الشروط والسياسات', 's']]],
    ['', [['logout', 'logout', 'تسجيل الخروج']]]
  ];
  const VALUES = { display: () => MODES[mode()], language: () => 'العربية' };

  const rowHTML = ([k, ic, label, s]) => `<button class="sr ${s ? 'soon' : ''}${k === 'logout' ? ' danger' : ''}" data-k="${k}"${s ? ' data-soon="1"' : ''}>
    <span class="sr-i">${A.icon(ic)}</span><span class="sr-l">${label}</span>
    ${s ? '<span class="sr-v">قريباً</span>' : VALUES[k] ? `<span class="sr-v">${VALUES[k]()}</span>` : ''}
    ${k === 'logout' ? '' : `<span class="sr-c">${A.icon('chev')}</span>`}</button>`;

  async function shareProfile() {
    const u = (A.state.profile || {}).username;
    const url = location.href.split('#')[0] + '#/u/' + u;
    try {
      if (navigator.share) await navigator.share({ title: 'أني عراقي', url });
      else { await navigator.clipboard.writeText(url); A.toast('تم نسخ رابط ملفك الشخصي', 'ok'); }
    } catch (e) {}
  }

  function main(body) {
    body.innerHTML = MENU.map(([t, rows]) => `${t ? `<div class="set-sec">${t}</div>` : '<div style="height:18px"></div>'}<div class="set-card">${rows.map(rowHTML).join('')}</div>`).join('') +
      '<div class="set-ver">أني عراقي · الإصدار 1.0.0</div>';
    body.onclick = async e => {
      const r = e.target.closest('.sr');
      if (!r) return;
      const k = r.dataset.k;
      if (r.dataset.soon) return A.toast('هذه الميزة ستتوفر قريباً');
      if (k === 'shareprofile') return A.shareProfile ? A.shareProfile((A.state.profile || {}).username, null, A.state.profile) : shareProfile();
      if (k === 'logout') { await A.sb.auth.signOut(); return; }
      location.hash = '#/settings/' + k;
    };
  }

  /* ---------- مكونات صغيرة ---------- */
  const radio = (items, cur) => `<div class="set-card">${items.map(([k, l, dis]) =>
    `<button class="sr ${dis ? 'soon' : ''}" data-v="${k}"${dis ? ' data-soon="1"' : ''}><span class="sr-l">${l}</span>${dis ? '<span class="sr-v">قريباً</span>' : ''}${k === cur ? `<span class="chk">${A.icon('check')}</span>` : ''}</button>`).join('')}</div>`;

  /* ---------- الحساب ---------- */
  function account(body) {
    const u = me() || {}, p = A.state.profile || {};
    const joined = u.created_at ? new Date(u.created_at).toLocaleDateString('ar', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
    const ltr = t => `<span style="direction:ltr;unicode-bidi:isolate;display:inline-block">${A.esc(t)}</span>`;
    // صف قابل للضغط
    const go = (k, ic, label, sub, cls) => `<button class="sr ${cls || ''}" data-go="${k}"><span class="sr-i">${A.icon(ic)}</span><span class="sr-l">${label}${sub ? `<span class="sr-s">${sub}</span>` : ''}</span><span class="sr-c">${A.icon('chev')}</span></button>`;
    // صف معلومة للعرض فقط
    const info = (ic, label, val) => `<div class="sr" style="cursor:default"><span class="sr-i">${A.icon(ic)}</span><span class="sr-l">${label}<span class="sr-s" style="font-size:14px;color:var(--text)">${val}</span></span></div>`;
    const sec = (t, rows) => `<div class="set-sec">${t}</div><div class="set-card">${rows.join('')}</div>`;
    body.innerHTML = `<div class="acc-h" data-go="profile">${A.avatar(p, 64)}<div class="acc-n"><b>${A.esc(p.display_name || p.username || '')}${p.is_verified ? A.verified : ''}</b>
        <span>${p.username ? ltr('@' + p.username) : ''}</span></div><span class="sr-c">${A.icon('chev')}</span></div>
      <div class="set-note" style="margin-top:6px">لتعديل الاسم والنبذة والصورة، افتح ملفك الشخصي.</div>` +
      sec('معلومات الحساب', [
        info('at', 'البريد الإلكتروني', ltr(u.email || '—')),
        p.username ? info('user', 'اسم المستخدم', ltr('@' + p.username)) : '',
        go('private', 'lock', 'نوع الحساب', p.is_private ? 'خاص' : 'عام'),
        joined ? info('info', 'تاريخ إنشاء الحساب', A.esc(joined)) : ''
      ]) +
      sec('الأمان', [
        go('password', 'lock', 'كلمة المرور', 'تغيير كلمة المرور'),
        go('security', 'shield', 'الأمان والأذونات'),
        go('others', 'logout', 'تسجيل الخروج من الأجهزة الأخرى', 'إنهاء جلساتك على كل الأجهزة عدا هذا الجهاز')
      ]) +
      sec('الخصوصية', [
        go('blocked', 'ban', 'الحسابات المحظورة'),
        go('privacyc', 'shield', 'مركز الخصوصية')
      ]) +
      sec('بياناتك', [go('privacyc', 'grid', 'تنزيل نسخة من بياناتي', 'منشوراتك وتعليقاتك ومتابعاتك في ملف واحد')]) +
      sec('التحكم بالحساب', [go('delete', 'trash', 'حذف الحساب نهائياً', 'يحذف حسابك وكل بياناتك ولا يمكن التراجع', 'dng')]);

    body.onclick = e => {
      const r = e.target.closest('[data-go]');
      if (!r) return;
      const k = r.dataset.go;
      if (k === 'profile') { location.hash = '#/profile'; return; }
      if (k === 'others') return logoutOthers();
      location.hash = '#/settings/' + k;
    };
  }

  function logoutOthers() {
    const sh = A.sheet(`<h3>تسجيل الخروج من الأجهزة الأخرى</h3>
      <p style="opacity:.8;margin:6px 0 16px;line-height:1.8">سيتم إنهاء جلساتك على كل الأجهزة الأخرى، وتبقى مسجّلاً الدخول على هذا الجهاز.</p>
      <button class="btn block" id="lo-ok">تأكيد</button>
      <button class="btn ghost block" id="lo-no" style="margin-top:8px">إلغاء</button>`);
    document.getElementById('lo-no').onclick = () => sh.close();
    document.getElementById('lo-ok').onclick = async e => {
      e.target.disabled = true;
      const { error } = await A.sb.auth.signOut({ scope: 'others' });
      e.target.disabled = false;
      if (error) return A.toast('تعذر تنفيذ العملية، حاول مرة أخرى', 'err');
      sh.close();
      A.toast('تم تسجيل الخروج من الأجهزة الأخرى', 'ok');
    };
  }

  /* ---------- كلمة المرور ---------- */
  function password(body) {
    body.innerHTML = `<div class="set-sec">تغيير كلمة المرور</div><div class="card">
        <div class="field"><label>كلمة المرور الجديدة</label><input id="a-pw" type="password" autocomplete="new-password" placeholder="8 أحرف على الأقل"></div>
        <div class="pwm"><div class="pws"><i></i><i></i><i></i><i></i></div><span class="pwl"></span></div>
        <div class="pwr"><div>8 أحرف على الأقل</div><div>رقم</div><div>رمز (!@#...)</div><div>حروف كبيرة وصغيرة</div></div>
        <div class="field"><label>تأكيد كلمة المرور</label><input id="a-pw2" type="password" autocomplete="new-password"></div>
        <button class="btn block" id="a-pwb">تغيير كلمة المرور</button></div>`;
    if (!document.getElementById('pwm-st')) {
      const st = document.createElement('style'); st.id = 'pwm-st';
      st.textContent = '.pwm{display:flex;align-items:center;gap:10px;margin:-2px 2px 10px}.pws{flex:1;display:flex;gap:5px}.pws i{flex:1;height:5px;border-radius:3px;background:var(--line);transition:background .25s}.pwl{min-width:54px;text-align:end;font-size:12.5px;font-weight:800}.pwr{display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;margin:0 2px 12px;font-size:12.5px;color:var(--muted)}.pwr div::before{content:"○ "}.pwr div.ok{color:var(--text)}.pwr div.ok::before{content:"✓ ";color:#16A34A;font-weight:800}';
      document.head.appendChild(st);
    }
    const pwi = body.querySelector('#a-pw'), pwb = body.querySelector('#a-pwb');
    const pwUpd = () => {
      const p = pwi.value, c = [p.length >= 8, /\d/.test(p), /[^A-Za-z0-9\u0600-\u06FF\s]/.test(p), /[a-z]/.test(p) && /[A-Z]/.test(p)], n = c.filter(Boolean).length;
      const lv = p ? Math.max(1, c[0] ? n : Math.min(n, 1)) : 0, L = [['', '#888'], ['ضعيفة', '#E5484D'], ['متوسطة', '#F59E0B'], ['جيدة', '#84CC16'], ['قوية', '#16A34A']][lv];
      body.querySelectorAll('.pws i').forEach((x, i) => { x.style.background = i < lv ? L[1] : ''; });
      const lb = body.querySelector('.pwl'); lb.textContent = L[0]; lb.style.color = L[1];
      body.querySelectorAll('.pwr div').forEach((d, i) => d.classList.toggle('ok', c[i]));
      return c[0] && n >= 3;
    };
    pwi.addEventListener('input', pwUpd);
    body.querySelector('#a-pwb').onclick = async e => {
      const a = body.querySelector('#a-pw').value, b = body.querySelector('#a-pw2').value;
      if (!pwUpd()) return A.toast('كلمة المرور ضعيفة: 8 أحرف وعلى الأقل 3 شروط', 'err');
      if (a !== b) return A.toast('كلمتا المرور غير متطابقتين', 'err');
      e.target.disabled = true;
      const { error } = await A.sb.auth.updateUser({ password: a });
      e.target.disabled = false;
      if (error) return A.toast('تعذر تغيير كلمة المرور، سجّل الدخول من جديد وحاول ثانية', 'err');
      body.querySelector('#a-pw').value = ''; body.querySelector('#a-pw2').value = '';
      A.toast('تم تغيير كلمة المرور', 'ok');
    };
  }

  /* ---------- الحسابات المحظورة ---------- */
  async function blocked(body) {
    body.innerHTML = '<div class="sk" style="height:60px;margin:14px 0 8px"></div>'.repeat(2);
    const { data, error } = await A.sb.from('user_blocks')
      .select('blocked:profiles!user_blocks_blocked_id_fkey(id,username,display_name,avatar_url,is_verified)')
      .eq('blocker_id', me().id).order('created_at', { ascending: false });
    if (error) { body.innerHTML = '<div class="empty">تعذر التحميل</div>'; return; }
    const rows = (data || []).map(x => x.blocked).filter(Boolean);
    const empty = '<div class="empty">لا توجد حسابات محظورة</div>';
    body.innerHTML = rows.length ? `<div class="set-sec">لن يستطيع هؤلاء رؤية منشوراتك أو مراسلتك</div><div class="set-card" id="bl">${rows.map(u =>
      `<div class="sr" data-id="${u.id}">${A.avatar(u, 42)}<div class="sr-l"><div class="p-name">${A.esc(u.display_name || u.username)}${u.is_verified ? A.verified : ''}</div><div class="p-sub" style="direction:ltr;text-align:right">@${A.esc(u.username)}</div></div>
      <button class="btn ghost sm" data-un="${u.id}" style="margin:0">إلغاء الحظر</button></div>`).join('')}</div>` : empty;
    const bl = body.querySelector('#bl');
    if (bl) bl.onclick = async e => {
      const b = e.target.closest('[data-un]');
      if (!b) return;
      b.disabled = true;
      const { error: er } = await A.sb.from('user_blocks').delete().eq('blocker_id', me().id).eq('blocked_id', b.dataset.un);
      if (er) { b.disabled = false; return A.toast('تعذر إلغاء الحظر', 'err'); }
      b.closest('.sr').remove();
      A.toast('تم إلغاء الحظر', 'ok');
      if (!bl.children.length) body.innerHTML = empty;
    };
  }

  /* ---------- العرض / اللغة / الوصول / التخزين ---------- */
  function display(body) {
    const draw = () => {
      body.innerHTML = '<div class="set-sec">المظهر</div>' + radio(Object.entries(MODES), mode());
      body.onclick = e => {
        const r = e.target.closest('[data-v]');
        if (!r) return;
        LS.set('theme_mode', r.dataset.v); applyMode(); draw();
      };
    };
    draw();
  }
  function language(body) {
    body.innerHTML = '<div class="set-sec">لغة التطبيق</div>' + radio([['ar', 'العربية']], 'ar') +
      '<div class="set-note">التطبيق متاح حالياً باللغة العربية مع دعم كامل للكتابة من اليمين إلى اليسار.</div>';
  }
  function access(body) {
    loadFonts(FONTS.map(f => f[0]));
    const sw = (id, label, sub, on) => `<button class="sr" id="${id}"><span class="sr-l">${label}<span class="sr-s">${sub}</span></span><span class="sw ${on ? 'on' : ''}"></span></button>`;
    const draw = () => {
      const cur = LS.get('a11y_font') || 'cairo';
      body.innerHTML = '<div class="set-sec">الخط العربي</div><div class="set-card">' + FONTS.map(f =>
        `<button class="sr" data-f="${f[0]}"><span class="sr-l" style="font-family:'${f[1]}',system-ui,sans-serif;font-size:19px;font-weight:400">${f[2]}<span class="sr-s" style="font-family:inherit;font-size:15px">أني عراقي، بلاد الرافدين</span></span>${f[0] === cur ? `<span class="chk">${A.icon('check')}</span>` : ''}</button>`).join('') + '</div>' +
        '<div class="set-note">يغيّر شكل الخط في كل التطبيق.</div>' +
        '<div class="set-sec">سهولة القراءة</div><div class="set-card">' +
        sw('ac-bold', 'نص عريض', 'يجعل الخطوط أثقل وأوضح', LS.get('a11y_bold') === '1') +
        sw('ac-hc', 'تباين عالٍ', 'يزيد وضوح النصوص الثانوية والحدود', LS.get('a11y_hc') === '1') + '</div>' +
        '<div class="set-card" style="margin-top:18px"><button class="sr" id="ac-reset"><span class="sr-l">إعادة الضبط<span class="sr-s">إرجاع إعدادات الخطوط وسهولة القراءة للوضع الافتراضي</span></span></button></div>';
    };
    draw();
    body.onclick = e => {
      const r = e.target.closest('[data-f]');
      if (r) { LS.set('a11y_font', r.dataset.f); applyAccess(); draw(); return; }
      const t = e.target.closest('#ac-bold, #ac-hc');
      if (t) { const k = t.id === 'ac-bold' ? 'a11y_bold' : 'a11y_hc'; LS.get(k) === '1' ? LS.del(k) : LS.set(k, '1'); applyAccess(); draw(); return; }
      if (e.target.closest('#ac-reset')) { ['a11y_font', 'a11y_bold', 'a11y_hc'].forEach(LS.del); applyAccess(); draw(); A.toast('تمت إعادة الضبط', 'ok'); }
    };
  }
  function storage(body) {
    body.innerHTML = `<div class="set-sec">البيانات المحفوظة على هذا الجهاز</div><div class="set-card">
      <button class="sr" id="st-q"><span class="sr-i">${A.icon('search')}</span><span class="sr-l">مسح سجل البحث<span class="sr-s">يحذف عمليات البحث السابقة</span></span></button>
      <button class="sr" id="st-c"><span class="sr-i">${A.icon('trash')}</span><span class="sr-l">مسح الذاكرة المؤقتة<span class="sr-s">يحرر مساحة من ملفات التطبيق المحفوظة</span></span></button></div>
      <div class="set-note">لا يؤثر ذلك على حسابك أو منشوراتك أو رسائلك، ولن يتم تسجيل خروجك.</div>`;
    body.querySelector('#st-q').onclick = () => { LS.del('recent_q'); A.toast('تم مسح سجل البحث', 'ok'); };
    body.querySelector('#st-c').onclick = async () => {
      try { if (window.caches) { const ks = await caches.keys(); await Promise.all(ks.map(k => caches.delete(k))); } } catch (e) {}
      A.toast('تم مسح الذاكرة المؤقتة', 'ok');
    };
  }

  /* ---------- الرسائل الخاصة: حالة الاتصال وآخر ظهور ---------- */
  async function dms(body) {
    const { data } = await A.sb.from('user_presence').select('show_status').eq('user_id', me().id).maybeSingle();
    let on = data ? data.show_status : true;
    body.innerHTML = `<div class="set-sec">حالة الاتصال</div><div class="set-card"><button class="sr" id="pr-t"><span class="sr-l">إظهار آخر ظهور وحالة الاتصال<span class="sr-s">عند إيقافها لن تظهر حالتك للآخرين، ولن تشاهد أنت حالتهم أيضاً</span></span><span class="sw ${on ? 'on' : ''}"></span></button></div>
      <div class="set-note">مؤشر «يكتب الآن» وعلامات الإرسال والوصول والقراءة تعمل دائماً داخل المحادثة.</div>`;
    body.querySelector('#pr-t').onclick = async e => {
      const sw = e.currentTarget.querySelector('.sw'), v = !on;
      const { error } = await A.sb.rpc('set_presence_visibility', { v });
      if (error) return A.toast('تعذر الحفظ', 'err');
      on = v; sw.classList.toggle('on', on);
    };
  }

  const PAGES = {
    account: { title: 'الحساب', draw: account }, password: { title: 'كلمة المرور', draw: password, back: 'account' }, dms: { title: 'الرسائل الخاصة', draw: dms }, blocked: { title: 'الحسابات المحظورة', draw: blocked },
    display: { title: 'العرض', draw: display }, language: { title: 'اللغة', draw: language },
    access: { title: 'الخطوط وسهولة القراءة', draw: access }, storage: { title: 'تحرير المساحة', draw: storage }
  };

  A.pages.settings = {
    render(view, param) {
      const page = PAGES[(param || '').split('/')[0]];
      view.innerHTML = `<div class="set"><div class="set-head"><button class="icon-btn" id="s-back" aria-label="رجوع">${A.icon('arrow')}</button>
        <h1>${page ? page.title : 'الإعدادات والخصوصية'}</h1></div><div class="set-body" id="s-body"></div></div>`;
      view.querySelector('#s-back').onclick = () => {
        if (page) location.hash = page.back ? '#/settings/' + page.back : '#/settings';
        else history.length > 1 ? history.back() : (location.hash = '#/home');
      };
      const body = view.querySelector('#s-body');
      page ? page.draw(body) : main(body);
    }
  };
})();