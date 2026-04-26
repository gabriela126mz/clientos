'use client'

import { useState } from 'react'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import fStyles from './facturas.module.css'

type Status = 'draft' | 'sent' | 'paid' | 'overdue'

type Business = {
  name: string
  nif: string
  address: string
  city: string
  phone: string
  email: string
  iban: string
}

type Client = {
  name: string
  nif: string
  address: string
  city: string
  phone: string
  email: string
}

type Line = {
  concept: string
  detail: string
  units: number
  price: number
  tax: number
}

type Quote = {
  id: string
  num: string
  work: string
  client: Client
  lines: Line[]
}

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

const MY_BUSINESS: Business = {
  name: 'Jardinería Premium',
  nif: 'B12345678',
  address: 'Calle Gando 8',
  city: 'Madrid 28044, España',
  phone: '+34 641 297 239',
  email: 'info@jardineriapremium.com',
  iban: 'ES86 2100 4967 1222 0020 0523',
}

const EMPTY_CLIENT: Client = {
  name: '',
  nif: '',
  address: '',
  city: '',
  phone: '',
  email: '',
}

const QUOTES: Quote[] = [
  {
    id: 'q1',
    num: 'PRES-2026-002',
    work: 'TRB-002',
    client: {
      name: 'CONTACTGREEN SL',
      nif: 'B86678992',
      address: 'C/ Catamalo 39',
      city: 'Madrid 28015, Madrid',
      phone: '+34 600 123 456',
      email: 'contacto@contactgreen.es',
    },
    lines: [
      { concept: 'Poda de Oliva', detail: 'Poda de circunferencia con caída libre, diámetro aproximado de 5 metros.', units: 1, price: 60, tax: 21 },
      { concept: 'Poda de árbol rojo', detail: 'Poda en circunferencia, altura aproximada de 5 metros.', units: 1, price: 70, tax: 21 },
      { concept: 'Poda de Aligustre común', detail: 'Recorte y mantenimiento con corte a la altura indicada.', units: 1, price: 40, tax: 21 },
      { concept: 'Pequeño jardín de terraza', detail: 'Quitar mala hierba, tierra, plantas secas y bajar restos vegetales.', units: 1, price: 100, tax: 21 },
      { concept: 'Recogida de restos vegetales', detail: 'Limpieza y recogida de restos vegetales fuera de la casa.', units: 1, price: 30, tax: 21 },
    ],
  },
  {
    id: 'q2',
    num: 'PRES-2026-005',
    work: 'TRB-005',
    client: {
      name: 'Carmen Ruiz',
      nif: '12345678A',
      address: 'C/ Alcalá 45',
      city: 'Madrid 28014, Madrid',
      phone: '+34 611 222 333',
      email: 'carmen@email.com',
    },
    lines: [
      { concept: 'Mantenimiento mensual', detail: 'Mantenimiento completo de jardín y revisión de riego.', units: 1, price: 320, tax: 21 },
      { concept: 'Abono y limpieza fina', detail: 'Aplicación de abono y limpieza general de zonas verdes.', units: 1, price: 95, tax: 21 },
    ],
  },
]

const INVOICES = [
  { id: 'f1', work: 'TRB-002', num: 'F260001', client: 'CONTACTGREEN SL', date: '07/04/2026', amount: 363, status: 'paid' as Status },
  { id: 'f2', work: 'TRB-005', num: 'F260002', client: 'Carmen Ruiz', date: '12/04/2026', amount: 502.15, status: 'sent' as Status },
]

const emptyLine = (): Line => ({
  concept: '',
  detail: '',
  units: 1,
  price: 0,
  tax: 21,
})

const fmt = (n: number) =>
  n.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export default function Facturas() {
  const today = new Date().toISOString().split('T')[0]

  const [showForm, setShowForm] = useState(false)
  const [showExternalModal, setShowExternalModal] = useState(false)

  const [issuer, setIssuer] = useState<Business>(MY_BUSINESS)
  const [client, setClient] = useState<Client>(EMPTY_CLIENT)
  const [lines, setLines] = useState<Line[]>([emptyLine()])

  const [invoiceNumber, setInvoiceNumber] = useState('F260003')
  const [invoiceDate, setInvoiceDate] = useState(today)
  const [workNumber, setWorkNumber] = useState('TRB-008')
  const [status, setStatus] = useState<Status>('draft')
  const [notes, setNotes] = useState('El precio total del servicio se realizará al finalizar el trabajo')

  const base = lines.reduce((s, l) => s + l.units * l.price, 0)
  const tax = lines.reduce((s, l) => s + l.units * l.price * (l.tax / 100), 0)
  const total = base + tax

  const cobrado = INVOICES.filter(f => f.status === 'paid').reduce((s, f) => s + f.amount, 0)
  const pendiente = INVOICES.filter(f => f.status !== 'paid').reduce((s, f) => s + f.amount, 0)

  const openNewInvoice = () => {
    setShowForm(true)
    setIssuer(MY_BUSINESS)
    setClient(EMPTY_CLIENT)
    setLines([emptyLine()])
    setStatus('draft')
  }

  const useQuote = (quote: Quote) => {
    setClient(quote.client)
    setWorkNumber(quote.work)
    setLines(quote.lines)
    alert('Presupuesto recuperado y cargado en la factura ✅')
  }

  const updateLine = (i: number, key: keyof Line, value: string | number) => {
    setLines(prev => prev.map((line, idx) => (idx === i ? { ...line, [key]: value } : line)))
  }

  const addLine = () => setLines(prev => [...prev, emptyLine()])
  const removeLine = (i: number) => setLines(prev => prev.filter((_, idx) => idx !== i))

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
          <div className={fStyles.formCard}>
            <div className={fStyles.formHead}>
              <div>
                <h2>Nueva factura</h2>
                <p>Recupera un presupuesto o crea una factura rápida.</p>
              </div>

              <div className={fStyles.headActions}>
                <button className={fStyles.secondaryBtn} onClick={() => setShowExternalModal(true)}>
                  Emisor externo
                </button>

                <button className={fStyles.closeBtn} onClick={() => setShowForm(false)}>
                  ×
                </button>
              </div>
            </div>

            <section className={fStyles.recoverBox}>
              <div>
                <strong>Recuperar presupuesto</strong>
                <p>Selecciona un presupuesto aceptado y se rellenan cliente, trabajo y líneas.</p>
              </div>

              <div className={fStyles.quoteList}>
                {QUOTES.map(q => (
                  <button key={q.id} onClick={() => useQuote(q)}>
                    <span>{q.num}</span>
                    <small>{q.client.name}</small>
                  </button>
                ))}
              </div>
            </section>

            <div className={fStyles.twoCards}>
              <section className={fStyles.miniCard}>
                <div className={fStyles.cardLabel}>Emisor</div>
                <strong>{issuer.name}</strong>
                <p>{issuer.nif}</p>
                <p>{issuer.address}</p>
                <p>{issuer.city}</p>
                <p>{issuer.phone}</p>
                <p>{issuer.email}</p>
              </section>

              <section className={fStyles.miniCard}>
                <div className={fStyles.cardLabel}>Cliente</div>
                <strong>{client.name || 'Sin cliente'}</strong>
                <p>{client.nif || 'NIF / CIF pendiente'}</p>
                <p>{client.address || 'Dirección pendiente'}</p>
                <p>{client.city || 'Ciudad pendiente'}</p>
                <p>{client.phone || 'Teléfono pendiente'}</p>
                <p>{client.email || 'Email pendiente'}</p>
              </section>
            </div>

            <section className={fStyles.block}>
              <div className={fStyles.blockTitle}>Datos de factura</div>

              <div className={fStyles.grid4}>
                <div className={fStyles.field}>
                  <label>Número factura</label>
                  <input value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
                </div>

                <div className={fStyles.field}>
                  <label>Fecha</label>
                  <input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
                </div>

                <div className={fStyles.field}>
                  <label>Nº trabajo</label>
                  <input value={workNumber} onChange={e => setWorkNumber(e.target.value)} />
                </div>

                <div className={fStyles.field}>
                  <label>Estado</label>
                  <select value={status} onChange={e => setStatus(e.target.value as Status)}>
                    <option value="draft">Borrador</option>
                    <option value="sent">Enviada</option>
                    <option value="paid">Pagada</option>
                    <option value="overdue">Vencida</option>
                  </select>
                </div>
              </div>
            </section>

            <section className={fStyles.block}>
              <div className={fStyles.blockTitle}>Editar cliente</div>

              <div className={fStyles.grid3}>
                <div className={fStyles.field}>
                  <label>Nombre cliente</label>
                  <input value={client.name} onChange={e => setClient({ ...client, name: e.target.value })} />
                </div>

                <div className={fStyles.field}>
                  <label>NIF / CIF</label>
                  <input value={client.nif} onChange={e => setClient({ ...client, nif: e.target.value })} />
                </div>

                <div className={fStyles.field}>
                  <label>Teléfono</label>
                  <input value={client.phone} onChange={e => setClient({ ...client, phone: e.target.value })} />
                </div>

                <div className={fStyles.field}>
                  <label>Dirección</label>
                  <input value={client.address} onChange={e => setClient({ ...client, address: e.target.value })} />
                </div>

                <div className={fStyles.field}>
                  <label>Ciudad</label>
                  <input value={client.city} onChange={e => setClient({ ...client, city: e.target.value })} />
                </div>

                <div className={fStyles.field}>
                  <label>Email</label>
                  <input value={client.email} onChange={e => setClient({ ...client, email: e.target.value })} />
                </div>
              </div>
            </section>

            <section className={fStyles.block}>
              <div className={fStyles.blockRow}>
                <div className={fStyles.blockTitle}>Conceptos</div>
                <button className={fStyles.secondaryBtn} onClick={addLine}>+ Añadir línea</button>
              </div>

              <div className={fStyles.linesHeader}>
                <span>Concepto</span>
                <span>Detalle</span>
                <span>Precio</span>
                <span>Unid.</span>
                <span>IVA</span>
                <span>Total</span>
                <span></span>
              </div>

              {lines.map((line, i) => {
                const lineBase = line.units * line.price
                const lineTotal = lineBase * (1 + line.tax / 100)

                return (
                  <div key={i} className={fStyles.line}>
                    <input value={line.concept} onChange={e => updateLine(i, 'concept', e.target.value)} placeholder="Poda de olivo" />
                    <input value={line.detail} onChange={e => updateLine(i, 'detail', e.target.value)} placeholder="Descripción breve del servicio" />
                    <input type="number" value={line.price} onChange={e => updateLine(i, 'price', +e.target.value)} />
                    <input type="number" value={line.units} onChange={e => updateLine(i, 'units', +e.target.value)} />
                    <input type="number" value={line.tax} onChange={e => updateLine(i, 'tax', +e.target.value)} />
                    <strong>{fmt(lineTotal)}</strong>
                    <button onClick={() => removeLine(i)}>×</button>
                  </div>
                )
              })}
            </section>

            <section className={fStyles.bottomGrid}>
              <div className={fStyles.field}>
                <label>Condiciones de pago</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} />
              </div>

              <div className={fStyles.totalBox}>
                <div><span>Base imponible</span><strong>{fmt(base)}</strong></div>
                <div><span>IVA</span><strong>{fmt(tax)}</strong></div>
                <div className={fStyles.totalBig}><span>Total</span><strong>{fmt(total)}</strong></div>
              </div>
            </section>

            <div className={fStyles.formFoot}>
              <button className={styles.btnGhost} onClick={() => setShowForm(false)}>Cancelar</button>
              <button className={fStyles.pdfBtn}>Generar PDF</button>
              <button className={styles.btnDark} onClick={() => setShowForm(false)}>Guardar factura</button>
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
                    <td style={{ color: '#64748b', fontWeight: 600 }}>{f.work}</td>
                    <td><strong>{f.num}</strong></td>
                    <td>{f.client}</td>
                    <td style={{ color: '#64748b' }}>{f.date}</td>
                    <td><strong>{fmt(f.amount)}</strong></td>
                    <td>
                      <span style={{ background: bg, color, padding: '.18rem .55rem', borderRadius: 20, fontSize: '.66rem', fontWeight: 700, textTransform: 'uppercase' }}>
                        {STATUS_LABEL[f.status]}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '.3rem', justifyContent: 'flex-end' }}>
                        {f.status === 'sent' && <button className={fStyles.smallBtn}>✓ Cobrada</button>}
                        <button className={fStyles.smallBtn}>PDF</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {showExternalModal && (
          <div className={fStyles.modalOverlay}>
            <div className={fStyles.modalBox}>
              <div className={fStyles.modalHead}>
                <div>
                  <h2>Factura para otro emprendedor</h2>
                  <p>Rellena el nuevo emisor y su cliente. Luego se carga en la factura.</p>
                </div>
                <button onClick={() => setShowExternalModal(false)}>×</button>
              </div>

              <div className={fStyles.modalSectionTitle}>Nuevo emprendedor / emisor</div>

              <div className={fStyles.grid3}>
                <div className={fStyles.field}><label>Nombre empresa</label><input value={issuer.name} onChange={e => setIssuer({ ...issuer, name: e.target.value })} /></div>
                <div className={fStyles.field}><label>NIF / CIF</label><input value={issuer.nif} onChange={e => setIssuer({ ...issuer, nif: e.target.value })} /></div>
                <div className={fStyles.field}><label>Teléfono</label><input value={issuer.phone} onChange={e => setIssuer({ ...issuer, phone: e.target.value })} /></div>
                <div className={fStyles.field}><label>Email</label><input value={issuer.email} onChange={e => setIssuer({ ...issuer, email: e.target.value })} /></div>
                <div className={fStyles.field}><label>Dirección</label><input value={issuer.address} onChange={e => setIssuer({ ...issuer, address: e.target.value })} /></div>
                <div className={fStyles.field}><label>Ciudad</label><input value={issuer.city} onChange={e => setIssuer({ ...issuer, city: e.target.value })} /></div>
                <div className={fStyles.field}><label>IBAN</label><input value={issuer.iban} onChange={e => setIssuer({ ...issuer, iban: e.target.value })} /></div>
              </div>

              <div className={fStyles.modalSectionTitle}>Nuevo cliente del emprendedor</div>

              <div className={fStyles.grid3}>
                <div className={fStyles.field}><label>Nombre cliente</label><input value={client.name} onChange={e => setClient({ ...client, name: e.target.value })} /></div>
                <div className={fStyles.field}><label>NIF / CIF</label><input value={client.nif} onChange={e => setClient({ ...client, nif: e.target.value })} /></div>
                <div className={fStyles.field}><label>Teléfono</label><input value={client.phone} onChange={e => setClient({ ...client, phone: e.target.value })} /></div>
                <div className={fStyles.field}><label>Email</label><input value={client.email} onChange={e => setClient({ ...client, email: e.target.value })} /></div>
                <div className={fStyles.field}><label>Dirección</label><input value={client.address} onChange={e => setClient({ ...client, address: e.target.value })} /></div>
                <div className={fStyles.field}><label>Ciudad</label><input value={client.city} onChange={e => setClient({ ...client, city: e.target.value })} /></div>
              </div>

              <div className={fStyles.formFoot}>
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