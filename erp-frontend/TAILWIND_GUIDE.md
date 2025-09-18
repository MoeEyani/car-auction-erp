# دليل استخدام الألوان والمتغيرات في Tailwind CSS v4

## 🎨 الألوان المتاحة

### ألوان البطاقات والخلفيات
```tsx
// خلفية البطاقة
className="bg-card"

// نص البطاقة
className="text-card-foreground"

// خلفية منبثقة
className="bg-popover"

// نص منبثق
className="text-popover-foreground"

// خلفية مكتومة
className="bg-muted"

// نص مكتوم
className="text-muted-foreground"

// خلفية مميزة
className="bg-accent"

// نص مميز
className="text-accent-foreground"
```

### ألوان الحدود والمدخلات
```tsx
// حدود
className="border-border"

// خلفية المدخل
className="bg-input"

// حلقة التركيز
className="ring-ring"
```

### ألوان النجاح والخطر
```tsx
// نجاح
className="bg-success text-white"

// خطأ/خطر
className="bg-destructive text-destructive-foreground"
```

### ألوان مخصصة
```tsx
// أزرار أساسية
className="bg-primary text-primary-foreground hover:bg-primary-hover"

// أزرار ثانوية
className="bg-secondary text-secondary-foreground hover:bg-secondary-hover"
```

## 🔧 المتغيرات المخصصة

### الحدود الدائرية
```tsx
// كبير
className="rounded-lg" // 0.5rem

// متوسط
className="rounded-md" // 0.375rem

// صغير
className="rounded-sm" // 0.25rem
```

### الخط العربي
```tsx
// تطبيق الخط العربي
className="font-arabic"
```

## 📱 استخدام Container المتجاوب

```tsx
<div className="container">
  <h1 className="text-2xl font-bold">محتوى متجاوب</h1>
  <p className="text-gray-600">هذا النص سيتم توسيطه وتطبيق padding مناسب</p>
</div>
```

## 🌙 الوضع المظلم

الألوان تتغير تلقائياً عند تفعيل الوضع المظلم:

```tsx
// إضافة زر تبديل الوضع المظلم
<button onClick={() => document.documentElement.classList.toggle('dark')}>
  تبديل الوضع المظلم
</button>
```

## ✅ اختبار الألوان

لديك أشرطة اختبار في الزاوية العلوية اليسرى تظهر:
- ✅ اللون الأساسي (Primary)
- ✅ لون البطاقة مع الحدود
- ✅ الخلفية المكتومة
- ✅ لون الخطر

## 📝 ملاحظات مهمة

1. جميع الألوان تستخدم متغيرات CSS مما يجعلها قابلة للتخصيص
2. الألوان تتكيف تلقائياً مع الوضع المظلم
3. يمكنك تخصيص الألوان من خلال متغيرات CSS في `:root`
4. الخط العربي مُطبق على كامل التطبيق افتراضياً

## 🚀 كيفية التخصيص

لتخصيص الألوان، عدل المتغيرات في `src/index.css`:

```css
@layer theme {
  :root {
    --color-primary: #your-color;
    --color-success: #your-success-color;
    /* ... */
  }
}
```