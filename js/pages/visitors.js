(function () {
  const A = App;
  const me = () => A.state.user;
  const PAGE = 30;

  Object.assign(A.icons, {
    vsEye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
    vsX: '<path d="M18 6L6 18M6 6l12 12"/>',
    vsTrash: '<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>',
    vsGhost: '<path d="M12 2a8 8 0 00-8 8v12l3-2 2.5 2L12 20l2.5 2 2.5-2 3 2V10a8 8 0 00-8-8z"/><path d="M9 10h.01M15 10h.01"/>'
  });

  const stl = document.createElement('style');
  stl.textContent = `
.vs-head h1{margin-inline-end:0!important;padding-inline-end:40px}
.vs-acts{display:flex;flex:none}
.vs-sum{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:6px 0 4px}
.vs-sum div{background:var(--card);border-radius:16px;box-shadow:var(--shadow);padding:12px 6px;text-align:center}
.vs-sum b{display:block;font-size:21px;font-weight:800;line-height:1.3}
.vs-sum span{display:block;font-size:12px;color:var(--muted);font-weight:700}
.vs-sum .hot b{color:var(--primary)}
.vs-off{display:flex;align-items:center;gap:12px;background:var(--card);border:1px dashed var(--line);border-radius:16px;padding:12px 14px;margin:10px 0 0;font-size:13.5px;line-height:1.6}
.vs-off>span{flex:1;min-width:0}
.vs-off .btn{margin:0;flex:none}
.vs-day{color:var(--muted);font-weight:800;font-size:13.5px;margin:18px 6px 8px}
.vs-card{background:var(--card);border-radius:18px;overflow:hidden;box-shadow:var(--shadow)}
.vs-row{display:flex;align-items:center;gap:12px;padding:11px 14px;border-bottom:1px solid var(--line);cursor:pointer;transition:.15s}
.vs-row:last-child{border-bottom:0}
.vs-row:active{background:var(--chip)}
.vs-row.new{background:color-mix(in srgb,var(--primary) 8%,var(--card))}
.vs-m{flex:1;min-width:0}
.vs-n{display:flex;align-items:center;gap:4px;font-weight:800;font-size:15px;line-height:1.4}
.vs-n>span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.vs-u{color:var(--muted);font-size:12.5px;direction:ltr;text-align:right}
.vs-t{color:var(--muted);font-size:12.5px;margin-top:1px;display:flex;flex-wrap:wrap;gap:4px 8px;align-items:center}
.vs-t b{font-weight:700;color:var(--text)}
.vs-chip{display:inline-block;padding:1px 8px;border-radius:9px;background:var(--chip);font-size:11.5px;font-weight:700}
.vs-chip.new{background:var(--primary);color:var(--on-primary,#fff)}
.vs-x{flex:none;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:var(--muted)}
.vs-x:active{background:var(--line)}
.vs-x .ic{width:17px;height:17px}
.vs-more{display:block;margin:16px auto 6px}
.vs-empty{text-align:center;color:var(--muted);padding:46px 20px;line-height:1.8}
.vs-empty .ic{width:46px;height:46px;opacity:.5;margin-bottom:8px}
.vs-f{flex:none;margin:0;padding:6px 12px;font-size:12.5px;border-radius:12px;white-space:nowrap}
.ig-act .btn.pf-vis{position:relative;overflow:visible}
.pf-vis-n{position:absolute;top:-6px;inset-inline-end:-4px;min-width:19px;height:19px;padding:0 5px;border-radius:10px;background:#E5484D;color:#fff;font-size:11px;font-weight:800;display:grid;place-items:center;box-sizing:border-box;line-height:1}
.pf-vis-n[hidden]{display:none}
.sw.on::after{background:var(--on-primary,#fff)}`;
  document.head.appendChild(stl);

  /* ---------- مساعدات ---------- */
  const DEF = { visits_log: true, visits_incognito: false, notif_visits: true };
  async function getSet() {
    const { data } = await A.sb.from('user_settings').select('visits_log,visits_incognito,notif_visits').eq('user_id', me().id).maybeSingle();
    return Object.assign({}, DEF, data || {});
  }
  async function saveSet(patch) {
    const { error } = await A.sb.from('user_settings').upsert({ user_id: me().id, ...patch }, { onConflict: 'user_id' });
    return !error;
  }
  const num = n => (+n || 0).toLocaleString('en-US');
  const dayKey = d => d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate();
  function dayLabel(d) {
    const t = new Date(), y = new Date(t.getTime() - 864e5);
    if (dayKey(d) === dayKey(t)) return 'اليوم';
    if (dayKey(d) === dayKey(y)) return 'أمس';
    return d.toLocaleDateString('ar-IQ', { weekday: 'long', day: 'numeric', month: 'long' }) + (d.getFullYear() !== t.getFullYear() ? ' ' + d.getFullYear() : '');
  }
  const clock = d => d.toLocaleTimeString('ar-IQ', { hour: 'numeric', minute: '2-digit' });
  const sk = n => '<div class="sk" style="height:62px;margin:10px 0"></div>'.repeat(n);
  const sw = on => `<span class="sw ${on ? 'on' : ''}"></span>`;

  async function clearHistory(after) {
    if (!confirm('مسح سجل الزوار؟\nسيختفي الزوار الحاليون من قائمتك، ولا يتأثر عدد الزيارات في إحصائيات حسابك.')) return;
    const { error } = await A.sb.rpc('clear_visit_history');
    if (error) return A.toast('تعذر مسح السجل', 'err');
    A.toast('تم مسح سجل الزوار', 'ok');
    if (after) after();
  }

  /* ---------- صفحة زوار ملفي ---------- */
  function visitorsPage(view) {
    view.innerHTML = `<div class="set"><div class="set-head vs-head"><button class="icon-btn" id="v-back" aria-label="رجوع">${A.icon('arrow')}</button>
      <h1>زوار ملفي</h1><div class="vs-acts"><button class="icon-btn" id="v-clear" aria-label="مسح السجل">${A.icon('vsTrash')}</button>
      <button class="icon-btn" id="v-set" aria-label="إعدادات الزوار">${A.icon('gear')}</button></div></div>
      <div class="set-body" id="v-body"></div></div>`;
    const body = view.querySelector('#v-body');
    view.querySelector('#v-back').onclick = () => { history.length > 1 ? history.back() : (location.hash = '#/profile'); };
    view.querySelector('#v-set').onclick = () => { location.hash = '#/settings/visits'; };
    view.querySelector('#v-clear').onclick = () => clearHistory(load);

    let rows = [], more = false, setg = DEF, sum = null;
    const fs = {};
    async function loadFs(list) {
      const ids = list.map(x => x.visitor_id);
      if (!ids.length) return;
      const { data } = await A.sb.from('follows').select('following_id,status').eq('follower_id', me().id).in('following_id', ids);
      ids.forEach(id => { delete fs[id]; });
      (data || []).forEach(x => { fs[x.following_id] = x.status; });
    }

    function paint() {
      const s = sum || { new: 0, week: 0, total: 0 };
      let html = `<div class="vs-sum"><div class="${s.new ? 'hot' : ''}"><b>${num(s.new)}</b><span>جدد</span></div><div><b>${num(s.week)}</b><span>آخر 7 أيام</span></div><div><b>${num(s.total)}</b><span>الإجمالي</span></div></div>`;
      if (!setg.visits_log) html += `<div class="vs-off"><span>تسجيل الزيارات متوقف، لن تُسجَّل زيارات جديدة لملفك.</span><button class="btn sm" id="v-on">تفعيل</button></div>`;
      if (!rows.length) {
        html += `<div class="vs-empty">${A.icon('vsEye')}<div>لا يوجد زوار بعد</div><div>${setg.visits_log ? 'ستظهر هنا الحسابات التي تزور ملفك الشخصي.' : 'فعّل تسجيل الزيارات لتظهر هنا الحسابات التي تزور ملفك.'}</div></div>`;
      } else {
        let last = '', open = false;
        rows.forEach(r => {
          const d = new Date(r.last_visit), k = dayKey(d);
          if (k !== last) {
            if (open) html += '</div>';
            html += `<div class="vs-day">${A.esc(dayLabel(d))}</div><div class="vs-card">`;
            last = k; open = true;
          }
          html += `<div class="vs-row ${r.is_new ? 'new' : ''}" data-u="${A.esc(r.username)}">${A.avatar(r, 46)}
            <div class="vs-m"><div class="vs-n"><span>${A.esc(r.display_name || r.username)}</span>${r.is_verified ? A.verified : ''}${A.catBadge(r.category, 15)}</div>
              <div class="vs-u">@${A.esc(r.username)}</div>
              <div class="vs-t"><b>${A.esc(clock(d))}</b><span>${A.timeAgo(r.last_visit)}</span>${r.visits > 1 ? `<span class="vs-chip">${num(r.visits)} زيارات</span>` : ''}${r.is_new ? '<span class="vs-chip new">جديد</span>' : ''}</div></div>
            <button class="btn sm vs-f ${fs[r.visitor_id] ? 'ghost' : ''}" data-f="${r.visitor_id}">${fs[r.visitor_id] === 'accepted' ? 'تتابعه ✓' : fs[r.visitor_id] === 'pending' ? 'تم الإرسال' : 'متابعة'}</button>
            <button class="vs-x" data-hide="${r.visitor_id}" aria-label="إخفاء من السجل">${A.icon('vsX')}</button></div>`;
        });
        if (open) html += '</div>';
        if (more) html += '<button class="btn ghost vs-more" id="v-more">عرض المزيد</button>';
      }
      const y = body.scrollTop;
      body.innerHTML = html;
      body.scrollTop = y;
    }

    async function load() {
      body.innerHTML = sk(4);
      const [l, s, st] = await Promise.all([
        A.sb.rpc('my_profile_visitors', { p_limit: PAGE, p_offset: 0 }),
        A.sb.rpc('profile_visitors_summary'),
        getSet()
      ]);
      if (!view.isConnected) return;
      if (l.error) {
        body.innerHTML = '<div class="empty">تعذر تحميل الزوار<br><button class="btn sm" id="v-retry">إعادة المحاولة</button></div>';
        body.querySelector('#v-retry').onclick = load;
        return;
      }
      rows = l.data || []; more = rows.length === PAGE; sum = s.data; setg = st;
      await loadFs(rows);
      if (!view.isConnected) return;
      paint();
      // بعد عرض القائمة نعتبر الزيارات الجديدة «مقروءة» (يختفي عدّاد الملف الشخصي)
      A.sb.rpc('mark_visits_seen').then(() => {});
    }

    body.onclick = async e => {
      const hb = e.target.closest('[data-hide]');
      if (hb) {
        e.stopPropagation();
        hb.disabled = true;
        const { error } = await A.sb.rpc('hide_profile_visitor', { p_visitor: hb.dataset.hide });
        if (error) { hb.disabled = false; return A.toast('تعذر الإخفاء', 'err'); }
        rows = rows.filter(x => x.visitor_id !== hb.dataset.hide);
        if (sum) sum.total = Math.max(0, (sum.total || 0) - 1);
        paint();
        return;
      }
      const fb = e.target.closest('[data-f]');
      if (fb) {
        e.stopPropagation();
        fb.disabled = true;
        const id = fb.dataset.f, on = !!fs[id];
        const r = on ? await A.sb.from('follows').delete().eq('follower_id', me().id).eq('following_id', id)
                     : await A.sb.from('follows').insert({ follower_id: me().id, following_id: id });
        if (r.error) { fb.disabled = false; return A.toast('تعذر تنفيذ العملية', 'err'); }
        await loadFs([{ visitor_id: id }]);
        A.loadProfile();
        return paint();
      }
      if (e.target.closest('#v-on')) {
        if (!(await saveSet({ visits_log: true }))) return A.toast('تعذر الحفظ', 'err');
        setg = Object.assign({}, setg, { visits_log: true });
        A.toast('تم تفعيل تسجيل الزيارات', 'ok');
        return paint();
      }
      if (e.target.closest('#v-more')) {
        const b = e.target.closest('#v-more');
        b.disabled = true;
        const { data, error } = await A.sb.rpc('my_profile_visitors', { p_limit: PAGE, p_offset: rows.length });
        if (error) { b.disabled = false; return A.toast('تعذر التحميل', 'err'); }
        const seen = new Set(rows.map(x => x.visitor_id));
        const add = (data || []).filter(x => !seen.has(x.visitor_id));
        rows.push(...add);
        await loadFs(add);
        more = (data || []).length === PAGE;
        return paint();
      }
      const r = e.target.closest('[data-u]');
      if (r) location.hash = '#/u/' + encodeURIComponent(r.dataset.u);
    };

    // زيارة جديدة وأنت داخل الصفحة: تحديث القائمة مباشرة
    if (A.rt && A.rt.on) A.rt.on('notification', n => {
      if (!view.isConnected) return false;
      if (n.type === 'visit') load();
    });
    load();
  }

  A.pages.visitors = { render: visitorsPage, refresh() { const v = document.getElementById('view'); if (v) visitorsPage(v); } };

  /* ---------- صفحة إعدادات الزوار (الإعدادات > زوار الملف الشخصي) ---------- */
  async function settingsPage(body) {
    body.innerHTML = sk(3);
    const s = await getSet();
    const items = [
      ['visits_log', 'تسجيل زيارات ملفي', 'عند إيقافه لا تُسجَّل أي زيارة جديدة لملفك، ويبقى سجلك الحالي كما هو.'],
      ['notif_visits', 'إشعارات الزيارات الجديدة', 'يصلك إشعار عند زيارة أحدهم لملفك (مرة واحدة كل 24 ساعة لكل شخص).']
    ];
    body.innerHTML = `<div class="set-sec">زوار ملفي</div><div class="set-card">${items.map(([k, l, d]) =>
      `<button class="sr" data-k="${k}"><span class="sr-l">${l}<span class="sr-s">${d}</span></span>${sw(s[k])}</button>`).join('')}</div>
      <div class="set-sec">زياراتي للآخرين</div><div class="set-card"><button class="sr" data-k="visits_incognito"><span class="sr-i">${A.icon('vsGhost')}</span>
        <span class="sr-l">زيارة بدون ظهور<span class="sr-s">لن يظهر اسمك في سجل زوار الحسابات التي تزورها، ولن يصلهم إشعار.</span></span>${sw(s.visits_incognito)}</button></div>
      <div class="set-sec">السجل</div><div class="set-card">
        <button class="sr" id="vs-open"><span class="sr-i">${A.icon('vsEye')}</span><span class="sr-l">عرض زوار ملفي</span><span class="sr-c">${A.icon('chev')}</span></button>
        <button class="sr" id="vs-clear"><span class="sr-i">${A.icon('vsTrash')}</span><span class="sr-l">مسح سجل الزوار<span class="sr-s">يخفي الزوار الحاليين من قائمتك فقط.</span></span></button></div>
      <div class="set-note">الحسابات المحظورة لا تظهر في سجلك ولا تُسجَّل زياراتها. مسح السجل لا يؤثر على إحصائيات حسابك.</div>`;
    body.onclick = async e => {
      const b = e.target.closest('[data-k]');
      if (b) {
        const el = b.querySelector('.sw'), v = el.classList.toggle('on');
        if (!(await saveSet({ [b.dataset.k]: v }))) { el.classList.toggle('on'); A.toast('تعذر الحفظ', 'err'); }
        return;
      }
      if (e.target.closest('#vs-open')) { location.hash = '#/visitors'; return; }
      if (e.target.closest('#vs-clear')) clearHistory();
    };
  }

  const prev = A.pages.settings.render;
  A.pages.settings.render = function (view, param) {
    const key = (param || '').split('/')[0];
    if (key !== 'visits') {
      const r = prev.apply(this, arguments);
      if (!key) {
        // إضافة «زوار الملف الشخصي» لقسم «الظهور» في القائمة الرئيسية للإعدادات
        const sec = [...view.querySelectorAll('.set-sec')].find(x => x.textContent.trim() === 'الظهور');
        const card = sec && sec.nextElementSibling;
        if (card && !card.querySelector('[data-k="visits"]')) {
          card.insertAdjacentHTML('beforeend', `<button class="sr" data-k="visits"><span class="sr-i">${A.icon('vsEye')}</span><span class="sr-l">زوار الملف الشخصي</span><span class="sr-c">${A.icon('chev')}</span></button>`);
        }
      }
      return r;
    }
    view.innerHTML = `<div class="set"><div class="set-head"><button class="icon-btn" id="s-back" aria-label="رجوع">${A.icon('arrow')}</button><h1>زوار الملف الشخصي</h1></div><div class="set-body" id="s-body"></div></div>`;
    view.querySelector('#s-back').onclick = () => { location.hash = '#/settings'; };
    settingsPage(view.querySelector('#s-body'));
  };

  /* ---------- زر «زوار ملفي» (أيقونة عين) بجانب «مشاركة الملف» ---------- */
  function inject() {
    const d = document.getElementById('pf-share');
    if (!d || !d.isConnected || document.getElementById('pf-vis') || !me()) return;
    const b = document.createElement('button');
    b.className = 'btn ghost sq pf-vis'; b.id = 'pf-vis'; b.setAttribute('aria-label', 'زوار ملفي');
    b.innerHTML = `${A.icon('vsEye')}<span class="pf-vis-n" id="pf-vis-n" hidden></span>`;
    b.onclick = () => { location.hash = '#/visitors'; };
    d.insertAdjacentElement('afterend', b);
    A.sb.rpc('profile_visitors_summary').then(r => {
      const s = r.data, n = document.getElementById('pf-vis-n');
      if (s && s.new && n) { n.textContent = s.new > 99 ? '99+' : s.new; n.hidden = false; }
    });
  }
  let timer = null;
  const root = document.getElementById('app');
  if (root) new MutationObserver(() => { clearTimeout(timer); timer = setTimeout(inject, 150); }).observe(root, { childList: true, subtree: true });
})();