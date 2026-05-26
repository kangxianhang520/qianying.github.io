import { pool } from '../config/db.js';

export async function writeAuditLog({ userId = null, action, resource = null, detail = null, ip = null }) {
  await pool.execute(
    'INSERT INTO audit_logs (user_id, action, resource, detail, ip) VALUES (?, ?, ?, ?, ?)',
    [userId, action, resource, detail, ip]
  );
}
