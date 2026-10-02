import { useEffect, useState, useRef } from 'react';
import { api, cop } from '../api.js';
export default function POS({ notify }) {
  const [q, setQ] = useState(''), [list, setList] = useState([]), [cart, setCart] = useState({}), [pay, setPay] = useState('cash'), box = useRef();
  const load = () => api('/products?q=' + encodeURIComponent(q)).then(setList);
  useEffect(() => { load(); }, [q]);
  useEffect(() => { const k = (e) => { if (e.key === 'F2') { e.preventDefault(); box.current?.focus(); } if (e.key === 'F9') { e.preventDefault(); charge(); } };
    addEventListener('keydown', k); return () => removeEventListener('keydown', k); });
  const add = (p) => setCart((c) => ({ ...c, [p._id]: { p, qty: (c[p._id]?.qty || 0) + 1 } }));
  const lines = Object.values(cart), total = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const scan = (e) => { if (e.key === 'Enter' && list.length === 1) { add(list[0]); setQ(''); } }; // el lector USB envía Enter
  async function charge() {
    if (!lines.length) return;
    try { await api('/sales', { method: 'POST', body: { payMethod: pay, items: lines.map((l) => ({ product: l.p._id, qty: l.qty })) } });
      setCart({}); notify('Venta registrada'); load(); } catch (e) { notify(e.message); } }
  return (<div className="pos"><div>
    <input ref={box} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={scan} placeholder="Buscar o escanear código (F2)" style={{ marginBottom: 14 }} />
    {!list.length && <p className="muted">No hay productos. Créalos en Inventario.</p>}
    <div className="prods">{list.map((p) => <button key={p._id} className="prod" disabled={p.stock < 1} onClick={() => add(p)}>
      <b>{p.name}</b><span><span className="price">{cop(p.price)}</span> <span className="muted">· {p.stock} u</span></span></button>)}</div></div>
    <div className="card cart"><b>Carrito</b>
      {lines.map((l) => <div className="row" key={l.p._id}><span>{l.qty} × {l.p.name}</span><span className="mono">{cop(l.p.price * l.qty)}</span></div>)}
      <div className="total price">{cop(total)}</div>
      <select value={pay} onChange={(e) => setPay(e.target.value)} style={{ margin: '10px 0' }}>
        <option value="cash">Efectivo</option><option value="card">Tarjeta</option><option value="nequi">Nequi</option><option value="transfer">Transferencia</option></select>
      <button className="primary" style={{ width: '100%', padding: 16, fontSize: 18 }} onClick={charge}>Cobrar (F9)</button></div></div>);
}
