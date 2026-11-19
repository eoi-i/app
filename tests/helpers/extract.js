// يستخرج دوال صغيرة من ملفات التطبيق (حتى لو كانت داخل IIFE) بدون تعديل الملفات الأصلية.
// إذا تغيّر اسم الدالة أو اختفت، الاختبار يفشل برسالة واضحة.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as acorn from 'acorn';
import { JSDOM } from 'jsdom';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');

function walk(node, fn) {
  if (!node || typeof node.type !== 'string') return;
  fn(node);
  for (const k of Object.keys(node)) {
    const v = node[k];
    if (Array.isArray(v)) v.forEach(x => x && typeof x.type === 'string' && walk(x, fn));
    else if (v && typeof v.type === 'string') walk(v, fn);
  }
}

/** يرجع الدالة المسماة (const name = ... أو function name) من الملف كدالة قابلة للاستدعاء */
export function extractFn(rel, name, scope = {}) {
  const src = read(rel);
  const ast = acorn.parse(src, { ecmaVersion: 'latest', sourceType: 'script' });
  let code = null;
  walk(ast, n => {
    if (code) return;
    if (n.type === 'VariableDeclarator' && n.id.type === 'Identifier' && n.id.name === name && n.init) code = src.slice(n.init.start, n.init.end);
    else if (n.type === 'FunctionDeclaration' && n.id && n.id.name === name) code = src.slice(n.start, n.end);
  });
  if (!code) throw new Error(`الدالة «${name}» غير موجودة في ${rel}`);
  const keys = Object.keys(scope);
  return new Function(...keys, `return (${code});`)(...keys.map(k => scope[k]));
}

/** يحمّل ui.js داخل jsdom ويرجع كائن App الجاهز */
export function loadUi() {
  const dom = new JSDOM('<!doctype html><html><head></head><body><div id="app"></div><div id="toasts"></div></body></html>', { runScripts: 'outside-only', url: 'http://localhost/' });
  dom.window.eval(read('js/ui.js'));
  return { A: dom.window.App, window: dom.window };
}
