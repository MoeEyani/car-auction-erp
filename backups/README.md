# دليل النسخ الاحتياطية لقاعدة بيانات ERP

## 📋 **معلومات النسخة الاحتياطية الحالية**

### **تفاصيل النسخة الاحتياطية:**
- **التاريخ والوقت:** 2025-09-23 01:34:30
- **قاعدة البيانات:** erp_database  
- **المستخدم:** erp_user
- **إصدار PostgreSQL:** 16.10
- **حاوية Docker:** erp_postgres_db

### **الملفات المنشأة:**
1. **النسخة SQL العادية:** `erp_database_backup_2025-09-23_01-34-30.sql` (46.2 KB)
2. **النسخة المضغوطة:** `erp_database_compressed_2025-09-23_01-34-41.dump` (57.4 KB)

---

## 🔧 **Scripts المتاحة**

### **1. restore_database.ps1**
**الغرض:** استعادة قاعدة البيانات من نسخة احتياطية

**الاستخدام:**
```powershell
# استعادة من ملف SQL
.\restore_database.ps1 -BackupFile "erp_database_backup_2025-09-23_01-34-30.sql"

# استعادة من ملف مضغوط
.\restore_database.ps1 -BackupFile "erp_database_compressed_2025-09-23_01-34-41.dump"
```

**ما يقوم به:**
- إيقاف خدمة Backend مؤقتاً
- حذف قاعدة البيانات الحالية
- إنشاء قاعدة بيانات جديدة
- استعادة البيانات من النسخة الاحتياطية
- إعادة تشغيل الخدمات

### **2. daily_backup.ps1**
**الغرض:** إنشاء نسخ احتياطية تلقائية يومية

**الاستخدام:**
```powershell
# نسخ احتياطي عادي
.\daily_backup.ps1

# تخصيص المجلد ومدة الاحتفاظ
.\daily_backup.ps1 -BackupPath "custom_backups" -RetentionDays 14
```

**المميزات:**
- إنشاء نسختين (SQL عادي + مضغوط)
- تسجيل سجل النسخ الاحتياطية
- تنظيف النسخ القديمة تلقائياً
- تقارير مفصلة عن الأحجام

---

## 📊 **محتويات النسخة الاحتياطية**

### **الجداول المشمولة:**
1. **جداول النظام:**
   - `permissions` (19 صلاحية)
   - `roles` (7 أدوار)
   - `role_permissions` (ربط الأدوار بالصلاحيات)

2. **جداول المستخدمين:**
   - `users` (بيانات المستخدمين)
   - `user_permission_overrides` (تجاوزات الصلاحيات)

3. **جداول الفروع:**
   - `branches` (بيانات الفروع)

4. **الجداول المساعدة:**
   - `_prisma_migrations` (تاريخ التحديثات)

### **البيانات المحفوظة:**
- **الصلاحيات:** جميع الصلاحيات الـ19 مع أوصافها
- **الأدوار:** الأدوار النظامية والمخصصة  
- **المستخدمين:** جميع حسابات المستخدمين
- **ربط الصلاحيات:** علاقات الأدوار والصلاحيات
- **إعدادات الفروع:** بيانات الفروع المختلفة

---

## ⚙️ **إعداد النسخ الاحتياطي التلقائي**

### **جدولة النسخ الاحتياطية اليومية:**

#### **Windows Task Scheduler:**
```powershell
# إنشاء مهمة جدولة
$Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File C:\Users\Moham\erp_project\backups\daily_backup.ps1"
$Trigger = New-ScheduledTaskTrigger -Daily -At "02:00"
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
Register-ScheduledTask -TaskName "ERP Database Backup" -Action $Action -Trigger $Trigger -Settings $Settings
```

#### **تشغيل يدوي منتظم:**
```powershell
# إضافة للملف الشخصي PowerShell
echo 'Set-Alias backup-erp "C:\Users\Moham\erp_project\backups\daily_backup.ps1"' >> $PROFILE
```

---

## 🔐 **أفضل الممارسات للنسخ الاحتياطية**

### **✅ التوصيات:**
1. **نسخ احتياطية منتظمة:** يومياً في الساعة 2:00 صباحاً
2. **أنواع متعددة:** SQL عادي + مضغوط للمرونة
3. **فترة الاحتفاظ:** 7-14 يوم للنسخ اليومية
4. **نسخ أسبوعية:** احتفاظ لمدة شهر
5. **نسخ شهرية:** احتفاظ لمدة سنة

### **📍 مواقع التخزين:**
- **محلي:** `C:\Users\Moham\erp_project\backups\`
- **سحابي:** Google Drive, OneDrive, AWS S3
- **خارجي:** قرص صلب خارجي، NAS

### **🔒 الأمان:**
- تشفير النسخ الاحتياطية الحساسة
- حماية كلمات المرور
- التحقق من سلامة النسخ دورياً

---

## 🚨 **خطة الطوارئ**

### **في حالة فشل قاعدة البيانات:**
1. **التقييم:** تحديد مستوى الضرر
2. **الإيقاف:** إيقاف جميع الخدمات
3. **الاستعادة:** استخدام أحدث نسخة احتياطية
4. **التحقق:** اختبار سلامة البيانات
5. **إعادة التشغيل:** تشغيل النظام والاختبار

### **اختبار الاستعادة:**
```powershell
# اختبار شهري للاستعادة
.\restore_database.ps1 -BackupFile "test_backup.sql"
```

---

## 📈 **مراقبة النسخ الاحتياطية**

### **سجل النسخ الاحتياطية:**
```powershell
# عرض آخر 10 نسخ احتياطية
Get-Content "backups/backup_log.json" | ConvertFrom-Json | Select-Object -Last 10
```

### **فحص صحة النسخ:**
```powershell
# فحص أحجام الملفات
Get-ChildItem backups\*.sql | Select-Object Name, Length, LastWriteTime
```

### **إحصائيات الاستخدام:**
- **متوسط حجم النسخة:** ~46 KB (SQL) / ~57 KB (مضغوط)
- **وقت الإنشاء:** أقل من دقيقة
- **مساحة مطلوبة:** ~100 KB يومياً

---

## 🎯 **خلاصة الأوامر السريعة**

```powershell
# إنشاء نسخة احتياطية فورية
.\daily_backup.ps1

# استعادة من آخر نسخة
.\restore_database.ps1 -BackupFile "erp_database_backup_2025-09-23_01-34-30.sql"

# عرض سجل النسخ
Get-Content "backups/backup_log.json" | ConvertFrom-Json

# عرض النسخ المتاحة
Get-ChildItem backups\erp_database_* | Sort-Object LastWriteTime -Descending
```

النظام الآن محمي بنسخ احتياطية شاملة وموثوقة! 🛡️