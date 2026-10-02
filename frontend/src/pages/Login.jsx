import { useState } from 'react';
import { api } from '../api.js';
export default function Login({ onLogin }) {
  const [reg, setReg] = useState(false), [f, setF] = useState({}), [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const go = async (e) => { e.preventDefault(); setErr('');
    try { onLogin(await api(reg ? '/auth/register' : '/auth/login', { method: 'POST', body: f })); } catch (x) { setErr(x.message); } };
  return (<div className="login"><form onSubmit={go}>
    <h1>{reg ? 'Crea tu tienda' : 'Bienvenido de vuelta'}</h1>
    {reg && <><input placeholder="Nombre del negocio" onChange={set('businessName')} /><input placeholder="Tu nombre" onChange={set('name')} /></>}
    <input type="email" placeholder="Correo" onChange={set('email')} /><input type="password" placeholder="Contraseña (mín. 8)" onChange={set('password')} />
    {err && <span style={{ color: 'var(--coral)' }}>{err}</span>}
    <button className="primary">{reg ? 'Crear cuenta gratis' : 'Entrar'}</button>
    <button type="button" onClick={() => setReg(!reg)}>{reg ? 'Ya tengo cuenta' : 'Quiero registrar mi negocio'}</button></form>
    <div className="hero"><h2>Vende, descuenta y repón sin perder el hilo.</h2><p>Mostrador, bodega y catálogo en un solo sistema.</p></div></div>);
}
