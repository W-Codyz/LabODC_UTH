-- Seed Data cho LabODC - Dữ liệu mẫu để test
-- Password cho tất cả users: Password@123
-- BCrypt hash: $2a$10$Y5SQV5lQH7bGQHv/0YQxFO5w5y5Z1nUz1Y5z5z5z5z5z5z5z5z5zu (demo hash)

-- =====================================================
-- 1. INSERT DEMO USERS
-- =====================================================
-- Password hash for "Password@123"
-- Sử dụng BCrypt online hoặc trong code: BCrypt.hashpw("Password@123", BCrypt.gensalt())

-- System Admin
INSERT INTO users (email, password_hash, role, status, email_verified, email_verified_at, created_at, updated_at)
VALUES 
    ('admin@labodc.com', '$2a$10$eImiTXuWVxfm37uY4JANjOaQXV.QRk9E4h3I2m7LZqI9U9jZ2gWym', 'SYSTEM_ADMIN', 'ACTIVE', true, NOW(), NOW(), NOW()),
    ('labadmin@labodc.com', '$2a$10$eImiTXuWVxfm37uY4JANjOaQXV.QRk9E4h3I2m7LZqI9U9jZ2gWym', 'LAB_ADMIN', 'ACTIVE', true, NOW(), NOW(), NOW());

-- Enterprise Users
INSERT INTO users (email, password_hash, role, status, email_verified, email_verified_at, created_at, updated_at)
VALUES 
    ('enterprise1@example.com', '$2a$10$eImiTXuWVxfm37uY4JANjOaQXV.QRk9E4h3I2m7LZqI9U9jZ2gWym', 'ENTERPRISE', 'ACTIVE', true, NOW(), NOW(), NOW()),
    ('enterprise2@example.com', '$2a$10$eImiTXuWVxfm37uY4JANjOaQXV.QRk9E4h3I2m7LZqI9U9jZ2gWym', 'ENTERPRISE', 'ACTIVE', true, NOW(), NOW(), NOW()),
    ('enterprise3@example.com', '$2a$10$eImiTXuWVxfm37uY4JANjOaQXV.QRk9E4h3I2m7LZqI9U9jZ2gWym', 'ENTERPRISE', 'PENDING', false, NULL, NOW(), NOW());

-- Talent Users (Students)
INSERT INTO users (email, password_hash, role, status, email_verified, email_verified_at, created_at, updated_at)
VALUES 
    ('talent1@student.uth.edu.vn', '$2a$10$eImiTXuWVxfm37uY4JANjOaQXV.QRk9E4h3I2m7LZqI9U9jZ2gWym', 'TALENT', 'ACTIVE', true, NOW(), NOW(), NOW()),
    ('talent2@student.uth.edu.vn', '$2a$10$eImiTXuWVxfm37uY4JANjOaQXV.QRk9E4h3I2m7LZqI9U9jZ2gWym', 'TALENT', 'ACTIVE', true, NOW(), NOW(), NOW()),
    ('talent3@student.uth.edu.vn', '$2a$10$eImiTXuWVxfm37uY4JANjOaQXV.QRk9E4h3I2m7LZqI9U9jZ2gWym', 'TALENT', 'ACTIVE', true, NOW(), NOW(), NOW()),
    ('talent4@student.uth.edu.vn', '$2a$10$eImiTXuWVxfm37uY4JANjOaQXV.QRk9E4h3I2m7LZqI9U9jZ2gWym', 'TALENT', 'ACTIVE', true, NOW(), NOW(), NOW()),
    ('talent5@student.uth.edu.vn', '$2a$10$eImiTXuWVxfm37uY4JANjOaQXV.QRk9E4h3I2m7LZqI9U9jZ2gWym', 'TALENT', 'PENDING', false, NULL, NOW(), NOW());

-- Mentor Users
INSERT INTO users (email, password_hash, role, status, email_verified, email_verified_at, created_at, updated_at)
VALUES 
    ('mentor1@uth.edu.vn', '$2a$10$eImiTXuWVxfm37uY4JANjOaQXV.QRk9E4h3I2m7LZqI9U9jZ2gWym', 'MENTOR', 'ACTIVE', true, NOW(), NOW(), NOW()),
    ('mentor2@uth.edu.vn', '$2a$10$eImiTXuWVxfm37uY4JANjOaQXV.QRk9E4h3I2m7LZqI9U9jZ2gWym', 'MENTOR', 'ACTIVE', true, NOW(), NOW(), NOW()),
    ('mentor3@uth.edu.vn', '$2a$10$eImiTXuWVxfm37uY4JANjOaQXV.QRk9E4h3I2m7LZqI9U9jZ2gWym', 'MENTOR', 'ACTIVE', true, NOW(), NOW(), NOW());

-- =====================================================
-- 2. VERIFY INSERTED DATA
-- =====================================================
DO $$
DECLARE
    user_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    RAISE NOTICE 'Total users inserted: %', user_count;
END $$;

-- Display inserted users
SELECT 
    id,
    email,
    role,
    status,
    email_verified,
    created_at
FROM users
ORDER BY role, id;
