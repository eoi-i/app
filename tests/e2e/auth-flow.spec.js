const { test, expect } = require('@playwright/test');
const { mockBackend } = require('../helpers/mock-backend');

const U = { name: 'علي الموسوي', username: 'ali_iraq', email: 'ali@test.dev', password: 'Aa1!aaaa9' };

async function fillSignup(page, o = U) {
  await page.fill('#display_name', o.name);
  await page.fill('#username', o.username);
  await page.fill('#email', o.email);
  await page.fill('#password', o.password);
}

test.beforeEach(async ({ page }) => { page.db = await mockBackend(page); });

test.describe('التسجيل', () => {
  test('صفحة الدخول تظهر أولاً وفيها رابط إنشاء حساب', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.auth-card h2')).toHaveText('تسجيل الدخول');
    await expect(page.locator('[data-m=signup]')).toBeVisible();
  });

  test('زر الإنشاء معطّل حتى تقوى كلمة المرور وتتم الموافقة على الشروط', async ({ page }) => {
    await page.goto('/'); await page.click('[data-m=signup]');
    const btn = page.locator('#af button[type=submit]');
    await expect(btn).toBeDisabled();
    await fillSignup(page);
    await expect(btn).toBeDisabled();           // كلمة قوية لكن بدون موافقة
    await page.click('#tos-box');
    await expect(page.locator('#tos-box')).toHaveAttribute('aria-checked', 'true');
    await expect(btn).toBeEnabled();
    await page.click('#tos-box');               // إلغاء الموافقة يعطّل ثانية
    await expect(btn).toBeDisabled();
  });

  test('مقياس كلمة المرور: ضعيفة ثم قوية', async ({ page }) => {
    await page.goto('/'); await page.click('[data-m=signup]');
    await page.fill('#password', 'abc');
    await expect(page.locator('.pw-l')).toHaveText('ضعيفة');
    await page.fill('#password', 'Aa1!aaaa9');
    await expect(page.locator('.pw-l')).toHaveText('قوية');
  });

  test('علامة الاستفهام تفتح الشروط وزر الموافقة يضع العلامة', async ({ page }) => {
    await page.goto('/'); await page.click('[data-m=signup]');
    await page.click('#tos-q');
    await expect(page.locator('.tos-doc')).toContainText('الشروط');
    await page.click('[data-agree]');
    await expect(page.locator('#tos-box')).toHaveAttribute('aria-checked', 'true');
  });

  test('اسم مستخدم غير صالح يُرفض برسالة ولا يستدعي الخادم', async ({ page }) => {
    await page.goto('/'); await page.click('[data-m=signup]');
    await fillSignup(page, { ...U, username: 'ع ي' });
    await page.click('#tos-box'); await page.click('#af button[type=submit]');
    await expect(page.locator('#toasts')).toContainText('اسم المستخدم');
    expect(page.db.calls.some(c => c.p === '/functions/v1/signup')).toBe(false);
  });

  test('بريد مسجّل مسبقاً يعرض رسالة واضحة', async ({ page }) => {
    page.db.users[U.email] = { id: 'x', ...U };
    await page.goto('/'); await page.click('[data-m=signup]');
    await fillSignup(page); await page.click('#tos-box'); await page.click('#af button[type=submit]');
    await expect(page.locator('#toasts')).toContainText('مسجّل مسبقاً');
  });

  test('رسالة «محاولات كثيرة» تظهر كنص عادي بدون إغلاق النموذج', async ({ page }) => {
    await page.route('**/functions/v1/signup', r => r.fulfill({ status: 429, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ error: 'busy' }) }));
    await page.goto('/'); await page.click('[data-m=signup]');
    await fillSignup(page); await page.click('#tos-box'); await page.click('#af button[type=submit]');
    await expect(page.locator('#toasts')).toContainText('محاولات تسجيل كثيرة');
    await expect(page.locator('#af')).toBeVisible();
  });
});

test('إذا تعذر الوصول لدالة التسجيل (حظر شبكة/CORS) يكمل التسجيل بالمسار البديل ويدخل', async ({ page }) => {
  await page.route('**/functions/v1/signup', r => r.abort('failed'));
  await page.goto('/'); await page.click('[data-m=signup]');
  await fillSignup(page); await page.click('#tos-box'); await page.click('#af button[type=submit]');
  await expect(page).toHaveURL(/#\/home/);
  expect(page.db.calls.some(c => c.p === '/auth/v1/signup')).toBe(true);
});

test.describe('الدخول والمسار الرئيسي والخروج', () => {
  test('دخول ببيانات خاطئة يعرض خطأ ويبقى في صفحة الدخول', async ({ page }) => {
    await page.goto('/');
    await page.fill('#email', 'nobody@test.dev'); await page.fill('#password', 'wrongpass');
    await page.click('#af button[type=submit]');
    await expect(page.locator('#toasts')).toContainText('غير صحيحة');
    await expect(page.locator('.auth-card h2')).toHaveText('تسجيل الدخول');
  });

  test('دخول بحقول فاضية', async ({ page }) => {
    await page.goto('/'); await page.click('#af button[type=submit]');
    await expect(page.locator('#toasts')).toContainText('أدخل البريد');
  });

  test('المسار الكامل: إنشاء حساب ← دخول تلقائي ← بحث ← خروج ← عودة لصفحة الدخول', async ({ page }) => {
    page.db.profiles.push({ id: 'p-9', username: 'baghdad_cafe', display_name: 'مقهى بغداد', followers_count: 12, following_count: 0, posts_count: 3, is_banned: false });
    await page.goto('/'); await page.click('[data-m=signup]');
    await fillSignup(page); await page.click('#tos-box'); await page.click('#af button[type=submit]');

    // دخول تلقائي بعد التسجيل
    await expect(page).toHaveURL(/#\/home/);
    expect(page.db.calls.some(c => c.p === '/functions/v1/signup')).toBe(true);
    expect(page.db.calls.some(c => c.p === '/auth/v1/token')).toBe(true);

    // بحث
    await page.goto('/#/explore');
    await page.fill('#ex-q', 'baghdad');
    await expect(page.locator('.urow')).toContainText('مقهى بغداد');
    await page.fill('#ex-q', 'zzzz-nothing');
    await expect(page.locator('#ex-res')).toContainText('لا توجد حسابات');

    // خروج من الإعدادات
    await page.goto('/#/settings');
    await page.click('[data-k=logout]');
    await expect(page.locator('.auth-card h2')).toHaveText('تسجيل الدخول');
    expect(page.db.loggedOut).toBe(true);
  });

  test('الخروج لا يعرض نافذة تأكيد', async ({ page }) => {
    page.db.users[U.email] = { id: '00000000-0000-4000-8000-000000000001', ...U };
    page.db.profiles.push({ id: '00000000-0000-4000-8000-000000000001', username: U.username, display_name: U.name, followers_count: 0, following_count: 0, posts_count: 0, is_banned: false });
    let dialog = false; page.on('dialog', d => { dialog = true; d.dismiss(); });
    await page.goto('/');
    await page.fill('#email', U.email); await page.fill('#password', U.password); await page.click('#af button[type=submit]');
    await expect(page).toHaveURL(/#\/home/);
    await page.goto('/#/settings'); await page.click('[data-k=logout]');
    await expect(page.locator('.auth-card h2')).toHaveText('تسجيل الدخول');
    expect(dialog).toBe(false);
  });
});
