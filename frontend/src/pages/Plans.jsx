import { useEffect, useState } from 'react';
import { api, cop } from '../api.js';
export const FEATURES = { pos_full: 'POS completo (descuentos, pagos mixtos)', offline: 'Modo offline', barcode: 'Lector de códigos', custom_tickets: 'Tickets y etiquetas propios', shifts: 'Caja con turnos', roles: 'Roles y permisos', reports_history: 'Reportes históricos', transfers: 'Traslados entre sucursales', catalog: 'Catálogo online (WhatsApp)', einvoice: 'Facturación electrónica', audit: 'Auditoría' };
export default function Plans() {
  const [plans, setPlans] = useState([]), [me, setMe] = useState(null);
  useEffect(() => { api('/plans').then(setPlans); api('/me/plan').then(setMe); }, []);
  const lim = (n) => (n === -1 ? 'Ilimitados' : n);
  return (<div className="grid plans">{plans.map((p) => (<div key={p.key} className={'card plan ' + (me?.business.plan === p.key ? 'cur' : '')}>
    <h3>{p.name}</h3><div className="big price">{cop(p.priceCOP)}<span className="muted" style={{ fontSize: 14 }}>{p.period === 'month' ? ' /mes' : p.period === 'year' ? ' /año' : ''}</span></div>
    {p.key === 'proplus' && <span className="chip ok">≈ $49.900/mes · 2 meses gratis</span>}
    <ul><li>{lim(p.limits.branches)} sucursal(es)</li><li>{lim(p.limits.users)} usuario(s)</li><li>{lim(p.limits.products)} productos</li>
      {Object.entries(FEATURES).map(([k, l]) => <li key={k} className={p.features[k] ? '' : 'muted'}>{p.features[k] ? '✓ ' : '🔒 '}{l}</li>)}</ul>
    {me?.business.plan === p.key ? <button disabled>Tu plan actual</button> : <button className="primary">Elegir {p.name}</button>}</div>))}</div>);
}
