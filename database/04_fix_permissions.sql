-- Fix missing branch-specific permissions
INSERT INTO role_permissions ("roleId", "permissionId") 
SELECT 3, p.id FROM permissions p 
WHERE p.name IN ('view_own_branch_only', 'view_own_branch_users_only', 'manage_own_branch_users_only') 
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions ("roleId", "permissionId") 
SELECT 4, p.id FROM permissions p 
WHERE p.name IN ('view_own_branch_only', 'view_own_branch_users_only', 'manage_own_branch_users_only') 
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions ("roleId", "permissionId") 
SELECT 5, p.id FROM permissions p 
WHERE p.name IN ('view_own_branch_only') 
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions ("roleId", "permissionId") 
SELECT 7, p.id FROM permissions p 
WHERE p.name IN ('view_own_branch_only', 'view_own_branch_users_only') 
ON CONFLICT DO NOTHING;

INSERT INTO role_permissions ("roleId", "permissionId") 
SELECT 2, p.id FROM permissions p 
WHERE p.name IN ('view_own_branch_only') 
ON CONFLICT DO NOTHING;