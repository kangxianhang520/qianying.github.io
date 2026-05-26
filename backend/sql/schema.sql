CREATE DATABASE IF NOT EXISTS admin_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE admin_system;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS role_permissions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  role VARCHAR(20) NOT NULL,
  permission_id BIGINT NOT NULL,
  FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NULL,
  action VARCHAR(50) NOT NULL,
  resource VARCHAR(100) NULL,
  detail TEXT NULL,
  ip VARCHAR(45) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT IGNORE INTO permissions(code,name) VALUES
('dashboard:view','查看仪表盘'),
('user:view','查看用户'),
('role:view','查看角色'),
('audit:view','查看审计');

INSERT IGNORE INTO role_permissions(role, permission_id)
SELECT 'admin', id FROM permissions;

INSERT IGNORE INTO role_permissions(role, permission_id)
SELECT 'editor', id FROM permissions WHERE code IN ('dashboard:view','user:view');

INSERT IGNORE INTO role_permissions(role, permission_id)
SELECT 'viewer', id FROM permissions WHERE code IN ('dashboard:view');

-- 默认 admin 密码 123456（bcrypt）
INSERT IGNORE INTO users(username,password_hash,role) VALUES
('admin','$2a$10$A3DSn5uC6dP7D7mBi7FxQelYI5ga2A8V6v8hS7jY6X2n2qz3i7R2y','admin');
