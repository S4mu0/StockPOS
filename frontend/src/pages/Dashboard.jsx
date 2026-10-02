import { useEffect, useState } from 'react';
import { api, cop } from '../api.js';
export default function Dashboard() {
  const [d, setD] = useState(null);
  useEffect(() => { api('/reports/summary').then(setD); }, []);
  if (!d) return <p className="muted">Cargando…</p>;
  const max = Math.max(1, ...d.byDay.map((x) => x.total));
  return (<div className="grid"><div className="grid g4">
    <div className="card"><span className="muted">Ventas de hoy</span><div className="big price">{cop(d.today.total)}</div></div>
    <div className="card"><span className="muted">Tickets hoy</span><div className="big price">{d.today.n}</div></div>
    <div className="card"><span className="muted">Con stock bajo</span><div className="big price">{d.low.length}</div></div></div>
    <div className="card"><b>Últimos 7 días</b>{d.byDay.length ? <div className="bars" style={{ marginTop: 12 }}>
      {d.byDay.map((x) => <div key={x._id} title={x._id + ' ' + cop(x.total)} style={{ height: (x.total / max) * 100 + '%' }} />)}</div>
      : <p className="muted">Aún no hay ventas. Haz la primera en Vender.</p>}</div>
    <div className="card"><b>Más vendidos</b>{d.top.map((t) => <div className="row" key={t._id}><span>{t._id}</span><span className="mono">{t.qty}</span></div>)}</div></div>);
}
