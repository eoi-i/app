(function () {
  const A = App;
  const GIF = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  let unlocked = false, timer = null;
  const active = () => unlocked || !!(navigator.userActivation && navigator.userActivation.hasBeenActive);

  const st = document.createElement('style');
  st.textContent = '.tt-v::-webkit-media-controls,.tt-v::-webkit-media-controls-panel,.tt-v::-webkit-media-controls-start-playback-button,.tt-v::-webkit-media-controls-overlay-play-button,.tt-v::-webkit-media-controls-enclosure{display:none!important;-webkit-appearance:none;opacity:0}';
  document.head.appendChild(st);

  const pre = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const v = e.target.querySelector('video');
    if (v && v.preload !== 'auto') v.preload = 'auto';
  }), { rootMargin: '150% 0px' });

  function start(v) {
    v.volume = 1;
    v.muted = !active();
    const p = v.play();
    if (p && p.catch) p.catch(() => { v.muted = true; v.play().catch(() => {}); });
  }

  const play = new IntersectionObserver(es => es.forEach(e => {
    const it = e.target, v = it.querySelector('video');
    if (!v) return;
    const vis = e.isIntersecting && e.intersectionRatio >= 0.7;
    it.dataset.vis = vis ? '1' : '0';
    if (!vis) return;
    setTimeout(() => {
      if (it.dataset.vis !== '1' || !it.isConnected || it.classList.contains('paused')) return;
      if (v.paused) start(v); else if (v.muted && active()) { v.muted = false; v.play().catch(() => {}); }
    }, 300);
  }), { threshold: [0, 0.7] });

  // أول لمسة (نقرة) تفتح الصوت لكل الفيديوهات، وتبقى مفتوحة
  function unlock(e) {
    if (unlocked) return;
    unlocked = true;
    document.querySelectorAll('.tt-i video').forEach(v => { v.volume = 1; v.muted = false; });
    const it = document.querySelector('.tt-i[data-vis="1"]'), v = it && it.querySelector('video');
    if (!v) return;
    const wasPlaying = !v.paused;
    if (v.paused && !it.classList.contains('paused')) v.play().catch(() => {});
    // أول نقرة على الفيديو لا توقفه
    if (e.target && e.target.closest && e.target.closest('.tt-m') && wasPlaying) {
      setTimeout(() => { if (v.paused) { it.classList.remove('paused'); v.muted = false; v.play().catch(() => {}); } }, 340);
    }
  }
  ['click', 'touchend', 'pointerup', 'keydown'].forEach(t => document.addEventListener(t, unlock, { capture: true, passive: true }));

  function scan() {
    document.querySelectorAll('.tt-i:not([data-vp])').forEach(it => {
      it.dataset.vp = '1';
      const v = it.querySelector('video');
      if (!v) return;
      v.removeAttribute('muted');
      v.defaultMuted = false;
      v.volume = 1;
      v.poster = GIF;
      v.controls = false;
      v.disablePictureInPicture = true;
      v.setAttribute('webkit-playsinline', '');
      v.setAttribute('x5-playsinline', '');
      v.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
      v.preload = 'metadata';
      pre.observe(it);
      play.observe(it);
    });
  }
  const root = document.getElementById('app');
  if (root) new MutationObserver(() => { clearTimeout(timer); timer = setTimeout(scan, 100); }).observe(root, { childList: true, subtree: true });

  // إلغاء الصورة الرمادية الافتراضية لكل فيديو في التطبيق (مهما كان مكانه)
  const fixAll = () => document.querySelectorAll('video:not([data-np])').forEach(v => {
    v.dataset.np = '1';
    if (!v.getAttribute('poster')) v.setAttribute('poster', GIF);
  });
  const st2 = document.createElement('style');
  st2.textContent = 'video{background:#000}.pt video,.in-th video,.pc video{background:#111}';
  document.head.appendChild(st2);
  fixAll();
  new MutationObserver(fixAll).observe(document.documentElement, { childList: true, subtree: true });
})();