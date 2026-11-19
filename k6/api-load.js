// اختبار ضغط للـAPI (Supabase REST/RPC) بحمل متصاعد.
// التشغيل:  k6 run -e SUPABASE_URL=... -e ANON_KEY=... -e EMAIL=... -e PASSWORD=... k6/api-load.js
// ⚠️ شغّله على مشروع اختبار منفصل وليس الحقيقي.
import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate } from 'k6/metrics';

const URL = __ENV.SUPABASE_URL, KEY = __ENV.ANON_KEY;
const feedT = new Trend('feed_ms', true), searchT = new Trend('search_ms', true), errs = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 10 }, { duration: '2m', target: 50 }, { duration: '2m', target: 100 },
    { duration: '2m', target: 200 }, { duration: '2m', target: 400 }, { duration: '1m', target: 0 }
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<800'],
    feed_ms: ['p(95)<900'], search_ms: ['p(95)<700'], errors: ['rate<0.02']
  }
};

export function setup() {
  const r = http.post(`${URL}/auth/v1/token?grant_type=password`, JSON.stringify({ email: __ENV.EMAIL, password: __ENV.PASSWORD }), { headers: { apikey: KEY, 'Content-Type': 'application/json' } });
  if (r.status !== 200) throw new Error('فشل تسجيل الدخول في setup: ' + r.status);
  return { token: r.json('access_token') };
}

const H = t => ({ headers: { apikey: KEY, Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' } });
const words = ['بغداد', 'عراق', 'تجريبي', 'ali', 'cafe', 'a'];

export default function (d) {
  const h = H(d.token);
  group('feed', () => {
    const r = http.post(`${URL}/rest/v1/rpc/feed_foryou`, JSON.stringify({ p_limit: 20, p_offset: 0, p_seed: __VU, p_media: null }), h);
    feedT.add(r.timings.duration); errs.add(!check(r, { 'feed 200': x => x.status === 200 }));
  });
  sleep(1);
  group('search', () => {
    const w = words[Math.floor(Math.random() * words.length)];
    const a = http.post(`${URL}/rest/v1/rpc/search_accounts_ranked`, JSON.stringify({ term: w, lim: 30 }), h);
    const p = http.post(`${URL}/rest/v1/rpc/search_posts_ranked`, JSON.stringify({ term: w, lim: 60 }), h);
    searchT.add(a.timings.duration); searchT.add(p.timings.duration);
    errs.add(!check(a, { 'accounts 200': x => x.status === 200 })); errs.add(!check(p, { 'posts 200': x => x.status === 200 }));
  });
  sleep(1);
  group('explore', () => {
    const t = http.post(`${URL}/rest/v1/rpc/trending_posts`, JSON.stringify({ p_hours: 336, p_limit: 60, p_media: null }), h);
    const g = http.post(`${URL}/rest/v1/rpc/trending_hashtags`, JSON.stringify({ lim: 10 }), h);
    errs.add(!check(t, { 'trending 200': x => x.status === 200 })); errs.add(!check(g, { 'hashtags 200': x => x.status === 200 }));
  });
  sleep(2);
}
