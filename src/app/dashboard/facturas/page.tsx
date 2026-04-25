'use client'

import { useState } from 'react'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import pStyles from '../presupuestos/presupuestos.module.css'

type Status = 'draft' | 'sent' | 'paid' | 'overdue'

const STATUS_LABEL: Record<Status, string> = {
  draft: 'Borrador',
  sent: 'Enviada',
  paid: 'Pagada',
  overdue: 'Vencida',
}

const STATUS_COLOR: Record<Status, [string, string]> = {
  draft: ['#ede9e1', '#64748b'],
  sent: ['#dbeafe', '#1d4ed8'],
  paid: ['#dcfce7', '#166534'],
  overdue: ['#fee2e2', '#991b1b'],
}

const CURRENT_BUSINESS = {
  name: 'Jardines Mediterráneos SL',
  nif: 'B12345678',
  address: 'C/ Olivos 12, Madrid',
  city: '28001 - Madrid',
  phone: '+34 600 123 456',
  email: 'hola@jardinesmediterraneos.es',
  iban: 'ES91 2100 0000 0000 0000',
}

const CRM_CLIENTS = [
  {
    name: 'Carmen Ruiz',
    nif: '12345678A',
    address: 'C/ Alcalá 45',
    city: '28014 - Madrid',
    province: 'Madrid',
    email: 'carmen@ejemplo.com',
    phone: '+34 611 222 333',
  },
  {
    name: 'Bufete Martín',
    nif: 'B87654321',
    address: 'P.º Castellana 100',
    city: '28046 - Madrid',
    province: 'Madrid',
    email: 'admin@bufete.es',
    phone: '+34 912 345 678',
  },
  {
    name: 'Pedro Alonso',
    nif: '23456789B',
    address: 'C/ Mayor 18',
    city: '28013 - Madrid',
    province: 'Madrid',
    email: 'pedro@email.com',
    phone: '+34 622 111 222',
  },
]

const EXTERNAL_BUSINESSES = [
  {
    name: 'Reformas García SL',
    nif: 'B55555555',
    address: 'C/ Ejemplo 12',
    city: '28020 - Madrid',
    phone: '+34 600 000 000',
    email: 'contacto@reformasgarcia.com',
    iban: 'ES91 2100 1111 2222 3333',
  },
]

const EXTERNAL_CLIENTS = [
  {
    name: 'Ana Martín',
    nif: '45678912C',
    address: 'C/ Gando 8',
    city: '28044 - Madrid',
    province: 'Madrid',
    email: 'ana@email.com',
    phone: '+34 699 111 222',
  },
]

const ACCEPTED_QUOTES = [
  {
    id: 'q1',
    num: 'PRES-2026-002',
    workNumber: 'TRB-002',
    client: CRM_CLIENTS[1],
    amount: 3872,
    lines: [
      { ref: 'SERV-001', desc: 'Mantenimiento mensual jardín terraza', units: 1, price: 3200, discount: 0, tax: 21 },
    ],
  },
  {
    id: 'q2',
    num: 'PRES-2026-005',
    workNumber: 'TRB-009',
    client: CRM_CLIENTS[0],
    amount: 689.7,
    lines: [
      { ref: 'JAR-001', desc: 'Visita técnica y poda de olivo', units: 1, price: 570, discount: 0, tax: 21 },
    ],
  },
]

const INVOICES = [
  { id: 'f1', wnum: 'TRB-002', num: 'FAC-2026-015', client: 'Javier Romero', date: '15/04/2026', amount: 822.8, status: 'paid' as Status, fromQuote: true },
  { id: 'f2', wnum: 'TRB-004', num: 'FAC-2026-016', client: 'Pedro Alonso', date: '20/04/2026', amount: 4477.8, status: 'paid' as Status, fromQuote: false },
  { id: 'f3', wnum: 'TRB-006', num: 'FAC-2026-017', client: 'Ana Martín', date: '23/04/2026', amount: 380, status: 'sent' as Status, fromQuote: false },
]

const fmt = (n: number) =>
  n.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

interface Line {
  ref: string
  desc: string
  units: number
  price: number
  discount: number
  tax: number
}

const emptyLine = (): Line => ({
  ref: '',
  desc: '',
  units: 1,
  price: 0,
  discount: 0,
  tax: 21,
})

export default function Facturas() {
  const [showForm, setShowForm] = useState(false)
  const [showExternalModal, setShowExternalModal] = useState(false)

  const [invoiceMode, setInvoiceMode] = useState<'own' | 'external'>('own')
  const [fromQuote, setFromQuote] = useState(false)

  const [issuer, setIssuer] = useState(CURRENT_BUSINESS)
  const [client, setClient] = useState(CRM_CLIENTS[0])
  const [lines, setLines] = useState<Line[]>([emptyLine()])

  const [invoice, setInvoice] = useState({
    number: 'FAC-2026-019',
    workNumber: 'TRB-008',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    status: 'draft' as Status,
    paymentMethod: 'Transferencia',
    observations: '',
  })

  const updateLine = (i: number, key: keyof Line, val: string | number) => {
    setLines(ls => ls.map((l, idx) => idx === i ? { ...l, [key]: val } : l))
  }

  const addLine = () => setLines(ls => [...ls, emptyLine()])
  const removeLine = (i: number) => setLines(ls => ls.filter((_, idx) => idx !== i))

  const base = lines.reduce((s, l) => s + l.units * l.price * (1 - l.discount / 100), 0)
  const discountTotal = lines.reduce((s, l) => s + l.units * l.price * (l.discount / 100), 0)
  const tax = lines.reduce((s, l) => s + l.units * l.price * (1 - l.discount / 100) * (l.tax / 100), 0)
  const total = base + tax

  const cobrado = INVOICES.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0)
  const pendiente = INVOICES.filter(f => f.status !== 'paid').reduce((s, f) => s + f.amount, 0)

  const openNewInvoice = () => {
    setShowForm(true)
    setInvoiceMode('own')
    setFromQuote(false)
    setIssuer(CURRENT_BUSINESS)
    setClient(CRM_CLIENTS[0])
    setLines([emptyLine()])
  }

  const useQuote = (quote: any) => {
    setFromQuote(true)
    setInvoice(prev => ({
      ...prev,
      workNumber: quote.workNumber,
    }))
    setClient(quote.client)
    setLines(quote.lines)
    alert('Presupuesto cargado en la factura ✅')
  }

  const activateExternalMode = () => {
    setInvoiceMode('external')
    setFromQuote(false)
    setShowExternalModal(true)
  }

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/facturas" />

      <main className={styles.main}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Facturas</h1>
            <p className={styles.phSub}>
              Cobrado: <strong style={{ color: '#166534' }}>{fmt(cobrado)}</strong>
              &nbsp;·&nbsp;Pendiente: <strong style={{ color: '#dc2626' }}>{fmt(pendiente)}</strong>
            </p>
          </div>

          <button className={styles.btnDark} onClick={openNewInvoice}>
            + Nueva factura
          </button>
        </div>

        {showForm && (
          <div className={pStyles.formCard}>
            <div className={pStyles.formTopBar}>
              <div className={pStyles.formTitle}>🧾 Nueva factura</div>

              <div className={pStyles.extToggle}>
                <button
                  type="button"
                  className={`${pStyles.extBtn} ${fromQuote ? pStyles.extOn : ''}`}
                  onClick={() => setFromQuote(!fromQuote)}
                >
                  📋 Desde presupuesto
                </button>

                <button
                  type="button"
                  className={`${pStyles.extBtn} ${invoiceMode === 'external' ? pStyles.extOn : ''}`}
                  onClick={activateExternalMode}
                >
                  🤝 Facturar para otro negocio
                </button>

                <button className={pStyles.closeBtn} onClick={() => setShowForm(false)}>
                  ×
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ border: '1px solid #e2ddd4', borderRadius: 12, padding: '1rem', background: '#fff' }}>
                <div className={pStyles.blockTitle}>
                  {invoiceMode === 'external' ? 'Negocio emisor externo' : 'Emisor actual'}
                </div>
                <strong>{issuer.name}</strong>
                <p style={{ margin: '.35rem 0', color: '#64748b', fontSize: '.82rem' }}>{issuer.nif}</p>
                <p style={{ margin: '.35rem 0', color: '#64748b', fontSize: '.82rem' }}>{issuer.address}</p>
                <p style={{ margin: '.35rem 0', color: '#64748b', fontSize: '.82rem' }}>{issuer.email}</p>
                <button className={pStyles.addLineBtn} onClick={() => setShowExternalModal(true)}>
                  {invoiceMode === 'external' ? 'Editar emisor externo' : 'Editar datos del emisor'}
                </button>
              </div>

              <div style={{ border: '1px solid #e2ddd4', borderRadius: 12, padding: '1rem', background: '#fff' }}>
                <div className={pStyles.blockTitle}>
                  {invoiceMode === 'external' ? 'Cliente externo' : 'Cliente'}
                </div>
                <strong>{client.name || 'Sin cliente seleccionado'}</strong>
                <p style={{ margin: '.35rem 0', color: '#64748b', fontSize: '.82rem' }}>{client.nif || 'Sin NIF'}</p>
                <p style={{ margin: '.35rem 0', color: '#64748b', fontSize: '.82rem' }}>{client.address || 'Sin dirección'}</p>
                <p style={{ margin: '.35rem 0', color: '#64748b', fontSize: '.82rem' }}>{client.email || 'Sin email'}</p>
                <button className={pStyles.addLineBtn} onClick={() => setShowExternalModal(true)}>
                  {invoiceMode === 'external' ? 'Editar cliente externo' : 'Cambiar cliente'}
                </button>
              </div>
            </div>

            {fromQuote && (
              <div className={pStyles.extBlock}>
                <div className={pStyles.extBlockTitle}>📋 Presupuestos aceptados disponibles</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
                  {ACCEPTED_QUOTES.map(q => (
                    <div
                      key={q.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        alignItems: 'center',
                        padding: '.75rem',
                        border: '1px solid #e2ddd4',
                        borderRadius: 10,
                        background: '#fff',
                      }}
                    >
                      <div>
                        <strong>{q.num}</strong>
                        <span style={{ marginLeft: '.75rem', color: '#64748b', fontSize: '.84rem' }}>
                          {q.client.name} · {fmt(q.amount)}
                        </span>
                      </div>

                      <button
                        className={styles.btnDark}
                        style={{ padding: '.4rem .8rem', fontSize: '.78rem' }}
                        onClick={() => useQuote(q)}
                      >
                        Usar presupuesto →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={pStyles.docHead}>
              <div className={pStyles.field}>
                <label>Nº factura</label>
                <input value={invoice.number} onChange={e => setInvoice({ ...invoice, number: e.target.value })} />
              </div>

              <div className={pStyles.field}>
                <label>Nº trabajo</label>
                <input value={invoice.workNumber} onChange={e => setInvoice({ ...invoice, workNumber: e.target.value })} />
              </div>

              <div className={pStyles.field}>
                <label>Fecha factura</label>
                <input type="date" value={invoice.date} onChange={e => setInvoice({ ...invoice, date: e.target.value })} />
              </div>

              <div className={pStyles.field}>
                <label>Fecha vencimiento</label>
                <input type="date" value={invoice.dueDate} onChange={e => setInvoice({ ...invoice, dueDate: e.target.value })} />
              </div>

              <div className={pStyles.field}>
                <label>Estado</label>
                <select value={invoice.status} onChange={e => setInvoice({ ...invoice, status: e.target.value as Status })}>
                  <option value="draft">Borrador</option>
                  <option value="sent">Enviada</option>
                  <option value="paid">Pagada ✓</option>
                  <option value="overdue">Vencida</option>
                </select>
              </div>

              <div className={pStyles.field}>
                <label>Forma de pago</label>
                <select value={invoice.paymentMethod} onChange={e => setInvoice({ ...invoice, paymentMethod: e.target.value })}>
                  <option>Transferencia</option>
                  <option>Contado</option>
                  <option>Efectivo</option>
                  <option>Tarjeta</option>
                  <option>Bizum</option>
                  <option>Stripe</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.45rem' }}>
                <div className={pStyles.blockTitle}>Líneas de factura</div>
                <button
                  className={pStyles.copyBtn}
                  onClick={() => navigator.clipboard.writeText(lines.map(l => `${l.ref}\t${l.desc}\t${l.units}\t${l.price}€`).join('\n'))}
                >
                  ⎘ Copiar tabla
                </button>
              </div>

              <div className={pStyles.linesHeader} style={{ gridTemplateColumns: '110px 2fr 80px 100px 80px 70px 110px 30px' }}>
                <span>Referencia</span>
                <span>Descripción</span>
                <span style={{ textAlign: 'center' }}>Und.</span>
                <span style={{ textAlign: 'right' }}>Precio</span>
                <span style={{ textAlign: 'center' }}>Desc.</span>
                <span style={{ textAlign: 'center' }}>IVA</span>
                <span style={{ textAlign: 'right' }}>Importe</span>
                <span></span>
              </div>

              {lines.map((l, i) => {
                const lineBase = l.units * l.price * (1 - l.discount / 100)
                const lineTotal = lineBase * (1 + l.tax / 100)

                return (
                  <div key={i} className={pStyles.line} style={{ gridTemplateColumns: '110px 2fr 80px 100px 80px 70px 110px 30px' }}>
                    <input value={l.ref} onChange={e => updateLine(i, 'ref', e.target.value)} placeholder="7031120" />
                    <input value={l.desc} onChange={e => updateLine(i, 'desc', e.target.value)} placeholder="Descripción producto/servicio" />
                    <input type="number" value={l.units} onChange={e => updateLine(i, 'units', +e.target.value)} min={1} style={{ textAlign: 'center' }} />
                    <input type="number" value={l.price} onChange={e => updateLine(i, 'price', +e.target.value)} min={0} step={0.01} style={{ textAlign: 'right' }} />
                    <input type="number" value={l.discount} onChange={e => updateLine(i, 'discount', +e.target.value)} min={0} max={100} style={{ textAlign: 'center' }} />
                    <input type="number" value={l.tax} onChange={e => updateLine(i, 'tax', +e.target.value)} min={0} style={{ textAlign: 'center' }} />
                    <div className={pStyles.lineTot}>{fmt(lineTotal)}</div>
                    <button className={pStyles.lineRemove} onClick={() => removeLine(i)}>×</button>
                  </div>
                )
              })}

              <button className={pStyles.addLineBtn} onClick={addLine}>
                + Añadir línea
              </button>
            </div>

            <div className={pStyles.totalsRow}>
              <div className={pStyles.field} style={{ flex: 1, maxWidth: 420 }}>
                <label>Observaciones</label>
                <textarea
                  value={invoice.observations}
                  onChange={e => setInvoice({ ...invoice, observations: e.target.value })}
                  placeholder="Observaciones, datos bancarios, condiciones de pago…"
                  rows={4}
                />
              </div>

              <div className={pStyles.totalsBox}>
                <div className={pStyles.totRow}><span>Subtotal</span><strong>{fmt(base + discountTotal)}</strong></div>
                <div className={pStyles.totRow}><span>Descuentos</span><strong>{fmt(discountTotal)}</strong></div>
                <div className={pStyles.totRow}><span>Base imponible</span><strong>{fmt(base)}</strong></div>
                <div className={pStyles.totRow}><span>Impuestos</span><strong>{fmt(tax)}</strong></div>
                <div className={`${pStyles.totRow} ${pStyles.totBig}`}><span>Importe total</span><strong>{fmt(total)}</strong></div>
                <div className={pStyles.totRow}><span>Forma de pago</span><strong>{invoice.paymentMethod}</strong></div>
              </div>
            </div>

            <div className={pStyles.formFoot}>
              <button className={styles.btnGhost} onClick={() => setShowForm(false)}>Cancelar</button>
              <button className={pStyles.pdfBtn}>📄 Generar PDF</button>
              <button className={styles.btnDark} onClick={() => setShowForm(false)}>Guardar factura ✓</button>
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
              {INVOICES.map(f => {
                const [bg, color] = STATUS_COLOR[f.status]

                return (
                  <tr key={f.id}>
                    <td style={{ color: '#64748b', fontWeight: 600 }}>{f.wnum}</td>
                    <td>
                      <strong>{f.num}</strong>
                      {f.fromQuote && (
                        <span style={{ marginLeft: '.4rem', fontSize: '.65rem', color: '#64748b', background: '#f1f5f9', padding: '.1rem .35rem', borderRadius: 4 }}>
                          desde presupuesto
                        </span>
                      )}
                    </td>
                    <td>{f.client}</td>
                    <td style={{ color: '#64748b' }}>{f.date}</td>
                    <td><strong>{fmt(f.amount)}</strong></td>
                    <td>
                      <span style={{ background: bg, color, padding: '.18rem .55rem', borderRadius: 20, fontSize: '.66rem', fontWeight: 700, textTransform: 'uppercase', display: 'inline-flex', alignItems: 'center', gap: '.25rem' }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block' }} />
                        {STATUS_LABEL[f.status]}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '.3rem', justifyContent: 'flex-end' }}>
                        {f.status === 'sent' && <button className={pStyles.acceptBtn} style={{ fontSize: '.72rem', padding: '.2rem .55rem' }}>✓ Cobrada</button>}
                        <button className={pStyles.editBtn}>✎</button>
                        <button className={pStyles.pdfBtn} style={{ padding: '.2rem .55rem', fontSize: '.72rem' }}>PDF</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {showExternalModal && (
          <div className={pStyles.modalOverlay}>
            <div className={pStyles.modalBox}>
              <div className={pStyles.modalHead}>
                <div>
                  <h2>{invoiceMode === 'external' ? 'Facturar para otro negocio' : 'Datos de factura'}</h2>
                  <p>Selecciona o crea el emisor y el cliente. Luego se cargan en la factura.</p>
                </div>

                <button className={pStyles.closeBtn} onClick={() => setShowExternalModal(false)}>×</button>
              </div>

              <div className={pStyles.modalSectionTitle}>Emisor</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginBottom: '1rem' }}>
                <button
                  className={pStyles.extBtn}
                  onClick={() => {
                    setIssuer(CURRENT_BUSINESS)
                    setInvoiceMode('own')
                  }}
                >
                  Usar mi negocio actual
                </button>

                {EXTERNAL_BUSINESSES.map(b => (
                  <button
                    key={b.name}
                    className={pStyles.extBtn}
                    onClick={() => {
                      setIssuer(b)
                      setInvoiceMode('external')
                    }}
                  >
                    Usar {b.name}
                  </button>
                ))}
              </div>

              <div className={pStyles.grid3}>
                <div className={pStyles.field}><label>Nombre empresa</label><input value={issuer.name} onChange={e => setIssuer({ ...issuer, name: e.target.value })} /></div>
                <div className={pStyles.field}><label>NIF / CIF</label><input value={issuer.nif} onChange={e => setIssuer({ ...issuer, nif: e.target.value })} /></div>
                <div className={pStyles.field}><label>Email</label><input value={issuer.email} onChange={e => setIssuer({ ...issuer, email: e.target.value })} /></div>
                <div className={pStyles.field}><label>Dirección</label><input value={issuer.address} onChange={e => setIssuer({ ...issuer, address: e.target.value })} /></div>
                <div className={pStyles.field}><label>CP / ciudad</label><input value={issuer.city} onChange={e => setIssuer({ ...issuer, city: e.target.value })} /></div>
                <div className={pStyles.field}><label>Teléfono</label><input value={issuer.phone} onChange={e => setIssuer({ ...issuer, phone: e.target.value })} /></div>
                <div className={pStyles.field}><label>IBAN</label><input value={issuer.iban} onChange={e => setIssuer({ ...issuer, iban: e.target.value })} /></div>
              </div>

              <div className={pStyles.modalSectionTitle}>Cliente</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.75rem', marginBottom: '1rem' }}>
                {CRM_CLIENTS.map(c => (
                  <button key={c.name} className={pStyles.extBtn} onClick={() => setClient(c)}>
                    CRM: {c.name}
                  </button>
                ))}

                {EXTERNAL_CLIENTS.map(c => (
                  <button key={c.name} className={pStyles.extBtn} onClick={() => setClient(c)}>
                    Externo: {c.name}
                  </button>
                ))}
              </div>

              <div className={pStyles.grid3}>
                <div className={pStyles.field}><label>Nombre cliente</label><input value={client.name} onChange={e => setClient({ ...client, name: e.target.value })} /></div>
                <div className={pStyles.field}><label>NIF / CIF</label><input value={client.nif} onChange={e => setClient({ ...client, nif: e.target.value })} /></div>
                <div className={pStyles.field}><label>Email</label><input value={client.email} onChange={e => setClient({ ...client, email: e.target.value })} /></div>
                <div className={pStyles.field}><label>Dirección</label><input value={client.address} onChange={e => setClient({ ...client, address: e.target.value })} /></div>
                <div className={pStyles.field}><label>CP / ciudad</label><input value={client.city} onChange={e => setClient({ ...client, city: e.target.value })} /></div>
                <div className={pStyles.field}><label>Provincia</label><input value={client.province} onChange={e => setClient({ ...client, province: e.target.value })} /></div>
                <div className={pStyles.field}><label>Teléfono</label><input value={client.phone} onChange={e => setClient({ ...client, phone: e.target.value })} /></div>
              </div>

              <div className={pStyles.formFoot}>
                <button className={styles.btnGhost} onClick={() => setShowExternalModal(false)}>Cancelar</button>
                <button className={styles.btnDark} onClick={() => { setShowExternalModal(false); alert('Datos cargados en la factura ✅') }}>
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