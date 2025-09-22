-- Verify role permissions after migration
SELECT 'Super Admin (Role 1) permissions:' as section;
SELECT p.name as permission_name 
FROM role_permissions rp 
JOIN permissions p ON rp."permissionId" = p.id 
WHERE rp."roleId" = 1 
ORDER BY p.name;

SELECT 'Admin (Role 3) permissions:' as section;
SELECT p.name as permission_name 
FROM role_permissions rp 
JOIN permissions p ON rp."permissionId" = p.id 
WHERE rp."roleId" = 3 
ORDER BY p.name;

SELECT 'Manager (Role 4) permissions:' as section;
SELECT p.name as permission_name 
FROM role_permissions rp 
JOIN permissions p ON rp."permissionId" = p.id 
WHERE rp."roleId" = 4 
ORDER BY p.name;

SELECT 'User (Role 5) permissions:' as section;
SELECT p.name as permission_name 
FROM role_permissions rp 
JOIN permissions p ON rp."permissionId" = p.id 
WHERE rp."roleId" = 5 
ORDER BY p.name;