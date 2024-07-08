-- 04_seed_data.sql

-- Example seed data for roles
INSERT INTO roles (name) VALUES ('Admin'), ('Editor'), ('Viewer');

-- Example seed data for users
INSERT INTO users (email, password, role_id, verified)
VALUES ('admin@example.com', 'hashedpassword', 1, true),
       ('editor@example.com', 'hashedpassword', 2, true),
       ('viewer@example.com', 'hashedpassword', 3, true);

-- Example seed data for posts
INSERT INTO posts (title, content, user_id, created_at)
VALUES ('First Post', 'This is the content of the first post.', 1, NOW()),
       ('Second Post', 'This is the content of the second post.', 2, NOW());