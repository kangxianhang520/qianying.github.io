export function requireFields(fields) {
  return (req, res, next) => {
    for (const key of fields) {
      if (req.body?.[key] === undefined || req.body?.[key] === null || req.body?.[key] === '') {
        return res.status(400).json({ message: `缺少字段: ${key}` });
      }
    }
    next();
  };
}
