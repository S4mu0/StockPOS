import { useEffect, useState } from 'react';
import { api } from '../api.js';
export default function PlatformAdmin({ notify, user }) {
  const [plans, setPlans] = useState([]), [biz, setBiz] = useState([]), [log, setLog] = useState([]);
  const ro = user.role !== 'superadmin';
  const load = () => { api('/platform/plans').then(setPlans); api('/platform/businesses').then(setBiz); api('/platform/audit').then(setLog); };
  useEffect(() => { load(); }, []);
  const save = (key, body) => api('/platform/plans/' + key, { method: 'PUT', body }).then(() => { notify('Plan actualizado'); load(); }).catch((e) => notify(e.message));
  const setBusiness = (id, body) => api('/platform/businesses/' + id, { method: 'PUT', body }).then(() => { notify('Negocio actualizado'); load(); }).catch((e) => notify(e.message));
  return (<div className="grid"><h2 style={{ margin: 0 }}>Panel de plataforma {ro && <span className="chip">solo lectura</span>}</h2>
    <div className="grid plans">{plans.map((p) => <div className="card" key={p.key}><b>{p.name}</b>
      <label className="muted">Precio COP</label><input type="number" defaultValue={p.priceCOP} disabled={ro} onBlur={(e) => Number(e.target.value) !== p.priceCOP && save(p.key, { priceCOP: Number(e.target.value) })} />
      {['branches', 'users', 'products'].map((k) => <div key={k}><label className="muted">Límite {k} (-1 = ilimitado)</label>
        <input type="number" defaultValue={p.limits[k]} disabled={ro} onBlur={(e) => Number(e.target.value) !== p.limits[k] && save(p.key, { limits: { ...p.limits, [k]: Number(e.target.value) } })} /></div>)}
      {Object.keys(p.features).map((k) => <label key={k} className="row"><span>{k}</span>
        <input type="checkbox" style={{ width: 20 }} defaultChecked={p.features[k]} disabled={ro} onChange={(e) => save(p.key, { features: { ...p.features, [k]: e.target.checked } })} /></label>)}</div>)}</div>
    <div className="card"><b>Negocios</b>{biz.map((b) => <div className="row" key={b._id}><span>{b.name} <span className="chip">{b.planStatus}</span></span>
      <span><select disabled={ro} value={b.plan} onChange={(e) => setBusiness(b._id, { plan: e.target.value })} style={{ width: 150 }}>{plans.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}</select>{' '}
        <button disabled={ro} onClick={() => setBusiness(b._id, { planStatus: b.planStatus === 'active' ? 'suspended' : 'active' })}>{b.planStatus === 'active' ? 'Suspender' : 'Reactivar'}</button></span></div>)}</div>
    <div className="card"><b>Auditoría</b>{log.map((l) => <div className="row" key={l._id}><span>{l.actor?.email} · {l.action}</span><span className="muted mono">{new Date(l.createdAt).toLocaleString('es-CO')}</span></div>)}</div></div>);
}
