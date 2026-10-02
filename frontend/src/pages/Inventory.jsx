import { useEffect, useState } from 'react';
import { api, cop } from '../api.js';
const empty = { sku: '', name: '', price: '', cost: '', minStock: '' };
const ph = { sku: 'SKU', name: 'Nombre', price: 'Precio', cost: 'Costo', minStock: 'Stock mínimo' };
export default function Inventory({ notify, user }) {
  const [list, setList] = useState([]), [f, setF] = useState(empty);
  const load = () => api('/products').then(setList); useEffect(() => { load(); }, []);
  const can = ['admin', 'warehouse'].includes(user.role);
  const num = (k) => Number(f[k]) || 0;
  const create = async (e) => { e.preventDefault();
    try { await api('/products', { method: 'POST', body: { sku: f.sku, name: f.name, price: num('price'), cost: num('cost'), minStock: num('minStock') } });
      setF(empty); notify('Producto creado'); load(); } catch (x) { notify(x.message); } };
  const move = async (p, type) => { const qty = Number(prompt(type === 'in' ? 'Cantidad que entra' : 'Ajuste (+/-)')); if (!qty) return;
    try { await api('/inventory/move', { method: 'POST', body: { product: p._id, type, qty } }); load(); } catch (x) { notify(x.message); } };
  const chip = (p) => p.stock <= 0 ? ['out', 'Agotado'] : p.stock <= p.minStock ? ['low', 'Bajo'] : ['ok', 'OK'];
  return (<div className="grid">
    {can && <form className="card grid g4" onSubmit={create}>
      {Object.keys(empty).map((k) => <input key={k} placeholder={ph[k]} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />)}
      <button className="primary">Agregar producto</button></form>}
    <div className="card">{list.map((p) => { const [c, l] = chip(p); return (<div className="row" key={p._id}>
      <span><b>{p.name}</b> <span className="muted mono">{p.sku}</span></span>
      <span><span className="price">{cop(p.price)}</span> <span className={'chip ' + c}>{l} · {p.stock}</span>{' '}
        {can && <><button onClick={() => move(p, 'in')}>+ Entrada</button> <button onClick={() => move(p, 'adjust')}>Ajustar</button></>}</span></div>); })}
      {!list.length && <p className="muted">Sin productos todavía. Agrega el primero arriba.</p>}</div></div>);
}
