# 🚀 دليل ترقية Node.js محلياً إلى الإصدار 20

## ✅ ما تم إنجازه في Docker:
- ✅ **Docker**: تم تحديث Dockerfile لاستخدام Node.js 20.19.5
- ✅ **Engine Specification**: إضافة متطلبات Node.js >= 20.0.0 في package.json
- ✅ **Testing**: جميع الخدمات تعمل بنجاح مع Node.js 20

## 🔧 خطوات ترقية النظام المحلي:

### طريقة 1: استخدام Node Version Manager (الأفضل)

#### لـ Windows (باستخدام nvm-windows):

```powershell
# 1. تنصيب nvm-windows إذا لم يكن مثبت
# تحميل من: https://github.com/coreybutler/nvm-windows/releases

# 2. تنصيب Node.js 20 LTS
nvm install 20

# 3. التبديل لاستخدام Node.js 20
nvm use 20

# 4. التحقق من الإصدار
node --version
npm --version
```

### طريقة 2: التنصيب المباشر

#### تحميل من الموقع الرسمي:
1. اذهب إلى: https://nodejs.org
2. حمل **Node.js 20 LTS** (Current LTS Version)
3. شغل الـ installer واتبع الخطوات
4. أعد تشغيل PowerShell/Command Prompt

### طريقة 3: باستخدام Chocolatey (Windows)

```powershell
# إذا كان لديك Chocolatey مثبت
choco install nodejs --version=20.19.5
```

### طريقة 4: باستخدام Winget (Windows 10/11)

```powershell
# باستخدام Windows Package Manager
winget install OpenJS.NodeJS --version 20.19.5
```

## 🔍 التحقق من الترقية:

بعد الترقية، تأكد من الإصدارات:

```powershell
# يجب أن يكون 20.x.x
node --version

# يجب أن يكون 10.x.x أو أحدث
npm --version

# التحقق من npm العالمية
npm list -g --depth=0
```

## ⚠️ احتياطات مهمة:

### 1. النسخ الاحتياطية:
```powershell
# احفظ قائمة الحزم العالمية الحالية
npm list -g --depth=0 > global-packages-backup.txt
```

### 2. إعادة تنصيب الحزم العالمية (إذا لزم الأمر):
```powershell
# إعادة تنصيب الحزم المهمة
npm install -g @nestjs/cli
npm install -g typescript
npm install -g tsx
```

### 3. تنظيف npm cache:
```powershell
# تنظيف الـ cache بعد الترقية
npm cache clean --force
```

## 🎯 التحقق من توافق المشروع:

بعد الترقية، اختبر المشروع محلياً:

```powershell
# انتقل لمجلد المشروع
cd c:\Users\Moham\erp_project\erp-backend

# تنصيب dependencies
npm install

# تشغيل lint
npm run lint

# تشغيل المشروع
npm run start:dev
```

## 📊 مقارنة الإصدارات:

| المكون | الإصدار القديم | الإصدار الجديد | الحالة |
|--------|---------------|----------------|---------|
| **Docker Node.js** | 18.20.8 | 20.19.5 | ✅ مكتمل |
| **Docker npm** | 10.8.2 | 10.8.2 | ✅ محدث |
| **Local Node.js** | يحتاج تحديث | 20.x.x | ⏳ قيد التنفيذ |

## 🚨 في حالة المشاكل:

### إذا واجهت مشاكل في الحزم:
```powershell
# حذف node_modules وإعادة التنصيب
rm -rf node_modules
rm package-lock.json
npm install
```

### إذا كانت هناك مشاكل permission:
```powershell
# تشغيل PowerShell كـ Administrator وتنفيذ:
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## ✅ علامات النجاح:

عند اكتمال الترقية بنجاح ستحصل على:
- 🟢 Node.js 20.x.x
- 🟢 npm 10.x.x 
- 🟢 عدم ظهور تحذيرات EBADENGINE
- 🟢 أداء أفضل للتطبيق
- 🟢 دعم أفضل للحزم الحديثة

---

**ملاحظة**: Docker environment جاهز ويعمل بـ Node.js 20. الترقية المحلية اختيارية لكنها مفيدة للتطوير المحلي.

**تاريخ التحديث**: ${new Date().toISOString()}
**حالة Docker**: ✅ مكتمل ويعمل بنجاح