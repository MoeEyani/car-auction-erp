// src/roles/constants/role-templates.ts

export interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  category: 'management' | 'operations' | 'support' | 'finance';
  permissions: string[];
  branchScope: 'global' | 'branch';
}

export const ROLE_TEMPLATES: RoleTemplate[] = [
  // Management Roles
  {
    id: 'branch-manager',
    name: 'Branch Manager',
    description: 'Manages all operations within a single branch',
    category: 'management',
    branchScope: 'branch',
    permissions: [
      'manage_own_branch_users_only',
      'view_own_branch_users_only',
      'view_own_branch_only',
      'manage_roles',
      'view_roles',
      'view_dashboard'
    ]
  },
  {
    id: 'assistant-manager',
    name: 'Assistant Manager',
    description: 'Assists in branch management with limited administrative access',
    category: 'management',
    branchScope: 'branch',
    permissions: [
      'view_own_branch_only',
      'view_own_branch_users_only',
      'view_users',
      'view_dashboard'
    ]
  },
  {
    id: 'regional-manager',
    name: 'Regional Manager',
    description: 'Manages multiple branches within a region (Super Admin only)',
    category: 'management',
    branchScope: 'global',
    permissions: [
      'view_all_branches',
      'manage_branches',
      'view_all_users',
      'manage_all_users',
      'view_roles',
      'manage_roles',
      'view_dashboard'
    ]
  },

  // Operations Roles
  {
    id: 'operations-supervisor',
    name: 'Operations Supervisor',
    description: 'Supervises day-to-day operations within the branch',
    category: 'operations',
    branchScope: 'branch',
    permissions: [
      'view_own_branch_only',
      'view_own_branch_users_only',
      'view_dashboard'
    ]
  },
  {
    id: 'sales-coordinator',
    name: 'Sales Coordinator',
    description: 'Coordinates sales activities and customer relations',
    category: 'operations',
    branchScope: 'branch',
    permissions: [
      'view_own_branch_only',
      'manage_customers',
      'view_customers',
      'view_dashboard'
    ]
  },
  {
    id: 'inventory-manager',
    name: 'Inventory Manager',
    description: 'Manages inventory and stock levels',
    category: 'operations',
    branchScope: 'branch',
    permissions: [
      'view_own_branch_only',
      'view_dashboard'
    ]
  },

  // Support Roles
  {
    id: 'customer-service',
    name: 'Customer Service Representative',
    description: 'Handles customer inquiries and support requests',
    category: 'support',
    branchScope: 'branch',
    permissions: [
      'view_own_branch_only',
      'view_customers',
      'manage_customers',
      'view_dashboard'
    ]
  },
  {
    id: 'technical-support',
    name: 'Technical Support Specialist',
    description: 'Provides technical assistance and system support',
    category: 'support',
    branchScope: 'branch',
    permissions: [
      'view_own_branch_only',
      'view_dashboard'
    ]
  },

  // Finance Roles
  {
    id: 'accountant',
    name: 'Branch Accountant',
    description: 'Handles branch financial records and transactions',
    category: 'finance',
    branchScope: 'branch',
    permissions: [
      'view_own_branch_only',
      'view_dashboard'
    ]
  },
  {
    id: 'cashier',
    name: 'Cashier',
    description: 'Processes payments and handles cash transactions',
    category: 'finance',
    branchScope: 'branch',
    permissions: [
      'view_own_branch_only',
      'view_dashboard'
    ]
  },
  {
    id: 'financial-analyst',
    name: 'Financial Analyst',
    description: 'Analyzes financial data and generates reports',
    category: 'finance',
    branchScope: 'branch',
    permissions: [
      'view_own_branch_only',
      'view_dashboard'
    ]
  },

  // Basic Employee Role
  {
    id: 'employee',
    name: 'General Employee',
    description: 'Basic employee with minimal permissions',
    category: 'operations',
    branchScope: 'branch',
    permissions: [
      'view_own_branch_only',
      'view_dashboard',
      'change_own_password'
    ]
  }
];

export const getRoleTemplatesByCategory = () => {
  return ROLE_TEMPLATES.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, RoleTemplate[]>);
};

export const getRoleTemplateById = (id: string): RoleTemplate | undefined => {
  return ROLE_TEMPLATES.find(template => template.id === id);
};

export const getAvailableTemplatesForUser = (userPermissions: string[]): RoleTemplate[] => {
  const isSuperAdmin = userPermissions.includes('system_admin') || 
                      userPermissions.includes('create_global_admin');

  return ROLE_TEMPLATES.filter(template => {
    // Super admin can use any template
    if (isSuperAdmin) return true;
    
    // Regular users can only use branch-scoped templates
    return template.branchScope === 'branch';
  });
};