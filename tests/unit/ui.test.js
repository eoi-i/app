import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { loadUi } from '../helpers/extract.js';

let A;
beforeAll(() => { ({ A } = loadUi()); });
afterEach(() => vi.useRealTimers());

describe('A.esc — تهريب النصوص (حماية XSS)', () => {
  it('يهرّب الرموز الخطرة', () => {
    expect(A.esc('<script>alert("x")</script>')).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
    expect(A.esc(`a&b'c`)).toBe('a&amp;b&#39;c');
  });
  it('يتعامل مع null وundefined والأرقام', () => {
    expect(A.esc(null)).toBe('');
    expect(A.esc(undefined)).toBe('');
    expect(A.esc(0)).toBe('0');
    expect(A.esc(12.5)).toBe('12.5');
  });
  it('لا يهرّب النص العربي العادي', () => {
    expect(A.esc('أني عراقي')).toBe('أني عراقي');
  });
  it('يمنع كسر الخاصية بعلامة اقتباس', () => {
    const out = A.esc('" onerror="alert(1)');
    expect(out).not.toContain('"');
  });
  it('لا يهرّب مرتين لما تُستدعى على نص مهرَّب (يتحول & إلى &amp;)', () => {
    expect(A.esc('&amp;')).toBe('&amp;amp;');
  });
});

describe('A.linkify — الوسوم والإشارات', () => {
  it('يحوّل #وسم و@إشارة إلى spans', () => {
    const o = A.linkify('مرحبا #عراق مع @ali_iraq');
    expect(o).toContain('<span class="tag">#عراق</span>');
    expect(o).toContain('<span class="mention">@ali_iraq</span>');
  });
  it('يهرّب HTML قبل التحويل (لا ينفّذ سكربتات)', () => {
    const o = A.linkify('<img src=x onerror=alert(1)> #tag');
    expect(o).not.toContain('<img');
    expect(o).toContain('&lt;img');
  });
  it('إشارة أقصر من 3 أحرف لا تُحوَّل', () => {
    expect(A.linkify('@ab')).toBe('@ab');
  });
  it('نص فاضي', () => {
    expect(A.linkify('')).toBe('');
    expect(A.linkify(null)).toBe('');
  });
  it('الوسم لا يبتلع علامات الترقيم', () => {
    expect(A.linkify('#عراق، جميل')).toContain('<span class="tag">#عراق</span>،');
  });
});

describe('A.timeAgo', () => {
  const ago = sec => new Date(Date.now() - sec * 1000).toISOString();
  it('أقل من دقيقة: الآن', () => expect(A.timeAgo(ago(5))).toBe('الآن'));
  it('دقائق', () => expect(A.timeAgo(ago(5 * 60 + 3))).toBe('منذ 5 د'));
  it('ساعات', () => expect(A.timeAgo(ago(3 * 3600 + 10))).toBe('منذ 3 س'));
  it('أيام', () => expect(A.timeAgo(ago(2 * 86400 + 10))).toBe('منذ 2 ي'));
  it('أكثر من أسبوع: تاريخ', () => {
    const o = A.timeAgo(ago(10 * 86400));
    expect(o).not.toMatch(/^منذ/);
    expect(o.length).toBeGreaterThan(4);
  });
  it('حدود: 59 ثانية = الآن، 60 ثانية = دقيقة', () => {
    expect(A.timeAgo(ago(59))).toBe('الآن');
    expect(A.timeAgo(ago(60))).toBe('منذ 1 د');
  });
  it('وقت بالمستقبل (فرق ساعات بين الجهاز والخادم) يعتبر «الآن» ولا يعطي رقم سالب', () => {
    expect(A.timeAgo(new Date(Date.now() + 5000).toISOString())).toBe('الآن');
  });
});

describe('A.avatar', () => {
  it('صورة مهرَّبة عند وجود رابط', () => {
    const o = A.avatar({ avatar_url: 'https://x.co/a.png?"><script>' }, 50);
    expect(o).toContain('<img');
    expect(o).not.toContain('"><script>');
    expect(o).toContain('width:50px');
  });
  it('حرف أول كبير عند عدم وجود صورة', () => {
    expect(A.avatar({ display_name: 'علي' })).toContain('>ع<');
    expect(A.avatar({ username: 'ali' })).toContain('>A<');
  });
  it('مستخدم غير معروف: علامة استفهام', () => {
    expect(A.avatar(null)).toContain('>?<');
    expect(A.avatar({})).toContain('>?<');
  });
  it('الحجم الافتراضي 42', () => expect(A.avatar({})).toContain('width:42px'));
});

describe('A.catBadge — شعارات الفئات', () => {
  it('كل الفئات الـ18 لها لون ومسار', () => {
    const keys = Object.keys(A.CAT_BADGES);
    expect(keys.length).toBeGreaterThanOrEqual(18);
    for (const k of keys) {
      const [color, path] = A.CAT_BADGES[k];
      expect(color, k).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(path.length, k).toBeGreaterThan(5);
    }
  });
  it('بدون فئة يرجع نص فاضي', () => {
    expect(A.catBadge('')).toBe('');
    expect(A.catBadge(null)).toBe('');
  });
  it('فئة غير معروفة تستخدم الشعار الافتراضي ولا تنكسر', () => {
    const o = A.catBadge('فئة-غير-موجودة', 20);
    expect(o).toContain('cbd');
    expect(o).toContain('width:20px');
  });
  it('اسم الفئة يُهرَّب داخل title', () => {
    expect(A.catBadge('a"b')).toContain('title="a&quot;b"');
  });
  it('الفئة المعروفة تأخذ لونها', () => {
    const k = Object.keys(A.CAT_BADGES)[0];
    expect(A.catBadge(k)).toContain(A.CAT_BADGES[k][0]);
  });
});

describe('A.icon', () => {
  it('يرجع svg لأيقونة معروفة', () => {
    const name = Object.keys(A.icons)[0];
    expect(A.icon(name)).toContain('<svg');
  });
  it('كل الأيقونات المسجلة تُنتج svg سليم (مغلق)', () => {
    for (const k of Object.keys(A.icons)) {
      const s = A.icon(k);
      expect(s.startsWith('<svg'), k).toBe(true);
      expect(s.endsWith('</svg>'), k).toBe(true);
    }
  });
});

describe('مؤشرات التحميل', () => {
  it('A.eq يولّد العدد المطلوب من الأعمدة (والافتراضي 5)', () => {
    expect((A.eq(3).match(/<i><\/i>/g) || []).length).toBe(3);
    expect((A.eq().match(/<i><\/i>/g) || []).length).toBe(5);
  });
});
