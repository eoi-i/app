// اختبار ضغط للصفحات الثابتة (Cloudflare). التشغيل: k6 run -e SITE_URL=https://xxx.workers.dev k6/pages.js
import http from 'k6/http';
import { check, sleep } from 'k6';
const SITE = __ENV.SITE_URL;
export const options = {
  stages: [{ duration: '30s', target: 50 }, { duration: '1m', target: 200 }, { duration: '1m', target: 500 }, { duration: '30s', target: 0 }],
  thresholds: { http_req_failed: ['rate<0.01'], http_req_duration: ['p(95)<500'] }
};
const files = ['/', '/index.html', '/manifest.json', '/css/app.css', '/css/theme.css', '/js/ui.js', '/js/auth.js', '/js/pages/home.js', '/js/pages/explore.js', '/js/pages/profile.js', '/sw.js'];
export default function () {
  const res = http.batch(files.map(f => ['GET', SITE + f]));
  res.forEach((r, i) => check(r, { [files[i] + ' 200']: x => x.status === 200 }));
  sleep(1);
}
