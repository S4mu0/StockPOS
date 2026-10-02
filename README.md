# StockPOS
Inventario + punto de venta omnicanal (Node/Express · MongoDB · React/Vite · PWA).

## Arranque rápido
```bash
cp .env.example .env      # edita secretos y SUPERADMIN_*
docker compose up --build
```
- App: http://localhost:5173 · API: http://localhost:4000/health
- El seed crea los 3 planes (Free / Mensual / Anual) y tu superadmin. Entra con ese correo: verás el **panel de plataforma**.
- Sin Docker: levanta Mongo con replica set `rs0`, luego `cd backend && npm i && npm run seed && npm run dev` y `cd frontend && npm i && npm run dev`.

## Planes y panel privado
Plan, límites y feature flags viven en MongoDB (`Plan`). El backend los verifica (`enforceLimit`, `requireFeature`) y el superadmin los edita en el panel. Los roles `superadmin` (edita) y `support` (solo lectura) no se pueden crear desde el registro público. Cada cambio queda en `Audit`.
Colaboradores: dales acceso al repo (Settings → Collaborators) y crea sus usuarios con rol `superadmin`/`support`.

## Pendiente (siguiente fase)
2FA del panel · cola offline de ventas · caja/arqueo · clientes/proveedores · multi-sucursal real · etiquetas/ticket térmico · pagos Wompi/ePayco · catálogo WhatsApp · DIAN · tests.
si
