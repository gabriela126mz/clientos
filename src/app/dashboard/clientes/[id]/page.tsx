'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Sidebar } from '../../page'
import styles from '../../page.module.css'
import { useAuth } from '@/lib/context'
import { createClient } from '@/lib/supabase/client'
import type { Client } from '@/lib/types'

interface Presupuesto {
  id: string
  numero: string
  fecha: string
  total: number
  estado: string
}

interface Cita {
  id: string
  title: string
  date: string
  time: string
  place: string
  notes: string
  estado: string
}

export default function ClienteDetalle() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  const clientId = String(params.id)

  const [cliente, setCliente] = useState<Client | null>(null)
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([])
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar cliente
  const loadCliente = useCallback(async () => {
    if (!user || !clientId) return

    setLoading(true)
    try {
      // Cargar cliente
      const { data: clienteData, error: clienteError } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', clientId)
        .eq('user_id', user.id)
        .single()

      if (clienteError) {
        console.error('Error cargando cliente:', clienteError)
        return
      }

      setCliente(clienteData as Client)

      // Cargar presupuestos
      const { data: presupuestosData, error: presupuestosError } = await supabase
        .from('presupuestos')
        .select('id, numero, fecha, total, estado')
        .eq('client_id', clientId)
        .eq('user_id', user.id)
        .order('fecha', { ascending: false })

      if (!presupuestosError) {
        setPresupuestos(presupuestosData || [])
      }

      // Cargar citas
      const { data: citasData, error: citasError } = await supabase
        .from('citas')
        .select('id, title, date, time, place, notes, estado')
        .eq('client_id', clientId)
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (!citasError) {
        setCitas(citasData || [])
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }, [user, clientId, supabase])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/')
      return
    }
    loadCliente()
  }, [authLoading, user, loadCliente, router])

  if (loading) {
    return (
      <div className={styles.app}>
        <Sidebar active="/dashboard/clientes" />
        <main className={styles.main}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e2ddd4', borderTopColor: '#2d5a27', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748b', fontSize: '.875rem' }}>Cargando cliente…</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        </main>
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className={styles.app}>
        <Sidebar active="/dashboard/clientes" />
        <main className={styles.main}>
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>⚠️</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '.5rem', color: '#1c2b3a' }}>
              Cliente no encontrado
            </div>
            <button
              onClick={() => router.push('/dashboard/clientes')}
              style={{
                marginTop: '1rem',
                padding: '.65rem 1.1rem',
                background: '#0a0f14',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: '.84rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Volver a clientes
            </button>
          </div>
        </main>
      </div>
    )
  }

  const ultimoCita = citas[0]
  const ultimoPresupuesto = presupuestos[0]

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
            cursor: 'pointer',
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
              {cliente.tags || 'Sin categoría'} · Alta {cliente.created_at?.split('T')[0]}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => router.push(`/dashboard/clientes/${clientId}/editar`)}
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
              onClick={() => router.push(`/dashboard/presupuestos/nuevo?client_id=${clientId}`)}
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
            {/* PRESUPUESTOS */}
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
                Presupuestos
              </h2>

              {presupuestos.length > 0 ? (
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
                    {presupuestos.map(p => (
                      <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => router.push(`/dashboard/presupuestos/${p.id}`)}>
                        <td style={tdStrong}>{p.numero}</td>
                        <td style={td}>{p.fecha}</td>
                        <td style={td}>{p.total.toFixed(2)} €</td>
                        <td style={td}>
                          <span
                            style={{
                              background: getEstadoBg(p.estado),
                              color: getEstadoColor(p.estado),
                              padding: '7px 16px',
                              borderRadius: '999px',
                              fontSize: '12px',
                              fontWeight: 800,
                            }}
                          >
                            {getEstadoLabel(p.estado)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ color: '#64748b', margin: '1rem 0 0 0' }}>
                  Sin presupuestos. <button onClick={() => router.push(`/dashboard/presupuestos/nuevo?client_id=${clientId}`)} style={{ color: '#2d5a27', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}>Crear uno</button>
                </p>
              )}
            </div>

            {/* CITAS */}
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
                Visitas y citas
              </h2>

              {citas.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {citas.map(c => (
                    <div key={c.id} style={{ paddingBottom: '1.5rem', borderBottom: '1px solid #e5ddcf' }}>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>
                        {c.date} · {c.time}
                      </p>
                      <strong style={{ display: 'block', marginTop: '6px' }}>
                        {c.title}
                      </strong>
                      {c.place && (
                        <p style={{ marginTop: '4px', color: '#64748b', fontSize: '14px' }}>
                          📍 {c.place}
                        </p>
                      )}
                      {c.notes && (
                        <p style={{ marginTop: '4px', color: '#64748b', fontSize: '14px' }}>
                          {c.notes}
                        </p>
                      )}
                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: '8px',
                          background: getEstadoBg(c.estado),
                          color: getEstadoColor(c.estado),
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                        }}
                      >
                        {getEstadoLabel(c.estado)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#64748b', margin: '1rem 0 0 0' }}>
                  Sin citas programadas. <button onClick={() => router.push(`/dashboard/agenda?client_id=${clientId}`)} style={{ color: '#2d5a27', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}>Crear una</button>
                </p>
              )}
            </div>
          </div>

          {/* SIDEBAR - FICHA */}
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

            <FichaItem label="Email" value={cliente.email || '—'} />
            <FichaItem label="Teléfono" value={cliente.phone || '—'} />
            <FichaItem label="Dirección" value={cliente.address || '—'} />
            <FichaItem label="Local" value={cliente.local || '—'} />
            <FichaItem label="Estado" value={cliente.estado || '—'} />
            <FichaItem label="Notas" value={cliente.notes || '—'} />

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5ddcf' }}>
              <button
                onClick={async () => {
                  if (confirm('¿Eliminar este cliente?')) {
                    const { error } = await supabase
                      .from('clientes')
                      .delete()
                      .eq('id', clientId)

                    if (!error) {
                      router.push('/dashboard/clientes')
                    }
                  }
                }}
                style={{
                  width: '100%',
                  padding: '.5rem',
                  background: '#fcebeb',
                  color: '#991f1f',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                🗑️ Eliminar cliente
              </button>
            </div>
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
      <div style={{ fontSize: '15px', color: '#071018', wordBreak: 'break-word' }}>
        {value}
      </div>
    </div>
  )
}

// Funciones auxiliares para estados
function getEstadoBg(estado: string): string {
  const map: Record<string, string> = {
    borrador: '#f3f0ea',
    enviado: '#dbeafe',
    aceptado: '#dcfce7',
    rechazado: '#fcebeb',
    pendiente: '#fdf3d6',
    confirmada: '#dcfce7',
    completada: '#dcfce7',
    cancelada: '#fcebeb',
    pagada: '#dcfce7',
    vencida: '#fcebeb',
  }
  return map[estado.toLowerCase()] || '#f3f0ea'
}

function getEstadoColor(estado: string): string {
  const map: Record<string, string> = {
    borrador: '#64748b',
    enviado: '#1d4ed8',
    aceptado: '#166534',
    rechazado: '#991f1f',
    pendiente: '#92400e',
    confirmada: '#166534',
    completada: '#166534',
    cancelada: '#991f1f',
    pagada: '#166534',
    vencida: '#991f1f',
  }
  return map[estado.toLowerCase()] || '#64748b'
}

function getEstadoLabel(estado: string): string {
  const map: Record<string, string> = {
    borrador: 'Borrador',
    enviado: 'Enviado',
    aceptado: 'Aceptado',
    rechazado: 'Rechazado',
    pendiente: 'Pendiente',
    confirmada: 'Confirmada',
    completada: 'Completada',
    cancelada: 'Cancelada',
    pagada: 'Pagada',
    vencida: 'Vencida',
  }
  return map[estado.toLowerCase()] || estado
}
