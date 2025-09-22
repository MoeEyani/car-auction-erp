# Script للنسخ الاحتياطي التلقائي
# Automated Backup Script

param(
    [string]$BackupPath = "backups",
    [int]$RetentionDays = 7  # الاحتفاظ بالنسخ لمدة 7 أيام
)

Write-Host "🔄 بدء عملية النسخ الاحتياطي التلقائي..." -ForegroundColor Yellow

# إنشاء مجلد النسخ الاحتياطية إذا لم يكن موجوداً
if (-not (Test-Path $BackupPath)) {
    New-Item -ItemType Directory -Path $BackupPath -Force
    Write-Host "📁 تم إنشاء مجلد النسخ الاحتياطية: $BackupPath" -ForegroundColor Green
}

# إنشاء الطابع الزمني
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$dateOnly = Get-Date -Format "yyyy-MM-dd"

# مسارات ملفات النسخة الاحتياطية
$sqlBackupFile = "$BackupPath/erp_database_backup_$timestamp.sql"
$compressedBackupFile = "$BackupPath/erp_database_compressed_$timestamp.dump"

Write-Host "📊 إنشاء نسخة احتياطية SQL..." -ForegroundColor Cyan
docker exec erp_postgres_db pg_dump -U erp_user -d erp_database > $sqlBackupFile

Write-Host "🗜️  إنشاء نسخة احتياطية مضغوطة..." -ForegroundColor Cyan  
docker exec erp_postgres_db pg_dump -U erp_user -d erp_database -Fc > $compressedBackupFile

# التحقق من نجاح العملية
if ((Test-Path $sqlBackupFile) -and (Test-Path $compressedBackupFile)) {
    $sqlSize = (Get-Item $sqlBackupFile).Length
    $compressedSize = (Get-Item $compressedBackupFile).Length
    
    Write-Host "✅ تم إنشاء النسخ الاحتياطية بنجاح!" -ForegroundColor Green
    Write-Host "📁 النسخة SQL: $sqlBackupFile ($([math]::Round($sqlSize/1KB, 2)) KB)" -ForegroundColor White
    Write-Host "📁 النسخة المضغوطة: $compressedBackupFile ($([math]::Round($compressedSize/1KB, 2)) KB)" -ForegroundColor White
    
    # حفظ معلومات النسخة الاحتياطية في سجل
    $logEntry = @{
        Date = Get-Date
        SQLBackup = $sqlBackupFile
        CompressedBackup = $compressedBackupFile
        SQLSize = $sqlSize
        CompressedSize = $compressedSize
        Status = "Success"
    }
    
    $logFile = "$BackupPath/backup_log.json"
    $logEntries = @()
    
    if (Test-Path $logFile) {
        $logEntries = Get-Content $logFile | ConvertFrom-Json
    }
    
    $logEntries += $logEntry
    $logEntries | ConvertTo-Json -Depth 3 | Set-Content $logFile
    
} else {
    Write-Host "❌ فشل في إنشاء النسخ الاحتياطية!" -ForegroundColor Red
    exit 1
}

# تنظيف النسخ القديمة
Write-Host "🧹 تنظيف النسخ الاحتياطية القديمة..." -ForegroundColor Yellow
$cutoffDate = (Get-Date).AddDays(-$RetentionDays)

Get-ChildItem $BackupPath -Filter "erp_database_*" | Where-Object {
    $_.LastWriteTime -lt $cutoffDate
} | ForEach-Object {
    Write-Host "🗑️  حذف النسخة القديمة: $($_.Name)" -ForegroundColor Gray
    Remove-Item $_.FullName -Force
}

Write-Host "🎉 اكتملت عملية النسخ الاحتياطي!" -ForegroundColor Green
Write-Host "📈 لعرض سجل النسخ الاحتياطية: Get-Content '$BackupPath/backup_log.json' | ConvertFrom-Json" -ForegroundColor Cyan

# مثال على الاستخدام:
# .\daily_backup.ps1
# .\daily_backup.ps1 -BackupPath "custom_backups" -RetentionDays 14