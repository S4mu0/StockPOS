import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { Product, Movement, Sale, Plan } from '../models/index.js';
import { allow, enforceLimit, validate, audit } from '../middleware/index.js';

const r = Router();
const prod = z.object({
  sku: z.string().min(1), barcode: z.string().optional(), name: z.string().min(1), category: z.string().optional(),
  cost: z.number().min(0).default(0), price: z.number().min(0), minStock: z.number().min(0).default(0),
});
r.get('/plans', async (_q, res) => res.json(await Plan.find().sort('order')));
r.get('/me/plan', async (req, res) => res.json({ business: req.biz, plan: req.plan }));

r.get('/products', async (req, res) => {
  const q = { business: req.biz._id };
  if (req.query.q) q.$or = [{ name: new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') }, { barcode: String(req.query.q) }, { sku: String(req.query.q) }];
  res.json(await Product.find(q).limit(200));
});
r.post('/products', allow('admin', 'warehouse'), enforceLimit('products'), validate(prod), async (req, res) => {
  try { const p = await Product.create({ ...req.body, business: req.biz._id }); audit(req, 'product.create', { id: p.id }); res.status(201).json(p); }
  catch (e) { res.status(409).json({ error: 'SKU duplicado' }); }
});
r.post('/inventory/move', allow('admin', 'warehouse'), validate(z.object({
  product: z.string(), type: z.enum(['in', 'out', 'adjust']), qty: z.number(), note: z.string().optional(),
})), async (req, res) => {
  const { product, type, qty, note } = req.body;
  const delta = type === 'out' ? -Math.abs(qty) : type === 'in' ? Math.abs(qty) : qty;
  const s = await mongoose.startSession();
  try {
    await s.withTransaction(async () => {
      const p = await Product.findOneAndUpdate({ _id: product, business: req.biz._id, ...(delta < 0 && { stock: { $gte: -delta } }) }, { $inc: { stock: delta } }, { session: s });
      if (!p) throw new Error('Producto no encontrado o stock insuficiente');
      await Movement.create([{ business: req.biz._id, product, type, qty: delta, note, user: req.user.id }], { session: s });
    });
    audit(req, 'stock.' + type, { product, delta }); res.json({ ok: true });
  } catch (e) { res.status(400).json({ error: e.message }); } finally { s.endSession(); }
});
r.get('/inventory/kardex/:id', async (req, res) =>
  res.json(await Movement.find({ business: req.biz._id, product: req.params.id }).sort('-createdAt').limit(100)));

// Venta atómica: descuenta stock + kardex + registro de venta
r.post('/sales', allow('admin', 'cashier'), validate(z.object({
  items: z.array(z.object({ product: z.string(), qty: z.number().int().positive() })).min(1),
  payMethod: z.enum(['cash', 'card', 'nequi', 'transfer']).default('cash'),
})), async (req, res) => {
  const s = await mongoose.startSession(); let sale;
  try {
    await s.withTransaction(async () => {
      const items = []; let total = 0;
      for (const it of req.body.items) {
        const p = await Product.findOneAndUpdate({ _id: it.product, business: req.biz._id, stock: { $gte: it.qty } }, { $inc: { stock: -it.qty } }, { new: true, session: s });
        if (!p) throw new Error('Stock insuficiente o producto inexistente');
        items.push({ product: p._id, name: p.name, qty: it.qty, price: p.price }); total += p.price * it.qty;
        await Movement.create([{ business: req.biz._id, product: p._id, type: 'out', qty: -it.qty, note: 'Venta', user: req.user.id }], { session: s });
      }
      [sale] = await Sale.create([{ business: req.biz._id, user: req.user.id, items, total, payMethod: req.body.payMethod }], { session: s });
    });
    audit(req, 'sale.create', { id: sale.id, total: sale.total }); res.status(201).json(sale);
  } catch (e) { res.status(400).json({ error: e.message }); } finally { s.endSession(); }
});
r.get('/reports/summary', async (req, res) => {
  const b = req.biz._id, day = new Date(); day.setHours(0, 0, 0, 0);
  const week = new Date(Date.now() - 6 * 864e5); week.setHours(0, 0, 0, 0);
  const [today, byDay, low, top] = await Promise.all([
    Sale.aggregate([{ $match: { business: b, createdAt: { $gte: day } } }, { $group: { _id: null, total: { $sum: '$total' }, n: { $sum: 1 } } }]),
    Sale.aggregate([{ $match: { business: b, createdAt: { $gte: week } } }, { $group: { _id: { $dateToString: { format: '%m-%d', date: '$createdAt' } }, total: { $sum: '$total' } } }, { $sort: { _id: 1 } }]),
    Product.find({ business: b, $expr: { $lte: ['$stock', '$minStock'] } }).limit(10),
    Sale.aggregate([{ $match: { business: b } }, { $unwind: '$items' }, { $group: { _id: '$items.name', qty: { $sum: '$items.qty' } } }, { $sort: { qty: -1 } }, { $limit: 5 }]),
  ]);
  res.json({ today: today[0] || { total: 0, n: 0 }, byDay, low, top });
});
export default r;
