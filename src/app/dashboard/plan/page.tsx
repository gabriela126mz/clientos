'use client'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import pStyles from './plan.module.css'

const PLANS = [
  {
    name: 'Básico', price: '0€', sub: 'Para empezar sin riesgos.', featured: false,
    feats: ['Landing pública','CRM hasta 30 clientes','3 presupuestos/mes','Agenda básica','QR personalizado'],
    no: ['Clientes ilimitados','Facturas ilimitadas','Pagos online Stripe','Exportar CSV'],
    cta: 'Plan actual', ctaCls: 'soft',
  },
  {
    name: 'Pro', price: '19€', sub: 'El preferido de los freelancers.', featured: true,
    feats: ['Todo el Básico','Clientes ilimitados','Facturas ilimitadas','Pagos online (Stripe)','Exportar CSV / PDF','WhatsApp recordatorios','Estadísticas avanzadas'],
    no: ['Múltiples usuarios'],
    cta: 'Actualizar a Pro →', ctaCls: 'gold',
  },
  {
    name: 'Business', price: '49€', sub: 'Para equipos y negocios grandes.', featured: false,
    feats: ['Todo el Pro','Hasta 5 usuarios','White-label (tu marca)','API access','Soporte prioritario','Onboarding dedicado'],
    no: [],
    cta: 'Actualizar a Business →', ctaCls: 'dark',
  },
]

export default function Plan() {
  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/plan" />
      <main className={styles.main}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Plan y pagos</h1>
            <p className={styles.phSub}>Sin permanencia. Cancela cuando quieras.</p>
          </div>
        </div>

        <div className={styles.card} style={{ marginBottom: '1.25rem', padding: '1.1rem 1.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem' }}>
            <span style={{ fontFamily: 'Syne', fontWeight: 700 }}>Plan actual:</span>
            <span className={`${styles.bdg} ${styles.bPaid}`}>✓ BÁSICO GRATIS</span>
            <span style={{ fontSize: '.82rem', color: 'var(--grey)', marginLeft: 'auto' }}>Cambia de plan en cualquier momento.</span>
          </div>
        </div>

        <div className={pStyles.planGrid}>
          {PLANS.map(p => (
            <div key={p.name} className={`${pStyles.planCard} ${p.featured ? pStyles.featured : ''}`}>
              {p.featured && <div className={pStyles.badge}>★ POPULAR</div>}
              <div className={pStyles.planName}>{p.name}</div>
              <p style={{ fontSize: '.8rem', color: 'var(--grey)', marginBottom: '.4rem' }}>{p.sub}</p>
              <div className={pStyles.planPrice}>{p.price}<span>/mes</span></div>
              <ul className={pStyles.feats}>
                {p.feats.map(f => <li key={f}>{f}</li>)}
                {p.no.map(f => <li key={f} className={pStyles.no}>{f}</li>)}
              </ul>
              <button className={p.featured ? styles.btnGold : p.name === 'Business' ? styles.btnDark : styles.btnGhost}
                style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.card} style={{ marginTop: '1.25rem' }}>
          <div className={styles.cardT} style={{ marginBottom: '.85rem' }}>Métodos de pago disponibles en Pro</div>
          <div style={{ display: 'flex', gap: '.65rem', flexWrap: 'wrap' }}>
            {[
              { label: '💳 Stripe — Tarjeta de crédito', cls: pStyles.stripe },
              { label: '🅿️ PayPal', cls: pStyles.paypal },
              { label: 'Bizum (próximamente)', cls: pStyles.dim },
              { label: 'Transferencia (próximamente)', cls: pStyles.dim },
            ].map(m => (
              <div key={m.label} className={`${pStyles.pmTag} ${m.cls}`}>{m.label}</div>
            ))}
          </div>
          <p style={{ fontSize: '.78rem', color: 'var(--grey)', marginTop: '.75rem' }}>
            Todos los pagos procesados por Stripe/PayPal. Cancela en cualquier momento.
          </p>
        </div>
      </main>
    </div>
  )
}