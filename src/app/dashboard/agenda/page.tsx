'use client'
import { useState } from 'react'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import aStyles from './agenda.module.css'

const MONTHS_FULL = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const EVENT_COLORS = ['color0','color1','color2','color3','color4']
const DOT_COLORS = ['#1c2b3a','#166534','#92400e','#991b1b','#1e40af']

// Múltiples eventos por día
const EVENTS: Record<number, { time: string; title: string; client: string; colorIdx: number }[]> = {
  26: [
    { time: '10:00', title: 'Visita técnica olivo', client: 'Carmen Ruiz', colorIdx: 0 },
    { time: '12:30', title: 'Presupuesto jardín', client: 'Ana Martín', colorIdx: 1 },
  ],
  28: [
    { time: '09:00', title: 'Mantenimiento', client: 'Bufete Martín', colorIdx: 2 },
    { time: '16:30', title: 'Revisión riego', client: 'Javier Romero', colorIdx: 0 },
    { time: '18:00', title: 'Entrega llaves', client: 'Lucía Navarro', colorIdx: 3 },
  ],
  30: [
    { time: '09:00', title: 'Mantenimiento mensual', client: 'Bufete Martín', colorIdx: 2 },
  ],
  2: [
    { time: '11:00', title: 'Entrega proyecto piscina', client: 'Pedro Alonso', colorIdx: 4 },
    { time: '15:00', title: 'Visita nueva parcela', client: 'Carlos Díaz', colorIdx: 1 },
  ],
  5: [
    { time: '10:00', title: 'Diseño jardín japonés', client: 'Silvia Ríos', colorIdx: 3 },
  ],
}

export default function Agenda() {
  const today = new Date()
  const [viewDate, setViewDate] = useState(today)
  const [showForm, setShowForm] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = firstDay === 0 ? 6 : firstDay - 1

  const selectedEvents = selectedDay ? (EVENTS[selectedDay] || []) : []

  // Todas las visitas ordenadas
  const allEvents = Object.entries(EVENTS)
    .sort(([a], [b]) => Number(a) - Number(b))
    .flatMap(([day, evs]) => evs.map(ev => ({ ...ev, day: Number(day) })))

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/agenda" />
      <main className={styles.main}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Agenda</h1>
            <p className={styles.phSub}>Toca un día para ver o añadir visitas.</p>
          </div>
          <button className={styles.btnDark} onClick={() => setShowForm(true)}>+ Nueva visita</button>
        </div>

        {showForm && (
          <div className={aStyles.formCard}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.1rem' }}>
              <div className={styles.cardT}>Nueva visita</div>
              <button onClick={() => setShowForm(false)} style={{ width:28, height:28, borderRadius:'50%', display:'grid', placeItems:'center', cursor:'pointer', fontSize:'1.1rem', color:'#64748b', background:'none', border:'none' }}>×</button>
            </div>
            <div className={aStyles.formGrid}>
              <div className={aStyles.field} style={{ gridColumn:'1/-1' }}>
                <label>Descripción *</label>
                <input placeholder="Ej: Visita técnica inicial" autoFocus />
              </div>
              <div className={aStyles.field}>
                <label>Fecha</label>
                <input type="date" defaultValue={today.toISOString().split('T')[0]} />
              </div>
              <div className={aStyles.field}>
                <label>Hora</label>
                <input type="time" defaultValue="10:00" />
              </div>
              <div className={aStyles.field} style={{ gridColumn:'1/-1' }}>
                <label>Cliente</label>
                <select>
                  <option>Selecciona un cliente…</option>
                  <option>Carmen Ruiz</option>
                  <option>Javier Romero</option>
                  <option>Bufete Martín</option>
                </select>
              </div>
              <div className={aStyles.field} style={{ gridColumn:'1/-1' }}>
                <label>Notas</label>
                <textarea placeholder="Qué llevar, qué revisar…" rows={2} />
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:'.55rem', marginTop:'1rem' }}>
              <button className={styles.btnGhost} onClick={() => setShowForm(false)}>Cancelar</button>
              <button className={styles.btnDark} onClick={() => setShowForm(false)}>Guardar visita</button>
            </div>
          </div>
        )}

        <div className={aStyles.layout}>
          {/* CALENDARIO GRANDE CON MÚLTIPLES EVENTOS */}
          <div className={aStyles.calCard}>
            <div className={aStyles.calNav}>
              <button className={aStyles.calNavBtn} onClick={() => setViewDate(new Date(year, month-1, 1))}>← Anterior</button>
              <div className={aStyles.calTitle}>{MONTHS_FULL[month]} {year}</div>
              <button className={aStyles.calNavBtn} onClick={() => setViewDate(new Date(year, month+1, 1))}>Siguiente →</button>
            </div>

            <div className={aStyles.calGrid}>
              {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d => (
                <div key={d} className={aStyles.calDayName}>{d}</div>
              ))}
              {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1
                const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                const dayEvents = EVENTS[d] || []
                const isSelected = d === selectedDay
                const maxShow = 2

                return (
                  <div
                    key={d}
                    className={`${aStyles.calDay} ${isToday ? aStyles.today : ''} ${isSelected ? aStyles.selected : ''}`}
                    onClick={() => setSelectedDay(d === selectedDay ? null : d)}
                  >
                    <span className={aStyles.calDayNum}>{d}</span>
                    {dayEvents.slice(0, maxShow).map((ev, ei) => (
                      <div key={ei} className={`${aStyles.calEvent} ${aStyles[EVENT_COLORS[ev.colorIdx]]}`}>
                        <span className={aStyles.calEventTime}>{ev.time}</span>
                        <span className={aStyles.calEventTitle}>{ev.client}</span>
                      </div>
                    ))}
                    {dayEvents.length > maxShow && (
                      <div className={aStyles.moreEvents}>+{dayEvents.length - maxShow} más</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* PANEL LATERAL */}
          <div className={aStyles.sidePanel}>
            {selectedDay ? (
              <div className={styles.card}>
                <div className={styles.cardH}>
                  <div className={styles.cardT}>
                    {selectedDay} de {MONTHS_FULL[month]}
                    <span style={{ marginLeft:'.5rem', fontSize:'.78rem', color:'#64748b', fontWeight:400 }}>
                      {selectedEvents.length} visita{selectedEvents.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <button
                    className={styles.btnDark}
                    style={{ padding:'.35rem .7rem', fontSize:'.78rem' }}
                    onClick={() => setShowForm(true)}
                  >+ Añadir</button>
                </div>
                {selectedEvents.length > 0 ? selectedEvents.map((ev, i) => (
                  <div key={i} className={aStyles.evItem}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background: DOT_COLORS[ev.colorIdx], flexShrink:0, marginTop:'.35rem' }} />
                    <div style={{ flex:1 }}>
                      <div className={aStyles.evTitle}>{ev.title}</div>
                      <div className={aStyles.evClient}>{ev.time} · {ev.client}</div>
                    </div>
                    <button className={aStyles.icoBtn}>✎</button>
                  </div>
                )) : (
                  <div style={{ padding:'1.5rem 0', textAlign:'center', color:'#94a3b8', fontSize:'.875rem' }}>
                    Sin visitas este día.
                    <br />
                    <button
                      style={{ marginTop:'.65rem', padding:'.45rem .9rem', background:'#0a0f14', color:'#fff', border:'none', borderRadius:8, fontSize:'.82rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}
                      onClick={() => setShowForm(true)}
                    >+ Añadir visita</button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.card}>
                <div className={styles.cardH}>
                  <div className={styles.cardT}>Próximas visitas</div>
                </div>
                {allEvents.slice(0, 6).map((ev, i) => (
                  <div key={i} className={aStyles.evItem} onClick={() => setSelectedDay(ev.day)}>
                    <div className={aStyles.evDate}>
                      <span style={{ fontSize:'.58rem', textTransform:'uppercase', color:'#64748b', fontWeight:700 }}>
                        {MONTHS_FULL[month].slice(0,3)}
                      </span>
                      <span style={{ fontSize:'1.2rem', fontWeight:800, fontFamily:'Syne', lineHeight:1, color:'#0a0f14' }}>{ev.day}</span>
                    </div>
                    <div style={{ flex:1 }}>
                      <div className={aStyles.evTitle}>{ev.title}</div>
                      <div className={aStyles.evClient}>{ev.time} · {ev.client}</div>
                    </div>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:DOT_COLORS[ev.colorIdx], flexShrink:0 }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}