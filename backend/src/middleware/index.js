import jwt from 'jsonwebtoken';
import { Plan, Business, Product, User, Audit } from '../models/index.js';

export const audit = (req, action, detail) =>
  Audit.create({ actor: req.user?.id, business: req.user?.business, action, detail }).catch(() => {});

export const auth = (req, res, next) => {
  const t = (req.headers.authorization || '').replace('Bearer ', '');
  try { req.user = jwt.verify(t, process.env.JWT_ACCESS_SECRET); next(); }
  catch { res.status(401).json({ error: 'Sesión inválida o vencida' }); }
};
// RBAC
export const allow = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ error: 'Sin permisos' });

// Carga plan del negocio y bloquea si está suspendido
export const withPlan = async (req, res, next) => {
  const b = await Business.findById(req.user.business);
  if (!b || b.planStatus === 'suspended') return res.status(402).json({ error: 'Cuenta suspendida' });
  req.biz = b; req.plan = await Plan.findOne({ key: b.plan }); next();
};
export const requireFeature = (f) => (req, res, next) =>
  req.plan?.features?.get(f) ? next()
    : res.status(402).json({ error: 'Mejora tu plan para usar esta función', feature: f });
export const enforceLimit = (name) => async (req, res, next) => {
  const max = req.plan.limits[name];
  if (max === -1) return next();
  const count = name === 'products' ? await Product.countDocuments({ business: req.biz._id })
    : name === 'users' ? await User.countDocuments({ business: req.biz._id }) : 0;
  count >= max ? res.status(402).json({ error: `Tu plan permite hasta ${max} ${name}. Mejora tu plan.`, limit: name })
    : next();
};
export const validate = (schema) => (req, res, next) => {
  const r = schema.safeParse(req.body);
  if (!r.success) return res.status(400).json({ error: 'Datos inválidos', issues: r.error.issues });
  req.body = r.data; next();
};
