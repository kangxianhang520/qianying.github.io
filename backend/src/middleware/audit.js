import { writeAuditLog } from '../services/auditService.js';

export function audit(action, resource = null) {
  return async (req, res, next) => {
    res.on('finish', async () => {
      if (res.statusCode >= 400) return;
      try {
        await writeAuditLog({
          userId: req.user?.id || null,
          action,
          resource,
          detail: `${req.method} ${req.originalUrl}`,
          ip: req.ip,
        });
      } catch {}
    });
    next();
  };
}
