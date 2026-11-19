// اختبار حي على البيئة الحقيقية/التجريبية. لا يعمل إلا إذا ضُبطت المتغيرات (CI عبر Secrets)
const { test, expect } = require('@playwright/test');
const BASE = process.env.LIVE_URL, EMAIL = process.env.LIVE_EMAIL, PASS = process.env.LIVE_PASSWORD;
test.skip(!process.env.LIVE_E2E || !BASE || !EMAIL || !PASS, 'يحتاج LIVE_E2E و LIVE_URL و LIVE_EMAIL و LIVE_PASSWORD');

test('دخول حقيقي ← بحث ← خروج', async ({ page }) => {
  await page.goto(BASE);
  await page.fill('#email', EMAIL); await page.fill('#password', PASS);
  await page.click('#af button[type=submit]');
  await expect(page).toHaveURL(/#\/home/, { timeout: 15000 });
  await page.goto(BASE + '#/explore');
  await page.fill('#ex-q', 'a');
  await expect(page.locator('#ex-res')).not.toContainText('اكتب كلمة', { timeout: 10000 });
  await page.goto(BASE + '#/settings'); await page.click('[data-k=logout]');
  await expect(page.locator('.auth-card h2')).toHaveText('تسجيل الدخول');
});
