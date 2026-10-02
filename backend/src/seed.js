import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Plan, User } from './models/index.js';

export const PLANS = [
  { key: 'free', name: 'Free', priceCOP: 0, period: 'none', order: 1, limits: { branches: 1, users: 1, products: 100 },
    features: { pos_full: false, offline: false, barcode: false, custom_tickets: false, shifts: false, roles: false, reports_history: false, transfers: false, catalog: false, einvoice: false, audit: false } },
  { key: 'pro', name: 'Mensual (Pro)', priceCOP: 59900, period: 'month', order: 2, limits: { branches: 3, users: 5, products: 5000 },
    features: { pos_full: true, offline: true, barcode: true, custom_tickets: true, shifts: true, roles: true, reports_history: true, transfers: true, catalog: true, einvoice: false, audit: true } },
  { key: 'proplus', name: 'Anual (Pro+)', priceCOP: 599000, period: 'year', order: 3, limits: { branches: 10, users: -1, products: -1 },
    features: { pos_full: true, offline: true, barcode: true, custom_tickets: true, shifts: true, roles: true, reports_history: true, transfers: true, catalog: true, einvoice: true, audit: true } },
];
await mongoose.connect(process.env.MONGO_URI);
for (const p of PLANS) await Plan.updateOne({ key: p.key }, { $setOnInsert: p }, { upsert: true }); // no pisa cambios del panel
if (process.env.SUPERADMIN_EMAIL && !(await User.findOne({ email: process.env.SUPERADMIN_EMAIL.toLowerCase() })))
  await User.create({ email: process.env.SUPERADMIN_EMAIL, name: 'Superadmin', role: 'superadmin', passwordHash: await bcrypt.hash(process.env.SUPERADMIN_PASSWORD, 12) });
console.log('Seed listo'); await mongoose.disconnect();
