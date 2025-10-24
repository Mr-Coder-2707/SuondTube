import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')

// تسجيل Service Worker للـ PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered successfully:', registration.scope);
        
        // التحقق من وجود تحديثات
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('🔄 Service Worker update found!');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // يوجد نسخة جديدة جاهزة
              console.log('✨ New version available! Please refresh.');
              
              // يمكن عرض إشعار للمستخدم هنا
              if (confirm('يوجد تحديث جديد! هل تريد تحديث التطبيق؟')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error('❌ Service Worker registration failed:', error);
      });

    // إعادة تحميل الصفحة عند تفعيل Service Worker جديد
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  });
}

// رصد حالة الاتصال بالإنترنت
window.addEventListener('online', () => {
  console.log('✅ أنت متصل بالإنترنت');
  // يمكن إضافة إشعار للمستخدم
});

window.addEventListener('offline', () => {
  console.log('⚠️ أنت غير متصل بالإنترنت - التطبيق يعمل بوضع Offline');
  // يمكن إضافة إشعار للمستخدم
});

// إظهار زر التثبيت على الشاشة الرئيسية
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('💾 PWA install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  
  // يمكن إظهار زر تثبيت مخصص
  // showInstallButton();
});

// بعد التثبيت
window.addEventListener('appinstalled', () => {
  console.log('✅ PWA installed successfully!');
  deferredPrompt = null;
});
