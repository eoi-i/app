(function () {
  const A = App;
  const me = () => A.state.user;

  Object.assign(A.icons, {
    scClock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    scTrash: '<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>'
  });

  const stl = document.createElement('style');
  stl.textContent = `
.sc-sum{display:flex;align-items:center;gap:10px;margin:8px 2px 4px}
.sc-sum span{flex:1;color:var(--muted);font-weight:700;font-size:14px}
.sc-sum .btn{margin:0}
.sc-row{background:var(--card);border-radius:18px;box-shadow:var(--shadow);padding:12px;margin-top:12px}
.sc-top{display:flex;gap:12px}
.sc-th{flex:none;width:58px;height:58px;border-radius:12px;overflow:hidden;background:var(--chip)}
.sc-th img,.sc-th video{width:100%;height:100%;object-fit:cover;display:block}
.sc-m{flex:1;min-width:0}
.sc-t{font-weight:700;line-height:1.6;word-break:break-word;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.sc-when{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;margin-top:6px;color:var(--muted);font-size:12.5px}
.sc-when .ic{width:15px;height:15px;color:var(--primary)}
.sc-when b{color:var(--text);font-weight:700}
.sc-chip{padding:1px 8px;border-radius:9px;background:var(--primary);color:var(--on-primary,#fff);font-weight:700;font-size:11.5px}
.sc-act{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;align-items:center}
.sc-act .btn{margin:0;padding:7px 11px;font-size:12.5px;border-radius:12px}
.sc-x{margin-inline-start:auto;width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:#E5484D}
.sc-x:active{background:var(--line)}
.sc-x .ic{width:18px;height:18px}
.sc-empty{text-align:center;color:var(--muted);padding:50px 20px;line-height:1.9}
.sc-empty .ic{width:46px;height:46px;opacity:.5;margin-bottom:8px}
.sc-chips{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 12px}
.sc-chips button{padding:7px 12px;border-radius:12px;background:var(--chip);color:var(--text);font-weight:700;font-size:13px}
.sc-chips button:active{background:var(--line)}
.sc-pick{color:var(--muted);font-size:13.5px;line-height:1.7;margin:4px 2px 12px;min-height:24px}
.sc-pick b{color:var(--text)}`;
  document.head.appendChild(stl);

  /* ---------- مساعدات ---------- */
  const pad = n => String(n).padStart(2, '0');
  const toInput = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const fmtFull = d => d.toLocaleDateString('ar-IQ', { weekday: 'long', day: 'numeric', month: 'long' }) + ' · ' + d.toLocaleTimeString('ar-IQ', { hour: 'numeric', minute: '2-digit' });
  const left = d => {
    const m = Math.round((d - Date.now()) / 60000);
    if (m <= 0) return 'خلال لحظات';
    if (m < 60) return `بعد ${m} د`;
    const h = Math.floor(m / 60);
    if (h < 24) return `بعد ${h} س${m % 60 ? ' و ' + (m % 60) + ' د' : ''}`;
    return `بعد ${Math.floor(h / 24)} ي`;
  };
  const cut = (t, n) => { t = (t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n) + '…' : t; };
  const pathOf = u => { const i = (u || '').indexOf('/object/public/posts/'); return i < 0 ? null : decodeURIComponent(u.slice(i + 21)); };
  const sk = n => '<div class="sk" style="height:96px;margin:12px 0"></div>'.repeat(n);

  /* ---------- نافذة اختيار التاريخ والوقت ---------- */
  function pickTime(init, title, okLabel, onOk) {
    const fx = document.createElement('div');
    fx.className = 'fx'; fx.style.zIndex = '300';
    const min = new Date(Date.now() + 2 * 60000);
    const def = init && init > min ? init : new Date(Math.ceil((Date.now() + 3600000) / 300000) * 300000);
    fx.innerHTML = `<div class="sheet-bg"><div class="sheet"><h3>${A.esc(title)}</h3>
      <div class="sc-chips"><button data-q="h1">بعد ساعة</button><button data-q="n9">الليلة 9 م</button><button data-q="m9">غداً 9 ص</button><button data-q="w1">بعد أسبوع</button></div>
      <div class="field"><label>التاريخ والوقت</label><input type="datetime-local" id="sc-dt" min="${toInput(min)}" value="${toInput(def)}"></div>
      <div class="sc-pick" id="sc-pick"></div>
      <button class="btn block" id="sc-ok">${A.esc(okLabel)}</button><button class="btn ghost block" id="sc-no">إلغاء</button></div></div>`;
    document.body.appendChild(fx);
    const close = () => fx.remove();
    const inp = fx.querySelector('#sc-dt'), pk = fx.querySelector('#sc-pick'), ok = fx.querySelector('#sc-ok');
    const val = () => { const d = new Date(inp.value); return isNaN(d) ? null : d; };
    const upd = () => { const d = val(); pk.innerHTML = d ? `سيُنشر تلقائياً: <b>${A.esc(fmtFull(d))}</b> (${left(d)})` : 'اختر تاريخاً ووقتاً صحيحين'; };
    inp.oninput = upd; upd();
    fx.firstChild.onclick = e => { if (e.target === fx.firstChild) close(); };
    fx.querySelector('#sc-no').onclick = close;
    fx.querySelector('.sc-chips').onclick = e => {
      const b = e.target.closest('[data-q]');
      if (!b) return;
      const n = new Date();
      let d;
      if (b.dataset.q === 'h1') d = new Date(n.getTime() + 3600000);
      else if (b.dataset.q === 'n9') { d = new Date(n.getFullYear(), n.getMonth(), n.getDate(), 21, 0); if (d < min) d.setDate(d.getDate() + 1); }
      else if (b.dataset.q === 'm9') d = new Date(n.getFullYear(), n.getMonth(), n.getDate() + 1, 9, 0);
      else d = new Date(n.getTime() + 7 * 864e5);
      inp.value = toInput(d); upd();
    };
    ok.onclick = async () => {
      const d = val();
      if (!d) return A.toast('اختر تاريخاً ووقتاً صحيحين', 'err');
      if (d < new Date(Date.now() + 90000)) return A.toast('الموعد لازم يكون بالمستقبل (بعد دقيقتين على الأقل)', 'err');
      if (d > new Date(Date.now() + 365 * 864e5)) return A.toast('أقصى مدة للجدولة سنة واحدة', 'err');
      ok.disabled = true;
      try { await onOk(d); close(); }
      catch (e) { ok.disabled = false; A.toast(e && e.code === '22023' ? 'الموعد لازم يكون بالمستقبل' : 'تعذر الحفظ', 'err'); }
    };
  }

  /* ---------- ربط الجدولة بصفحة كتابة المنشور (بدون تعديل create.js) ---------- */
  let pending = null, wait = null, pendTimer = null;
  const origFrom = A.sb.from.bind(A.sb);
  A.sb.from = function (t) {
    const q = origFrom(t);
    if (t === 'posts' && pending) {
      const at = pending, ins = q.insert, upd = q.update;
      q.insert = function (r) { pending = null; return ins.call(this, Array.isArray(r) ? r.map(x => ({ ...x, scheduled_at: at })) : { ...r, scheduled_at: at }); };
      q.update = function (r) { pending = null; return upd.call(this, { ...r, scheduled_at: at }); };
    }
    return q;
  };
  const origToast = A.toast;
  A.toast = function (m, t) {
    if (wait && m === 'تم حفظ المسودة') {
      const w = wait; wait = null;
      setTimeout(() => { location.hash = '#/scheduled'; }, 600);
      return origToast.call(this, 'تمت الجدولة، سيُنشر ' + fmtFull(w), 'ok');
    }
    if (wait && t === 'err') wait = null;
    return origToast.apply(this, arguments);
  };

  function schedule(layer) {
    const txt = (document.getElementById('cr-text') || {}).value || '';
    if (!txt.trim() && !document.querySelectorAll('#cr-media .th').length) return A.toast('اكتب منشوراً أو أضف وسائط أولاً', 'err');
    pickTime(null, 'جدولة النشر', 'تأكيد الجدولة', d => {
      pending = d.toISOString(); wait = d;
      clearTimeout(pendTimer); pendTimer = setTimeout(() => { pending = null; wait = null; }, 40000);
      const b = layer.querySelector('[data-k="draft"]');
      if (b) b.click();
    });
  }

  // إضافة الخيارات لقائمة (•••) في صفحة كتابة المنشور
  document.addEventListener('click', e => {
    if (!e.target.closest('#cr-more')) return;
    pending = null; wait = null;
    setTimeout(() => {
      const l = document.getElementById('cr-layer'), d = l && l.querySelector('[data-k="drafts"]');
      if (!d || l.querySelector('[data-sc]')) return;
      d.insertAdjacentHTML('afterend', `<button class="opt" data-sc="set">${A.icon('scClock')}<div>جدولة النشر<small>نشر تلقائي بتاريخ ووقت تختاره</small></div></button>
        <button class="opt" data-sc="list">${A.icon('scClock')}<div>المنشورات المجدولة</div></button>`);
      l.querySelector('[data-sc="set"]').onclick = ev => { ev.stopPropagation(); schedule(l); };
      l.querySelector('[data-sc="list"]').onclick = ev => {
        ev.stopPropagation();
        const t = document.getElementById('cr-text');
        if (t && t.value.trim() && !confirm('سيتم ترك الصفحة ولن يُحفظ ما كتبته. متابعة؟')) return;
        location.hash = '#/scheduled';
      };
    }, 0);
  });

  /* ---------- صفحة المنشورات المجدولة ---------- */
  function page(view) {
    view.innerHTML = `<div class="set"><div class="set-head"><button class="icon-btn" id="sc-back" aria-label="رجوع">${A.icon('arrow')}</button><h1>المنشورات المجدولة</h1></div><div class="set-body" id="sc-body"></div></div>`;
    const body = view.querySelector('#sc-body');
    view.querySelector('#sc-back').onclick = () => { history.length > 1 ? history.back() : (location.hash = '#/profile'); };
    let rows = [], timer = null;

    function paint() {
      let html = `<div class="sc-sum"><span>${rows.length ? rows.length + ' بانتظار النشر' : 'لا توجد منشورات مجدولة'}</span><button class="btn sm" id="sc-new">جدولة منشور</button></div>`;
      if (!rows.length) {
        html += `<div class="sc-empty">${A.icon('scClock')}<div>لا توجد منشورات مجدولة</div><div>اكتب منشوراً، ثم من قائمة (•••) اختر «جدولة النشر».</div></div>`;
      } else {
        html += rows.map(p => {
          const d = new Date(p.scheduled_at);
          const m = [...(p.media || [])].sort((a, b) => a.position - b.position)[0];
          const th = m ? `<div class="sc-th">${m.type === 'video' ? `<video src="${A.esc(m.url)}#t=0.1" muted playsinline preload="metadata"></video>` : `<img loading="lazy" src="${A.esc(m.url)}" alt="">`}</div>` : '';
          return `<div class="sc-row" data-id="${p.id}"><div class="sc-top">${th}<div class="sc-m">
            <div class="sc-t">${A.esc(cut(p.content, 140) || '(وسائط فقط)')}</div>
            <div class="sc-when">${A.icon('scClock')}<b>${A.esc(fmtFull(d))}</b><span class="sc-chip">${left(d)}</span></div></div></div>
            <div class="sc-act"><button class="btn ghost sm" data-a="edit">تعديل</button><button class="btn ghost sm" data-a="time">تغيير الموعد</button><button class="btn sm" data-a="now">نشر الآن</button><button class="btn ghost sm" data-a="cancel">إلغاء الجدولة</button>
            <button class="sc-x" data-a="del" aria-label="حذف">${A.icon('scTrash')}</button></div></div>`;
        }).join('');
      }
      const y = body.scrollTop;
      body.innerHTML = html;
      body.scrollTop = y;
    }

    async function load(silent) {
      if (!silent) body.innerHTML = sk(3);
      const { data, error } = await A.sb.from('posts').select('id,content,scheduled_at,media:post_media(url,type,position)')
        .eq('user_id', me().id).eq('is_draft', true).not('scheduled_at', 'is', null).order('scheduled_at', { ascending: true }).limit(100);
      if (!view.isConnected) return;
      if (error) {
        if (silent) return;
        body.innerHTML = '<div class="empty">تعذر تحميل المنشورات المجدولة<br><button class="btn sm" id="sc-retry">إعادة المحاولة</button></div>';
        body.querySelector('#sc-retry').onclick = () => load();
        return;
      }
      rows = data || []; paint();
    }

    async function edit(id) {
      // نحدّث المنشور لتظهر مسودته أولاً بقائمة المسودات ثم نفتحها في صفحة الكتابة
      await A.sb.from('posts').update({ is_draft: true }).eq('id', id);
      location.hash = '#/create';
      const t0 = Date.now();
      const step = () => {
        const more = document.getElementById('cr-more');
        if (!more) return Date.now() - t0 < 3000 ? setTimeout(step, 100) : A.toast('تعذر فتح المنشور', 'err');
        more.click();
        setTimeout(() => {
          const d = document.querySelector('#cr-layer [data-k="drafts"]');
          if (!d) return A.toast('تعذر فتح المنشور', 'err');
          d.click();
          const t1 = Date.now();
          const find = () => {
            const o = document.querySelector('#cr-layer [data-open="' + id + '"]');
            if (o) return o.click();
            if (Date.now() - t1 < 4000) setTimeout(find, 150); else A.toast('تعذر فتح المنشور', 'err');
          };
          find();
        }, 60);
      };
      step();
    }

    body.onclick = async e => {
      if (e.target.closest('#sc-new')) { location.hash = '#/create'; return; }
      const b = e.target.closest('[data-a]');
      if (!b) return;
      const row = b.closest('[data-id]'), id = row.dataset.id, p = rows.find(x => x.id === id);
      if (!p) return;
      const a = b.dataset.a;
      if (a === 'edit') return edit(id);
      if (a === 'time') {
        return pickTime(new Date(p.scheduled_at), 'تغيير الموعد', 'حفظ الموعد', async d => {
          const { error } = await A.sb.from('posts').update({ scheduled_at: d.toISOString() }).eq('id', id).eq('is_draft', true);
          if (error) throw error;
          p.scheduled_at = d.toISOString();
          rows.sort((x, y) => new Date(x.scheduled_at) - new Date(y.scheduled_at));
          paint(); A.toast('تم تغيير الموعد', 'ok');
        });
      }
      if (a === 'now') {
        if (!confirm('نشر هذا المنشور الآن؟')) return;
        b.disabled = true;
        const { error } = await A.sb.rpc('publish_scheduled_now', { p_id: id });
        if (error) { b.disabled = false; return A.toast('تعذر النشر', 'err'); }
        rows = rows.filter(x => x.id !== id); paint(); A.loadProfile(); return A.toast('تم النشر بنجاح 🎉', 'ok');
      }
      if (a === 'cancel') {
        if (!confirm('إلغاء الجدولة؟ سيرجع المنشور مسودة ولن يُنشر تلقائياً.')) return;
        b.disabled = true;
        const { error } = await A.sb.from('posts').update({ scheduled_at: null }).eq('id', id).eq('is_draft', true);
        if (error) { b.disabled = false; return A.toast('تعذر الإلغاء', 'err'); }
        rows = rows.filter(x => x.id !== id); paint(); return A.toast('أُلغيت الجدولة، المنشور الآن مسودة', 'ok');
      }
      if (a === 'del') {
        if (!confirm('حذف هذا المنشور المجدول نهائياً؟')) return;
        b.disabled = true;
        const paths = (p.media || []).map(m => pathOf(m.url)).filter(Boolean);
        const { error } = await A.sb.from('posts').delete().eq('id', id).eq('is_draft', true);
        if (error) { b.disabled = false; return A.toast('تعذر الحذف', 'err'); }
        if (paths.length) A.sb.storage.from('posts').remove(paths);
        rows = rows.filter(x => x.id !== id); paint(); return A.toast('تم حذف المنشور المجدول', 'ok');
      }
    };

    // تحديث تلقائي: المنشورات التي نُشرت تختفي من القائمة
    timer = setInterval(() => { if (!view.isConnected) return clearInterval(timer); load(true); }, 30000);
    load();
  }

  A.pages.scheduled = { render: page, refresh() { const v = document.getElementById('view'); if (v) page(v); } };

  /* ---------- «المنشورات المجدولة» في الإعدادات > النشاط ---------- */
  const prevS = A.pages.settings.render;
  A.pages.settings.render = function (view, param) {
    const r = prevS.apply(this, arguments);
    if (!(param || '').split('/')[0]) {
      const sec = [...view.querySelectorAll('.set-sec')].find(x => x.textContent.trim() === 'النشاط');
      const card = sec && sec.nextElementSibling;
      if (card && !card.querySelector('[data-sc-row]')) {
        card.insertAdjacentHTML('beforeend', `<button class="sr" data-sc-row="1"><span class="sr-i">${A.icon('scClock')}</span><span class="sr-l">المنشورات المجدولة</span><span class="sr-c">${A.icon('chev')}</span></button>`);
        card.lastElementChild.onclick = ev => { ev.stopPropagation(); location.hash = '#/scheduled'; };
      }
    }
    return r;
  };
})();