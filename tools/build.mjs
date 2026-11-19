// يجمّع ملفات التطبيق الجاهزة للنشر (بدون node_modules ولا الاختبارات).
// ينشئ المجلدين: dist (Cloudflare/GitHub Actions) و public (الاسم الافتراضي الذي يبحث عنه Vercel).
import { cpSync, rmSync, mkdirSync, existsSync } from 'node:fs';

const FILES = ['index.html', 'manifest.json', 'sw.js', '_headers', 'assets', 'css', 'js'];
const OUT = ['dist', 'public'];

for (const f of FILES) {
  if (!existsSync(f) && f !== '_headers') { console.error('ملف ناقص: ' + f); process.exit(1); }
}
for (const out of OUT) {
  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  for (const f of FILES) if (existsSync(f)) cpSync(f, out + '/' + f, { recursive: true });
}
console.log('Build done: ' + OUT.join(', '));