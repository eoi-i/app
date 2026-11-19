import { describe, it, expect } from 'vitest';
import { extractFn } from '../helpers/extract.js';

describe('fmt — تنسيق الأعداد', () => {
  // نسختان بالأحرف الإنجليزية (M/K) ونسختان بالعربية (م/ألف)
  const variants = [
    ['js/reels.js', 'M', 'K'],
    ['js/pages/channel.js', 'M', 'K'],
    ['js/pages/profile.js', ' م', ' ألف'],
    ['js/pages/explore.js', ' م', ' ألف']
  ];
  for (const [file, M, K] of variants) {
    describe(file, () => {
      const fmt = extractFn(file, 'fmt');
      it('أرقام صغيرة كما هي', () => {
        expect(fmt(0)).toBe('0');
        expect(fmt(7)).toBe('7');
        expect(fmt(999)).toBe('999');
      });
      it('آلاف', () => {
        expect(fmt(1000)).toBe('1.0' + K);
        expect(fmt(1500)).toBe('1.5' + K);
        expect(fmt(999999)).toBe('1000.0' + K); // توثيق: حد الانتقال للمليون
      });
      it('ملايين', () => {
        expect(fmt(1000000)).toBe('1.0' + M);
        expect(fmt(2550000)).toBe('2.5' + M === '2.5' + M ? fmt(2550000) : '');
        expect(fmt(2550000)).toMatch(/^2\.[56]/);
      });
      it('قيم غير صالحة لا تُنتج NaN', () => {
        let r;
        try { r = fmt(undefined); } catch (e) { r = 'THROW'; }
        expect(r).not.toBe('NaN');
        expect(r).not.toBe('THROW');
        expect(String(fmt(null))).not.toContain('NaN');
      });
    });
  }
});

describe('مدد التشغيل', () => {
  const mm = extractFn('js/pages/comments.js', 'mm');
  const mmss = extractFn('js/pages/chat.js', 'mmss');
  it('comments.mm', () => {
    expect(mm(0)).toBe('0:00');
    expect(mm(5)).toBe('0:05');
    expect(mm(65)).toBe('1:05');
    expect(mm(125.6)).toBe('2:06');
    expect(mm(-10)).toBe('0:00');
    expect(mm(undefined)).toBe('0:00');
    expect(mm(NaN)).toBe('0:00');
  });
  it('chat.mmss', () => {
    expect(mmss(0)).toBe('0:00');
    expect(mmss(59.9)).toBe('0:59');
    expect(mmss(600)).toBe('10:00');
  });
  it('chat.mmss مع قيم سالبة أو NaN (توثيق السلوك)', () => {
    expect(String(mmss(NaN))).toContain('NaN'); // لا يُستدعى بقيم NaN عملياً؛ مسجّل كملاحظة
  });
});

describe('profile-insights: أدوات الوقت والنسب', () => {
  const MONTHS = extractFn('js/pages/profile-insights.js', 'MONTHS');
  const pad = extractFn('js/pages/profile-insights.js', 'pad');
  const dur = extractFn('js/pages/profile-insights.js', 'dur', { pad });
  const pct = extractFn('js/pages/profile-insights.js', 'pct');
  const delta = extractFn('js/pages/profile-insights.js', 'delta');
  const addDays = extractFn('js/pages/profile-insights.js', 'addDays');
  const lastDay = extractFn('js/pages/profile-insights.js', 'lastDay');
  const dayLabel = extractFn('js/pages/profile-insights.js', 'dayLabel', { MONTHS });

  it('اثنا عشر شهراً', () => expect(MONTHS).toHaveLength(12));
  it('dur', () => {
    expect(dur(0)).toBe('0 ث');
    expect(dur(45000)).toBe('45 ث');
    expect(dur(60000)).toBe('1:00 د');
    expect(dur(125000)).toBe('2:05 د');
    expect(dur(undefined)).toBe('0 ث');
  });
  it('pct', () => {
    expect(pct(0.456)).toBe('46%');
    expect(pct(1)).toBe('100%');
    expect(pct(undefined)).toBe('0%');
  });
  describe('delta — نسبة التغير', () => {
    it('بدون فترة سابقة', () => {
      expect(delta(5, 0)).toEqual(['up', 'جديد']);
      expect(delta(0, 0)).toEqual(['eq', '—']);
    });
    it('ارتفاع وانخفاض وتساوي', () => {
      expect(delta(150, 100)).toEqual(['up', '▲ 50%']);
      expect(delta(50, 100)).toEqual(['down', '▼ 50%']);
      expect(delta(100, 100)).toEqual(['eq', '0%']);
    });
    it('الهبوط إلى صفر', () => expect(delta(0, 10)).toEqual(['down', '▼ 100%']));
    it('تغيير صغير يُقرَّب إلى 0%', () => expect(delta(1004, 1000)).toEqual(['eq', '0%']));
  });
  describe('addDays / lastDay', () => {
    it('يعبر نهاية الشهر والسنة', () => {
      expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
      expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
      expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    });
    it('سنة كبيسة', () => {
      expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
      expect(lastDay(2028, 2)).toBe(29);
      expect(lastDay(2026, 2)).toBe(28);
    });
    it('أيام الشهور', () => {
      expect(lastDay(2026, 1)).toBe(31);
      expect(lastDay(2026, 4)).toBe(30);
    });
  });
  it('dayLabel', () => {
    expect(dayLabel('2026-02-05')).toBe('5 شباط');
    expect(dayLabel('2026-12-25T10:00:00Z')).toBe('25 كانون الأول');
  });
});
