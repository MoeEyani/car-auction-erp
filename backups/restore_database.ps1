# Script لاستعادة قاعدة البيانات من النسخة الاحتياطية
# Restore Database Script

param(
    [Parameter(Mandatory=$true)]
    [string]$BackupFile
)

Write-Host "🔄 بدء عملية استعادة قاعدة البيانات..." -ForegroundColor Yellow

# التحقق من وجود الملف
if (-not (Test-Path $BackupFile)) {
    Write-Host "❌ الملف غير موجود: $BackupFile" -ForegroundColor Red
    exit 1
}

Write-Host "📂 ملف النسخة الاحتياطية: $BackupFile" -ForegroundColor Green

# إيقاف التطبيق مؤقتاً
Write-Host "⏸️  إيقاف الخدمات مؤقتاً..." -ForegroundColor Yellow
docker-compose stop backend

# حذف قاعدة البيانات الحالية وإعادة إنشائها
Write-Host "🗑️  إعادة إنشاء قاعدة البيانات..." -ForegroundColor Yellow
docker exec erp_postgres_db psql -U erp_user -d postgres -c "DROP DATABASE IF EXISTS erp_database;"
docker exec erp_postgres_db psql -U erp_user -d postgres -c "CREATE DATABASE erp_database;"

# استعادة البيانات
Write-Host "📥 استعادة البيانات..." -ForegroundColor Yellow
if ($BackupFile.EndsWith(".sql")) {
    # استعادة من ملف SQL
    Get-Content $BackupFile | docker exec -i erp_postgres_db psql -U erp_user -d erp_database
} elseif ($BackupFile.EndsWith(".dump")) {
    # استعادة من ملف مضغوط
    docker exec -i erp_postgres_db pg_restore -U erp_user -d erp_database -v < $BackupFile
}

# إعادة تشغيل الخدمات
Write-Host "▶️  إعادة تشغيل الخدمات..." -ForegroundColor Yellow
docker-compose start backend

Write-Host "✅ تمت عملية الاستعادة بنجاح!" -ForegroundColor Green
Write-Host "🔍 تحقق من حالة التطبيق على: http://localhost:3000" -ForegroundColor Cyan

# مثال على الاستخدام:
# .\restore_database.ps1 -BackupFile "erp_database_backup_2025-09-23_01-34-30.sql"
# .\restore_database.ps1 -BackupFile "erp_database_compressed_2025-09-23_01-34-41.dump"