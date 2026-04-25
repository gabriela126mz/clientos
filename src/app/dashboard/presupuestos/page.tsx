'use client'
import { useState } from 'react'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import pStyles from './presupuestos.module.css'

const DOCS = [
  { id:'q1', wnum:'TRB-001', num:'PRES-2026-001', type:'quote', client:'Carmen Ruiz', date:'10/04/2026', amount: 694.2, status:'sent' },
  { id:'q2', wnum:'TRB-002', num:'FAC-2026-015',  type:'invoice', client:'Javier Romero', date:'15/04/2026', amount: 822.8, status:'paid' },
  { id:'q3', wnum:'TRB-003', num:'PRES-2026-002', type:'quote', client:'Bufete Martín', date:'18/04/2026', amount: 3872, status:'draft' },
  { id:'q4', wnum:'TRB-004', num:'FAC-2026-016',  type:'invoice', client:'Pedro Alonso', date:'20/04/2026', amount: 4477.8, status:'paid' },
  { id:'q5', wnum:'TRB-005', num:'PRES-2026-003', type:'quote', client:'Lucía Navarro', date:'22/04/2026', amount: 653.4, status:'overdue' },
]

const STATUS_LABEL: Record<string,string> = { draft:'Borrador', sent:'Enviado', paid:'Pagado', overdue:'Vencido' }
const STATUS_CLS: Record<string,string> = { draft:'bDraft', sent:'bSent', paid:'bPaid', overdue:'bOver' }

export default function Presupuestos() {
  const [showForm, setShowForm] = useState(false)
  const [isExt, setIsExt] = useState(false)
  const [lines, setLines] = useState([
    { num:'1', desc:'', detail:'', qty:1, price:0, tax:21 }
  ])

  const addLine = () => setLines(l => [...l, { num: String(l.length+1), desc:'', detail:'', qty:1, price:0, tax:21 }])
  const updateLine = (i: number, key: string, val: string | number) => {
    setLines(l => l.map((ln, idx) => idx === i ? { ...ln, [key]: val } : ln))
  }
  const removeLine = (i: number) => setLines(l => l.filter((_, idx) => idx !== i))

  const base = lines.reduce((s, l) => s + l.qty * l.price, 0)
  const tax = lines.reduce((s, l) => s + l.qty * l.price * (l.tax / 100), 0)
  const total = base + tax

  const fmt = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })
  const pending = DOCS.filter(d => d.status !== 'paid').reduce((s, d) => s + d.amount, 0)

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/presupuestos" />
      <main className={styles.main}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Presupuestos y facturas</h1>
            <p className={styles.phSub}>Pendiente de cobrar: <strong>{fmt(pending)}</strong></p>
          </div>
          <div className={styles.phActions}>
            <button className={styles.btnGhost} onClick={() => { setIsExt(true); setShowForm(true) }}>
              + Factura externa
            </button>
            <button className={styles.btnDark} onClick={() => { setIsExt(false); setShowForm(true) }}>
              + Nuevo presupuesto
            </button>
          </div>
        </div>

        {/* FORMULARIO NUEVO DOC */}
        {showForm && (
          <div className={pStyles.formCard}>
            <div className={pStyles.formHead}>
              <div className={styles.cardT}>{isExt ? 'Nueva factura — cliente externo' : 'Nuevo presupuesto'}</div>
              <button className={pStyles.closeBtn} onClick={() => setShowForm(false)}>×</button>
            </div>

            {/* CABECERA DOC */}
            <div className={pStyles.docHead}>
              <div className={styles.field ?? pStyles.field}>
                <label>Nº de trabajo</label>
                <input placeholder="TRB-006" />
              </div>
              <div className={pStyles.field}>
                <label>Tipo</label>
                <select><option>Presupuesto</option><option>Factura</option></select>
              </div>
              <div className={pStyles.field}>
                <label>Fecha</label>
                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <div className={pStyles.field}>
                <label>Estado</label>
                <select><option>Borrador</option><option>Enviado</option><option>Pagado ✓</option><option>Vencido</option></select>
              </div>
            </div>

            {/* CLIENTE */}
            <div className={pStyles.clientBlock}>
              <div className={pStyles.clientBlockHead}>
                <span>Cliente</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: '.78rem', color: 'var(--grey)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isExt} onChange={e => setIsExt(e.target.checked)} />
                  Cliente externo (no en CRM)
                </label>
              </div>
              {isExt ? (
                <div className={pStyles.extGrid}>
                  <div className={pStyles.field}><label>Nombre / empresa</label><input placeholder="Nombre del cliente" /></div>
                  <div className={pStyles.field}><label>NIF / CIF</label><input placeholder="12345678A" /></div>
                  <div className={pStyles.field}><label>Email</label><input placeholder="cliente@email.com" /></div>
                  <div className={pStyles.field}><label>Dirección</label><input placeholder="C/ Ejemplo, 12" /></div>
                </div>
              ) : (
                <select style={{ width: '100%', padding: '.65rem .85rem', border: '1.5px solid var(--greyL)', borderRadius: 'var(--r)', fontSize: '.875rem', background: 'var(--white)' }}>
                  <option>Selecciona un cliente del CRM…</option>
                  <option>Carmen Ruiz · +34 611 222 333</option>
                  <option>Javier Romero · +34 677 888 999</option>
                  <option>Bufete Martín · +34 912 345 678</option>
                </select>
              )}
            </div>

            {/* LÍNEAS */}
            <div className={pStyles.linesLabel}>
              <span>Conceptos</span>
              <button className={pStyles.copyBtn} onClick={() => {}}>⎘ Copiar conceptos</button>
            </div>
            <div className={pStyles.linesHeader}>
              <span>Nº</span>
              <span>Concepto</span>
              <span>Detalle</span>
              <span>Uds</span>
              <span>Precio unit.</span>
              <span>IVA %</span>
              <span>Total línea</span>
              <span></span>
            </div>
            <div className={pStyles.lines}>
              {lines.map((l, i) => (
                <div key={i} className={pStyles.line}>
                  <input value={l.num} onChange={e => updateLine(i, 'num', e.target.value)} style={{ textAlign: 'center' }} />
                  <input value={l.desc} onChange={e => updateLine(i, 'desc', e.target.value)} placeholder="Servicio / concepto" />
                  <input value={l.detail} onChange={e => updateLine(i, 'detail', e.target.value)} placeholder="Detalle adicional…" />
                  <input type="number" value={l.qty} onChange={e => updateLine(i, 'qty', +e.target.value)} min={0} />
                  <input type="number" value={l.price} onChange={e => updateLine(i, 'price', +e.target.value)} min={0} step={0.01} />
                  <input type="number" value={l.tax} onChange={e => updateLine(i, 'tax', +e.target.value)} min={0} />
                  <div className={pStyles.lineTot}>{fmt(l.qty * l.price * (1 + l.tax / 100))}</div>
                  <button className={pStyles.lineRemove} onClick={() => removeLine(i)}>×</button>
                </div>
              ))}
            </div>
            <button className={pStyles.addLineBtn} onClick={addLine}>+ Añadir concepto</button>

            {/* TOTALES */}
            <div className={pStyles.totals}>
              <span>Base: <strong>{fmt(base)}</strong></span>
              <span>IVA: <strong>{fmt(tax)}</strong></span>
              <span className={pStyles.totalBig}>Total: <strong>{fmt(total)}</strong></span>
              <button className={pStyles.copyBtn} onClick={() => {}}>⎘ Copiar totales</button>
            </div>

            <div className={pStyles.field} style={{ marginTop: '.65rem' }}>
              <label>Notas / condiciones</label>
              <textarea placeholder="Condiciones de pago, validez del presupuesto…" rows={2} />
            </div>

            {isExt && (
              <div className={pStyles.emisorBlock}>
                <div className={pStyles.emisorTitle}>Datos del emisor (tu negocio)</div>
                <div className={pStyles.extGrid}>
                  <div className={pStyles.field}><label>Nombre / empresa</label><input defaultValue="Jardines Mediterráneos" /></div>
                  <div className={pStyles.field}><label>NIF</label><input placeholder="12345678A" /></div>
                  <div className={pStyles.field}><label>Dirección</label><input placeholder="C/ Olivos, 12, Madrid" /></div>
                  <div className={pStyles.field}><label>IBAN</label><input placeholder="ES91 2100…" /></div>
                </div>
              </div>
            )}

            <div className={pStyles.formFoot}>
              <button className={styles.btnGhost} onClick={() => setShowForm(false)}>Cancelar</button>
              <button className={styles.btnDark}>Guardar documento</button>
            </div>
          </div>
        )}

        {/* TABLA */}
        <div className={styles.card} style={{ padding: 0 }}>
          <table className={styles.tbl}>
            <thead>
              <tr>
                <th>N.Trabajo</th>
                <th>Número</th>
                <th>Tipo</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Importe</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {DOCS.map(d => (
                <tr key={d.id}>
                  <td style={{ color: 'var(--grey)', fontWeight: 600 }}>{d.wnum}</td>
                  <td><strong>{d.num}</strong></td>
                  <td style={{ color: 'var(--grey)' }}>{d.type === 'quote' ? 'Presupuesto' : 'Factura'}</td>
                  <td>{d.client}</td>
                  <td style={{ color: 'var(--grey)' }}>{d.date}</td>
                  <td><strong>{fmt(d.amount)}</strong></td>
                  <td><span className={`${styles.bdg} ${styles[STATUS_CLS[d.status] as keyof typeof styles]}`}>{STATUS_LABEL[d.status]}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '.15rem', justifyContent: 'flex-end' }}>
                      {d.type === 'quote' && <button style={{ fontSize: '.75rem', padding: '.2rem .5rem', border: '1px solid var(--greyL)', borderRadius: 'var(--r)', cursor: 'pointer', background: 'none' }}>→ Factura</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}