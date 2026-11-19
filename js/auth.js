(function () {
  const A = App;

  function err(e) {
    const m = (e && e.message) || '';
    if (/Invalid login/i.test(m)) return 'البريد أو كلمة المرور غير صحيحة';
    if (/already registered|already been registered/i.test(m)) return 'هذا البريد مسجّل مسبقاً';
    if (/at least 6|weak/i.test(m)) return 'كلمة المرور ضعيفة (6 أحرف على الأقل)';
    if (/rate limit|too many|over_/i.test(m)) return 'الخدمة مشغولة لحظة، جرّب مرة ثانية';
    if (m === 'exists') return 'هذا البريد مسجّل مسبقاً';
    if (m === 'busy') return 'محاولات تسجيل كثيرة من هذا الجهاز، جرّب بعد ساعة';
    if (m === 'forbidden') return 'تعذر إنشاء الحساب من هذا الموقع';
    if (m === 'invalid_username') return 'اسم المستخدم: 3-30 حرفاً إنجليزياً أو أرقاماً أو _ .';
    if (/not confirmed/i.test(m)) return 'فعّل بريدك من الرسالة المرسلة إليك أولاً';
    if (/valid email|invalid format/i.test(m)) return 'البريد الإلكتروني غير صحيح';
    if (/provider|sms|twilio|not enabled|disabled|unsupported/i.test(m)) return 'الدخول بالهاتف غير مفعّل بعد في إعدادات الخادم';
    if (/token has expired|expired|invalid.*(otp|token|code)|otp/i.test(m)) return 'الرمز غير صحيح أو انتهت صلاحيته';
    if (/phone/i.test(m) && /invalid|format/i.test(m)) return 'رقم الهاتف غير صحيح';
    if (/network|fetch|failed to send|FunctionsFetch|load failed/i.test(m)) return 'تحقق من اتصال الإنترنت';
    return 'حدث خطأ، حاول مرة أخرى';
  }

  const EYE = '<svg class="ic e1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg><svg class="ic e2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17.9 17.9A10.1 10.1 0 0112 19c-6.5 0-10-7-10-7a17.6 17.6 0 014.1-5M9.9 5.2A9.7 9.7 0 0112 5c6.5 0 10 7 10 7a17.6 17.6 0 01-2.2 3.2M1 1l22 22"/></svg>';
  const F = (id, label, type, ph, ac) =>
    `<div class="field"><label for="${id}">${label}</label>${type === 'password'
      ? `<div class="pw-w"><input id="${id}" type="password" placeholder="${ph || ''}" autocomplete="${ac || 'off'}" dir="ltr"><button type="button" class="pw-eye" data-eye aria-label="إظهار كلمة المرور">${EYE}</button></div>`
      : `<input id="${id}" type="${type}" placeholder="${ph || ''}" autocomplete="${ac || 'off'}" ${type === 'email' ? 'dir="ltr"' : ''}>`}</div>`;
  const RULES = ['8 أحرف على الأقل', 'رقم', 'رمز (!@#...)', 'حروف كبيرة وصغيرة'];
  const METER = '<div class="pw-m"><div class="pw-s"><i></i><i></i><i></i><i></i></div><span class="pw-l"></span></div>' +
    '<div class="pw-r">' + RULES.map(r => `<div><b><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></b>${r}</div>`).join('') + '</div>';
  const TOS = '<div class="tos"><button type="button" class="tos-box" id="tos-box" role="checkbox" aria-checked="false" aria-label="الموافقة على الشروط"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-10"/></svg></button><span class="tos-t">أوافق على الشروط وسياسة الاستخدام</span><button type="button" class="tos-q" id="tos-q" aria-label="عرض الشروط">?</button></div>';
  const LEGAL = [
    ['الشروط والأحكام', ['باستخدامك «أني عراقي» فإنك توافق على هذه الشروط.', 'يجب ألا يقل عمرك عن 13 عاماً، وأن تقدّم بيانات صحيحة، وأنت مسؤول عن سرية كلمة المرور وعن نشاط حسابك.', 'تبقى ملكية ما تنشره لك، وتمنحنا ترخيصاً غير حصري لعرضه وتخزينه داخل التطبيق لتشغيل الخدمة.', 'يُمنع انتحال الشخصيات، التحرش والتهديد، خطاب الكراهية، العنف، المحتوى الجنسي أو استغلال القاصرين، الاحتيال والرسائل المزعجة، ومحاولات اختراق التطبيق.', 'يحق للإدارة إزالة المحتوى المخالف وتقييد الحسابات أو إيقافها، ويمكنك حذف حسابك في أي وقت من الإعدادات.', 'قد نحدّث الشروط من وقت لآخر، واستمرارك بالاستخدام يعني قبولك للنسخة المحدّثة.']],
    ['سياسة الخصوصية', ['نجمع بريدك واسم المستخدم والاسم والصورة والنبذة وما تنشره وتفاعلاتك وبيانات الجلسة لحماية حسابك.', 'نستخدمها لتشغيل الخدمة وعرض المحتوى والإشعارات وحماية الحسابات وتحسين التجربة.', 'لا نبيع بياناتك. المنشورات العامة تظهر للجميع، وتتحكم أنت بباقي خصوصيتك من الإعدادات.', 'يمكنك جعل حسابك خاصاً، وحظر الحسابات، وتنزيل نسخة من بياناتك، وحذف حسابك نهائياً.']],
    ['إرشادات المجتمع', ['احترم الآخرين ولا للإهانة والتنمر.', 'لا للتحريض على الكراهية أو العنف.', 'احمِ القاصرين، وأي استغلال لهم يُحذف ويُبلَّغ عنه فوراً.', 'كن صادقاً: لا تنتحل ولا تنشر معلومات مضللة.']]
  ];
  const go = u => (A.accounts && A.accounts.adding()) ? A.accounts.done() : A.start(u);
  const checks = p => [p.length >= 8, /\d/.test(p), /[^A-Za-z0-9\u0600-\u06FF\s]/.test(p), /[a-z]/.test(p) && /[A-Z]/.test(p)];
  const LV = [['', '#888'], ['ضعيفة', '#E5484D'], ['متوسطة', '#F59E0B'], ['جيدة', '#84CC16'], ['قوية', '#16A34A']];
  const st = document.createElement('style');
  st.textContent = `.pw-w{position:relative}.pw-w input{padding-left:14px;padding-right:50px;text-align:left}.pw-eye{position:absolute;right:6px;left:auto;top:50%;transform:translateY(-50%);width:38px;height:38px;display:grid;place-items:center;color:var(--muted)}.pw-eye .ic{width:21px;height:21px}.pw-eye .e2{display:none}.pw-eye.on .e1{display:none}.pw-eye.on .e2{display:block}.pw-eye.on{color:var(--primary)}
.pw-m{display:flex;align-items:center;gap:10px;margin:-2px 2px 10px}.pw-s{flex:1;display:flex;gap:5px}.pw-s i{flex:1;height:5px;border-radius:3px;background:var(--line);transition:background .25s}.pw-l{min-width:54px;text-align:end;font-size:12.5px;font-weight:800;transition:color .25s}
.pw-r{display:grid;grid-template-columns:1fr 1fr;gap:8px 10px;margin:0 2px 14px;font-size:12.5px;color:var(--muted)}.pw-r div{display:flex;align-items:center;gap:7px;transition:color .2s}.pw-r b{width:17px;height:17px;border-radius:50%;border:1.5px solid var(--line);display:grid;place-items:center;flex:none;transition:.2s;color:transparent}.pw-r b svg{width:11px;height:11px}.pw-r div.ok{color:var(--text)}.pw-r div.ok b{background:var(--ok,#16A34A);border-color:var(--ok,#16A34A);color:#fff}
.auth-card .btn[disabled]{opacity:.45}
.tos{display:flex;align-items:center;gap:10px;margin:0 2px 14px;font-size:13px}.tos-t{flex:1;color:var(--text)}
.tos-box{width:22px;height:22px;padding:0!important;min-width:0!important;border-radius:6px!important;border:1.8px solid var(--muted)!important;background:transparent!important;background-image:none!important;box-shadow:none!important;outline:none!important;-webkit-tap-highlight-color:transparent;display:grid;place-items:center;flex:none;color:transparent!important;transition:.2s}.tos-box svg{width:14px;height:14px}.tos-box.on{background:var(--primary)!important;border-color:var(--primary)!important;color:var(--on-primary,#fff)!important}
.tos-q{width:22px;height:22px;border-radius:50%;border:1.5px solid var(--muted);color:var(--muted);font-size:13px;font-weight:800;display:grid;place-items:center;flex:none;line-height:1}
.tos-doc h4{margin:14px 0 6px;color:var(--primary)}.tos-doc p{margin:0 0 7px;line-height:1.8;font-size:13.5px}`;
  document.head.appendChild(st);

  const MODES = {
    login: { t: 'تسجيل الدخول', b: 'دخول',
      f: F('email', 'البريد الإلكتروني', 'email', 'name@email.com', 'email') + F('password', 'كلمة المرور', 'password', '••••••', 'current-password'),
      l: '<a data-m="forgot">نسيت كلمة المرور؟</a><a data-m="signup">إنشاء حساب</a>' },
    signup: { t: 'إنشاء حساب جديد', b: 'إنشاء الحساب',
      f: F('display_name', 'الاسم', 'text', 'مثال: علي الموسوي', 'name') + F('username', 'اسم المستخدم (إنجليزي)', 'text', 'ali_iraq', 'username') +
         F('email', 'البريد الإلكتروني', 'email', 'name@email.com', 'email') + F('password', 'كلمة المرور', 'password', '••••••••', 'new-password') + METER + TOS,
      l: '<a data-m="login">لدي حساب بالفعل</a>' },
    forgot: { t: 'استعادة كلمة المرور', b: 'إرسال رابط الاستعادة',
      f: '<div class="note">اكتب بريدك وسنرسل لك رابطاً لتعيين كلمة مرور جديدة.</div>' + F('email', 'البريد الإلكتروني', 'email', 'name@email.com', 'email'),
      l: '<a data-m="login">رجوع لتسجيل الدخول</a>' },
    recovery: { t: 'كلمة مرور جديدة', b: 'حفظ كلمة المرور',
      f: F('password', 'كلمة المرور الجديدة', 'password', '••••••••', 'new-password') + METER, l: '' }
  };

  A.showAuth = function (mode = 'login') {
    const M = MODES[mode];
    document.getElementById('app').innerHTML = `
      <div class="auth">
        <div class="hero"><h1>أني عراقي</h1><p>منصتك العراقية للتواصل والإبداع</p></div>
        <div class="auth-card">
          ${mode === 'login' && A.accounts && A.accounts.adding() ? `<button type="button" id="au-cancel" aria-label="إلغاء" style="display:flex;align-items:center;gap:6px;color:var(--primary);font-weight:700;margin:0 0 10px">${A.icon('arrow')} رجوع لحسابي</button>` : ''}${mode === 'login' || mode === 'recovery' ? '' : `<button type="button" id="au-back" aria-label="عودة" style="display:flex;align-items:center;gap:6px;color:var(--primary);font-weight:700;margin:0 0 10px">${A.icon('arrow')}<span>عودة للصفحة الرئيسية</span></button>`}
          <h2>${M.t}</h2>
          <form id="af" novalidate>${M.f}<button class="btn block" type="submit">${M.b}</button></form>
          <div class="links">${M.l}</div>
        </div>
      </div>`;
    const cn = document.getElementById('au-cancel'); if (cn) cn.onclick = () => A.accounts.cancel();
    const bk = document.getElementById('au-back'); if (bk) bk.onclick = () => A.showAuth('login');
    document.querySelectorAll('.auth-card [data-m]').forEach(a => a.onclick = () => A.showAuth(a.dataset.m));
    const form = document.getElementById('af'), sbtn = form.querySelector('button[type=submit]');
    form.querySelectorAll('[data-eye]').forEach(b => b.onclick = () => {
      const i = b.parentNode.querySelector('input'), show = i.type === 'password';
      i.type = show ? 'text' : 'password'; b.classList.toggle('on', show); i.focus();
    });
    const strong = mode === 'signup' || mode === 'recovery';
    let agreed = false;
    const tb = document.getElementById('tos-box');
    if (tb) {
      tb.onclick = () => { agreed = !agreed; tb.classList.toggle('on', agreed); tb.setAttribute('aria-checked', agreed); upd(); };
      document.getElementById('tos-q').onclick = () => {
        const sh = A.sheet(`<div class="tos-doc"><h3 style="margin:0">الشروط وسياسة الاستخدام</h3>${LEGAL.map(([t, ps]) => `<h4>${t}</h4>${ps.map(x => `<p>${x}</p>`).join('')}`).join('')}<button class="btn block" data-agree style="margin-top:12px">موافق</button></div>`, { tall: true });
        sh.el.addEventListener('click', e => {
          if (!e.target.closest('[data-agree]')) return;
          agreed = true; tb.classList.add('on'); tb.setAttribute('aria-checked', 'true'); upd(); sh.close();
        });
      };
    }
    const upd = () => {
      if (!strong) return;
      const p = (document.getElementById('password') || {}).value || '', c = checks(p), n = c.filter(Boolean).length;
      const lv = p ? Math.max(1, c[0] ? n : Math.min(n, 1)) : 0, L = LV[lv];
      form.querySelectorAll('.pw-s i').forEach((x, i) => { x.style.background = i < lv ? L[1] : ''; });
      const lb = form.querySelector('.pw-l'); lb.textContent = L[0]; lb.style.color = L[1];
      form.querySelectorAll('.pw-r div').forEach((d, i) => d.classList.toggle('ok', c[i]));
      sbtn.disabled = !(c[0] && n >= 3 && (mode !== 'signup' || agreed));
    };
    if (strong) { document.getElementById('password').addEventListener('input', upd); upd(); }
    form.onsubmit = async e => {
      e.preventDefault();
      const v = id => (document.getElementById(id) || {}).value?.trim() || '';
      sbtn.disabled = true; sbtn.classList.add('ld');
      try { await submit(mode, v); } catch (x) { A.toast(err(x), 'err'); }
      sbtn.classList.remove('ld'); sbtn.disabled = false; upd();
    };
  };

  async function submit(mode, v) {
    const sb = A.sb;
    if (mode === 'login') {
      if (!v('email') || !v('password')) return A.toast('أدخل البريد وكلمة المرور', 'err');
      let r = await sb.auth.signInWithPassword({ email: v('email'), password: v('password') });
      if (r.error && /rate limit|too many|over_/i.test(r.error.message || '')) { await new Promise(z => setTimeout(z, 2500)); r = await sb.auth.signInWithPassword({ email: v('email'), password: v('password') }); }
      if (r.error) throw r.error;
      await go(r.data.user);
    } else if (mode === 'signup') {
      if (!document.getElementById('tos-box').classList.contains('on')) return A.toast('وافق على الشروط وسياسة الاستخدام أولاً', 'err');
      if (!v('display_name')) return A.toast('اكتب اسمك', 'err');
      if (!/^[a-zA-Z0-9_.]{3,30}$/.test(v('username'))) return A.toast('اسم المستخدم: 3-30 حرفاً إنجليزياً أو أرقاماً أو _ .', 'err');
      if (!v('email')) return A.toast('أدخل بريدك الإلكتروني', 'err');
      if (v('password').length < 8) return A.toast('كلمة المرور 8 أحرف على الأقل', 'err');
      // إنشاء الحساب عبر الخادم بدون رسائل بريد، وإذا تعذر الوصول للدالة نستخدم التسجيل المباشر كمسار بديل
      const body = { email: v('email'), password: v('password'), username: v('username'), display_name: v('display_name') };
      const { data: fr, error: fe } = await sb.functions.invoke('signup', { body });
      let code = fr && fr.error, netFail = false;
      if (fe && !code) {
        try { code = (await fe.context.json()).error; } catch (_) { netFail = true; code = 'failed'; }
      }
      if (code && (netFail || code === 'failed')) {
        const f = await sb.auth.signUp({ email: body.email, password: body.password, options: { data: { username: body.username.toLowerCase(), display_name: body.display_name } } });
        if (f.error) throw f.error;
        if (f.data && f.data.user && Array.isArray(f.data.user.identities) && f.data.user.identities.length === 0) throw new Error('exists');
        if (f.data && f.data.session) return await go(f.data.session.user);
        code = null;
      }
      if (code) throw new Error(code);
      const r = await sb.auth.signInWithPassword({ email: v('email'), password: v('password') });
      if (r.error) { A.toast('تم إنشاء الحساب، سجّل الدخول', 'ok'); return A.showAuth('login'); }
      await go(r.data.user);
    } else if (mode === 'forgot') {
      if (!v('email')) return A.toast('أدخل بريدك الإلكتروني', 'err');
      const { error } = await sb.auth.resetPasswordForEmail(v('email'), { redirectTo: location.href.split('#')[0] });
      if (error && !/rate limit|too many|over_/i.test(error.message || '')) throw error;
      A.toast(error ? 'تم طلب الرابط قبل قليل، افحص بريدك (والبريد المزعج) أو حاول بعد دقيقة' : 'تم إرسال رابط الاستعادة إلى بريدك', 'ok');
      A.showAuth('login');
    } else if (mode === 'recovery') {
      if (v('password').length < 8) return A.toast('كلمة المرور 8 أحرف على الأقل', 'err');
      const { data, error } = await sb.auth.updateUser({ password: v('password') });
      if (error) throw error;
      A.toast('تم تغيير كلمة المرور', 'ok');
      await go(data.user);
    }
  }
})();