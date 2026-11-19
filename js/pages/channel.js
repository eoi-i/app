(function () {
  const A = App, me = () => A.state.user;
  const GIF = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

  Object.assign(A.icons, {
    megaphone: '<path d="M3 11v2a1 1 0 001 1h2l5 4V6L6 10H4a1 1 0 00-1 1z"/><path d="M15 8a5 5 0 010 8M18 5a9 9 0 010 14"/>',
    eyeI: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>'
  });

  const st = document.createElement('style');
  st.textContent = `
.cp{background:var(--card);border:1px solid var(--line);border-radius:18px;margin:0 0 10px;overflow:hidden;box-shadow:var(--shadow);animation:fade .25s}
.cp-t{padding:11px 14px 4px;font-size:15px;line-height:1.75;white-space:pre-wrap;word-break:break-word}
.cp img,.cp video{display:block;width:100%;max-height:60vh;object-fit:cover;background:#000}
.cp-pin{padding:7px 14px 0;font-size:12px;font-weight:800;color:#14A585}
.cp-f{display:flex;align-items:center;gap:12px;padding:6px 14px 10px;font-size:12px;color:var(--muted)}
.cp-f span{display:flex;align-items:center;gap:4px}
.cp-f .ic{width:14px;height:14px}
.cp-pin{display:flex;align-items:center;gap:5px}
.cp-pin .ic{width:14px;height:14px}
.ch-t button{display:flex;align-items:center;justify-content:center;gap:7px}
.ch-t .ic{width:18px;height:18px}
.chb .alt{display:flex;align-items:center;justify-content:center;gap:8px}
.chb .alt .ic{width:18px;height:18px}
.gi-h .p-sub{display:flex;align-items:center;justify-content:center;gap:6px}
.gi-h .p-sub .ic{width:16px;height:16px}
.cp-m{margin-inline-start:auto;padding:0 6px;font-size:20px;line-height:1;color:var(--muted);font-weight:800}
.cp.flash{animation:flashB 1.6s}
.cp-k{display:flex;align-items:center;gap:6px;padding:8px 14px 0;font-size:12px;font-weight:800}
.cp-k .ic{width:14px;height:14px}
.cp-k.nw{color:#4DA3FF}
.cp-k.an{color:#E5B53D}
.cp.an{border-color:rgba(229,181,61,.55);box-shadow:0 0 0 1px rgba(229,181,61,.15),var(--shadow)}
.cp-c{display:flex;align-items:center;gap:7px;width:calc(100% - 24px);margin:6px 12px 0;padding:9px 12px;border-radius:12px;background:var(--chip);font-size:13px;font-weight:700;color:var(--primary-2)}
.cp-c .ic{width:17px;height:17px}
.stg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:6px 0 4px}
.stg div{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:12px 6px;text-align:center;box-shadow:var(--shadow)}
.stg b{display:block;font-size:20px;font-weight:800}
.stg span{display:block;font-size:11.5px;color:var(--muted);margin-top:2px;line-height:1.4}
.bars{display:flex;align-items:flex-end;gap:2px;height:96px;direction:ltr}
.bars i{flex:1;border-radius:3px 3px 0 0;min-height:3px}
.bars-l{display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-top:6px;direction:ltr}
.pl{padding:12px 14px 4px}
.pl-h{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:800;color:#4DA3FF;margin-bottom:6px}
.pl-h .ic{width:15px;height:15px}
.pl-q{font-size:16px;font-weight:800;line-height:1.6;margin-bottom:10px;white-space:pre-wrap;word-break:break-word}
.pl-o{display:block;width:100%;text-align:start;padding:12px 14px;margin-bottom:8px;border-radius:14px;background:var(--chip);border:1px solid var(--line);font-weight:700;font-size:14.5px;color:var(--text)}
.pl-o:active{background:var(--line)}
.pl-r{position:relative;display:flex;align-items:center;gap:8px;padding:12px 14px;margin-bottom:8px;border-radius:14px;background:var(--chip);border:1px solid var(--line);overflow:hidden;font-size:14.5px;font-weight:700}
.pl-r i{position:absolute;inset-block:0;inset-inline-start:0;background:rgba(20,165,133,.28);transition:width .5s}
.pl-r.me{border-color:#14A585}
.pl-r.me i{background:rgba(20,165,133,.45)}
.pl-r span,.pl-r b{position:relative}
.pl-r span{flex:1}
.pl-add{display:flex!important;flex-direction:row!important;align-items:center;justify-content:center;gap:8px;height:48px;padding:0 14px!important;line-height:1}
.pl-add .ic{width:18px;height:18px;flex:none}
.pl-t{font-size:12px;color:var(--muted);margin:2px 2px 6px}
.tp{margin:12px;padding:18px 16px;border-radius:18px;background:linear-gradient(135deg,#0E7C66,#14A585 60%,#E5B53D);color:#fff;text-align:center}
.tp-l{display:flex;align-items:center;justify-content:center;gap:6px;font-size:12.5px;font-weight:800;opacity:.9;margin-bottom:8px}
.tp-l .ic{width:16px;height:16px}
.tp-t{font-size:19px;font-weight:800;line-height:1.6;word-break:break-word}
.tp-e{margin-top:10px;display:inline-block;font-size:12px;font-weight:700;padding:4px 12px;border-radius:12px;background:rgba(0,0,0,.25)}
.tp-e:empty{display:none}
.tp-sg{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}
.tp-sg button{padding:8px 13px;border-radius:18px;background:var(--chip);border:1px solid var(--line);font-size:13px;font-weight:700;color:var(--text)}
.cm-img{display:block;max-width:100%;max-height:260px;border-radius:12px;margin-top:6px;object-fit:cover}
.cp-day{text-align:center;margin:8px 0 10px}
.cp-day span{font-size:12px;background:var(--chip);color:var(--muted);padding:4px 12px;border-radius:12px}
.chb{display:flex;gap:8px;align-items:center;padding:10px 12px calc(10px + env(safe-area-inset-bottom));border-top:1px solid var(--line);background:var(--bg);flex:none}
.chb .gp-go,.chb button.big{flex:1;margin:0;padding:13px;border-radius:14px;background:linear-gradient(135deg,#0E7C66,#14A585);color:#fff;font-weight:800;font-size:15px}
.chb button.alt{flex:1;padding:12px;border-radius:14px;background:var(--chip);font-weight:700;color:var(--text);border:1px solid var(--line)}
.chatt[hidden]{display:none!important}
.ch-t.wr{flex-wrap:wrap}
.ch-t.wr button{flex:1 1 30%}
.chatt{display:flex;align-items:center;gap:6px;padding:6px 12px;margin:0 12px;border-radius:14px;background:var(--chip);font-size:13px;font-weight:700;flex:none}
.chatt button{margin-inline-start:auto;font-size:15px;padding:0 6px}
.ch-t{display:flex;gap:8px;margin:6px 0}
.ch-t button{flex:1;padding:12px 6px;border-radius:14px;background:var(--chip);border:1px solid var(--line);font-weight:800;font-size:14px;color:var(--muted)}
.ch-t button.on{background:linear-gradient(135deg,#0E7C66,#14A585);color:#fff;border-color:transparent}
.ch-hd{direction:ltr;display:flex;align-items:center;background:var(--chip);border:1px solid var(--line);border-radius:14px;padding:0 12px}
.ch-hd span{color:var(--muted);font-size:14px}
.ch-hd input{border:0!important;background:none!important;padding:13px 4px!important;direction:ltr;text-align:left}
.ch-tag{display:inline-block;font-size:11px;font-weight:800;padding:2px 8px;border-radius:10px;background:rgba(20,165,133,.18);color:#14A585;margin-inline-start:6px}
.cd-r{display:flex;align-items:center;gap:11px;width:100%;padding:10px 4px;text-align:start;border-bottom:1px solid var(--line)}
.cd-r .gp-n{flex:1;min-width:0}`;
  document.head.appendChild(st);

  const tm = iso => new Date(iso).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' });
  const dk = iso => new Date(iso).toDateString();
  const dayLabel = iso => {
    const d = new Date(iso), n = new Date(), y = new Date(n); y.setDate(n.getDate() - 1);
    return d.toDateString() === n.toDateString() ? 'اليوم' : d.toDateString() === y.toDateString() ? 'أمس' : d.toLocaleDateString('ar-IQ', { day: 'numeric', month: 'long' });
  };
  const fmt = n => { n = n || 0; return n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n); };
  const link = key => location.href.split('#')[0] + '#/c/' + encodeURIComponent(key);
  const keyOf = c => c.is_public && c.handle ? c.handle : c.invite_code || c.id;

  const resizeTo = (file, max, type, q) => new Promise(res => {
    if (file.type === 'image/gif') return res(file);
    const im = new Image(), u = URL.createObjectURL(file);
    im.onload = () => {
      const k = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas');
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
      c.toBlob(b => res(b || file), type, q);
    };
    im.onerror = () => res(file); im.src = u;
  });
  async function uploadAvatar(file) {
    const b = await resizeTo(file, 512, 'image/webp', .88);
    const path = `${me().id}/c_${Date.now()}.webp`;
    const { error } = await A.sb.storage.from('stickers').upload(path, b, { contentType: 'image/webp' });
    if (error) throw error;
    return A.sb.storage.from('stickers').getPublicUrl(path).data.publicUrl;
  }
  const pickFile = (accept, cb) => { const f = document.createElement('input'); f.type = 'file'; f.accept = accept; f.onchange = () => { if (f.files[0]) cb(f.files[0]); }; f.click(); };
  const page = (title, html) => {
    const el = document.createElement('div');
    el.className = 'cr'; el.style.zIndex = 85;
    el.innerHTML = `<div class="cr-head"><button class="icon-btn" data-x aria-label="رجوع">${A.icon('arrow')}</button><div class="cr-title">${title}</div><span style="width:44px"></span></div><div class="cr-body"><div class="gp">${html}</div></div>`;
    document.body.appendChild(el);
    el.querySelector('[data-x]').onclick = () => el.remove();
    return el;
  };
  const cleanHandle = v => v.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 32);

  /* ---------- زر + (مجموعة / قناة) ---------- */
  A.newChat = () => {
    const sh = A.sheet(`<h3>إنشاء جديد</h3>
      <button class="opt" data-k="g">${A.icon('users')}<div>مجموعة جديدة<small>محادثة جماعية يكتب فيها الأعضاء</small></div></button>
      <button class="opt" data-k="c">${A.icon('megaphone')}<div>قناة جديدة<small>تنشر فيها للمشتركين مثل تلجرام</small></div></button>
      <button class="opt" data-k="d">${A.icon('search')}<div>اكتشف القنوات</div></button>`);
    sh.el.onclick = e => {
      const b = e.target.closest('[data-k]'); if (!b) return; sh.close();
      if (b.dataset.k === 'g') A.createGroup && A.createGroup();
      else if (b.dataset.k === 'c') A.createChannel();
      else A.discoverChannels();
    };
  };

  /* ---------- إنشاء قناة ---------- */
  A.createChannel = () => {
    let avFile = null, pub = true, cm = true;
    const el = page('قناة جديدة', `<div class="gp-av" id="c-av">${A.icon('camera')}</div><div class="p-sub" style="text-align:center">صورة القناة (اختياري)</div>
      <div class="gp-lb">اسم القناة</div><input type="text" id="c-n" maxlength="60" placeholder="مثال: أخبار العراق">
      <div class="gp-lb">الوصف (اختياري)</div><textarea id="c-d" maxlength="500" placeholder="عن ماذا تتحدث قناتك؟"></textarea>
      <div class="gp-lb">نوع القناة</div><div class="ch-t"><button class="on" data-t="1">${A.icon('globe')}عامة</button><button data-t="0">${A.icon('lock')}خاصة</button></div>
      <div class="p-sub" id="c-th" style="margin:0 4px 6px">يمكن لأي شخص البحث عنها والاشتراك بها عبر رابطها.</div>
      <div id="c-hw"><div class="gp-lb">رابط القناة</div><div class="ch-hd"><span>/c/</span><input type="text" id="c-h" maxlength="32" placeholder="my_channel" autocapitalize="off" autocomplete="off"></div><div class="p-sub" style="margin:4px 4px 0">أحرف إنجليزية وأرقام و _ فقط (3 أحرف على الأقل)</div></div>
      <div class="gi-card" style="margin-top:16px"><button class="gi-sw" id="c-cm"><span class="t">السماح بالتعليقات<small>يمكن للمشتركين التعليق على المنشورات</small></span><span class="sw on"></span></button></div>
      <button class="gp-go" id="c-go" disabled>إنشاء القناة</button>`);
    const q = s => el.querySelector(s), go = q('#c-go'), nm = q('#c-n'), hd = q('#c-h');
    const sync = () => { go.disabled = !nm.value.trim() || (pub && hd.value.length < 3); };
    nm.oninput = sync; hd.oninput = () => { hd.value = cleanHandle(hd.value); sync(); };
    q('#c-av').onclick = () => pickFile('image/*', f => { if (!f.type.startsWith('image/')) return A.toast('اختر صورة', 'err'); avFile = f; q('#c-av').innerHTML = `<img alt="" src="${URL.createObjectURL(f)}">`; q('#c-av').style.borderStyle = 'solid'; });
    el.querySelectorAll('[data-t]').forEach(b => b.onclick = () => {
      pub = b.dataset.t === '1';
      el.querySelectorAll('[data-t]').forEach(x => x.classList.toggle('on', x === b));
      q('#c-hw').style.display = pub ? '' : 'none';
      q('#c-th').textContent = pub ? 'يمكن لأي شخص البحث عنها والاشتراك بها عبر رابطها.' : 'لا تظهر في البحث، والانضمام فقط عبر رابط دعوة خاص.';
      sync();
    });
    q('#c-cm').onclick = e => { cm = !cm; e.currentTarget.querySelector('.sw').classList.toggle('on', cm); };
    go.onclick = async () => {
      go.disabled = true; go.textContent = 'جاري الإنشاء...';
      try {
        const av = avFile ? await uploadAvatar(avFile) : null;
        const { data, error } = await A.sb.rpc('create_channel', { p_name: nm.value.trim(), p_handle: hd.value, p_desc: q('#c-d').value.trim(), p_avatar: av, p_public: pub, p_comments: cm });
        if (error) throw error;
        el.remove(); location.hash = '#/c/' + data;
      } catch (e) {
        console.error(e);
        A.toast(/duplicate|unique/i.test((e && e.message) || '') ? 'هذا الرابط مستخدم، اختر رابطاً آخر' : 'تعذر إنشاء القناة', 'err');
        go.textContent = 'إنشاء القناة'; sync();
      }
    };
  };

  /* ---------- اكتشاف القنوات ---------- */
  A.discoverChannels = () => {
    const el = page('اكتشف القنوات', `<input type="text" id="d-q" placeholder="ابحث باسم القناة أو رابطها..." autocomplete="off"><div id="d-l" style="margin-top:8px"></div>`);
    const out = el.querySelector('#d-l'), inp = el.querySelector('#d-q');
    let seq = 0;
    async function load() {
      const my = ++seq;
      out.innerHTML = '<div class="sk" style="height:60px"></div>';
      const { data } = await A.sb.rpc('discover_channels', { p_q: inp.value.trim() });
      if (my !== seq) return;
      out.innerHTML = (data || []).length ? data.map(c => `<button class="cd-r" data-k="${A.esc(c.handle)}">${A.avatar({ display_name: c.name, avatar_url: c.avatar_url }, 46)}<div class="gp-n"><b>${A.esc(c.name)}</b><br><small class="p-sub">${fmt(c.subs)} مشترك${c.description ? ' · ' + A.esc(c.description.slice(0, 50)) : ''}</small></div></button>`).join('') : '<div class="empty" style="padding:24px 0">لا توجد قنوات</div>';
    }
    let t; inp.oninput = () => { clearTimeout(t); t = setTimeout(load, 300); };
    out.onclick = e => { const b = e.target.closest('[data-k]'); if (b) { el.remove(); location.hash = '#/c/' + b.dataset.k; } };
    load();
  };

  /* ---------- صفحة القناة ---------- */
  A.pages.c = {
    async render(view, key) {
      view.innerHTML = `<div class="chat"><div class="chat-head"><button class="icon-btn" id="k-back" aria-label="رجوع">${A.icon('arrow')}</button><button class="who" id="k-who"><div class="sk" style="width:40px;height:40px;border-radius:50%"></div></button><button class="icon-btn" id="k-menu" aria-label="المزيد">${A.icon('more')}</button></div>
        <button class="pinbar" id="k-pin" hidden></button><div class="chat-body" id="k-body"><div class="empty">جاري التحميل...</div></div><div id="k-foot"></div></div>`;
      const root = view.querySelector('.chat'), q = s => root.querySelector(s), body = q('#k-body'), foot = q('#k-foot');
      q('#k-back').onclick = () => { history.length > 1 ? history.back() : (location.hash = '#/chats'); };
      const vv = window.visualViewport; let stick = true, rt = null;
      const stop = () => { if (vv) { vv.removeEventListener('resize', fit); vv.removeEventListener('scroll', fit); } if (rt) { A.sb.removeChannel(rt); rt = null; } window.removeEventListener('hashchange', onHash); };
      const fit = () => { if (!root.isConnected) return stop(); root.style.height = vv.height + 'px'; root.style.top = vv.offsetTop + 'px'; if (stick) body.scrollTop = body.scrollHeight; };
      const onHash = () => { if (!root.isConnected) stop(); };
      if (vv) { vv.addEventListener('resize', fit); vv.addEventListener('scroll', fit); fit(); }
      window.addEventListener('hashchange', onHash);
      body.addEventListener('scroll', () => { stick = body.scrollHeight - body.scrollTop - body.clientHeight < 80; });

      const r = await A.sb.rpc('channel_info', { p_key: key });
      let ch = r.data && r.data[0];
      if (!ch) { body.innerHTML = '<div class="empty">القناة غير متاحة أو الرابط غير صالح</div>'; return; }
      const isAdm = () => ch.my_role === 'owner' || ch.my_role === 'admin';
      const isSub = () => !!ch.my_role;
      const key2 = () => keyOf(ch);

      const head = () => {
        q('#k-who').innerHTML = `${A.avatar({ display_name: ch.name, avatar_url: ch.avatar_url }, 40)}<div style="min-width:0"><div class="p-name">${A.esc(ch.name)}<span class="ch-tag">${ch.is_public ? 'عامة' : 'خاصة'}</span></div><div class="p-sub">${fmt(ch.subs)} مشترك</div></div>`;
      };
      head();
      const info = () => A.channelInfo(ch, async () => { const x = await A.sb.rpc('channel_info', { p_key: ch.id }); if (x.data && x.data[0]) { ch = x.data[0]; head(); drawFoot(); renderAll(); } });
      q('#k-who').onclick = info; q('#k-menu').onclick = info;

      /* المنشورات */
      const P = { list: [], ids: new Set(), more: false };
      const PS = 'id,channel_id,author_id,content,media_url,media_type,created_at,pinned_at,views_count,kind,comments_count,published_at,scheduled_at,poll_options,ends_at';
      const PV = {};
      const cmtLabel = p => p.kind === 'topic' ? (p.comments_count ? fmt(p.comments_count) + ' رد' : 'شارك رداً') : (p.comments_count ? fmt(p.comments_count) + ' تعليق' : 'التعليقات');
      const endsLabel = p => {
        if (!p.ends_at) return '';
        const ms = new Date(p.ends_at) - Date.now();
        if (ms <= 0) return 'انتهى النقاش';
        const h = Math.floor(ms / 3600e3), m = Math.max(1, Math.round(ms % 3600e3 / 60e3));
        return h >= 1 ? `ينتهي بعد ${h} ساعة` : `ينتهي بعد ${m} دقيقة`;
      };
      const pollHTML = p => {
        const opts = p.poll_options || [], r = PV[p.id] || { counts: [], mine: null, total: 0 }, show = r.mine != null || isAdm();
        return `<div class="pl"><div class="pl-h">${A.icon('chart')}استطلاع رأي</div><div class="pl-q">${A.esc(p.content)}</div>${opts.map((o, i) => {
          const n = r.counts[i] || 0, pc = r.total ? Math.round(n / r.total * 100) : 0;
          return show ? `<div class="pl-r${r.mine === i ? ' me' : ''}"><i style="width:${pc}%"></i><span>${A.esc(o)}</span><b>${pc}%</b></div>` : `<button class="pl-o" data-pv="${i}">${A.esc(o)}</button>`;
        }).join('')}<div class="pl-t">${fmt(r.total)} صوت${!show ? ' · صوّت لتشاهد النتائج' : ''}</div></div>`;
      };
      const topicHTML = p => `<div class="tp"><div class="tp-l">${A.icon('comment')}موضوع للنقاش</div><div class="tp-t">${A.esc(p.content)}</div><div class="tp-e">${endsLabel(p)}</div></div>`;
      async function loadPolls(patch) {
        const ids = P.list.filter(p => p.kind === 'poll').map(p => p.id);
        if (!ids.length) return;
        const { data } = await A.sb.rpc('channel_poll_results', { pids: ids });
        ids.forEach(id => { PV[id] = { counts: [], mine: null, total: 0 }; });
        (data || []).forEach(x => { const r = PV[x.post_id]; r.counts[x.idx] = Number(x.n); r.total += Number(x.n); if (x.mine) r.mine = x.idx; });
        if (patch) ids.forEach(id => { const p = P.list.find(x => x.id === id); if (p) patchCard(p); });
      }
      function patchCard(p) {
        const el = body.querySelector(`.cp[data-id="${p.id}"]`); if (!el) return;
        const t = document.createElement('div'); t.innerHTML = postHTML(p, dk(p.published_at));
        const n = t.firstElementChild; n.dataset.w = 1; el.replaceWith(n);
      }
      const postHTML = (p, prev) => {
        const sep = dk(p.published_at) !== prev ? `<div class="cp-day"><span>${dayLabel(p.published_at)}</span></div>` : '';
        const badge = p.kind === 'news' ? `<div class="cp-k nw">${A.icon('file')}خبر</div>` : p.kind === 'announcement' ? `<div class="cp-k an">${A.icon('megaphone')}إعلان</div>` : '';
        const cmt = (ch.comments_enabled || p.kind === 'topic') ? `<button class="cp-c" data-c>${A.icon('comment')}<span>${cmtLabel(p)}</span></button>` : '';
        const media = p.media_type === 'video' ? `<video controls playsinline preload="metadata" poster="${GIF}" src="${A.esc(p.media_url)}"></video>` : p.media_type === 'image' ? `<img alt="" loading="lazy" src="${A.esc(p.media_url)}">` : '';
        return `${sep}<div class="cp${p.kind === 'announcement' ? ' an' : ''}" data-id="${p.id}">${badge}${p.pinned_at ? `<div class="cp-pin">${A.icon('pinI')}منشور مثبت</div>` : ''}${media}${p.kind === 'poll' ? pollHTML(p) : p.kind === 'topic' ? topicHTML(p) : p.content ? `<div class="cp-t">${A.linkify(p.content)}</div>` : ''}${cmt}<div class="cp-f"><span>${A.icon('eyeI')}<b data-v>${fmt(p.views_count)}</b></span><span>${tm(p.published_at)}</span>${isAdm() ? '<button class="cp-m" data-m aria-label="خيارات">⋯</button>' : ''}</div></div>`;
      };
      const io = new IntersectionObserver(es => es.forEach(e => {
        const el = e.target;
        if (e.isIntersecting) { if (!el._t) el._t = setTimeout(async () => { io.unobserve(el); if (!isSub() && !ch.is_public) return; await A.sb.rpc('record_channel_view', { pid: el.dataset.id }); const { data } = await A.sb.from('channel_posts').select('views_count').eq('id', el.dataset.id).maybeSingle(); if (data) { const b = el.querySelector('[data-v]'); if (b) b.textContent = fmt(data.views_count); } }, 1200); }
        else if (el._t) { clearTimeout(el._t); el._t = null; }
      }), { root: body, threshold: .6 });
      const watch = () => body.querySelectorAll('.cp:not([data-w])').forEach(el => { el.dataset.w = 1; io.observe(el); });
      function renderAll() {
        let prev = null;
        body.innerHTML = (P.more ? '<button class="btn ghost sm more-old" id="k-old">تحميل منشورات أقدم</button>' : '') +
          (P.list.length ? P.list.map(p => { const h = postHTML(p, prev); prev = dk(p.published_at); return h; }).join('') : `<div class="empty">${isAdm() ? 'لا توجد منشورات بعد.<br>اكتب أول منشور من الأسفل' : 'لا توجد منشورات بعد'}</div>`);
        watch(); renderPin();
      }
      function renderPin() {
        const b = q('#k-pin'), pins = P.list.filter(p => p.pinned_at).sort((a, c) => new Date(c.pinned_at) - new Date(a.pinned_at));
        if (!pins.length) { b.hidden = true; return; }
        b.hidden = false; b.dataset.id = pins[0].id;
        b.innerHTML = `<span class="pi">${A.icon('pinI')}</span><div><b>منشور مثبت</b><span>${A.esc(pins[0].content ? pins[0].content.slice(0, 80) : (pins[0].media_type === 'video' ? 'فيديو' : 'صورة'))}</span></div>`;
      }
      q('#k-pin').onclick = e => {
        const el = body.querySelector(`.cp[data-id="${e.currentTarget.dataset.id}"]`);
        if (el) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1700); }
      };
      async function load() {
        const { data, error } = await A.sb.from('channel_posts').select(PS).eq('channel_id', ch.id).order('published_at', { ascending: false }).limit(40);
        if (error) { body.innerHTML = '<div class="empty">تعذر تحميل المنشورات</div>'; return; }
        P.list = (data || []).reverse(); P.ids = new Set(P.list.map(p => p.id)); P.more = (data || []).length === 40;
        await loadPolls(false);
        renderAll(); body.scrollTop = body.scrollHeight;
        if (isSub()) A.sb.rpc('channel_mark_read', { cid: ch.id }).then(() => {});
      }
      body.addEventListener('click', async e => {
        if (e.target.closest('#k-old')) {
          const first = P.list[0]; if (!first) return;
          const { data } = await A.sb.from('channel_posts').select(PS).eq('channel_id', ch.id).lt('published_at', first.published_at).order('published_at', { ascending: false }).limit(40);
          const old = (data || []).reverse().filter(p => !P.ids.has(p.id)); old.forEach(p => P.ids.add(p.id));
          P.list = [...old, ...P.list]; P.more = (data || []).length === 40;
          const h = body.scrollHeight; renderAll(); body.scrollTop = body.scrollHeight - h; return;
        }
        const pv = e.target.closest('[data-pv]');
        if (pv) {
          const p = P.list.find(x => x.id === pv.closest('.cp').dataset.id); if (!p) return;
          if (!isSub()) return A.toast('اشترك في القناة للتصويت', 'err');
          const { error } = await A.sb.rpc('channel_poll_vote', { pid: p.id, p_idx: +pv.dataset.pv });
          if (error) return A.toast('تعذر التصويت', 'err');
          await loadPolls(true); return;
        }
        const cbtn = e.target.closest('[data-c]');
        if (cbtn) { const cp = P.list.find(x => x.id === cbtn.closest('.cp').dataset.id); if (cp) openComments(cp); return; }
        const m = e.target.closest('[data-m]'); if (!m) return;
        const p = P.list.find(x => x.id === m.closest('.cp').dataset.id); if (!p) return;
        const sh = A.sheet(`<h3>المنشور</h3>${p.content ? `<button class="opt" data-k="copy">${A.icon('copy')}<div>نسخ النص</div></button>` : ''}<button class="opt" data-k="pin">${A.icon('pinI')}<div>${p.pinned_at ? 'إلغاء التثبيت' : 'تثبيت المنشور'}</div></button><button class="opt" data-k="del">${A.icon('trash')}<div>حذف المنشور</div></button>`);
        sh.el.onclick = async ev => {
          const b = ev.target.closest('[data-k]'); if (!b) return; sh.close();
          if (b.dataset.k === 'copy') return navigator.clipboard.writeText(p.content).then(() => A.toast('تم النسخ', 'ok'), () => {});
          if (b.dataset.k === 'pin') { const { error } = await A.sb.rpc('channel_pin', { pid: p.id, p_pin: !p.pinned_at }); if (error) return A.toast('تعذر التنفيذ', 'err'); p.pinned_at = p.pinned_at ? null : new Date().toISOString(); return renderAll(); }
          if (!confirm('حذف هذا المنشور؟')) return;
          const { error } = await A.sb.rpc('channel_post_remove', { pid: p.id }); if (error) return A.toast('تعذر الحذف', 'err');
          P.list = P.list.filter(x => x.id !== p.id); renderAll();
        };
      });

      /* الأسفل: نشر / اشتراك */
      function openComments(p) {
        const el = document.createElement('div');
        el.className = 'cr'; el.style.zIndex = 90;
        el.innerHTML = `<div class="cr-head"><button class="icon-btn" data-x aria-label="رجوع">${A.icon('arrow')}</button><div class="cr-title">${p.kind === 'topic' ? 'الردود' : 'التعليقات'}</div><span style="width:44px"></span></div>
          <div class="cr-body"><div class="gp" id="cm-l"><div class="sk" style="height:56px"></div></div></div>
          ${isSub() && !(p.kind === 'topic' && p.ends_at && new Date(p.ends_at) < new Date()) ? `<div class="chatt" id="cm-ch" hidden><span id="cm-cn"></span><button id="cm-cx" aria-label="إزالة">✕</button></div><div class="chat-bar">${p.kind === 'topic' ? `<button class="icon-btn" id="cm-i" aria-label="صورة">${A.icon('image')}</button>` : ''}<textarea id="cm-t" rows="1" maxlength="1000" placeholder="${p.kind === 'topic' ? 'اكتب رداً...' : 'اكتب تعليقاً...'}"></textarea><button class="cm-send" id="cm-s" aria-label="إرسال">${A.icon('send')}</button></div>` : `<div class="chb"><div class="p-sub" style="text-align:center;flex:1">${isSub() ? 'انتهى هذا النقاش' : 'اشترك في القناة لتتمكن من التعليق'}</div></div>`}`;
        document.body.appendChild(el);
        const list = el.querySelector('#cm-l'); let rows = [];
        const close = () => { el.remove(); renderAll(); };
        el.querySelector('[data-x]').onclick = close;
        const paint = () => {
          list.innerHTML = rows.length ? rows.map(c => { const u = c.user || {}; const can = c.user_id === me().id || isAdm();
            return `<div class="gp-r" data-cid="${c.id}" style="align-items:flex-start">${A.avatar(u, 38)}<div class="gp-n"><b>${A.esc(u.display_name || u.username || 'مستخدم')}${u.is_verified ? A.verified : ''} <small>${tm(c.created_at)}</small></b>${c.content ? `<div style="white-space:pre-wrap;word-break:break-word;line-height:1.7;margin-top:2px">${A.esc(c.content)}</div>` : ''}${c.media_url ? `<img class="cm-img" alt="" loading="lazy" src="${A.esc(c.media_url)}">` : ''}</div>${can ? `<button data-rm="${c.id}" aria-label="حذف" style="padding:6px;color:var(--muted)">${A.icon('trash')}</button>` : ''}</div>`; }).join('') : '<div class="empty" style="padding:30px 0">لا توجد تعليقات بعد</div>';
        };
        const load = async () => {
          const { data } = await A.sb.from('channel_comments').select('id,user_id,content,media_url,created_at,user:profiles!channel_comments_user_id_fkey(id,username,display_name,avatar_url,is_verified)').eq('post_id', p.id).order('created_at', { ascending: true }).limit(200);
          rows = data || []; p.comments_count = rows.length; paint(); list.parentElement.scrollTop = list.parentElement.scrollHeight;
        };
        list.onclick = async e => {
          const b = e.target.closest('[data-rm]'); if (!b || !confirm('حذف هذا التعليق؟')) return;
          const { error } = await A.sb.rpc('channel_comment_remove', { p_id: b.dataset.rm });
          if (error) return A.toast('تعذر الحذف', 'err');
          rows = rows.filter(x => x.id !== b.dataset.rm); p.comments_count = rows.length; paint();
        };
        const ta = el.querySelector('#cm-t'); let rimg = null;
        if (ta) {
          const chip = () => { el.querySelector('#cm-ch').hidden = !rimg; if (rimg) el.querySelector('#cm-cn').textContent = 'صورة: ' + rimg.name; };
          ta.oninput = () => { ta.style.height = 'auto'; ta.style.height = Math.min(110, ta.scrollHeight) + 'px'; };
          const ib = el.querySelector('#cm-i');
          if (ib) { ib.onclick = () => pickFile('image/*', f => { if (!/^image\/(jpeg|png|webp|gif)$/.test(f.type)) return A.toast('صيغة الصورة غير مدعومة', 'err'); rimg = f; chip(); }); el.querySelector('#cm-cx').onclick = () => { rimg = null; chip(); }; }
          el.querySelector('#cm-s').onclick = async e => {
            const t = ta.value.trim(); if (!t && !rimg) return;
            const btn = e.currentTarget; btn.disabled = true;
            try {
              let url = null;
              if (rimg) {
                const b = await resizeTo(rimg, 1200, 'image/jpeg', .85);
                const path = `${ch.id}/replies/${me().id}_${Date.now()}.${rimg.type === 'image/gif' ? 'gif' : 'jpg'}`;
                const up = await A.sb.storage.from('channels').upload(path, b, { contentType: rimg.type === 'image/gif' ? 'image/gif' : 'image/jpeg' });
                if (up.error) throw up.error;
                url = A.sb.storage.from('channels').getPublicUrl(path).data.publicUrl;
              }
              const { error } = await A.sb.rpc('channel_comment_add2', { pid: p.id, p_txt: t, p_url: url });
              if (error) throw error;
              ta.value = ''; ta.style.height = 'auto'; rimg = null; chip(); load();
            } catch (er) { console.error(er); A.toast('تعذر الإرسال', 'err'); }
            btn.disabled = false;
          };
        }
        load();
      }

      let att = null, opt = { kind: 'post', at: null };
      function drawFoot() {
        if (isAdm()) {
          foot.innerHTML = `<div class="chatt" id="k-att" hidden><span id="k-an"></span><button id="k-ax" aria-label="إزالة">✕</button></div>
            <div class="chat-bar"><button class="icon-btn" id="k-clip" aria-label="إرفاق">${A.icon('clip')}</button><button class="icon-btn" id="k-opt" aria-label="خيارات النشر">${A.icon('clock')}</button><textarea id="k-ta" rows="1" maxlength="4000" placeholder="اكتب منشوراً..."></textarea><button class="cm-send" id="k-send" aria-label="نشر">${A.icon('send')}</button></div>`;
          const ta = foot.querySelector('#k-ta'), grow = () => { ta.style.height = 'auto'; ta.style.height = Math.min(120, ta.scrollHeight) + 'px'; };
          ta.oninput = grow;
          const KL = { post: 'منشور', news: 'خبر', announcement: 'إعلان' };
          const showAtt = () => {
            const parts = [];
            if (att) parts.push((att.type === 'video' ? 'فيديو: ' : 'صورة: ') + att.file.name);
            if (opt.kind !== 'post') parts.push(KL[opt.kind]);
            if (opt.at) parts.push('مجدول: ' + new Date(opt.at).toLocaleString('ar-IQ', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }));
            foot.querySelector('#k-att').hidden = !parts.length; foot.querySelector('#k-an').textContent = parts.join(' · ');
          };
          foot.querySelector('#k-opt').onclick = () => {
            const sh = A.sheet(`<h3>خيارات النشر</h3><div class="gp-lb" style="margin-top:4px">نوع المنشور</div>
              <div class="ch-t" id="o-k"><button data-v="post" class="${opt.kind === 'post' ? 'on' : ''}">عادي</button><button data-v="news" class="${opt.kind === 'news' ? 'on' : ''}">خبر</button><button data-v="announcement" class="${opt.kind === 'announcement' ? 'on' : ''}">إعلان</button></div>
              <div class="gp-lb">جدولة النشر</div><div class="ch-t wr" id="o-q"><button data-h="0" class="${opt.at ? '' : 'on'}">الآن</button><button data-h="1">بعد ساعة</button><button data-h="3">بعد 3 ساعات</button><button data-h="24">غداً</button><button data-h="168">بعد أسبوع</button></div>
              <button class="gp-go" id="o-s">تم</button>`);
            const q = s => sh.el.querySelector(s); let at = opt.at;
            q('#o-k').onclick = e => { const b = e.target.closest('[data-v]'); if (!b) return; opt.kind = b.dataset.v; q('#o-k').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); };
            q('#o-q').onclick = e => { const b = e.target.closest('[data-h]'); if (!b) return; const h = +b.dataset.h; at = h ? new Date(Date.now() + h * 3600e3).toISOString() : null; q('#o-q').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); };
            q('#o-s').onclick = () => { opt.at = at; sh.close(); showAtt(); };
          };
          foot.querySelector('#k-ax').onclick = () => { att = null; opt = { kind: 'post', at: null }; showAtt(); };
          const done = () => { const w = !!opt.at; opt = { kind: 'post', at: null }; showAtt(); stick = true; A.toast(w ? 'تمت جدولة المنشور' : 'تم النشر', 'ok'); };
          const pollSheet = () => {
            const sh = A.sheet(`<h3>استطلاع رأي</h3><div class="gp" style="padding:0"><div class="gp-lb" style="margin-top:0">السؤال</div><input type="text" id="p-q" maxlength="200" placeholder="سؤال استطلاع الرأي">
              <div class="gp-lb">الخيارات</div><div id="p-o"></div><button class="alt pl-add" id="p-add" style="width:100%;margin-top:8px;padding:12px;border-radius:14px;background:var(--chip);border:1px solid var(--line);font-weight:700;color:var(--text)">${A.icon('plus')} إضافة خيار</button>
              <button class="gp-go" id="p-s" disabled>إنشاء استطلاع رأي</button></div>`, { tall: true });
            const q = s => sh.el.querySelector(s), box = q('#p-o'), go = q('#p-s');
            const addOpt = () => { const i = document.createElement('input'); i.type = 'text'; i.maxLength = 80; i.placeholder = 'إضافة خيار'; i.style.marginBottom = '8px'; i.oninput = sync; box.appendChild(i); if (box.children.length >= 6) q('#p-add').style.display = 'none'; };
            const vals = () => [...box.querySelectorAll('input')].map(x => x.value.trim()).filter(Boolean);
            const sync = () => { go.disabled = !q('#p-q').value.trim() || vals().length < 2; };
            addOpt(); addOpt(); q('#p-q').oninput = sync;
            q('#p-add').onclick = () => { addOpt(); box.lastChild.focus(); };
            go.onclick = async () => {
              go.disabled = true;
              const { error } = await A.sb.rpc('channel_poll_create', { cid: ch.id, p_q: q('#p-q').value.trim(), p_opts: vals(), p_at: opt.at });
              if (error) { go.disabled = false; return A.toast('تعذر إنشاء الاستطلاع', 'err'); }
              sh.close(); done();
            };
          };
          const topicSheet = () => {
            const sug = ['اسألني عن أي شيء', 'أنت وأفضل صديق لك', 'آخر مكان زرته', 'أفضل أغنية سمعتها هذا الأسبوع', 'شنو تحب أكثر بالعراق؟'];
            const sh = A.sheet(`<h3>موضوع للنقاش</h3><div class="gp" style="padding:0"><div class="gp-lb" style="margin-top:0">اكتب موضوعاً يرد عليه المشتركون</div><textarea id="t-t" maxlength="300" placeholder="موضوع للنقاش"></textarea>
              <div class="tp-sg">${sug.map(x => `<button data-s="${A.esc(x)}">${A.esc(x)}</button>`).join('')}</div>
              <div class="p-sub" style="margin:10px 4px 0">يمكن للأعضاء الرد بنصوص أو صور لمدة 24 ساعة.</div><button class="gp-go" id="t-s" disabled>نشر الموضوع</button></div>`, { tall: true });
            const q = s => sh.el.querySelector(s), t = q('#t-t'), go = q('#t-s');
            t.oninput = () => { go.disabled = !t.value.trim(); };
            q('.tp-sg').onclick = e => { const b = e.target.closest('[data-s]'); if (b) { t.value = b.dataset.s; t.oninput(); } };
            go.onclick = async () => {
              go.disabled = true;
              const { error } = await A.sb.rpc('channel_topic_create', { cid: ch.id, p_txt: t.value.trim(), p_at: opt.at });
              if (error) { go.disabled = false; return A.toast('تعذر نشر الموضوع', 'err'); }
              sh.close(); done();
            };
          };
          foot.querySelector('#k-clip').onclick = () => {
            const sh = A.sheet(`<h3>إرفاق</h3><button class="opt" data-k="i">${A.icon('image')}<div>صورة</div></button><button class="opt" data-k="v">${A.icon('video')}<div>فيديو<small>حتى 50 ميجابايت</small></div></button><button class="opt" data-k="p">${A.icon('chart')}<div>استطلاع رأي</div></button><button class="opt" data-k="t">${A.icon('comment')}<div>موضوع للنقاش<small>الأعضاء يردون بنص أو صورة لمدة 24 ساعة</small></div></button>`);
            sh.el.onclick = e => {
              const b = e.target.closest('[data-k]'); if (!b) return; sh.close();
              if (b.dataset.k === 'p') return pollSheet();
              if (b.dataset.k === 't') return topicSheet();
              if (b.dataset.k === 'i') pickFile('image/*', f => { if (!/^image\/(jpeg|png|webp|gif)$/.test(f.type)) return A.toast('صيغة الصورة غير مدعومة', 'err'); att = { file: f, type: 'image' }; showAtt(); });
              else pickFile('video/*', f => { if (!f.type.startsWith('video/')) return A.toast('اختر فيديو', 'err'); if (f.size > 50 * 1024 * 1024) return A.toast('حجم الفيديو أكبر من 50 ميجابايت', 'err'); att = { file: f, type: 'video' }; showAtt(); });
            };
          };
          const send = foot.querySelector('#k-send');
          send.onclick = async () => {
            const t = ta.value.trim(); if (!t && !att) return;
            send.disabled = true;
            try {
              let url = null, type = null;
              if (att) {
                let f = att.file;
                if (att.type === 'image') { const b = await resizeTo(f, 1600, 'image/jpeg', .85); f = b.size < f.size ? new File([b], 'p.jpg', { type: 'image/jpeg' }) : f; }
                const ext = ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov' })[f.type] || 'bin';
                const path = `${ch.id}/${me().id}_${Date.now()}.${ext}`;
                const up = await A.sb.storage.from('channels').upload(path, f, { contentType: f.type });
                if (up.error) throw up.error;
                url = A.sb.storage.from('channels').getPublicUrl(path).data.publicUrl; type = att.type;
              }
              const { error } = await A.sb.rpc('channel_post_v2', { cid: ch.id, p_content: t, p_url: url, p_type: type, p_kind: opt.kind, p_at: opt.at });
              if (error) throw error;
              const wasSched = !!opt.at; ta.value = ''; grow(); att = null; opt = { kind: 'post', at: null }; showAtt(); stick = true; if (wasSched) A.toast('تمت جدولة المنشور', 'ok');
            } catch (e) { console.error(e); A.toast('تعذر النشر', 'err'); }
            send.disabled = false;
          };
        } else if (isSub()) {
          foot.innerHTML = `<div class="chb"><button class="alt" id="k-mute">${A.icon(ch.muted ? 'bell' : 'mute')}${ch.muted ? 'إلغاء كتم الإشعارات' : 'كتم الإشعارات'}</button></div>`;
          foot.querySelector('#k-mute').onclick = async () => {
            const { error } = await A.sb.from('channel_members').update({ muted: !ch.muted }).eq('channel_id', ch.id).eq('user_id', me().id);
            if (error) return A.toast('تعذر التنفيذ', 'err'); ch.muted = !ch.muted; drawFoot();
          };
        } else {
          foot.innerHTML = `<div class="chb"><button class="big" id="k-join">اشتراك في القناة</button></div>`;
          foot.querySelector('#k-join').onclick = async e => {
            e.target.disabled = true;
            const { error } = await A.sb.rpc('channel_join', { p_key: key });
            if (error) { e.target.disabled = false; return A.toast(/banned/.test(error.message || '') ? 'أنت محظور من هذه القناة' : 'تعذر الاشتراك', 'err'); }
            const x = await A.sb.rpc('channel_info', { p_key: ch.id }); if (x.data && x.data[0]) ch = x.data[0];
            head(); drawFoot(); renderAll(); A.toast('تم الاشتراك', 'ok');
          };
        }
        fit();
      }
      drawFoot();
      await load();

      const syncNew = async () => {
        if (!root.isConnected || !P.list.length) return;
        const last = P.list[P.list.length - 1].published_at;
        const { data } = await A.sb.from('channel_posts').select(PS).eq('channel_id', ch.id).gt('published_at', last).lte('published_at', new Date().toISOString()).order('published_at', { ascending: true }).limit(20);
        const add = (data || []).filter(p => !P.ids.has(p.id));
        if (add.length) { add.forEach(p => { P.ids.add(p.id); P.list.push(p); }); await loadPolls(false); renderAll(); if (stick) body.scrollTop = body.scrollHeight; } else loadPolls(true);
      };
      const pt = setInterval(() => { if (!root.isConnected) return clearInterval(pt); syncNew(); }, 30000);

      /* مباشر */
      rt = A.sb.channel('chp:' + ch.id).on('postgres_changes', { event: '*', schema: 'public', table: 'channel_posts', filter: 'channel_id=eq.' + ch.id }, ev => {
        if (!root.isConnected) return stop();
        const n = ev.new;
        if (ev.eventType === 'INSERT') {
          if (P.ids.has(n.id) || (n.scheduled_at && new Date(n.scheduled_at) > new Date())) return;
          P.ids.add(n.id); P.list.push(n); P.list.sort((a, c) => new Date(a.published_at) - new Date(c.published_at)); loadPolls(false).then(() => { renderAll(); if (stick) body.scrollTop = body.scrollHeight; });
          if (isSub()) A.sb.rpc('channel_mark_read', { cid: ch.id }).then(() => {});
        } else if (ev.eventType === 'UPDATE') {
          const i = P.list.findIndex(x => x.id === n.id); if (i < 0) return;
          if (n.deleted_at) { P.list.splice(i, 1); renderAll(); return; }
          const pinChanged = (P.list[i].pinned_at || null) !== (n.pinned_at || null);
          Object.assign(P.list[i], n);
          if (pinChanged) renderAll(); else { const b = body.querySelector(`.cp[data-id="${n.id}"] [data-v]`); if (b) b.textContent = fmt(n.views_count); const cb = body.querySelector(`.cp[data-id="${n.id}"] .cp-c span`); if (cb) cb.textContent = cmtLabel(P.list[i]); }
        }
      }).subscribe();
    }
  };

  /* ---------- معلومات القناة ---------- */
  A.channelInfo = async (ch0, onChange) => {
    let ch = ch0;
    const el = page('معلومات القناة', '<div class="empty">جاري التحميل...</div>');
    const box = el.querySelector('.gp');
    const isOwner = () => ch.my_role === 'owner', isAdm = () => isOwner() || ch.my_role === 'admin';
    let subs = [];
    async function loadSubs() {
      if (!isAdm()) return;
      const { data } = await A.sb.from('channel_members').select('user_id,role,joined_at,user:profiles!channel_members_user_id_fkey(id,username,display_name,avatar_url,is_verified)').eq('channel_id', ch.id).eq('active', true).order('joined_at', { ascending: true }).limit(300);
      const ord = { owner: 0, admin: 1, sub: 2 };
      subs = (data || []).sort((a, b) => ord[a.role] - ord[b.role]);
    }
    async function refresh() {
      const r = await A.sb.rpc('channel_info', { p_key: ch.id });
      if (r.data && r.data[0]) ch = r.data[0];
      await loadSubs(); draw(); if (onChange) onChange();
    }
    function draw() {
      const url = ch.is_public && ch.handle ? link(ch.handle) : ch.invite_code ? link(ch.invite_code) : '';
      box.innerHTML = `<div class="gi-h"><div class="av" id="ci-av">${A.avatar({ display_name: ch.name, avatar_url: ch.avatar_url }, 104)}</div><h2>${A.esc(ch.name)}</h2>
        <div class="p-sub">${A.icon(ch.is_public ? 'globe' : 'lock')}${ch.is_public ? 'قناة عامة' : 'قناة خاصة'} · ${fmt(ch.subs)} مشترك</div>${ch.description ? `<p>${A.esc(ch.description)}</p>` : ''}</div>
        <div class="gi-act">${url ? `<button data-k="copy">${A.icon('qrlink')}نسخ الرابط</button><button data-k="share">${A.icon('share')}مشاركة</button>` : ''}${isAdm() ? `<button data-k="edit">${A.icon('pencil')}تعديل</button>` : ''}</div>
        ${isAdm() ? `<div class="gi-card"><button class="gi-sw" data-k="cm"><span class="t">التعليقات<small>السماح للمشتركين بالتعليق على المنشورات</small></span><span class="sw ${ch.comments_enabled ? 'on' : ''}"></span></button><button class="gi-sw" data-k="stats"><span class="t">إحصائيات القناة<small>المشتركون والمشاهدات وأفضل المنشورات</small></span></button><button class="gi-sw" data-k="sched"><span class="t">المنشورات المجدولة<small>عرض وإلغاء المنشورات المنتظرة</small></span></button>${!ch.is_public ? `<button class="gi-sw" data-k="regen"><span class="t">إنشاء رابط دعوة جديد<small>الرابط القديم يتوقف عن العمل</small></span></button>` : ''}</div>
        <div class="gi-sec">المشتركون (${subs.length})</div><div class="gi-card">${subs.map(x => { const u = x.user || {}; return `<button class="gp-r" data-u="${x.user_id}">${A.avatar(u, 44)}<div class="gp-n"><b>${A.esc(u.display_name || u.username || 'مستخدم')}${u.is_verified ? A.verified : ''}</b><small>@${A.esc(u.username || '')}</small></div>${x.role === 'owner' ? '<span class="rl ow">مالك</span>' : x.role === 'admin' ? '<span class="rl">مشرف</span>' : ''}</button>`; }).join('')}</div>` : ''}
        ${isOwner() ? '<button class="gi-leave" data-k="cdel" style="background:#E53935;color:#fff">حذف القناة نهائياً</button>' : '<button class="gi-leave" data-k="leave">إلغاء الاشتراك</button>'}`;
    }
    async function schedSheet() {
      const { data } = await A.sb.from('channel_posts').select('id,content,media_type,scheduled_at,kind').eq('channel_id', ch.id).gt('scheduled_at', new Date().toISOString()).is('deleted_at', null).order('scheduled_at', { ascending: true }).limit(50);
      const rows = data || [];
      const sh = A.sheet(`<h3>المنشورات المجدولة</h3>${rows.length ? rows.map(p => `<button class="gp-r" data-pid="${p.id}"><div class="gp-n"><b>${A.esc(p.content ? p.content.slice(0, 60) : (p.media_type === 'video' ? 'فيديو' : 'صورة'))}</b><small>${new Date(p.scheduled_at).toLocaleString('ar-IQ', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · اضغط للإلغاء</small></div></button>`).join('') : '<div class="empty" style="padding:20px 0">لا توجد منشورات مجدولة</div>'}`);
      sh.el.onclick = async e => {
        const b = e.target.closest('[data-pid]'); if (!b || !confirm('إلغاء هذا المنشور المجدول؟')) return;
        const { error } = await A.sb.rpc('channel_post_remove', { pid: b.dataset.pid });
        if (error) return A.toast('تعذر الإلغاء', 'err'); b.remove(); A.toast('تم الإلغاء', 'ok');
      };
    }
    function statsPage() {
      const sp = page('إحصائيات القناة', '<div class="empty">جاري التحميل...</div>'), sb = sp.querySelector('.gp');
      sp.style.zIndex = 90; let days = 30;
      const bars = (arr, col) => { const max = Math.max(1, ...arr.map(x => x.n)); return `<div class="bars">${arr.map(x => `<i style="height:${Math.max(3, x.n / max * 100)}%;background:${col}"></i>`).join('')}</div><div class="bars-l"><span>${arr.length ? new Date(arr[0].d).toLocaleDateString('ar-IQ', { day: 'numeric', month: 'short' }) : ''}</span><span>${arr.length ? new Date(arr[arr.length - 1].d).toLocaleDateString('ar-IQ', { day: 'numeric', month: 'short' }) : ''}</span></div>`; };
      async function load() {
        sb.innerHTML = '<div class="empty">جاري التحميل...</div>';
        const { data, error } = await A.sb.rpc('channel_stats', { cid: ch.id, p_days: days });
        if (error || !data) { sb.innerHTML = '<div class="empty">تعذر تحميل الإحصائيات</div>'; return; }
        const s = data, sum = a => a.reduce((t, x) => t + x.n, 0), avg = s.posts ? Math.round(s.views / s.posts) : 0;
        sb.innerHTML = `<div class="ch-t" id="st-d">${[7, 30, 90].map(d => `<button data-d="${d}" class="${d === days ? 'on' : ''}">${d} يوم</button>`).join('')}</div>
          <div class="stg"><div><b>${fmt(s.subs)}</b><span>مشترك</span></div><div><b>${fmt(s.posts)}</b><span>منشور</span></div><div><b>${fmt(s.views)}</b><span>مشاهدة</span></div><div><b>${fmt(s.comments)}</b><span>تعليق</span></div><div><b>${fmt(avg)}</b><span>معدل مشاهدات المنشور</span></div><div><b>${fmt(s.scheduled)}</b><span>مجدول</span></div></div>
          <div class="gi-sec">مشتركون جدد (+${sum(s.new_subs)})</div><div class="gi-card" style="padding:14px 12px 8px">${bars(s.new_subs, 'linear-gradient(#14A585,#0E7C66)')}</div>
          <div class="gi-sec">المشاهدات (${fmt(sum(s.views_daily))})</div><div class="gi-card" style="padding:14px 12px 8px">${bars(s.views_daily, 'linear-gradient(#E5B53D,#b98a1e)')}</div>
          <div class="gi-sec">أفضل المنشورات</div><div class="gi-card">${(s.top || []).length ? s.top.map((t, i) => `<div class="gp-r"><span class="rl ow" style="min-width:24px;text-align:center">${i + 1}</span><div class="gp-n"><b>${A.esc(t.content || (t.media_type === 'video' ? 'فيديو' : 'صورة'))}</b><small>${fmt(t.views)} مشاهدة · ${fmt(t.comments)} تعليق</small></div></div>`).join('') : '<div class="empty" style="padding:18px 0">لا توجد منشورات</div>'}</div>`;
        sb.querySelector('#st-d').onclick = e => { const b = e.target.closest('[data-d]'); if (b) { days = +b.dataset.d; load(); } };
      }
      load();
    }
    const editSheet = () => {
      let newAv = null;
      const sh = A.sheet(`<h3>تعديل القناة</h3><div class="gp" style="padding:0"><div class="gp-av" id="e-av" style="margin-top:0">${ch.avatar_url ? `<img alt="" src="${A.esc(ch.avatar_url)}">` : A.icon('camera')}</div>
        <div class="gp-lb">الاسم</div><input type="text" id="e-n" maxlength="60" value="${A.esc(ch.name)}">
        <div class="gp-lb">الوصف</div><textarea id="e-d" maxlength="500">${A.esc(ch.description || '')}</textarea>
        ${ch.is_public ? `<div class="gp-lb">رابط القناة</div><div class="ch-hd"><span>/c/</span><input type="text" id="e-h" maxlength="32" value="${A.esc(ch.handle || '')}" autocapitalize="off"></div>` : ''}
        <button class="gp-go" id="e-s">حفظ</button></div>`, { tall: true });
      const q = s => sh.el.querySelector(s);
      if (q('#e-h')) q('#e-h').oninput = e => { e.target.value = cleanHandle(e.target.value); };
      q('#e-av').onclick = () => pickFile('image/*', f => { if (!f.type.startsWith('image/')) return A.toast('اختر صورة', 'err'); newAv = f; q('#e-av').innerHTML = `<img alt="" src="${URL.createObjectURL(f)}">`; });
      q('#e-s').onclick = async () => {
        const b = q('#e-s'); b.disabled = true;
        try {
          const av = newAv ? await uploadAvatar(newAv) : null;
          const { error } = await A.sb.rpc('channel_update', { cid: ch.id, p_name: q('#e-n').value, p_desc: q('#e-d').value, p_avatar: av, p_handle: q('#e-h') ? q('#e-h').value : null, p_comments: null });
          if (error) throw error;
          sh.close(); A.toast('تم الحفظ', 'ok'); refresh();
        } catch (e) { console.error(e); A.toast(/duplicate|unique/i.test((e && e.message) || '') ? 'هذا الرابط مستخدم' : 'تعذر الحفظ', 'err'); b.disabled = false; }
      };
    };
    const subSheet = uid => {
      const x = subs.find(s => s.user_id === uid); if (!x || uid === me().id) return;
      const u = x.user || {}, opt = (k, ic, t) => `<button class="opt" data-k="${k}">${A.icon(ic)}<div>${t}</div></button>`;
      const can = x.role !== 'owner' && !(x.role === 'admin' && !isOwner());
      const sh = A.sheet(`<h3>${A.esc(u.display_name || u.username || '')}</h3>${opt('prof', 'user', 'عرض الملف الشخصي')}${isOwner() && x.role !== 'owner' ? opt('adm', x.role === 'admin' ? 'blk' : 'shield', x.role === 'admin' ? 'إزالة الإشراف' : 'تعيين مشرفاً') : ''}${can ? opt('rm', 'trash', 'إزالة من القناة') + opt('ban', 'blk', 'حظر من القناة') : ''}`);
      sh.el.onclick = async e => {
        const b = e.target.closest('[data-k]'); if (!b) return; const k = b.dataset.k; sh.close();
        if (k === 'prof') { el.remove(); location.hash = '#/u/' + encodeURIComponent(u.username); return; }
        let r;
        if (k === 'adm') r = await A.sb.rpc('channel_set_admin', { cid: ch.id, uid, v: x.role !== 'admin' });
        else if (k === 'rm') { if (!confirm('إزالة هذا المشترك؟')) return; r = await A.sb.rpc('channel_remove_sub', { cid: ch.id, uid, p_ban: false }); }
        else if (k === 'ban') { if (!confirm('حظر هذا المشترك؟ لن يستطيع الاشتراك مجدداً.')) return; r = await A.sb.rpc('channel_remove_sub', { cid: ch.id, uid, p_ban: true }); }
        if (r && r.error) return A.toast('تعذر التنفيذ', 'err');
        A.toast('تم', 'ok'); refresh();
      };
    };
    box.onclick = async e => {
      const u = e.target.closest('[data-u]'); if (u) return subSheet(u.dataset.u);
      const k = e.target.closest('[data-k]'); if (!k) { if (e.target.closest('#ci-av') && isAdm()) editSheet(); return; }
      const a = k.dataset.k, url = ch.is_public && ch.handle ? link(ch.handle) : link(ch.invite_code || ch.id);
      if (a === 'copy') return navigator.clipboard.writeText(url).then(() => A.toast('تم نسخ الرابط', 'ok'), () => A.toast('تعذر النسخ', 'err'));
      if (a === 'share') return A.shareLink({ title: 'مشاركة القناة', url, text: 'اشترك في قناة «' + ch.name + '» على أني عراقي', name: ch.name, avatar_url: ch.avatar_url, desc: ch.description, sub: (ch.is_public ? 'قناة عامة' : 'قناة خاصة') + ' · ' + fmt(ch.subs) + ' مشترك' });
      if (a === 'edit') return editSheet();
      if (a === 'cm') { const { error } = await A.sb.rpc('channel_update', { cid: ch.id, p_name: ch.name, p_desc: ch.description || '', p_avatar: null, p_handle: null, p_comments: !ch.comments_enabled }); if (error) return A.toast('تعذر التنفيذ', 'err'); return refresh(); }
      if (a === 'regen') { if (!confirm('إنشاء رابط دعوة جديد؟')) return; const { error } = await A.sb.rpc('channel_regen_invite', { cid: ch.id }); if (error) return A.toast('تعذر التنفيذ', 'err'); A.toast('تم إنشاء رابط جديد', 'ok'); return refresh(); }
      if (a === 'stats') return statsPage();
      if (a === 'sched') return schedSheet();
      if (a === 'cdel') {
        if (!confirm('حذف القناة نهائياً؟ ستُحذف كل المنشورات ولا يمكن التراجع.')) return;
        const { error } = await A.sb.rpc('channel_delete', { cid: ch.id });
        if (error) return A.toast('تعذر حذف القناة', 'err');
        A.toast('تم حذف القناة', 'ok'); el.remove(); location.hash = '#/chats'; return;
      }
      if (a === 'leave') { if (!confirm('إلغاء الاشتراك في القناة؟')) return; const { error } = await A.sb.rpc('channel_leave', { cid: ch.id }); if (error) return A.toast('تعذر التنفيذ', 'err'); el.remove(); location.hash = '#/chats'; }
    };
    await loadSubs(); draw();
  };
})();
