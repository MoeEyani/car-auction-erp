-- =================================================================
-- Sample Data for ERP Core Tables (Sprint 1)
-- Task 1.1 - Test data insertion to verify schema
-- =================================================================

-- Insert sample branches
INSERT INTO branches (name, location, is_active) VALUES 
('الفرع الرئيسي', 'الرياض - حي الملز', TRUE),
('فرع جدة', 'جدة - شارع التحلية', TRUE),
('فرع الدمام', 'الدمام - الكورنيش', FALSE);

-- Insert sample permissions
INSERT INTO permissions (name, description, module) VALUES
('view_dashboard', 'View main dashboard', 'Dashboard'),
('manage_users', 'Create, edit, and delete users', 'Users'),
('view_users', 'View user information', 'Users'),
('manage_vehicles', 'Create, edit, and delete vehicles', 'Vehicles'),
('view_vehicles', 'View vehicle information', 'Vehicles'),
('manage_auctions', 'Create, edit, and delete auctions', 'Auctions'),
('view_auctions', 'View auction information', 'Auctions'),
('manage_accounting', 'Create and edit financial transactions', 'Accounting'),
('view_reports', 'View financial and business reports', 'Reports'),
('manage_branches', 'Create, edit, and delete branches', 'Branches'),
('view_all_branches', 'View all branches (super admin only)', 'Branches'),
('view_all_users', 'View users from all branches (super admin only)', 'Users'),
('manage_all_users', 'Manage users from all branches (super admin only)', 'Users'),
('super_admin_access', 'Full system access across all branches', 'System');

-- Insert sample roles
INSERT INTO roles (name, description, is_system_role) VALUES
('مدير عام', 'صلاحية كاملة على النظام', TRUE),
('محاسب', 'إدارة العمليات المالية والتقارير', TRUE),
('مشغل مزاد', 'إدارة المزادات والسيارات', TRUE),
('مراقب', 'عرض البيانات فقط بدون تعديل', TRUE);

-- Link permissions to roles
-- مدير عام - all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id 
FROM roles r, permissions p 
WHERE r.name = 'مدير عام';

-- محاسب - accounting and reporting permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id 
FROM roles r, permissions p 
WHERE r.name = 'محاسب' 
AND p.name IN ('view_dashboard', 'manage_accounting', 'view_reports', 'view_vehicles', 'view_auctions');

-- مشغل مزاد - vehicle and auction permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id 
FROM roles r, permissions p 
WHERE r.name = 'مشغل مزاد' 
AND p.name IN ('view_dashboard', 'manage_vehicles', 'view_vehicles', 'manage_auctions', 'view_auctions');

-- مراقب - view only permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id 
FROM roles r, permissions p 
WHERE r.name = 'مراقب' 
AND p.name IN ('view_dashboard', 'view_users', 'view_vehicles', 'view_auctions', 'view_reports');

-- Insert sample cost centers
INSERT INTO cost_centers (name, branch_id) VALUES
('المزادات', 1),
('الإدارة العامة', 1),
('التسويق', 1),
('الصيانة', 2);

-- Insert sample chart of accounts
INSERT INTO accounts (account_number, name, account_type, account_sub_type, parent_account_id, branch_id, is_active) VALUES
-- Assets
('1000', '{"en": "Assets", "ar": "الأصول"}', 'Asset', 'Main', NULL, NULL, TRUE),
('1100', '{"en": "Current Assets", "ar": "الأصول المتداولة"}', 'Asset', 'Current', 1, NULL, TRUE),
('1101', '{"en": "Cash Fund", "ar": "صندوق النقدية"}', 'Asset', 'Cash', 2, 1, TRUE),
('1102', '{"en": "Bank Account - SNB", "ar": "البنك السعودي الوطني"}', 'Asset', 'Bank', 2, 1, TRUE),
('1200', '{"en": "Accounts Receivable", "ar": "ذمم مدينة"}', 'Asset', 'Receivable', 2, NULL, TRUE),

-- Liabilities
('2000', '{"en": "Liabilities", "ar": "الخصوم"}', 'Liability', 'Main', NULL, NULL, TRUE),
('2100', '{"en": "Current Liabilities", "ar": "الخصوم المتداولة"}', 'Liability', 'Current', 6, NULL, TRUE),
('2101', '{"en": "Accounts Payable", "ar": "ذمم دائنة"}', 'Liability', 'Payable', 7, NULL, TRUE),

-- Equity
('3000', '{"en": "Owner Equity", "ar": "حقوق الملكية"}', 'Equity', 'Main', NULL, NULL, TRUE),
('3100', '{"en": "Capital", "ar": "رأس المال"}', 'Equity', 'Capital', 9, NULL, TRUE),

-- Revenue
('4000', '{"en": "Revenue", "ar": "الإيرادات"}', 'Revenue', 'Main', NULL, NULL, TRUE),
('4100', '{"en": "Auction Revenue", "ar": "إيرادات المزادات"}', 'Revenue', 'Sales', 11, NULL, TRUE),
('4200', '{"en": "Service Revenue", "ar": "إيرادات الخدمات"}', 'Revenue', 'Service', 11, NULL, TRUE),

-- Expenses
('5000', '{"en": "Expenses", "ar": "المصروفات"}', 'Expense', 'Main', NULL, NULL, TRUE),
('5100', '{"en": "Operating Expenses", "ar": "مصروفات تشغيلية"}', 'Expense', 'Operating', 14, NULL, TRUE),
('5101', '{"en": "Salaries", "ar": "الرواتب"}', 'Expense', 'Payroll', 15, NULL, TRUE),
('5102', '{"en": "Rent", "ar": "الإيجار"}', 'Expense', 'Rent', 15, NULL, TRUE);

-- Insert sample users
INSERT INTO users (full_name, username, password_hash, role_id, branch_id, is_active, preferred_language) VALUES
('أحمد محمد السعد', 'admin', '$2b$10$dummy.hash.for.testing.purposes.only', 1, 1, TRUE, 'ar'),
('فاطمة علي الزهراني', 'accountant', '$2b$10$dummy.hash.for.testing.purposes.only', 2, 1, TRUE, 'ar'),
('محمد عبدالله القحطاني', 'auctioneer', '$2b$10$dummy.hash.for.testing.purposes.only', 3, 1, TRUE, 'ar'),
('سارة أحمد النجار', 'viewer', '$2b$10$dummy.hash.for.testing.purposes.only', 4, 2, TRUE, 'ar');

-- Insert sample general ledger transactions
INSERT INTO general_ledger_transactions 
(description, account_id, debit, credit, branch_id, user_id, cost_center_id, source_module, source_record_id) 
VALUES
('Opening Balance - Cash Fund', 3, 50000.00, 0.00, 1, 1, 2, 'Setup', 1),
('Opening Balance - Capital', 10, 0.00, 50000.00, 1, 1, 2, 'Setup', 1),
('Bank Deposit', 4, 30000.00, 0.00, 1, 1, 2, 'Banking', 1),
('Cash Withdrawal for Deposit', 3, 0.00, 30000.00, 1, 1, 2, 'Banking', 1);

-- Verification queries
SELECT 'Sample data inserted successfully!' as status;

SELECT 'Branches:' as section, count(*) as count FROM branches
UNION ALL
SELECT 'Permissions:', count(*) FROM permissions
UNION ALL
SELECT 'Roles:', count(*) FROM roles
UNION ALL
SELECT 'Role Permissions:', count(*) FROM role_permissions
UNION ALL
SELECT 'Users:', count(*) FROM users
UNION ALL
SELECT 'Cost Centers:', count(*) FROM cost_centers
UNION ALL
SELECT 'Accounts:', count(*) FROM accounts
UNION ALL
SELECT 'GL Transactions:', count(*) FROM general_ledger_transactions;