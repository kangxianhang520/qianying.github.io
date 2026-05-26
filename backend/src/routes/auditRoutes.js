import express from 'express';
import { pool } from '../config/db.js';
import { authRequired, permit } from '../middleware/auth.js';
import { audit } from '../middleware/audit.js';

const router = express.Router();

router.get('/', authRequired, permit('audit:view'), audit('AUDIT_LIST', 'audit_logs'), async (req, res) => {
  const [rows] = await pool.execute(
    'SELECT id, user_id, action, resource, detail, ip, created_at FROM audit_logs ORDER BY id DESC LIMIT 200'
  );
  res.json({ list: rows });
});

export default router;
