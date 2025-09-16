# Car Auction ERP Backend - NestJS Project Instructions

This is the backend for a comprehensive ERP system designed for a multi-branch car auction business. The system tracks the complete vehicle lifecycle from customer bid requests through auction purchases, international shipping, customs clearance, maintenance, and final sales.

## Business Domain & Architecture

- **Domain**: Car auction business with multi-branch operations
- **Vehicle Lifecycle**: Bid request → Auction purchase → Shipping → Customs → Maintenance → Sale
- **Framework**: NestJS v11 with TypeScript, modular service-oriented architecture
- **Database**: PostgreSQL 16-alpine with Prisma ORM
- **Cache Layer**: Redis 7-alpine for performance optimization
- **Core Principle**: **Integral Accounting** - Every financial operation automatically triggers double-entry journal entries

## Critical Architectural Principles (Non-Negotiable)

### 1. Integral Accounting Engine
- Every operational action with financial impact MUST automatically create corresponding General Ledger entries
- Operational and financial records are unified - not separate systems
- Example: Adding shipping cost → Auto-creates debit/credit journal entries

### 2. ACID Transaction Compliance
- All database operations involving financial data MUST use ACID-compliant transactions
- Use database transactions to ensure all-or-nothing principle
- Wrap financial operations in try-catch with proper rollback mechanisms

### 3. Advanced RBAC (3-Tier Permissions)
- **Permissions** → **Roles** → **User-level overrides**
- Granular access control for sensitive financial and operational data
- Implement permission checks at both API and database levels

## Technology Stack & Configuration

- **Backend**: NestJS v11 with TypeScript
- **Database**: PostgreSQL 16-alpine with Prisma ORM for type-safe database operations
- **Cache**: Redis 7-alpine for session management and performance optimization
- **Code Quality**: Biome for ultra-fast linting and formatting (100x faster than ESLint+Prettier)
- **Security**: Modern security stack with bcrypt, helmet, and rate-limiting
- **Internationalization**: NestJS i18n module for bilingual support
- **Primary Language**: Arabic (العربية) with English secondary
- **Infrastructure**: Docker containers with health checks for cloud deployment
- **Entry Point**: `src/main.ts` bootstraps on port 3000 (or `PORT` env var)

## Bilingual System Requirements

### Language Support
- **Primary**: Arabic (العربية) - default UI and navigation
- **Secondary**: English - full feature parity
- **Dynamic Switching**: Users can toggle languages in real-time
- **Document Generation**: Reports, invoices, receipts in user's selected language

### Arabic Business Standards
When Arabic is selected, use proper Arabic accounting terminology:
- Chart of Accounts: "الأصول" (Assets), "الخصوم" (Liabilities), "حقوق الملكية" (Equity)
- Transactions: "قيد يومية" (Journal Entry), "فاتورة مبيعات" (Sales Invoice)  
- Reports: "قائمة الدخل" (Income Statement), "الميزانية العمومية" (Balance Sheet)

### RTL Support Implementation
- Database: User language preference field
- API: Include translations in responses
- Text encoding: UTF-8 for Arabic support
- Separate translation tables for business terminology

## Development Workflows

### Essential Scripts
```bash
npm run start:dev     # Watch mode development
npm run start:debug   # Debug mode with inspector  
npm run build        # Production build
npm run lint         # Biome check for issues
npm run lint:fix     # Biome check with auto-fix
npm run format       # Biome format code
npm run test         # Unit tests with Jest
npm run test:e2e     # End-to-end tests
npm run test:cov     # Coverage reports

# Prisma Database Commands
npm run db:push      # Push schema changes to database
npm run db:migrate   # Create and run migrations
npm run db:studio    # Open Prisma Studio for database management
npm run db:generate  # Generate Prisma Client
```

### Financial Transaction Pattern
```typescript
// ALWAYS wrap financial operations in transactions using Prisma
import { PrismaService } from './prisma.service';

async createVehiclePurchase(vehicleData: any, cost: number) {
  return await this.prisma.$transaction(async (tx) => {
    // 1. Create vehicle record
    const vehicle = await tx.vehicle.create({
      data: vehicleData
    });
    
    // 2. Auto-create journal entries
    await tx.generalLedgerTransaction.createMany({
      data: [
        {
          accountId: 'VEHICLE_INVENTORY',
          debitAmount: cost,
          creditAmount: 0,
          description: `Vehicle purchase - ${vehicle.id}`,
          userId: currentUser.id
        },
        {
          accountId: 'CASH',
          debitAmount: 0,
          creditAmount: cost,
          description: `Vehicle purchase - ${vehicle.id}`,
          userId: currentUser.id
        }
      ]
    });
    
    return vehicle;
  });
}
```

### Database Integration
- Uses Prisma ORM with `@prisma/client` for type-safe database operations
- PostgreSQL 16-alpine configured for production use
- Prisma schema defines all models with proper relationships and constraints
- Built-in connection pooling and query optimization

## Modular Architecture Patterns

### Core Business Modules (Implementation Status)
- **✅ Branches Module**: Complete with CRUD operations, form management, and real-time UI
- **🔄 Users Module**: Authentication foundation ready, full implementation pending (Task 1.6+)
- **🔄 Vehicles Module**: Database schema ready, implementation pending
- **🔄 Accounting Module**: General Ledger foundation ready, full implementation pending
- **🔄 Auctions Module**: Bid management, auction house integrations - pending
- **🔄 Shipping Module**: International logistics, customs documentation - pending
- **🔄 Maintenance Module**: Service tracking, cost management - pending

### Module Structure Pattern
```typescript
// Standard NestJS pattern with Prisma integration
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly prisma: PrismaService // Inject Prisma for database operations
  ) {}
}

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}
  
  // Every service that handles costs must integrate with accounting
  async addShippingCost(vehicleId: string, cost: number) {
    return await this.prisma.$transaction(async (tx) => {
      // Operational update + automatic journal entry
      const vehicle = await tx.vehicle.update({
        where: { id: vehicleId },
        data: { shippingCost: cost }
      });
      
      // Create corresponding accounting entries
      await tx.generalLedgerTransaction.createMany({
        data: [
          { accountId: 'SHIPPING_EXPENSE', debitAmount: cost, creditAmount: 0 },
          { accountId: 'ACCOUNTS_PAYABLE', debitAmount: 0, creditAmount: cost }
        ]
      });
      
      return vehicle;
    });
  }
}
```

### RBAC Implementation Pattern
```typescript
// 3-tier permission system
@UseGuards(PermissionGuard)
@RequirePermissions('vehicles.view', 'financial.read')
@Get(':id/costs')
async getVehicleCosts(@Param('id') id: string) {
  // Permission check: User → Role → Permission hierarchy
}
```

### TypeScript Configuration
- Decorators enabled (`experimentalDecorators: true`)
- Strict null checks but relaxed `noImplicitAny`
- CommonJS module system with Node.js resolution

### Biome Configuration
The project uses Biome for ultra-fast code quality management:
```bash
# Check code quality
npm run lint

# Fix issues automatically
npm run lint:fix

# Format code
npm run format
```

Biome configuration in `biome.json`:
- TypeScript support with NestJS decorators
- Import sorting and organization
- Consistent code style matching project standards
- Arabic text and RTL support

### Testing Patterns
- Jest configuration in `package.json`
- Unit tests: `*.spec.ts` files alongside source
- E2E tests: `test/` directory with separate Jest config
- Coverage reports generated to `../coverage/`

## Dependencies & Integration Points

### Core NestJS Stack
- `@nestjs/common`, `@nestjs/core`: Core framework
- `@nestjs/platform-express`: Express.js integration
- `@nestjs/config`: Environment configuration

### Database & ORM
- `@prisma/client`: Type-safe database client
- `prisma`: Database toolkit and ORM
- Modern PostgreSQL 16 with enhanced performance

### Code Quality & Security
- `@biomejs/biome`: Ultra-fast linting, formatting, and import sorting
- `bcrypt`: Password hashing
- `helmet`: Security headers
- `@nestjs/throttler`: Rate limiting

### Additional Services
- Redis for caching and session management
- Docker with health checks for production deployment

## Project-Specific Coding Conventions

### Language Standards
- **Technical Code**: English only (variables, functions, database schemas, comments)
- **User-Facing Content**: Bilingual through i18n keys
- **Business Logic**: English with Arabic terminology mapping
- **API Documentation**: English with Arabic business term explanations

### Naming Conventions
- **Variables/Functions**: `camelCase` (e.g., `getUserById`, `calculateShippingCost`)
- **Classes/Interfaces**: `PascalCase` (e.g., `VehicleService`, `AccountingModule`)
- **Database Tables**: `snake_case` (e.g., `vehicle_inventory`, `journal_entries`)
- **i18n Keys**: Dot notation (e.g., `accounting.chart_of_accounts.assets`)

### Financial Data Handling
- **Currency**: Store as integers (smallest unit) to avoid floating-point errors
- **Transactions**: ALWAYS use database transactions for financial operations
- **Validation**: Double validation on frontend and backend for financial inputs
- **Audit Trail**: Every financial change must be traceable with timestamps and user info

### Error Handling Pattern
```typescript
try {
  await this.performFinancialOperation();
} catch (error) {
  this.logger.error(`Financial operation failed: ${error.message}`, error.stack);
  throw new BadRequestException({
    message_en: 'Financial operation failed',
    message_ar: 'فشلت العملية المالية',
    details: error.message
  });
}
```

## Key Dependencies & Integration

### Core ERP Stack
- `@nestjs/common`, `@nestjs/core`: Framework foundation
- `@nestjs/typeorm`: Database ORM with transaction support
- `@nestjs/config`: Environment and multilingual configuration
- `typeorm`: Advanced features for financial transactions and relationships
- `pg`: PostgreSQL client for production-grade data integrity

### Required Additional Packages
- **Internationalization**: `@nestjs/i18n` for Arabic/English support
- **Authentication**: `@nestjs/passport`, `@nestjs/jwt` for secure RBAC
- **Validation**: `class-validator`, `class-transformer` for data integrity
- **Security**: `bcrypt`, `helmet`, `@nestjs/throttler` for modern security stack
- **Database**: `@prisma/client`, `prisma` for type-safe ORM operations
- **Cache**: `redis` client for performance optimization
- **Logging**: `@nestjs/common` Logger for audit trails
- **Documentation**: `@nestjs/swagger` for bilingual API docs

## Configuration Files
- `tsconfig.json`: Modern ES2023 with decorators, strict typing for financial accuracy
- `biome.json`: Biome configuration for ultra-fast linting, formatting, and import organization
- `prisma/schema.prisma`: Database schema with complete ERP models and relationships
- `docker-compose.yml`: Multi-service setup with PostgreSQL 16, Redis 7, and health checks
- `package.json`: Scripts optimized for modern ERP development workflow with Prisma and Biome

## Environment Setup Requirements
- Node.js with TypeScript compilation
- PostgreSQL 16-alpine with proper Arabic text collation support
- Redis 7-alpine for caching and session management
- Docker and Docker Compose for containerized development
- Prisma CLI for database schema management
- Environment variables for sensitive accounting configurations
- Logging infrastructure for financial audit trails

## Current Database Schema (Prisma) - Sprint 1 Implementation

### ✅ **Implemented Models (9 Core Tables)**
- **Users**: User management with RBAC integration and authentication
- **Roles & Permissions**: 3-tier permission system (UserRole, UserPermission)
- **Branches**: Multi-branch support with location and status management
- **Accounts**: Chart of accounts for integral accounting module
- **CostCenters**: Cost center management for financial tracking
- **GeneralLedgerTransactions**: Core accounting journal entries foundation

### 🎯 **Working Features**
- **Branch Management**: Complete CRUD with frontend UI
- **Database Seeding**: Populated with realistic test data
- **Authentication Ready**: JWT guards and permission framework
- **API Endpoints**: RESTful APIs with proper validation
- **Frontend Integration**: React app with real-time data sync

### 📊 **Database Access Commands**
To view the complete schema:
```bash
docker exec erp_backend cat prisma/schema.prisma
```

To manage the database:
```bash
# Push schema changes
docker exec erp_backend npx prisma db push

# Generate Prisma Client  
docker exec erp_backend npx prisma generate

# Open Prisma Studio
docker exec erp_backend npx prisma studio

# View current data
docker exec erp_backend npx prisma studio --browser none --port 5555
```

### 🔗 **Live Database URLs**
- **Database**: postgresql://postgres:postgres@localhost:5432/erp_dev
- **Prisma Studio**: http://localhost:5555 (when running)

## Frontend Technology Stack (Sprint 1 Implementation)

### ✅ **Completed Frontend Foundation**
- **Framework**: React 19 + TypeScript with Vite 7.1.5 for ultra-fast development
- **Styling**: Tailwind CSS with Arabic RTL support and custom ERP brand colors
- **State Management**: TanStack Query v5 for server state + React state for UI
- **Form Management**: React Hook Form v7 + Zod v4 for type-safe validation
- **UI Components**: Professional component library with Arabic support
- **Notifications**: react-hot-toast for user feedback system

### 🎨 **Design System Implementation**
```javascript
// tailwind.config.js - Custom ERP Brand Colors
theme: {
  extend: {
    colors: {
      primary: { DEFAULT: '#3B82F6', hover: '#2563EB' },
      secondary: { DEFAULT: '#6B7280', hover: '#4B5563' },
      success: '#10B981', 
      error: '#EF4444'
    },
    fontFamily: {
      'arabic': ['Cairo', 'Noto Sans Arabic', 'sans-serif'],
    }
  }
}
```

### 🔧 **API Integration (Working)**
- **Base URL**: http://localhost:5173 → http://localhost:3000
- **HTTP Client**: Axios with interceptors for debugging and error handling
- **Real-time Data**: TanStack Query with cache invalidation
- **CORS**: Properly configured for cross-origin requests
- **Error Handling**: Comprehensive error boundaries and user feedback

### 📱 **UI Components Implemented**
- **BranchesPage**: Complete management interface with filtering
- **BranchesTable**: Responsive table with Arabic RTL support
- **BranchFormModal**: Add/Edit modal with validation
- **EmptyState**: Professional empty state component
- **Toast System**: Success/error notifications

### 🚀 **Development Server**
- **Local URL**: http://localhost:5173
- **Hot Module Replacement**: Instant updates during development
- **TypeScript**: Full type safety from API to UI
- **PostCSS**: Tailwind processing with @tailwindcss/postcss v4

### Tailwind CSS with Arabic Font Support
When configuring `tailwind.config.js`, include Arabic font families for proper text rendering:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { 
    extend: {
      fontFamily: {
        'arabic': ['Cairo', 'Noto Sans Arabic', 'sans-serif'],
      }
    } 
  },
  plugins: [require('tailwindcss-rtl')],
}
```

## Recent Technology Upgrades (v4.1)

The system has been completely modernized with the following upgrades:

### Database & ORM Migration
- **Migrated from**: TypeORM → **Prisma ORM**
- **Benefits**: Type safety, better performance, modern developer experience
- **Database**: Upgraded from PostgreSQL 15 → PostgreSQL 16-alpine

### Code Quality Tools
- **Migrated from**: ESLint + Prettier → **Biome**
- **Performance**: 100x faster linting and formatting
- **Features**: Unified toolchain for linting, formatting, and import organization

### Infrastructure Enhancements
- **Added**: Redis 7-alpine for caching and session management
- **Enhanced**: Docker Compose with health checks and proper service dependencies
- **Security**: Modern security stack with bcrypt, helmet, and rate limiting

### Developer Experience
- **Prisma Studio**: Visual database management interface
- **Type Safety**: End-to-end type safety from database to API
- **Performance**: Significantly faster development workflow

## Current Project Status (Sprint 1 - Completed Tasks 1.1-1.5)

### ✅ **Task 1.1: Database Schema (Completed)**
- **Prisma Schema**: Complete ERP database schema with 9 core models
- **Models Implemented**: User, Role, Permission, UserRole, UserPermission, Branch, Account, CostCenter, GeneralLedgerTransaction
- **Key Features**: RBAC 3-tier permission system, multi-branch support, integral accounting foundation
- **Status**: Database operational with proper relationships and constraints

### ✅ **Task 1.2: Database Seeding (Completed)**
- **Seed Script**: Professional seeding with bcrypt password hashing
- **Test Data**: Initial users, roles, permissions, accounts, cost centers, and sample branch
- **Authentication**: Admin user (admin@example.com / admin123) with full permissions
- **Status**: Database populated with realistic test data for development

### ✅ **Task 1.3: Backend API (Completed)**
- **Branches Module**: Complete CRUD operations with JWT authentication guards
- **Validation**: Zod schemas for type-safe request validation
- **Security**: JWT Auth Guard placeholders, input validation, error handling
- **API Endpoints**: GET/POST/PATCH/DELETE /branches with includeInactive filtering
- **Status**: Production-ready API with proper security and validation

### ✅ **Task 1.4: Frontend Foundation (Completed)**
- **Framework**: React + TypeScript with Vite dev server
- **Styling**: Tailwind CSS with Arabic RTL support and custom brand colors
- **State Management**: TanStack Query for server state, Zustand for client state
- **UI Components**: Professional branches table, empty states, loading indicators
- **API Integration**: Axios client with React Query hooks for seamless backend communication
- **Features**: Real-time data fetching, filtering (active/inactive), responsive design
- **Status**: Complete frontend infrastructure with branches management UI

### ✅ **Task 1.5: Form Management (Completed)**
- **Form Library**: React Hook Form with Zod validation integration
- **Modal System**: Reusable BranchFormModal supporting both Add/Edit modes
- **Validation**: Real-time form validation with Arabic error messages
- **UX Features**: Loading states, success/error toasts, proper form reset logic
- **Integration**: Seamless integration with existing API hooks and state management
- **Status**: Complete CRUD operations with professional form handling

### 🔧 **Infrastructure Status**
- **Backend**: NestJS running on Docker (localhost:3000) with CORS enabled
- **Frontend**: Vite dev server (localhost:5173) with hot module replacement
- **Database**: PostgreSQL 16-alpine with Prisma ORM, fully seeded
- **Cache**: Redis 7-alpine operational
- **Development**: Both frontend and backend running simultaneously with live reload

### 📊 **Current Data in System**
- **Branches**: 4 branches created (3 active, 1 inactive)
  - ID 1: فرع صنعاء (صنعاء) - Active
  - ID 2: فرع عدن (العاصمة عدن) - Inactive  
  - ID 3: الحديدة (باب اليمن) - Active
  - ID 4: الصافية (عاشو) - Active
- **Users**: Admin user with full permissions configured
- **Chart of Accounts**: Complete accounting structure with assets, liabilities, equity
- **RBAC**: Permissions, roles, and user assignments operational

### 🎯 **Achieved Milestones**
1. **Complete Database Architecture**: All core ERP tables with proper relationships
2. **Authentication System**: JWT guards and permission framework ready
3. **Professional Frontend**: Modern React app with Arabic support and responsive design
4. **Full CRUD Operations**: End-to-end branch management with form validation
5. **Production-Ready Code**: TypeScript safety, error handling, loading states
6. **Developer Experience**: Hot reload, debugging tools, proper logging

### 📝 **Technical Implementation Notes**
- **API Base URL**: http://localhost:3000 (configured in VITE_API_BASE_URL)
- **CORS Configuration**: Backend allows requests from localhost:5173
- **Database Connection**: Prisma Client with connection pooling
- **Validation Pipeline**: Zod schemas on both frontend and backend
- **Toast Notifications**: react-hot-toast for user feedback
- **Form Management**: React Hook Form with zodResolver for validation
- **State Management**: TanStack Query for server state, React state for UI

### 🚀 **Ready for Next Phase**
The system now has a solid foundation for:
- Additional ERP modules (vehicles, auctions, accounting, etc.)
- User authentication and authorization implementation  
- Advanced reporting and analytics
- Mobile-responsive design expansion
- Multi-language support implementation

## Next Steps for ERP Development
1. Complete Sprint 0: Project foundation setup with professional standards
2. Implement core accounting module with chart of accounts
3. Set up RBAC with permission, role, and user tables
4. Configure i18n with Arabic accounting terminology
5. Create vehicle lifecycle tracking modules
6. Implement automated journal entry system