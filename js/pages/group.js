(function () {
  const A = App, me = () => A.state.user;

  const st = document.createElement('style');
  st.textContent = `
.gp{direction:rtl;padding:6px 2px 40px}
.gp-av{width:104px;height:104px;border-radius:50%;margin:6px auto 4px;display:grid;place-items:center;background:var(--chip);border:2px dashed var(--primary-2);color:var(--primary-2);overflow:hidden;position:relative;cursor:pointer}
.gp-av img{width:100%;height:100%;object-fit:cover;position:absolute;inset:0}
.gp-av .ic{width:34px;height:34px}
.gp-lb{font-weight:800;font-size:13.5px;margin:16px 4px 6px;color:var(--muted)}
.gp input[type=text],.gp textarea{width:100%;padding:13px 14px;border-radius:14px;background:var(--chip);border:1px solid var(--line);color:var(--text);font:inherit;font-size:15px}
.gp textarea{resize:none;min-height:72px}
.gp-chips{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}
.gp-chip{display:flex;align-items:center;gap:6px;padding:4px 4px 4px 10px;border-radius:20px;background:linear-gradient(135deg,#0E7C66,#14A585);color:#fff;font-size:13px;font-weight:700}
.gp-chip b{width:20px;height:20px;border-radius:50%;background:rgba(255,255,255,.25);display:grid;place-items:center;font-size:12px}
.gp-r{display:flex;align-items:center;gap:11px;width:100%;padding:9px 4px;text-align:start;border-bottom:1px solid var(--line)}
.gp-r .gp-n{flex:1;min-width:0}
.gp-r .gp-n b{display:flex;align-items:center;gap:5px;font-size:14.5px}
.gp-r .gp-n small{color:var(--muted);font-size:12.5px}
.gp-tk{width:24px;height:24px;border-radius:50%;border:2px solid var(--line);display:grid;place-items:center;font-size:14px;color:#fff;flex:none}
.gp-r.on .gp-tk{background:#14A585;border-color:#14A585}
.gp-go{width:100%;margin-top:22px;padding:15px;border-radius:16px;background:linear-gradient(135deg,#0E7C66,#14A585);color:#fff;font-weight:800;font-size:16px;box-shadow:0 12px 26px -14px rgba(20,165,133,.9)}
.gp-go:disabled{opacity:.5}
.gi-h{text-align:center;padding:10px 0 6px}
.gi-h .av{display:inline-block;position:relative}
.gi-h h2{margin:10px 0 2px;font-size:21px}
.gi-h p{color:var(--muted);margin:2px 0;font-size:14px;line-height:1.7;white-space:pre-wrap}
.gi-act{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0}
.gi-act button{display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 4px;border-radius:16px;background:var(--card);border:1px solid var(--line);font-weight:700;font-size:12.5px;color:var(--text)}
.gi-act .ic{width:22px;height:22px;color:var(--primary-2)}
.gi-sec{font-weight:800;color:var(--muted);font-size:13.5px;margin:18px 4px 6px}
.gi-card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:2px 12px;box-shadow:var(--shadow)}
.gi-card .gp-r:last-child{border-bottom:0}
.rl{font-size:11px;font-weight:800;padding:2px 8px;border-radius:10px;background:rgba(229,181,61,.2);color:#E5B53D}
.rl.ow{background:rgba(20,165,133,.2);color:#14A585}
.gi-sw{display:flex;align-items:center;gap:10px;width:100%;padding:13px 4px;text-align:start;font-weight:700}
.gi-sw span.t{flex:1}
.gi-sw small{display:block;color:var(--muted);font-weight:500;font-size:12px}
.gi-leave{width:100%;margin-top:20px;padding:14px;border-radius:16px;background:rgba(229,57,53,.12);color:#ff5a55;font-weight:800}
.gi-lk{direction:ltr;text-align:left;font-size:13px;padding:12px;border-radius:12px;background:var(--chip);border:1px solid var(--line);word-break:break-all;margin:0 0 12px}
.gj{text-align:center;padding:40px 10px;direction:rtl}
.gj h2{margin:14px 0 4px}.gj p{color:var(--muted);line-height:1.8}
.fx{z-index:120!important}
.gi-sw .sw.on{background:linear-gradient(135deg,#0E7C66,#14A585);box-shadow:0 0 0 1px rgba(20,165,133,.5)}
.gi-sw .sw.on::after{background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.35)}
.gnew{margin-inline-start:auto;display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:20px;background:linear-gradient(135deg,#0E7C66,#14A585);color:#fff;font-weight:800;font-size:13.5px}
.gnew .ic{width:17px;height:17px}`;
  document.head.appendChild(st);

  const stUrl = p => A.sb.storage.from('stickers').getPublicUrl(p).data.publicUrl;
  const inviteUrl = code => location.href.split('#')[0] + '#/g/' + code;

  const resize = file => new Promise(res => {
    const im = new Image(), u = URL.createObjectURL(file);
    im.onload = () => {
      const k = Math.min(1, 512 / Math.max(im.width, im.height)), c = document.createElement('canvas');
      c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u);
      c.toBlob(b => res(b), 'image/webp', .88);
    };
    im.onerror = () => res(null); im.src = u;
  });
  async function uploadAvatar(file) {
    const b = await resize(file);
    if (!b) throw new Error('img');
    const path = `${me().id}/g_${Date.now()}.webp`;
    const { error } = await A.sb.storage.from('stickers').upload(path, b, { contentType: 'image/webp' });
    if (error) throw error;
    return stUrl(path);
  }
  const pickImage = cb => {
    const f = document.createElement('input'); f.type = 'file'; f.accept = 'image/*';
    f.onchange = () => { if (f.files[0]) cb(f.files[0]); }; f.click();
  };
  const page = (title, bodyHTML) => {
    const el = document.createElement('div');
    el.className = 'cr'; el.style.zIndex = 85;
    el.innerHTML = `<div class="cr-head"><button class="icon-btn" data-x aria-label="رجوع">${A.icon('arrow')}</button><div class="cr-title">${title}</div><span style="width:44px"></span></div><div class="cr-body"><div class="gp">${bodyHTML}</div></div>`;
    document.body.appendChild(el);
    el.querySelector('[data-x]').onclick = () => el.remove();
    return el;
  };

  /* ---------- منتقي الأعضاء ---------- */
  function picker(box, sel, exclude) {
    box.innerHTML = `<div class="gp-chips" id="pk-c"></div><input type="text" id="pk-q" placeholder="ابحث باسم المستخدم أو الاسم..." autocomplete="off"><div id="pk-l" style="margin-top:6px"></div>`;
    const chips = box.querySelector('#pk-c'), inp = box.querySelector('#pk-q'), out = box.querySelector('#pk-l');
    let rows = [], seq = 0;
    const row = u => `<button class="gp-r ${sel.has(u.id) ? 'on' : ''}" data-id="${u.id}">${A.avatar(u, 42)}<div class="gp-n"><b>${A.esc(u.display_name || u.username)}${u.is_verified ? A.verified : ''}</b><small>@${A.esc(u.username)}</small></div><span class="gp-tk">✓</span></button>`;
    const paintChips = () => { chips.innerHTML = [...sel.values()].map(u => `<span class="gp-chip" data-rm="${u.id}">${A.esc(u.display_name || u.username)}<b>✕</b></span>`).join(''); };
    const paintRows = () => { out.innerHTML = rows.length ? rows.map(row).join('') : '<div class="empty" style="padding:18px 0">لا توجد نتائج</div>'; };
    async function suggest() {
      const { data } = await A.sb.rpc('my_conversations');
      rows = (data || []).filter(c => c.other_id && !exclude.has(c.other_id)).map(c => ({ id: c.other_id, username: c.other_username, display_name: c.other_name, avatar_url: c.other_avatar, is_verified: c.other_verified }));
      if (!inp.value.trim()) { out.innerHTML = rows.length ? '<div class="gi-sec" style="margin-top:8px">من محادثاتك</div>' + rows.map(row).join('') : '<div class="empty" style="padding:18px 0">ابحث لإضافة أعضاء</div>'; }
    }
    async function search() {
      const s = inp.value.trim(), my = ++seq;
      if (s.length < 2) return suggest();
      const e = s.replace(/[\\%_]/g, '\\$&'), cols = 'id,username,display_name,avatar_url,is_verified';
      const [a, b] = await Promise.all([
        A.sb.from('profiles').select(cols).ilike('username', e + '%').eq('is_banned', false).limit(8),
        A.sb.from('profiles').select(cols).ilike('display_name', '%' + e + '%').eq('is_banned', false).limit(8)
      ]);
      if (my !== seq) return;
      const seen = new Set();
      rows = [...(a.data || []), ...(b.data || [])].filter(u => u.id !== me().id && !exclude.has(u.id) && !seen.has(u.id) && seen.add(u.id));
      paintRows();
    }
    let t; inp.oninput = () => { clearTimeout(t); t = setTimeout(search, 250); };
    box.onclick = e => {
      const rm = e.target.closest('[data-rm]');
      if (rm) { sel.delete(rm.dataset.rm); paintChips(); const r = out.querySelector(`[data-id="${rm.dataset.rm}"]`); if (r) r.classList.remove('on'); box.dispatchEvent(new Event('pk')); return; }
      const r = e.target.closest('.gp-r'); if (!r) return;
      const u = rows.find(x => x.id === r.dataset.id); if (!u) return;
      if (sel.has(u.id)) sel.delete(u.id); else { if (sel.size >= 200) return A.toast('الحد الأقصى 200 عضو', 'err'); sel.set(u.id, u); }
      r.classList.toggle('on', sel.has(u.id)); paintChips(); box.dispatchEvent(new Event('pk'));
    };
    suggest(); paintChips();
  }

  /* ---------- إنشاء مجموعة ---------- */
  A.createGroup = () => {
    const sel = new Map(); let avFile = null;
    const el = page('مجموعة جديدة', `<div class="gp-av" id="g-av">${A.icon('camera')}</div><div class="p-sub" style="text-align:center">صورة المجموعة (اختياري)</div>
      <div class="gp-lb">اسم المجموعة</div><input type="text" id="g-n" maxlength="60" placeholder="مثال: أصدقاء بغداد">
      <div class="gp-lb">الوصف (اختياري)</div><textarea id="g-d" maxlength="300" placeholder="عن ماذا تتحدث هذه المجموعة؟"></textarea>
      <div class="gp-lb">إضافة أعضاء</div><div id="g-pk"></div>
      <button class="gp-go" id="g-go" disabled>إنشاء المجموعة</button>`);
    const q = s => el.querySelector(s), go = q('#g-go'), nm = q('#g-n');
    picker(q('#g-pk'), sel, new Set());
    const sync = () => { go.disabled = !nm.value.trim(); go.textContent = sel.size ? `إنشاء المجموعة (${sel.size + 1})` : 'إنشاء المجموعة'; };
    nm.oninput = sync; q('#g-pk').addEventListener('pk', sync);
    q('#g-av').onclick = () => pickImage(f => {
      if (!f.type.startsWith('image/')) return A.toast('اختر صورة', 'err');
      avFile = f; q('#g-av').innerHTML = `<img alt="" src="${URL.createObjectURL(f)}">`; q('#g-av').style.borderStyle = 'solid';
    });
    go.onclick = async () => {
      go.disabled = true; go.textContent = 'جاري الإنشاء...';
      try {
        const av = avFile ? await uploadAvatar(avFile) : null;
        const { data, error } = await A.sb.rpc('create_group', { p_name: nm.value.trim(), p_desc: q('#g-d').value.trim(), p_avatar: av, p_members: [...sel.keys()] });
        if (error) throw error;
        el.remove(); location.hash = '#/chat/' + data;
      } catch (e) { console.error(e); A.toast('تعذر إنشاء المجموعة', 'err'); go.disabled = false; sync(); }
    };
  };

  /* ---------- معلومات المجموعة ---------- */
  A.groupInfo = async cid => {
    const el = page('معلومات المجموعة', '<div class="empty">جاري التحميل...</div>');
    const box = el.querySelector('.gp');
    let info, mem, role;
    const isAdm = () => role === 'owner' || role === 'admin';
    async function load() {
      const [c, m] = await Promise.all([
        A.sb.from('conversations').select('name,description,avatar_url,invite_code,only_admins_send,invite_enabled,members_can_add').eq('id', cid).maybeSingle(),
        A.sb.from('conversation_members').select('user_id,role,silenced,joined_at,user:profiles!conversation_members_user_id_fkey(id,username,display_name,avatar_url,is_verified)').eq('conversation_id', cid)
      ]);
      if (!c.data || m.error) { box.innerHTML = '<div class="empty">المجموعة غير متاحة</div>'; return false; }
      info = c.data;
      const ord = { owner: 0, admin: 1, member: 2 };
      mem = (m.data || []).sort((a, b) => ord[a.role] - ord[b.role] || new Date(a.joined_at) - new Date(b.joined_at));
      const mine = mem.find(x => x.user_id === me().id); role = mine ? mine.role : null;
      if (!role) { box.innerHTML = '<div class="empty">لست عضواً في هذه المجموعة</div>'; return false; }
      return true;
    }
    function draw() {
      const g = { display_name: info.name, avatar_url: info.avatar_url };
      box.innerHTML = `<div class="gi-h"><div class="av" id="gi-av">${A.avatar(g, 104)}</div><h2>${A.esc(info.name)}</h2><div class="p-sub">${mem.length} عضو</div>${info.description ? `<p>${A.esc(info.description)}</p>` : ''}</div>
        ${isAdm() ? `<div class="gi-act"><button data-k="add">${A.icon('plus')}إضافة أعضاء</button><button data-k="inv">${A.icon('qrlink')}رابط الدعوة</button><button data-k="edit">${A.icon('pencil')}تعديل</button></div>
        <div class="gi-sec">إعدادات الخصوصية</div><div class="gi-card">
          <button class="gi-sw" data-k="only"><span class="t">الإرسال للمشرفين فقط<small>الأعضاء يقرؤون فقط ولا يستطيعون الكتابة</small></span><span class="sw ${info.only_admins_send ? 'on' : ''}"></span></button>
          <button class="gi-sw" data-k="invon"><span class="t">الانضمام عبر الرابط<small>عند الإيقاف لا يستطيع أحد الانضمام بالرابط</small></span><span class="sw ${info.invite_enabled ? 'on' : ''}"></span></button>
          <button class="gi-sw" data-k="madd"><span class="t">الأعضاء يستطيعون إضافة آخرين<small>عند الإيقاف المشرفون فقط يضيفون</small></span><span class="sw ${info.members_can_add ? 'on' : ''}"></span></button>
          <button class="gi-sw" data-k="bans"><span class="t">الأعضاء المحظورون<small>عرض وإلغاء الحظر</small></span></button></div>`
        : info.members_can_add ? `<div class="gi-act" style="grid-template-columns:1fr"><button data-k="add">${A.icon('plus')}إضافة أعضاء</button></div>` : ''}
        <div class="gi-sec">الأعضاء (${mem.length})</div><div class="gi-card">${mem.map(x => {
          const u = x.user || {};
          return `<button class="gp-r" data-u="${x.user_id}">${A.avatar(u, 44)}<div class="gp-n"><b>${A.esc(u.display_name || u.username || 'مستخدم')}${u.is_verified ? A.verified : ''}${x.user_id === me().id ? ' <small>(أنت)</small>' : ''}</b><small>@${A.esc(u.username || '')}</small></div>${x.silenced ? '<span class="rl" style="background:rgba(229,57,53,.15);color:#ff5a55">مكتوم</span>' : ''}${x.role === 'owner' ? '<span class="rl ow">مدير</span>' : x.role === 'admin' ? '<span class="rl">مشرف</span>' : ''}</button>`;
        }).join('')}</div>
        <button class="gi-leave" data-k="leave">مغادرة المجموعة</button>${role === 'owner' ? '<button class="gi-leave" data-k="gdel" style="margin-top:10px;background:#E53935;color:#fff">حذف المجموعة نهائياً</button>' : ''}`;
    }
    const reload = async () => { if (await load()) draw(); };

    const inviteSheet = () => {
      const show = code => {
        const url = inviteUrl(code);
        const sh = A.sheet(`<h3>رابط الدعوة</h3><div class="gi-lk">${A.esc(url)}</div>
          <button class="opt" data-k="copy">${A.icon('qrlink')}<div>نسخ الرابط</div></button>
          <button class="opt" data-k="share">${A.icon('share')}<div>مشاركة</div></button>
          <button class="opt" data-k="regen">${A.icon('refresh')}<div>إنشاء رابط جديد<small>الرابط القديم يتوقف عن العمل</small></div></button>`);
        sh.el.onclick = async e => {
          const b = e.target.closest('[data-k]'); if (!b) return; const k = b.dataset.k;
          if (k === 'copy') { sh.close(); return navigator.clipboard.writeText(url).then(() => A.toast('تم نسخ الرابط', 'ok'), () => A.toast('تعذر النسخ', 'err')); }
          if (k === 'share') { sh.close(); return A.shareLink({ title: 'مشاركة المجموعة', url, text: 'انضم إلى مجموعة «' + info.name + '» على أني عراقي', name: info.name, avatar_url: info.avatar_url, desc: info.description, sub: 'مجموعة' }); }
          if (k === 'regen') { const { data, error } = await A.sb.rpc('group_regen_invite', { cid }); sh.close(); if (error) return A.toast('تعذر التنفيذ', 'err'); info.invite_code = data; A.toast('تم إنشاء رابط جديد', 'ok'); show(data); }
        };
      };
      show(info.invite_code);
    };

    const editSheet = () => {
      let newAv = null;
      const sh = A.sheet(`<h3>تعديل المجموعة</h3><div class="gp" style="padding:0"><div class="gp-av" id="e-av" style="margin-top:0">${info.avatar_url ? `<img alt="" src="${A.esc(info.avatar_url)}">` : A.icon('camera')}</div>
        <div class="gp-lb">الاسم</div><input type="text" id="e-n" maxlength="60" value="${A.esc(info.name)}">
        <div class="gp-lb">الوصف</div><textarea id="e-d" maxlength="300">${A.esc(info.description || '')}</textarea>
        <button class="gp-go" id="e-s">حفظ</button></div>`, { tall: true });
      const q = s => sh.el.querySelector(s);
      q('#e-av').onclick = () => pickImage(f => { if (!f.type.startsWith('image/')) return A.toast('اختر صورة', 'err'); newAv = f; q('#e-av').innerHTML = `<img alt="" src="${URL.createObjectURL(f)}">`; });
      q('#e-s').onclick = async () => {
        const b = q('#e-s'); b.disabled = true;
        try {
          const av = newAv ? await uploadAvatar(newAv) : null;
          const { error } = await A.sb.rpc('group_update', { cid, p_name: q('#e-n').value, p_desc: q('#e-d').value, p_avatar: av, p_only: null });
          if (error) throw error;
          sh.close(); A.toast('تم الحفظ', 'ok'); reload();
        } catch (e) { console.error(e); A.toast('تعذر الحفظ', 'err'); b.disabled = false; }
      };
    };

    const addPage = () => {
      const sel = new Map();
      const ap = page('إضافة أعضاء', `<div id="a-pk"></div><button class="gp-go" id="a-go" disabled>إضافة</button>`);
      ap.style.zIndex = 90;
      picker(ap.querySelector('#a-pk'), sel, new Set(mem.map(x => x.user_id)));
      const go = ap.querySelector('#a-go');
      ap.querySelector('#a-pk').addEventListener('pk', () => { go.disabled = !sel.size; go.textContent = sel.size ? `إضافة (${sel.size})` : 'إضافة'; });
      go.onclick = async () => {
        go.disabled = true;
        const { data, error } = await A.sb.rpc('group_add', { cid, p_members: [...sel.keys()] });
        if (error) { go.disabled = false; return A.toast('تعذرت الإضافة', 'err'); }
        A.toast(data ? `تمت إضافة ${data}` : 'لم تتم إضافة أحد', data ? 'ok' : 'err'); ap.remove(); reload();
      };
    };

    async function bansSheet() {
      const bn = await A.sb.from('group_bans').select('user_id').eq('conversation_id', cid).eq('active', true);
      const ids = (bn.data || []).map(x => x.user_id);
      const pr = ids.length ? await A.sb.from('profiles').select('id,username,display_name,avatar_url').in('id', ids) : { data: [] };
      const pm = {}; (pr.data || []).forEach(u => { pm[u.id] = u; });
      const rows = ids.map(id => ({ user_id: id, user: pm[id] || {} }));
      const sh = A.sheet(`<h3>الأعضاء المحظورون</h3>${rows.length ? rows.map(x => { const u = x.user || {}; return `<button class="gp-r" data-ub="${x.user_id}">${A.avatar(u, 40)}<div class="gp-n"><b>${A.esc(u.display_name || u.username || 'مستخدم')}</b><small>اضغط لإلغاء الحظر</small></div></button>`; }).join('') : '<div class="empty" style="padding:18px 0">لا يوجد محظورون</div>'}`);
      sh.el.onclick = async e => {
        const b = e.target.closest('[data-ub]'); if (!b) return;
        const { error } = await A.sb.rpc('group_unban', { cid, uid: b.dataset.ub });
        if (error) return A.toast('تعذر التنفيذ', 'err');
        b.remove(); A.toast('تم إلغاء الحظر', 'ok');
      };
    }

    const memberSheet = uid => {
      const x = mem.find(m => m.user_id === uid); if (!x) return;
      const u = x.user || {}, self = uid === me().id;
      const opt = (k, ic, t) => `<button class="opt" data-k="${k}">${A.icon(ic)}<div>${t}</div></button>`;
      const canKick = !self && isAdm() && x.role !== 'owner' && !(x.role === 'admin' && role !== 'owner');
      const sh = A.sheet(`<h3>${A.esc(u.display_name || u.username || '')}</h3>${opt('prof', 'user', 'عرض الملف الشخصي')}${role === 'owner' && !self ? (x.role === 'admin' ? opt('demote', 'blk', 'إزالة الإشراف') : opt('promote', 'shield', 'تعيين مشرفاً')) + opt('xfer', 'users', 'تحويل ملكية المجموعة') : ''}${canKick ? opt('silence', 'mute', x.silenced ? 'السماح له بالكتابة' : 'كتم العضو (منع الكتابة)') + opt('kick', 'trash', 'إزالة من المجموعة') + opt('ban', 'blk', 'حظر من المجموعة') : ''}`);
      sh.el.onclick = async e => {
        const b = e.target.closest('[data-k]'); if (!b) return; const k = b.dataset.k; sh.close();
        if (k === 'prof') { el.remove(); location.hash = '#/u/' + encodeURIComponent(u.username); return; }
        let r;
        if (k === 'promote') r = await A.sb.rpc('group_set_role', { cid, uid, p_role: 'admin' });
        else if (k === 'demote') r = await A.sb.rpc('group_set_role', { cid, uid, p_role: 'member' });
        else if (k === 'xfer') { if (!confirm('تحويل ملكية المجموعة؟ ستصبح مشرفاً.')) return; r = await A.sb.rpc('group_transfer', { cid, uid }); }
        else if (k === 'silence') r = await A.sb.rpc('group_silence', { cid, uid, v: !x.silenced });
        else if (k === 'ban') { if (!confirm('حظر هذا العضو؟ لن يستطيع الانضمام مجدداً.')) return; r = await A.sb.rpc('group_ban', { cid, uid }); }
        else if (k === 'kick') { if (!confirm('إزالة هذا العضو من المجموعة؟')) return; r = await A.sb.rpc('group_remove', { cid, uid }); }
        if (r && r.error) return A.toast('تعذر التنفيذ', 'err');
        A.toast('تم', 'ok'); reload();
      };
    };

    box.onclick = async e => {
      const k = e.target.closest('[data-k]'), u = e.target.closest('[data-u]');
      if (u) return memberSheet(u.dataset.u);
      if (!k) { if (e.target.closest('#gi-av') && isAdm()) editSheet(); return; }
      const a = k.dataset.k;
      if (a === 'add') return addPage();
      if (a === 'inv') return inviteSheet();
      if (a === 'edit') return editSheet();
      if (a === 'only') {
        const v = !info.only_admins_send;
        const { error } = await A.sb.rpc('group_update', { cid, p_name: info.name, p_desc: info.description || '', p_avatar: null, p_only: v });
        if (error) return A.toast('تعذر التنفيذ', 'err');
        info.only_admins_send = v; draw(); return;
      }
      if (a === 'invon' || a === 'madd') {
        const p = a === 'invon' ? { p_invite: !info.invite_enabled, p_members_add: null } : { p_invite: null, p_members_add: !info.members_can_add };
        const { error } = await A.sb.rpc('group_privacy', Object.assign({ cid }, p));
        if (error) return A.toast('تعذر التنفيذ', 'err');
        if (a === 'invon') info.invite_enabled = !info.invite_enabled; else info.members_can_add = !info.members_can_add;
        draw(); return;
      }
      if (a === 'bans') return bansSheet();
      if (a === 'gdel') {
        if (!confirm('حذف المجموعة نهائياً؟ ستُحذف كل الرسائل ولا يمكن التراجع.')) return;
        const { error } = await A.sb.rpc('group_delete', { cid });
        if (error) return A.toast('تعذر حذف المجموعة', 'err');
        A.toast('تم حذف المجموعة', 'ok'); el.remove(); location.hash = '#/chats'; return;
      }
      if (a === 'leave') {
        if (!confirm(role === 'owner' ? 'ستغادر المجموعة وتنتقل الملكية لعضو آخر. متأكد؟' : 'مغادرة المجموعة؟')) return;
        const { error } = await A.sb.rpc('group_leave', { cid });
        if (error) return A.toast('تعذرت المغادرة', 'err');
        el.remove(); location.hash = '#/chats';
      }
    };
    reload();
  };


  /* ---------- استطلاع رأي / موضوع للنقاش (للمحادثات) ---------- */
  A.askPoll = cb => {
    const sh = A.sheet(`<h3>استطلاع رأي</h3><div class="gp" style="padding:0"><div class="gp-lb" style="margin-top:0">السؤال</div><input type="text" id="p-q" maxlength="200" placeholder="سؤال استطلاع الرأي">
      <div class="gp-lb">الخيارات</div><div id="p-o"></div><button class="pl-add" id="p-add" style="width:100%;margin-top:8px;border-radius:14px;background:var(--chip);border:1px solid var(--line);font-weight:700;color:var(--text)">${A.icon('plus')} إضافة خيار</button>
      <button class="gp-go" id="p-s" disabled>إنشاء استطلاع رأي</button></div>`, { tall: true });
    const q = s => sh.el.querySelector(s), box = q('#p-o'), go = q('#p-s');
    const vals = () => [...box.querySelectorAll('input')].map(x => x.value.trim()).filter(Boolean);
    const sync = () => { go.disabled = !q('#p-q').value.trim() || vals().length < 2; };
    const addOpt = () => { const i = document.createElement('input'); i.type = 'text'; i.maxLength = 80; i.placeholder = 'إضافة خيار'; i.style.marginBottom = '8px'; i.oninput = sync; box.appendChild(i); if (box.children.length >= 6) q('#p-add').style.display = 'none'; };
    addOpt(); addOpt(); q('#p-q').oninput = sync;
    q('#p-add').onclick = () => { addOpt(); box.lastChild.focus(); };
    go.onclick = () => { const d = { q: q('#p-q').value.trim(), opts: vals() }; sh.close(); cb(d); };
  };
  A.askTopic = cb => {
    const sug = ['اسألني عن أي شيء', 'أنت وأفضل صديق لك', 'آخر مكان زرته', 'أفضل أغنية سمعتها هذا الأسبوع', 'شنو تحب أكثر بالعراق؟'];
    const sh = A.sheet(`<h3>موضوع للنقاش</h3><div class="gp" style="padding:0"><div class="gp-lb" style="margin-top:0">اكتب موضوعاً يرد عليه الأعضاء</div><textarea id="t-t" maxlength="300" placeholder="موضوع للنقاش"></textarea>
      <div class="tp-sg">${sug.map(x => `<button data-s="${A.esc(x)}">${A.esc(x)}</button>`).join('')}</div>
      <div class="p-sub" style="margin:10px 4px 0">يمكن للأعضاء الرد بنصوص أو صور لمدة 24 ساعة.</div><button class="gp-go" id="t-s" disabled>نشر الموضوع</button></div>`, { tall: true });
    const q = s => sh.el.querySelector(s), t = q('#t-t'), go = q('#t-s');
    t.oninput = () => { go.disabled = !t.value.trim(); };
    q('.tp-sg').onclick = e => { const b = e.target.closest('[data-s]'); if (b) { t.value = b.dataset.s; t.oninput(); } };
    go.onclick = () => { const d = { txt: t.value.trim() }; sh.close(); cb(d); };
  };

  /* ---------- الانضمام عبر الرابط ---------- */
  A.pages.g = {
    async render(view, code) {
      view.innerHTML = '<div class="gj"><div class="sk" style="width:96px;height:96px;border-radius:50%;margin:0 auto"></div></div>';
      const { data } = await A.sb.rpc('group_preview', { p_code: code });
      const g = data && data[0];
      if (!g) { view.innerHTML = '<div class="gj"><h2>الرابط غير صالح</h2><p>ربما تم إلغاء رابط الدعوة أو حذف المجموعة.</p></div>'; return; }
      view.innerHTML = `<div class="gj">${A.avatar({ display_name: g.name, avatar_url: g.avatar_url }, 96)}<h2>${A.esc(g.name)}</h2><div class="p-sub">${g.members} عضو</div>${g.description ? `<p>${A.esc(g.description)}</p>` : ''}<button class="gp-go" id="g-j">${g.joined ? 'فتح المجموعة' : 'انضمام إلى المجموعة'}</button></div>`;
      view.querySelector('#g-j').onclick = async e => {
        e.target.disabled = true;
        if (g.joined) { location.hash = '#/chat/' + g.id; return; }
        const r = await A.sb.rpc('group_join', { p_code: code });
        if (r.error) { e.target.disabled = false; return A.toast('تعذر الانضمام', 'err'); }
        location.hash = '#/chat/' + r.data;
      };
    }
  };
})();
