import express from 'express';
import { pool } from '../config/db.js';
import { authRequired, permit } from '../middleware/auth.js';
import { audit } from '../middleware/audit.js';

const router = express.Router();

router.get('/', authRequired, permit('role:view'), audit('ROLE_LIST', 'roles'), async (_req, res) => {
  const [roles] = await pool.execute('SELECT DISTINCT role FROM role_permissions ORDER BY role ASC');
  const result = [];
  for (const r of roles) {
    const [perms] = await pool.execute(
      `SELECT p.code, p.name FROM role_permissions rp JOIN permissions p ON p.id = rp.permission_id WHERE rp.role = ? ORDER BY p.code`,
      [r.role]
    );
    result.push({ role: r.role, permissions: perms });
  }
  res.json({ list: result });
});

router.put('/:role/permissions', authRequired, permit('role:view'), audit('ROLE_UPDATE_PERMS', 'roles'), async (req, res) => {
  const { role } = req.params;
  const { permissionCodes } = req.body;
  if (!Array.isArray(permissionCodes)) return res.status(400).json({ message: 'permissionCodes 必须是数组' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute('DELETE FROM role_permissions WHERE role = ?', [role]);
    for (const code of permissionCodes) {
      const [rows] = await conn.execute('SELECT id FROM permissions WHERE code=?', [code]);
      if (!rows[0]) continue;
      await conn.execute('INSERT INTO role_permissions(role, permission_id) VALUES (?, ?)', [role, rows[0].id]);
    }
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }

  res.json({ ok: true });
});

export default router;
