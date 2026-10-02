import { useState, useEffect } from 'react';
import { api, setToken, hasToken } from './api.js';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import POS from './pages/POS.jsx';
import Inventory from './pages/Inventory.jsx';
import Plans from './pages/Plans.jsx';
import PlatformAdmin from './pages/PlatformAdmin.jsx';

export default function App() {
  const [user, setUser] = useState(null), [page, setPage] = useState('dashboard'), [toast, setToast] = useState('');
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => { const f = () => setOnline(navigator.onLine); addEventListener('online', f); addEventListener('offline', f);
    if (hasToken()) api('/auth/refresh', { method: 'POST' }).then((d) => { setToken(d.token); setUser(d.user); }).catch(() => setToken('')); }, []);
  const notify = (m) => { setToast(m); setTimeout(() => setToast(''), 2800); };
  if (!user) return <Login onLogin={(d) => { setToken(d.token); setUser(d.user); }} />;
  const staff = ['superadmin', 'support'].includes(user.role);
  const nav = staff ? [['platform', 'Plataforma']] : [['dashboard', 'Resumen'], ['pos', 'Vender'], ['inventory', 'Inventario'], ['plans', 'Planes']];
  const cur = staff ? 'platform' : page, ctx = { notify, user };
  return (<div className="shell">
    <nav className="side"><h1>StockPOS</h1>
      {nav.map(([k, l]) => <button key={k} className={cur === k ? 'on' : ''} onClick={() => setPage(k)}>{l}</button>)}
      <span className="muted" style={{ marginTop: 'auto', padding: 8 }}>{online ? 'Conectado' : 'Sin conexión'}</span>
      <button onClick={() => { api('/auth/logout', { method: 'POST' }); setToken(''); setUser(null); }}>Salir</button></nav>
    <main className="main">
      {cur === 'dashboard' && <Dashboard {...ctx} />}{cur === 'pos' && <POS {...ctx} />}
      {cur === 'inventory' && <Inventory {...ctx} />}{cur === 'plans' && <Plans {...ctx} />}
      {cur === 'platform' && <PlatformAdmin {...ctx} />}
    </main>{toast && <div className="toast">{toast}</div>}</div>);
}
