(function () {
  const A = App;
  const TZ = 'Asia/Baghdad';
  const MONTHS = ['كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران', 'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول'];
  const n = v => Math.round(v || 0).toLocaleString('en-US');
  const ymd = d => d.toLocaleDateString('en-CA', { timeZone: TZ });
  const today = () => ymd(new Date());
  const addDays = (s, k) => { const d = new Date(s + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + k); return d.toISOString().slice(0, 10); };
  const lastDay = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate();
  const pad = v => String(v).padStart(2, '0');
  const fullDay = s => { const [y, m, d] = s.slice(0, 10).split('-'); return `${+d} ${MONTHS[+m - 1]} ${y}`; };
  const lbl = (b, unit) => unit === 'hour' ? b.slice(11, 13) + ':00' : fullDay(b).replace(/ \d{4}$/, '');
  const dur = ms => { const s = Math.round((ms || 0) / 1000); return s >= 60 ? `${Math.floor(s / 60)}:${pad(s % 60)} د` : `${s} ث`; };
  const pct = v => Math.round((v || 0) * 100) + '%';
  const dl = (cur, prev) => {
    if (!prev) return `<span class="in-pl ${cur > 0 ? '' : 'eq'}">${cur > 0 ? 'جديد' : '—'}</span>`;
    const d = Math.round((cur - prev) / prev * 100);
    return `<span class="in-pl ${d > 0 ? '' : d < 0 ? 'down' : 'eq'}">${d === 0 ? '0%' : (d > 0 ? '▲ ' : '▼ ') + Math.abs(d) + '%'}</span>`;
  };
  const ic = (k, fb) => A.icons && A.icons[k] ? k : fb;

  function bars(labels, vals) {
    const mx = Math.max(1, ...vals);
    return `<div class="in-bars">${vals.map((v, i) => `<i title="${A.esc(labels[i] + ' · ' + n(v))}" style="--h:${Math.max(4, Math.round(v / mx * 100))}%;--d:${Math.min(i * 14, 700)}ms"></i>`).join('')}</div>
      <div class="in-ax"><span>${A.esc(labels[0] || '')}</span><span>${A.esc(labels[labels.length - 1] || '')}</span></div>`;
  }
  function countUp(el, to) {
    const t0 = performance.now();
    const step = t => {
      if (!el.isConnected) return;
      const k = Math.min(1, (t - t0) / 900), e = 1 - Math.pow(1 - k, 3);
      el.textContent = n(to * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const tile = (cls, icon, val, label, cur, prev) => `<div class="in-st ${cls}"><div class="ico">${A.icon(icon)}</div><b data-c="${val}">0</b><small>${label}</small>${dl(cur, prev)}</div>`;

  A.postInsights = function (postId) {
    const now = new Date(today() + 'T12:00:00Z');
    const S = { mode: '7', y: now.getUTCFullYear(), m: now.getUTCMonth() + 1 };
    const PER = [['today', 'اليوم'], ['7', 'أسبوع'], ['month', 'شهر']];
    const el = document.createElement('div');
    el.className = 'cr'; el.style.zIndex = 80;
    el.innerHTML = `<div class="cr-head"><button class="icon-btn" data-x aria-label="رجوع">${A.icon('arrow')}</button><div class="cr-title">إحصائيات المنشور</div><span style="width:44px"></span></div>
      <div class="cr-body"><div class="in"><div class="in-per" id="pi-per">${PER.map(([k, l]) => `<button data-m="${k}" class="${k === S.mode ? 'on' : ''}">${l}</button>`).join('')}</div><div id="pi-sub"></div><div id="pi-body"></div></div></div>`;
    document.body.appendChild(el);
    el.querySelector('[data-x]').onclick = () => el.remove();
    const body = el.querySelector('#pi-body'), per = el.querySelector('#pi-per'), sub = el.querySelector('#pi-sub');
    let tok = 0;

    const range = () => {
      const t = today();
      if (S.mode === 'today') return [t, t];
      if (S.mode === '7') return [addDays(t, -6), t];
      const f = `${S.y}-${pad(S.m)}-01`, l = `${S.y}-${pad(S.m)}-${pad(lastDay(S.y, S.m))}`;
      return [f, l > t ? t : l];
    };
    const drawSub = () => {
      const t = today(), cur = S.y === +t.slice(0, 4) && S.m === +t.slice(5, 7);
      sub.innerHTML = S.mode === 'month' ? `<div class="in-sub"><button class="ar" data-a="p" aria-label="الشهر السابق">${A.icon('next')}</button><b>${MONTHS[S.m - 1]} ${S.y}</b><button class="ar" data-a="n" ${cur ? 'disabled' : ''} aria-label="الشهر التالي">${A.icon('prev')}</button></div>` : '';
    };

    async function load() {
      const my = ++tok, [f, t] = range();
      body.innerHTML = '<div class="in-sk"></div><div class="in-sk" style="height:110px"></div>';
      const { data, error } = await A.sb.rpc('post_analytics', { p_post: postId, p_from: f, p_to: t });
      if (my !== tok) return;
      if (error || !data) { console.error(error); body.innerHTML = '<div class="empty">تعذر التحميل<br><button class="btn sm" id="pi-retry">إعادة المحاولة</button></div>'; body.querySelector('#pi-retry').onclick = load; return; }
      draw(data);
    }

    function draw(d) {
      const c = d.cur, p = d.prev, R = d.range, s = d.series || [], w = d.watch || {}, T = d.total || {};
      const labels = s.map(x => lbl(x.b, R.unit));
      const views = s.map(x => +x.views), inter = s.map(x => +x.inter);
      const interTot = c.likes + c.comments + c.saves + c.reposts;
      const eng = c.views > 0 ? Math.min(100, Math.round(interTot / c.views * 100)) : 0;
      const rng = R.from === R.to ? fullDay(R.from) : `${fullDay(R.from)} — ${fullDay(R.to)}`;
      body.innerHTML = `
        <div class="in-rng">${rng}</div>
        <div class="in-hero">
          <div class="in-hl">${A.icon('eye')}مشاهدات هذا المنشور</div>
          <div class="in-num" data-c="${c.views}">0</div>
          <span class="in-pill">الإجمالي منذ النشر: ${n(T.views)}</span>
          ${bars(labels, views)}
        </div>
        <div class="in-grid" style="margin-top:12px">
          ${tile('c3', 'heart', c.likes, 'إعجابات', c.likes, p.likes)}
          ${tile('c4', 'comment', c.comments, 'تعليقات', c.comments, p.comments)}
          ${tile('c5', 'bookmark', c.saves, 'حفظ', c.saves, p.saves)}
          ${tile('c6', 'repeat', c.reposts, 'إعادة نشر', c.reposts, p.reposts)}
          ${tile('c1', 'users', c.followers, 'متابعون جدد من المنشور', c.followers, p.followers)}
          ${tile('c2', 'trend', interTot, 'إجمالي التفاعل', interTot, p.likes + p.comments + p.saves + p.reposts)}
        </div>
        <div class="in-card">
          <div class="in-ct">${A.icon('trend')}<span>التفاعل بمرور الوقت</span><span class="sp"></span><span class="in-pl eq">${eng}% من المشاهدات</span></div>
          ${bars(labels, inter)}
        </div>
        <div class="in-card">
          <div class="in-ct">${A.icon('clock')}<span>مشاهدة الفيديو</span></div>
          ${w.plays > 0 ? `<div class="in-tri"><div><b>${dur(w.avg_ms)}</b><small>متوسط وقت المشاهدة</small></div><div><b>${pct(w.complete_rate)}</b><small>أكملوا الفيديو</small></div><div><b>${pct(w.avg_pct)}</b><small>متوسط ما شوهد</small></div></div>`
            : '<div class="in-note" style="margin:0">لا توجد بيانات مشاهدة فيديو بهذه الفترة.</div>'}
        </div>
        <div class="in-card">
          <div class="in-ct">${A.icon('trophy')}<span>الإجمالي منذ النشر</span></div>
          <div class="in-tri"><div><b>${n(T.likes)}</b><small>إعجاب</small></div><div><b>${n(T.comments)}</b><small>تعليق</small></div><div><b>${n(T.saves)}</b><small>حفظ</small></div></div>
          <div class="in-tri" style="margin-bottom:0;grid-template-columns:repeat(2,1fr)"><div><b>${n(T.reposts)}</b><small>إعادة نشر</small></div><div><b>${n(T.views)}</b><small>مشاهدة</small></div></div>
        </div>
        <div class="in-note">لا تُحتسب مشاهداتك وتفاعلاتك على منشورك.<br>«المتابعون الجدد» = من شاهدوا المنشور ثم تابعوك بنفس الفترة.</div>`;
      body.querySelectorAll('[data-c]').forEach(e => countUp(e, +e.dataset.c));
    }

    per.onclick = e => {
      const b = e.target.closest('[data-m]');
      if (!b || b.dataset.m === S.mode) return;
      S.mode = b.dataset.m;
      per.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
      drawSub(); load();
    };
    sub.onclick = e => {
      const b = e.target.closest('[data-a]');
      if (!b || b.disabled) return;
      S.m += b.dataset.a === 'p' ? -1 : 1;
      if (S.m < 1) { S.m = 12; S.y--; } else if (S.m > 12) { S.m = 1; S.y++; }
      drawSub(); load();
    };
    drawSub(); load();
  };

  // زر «المزيد من الرؤى» داخل الريلز يفتح إحصائيات المنشور نفسه بدل إحصائيات الحساب
  document.addEventListener('click', e => {
    const b = e.target.closest && e.target.closest('.rv-i [data-ins]');
    if (!b) return;
    e.stopPropagation(); e.preventDefault();
    const id = b.closest('.rv-i').dataset.id;
    if (id) A.postInsights(id);
  }, true);
})();
