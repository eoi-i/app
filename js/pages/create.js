(function () {
  const A = App;
  Object.assign(A.icons, {
    image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
    video: '<rect x="2" y="5" width="14" height="14" rx="3"/><path d="M16 10l6-3v10l-6-3z"/>',
    camera: '<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>',
    x: '<path d="M18 6L6 18M6 6l12 12"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"/>',
    users: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
    hash: '<path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/>',
    at: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.9 7.9"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>',
    back: '<path d="M9 18l6-6-6-6"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>'
  });

  const MAX_IMG = 4, MAX_VID = 50 * 1024 * 1024, MAX_IMG_SIZE = 15 * 1024 * 1024;
  const VIS = [['public', 'عام', 'globe', 'يراه الجميع'], ['followers', 'المتابعون', 'users', 'يراه من يتابعك فقط'], ['private', 'أنا فقط', 'lock', 'لا يراه غيرك']];
  const EMO = ['😀', '😂', '🤣', '😊', '😍', '😘', '😎', '🤩', '🥰', '😢', '😭', '😡', '👍', '👏', '🙏', '💪', '🔥', '❤️', '💚', '🇮🇶', '🎉', '✨', '🌹', '☕', '😅', '🤔', '😴', '🥳', '👋', '🙌', '💯', '⭐', '🌙', '☀️', '🎧', '📷', '🍕', '⚽', '🏆', '😇'];
  const me = () => A.state.user;
  let S, root;

  const fresh = () => ({ postId: null, text: '', vis: 'public', items: [], removed: [], busy: false, dirty: false });
  const $ = s => root.querySelector(s);
  const visInfo = () => VIS.find(v => v[0] === S.vis);
  const extOf = f => ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov' }[f.type] || 'bin');
  const tagsOf = t => [...new Set([...(t || '').matchAll(/#([^\s#@!.,،؛:;?؟()]{1,50})/g)].map(m => m[1].toLowerCase()))];
  const pathOf = url => { const i = url.indexOf('/posts/'); return i < 0 ? null : decodeURIComponent(url.slice(i + 7).split('?')[0]); };

  function errMsg(e) {
    const m = (e && (e.message || e.error)) || '';
    if (/exceeded|too large|size/i.test(m)) return 'الملف أكبر من الحد المسموح';
    if (/mime|not supported/i.test(m)) return 'نوع الملف غير مدعوم';
    if (/rate limit/i.test(m)) return 'نشرت كثيراً في وقت قصير، حاول لاحقاً';
    if (/row-level|policy|permission/i.test(m)) return 'لا تملك صلاحية النشر (قد يكون الحساب محظوراً)';
    if (/network|fetch/i.test(m)) return 'تحقق من اتصال الإنترنت';
    return 'حدث خطأ، حاول مرة أخرى';
  }

  async function compress(file) {
    if (file.type === 'image/gif') return file;
    try {
      const bmp = await createImageBitmap(file);
      const k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
      const c = document.createElement('canvas');
      c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
      c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
      const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', 0.85));
      return blob && blob.size < file.size ? blob : file;
    } catch (e) { return file; }
  }

  function setBusy(msg, pct) {
    const l = $('#cr-layer');
    S.busy = !!msg;
    if (!msg) { l.innerHTML = ''; return; }
    if (typeof pct === 'number') {
      const bar = l.querySelector('.ld-bar i');
      if (bar) { bar.style.width = pct + '%'; l.querySelector('.ld-pct').textContent = pct + '%'; l.querySelector('.bm').textContent = msg; return; }
      l.innerHTML = `<div class="busy"><div class="ld-pct">${pct}%</div><div class="ld-bar"><i style="width:${pct}%"></i></div><div class="bm">${A.esc(msg)}</div></div>`;
      return;
    }
    l.innerHTML = `<div class="busy">${A.orbit}<div class="bm">${A.esc(msg)}</div></div>`;
  }
  function sheet(html) {
    const l = $('#cr-layer');
    l.onclick = null;
    l.innerHTML = `<div class="sheet-bg"><div class="sheet">${html}</div></div>`;
    l.firstChild.onclick = e => { if (e.target === l.firstChild) l.innerHTML = ''; };
  }
  const closeSheet = () => { $('#cr-layer').innerHTML = ''; };

  function goHome() {
    S.items.forEach(i => i.kind === 'new' && URL.revokeObjectURL(i.url));
    location.hash = '#/home';
  }

  function syncPub() { $('#cr-pub').classList.toggle('ready', !!(S.text.trim() || S.items.length)); }
  function refreshUI() {
    const ta = $('#cr-text');
    ta.style.height = 'auto'; ta.style.height = Math.max(120, ta.scrollHeight) + 'px';
    $('#cr-count').textContent = `${ta.value.length}/2000`;
    $('#cr-tags').innerHTML = tagsOf(ta.value).map(t => `<span class="chip">#${A.esc(t)}</span>`).join('');
    syncPub();
  }
  function renderVis() {
    const v = visInfo();
    $('#cr-vis').innerHTML = `${A.icon(v[2])}${v[1]}`;
  }
  function renderMedia() {
    const full = S.items.some(i => i.type === 'video') || S.items.length >= MAX_IMG;
    $('#cr-media').innerHTML = (full ? '' : `<button class="add-tile" id="cr-add" aria-label="إضافة">${A.icon('plus')}</button>`) +
      S.items.map((it, i) => `<div class="th">${it.type === 'video'
        ? `<video src="${A.esc(it.url)}" muted playsinline preload="metadata"></video>`
        : `<img src="${A.esc(it.url)}" alt="">`}<button data-rm="${i}" aria-label="حذف">${A.icon('x')}</button></div>`).join('');
    syncPub();
  }

  /* ===== كاميرا داخل التطبيق (صورة / فيديو) ===== */
  A.openCamera = (done, fallback) => openCamera(done, fallback);
  function openCamera(done, fallback) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return fallback();
    if (!document.getElementById('cam-st')) {
      const st = document.createElement('style'); st.id = 'cam-st';
      st.textContent = `.cam{position:fixed;inset:0;z-index:95;background:#000;color:#fff;display:flex;flex-direction:column;direction:rtl;animation:fade .2s}
.cam video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000}
.cam video.mir{transform:scaleX(-1)}
.cam-top{position:absolute;top:0;left:0;right:0;z-index:2;display:flex;justify-content:space-between;align-items:center;padding:calc(12px + env(safe-area-inset-top)) 14px 24px;background:linear-gradient(rgba(0,0,0,.55),transparent)}
.cam-top button{width:46px;height:46px;border-radius:50%;background:rgba(0,0,0,.4);color:#fff;display:grid;place-items:center;font-size:20px;font-weight:700;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.cam-top svg{width:24px;height:24px}
.cam-tm{font-weight:800;font-size:16px;padding:6px 14px;border-radius:14px;background:rgba(229,57,53,.9);display:none}
.cam.rec .cam-tm{display:block}
.cam-bot{position:absolute;bottom:0;left:0;right:0;z-index:2;padding:30px 0 calc(22px + env(safe-area-inset-bottom));background:linear-gradient(transparent,rgba(0,0,0,.6));display:flex;flex-direction:column;align-items:center;gap:18px}
.cam-md{display:flex;gap:22px;font-weight:800;font-size:15px}
.cam-md button{color:rgba(255,255,255,.6);padding:4px 6px}
.cam-md button.on{color:#F3D27A}
.cam-sh{width:78px;height:78px;border-radius:50%;border:5px solid #fff;display:grid;place-items:center;background:none;padding:0}
.cam-sh i{width:58px;height:58px;border-radius:50%;background:#fff;transition:.2s}
.cam.vid .cam-sh i{background:#E53935}
.cam.rec .cam-sh i{width:30px;height:30px;border-radius:9px;background:#E53935}
.cam-sh:active i{transform:scale(.9)}`;
      document.head.appendChild(st);
    }
    let facing = 'environment', stream = null, rec = null, chunks = [], mode = 'photo', tm = null, t0 = 0, closed = false;
    const el = document.createElement('div');
    el.className = 'cam';
    el.innerHTML = `<video playsinline muted autoplay></video>
      <div class="cam-top"><button data-c aria-label="إغلاق">✕</button><span class="cam-tm">0:00</span><button data-f aria-label="قلب الكاميرا"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 00-14-5.3L4 9M4 4v5h5M4 12a8 8 0 0014 5.3L20 15M20 20v-5h-5"/></svg></button></div>
      <div class="cam-bot"><div class="cam-md"><button data-m="photo" class="on">صورة</button><button data-m="video">فيديو</button></div><button class="cam-sh" data-s aria-label="التقاط"><i></i></button></div>`;
    document.body.appendChild(el);
    const v = el.querySelector('video');
    const stopStream = () => { if (stream) stream.getTracks().forEach(t => t.stop()); stream = null; };
    const close = () => { closed = true; clearInterval(tm); try { if (rec && rec.state !== 'inactive') { rec.onstop = null; rec.stop(); } } catch (e) {} stopStream(); el.remove(); };
    const start = async () => {
      stopStream();
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: facing }, width: { ideal: 1920 }, height: { ideal: 1080 } }, audio: mode === 'video' });
      } catch (e) {
        if (mode === 'video') { try { stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: facing } }, audio: false }); } catch (e2) {} }
        if (!stream) { if (!closed) { close(); fallback(); } return; }
      }
      if (closed) return stopStream();
      v.srcObject = stream; v.classList.toggle('mir', facing === 'user'); v.play().catch(() => {});
    };
    const finishVideo = () => {
      clearInterval(tm); el.classList.remove('rec');
      const type = (rec.mimeType || 'video/webm').split(';')[0];
      const f = new File(chunks, 'camera-' + Date.now() + (type.includes('mp4') ? '.mp4' : '.webm'), { type });
      close(); done([f], 'video');
    };
    el.onclick = async e => {
      if (e.target.closest('[data-c]')) return close();
      if (e.target.closest('[data-f]')) { if (rec && rec.state === 'recording') return; facing = facing === 'user' ? 'environment' : 'user'; return start(); }
      const m = e.target.closest('[data-m]');
      if (m) {
        if (rec && rec.state === 'recording') return;
        mode = m.dataset.m; el.classList.toggle('vid', mode === 'video');
        el.querySelectorAll('[data-m]').forEach(b => b.classList.toggle('on', b === m));
        return start();
      }
      if (!e.target.closest('[data-s]') || !stream) return;
      if (mode === 'photo') {
        const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight;
        const x = c.getContext('2d');
        if (facing === 'user') { x.translate(c.width, 0); x.scale(-1, 1); }
        x.drawImage(v, 0, 0);
        c.toBlob(b => { if (!b) return; const f = new File([b], 'camera-' + Date.now() + '.jpg', { type: 'image/jpeg' }); close(); done([f], 'img'); }, 'image/jpeg', .92);
        return;
      }
      if (rec && rec.state === 'recording') return rec.stop();
      if (!window.MediaRecorder) { close(); return fallback(); }
      const types = ['video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
      const mt = types.find(t => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t));
      chunks = [];
      try { rec = mt ? new MediaRecorder(stream, { mimeType: mt }) : new MediaRecorder(stream); } catch (err) { close(); return fallback(); }
      rec.ondataavailable = ev => { if (ev.data && ev.data.size) chunks.push(ev.data); };
      rec.onstop = finishVideo;
      rec.start(500); t0 = Date.now(); el.classList.add('rec');
      const tmEl = el.querySelector('.cam-tm');
      tm = setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000); tmEl.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); if (s >= 180 && rec.state === 'recording') rec.stop(); }, 250);
    };
    start();
  }

  function addFiles(list, want) {
    const files = [...list];
    if (!files.length) return;
    const hasVid = S.items.some(i => i.type === 'video');
    let imgs = S.items.filter(i => i.type === 'image').length;
    if (want === 'video') {
      const f = files[0];
      if (!f.type.startsWith('video/')) return A.toast('اختر ملف فيديو', 'err');
      if (S.items.length) return A.toast('لا يمكن الجمع بين الفيديو وغيره، احذف الوسائط الحالية أولاً', 'err');
      if (f.size > MAX_VID) return A.toast('حجم الفيديو أكبر من 50 ميجابايت', 'err');
      S.items.push({ kind: 'new', file: f, type: 'video', url: URL.createObjectURL(f) });
    } else {
      if (hasVid) return A.toast('لا يمكن الجمع بين الصور والفيديو، احذف الفيديو أولاً', 'err');
      for (const f of files) {
        if (imgs >= MAX_IMG) { A.toast('الحد الأقصى 4 صور', 'err'); break; }
        if (!/^image\/(jpeg|png|webp|gif)$/.test(f.type)) { A.toast('صيغة الصورة غير مدعومة (JPG, PNG, WEBP, GIF)', 'err'); continue; }
        if (f.size > MAX_IMG_SIZE) { A.toast('حجم الصورة كبير جداً', 'err'); continue; }
        S.items.push({ kind: 'new', file: f, type: 'image', url: URL.createObjectURL(f) }); imgs++;
      }
    }
    S.dirty = true; renderMedia();
  }

  function insertAtCaret(ch, noSpace) {
    const ta = $('#cr-text'), p = ta.selectionStart, v = ta.value;
    const pre = v.slice(0, p), sp = !noSpace && pre && !/\s$/.test(pre) ? ' ' : '';
    ta.value = pre + sp + ch + v.slice(p);
    const np = p + sp.length + ch.length;
    ta.focus(); ta.setSelectionRange(np, np);
    ta.dispatchEvent(new Event('input'));
  }

  let st;
  function mentionToken() {
    const ta = $('#cr-text'), pos = ta.selectionStart;
    const m = ta.value.slice(0, pos).match(/@([a-zA-Z0-9_.]{0,30})$/);
    return m ? { q: m[1], start: pos - m[0].length, pos } : null;
  }
  async function suggest() {
    const box = $('#cr-sug'), tk = mentionToken();
    if (!tk || !tk.q) { box.innerHTML = ''; return; }
    const { data } = await A.sb.from('profiles').select('username,display_name,avatar_url')
      .ilike('username', tk.q.replace(/[\\%_]/g, '\\$&') + '%').eq('is_banned', false).limit(5);
    const now = mentionToken();
    if (!now || now.q !== tk.q) return;
    box.innerHTML = (data || []).map(u => `<button class="sug-row" data-u="${A.esc(u.username)}">${A.avatar(u, 32)}<div><b>${A.esc(u.display_name || u.username)}</b><div class="p-sub">@${A.esc(u.username)}</div></div></button>`).join('');
  }
  function pickMention(u) {
    const ta = $('#cr-text'), tk = mentionToken();
    if (!tk) return;
    const v = ta.value, add = '@' + u + ' ';
    ta.value = v.slice(0, tk.start) + add + v.slice(tk.pos);
    const np = tk.start + add.length;
    ta.focus(); ta.setSelectionRange(np, np);
    $('#cr-sug').innerHTML = '';
    ta.dispatchEvent(new Event('input'));
  }

  function preview() {
    const p = A.state.profile, v = visInfo();
    const vid = S.items.find(i => i.type === 'video');
    const med = !S.items.length ? '' : vid
      ? `<div class="media"><video src="${A.esc(vid.url)}#t=0.1" poster="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" controls playsinline muted preload="auto"></video></div>`
      : `<div class="media grid-${Math.min(S.items.length, 4)}">${S.items.map(i => `<img src="${A.esc(i.url)}" alt="">`).join('')}</div>`;
    sheet(`<h3>معاينة قبل النشر</h3>
      <div class="post"><div class="p-head">${A.avatar(p, 42)}<div><div class="p-name">${A.esc(p.display_name)}${p.is_verified ? A.verified : ''}</div><div class="p-sub">@${A.esc(p.username)} · الآن · ${v[1]}</div></div></div>
      ${S.text.trim() ? `<div class="p-text">${A.linkify(S.text.trim())}</div>` : ''}${med}</div>
      <button class="btn block" id="pv-pub">نشر الآن</button>
      <button class="btn ghost block" id="pv-back">رجوع للتعديل</button>`);
    $('#pv-pub').onclick = () => { closeSheet(); persist(false); };
    $('#pv-back').onclick = closeSheet;
  }

  async function persist(isDraft, leave) {
    if (S.busy) return;
    const text = S.text.trim();
    if (!text && !S.items.length) return A.toast('اكتب شيئاً أو أضف صورة/فيديو', 'err');
    setBusy(isDraft ? 'جاري حفظ المسودة...' : 'جاري النشر...');
    const uid = me().id, isNew = !S.postId, id = S.postId || crypto.randomUUID(), uploaded = [];
    try {
      const news = S.items.map((it, i) => ({ it, i })).filter(x => x.it.kind === 'new');
      for (let k = 0; k < news.length; k++) {
        const { it, i } = news[k];
        setBusy(`جاري رفع الملف ${k + 1} من ${news.length}...`, Math.round(k / news.length * 90));
        const f = it.type === 'image' ? await compress(it.file) : it.file;
        const type = f.type || it.file.type;
        const path = `${uid}/${id}/${Date.now()}_${i}.${extOf({ type })}`;
        const { error } = await A.sb.storage.from('posts').upload(path, f, { contentType: type, cacheControl: '31536000' });
        if (error) throw error;
        uploaded.push({ path, url: A.sb.storage.from('posts').getPublicUrl(path).data.publicUrl, type: it.type, position: i });
        setBusy(`جاري رفع الملف ${k + 1} من ${news.length}...`, Math.round((k + 1) / news.length * 90));
      }
      setBusy('جاري الحفظ...', news.length ? 95 : undefined);
      const row = { content: text || null, visibility: S.vis, is_draft: isDraft };
      if (isNew) {
        const { error } = await A.sb.from('posts').insert({ id, user_id: uid, ...row });
        if (error) throw error;
      } else {
        const { error } = await A.sb.from('posts').update(row).eq('id', id);
        if (error) throw error;
      }
      const rmIds = S.removed.filter(r => r.id).map(r => r.id);
      if (rmIds.length) await A.sb.from('post_media').delete().in('id', rmIds);
      if (uploaded.length) {
        const { error } = await A.sb.from('post_media').insert(uploaded.map(u => ({ post_id: id, url: u.url, type: u.type, position: u.position })));
        if (error) { if (isNew) await A.sb.from('posts').delete().eq('id', id); throw error; }
      }
      const old = S.removed.map(r => pathOf(r.url)).filter(p => p && p.startsWith(uid + '/'));
      if (old.length) A.sb.storage.from('posts').remove(old);
    } catch (e) {
      console.error(e);
      if (uploaded.length) A.sb.storage.from('posts').remove(uploaded.map(u => u.path));
      setBusy(false);
      return A.toast(errMsg(e), 'err');
    }
    setBusy(false); S.dirty = false;
    if (!isDraft) { A.toast('تم النشر بنجاح 🎉', 'ok'); A.loadProfile(); return goHome(); }
    A.toast('تم حفظ المسودة', 'ok');
    if (leave) return goHome();
    await loadDraft(id);
  }

  async function loadDraft(id) {
    setBusy('جاري التحميل...');
    const { data, error } = await A.sb.from('posts').select('id,content,visibility,media:post_media(id,url,type,position)').eq('id', id).single();
    setBusy(false);
    if (error || !data) return A.toast('تعذر فتح المسودة', 'err');
    S.items.forEach(i => i.kind === 'new' && URL.revokeObjectURL(i.url));
    S.postId = data.id; S.text = data.content || ''; S.vis = data.visibility; S.removed = []; S.dirty = false;
    S.items = (data.media || []).sort((a, b) => a.position - b.position).map(m => ({ kind: 'old', id: m.id, url: m.url, type: m.type }));
    $('#cr-text').value = S.text;
    $('#cr-title').textContent = 'تعديل مسودة';
    refreshUI(); renderVis(); renderMedia();
  }

  async function showDrafts() {
    sheet('<h3>مسوداتي</h3><div class="empty">جاري التحميل...</div>');
    const { data, error } = await A.sb.from('posts').select('id,content,updated_at,media:post_media(url,type)')
      .eq('user_id', me().id).eq('is_draft', true).order('updated_at', { ascending: false }).limit(30);
    if (error) { closeSheet(); return A.toast('تعذر تحميل المسودات', 'err'); }
    if (!data.length) return sheet('<h3>مسوداتي</h3><div class="empty">لا توجد مسودات محفوظة</div>');
    sheet(`<h3>مسوداتي</h3>${data.map(d => `<div class="dr"><button class="dr-main" data-open="${d.id}">
      <div><b>${A.esc((d.content || '(وسائط فقط)').slice(0, 60))}</b></div>
      <div class="p-sub">${A.timeAgo(d.updated_at)}${d.media.length ? ' · ' + d.media.length + ' وسائط' : ''}</div></button>
      <button class="icon-btn" data-del="${d.id}" aria-label="حذف">${A.icon('trash')}</button></div>`).join('')}`);
    $('#cr-layer').onclick = async e => {
      const o = e.target.closest('[data-open]'), d = e.target.closest('[data-del]');
      if (o) {
        if (S.dirty && !confirm('سيتم تجاهل التعديلات الحالية. متابعة؟')) return;
        closeSheet(); return loadDraft(o.dataset.open);
      }
      if (d) {
        if (!confirm('حذف هذه المسودة نهائياً؟')) return;
        const row = data.find(x => x.id === d.dataset.del);
        const paths = (row.media || []).map(m => pathOf(m.url)).filter(Boolean);
        const { error: er } = await A.sb.from('posts').delete().eq('id', d.dataset.del).eq('is_draft', true);
        if (er) return A.toast('تعذر الحذف', 'err');
        if (paths.length) A.sb.storage.from('posts').remove(paths);
        if (S.postId === d.dataset.del) { S.postId = null; $('#cr-title').textContent = 'كتابة منشور'; }
        A.toast('تم حذف المسودة', 'ok');
        showDrafts();
      }
    };
  }

  function pickVis() {
    sheet(`<h3>من يستطيع رؤية المنشور؟</h3>${VIS.map(v => `<button class="opt ${S.vis === v[0] ? 'on' : ''}" data-v="${v[0]}">${A.icon(v[2])}<div>${v[1]}<small>${v[3]}</small></div></button>`).join('')}`);
    $('#cr-layer').onclick = e => {
      const b = e.target.closest('[data-v]');
      if (!b) return;
      S.vis = b.dataset.v; S.dirty = true; renderVis(); closeSheet();
    };
  }

  function moreMenu() {
    sheet(`<h3>خيارات</h3>
      <button class="opt" data-k="prev">${A.icon('eye')}<div>معاينة قبل النشر</div></button>
      <button class="opt" data-k="draft">${A.icon('bookmark')}<div>حفظ كمسودة</div></button>
      <button class="opt" data-k="drafts">${A.icon('edit')}<div>المسودات</div></button>`);
    $('#cr-layer').onclick = e => {
      const b = e.target.closest('[data-k]');
      if (!b) return;
      const k = b.dataset.k;
      closeSheet();
      if (k === 'prev') { if (!S.text.trim() && !S.items.length) return A.toast('لا يوجد شيء للمعاينة', 'err'); preview(); }
      else if (k === 'draft') persist(true);
      else showDrafts();
    };
  }

  function emojiSheet() {
    sheet(`<h3>الإيموجي</h3><div class="emo">${EMO.map(e => `<button data-e="${e}">${e}</button>`).join('')}</div>`);
    $('#cr-layer').onclick = e => { const b = e.target.closest('[data-e]'); if (b) insertAtCaret(b.dataset.e, true); };
  }

  function tryClose() {
    if (S.busy) return;
    if (!S.dirty || (!S.text.trim() && !S.items.length)) return goHome();
    sheet(`<h3>هل تريد حفظ ما كتبته؟</h3>
      <button class="btn block" id="c-save">حفظ كمسودة</button>
      <button class="btn ghost block" id="c-drop">تجاهل</button>
      <button class="btn ghost block" id="c-stay">متابعة التحرير</button>`);
    $('#c-save').onclick = () => { closeSheet(); persist(true, true); };
    $('#c-drop').onclick = goHome;
    $('#c-stay').onclick = closeSheet;
  }

  A.pages.create = {
    render(view) {
      S = fresh();
      const p = A.state.profile || {};
      view.innerHTML = `<div class="cr">
        <div class="cr-head"><button class="icon-btn" id="cr-close" aria-label="رجوع">${A.icon('back')}</button>
          <div class="cr-title" id="cr-title">كتابة منشور</div>
          <div class="cr-hr"><button class="icon-btn" id="cr-more" aria-label="خيارات">${A.icon('more')}</button><button class="pub" id="cr-pub">منشور</button></div></div>
        <div class="cr-body">
          <div class="cr-user">${A.avatar(p, 44)}<div class="p-name">${A.esc(p.display_name)}</div><button class="vis-chip" id="cr-vis"></button></div>
          <textarea id="cr-text" maxlength="2000" rows="4" placeholder="شارك أفكارك"></textarea>
          <div id="cr-sug" class="sug-list"></div>
          <div class="cr-meta"><div id="cr-tags" class="chips"></div><span id="cr-count">0/2000</span></div>
          <div id="cr-media" class="cr-media"></div>
        </div>
        <div class="cr-bar">
          <button data-pick="img" aria-label="صور">${A.icon('image')}</button>
          <button data-pick="vid" aria-label="فيديو">${A.icon('video')}</button>
          <button data-pick="cam" aria-label="كاميرا">${A.icon('camera')}</button>
          <button data-ins="#" aria-label="هاشتاغ">${A.icon('hash')}</button>
          <button data-ins="@" aria-label="إشارة">${A.icon('at')}</button>
          <button id="cr-emo" aria-label="إيموجي">${A.icon('smile')}</button>
        </div>
        <input type="file" id="in-img" accept="image/*" multiple hidden>
        <input type="file" id="in-vid" accept="video/*" hidden>
        <input type="file" id="in-cam" accept="image/*" capture="environment" hidden>
        <div id="cr-layer"></div></div>`;
      root = view;
      const ta = $('#cr-text'), box = view.querySelector('.cr');

      // تكيّف مع لوحة المفاتيح
      const vv = window.visualViewport;
      const fit = () => {
        if (!box.isConnected) return stop();
        box.style.height = vv.height + 'px'; box.style.top = vv.offsetTop + 'px';
      };
      const stop = () => {
        if (vv) { vv.removeEventListener('resize', fit); vv.removeEventListener('scroll', fit); }
        window.removeEventListener('hashchange', onHash);
      };
      const onHash = () => { if (!box.isConnected) stop(); };
      if (vv) { vv.addEventListener('resize', fit); vv.addEventListener('scroll', fit); fit(); }
      window.addEventListener('hashchange', onHash);

      renderVis(); refreshUI(); renderMedia();
      ta.oninput = () => { S.text = ta.value; S.dirty = true; refreshUI(); clearTimeout(st); st = setTimeout(suggest, 250); };
      $('#cr-close').onclick = tryClose;
      $('#cr-pub').onclick = () => persist(false);
      $('#cr-more').onclick = moreMenu;
      $('#cr-vis').onclick = pickVis;
      $('#cr-emo').onclick = emojiSheet;
      $('#cr-sug').onclick = e => { const b = e.target.closest('[data-u]'); if (b) pickMention(b.dataset.u); };
      $('#cr-media').onclick = e => {
        if (e.target.closest('#cr-add')) return $('#in-img').click();
        const b = e.target.closest('[data-rm]');
        if (!b) return;
        const it = S.items.splice(+b.dataset.rm, 1)[0];
        if (it.kind === 'new') URL.revokeObjectURL(it.url); else S.removed.push(it);
        S.dirty = true; renderMedia();
      };
      root.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => {
        if (b.dataset.pick === 'cam') return openCamera((files, k) => addFiles(files, k), () => $('#in-cam').click());
        $({ img: '#in-img', vid: '#in-vid' }[b.dataset.pick]).click();
      });
      root.querySelectorAll('[data-ins]').forEach(b => b.onclick = () => insertAtCaret(b.dataset.ins));
      [['#in-img', 'img'], ['#in-vid', 'video'], ['#in-cam', 'img']].forEach(([s, k]) => {
        $(s).onchange = e => { addFiles(e.target.files, k); e.target.value = ''; };
      });
    }
  };
})();