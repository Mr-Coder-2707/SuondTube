# 🚀 دليل النشر السريع

## خطوات الرفع على GitHub

### 1. تهيئة Git (إذا لم يكن مُهيأ)
```powershell
git init
```

### 2. إضافة الملفات
```powershell
git add .
```

### 3. إنشاء Commit
```powershell
git commit -m "Initial commit: YouTube Audio Podcast Player"
```

### 4. إنشاء مستودع على GitHub
- اذهب إلى https://github.com/new
- أنشئ مستودع جديد (مثلاً: youtube-audio-podcast)
- **لا تضف** README أو .gitignore أو license

### 5. ربط المستودع ورفع الملفات
```powershell
# استبدل YOUR_USERNAME باسم المستخدم و YOUR_REPO باسم المستودع
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## خطوات النشر على Netlify

### الطريقة 1️⃣: Netlify Drop (الأسرع - 2 دقيقة)

1. **بناء المشروع:**
```powershell
npm run build
```

2. **اذهب إلى:** https://app.netlify.com/drop

3. **اسحب مجلد `dist`** إلى الصفحة

✅ تم! الموقع سيكون جاهزاً فوراً

---

### الطريقة 2️⃣: ربط GitHub (الأفضل - نشر تلقائي)

1. **ارفع المشروع على GitHub** (اتبع الخطوات أعلاه)

2. **اذهب إلى Netlify:**
   - https://app.netlify.com
   - سجل دخول أو أنشئ حساب

3. **أنشئ موقع جديد:**
   - اضغط "Add new site" → "Import an existing project"
   - اختر "Deploy with GitHub"
   - صرّح لـ Netlify بالوصول لحسابك
   - اختر المستودع الخاص بك

4. **إعدادات البناء** (ستكون تلقائية):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - (هذه الإعدادات موجودة في `netlify.toml`)

5. **اضغط "Deploy"**

✅ كل مرة تقوم فيها بـ push على GitHub، سيتم النشر تلقائياً!

---

## 🔗 روابط مفيدة

- **GitHub:** https://github.com
- **Netlify:** https://app.netlify.com
- **Netlify Drop:** https://app.netlify.com/drop
- **Netlify Docs:** https://docs.netlify.com

---

## 🆘 حل المشاكل الشائعة

### المشكلة: "git: command not found"
**الحل:** قم بتثبيت Git من https://git-scm.com/download/win

### المشكلة: "npm: command not found"
**الحل:** قم بتثبيت Node.js من https://nodejs.org

### المشكلة: الموقع لا يعمل على Netlify
**الحل:** تأكد من:
1. تم بناء المشروع بنجاح (`npm run build`)
2. مجلد `dist` موجود وبه ملفات
3. ملف `netlify.toml` موجود في المشروع

---

## 📝 نصائح

- ✅ استخدم الطريقة 2 (ربط GitHub) للمشاريع الكبيرة
- ✅ استخدم الطريقة 1 (Drop) للتجربة السريعة
- ✅ يمكنك ربط domain مخصص من إعدادات Netlify
- ✅ Netlify يوفر HTTPS تلقائياً ومجاناً
- ✅ يمكنك تفعيل CI/CD للنشر التلقائي

---

**حظاً موفقاً! 🎉**
