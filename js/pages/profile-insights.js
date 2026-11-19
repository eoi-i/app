(function () {
  const A = App;
  Object.assign(A.icons, {
    chart: '<path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/>',
    eye: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
    send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
    link: '<path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1"/><path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>',
    dots: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    spark: '<path d="M12 2l2.4 6.6L21 11l-6.6 2.4L12 20l-2.4-6.6L3 11l6.6-2.4z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2 21a7 7 0 0114 0M16 4.5a3.5 3.5 0 010 7M18 21a6 6 0 00-3-5.2"/>',
    userx: '<circle cx="9" cy="8" r="3.5"/><path d="M2 21a7 7 0 0114 0M17 9l5 5M22 9l-5 5"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 01-10 0zM17 5h3v2a3 3 0 01-3 3M7 5H4v2a3 3 0 003 3"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M10 9l5 3-5 3z"/>',
    walk: '<path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    next: '<path d="M9 5l7 7-7 7"/>',
    prev: '<path d="M15 5l-7 7 7 7"/>'
  });

  const stl = document.createElement('style');
  stl.textContent = `
.pf-dash{display:flex;align-items:center;gap:12px;width:100%;margin:14px 0 0;padding:14px 16px;border-radius:18px;text-align:start;color:#fff;background:linear-gradient(135deg,#0E7C66,#14A585);box-shadow:0 8px 22px -10px rgba(20,165,133,.7);position:relative;overflow:hidden;transition:transform .15s}
.pf-dash:active{transform:scale(.98)}
.pf-dash::after{content:'';position:absolute;width:120px;height:120px;border-radius:50%;inset-inline-end:-30px;top:-50px;background:radial-gradient(circle,rgba(255,255,255,.28),transparent 70%)}
.pf-dash div{flex:1;position:relative;z-index:1}
.pf-dash b{display:block;font-weight:800;font-size:15.5px}
.pf-dash small{display:block;opacity:.9;margin-top:3px;font-size:13px}
.pf-dash .ic{width:24px;height:24px;position:relative;z-index:1}
.pf-two{display:flex;gap:8px;margin:10px 0 16px}
.pf-two .btn{flex:1;padding:11px 4px;font-size:13.5px;white-space:nowrap}

.in{--g1:#0E7C66;--g2:#14A585;--gold:#E5B53D;--chip:rgba(20,165,133,.12);direction:rtl;padding-bottom:30px}
.in *{box-sizing:border-box}
.in-per{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 10px;margin:0 -2px;scrollbar-width:none}
.in-per::-webkit-scrollbar{display:none}
.in-per button{flex:none;padding:9px 16px;border-radius:14px;background:var(--chip);font-weight:800;font-size:13.5px;color:#34D399;outline:none;border:0;-webkit-tap-highlight-color:transparent;transition:.25s}
.in-per button:focus{outline:none}
.in-per button.on{color:#fff;background:linear-gradient(135deg,var(--g1),var(--g2));box-shadow:0 6px 14px -6px rgba(20,165,133,.8)}
.in-sub{display:flex;align-items:center;justify-content:center;gap:10px;padding:10px 12px;border-radius:16px;background:var(--chip);margin-bottom:12px;animation:inRise .4s both}
.in-sub b{flex:1;text-align:center;font-weight:800;font-size:14.5px}
.in-sub button.ar{width:34px;height:34px;border-radius:12px;display:grid;place-items:center;background:var(--card)}
.in-sub button.ar[disabled]{opacity:.35}
.in-sub .ic{width:18px;height:18px}
.in-sub label{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--muted);font-weight:700}
.in-sub input{background:var(--card);color:var(--text);border:1px solid var(--line);border-radius:10px;padding:7px 8px;font-family:inherit;font-size:13px;max-width:130px}
.in-sub .go{padding:8px 14px;border-radius:12px;background:linear-gradient(135deg,var(--g1),var(--g2));color:#fff;font-weight:800;font-size:13px}
.in-rng{color:var(--muted);font-size:12.5px;font-weight:700;text-align:center;margin:-2px 0 10px}

.in-hero{position:relative;overflow:hidden;border-radius:24px;padding:18px 16px 10px;color:#fff;background:linear-gradient(140deg,#0B5F4F 0%,#0E7C66 45%,#14A585 100%);box-shadow:0 18px 34px -18px rgba(20,165,133,.85)}
.in-hero::before,.in-hero::after{content:'';position:absolute;border-radius:50%;pointer-events:none;filter:blur(2px)}
.in-hero::before{width:190px;height:190px;inset-inline-end:-60px;top:-80px;background:radial-gradient(circle,rgba(229,181,61,.45),transparent 70%);animation:inFloat 7s ease-in-out infinite}
.in-hero::after{width:150px;height:150px;inset-inline-start:-50px;bottom:-60px;background:radial-gradient(circle,rgba(255,255,255,.22),transparent 70%);animation:inFloat 9s ease-in-out infinite reverse}
@keyframes inFloat{50%{transform:translate(14px,10px) scale(1.12)}}
.in-hl{position:relative;z-index:1;display:flex;align-items:center;gap:6px;font-size:13.5px;font-weight:700;opacity:.92}
.in-hl .ic{width:17px;height:17px}
.in-num{position:relative;z-index:1;font-size:46px;font-weight:800;line-height:1.25;letter-spacing:-.5px;text-shadow:0 4px 18px rgba(0,0,0,.25)}
.in-pill{position:relative;z-index:1;display:inline-flex;margin-top:2px;align-items:center;gap:4px;padding:3px 11px;border-radius:20px;font-size:12.5px;font-weight:800;background:rgba(255,255,255,.2);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.in-pill.down{background:rgba(229,72,77,.35)}
.in-pl{display:inline-flex;align-items:center;padding:2px 9px;border-radius:12px;font-size:12px;font-weight:800;background:rgba(22,163,74,.16);color:#16a34a}
.in-pl.down{background:rgba(229,72,77,.16);color:#e5484d}
.in-pl.eq{background:var(--chip);color:var(--muted)}

.in-chart{position:relative;z-index:1;margin:14px -4px 0;direction:ltr;touch-action:pan-y;user-select:none;-webkit-user-select:none;color:#14A585}
.in-chart.hh{color:#fff}
.in-chart svg{display:block;width:100%;height:auto;overflow:visible;background:none}
.in-line{fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:var(--len);stroke-dashoffset:var(--len);animation:inDraw 1.2s .15s ease forwards}
.in-chart.hh .in-line{filter:drop-shadow(0 3px 6px rgba(0,0,0,.25))}
@keyframes inDraw{to{stroke-dashoffset:0}}
.in-area{opacity:0;animation:inFade .9s .6s ease forwards}
@keyframes inFade{to{opacity:1}}
.in-guide{stroke:currentColor;stroke-opacity:.55;stroke-width:1;stroke-dasharray:3 3;opacity:0;transition:opacity .15s}
.in-dot{fill:#fff;stroke:var(--gold);stroke-width:3;opacity:0;transition:opacity .15s}
.in-tip{position:absolute;top:-6px;transform:translateX(-50%);padding:4px 10px;border-radius:10px;font-size:12px;font-weight:800;white-space:nowrap;background:rgba(0,0,0,.65);color:#fff;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);opacity:0;transition:opacity .15s;pointer-events:none;z-index:3}
.in-ax{display:flex;justify-content:space-between;direction:ltr;font-size:11px;color:var(--muted);margin:2px 6px 2px;font-weight:600}
.in-hero .in-ax{color:rgba(255,255,255,.8);position:relative;z-index:1}

.in-card{padding:16px;border-radius:22px;background:var(--card);border:1px solid var(--line);box-shadow:var(--shadow);margin-bottom:12px}
.in-ct{display:flex;align-items:center;gap:8px;font-weight:800;font-size:15.5px;margin-bottom:12px}
.in-ct .ic{width:18px;height:18px;color:var(--gold)}
.in-ct .sp{flex:1}
.in-tri{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px}
.in-tri div{padding:10px 4px;border-radius:14px;background:var(--chip);text-align:center}
.in-tri b{display:block;font-size:20px;font-weight:800;line-height:1.3}
.in-tri small{color:var(--muted);font-size:11.5px;font-weight:700}

.in-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px}
.in-st{position:relative;overflow:hidden;padding:12px 6px 10px;border-radius:20px;text-align:center;background:var(--card);border:1px solid var(--line);box-shadow:var(--shadow)}
.in-st .ico{width:34px;height:34px;border-radius:12px;margin:0 auto 6px;display:grid;place-items:center;color:#fff}
.in-st .ico .ic{width:18px;height:18px}
.in-st.c1 .ico{background:linear-gradient(135deg,#8B5CF6,#A78BFA)}
.in-st.c2 .ico{background:linear-gradient(135deg,#14A585,#34D399)}
.in-st.c3 .ico{background:linear-gradient(135deg,#F43F5E,#FB7185)}
.in-st.c4 .ico{background:linear-gradient(135deg,#3B82F6,#60A5FA)}
.in-st.c5 .ico{background:linear-gradient(135deg,#E5B53D,#F59E0B)}
.in-st.c6 .ico{background:linear-gradient(135deg,#06B6D4,#38BDF8)}
.in-st b{display:block;font-size:21px;font-weight:800;line-height:1.3}
.in-st small{display:block;color:var(--muted);font-size:11.5px;font-weight:700;margin-bottom:4px}

.in-row2{display:grid;grid-template-columns:104px 1fr;gap:12px;align-items:center}
.in-ring{position:relative;width:96px;height:96px;margin:0 auto}
.in-ring svg{width:100%;height:100%;transform:rotate(-90deg)}
.in-ring circle{fill:none;stroke-width:9;stroke-linecap:round}
.in-ring .bg{stroke:var(--chip)}
.in-ring .fg{stroke:url(#inGrad);stroke-dasharray:264;stroke-dashoffset:264;transition:stroke-dashoffset 1.2s .3s cubic-bezier(.3,.9,.3,1)}
.in-ring b{position:absolute;inset:0;display:grid;place-items:center;font-size:18px;font-weight:800}
.in-bars{position:relative;display:flex;align-items:flex-end;gap:2px;height:92px;direction:ltr;touch-action:pan-y;user-select:none;-webkit-user-select:none}
.in-bars i{flex:1;min-width:1px;height:var(--h);border-radius:3px 3px 0 0;background:linear-gradient(180deg,var(--g2),var(--g1));opacity:.85;transform-origin:bottom;animation:inGrow .7s var(--d) cubic-bezier(.2,.9,.3,1) both;transition:opacity .15s}
.in-bars i.hi{opacity:1;filter:brightness(1.25)}
@keyframes inGrow{from{transform:scaleY(0)}}
.in-mini{display:flex;flex-direction:column;gap:10px}
.in-mini small{color:var(--muted);font-size:12px;font-weight:600}
.in-mini b{display:block;font-size:17px;font-weight:800;line-height:1.3}

.in-wk{display:grid;grid-template-columns:1fr;gap:12px}
.in-wr .h{display:flex;align-items:center;gap:8px;font-size:13.5px;font-weight:800;margin-bottom:6px}
.in-wr .h span{flex:1}
.in-bp{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--muted);font-weight:700;margin-top:4px}
.in-bp em{font-style:normal;width:62px;flex:none}
.in-bp .tr{flex:1;height:8px;border-radius:5px;background:var(--chip);overflow:hidden}
.in-bp .tr i{display:block;height:100%;width:0;border-radius:5px;transition:width 1s .3s cubic-bezier(.3,.9,.3,1)}
.in-bp .tr i.p{background:var(--muted);opacity:.55}
.in-bp .tr i.c{background:linear-gradient(90deg,var(--g1),var(--g2))}
.in-bp b{width:34px;text-align:end;color:var(--text);font-size:12.5px}

.in-pc{display:flex;align-items:center;gap:10px;padding:10px;border-radius:18px;background:var(--chip);margin-bottom:8px}
.in-pc .lb{font-size:11.5px;color:var(--muted);font-weight:800}
.in-th{width:50px;height:50px;border-radius:13px;object-fit:cover;background:var(--card);flex:none;overflow:hidden;display:grid;place-items:center;color:var(--muted)}
.in-th img,.in-th video{width:100%;height:100%;object-fit:cover;display:block}
.in-pc .mid{flex:1;min-width:0}
.in-pc .t{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;font-size:13.5px;font-weight:700;margin:1px 0 2px}
.in-pc small{color:var(--muted);font-size:12px}
.in-pc .em{color:var(--muted);font-size:13px;font-weight:700}

.in-top{display:flex;align-items:center;gap:10px;padding:10px;border-radius:18px;background:var(--card);border:1px solid var(--line);margin-bottom:9px}
.in-rk{width:28px;height:28px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:800;font-size:13px;color:#fff;background:var(--muted)}
.in-rk.r1{background:linear-gradient(135deg,#F5C84B,#D9A21B)}
.in-rk.r2{background:linear-gradient(135deg,#C9D1D9,#9AA5B1)}
.in-rk.r3{background:linear-gradient(135deg,#D9946A,#B36A3F)}
.in-top .mid{flex:1;min-width:0}
.in-top .t{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden;font-size:14px;font-weight:700}
.in-top small{display:block;color:var(--muted);font-size:11.5px;margin:2px 0 6px}
.in-bar{height:6px;border-radius:4px;background:var(--chip);overflow:hidden}
.in-bar i{display:block;height:100%;width:0;border-radius:4px;background:linear-gradient(90deg,var(--g1),var(--g2));transition:width 1s .35s cubic-bezier(.3,.9,.3,1)}
.in-note{color:var(--muted);font-size:12.5px;line-height:1.9;margin:14px 2px 6px;text-align:center}

.in-rise{opacity:0;transform:translateY(16px);animation:inRise .55s cubic-bezier(.2,.9,.3,1) forwards;animation-delay:calc(var(--i,0) * 60ms)}
@keyframes inRise{to{opacity:1;transform:none}}
.in-sk{height:150px;border-radius:24px;background:var(--chip);margin-bottom:12px;animation:inPulse 1.2s ease-in-out infinite}
@keyframes inPulse{50%{opacity:.5}}
@media (prefers-reduced-motion:reduce){.in *,.in::before{animation-duration:.01ms!important;animation-delay:0s!important;transition-duration:.01ms!important}}`;
  document.head.appendChild(stl);

  /* ============ أدوات ============ */
  const TZ = 'Asia/Baghdad';
  const MONTHS = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'];
  const n = v => Math.round(v || 0).toLocaleString('en-US');
  const ymd = d => d.toLocaleDateString('en-CA', { timeZone: TZ });
  const today = () => ymd(new Date());
  const addDays = (s, k) => { const d = new Date(s + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + k); return d.toISOString().slice(0, 10); };
  const lastDay = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();
  const pad = v => String(v).padStart(2, '0');
  const dayLabel = s => { const [, m, d] = s.slice(0, 10).split('-'); return `${+d} ${MONTHS[+m - 1]}`; };
  const fullDay = s => { const [y, m, d] = s.slice(0, 10).split('-'); return `${+d} ${MONTHS[+m - 1]} ${y}`; };
  const labelOf = (b, unit) => unit === 'hour' ? b.slice(11, 13) + ':00' : dayLabel(b);
  const dur = ms => { const s = Math.round((ms || 0) / 1000); return s >= 60 ? `${Math.floor(s / 60)}:${pad(s % 60)} د` : `${s} ث`; };
  const pct = v => Math.round((v || 0) * 100) + '%';

  function delta(cur, prev) {
    if (!prev) return cur > 0 ? ['up', 'جديد'] : ['eq', '—'];
    const d = Math.round((cur - prev) / prev * 100);
    return d === 0 ? ['eq', '0%'] : [d > 0 ? 'up' : 'down', `${d > 0 ? '▲' : '▼'} ${Math.abs(d)}%`];
  }
  const dl = (cur, prev) => { const d = delta(cur, prev); return `<span class="in-pl ${d[0]}">${d[1]}</span>`; };

  function smooth(pts) {
    if (pts.length < 2) return pts.length ? `M${pts[0][0]},${pts[0][1]}` : '';
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]},${p2[1]}`;
    }
    return d;
  }

  function page(title, body) {
    const el = document.createElement('div');
    el.className = 'cr';
    el.style.zIndex = 75;
    el.innerHTML = `<div class="cr-head"><button class="icon-btn" data-x aria-label="رجوع">${A.icon('arrow')}</button><div class="cr-title">${title}</div><span style="width:44px"></span></div><div class="cr-body">${body}</div>`;
    document.body.appendChild(el);
    el.querySelector('[data-x]').onclick = () => el.remove();
    return el;
  }

  function countUp(el, to, fmt) {
    const t0 = performance.now(), d = 1000;
    const step = t => {
      if (!el.isConnected) return;
      const k = Math.min(1, (t - t0) / d), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(to * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ============ الرسوم ============ */
  let CH = {}, cid = 0;
  function area(labels, vals, hero, rel) {
    const id = 'c' + (++cid), W = 320, H = 110, pT = 12, pB = 6, mx = Math.max(1, ...vals), lo = rel ? Math.min(...vals) : 0, span = rel ? (mx - lo || 1) : mx;
    const pts = vals.map((v, i) => [vals.length > 1 ? +(i / (vals.length - 1) * W).toFixed(1) : W / 2, +(H - pB - ((v - lo) / span) * (H - pT - pB)).toFixed(1)]);
    const clampY = d => d.replace(/C([\d.\-]+),([\d.\-]+) ([\d.\-]+),([\d.\-]+) /g, (m, a, b, c, e) => `C${a},${Math.min(H - pB, Math.max(pT, +b))} ${c},${Math.min(H - pB, Math.max(pT, +e))} `);
    const line = clampY(smooth(pts)), fill = pts.length ? `${line} L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z` : '';
    CH[id] = { labels, vals, pts, W };
    return `<div class="in-chart ${hero ? 'hh' : ''}" data-ch="${id}"><div class="in-tip"></div>
      <svg viewBox="0 0 ${W} ${H}" aria-hidden="true">
      <path class="in-area" d="${fill}" style="fill:currentColor;fill-opacity:${hero ? .2 : .14};stroke:none"/><path class="in-line" d="${line}"/>
      <line class="in-guide" x1="0" x2="0" y1="0" y2="${H}"/><circle class="in-dot" r="5" cx="0" cy="0"/></svg></div>
      <div class="in-ax"><span>${A.esc(labels[0] || '')}</span><span>${A.esc(labels[labels.length - 1] || '')}</span></div>`;
  }
  function bars(labels, vals) {
    const id = 'c' + (++cid), mx = Math.max(1, ...vals);
    CH[id] = { labels, vals, bars: true };
    return `<div class="in-bars" data-ch="${id}"><div class="in-tip" style="top:-8px"></div>${vals.map((v, i) => `<i style="--h:${Math.max(4, Math.round(v / mx * 100))}%;--d:${Math.min(i * 14, 700)}ms"></i>`).join('')}</div>
      <div class="in-ax"><span>${A.esc(labels[0] || '')}</span><span>${A.esc(labels[labels.length - 1] || '')}</span></div>`;
  }
  function initCharts(root) {
    root.querySelectorAll('.in-line').forEach(l => { if (l.getTotalLength) l.style.setProperty('--len', Math.ceil(l.getTotalLength()) + 2); });
    root.querySelectorAll('[data-ch]').forEach(el => {
      const c = CH[el.dataset.ch];
      if (!c || c.vals.length < 1) return;
      const tip = el.querySelector('.in-tip');
      const show = ev => {
        const rc = el.getBoundingClientRect(), x = Math.max(0, Math.min(.9999, (ev.clientX - rc.left) / rc.width));
        let i, left;
        if (c.bars) {
          i = Math.floor(x * c.vals.length);
          el.querySelectorAll('i').forEach((b, k) => b.classList.toggle('hi', k === i));
          left = (i + .5) / c.vals.length * 100;
        } else {
          i = Math.round(x * (c.vals.length - 1));
          const p = c.pts[i], g = el.querySelector('.in-guide'), d = el.querySelector('.in-dot');
          g.setAttribute('x1', p[0]); g.setAttribute('x2', p[0]); d.setAttribute('cx', p[0]); d.setAttribute('cy', p[1]);
          g.style.opacity = d.style.opacity = 1;
          left = p[0] / c.W * 100;
        }
        tip.textContent = `${c.labels[i]} · ${n(c.vals[i])}`;
        tip.style.left = Math.max(16, Math.min(84, left)) + '%';
        tip.style.opacity = 1;
      };
      const hide = () => {
        tip.style.opacity = 0;
        el.querySelectorAll('.hi').forEach(b => b.classList.remove('hi'));
        const g = el.querySelector('.in-guide'), d = el.querySelector('.in-dot');
        if (g) g.style.opacity = d.style.opacity = 0;
      };
      el.addEventListener('pointerdown', show);
      el.addEventListener('pointermove', e => { if (e.pressure > 0 || e.pointerType === 'mouse') show(e); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => el.addEventListener(t, hide));
    });
  }

  /* ============ مكونات ============ */
  const tile = (cls, ic, val, label, cur, prev) => `<div class="in-st ${cls}"><div class="ico">${A.icon(ic)}</div><b data-c="${val}">0</b><small>${label}</small>${dl(cur, prev)}</div>`;
  const thumb = p => p && p.media_url ? `<div class="in-th">${p.media_type === 'video' ? `<video src="${A.esc(p.media_url)}#t=0.1" muted playsinline preload="metadata"></video>` : `<img loading="lazy" src="${A.esc(p.media_url)}" alt="">`}</div>` : `<div class="in-th">${A.icon('film')}</div>`;
  const postCard = (label, p, stat) => p ? `<div class="in-pc">${thumb(p)}<div class="mid"><div class="lb">${label}</div><div class="t">${A.esc(p.content || 'منشور بدون نص')}</div><small>${n(p.views)} مشاهدة · ${n(p.likes)} إعجاب · ${n(p.comments)} تعليق</small></div></div>`
    : `<div class="in-pc"><div class="in-th">${A.icon('film')}</div><div class="mid"><div class="lb">${label}</div><div class="em">لا يوجد بعد</div></div></div>`;
  const ring = (v, id) => `<div class="in-ring"><svg viewBox="0 0 100 100"><defs><linearGradient id="inGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0E7C66"/><stop offset="1" stop-color="#E5B53D"/></linearGradient></defs><circle class="bg" cx="50" cy="50" r="42"/><circle class="fg" data-r="${v}" cx="50" cy="50" r="42"/></svg><b>${v}%</b></div>`;

  /* ============ الصفحة ============ */
  A.profileInsights = function () {
    const now = new Date(ymd(new Date()) + 'T12:00:00Z');
    const S = { mode: '30', y: now.getUTCFullYear(), m: now.getUTCMonth() + 1, from: addDays(today(), -6), to: today() };
    const PER = [['today', 'اليوم'], ['7', '7 أيام'], ['30', '30 يوماً'], ['month', 'شهري']];
    const el = page('إحصائيات حسابي', `<div class="in"><div class="in-per" id="in-per">${PER.map(([k, l]) => `<button data-m="${k}" class="${k === S.mode ? 'on' : ''}">${l}</button>`).join('')}</div><div id="in-sub"></div><div id="in-body"></div></div>`);
    const body = el.querySelector('#in-body'), per = el.querySelector('#in-per'), sub = el.querySelector('#in-sub');
    let tok = 0;

    const range = () => {
      const t = today();
      if (S.mode === 'today') return [t, t];
      if (S.mode === '7') return [addDays(t, -6), t];
      if (S.mode === '30') return [addDays(t, -29), t];
      if (S.mode === 'month') { const f = `${S.y}-${pad(S.m)}-01`, l = `${S.y}-${pad(S.m)}-${pad(lastDay(S.y, S.m))}`; return [f, l > t ? t : l]; }
      return [S.from, S.to];
    };

    const drawSub = () => {
      const t = today(), isCur = S.y === +t.slice(0, 4) && S.m === +t.slice(5, 7);
      if (S.mode === 'month') {
        sub.innerHTML = `<div class="in-sub"><button class="ar" data-a="p" aria-label="الشهر السابق">${A.icon('next')}</button><b>${MONTHS[S.m - 1]} ${S.y}</b><button class="ar" data-a="n" ${isCur ? 'disabled' : ''} aria-label="الشهر التالي">${A.icon('prev')}</button></div>`;
      } else if (S.mode === 'custom') {
        sub.innerHTML = `<div class="in-sub" style="flex-wrap:wrap"><label>من <input type="date" id="in-f" max="${t}" value="${S.from}"></label><label>إلى <input type="date" id="in-t" max="${t}" value="${S.to}"></label><button class="go" data-a="go">تطبيق</button></div>`;
      } else sub.innerHTML = '';
    };

    const load = async () => {
      const my = ++tok;
      const [f, t] = range();
      CH = {}; cid = 0;
      body.innerHTML = '<div class="in-sk"></div><div class="in-sk" style="height:110px"></div><div class="in-sk" style="height:110px"></div>';
      const [{ data, error }, mon] = await Promise.all([
        A.sb.rpc('account_analytics', { p_from: f, p_to: t }),
        S.mode === 'month' ? A.sb.rpc('account_monthly', { p_months: 12 }).then(r => r.data || null, () => null) : Promise.resolve(null)
      ]);
      if (my !== tok) return;
      if (error || !data) { console.error(error); body.innerHTML = '<div class="empty">تعذر التحميل<br><button class="btn sm" id="in-retry">إعادة المحاولة</button></div>'; body.querySelector('#in-retry').onclick = load; return; }
      render(data, mon);
    };

    function render(d, mon) {
      const c = d.cur, p = d.prev, R = d.range, unit = R.unit, s = d.series || [];
      const labels = s.map(x => labelOf(x.b, unit));
      const views = s.map(x => +x.views), inter = s.map(x => +x.inter);
      // نمو المتابعين التراكمي
      let run = d.followers_start; const grow = s.map(x => (run += (+x.fnew) - (+x.unf)));
      const net = c.followers_new - c.unfollows;
      const gr = d.followers_start > 0 ? net / d.followers_start * 100 : (net > 0 ? 100 : 0);
      const interTot = c.likes + c.comments + c.saves + c.shares, interPrev = p.likes + p.comments + p.saves + p.shares;
      const eng = c.views > 0 ? Math.min(100, Math.round(interTot / c.views * 100)) : 0;
      const vd = delta(c.views, p.views), vdown = vd[0] === 'down';
      const w = d.watch, W = d.week, PW = d.prev_week;
      let k = 0; const r = () => `class="in-rise" style="--i:${k++}"`;
      const wk = [['eye', 'المشاهدات', 'views'], ['heart', 'الإعجابات', 'likes'], ['comment', 'التعليقات', 'comments'], ['bookmark', 'الحفظ', 'saves'], ['repeat', 'المشاركات', 'shares'], ['walk', 'زيارات الملف', 'visits'], ['users', 'متابعون جدد', 'followers_new']];
      const top = d.top10 || [], tmax = Math.max(1, ...top.map(x => x.score));
      const rngTxt = R.from === R.to ? fullDay(R.from) : `${fullDay(R.from)} — ${fullDay(R.to)}`;

      body.innerHTML = `
        <div ${r()}><div class="in-rng">${rngTxt}</div></div>
        ${mon && mon.length ? `<div ${r()}><div class="in-card">
          <div class="in-ct">${A.icon('cal')}<span>آخر ${mon.length} شهر</span></div>
          <div class="in-tri" style="margin-bottom:12px"><div><b>${n(mon.reduce((a, x) => a + (+x.c.views || 0), 0))}</b><small>مشاهدات</small></div><div><b>${n(mon.reduce((a, x) => a + (+x.c.followers_new || 0), 0))}</b><small>متابعون جدد</small></div><div><b>${n(mon.reduce((a, x) => a + (+x.c.visits || 0), 0))}</b><small>زيارات الملف</small></div></div>
          ${bars(mon.map(x => MONTHS[+x.m.slice(5, 7) - 1] + ' ' + x.m.slice(0, 4)), mon.map(x => +x.c.views || 0))}
        </div></div>` : ''}
        <div ${r()}><div class="in-hero">
          <div class="in-hl">${A.icon('eye')}إجمالي مشاهدات الحساب والمنشورات</div>
          <div class="in-num" data-c="${c.views}">0</div>
          <span class="in-pill ${vdown ? 'down' : ''}">${vd[1] === 'جديد' ? '✦ جديد' : vd[1] === '—' ? '— لا تغيير' : vd[1] + ' عن الفترة السابقة'}</span>
          ${area(labels, views, true)}
        </div></div>

        <div class="in-grid" style="margin-top:12px">
          <div ${r()}>${tile('c1', 'walk', c.visits, 'زيارات الملف', c.visits, p.visits)}</div>
          <div ${r()}>${tile('c2', 'film', c.video_views, 'مشاهدات الفيديو', c.video_views, p.video_views)}</div>
          <div ${r()}>${tile('c3', 'heart', c.likes, 'إعجابات', c.likes, p.likes)}</div>
          <div ${r()}>${tile('c4', 'comment', c.comments, 'تعليقات', c.comments, p.comments)}</div>
          <div ${r()}>${tile('c5', 'bookmark', c.saves, 'حفظ', c.saves, p.saves)}</div>
          <div ${r()}>${tile('c6', 'repeat', c.shares, 'مشاركات', c.shares, p.shares)}</div>
        </div>

        <div ${r()}><div class="in-card">
          <div class="in-ct">${A.icon('users')}<span>نمو الحساب</span><span class="sp"></span><span class="in-pl ${gr > 0 ? '' : gr < 0 ? 'down' : 'eq'}">${gr > 0 ? '▲ ' : gr < 0 ? '▼ ' : ''}${Math.abs(gr) >= 10 ? Math.round(Math.abs(gr)) : Math.abs(gr).toFixed(1)}%</span></div>
          <div class="in-tri"><div><b data-c="${d.followers_total}">0</b><small>إجمالي المتابعين</small></div><div><b data-c="${c.followers_new}">0</b><small>متابعون جدد</small></div><div><b data-c="${c.unfollows}">0</b><small>ألغوا المتابعة</small></div></div>
          ${area(labels, grow, false, true)}
          <div class="in-note" style="margin:6px 0 0;text-align:start">معدل النمو = (الجدد − الذين ألغوا) ÷ المتابعين في بداية الفترة.</div>
        </div></div>

        <div ${r()}><div class="in-card">
          <div class="in-ct">${A.icon('trend')}<span>التفاعل مع المنشورات</span><span class="sp"></span>${dl(interTot, interPrev)}</div>
          <div class="in-row2">${ring(eng)}<div class="in-mini"><div><small>إجمالي التفاعلات</small><b data-c="${interTot}">0</b></div><div><small>نسبة التفاعل من المشاهدات</small><b>${eng}%</b></div></div></div>
          <div style="margin-top:14px">${bars(labels, inter)}</div>
        </div></div>

        <div ${r()}><div class="in-card">
          <div class="in-ct">${A.icon('cal')}<span>هذا الأسبوع مقابل الأسبوع السابق</span></div>
          <div class="in-wk">${wk.map(([ic, lb, key]) => { const cu = W[key], pr = PW[key], mx = Math.max(1, cu, pr); return `<div class="in-wr"><div class="h">${A.icon(ic)}<span>${lb}</span>${dl(cu, pr)}</div>
            <div class="in-bp"><em>هذا الأسبوع</em><div class="tr"><i class="c" data-w="${Math.round(cu / mx * 100)}"></i></div><b>${n(cu)}</b></div>
            <div class="in-bp"><em>السابق</em><div class="tr"><i class="p" data-w="${Math.round(pr / mx * 100)}"></i></div><b>${n(pr)}</b></div></div>`; }).join('')}</div>
        </div></div>

        <div ${r()}><div class="in-card">
          <div class="in-ct">${A.icon('film')}<span>المنشورات والفيديوهات</span></div>
          <div class="in-tri"><div><b data-c="${d.posts_total}">0</b><small>إجمالي المنشورات</small></div><div><b data-c="${d.posts_new}">0</b><small>نُشرت بهذه الفترة</small></div><div><b data-c="${d.videos_total}">0</b><small>إجمالي الفيديوهات</small></div></div>
          ${postCard('أكثر فيديو مشاهدة', d.top_video && d.top_video.views > 0 ? d.top_video : null)}
          ${postCard('أقل فيديو مشاهدة', d.low_video && d.top_video && d.low_video.id !== d.top_video.id ? d.low_video : null)}
          ${postCard('أكثر منشور إعجاباً', d.top_liked)}
          ${postCard('أكثر منشور تعليقاً', d.top_commented)}
        </div></div>

        <div ${r()}><div class="in-card">
          <div class="in-ct">${A.icon('clock')}<span>مشاهدة الفيديو</span></div>
          ${w.plays > 0 ? `<div class="in-row2">${ring(Math.round(w.complete_rate * 100))}<div class="in-mini"><div><small>متوسط وقت المشاهدة</small><b>${dur(w.avg_ms)}</b></div><div><small>نسبة إكمال المشاهدة</small><b>${pct(w.complete_rate)}</b></div><div><small>متوسط ما يُشاهَد من الفيديو</small><b>${pct(w.avg_pct)}</b></div></div></div>`
            : '<div class="in-note" style="margin:0">لا توجد بيانات مشاهدة فيديو في هذه الفترة. تبدأ الأرقام بالظهور عندما يشاهد الناس فيديوهاتك.</div>'}
        </div></div>

        <div ${r()}><div class="in-ct" style="margin:18px 2px 10px">${A.icon('trophy')}<span>أفضل 10 منشورات أداءً</span></div></div>
        ${top.length ? top.map((t, i) => `<div ${r()}><div class="in-top"><div class="in-rk r${i + 1}">${i + 1}</div>${thumb(t)}<div class="mid"><div class="t">${A.esc(t.content || 'منشور بدون نص')}</div><small>${n(t.views)} مشاهدة · ${n(t.likes)} إعجاب · ${n(t.comments)} تعليق · ${n(t.saves)} حفظ · ${n(t.shares)} مشاركة</small><div class="in-bar"><i data-w="${Math.round(t.score / tmax * 100)}"></i></div></div></div></div>`).join('')
          : `<div ${r()}><div class="empty">لا توجد منشورات ذات أداء في هذه الفترة</div></div>`}
        <div class="in-note">لا تُحتسب مشاهداتك وتفاعلاتك على منشوراتك الخاصة.<br>الترتيب حسب نقاط الأداء: مشاهدة 1، إعجاب 3، حفظ 4، مشاركة 4، تعليق 5.</div>`;

      body.querySelectorAll('[data-c]').forEach(e => countUp(e, +e.dataset.c, v => n(v)));
      initCharts(body);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        body.querySelectorAll('[data-r]').forEach(e => { e.style.strokeDashoffset = 264 - 264 * (+e.dataset.r) / 100; });
        body.querySelectorAll('[data-w]').forEach(e => { e.style.width = e.dataset.w + '%'; });
      }));
    }

    per.onclick = e => {
      const b = e.target.closest('[data-m]');
      if (!b || b.dataset.m === S.mode) return;
      S.mode = b.dataset.m;
      per.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
      drawSub();
      if (S.mode !== 'custom') load();
    };
    sub.onclick = e => {
      const b = e.target.closest('[data-a]');
      if (!b || b.disabled) return;
      const a = b.dataset.a;
      if (a === 'p' || a === 'n') {
        S.m += a === 'p' ? -1 : 1;
        if (S.m < 1) { S.m = 12; S.y--; } else if (S.m > 12) { S.m = 1; S.y++; }
        drawSub(); load();
      } else if (a === 'go') {
        const f = sub.querySelector('#in-f').value, t = sub.querySelector('#in-t').value;
        if (!f || !t) return A.toast('اختر تاريخ البداية والنهاية', 'err');
        if (f > t) return A.toast('تاريخ البداية بعد تاريخ النهاية', 'err');
        if (t > today()) return A.toast('لا يمكن اختيار تاريخ مستقبلي', 'err');
        S.from = f; S.to = t; load();
      }
    };
    drawSub();
    load();
  };
})();
