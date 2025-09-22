# Role Templates Feature Implementation

## Overview
Added preconfigured role templates that can be selected from a dropdown when creating new roles. This feature helps standardize role creation across the organization and ensures consistent permission assignments.

## Backend Implementation

### 1. Role Templates Constants (`src/roles/constants/role-templates.ts`)
- **12 predefined role templates** organized by category:
  - **Management**: Branch Manager, Assistant Manager, Regional Manager
  - **Operations**: Operations Supervisor, Sales Coordinator, Inventory Manager
  - **Support**: Customer Service Representative, Technical Support Specialist  
  - **Finance**: Branch Accountant, Cashier, Financial Analyst
  - **Basic**: General Employee

- **Template Structure**:
  ```typescript
  interface RoleTemplate {
    id: string;
    name: string;
    description: string;
    category: 'management' | 'operations' | 'support' | 'finance';
    permissions: string[];
    branchScope: 'global' | 'branch';
  }
  ```

- **Security Features**:
  - Branch-scoped vs Global templates
  - Permission-based template availability
  - Super admin gets access to all templates
  - Regular users only see branch-level templates

### 2. Updated DTO (`src/roles/dto/role.zod.ts`)
- Added optional `templateId` field to CreateRoleDto
- Supports both manual role creation and template-based creation

### 3. Enhanced Roles Service (`src/roles/roles.service.ts`)
- **New Methods**:
  - `getRoleTemplates(requestUserId)` - Get available templates for user
  - `getRoleTemplateById(templateId, requestUserId)` - Get specific template
  - `getAvailablePermissions(requestUserId)` - Get filtered permissions

- **Template Processing Logic**:
  - Validates template availability based on user permissions
  - Maps template permission names to database permission IDs
  - Auto-populates role name and description from template
  - Maintains security restrictions (super admin vs regular users)

### 4. Updated Controller (`src/roles/roles.controller.ts`)
- **New Endpoints**:
  - `GET /roles/templates` - List available templates
  - `GET /roles/templates/:templateId` - Get specific template
  - Updated `GET /roles/permissions` to use filtered permissions

## Frontend Implementation

### 1. Enhanced Hooks (`src/pages/Roles/hooks.ts`)
- Added `RoleTemplate` interface
- New hooks: `useRoleTemplates()`, `useRoleTemplate(templateId)`
- Updated CreateRoleDto to include optional templateId

### 2. Updated Role Form Modal (`src/pages/Roles/RoleFormModal.tsx`)
- **Template Selection UI**:
  - Checkbox to enable/disable template mode
  - Categorized dropdown for template selection
  - Auto-population of role details from template
  - Manual permission override capability

- **Features**:
  - Templates grouped by category (Management, Operations, Support, Finance)
  - Arabic translations for categories
  - Template selection updates name, description, and permissions
  - Users can modify template-suggested permissions
  - Only available for new role creation (not editing)

## Security & Access Control

### Template Access Rules:
1. **Super Admin**: Can use any template (global or branch)
2. **Branch Admin**: Can only use branch-scoped templates
3. **Regular Users**: Limited to basic branch templates

### Permission Filtering:
- Super admins see all permissions including system-level
- Regular users cannot see or assign admin permissions
- Templates respect the same permission restrictions

## Usage Workflow

### Creating a Role with Template:
1. User opens "Create New Role" dialog
2. Checks "Use Predefined Role Template" checkbox
3. Selects category and template from dropdown
4. Role name, description, and permissions auto-populate
5. User can modify permissions if needed
6. Submits form with both template reference and final permissions

### Template Categories:
- **الإدارة (Management)**: Manager and supervisor roles
- **العمليات (Operations)**: Day-to-day operational roles
- **الدعم (Support)**: Customer and technical support roles  
- **المالية (Finance)**: Financial and accounting roles

## Database Impact
- No database schema changes required
- Templates are stored as constants in code
- Existing permission system fully utilized
- Maintains all current security restrictions

## Benefits
1. **Standardization**: Consistent role definitions across branches
2. **Efficiency**: Faster role creation with predefined templates
3. **Security**: Built-in permission validation and restrictions
4. **Flexibility**: Templates can be customized before saving
5. **Scalability**: Easy to add new templates without database changes

## Testing Status
- Backend endpoints mapped correctly: ✅
- Authentication guards active: ✅
- Template routes responding: ✅
- Ready for frontend testing: ✅

The feature is now fully implemented and ready for testing in the browser!