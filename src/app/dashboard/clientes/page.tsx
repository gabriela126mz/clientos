'use client'
import { useState } from 'react'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import cStyles from './clientes.module.css'

const CLIENTES = Array.from({ length: 50 }, (_, i) => ({
  id: `c${i + 1}`,
  name: ['Carmen Ruiz','Javier Romero','María García','Pedro Alonso','Lucía Navarro','Antonio López','Sofía Pérez','Carlos Díaz','Ana Martín','Roberto Sánchez'][i % 10],
  tel: `+34 6${String(i).padStart(2,'0')} ${String(i*3).padStart(3,'0')} ${String(i*7).padStart(3,'0')}`,
  email: `cliente${i+1}@email.com`,
  notes: ['Jardín 300m² con olivo.','Sistema de riego 2025.','Terraza en Madrid centro.','Piscina + jardín.','Mantenimiento mensual.','','','','',''][i % 10],
  estado: ['nuevo','nuevo','contactado','cita','completado','contactado','nuevo','completado','cita','contactado'][i % 10],
  created: `${String(Math.floor(Math.random()*28)+1).padStart(2,'0')}/${String(Math.floor(Math.random()*12)+1).padStart(2,'0')}/2026`,
  nextVisit: i % 3 === 0 ? `${28 + (i % 5)}/04/2026 · 10:00` : null,
}))

const EL: Record<string,string> = { nuevo:'Nuevo', contactado:'Contactado', cita:'Cita agendada', completado:'Completado' }
const ESTADO_COLORS: Record<string,string> = {
  nuevo: '#dbeafe|#1d4ed8',
  contactado: '#ffedd5|#c2410c',
  cita: '#fdf3d6|#92400e',
  completado: '#dcfce7|#166534',
}

export default function Clientes() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'table'|'cards'>('table')

  const counts = { nuevo: 0, contactado: 0, cita: 0, completado: 0 }
  CLIENTES.forEach(c => { if (counts[c.estado as keyof typeof counts] !== undefined) counts[c.estado as keyof typeof counts]++ })

  let list = filter === 'all' ? CLIENTES : CLIENTES.filter(c => c.estado === filter)
  if (search) {
    const q = search.toLowerCase()
    list = list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.tel.includes(q) ||
      c.notes.toLowerCase().includes(q)
    )
  }

  const EstadoBadge = ({ estado }: { estado: string }) => {
    const [bg, color] = (ESTADO_COLORS[estado] || '#f1f5f9|#64748b').split('|')
    return (
      <span style={{
        background: bg, color, padding: '.18rem .55rem',
        borderRadius: 20, fontSize: '.66rem', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '.3px',
        display: 'inline-flex', alignItems: 'center', gap: '.25rem'
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block' }} />
        {EL[estado]}
      </span>
    )
  }

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/clientes" />
      <main className={styles.main}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Clientes</h1>
            <p className={styles.phSub}>{CLIENTES.length} clientes · {list.length} mostrando</p>
          </div>
          <div className={styles.phActions}>
            <button className={styles.btnGhost} onClick={() => {}}>↓ CSV</button>
            <button className={styles.btnDark}>+ Nuevo cliente</button>
          </div>
        </div>

        {/* PIPELINE */}
        <div className={cStyles.pipeBar}>
          {[
            { key: 'all', label: 'Todos', count: CLIENTES.length, cls: 'all' },
            { key: 'nuevo', label: 'Nuevos', count: counts.nuevo, cls: 'n' },
            { key: 'contactado', label: 'Contactados', count: counts.contactado, cls: 'c' },
            { key: 'cita', label: 'Cita agendada', count: counts.cita, cls: 'ci' },
            { key: 'completado', label: 'Completados', count: counts.completado, cls: 'co' },
          ].map(p => (
            <div key={p.key} className={`${cStyles.ps} ${filter === p.key ? cStyles.psOn : ''}`} onClick={() => setFilter(p.key)}>
              <div className={cStyles.psLabel}>{p.label}</div>
              <div className={`${cStyles.psNum} ${cStyles[p.cls]}`}>{p.count}</div>
            </div>
          ))}
        </div>

        {/* BÚSQUEDA + TOGGLE VISTA */}
        <div className={cStyles.searchRow}>
          <div className={cStyles.searchWrap}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className={cStyles.searchInp} placeholder="Buscar nombre, teléfono, notas…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '.3rem', background: '#ede9e1', padding: '.22rem', borderRadius: 8 }}>
            <button
              onClick={() => setView('table')}
              style={{ padding: '.3rem .65rem', borderRadius: 6, fontSize: '.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', background: view === 'table' ? '#fff' : 'transparent', color: view === 'table' ? '#0a0f14' : '#64748b', fontFamily: 'inherit', boxShadow: view === 'table' ? '0 1px 3px rgba(10,15,20,.07)' : 'none' }}>
              ☰ Lista
            </button>
            <button
              onClick={() => setView('cards')}
              style={{ padding: '.3rem .65rem', borderRadius: 6, fontSize: '.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', background: view === 'cards' ? '#fff' : 'transparent', color: view === 'cards' ? '#0a0f14' : '#64748b', fontFamily: 'inherit', boxShadow: view === 'cards' ? '0 1px 3px rgba(10,15,20,.07)' : 'none' }}>
              ⊞ Tarjetas
            </button>
          </div>
        </div>

        {/* VISTA TABLA */}
        {view === 'table' && (
          <div className={styles.card} style={{ padding: 0 }}>
            <table className={styles.tbl}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Próxima visita</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
                        <div className={cStyles.ccAv}>{c.name.split(' ').map((w:string) => w[0]).slice(0,2).join('')}</div>
                        <div>
                          <strong>{c.name}</strong>
                          {c.notes && <div style={{ fontSize: '.73rem', color: 'var(--grey)', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.notes}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '.82rem' }}>{c.tel}</td>
                    <td>
                      {c.nextVisit
                        ? <span style={{ background: '#fdf3d6', color: '#92400e', padding: '.2rem .55rem', borderRadius: 6, fontSize: '.75rem', fontWeight: 600 }}>📅 {c.nextVisit}</span>
                        : <span style={{ color: '#cbd5e1', fontSize: '.78rem' }}>—</span>
                      }
                    </td>
                    <td>
                      {/* DROPDOWN ESTADO */}
                      <select
                        value={c.estado}
                        onChange={() => {}}
                        style={{
                          padding: '.22rem .5rem',
                          borderRadius: 20,
                          fontSize: '.66rem',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          background: (ESTADO_COLORS[c.estado] || '#f1f5f9|#64748b').split('|')[0],
                          color: (ESTADO_COLORS[c.estado] || '#f1f5f9|#64748b').split('|')[1],
                        }}
                      >
                        {Object.entries(EL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '.15rem', justifyContent: 'flex-end' }}>
                        <button className={cStyles.icoBtn} title="Editar">✎</button>
                        <button className={`${cStyles.icoBtn} ${cStyles.del}`} title="Eliminar">🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VISTA TARJETAS */}
{/* VISTA TARJETAS */}
{view === 'cards' && (
  <div className={cStyles.ccGrid}>
    {list.map(c => {
      const color = (ESTADO_COLORS[c.estado] || '#e2ddd4|#64748b').split('|')[1]
      const bg = (ESTADO_COLORS[c.estado] || '#f1f5f9|#64748b').split('|')[0]

      return (
        <div
          key={c.id}
          className={cStyles.cc}
          style={{
            borderLeft: `5px solid ${color}`,
            background: '#fff',
          }}
        >
          <div className={cStyles.cardTop}>
            <div className={cStyles.cardUser}>
              <div className={cStyles.ccAv}>
                {c.name.split(' ').map((w:string) => w[0]).slice(0,2).join('')}
              </div>

              <div>
                <div className={cStyles.cardName}>{c.name}</div>
                <div className={cStyles.cardTel}>{c.tel}</div>
              </div>
            </div>

            <EstadoBadge estado={c.estado} />
          </div>

          <div className={cStyles.cardBody}>
            {c.notes ? (
              <p className={cStyles.cardNotes}>{c.notes}</p>
            ) : (
              <p className={cStyles.cardNotesMuted}>Sin notas</p>
            )}

            <div className={cStyles.cardInfo}>
              <span>Alta</span>
              <strong>{c.created}</strong>
            </div>

            <div className={cStyles.cardInfo}>
              <span>Próxima visita</span>
              {c.nextVisit ? (
                <strong style={{ color: '#92400e' }}>📅 {c.nextVisit}</strong>
              ) : (
                <strong style={{ color: '#94a3b8' }}>Sin cita</strong>
              )}
            </div>
          </div>

          <div className={cStyles.cardFooter}>
            <span
              style={{
                background: bg,
                color,
                padding: '.28rem .6rem',
                borderRadius: 999,
                fontSize: '.68rem',
                fontWeight: 800,
                textTransform: 'uppercase',
              }}
            >
              {EL[c.estado]}
            </span>

            <div style={{ display: 'flex', gap: '.3rem' }}>
              {c.tel && (
                <a
                  href={`https://wa.me/${c.tel.replace(/[^0-9]/g,'')}`}
                  target="_blank"
                  className={cStyles.waBtn}
                >
                  💬
                </a>
              )}

              <button className={cStyles.icoBtn}>✎</button>
              <button className={`${cStyles.icoBtn} ${cStyles.del}`}>🗑</button>
            </div>
          </div>
        </div>
      )
    })}
  </div>
)}
      </main>
    </div>
  )
}
