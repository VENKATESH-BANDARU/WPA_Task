-- 02_create_stored_procedures.sql

-- Example stored procedure for user authentication
CREATE OR REPLACE FUNCTION authenticate_user(email VARCHAR, password VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users WHERE email = email AND password = password
    );
END;
$$ LANGUAGE plpgsql;

-- Add more stored procedures as needed