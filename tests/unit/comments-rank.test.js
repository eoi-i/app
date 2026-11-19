import { describe, it, expect } from 'vitest';
import { extractFn } from '../helpers/extract.js';

// نبني نفس السياق الذي تستخدمه دالة الترتيب داخل الملف
function makeUseful({ likes = {}, replies = {}, owner = 'o' } = {}) {
  const S = { owner };
  const lk = c => likes[c.id] || 0, rc = c => replies[c.id] || 0, T = c => +new Date(c.created_at);
  return extractFn('js/pages/comments.js', 'useful', { lk, rc, T, S });
}
const now = new Date().toISOString();
const daysAgo = d => new Date(Date.now() - d * 864e5).toISOString();

describe('ترتيب «الأكثر فائدة» (useful)', () => {
  it('الإعجابات ترفع النتيجة', () => {
    const u = makeUseful({ likes: { a: 5, b: 1 } });
    expect(u({ id: 'a', user_id: 'x', created_at: now })).toBeGreaterThan(u({ id: 'b', user_id: 'x', created_at: now }));
  });
  it('الردود ترفع النتيجة', () => {
    const u = makeUseful({ replies: { a: 4 } });
    expect(u({ id: 'a', user_id: 'x', created_at: now })).toBeGreaterThan(u({ id: 'b', user_id: 'x', created_at: now }));
  });
  it('تعليق صاحب المنشور يأخذ دفعة', () => {
    const u = makeUseful({ owner: 'o' });
    expect(u({ id: 'a', user_id: 'o', created_at: now })).toBeGreaterThan(u({ id: 'b', user_id: 'x', created_at: now }));
  });
  it('الأقدم يتراجع مع نفس التفاعل', () => {
    const u = makeUseful({ likes: { a: 3, b: 3 } });
    expect(u({ id: 'a', user_id: 'x', created_at: now })).toBeGreaterThan(u({ id: 'b', user_id: 'x', created_at: daysAgo(10) }));
  });
  it('النص الطويل والوسائط يرفعان قليلاً', () => {
    const u = makeUseful();
    const base = u({ id: 'a', user_id: 'x', created_at: now, content: 'x' });
    expect(u({ id: 'a', user_id: 'x', created_at: now, content: 'x'.repeat(200) })).toBeGreaterThan(base);
    expect(u({ id: 'a', user_id: 'x', created_at: now, content: 'x', media_type: 'audio' })).toBeGreaterThan(base);
  });
  it('تعليق بدون محتوى لا ينتج NaN', () => {
    const u = makeUseful();
    expect(Number.isFinite(u({ id: 'a', user_id: 'x', created_at: now }))).toBe(true);
    expect(Number.isFinite(u({ id: 'a', user_id: 'x', created_at: now, content: null }))).toBe(true);
  });
  it('النتيجة لا تكون سالبة أبداً', () => {
    const u = makeUseful();
    expect(u({ id: 'a', user_id: 'x', created_at: daysAgo(3650), content: '' })).toBeGreaterThanOrEqual(0);
  });
});
