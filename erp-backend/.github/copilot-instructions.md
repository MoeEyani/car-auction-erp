# Car Auction ERP Backend - NestJS Project Instructions

This is the backend for a comprehensive ERP system designed for a multi-branch car auction business. The system tracks the complete vehicle lifecycle from customer bid requests through auction purchases, international shipping, customs clearance, maintenance, and final sales.

## Business Domain & Architecture

- **Domain**: Car auction business with multi-branch operations
- **Vehicle Lifecycle**: Bid request → Auction purchase → Shipping → Customs → Maintenance → Sale
- **Framework**: NestJS v11 with TypeScript, modular service-oriented architecture
- **Database**: PostgreSQL with TypeORM v0.3.26
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
- **Database**: PostgreSQL with TypeORM v0.3.26  
- **Internationalization**: NestJS i18n module for bilingual support
- **Primary Language**: Arabic (العربية) with English secondary
- **Infrastructure**: Docker containers for cloud deployment
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
npm run lint         # ESLint with auto-fix
npm run format       # Prettier formatting
npm run test         # Unit tests with Jest
npm run test:e2e     # End-to-end tests
npm run test:cov     # Coverage reports
```

### Financial Transaction Pattern
```typescript
// ALWAYS wrap financial operations in transactions
async createVehiclePurchase(vehicleData: any, cost: number) {
  const queryRunner = this.dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  
  try {
    // 1. Create vehicle record
    const vehicle = await queryRunner.manager.save(Vehicle, vehicleData);
    
    // 2. Auto-create journal entries
    await this.accountingService.createJournalEntry({
      debit: { account: 'VEHICLE_INVENTORY', amount: cost },
      credit: { account: 'CASH', amount: cost }
    }, queryRunner);
    
    await queryRunner.commitTransaction();
    return vehicle;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}
```

### Database Integration
- Uses `@nestjs/typeorm` and `@nestjs/config` for database configuration
- PostgreSQL driver (`pg`) configured for production use
- TypeORM entities should follow the established patterns

## Modular Architecture Patterns

### Core Business Modules
- **Users Module**: Authentication, RBAC, user preferences (language)
- **Vehicles Module**: Vehicle lifecycle management, inventory tracking
- **Accounting Module**: General Ledger, journal entries, financial reports
- **Auctions Module**: Bid management, auction house integrations
- **Shipping Module**: International logistics, customs documentation
- **Maintenance Module**: Service tracking, cost management

### Module Structure Pattern
```typescript
// Standard NestJS pattern with financial integration
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly accountingService: AccountingService // Always inject accounting
  ) {}
}

@Injectable()
export class VehiclesService {
  // Every service that handles costs must integrate with accounting
  async addShippingCost(vehicleId: string, cost: number) {
    // Operational update + automatic journal entry
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
- `@nestjs/typeorm`: Database ORM integration

### Database
- `typeorm`: ORM for database operations
- `pg`: PostgreSQL client driver

### Development Tools
- ESLint with TypeScript and Prettier integration
- Jest for testing with TypeScript support
- Source maps and incremental compilation enabled

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
- **Logging**: `@nestjs/common` Logger for audit trails
- **Documentation**: `@nestjs/swagger` for bilingual API docs

## Configuration Files
- `tsconfig.json`: Modern ES2023 with decorators, strict typing for financial accuracy
- `eslint.config.mjs`: TypeScript ESLint with Prettier, warns on floating promises
- `.prettierrc`: Single quotes, trailing commas for consistency
- `package.json`: Scripts optimized for ERP development workflow

## Environment Setup Requirements
- Node.js with TypeScript compilation
- PostgreSQL with proper Arabic text collation support
- Docker for containerized deployment
- Environment variables for sensitive accounting configurations
- Logging infrastructure for financial audit trails

## Frontend Configuration Notes

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

## Next Steps for ERP Development
1. Complete Sprint 0: Project foundation setup with professional standards
2. Implement core accounting module with chart of accounts
3. Set up RBAC with permission, role, and user tables
4. Configure i18n with Arabic accounting terminology
5. Create vehicle lifecycle tracking modules
6. Implement automated journal entry system