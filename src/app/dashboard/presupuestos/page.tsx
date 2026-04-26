'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import pStyles from './presupuestos.module.css'

type Status = 'draft' | 'sent' | 'accepted' | 'rejected'

const STATUS_LABEL: Record<Status, string> = {
  draft: 'Borrador',
  sent: 'Enviado',
  accepted: 'Aceptado',
  rejected: 'Rechazado',
}

const STATUS_COLOR: Record<Status, [string, string]> = {
  draft: ['#ede9e1', '#64748b'],
  sent: ['#dbeafe', '#1d4ed8'],
  accepted: ['#dcfce7', '#166534'],
  rejected: ['#fee2e2', '#991b1b'],
}

const DOCS = [
  { id: 'q1', wnum: 'TRB-001', num: 'PRES-2026-001', client: 'Carmen Ruiz', date: '10/04/2026', amount: 694.2, status: 'sent' as Status },
  { id: 'q2', wnum: 'TRB-002', num: 'PRES-2026-002', client: 'Bufete Martín', date: '18/04/2026', amount: 3872, status: 'accepted' as Status },
  { id: 'q3', wnum: 'TRB-003', num: 'PRES-2026-003', client: 'Lucía Navarro', date: '22/04/2026', amount: 653.4, status: 'draft' as Status },
  { id: 'q4', wnum: 'TRB-004', num: 'PRES-2026-004', client: 'Pedro Alonso', date: '23/04/2026', amount: 1200, status: 'rejected' as Status },
]

const CLIENTES = [
  'Carmen Ruiz · +34 611 222 333',
  'Javier Romero · +34 677 888 999',
  'Bufete Martín · +34 912 345 678',
  'Pedro Alonso · +34 622 111 222',
]

const fmt = (n: number) =>
  n.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

interface Line {
  desc: string
  detail: string
  workers: number
  price: number
  tax: number
  discount: number
}

const emptyLine = (): Line => ({
  desc: '',
  detail: '',
  workers: 1,
  price: 0,
  tax: 21,
  discount: 0,
})

export default function Presupuestos() {
    useEffect(() => {
      const loadProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .maybeSingle()

        if (error) {
          console.error(error)
          return
        }

        console.log('Perfil cargado:', data)
      }

      loadProfile()
    }, [])
  const [showForm, setShowForm] = useState(false)
  const [isExt, setIsExt] = useState(false)
  const [showExtModal, setShowExtModal] = useState(false)

  const [lines, setLines] = useState<Line[]>([emptyLine()])

  const [extBusiness, setExtBusiness] = useState({
    name: '',
    nif: '',
    email: '',
    address: '',
    phone: '',
    iban: '',
  })

  const [extClient, setExtClient] = useState({
    name: '',
    nif: '',
    email: '',
    address: '',
    phone: '',
  })

  const updateLine = (i: number, key: keyof Line, val: string | number) =>
    setLines(ls => ls.map((l, idx) => (idx === i ? { ...l, [key]: val } : l)))

  const addLine = () => setLines(ls => [...ls, emptyLine()])
  const removeLine = (i: number) => setLines(ls => ls.filter((_, idx) => idx !== i))

  const base = lines.reduce((s, l) => s + l.workers * l.price * (1 - l.discount / 100), 0)
  const tax = lines.reduce((s, l) => s + l.workers * l.price * (1 - l.discount / 100) * (l.tax / 100), 0)
  const total = base + tax

  const pending = DOCS.filter(d => d.status !== 'accepted').reduce((s, d) => s + d.amount, 0)

  const openNewBudget = () => {
    setShowForm(true)
    setIsExt(false)
    setShowExtModal(false)
    setLines([emptyLine()])
  }

  const activateExternalBudget = () => {
    setIsExt(true)
    setShowExtModal(true)
  }

  const saveExternalData = () => {
    if (!extBusiness.name.trim()) {
      alert('Escribe el nombre del negocio emisor')
      return
    }

    if (!extClient.name.trim()) {
      alert('Escribe el nombre del cliente externo')
      return
    }

    setShowExtModal(false)
    alert('Datos externos cargados correctamente ✅')
  }

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/presupuestos" />

      <main className={styles.main}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Presupuestos</h1>
            <p className={styles.phSub}>
              Pendiente de cerrar: <strong>{fmt(pending)}</strong>
            </p>
          </div>

          <button className={styles.btnDark} onClick={openNewBudget}>
            + Nuevo presupuesto
          </button>
        </div>

        {showForm && (
          <div className={pStyles.formCard}>
            <div className={pStyles.formTopBar}>
              <div className={pStyles.formTitle}>📄 Nuevo presupuesto</div>

              <div className={pStyles.extToggle}>
                <button
                  type="button"
                  className={`${pStyles.extBtn} ${isExt ? pStyles.extOn : ''}`}
                  onClick={activateExternalBudget}
                >
                  🤝 Presupuesto para otro negocio
                </button>

                <button className={pStyles.closeBtn} onClick={() => setShowForm(false)}>
                  ×
                </button>
              </div>
            </div>

            {isExt && (
              <div className={pStyles.extBlock}>
                <div className={pStyles.extBlockTitle}>
                  🤝 Presupuesto externo cargado
                </div>

                <div className={pStyles.grid3}>
                  <div className={pStyles.field}>
                    <label>Negocio emisor</label>
                    <input value={extBusiness.name} readOnly placeholder="Sin datos" />
                  </div>

                  <div className={pStyles.field}>
                    <label>Cliente externo</label>
                    <input value={extClient.name} readOnly placeholder="Sin datos" />
                  </div>

                  <div className={pStyles.field}>
                    <label>Teléfono cliente</label>
                    <input value={extClient.phone} readOnly placeholder="Sin datos" />
                  </div>
                </div>

                <button
                  type="button"
                  className={pStyles.addLineBtn}
                  onClick={() => setShowExtModal(true)}
                >
                  Editar datos externos
                </button>
              </div>
            )}

            <div className={pStyles.docHead}>
              <div className={pStyles.field}>
                <label>Nº de trabajo</label>
                <input placeholder="TRB-005" />
              </div>

              <div className={pStyles.field}>
                <label>Fecha</label>
                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>

              <div className={pStyles.field}>
                <label>Estado</label>
                <select>
                  {Object.entries(STATUS_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div className={pStyles.field}>
                <label>Cliente *</label>

                {isExt ? (
                  <input value={extClient.name} readOnly placeholder="Cliente externo" />
                ) : (
                  <select>
                    <option>Selecciona cliente…</option>
                    {CLIENTES.map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.45rem' }}>
                <div className={pStyles.blockTitle}>Conceptos</div>

                <button
                  className={pStyles.copyBtn}
                  onClick={() =>
                    navigator.clipboard.writeText(
                      lines.map(l => `${l.desc}\t${l.workers}\t${l.price}€\t${fmt(l.workers * l.price * (1 + l.tax / 100))}`).join('\n')
                    )
                  }
                >
                  ⎘ Copiar tabla
                </button>
              </div>

              <div className={pStyles.linesHeader}>
                <span>Concepto *</span>
                <span>Descripción</span>
                <span style={{ textAlign: 'center' }}>Nº personas</span>
                <span style={{ textAlign: 'right' }}>P. unitario</span>
                <span style={{ textAlign: 'center' }}>IVA %</span>
                <span style={{ textAlign: 'center' }}>Dto %</span>
                <span style={{ textAlign: 'right' }}>Total línea</span>
                <span></span>
              </div>

              {lines.map((l, i) => {
                const lt = l.workers * l.price * (1 - l.discount / 100) * (1 + l.tax / 100)

                return (
                  <div key={i} className={pStyles.line}>
                    <input value={l.desc} onChange={e => updateLine(i, 'desc', e.target.value)} placeholder="Servicio o concepto" />
                    <input value={l.detail} onChange={e => updateLine(i, 'detail', e.target.value)} placeholder="Detalle…" />
                    <input type="number" value={l.workers} onChange={e => updateLine(i, 'workers', +e.target.value)} min={1} style={{ textAlign: 'center' }} />
                    <input type="number" value={l.price} onChange={e => updateLine(i, 'price', +e.target.value)} min={0} step={0.01} style={{ textAlign: 'right' }} />
                    <input type="number" value={l.tax} onChange={e => updateLine(i, 'tax', +e.target.value)} min={0} style={{ textAlign: 'center' }} />
                    <input type="number" value={l.discount} onChange={e => updateLine(i, 'discount', +e.target.value)} min={0} max={100} style={{ textAlign: 'center' }} />
                    <div className={pStyles.lineTot}>{fmt(lt)}</div>
                    <button className={pStyles.lineRemove} onClick={() => removeLine(i)}>×</button>
                  </div>
                )
              })}

              <button className={pStyles.addLineBtn} onClick={addLine}>
                + Añadir concepto
              </button>
            </div>

            <div className={pStyles.totalsRow}>
              <div className={pStyles.field} style={{ flex: 1, maxWidth: 340 }}>
                <label>Notas / condiciones</label>
                <textarea
                  placeholder="Condiciones de pago, validez, observaciones…"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '.65rem .85rem',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: 8,
                    fontSize: '.875rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div className={pStyles.totalsBox}>
                <div className={pStyles.totRow}><span>Base imponible</span><strong>{fmt(base)}</strong></div>
                <div className={pStyles.totRow}><span>IVA total</span><strong>{fmt(tax)}</strong></div>
                <div className={`${pStyles.totRow} ${pStyles.totBig}`}><span>TOTAL</span><strong>{fmt(total)}</strong></div>

                <button
                  className={pStyles.copyBtn}
                  style={{ alignSelf: 'flex-end', marginTop: '.25rem' }}
                  onClick={() => navigator.clipboard.writeText(`Base: ${fmt(base)}\nIVA: ${fmt(tax)}\nTotal: ${fmt(total)}`)}
                >
                  ⎘ Copiar totales
                </button>
              </div>
            </div>

            <div className={pStyles.formFoot}>
              <button className={styles.btnGhost} onClick={() => setShowForm(false)}>Cancelar</button>
              <button className={pStyles.pdfBtn}>📄 Generar PDF</button>
              <button className={styles.btnDark} onClick={() => setShowForm(false)}>Guardar presupuesto ✓</button>
            </div>
          </div>
        )}

        <div className={styles.card} style={{ padding: 0 }}>
          <table className={styles.tbl}>
            <thead>
              <tr>
                <th>N.Trabajo</th>
                <th>Número</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Importe</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {DOCS.map(d => {
                const [bg, color] = STATUS_COLOR[d.status]

                return (
                  <tr key={d.id}>
                    <td style={{ color: '#64748b', fontWeight: 600 }}>{d.wnum}</td>
                    <td><strong>{d.num}</strong></td>
                    <td>{d.client}</td>
                    <td style={{ color: '#64748b' }}>{d.date}</td>
                    <td><strong>{fmt(d.amount)}</strong></td>
                    <td>
                      <span style={{ background: bg, color, padding: '.18rem .55rem', borderRadius: 20, fontSize: '.66rem', fontWeight: 700, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '.25rem' }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block' }} />
                        {STATUS_LABEL[d.status]}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '.3rem', justifyContent: 'flex-end' }}>
                        {d.status === 'accepted' && <button className={pStyles.convertBtn}>→ Factura</button>}
                        {d.status === 'sent' && <button className={pStyles.acceptBtn}>✓ Aceptar</button>}
                        <button className={pStyles.editBtn}>✎</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {showExtModal && (
          <div className={pStyles.modalOverlay}>
            <div className={pStyles.modalBox}>
              <div className={pStyles.modalHead}>
                <div>
                  <h2>Datos para presupuesto externo</h2>
                  <p>Rellena el negocio emisor y el cliente final.</p>
                </div>

                <button className={pStyles.closeBtn} onClick={() => setShowExtModal(false)}>
                  ×
                </button>
              </div>

              <div className={pStyles.modalSectionTitle}>Negocio emisor</div>

              <div className={pStyles.grid3}>
                <div className={pStyles.field}>
                  <label>Nombre / empresa *</label>
                  <input value={extBusiness.name} onChange={e => setExtBusiness({ ...extBusiness, name: e.target.value })} placeholder="Ej: Reformas García SL" />
                </div>

                <div className={pStyles.field}>
                  <label>NIF / CIF / NIE</label>
                  <input value={extBusiness.nif} onChange={e => setExtBusiness({ ...extBusiness, nif: e.target.value })} placeholder="B12345678" />
                </div>

                <div className={pStyles.field}>
                  <label>Email</label>
                  <input value={extBusiness.email} onChange={e => setExtBusiness({ ...extBusiness, email: e.target.value })} placeholder="contacto@empresa.com" />
                </div>

                <div className={pStyles.field}>
                  <label>Dirección fiscal</label>
                  <input value={extBusiness.address} onChange={e => setExtBusiness({ ...extBusiness, address: e.target.value })} placeholder="C/ Ejemplo, 12, Madrid" />
                </div>

                <div className={pStyles.field}>
                  <label>Teléfono</label>
                  <input value={extBusiness.phone} onChange={e => setExtBusiness({ ...extBusiness, phone: e.target.value })} placeholder="+34 600 000 000" />
                </div>

                <div className={pStyles.field}>
                  <label>IBAN</label>
                  <input value={extBusiness.iban} onChange={e => setExtBusiness({ ...extBusiness, iban: e.target.value })} placeholder="ES91 2100…" />
                </div>
              </div>

              <div className={pStyles.modalSectionTitle}>Cliente final</div>

              <div className={pStyles.grid3}>
                <div className={pStyles.field}>
                  <label>Nombre cliente *</label>
                  <input value={extClient.name} onChange={e => setExtClient({ ...extClient, name: e.target.value })} placeholder="Ej: Ana Martín" />
                </div>

                <div className={pStyles.field}>
                  <label>NIF / CIF / NIE</label>
                  <input value={extClient.nif} onChange={e => setExtClient({ ...extClient, nif: e.target.value })} placeholder="12345678A" />
                </div>

                <div className={pStyles.field}>
                  <label>Email</label>
                  <input value={extClient.email} onChange={e => setExtClient({ ...extClient, email: e.target.value })} placeholder="cliente@email.com" />
                </div>

                <div className={pStyles.field}>
                  <label>Dirección</label>
                  <input value={extClient.address} onChange={e => setExtClient({ ...extClient, address: e.target.value })} placeholder="Dirección del cliente" />
                </div>

                <div className={pStyles.field}>
                  <label>Teléfono</label>
                  <input value={extClient.phone} onChange={e => setExtClient({ ...extClient, phone: e.target.value })} placeholder="+34 600 000 000" />
                </div>
              </div>

              <div className={pStyles.formFoot}>
                <button className={styles.btnGhost} onClick={() => setShowExtModal(false)}>
                  Cancelar
                </button>

                <button className={styles.btnDark} onClick={saveExternalData}>
                  Usar estos datos
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}