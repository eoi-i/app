(function () {
  const A = App, P = A.posts;
  Object.assign(A.icons, {
    send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>',
    cm_mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v4"/>',
    cm_smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14a4 4 0 008 0M9 9h.01M15 9h.01"/>',
    cm_play: '<path d="M7 4l13 8-13 8z" fill="currentColor"/>',
    cm_pause: '<path d="M7 4h3v16H7zM14 4h3v16h-3z" fill="currentColor"/>',
    cm_edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
    cm_heart: '<path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 000-7.8z"/>',
    cm_reply: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 016 6v3"/>'
  });

  const css = `
.cm-in{align-items:center}
.cm-ib{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;flex:none;color:var(--muted)}
.cm-ib:active{background:var(--chip)}
.cm-ib .ic{width:22px;height:22px}
.cm-send[hidden],.cm-ib[hidden],.cm-rec[hidden],.cm-in[hidden]{display:none!important}
.cm-rec{display:flex;align-items:center;gap:10px;background:var(--card);border:1.5px solid var(--line);border-radius:18px;padding:5px 8px}
.cm-rec .dot{width:10px;height:10px;border-radius:50%;background:#e5484d;animation:cmb 1s infinite}
@keyframes cmb{50%{opacity:.25}}
.cm-rec b{flex:1;font-variant-numeric:tabular-nums}
.cm-a button{display:inline-flex;align-items:center;gap:4px}
.cm-a button.lk.on{color:#e5484d}
.cm-a button.lk.on .ic{fill:#e5484d;stroke:#e5484d}
.cm-ed{font-size:12px;color:var(--muted);margin-inline-start:6px}
.cm-stk{display:block;width:110px;height:110px;object-fit:contain;margin-top:6px}
.cm-au{display:flex;align-items:center;gap:10px;margin-top:6px;background:var(--chip);border-radius:16px;padding:6px 10px;min-width:190px;max-width:260px;white-space:normal}
.cm-au .pp{width:34px;height:34px;border-radius:50%;background:var(--grad);color:#fff;display:grid;place-items:center;flex:none}
.cm-au .pp .ic{width:16px;height:16px}
.cm-au .bar{flex:1;height:5px;border-radius:3px;background:var(--line);overflow:hidden;direction:ltr}
.cm-au .bar i{display:block;height:100%;width:0;background:var(--primary-2,#7c5cff)}
.cm-au .tm{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}
.cm-sort{display:flex;gap:6px;overflow-x:auto;padding:2px 0 8px;scrollbar-width:none}.cm-sort::-webkit-scrollbar{display:none}
.cm-sort button{flex:none;padding:6px 12px;border-radius:14px;background:var(--chip);color:var(--muted);font-size:12.5px;font-weight:700}.cm-sort button.on{background:var(--grad);color:var(--on-primary,#fff)}
.cmst{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:6px 0;max-height:55vh;overflow-y:auto}
.cmst button{aspect-ratio:1;border-radius:14px;background:var(--chip);display:grid;place-items:center;overflow:hidden;font-size:30px;color:var(--muted)}
.cmst button img{width:100%;height:100%;object-fit:contain}
.cmst .n{grid-column:1/-1;text-align:center;color:var(--muted);font-size:13px;padding:10px}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  const me = () => A.state.user;
  const SEL = 'id,content,created_at,edited_at,parent_id,user_id,media_url,media_type,media_dur,author:profiles!comments_user_id_fkey(id,username,display_name,avatar_url,is_verified,category)';
  const mm = s => { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const stUrl = p => A.sb.storage.from('stickers').getPublicUrl(p).data.publicUrl;
  const poUrl = p => A.sb.storage.from('posts').getPublicUrl(p).data.publicUrl;
  const EXT = { 'audio/webm': 'webm', 'audio/mp4': 'm4a', 'audio/ogg': 'ogg' };

  const bump = (pid, d) => document.querySelectorAll(`.post[data-id="${pid}"] [data-act="comment"] span`)
    .forEach(s => { s.textContent = Math.max(0, (+s.textContent || 0) + d); });

  const resizeImg = file => new Promise(res => {
    if (file.type === 'image/gif') return res(file);
    const im = new Image(), u = URL.createObjectURL(file);
    im.onload = () => {
      const k = Math.min(1, 512 / Math.max(im.width, im.height)), c = document.createElement('canvas');
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
      c.toBlob(b => res(b ? new File([b], 'st.webp', { type: 'image/webp' }) : file), 'image/webp', .9);
    };
    im.onerror = () => res(file); im.src = u;
  });

  async function mount(el, pid, mode) {
    const S = { list: [], owner: null, reply: null, edit: null, blocked: new Set(), busy: false, likes: {}, rc: null };
    const admin = (A.state.profile || {}).role === 'admin';
    const bar = `<div class="cm-bar"><div class="cm-rt" id="cm-rt" hidden></div>
      <div class="cm-rec" id="cm-rec" hidden><button class="cm-ib" id="cm-rx" aria-label="إلغاء">${A.icon('trash')}</button><span class="dot"></span><b id="cm-rtm">0:00</b>${A.eq(7)}
        <button class="cm-send" id="cm-rs" aria-label="إرسال">${A.icon('send')}</button></div>
      <div class="cm-in" id="cm-in"><button class="cm-ib" id="cm-stk" aria-label="ملصق">${A.icon('cm_smile')}</button>
      <textarea id="cm-ta" rows="1" maxlength="1000" placeholder="اكتب تعليقاً..."></textarea>
      <button class="cm-ib" id="cm-mic" aria-label="تسجيل صوتي">${A.icon('cm_mic')}</button>
      <button class="cm-send" id="cm-send" aria-label="إرسال" hidden>${A.icon('send')}</button></div></div>`;
    const SORTS = [['new', 'الأحدث'], ['old', 'الأقدم'], ['top', 'الأكثر فائدة'], ['hot', 'الأكثر تفاعلاً'], ['rnd', 'عشوائي']];
    try { S.sort = localStorage.getItem('cm_sort') || 'new'; } catch (e) { S.sort = 'new'; }
    if (!SORTS.some(x => x[0] === S.sort)) S.sort = 'new';
    S.seed = Math.floor(Math.random() * 1e6);
    const sortBar = '<div class="cm-sort" id="cm-sort">' + SORTS.map(x => `<button data-sort="${x[0]}" class="${x[0] === S.sort ? 'on' : ''}">${x[1]}</button>`).join('') + '</div>';
    const list = sortBar + '<div class="cm-list" id="cm-list"><div class="ld-wait">${A.dots}</div></div>';
    el.innerHTML = mode === 'sheet' ? `<div class="cm-head" id="cm-n">التعليقات</div>${list}${bar}` : `${bar}${list}`;
    const q = s => el.querySelector(s);
    const ta = q('#cm-ta'), box = q('#cm-list');
    let curAu = null;

    function body(c) {
      if (c.media_type === 'sticker') return `<img class="cm-stk" alt="" loading="lazy" src="${A.esc(c.media_url)}">`;
      if (c.media_type === 'audio') return `<div class="cm-au" data-au data-dur="${c.media_dur || 0}"><button class="pp" data-pp aria-label="تشغيل">${A.icon('cm_play')}</button><div class="bar"><i></i></div><span class="tm">${mm(c.media_dur)}</span><audio preload="none" src="${A.esc(c.media_url)}"></audio></div>`;
      return '';
    }

    function item(c, isRep) {
      const a = c.author || {};
      const mine = c.user_id === me().id;
      const canDel = mine || S.owner === me().id || admin;
      const lk = S.likes[c.id] || { n: 0, mine: false };
      const canEdit = mine && !c.media_type;
      return `<div class="cm${isRep ? ' rp' : ''}" data-cid="${c.id}">
        <div class="p-head">${A.avatar(a, isRep ? 30 : 36)}<div>
          <div class="p-name">${A.esc(a.display_name || a.username)}${a.is_verified ? A.verified : ''}${A.catBadge(a.category, 15)}</div>
          <div class="p-sub">@${A.esc(a.username)} · ${A.timeAgo(c.created_at)}${c.edited_at ? '<span class="cm-ed">· معدّل</span>' : ''}</div></div></div>
        <div class="cm-t">${c.content ? A.linkify(c.content) : ''}${body(c)}</div>
        <div class="cm-a">
          <button class="lk${lk.mine ? ' on' : ''}" data-like="${c.id}" aria-label="إعجاب">${A.icon('cm_heart')}${lk.n ? `<span>${lk.n}</span>` : ''}</button>
          <button data-reply="${c.id}">${A.icon('cm_reply')}<span>رد</span></button>
          ${canEdit ? `<button data-edit="${c.id}" aria-label="تعديل">${A.icon('cm_edit')}</button>` : ''}
          ${canDel ? `<button data-del="${c.id}" aria-label="حذف">${A.icon('trash')}</button>`
            : `<button data-rep="${c.id}" aria-label="إبلاغ">${A.icon('flag')}</button>`}</div></div>`;
    }

    function draw() {
      const y = box.scrollTop;
      const kids = {};
      S.list.filter(x => x.parent_id).forEach(x => (kids[x.parent_id] = kids[x.parent_id] || []).push(x));
      const tops = S.list.filter(x => !x.parent_id);
      const lk = c => (S.likes[c.id] || { n: 0 }).n, rc = c => (kids[c.id] || []).length, T = c => +new Date(c.created_at);
      const hash = str => { let h = S.seed | 0; for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619); return (h >>> 0) / 4294967296; };
      const useful = c => {
        const ageD = (Date.now() - T(c)) / 864e5, mine = c.user_id === S.owner ? 3 : 0, len = Math.min(1, (c.content || '').length / 80) * 0.8;
        return (lk(c) * 2 + rc(c) * 1.5 + mine + len + (c.media_type ? 0.4 : 0)) / (1 + ageD * 0.15);
      };
      if (S.sort === 'new') tops.sort((a, b) => T(b) - T(a));
      else if (S.sort === 'old') tops.sort((a, b) => T(a) - T(b));
      else if (S.sort === 'top') tops.sort((a, b) => useful(b) - useful(a) || T(b) - T(a));
      else if (S.sort === 'hot') tops.sort((a, b) => (rc(b) * 3 + lk(b)) - (rc(a) * 3 + lk(a)) || T(b) - T(a));
      else tops.sort((a, b) => hash(a.id) - hash(b.id));
      box.innerHTML = tops.length
        ? tops.map(t => item(t, false) + (kids[t.id] || []).map(r => item(r, true)).join('')).join('')
        : '<div class="empty">لا توجد تعليقات بعد، كن أول من يعلّق</div>';
      box.scrollTop = y; curAu = null;
      const n = q('#cm-n');
      if (n) n.textContent = `التعليقات (${S.list.length})`;
    }

    function setReply(r) {
      S.reply = r; if (r) S.edit = null;
      const rt = q('#cm-rt');
      rt.hidden = !r;
      rt.innerHTML = r ? `<span>الرد على @${A.esc(r.name)}</span><button data-x aria-label="إلغاء">${A.icon('x')}</button>` : '';
    }
    function setEdit(c) {
      S.edit = c ? c.id : null;
      const rt = q('#cm-rt');
      if (c) { S.reply = null; rt.hidden = false; rt.innerHTML = `<span>تعديل التعليق</span><button data-x aria-label="إلغاء">${A.icon('x')}</button>`; ta.value = c.content; ta.focus(); }
      else { rt.hidden = true; rt.innerHTML = ''; }
      sync();
    }
    function sync() {
      const has = !!ta.value.trim();
      q('#cm-send').hidden = !has; q('#cm-mic').hidden = has || !!S.edit; q('#cm-stk').hidden = !!S.edit;
    }

    async function loadLikes() {
      const ids = S.list.map(x => x.id);
      if (!ids.length) return;
      const { data } = await A.sb.rpc('comment_like_counts', { ids });
      S.likes = {};
      (data || []).forEach(r => { S.likes[r.comment_id] = { n: +r.n, mine: !!r.mine }; });
      draw();
    }

    async function load() {
      const [c, p, b] = await Promise.all([
        A.sb.from('comments').select(SEL).eq('post_id', pid).order('created_at', { ascending: true }).limit(300),
        A.sb.from('posts').select('id,user_id').eq('id', pid).maybeSingle(),
        A.sb.from('user_blocks').select('blocked_id').eq('blocker_id', me().id)
      ]);
      if (c.error) {
        box.innerHTML = '<div class="empty">تعذر تحميل التعليقات<br><button class="btn sm" id="cm-retry">إعادة المحاولة</button></div>';
        q('#cm-retry').onclick = load;
        return;
      }
      S.owner = p.data ? p.data.user_id : null;
      S.blocked = new Set((b.data || []).map(x => x.blocked_id));
      S.list = (c.data || []).filter(x => !S.blocked.has(x.user_id));
      draw(); loadLikes();
    }

    async function add(extra) {
      if (S.busy) return;
      S.busy = true;
      const row = Object.assign({ post_id: pid, user_id: me().id, content: '' }, extra);
      if (S.reply) row.parent_id = S.reply.parent;
      const { data, error } = await A.sb.from('comments').insert(row).select(SEL).single();
      S.busy = false;
      if (error) return A.toast(/row-level|policy/i.test(error.message || '') ? 'لا يمكنك التعليق على هذا المنشور' : 'تعذر إرسال التعليق', 'err');
      S.list.push(data);
      ta.value = ''; ta.style.height = 'auto';
      setReply(null); sync(); draw(); bump(pid, 1);
      const nw = box.querySelector(`[data-cid="${data.id}"]`);
      if (nw) nw.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    async function send() {
      const text = ta.value.trim();
      if (!text) return;
      if (S.edit) {
        const id = S.edit;
        q('#cm-send').disabled = true;
        const { data, error } = await A.sb.from('comments').update({ content: text, edited_at: new Date().toISOString() }).eq('id', id).select(SEL).single();
        q('#cm-send').disabled = false;
        if (error) return A.toast('تعذر تعديل التعليق', 'err');
        S.list = S.list.map(x => x.id === id ? data : x);
        ta.value = ''; ta.style.height = 'auto'; setEdit(null); draw();
        return;
      }
      q('#cm-send').disabled = true;
      await add({ content: text });
      q('#cm-send').disabled = false;
    }

    async function del(id) {
      if (!confirm('حذف هذا التعليق؟')) return;
      const { error } = await A.sb.from('comments').delete().eq('id', id);
      if (error) return A.toast('تعذر حذف التعليق', 'err');
      const gone = S.list.filter(x => x.id === id || x.parent_id === id).length;
      S.list = S.list.filter(x => x.id !== id && x.parent_id !== id);
      if (S.edit === id) setEdit(null);
      draw(); bump(pid, -gone);
    }

    async function like(id, btn) {
      const cur = S.likes[id] || { n: 0, mine: false };
      const nxt = { n: Math.max(0, cur.n + (cur.mine ? -1 : 1)), mine: !cur.mine };
      S.likes[id] = nxt; draw();
      const r = nxt.mine
        ? await A.sb.from('comment_likes').insert({ comment_id: id, user_id: me().id })
        : await A.sb.from('comment_likes').delete().eq('comment_id', id).eq('user_id', me().id);
      if (r.error && !/duplicate/i.test(r.error.message || '')) { S.likes[id] = cur; draw(); A.toast('تعذر الإعجاب', 'err'); }
    }

    /* ---- تسجيل صوتي ---- */
    const recUI = on => { q('#cm-rec').hidden = !on; q('#cm-in').hidden = on; };
    const recEnd = send => {
      const r = S.rc; if (!r) return;
      r.send = send; clearInterval(r.tm);
      try { r.mr.stream.getTracks().forEach(t => t.stop()); } catch (e) {}
      try { r.mr.stop(); } catch (e) { S.rc = null; }
      recUI(false);
    };
    q('#cm-mic').onclick = async () => {
      if (S.rc || S.busy) return;
      if (!navigator.mediaDevices || !window.MediaRecorder) return A.toast('المتصفح لا يدعم التسجيل الصوتي', 'err');
      let stream;
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { return A.toast('اسمح للتطبيق باستخدام المايك', 'err'); }
      const mt = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg'].find(t => MediaRecorder.isTypeSupported(t)) || '';
      const mr = new MediaRecorder(stream, mt ? { mimeType: mt } : undefined), chunks = [];
      const r = S.rc = { mr, t0: Date.now(), send: false, tm: null };
      mr.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
      mr.onstop = async () => {
        S.rc = null;
        if (!r.send) return;
        const dur = Math.max(1, Math.round((Date.now() - r.t0) / 1000));
        const type = (mr.mimeType || mt || 'audio/webm').split(';')[0];
        const blob = new Blob(chunks, { type });
        if (blob.size < 800) return A.toast('التسجيل قصير جداً', 'err');
        A.toast('جاري رفع التسجيل...');
        const path = `${me().id}/cm/${Date.now()}.${EXT[type] || 'webm'}`;
        const up = await A.sb.storage.from('posts').upload(path, blob, { contentType: type, cacheControl: '31536000' });
        if (up.error) return A.toast('تعذر رفع التسجيل', 'err');
        add({ media_type: 'audio', media_url: poUrl(path), media_dur: dur });
      };
      mr.start(250);
      recUI(true);
      const tt = q('#cm-rtm'); tt.textContent = '0:00';
      r.tm = setInterval(() => {
        if (!el.isConnected) return recEnd(false);
        const s = (Date.now() - r.t0) / 1000; tt.textContent = mm(s); if (s >= 120) recEnd(true);
      }, 250);
    };
    q('#cm-rx').onclick = () => recEnd(false);
    q('#cm-rs').onclick = () => recEnd(true);

    /* ---- الملصقات ---- */
    q('#cm-stk').onclick = () => {
      const sh = A.sheet(`<h3>ملصقاتي</h3><div class="cmst" id="cmst"></div><input type="file" id="cmst-f" accept="image/*" hidden>`, { tall: true });
      const g = sh.el.querySelector('#cmst'), fi = sh.el.querySelector('#cmst-f');
      let lst = null, held = false, tm = null;
      const drawS = async () => {
        if (!lst) { g.innerHTML = '<button data-add>+</button>'; const { data } = await A.sb.from('user_stickers').select('id,path').order('created_at', { ascending: false }); lst = data || []; }
        g.innerHTML = '<button data-add aria-label="إضافة ملصق">+</button>' + lst.map(x => `<button data-sid="${x.id}"><img alt="" src="${stUrl(x.path)}"></button>`).join('') + (lst.length ? '' : '<div class="n">أضف صورك لتصير ملصقات</div>');
      };
      drawS();
      fi.onchange = async () => {
        const f = fi.files[0]; fi.value = ''; if (!f) return;
        if (!f.type.startsWith('image/')) return A.toast('اختر صورة', 'err');
        if (f.size > 12 * 1024 * 1024) return A.toast('الصورة كبيرة جداً', 'err');
        const o = await resizeImg(f);
        if (o.size > 2097152) return A.toast('حجم الملصق أكبر من 2 ميجابايت', 'err');
        const path = `${me().id}/${Date.now()}.${o.type === 'image/gif' ? 'gif' : 'webp'}`;
        const up = await A.sb.storage.from('stickers').upload(path, o, { contentType: o.type });
        if (up.error) return A.toast('تعذر رفع الملصق', 'err');
        const { data, error } = await A.sb.from('user_stickers').insert({ path }).select('id,path').single();
        if (error) return A.toast('تعذر حفظ الملصق', 'err');
        lst = [data, ...(lst || [])]; drawS(); A.toast('تمت إضافة الملصق', 'ok');
      };
      const cancel = () => clearTimeout(tm);
      g.addEventListener('touchstart', e => {
        const b = e.target.closest('[data-sid]'); if (!b) return;
        tm = setTimeout(() => {
          held = true; setTimeout(() => held = false, 500);
          const id = b.dataset.sid, c = A.sheet(`<h3>حذف الملصق؟</h3><button class="opt" data-y="1">${A.icon('trash')}<div>حذف من مكتبتي</div></button>`);
          c.el.onclick = async ev => {
            if (!ev.target.closest('[data-y]')) return; c.close();
            const it = lst.find(x => x.id === id);
            await A.sb.from('user_stickers').delete().eq('id', id);
            if (it) A.sb.storage.from('stickers').remove([it.path]);
            lst = lst.filter(x => x.id !== id); drawS();
          };
        }, 550);
      }, { passive: true });
      ['touchend', 'touchmove', 'touchcancel'].forEach(ev => g.addEventListener(ev, cancel, { passive: true }));
      sh.el.onclick = e => {
        if (e.target.closest('[data-add]')) return fi.click();
        const b = e.target.closest('[data-sid]');
        if (b) { if (held) return; const it = lst.find(x => x.id === b.dataset.sid); if (it) { sh.close(); add({ media_type: 'sticker', media_url: stUrl(it.path) }); } }
      };
    };

    ta.oninput = () => { ta.style.height = 'auto'; ta.style.height = Math.min(120, ta.scrollHeight) + 'px'; sync(); };
    q('#cm-send').onclick = send;
    q('#cm-rt').onclick = e => {
      if (!e.target.closest('[data-x]')) return;
      if (S.edit) { ta.value = ''; ta.style.height = 'auto'; setEdit(null); } else setReply(null);
    };

    q('#cm-sort').onclick = e => {
      const b = e.target.closest('[data-sort]'); if (!b) return;
      S.sort = b.dataset.sort; try { localStorage.setItem('cm_sort', S.sort); } catch (x) {}
      q('#cm-sort').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
      if (S.sort === 'rnd') S.seed = Math.floor(Math.random() * 1e6);
      draw(); box.scrollTop = 0;
    };
    box.onclick = e => {
      const pp = e.target.closest('[data-pp]');
      if (pp) {
        const wrap = pp.closest('[data-au]'), au = wrap.querySelector('audio');
        if (curAu && curAu !== au) curAu.pause();
        curAu = au;
        if (!wrap._ui) {
          wrap._ui = 1;
          const bar = wrap.querySelector('.bar i'), tx = wrap.querySelector('.tm');
          au.ontimeupdate = () => { const d = au.duration && isFinite(au.duration) ? au.duration : +wrap.dataset.dur || 1; bar.style.width = Math.min(100, au.currentTime / d * 100) + '%'; tx.textContent = mm(au.currentTime); };
          au.onplay = () => { pp.innerHTML = A.icon('cm_pause'); };
          au.onpause = () => { pp.innerHTML = A.icon('cm_play'); };
          au.onended = () => { pp.innerHTML = A.icon('cm_play'); bar.style.width = '0'; tx.textContent = mm(+wrap.dataset.dur); };
        }
        if (au.paused) au.play().catch(() => A.toast('تعذر تشغيل الصوت', 'err')); else au.pause();
        return;
      }
      const r = e.target.closest('[data-reply]'), d = e.target.closest('[data-del]'), f = e.target.closest('[data-rep]'),
        l = e.target.closest('[data-like]'), ed = e.target.closest('[data-edit]');
      if (r) {
        const c = S.list.find(x => x.id === r.dataset.reply);
        if (!c) return;
        if (S.edit) setEdit(null);
        setReply({ parent: c.parent_id || c.id, name: c.author.username });
        ta.value = c.parent_id ? `@${c.author.username} ` : '';
        sync(); ta.focus();
      } else if (ed) {
        const c = S.list.find(x => x.id === ed.dataset.edit); if (c) setEdit(c);
      } else if (l) like(l.dataset.like, l);
      else if (d) del(d.dataset.del);
      else if (f) A.report('comment', f.dataset.rep);
    };
    sync(); load();
  }

  A.comments = {
    open(pid) {
      const pg = document.querySelector(`.cm-page[data-pid="${pid}"] textarea`);
      if (pg) { pg.scrollIntoView({ block: 'center' }); pg.focus(); return; }
      const sh = A.sheet('<div class="cm-wrap"></div>', { tall: true });
      mount(sh.el.firstChild, pid, 'sheet');
    }
  };

  // صفحة منشور واحد (#/post/ID) تُفتح من روابط المشاركة
  A.pages.post = {
    async render(view, id) {
      view.innerHTML = P.skeleton(1);
      const { data, error } = await A.sb.from('posts').select(P.SEL).eq('id', id).eq('is_draft', false).maybeSingle();
      if (error || !data || (data.repost_of && !data.original)) {
        view.innerHTML = '<div class="empty">هذا المنشور غير متاح<br><button class="btn sm" id="pg-home">الرئيسية</button></div>';
        document.getElementById('pg-home').onclick = () => { location.hash = '#/home'; };
        return;
      }
      const tid = data.repost_of && data.original ? data.original.id : data.id;
      const st = await P.state([data]);
      view.innerHTML = `<button class="btn ghost sm" id="pg-back" style="margin:0 0 10px">رجوع</button>
        ${P.html(data, st)}<div class="card cm-page" data-pid="${tid}" id="pg-cm"></div>`;
      document.getElementById('pg-back').onclick = () => { history.length > 1 ? history.back() : (location.hash = '#/home'); };
      P.bind(view);
      mount(document.getElementById('pg-cm'), tid, 'page');
    }
  };
})();
