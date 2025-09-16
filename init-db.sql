-- Initialize database with Arabic support
-- This script runs when PostgreSQL container starts

-- Set default encoding and collation for Arabic support
ALTER DATABASE erp_database SET default_text_search_config = 'arabic';

-- Create extension for better text search (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Ensure UTF-8 encoding
SET client_encoding = 'UTF8';

-- Ensure the user has the correct password set for external connections
ALTER USER erp_user PASSWORD 'erp_password';