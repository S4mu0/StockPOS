import React, { useState } from 'react';
import { Check, Lock, X } from 'lucide-react';

const plansData = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '',
    current: true,
    features: [
      { text: '1 sucursal(es)', included: true },
      { text: '1 usuario(s)', included: true },
      { text: '100 productos', included: true },
      { text: 'POS completo (descuentos, pagos mixtos)', included: false },
      { text: 'Modo offline', included: false },
      { text: 'Lector de códigos', included: false },
      { text: 'Tickets y etiquetas propios', included: false },
      { text: 'Caja con turnos', included: false },
      { text: 'Roles y permisos', included: false },
      { text: 'Reportes históricos', included: false },
      { text: 'Traslados entre sucursales', included: false },
      { text: 'Catálogo online (WhatsApp)', included: false },
      { text: 'Facturación electrónica', included: false },
      { text: 'Auditoría', included: false },
    ],
  },
  {
    id: 'monthly',
    name: 'Mensual (Pro)',
    price: '$145.000',
    period: '/mes',
    popular: true,
    features: [
      { text: '3 sucursal(es)', included: true },
      { text: '5 usuario(s)', included: true },
      { text: '5000 productos', included: true },
      { text: 'POS completo (descuentos, pagos mixtos)', included: true },
      { text: 'Modo offline', included: true },
      { text: 'Lector de códigos', included: true },
      { text: 'Tickets y etiquetas propios', included: true },
      { text: 'Caja con turnos', included: true },
      { text: 'Roles y permisos', included: true },
      { text: 'Reportes históricos', included: true },
      { text: 'Traslados entre sucursales', included: true },
      { text: 'Catálogo online (WhatsApp)', included: true },
      { text: 'Facturación electrónica', included: false },
      { text: 'Auditoría', included: true },
    ],
  },
  {
    id: 'annual',
    name: 'Anual (Pro+)',
    price: '$990.000',
    period: '/año',
    badge: 'Ahorra 2 meses',
    features: [
      { text: '10 sucursal(es)', included: true },
      { text: 'Ilimitados usuario(s)', included: true },
      { text: 'Ilimitados productos', included: true },
      { text: 'POS completo (descuentos, pagos mixtos)', included: true },
      { text: 'Modo offline', included: true },
      { text: 'Lector de códigos', included: true },
      { text: 'Tickets y etiquetas propios', included: true },
      { text: 'Caja con turnos', included: true },
      { text: 'Roles y permisos', included: true },
      { text: 'Reportes históricos', included: true },
      { text: 'Traslados entre sucursales', included: true },
      { text: 'Catálogo online (WhatsApp)', included: true },
      { text: 'Facturación electrónica', included: true },
      { text: 'Auditoría', included: true },
    ],
  },
];

export default function Plans() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const handleOpenModal = (plan) => {
    setSelectedPlan(plan);
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
  };

  const handleMercadoPago = () => {
    alert(`Redirigiendo a Mercado Pago para el plan: ${selectedPlan.name}`);
    // Aquí irá la redirección / link de cobro de Mercado Pago
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen text-slate-100">
      <h1 className="text-3xl font-bold mb-2">Planes y Suscripciones</h1>
      <p className="text-slate-400 mb-8">Elige el plan ideal para escalar tu negocio.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plansData.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl p-6 border flex flex-col justify-between transition-all ${
              plan.popular
                ? 'border-emerald-500 bg-slate-800/80 shadow-lg shadow-emerald-500/10'
                : 'border-slate-700 bg-slate-800/40'
            }`}
          >
            <div>
              {plan.badge && (
                <span className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 font-bold text-xs px-3 py-1 rounded-full uppercase">
                  {plan.badge}
                </span>
              )}
              <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="text-slate-400 ml-1 text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 text-sm">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    {feat.included ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-amber-500/80 shrink-0" />
                    )}
                    <span className={feat.included ? 'text-slate-200' : 'text-slate-400'}>
                      {feat.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {plan.current ? (
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-xl bg-slate-700 text-slate-400 font-semibold cursor-not-allowed"
                >
                  Tu plan actual
                </button>
              ) : (
                <button
                  onClick={() => handleOpenModal(plan)}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold transition-colors"
                >
                  Elegir {plan.name}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Pago */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-2">Confirmar Suscripción</h2>
            <p className="text-slate-300 mb-6">
              Vas a adquirir el <strong className="text-white">{selectedPlan.name}</strong> por{' '}
              <strong className="text-emerald-400">
                {selectedPlan.price} {selectedPlan.period}
              </strong>.
            </p>

            <p className="text-sm font-semibold text-slate-300 mb-3">Elige tu método de pago:</p>

            <div className="space-y-3">
              <button
                onClick={handleMercadoPago}
                className="w-full py-3.5 px-4 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl transition-colors shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2"
              >
                Mercado Pago / PSE / Tarjeta
              </button>

              <button
                onClick={handleCloseModal}
                className="w-full py-3 px-4 bg-transparent hover:bg-slate-800 border border-slate-700 text-slate-300 font-medium rounded-xl transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}