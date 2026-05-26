import express from 'express';
import { pool } from '../config/db.js';
import { authRequired, permit } from '../middleware/auth.js';
import { audit } from '../middleware/audit.js';

const router = express.Router();

router.get('/', authRequired, permit('user:view'), audit('USER_LIST', 'users'), async (_, res) => {
  const [rows] = await pool.execute('SELECT id, username, role, created_at FROM users ORDER BY id DESC');
  res.json({ list: rows });
});

export default router;
