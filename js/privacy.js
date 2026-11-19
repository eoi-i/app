(function () {
  const A = App;
  let busy = false, timer = null;
  Object.assign(A.icons, { lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>' });

  async function enhance() {
    if (busy || !A.state.user) return;
    const m = location.hash.match(/^#\/u\/([^/?]+)/);
    if (!m || !document.getElementById('pf-follow')) return;
    m[1] = decodeURIComponent(m[1]);
    busy = true;
    try {
      const { data: p } = await A.sb.from('profiles').select('id,is_private,followers_count').eq('username', m[1]).maybeSingle();
      if (!p || p.id === A.state.user.id) return;
      const { data: f } = await A.sb.from('follows').select('status').eq('follower_id', A.state.user.id).eq('following_id', p.id).maybeSingle();
      const st = f ? f.status : null;
      const fl = document.getElementById('st-fl');
      if (fl && fl.textContent !== String(p.followers_count)) fl.textContent = p.followers_count;
      const b = document.getElementById('pf-follow');
      if (b && p.is_private) {
        const label = st === 'pending' ? 'تم إرسال الطلب' : st === 'accepted' ? 'تتابعه ✓' : b.dataset.fm === '1' ? 'رد المتابعة' : 'طلب متابعة';
        if (b.textContent.trim() !== label) b.textContent = label;
        b.classList.toggle('ghost', !!st);
      }
      const box = document.getElementById('pf-list');
      if (box && p.is_private && st !== 'accepted' && !box.querySelector('.post,.mgrid,.lock-note,.sk')) {
        box.innerHTML = `<div class="lock-note">${A.icon('lock')}<b>هذا الحساب خاص</b><div>تابع الحساب لرؤية منشوراته</div></div>`;
      }
    } finally { busy = false; }
  }

  const root = document.getElementById('app');
  if (root) new MutationObserver(() => { clearTimeout(timer); timer = setTimeout(enhance, 250); }).observe(root, { childList: true, subtree: true });

  // أزرار المتابعة في الرئيسية والاستكشاف: إن كان الحساب خاصاً يصبح الطلب «معلّقاً»
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-follow]');
    if (!b || !A.state.user) return;
    const id = b.dataset.follow;
    setTimeout(async () => {
      const { data } = await A.sb.from('follows').select('status').eq('follower_id', A.state.user.id).eq('following_id', id).maybeSingle();
      if (data && data.status === 'pending' && b.isConnected) { b.textContent = 'تم إرسال الطلب'; b.classList.add('ghost'); }
    }, 1000);
  });
})();