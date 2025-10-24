# ════════════════════════════════════════════════════════════════════
# سكريبت سريع للرفع على GitHub
# ════════════════════════════════════════════════════════════════════
#
# طريقة الاستخدام:
# 1. افتح PowerShell في مجلد المشروع
# 2. شغل: .\quick-deploy.ps1
# 3. اتبع التعليمات
#
# ════════════════════════════════════════════════════════════════════

Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🚀 سكريبت الرفع السريع على GitHub" -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# التحقق من وجود Git
Write-Host "⏳ التحقق من Git..." -ForegroundColor Gray
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitInstalled) {
    Write-Host "❌ Git غير مثبت! قم بتثبيته من: https://git-scm.com" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Git مثبت" -ForegroundColor Green
Write-Host ""

# طلب معلومات المستودع
Write-Host "📝 أدخل معلومات المستودع:" -ForegroundColor Yellow
Write-Host ""
$username = Read-Host "اسم المستخدم في GitHub (username)"
$repoName = Read-Host "اسم المستودع (repository name)"

Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   ⚙️ جارٍ الإعداد..." -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# التحقق من وجود remote
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    Write-Host "⚠️ يوجد remote مُعرّف بالفعل: $remoteExists" -ForegroundColor Yellow
    $continue = Read-Host "هل تريد استبداله؟ (y/n)"
    if ($continue -eq 'y') {
        Write-Host "🔄 إزالة remote القديم..." -ForegroundColor Gray
        git remote remove origin
    } else {
        Write-Host "❌ تم الإلغاء" -ForegroundColor Red
        exit 0
    }
}

# إضافة remote
$remoteUrl = "https://github.com/$username/$repoName.git"
Write-Host "🔗 ربط المستودع: $remoteUrl" -ForegroundColor Gray
git remote add origin $remoteUrl

# التحقق من الفرع
$currentBranch = git branch --show-current
if (-not $currentBranch) {
    Write-Host "⚠️ لا يوجد فرع نشط. إنشاء فرع main..." -ForegroundColor Yellow
    git branch -M main
} elseif ($currentBranch -ne "main") {
    Write-Host "⚠️ الفرع الحالي: $currentBranch" -ForegroundColor Yellow
    $changeBranch = Read-Host "هل تريد التحويل إلى main؟ (y/n)"
    if ($changeBranch -eq 'y') {
        git branch -M main
    }
}

Write-Host ""
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   📤 جارٍ الرفع..." -ForegroundColor Yellow
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# رفع الملفات
Write-Host "📤 رفع الملفات إلى GitHub..." -ForegroundColor Gray
git push -u origin main

Write-Host ""
if ($LASTEXITCODE -eq 0) {
    Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "   ✅ تم الرفع بنجاح!" -ForegroundColor Green
    Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 رابط المستودع:" -ForegroundColor Cyan
    Write-Host "   https://github.com/$username/$repoName" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 الخطوة التالية:" -ForegroundColor Yellow
    Write-Host "   1. اذهب إلى: https://app.netlify.com" -ForegroundColor White
    Write-Host "   2. اضغط 'Add new site' → 'Import an existing project'" -ForegroundColor White
    Write-Host "   3. اختر 'Deploy with GitHub' واختر المستودع" -ForegroundColor White
    Write-Host "   4. اضغط 'Deploy site' (الإعدادات تلقائية)" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host "   ❌ حدث خطأ أثناء الرفع" -ForegroundColor Red
    Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 تأكد من:" -ForegroundColor Yellow
    Write-Host "   1. أنك أنشأت المستودع على GitHub" -ForegroundColor White
    Write-Host "   2. أنك سجلت الدخول في Git" -ForegroundColor White
    Write-Host "   3. أنك تستخدم Personal Access Token بدلاً من كلمة المرور" -ForegroundColor White
    Write-Host ""
    Write-Host "🔑 لإنشاء Token:" -ForegroundColor Cyan
    Write-Host "   https://github.com/settings/tokens" -ForegroundColor White
    Write-Host ""
}

Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
