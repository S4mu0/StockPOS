import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { User, Business } from '../models/index.js';
import { validate } from '../middleware/index.js';

const r = Router();
r.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 50 }));
const sign = (u) => ({
  access: jwt.sign({ id: u.id, role: u.role, business: u.business?.toString() }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' }),
  refresh: jwt.sign({ id: u.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' }),
});
const send = (res, u) => {
  const t = sign(u);
  res.cookie('rt', t.refresh, { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', maxAge: 7 * 864e5 });
  res.json({ token: t.access, user: { name: u.name, email: u.email, role: u.role } });
};

r.post('/register', validate(z.object({
  businessName: z.string().min(2), name: z.string().min(2), email: z.string().email(), password: z.string().min(8),
})), async (req, res) => {
  const { businessName, name, email, password } = req.body;
  if (await User.findOne({ email })) return res.status(409).json({ error: 'Correo ya registrado' });
  const biz = await Business.create({ name: businessName, plan: 'free' });
  const u = await User.create({ email, name, role: 'admin', business: biz._id, passwordHash: await bcrypt.hash(password, 12) });
  send(res, u); // el rol admin NUNCA es superadmin desde registro público
});
r.post('/login', validate(z.object({ email: z.string().email(), password: z.string() })), async (req, res) => {
  const u = await User.findOne({ email: req.body.email, active: true });
  if (!u || !(await bcrypt.compare(req.body.password, u.passwordHash))) return res.status(401).json({ error: 'Credenciales incorrectas' });
  send(res, u);
});
r.post('/refresh', async (req, res) => {
  try { const p = jwt.verify(req.cookies.rt, process.env.JWT_REFRESH_SECRET); send(res, await User.findById(p.id)); }
  catch { res.status(401).json({ error: 'Sesión vencida' }); }
});
r.post('/logout', (req, res) => { res.clearCookie('rt'); res.json({ ok: true }); });
export default r;
