import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { signToken } from '../utils/jwt.js';
import { authRequired } from '../middleware/auth.js';
import { writeAuditLog } from '../services/auditService.js';
import { requireFields } from '../middleware/validate.js';

const router = express.Router();

router.post('/login', requireFields(['username','password']), async (req, res) => {
  const { username, password } = req.body;
  const [users] = await pool.execute('SELECT id, username, password_hash, role FROM users WHERE username=?', [username]);
  const user = users[0];
  if (!user) return res.status(401).json({ message: '账号或密码错误' });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: '账号或密码错误' });

  const [perms] = await pool.execute(
    `SELECT p.code
     FROM role_permissions rp
     JOIN permissions p ON p.id = rp.permission_id
     WHERE rp.role = ?`,
    [user.role]
  );

  const permissions = perms.map((x) => x.code);
  const token = signToken({ id: user.id, username: user.username, role: user.role, permissions });
  await writeAuditLog({ userId: user.id, action: 'LOGIN', resource: 'auth', detail: '用户登录成功' });

  return res.json({ token, user: { id: user.id, username: user.username, role: user.role, permissions } });
});

router.get('/me', authRequired, (req, res) => {
  res.json({ user: req.user });
});

export default router;
