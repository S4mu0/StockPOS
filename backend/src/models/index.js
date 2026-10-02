import mongoose from 'mongoose';
const { Schema, model } = mongoose;
const ref = (m) => ({ type: Schema.Types.ObjectId, ref: m });

// Plan editable desde el panel de plataforma
export const Plan = model('Plan', new Schema({
  key: { type: String, unique: true }, // free | pro | proplus
  name: String, priceCOP: Number, period: String, // none | month | year
  limits: { branches: Number, users: Number, products: Number }, // -1 = ilimitado
  features: { type: Map, of: Boolean }, // feature flags
  order: Number,
}));
export const Business = model('Business', new Schema({
  name: String, plan: { type: String, default: 'free' },
  planStatus: { type: String, default: 'active' }, // active | suspended
  planExpiresAt: Date,
}, { timestamps: true }));
export const User = model('User', new Schema({
  email: { type: String, unique: true, lowercase: true }, name: String, passwordHash: String,
  role: { type: String, enum: ['superadmin', 'support', 'admin', 'cashier', 'warehouse'] },
  business: ref('Business'), active: { type: Boolean, default: true },
}, { timestamps: true }));
const productSchema = new Schema({
  business: ref('Business'), sku: String, barcode: String, name: String, category: String,
  cost: { type: Number, default: 0 }, price: Number, minStock: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
}, { timestamps: true });
productSchema.index({ business: 1, sku: 1 }, { unique: true });
export const Product = model('Product', productSchema);
export const Movement = model('Movement', new Schema({ // kardex
  business: ref('Business'), product: ref('Product'), type: { type: String, enum: ['in', 'out', 'adjust'] },
  qty: Number, note: String, user: ref('User'),
}, { timestamps: true }));
export const Sale = model('Sale', new Schema({
  business: ref('Business'), user: ref('User'),
  items: [{ product: ref('Product'), name: String, qty: Number, price: Number }],
  total: Number, payMethod: { type: String, default: 'cash' },
}, { timestamps: true }));
export const Audit = model('Audit', new Schema({
  actor: ref('User'), business: ref('Business'), action: String, detail: Schema.Types.Mixed,
}, { timestamps: true }));
