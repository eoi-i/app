const { test, expect } = require('@playwright/test');
const { mockBackend } = require('../helpers/mock-backend');

const mk = (n) => ({ id: '00000000-0000-4000-8000-00000000000' + n, name: 'مستخدم ' + n, username: 'user_' + n, email: `u${n}@t.dev`, password: 'Aa1!aaaa9' });
const USERS = [mk(1), mk(2)];

async function login(page, u) {
  await page.fill('#email', u.email); await page.fill('#password', u.password);
  await page.click('#af button[type=submit]');
  await expect(page).toHaveURL(/#\/home/);
}
const hdr = page => page.locator('.ig-nm');

test.beforeEach(async ({ page }) => {
  const db = await mockBackend(page);
  for (const u of USERS) {
    db.users[u.email] = { id: u.id, ...u };
    db.profiles.push({ id: u.id, username: u.username, display_name: u.name, followers_count: 0, following_count: 0, posts_count: 0, is_banned: false });
  }
  page.db = db;
});

test.describe('تعدد الحسابات', () => {
  test('إضافة حساب ثان ثم التبديل بين الحسابين وتسجيل الخروج', async ({ page }) => {
    await page.goto('/'); await login(page, USERS[0]);
    await page.goto('/#/profile'); // ملفي (قد يكون المسار مختلفاً: نحاول عبر الشريط السفلي)
    const nav = page.locator('[data-nav=profile], a[href="#/me"], [href="#/profile"]').first();
    if (await nav.count()) await nav.click();
    await expect(page.locator('#pf-edit')).toBeVisible();

    // فتح القائمة بالضغط على الاسم
    await hdr(page).click();
    await expect(page.locator('.ac-row')).toHaveCount(1);
    await expect(page.locator('.ac-row .ac-ok')).toHaveCount(1);

    // إضافة حساب: تظهر شاشة دخول مع زر رجوع
    await page.click('#ac-add');
    await expect(page.locator('#au-cancel')).toBeVisible();
    await login(page, USERS[1]);

    // بعد إعادة التحميل صرنا بالحساب الثاني ويظهر الحسابان
    await page.goto('/#/profile');
    await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('ani_accounts_v1') || '[]').map(a => a.username).sort().join(','))).toBe('user_1,user_2');
    await expect(page.locator('.ig-nm')).toContainText('مستخدم 2');

    // التبديل إلى الحساب الأول
    await hdr(page).click();
    await expect(page.locator('.ac-row')).toHaveCount(2);
    await page.locator('.ac-row', { hasText: 'user_1' }).click();
    await expect(page).toHaveURL(/#\/home/, { timeout: 10000 });
    await page.waitForLoadState('load');
    await page.evaluate(() => { location.hash = '#/profile'; });
    await expect(page.locator('.ig-nm')).toContainText('مستخدم 1', { timeout: 10000 });

    // تسجيل الخروج من الحساب الحالي ينقلنا تلقائياً للحساب الآخر ويحذف الحالي من القائمة
    await page.goto('/#/settings'); await page.click('[data-k=logout]');
    await expect(page).toHaveURL(/#\/home/, { timeout: 10000 });
    const left = await page.evaluate(() => JSON.parse(localStorage.getItem('ani_accounts_v1') || '[]'));
    expect(left.map(a => a.username)).toEqual(['user_2']);
  });

  test('زر «رجوع لحسابي» يلغي الإضافة ويعيدني لحسابي', async ({ page }) => {
    await page.goto('/'); await login(page, USERS[0]);
    await page.goto('/#/profile');
    const nav = page.locator('[data-nav=profile], [href="#/profile"]').first();
    if (await nav.count()) await nav.click();
    await hdr(page).click(); await page.click('#ac-add');
    await page.click('#au-cancel');
    await expect(page.locator('.auth-card')).toHaveCount(0, { timeout: 10000 });
  });

  test('حساب جلسته منتهية يُحذف مع رسالة ولا ينهار التطبيق', async ({ page }) => {
    await page.goto('/'); await login(page, USERS[0]);
    await page.evaluate(() => { const l = JSON.parse(localStorage.getItem('ani_accounts_v1') || '[]'); l.push({ id: 'dead', username: 'dead_acc', display_name: 'ميت', access_token: 'x.y.z', refresh_token: 'bad' }); localStorage.setItem('ani_accounts_v1', JSON.stringify(l)); });
    await page.goto('/#/profile');
    const nav = page.locator('[data-nav=profile], [href="#/profile"]').first();
    if (await nav.count()) await nav.click();
    await hdr(page).click();
    await page.locator('.ac-row', { hasText: 'dead_acc' }).click();
    await expect(page.locator('#toasts')).toContainText('انتهت جلسة');
    const l = await page.evaluate(() => JSON.parse(localStorage.getItem('ani_accounts_v1') || '[]'));
    expect(l.some(a => a.id === 'dead')).toBe(false);
  });
});
