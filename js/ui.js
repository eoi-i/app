window.App = window.App || { pages: {}, state: {} };
const A = App;

A.icons = {
  home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  bell:'<path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 01-3.4 0"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>',
  heart:'<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 000-7.8z"/>',
  comment:'<path d="M21 11.5a8.4 8.4 0 01-12.4 7.4L3 20.5l1.6-5.3A8.5 8.5 0 1121 11.5z"/>',
  repeat:'<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 013-3h15"/><path d="M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 01-3 3H3"/>',
  bookmark:'<path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>',
  share:'<path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v14"/>',
  moon:'<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  refresh:'<path d="M21 12a9 9 0 11-3-6.7L21 8"/><path d="M21 3v5h-5"/>'
};
A.icon = n => `<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${A.icons[n]}</svg>`;
A.verified = '<svg class="vb" viewBox="0 0 24 24"><path fill="#1D9BF0" d="M12 1l2.6 2.1 3.3-.2 1.2 3.1 2.8 1.8-.9 3.2.9 3.2-2.8 1.8-1.2 3.1-3.3-.2L12 23l-2.6-2.1-3.3.2-1.2-3.1-2.8-1.8.9-3.2-.9-3.2 2.8-1.8 1.2-3.1 3.3.2z"/><path d="M8 12l3 3 5-6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* شعارات الفئات: أيقونة ملوّنة تظهر جنب الاسم بدون كلمة */
A.CAT_BADGES = {
  'منظمة سياسية': ['#1F4E9C', 'M3 21h18M5 21V10M9 21V10M15 21V10M19 21V10M2 10l10-7 10 7z'],
  'حركة مدنية': ['#0E8A6B', 'M9 11a3 3 0 100-6 3 3 0 000 6zM3 20a6 6 0 0112 0M17 11a2.5 2.5 0 100-5M21 19a5 5 0 00-4-4.9'],
  'صانع محتوى': ['#E0457B', 'M3 7h12v10H3zM15 11l6-3v8l-6-3'],
  'كاتب': ['#7A5230', 'M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z'],
  'شاعر': ['#8E44AD', 'M20 4c-8 0-13 5-13 12M20 4c0 8-5 13-13 13M4 20l5-5'],
  'فنان': ['#E8743B', 'M12 3a9 9 0 100 18c1.5 0 2-1 1.5-2s0-2 1.5-2h2a3 3 0 003-3c0-5-4-11-8-11zM8 11h.01M12 7h.01M16 9h.01'],
  'مصمم': ['#D6336C', 'M3 3h18v18H3zM3 9h18M9 9v12'],
  'مبرمج': ['#2D3748', 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16'],
  'مطوّر ألعاب': ['#6C3FD1', 'M6 8h12a4 4 0 014 4v2a3 3 0 01-5.5 1.5L15 14H9l-1.5 1.5A3 3 0 012 14v-2a4 4 0 014-4zM8 10v4M6 12h4M16 11h.01M18 13h.01'],
  'صحفي': ['#546E7A', 'M4 4h13v16H6a2 2 0 01-2-2zM17 8h3v10a2 2 0 01-2 2M7 8h7M7 12h7M7 16h4'],
  'رياضي': ['#E5A100', 'M8 4h8v5a4 4 0 01-8 0zM8 6H4v1a4 4 0 004 4M16 6h4v1a4 4 0 01-4 4M12 13v4M8 21h8M10 17h4'],
  'موسيقي': ['#C2185B', 'M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zM21 16a3 3 0 11-6 0 3 3 0 016 0z'],
  'مصوّر': ['#00838F', 'M3 8h4l2-3h6l2 3h4v12H3zM12 17a4 4 0 100-8 4 4 0 000 8z'],
  'مدوّن': ['#F57C00', 'M4 11a9 9 0 019 9M4 4a16 16 0 0116 16M5 19h.01'],
  'متجر': ['#2E7D32', 'M3 9l2-5h14l2 5M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0M5 12v8h14v-8'],
  'شركة': ['#37474F', 'M3 7h18v13H3zM8 7V4h8v3M3 13h18'],
  'مؤسسة تعليمية': ['#1565C0', 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5'],
  'شخصية عامة': ['#B8860B', 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.2 6.5 20.2l1-6.2L3 9.6l6.2-.9z']
};
A.catBadge = (cat, size) => {
  if (!cat) return '';
  const b = A.CAT_BADGES[cat] || ['#0B7A66', 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.2 6.5 20.2l1-6.2L3 9.6l6.2-.9z'];
  const s = size || 18;
  return `<span class="cbd" title="${String(cat).replace(/"/g, '&quot;')}" style="background:${b[0]};width:${s}px;height:${s}px"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="${b[1]}"/></svg></span>`;
};
(function () { const s = document.createElement('style'); s.textContent = '.cbd{display:inline-grid;place-items:center;border-radius:50%;vertical-align:-3px;margin-inline-start:4px;flex:none}.cbd svg{width:62%;height:62%}'; document.head.appendChild(s); })();

/* ===== مؤشرات التحميل المشتركة ===== */
A.dots = '<span class="ld-dots"><i></i><i></i><i></i></span>';
A.eq = (n) => '<span class="ld-eq">' + '<i></i>'.repeat(n || 5) + '</span>';
A.orbit = '<div class="ld-orbit"><span class="o-c"></span><span class="o-r"><i></i></span><span class="o-r o2"><i></i></span></div>';
(function () {
  const s = document.createElement('style');
  s.textContent = `.ld-dots{display:inline-flex;gap:6px;align-items:center;height:20px}.ld-dots i{width:9px;height:9px;border-radius:50%;background:var(--primary-2,#E5B53D);animation:ldb 1s infinite ease-in-out}.ld-dots i:nth-child(2){animation-delay:.15s}.ld-dots i:nth-child(3){animation-delay:.3s}
@keyframes ldb{0%,70%,100%{transform:translateY(0);opacity:.55}35%{transform:translateY(-9px);opacity:1}}
.ld-eq{display:inline-flex;gap:3px;align-items:center;height:26px}.ld-eq i{width:4px;height:100%;border-radius:2px;background:var(--primary-2,#E5B53D);transform-origin:center;animation:ldeq .9s infinite ease-in-out}.ld-eq i:nth-child(1){animation-delay:-.7s}.ld-eq i:nth-child(2){animation-delay:-.4s}.ld-eq i:nth-child(3){animation-delay:-.1s}.ld-eq i:nth-child(4){animation-delay:-.55s}.ld-eq i:nth-child(5){animation-delay:-.25s}
@keyframes ldeq{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
.ld-orbit{position:relative;width:96px;height:96px;display:grid;place-items:center}.ld-orbit .o-c{width:30px;height:30px;border-radius:50%;background:radial-gradient(circle at 30% 30%,#fff,var(--primary-2,#E5B53D) 55%,var(--primary,#14A585));box-shadow:0 0 24px color-mix(in srgb,var(--primary-2,#E5B53D) 60%,transparent)}
.ld-orbit .o-r{position:absolute;inset:14px;border:1px solid rgba(255,255,255,.14);border-radius:50%;animation:ldo 1.6s linear infinite}.ld-orbit .o-r i{position:absolute;top:-4px;left:50%;margin-left:-4px;width:8px;height:8px;border-radius:50%;background:#fff}.ld-orbit .o2{inset:0;animation-duration:2.6s;animation-direction:reverse}
@keyframes ldo{to{transform:rotate(360deg)}}
.ld-bar{width:min(240px,70vw);height:8px;border-radius:4px;background:rgba(255,255,255,.18);overflow:hidden}.ld-bar i{display:block;height:100%;width:0;border-radius:4px;background:linear-gradient(90deg,var(--primary,#14A585),var(--primary-2,#E5B53D));transition:width .35s ease}.ld-pct{font-size:22px;font-weight:800;font-variant-numeric:tabular-nums}
.btn.ld{position:relative;color:transparent!important;pointer-events:none}.btn.ld::after{content:'';position:absolute;inset:0;margin:auto;width:22px;height:22px;border-radius:50%;border:3px solid rgba(0,0,0,.2);border-top-color:var(--on-primary,#111);animation:spn .8s linear infinite}
.ld-wait{display:flex;justify-content:center;padding:26px 0}`;
  document.head.appendChild(s);
})();

A.esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

A.linkify = t => A.esc(t)
  .replace(/#([^\s#@!.,،؛:;?؟()&]{1,50})/g, '<span class="tag">#$1</span>')
  .replace(/@([a-zA-Z0-9_.]{3,30})/g, '<span class="mention">@$1</span>');

A.timeAgo = iso => {
  const s = (Date.now() - new Date(iso)) / 1000;
  if (s < 60) return 'الآن';
  if (s < 3600) return `منذ ${Math.floor(s / 60)} د`;
  if (s < 86400) return `منذ ${Math.floor(s / 3600)} س`;
  if (s < 604800) return `منذ ${Math.floor(s / 86400)} ي`;
  return new Date(iso).toLocaleDateString('ar-IQ');
};

A.avatar = (u, size = 42) => {
  const st = `width:${size}px;height:${size}px;font-size:${size * 0.42}px`;
  if (u && u.avatar_url) return `<img class="avatar" style="${st}" src="${A.esc(u.avatar_url)}" alt="">`;
  const ch = A.esc(((u && (u.display_name || u.username)) || '?').trim().charAt(0).toUpperCase());
  return `<div class="avatar" style="${st}">${ch}</div>`;
};

A.toast = (m, t = '') => {
  const e = document.createElement('div');
  e.className = 'toast ' + t;
  e.textContent = m;
  document.getElementById('toasts').appendChild(e);
  setTimeout(() => e.classList.add('out'), 2600);
  setTimeout(() => e.remove(), 3000);
};

A.theme = {
  init() {
    let t = null;
    try { t = localStorage.getItem('theme'); } catch (e) {}
    this.set(t || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  },
  set(t) {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('theme', t); } catch (e) {}
    const m = document.querySelector('meta[name=theme-color]');
    if (m) m.content = t === 'dark' ? '#0A110F' : '#0E7C66';
  },
  toggle() { this.set(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); }
};