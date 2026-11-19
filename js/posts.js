(function () {
  const A = App;
  const AUTHOR = 'author:profiles!posts_user_id_fkey(id,username,display_name,avatar_url,is_verified,category)';
  const MEDIA = 'media:post_media(url,type,position)';
  const CNT = 'likes_count,comments_count,reposts_count';
  const P = A.posts = {};
  const me = () => A.state.user;
  const REASONS = ['محتوى مسيء', 'معلومات مضللة', 'إعلان مزعج (سبام)', 'تحرش أو تهديد', 'أخرى'];

  Object.assign(A.icons, {
    more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/>',
    trash: '<path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>'
  });

  P.SEL = `id,content,created_at,repost_of,${CNT},${AUTHOR},${MEDIA},original:original_post`;


  const rlst = document.createElement('style');
  rlst.textContent = `
.fx.rl .sheet-bg{background:#000;align-items:stretch}
.fx.rl .sheet{position:relative;max-height:none;height:100%;border-radius:0;background:#000;padding:0;overflow:hidden;animation:fade .2s}
.fx.rl .post{position:absolute;inset:0;margin:0;padding:0;border:0;border-radius:0;background:#000;box-shadow:none;color:#fff;overflow:hidden}
.fx.rl .media{position:absolute;inset:0;margin:0;border-radius:0;background:#000}
.fx.rl .media video{width:100%;height:100%;max-height:none;aspect-ratio:auto;object-fit:contain;background:#000}
.fx.rl .media video.cov{object-fit:cover}
.fx.rl .media::after{content:'';position:absolute;inset:auto 0 0 0;height:45%;background:linear-gradient(transparent,rgba(0,0,0,.7));pointer-events:none}
.fx.rl .media.pz::before{content:'';position:absolute;left:50%;top:50%;width:70px;height:70px;margin:-35px;border-radius:50%;background:rgba(0,0,0,.45) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M9 6l9 6-9 6z'/%3E%3C/svg%3E") center/38px no-repeat;z-index:2;pointer-events:none}
.fx.rl .p-head{position:absolute;top:0;left:0;right:0;z-index:3;padding:62px 16px 30px;background:linear-gradient(rgba(0,0,0,.6),transparent)}
.fx.rl .p-name,.fx.rl .p-sub{color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.6)}
.fx.rl .p-text{position:absolute;left:0;right:0;bottom:70px;z-index:3;padding:0 16px;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.7)}
.fx.rl .p-actions{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:10px 12px calc(12px + env(safe-area-inset-bottom));border:0;color:#fff}
.fx.rl .p-actions .act{color:#fff}
.fx.rl .rl-x{position:absolute;top:12px;inset-inline-start:12px;z-index:5;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:rgba(0,0,0,.45);color:#fff}
.fx.rl .rl-x .ic{width:22px;height:22px}`;
  document.head.appendChild(rlst);

  // نافذة سفلية مشتركة (تتكيف مع لوحة المفاتيح)
  A.sheet = (html, opts = {}) => {
    const fx = document.createElement('div');
    fx.className = 'fx';
    const reel = !opts.tall && /<article class="post"/.test(html) && /<video/.test(html);
    if (reel) fx.classList.add('rl');
    fx.innerHTML = `<div class="sheet-bg"><div class="sheet ${opts.tall ? 'tall' : ''}">${reel ? `<button class="rl-x" aria-label="رجوع">${A.icon('arrow')}</button>` : ''}${html}</div></div>`;
    document.body.appendChild(fx);
    if (reel) {
      const v = fx.querySelector('video');
      v.controls = false; v.loop = true; v.muted = false; v.setAttribute('playsinline', '');
      v.addEventListener('loadedmetadata', () => { v.classList.toggle('cov', v.videoHeight >= v.videoWidth * 1.15); });
      const go = () => { const p = v.play(); if (p && p.catch) p.catch(() => { v.muted = true; v.play().catch(() => {}); }); };
      go();
      const m = fx.querySelector('.media');
      m.onclick = () => { if (v.paused) v.play().catch(() => {}); else v.pause(); m.classList.toggle('pz', v.paused); };
      fx.querySelector('.rl-x').onclick = () => { v.pause(); fx.remove(); };
    }
    const vv = window.visualViewport;
    const fit = () => { if (vv) { fx.style.height = vv.height + 'px'; fx.style.top = vv.offsetTop + 'px'; } };
    fit();
    if (vv) { vv.addEventListener('resize', fit); vv.addEventListener('scroll', fit); }
    const close = () => {
      if (vv) { vv.removeEventListener('resize', fit); vv.removeEventListener('scroll', fit); }
      fx.remove();
    };
    fx.firstChild.onclick = e => { if (e.target === fx.firstChild) close(); };
    return { el: fx.querySelector('.sheet'), close };
  };

  A.report = (type, id) => {
    const sh = A.sheet(`<h3>سبب الإبلاغ</h3>${REASONS.map(r => `<button class="opt" data-r="${A.esc(r)}"><div>${A.esc(r)}</div></button>`).join('')}`);
    sh.el.onclick = async e => {
      const b = e.target.closest('[data-r]');
      if (!b) return;
      sh.close();
      const { error } = await A.sb.from('reports').insert({ reporter_id: me().id, target_type: type, target_id: id, reason: b.dataset.r });
      A.toast(error ? 'تعذر إرسال البلاغ' : 'تم إرسال البلاغ، شكراً لك', error ? 'err' : 'ok');
    };
  };

  P.score = p => {
    const s = p.repost_of && p.original ? p.original : p;
    const h = (Date.now() - new Date(p.created_at)) / 36e5;
    return (s.likes_count + 2 * s.comments_count + 3 * s.reposts_count + 1) / Math.pow(h + 2, 1.3);
  };

  P.skeleton = (n = 3) => Array(n).fill(`<div class="post"><div style="display:flex;gap:10px"><div class="sk" style="width:42px;height:42px;border-radius:50%"></div><div style="flex:1"><div class="sk" style="height:12px;width:40%;margin-bottom:6px"></div><div class="sk" style="height:10px;width:25%"></div></div></div><div class="sk" style="height:14px;margin:14px 0 6px"></div><div class="sk" style="height:160px"></div></div>`).join('');

  function mediaHTML(m) {
    if (!m || !m.length) return '';
    m = [...m].sort((a, b) => a.position - b.position);
    const v = m.find(x => x.type === 'video');
    if (v) return `<div class="media"><video src="${A.esc(v.url)}#t=0.1" poster="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" playsinline muted loop controls preload="auto"></video></div>`;
    return `<div class="media grid-${Math.min(m.length, 4)}">${m.slice(0, 4).map(x => `<img loading="lazy" src="${A.esc(x.url)}" alt="">`).join('')}</div>`;
  }

  P.html = (p, st) => {
    const isR = !!(p.repost_of && p.original);
    const s = isR ? p.original : p, u = s.author || {}, id = s.id;
    return `<article class="post" data-id="${id}" data-uid="${A.esc(u.id || '')}"${isR ? ` data-rid="${p.id}" data-ruid="${A.esc(p.author.id)}"` : ''}>
      ${isR ? `<div class="repost-tag">${A.icon('repeat')} ${A.esc(p.author.display_name || p.author.username)} أعاد النشر</div>` : ''}
      <div class="p-head">${A.avatar(u, 42)}<div>
        <div class="p-name">${A.esc(u.display_name || u.username)}${u.is_verified ? A.verified : ''}${A.catBadge(u.category, 16)}</div>
        <div class="p-sub">@${A.esc(u.username)} · ${A.timeAgo(s.created_at)}</div></div>
        <button class="icon-btn pm" data-act="more" aria-label="المزيد">${A.icon('more')}</button></div>
      ${s.content ? `<div class="p-text">${A.linkify(s.content)}</div>` : ''}
      ${mediaHTML(s.media)}
      <div class="p-actions">
        <button class="act like ${st.liked.has(id) ? 'on' : ''}" data-act="like">${A.icon('heart')}<span class="cnt">${s.likes_count}</span></button>
        <button class="act" data-act="comment">${A.icon('comment')}<span>${s.comments_count}</span></button>
        <button class="act rep ${st.reposted.has(id) ? 'on' : ''}" data-act="repost">${A.icon('repeat')}<span class="cnt">${s.reposts_count}</span></button>
        <button class="act save ${st.saved.has(id) ? 'on' : ''}" data-act="save">${A.icon('bookmark')}</button>
        <button class="act" data-act="share">${A.icon('share')}</button>
      </div></article>`;
  };

  P.state = async list => {
    const ids = [...new Set(list.map(p => (p.repost_of && p.original ? p.original.id : p.id)))];
    const st = { liked: new Set(), saved: new Set(), reposted: new Set() };
    if (!ids.length) return st;
    const [l, s, r] = await Promise.all([
      A.sb.from('likes').select('post_id').eq('user_id', me().id).in('post_id', ids),
      A.sb.from('saved_posts').select('post_id').eq('user_id', me().id).in('post_id', ids),
      A.sb.from('posts').select('repost_of').eq('user_id', me().id).in('repost_of', ids)
    ]);
    (l.data || []).forEach(x => st.liked.add(x.post_id));
    (s.data || []).forEach(x => st.saved.add(x.post_id));
    (r.data || []).forEach(x => st.reposted.add(x.repost_of));
    return st;
  };

  async function toggle(btn, table, id, withCount) {
    const on = btn.classList.toggle('on');
    btn.classList.add('pop'); setTimeout(() => btn.classList.remove('pop'), 300);
    const c = btn.querySelector('.cnt');
    if (withCount && c) c.textContent = Math.max(0, +c.textContent + (on ? 1 : -1));
    const k = { user_id: me().id, post_id: id };
    const r = on ? await A.sb.from(table).insert(k) : await A.sb.from(table).delete().match(k);
    if (r.error) {
      btn.classList.toggle('on', !on);
      if (withCount && c) c.textContent = Math.max(0, +c.textContent + (on ? -1 : 1));
      A.toast('تعذر تنفيذ العملية', 'err');
    }
  }

  async function repost(btn, id) {
    if (btn.classList.contains('on')) return A.toast('أعدت نشر هذا المنشور مسبقاً');
    const { error } = await A.sb.from('posts').insert({ user_id: me().id, repost_of: id, visibility: 'public' });
    if (error) return A.toast('تعذر إعادة النشر', 'err');
    btn.classList.add('on');
    const c = btn.querySelector('.cnt'); c.textContent = +c.textContent + 1;
    A.toast('تمت إعادة النشر', 'ok');
  }

  async function share(id) {
    const url = location.href.split('#')[0] + '#/post/' + id;
    try {
      if (navigator.share) await navigator.share({ title: 'أني عراقي', url });
      else { await navigator.clipboard.writeText(url); A.toast('تم نسخ الرابط', 'ok'); }
    } catch (e) {}
  }

  async function deletePost(id) {
    if (!confirm('حذف المنشور نهائياً؟ لا يمكن التراجع.')) return;
    const { data: media } = await A.sb.from('post_media').select('url').eq('post_id', id);
    const { error } = await A.sb.from('posts').delete().eq('id', id);
    if (error) return A.toast('تعذر حذف المنشور', 'err');
    const paths = (media || []).map(m => { const i = m.url.indexOf('/posts/'); return i < 0 ? null : decodeURIComponent(m.url.slice(i + 7).split('?')[0]); }).filter(Boolean);
    if (paths.length) A.sb.storage.from('posts').remove(paths);
    document.querySelectorAll(`.post[data-id="${id}"]`).forEach(x => x.remove());
    A.toast('تم حذف المنشور', 'ok');
  }

  async function unrepost(rid) {
    const { error } = await A.sb.from('posts').delete().eq('id', rid).eq('user_id', me().id);
    if (error) return A.toast('تعذر التنفيذ', 'err');
    document.querySelectorAll(`.post[data-rid="${rid}"]`).forEach(x => x.remove());
    A.toast('تم إلغاء إعادة النشر', 'ok');
  }

  function menu(card) {
    const id = card.dataset.id, uid = card.dataset.uid, rid = card.dataset.rid;
    const mine = uid === me().id, myRepost = rid && card.dataset.ruid === me().id;
    const admin = (A.state.profile || {}).role === 'admin';
    const row = (k, ic, t, s) => `<button class="opt" data-k="${k}">${A.icon(ic)}<div>${t}<small>${s}</small></div></button>`;
    let h = '';
    if (myRepost) h += row('unrepost', 'repeat', 'إلغاء إعادة النشر', 'يُزال من ملفك الشخصي');
    if (mine || admin) h += row('delete', 'trash', mine ? 'حذف المنشور' : 'حذف المنشور (إدارة)', 'لا يمكن التراجع عن ذلك');
    if (!mine) h += row('report', 'flag', 'الإبلاغ عن المنشور', 'تُراجع البلاغات من الإدارة');
    h += row('link', 'share', 'مشاركة الرابط', 'نسخ أو مشاركة رابط المنشور');
    const sh = A.sheet(h);
    sh.el.onclick = e => {
      const b = e.target.closest('[data-k]');
      if (!b) return;
      sh.close();
      const k = b.dataset.k;
      if (k === 'delete') deletePost(id);
      else if (k === 'unrepost') unrepost(rid);
      else if (k === 'report') A.report('post', id);
      else if (k === 'link') share(id);
    };
  }

  P.bind = el => el.addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (!b || !el.contains(b)) return;
    const post = b.closest('.post');
    if (!post) return;
    const id = post.dataset.id, a = b.dataset.act;
    if (a === 'like') toggle(b, 'likes', id, true);
    else if (a === 'save') toggle(b, 'saved_posts', id, false);
    else if (a === 'repost') repost(b, id);
    else if (a === 'share') share(id);
    else if (a === 'more') menu(post);
    else if (a === 'comment') A.comments && A.comments.open(id);
  });
})();