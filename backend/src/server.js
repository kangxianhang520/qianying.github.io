import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import userRoutes from './routes/userRoutes.js';
import auditRoutes from './routes/auditRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit-logs', auditRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: '服务器错误' });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`backend running on :${port}`));
