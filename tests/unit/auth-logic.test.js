import { describe, it, expect } from 'vitest';
import { extractFn } from '../helpers/extract.js';

const err = extractFn('js/auth.js', 'err');
const checks = extractFn('js/auth.js', 'checks');

describe('رسائل أخطاء الدخول (err)', () => {
  const cases = [
    ['Invalid login credentials', 'البريد أو كلمة المرور غير صحيحة'],
    ['User already registered', 'هذا البريد مسجّل مسبقاً'],
    ['exists', 'هذا البريد مسجّل مسبقاً'],
    ['busy', 'محاولات تسجيل كثيرة من هذا الجهاز، جرّب بعد ساعة'],
    ['Email not confirmed', 'فعّل بريدك من الرسالة المرسلة إليك أولاً'],
    ['Unable to validate email address: invalid format', 'البريد الإلكتروني غير صحيح'],
    ['Failed to fetch', 'تحقق من اتصال الإنترنت'],
    ['email rate limit exceeded', 'الخدمة مشغولة لحظة، جرّب مرة ثانية']
  ];
  it.each(cases)('«%s»', (msg, expected) => {
    expect(err({ message: msg })).toBe(expected);
  });
  it('لا يكشف تفاصيل داخلية للأخطاء غير المعروفة', () => {
    expect(err({ message: 'relation "x" does not exist at db 10.0.0.1' })).toBe('حدث خطأ، حاول مرة أخرى');
  });
  it('يتحمل null وundefined وكائن بدون message', () => {
    expect(err(null)).toBe('حدث خطأ، حاول مرة أخرى');
    expect(err(undefined)).toBe('حدث خطأ، حاول مرة أخرى');
    expect(err({})).toBe('حدث خطأ، حاول مرة أخرى');
  });
  it('رسالة الدخول الخاطئ لا تفرّق بين بريد غير موجود وكلمة مرور خاطئة', () => {
    // Supabase يرجع نفس الرسالة للحالتين، ونحن نعرضها كما هي
    expect(err({ message: 'Invalid login credentials' })).not.toMatch(/غير موجود|مسجّل/);
  });
});

describe('شروط كلمة المرور (checks)', () => {
  it('كلمة فاضية: كلها خطأ', () => expect(checks('')).toEqual([false, false, false, false]));
  it('8 أحرف بالضبط تكفي لشرط الطول', () => {
    expect(checks('abcdefgh')[0]).toBe(true);
    expect(checks('abcdefg')[0]).toBe(false);
  });
  it('الرقم', () => {
    expect(checks('abc1')[1]).toBe(true);
    expect(checks('abcd')[1]).toBe(false);
  });
  it('الرمز: يقبل الرموز، ولا يعتبر الحروف العربية أو المسافة رمزاً', () => {
    expect(checks('a!b')[2]).toBe(true);
    expect(checks('abc')[2]).toBe(false);
    expect(checks('كلمة مرور')[2]).toBe(false);
  });
  it('حروف كبيرة وصغيرة معاً', () => {
    expect(checks('aB')[3]).toBe(true);
    expect(checks('ab')[3]).toBe(false);
    expect(checks('AB')[3]).toBe(false);
  });
  it('كلمة قوية تحقق الأربعة', () => expect(checks('Aa1!aaaa9')).toEqual([true, true, true, true]));
  it('يقبل الأرقام العربية-الهندية كأنها غير رقم (\\d لا يطابقها)', () => {
    // توثيق سلوك: ٣ ليست \d في JS، فلا تُحتسب كرقم
    expect(checks('abc٣')[1]).toBe(false);
  });
  it('يتحمل كلمة مرور طويلة جداً', () => {
    const long = 'Aa1!' + 'x'.repeat(5000);
    expect(checks(long)).toEqual([true, true, true, true]);
  });
});

describe('أخطاء الشبكة عند التسجيل', () => {
  it.each(['Failed to send a request to the Edge Function', 'FunctionsFetchError', 'Load failed', 'Failed to fetch'])('«%s» → رسالة اتصال', m => {
    expect(err({ message: m })).toBe('تحقق من اتصال الإنترنت');
  });
});
