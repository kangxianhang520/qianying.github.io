import { verifyToken } from '../utils/jwt.js';

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) return res.status(401).json({ message: '未登录' });

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ message: 'Token 无效或已过期' });
  }
}

export function permit(...permissions) {
  return (req, res, next) => {
    const owned = req.user?.permissions || [];
    const ok = permissions.some((p) => owned.includes(p));
    if (!ok) return res.status(403).json({ message: '权限不足' });
    next();
  };
}
