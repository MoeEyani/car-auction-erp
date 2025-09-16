# Sprint 0 - Project Foundation Setup

## 🎯 **هدف Sprint 0**
إعداد أساس مشروع ERP نظام مزادات السيارات مع دعم ثنائي اللغة (العربية/الإنجليزية) وفقاً للمعايير المهنية.

---

## 🔧 **Part 0: Environment Setup & Project Initialization**

### ✅ 1. Verify Core Development Tools
- [x] Check versions of node, npm, git, and docker
- [x] Stop if any tool is missing and inform user

### ⏳ 2. Create Project Structure  
- [ ] Create erp_project directory
- [ ] Navigate into it
- [ ] Initialize Git repository with `git init`

### ⏳ 3. Setup Root .gitignore
- [ ] Create .gitignore in project root
- [ ] Add patterns: node_modules/, dist/, build/, .env, .env.*, *.log

### ⏳ 4. Part 0 Completion Check
- [ ] Verify all environment setup tasks completed

---

## ⚙️ **Part 1: Backend Setup (NestJS)**

### ⏳ 5. Create NestJS Backend Project
- [ ] Create new NestJS project named 'erp-backend' using npm

### ⏳ 6. Install Backend Core Dependencies
- [ ] Install @nestjs/config
- [ ] Install @nestjs/typeorm
- [ ] Install typeorm
- [ ] Install pg
- [ ] Install class-validator
- [ ] Install class-transformer

### ⏳ 7. Install Backend Authentication & i18n
- [ ] Install @nestjs/i18n
- [ ] Install @nestjs/passport  
- [ ] Install @nestjs/jwt

### ⏳ 8. Install Backend Documentation Dependencies
- [ ] Install @nestjs/swagger
- [ ] Install swagger-ui-express

### ⏳ 9. Install Backend Testing Dependencies
- [ ] Install @types/jest as dev dependency
- [ ] Install supertest as dev dependency

### ⏳ 10. Setup Backend Environment Variables
- [ ] Create .env file in erp-backend
- [ ] Add DATABASE_HOST=localhost
- [ ] Add DATABASE_PORT=5432
- [ ] Add DATABASE_USER=erp_user
- [ ] Add DATABASE_PASSWORD=erp_password
- [ ] Add DATABASE_NAME=erp_database
- [ ] Add JWT_SECRET (generate secure key)

### ⏳ 11. Verify Backend Setup
- [ ] Start dev server with `npm run start:dev`
- [ ] Confirm it runs successfully
- [ ] Stop server and return to project root

### ⏳ 12. Part 1 Completion Check
- [ ] Verify all backend setup tasks completed

---

## 🎨 **Part 2: Frontend Setup (React + Tailwind)**

### ⏳ 13. Create React Frontend Project
- [ ] Create new Vite React+TypeScript project named 'erp-frontend'

### ⏳ 14. Install Frontend Core Dependencies
- [ ] Install axios for API communication
- [ ] Install react-router-dom for routing

### ⏳ 15. Install Tailwind CSS with RTL Support
- [ ] Install tailwindcss as dev dependency
- [ ] Install postcss as dev dependency
- [ ] Install autoprefixer as dev dependency
- [ ] Install tailwindcss-rtl as dev dependency

### ⏳ 16. Configure Tailwind CSS with Arabic Fonts
- [ ] Run `npx tailwindcss init -p`
- [ ] Configure tailwind.config.js with RTL plugin
- [ ] Add Arabic fonts (Cairo, Noto Sans Arabic)
- [ ] Update src/index.css with Tailwind directives

### ⏳ 17. Install Internationalization Packages
- [ ] Install react-i18next
- [ ] Install i18next

### ⏳ 18. Setup i18n Translation Files
- [ ] Create i18n folder structure
- [ ] Create Arabic translation files
- [ ] Create English translation files
- [ ] Setup basic translations for common terms

### ⏳ 19. Setup Frontend Environment Variables
- [ ] Create .env file in erp-frontend
- [ ] Add VITE_API_BASE_URL=http://localhost:3000
- [ ] Add VITE_DEFAULT_LANGUAGE=ar

### ⏳ 20. Verify Frontend Setup
- [ ] Start dev server with `npm run dev`
- [ ] Confirm it runs successfully
- [ ] Stop server and return to project root

### ⏳ 21. Part 2 Completion Check
- [ ] Verify all frontend setup tasks completed

---

## 🗄️ **Part 3: Database Setup (Docker + PostgreSQL)**

### ⏳ 22. Create Docker Compose Configuration
- [ ] Create docker-compose.yml in project root
- [ ] Configure PostgreSQL 15 service
- [ ] Add Arabic collation support
- [ ] Set up proper environment variables
- [ ] Configure volume for data persistence

### ⏳ 23. Start Database Container
- [ ] Run `docker-compose up -d`
- [ ] Wait for container to fully start

### ⏳ 24. Verify Database Container
- [ ] Run `docker ps`
- [ ] Confirm erp_postgres_db container is running
- [ ] Check container logs if needed

### ⏳ 25. Part 3 Completion Check
- [ ] Verify database setup completed successfully

---

## ✅ **Final Steps**

### ⏳ 26. Setup Backend i18n Configuration
- [ ] Configure basic i18n setup for backend API responses
- [ ] Add Arabic accounting terminology
- [ ] Test i18n configuration

### ⏳ 27. Test Bilingual Support
- [ ] Test Arabic language display in frontend
- [ ] Test English language display in frontend
- [ ] Test language switching functionality
- [ ] Verify RTL layout works correctly

### ⏳ 28. Final Sprint 0 Verification
- [ ] Confirm all 27 tasks completed
- [ ] Test entire development environment
- [ ] Verify bilingual support works end-to-end
- [ ] Confirm project is ready for ERP development
- [ ] Document any issues or notes

---

## 📝 **Notes & Issues**
- [ ] Document any installation issues
- [ ] Note any version compatibility problems
- [ ] Record any configuration adjustments needed

---

## 🎯 **Success Criteria**
✅ All development tools verified and working  
✅ Backend (NestJS) running with all dependencies  
✅ Frontend (React + Tailwind) running with RTL support  
✅ Database (PostgreSQL) running in Docker  
✅ Arabic/English bilingual support functional  
✅ Project ready for ERP business logic development  

---

**التاريخ:** 16 سبتمبر 2025  
**الحالة:** Sprint 0 - Project Foundation Setup  
**المدة المتوقعة:** 2-3 ساعات