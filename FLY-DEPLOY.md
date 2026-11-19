# نشر «أني عراقي» على Fly.io

## قبل النشر
1. ثبّت Fly CLI وسجّل الدخول: `fly auth login`.
2. افتح `fly.toml` وغيّر `app = "ane-iraqi"` إلى اسم فريد متاح في Fly.io.
3. من مجلد المشروع نفّذ:

```bash
fly launch --no-deploy --copy-config --name YOUR-UNIQUE-APP-NAME --region fra
fly deploy
```

إذا أنشأت التطبيق مسبقاً بالاسم الموجود في `fly.toml`، يكفي تنفيذ `fly deploy`.

## التحقق
- افتح الرابط الذي يعرضه Fly بعد النشر.
- فحص الصحة: `https://YOUR-APP.fly.dev/healthz` ويجب أن يعرض `ok`.
- السجلات: `fly logs`

## قاعدة البيانات والمفاتيح
التطبيق واجهة أمامية تتصل مباشرة بمشروع Supabase المحدد مسبقاً في `js/config.js`. أبقينا عنوان المشروع ومفتاح `anon` كما وردا في الأرشيف. مفتاح `anon` مخصص للاستخدام في المتصفح وليس مفتاح `service_role`؛ لا تضع مفتاح `service_role` في ملفات الواجهة. يجب ضبط سياسات RLS وصلاحيات جداول وStorage في Supabase قبل فتح الموقع للعامة.

لا ينشئ هذا النشر قاعدة بيانات جديدة ولا ينقل بيانات Supabase؛ تبقى البيانات في مشروع Supabase الحالي.
