'use client'
import { useState } from 'react'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import pStyles from '../presupuestos/presupuestos.module.css'

type Status = 'draft'|'sent'|'paid'|'overdue'

const STATUS_LABEL: Record<Status,string> = { draft:'Borrador', sent:'Enviada', paid:'Pagada', overdue:'Vencida' }
const STATUS_COLOR: Record<Status,[string,string]> = {
  draft:   ['#ede9e1','#64748b'],
  sent:    ['#dbeafe','#1d4ed8'],
  paid:    ['#dcfce7','#166534'],
  overdue: ['#fee2e2','#991b1b'],
}

const INVOICES = [
  { id:'f1', wnum:'TRB-002', num:'FAC-2026-015', client:'Javier Romero', date:'15/04/2026', amount:822.8,  status:'paid'    as Status, fromQuote: true },
  { id:'f2', wnum:'TRB-004', num:'FAC-2026-016', client:'Pedro Alonso',  date:'20/04/2026', amount:4477.8, status:'paid'    as Status, fromQuote: false },
  { id:'f3', wnum:'TRB-006', num:'FAC-2026-017', client:'Ana Martín',    date:'23/04/2026', amount:380,    status:'sent'    as Status, fromQuote: false },
  { id:'f4', wnum:'TRB-007', num:'FAC-2026-018', client:'Rosa Moreno',   date:'10/04/2026', amount:950,    status:'overdue' as Status, fromQuote: false },
]

const ACCEPTED_QUOTES = [
  { id:'q2', num:'PRES-2026-002', client:'Bufete Martín', amount:3872 },
]

const fmt = (n:number) => n.toLocaleString('es-ES',{style:'currency',currency:'EUR',minimumFractionDigits:0,maximumFractionDigits:2})

interface Line { desc:string; detail:string; workers:number; price:number; tax:number; discount:number }
const emptyLine = ():Line => ({ desc:'', detail:'', workers:1, price:0, tax:21, discount:0 })

export default function Facturas() {
  const [showForm, setShowForm] = useState(false)
  const [isExt, setIsExt] = useState(false)
  const [fromQuote, setFromQuote] = useState(false)
  const [lines, setLines] = useState<Line[]>([emptyLine()])

  const updateLine = (i:number, key:keyof Line, val:string|number) =>
    setLines(ls => ls.map((l,idx) => idx===i ? {...l,[key]:val} : l))
  const addLine = () => setLines(ls => [...ls, emptyLine()])
  const removeLine = (i:number) => setLines(ls => ls.filter((_,idx) => idx!==i))

  const base  = lines.reduce((s,l) => s + l.workers*l.price*(1-l.discount/100), 0)
  const tax   = lines.reduce((s,l) => s + l.workers*l.price*(1-l.discount/100)*(l.tax/100), 0)
  const total = base + tax

  const cobrado = INVOICES.filter(f=>f.status==='paid').reduce((s,f)=>s+f.amount,0)
  const pendiente = INVOICES.filter(f=>f.status!=='paid').reduce((s,f)=>s+f.amount,0)

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/facturas" />
      <main className={styles.main}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Facturas</h1>
            <p className={styles.phSub}>
              Cobrado: <strong style={{color:'#166534'}}>{fmt(cobrado)}</strong>
              &nbsp;·&nbsp;Pendiente: <strong style={{color:'#dc2626'}}>{fmt(pendiente)}</strong>
            </p>
          </div>
          <button className={styles.btnDark} onClick={() => { setShowForm(true); setIsExt(false); setFromQuote(false); setLines([emptyLine()]); }}>
            + Nueva factura
          </button>
        </div>

        {/* FORMULARIO */}
        {showForm && (
          <div className={pStyles.formCard}>
            <div className={pStyles.formTopBar}>
              <div className={pStyles.formTitle}>🧾 Nueva factura</div>
              <div className={pStyles.extToggle}>
                {/* FROM QUOTE */}
                <label className={`${pStyles.extBtn} ${pStyles.extBtnAlt} ${fromQuote ? pStyles.extOn : ''}`}>
                  <input type="checkbox" checked={fromQuote} onChange={e => { setFromQuote(e.target.checked); setIsExt(false); }} style={{display:'none'}} />
                  📋 Desde presupuesto
                </label>
                {/* EXTERNAL */}
                <label className={`${pStyles.extBtn} ${isExt ? pStyles.extOn : ''}`}>
                  <input type="checkbox" checked={isExt} onChange={e => { setIsExt(e.target.checked); setFromQuote(false); }} style={{display:'none'}} />
                  🤝 Facturar para otro negocio
                </label>
                <button className={pStyles.closeBtn} onClick={() => setShowForm(false)}>×</button>
              </div>
            </div>

            {/* DESDE PRESUPUESTO */}
            {fromQuote && (
              <div className={pStyles.extBlock}>
                <div className={pStyles.extBlockTitle}>📋 Selecciona el presupuesto aceptado</div>
                {ACCEPTED_QUOTES.map(q => (
                  <div key={q.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'.75rem',background:'#fff',borderRadius:8,border:'1px solid #e2ddd4'}}>
                    <div>
                      <strong>{q.num}</strong>
                      <span style={{marginLeft:'.75rem',color:'#64748b',fontSize:'.84rem'}}>{q.client} · {fmt(q.amount)}</span>
                    </div>
                    <button className={styles.btnDark} style={{padding:'.38rem .75rem',fontSize:'.78rem'}}
                      onClick={() => setLines([{ desc:'Servicios según presupuesto '+q.num, detail:'', workers:1, price:q.amount/1.21, tax:21, discount:0 }])}>
                      Usar este →
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* DATOS EXTERNO */}
            {isExt && (
              <div className={pStyles.extBlock}>
                <div className={pStyles.extBlockTitle}>👤 Datos del negocio que emite la factura</div>
                <div className={pStyles.grid3}>
                  <div className={pStyles.field}><label>Nombre / empresa *</label><input placeholder="Ej: Reformas García SL" /></div>
                  <div className={pStyles.field}><label>NIF / CIF / NIE *</label><input placeholder="B12345678" /></div>
                  <div className={pStyles.field}><label>Email</label><input type="email" placeholder="contacto@empresa.com" /></div>
                  <div className={pStyles.field}><label>Dirección fiscal</label><input placeholder="C/ Ejemplo, 12, Madrid" /></div>
                  <div className={pStyles.field}><label>Teléfono</label><input type="tel" placeholder="+34 600 000 000" /></div>
                  <div className={pStyles.field}><label>IBAN</label><input placeholder="ES91 2100…" /></div>
                </div>
              </div>
            )}

            {/* CABECERA */}
            <div className={pStyles.docHead}>
              <div className={pStyles.field}><label>Nº de trabajo</label><input placeholder="TRB-008" /></div>
              <div className={pStyles.field}><label>Fecha</label><input type="date" defaultValue={new Date().toISOString().split('T')[0]} /></div>
              <div className={pStyles.field}><label>Estado</label>
                <select>
                  <option value="draft">Borrador</option>
                  <option value="sent">Enviada</option>
                  <option value="paid">Pagada ✓</option>
                  <option value="overdue">Vencida</option>
                </select>
              </div>
              <div className={pStyles.field}><label>Método de pago</label>
                <select>
                  <option>Transferencia</option>
                  <option>Tarjeta</option>
                  <option>Bizum</option>
                  <option>Efectivo</option>
                  <option>PayPal</option>
                  <option>Stripe</option>
                </select>
              </div>
            </div>

            {/* CLIENTE */}
            <div className={pStyles.clientBlock}>
              <div className={pStyles.blockTitle}>Cliente *</div>
              <select style={{width:'100%',padding:'.65rem .85rem',border:'1.5px solid #cbd5e1',borderRadius:8,fontSize:'.875rem',background:'#fff',fontFamily:'inherit'}}>
                <option>Selecciona un cliente del CRM…</option>
                <option>Carmen Ruiz · +34 611 222 333</option>
                <option>Javier Romero · +34 677 888 999</option>
                <option>Bufete Martín · +34 912 345 678</option>
                <option>Pedro Alonso · +34 622 111 222</option>
              </select>
            </div>

            {/* CONCEPTOS */}
            <div style={{marginBottom:'.5rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'.45rem'}}>
                <div className={pStyles.blockTitle}>Conceptos</div>
                <button className={pStyles.copyBtn} onClick={() => navigator.clipboard.writeText(
                  lines.map(l=>`${l.desc}\t${l.workers}\t${l.price}€`).join('\n')
                )}>⎘ Copiar tabla</button>
              </div>
              <div className={pStyles.linesHeader}>
                <span>Concepto *</span>
                <span>Descripción</span>
                <span style={{textAlign:'center'}}>Nº personas</span>
                <span style={{textAlign:'right'}}>P. unitario</span>
                <span style={{textAlign:'center'}}>IVA %</span>
                <span style={{textAlign:'center'}}>Dto %</span>
                <span style={{textAlign:'right'}}>Total línea</span>
                <span></span>
              </div>
              {lines.map((l,i) => {
                const lt = l.workers*l.price*(1-l.discount/100)*(1+l.tax/100)
                return (
                  <div key={i} className={pStyles.line}>
                    <input value={l.desc} onChange={e=>updateLine(i,'desc',e.target.value)} placeholder="Servicio o concepto" />
                    <input value={l.detail} onChange={e=>updateLine(i,'detail',e.target.value)} placeholder="Detalle…" />
                    <input type="number" value={l.workers} onChange={e=>updateLine(i,'workers',+e.target.value)} min={1} style={{textAlign:'center'}} />
                    <input type="number" value={l.price} onChange={e=>updateLine(i,'price',+e.target.value)} min={0} step={0.01} style={{textAlign:'right'}} />
                    <input type="number" value={l.tax} onChange={e=>updateLine(i,'tax',+e.target.value)} min={0} style={{textAlign:'center'}} />
                    <input type="number" value={l.discount} onChange={e=>updateLine(i,'discount',+e.target.value)} min={0} max={100} style={{textAlign:'center'}} />
                    <div className={pStyles.lineTot}>{fmt(lt)}</div>
                    <button className={pStyles.lineRemove} onClick={()=>removeLine(i)}>×</button>
                  </div>
                )
              })}
              <button className={pStyles.addLineBtn} onClick={addLine}>+ Añadir concepto</button>
            </div>

            {/* TOTALES */}
            <div className={pStyles.totalsRow}>
              <div className={pStyles.field} style={{flex:1,maxWidth:340}}>
                <label>Notas / condiciones</label>
                <textarea placeholder="Condiciones de pago, datos bancarios…" rows={3}
                  style={{width:'100%',padding:'.65rem .85rem',border:'1.5px solid #cbd5e1',borderRadius:8,fontSize:'.875rem',fontFamily:'inherit',resize:'vertical'}} />
              </div>
              <div className={pStyles.totalsBox}>
                <div className={pStyles.totRow}><span>Base imponible</span><strong>{fmt(base)}</strong></div>
                <div className={pStyles.totRow}><span>IVA total</span><strong>{fmt(tax)}</strong></div>
                <div className={`${pStyles.totRow} ${pStyles.totBig}`}><span>TOTAL</span><strong>{fmt(total)}</strong></div>
                <button className={pStyles.copyBtn} style={{alignSelf:'flex-end',marginTop:'.25rem'}}
                  onClick={() => navigator.clipboard.writeText(`Base: ${fmt(base)}\nIVA: ${fmt(tax)}\nTotal: ${fmt(total)}`)}>
                  ⎘ Copiar totales
                </button>
              </div>
            </div>

            <div className={pStyles.formFoot}>
              <button className={styles.btnGhost} onClick={() => setShowForm(false)}>Cancelar</button>
              <button className={pStyles.pdfBtn}>📄 Generar PDF</button>
              <button className={styles.btnDark} onClick={() => setShowForm(false)}>Guardar factura ✓</button>
            </div>
          </div>
        )}

        {/* LISTA FACTURAS */}
        <div className={styles.card} style={{padding:0}}>
          <table className={styles.tbl}>
            <thead>
              <tr><th>N.Trabajo</th><th>Número</th><th>Cliente</th><th>Fecha</th><th>Importe</th><th>Estado</th><th></th></tr>
            </thead>
            <tbody>
              {INVOICES.map(f => {
                const [bg,color] = STATUS_COLOR[f.status]
                return (
                  <tr key={f.id}>
                    <td style={{color:'#64748b',fontWeight:600}}>{f.wnum}</td>
                    <td>
                      <strong>{f.num}</strong>
                      {f.fromQuote && <span style={{marginLeft:'.4rem',fontSize:'.65rem',color:'#64748b',background:'#f1f5f9',padding:'.1rem .35rem',borderRadius:4}}>desde presupuesto</span>}
                    </td>
                    <td>{f.client}</td>
                    <td style={{color:'#64748b'}}>{f.date}</td>
                    <td><strong>{fmt(f.amount)}</strong></td>
                    <td>
                      <span style={{background:bg,color,padding:'.18rem .55rem',borderRadius:20,fontSize:'.66rem',fontWeight:700,textTransform:'uppercase',display:'inline-flex',alignItems:'center',gap:'.25rem'}}>
                        <span style={{width:5,height:5,borderRadius:'50%',background:color,display:'inline-block'}} />
                        {STATUS_LABEL[f.status]}
                      </span>
                    </td>
                    <td>
                      <div style={{display:'flex',gap:'.3rem',justifyContent:'flex-end'}}>
                        {f.status==='sent' && <button className={pStyles.acceptBtn} style={{fontSize:'.72rem',padding:'.2rem .55rem'}}>✓ Cobrada</button>}
                        <button className={pStyles.editBtn}>✎</button>
                        <button className={pStyles.pdfBtn} style={{padding:'.2rem .55rem',fontSize:'.72rem'}}>PDF</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
