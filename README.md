# Car Auction ERP System | نظام تخطيط موارد المؤسسة للمزادات

A comprehensive bilingual (Arabic/English) ERP system built specifically for car auction businesses.

## 🚀 Features | المميزات

### 🏢 Core ERP Modules | الوحدات الأساسية
- **Financial Management | الإدارة المالية**: Complete accounting system with Arabic standards
- **Inventory Management | إدارة المخزون**: Vehicle tracking and management
- **Auction Management | إدارة المزادات**: Full auction lifecycle management
- **User Management | إدارة المستخدمين**: Role-based access control

### 🌐 Bilingual Support | الدعم ثنائي اللغة
- **Arabic (RTL) | العربية**: Full right-to-left layout support
- **English (LTR) | الإنجليزية**: Standard left-to-right layout
- **Dynamic Language Switching | التبديل الديناميكي**: Switch languages seamlessly

### 💻 Technology Stack | التقنيات المستخدمة

#### Backend | الخادم
- **NestJS**: Modern Node.js framework
- **TypeORM**: Object-relational mapping
- **PostgreSQL**: Advanced database with Arabic collation
- **JWT**: Secure authentication
- **Docker**: Containerized deployment

#### Frontend | الواجهة الأمامية
- **React 18**: Modern UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS with RTL support
- **Vite**: Fast build tool
- **React Router**: Client-side routing

#### Database | قاعدة البيانات
- **PostgreSQL 15**: With UTF-8 Arabic support
- **Docker Compose**: Easy deployment
- **TypeORM Migrations**: Database version control

## 🛠️ Development Setup | إعداد التطوير

### Prerequisites | المتطلبات الأساسية
- Node.js 18+
- Docker & Docker Compose
- Git

### Quick Start | البدء السريع

```bash
# Clone the repository | استنساخ المستودع
git clone <repository-url>
cd erp_project

# Start the services | تشغيل الخدمات
docker-compose up -d

# Access the application | الوصول للتطبيق
# Backend API: http://localhost:3000
# Frontend: http://localhost:5173
```

### Development Workflow | سير العمل التطويري

```bash
# Watch backend logs | مراقبة سجلات الخادم
docker logs erp_backend -f

# Restart services | إعادة تشغيل الخدمات
docker-compose restart

# Install new packages | تثبيت حزم جديدة
docker exec erp_backend npm install package-name
```

## 📊 Project Structure | هيكل المشروع

```
erp_project/
├── erp-backend/          # NestJS API
│   ├── src/
│   │   ├── i18n/        # Translation files
│   │   ├── modules/     # Business modules
│   │   └── ...
│   ├── Dockerfile
│   └── package.json
├── erp-frontend/         # React Application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── i18n/       # Frontend translations
│   │   └── ...
│   └── package.json
├── docker-compose.yml    # Docker services
├── init-db.sql          # Database initialization
└── README.md
```

## 🔧 Configuration | التكوين

### Environment Variables | متغيرات البيئة

#### Backend (.env)
```env
DATABASE_HOST=erp_postgres_db
DATABASE_PORT=5432
DATABASE_USER=erp_user
DATABASE_NAME=erp_database
NODE_ENV=development
JWT_SECRET=your-jwt-secret
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_DEFAULT_LANGUAGE=ar
```

## 🚀 Deployment | النشر

### Development | التطوير
```bash
docker-compose up -d
```

### Production | الإنتاج
- Update environment variables for production
- Use proper SSL certificates
- Configure production database
- Set up monitoring and logging

## 🤝 Contributing | المساهمة

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License | الترخيص

This project is licensed under the MIT License.

## 🔗 Links | الروابط

- [Backend API Documentation](http://localhost:3000/api/docs) (Swagger)
- [Frontend Development Server](http://localhost:5173)

---

**Built with ❤️ for the Arabic business community | بُني بـ ❤️ للمجتمع التجاري العربي**