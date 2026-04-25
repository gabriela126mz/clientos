'use client'

import { useState } from 'react'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import aStyles from './agenda.module.css'

const MONTHS_FULL = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const EVENT_COLORS = ['color0','color1','color2','color3','color4']
const DOT_COLORS = ['#1c2b3a','#166534','#92400e','#991b1b','#1e40af']

const CLIENTES = ['Carmen Ruiz', 'Javier Romero', 'Bufete Martín', 'Ana Martín', 'Pedro Alonso', 'Carlos Díaz', 'Lucía Navarro', 'Silvia Ríos']

const INITIAL_EVENTS: Record<number, { id: string; time: string; title: string; client: string; notes: string; colorIdx: number }[]> = {
  26: [
    { id: 'e1', time: '10:00', title: 'Visita técnica olivo', client: 'Carmen Ruiz', notes: 'Revisar estado del olivo y valorar poda.', colorIdx: 0 },
    { id: 'e2', time: '12:30', title: 'Presupuesto jardín', client: 'Ana Martín', notes: 'Medir zona y preparar presupuesto inicial.', colorIdx: 1 },
  ],
  28: [
    { id: 'e3', time: '09:00', title: 'Mantenimiento', client: 'Bufete Martín', notes: 'Mantenimiento mensual de jardín.', colorIdx: 2 },
    { id: 'e4', time: '16:30', title: 'Revisión riego', client: 'Javier Romero', notes: 'Comprobar programador y aspersores.', colorIdx: 0 },
    { id: 'e5', time: '18:00', title: 'Entrega llaves', client: 'Lucía Navarro', notes: 'Recoger llaves para próxima visita.', colorIdx: 3 },
  ],
  30: [
    { id: 'e6', time: '09:00', title: 'Mantenimiento mensual', client: 'Bufete Martín', notes: 'Realizado — cobrado.', colorIdx: 2 },
  ],
  2: [
    { id: 'e7', time: '11:00', title: 'Entrega proyecto piscina', client: 'Pedro Alonso', notes: 'Presentar diseño final.', colorIdx: 4 },
    { id: 'e8', time: '15:00', title: 'Visita nueva parcela', client: 'Carlos Díaz', notes: 'Ver terreno y orientación.', colorIdx: 1 },
  ],
  5: [
    { id: 'e9', time: '10:00', title: 'Diseño jardín japonés', client: 'Silvia Ríos', notes: 'Primera visita de diseño.', colorIdx: 3 },
  ],
}

export default function Agenda() {
  const today = new Date()
  const [viewDate, setViewDate] = useState(today)
  const [events, setEvents] = useState(INITIAL_EVENTS)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)

  const [formDay, setFormDay] = useState(today.getDate())
  const [formTitle, setFormTitle] = useState('')
  const [formTime, setFormTime] = useState('10:00')
  const [formClient, setFormClient] = useState('')
  const [formNotes, setFormNotes] = useState('')

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = firstDay === 0 ? 6 : firstDay - 1

  const selectedEvents = selectedDay ? (events[selectedDay] || []) : []

  const allEvents = Object.entries(events)
    .sort(([a], [b]) => Number(a) - Number(b))
    .flatMap(([day, evs]) => evs.map(ev => ({ ...ev, day: Number(day) })))

  const resetForm = () => {
    setEditingEventId(null)
    setFormDay(selectedDay || today.getDate())
    setFormTitle('')
    setFormTime('10:00')
    setFormClient('')
    setFormNotes('')
  }

  const openNewVisit = (day?: number) => {
    resetForm()
    setFormDay(day || selectedDay || today.getDate())
    setShowForm(true)
  }

  const openEditVisit = (day: number, ev: any) => {
    setEditingEventId(ev.id)
    setFormDay(day)
    setFormTitle(ev.title || '')
    setFormTime(ev.time || '10:00')
    setFormClient(ev.client || '')
    setFormNotes(ev.notes || '')
    setShowForm(true)
  }

  const saveVisit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!formTitle.trim()) {
      alert('Escribe para qué es la visita')
      return
    }

    if (!formClient.trim()) {
      alert('Selecciona o escribe el cliente')
      return
    }

    if (editingEventId) {
      const updated: typeof events = {}

      Object.entries(events).forEach(([day, evs]) => {
        updated[Number(day)] = evs.filter(ev => ev.id !== editingEventId)
      })

      const currentEvents = updated[formDay] || []
      updated[formDay] = [
        ...currentEvents,
        {
          id: editingEventId,
          time: formTime,
          title: formTitle.trim(),
          client: formClient.trim(),
          notes: formNotes.trim(),
          colorIdx: currentEvents.length % EVENT_COLORS.length,
        },
      ].sort((a, b) => a.time.localeCompare(b.time))

      setEvents(updated)
      alert('Visita actualizada correctamente ✅')
    } else {
      const dayEvents = events[formDay] || []

      const newVisit = {
        id: `e${Date.now()}`,
        time: formTime,
        title: formTitle.trim(),
        client: formClient.trim(),
        notes: formNotes.trim(),
        colorIdx: dayEvents.length % EVENT_COLORS.length,
      }

      setEvents({
        ...events,
        [formDay]: [...dayEvents, newVisit].sort((a, b) => a.time.localeCompare(b.time)),
      })

      setSelectedDay(formDay)
      alert('Visita creada correctamente ✅')
    }

    resetForm()
    setShowForm(false)
  }

  const deleteVisit = () => {
    if (!editingEventId) return

    const ok = confirm('¿Seguro que quieres eliminar esta visita?')
    if (!ok) return

    const updated: typeof events = {}

    Object.entries(events).forEach(([day, evs]) => {
      updated[Number(day)] = evs.filter(ev => ev.id !== editingEventId)
    })

    setEvents(updated)
    resetForm()
    setShowForm(false)
    alert('Visita eliminada correctamente ✅')
  }

  const deleteVisitById = (id: string) => {
  const ok = confirm('¿Seguro que quieres eliminar esta visita?')
  if (!ok) return

  const updated: typeof events = {}

  Object.entries(events).forEach(([day, evs]) => {
    updated[Number(day)] = evs.filter(ev => ev.id !== id)
  })

  setEvents(updated)
  alert('Visita eliminada correctamente ✅')
}

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/agenda" />

      <main className={styles.main}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Agenda</h1>
            <p className={styles.phSub}>Toca una visita para editarla o añade una nueva.</p>
          </div>

          <button className={styles.btnDark} onClick={() => openNewVisit()}>
            + Nueva visita
          </button>
        </div>

        <div className={aStyles.layout}>
          <div className={aStyles.calCard}>
            <div className={aStyles.calNav}>
              <button className={aStyles.calNavBtn} onClick={() => setViewDate(new Date(year, month - 1, 1))}>← Anterior</button>
              <div className={aStyles.calTitle}>{MONTHS_FULL[month]} {year}</div>
              <button className={aStyles.calNavBtn} onClick={() => setViewDate(new Date(year, month + 1, 1))}>Siguiente →</button>
            </div>

            <div className={aStyles.calGrid}>
              {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map(d => (
                <div key={d} className={aStyles.calDayName}>{d}</div>
              ))}

              {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1
                const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                const dayEvents = events[d] || []
                const isSelected = d === selectedDay
                const maxShow = 2

                return (
                  <div
                    key={d}
                    className={`${aStyles.calDay} ${isToday ? aStyles.today : ''} ${isSelected ? aStyles.selected : ''}`}
                    onClick={() => setSelectedDay(d === selectedDay ? null : d)}
                  >
                    <span className={aStyles.calDayNum}>{d}</span>

                    {dayEvents.slice(0, maxShow).map((ev) => (
                      <button
                        key={ev.id}
                        type="button"
                        className={`${aStyles.calEvent} ${aStyles[EVENT_COLORS[ev.colorIdx]]}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditVisit(d, ev)
                        }}
                        title={`${ev.title} · ${ev.client}`}
                      >
                        <span className={aStyles.calEventTime}>{ev.time}</span>
                        <span className={aStyles.calEventTitle}>{ev.client}</span>
                      </button>
                    ))}

                    {dayEvents.length > maxShow && (
                      <div className={aStyles.moreEvents}>+{dayEvents.length - maxShow} más</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

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
                    onClick={() => openNewVisit(selectedDay)}
                  >
                    + Añadir
                  </button>
                </div>

                {selectedEvents.length > 0 ? selectedEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className={aStyles.evItem}
                    onClick={() => openEditVisit(selectedDay, ev)}
                  >
                    <div style={{ width:10, height:10, borderRadius:'50%', background: DOT_COLORS[ev.colorIdx], flexShrink:0, marginTop:'.35rem' }} />
                    <div style={{ flex:1 }}>
                      <div className={aStyles.evTitle}>{ev.title}</div>
                      <div className={aStyles.evClient}>{ev.time} · {ev.client}</div>
                    </div>
                  <button
                    className={aStyles.icoBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      openEditVisit(selectedDay, ev)
                    }}
                  >
                    ✎
                  </button>

                  <button
                    className={`${aStyles.icoBtn} ${aStyles.del}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteVisitById(ev.id)
                    }}
                  >
                    🗑
                  </button>
                  </div>
                )) : (
                  <div style={{ padding:'1.5rem 0', textAlign:'center', color:'#94a3b8', fontSize:'.875rem' }}>
                    Sin visitas este día.
                    <br />
                    <button
                      style={{ marginTop:'.65rem', padding:'.45rem .9rem', background:'#0a0f14', color:'#fff', border:'none', borderRadius:8, fontSize:'.82rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}
                      onClick={() => openNewVisit(selectedDay)}
                    >
                      + Añadir visita
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.card}>
                <div className={styles.cardH}>
                  <div className={styles.cardT}>Próximas visitas</div>
                </div>

                {allEvents.slice(0, 6).map((ev) => (
                  <div
                    key={ev.id}
                    className={aStyles.evItem}
                    onClick={() => {
                      setSelectedDay(ev.day)
                      openEditVisit(ev.day, ev)
                    }}
                  >
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

        {showForm && (
          <div className={aStyles.modalOverlay}>
            <div className={aStyles.modalBox}>
              <div className={aStyles.modalHead}>
                <div>
                  <h2>{editingEventId ? 'Editar visita' : 'Nueva visita'}</h2>
                  <p>{editingEventId ? 'Modifica los datos de esta visita.' : 'Agenda una visita o seguimiento para un cliente.'}</p>
                </div>

                <button className={aStyles.modalClose} onClick={() => { resetForm(); setShowForm(false) }}>
                  ×
                </button>
              </div>

              <form onSubmit={saveVisit} className={aStyles.modalForm}>
                <div className={aStyles.field} style={{ gridColumn:'1/-1' }}>
                  <label>¿Para qué es la visita? *</label>
                  <input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Ej: Visita técnica inicial" autoFocus />
                </div>

                <div className={aStyles.field}>
                  <label>Día</label>
                  <select value={formDay} onChange={e => setFormDay(Number(e.target.value))}>
                    {Array.from({ length: daysInMonth }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} de {MONTHS_FULL[month]}</option>
                    ))}
                  </select>
                </div>

                <div className={aStyles.field}>
                  <label>Hora</label>
                  <input type="time" value={formTime} onChange={e => setFormTime(e.target.value)} />
                </div>

                <div className={aStyles.field} style={{ gridColumn:'1/-1' }}>
                  <label>Cliente *</label>
                  <select value={formClient} onChange={e => setFormClient(e.target.value)}>
                    <option value="">Selecciona un cliente…</option>
                    {CLIENTES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className={aStyles.field} style={{ gridColumn:'1/-1' }}>
                  <label>Notas</label>
                  <textarea value={formNotes} onChange={e => setFormNotes(e.target.value)} placeholder="Qué llevar, qué revisar, estado del trabajo…" rows={4} />
                </div>

                <div className={aStyles.modalActions}>
                  <button type="button" className={styles.btnGhost} onClick={() => { resetForm(); setShowForm(false) }}>
                    Cancelar
                  </button>

                  <button type="submit" className={styles.btnDark}>
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}