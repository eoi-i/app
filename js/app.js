App.start = async function (user) {
  App.state.user = user;
  const p = await App.loadProfile();
  if (!p) { App.toast('تعذر تحميل حسابك', 'err'); await App.sb.auth.signOut(); return; }
  if (p.is_banned) { await App.sb.auth.signOut(); App.toast('هذا الحساب محظور', 'err'); return; }
  if (App.accounts) App.accounts.remember(p);
  App.buildShell();
  if (!location.hash) history.replaceState(null, '', '#/home');
  App.route();
};

(async function () {
  App.theme.init();
  App.sb.auth.onAuthStateChange((ev) => {
    if (ev === 'PASSWORD_RECOVERY') setTimeout(() => App.showAuth('recovery'), 0);
    if (ev === 'SIGNED_OUT') setTimeout(() => { App.state = {}; App.showAuth('login'); }, 0);
  });
  const { data } = await App.sb.auth.getSession();
  if (data.session) await App.start(data.session.user);
  else App.showAuth('login');
})();