-- =================================================================
-- SQL Schema for ERP Core Tables (Sprint 1)
-- Generated on: September 16, 2025
-- Task: 1.1 - Create Administrative and Accounting Tables
-- =================================================================

-- =================================================================
-- Section 1: Administrative & Security Tables
-- =================================================================

-- Stores the physical branches/offices of the company
CREATE TABLE branches (
    branch_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE branches IS 'Stores the physical branches/offices of the company';
COMMENT ON COLUMN branches.name IS 'Unique name of the branch';
COMMENT ON COLUMN branches.location IS 'Physical address or location description';
COMMENT ON COLUMN branches.is_active IS 'Flag to enable/disable branch operations';

-- Stores the master list of all possible actions in the system
CREATE TABLE permissions (
    permission_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE, -- e.g., 'view_customers', 'edit_vehicle_costs'
    description TEXT,
    module VARCHAR(100) NOT NULL -- e.g., 'Customers', 'Vehicles', 'Accounting'
);

COMMENT ON TABLE permissions IS 'Master list of all possible system actions/permissions';
COMMENT ON COLUMN permissions.name IS 'Unique permission identifier (e.g., view_customers, edit_vehicle_costs)';
COMMENT ON COLUMN permissions.module IS 'Module/section where this permission applies (e.g., Customers, Vehicles, Accounting)';

-- Stores customizable roles that group multiple permissions
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    is_system_role BOOLEAN NOT NULL DEFAULT FALSE, -- To protect default roles from being deleted
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE roles IS 'Customizable roles that group multiple permissions';
COMMENT ON COLUMN roles.is_system_role IS 'Protects default system roles from being deleted';

-- Junction table to link Roles with their Permissions (Many-to-Many)
CREATE TABLE role_permissions (
    role_id INT NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    permission_id INT NOT NULL REFERENCES permissions(permission_id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

COMMENT ON TABLE role_permissions IS 'Many-to-many relationship between roles and permissions';

-- Stores user accounts
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT REFERENCES roles(role_id) ON DELETE RESTRICT,
    branch_id INT REFERENCES branches(branch_id) ON DELETE RESTRICT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    preferred_language VARCHAR(5) DEFAULT 'ar',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE users IS 'System user accounts with role and branch assignments';
COMMENT ON COLUMN users.password_hash IS 'Hashed password for security';
COMMENT ON COLUMN users.preferred_language IS 'User interface language preference (ar/en)';

-- Junction table for user-specific permission overrides (Many-to-Many)
CREATE TABLE user_permission_overrides (
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    permission_id INT NOT NULL REFERENCES permissions(permission_id) ON DELETE CASCADE,
    has_permission BOOLEAN NOT NULL, -- TRUE to grant, FALSE to revoke
    PRIMARY KEY (user_id, permission_id)
);

COMMENT ON TABLE user_permission_overrides IS 'User-specific permission overrides beyond their role permissions';
COMMENT ON COLUMN user_permission_overrides.has_permission IS 'TRUE to grant permission, FALSE to revoke it';

-- =================================================================
-- Section 2: Core Accounting Tables
-- =================================================================

-- Stores customizable cost centers for financial tracking
CREATE TABLE cost_centers (
    cost_center_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    branch_id INT REFERENCES branches(branch_id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE cost_centers IS 'Customizable cost centers for financial tracking and analysis';

-- The Chart of Accounts (COA)
CREATE TABLE accounts (
    account_id SERIAL PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    name JSONB NOT NULL, -- For bilingual names, e.g., {"en": "Cash Fund", "ar": "صندوق النقدية"}
    account_type VARCHAR(50) NOT NULL, -- Asset, Liability, Equity, Revenue, Expense
    account_sub_type VARCHAR(50), -- Cash, Bank, Receivable, etc.
    parent_account_id INT REFERENCES accounts(account_id),
    branch_id INT REFERENCES branches(branch_id) ON DELETE RESTRICT, -- For branch-specific accounts
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE accounts IS 'Chart of Accounts (COA) - defines all financial accounts in the system';
COMMENT ON COLUMN accounts.name IS 'Bilingual account names stored as JSON (e.g., {"en": "Cash Fund", "ar": "صندوق النقدية"})';
COMMENT ON COLUMN accounts.account_type IS 'Major account category: Asset, Liability, Equity, Revenue, Expense';
COMMENT ON COLUMN accounts.account_sub_type IS 'Detailed classification: Cash, Bank, Receivable, etc.';
COMMENT ON COLUMN accounts.parent_account_id IS 'For hierarchical account structure';

-- The General Ledger (GL) - The single source of truth for all financial transactions
CREATE TABLE general_ledger_transactions (
    transaction_id BIGSERIAL PRIMARY KEY,
    entry_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    description TEXT NOT NULL,
    account_id INT NOT NULL REFERENCES accounts(account_id) ON DELETE RESTRICT,
    debit DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    credit DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    -- Analytical Dimensions
    branch_id INT REFERENCES branches(branch_id) ON DELETE RESTRICT,
    user_id INT REFERENCES users(user_id) ON DELETE RESTRICT,
    customer_id INT, -- Will be linked to 'customers' table later
    vehicle_id INT,  -- Will be linked to 'vehicles' table later
    cost_center_id INT REFERENCES cost_centers(cost_center_id) ON DELETE RESTRICT,
    -- Audit Trail
    source_module VARCHAR(100),
    source_record_id INT,
    -- Constraint to ensure a transaction is either a debit or a credit, not both
    CONSTRAINT debit_credit_check CHECK (debit >= 0 AND credit >= 0 AND (debit > 0 AND credit = 0 OR debit = 0 AND credit > 0))
);

COMMENT ON TABLE general_ledger_transactions IS 'General Ledger - single source of truth for all financial transactions';
COMMENT ON COLUMN general_ledger_transactions.debit IS 'Debit amount in system currency';
COMMENT ON COLUMN general_ledger_transactions.credit IS 'Credit amount in system currency';
COMMENT ON COLUMN general_ledger_transactions.customer_id IS 'Reference to customer (will be linked when customers table is created)';
COMMENT ON COLUMN general_ledger_transactions.vehicle_id IS 'Reference to vehicle (will be linked when vehicles table is created)';
COMMENT ON COLUMN general_ledger_transactions.source_module IS 'Module that generated this transaction (e.g., Vehicles, Auctions)';
COMMENT ON COLUMN general_ledger_transactions.source_record_id IS 'ID of the source record that generated this transaction';

-- =================================================================
-- Create indexes for better performance
-- =================================================================

-- Indexes for users table
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_branch_id ON users(branch_id);

-- Indexes for general_ledger_transactions table (most queried)
CREATE INDEX idx_gl_entry_date ON general_ledger_transactions(entry_date);
CREATE INDEX idx_gl_account_id ON general_ledger_transactions(account_id);
CREATE INDEX idx_gl_branch_id ON general_ledger_transactions(branch_id);
CREATE INDEX idx_gl_customer_id ON general_ledger_transactions(customer_id);
CREATE INDEX idx_gl_vehicle_id ON general_ledger_transactions(vehicle_id);
CREATE INDEX idx_gl_source_module ON general_ledger_transactions(source_module);

-- Indexes for accounts table
CREATE INDEX idx_accounts_number ON accounts(account_number);
CREATE INDEX idx_accounts_type ON accounts(account_type);
CREATE INDEX idx_accounts_parent ON accounts(parent_account_id);

-- Schema creation completed successfully
SELECT 'ERP Core Schema (Sprint 1 - Task 1.1) created successfully!' as status;