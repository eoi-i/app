(function () {
  const A = App, P = A.posts;
  const GIF = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

  const st = document.createElement('style');
  st.textContent = `
.rv{position:fixed;inset:0;z-index:70;background:#000;color:#fff;direction:rtl;animation:fade .2s}
.rv-s{position:absolute;inset:0;overflow-y:scroll;scroll-snap-type:y mandatory;overscroll-behavior:contain;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.rv-s::-webkit-scrollbar{display:none}
.rv .rv-i{position:relative;height:100%;scroll-snap-align:start;scroll-snap-stop:always;overflow:hidden;background:#000;margin:0;padding:0;border:0;border-radius:0;box-shadow:none;color:#fff}
.rv-i video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#000;display:block}
.rv-i video.cov{object-fit:cover}
.rv-i::after{content:'';position:absolute;left:0;right:0;bottom:0;height:46%;background:linear-gradient(transparent,rgba(0,0,0,.72));pointer-events:none;z-index:1}
.rv-i::before{content:'';position:absolute;left:0;right:0;top:0;height:18%;background:linear-gradient(rgba(0,0,0,.55),transparent);pointer-events:none;z-index:1}
.rv-pz{position:absolute;left:50%;top:50%;width:76px;height:76px;margin:-38px;border-radius:50%;z-index:2;display:grid;place-items:center;background:rgba(0,0,0,.45);opacity:0;transform:scale(.7);transition:.2s;pointer-events:none}
.rv-pz .ic{width:38px;height:38px;fill:#fff;stroke:none}
.rv-i.pz .rv-pz{opacity:1;transform:none}
.rv-x{position:absolute;top:calc(10px + env(safe-area-inset-top));inset-inline-start:12px;z-index:6;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:rgba(0,0,0,.4);color:#fff;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.rv-x .ic{width:23px;height:23px}
.rv{--ac:var(--primary-2,#E5B53D);--ac2:var(--primary,#14A585)}
.rv-side{position:absolute;left:10px;bottom:84px;z-index:3;display:flex;flex-direction:column;align-items:center;gap:6px}
.rv-side .act{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#fff;background:none;font-size:11.5px;font-weight:700;font-variant-numeric:tabular-nums;text-shadow:0 1px 6px rgba(0,0,0,.7);width:48px;padding:6px 0 4px;border-radius:18px;transition:background .2s}
.rv-side .act:active{background:color-mix(in srgb,var(--ac) 22%,transparent)}
.rv-side .act .ic{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:1.9;filter:drop-shadow(0 1px 3px rgba(0,0,0,.6));transition:transform .2s}
.rv-side .act:active .ic{transform:scale(.85)}
.rv-side .act.on{color:#fff}
.rv-side .like.on .ic{fill:var(--ac);stroke:var(--ac);filter:drop-shadow(0 0 6px color-mix(in srgb,var(--ac) 75%,transparent))}
.rv-side .like.on{color:var(--ac)}
.rv-side .save.on .ic{fill:var(--ac2);stroke:var(--ac2);filter:drop-shadow(0 0 6px color-mix(in srgb,var(--ac2) 70%,transparent))}
.rv-av{display:block;border-radius:50%;border:2px solid var(--ac);box-shadow:0 0 0 3px rgba(0,0,0,.3);overflow:hidden;line-height:0;margin-bottom:8px}
.rv-info{position:absolute;right:14px;left:84px;bottom:56px;z-index:3;text-shadow:0 1px 6px rgba(0,0,0,.75)}
.rv-nm{display:flex;align-items:center;gap:6px;font-weight:800;font-size:15.5px;margin-bottom:6px}
.rv-tx{font-size:14px;line-height:1.7;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.rv-tx.open{-webkit-line-clamp:unset;max-height:34vh;overflow-y:auto;display:block}
.rv-more{color:rgba(255,255,255,.75);font-weight:700;font-size:13px;margin-top:2px}
.rv-bar{position:absolute;left:0;right:0;bottom:0;z-index:3;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 14px calc(10px + env(safe-area-inset-bottom))}
.rv-bar span{font-size:13px;font-weight:700;opacity:.9;display:flex;align-items:center;gap:5px}
.rv-bar span .ic{width:15px;height:15px}
.rv-bar button{padding:8px 14px;border-radius:20px;background:rgba(255,255,255,.18);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);color:#fff;font-weight:800;font-size:13px;display:flex;align-items:center;gap:6px}
.rv-bar button .ic{width:16px;height:16px}
.rv-pr{position:absolute;left:0;right:0;bottom:0;height:3px;z-index:4;background:rgba(255,255,255,.2)}
.rv-pr i{display:block;height:100%;width:0;background:#fff}
.rv-sp{position:absolute;left:50%;top:50%;width:34px;height:34px;margin:-17px;border:3px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:rvSp .8s linear infinite;opacity:0;transition:opacity .2s .6s;z-index:2;pointer-events:none}
.rv-i.buf .rv-sp{opacity:1}
@keyframes rvSp{to{transform:rotate(360deg)}}`;
  document.head.appendChild(st);

  const root = p => (p.repost_of && p.original ? p.original : p);
  const vurl = p => { const m = (root(p).media || []).find(x => x.type === 'video'); return m ? m.url : null; };
  A.hasVideo = p => !!vurl(p);
  const fmt = n => { n = n || 0; return n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n); };

  A.openReel = async (list, startId, state) => {
    const seen = new Set(), items = [];
    list.forEach(p => { const s = root(p); if (vurl(p) && !seen.has(s.id)) { seen.add(s.id); items.push({ key: p.id, s }); } });
    if (!items.length) return;
    let idx = items.findIndex(x => x.key === startId || x.s.id === startId);
    if (idx < 0) idx = 0;
    const stt = state || { liked: new Set(), saved: new Set(), reposted: new Set() };
    const me = A.state.user;

    const el = document.createElement('div');
    el.className = 'rv';
    el.innerHTML = `<div class="rv-s">${items.map(({ s }) => {
      const u = s.author || {}, own = me && u.id === me.id;
      return `<article class="post rv-i" data-id="${s.id}" data-uid="${A.esc(u.id || '')}">
        <video src="${A.esc(vurl(s))}" poster="${GIF}" playsinline loop preload="${'metadata'}"></video>
        <div class="rv-sp"></div><div class="rv-pz">${A.icon('play')}</div>
        <div class="rv-side">
          <a class="rv-av" data-go="${A.esc(u.username || '')}">${A.avatar(u, 46)}</a>
          <button class="act like ${stt.liked.has(s.id) ? 'on' : ''}" data-act="like">${A.icon('heart')}<span class="cnt">${s.likes_count || 0}</span></button>
          <button class="act" data-act="comment">${A.icon('comment')}<span>${s.comments_count || 0}</span></button>
          <button class="act save ${stt.saved.has(s.id) ? 'on' : ''}" data-act="save">${A.icon('bookmark')}<span>${''}</span></button>
          <button class="act" data-act="share">${A.icon('share')}</button>
          <button class="act" data-act="more">${A.icon('more')}</button>
        </div>
        <div class="rv-info"><div class="rv-nm" data-go="${A.esc(u.username || '')}">${A.esc(u.display_name || u.username || '')}${u.is_verified ? A.verified : ''}</div>
          ${s.content ? `<div class="rv-tx">${A.linkify(s.content)}</div>${s.content.length > 70 ? '<div class="rv-more" data-more>المزيد</div>' : ''}` : ''}</div>
        <div class="rv-bar">${own ? `<button data-ins>${A.icon('chart')}المزيد من الرؤى</button>` : '<span></span>'}<span>${A.icon('eye')}<b data-vw>${fmt(s.views_count)}</b> مشاهدة</span></div>
        <div class="rv-pr"><i></i></div>
      </article>`;
    }).join('')}</div><button class="rv-x" aria-label="رجوع">${A.icon('arrow')}</button>`;
    document.body.appendChild(el);

    const sc = el.querySelector('.rv-s'), arts = [...el.querySelectorAll('.rv-i')];
    P.bind(sc);
    let closed = false;
    const close = () => {
      if (closed) return; closed = true;
      io.disconnect();
      el.querySelectorAll('video').forEach(v => { try { v.pause(); } catch (e) {} v.removeAttribute('src'); v.load(); });
      el.remove();
    };
    el.querySelector('.rv-x').onclick = close;
    // مشاركة بالشاشة الجديدة (إرسال لمتابَعين ومجموعات + أدوات)
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-act="share"]');
      if (!b || !A.sharePost) return;
      e.stopPropagation(); e.preventDefault();
      const a = b.closest('.rv-i'), it = items.find(x => x.s.id === a.dataset.id);
      if (it) A.sharePost(it.s, { remove() { a.remove(); }, _ext: true });
    }, true);

    // عدد المشاهدات الحقيقي
    A.sb.from('posts').select('id,views_count').in('id', items.map(x => x.s.id)).then(r => {
      (r.data || []).forEach(x => { const b = el.querySelector(`.rv-i[data-id="${x.id}"] [data-vw]`); if (b) b.textContent = fmt(x.views_count); });
    });

    const timers = new Map();
    const play = v => {
      v.muted = false; v.volume = 1;
      const p = v.play();
      if (p && p.catch) p.catch(() => { v.muted = true; v.play().catch(() => {}); });
    };
    arts.forEach(a => {
      const v = a.querySelector('video'), bar = a.querySelector('.rv-pr i');
      v.disablePictureInPicture = true;
      v.addEventListener('loadedmetadata', () => v.classList.toggle('cov', v.videoHeight >= v.videoWidth * 1.15));
      v.addEventListener('waiting', () => a.classList.add('buf'));
      ['playing', 'canplay'].forEach(t => v.addEventListener(t, () => a.classList.remove('buf')));
      v.addEventListener('timeupdate', () => { if (v.duration) bar.style.width = (v.currentTime / v.duration * 100) + '%'; });
    });

    const io = new IntersectionObserver(es => es.forEach(e => {
      const a = e.target, v = a.querySelector('video');
      if (e.isIntersecting && e.intersectionRatio >= 0.7) {
        a.classList.remove('pz');
        if (v.preload !== 'auto') v.preload = 'auto';
        play(v);
        if (!timers.has(a)) timers.set(a, setTimeout(() => { timers.delete(a); if (!closed) A.recordView(a.dataset.id); }, 1500));
        // تجهيز الفيديو التالي
        const nx = a.nextElementSibling && a.nextElementSibling.querySelector('video');
        if (nx) nx.preload = 'auto';
      } else {
        v.pause();
        if (timers.has(a)) { clearTimeout(timers.get(a)); timers.delete(a); }
      }
    }), { root: sc, threshold: [0, 0.7] });
    arts.forEach(a => io.observe(a));

    sc.addEventListener('click', e => {
      const go = e.target.closest('[data-go]');
      if (go && go.dataset.go) { close(); location.hash = '#/u/' + encodeURIComponent(go.dataset.go); return; }
      const mo = e.target.closest('[data-more]');
      if (mo) { const t = mo.previousElementSibling; t.classList.toggle('open'); mo.textContent = t.classList.contains('open') ? 'أقل' : 'المزيد'; return; }
      if (e.target.closest('[data-ins]')) { A.profileInsights && A.profileInsights(); return; }
      if (e.target.closest('[data-act],.rv-info,.rv-bar,.rv-av')) return;
      const a = e.target.closest('.rv-i'), v = a && a.querySelector('video');
      if (!v) return;
      if (v.paused) { a.classList.remove('pz'); play(v); } else { v.pause(); a.classList.add('pz'); }
    });

    requestAnimationFrame(() => { sc.scrollTop = idx * sc.clientHeight; });
  };
})();
