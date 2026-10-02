import { Router, json } from 'express';
import { z } from 'zod';
import { Plan, Business, User, Audit } from '../models/index.js';
import { allow, validate, audit } from '../middleware/index.js';

const r = Router();

// 1. Consulta de planes con precios dinámicos desde .env o Base de Datos
r.get('/plans', async (_q, res) => {
  try {
    const plansFromDb = await Plan.find().sort('order');
    if (plansFromDb && plansFromDb.length > 0) {
      return res.json(plansFromDb);
    }
  } catch (error) {
    console.error('Error al consultar planes en BD:', error);
  }

  res.json([
    {
      key: 'basic',
      name: 'Plan Básico',
      monthlyPrice: parseFloat(process.env.PLAN_BASIC_MONTHLY || 15),
      annualPrice: parseFloat(process.env.PLAN_BASIC_ANNUAL || 150),
      features: ['Hasta 5,000 productos', '1 Sucursal', 'Soporte Estándar']
    },
    {
      key: 'pro',
      name: 'Plan Profesional',
      monthlyPrice: parseFloat(process.env.PLAN_PRO_MONTHLY || 35),
      annualPrice: parseFloat(process.env.PLAN_PRO_ANNUAL || 350),
      features: ['Productos Ilimitados', 'Multi-sucursal', 'Reportes Avanzados', 'Soporte 24/7']
    }
  ]);
});

// 2. Webhook para confirmación de pagos
r.post('/webhook', json(), (req, res) => {
  console.log('Evento de pago recibido exitosamente:', req.body);
  res.status(200).json({ received: true });
});

// 3. Rutas de administración
r.use(allow('superadmin', 'support'));
const write = allow('superadmin');

r.put('/plans/:key', write, validate(z.object({
  name: z.string().optional(),
  priceCOP: z.number().min(0).optional(),
  monthlyPrice: z.number().min(0).optional(),
  annualPrice: z.number().min(0).optional(),
  limits: z.object({ branches: z.number(), users: z.number(), products: z.number() }).optional(),
  features: z.record(z.boolean()).optional(),
})), async (req, res) => {
  const p = await Plan.findOneAndUpdate({ key: req.params.key }, req.body, { new: true });
  audit(req, 'plan.update', { key: req.params.key, changes: req.body });
  res.json(p);
});

r.get('/businesses', async (_q, res) => res.json(await Business.find().sort('-createdAt').limit(200)));

r.put('/businesses/:id', write, validate(z.object({
  plan: z.string().optional(),
  planStatus: z.enum(['active', 'suspended']).optional(),
  planExpiresAt: z.coerce.date().optional(),
})), async (req, res) => {
  const b = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true });
  audit(req, 'business.update', { id: req.params.id, changes: req.body });
  res.json(b);
});

r.get('/audit', async (_q, res) => res.json(await Audit.find().sort('-createdAt').limit(100).populate('actor', 'email')));

r.get('/stats', async (_q, res) => {
  const plans = await Plan.find();
  const out = {};
  for (const p of plans) out[p.key] = await Business.countDocuments({ plan: p.key });
  res.json({ businessesByPlan: out, users: await User.countDocuments() });
});

export default r;