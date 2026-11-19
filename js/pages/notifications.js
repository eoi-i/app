(function () {
  const A = App, R = A.rt;
  const me = () => A.state.user;
  R.TXT.follow_request = 'أرسل لك طلب متابعة';
  R.TXT.comment_like = 'أعجب بتعليقك'; R.TXT.reply = 'ردّ على تعليقك'; R.TXT.channel_post = 'نشر في قناة اشتركت بها';
  R.TXT.visit = 'زار ملفك الشخصي';
  const SEL = 'id,type,post_id,comment_id,conversation_id,channel_id,is_read,created_at,' +
    'actor:profiles!notifications_actor_id_fkey(id,username,display_name,avatar_url,is_verified,category),channel:channels!notifications_channel_id_fkey(name),' +
    'post:posts!notifications_post_id_fkey(content),comment:comments!notifications_comment_id_fkey(content)';
  const ICO = { comment_like: ['heart', '#E5484D'], reply: ['comment', '#0E7C66'], channel_post: ['megaphone', '#6C3FD1'], like: ['heart', '#E5484D'], comment: ['comment', '#0E7C66'], follow: ['user', '#1D9BF0'], follow_request: ['user', '#D4A017'], visit: ['eye', '#0EA5E9'], repost: ['repeat', '#14A585'], mention: ['at', '#D4A017'], message: ['mail', '#8B5CF6'] };
  const cut = (t, n) => { t = (t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n) + '…' : t; };

  function row(n) {
    const a = n.actor || {}, ic = ICO[n.type] || ICO.like;
    const snip = (n.type === 'comment' || n.type === 'reply' || n.type === 'comment_like') && n.comment ? cut(n.comment.content, 60) : n.post ? cut(n.post.content, 60) : '';
    return `<button class="nt ${n.is_read ? '' : 'un'}" data-id="${n.id}" data-type="${n.type}" data-post="${n.post_id || ''}" data-conv="${n.conversation_id || ''}" data-ch="${n.channel_id || ''}" data-user="${A.esc(a.username || '')}">
      ${A.avatar(a, 44)}
      <div class="ntb"><div><b>${A.esc(a.display_name || a.username || 'مستخدم')}</b>${a.is_verified ? A.verified : ''}${A.catBadge(a.category, 15)} ${R.TXT[n.type] || ''}${n.type === 'channel_post' && n.channel ? ' «' + A.esc(n.channel.name) + '»' : ''}</div>
        ${snip ? `<small>${A.esc(snip)}</small>` : ''}<small>${A.timeAgo(n.created_at)}</small></div>
      <div class="nti" style="background:${ic[1]}">${A.icon(ic[0])}</div></button>`;
  }

  async function markSeen() {
    await A.sb.from('notifications').update({ is_read: true }).eq('user_id', me().id).eq('is_read', false).neq('type', 'message');
    R.refresh();
  }

  async function load(view) {
    const box = view.querySelector('#nt-list');
    box.innerHTML = '<div class="sk" style="height:64px;margin-bottom:8px"></div>'.repeat(4);
    const { data, error } = await A.sb.from('notifications').select(SEL).eq('user_id', me().id).neq('type', 'message').order('created_at', { ascending: false }).limit(60);
    if (error) {
      box.innerHTML = '<div class="empty">تعذر تحميل الإشعارات<br><button class="btn sm" id="nt-retry">إعادة المحاولة</button></div>';
      view.querySelector('#nt-retry').onclick = () => load(view);
      return;
    }
    box.innerHTML = data.length ? data.map(row).join('') : '<div class="empty">لا توجد إشعارات بعد</div>';
    markSeen();
  }

  A.pages.notifications = {
    render(view) {
      view.innerHTML = `<div class="nt-top"><div class="sec-title" style="margin:0">التفاعلات</div>
        <button class="btn ghost sm" id="nt-all" style="margin:0">تعليم الكل كمقروء</button></div><div id="nt-list"></div>`;
      view.querySelector('#nt-all').onclick = async () => {
        await A.sb.from('notifications').update({ is_read: true }).eq('user_id', me().id).eq('is_read', false);
        view.querySelectorAll('.nt.un').forEach(x => x.classList.remove('un'));
        R.refresh();
      };
      view.querySelector('#nt-list').onclick = e => {
        const b = e.target.closest('.nt');
        if (!b) return;
        const t = b.dataset.type;
        if (t === 'channel_post' && b.dataset.ch) location.hash = '#/c/' + b.dataset.ch;
        else if (t === 'message' && b.dataset.conv) location.hash = '#/chat/' + b.dataset.conv;
        else if (t === 'follow_request') location.hash = '#/settings/requests';
        else if (t === 'visit') location.hash = '#/visitors';
        else if (t === 'follow' && b.dataset.user) location.hash = '#/u/' + encodeURIComponent(b.dataset.user);
        else if (b.dataset.post) location.hash = '#/post/' + b.dataset.post;
      };
      R.on('notification', async n => {
        if (!view.isConnected) return false;
        if (n.type === 'message') return;
        const { data } = await A.sb.from('notifications').select(SEL).eq('id', n.id).maybeSingle();
        if (!data) return;
        const box = view.querySelector('#nt-list');
        if (!box.querySelector('.nt')) box.innerHTML = '';
        box.insertAdjacentHTML('afterbegin', row(data));
        if (data.type !== 'message') markSeen();
      });
      load(view);
    },
    refresh() { const v = document.getElementById('view'); return v ? load(v) : null; }
  };
})();