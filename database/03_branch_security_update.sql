-- =================================================================
-- Branch-Based Access Control Security Update
-- Date: September 23, 2025
-- Purpose: Implement branch isolation and proper permission hierarchy
-- =================================================================

-- Add new branch-specific permissions
INSERT INTO permissions (name, description, module) VALUES
('view_all_branches', 'Super admin only - see all branches', 'Branches'),
('view_own_branch_only', 'Regular users - see only their assigned branch', 'Branches'),
('view_all_users', 'Super admin only - see users from all branches', 'Users'),
('view_own_branch_users_only', 'Regular users - see only users from their branch', 'Users'),
('manage_all_users', 'Super admin only - manage users from all branches', 'Users'),
('manage_own_branch_users_only', 'Branch managers - manage users from their branch only', 'Users'),
('create_global_admin', 'Super admin only - can create admin roles and global permissions', 'Roles'),
('manage_system_roles', 'Super admin only - can manage system-level roles', 'Roles');

-- Update Super Admin role to have the new global permissions
INSERT INTO role_permissions ("roleId", "permissionId")
SELECT 1, p.id FROM permissions p 
WHERE p.name IN (
    'view_all_branches', 
    'view_all_users', 
    'manage_all_users', 
    'create_global_admin',
    'manage_system_roles'
);

-- Remove dangerous permissions from non-super-admin roles
-- Remove view_branches and manage_branches from roles that should be branch-specific
DELETE FROM role_permissions 
WHERE "roleId" IN (2, 3, 4, 5, 6, 7, 8) 
AND "permissionId" IN (
    SELECT id FROM permissions WHERE name IN ('view_branches', 'manage_branches', 'view_users', 'manage_users')
);

-- Add appropriate branch-specific permissions to existing roles

-- Admin role (ID: 3) - Branch Admin permissions
INSERT INTO role_permissions ("roleId", "permissionId")
SELECT 3, p.id FROM permissions p 
WHERE p.name IN (
    'view_own_branch_only',
    'view_own_branch_users_only', 
    'manage_own_branch_users_only',
    'view_roles',
    'view_dashboard',
    'change_own_password'
);

-- Manager role (ID: 4) - Branch Manager permissions  
INSERT INTO role_permissions ("roleId", "permissionId")
SELECT 4, p.id FROM permissions p 
WHERE p.name IN (
    'view_own_branch_only',
    'view_own_branch_users_only',
    'manage_own_branch_users_only',
    'view_dashboard',
    'change_own_password'
);

-- User role (ID: 5) - Branch User permissions
INSERT INTO role_permissions ("roleId", "permissionId")
SELECT 5, p.id FROM permissions p 
WHERE p.name IN (
    'view_own_branch_only',
    'view_dashboard',
    'change_own_password'
);

-- Branch role (ID: 7) - Branch operations permissions
INSERT INTO role_permissions ("roleId", "permissionId")
SELECT 7, p.id FROM permissions p 
WHERE p.name IN (
    'view_own_branch_only',
    'view_own_branch_users_only',
    'view_dashboard',
    'change_own_password'
);

-- Operations Staff (ID: 2) - Customer operations with branch restrictions
INSERT INTO role_permissions ("roleId", "permissionId")
SELECT 2, p.id FROM permissions p 
WHERE p.name IN (
    'view_own_branch_only',
    'view_customers',
    'manage_customers',
    'view_dashboard',
    'change_own_password'
);

-- Verification queries
SELECT 'New permissions added:' as status;
SELECT name, description, module FROM permissions WHERE name LIKE '%_all_%' OR name LIKE '%_own_%' OR name LIKE '%global%' OR name LIKE '%system%';

SELECT 'Super Admin permissions:' as status;
SELECT p.name, p.description 
FROM role_permissions rp 
JOIN permissions p ON rp."permissionId" = p.id 
WHERE rp."roleId" = 1 
ORDER BY p.name;

SELECT 'Branch Admin permissions (Role 3):' as status;
SELECT p.name, p.description 
FROM role_permissions rp 
JOIN permissions p ON rp."permissionId" = p.id 
WHERE rp."roleId" = 3 
ORDER BY p.name;