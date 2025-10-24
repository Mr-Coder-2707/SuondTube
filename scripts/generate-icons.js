#!/usr/bin/env node

/**
 * سكريبت لتوليد أيقونات PWA بجميع الأحجام
 * يمكن استخدام أدوات مثل:
 * - https://realfavicongenerator.net/
 * - https://www.pwabuilder.com/imageGenerator
 * - أو تشغيل هذا السكريبت إذا كان Sharp مثبتاً
 */

const fs = require('fs');
const path = require('path');

// الأحجام المطلوبة
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const iconDir = path.join(__dirname, '../public/icons');

// إنشاء مجلد الأيقونات إذا لم يكن موجوداً
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
  console.log('✅ Created icons directory');
}

console.log('\n📝 تعليمات توليد الأيقونات:\n');
console.log('الطريقة 1️⃣: استخدام أداة أونلاين (الأسهل)');
console.log('───────────────────────────────────────────────');
console.log('1. اذهب إلى: https://www.pwabuilder.com/imageGenerator');
console.log('2. ارفع صورة أو أيقونة (يفضل 512x512 PNG)');
console.log('3. حمّل الملف المضغوط');
console.log('4. انسخ جميع الأيقونات إلى مجلد: public/icons/\n');

console.log('الطريقة 2️⃣: استخدام Canva أو Photoshop');
console.log('───────────────────────────────────────────────');
console.log('1. صمم أيقونة بحجم 512x512 بكسل');
console.log('2. احفظها بصيغة PNG في: public/icons/icon-512x512.png');
console.log('3. استخدم أداة أونلاين لتغيير الحجم:\n');
sizes.forEach(size => {
  console.log(`   - icon-${size}x${size}.png`);
});

console.log('\nالطريقة 3️⃣: استخدام Sharp (للمطورين)');
console.log('───────────────────────────────────────────────');
console.log('1. ثبت Sharp: npm install sharp');
console.log('2. ضع أيقونة 512x512 في: public/icons/icon-512x512.png');
console.log('3. شغل: node scripts/generate-icons-with-sharp.js\n');

console.log('الطريقة 4️⃣: استخدام ImageMagick');
console.log('───────────────────────────────────────────────');
console.log('1. ثبت ImageMagick من: https://imagemagick.org/');
console.log('2. ضع أيقونة في: public/icons/icon-512x512.png');
console.log('3. شغل الأوامر التالية:\n');

sizes.forEach(size => {
  console.log(`magick convert public/icons/icon-512x512.png -resize ${size}x${size} public/icons/icon-${size}x${size}.png`);
});

console.log('\n═══════════════════════════════════════════════\n');
console.log('💡 نصيحة: استخدم الطريقة 1 (PWA Builder) لأنها:');
console.log('   ✅ سهلة وسريعة');
console.log('   ✅ تولد جميع الأحجام تلقائياً');
console.log('   ✅ تضيف خاصية "maskable" للأندرويد');
console.log('   ✅ متوافقة مع جميع المنصات\n');

// إنشاء ملف placeholder بسيط
const placeholderSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#1DB954"/>
  <text x="256" y="280" font-size="200" text-anchor="middle" fill="#fff">🎵</text>
</svg>`;

fs.writeFileSync(path.join(iconDir, 'placeholder.svg'), placeholderSVG);
console.log('✅ Created placeholder icon (استبدله بأيقونتك الخاصة)\n');
