import React, { useState } from 'react';

export default function Plans() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  // Definición de precios y planes actualizados
  const plans = [
    {
      id: 'free',
      name: 'Free',
      priceText: '$0',
      period: 'para siempre',
      isCurrent: true,
      badge: null,
      features: [
        { name: '1 sucursal(es)', active: true },
        { name: '1 usuario(s)', active: true },
        { name: '100 productos', active: true },
        { name: 'POS completo (descuentos, pagos mixtos)', active: false },
        { name: 'Modo offline', active: false },
        { name: 'Lector de códigos', active: false },
        { name: 'Tickets y etiquetas propios', active: false },
        { name: 'Caja con turnos', active: false },
        { name: 'Roles y permisos', active: false },
        { name: 'Reportes históricos', active: false }
      ]
    },
    {
      id: 'pro_monthly',
      name: 'Mensual (Pro)',
      price: 145000,
      priceText: '$145.000',
      period: '/mes',
      isCurrent: false,
      badge: 'Más flexible',
      features: [
        { name: '3 sucursal(es)', active: true },
        { name: '5 usuario(s)', active: true },
        { name: '5000 productos', active: true },
        { name: 'POS completo (descuentos, pagos mixtos)', active: true },
        { name: 'Modo offline', active: true },
        { name: 'Lector de códigos', active: true },
        { name: 'Tickets y etiquetas propios', active: true },
        { name: 'Caja con turnos', active: true },
        { name: 'Roles y permisos', active: true },
        { name: 'Reportes históricos', active: true },
        { name: 'Facturación electrónica', active: false },
        { name: 'Auditoría', active: true }
      ]
    },
    {
      id: 'pro_annual',
      name: 'Anual (Pro+)',
      price: 990000,
      priceText: '$990.000',
      period: '/año',
      equivalent: '≈ $82.500/mes · ¡Ahorras 43%!',
      isCurrent: false,
      badge: 'Mejor Valor',
      highlight: true,
      features: [
        { name: '10 sucursal(es)', active: true },
        { name: 'Ilimitados usuario(s)', active: true },
        { name: 'Ilimitados productos', active: true },
        { name: 'POS completo (descuentos, pagos mixtos)', active: true },
        { name: 'Modo offline', active: true },
        { name: 'Lector de códigos', active: true },
        { name: 'Tickets y etiquetas propios', active: true },
        { name: 'Caja con turnos', active: true },
        { name: 'Roles y permisos', active: true },
        { name: 'Reportes históricos', active: true },
        { name: 'Facturación electrónica', active: true },
        { name: 'Auditoría', active: true }
      ]
    }
  ];

  // Acción al presionar "Elegir Plan"
  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  // Procesar pago (Ejemplo con simulación o redirección a pasarela)
  const handleCheckout = async (method) => {
    setLoading(true);
    try {
      if (method === 'whatsapp') {
        const msg = encodeURIComponent(`Hola, deseo activar el *${selectedPlan.name}* por valor de *${selectedPlan.priceText}* en StockPOS.`);
        window.open(`https://wa.me/573000000000?text=${msg}`, '_blank');
      } else {
        // Conexión con backend para generar Checkout URL (Stripe / Mercado Pago)
        const response = await fetch('/api/platform/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId: selectedPlan.id, method })
        });
        const data = await response.json();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          alert(`Suscripción solicitada para ${selectedPlan.name}. Redirigiendo a pasarela...`);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Iniciando proceso de pago...');
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div style={{ padding: '24px', color: '#fff', backgroundColor: '#131b26', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '8px', color: '#10b981' }}>Planes de Suscripción</h1>
      <p style={{ color: '#9ca3af', marginBottom: '32px' }}>Selecciona el plan ideal para escalar tu negocio</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              backgroundColor: '#1f2937',
              borderRadius: '12px',
              padding: '24px',
              border: plan.highlight ? '2px solid #10b981' : '1px solid #374151',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              position: 'relative'
            }}
          >
            {plan.badge && (
              <span style={{
                position: 'absolute',
                top: '-12px',
                right: '16px',
                backgroundColor: plan.highlight ? '#10b981' : '#3b82f6',
                color: '#fff',
                fontSize: '12px',
                padding: '4px 12px',
                borderRadius: '12px',
                fontWeight: 'bold'
              }}>
                {plan.badge}
              </span>
            )}

            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>{plan.name}</h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '36px', fontWeight: '800' }}>{plan.priceText}</span>
                <span style={{ color: '#9ca3af' }}>{plan.period}</span>
              </div>
              {plan.equivalent && (
                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34d399',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  marginTop: '8px',
                  display: 'inline-block'
                }}>
                  {plan.equivalent}
                </div>
              )}

              <ul style={{ listStyle: 'none', padding: 0, margin: '24px 0' }}>
                {plan.features.map((feat, idx) => (
                  <li key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                    color: feat.active ? '#e5e7eb' : '#6b7280',
                    textDecoration: feat.active ? 'none' : 'line-through'
                  }}>
                    {feat.active ? '✓' : '🔒'} {feat.name}
                  </li>
                ))}
              </ul>
            </div>

            {plan.isCurrent ? (
              <button disabled style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: '#374151',
                color: '#9ca3af',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'not-allowed'
              }}>
                Tu plan actual
              </button>
            ) : (
              <button
                onClick={() => handleSelectPlan(plan)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: plan.highlight ? '#10b981' : '#2563eb',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Elegir {plan.name}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Modal de Pago / Pasarela */}
      {selectedPlan && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#1f2937',
            padding: '32px',
            borderRadius: '16px',
            maxWidth: '450px',
            width: '100%',
            color: '#fff'
          }}>
            <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>Confirmar Suscripción</h3>
            <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
              Vas a adquirir el <strong>{selectedPlan.name}</strong> por <strong>{selectedPlan.priceText} {selectedPlan.period}</strong>.
            </p>

            <p style={{ fontSize: '14px', marginBottom: '12px', fontWeight: 'bold' }}>Elige tu método de pago:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <button
                onClick={() => handleCheckout('mercadopago')}
                style={{ padding: '12px', backgroundColor: '#009ee3', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Mercado Pago / PSE / Tarjeta
              </button>
              <button
                onClick={() => handleCheckout('whatsapp')}
                style={{ padding: '12px', backgroundColor: '#25d366', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Pagar vía WhatsApp / Asesor
              </button>
            </div>

            <button
              onClick={() => setSelectedPlan(null)}
              style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid #4b5563', color: '#9ca3af', borderRadius: '8px', cursor: 'pointer' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}