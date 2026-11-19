(function () {
  const A = App;
  const me = () => A.state.user;
  Object.assign(A.icons, { mail: '<path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"/><path d="M22 6l-10 7L2 6"/>' });

  const R = A.rt = { ch: null, n: 0, m: 0, openConv: null, hs: { message: [], msgupd: [], notification: [], read: [], resume: [] } };
  R.TXT = { like: 'أعجب بمنشورك', comment: 'علّق على منشورك', follow: 'بدأ بمتابعتك', repost: 'أعاد نشر منشورك', mention: 'أشار إليك في منشور', message: 'أرسل لك رسالة', comment_like: 'أعجب بتعليقك', reply: 'ردّ على تعليقك', channel_post: 'نشر في قناة اشتركت بها' };
  R.on = (t, fn) => R.hs[t].push(fn);
  const emit = (t, p) => { R.hs[t] = R.hs[t].filter(fn => { try { return fn(p) !== false; } catch (e) { console.error(e); return true; } }); };

  function paint() {
    const set = (id, n) => { const el = document.getElementById(id); if (el) { el.textContent = n > 99 ? '99+' : n; el.hidden = !n; } };
    set('bdg-n', R.n); set('bdg-m', R.m);
  }

  R.refresh = async () => {
    if (!me()) return;
    // عدّاد الرسائل = عدد المحادثات التي فيها رسائل غير مقروءة فعلاً (من السيرفر)، وليس عدد الإشعارات القديمة
    const [n, m] = await Promise.all([
      A.sb.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', me().id).eq('is_read', false).neq('type', 'message'),
      A.sb.rpc('unread_chats_count')
    ]);
    R.n = n.count || 0;
    if (typeof m.data === 'number') R.m = m.data;
    paint();
  };

  async function onNotif(n) {
    if (n.type === 'message') {
      if (R.openConv && R.openConv === n.conversation_id) {
        A.sb.from('notifications').update({ is_read: true }).eq('id', n.id).then(() => {});
        return;
      }
      R.refresh();
    } else R.n++;
    paint();
    emit('notification', n);
    if (n.actor_id) {
      const { data: a } = await A.sb.from('profiles').select('display_name,username').eq('id', n.actor_id).maybeSingle();
      A.toast(`${a ? (a.display_name || a.username) : 'مستخدم'} ${R.TXT[n.type] || ''}`, 'ok');
    }
  }

  let hb = null;
  const dq = {};
  const beat = () => { if (me() && !document.hidden) A.sb.rpc('touch_presence').then(() => {}, () => {}); };
  const deliverAll = () => { if (me()) A.sb.rpc('mark_all_delivered').then(() => {}, () => {}); };
  const deliver = cid => { clearTimeout(dq[cid]); dq[cid] = setTimeout(() => A.sb.rpc('mark_delivered', { cid }).then(() => {}, () => {}), 300); };

  R.start = () => {
    if (R.ch || !me()) return;
    const uid = me().id;
    R.ch = A.sb.channel('rt-' + uid)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${uid}` }, p => onNotif(p.new))
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, p => { if (p.new.sender_id !== me().id) deliver(p.new.conversation_id); emit('message', p.new); })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, p => emit('msgupd', p.new))
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'conversation_members' }, p => emit('read', p.new))
      .subscribe(s => { if (s === 'SUBSCRIBED') { R.refresh(); beat(); deliverAll(); } });
    if (!hb) hb = setInterval(beat, 60000);
  };

  R.stop = () => {
    if (R.ch) { A.sb.removeChannel(R.ch); R.ch = null; }
    clearInterval(hb); hb = null;
    R.n = R.m = 0; R.openConv = null; paint();
  };

  // حقن زر الرسائل وشارات العدّاد في الواجهة الأساسية
  const baseShell = A.buildShell;
  A.buildShell = function () {
    baseShell.apply(this, arguments);
    const top = document.querySelector('.top-actions');
    const b = document.createElement('button');
    b.className = 'icon-btn'; b.id = 'b-chats'; b.setAttribute('aria-label', 'الرسائل');
    b.innerHTML = A.icon('mail') + '<span class="bdg" id="bdg-m" hidden></span>';
    b.onclick = () => { location.hash = '#/chats'; };
    top.insertBefore(b, top.firstChild);
    const bell = document.querySelector('.nav-item[data-go="notifications"]');
    if (bell) { const s = document.createElement('span'); s.className = 'bdg'; s.id = 'bdg-n'; s.hidden = true; bell.appendChild(s); }
    R.start();
    paint();
  };

  A.sb.auth.onAuthStateChange(ev => { if (ev === 'SIGNED_OUT') setTimeout(R.stop, 0); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && R.ch) { R.refresh(); beat(); deliverAll(); emit('resume'); } });
})();