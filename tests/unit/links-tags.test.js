import { describe, it, expect } from 'vitest';
import { extractFn } from '../helpers/extract.js';

describe('fixUrl — تنظيف روابط البروفايل (حماية من javascript: وغيره)', () => {
  const fixUrl = extractFn('js/pages/profile-edit.js', 'fixUrl');
  it('يضيف https إذا غاب', () => {
    expect(fixUrl('example.com')).toBe('https://example.com/');
    expect(fixUrl('  example.com/a  ')).toBe('https://example.com/a');
  });
  it('يقبل http و https', () => {
    expect(fixUrl('http://a.co')).toBe('http://a.co/');
    expect(fixUrl('HTTPS://A.CO/x')).toBe('https://a.co/x');
  });
  it('يرفض فاضي', () => {
    expect(fixUrl('')).toBeNull();
    expect(fixUrl('   ')).toBeNull();
    expect(fixUrl(null)).toBeNull();
    expect(fixUrl(undefined)).toBeNull();
  });
  it('يرفض javascript: و data: و file: و ftp:', () => {
    for (const bad of ['javascript:alert(1)', 'JaVaScRiPt:alert(1)', 'data:text/html,<script>1</script>', 'file:///etc/passwd', 'ftp://a.com/x', 'vbscript:x']) {
      const r = fixUrl(bad);
      // الإضافة التلقائية https:// تجعل أغلبها نطاقاً غير صالح، ويجب ألا ينتج رابط بمخطط خطير
      expect(r === null || /^https?:\/\//.test(r), bad).toBe(true);
      if (r) expect(r, bad).not.toMatch(/javascript|data:|file:|vbscript/i);
    }
  });
  it('يرفض نطاق بدون نقطة', () => {
    expect(fixUrl('localhost')).toBeNull();
    expect(fixUrl('https://intranet')).toBeNull();
  });
  it('يرفض نص غير رابط', () => {
    expect(fixUrl('مرحبا بالعالم')).toBeNull();
  });
});

describe('tagsOf — استخراج الوسوم', () => {
  const tagsOf = extractFn('js/pages/create.js', 'tagsOf');
  it('يستخرج ويصغّر ويزيل التكرار', () => {
    expect(tagsOf('#Iraq و #iraq و #بغداد')).toEqual(['iraq', 'بغداد']);
  });
  it('نص فاضي أو بدون وسوم', () => {
    expect(tagsOf('')).toEqual([]);
    expect(tagsOf(null)).toEqual([]);
    expect(tagsOf('نص عادي')).toEqual([]);
  });
  it('يتوقف عند علامات الترقيم', () => {
    expect(tagsOf('#عراق، #جميل.')).toEqual(['عراق', 'جميل']);
  });
  it('وسم أطول من 50 حرفاً يُقتطع (لا يتجاوز الحد)', () => {
    const t = tagsOf('#' + 'a'.repeat(80));
    expect(t[0].length).toBe(50);
  });
  it('# وحدها لا تنتج وسماً', () => expect(tagsOf('# ')).toEqual([]));
});

describe('extOf — امتداد الملف', () => {
  const extFile = extractFn('js/pages/create.js', 'extOf');
  const extUrl = extractFn('js/pages/home.js', 'extOf');
  it('من نوع الملف (create)', () => {
    expect(extFile({ type: 'image/jpeg' })).toBe('jpg');
    expect(extFile({ type: 'video/quicktime' })).toBe('mov');
    expect(extFile({ type: 'application/x-evil' })).toBe('bin');
    expect(extFile({ type: '' })).toBe('bin');
  });
  it('من الرابط (home)', () => {
    expect(extUrl('https://x.co/a/b.PNG?token=1')).toBe('PNG');
    expect(extUrl('https://x.co/a/video.mp4')).toBe('mp4');
    expect(extUrl('https://x.co/a/noext')).toBe('bin');
  });
});
