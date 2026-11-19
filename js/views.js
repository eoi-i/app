(function () {
  const A = App;
  const done = new Set(), timers = new Map();

  // تحديث رقم المشاهدات في شبكة البروفايل مباشرة
  async function refreshTile(id) {
    try {
      const { data } = await A.sb.from('posts').select('views_count').eq('id', id).single();
      if (!data) return;
      const n = data.views_count || 0;
      const f = n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(1) + 'K' : String(n);
      document.querySelectorAll('.pt[data-pid="' + id + '"] .pt-v').forEach(v => {
        const tn = v.lastChild;
        if (tn && tn.nodeType === 3) tn.textContent = ' ' + f;
      });
    } catch (e) {}
  }

  A.recordView = id => {
    if (!id || done.has(id) || !A.state.user) return;
    done.add(id);
    A.sb.rpc('record_view', { p_post: id }).then(r => {
      if (r && r.error) { done.delete(id); console.error(r.error); return; }
      refreshTile(id);
    });
  };

  // الشاشة الرئيسية: تُحتسب المشاهدة بعد ثانية ونصف من ظهور المنشور
  const io = new IntersectionObserver(es => es.forEach(e => {
    const el = e.target;
    if (e.isIntersecting && e.intersectionRatio >= 0.7) {
      if (!timers.has(el)) timers.set(el, setTimeout(() => { timers.delete(el); A.recordView(el.dataset.id); }, 1500));
    } else if (timers.has(el)) { clearTimeout(timers.get(el)); timers.delete(el); }
  }), { threshold: [0, 0.7] });

  // تتبع وقت مشاهدة الفيديو: كل جلسة (إيقاف / نهاية دورة / مغادرة) تُسجَّل مرة واحدة
  const WS = new WeakMap();
  const wstate = v => { let w = WS.get(v); if (!w) { w = { acc: 0, last: 0, done: false, pid: null }; WS.set(v, w); } return w; };
  function flush(v) {
    const w = WS.get(v);
    if (!w) return;
    const ms = Math.round(w.acc * 1000), done = w.done, pid = w.pid;
    w.acc = 0; w.done = false;
    if (!pid || ms < 500 || !A.state.user) return;
    A.sb.rpc('record_watch', { p_post: pid, p_ms: Math.min(ms, 7200000), p_dur: Math.round((v.duration || 0) * 1000), p_done: done }).then(() => {});
  }
  const origPause = HTMLMediaElement.prototype.pause;
  HTMLMediaElement.prototype.pause = function () {
    try { if (this.tagName === 'VIDEO') flush(this); } catch (e) {}
    return origPause.apply(this, arguments);
  };
  document.addEventListener('timeupdate', e => {
    const v = e.target;
    if (!v || v.tagName !== 'VIDEO' || !v.duration) return;
    const w = wstate(v);
    if (!w.pid) { const host = v.closest('[data-id]'); w.pid = host ? host.dataset.id : null; }
    const cur = v.currentTime;
    if (cur + 0.5 < w.last && w.last >= v.duration * 0.8) { w.done = true; flush(v); }
    const d = cur - w.last;
    if (d > 0 && d < 1.2 && !v.paused) w.acc += d;
    if (cur >= v.duration * 0.9) w.done = true;
    w.last = cur;
  }, true);
  document.addEventListener('ended', e => { if (e.target && e.target.tagName === 'VIDEO') { const w = WS.get(e.target); if (w) w.done = true; flush(e.target); } }, true);
  window.addEventListener('pagehide', () => document.querySelectorAll('video').forEach(flush));

  let t = null;
  function scan() {
    document.querySelectorAll('.tt-i[data-id]:not([data-vo])').forEach(el => { el.dataset.vo = '1'; io.observe(el); });
    // المنشور المفتوح من الشبكة أو الاستكشاف
    document.querySelectorAll('.fx .post[data-id]:not([data-vo])').forEach(el => {
      el.dataset.vo = '1';
      setTimeout(() => { if (el.isConnected) A.recordView(el.dataset.id); }, 1500);
    });
  }
  const root = document.getElementById('app'), body = document.body;
  const mo = new MutationObserver(() => { clearTimeout(t); t = setTimeout(scan, 250); });
  if (root) mo.observe(root, { childList: true, subtree: true });
  mo.observe(body, { childList: true });
})();