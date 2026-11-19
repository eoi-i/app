App.sb = window.supabase.createClient(APP_CONFIG.SUPABASE_URL, APP_CONFIG.SUPABASE_KEY);

App.loadProfile = async () => {
  const { data, error } = await App.sb.from('profiles').select('*').eq('id', App.state.user.id).maybeSingle();
  if (error) console.error(error);
  App.state.profile = data;
  return data;
};