/* أذونات التطبيق: الإشعارات، الكاميرا، الميكروفون — صفحة في الإعدادات + طلب إذن الإشعارات أول مرة */
(function () {
  const A = App, R = A.rt;
  const LS = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  Object.assign(A.icons, {
    bell: A.icons.bell || '<path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/>',
    camera: '<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>',
    mic: '<path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/>'
  });

  const ITEMS = [
    { k: 'notifications', ic: 'bell', t: 'الإشعارات', d: 'تنبيهك بالإعجابات والتعليقات والمتابعات والرسائل' },
    { k: 'camera', ic: 'camera', t: 'الكاميرا', d: 'لتصوير الصور والفيديو عند النشر' },
    { k: 'microphone', ic: 'mic', t: 'الميكروفون', d: 'لتسجيل الفيديو بالصوت والرسائل الصوتية' }
  ];
  const LBL = { granted: ['مسموح', 'var(--primary)'], denied: ['مرفوض', '#E5484D'], prompt: ['لم يُطلب بعد', 'var(--muted)'], unsupported: ['غير مدعوم', 'var(--muted)'] };

  async function state(k) {
    try {
      if (k === 'notifications') {
        if (!('Notification' in window)) return 'unsupported';
        return Notification.permission === 'default' ? 'prompt' : Notification.permission;
      }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return 'unsupported';
      if (navigator.permissions && navigator.permissions.query) {
        const r = await navigator.permissions.query({ name: k });
        return r.state;
      }
    } catch (e) {}
    return 'prompt';
  }

  async function ask(k) {
    if (k === 'notifications') {
      if (!('Notification' in window)) return 'unsupported';
      const r = await Notification.requestPermission();
      return r === 'default' ? 'prompt' : r;
    }
    try {
      const st = await navigator.mediaDevices.getUserMedia(k === 'camera' ? { video: true } : { audio: true });
      st.getTracks().forEach(t => t.stop());
      return 'granted';
    } catch (e) {
      return /NotAllowed|Permission/i.test(e && e.name) ? 'denied' : (/NotFound/i.test(e && e.name) ? 'unsupported' : 'denied');
    }
  }

  async function draw(body) {
    const sts = await Promise.all(ITEMS.map(i => state(i.k)));
    body.innerHTML = '<div class="set-sec">أذونات التطبيق</div><div class="set-card">' + ITEMS.map((i, n) => {
      const s = sts[n], l = LBL[s] || LBL.prompt;
      return `<button class="sr" data-k="${i.k}"><span class="sr-i">${A.icon(i.ic)}</span><span class="sr-l">${i.t}<span class="sr-s">${i.d}</span></span>
        <span class="sr-v" style="color:${l[1]};font-weight:700">${s === 'prompt' ? 'السماح' : l[0]}</span></button>`;
    }).join('') + '</div><div class="set-note">إذا رفضت إذناً سابقاً، فعّله من إعدادات الهاتف ← التطبيقات ← أني عراقي ← الأذونات، ثم ارجع هنا.</div>';
    body.onclick = async e => {
      const r = e.target.closest('.sr'); if (!r) return;
      const k = r.dataset.k, cur = sts[ITEMS.findIndex(x => x.k === k)];
      if (cur === 'granted') return A.toast('هذا الإذن مفعّل', 'ok');
      if (cur === 'denied') return A.toast('الإذن مرفوض: فعّله من إعدادات الهاتف ← التطبيقات ← الأذونات', 'err');
      if (cur === 'unsupported') return A.toast('جهازك لا يدعم هذا الإذن', 'err');
      const res = await ask(k);
      A.toast(res === 'granted' ? 'تم تفعيل الإذن' : 'لم يتم منح الإذن', res === 'granted' ? 'ok' : 'err');
      draw(body);
    };
  }

  // صفحة الإعدادات + سطر «أذونات التطبيق» في القائمة الرئيسية
  const prev = A.pages.settings.render;
  A.pages.settings.render = function (view, param) {
    if ((param || '').split('/')[0] === 'permissions') {
      view.innerHTML = `<div class="set"><div class="set-head"><button class="icon-btn" id="s-back" aria-label="رجوع">${A.icon('arrow')}</button><h1>أذونات التطبيق</h1></div><div class="set-body" id="s-body"></div></div>`;
      view.querySelector('#s-back').onclick = () => { location.hash = '#/settings'; };
      return draw(view.querySelector('#s-body'));
    }
    const r = prev.apply(this, arguments);
    if (!(param || '')) {
      const sec = view.querySelector('.sr[data-k="security"]');
      if (sec && !view.querySelector('.sr[data-k="permissions"]')) {
        sec.insertAdjacentHTML('afterend', `<button class="sr" data-k="permissions"><span class="sr-i">${A.icon('bell')}</span><span class="sr-l">أذونات التطبيق</span><span class="sr-c">${A.icon('chev')}</span></button>`);
      }
    }
    return r;
  };

  // إشعار نظام عند وصول إشعار جديد والتطبيق بالخلفية (يعمل ما دام التطبيق مفتوحاً في الخلفية؛ الإشعار وهو مغلق كلياً يحتاج خادم Push)
  async function systemNotify(n) {
    if (!document.hidden || !('Notification' in window) || Notification.permission !== 'granted') return;
    let who = 'مستخدم';
    if (n.actor_id) { try { const { data } = await A.sb.from('profiles').select('display_name,username').eq('id', n.actor_id).maybeSingle(); if (data) who = data.display_name || data.username; } catch (e) {} }
    const opts = { body: `${who} ${R.TXT[n.type] || ''}`, icon: 'assets/icons/icon.svg', tag: 'ane-' + (n.id || Date.now()), data: { url: n.type === 'message' && n.conversation_id ? './index.html#/chat/' + n.conversation_id : './index.html#/notifications' } };
    try {
      const reg = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
      if (reg && reg.showNotification) return reg.showNotification('أني عراقي', opts);
      new Notification('أني عراقي', opts);
    } catch (e) {}
  }
  R.on('notification', n => { systemNotify(n); });

  // نافذة طلب إذن الإشعارات لأول مرة (بعد الدخول)
  const baseShell = A.buildShell;
  A.buildShell = function () {
    baseShell.apply(this, arguments);
    if (LS.get('perm_asked') || !('Notification' in window) || Notification.permission !== 'default') return;
    setTimeout(() => {
      if (!document.getElementById('app') || LS.get('perm_asked')) return;
      const sh = A.sheet(`<h3 style="text-align:center">فعّل الإشعارات</h3>
        <p style="text-align:center;color:var(--muted);line-height:1.8;margin:0 0 6px">حتى تعرف بالإعجابات والتعليقات والمتابعين والرسائل لحظة وصولها.</p>
        <button class="btn block" id="pm-yes">تفعيل الإشعارات</button><button class="btn ghost block" id="pm-no">لاحقاً</button>`);
      sh.el.addEventListener('click', async e => {
        if (e.target.closest('#pm-yes')) { LS.set('perm_asked', '1'); sh.close(); await ask('notifications'); }
        else if (e.target.closest('#pm-no')) { LS.set('perm_asked', '1'); sh.close(); }
      });
    }, 2500);
  };
})();
