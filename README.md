# Svu Ai Studio

منصة ذكية متكاملة لخدمة طلاب الجامعة الافتراضية السورية، تدمج الذكاء الاصطناعي في كل خطوة من خطوات الرحلة الدراسية.

![Svu Ai Studio](https://img.shields.io/badge/Svu%20Ai%20Studio-v1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)

## 🎯 الميزات الرئيسية

### 🤖 مساعد ذكي بالذكاء الاصطناعي
- مساعد شخصي مدعوم بـ GPT-4
- فهم السياق الأكاديمي
- إجابات شاملة وسهلة الفهم
- دعم العربية والإنجليزية

### 📄 تحليل وملخصات ذكية
- تلخيص تلقائي للمستندات
- استخراج النقاط الرئيسية
- تحليل عميق للمحتوى
- دعم PDF و DOCX و TXT

### ❓ توليد الأسئلة والاختبارات
- إنشاء كويزات تفاعلية
- أنواع أسئلة متعددة
- مستويات صعوبة مختلفة
- شروحات للإجابات

### 📚 خطط الدراسة المخصصة
- خطط مخصصة لكل طالب
- تكيف مع الوقت المتاح
- توصيات ذكية
- تذكيرات تلقائية

### 📊 تتبع الأداء
- تحليل التقدم الأكاديمي
- توصيات شخصية
- إحصائيات مفصلة
- رؤى قابلة للتنفيذ

### 📖 المكتبة الرقمية
- مستودع شامل للمواد
- بحث متقدم
- تصنيف ذكي
- إدارة سهلة

## 🚀 البدء السريع

### المتطلبات
- Node.js 18+
- npm أو yarn
- PostgreSQL 12+

### التثبيت

```bash
# استنساخ المستودع
git clone <repository-url>
cd svu-ai-studio

# تثبيت الاعتماديات
npm install

# إعداد متغيرات البيئة
cp .env.example .env
# قم بتحرير .env وإضافة البيانات المطلوبة

# إعداد قاعدة البيانات
npm run db:push

# تشغيل الخادم
npm run dev
```

سيكون الموقع متاحاً على `http://localhost:5000`

## 📖 التوثيق

للحصول على التوثيق الكامل، يرجى مراجعة [DOCUMENTATION.md](./DOCUMENTATION.md)

### المسارات الرئيسية

#### الذكاء الاصطناعي
- `POST /api/ai/generate-quiz` - توليد أسئلة
- `POST /api/ai/study-plan` - إنشاء خطة دراسية
- `POST /api/ai/summarize-advanced` - تلخيص النصوص
- `POST /api/ai/recommendations` - توصيات شخصية

#### المستندات
- `POST /api/documents/upload` - رفع مستند
- `GET /api/documents` - قائمة المستندات
- `DELETE /api/documents/:id` - حذف مستند

#### البطاقات الدراسية
- `GET /api/flashcards` - البطاقات
- `POST /api/flashcards` - إنشاء بطاقة
- `PUT /api/flashcards/:id/review` - تحديث المراجعة

## 🛠️ التطوير

### البناء
```bash
npm run build
```

### التشغيل في الإنتاج
```bash
npm run start
```

### الاختبار
```bash
npm test
```

### التحقق من النوع
```bash
npm run check
```

## 🏗️ البنية المعمارية

```
svu-ai-studio/
├── client/                 # الواجهة الأمامية (React)
│   ├── src/
│   │   ├── components/    # مكونات React
│   │   ├── pages/         # الصفحات
│   │   ├── hooks/         # hooks مخصصة
│   │   └── lib/           # أدوات مساعدة
│   └── index.html
├── server/                # الواجهة الخلفية (Express)
│   ├── services/          # خدمات الذكاء الاصطناعي
│   ├── routes.ts          # المسارات
│   ├── db.ts              # قاعدة البيانات
│   └── index.ts           # نقطة الدخول
├── shared/                # كود مشترك
│   └── schema.ts          # تعريفات الأنواع
└── DOCUMENTATION.md       # التوثيق الكامل
```

## 🔐 الأمان

- مصادقة آمنة مع OpenID Connect
- تشفير كلمات المرور
- حماية ضد CSRF
- التحقق من صحة المدخلات
- معالجة آمنة للملفات

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:

1. Fork المستودع
2. أنشئ فرع للميزة (`git checkout -b feature/amazing-feature`)
3. اكتب الاختبارات
4. أرسل Pull Request

## 📝 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE)

## 📞 الدعم

للحصول على الدعم:
- 📧 البريد الإلكتروني: support@svuaistudio.com
- 🐛 الإبلاغ عن الأخطاء: [Issues](https://github.com/svu-ai-studio/issues)
- 💬 المناقشات: [Discussions](https://github.com/svu-ai-studio/discussions)

## 🙏 شكر خاص

شكر خاص لـ:
- فريق الجامعة الافتراضية السورية
- مجتمع المطورين العرب
- جميع المساهمين

## 📈 الخارطة الطريقية

- [ ] تطبيق الهاتف المحمول
- [ ] دعم الفيديو التعليمي
- [ ] نظام التنبيهات المتقدم
- [ ] التكامل مع LMS الأخرى
- [ ] نظام الشهادات
- [ ] دعم لغات إضافية

---

**صُنع بـ ❤️ لطلاب الجامعة الافتراضية السورية**

آخر تحديث: أكتوبر 2025

