(function () {
  const A = App;
  const NAV = [['home', 'home', 'الرئيسية'], ['explore', 'search', 'استكشاف'], ['create', 'plus', ''], ['notifications', 'bell', 'التفاعلات'], ['profile', 'user', 'حسابي']];

  const soon = (title, phase) => ({
    render(v) { v.innerHTML = `<div class="empty"><h3 style="color:var(--text)">${title}</h3><p>تُفعَّل في ${phase}</p></div>`; }
  });
  A.pages.explore = soon('الاستكشاف والبحث', 'المرحلة 8');
  A.pages.notifications = soon('التفاعلات والإشعارات', 'المرحلة 7');

  A.buildShell = function () {
    document.getElementById('app').innerHTML = `
      <header class="topbar"><div class="logo">أني عراقي</div>
        <div class="top-actions"><button class="icon-btn" id="b-theme" aria-label="الوضع الليلي"></button>
        <button class="icon-btn" id="b-refresh" aria-label="تحديث">${A.icon('refresh')}</button></div></header>
      <main id="view"></main>
      <nav class="bottom-nav">${NAV.map(([k, ic, l]) => k === 'create'
        ? `<button class="nav-plus" data-go="${k}" aria-label="نشر">${A.icon(ic)}</button>`
        : `<button class="nav-item" data-go="${k}">${A.icon(ic)}<span>${l}</span></button>`).join('')}</nav>`;
    document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { location.hash = '#/' + b.dataset.go; });
    const th = document.getElementById('b-theme');
    const ic = () => th.innerHTML = A.icon(document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon');
    ic(); th.onclick = () => { A.theme.toggle(); ic(); };
    const rf = document.getElementById('b-refresh');
    rf.onclick = async () => {
      rf.classList.add('spin');
      const pg = A.pages[A.current];
      if (pg && pg.refresh) await pg.refresh();
      setTimeout(() => rf.classList.remove('spin'), 700);
    };
  };

  // حفظ موضع التمرير لكل صفحة واسترجاعه عند الرجوع
  try { history.scrollRestoration = 'manual'; } catch (e) {}
  const POS = {}; let curKey = null, popped = false;
  window.addEventListener('popstate', () => { popped = true; });

  A.route = function () {
    const view = document.getElementById('view');
    if (!view) return;
    if (curKey) POS[curKey] = window.scrollY;
    const back = popped; popped = false;
    const parts = location.hash.replace(/^#\/?/, '').split('/');
    let name = parts[0] || 'home', param = '';
    try { param = decodeURIComponent(parts.slice(1).join('/')); } catch (e) {}
    if (!A.pages[name]) { name = 'home'; param = ''; }
    A.current = name;
    const mine = name === 'profile' || (name === 'u' && A.state.profile && param.toLowerCase() === A.state.profile.username);
    const key = mine ? 'profile' : name;
    document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.go === key));
    const fresh = view.cloneNode(false);
    view.replaceWith(fresh);
    A.pages[name].render(fresh, param);
    const pk = name + '/' + param, prevK = curKey;
    curKey = pk;
    // رجوع بزر الجهاز أو بسهم الصفحة الأم (مثل الإعدادات الفرعية → الإعدادات)
    const up = !!prevK && prevK !== pk && prevK.startsWith(pk);
    const y = (back || up) && name !== 'home' ? POS[pk] : 0;
    window.scrollTo(0, 0);
    if (y > 0) {
      // نخفي الصفحة لحد ما يجهز المحتوى ويتحرك للموضع المحفوظ، حتى ما يبين القفز من الأعلى
      fresh.style.visibility = 'hidden';
      let n = 0;
      const tick = () => {
        if (curKey !== pk) return;
        const ready = document.documentElement.scrollHeight >= y + innerHeight - 4;
        if (ready || n++ > 40) {
          window.scrollTo(0, y);
          fresh.style.visibility = '';
          return;
        }
        setTimeout(tick, 25);
      };
      tick();
    }
  };
  window.addEventListener('hashchange', () => A.route());
})();