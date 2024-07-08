-- 03_create_views.sql

-- Example view for getting posts with user details
CREATE VIEW posts_with_users AS
SELECT p.id, p.title, p.content, u.email AS author_email
FROM posts p
JOIN users u ON p.user_id = u.id;