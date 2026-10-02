let token = localStorage.getItem('t') || '';
export const setToken = (t) => { token = t; t ? localStorage.setItem('t', t) : localStorage.removeItem('t'); };
export const hasToken = () => !!token;
export async function api(path, opts = {}) {
  const res = await fetch('/api' + path, { ...opts, credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: 'Bearer ' + token }) },
    body: opts.body && JSON.stringify(opts.body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'Error'), { status: res.status, data });
  return data;
}
export const cop = (n) => '$' + Number(n || 0).toLocaleString('es-CO');
