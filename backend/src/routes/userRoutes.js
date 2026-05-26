import express from 'express';
import { pool } from '../config/db.js';
import { authRequired, permit } from '../middleware/auth.js';
import { audit } from '../middleware/audit.js';

const router = express.Router();

router.get('/', authRequired, permit('user:view'), audit('USER_LIST', 'users'), async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(req.query.pageSize || 10), 1), 100);
  const keyword = String(req.query.keyword || '').trim();
  const offset = (page - 1) * pageSize;

  let where = '';
  const args = [];
  if (keyword) {
    where = 'WHERE username LIKE ? OR role LIKE ?';
    args.push(`%${keyword}%`, `%${keyword}%`);
  }

  const [rows] = await pool.execute(
    `SELECT id, username, role, created_at FROM users ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...args, pageSize, offset]
  );
  const [cnt] = await pool.execute(`SELECT COUNT(*) AS total FROM users ${where}`, args);
  res.json({ list: rows, total: cnt[0].total, page, pageSize });
});

export default router;
