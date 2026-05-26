import express from 'express';
import { pool } from '../config/db.js';
import { authRequired, permit } from '../middleware/auth.js';
import { audit } from '../middleware/audit.js';

const router = express.Router();

router.get('/', authRequired, permit('audit:view'), audit('AUDIT_LIST', 'audit_logs'), async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const pageSize = Math.min(Math.max(Number(req.query.pageSize || 20), 1), 200);
  const action = String(req.query.action || '').trim();
  const userId = String(req.query.userId || '').trim();
  const from = String(req.query.from || '').trim();
  const to = String(req.query.to || '').trim();
  const offset = (page - 1) * pageSize;

  const cond = [];
  const args = [];
  if (action) { cond.push('action = ?'); args.push(action); }
  if (userId) { cond.push('user_id = ?'); args.push(Number(userId)); }
  if (from) { cond.push('created_at >= ?'); args.push(from); }
  if (to) { cond.push('created_at <= ?'); args.push(to); }
  const where = cond.length ? `WHERE ${cond.join(' AND ')}` : '';

  const [rows] = await pool.execute(
    `SELECT id, user_id, action, resource, detail, ip, created_at FROM audit_logs ${where} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...args, pageSize, offset]
  );
  const [cnt] = await pool.execute(`SELECT COUNT(*) AS total FROM audit_logs ${where}`, args);
  res.json({ list: rows, total: cnt[0].total, page, pageSize });
});

export default router;
