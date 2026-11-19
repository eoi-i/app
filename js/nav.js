(function () {
  const A = App;
  const inS = h => /^#\/settings(\/|$)/.test(h || '');
  const isMain = h => /^#\/settings\/?$/.test(h || '');
  let prev = '';

  // وسم الصفحة الحالية على الجسم لإظهار/إخفاء أزرار الشريط العلوي بحسب الصفحة
  const baseRoute = A.route;
  A.route = function () {
    baseRoute.apply(this, arguments);
    let pg = A.current;
    if (pg === 'u') {
      let u = '';
      try { u = decodeURIComponent(location.hash.split('/')[2] || '').toLowerCase(); } catch (e) {}
      if (A.state.profile && u === A.state.profile.username) pg = 'profile';
    }
    document.body.dataset.page = pg;
  };

  // تتبع عمق التنقل داخل الإعدادات (يُحفظ في سجل المتصفح فيصمد بعد التحديث)
  function track() {
    const h = location.hash;
    if (A.wantMain && inS(h)) {
      A.wantMain = false;
      if (!isMain(h)) { A.keepDepth = true; location.replace('#/settings'); return; }
    }
    if (!inS(h)) return;
    const st = history.state;
    if (st && typeof st.sd === 'number') { A.sdepth = st.sd; A.hasPrev = !!st.hp; return; }
    if (A.keepDepth) A.keepDepth = false;
    else if (inS(prev)) A.sdepth = (A.sdepth || 1) + 1;
    else { A.sdepth = 1; A.hasPrev = !!prev; }
    history.replaceState({ sd: A.sdepth, hp: A.hasPrev ? 1 : 0 }, '');
  }

  window.addEventListener('hashchange', e => {
    try { prev = new URL(e.oldURL).hash; } catch (x) { prev = ''; }
    track();
  });
  track();

  // سهم الرجوع في كل صفحات الإعدادات
  document.addEventListener('click', e => {
    const b = e.target.closest('#s-back');
    if (!b) return;
    e.stopPropagation();
    e.preventDefault();
    if (A.navBusy) return;
    A.navBusy = true;
    setTimeout(() => { A.navBusy = false; }, 700);
    const d = A.sdepth || 1;
    if (isMain(location.hash)) {
      if (A.hasPrev) history.go(-d); else location.replace('#/home');
    } else if (d > 1) {
      A.wantMain = true;
      history.go(-(d - 1));
    } else {
      A.keepDepth = true;
      location.replace('#/settings');
    }
  }, true);

  // النوافذ المنبثقة (المنشور المفتوح، المشاركة، التعليقات، تعديل الملف...):
  // زر الرجوع في الهاتف يغلق النافذة فقط ويبقيك في نفس الصفحة
  const ovs = [];
  let skip = 0;
  const isOv = n => n.nodeType === 1 && (n.classList.contains('fx') || n.classList.contains('cr'));

  new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes.forEach(n => {
        if (!isOv(n) || ovs.includes(n)) return;
        ovs.push(n);
        history.pushState({ ov: 1 }, '');
      });
      m.removedNodes.forEach(n => {
        const i = ovs.indexOf(n);
        if (i < 0) return;
        ovs.splice(i, 1);
        if (history.state && history.state.ov) { skip++; history.back(); }
      });
    });
  }).observe(document.body, { childList: true });

  window.addEventListener('popstate', () => {
    if (skip > 0) { skip--; return; }
    if (ovs.length) { ovs.pop().remove(); return; }
    if (history.state && history.state.ov) history.back();
  });
})();