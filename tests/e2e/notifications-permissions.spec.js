const { test, expect } = require('@playwright/test');
const { mockBackend } = require('../helpers/mock-backend');

const U = { id: '00000000-0000-4000-8000-000000000001', name: 'علي', username: 'ali', email: 'ali@t.dev', password: 'Aa1!aaaa9' };

test.beforeEach(async ({ page, context }) => {
  const db = await mockBackend(page);
  db.users[U.email] = { ...U };
  db.profiles.push({ id: U.id, username: U.username, display_name: U.name, followers_count: 0, following_count: 0, posts_count: 0, is_banned: false });
  page.db = db;
  await context.grantPermissions(['notifications']);
  await page.goto('/');
  await page.fill('#email', U.email); await page.fill('#password', U.password);
  await page.click('#af button[type=submit]');
  await expect(page).toHaveURL(/#\/home/);
});

test('صفحة التفاعلات لا تطلب ولا تعرض إشعارات الرسائل', async ({ page }) => {
  const reqs = [];
  page.on('request', r => { if (r.url().includes('/rest/v1/notifications') && r.method() === 'GET') reqs.push(decodeURIComponent(r.url())); });
  await page.evaluate(() => { location.hash = '#/notifications'; });
  await expect(page.locator('.sec-title')).toContainText('التفاعلات');
  await expect.poll(() => reqs.some(u => u.includes('type=neq.message') && u.includes('limit=60'))).toBe(true);
});

test('إشعار رسالة يصل لحظياً لا يظهر في صفحة التفاعلات', async ({ page }) => {
  await page.evaluate(() => { location.hash = '#/notifications'; });
  await expect(page.locator('#nt-list')).toBeVisible();
  await page.evaluate(() => { App.rt.hs.notification.forEach(f => f({ id: 'n1', type: 'message', conversation_id: 'c1', actor_id: null })); });
  await page.waitForTimeout(400);
  await expect(page.locator('#nt-list .nt')).toHaveCount(0);
});

test('الإعدادات فيها «أذونات التطبيق» وصفحتها تعرض ثلاثة أذونات', async ({ page }) => {
  await page.evaluate(() => { location.hash = '#/settings'; });
  const row = page.locator('.sr[data-k=permissions]');
  await expect(row).toBeVisible();
  await row.click();
  await expect(page.locator('.set-head h1')).toHaveText('أذونات التطبيق');
  await expect(page.locator('#s-body .sr')).toHaveCount(3);
  await expect(page.locator('#s-body .sr').first()).toContainText(/مسموح|مرفوض|السماح|غير مدعوم/);
  await page.click('#s-back');
  await expect(page.locator('.set-head h1')).toHaveText('الإعدادات والخصوصية');
});
