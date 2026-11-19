// خادم Supabase وهمي داخل المتصفح (لا يلمس البيانات الحقيقية)
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..', '..');
const nm = p => path.join(root, 'node_modules', p);

const b64u = o => Buffer.from(JSON.stringify(o)).toString('base64url');
const jwt = (id, email, ttl = 3600) => b64u({ alg: 'HS256', typ: 'JWT' }) + '.' + b64u({ sub: id, email, aud: 'authenticated', role: 'authenticated', exp: Math.floor(Date.now() / 1000) + ttl }) + '.sig';
const userObj = u => ({ id: u.id, aud: 'authenticated', role: 'authenticated', email: u.email, app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() });

async function mockBackend(page, opts = {}) {
  const db = { users: {}, calls: [], profiles: [], ...opts };
  const SB = 'https://dvunleuelvwzhtxowzxi.supabase.co';
  const json = (route, body, status = 200, headers = {}) => route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*', ...headers }, body: JSON.stringify(body) });
  const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' };

  // مكتبات CDN من node_modules (الشبكة الخارجية غير متاحة/غير مرغوبة في الاختبار)
  await page.route('**/cdn.jsdelivr.net/**', route => {
    const u = route.request().url();
    let f = null;
    if (u.includes('591.supabase.js')) f = nm('@supabase/supabase-js/dist/umd/591.supabase.js');
    else if (u.includes('supabase')) f = nm('@supabase/supabase-js/dist/umd/supabase.js');
    else if (u.includes('qrcode')) f = nm('qrcode-generator/qrcode.js');
    if (!f) return route.fulfill({ status: 404, body: '' });
    route.fulfill({ status: 200, contentType: 'application/javascript', headers: cors, body: fs.readFileSync(f) });
  });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));

  await page.route(SB + '/**', async route => {
    const req = route.request(), url = new URL(req.url()), p = url.pathname, m = req.method();
    if (m === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    let body = {}; try { body = req.postDataJSON() || {}; } catch (_) {}
    db.calls.push({ m, p, body });

    if (p === '/functions/v1/signup') {
      if (db.users[body.email]) return json(route, { error: 'exists' }, 409);
      db.users[body.email] = { id: '00000000-0000-4000-8000-00000000000' + (Object.keys(db.users).length + 1), ...body };
      db.profiles.push({ id: db.users[body.email].id, username: body.username, display_name: body.display_name, followers_count: 0, following_count: 0, posts_count: 0, is_banned: false });
      return json(route, { ok: true });
    }
    if (p === '/auth/v1/signup') {
      const md = body.data || {};
      if (db.users[body.email]) return json(route, { id: 'x', identities: [] });
      db.users[body.email] = { id: '00000000-0000-4000-8000-0000000000f' + (Object.keys(db.users).length + 1), email: body.email, password: body.password, username: md.username };
      db.profiles.push({ id: db.users[body.email].id, username: md.username, display_name: md.display_name, followers_count: 0, following_count: 0, posts_count: 0, is_banned: false });
      return json(route, { id: db.users[body.email].id, email: body.email, identities: [{}] });
    }
    if (p === '/auth/v1/token') {
      const grant = url.searchParams.get('grant_type');
      let u;
      if (grant === 'refresh_token') u = Object.values(db.users).find(x => 'r-' + x.id === body.refresh_token);
      else { u = db.users[body.email]; if (!u || u.password !== body.password) return json(route, { error: 'invalid_grant', error_description: 'Invalid login credentials', msg: 'Invalid login credentials' }, 400); }
      if (!u) return json(route, { error: 'invalid_grant', error_description: 'Invalid Refresh Token', msg: 'Invalid Refresh Token' }, 400);
      const now = Math.floor(Date.now() / 1000);
      return json(route, { access_token: jwt(u.id, u.email), token_type: 'bearer', expires_in: 3600, expires_at: now + 3600, refresh_token: 'r-' + u.id, user: userObj(u) });
    }
    if (p === '/auth/v1/logout') { db.loggedOut = true; return route.fulfill({ status: 204, headers: cors }); }
    if (p === '/auth/v1/user') {
      const t = (req.headers()['authorization'] || '').replace('Bearer ', '');
      try { const pl = JSON.parse(Buffer.from(t.split('.')[1], 'base64url').toString()); const u = Object.values(db.users).find(x => x.id === pl.sub); if (u) return json(route, userObj(u)); } catch (_) {}
      return json(route, { msg: 'invalid' }, 401);
    }
    if (p.startsWith('/rest/v1/rpc/')) {
      const fn = p.split('/').pop();
      if (fn === 'search_accounts_ranked') {
        const t = String(body.term || '').toLowerCase();
        return json(route, db.profiles.filter(x => x.username.toLowerCase().includes(t) || (x.display_name || '').toLowerCase().includes(t)));
      }
      return json(route, []);
    }
    if (p === '/rest/v1/profiles') {
      const single = /vnd\.pgrst\.object/.test(req.headers()['accept'] || '');
      const id = (url.searchParams.get('id') || '').replace('eq.', '');
      const un = (url.searchParams.get('username') || '').replace('eq.', '');
      const rows = id ? db.profiles.filter(x => x.id === id) : un ? db.profiles.filter(x => x.username === un) : db.profiles;
      if (single) return rows[0] ? json(route, rows[0]) : json(route, { message: 'none' }, 406);
      return json(route, rows);
    }
    if (p.startsWith('/rest/v1/')) {
      const single = /vnd\.pgrst\.object/.test(req.headers()['accept'] || '');
      return single ? json(route, null, 406) : json(route, [], 200, { 'content-range': '*/0' });
    }
    if (p.startsWith('/realtime') || p.startsWith('/storage')) return json(route, {});
    return json(route, {});
  });
  return db;
}
module.exports = { mockBackend };
