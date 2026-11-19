/* تعدد الحسابات (مثل تيك توك): إضافة حسابات والتبديل بينها من ملفي الشخصي بالضغط على الاسم */
(function () {
  const A = App, KEY = 'ani_accounts_v1', MAX = 5;
  let adding = false;

  const load = () => { try { const a = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } };
  const save = l => { try { localStorage.setItem(KEY, JSON.stringify(l)); } catch (e) {} };
  const curId = () => (A.state && A.state.user && A.state.user.id) || null;

  function upsert(id, patch) {
    if (!id) return;
    const l = load(), i = l.findIndex(x => x.id === id);
    if (i >= 0) l[i] = Object.assign({}, l[i], patch);
    else if (l.length < MAX + 3) l.push(Object.assign({ id }, patch));
    save(l);
  }

  // تحديث الرموز كلما جدّدها supabase (لا نستدعي أي دالة supabase هنا حتى لا يحصل تعليق)
  A.sb.auth.onAuthStateChange((ev, s) => {
    if (s && s.user && /SIGNED_IN|TOKEN_REFRESHED|USER_UPDATED/.test(ev)) upsert(s.user.id, { access_token: s.access_token, refresh_token: s.refresh_token });
  });

  // تسجيل الخروج العادي: نحذف الحساب الحالي من القائمة ثم ننتقل لحساب آخر محفوظ إن وُجد
  const origSignOut = A.sb.auth.signOut.bind(A.sb.auth);
  A.sb.auth.signOut = async function (opts) {
    if (opts && (opts.scope === 'global' || opts.scope === 'others')) return origSignOut(opts);
    const uid = curId();
    if (uid) save(load().filter(x => x.id !== uid));
    const rest = load();
    const r = await origSignOut(opts);
    for (const n of rest) {
      try {
        const { data, error } = await A.sb.auth.setSession({ access_token: n.access_token, refresh_token: n.refresh_token });
        if (!error && data && data.session) { location.hash = '#/home'; location.reload(); return r; }
      } catch (e) {}
      save(load().filter(x => x.id !== n.id));
    }
    return r;
  };

  async function switchTo(id) {
    const a = load().find(x => x.id === id);
    if (!a || id === curId()) return;
    A.toast('جارٍ التبديل…');
    try {
      const { data, error } = await A.sb.auth.setSession({ access_token: a.access_token, refresh_token: a.refresh_token });
      if (error || !data || !data.session) throw error || new Error('x');
      location.hash = '#/home'; location.reload();
    } catch (e) {
      save(load().filter(x => x.id !== id));
      A.toast('انتهت جلسة هذا الحساب، أضِفه من جديد', 'err');
    }
  }

  function openSheet() {
    const list = load(), me = curId();
    const row = a => `<div class="ac-row" data-id="${A.esc(a.id)}" role="button">
      ${A.avatar({ avatar_url: a.avatar_url, display_name: a.display_name, username: a.username }, 46)}
      <div class="ac-t"><b>${A.esc(a.display_name || a.username || 'حساب')}</b><span dir="ltr">@${A.esc(a.username || '')}</span></div>
      ${a.id === me ? `<span class="ac-ok">${A.icon('check')}</span>` : `<button class="ac-x" data-rm="${A.esc(a.id)}" aria-label="إزالة من هذا الجهاز">✕</button>`}</div>`;
    const sh = A.sheet(`<h3 style="text-align:center">تبديل الحساب</h3>
      <div class="ac-list">${list.map(row).join('') || '<div class="empty">لا توجد حسابات محفوظة</div>'}</div>
      <button class="btn ghost block" id="ac-add">+ إضافة حساب</button>
      <div class="ac-note">الحسابات المضافة تبقى محفوظة على هذا الجهاز فقط.</div>`);
    sh.el.addEventListener('click', e => {
      const rm = e.target.closest('[data-rm]');
      if (rm) { e.stopPropagation(); save(load().filter(x => x.id !== rm.dataset.rm)); sh.close(); openSheet(); return; }
      if (e.target.closest('#ac-add')) {
        if (load().length >= MAX) return A.toast('الحد الأقصى ' + MAX + ' حسابات', 'err');
        sh.close(); addAccount(); return;
      }
      const r = e.target.closest('.ac-row');
      if (r) { sh.close(); switchTo(r.dataset.id); }
    });
  }

  function addAccount() { adding = true; A.showAuth('login'); }

  A.accounts = {
    list: load, openSheet, switchTo,
    adding: () => adding,
    cancel: () => { adding = false; location.reload(); },
    done: () => { adding = false; location.hash = '#/home'; location.reload(); },
    remember(p) {
      if (!p || !p.id) return;
      A.sb.auth.getSession().then(({ data }) => {
        const s = data && data.session;
        upsert(p.id, { username: p.username, display_name: p.display_name, avatar_url: p.avatar_url || null,
          access_token: s ? s.access_token : undefined, refresh_token: s ? s.refresh_token : undefined });
      }).catch(() => {});
    }
  };

  // الضغط على اسمي في ملفي الشخصي يفتح قائمة التبديل (يظهر فقط في ملفي لأن زر «تعديل الملف» موجود فيه)
  document.addEventListener('click', e => {
    if (e.target.closest('.ig-nm') && document.getElementById('pf-edit')) openSheet();
  });

  const st = document.createElement('style');
  st.textContent = `body:has(#pf-edit) .ig-nm{cursor:pointer}
body:has(#pf-edit) .ig-nm::after{content:'';width:7px;height:7px;border:solid currentColor;border-width:0 2px 2px 0;transform:rotate(45deg);margin-inline-start:6px;margin-top:-3px;opacity:.65}
.ac-list{display:flex;flex-direction:column;gap:4px;margin-bottom:8px}
.ac-row{display:flex;align-items:center;gap:12px;padding:10px 6px;border-radius:14px;cursor:pointer}
.ac-row:active{background:var(--line)}
.ac-t{flex:1;min-width:0;display:flex;flex-direction:column}.ac-t b{font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ac-t span{color:var(--muted);font-size:13px;text-align:right}
.ac-ok{width:26px;height:26px;border-radius:50%;background:var(--primary);color:#fff;display:grid;place-items:center}.ac-ok svg{width:16px;height:16px}
.ac-x{width:30px;height:30px;border-radius:50%;color:var(--muted);font-size:14px;display:grid;place-items:center}
.ac-note{text-align:center;color:var(--muted);font-size:12px;margin-top:10px}`;
  document.head.appendChild(st);
})();
