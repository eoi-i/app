(function () {
  const A = App;
  const LS = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  Object.assign(A.icons, {
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    check: '<path d="M20 6L9 17l-5-5"/>'
  });

  // [primary, primary2, accent, bg, card, text, muted, line, chip, on-primary]
  const THEMES = [
    { id: 'default', name: 'عراقي', sw: ['#0A110F', '#121C19', '#0E7C66', '#14A585', '#D4A017', '#EAF2EE'] },
    { id: 'ocean', name: 'المحيط', sw: ['#05161A', '#072E33', '#0C7075', '#0F969C', '#6DA5C0', '#294D61'],
      l: ['#0C7075', '#0F969C', '#6DA5C0', '#EAF4F6', '#FFFFFF', '#05161A', '#4F7480', '#D3E6EA', '#DDEDF0', '#fff'],
      d: ['#0F969C', '#0C7075', '#6DA5C0', '#05161A', '#072E33', '#E6F6F8', '#7FA9B5', '#124249', '#0B3A41', '#fff'] },
    { id: 'rose', name: 'الورد', sw: ['#800021', '#881144', '#C41E5A', '#C24366', '#FF69B4', '#FFE4D8'],
      l: ['#C41E5A', '#C24366', '#FF69B4', '#FFF3EE', '#FFFFFF', '#3A0A1E', '#9A5A6E', '#F6D9D0', '#FDE6DF', '#fff'],
      d: ['#C24366', '#C41E5A', '#FF69B4', '#26000F', '#3A0A1E', '#FFE4D8', '#E0A3B5', '#55122C', '#470F26', '#fff'] },
    { id: 'pastel', name: 'الباستيل', sw: ['#F7CBCA', '#DDD3D3', '#F1F7F7', '#D5E5E5', '#BDD7D8', '#5D6B6B'],
      l: ['#4F6667', '#6E9496', '#E0959A', '#F1F7F7', '#FFFFFF', '#2F3A3A', '#5D6B6B', '#D5E5E5', '#E3EEEE', '#fff'],
      d: ['#F7CBCA', '#BDD7D8', '#D5E5E5', '#1B2324', '#243031', '#F1F7F7', '#BDD7D8', '#33454A', '#2B3A3C', '#2A2224'] },
    { id: 'mono', name: 'أبيض وأسود', sw: ['#0B0B0B', '#1A1A1A', '#333333', '#6B6B6B', '#D9D9D9', '#FFFFFF'],
      l: ['#1A1A1A', '#333333', '#6B6B6B', '#F4F4F4', '#FFFFFF', '#0B0B0B', '#6B6B6B', '#E2E2E2', '#EDEDED', '#fff'],
      d: ['#FFFFFF', '#D9D9D9', '#6B6B6B', '#0B0B0B', '#1A1A1A', '#FFFFFF', '#9A9A9A', '#2A2A2A', '#222222', '#0B0B0B'] },
    { id: 'steel', name: 'الفولاذي', sw: ['#06141B', '#11212D', '#253745', '#4A5C6A', '#9BA8AB', '#CCD0CF'],
      l: ['#253745', '#4A5C6A', '#9BA8AB', '#E9EDEE', '#FFFFFF', '#06141B', '#4A5C6A', '#D3D9DB', '#DEE3E5', '#fff'],
      d: ['#6C8397', '#4A5C6A', '#9BA8AB', '#06141B', '#11212D', '#E6EAEA', '#9BA8AB', '#253745', '#1A2C3A', '#fff'] },
    { id: 'emerald', name: 'الزمرد', sw: ['#051F20', '#0B2B26', '#163832', '#235347', '#8EB69B', '#DAF1DE'],
      l: ['#235347', '#3A8C71', '#8EB69B', '#EEF7F0', '#FFFFFF', '#051F20', '#3F6B5C', '#D5E8DA', '#E2F0E6', '#fff'],
      d: ['#3A8C71', '#235347', '#8EB69B', '#051F20', '#0B2B26', '#DAF1DE', '#8EB69B', '#163832', '#103029', '#fff'] },
    { id: 'violet', name: 'البنفسجي', sw: ['#0B0720', '#25134D', '#6A2FC8', '#9D71E8', '#D1B8FF', '#F2E9FF'],
      l: ['#6A2FC8', '#9D71E8', '#D1B8FF', '#F5EFFF', '#FFFFFF', '#0B0720', '#6B54A0', '#E3D6FA', '#EDE3FD', '#fff'],
      d: ['#9D71E8', '#6A2FC8', '#D1B8FF', '#0B0720', '#1A0F3A', '#F2E9FF', '#B49DE6', '#2E1A5E', '#25134D', '#fff'] }
  ];

  const v = (a, dark) => `--primary:${a[0]};--primary-2:${a[1]};--gold:${a[2]};--bg:${a[3]};--card:${a[4]};--text:${a[5]};--muted:${a[6]};--line:${a[7]};--chip:${a[8]};--on-primary:${a[9]};` +
    `--grad:linear-gradient(135deg,${a[0]} 0%,${a[1]} 55%,${a[2]} 130%);--shadow:0 2px 14px rgba(0,0,0,${dark ? '.45' : '.08'});`;

  let css = THEMES.filter(t => t.l).map(t => `[data-ct="${t.id}"]{${v(t.l, 0)}}[data-ct="${t.id}"][data-theme="dark"]{${v(t.d, 1)}}`).join('');
  css += '.btn,.nav-plus,.cat.on,.pub.ready,.cm-send,.me .bb,.cv-n,.avatar,.hero,.toast.ok{color:var(--on-primary,#fff)}.btn.ghost{color:var(--text)}.btn.danger{color:#fff}';
  css += '.ct-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '.ct{position:relative;background:var(--card);border-radius:16px;box-shadow:var(--shadow);padding:10px;display:flex;flex-direction:column;gap:8px;text-align:start;font-weight:700;border:2px solid transparent;transition:.15s}' +
    '.ct.on{border-color:var(--primary)}.ct:active{transform:scale(.97)}' +
    '.ct-sw{display:flex;height:34px;border-radius:10px;overflow:hidden}.ct-sw i{flex:1;display:block}' +
    '.ct-ok{position:absolute;top:6px;inset-inline-end:6px;width:20px;height:20px;border-radius:50%;background:var(--primary);color:var(--on-primary,#fff);display:grid;place-items:center}' +
    '.ct-ok .ic{width:13px;height:13px}';
  const st = document.createElement('style');
  st.id = 'ct-style'; st.textContent = css;
  document.head.appendChild(st);

  const MODES = [['auto', 'حسب الجهاز'], ['light', 'فاتح'], ['dark', 'داكن']];
  const mode = () => LS.get('theme_mode') || 'auto';
  const ctId = () => LS.get('color_theme') || 'default';

  function applyMode() {
    const m = mode();
    A.theme.set(m === 'dark' || (m === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light');
  }
  function syncMeta() {
    const m = document.querySelector('meta[name=theme-color]');
    if (!m || ctId() === 'default') return;
    requestAnimationFrame(() => {
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
      if (bg) m.content = bg;
    });
  }
  function applyCT() {
    const id = ctId();
    if (id === 'default') delete document.documentElement.dataset.ct; else document.documentElement.dataset.ct = id;
    A.theme.set(document.documentElement.dataset.theme || 'light');
  }

  const baseSet = A.theme.set;
  A.theme.set = function (t) { baseSet.call(this, t); syncMeta(); };
  const baseInit = A.theme.init;
  A.theme.init = function () { baseInit.call(this); applyCT(); };

  function display(body) {
    const draw = () => {
      const cm = mode(), ct = ctId();
      body.innerHTML = `<div class="set-sec">المظهر</div><div class="set-card">${MODES.map(([k, l]) =>
        `<button class="sr" data-m="${k}"><span class="sr-l">${l}</span>${k === cm ? `<span class="chk">${A.icon('check')}</span>` : ''}</button>`).join('')}</div>
        <div class="set-sec">ألوان التطبيق</div><div class="ct-grid">${THEMES.map(t =>
        `<button class="ct ${t.id === ct ? 'on' : ''}" data-tid="${t.id}"><div class="ct-sw">${t.sw.map(c => `<i style="background:${c}"></i>`).join('')}</div><span>${t.name}</span>${t.id === ct ? `<b class="ct-ok">${A.icon('check')}</b>` : ''}</button>`).join('')}</div>`;
    };
    draw();
    body.onclick = e => {
      const m = e.target.closest('[data-m]');
      if (m) { LS.set('theme_mode', m.dataset.m); applyMode(); draw(); return; }
      const c = e.target.closest('[data-tid]');
      if (c) { LS.set('color_theme', c.dataset.tid); applyCT(); draw(); }
    };
  }

  const prev = A.pages.settings.render;
  A.pages.settings.render = function (view, param) {
    if ((param || '').split('/')[0] !== 'display') return prev.call(this, view, param);
    view.innerHTML = `<div class="set"><div class="set-head"><button class="icon-btn" id="s-back" aria-label="رجوع">${A.icon('arrow')}</button><h1>العرض</h1></div><div class="set-body" id="s-body"></div></div>`;
    view.querySelector('#s-back').onclick = () => { location.hash = '#/settings'; };
    display(view.querySelector('#s-body'));
  };
})();