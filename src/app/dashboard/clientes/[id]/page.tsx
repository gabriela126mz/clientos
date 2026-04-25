'use client'

import { useParams } from 'next/navigation'
import { Sidebar } from '../../page'
import styles from '../../page.module.css'

const CLIENTES: Record<string, any> = {
  c1: {
    name: 'Carmen Ruiz',
    tipo: 'VIP',
    alta: '12/03/2026',
    email: 'carmen@ejemplo.com',
    tel: '+34611222333',
    direccion: 'C/Alcalá 45, Madrid',
    notas: 'Jardín de 300m² con olivo centenario.',
    presupuesto: 'PRES-2026-001',
    fechaPresupuesto: '10/04/2026',
    importe: '689,7 €',
    estadoPresupuesto: 'ENVIADO',
    visitaFecha: '26/04/2026 · 10:00',
    visitaTitulo: 'Visita técnica olivo',
    visitaNota: 'Valorar estado tras tormenta.',
  },
}

export default function ClienteDetalle() {
  const params = useParams()
  const id = String(params.id)

  const cliente = CLIENTES[id] || {
    name: 'Cliente',
    tipo: 'Nuevo',
    alta: '01/02/2026',
    email: 'cliente@email.com',
    tel: '+34 600 000 000',
    direccion: 'Sin dirección',
    notas: 'Sin notas registradas.',
    presupuesto: 'PRES-2026-000',
    fechaPresupuesto: '—',
    importe: '—',
    estadoPresupuesto: 'BORRADOR',
    visitaFecha: '—',
    visitaTitulo: 'Sin visita programada',
    visitaNota: 'Añade una próxima visita para este cliente.',
  }

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/clientes" />

      <main
        className={styles.main}
        style={{
          background: '#f6f2ea',
          minHeight: '100vh',
          padding: '32px',
        }}
      >
        <a
          href="/dashboard/clientes"
          style={{
            color: '#d96b5b',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          ← Clientes
        </a>

        <section
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '24px',
            alignItems: 'flex-start',
            marginTop: '22px',
            marginBottom: '40px',
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontFamily: 'Georgia, serif',
                fontSize: '42px',
                lineHeight: 1.1,
                color: '#071018',
              }}
            >
              {cliente.name}
            </h1>

            <p
              style={{
                marginTop: '12px',
                color: '#64748b',
                fontSize: '15px',
              }}
            >
              {cliente.tipo} · Alta {cliente.alta}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              style={{
                padding: '14px 28px',
                borderRadius: '6px',
                border: '1px solid #ddd6c9',
                background: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Editar
            </button>

            <button
              style={{
                padding: '14px 28px',
                borderRadius: '6px',
                border: 'none',
                background: '#0b1820',
                color: '#fff',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              + Presupuesto
            </button>
          </div>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '24px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div
              style={{
                background: '#fff',
                border: '1px solid #e5ddcf',
                borderRadius: '8px',
                padding: '28px',
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  fontFamily: 'Georgia, serif',
                  fontSize: '26px',
                }}
              >
                Historial
              </h2>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f3f0ea' }}>
                    <th style={th}>N°</th>
                    <th style={th}>Fecha</th>
                    <th style={th}>Importe</th>
                    <th style={th}>Estado</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td style={tdStrong}>{cliente.presupuesto}</td>
                    <td style={td}>{cliente.fechaPresupuesto}</td>
                    <td style={td}>{cliente.importe}</td>
                    <td style={td}>
                      <span
                        style={{
                          background: '#dbeafe',
                          color: '#1d4ed8',
                          padding: '7px 16px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: 800,
                        }}
                      >
                        {cliente.estadoPresupuesto}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              style={{
                background: '#fff',
                border: '1px solid #e5ddcf',
                borderRadius: '8px',
                padding: '28px',
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  fontFamily: 'Georgia, serif',
                  fontSize: '26px',
                }}
              >
                Visitas
              </h2>

              <div style={{ marginTop: '36px' }}>
                <p style={{ margin: 0, color: '#64748b' }}>{cliente.visitaFecha}</p>
                <strong style={{ display: 'block', marginTop: '6px' }}>
                  {cliente.visitaTitulo}
                </strong>
                <p style={{ marginTop: '8px', color: '#64748b' }}>
                  {cliente.visitaNota}
                </p>
              </div>

              <div
                style={{
                  borderTop: '1px solid #e5ddcf',
                  marginTop: '18px',
                }}
              />
            </div>
          </div>

          <aside
            style={{
              background: '#fff',
              border: '1px solid #e5ddcf',
              borderRadius: '8px',
              padding: '28px',
              minHeight: '390px',
            }}
          >
            <h2
              style={{
                marginTop: 0,
                fontFamily: 'Georgia, serif',
                fontSize: '26px',
              }}
            >
              Ficha
            </h2>

            <FichaItem label="Email" value={cliente.email} />
            <FichaItem label="Teléfono" value={cliente.tel} />
            <FichaItem label="Dirección" value={cliente.direccion} />
            <FichaItem label="Notas" value={cliente.notas} />
          </aside>
        </section>
      </main>
    </div>
  )
}

const th = {
  textAlign: 'left' as const,
  padding: '14px 16px',
  color: '#64748b',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '1.5px',
  fontWeight: 700,
}

const td = {
  padding: '20px 16px',
  borderBottom: '1px solid #e5ddcf',
  fontSize: '15px',
}

const tdStrong = {
  ...td,
  fontWeight: 800,
}

function FichaItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div
        style={{
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: '#64748b',
          fontSize: '12px',
          marginBottom: '6px',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: '15px', color: '#071018' }}>{value}</div>
    </div>
  )
}