'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sidebar } from '../../page'
import styles from '../../page.module.css'
import { useAuth } from '@/lib/context'
import { createClient } from '@/lib/supabase/client'

interface ClienteDetalle {
  id: string
  user_id?: string
  name: string
  apellido?: string | null
  email?: string | null
  phone?: string | null
  local?: string | null
  address?: string | null
  cif?: string | null
  cp?: string | null
  ciudad?: string | null
  estado?: string | null
  tags?: string | null
  notes?: string | null
  created_at?: string | null
}

interface Presupuesto {
  id: string
  user_id?: string
  client_id?: string | null
  client_name?: string | null
  numero: string
  fecha: string
  total: number
  estado?: string | null
  items?: any[] | null
  notas?: string | null
  cliente_apellido?: string | null
  cliente_cif?: string | null
  cliente_cp?: string | null
  cliente_email?: string | null
  cliente_telefono?: string | null
  cliente_direccion?: string | null
  cliente_ciudad?: string | null
  metodo_pago?: string | null
}

interface Cita {
  id: string
  user_id?: string
  client_id?: string | null
  client_name?: string | null
  title: string
  date: string
  time: string
  place?: string | null
  notes?: string | null
  estado?: string | null
  created_at?: string | null
}

const fmt = (n: number) =>
  Number(n || 0).toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const fmtDate = (value?: string | null) => {
  if (!value) return '—'
  try {
    return new Date(`${value}T00:00:00`).toLocaleDateString('es-ES')
  } catch {
    return value
  }
}

const safeText = (value?: string | null) => (value && value.trim() ? value : '—')

export default function ClienteDetallePage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const { user, loading: authLoading } = useAuth()

  const clientId = useMemo(() => String(params?.id || ''), [params])

  const [cliente, setCliente] = useState<ClienteDetalle | null>(null)
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([])
  const [citas, setCitas] = useState<Cita[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    if (!user || !clientId) return

    setLoading(true)

    try {
      const { data: clienteData, error: clienteError } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', clientId)
        .eq('user_id', user.id)
        .single()

      if (clienteError || !clienteData) {
        console.error('Error cargando cliente:', clienteError)
        setCliente(null)
        setPresupuestos([])
        setCitas([])
        return
      }

      setCliente(clienteData as ClienteDetalle)

      const { data: presupuestosData, error: presupuestosError } = await supabase
        .from('presupuestos')
        .select('*')
        .eq('user_id', user.id)
        .eq('client_id', clientId)
        .order('fecha', { ascending: false })

      if (presupuestosError) {
        console.error('Error cargando presupuestos:', presupuestosError)
        setPresupuestos([])
      } else {
        setPresupuestos((presupuestosData || []).map((doc: any) => ({
          ...doc,
          items: Array.isArray(doc.items) ? doc.items : [],
        })))
      }

      // ✅ CITAS DEL CLIENTE
      // La relación correcta es citas.client_id -> clientes.id.
      // Además dejamos un respaldo por client_name para citas antiguas que se hayan guardado sin client_id.
      const { data: citasPorId, error: citasPorIdError } = await supabase
        .from('citas')
        .select('*')
        .eq('user_id', user.id)
        .eq('client_id', clientId)
        .order('date', { ascending: true })
        .order('time', { ascending: true })

      if (citasPorIdError) {
        console.error('Error cargando citas por client_id:', citasPorIdError)
      }

      const nombreCliente = String(clienteData.name || '').trim()
      const { data: citasPorNombre, error: citasPorNombreError } = nombreCliente
        ? await supabase
            .from('citas')
            .select('*')
            .eq('user_id', user.id)
            .is('client_id', null)
            .eq('client_name', nombreCliente)
            .order('date', { ascending: true })
            .order('time', { ascending: true })
        : { data: [], error: null }

      if (citasPorNombreError) {
        console.error('Error cargando citas antiguas por nombre:', citasPorNombreError)
      }

      const citasUnicas = new Map<string, Cita>()
      ;([...(citasPorId || []), ...(citasPorNombre || [])] as Cita[]).forEach((cita) => {
        citasUnicas.set(cita.id, cita)
      })

      setCitas(
        Array.from(citasUnicas.values()).sort((a, b) => {
          const dateCompare = String(a.date || '').localeCompare(String(b.date || ''))
          if (dateCompare !== 0) return dateCompare
          return String(a.time || '').localeCompare(String(b.time || ''))
        })
      )
    } catch (err) {
      console.error('Error cargando detalle del cliente:', err)
      setCliente(null)
      setPresupuestos([])
      setCitas([])
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
    loadData()
  }, [authLoading, user, router, loadData])

  const calcularLinea = (item: any) => {
    const cantidad = Number(item?.cantidad) || 0
    const precio = Number(item?.precio) || 0
    const descuento = Number(item?.descuento) || 0
    const ivaPorcentaje = Number(item?.iva) || 0
    const subtotal = cantidad * precio
    const descuentoTotal = descuento > 0 ? (subtotal * descuento) / 100 : 0
    const base = subtotal - descuentoTotal
    const iva = (base * ivaPorcentaje) / 100
    return { base, iva, total: base + iva }
  }

  const calcularTotalesDocumento = (doc: Presupuesto) => {
    const items = Array.isArray(doc.items) ? doc.items : []

    if (!items.length) {
      return { base: Number(doc.total || 0), iva: 0, total: Number(doc.total || 0) }
    }

    return items.reduce(
      (acc, item) => {
        const calc = calcularLinea(item)
        acc.base += calc.base
        acc.iva += calc.iva
        acc.total += calc.total
        return acc
      },
      { base: 0, iva: 0, total: 0 }
    )
  }

  const descargarPDF = async (docData: Presupuesto, type: 'presupuesto' | 'factura') => {
    try {
      setDownloadingId(`${type}-${docData.id}`)

      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const titulo = type === 'presupuesto' ? 'PRESUPUESTO' : 'FACTURA'
      const totales = calcularTotalesDocumento(docData)
      const nombreCliente = `${docData.client_name || cliente?.name || ''} ${docData.cliente_apellido || cliente?.apellido || ''}`.trim()

      pdf.setFontSize(26)
      pdf.setFont('helvetica', 'bold')
      pdf.text(titulo, 105, 20, { align: 'center' })

      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Número: ${docData.numero}`, 20, 35)
      pdf.text(`Fecha: ${fmtDate(docData.fecha)}`, 130, 35)

      pdf.setFont('helvetica', 'bold')
      pdf.text('CLIENTE:', 20, 52)
      pdf.setFont('helvetica', 'normal')
      pdf.text(nombreCliente || '—', 20, 60)
      pdf.text(`CIF: ${docData.cliente_cif || cliente?.cif || '—'}`, 20, 66)
      pdf.text(`Email: ${docData.cliente_email || cliente?.email || '—'}`, 20, 72)
      pdf.text(`Tel: ${docData.cliente_telefono || cliente?.phone || '—'}`, 20, 78)
      pdf.text(`Dir: ${docData.cliente_direccion || cliente?.address || '—'}`, 20, 84)
      pdf.text(`${docData.cliente_cp || cliente?.cp || ''} ${docData.cliente_ciudad || cliente?.ciudad || ''}`.trim() || '—', 20, 90)

      let y = 108
      pdf.setFont('helvetica', 'bold')
      pdf.setFillColor(240, 240, 240)
      pdf.rect(15, y - 6, 180, 8, 'F')
      pdf.text('CONCEPTO', 18, y)
      pdf.text('DESCRIPCIÓN', 52, y)
      pdf.text('CANT.', 108, y, { align: 'center' })
      pdf.text('PRECIO', 132, y, { align: 'right' })
      pdf.text('IVA', 154, y, { align: 'center' })
      pdf.text('TOTAL', 188, y, { align: 'right' })

      y += 10
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(8)

      const items = Array.isArray(docData.items) ? docData.items : []
      items.forEach((item: any) => {
        if (y > 270) {
          pdf.addPage()
          y = 20
        }

        const calc = calcularLinea(item)
        pdf.text(String(item?.concepto || '').slice(0, 22), 18, y)
        pdf.text(String(item?.descripcion || '').slice(0, 26), 52, y)
        pdf.text(String(item?.cantidad || 0), 108, y, { align: 'center' })
        pdf.text(`${Number(item?.precio || 0).toFixed(2)}€`, 132, y, { align: 'right' })
        pdf.text(`${Number(item?.iva || 0)}%`, 154, y, { align: 'center' })
        pdf.text(`${calc.total.toFixed(2)}€`, 188, y, { align: 'right' })
        y += 7
      })

      y += 8
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(10)
      pdf.text(`BASE: ${totales.base.toFixed(2)}€`, 188, y, { align: 'right' })
      y += 7
      pdf.text(`IVA: ${totales.iva.toFixed(2)}€`, 188, y, { align: 'right' })
      y += 9
      pdf.setFontSize(13)
      pdf.text(`TOTAL: ${totales.total.toFixed(2)}€`, 188, y, { align: 'right' })

      if (docData.notas) {
        y += 14
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(9)
        pdf.text('Observaciones:', 20, y)
        y += 5
        pdf.setFont('helvetica', 'normal')
        const lines = pdf.splitTextToSize(docData.notas, 170)
        pdf.text(lines, 20, y)
      }

      pdf.save(`${type}-${docData.numero}.pdf`)
    } catch (err) {
      console.error('Error descargando PDF:', err)
      alert('❌ No se pudo descargar el PDF')
    } finally {
      setDownloadingId(null)
    }
  }

  const deleteClient = async () => {
    if (!cliente || !user) return
    if (!confirm(`¿Eliminar definitivamente a ${cliente.name}?`)) return

    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', cliente.id)
      .eq('user_id', user.id)

    if (error) {
      alert('❌ Error eliminando cliente: ' + error.message)
      return
    }

    router.push('/dashboard/clientes')
  }

  if (loading || authLoading) {
    return (
      <div className={styles.app}>
        <Sidebar active="/dashboard/clientes" />
        <main className={styles.main}>
          <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', color: '#64748b' }}>
            Cargando cliente…
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
          <Link href="/dashboard/clientes" style={{ color: '#ef4444', fontSize: '.9rem', textDecoration: 'none' }}>← Clientes</Link>
          <div className={styles.card} style={{ marginTop: '1rem', padding: '2rem' }}>
            <h1 style={{ margin: 0 }}>Cliente no encontrado</h1>
            <p style={{ color: '#64748b' }}>No existe o no pertenece a tu cuenta.</p>
          </div>
        </main>
      </div>
    )
  }

  const initials = `${cliente.name?.[0] || 'C'}${cliente.apellido?.[0] || ''}`.toUpperCase()

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/clientes" />

      <main className={styles.main}>
        <style jsx>{`
          .detailTop {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            align-items: center;
            margin-bottom: 1.5rem;
          }
          .identity {
            display: flex;
            align-items: center;
            gap: 1rem;
            min-width: 0;
          }
          .avatar {
            width: 52px;
            height: 52px;
            border-radius: 14px;
            display: grid;
            place-items: center;
            background: #f8d9bf;
            color: #0f172a;
            font-weight: 900;
            flex: 0 0 auto;
          }
          .title {
            font-size: clamp(2rem, 6vw, 3.1rem);
            line-height: 1;
            margin: 0;
            font-family: Georgia, serif;
            word-break: break-word;
          }
          .actions {
            display: flex;
            gap: .55rem;
            flex-wrap: wrap;
            justify-content: flex-end;
          }
          .grid {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(320px, .95fr);
            gap: 1.25rem;
            align-items: start;
          }
          .sectionCard {
            background: white;
            border: 1px solid #ded7ca;
            border-radius: 8px;
            padding: 1rem;
          }
          .sectionTitle {
            margin: 0 0 1rem;
            font-family: Georgia, serif;
            font-size: 1.35rem;
          }
          .miniTable {
            width: 100%;
            border-collapse: collapse;
            font-size: .86rem;
          }
          .miniTable th {
            text-align: left;
            padding: .75rem .6rem;
            background: #f3f0ea;
            color: #64748b;
            font-size: .72rem;
            text-transform: uppercase;
            letter-spacing: .08em;
          }
          .miniTable td {
            padding: .8rem .6rem;
            border-bottom: 1px solid #eee7dc;
            vertical-align: middle;
          }
          .pdfBtns {
            display: flex;
            gap: .35rem;
            flex-wrap: wrap;
          }
          .tinyBtn {
            border: 0;
            border-radius: 5px;
            padding: .38rem .55rem;
            font-size: .72rem;
            font-weight: 800;
            cursor: pointer;
            color: white;
          }
          .citaList {
            display: grid;
            gap: .75rem;
          }
          .citaItem {
            display: grid;
            grid-template-columns: auto 1fr auto;
            gap: .8rem;
            align-items: start;
            padding: .9rem;
            border: 1px solid #eee7dc;
            border-radius: 10px;
            background: #fff;
          }
          .citaDate {
            min-width: 74px;
            text-align: center;
            border-radius: 10px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: .55rem .4rem;
          }
          .citaDate strong {
            display: block;
            font-size: 1.05rem;
            color: #0f172a;
          }
          .citaDate span {
            font-size: .68rem;
            color: #64748b;
            font-weight: 800;
            text-transform: uppercase;
          }
          .citaTitle {
            font-weight: 900;
            color: #0f172a;
            margin-bottom: .28rem;
          }
          .citaMeta {
            color: #64748b;
            font-size: .82rem;
            line-height: 1.55;
          }
          .badge {
            font-size: .68rem;
            font-weight: 900;
            text-transform: uppercase;
            padding: .28rem .55rem;
            border-radius: 999px;
            background: #eef2ff;
            color: #3730a3;
            white-space: nowrap;
          }
          .infoGrid {
            display: grid;
            gap: .95rem;
          }
          .infoLabel {
            display: block;
            font-size: .74rem;
            text-transform: uppercase;
            letter-spacing: .12em;
            font-weight: 900;
            color: #0f172a;
            margin-bottom: .24rem;
          }
          .infoValue {
            color: #111827;
            word-break: break-word;
          }
          .deleteBtn {
            width: 100%;
            margin-top: 1.3rem;
            border: 0;
            border-radius: 8px;
            padding: .8rem 1rem;
            background: #fee2e2;
            color: #991b1b;
            font-weight: 800;
            cursor: pointer;
          }
          .empty {
            color: #64748b;
            font-size: .9rem;
            padding: .75rem 0;
          }
          @media (max-width: 900px) {
            .detailTop {
              align-items: flex-start;
              flex-direction: column;
            }
            .actions {
              width: 100%;
              justify-content: stretch;
            }
            .actions :global(a),
            .actions button {
              flex: 1 1 auto;
              text-align: center;
            }
            .grid {
              grid-template-columns: 1fr;
            }
          }
          @media (max-width: 560px) {
            .miniTable thead {
              display: none;
            }
            .miniTable,
            .miniTable tbody,
            .miniTable tr,
            .miniTable td {
              display: block;
              width: 100%;
            }
            .miniTable tr {
              border: 1px solid #eee7dc;
              border-radius: 10px;
              padding: .7rem;
              margin-bottom: .75rem;
            }
            .miniTable td {
              border: 0;
              padding: .32rem 0;
            }
            .miniTable td::before {
              content: attr(data-label);
              display: block;
              color: #64748b;
              font-size: .68rem;
              text-transform: uppercase;
              letter-spacing: .08em;
              font-weight: 900;
              margin-bottom: .1rem;
            }
            .citaItem {
              grid-template-columns: 1fr;
            }
            .citaDate {
              width: 100%;
              display: flex;
              justify-content: center;
              gap: .35rem;
              align-items: baseline;
            }
            .badge {
              justify-self: start;
            }
          }
        `}</style>

        <Link href="/dashboard/clientes" style={{ display: 'inline-block', color: '#ef4444', fontSize: '.9rem', marginBottom: '1rem', textDecoration: 'none' }}>
          ← Clientes
        </Link>

        <div className="detailTop">
          <div className="identity">
            <div className="avatar">{initials}</div>
            <div>
              <h1 className="title">{cliente.name}{cliente.apellido ? ` ${cliente.apellido}` : ''}</h1>
            </div>
          </div>

          <div className="actions">
            <button className={styles.btnGhost} onClick={() => router.push(`/dashboard/clientes?edit=${cliente.id}`)} style={{ width: 'auto', height: 40, padding: '0 1rem' }}>
              ✎ Editar
            </button>
            <button className={styles.btnDark} onClick={() => router.push(`/dashboard/documentos?client_id=${cliente.id}`)} style={{ width: 'auto', height: 40, padding: '0 1rem' }}>
              + Documentos
            </button>
            <button className={styles.btnDark} onClick={() => router.push(`/dashboard/agenda?client_id=${cliente.id}`)} style={{ width: 'auto', height: 40, padding: '0 1rem', background: '#166534' }}>
              📅 Agenda
            </button>
          </div>
        </div>

        <div className="grid">
          <div style={{ display: 'grid', gap: '1rem' }}>
            <section className="sectionCard">
              <h2 className="sectionTitle">Presupuestos</h2>

              {presupuestos.length > 0 ? (
                <table className="miniTable">
                  <thead>
                    <tr>
                      <th>Número</th>
                      <th>Fecha</th>
                      <th>Importe</th>
                      <th>Descargar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {presupuestos.map((doc) => (
                      <tr key={doc.id}>
                        <td data-label="Número"><strong>{doc.numero}</strong></td>
                        <td data-label="Fecha">{fmtDate(doc.fecha)}</td>
                        <td data-label="Importe"><strong>{fmt(doc.total)}</strong></td>
                        <td data-label="Descargar">
                          <div className="pdfBtns">
                            <button
                              className="tinyBtn"
                              style={{ background: '#3b82f6' }}
                              onClick={() => descargarPDF(doc, 'presupuesto')}
                              disabled={downloadingId === `presupuesto-${doc.id}`}
                            >
                              ↓ Pres.
                            </button>
                            <button
                              className="tinyBtn"
                              style={{ background: '#8b5cf6' }}
                              onClick={() => descargarPDF(doc, 'factura')}
                              disabled={downloadingId === `factura-${doc.id}`}
                            >
                              ↓ Fact.
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="empty">Sin presupuestos creados para este cliente.</div>
              )}
            </section>

            <section className="sectionCard">
              <h2 className="sectionTitle">Citas</h2>

              {citas.length > 0 ? (
                <div className="citaList">
                  {citas.map((cita) => {
                    const [yyyy, mm, dd] = cita.date?.split('-') || ['', '', '']
                    const monthName = mm ? new Date(Number(yyyy), Number(mm) - 1, 1).toLocaleDateString('es-ES', { month: 'short' }) : ''

                    return (
                      <article key={cita.id} className="citaItem">
                        <div className="citaDate">
                          <strong>{dd || '—'}</strong>
                          <span>{monthName || 'fecha'}</span>
                        </div>
                        <div>
                          <div className="citaTitle">{cita.title}</div>
                          <div className="citaMeta">
                            🕒 {cita.time || 'Sin hora'}
                            {cita.place ? <><br />📍 {cita.place}</> : null}
                            {cita.notes ? <><br />📝 {cita.notes}</> : null}
                          </div>
                        </div>
                        <span className="badge">{cita.estado || 'pendiente'}</span>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <div className="empty">Sin citas programadas para este cliente.</div>
              )}
            </section>
          </div>

          <aside className="sectionCard">
            <h2 className="sectionTitle">Ficha</h2>
            <div className="infoGrid">
              <div><span className="infoLabel">Email</span><div className="infoValue">{safeText(cliente.email)}</div></div>
              <div><span className="infoLabel">Teléfono</span><div className="infoValue">{safeText(cliente.phone)}</div></div>
              <div><span className="infoLabel">CIF</span><div className="infoValue">{safeText(cliente.cif)}</div></div>
              <div><span className="infoLabel">CP</span><div className="infoValue">{safeText(cliente.cp)}</div></div>
              <div><span className="infoLabel">Ciudad</span><div className="infoValue">{safeText(cliente.ciudad)}</div></div>
              <div><span className="infoLabel">Dirección</span><div className="infoValue">{safeText(cliente.address)}</div></div>
              <div><span className="infoLabel">Local</span><div className="infoValue">{safeText(cliente.local)}</div></div>
              <div><span className="infoLabel">Estado</span><div className="infoValue">{safeText(cliente.estado)}</div></div>
              {cliente.notes ? <div><span className="infoLabel">Notas</span><div className="infoValue">{cliente.notes}</div></div> : null}
            </div>

            <button className="deleteBtn" onClick={deleteClient}>🗑 Eliminar</button>
          </aside>
        </div>
      </main>
    </div>
  )
}
