import express from 'express';
import { authRequired } from '../middleware/auth.js';

const allMenus = [
  { key: 'dashboard', title: '仪表盘', permission: 'dashboard:view', path: '/' },
  { key: 'users', title: '用户管理', permission: 'user:view', path: '/users' },
  { key: 'roles', title: '角色权限', permission: 'role:view', path: '/roles' },
  { key: 'audit', title: '审计日志', permission: 'audit:view', path: '/audit' },
];

const router = express.Router();
router.get('/', authRequired, (req, res) => {
  const menus = allMenus.filter((m) => req.user.permissions.includes(m.permission));
  res.json({ menus });
});

export default router;
