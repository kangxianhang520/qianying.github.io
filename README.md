# 前后端分离后台系统（React + Node + MySQL）

## 架构
- `frontend`：React + Vite + React Router
- `backend`：Node.js + Express + MySQL2 + JWT

## 功能
- JWT 登录认证
- RBAC 角色权限（admin/editor/viewer）
- 菜单权限按角色过滤
- 审计日志（登录、接口访问、关键操作）
- 角色权限管理（角色权限查看与更新）

## 快速启动
### 1) 初始化数据库
执行 `backend/sql/schema.sql`。

### 2) 后端
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3) 前端
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

默认管理员：`admin / 123456`


## 新增增强
- 用户列表支持分页与关键字搜索（`page/pageSize/keyword`）。
- 审计日志支持分页与筛选（`action/userId/from/to`）。
- 角色权限更新支持权限码白名单校验。
