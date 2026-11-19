(function () {
  const A = App, R = A.rt;
  const me = () => A.state.user;
  Object.assign(A.icons, {
    mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v4"/>',
    file: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14a4 4 0 008 0M9 9h.01M15 9h.01"/>',
    play: '<path d="M6 4l14 8-14 8z"/>',
    pause: '<path d="M7 4h3v16H7zM14 4h3v16h-3z"/>',
    stop: '<rect x="5" y="5" width="14" height="14" rx="2"/>',
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    send: '<path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/>',
    clip: '<path d="M21.4 11.1l-9.2 9.2a6 6 0 01-8.5-8.5l9.2-9.2a4 4 0 015.7 5.7l-9.2 9.2a2 2 0 01-2.8-2.8l8.5-8.5"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
    video: '<rect x="2" y="5" width="14" height="14" rx="3"/><path d="M16 10l6-3v10l-6-3z"/>',
    camera: '<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>',
    rply: '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 015 5v5"/>',
    pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/>',
    fwd: '<path d="M15 14l5-5-5-5"/><path d="M20 9H9a5 5 0 00-5 5v5"/>',
    pinI: '<path d="M12 17v5M9 3h6l-1 6 3 3v2H7v-2l3-3z"/>',
    mute: '<path d="M11 5L6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6"/>',
    bell: '<path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/>',
    blk: '<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>',
    flag: '<path d="M4 22V4M4 4h13l-2 4 2 4H4"/>',
    trashI: '<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>',
    xx: '<path d="M18 6L6 18M6 6l12 12"/>'
  });

  const cst = document.createElement('style');
  cst.textContent = `
.bb .pl{padding:2px 0 0;min-width:230px}
.bb .tp{margin:0 0 4px;min-width:230px}
.tp-r{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;margin-top:12px;padding:10px;border-radius:12px;background:rgba(255,255,255,.22);color:#fff;font-weight:800;font-size:14px}
.tp-r .ic{width:16px;height:16px}
.pinbar{display:flex;align-items:center;gap:10px;width:100%;padding:8px 14px;text-align:start;background:var(--card);border-bottom:1px solid var(--line);flex:none}
.pinbar[hidden]{display:none}
.pinbar .pi .ic{width:20px;height:20px;color:#14A585}
.pvi{display:inline-flex;vertical-align:-3px;margin-inline-end:4px;opacity:.85}
.pvi .ic{width:15px;height:15px}
.cv-b b .pvi{margin-inline-end:5px;margin-inline-start:0}
.pinbar div{min-width:0;flex:1}
.pinbar b{display:block;font-size:12px;color:#14A585}
.pinbar div span{display:block;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sn{font-size:12.5px;font-weight:800;margin-bottom:3px}
.chat-bar.recing>*:not(.rec){display:none!important}
.rec[hidden],.cm-send[hidden]{display:none!important}
.rec{flex:1;display:flex;align-items:center;gap:10px;padding:2px 4px}
.rec .rd{width:10px;height:10px;border-radius:50%;background:#ff3b5c;animation:rcb 1s infinite}
@keyframes rcb{50%{opacity:.2}}
.rec b{font-variant-numeric:tabular-nums;min-width:38px}
.rec .rw{flex:1;color:var(--muted);font-size:13px}
.au{display:flex;align-items:center;gap:10px;min-width:210px;padding:2px 0 4px}
.au .ap{width:38px;height:38px;border-radius:50%;flex:none;display:grid;place-items:center;background:rgba(255,255,255,.22);color:inherit}
.au .ap .ic{width:18px;height:18px;fill:currentColor;stroke:none}
.au .ab{flex:1;height:5px;border-radius:5px;background:rgba(255,255,255,.28);overflow:hidden;cursor:pointer;direction:ltr;padding:0}
.au .ab i{display:block;height:100%;width:0;background:currentColor;border-radius:5px}
.au .at{font-size:12px;min-width:34px;text-align:left;font-variant-numeric:tabular-nums;opacity:.85}
.au audio{display:none}
.fl{display:flex;align-items:center;gap:10px;min-width:200px;max-width:100%;color:inherit;text-decoration:none;padding:2px 0 4px}
.fl i{width:44px;height:44px;border-radius:12px;flex:none;display:grid;place-items:center;background:rgba(255,255,255,.2)}
.fl i .ic{width:22px;height:22px}
.fl span{display:flex;flex-direction:column;min-width:0}
.fl b{font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;direction:ltr;text-align:right}
.fl small{font-size:11.5px;opacity:.8}
.mt.stk{font-size:46px;line-height:1.25;padding:2px 6px}
.emo{display:block!important;width:100%;flex:none;direction:rtl}
.emo .et{display:flex!important;flex-direction:row;gap:8px;margin:0 0 12px;height:auto!important;align-items:stretch}
.emo .et button{flex:1;height:42px!important;min-height:0;padding:0 8px;border-radius:21px;background:var(--chip);font-weight:800;font-size:14px;color:var(--muted);border:1px solid var(--line)}
.emo .et button.on{background:linear-gradient(135deg,#0E7C66,#14A585);color:#fff;border-color:transparent}
.emo .eg{display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr));gap:2px;width:100%;max-height:50vh;overflow-y:auto;overflow-x:hidden}
.emo .eg button{font-size:27px;line-height:1;height:46px;padding:0;border-radius:12px;background:none;display:grid;place-items:center}
.emo .eg button:active{background:var(--chip)}
.emo .eg.sg{grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}
.emo .eg.sg button{height:84px;background:var(--chip);padding:6px}
.emo .eg.sg .st-add{font-size:36px;font-weight:300;color:var(--primary-2);background:none;border:2px dashed var(--primary-2)}
.emo .eg.sg img{width:100%;height:100%;object-fit:contain;pointer-events:none}
.st-n{grid-column:1/-1;text-align:center;color:var(--muted);font-size:13px;padding:14px 0}
.bb.stkb{background:none!important;box-shadow:none!important;padding:0!important;border:0!important}
.bb.stkb .mi{opacity:.75;justify-content:flex-end}
.sk-i{display:block;width:150px;height:150px;object-fit:contain}
.bb{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}
.qt{border-inline-start:3px solid #14A585;padding:4px 9px;margin:0 0 6px;border-radius:9px;background:rgba(127,127,127,.18);font-size:12.5px;cursor:pointer;max-width:100%}
.qt b{display:block;font-weight:800;color:#14A585}
.qt span{display:block;opacity:.85;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.me .qt b{color:#D9FFF1}
.fw{font-size:11.5px;opacity:.75;margin-bottom:3px;font-weight:700}
.bb.del{opacity:.65;font-style:italic}
.msg.flash .bb{animation:flashB 1.8s}
@keyframes flashB{0%,70%{box-shadow:0 0 0 3px rgba(229,181,61,.95)}100%{box-shadow:var(--shadow)}}
.ctx{display:flex;align-items:center;gap:10px;padding:8px 14px;border-top:1px solid var(--line);background:var(--card)}
.ctx[hidden]{display:none}
.ctx .cb{flex:1;min-width:0;border-inline-start:3px solid #14A585;padding-inline-start:9px}
.ctx b{display:block;font-size:12.5px;color:#14A585}
.ctx span{display:block;font-size:13px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ctx button{width:32px;height:32px;border-radius:50%;background:var(--chip);display:grid;place-items:center;flex:none}
.ctx button .ic{width:16px;height:16px}
.chat-head .who{flex:1;min-width:0}
.p-sub.typing{color:#14A585;font-weight:700}
.tk{opacity:.7}
.tk.seen{opacity:1;color:#7FE8FF}
.csr{display:block;width:100%;text-align:start;padding:11px 4px;border-bottom:1px solid var(--line)}
.csr small{display:block;color:var(--muted);margin-top:2px}
.csr mark{background:rgba(229,181,61,.4);color:inherit;border-radius:3px;padding:0 2px}
.cs-in{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:16px;background:var(--chip);margin-bottom:8px}
.cs-in input{flex:1;background:none;border:0;outline:0;color:inherit;font:inherit;min-width:0}
.cs-in .ic{width:18px;height:18px;color:var(--muted)}`;
  document.head.appendChild(cst);

  // ضغطة مطوّلة (للقوائم)
  function longPress(root, sel, cb) {
    let t = null, sx = 0, sy = 0, fired = false;
    const clear = () => { clearTimeout(t); t = null; };
    root.addEventListener('pointerdown', e => {
      const el = e.target.closest(sel);
      if (!el) return;
      fired = false; sx = e.clientX; sy = e.clientY;
      t = setTimeout(() => { fired = true; t = null; if (navigator.vibrate) navigator.vibrate(15); cb(el); }, 480);
    });
    root.addEventListener('pointermove', e => { if (t && (Math.abs(e.clientX - sx) > 9 || Math.abs(e.clientY - sy) > 9)) clear(); });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => root.addEventListener(ev, clear));
    root.addEventListener('click', e => { if (fired) { e.stopPropagation(); e.preventDefault(); fired = false; } }, true);
    root.addEventListener('contextmenu', e => { if (e.target.closest(sel)) e.preventDefault(); });
  }
  const setPrefs = (cid, patch) => A.sb.from('conversation_members').update(patch).eq('conversation_id', cid).eq('user_id', me().id);
  const escLike = x => x.replace(/[\\%_]/g, '\\$&');
  const hl = (txt, k) => { const e = A.esc(txt), i = txt.toLowerCase().indexOf(k.toLowerCase()); if (i < 0 || A.esc(k) !== k) return e; return A.esc(txt.slice(0, i)) + '<mark>' + A.esc(txt.slice(i, i + k.length)) + '</mark>' + A.esc(txt.slice(i + k.length)); };

  const PAGE = 40, MAX_VID = 50 * 1024 * 1024, MAX_IMG = 15 * 1024 * 1024;
  const MSEL = 'id,conversation_id,sender_id,content,media_url,media_type,created_at,reply_to,edited_at,deleted_at,forwarded,media_name,media_size,media_dur,msg_kind,poll_options,ends_at';
  const T = iso => new Date(iso).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' });
  const dk = iso => new Date(iso).toDateString();
  const dayLabel = iso => {
    const d = new Date(iso), n = new Date(), y = new Date(n); y.setDate(n.getDate() - 1);
    return d.toDateString() === n.toDateString() ? 'اليوم' : d.toDateString() === y.toDateString() ? 'أمس'
      : d.toLocaleDateString('ar-IQ', { day: 'numeric', month: 'long' });
  };
  const EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov', 'audio/webm': 'webm', 'audio/ogg': 'ogg', 'audio/mp4': 'm4a', 'audio/mpeg': 'mp3', 'audio/aac': 'aac', 'audio/wav': 'wav' };
  const OKMIME = new Set(['application/pdf', 'application/zip', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/plain']);
  const EMO_ONLY = /^(?:\p{Extended_Pictographic}(?:\u200d\p{Extended_Pictographic}|\ufe0f|\p{Emoji_Modifier})*\s*){1,3}$/u;
  const fsize = n => n >= 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round((n || 0) / 1024)) + ' KB';
  const mmss = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const mlabel = t => t === 'video' ? 'فيديو' : t === 'sticker' ? 'ملصق' : t === 'audio' ? 'رسالة صوتية' : t === 'file' ? 'ملف' : 'صورة';
  const micon = t => t === 'video' ? 'video' : t === 'sticker' ? 'smile' : t === 'audio' ? 'mic' : t === 'file' ? 'file' : 'image';
  const pic = n => `<i class="pvi">${A.icon(n)}</i>`;
  const EMOJI = '😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 😉 😍 🥰 😘 😋 😜 🤪 😎 🤩 🥳 😏 😒 😞 😔 😢 😭 😤 😡 🤬 😱 😨 😰 🤗 🤔 🤭 🤫 😶 😐 🙄 😴 🤤 😷 🤒 🤕 🥵 🥶 😵 🤯 🤠 😈 💀 👻 🤖 💩 👍 👎 👏 🙌 🙏 💪 ✌️ 🤞 🤟 👌 🤝 ✋ 👋 ❤️ 🧡 💛 💚 💙 💜 🖤 🤍 💔 💕 💖 💯 🔥 ✨ ⭐ 🎉 🎊 🎁 🌹 🌸 ☀️ 🌙 ☕ 🍽️ 🍗 🍕 🍉 🇮🇶 🕌 🌴 ⚽ 🎮'.split(' ');

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

  A.startChat = async uid => {
    const { data, error } = await A.sb.rpc('start_conversation', { other: uid });
    if (error || !data) return A.toast('لا يمكن بدء المحادثة مع هذا الحساب', 'err');
    location.hash = '#/chat/' + data;
  };

  /* ============ قائمة المحادثات ============ */
  A.pages.chats = {
    render(view) {
      let list = [], t;
      view.innerHTML = `<div class="ch-top"><button class="icon-btn" id="ch-back" aria-label="رجوع">${A.icon('arrow')}</button><div class="sec-title" style="margin:0">الرسائل</div><button class="gnew" id="ch-new">${A.icon('plus')}جديد</button></div>
        <div id="ch-users"></div><div id="ch-list"><div class="sk" style="height:64px;margin-bottom:8px"></div><div class="sk" style="height:64px"></div></div>`;
      const q = s => view.querySelector(s);
      q('#ch-back').onclick = () => { location.hash = '#/home'; };
      q('#ch-new').onclick = () => (A.newChat ? A.newChat() : A.createGroup && A.createGroup());

      const preview = c => {
        const pre = c.last_sender === me().id ? 'أنت: ' : (c.is_group && c.last_sender_name ? A.esc(c.last_sender_name) + ': ' : '');
        if (c.last_content === '') return pre + pic('blk') + 'رسالة محذوفة';
        if (c.is_channel && !c.last_content && !c.last_media_type) return pic('megaphone') + 'قناة';
        if (!c.last_at || (!c.last_content && !c.last_media_type)) return 'ابدأ المحادثة';
        return pre + (c.last_media_type ? pic(micon(c.last_media_type)) + mlabel(c.last_media_type) : A.esc(c.last_content));
      };
      function paint() {
        const s = '';
        const rows = list.filter(c => !s || [c.other_name, c.other_username, c.last_content].some(x => (x || '').toLowerCase().includes(s)));
        q('#ch-list').innerHTML = rows.length ? rows.map(c => {
          const u = { display_name: c.other_name, username: c.other_username, avatar_url: c.other_avatar };
          return `<button class="cv ${c.unread ? 'un' : ''}" data-cid="${c.conv_id}">${A.avatar(u, 50)}
            <div class="cv-b"><div class="l1"><b>${c.is_channel ? pic('megaphone') : c.is_group ? pic('users') : ''}${A.esc(c.other_name || c.other_username || 'مستخدم')}${c.other_verified ? A.verified : ''}${A.catBadge(c.other_cat, 15)}${c.pinned_at ? ' ' + pic('pinI') : ''}${c.muted ? ' ' + pic('mute') : ''}</b><span class="p-sub">${(c.last_content != null || c.last_media_type) ? A.timeAgo(c.last_at) : ''}</span></div>
            <div class="l2"><span>${preview(c)}</span>${c.unread ? `<span class="cv-n">${c.unread}</span>` : ''}</div></div></button>`;
        }).join('') : `<div class="empty">${list.length ? 'لا توجد نتائج' : 'لا توجد محادثات بعد.<br>افتح بروفايل أي حساب واضغط «مراسلة»'}</div>`;
      }
      async function load() {
        const { data, error } = await A.sb.rpc('my_conversations');
        if (error) { q('#ch-list').innerHTML = '<div class="empty">تعذر تحميل المحادثات<br><button class="btn sm" id="ch-retry">إعادة المحاولة</button></div>'; q('#ch-retry').onclick = load; return; }
        list = data || [];
        const gr = await A.sb.rpc('my_groups');
        (gr.data || []).forEach(g => list.push({ conv_id: g.conv_id, is_group: true, last_at: g.last_at, last_content: g.last_content, last_media_type: g.last_media_type, last_sender: g.last_sender, last_sender_name: g.last_sender_name, unread: g.unread, other_name: g.name, other_avatar: g.avatar_url, other_verified: false }));
        const cr = await A.sb.rpc('my_channels');
        (cr.data || []).forEach(g => list.push({ conv_id: g.id, is_channel: true, last_at: g.last_at, last_content: g.last_content, last_media_type: g.last_media_type, last_sender: null, unread: g.unread, other_name: g.name, other_avatar: g.avatar_url, other_verified: false }));
        list.sort((a, b) => new Date(b.last_at || 0) - new Date(a.last_at || 0));
        const mm = await A.sb.from('conversation_members').select('conversation_id,pinned_at,muted').eq('user_id', me().id);
        const mp = {}; (mm.data || []).forEach(x => { mp[x.conversation_id] = x; });
        list.forEach(c => { const x = mp[c.conv_id] || {}; c.pinned_at = x.pinned_at || null; c.muted = !!x.muted; });
        const oids = [...new Set(list.filter(c => c.other_id).map(c => c.other_id))];
        if (oids.length) {
          const pc = await A.sb.from('profiles').select('id,category').in('id', oids);
          const cm = {}; (pc.data || []).forEach(x => { cm[x.id] = x.category; });
          list.forEach(c => { if (c.other_id) c.other_cat = cm[c.other_id] || null; });
        }
        list.sort((a, b) => (b.pinned_at ? 1 : 0) - (a.pinned_at ? 1 : 0) || (a.pinned_at && b.pinned_at ? new Date(b.pinned_at) - new Date(a.pinned_at) : 0));
        paint();
      }
      async function findUsers() {
        const s = q('#ch-q').value.trim(), box = q('#ch-users');
        if (s.length < 2) { box.innerHTML = ''; return; }
        const esc = s.replace(/[\\%_]/g, '\\$&');
        const cols = 'id,username,display_name,avatar_url,is_verified,category';
        const [a, b] = await Promise.all([
          A.sb.from('profiles').select(cols).ilike('username', esc + '%').eq('is_banned', false).limit(5),
          A.sb.from('profiles').select(cols).ilike('display_name', '%' + esc + '%').eq('is_banned', false).limit(5)
        ]);
        if (q('#ch-q').value.trim() !== s) return;
        const seen = new Set(), rows = [...(a.data || []), ...(b.data || [])].filter(u => u.id !== me().id && !seen.has(u.id) && seen.add(u.id));
        box.innerHTML = rows.length ? `<div class="sec-title">ابدأ محادثة مع</div>` + rows.map(u =>
          `<button class="cv" data-start="${u.id}">${A.avatar(u, 44)}<div class="cv-b"><b>${A.esc(u.display_name || u.username)}${u.is_verified ? A.verified : ''}${A.catBadge(u.category, 15)}</b><div class="p-sub">@${A.esc(u.username)}</div></div></button>`).join('') : '';
      }
      longPress(view, '.cv[data-cid]', el => {
        const c = list.find(x => x.conv_id === el.dataset.cid);
        if (!c || c.is_channel) return;
        const sh = A.sheet(`<h3>${A.esc(c.other_name || c.other_username || 'محادثة')}</h3>
          <button class="opt" data-k="pin">${A.icon('pinI')}<div>${c.pinned_at ? 'إلغاء تثبيت المحادثة' : 'تثبيت المحادثة'}</div></button>
          <button class="opt" data-k="mute">${A.icon(c.muted ? 'bell' : 'mute')}<div>${c.muted ? 'إلغاء كتم الإشعارات' : 'كتم الإشعارات'}</div></button>`);
        sh.el.onclick = async e => {
          const b = e.target.closest('[data-k]'); if (!b) return;
          sh.close();
          if (b.dataset.k === 'pin') {
            const v = c.pinned_at ? null : new Date().toISOString();
            if (v && list.filter(x => x.pinned_at).length >= 3) return A.toast('يمكنك تثبيت 3 محادثات كحد أقصى', 'err');
            const { error } = await setPrefs(c.conv_id, { pinned_at: v });
            if (error) return A.toast('تعذر التنفيذ', 'err');
            load();
          } else {
            const { error } = await setPrefs(c.conv_id, { muted: !c.muted });
            if (error) return A.toast('تعذر التنفيذ', 'err');
            A.toast(c.muted ? 'تم إلغاء الكتم' : 'تم كتم الإشعارات', 'ok'); load();
          }
        };
      });
      view.onclick = e => {
        const c = e.target.closest('[data-cid]'), u = e.target.closest('[data-start]');
        if (c) { const it = list.find(x => x.conv_id === c.dataset.cid); location.hash = (it && it.is_channel ? '#/c/' : '#/chat/') + c.dataset.cid; }
        else if (u) A.startChat(u.dataset.start);
      };
      let d;
      const reload = () => { clearTimeout(d); d = setTimeout(load, 300); };
      R.on('message', () => { if (!view.isConnected) return false; reload(); });
      R.on('resume', () => { if (!view.isConnected) return false; reload(); });
      load();
    },
    refresh() { const v = document.getElementById('view'); if (v) A.pages.chats.render(v); }
  };

  /* ============ شاشة المحادثة ============ */
  A.pages.chat = {
    async render(view, cid) {
      view.innerHTML = `<div class="chat">
        <div class="chat-head"><button class="icon-btn" id="c-back" aria-label="رجوع">${A.icon('arrow')}</button><button class="who" id="c-who"><div class="sk" style="width:40px;height:40px;border-radius:50%"></div></button><button class="icon-btn" id="c-menu" aria-label="المزيد">${A.icon('more')}</button></div>
        <button class="pinbar" id="c-pin" hidden></button>
        <div class="chat-body" id="c-body"><div class="empty">جاري التحميل...</div></div>
        <div class="ctx" id="c-ctx" hidden></div>
        <div class="chat-bar"><button class="icon-btn" id="c-att" aria-label="إرفاق">${A.icon('clip')}</button>
          <textarea id="c-ta" rows="1" maxlength="4000" placeholder="اكتب رسالة..."></textarea>
          <button class="icon-btn" id="c-emo" aria-label="إيموجي">${A.icon('smile')}</button><button class="cm-send" id="c-send" aria-label="إرسال" hidden>${A.icon('send')}</button><button class="cm-send" id="c-mic" aria-label="تسجيل صوتي">${A.icon('mic')}</button>
          <div class="rec" id="c-rec" hidden><button class="icon-btn" id="rc-x" aria-label="إلغاء">${A.icon('trash')}</button><span class="rd"></span><b id="rc-t">0:00</b><span class="rw">${A.eq(7)}</span><button class="cm-send" id="rc-s" aria-label="إرسال">${A.icon('send')}</button></div></div>
        <input type="file" id="f-img" accept="image/*" multiple hidden><input type="file" id="f-vid" accept="video/*" hidden>
        <input type="file" id="f-doc" hidden><input type="file" id="f-cam" accept="image/*" capture="environment" hidden></div>`;
      const root = view.querySelector('.chat'), q = s => root.querySelector(s);
      const body = q('#c-body'), ta = q('#c-ta');
      const C = { msgs: [], ids: new Set(), otherRead: null, more: false, urls: {}, stick: true, ch: null, otherDel: null, extra: {}, reply: null, edit: null, pinned: false, muted: false };
      R.openConv = cid;

      // تكيّف مع لوحة المفاتيح
      const vv = window.visualViewport;
      const fit = () => {
        if (!root.isConnected) return stop();
        root.style.height = vv.height + 'px'; root.style.top = vv.offsetTop + 'px';
        if (C.stick) body.scrollTop = body.scrollHeight;
      };
      const stop = () => {
        if (vv) { vv.removeEventListener('resize', fit); vv.removeEventListener('scroll', fit); }
        if (R.openConv === cid) R.openConv = null;
        if (C.ch) { A.sb.removeChannel(C.ch); C.ch = null; }
        if (C.recStop) C.recStop();
        window.removeEventListener('hashchange', onHash);
      };
      const onHash = () => { if (!root.isConnected) stop(); };
      if (vv) { vv.addEventListener('resize', fit); vv.addEventListener('scroll', fit); fit(); }
      window.addEventListener('hashchange', onHash);
      q('#c-back').onclick = () => { history.length > 1 ? history.back() : (location.hash = '#/chats'); };

      const ci = await A.sb.from('conversations').select('is_group,name,avatar_url,description,only_admins_send,pinned_msgs').eq('id', cid).maybeSingle();
      const G = ci.data && ci.data.is_group ? { info: ci.data, mem: {}, role: null } : null;
      const [o, ms, mine0] = await Promise.all([
        G ? A.sb.from('conversation_members').select('user_id,role,silenced,user:profiles!conversation_members_user_id_fkey(id,username,display_name,avatar_url,is_verified)').eq('conversation_id', cid)
        : A.sb.from('conversation_members').select('last_read_at,last_delivered_at,user:profiles!conversation_members_user_id_fkey(id,username,display_name,avatar_url,is_verified)')
          .eq('conversation_id', cid).neq('user_id', me().id).limit(1).maybeSingle(),
        A.sb.from('messages').select(MSEL).eq('conversation_id', cid).order('created_at', { ascending: false }).limit(PAGE),
        A.sb.from('conversation_members').select('pinned_at,muted').eq('conversation_id', cid).eq('user_id', me().id).maybeSingle()
      ]);
      C.pinned = !!(mine0.data && mine0.data.pinned_at); C.muted = !!(mine0.data && mine0.data.muted);
      if (o.error || !o.data || ms.error) { body.innerHTML = '<div class="empty">هذه المحادثة غير متاحة</div>'; return; }
      let other;
      if (G) {
        (o.data || []).forEach(x => { G.mem[x.user_id] = Object.assign({}, x.user, { role: x.role }); });
        G.role = (G.mem[me().id] || {}).role; G.silenced = !!(G.mem[me().id] || {}).silenced;
        if (!G.role) { body.innerHTML = '<div class="empty">لست عضواً في هذه المجموعة</div>'; return; }
        other = { id: null, username: '', display_name: G.info.name, avatar_url: G.info.avatar_url, is_verified: false };
      } else {
        other = o.data.user;
        C.otherRead = new Date(o.data.last_read_at);
        C.otherDel = o.data.last_delivered_at ? new Date(o.data.last_delivered_at) : null;
      }
      const cbar = q('.chat-bar'), cnote = document.createElement('div');
      cnote.className = 'p-sub'; cnote.style.cssText = 'text-align:center;padding:14px;border-top:1px solid var(--line)'; cbar.after(cnote);
      function applyLock() {
        const lock = !!G && (G.silenced || (G.info.only_admins_send && G.role === 'member'));
        cbar.style.display = lock ? 'none' : ''; cnote.style.display = lock ? '' : 'none';
        if (lock) cnote.textContent = G.silenced ? 'تم كتمك من قبل مشرف، لا يمكنك الإرسال' : 'المشرفون فقط يستطيعون الإرسال في هذه المجموعة';
      }
      applyLock();
      const sname = id => { const x = G.mem[id]; return x ? (x.display_name || x.username) : 'عضو'; };
      const hue = id => [...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
      async function loadSenders(list) {
        if (!G) return false;
        const need = [...new Set(list.map(m => m.sender_id))].filter(id => id && !G.mem[id]);
        if (!need.length) return false;
        const { data } = await A.sb.from('profiles').select('id,username,display_name,avatar_url,is_verified').in('id', need);
        (data || []).forEach(p => { G.mem[p.id] = Object.assign({}, p, { role: null }); });
        return !!(data && data.length);
      }
      C.msgs = ms.data.reverse(); C.msgs.forEach(m => C.ids.add(m.id)); C.more = ms.data.length === PAGE;
      q('#c-who').innerHTML = `${A.avatar(other, 40)}<div style="min-width:0"><div class="p-name">${A.esc(other.display_name || other.username)}${other.is_verified ? A.verified : ''}</div><div class="p-sub" id="c-st">${G ? Object.keys(G.mem).length + ' عضو' : ''}</div></div>`;
      q('#c-who').onclick = () => { if (G) A.groupInfo(cid); else location.hash = '#/u/' + encodeURIComponent(other.username); };

      const tst = iso => { const t = new Date(iso); return C.otherRead && t <= C.otherRead ? 2 : C.otherDel && t <= C.otherDel ? 1 : 0; };
      const seen = m => tst(m.created_at) === 2;
      const dlvd = m => tst(m.created_at) >= 1;
      const getMsg = id => C.msgs.find(x => x.id === id) || C.extra[id];
      const qtxt = r => !r ? 'رسالة' : r.deleted_at ? 'رسالة محذوفة' : r.msg_kind === 'poll' ? 'استطلاع: ' + (r.content || '') : r.content ? r.content : mlabel(r.media_type);
      const qwho = r => r ? (r.sender_id === me().id ? 'أنت' : G ? sname(r.sender_id) : (other.display_name || other.username)) : '';
      C.pv = {};
      const pollHTML = m => {
        const opts = m.poll_options || [], r = C.pv[m.id] || { counts: [], mine: null, total: 0 }, show = r.mine != null || m.sender_id === me().id;
        return `<div class="pl"><div class="pl-h">${A.icon('chart')}استطلاع رأي</div><div class="pl-q">${A.esc(m.content || '')}</div>${opts.map((o, i) => {
          const n = r.counts[i] || 0, pc = r.total ? Math.round(n / r.total * 100) : 0;
          return show ? `<div class="pl-r${r.mine === i ? ' me' : ''}"><i style="width:${pc}%"></i><span>${A.esc(o)}</span><b>${pc}%</b></div>` : `<button class="pl-o" data-pv="${i}">${A.esc(o)}</button>`;
        }).join('')}<div class="pl-t">${r.total} صوت${!show ? ' · صوّت لتشاهد النتائج' : ''}</div></div>`;
      };
      const topicEnd = m => { if (!m.ends_at) return ''; const ms = new Date(m.ends_at) - Date.now(); if (ms <= 0) return 'انتهى النقاش'; const h = Math.floor(ms / 3600e3); return h >= 1 ? `ينتهي بعد ${h} ساعة` : `ينتهي بعد ${Math.max(1, Math.round(ms / 60e3))} دقيقة`; };
      const topicHTML = m => `<div class="tp"><div class="tp-l">${A.icon('comment')}موضوع للنقاش</div><div class="tp-t">${A.esc(m.content || '')}</div><div class="tp-e">${topicEnd(m)}</div>${m.ends_at && new Date(m.ends_at) > new Date() ? `<button class="tp-r" data-tr>${A.icon('rply')} شارك رداً</button>` : ''}</div>`;
      async function loadPolls() {
        const ids = C.msgs.filter(m => m.msg_kind === 'poll' && !m._pending && !m.deleted_at).map(m => m.id);
        if (!ids.length) return [];
        const { data } = await A.sb.rpc('group_poll_results', { mids: ids });
        ids.forEach(id => { C.pv[id] = { counts: [], mine: null, total: 0 }; });
        (data || []).forEach(x => { const r = C.pv[x.message_id]; r.counts[x.idx] = Number(x.n); r.total += Number(x.n); if (x.mine) r.mine = x.idx; });
        return ids;
      }
      function msgHTML(m, prevDay) {
        const mine = m.sender_id === me().id;
        const sep = dk(m.created_at) !== prevDay ? `<div class="day">${dayLabel(m.created_at)}</div>` : '';
        if (m.deleted_at) return `${sep}<div class="msg ${mine ? 'me' : 'ot'}" data-id="${m.id}"><div class="bb del"><div class="mt">${pic('blk')}تم حذف هذه الرسالة</div><div class="mi"><span>${T(m.created_at)}</span></div></div></div>`;
        let media = '';
        if (m.media_type === 'audio') {
          const src = m._local ? ` src="${m._local}"` : '';
          media = `<div class="au" data-dur="${m.media_dur || 0}"><button class="ap" aria-label="تشغيل">${A.icon('play')}</button><div class="ab"><i></i></div><span class="at">${mmss(m.media_dur || 0)}</span><audio preload="metadata"${src} data-path="${A.esc(m.media_url || '')}"></audio></div>`;
        } else if (m.media_type === 'file') {
          const nm = m.media_name || 'ملف';
          media = `<a class="fl" target="_blank" rel="noopener" download="${A.esc(nm)}"${m._local ? ` href="${m._local}"` : ''} data-path="${A.esc(m.media_url || '')}"><i>${A.icon('file')}</i><span><b>${A.esc(nm)}</b><small>${fsize(m.media_size)} · ${A.esc((nm.split('.').pop() || '').toUpperCase().slice(0, 5))}</small></span></a>`;
        } else if (m.media_type === 'sticker') {
          media = `<img class="sk-i" alt="" src="${A.esc(m.media_url || '')}">`;
        } else if (m.media_type) {
          const src = m._local ? ` src="${m._local}"` : '';
          media = `<div class="mm">${m.media_type === 'video'
            ? `<video controls playsinline preload="metadata"${src} data-path="${A.esc(m.media_url || '')}"></video>`
            : `<img alt=""${src} data-path="${A.esc(m.media_url || '')}">`}</div>`;
        }
        const tk = mine ? `<span class="tk ${seen(m) ? 'seen' : ''}" data-t="${m.created_at}"${m._pending ? ' data-p="1"' : ''}>${m._pending ? pic('clock') : dlvd(m) ? '✓✓' : '✓'}</span>` : '';
        const r = m.reply_to ? getMsg(m.reply_to) : null;
        const rp = m.reply_to ? `<div class="qt" data-q="${m.reply_to}"><b>${A.esc(qwho(r))}</b><span>${A.esc(qtxt(r).slice(0, 90))}</span></div>` : '';
        const sn = G && !mine ? `<div class="sn" style="color:hsl(${hue(m.sender_id)} 70% 65%)">${A.esc(sname(m.sender_id))}</div>` : '';
        const fw = m.forwarded ? '<div class="fw">↪ مُعاد توجيهها</div>' : '';
        return `${sep}<div class="msg ${mine ? 'me' : 'ot'}" data-id="${m.id}"><div class="bb${m.media_type === 'sticker' ? ' stkb' : ''}">${sn}${fw}${rp}${media}${m.msg_kind === 'poll' ? pollHTML(m) : m.msg_kind === 'topic' ? topicHTML(m) : m.content ? `<div class="mt${!m.media_type && EMO_ONLY.test(m.content.trim()) ? ' stk' : ''}">${A.esc(m.content)}</div>` : ''}<div class="mi"><span>${m.edited_at ? 'معدّلة · ' : ''}${T(m.created_at)}</span>${tk}</div></div></div>`;
      }
      function rerender(m) {
        const node = body.querySelector(`.msg[data-id="${m.id}"]`);
        if (!node) return;
        const t = document.createElement('div');
        t.innerHTML = msgHTML(m, dk(m.created_at));
        node.replaceWith(t.firstElementChild);
        sign();
      }
      async function loadQuotes(list) {
        const ids = [...new Set(list.map(x => x.reply_to).filter(id => id && !getMsg(id)))];
        if (!ids.length) return;
        const { data } = await A.sb.from('messages').select(MSEL).in('id', ids);
        (data || []).forEach(x => { C.extra[x.id] = x; });
        body.querySelectorAll('.qt').forEach(el => {
          const r = getMsg(el.dataset.q); if (!r) return;
          el.innerHTML = `<b>${A.esc(qwho(r))}</b><span>${A.esc(qtxt(r).slice(0, 90))}</span>`;
        });
      }
      async function sign() {
        const need = [...new Set([...body.querySelectorAll('[data-path]')].map(e => e.dataset.path))].filter(p => p && !C.urls[p]);
        if (need.length) {
          const { data } = await A.sb.storage.from('chat').createSignedUrls(need, 3600);
          (data || []).forEach(x => { if (x.signedUrl) C.urls[x.path] = x.signedUrl; });
        }
        body.querySelectorAll('[data-path]').forEach(el => { const u = C.urls[el.dataset.path]; if (!u) return; if (el.tagName === 'A') { if (el.getAttribute('href') !== u) el.href = u; } else if (el.getAttribute('src') !== u) el.src = u; });
      }
      const toBottom = () => { body.scrollTop = body.scrollHeight; };
      function renderAll() {
        let prev = null;
        body.innerHTML = (C.more ? '<button class="btn ghost sm more-old" id="c-old">تحميل رسائل أقدم</button>' : '') +
          (C.msgs.length ? C.msgs.map(m => { const h = msgHTML(m, prev); prev = dk(m.created_at); return h; }).join('') : '<div class="empty">ابدأ المحادثة بإرسال رسالة</div>');
        sign();
      }
      function append(m) {
        const e = body.querySelector('.empty'); if (e) e.remove();
        const p = C.msgs[C.msgs.length - 2];
        body.insertAdjacentHTML('beforeend', msgHTML(m, p ? dk(p.created_at) : null));
        sign();
      }
      function ticks() {
        body.querySelectorAll('.msg.me .tk:not([data-p])').forEach(el => {
          const s = tst(el.dataset.t);
          el.textContent = s ? '✓✓' : '✓'; el.classList.toggle('seen', s === 2);
        });
      }
      const markRead = () => A.sb.rpc('mark_conversation_read', { cid }).then(() => R.refresh());

      await loadQuotes(C.msgs);
      await loadSenders(C.msgs); await loadPolls(); renderAll(); toBottom(); markRead();
      const isAdm = () => !!G && (G.role === 'owner' || G.role === 'admin');
      async function renderPins() {
        const bar = q('#c-pin'); if (!G) return;
        const ids = G.info.pinned_msgs || [];
        if (!ids.length) { bar.hidden = true; return; }
        const miss = ids.filter(id => !getMsg(id));
        if (miss.length) { const { data } = await A.sb.from('messages').select(MSEL).in('id', miss); (data || []).forEach(x => { C.extra[x.id] = x; }); await loadSenders(data || []); }
        G.pi = Math.max(0, Math.min(G.pi == null ? ids.length - 1 : G.pi, ids.length - 1));
        const m = getMsg(ids[G.pi]);
        bar.hidden = false;
        bar.innerHTML = `<span class="pi">${A.icon('pinI')}</span><div><b>رسالة مثبتة${ids.length > 1 ? ` (${G.pi + 1}/${ids.length})` : ''}</b><span>${A.esc(m && !m.deleted_at ? qtxt(m).slice(0, 80) : 'رسالة')}</span></div>`;
      }
      async function refreshG() {
        if (!G || !root.isConnected) return;
        const [c, mm] = await Promise.all([
          A.sb.from('conversations').select('name,avatar_url,only_admins_send,pinned_msgs').eq('id', cid).maybeSingle(),
          A.sb.from('conversation_members').select('role,silenced').eq('conversation_id', cid).eq('user_id', me().id).maybeSingle()
        ]);
        if (c.data) Object.assign(G.info, c.data);
        if (mm.data) { G.role = mm.data.role; G.silenced = !!mm.data.silenced; }
        applyLock(); renderPins();
        loadPolls().then(ids => (ids || []).forEach(id => { const x = getMsg(id); if (x) rerender(x); }));
      }
      q('#c-pin').onclick = () => {
        const ids = G.info.pinned_msgs || []; if (!ids.length) return;
        jumpTo(ids[G.pi]); G.pi = (G.pi - 1 + ids.length) % ids.length; renderPins();
      };
      if (G) { renderPins(); const gt = setInterval(() => { if (!root.isConnected) return clearInterval(gt); refreshG(); }, 15000); }
      body.onscroll = () => { C.stick = body.scrollHeight - body.scrollTop - body.clientHeight < 150; };
      body.addEventListener('load', () => { if (C.stick) toBottom(); }, true);
      body.addEventListener('loadedmetadata', () => { if (C.stick) toBottom(); }, true);

      body.onclick = async e => {
        if (!e.target.closest('#c-old')) return;
        const first = C.msgs[0];
        const { data } = await A.sb.from('messages').select(MSEL).eq('conversation_id', cid).lt('created_at', first.created_at).order('created_at', { ascending: false }).limit(PAGE);
        if (!data) return;
        const h = body.scrollHeight;
        data.reverse().forEach(m => C.ids.add(m.id));
        C.msgs = [...data, ...C.msgs]; C.more = data.length === PAGE;
        await loadQuotes(data);
        renderAll(); body.scrollTop = body.scrollHeight - h;
      };

      async function loadNewer() {
        const last = C.msgs[C.msgs.length - 1];
        let qy = A.sb.from('messages').select(MSEL).eq('conversation_id', cid).order('created_at', { ascending: true }).limit(100);
        if (last) qy = qy.gt('created_at', last.created_at);
        const { data } = await qy;
        (data || []).forEach(m => { if (C.ids.has(m.id)) return; C.ids.add(m.id); C.msgs.push(m); append(m); });
        if (data) loadQuotes(data);
        if (data && data.length) { markRead(); if (C.stick) toBottom(); }
      }

      async function post({ content, file, type, meta, extra }) {
        meta = meta || {};
        const id = crypto.randomUUID();
        const rp = C.reply ? C.reply.id : null; clearCtx();
        const m = { id, sender_id: me().id, content: content || null, media_url: null, media_type: type || null, reply_to: rp, created_at: new Date().toISOString(), _pending: true, _local: file ? URL.createObjectURL(file) : null, ...(extra || {}), media_name: meta.name || null, media_size: meta.size || null, media_dur: meta.dur || null };
        C.ids.add(id); C.msgs.push(m); append(m); toBottom();
        try {
          let path = type === 'sticker' ? meta.url : null;
          if (file) {
            const f = type === 'image' ? await compress(file) : file;
            let ft = (f.type || file.type || '').split(';')[0];
            let ext = EXT[ft];
            if (type === 'file') { ext = ((meta.name || '').split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 8) || 'bin'; if (!OKMIME.has(ft)) ft = 'application/octet-stream'; }
            path = `${cid}/${me().id}_${Date.now()}.${ext || 'bin'}`;
            const { error } = await A.sb.storage.from('chat').upload(path, f, { contentType: ft, upsert: false });
            if (error) throw error;
          }
          const { data, error } = await A.sb.from('messages').insert({ id, conversation_id: cid, sender_id: me().id, content: content || null, media_url: path, media_type: type || null, reply_to: rp, media_name: meta.name || null, media_size: meta.size || null, media_dur: meta.dur || null, ...(extra || {}) }).select('created_at').single();
          if (error) throw error;
          m._pending = false; m.created_at = data.created_at; m.media_url = path;
          const tk = body.querySelector(`.msg[data-id="${id}"] .tk`);
          if (tk) { tk.removeAttribute('data-p'); tk.dataset.t = data.created_at; }
          ticks();
        } catch (e) {
          console.error(e);
          C.ids.delete(id); C.msgs = C.msgs.filter(x => x.id !== id);
          const node = body.querySelector(`.msg[data-id="${id}"]`); if (node) node.remove();
          if (content) ta.value = content;
          A.toast(/row-level|policy/i.test((e && e.message) || '') ? 'لا يمكن إرسال الرسالة إلى هذا الحساب' : 'تعذر إرسال الرسالة', 'err');
        }
      }

      /* ---- حالة الاتصال / آخر ظهور / الكتابة الآن ---- */
      const stEl = G ? null : q('#c-st');
      let pres = null, typingUntil = 0, inChat = false;
      const fmtSeen = d => {
        const n = new Date(), y = new Date(n); y.setDate(n.getDate() - 1);
        if (d.toDateString() === n.toDateString()) return 'آخر ظهور اليوم ' + T(d);
        if (d.toDateString() === y.toDateString()) return 'آخر ظهور أمس ' + T(d);
        return 'آخر ظهور ' + d.toLocaleDateString('ar-IQ', { day: 'numeric', month: 'long' });
      };
      const paintStatus = () => {
        if (!stEl || !stEl.isConnected) return;
        if (Date.now() < typingUntil) { stEl.textContent = 'يكتب الآن...'; stEl.className = 'p-sub typing'; return; }
        stEl.className = 'p-sub';
        if (!pres) { stEl.textContent = ''; return; }
        stEl.textContent = (inChat || Date.now() - pres < 90000) ? 'متصل الآن' : fmtSeen(pres);
      };
      async function loadPresence() {
        if (G) return;
        const { data } = await A.sb.rpc('get_presence', { uid: other.id });
        pres = data ? new Date(data) : null; paintStatus();
      }
      loadPresence();
      const pt = setInterval(() => { if (!root.isConnected) return clearInterval(pt); loadPresence(); }, 30000);
      try {
        if (!G) C.ch = A.sb.channel('chat:' + cid, { config: { presence: { key: me().id } } })
          .on('broadcast', { event: 'typing' }, ({ payload }) => {
            if (!payload || payload.uid !== other.id) return;
            typingUntil = Date.now() + 4000; paintStatus(); setTimeout(paintStatus, 4200);
          })
          .on('presence', { event: 'sync' }, () => { inChat = !!(C.ch && C.ch.presenceState()[other.id]); paintStatus(); })
          .subscribe(st => { if (st === 'SUBSCRIBED' && C.ch) C.ch.track({ at: Date.now() }); });
      } catch (e) { console.error(e); }

      /* ---- شريط الرد / التعديل ---- */
      const ctxEl = q('#c-ctx');
      function showCtx(kind, m) {
        C.reply = kind === 'reply' ? m : null; C.edit = kind === 'edit' ? m : null;
        ctxEl.hidden = false;
        ctxEl.innerHTML = `<div class="cb"><b>${kind === 'reply' ? 'رد على ' + A.esc(qwho(m)) : 'تعديل الرسالة'}</b><span>${A.esc(qtxt(m).slice(0, 80))}</span></div><button aria-label="إلغاء">${A.icon('xx')}</button>`;
        ctxEl.querySelector('button').onclick = () => { const was = C.edit; clearCtx(); if (was) { ta.value = ''; grow(); } };
        if (kind === 'edit') { ta.value = m.content || ''; grow(); }
        ta.focus();
      }
      function clearCtx() { C.reply = null; C.edit = null; ctxEl.hidden = true; ctxEl.innerHTML = ''; }

      /* ---- إعادة التوجيه ---- */
      async function forwardMsg(m) {
        const { data } = await A.sb.rpc('my_conversations');
        const rows = data || [];
        const sh = A.sheet(`<h3>إعادة توجيه إلى</h3>${rows.length ? rows.map(c => `<button class="cv" data-to="${c.conv_id}">${A.avatar({ display_name: c.other_name, username: c.other_username, avatar_url: c.other_avatar }, 44)}<div class="cv-b"><b>${A.esc(c.other_name || c.other_username || 'مستخدم')}</b></div></button>`).join('') : '<div class="empty">لا توجد محادثات</div>'}`);
        sh.el.onclick = async e => {
          const b = e.target.closest('[data-to]'); if (!b) return;
          sh.close();
          try {
            let path = null;
            if (m.media_url && m.media_type === 'sticker') path = m.media_url;
            else if (m.media_url) {
              path = `${b.dataset.to}/${me().id}_${Date.now()}.${(m.media_url.split('.').pop() || 'bin')}`;
              const { error } = await A.sb.storage.from('chat').copy(m.media_url, path);
              if (error) throw error;
            }
            const { error } = await A.sb.from('messages').insert({ conversation_id: b.dataset.to, sender_id: me().id, content: m.content || null, media_url: path, media_type: m.media_type || null, media_name: m.media_name || null, media_size: m.media_size || null, media_dur: m.media_dur || null, forwarded: true });
            if (error) throw error;
            A.toast('تمت إعادة التوجيه', 'ok');
          } catch (err) { console.error(err); A.toast('تعذرت إعادة التوجيه', 'err'); }
        };
      }

      /* ---- قائمة الرسالة (ضغطة مطوّلة) ---- */
      function msgMenu(m) {
        if (m.deleted_at || m._pending) return;
        const mine = m.sender_id === me().id;
        const opt = (k, ic, t) => `<button class="opt" data-k="${k}">${A.icon(ic)}<div>${t}</div></button>`;
        const sh = A.sheet(`<h3>الرسالة</h3>${opt('reply', 'rply', 'رد')}${m.content ? opt('copy', 'copy', 'نسخ النص') : ''}${opt('fwd', 'fwd', 'إعادة توجيه')}${mine ? opt('edit', 'pencil', 'تعديل') + opt('del', 'trashI', 'حذف للجميع') : ''}${isAdm() ? opt('mpin', 'pinI', (G.info.pinned_msgs || []).includes(m.id) ? 'إلغاء تثبيت الرسالة' : 'تثبيت الرسالة') : ''}`);
        sh.el.onclick = async e => {
          const b = e.target.closest('[data-k]'); if (!b) return;
          const k = b.dataset.k; sh.close();
          if (k === 'reply') showCtx('reply', m);
          else if (k === 'edit') showCtx('edit', m);
          else if (k === 'fwd') forwardMsg(m);
          else if (k === 'mpin') {
            const on = !(G.info.pinned_msgs || []).includes(m.id);
            const { error } = await A.sb.rpc('group_pin', { cid, mid: m.id, p_pin: on });
            if (error) return A.toast('تعذر التنفيذ', 'err');
            C.extra[m.id] = m; G.pi = null; await refreshG(); A.toast(on ? 'تم تثبيت الرسالة' : 'تم إلغاء التثبيت', 'ok');
          }
          else if (k === 'copy') navigator.clipboard.writeText(m.content).then(() => A.toast('تم النسخ', 'ok'), () => A.toast('تعذر النسخ', 'err'));
          else if (k === 'del') {
            const c = A.sheet(`<h3>حذف الرسالة للجميع؟</h3><div class="p-sub" style="margin:0 2px 12px">ستختفي الرسالة عند الطرفين.</div><button class="opt" data-y="1">${A.icon('trashI')}<div>نعم، احذف</div></button>`);
            c.el.onclick = async ev => {
              if (!ev.target.closest('[data-y]')) return; c.close();
              const { error } = await A.sb.rpc('delete_message', { mid: m.id });
              if (error) return A.toast('تعذر الحذف', 'err');
              Object.assign(m, { content: '', media_url: null, media_type: null, deleted_at: new Date().toISOString() }); rerender(m);
            };
          }
        };
      }
      longPress(body, '.msg .bb', el => { const m = getMsg(el.closest('.msg').dataset.id); if (m) msgMenu(m); });

      /* ---- الانتقال لرسالة ---- */
      async function jumpTo(id, at) {
        let el = body.querySelector(`.msg[data-id="${id}"]`);
        if (!el) {
          const { data } = await A.sb.from('messages').select(MSEL).eq('conversation_id', cid).gte('created_at', at).order('created_at', { ascending: true }).limit(150);
          if (!data || !data.length) return A.toast('تعذر العثور على الرسالة', 'err');
          C.msgs = data; C.ids = new Set(data.map(x => x.id)); C.more = true;
          await loadQuotes(data); renderAll();
          el = body.querySelector(`.msg[data-id="${id}"]`);
        }
        if (!el) return;
        C.stick = false; el.scrollIntoView({ block: 'center' });
        el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1800);
      }
      body.addEventListener('click', e => {
        const qt = e.target.closest('.qt'); if (!qt) return;
        const r = getMsg(qt.dataset.q);
        if (r && !r.deleted_at) jumpTo(r.id, r.created_at); else A.toast('الرسالة الأصلية غير متاحة', 'err');
      });

      /* ---- البحث داخل المحادثة ---- */
      function searchChat() {
        const sh = A.sheet(`<h3>بحث في المحادثة</h3><div class="cs-in">${A.icon('search')}<input id="cs-q" placeholder="اكتب كلمة للبحث..." autocomplete="off"></div><div id="cs-r"><div class="p-sub" style="padding:8px 2px">اكتب حرفين على الأقل</div></div>`, { tall: true });
        const inp = sh.el.querySelector('#cs-q'), out = sh.el.querySelector('#cs-r'); let t, seq = 0;
        setTimeout(() => inp.focus(), 150);
        inp.oninput = () => {
          clearTimeout(t);
          t = setTimeout(async () => {
            const k = inp.value.trim(), my = ++seq;
            if (k.length < 2) { out.innerHTML = '<div class="p-sub" style="padding:8px 2px">اكتب حرفين على الأقل</div>'; return; }
            const { data } = await A.sb.from('messages').select(MSEL).eq('conversation_id', cid).is('deleted_at', null).ilike('content', '%' + escLike(k) + '%').order('created_at', { ascending: false }).limit(40);
            if (my !== seq) return;
            window.__cs = data || [];
            out.innerHTML = (data || []).length ? data.map(m => `<button class="csr" data-id="${m.id}"><div>${hl(m.content, k)}</div><small>${m.sender_id === me().id ? 'أنت' : A.esc(other.display_name || other.username)} · ${dayLabel(m.created_at)} ${T(m.created_at)}</small></button>`).join('') : '<div class="empty">لا توجد نتائج</div>';
          }, 280);
        };
        out.onclick = e => {
          const b = e.target.closest('[data-id]'); if (!b) return;
          const m = (window.__cs || []).find(x => x.id === b.dataset.id); if (!m) return;
          sh.close(); jumpTo(m.id, m.created_at);
        };
      }

      /* ---- قائمة المحادثة ⋮ ---- */
      q('#c-menu').onclick = () => {
        const opt = (k, ic, t) => `<button class="opt" data-k="${k}">${A.icon(ic)}<div>${t}</div></button>`;
        const sh = A.sheet(`<h3>${A.esc(other.display_name || other.username)}</h3>${opt('search', 'search', 'بحث في المحادثة')}${opt('pin', 'pinI', C.pinned ? 'إلغاء تثبيت المحادثة' : 'تثبيت المحادثة')}${opt('mute', C.muted ? 'bell' : 'mute', C.muted ? 'إلغاء كتم الإشعارات' : 'كتم الإشعارات')}${G ? opt('ginfo', 'users', 'معلومات المجموعة') : opt('block', 'blk', 'حظر المستخدم') + opt('report', 'flag', 'إبلاغ عن المستخدم')}`);
        sh.el.onclick = async e => {
          const b = e.target.closest('[data-k]'); if (!b) return;
          const k = b.dataset.k; sh.close();
          if (k === 'search') return searchChat();
          if (k === 'ginfo') return A.groupInfo(cid);
          if (k === 'report') return A.report('user', other.id);
          if (k === 'pin') {
            const { error } = await setPrefs(cid, { pinned_at: C.pinned ? null : new Date().toISOString() });
            if (error) return A.toast('تعذر التنفيذ', 'err');
            C.pinned = !C.pinned; A.toast(C.pinned ? 'تم تثبيت المحادثة' : 'تم إلغاء التثبيت', 'ok');
          } else if (k === 'mute') {
            const { error } = await setPrefs(cid, { muted: !C.muted });
            if (error) return A.toast('تعذر التنفيذ', 'err');
            C.muted = !C.muted; A.toast(C.muted ? 'تم كتم الإشعارات' : 'تم إلغاء الكتم', 'ok');
          } else if (k === 'block') {
            const c = A.sheet(`<h3>حظر ${A.esc(other.display_name || other.username)}؟</h3><div class="p-sub" style="margin:0 2px 12px">لن يستطيع مراسلتك أو رؤية منشوراتك، ولن تظهر هذه المحادثة.</div><button class="opt" data-y="1">${A.icon('blk')}<div>نعم، احظر</div></button>`);
            c.el.onclick = async ev => {
              if (!ev.target.closest('[data-y]')) return; c.close();
              const { error } = await A.sb.from('user_blocks').insert({ blocker_id: me().id, blocked_id: other.id });
              if (error) return A.toast('تعذر الحظر', 'err');
              A.toast('تم حظر المستخدم', 'ok'); location.hash = '#/chats';
            };
          }
        };
      };

      const grow = () => { ta.style.height = 'auto'; ta.style.height = Math.min(120, ta.scrollHeight) + 'px'; };
      let lastTy = 0;
      ta.oninput = () => {
        grow();
        if (C.ch && ta.value.trim() && !C.edit && Date.now() - lastTy > 2500) { lastTy = Date.now(); C.ch.send({ type: 'broadcast', event: 'typing', payload: { uid: me().id } }); }
      };
      q('#c-send').onclick = async () => {
        const t = ta.value.trim();
        if (C.edit) {
          const m = C.edit;
          if (!t && !m.media_url) return;
          if (t === (m.content || '')) return clearCtx();
          ta.value = ''; grow(); clearCtx();
          const { error } = await A.sb.rpc('edit_message', { mid: m.id, txt: t });
          if (error) return A.toast('تعذر تعديل الرسالة', 'err');
          m.content = t || null; m.edited_at = new Date().toISOString(); rerender(m);
          return;
        }
        if (!t) return;
        ta.value = ''; grow(); post({ content: t });
      };
      q('#c-att').onclick = () => {
        const sh = A.sheet(`<h3>إرسال وسائط</h3>
          <button class="opt" data-k="f-img">${A.icon('image')}<div>صورة من المعرض</div></button>
          <button class="opt" data-k="f-vid">${A.icon('video')}<div>فيديو من المعرض<small>حتى 50 ميجابايت</small></div></button>
          <button class="opt" data-k="f-cam">${A.icon('camera')}<div>الكاميرا<small>صورة أو فيديو</small></div></button>
          <button class="opt" data-k="f-doc">${A.icon('file')}<div>ملف<small>PDF, Word, Excel, ZIP... حتى 50 ميجابايت</small></div></button>${G ? `<button class="opt" data-k="poll">${A.icon('chart')}<div>استطلاع رأي</div></button><button class="opt" data-k="topic">${A.icon('comment')}<div>موضوع للنقاش<small>الأعضاء يردون بنص أو صورة لمدة 24 ساعة</small></div></button>` : ''}`);
        sh.el.onclick = e => {
          const b = e.target.closest('[data-k]'); if (!b) return; sh.close();
          if (b.dataset.k === 'poll') return A.askPoll(d => post({ content: d.q, extra: { msg_kind: 'poll', poll_options: d.opts } }));
          if (b.dataset.k === 'topic') return A.askTopic(d => post({ content: d.txt, extra: { msg_kind: 'topic', ends_at: new Date(Date.now() + 24 * 3600e3).toISOString() } }));
          if (b.dataset.k === 'f-cam' && A.openCamera) return A.openCamera((files, k) => pick(files, k === 'video' ? 'video' : 'image'), () => q('#f-cam').click());
          q('#' + b.dataset.k).click();
        };
      };
      const pick = async (files, kind) => {
        for (const f of [...files]) {
          if (kind === 'video') {
            if (!f.type.startsWith('video/')) { A.toast('اختر ملف فيديو', 'err'); continue; }
            if (f.size > MAX_VID) { A.toast('حجم الفيديو أكبر من 50 ميجابايت', 'err'); continue; }
          } else {
            if (!/^image\/(jpeg|png|webp|gif)$/.test(f.type)) { A.toast('صيغة الصورة غير مدعومة', 'err'); continue; }
            if (f.size > MAX_IMG) { A.toast('حجم الصورة كبير جداً', 'err'); continue; }
          }
          await post({ file: f, type: kind });
        }
      };
      q('#f-doc').onchange = e => {
        const f = e.target.files[0]; e.target.value = ''; if (!f) return;
        if (f.size > MAX_VID) return A.toast('حجم الملف أكبر من 50 ميجابايت', 'err');
        post({ file: f, type: 'file', meta: { name: f.name, size: f.size } });
      };
      [['#f-img', 'image'], ['#f-vid', 'video'], ['#f-cam', 'image']].forEach(([s, k]) => {
        q(s).onchange = e => { const fl = [...e.target.files]; e.target.value = ''; pick(fl, k); };
      });


      /* ---- زر الإرسال/المايك ---- */
      const sendB = q('#c-send'), micB = q('#c-mic');
      const syncBtns = () => { const has = !!ta.value.trim() || !!C.edit; sendB.hidden = !has; micB.hidden = has; };
      ta.addEventListener('input', syncBtns);
      new MutationObserver(syncBtns).observe(ta, { attributes: true });
      const _val = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
      Object.defineProperty(ta, 'value', { get() { return _val.get.call(this); }, set(v) { _val.set.call(this, v); syncBtns(); } });
      syncBtns(); setInterval(() => { if (root.isConnected) syncBtns(); }, 400);

      /* ---- التسجيل الصوتي ---- */
      const rec = q('#c-rec'); let rc = null;
      const recStop = () => { if (!rc) return; clearInterval(rc.tm); try { rc.mr.stream.getTracks().forEach(t => t.stop()); } catch (e) {} rec.hidden = true; q('.chat-bar').classList.remove('recing'); };
      C.recStop = () => { if (rc) { rc.send = false; const r = rc; recStop(); try { r.mr.stop(); } catch (e) {} rc = null; } };
      micB.onclick = async () => {
        if (rc) return;
        if (!navigator.mediaDevices || !window.MediaRecorder) return A.toast('المتصفح لا يدعم التسجيل الصوتي', 'err');
        let stream;
        try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (e) { return A.toast('اسمح للتطبيق باستخدام المايك', 'err'); }
        const mt = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg'].find(t => MediaRecorder.isTypeSupported(t)) || '';
        const mr = new MediaRecorder(stream, mt ? { mimeType: mt } : undefined), chunks = [];
        rc = { mr, t0: Date.now(), send: false, tm: null };
        mr.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
        mr.onstop = () => {
          const me_ = rc; rc = null;
          if (!me_ || !me_.send) return;
          const dur = Math.max(1, Math.round((Date.now() - me_.t0) / 1000));
          const type = (mr.mimeType || mt || 'audio/webm').split(';')[0];
          const blob = new Blob(chunks, { type });
          if (blob.size < 800) return A.toast('التسجيل قصير جداً', 'err');
          const f = new File([blob], 'voice.' + (EXT[type] || 'webm'), { type });
          post({ file: f, type: 'audio', meta: { dur, size: f.size } });
        };
        mr.start(250);
        rec.hidden = false; q('.chat-bar').classList.add('recing');
        const tt = q('#rc-t'); tt.textContent = '0:00';
        rc.tm = setInterval(() => { const s = (Date.now() - rc.t0) / 1000; tt.textContent = mmss(s); if (s >= 300) q('#rc-s').click(); }, 250);
      };
      q('#rc-x').onclick = () => { if (!rc) return; rc.send = false; const r = rc; recStop(); try { r.mr.stop(); } catch (e) {} rc = null; };
      q('#rc-s').onclick = () => { if (!rc) return; rc.send = true; const r = rc; recStop(); try { r.mr.stop(); } catch (e) { rc = null; } };

      body.addEventListener('click', async e => {
        const pv = e.target.closest('[data-pv]');
        if (pv) {
          const m = getMsg(pv.closest('.msg').dataset.id); if (!m) return;
          const { error } = await A.sb.rpc('group_poll_vote', { mid: m.id, p_idx: +pv.dataset.pv });
          if (error) return A.toast('تعذر التصويت', 'err');
          await loadPolls(); rerender(m); return;
        }
        const tr = e.target.closest('[data-tr]');
        if (tr) { const m = getMsg(tr.closest('.msg').dataset.id); if (!m) return; if (m.ends_at && new Date(m.ends_at) < new Date()) return A.toast('انتهى هذا النقاش', 'err'); showCtx('reply', m); ta.focus(); }
      });

      /* ---- مشغّل الصوت ---- */
      let curAu = null;
      const auUI = (box, au) => {
        const bar = box.querySelector('.ab i'), tx = box.querySelector('.at'), ic = box.querySelector('.ap');
        au.ontimeupdate = () => { const d = au.duration && isFinite(au.duration) ? au.duration : +box.dataset.dur || 1; bar.style.width = Math.min(100, au.currentTime / d * 100) + '%'; tx.textContent = mmss(au.currentTime); };
        au.onended = () => { box.classList.remove('on'); ic.innerHTML = A.icon('play'); bar.style.width = '0'; tx.textContent = mmss(+box.dataset.dur || 0); };
        au.onpause = () => { box.classList.remove('on'); ic.innerHTML = A.icon('play'); };
        au.onplay = () => { box.classList.add('on'); ic.innerHTML = A.icon('pause'); };
      };
      body.addEventListener('click', e => {
        const ap = e.target.closest('.ap'), ab = e.target.closest('.ab');
        if (!ap && !ab) return;
        const box = e.target.closest('.au'), au = box.querySelector('audio');
        if (!au.getAttribute('src')) return A.toast('جاري التحميل...');
        if (!box._ui) { auUI(box, au); box._ui = 1; }
        if (ab && !ap) { const r = ab.getBoundingClientRect(), d = au.duration && isFinite(au.duration) ? au.duration : +box.dataset.dur; if (d) au.currentTime = Math.max(0, Math.min(1, (r.right - e.clientX) / r.width)) * d; return; }
        if (curAu && curAu !== au) curAu.pause();
        curAu = au;
        if (au.paused) au.play().catch(() => A.toast('تعذر تشغيل الصوت', 'err')); else au.pause();
      });

      /* ---- إيموجي وملصقات ---- */
      /* مكتبة ملصقات المستخدم */
      const stUrl = p => A.sb.storage.from('stickers').getPublicUrl(p).data.publicUrl;
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
      q('#c-emo').onclick = () => {
        const sh = A.sheet(`<div class="emo"><div class="et"><button class="on" data-t="e">إيموجي</button><button data-t="s">ملصقات</button></div>
          <div class="eg" id="eg">${EMOJI.map(x => `<button data-e="${x}">${x}</button>`).join('')}</div><input type="file" id="st-f" accept="image/*" hidden></div>`);
        const g = sh.el.querySelector('#eg'), fi = sh.el.querySelector('#st-f');
        let list = null;
        const drawStk = async () => {
          g.className = 'eg sg';
          if (!list) { g.innerHTML = '<button class="st-add" data-add>+</button>'; const { data } = await A.sb.from('user_stickers').select('id,path').order('created_at', { ascending: false }); list = data || []; }
          g.innerHTML = '<button class="st-add" data-add aria-label="إضافة ملصق">+</button>' + list.map(x => `<button class="st-b" data-sid="${x.id}"><img alt="" src="${stUrl(x.path)}"></button>`).join('') + (list.length ? '' : '<div class="st-n">أضف صورك ككل ملصق يظهر هنا</div>');
        };
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
          list = [data, ...(list || [])]; drawStk(); A.toast('تمت إضافة الملصق', 'ok');
        };
        let held = false;
        longPress(sh.el, '.st-b', el => {
          held = true; setTimeout(() => held = false, 400);
          const id = el.dataset.sid, c = A.sheet(`<h3>حذف الملصق؟</h3><button class="opt" data-y="1">${A.icon('trash')}<div>حذف من مكتبتي</div></button>`);
          c.el.onclick = async ev => {
            if (!ev.target.closest('[data-y]')) return; c.close();
            const it = list.find(x => x.id === id);
            await A.sb.from('user_stickers').delete().eq('id', id);
            if (it) A.sb.storage.from('stickers').remove([it.path]);
            list = list.filter(x => x.id !== id); drawStk();
          };
        });
        sh.el.onclick = e => {
          const t = e.target.closest('[data-t]');
          if (t) {
            sh.el.querySelectorAll('[data-t]').forEach(b => b.classList.toggle('on', b === t));
            if (t.dataset.t === 's') return drawStk();
            g.className = 'eg'; g.innerHTML = EMOJI.map(x => `<button data-e="${x}">${x}</button>`).join(''); return;
          }
          if (e.target.closest('[data-add]')) return fi.click();
          const sb = e.target.closest('[data-sid]');
          if (sb) { if (held) return; const it = list.find(x => x.id === sb.dataset.sid); if (it) { sh.close(); post({ type: 'sticker', meta: { url: stUrl(it.path) } }); } return; }
          const em = e.target.closest('[data-e]');
          if (em) { const p = ta.selectionStart == null ? ta.value.length : ta.selectionStart; ta.value = ta.value.slice(0, p) + em.dataset.e + ta.value.slice(ta.selectionEnd == null ? p : ta.selectionEnd); grow(); }
        };
      };

      R.on('message', m => {
        if (!root.isConnected) return false;
        if (m.conversation_id !== cid || C.ids.has(m.id)) return;
        C.ids.add(m.id); C.msgs.push(m); append(m); loadQuotes([m]);
        if (m.msg_kind === 'poll') loadPolls().then(() => { const cur = getMsg(m.id); if (cur) rerender(cur); });
        if (G && !G.mem[m.sender_id]) loadSenders([m]).then(ok => { const cur = getMsg(m.id); if (ok && cur) rerender(cur); });
        if (m.sender_id !== me().id) { typingUntil = 0; paintStatus(); }
        if (m.sender_id !== me().id) markRead();
        if (C.stick) toBottom();
      });
      R.on('msgupd', m => {
        if (!root.isConnected) return false;
        if (m.conversation_id !== cid) return;
        const cur = getMsg(m.id); if (!cur) return;
        Object.assign(cur, m); rerender(cur);
      });
      R.on('read', r => {
        if (!root.isConnected) return false;
        if (!G && r.conversation_id === cid && r.user_id !== me().id) { C.otherRead = new Date(r.last_read_at); if (r.last_delivered_at) C.otherDel = new Date(r.last_delivered_at); ticks(); }
      });
      R.on('resume', () => { if (!root.isConnected) return false; loadNewer(); });
    }
  };
})();