'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import aStyles from './agenda.module.css'
import { useAuth } from '@/lib/context'
import { createClient } from '@/lib/supabase/client'
import type { Client } from '@/lib/types'

const MONTHS_FULL = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

interface Cita {
  id: string
  client_id: string
  client_name: string
  title: string
  date: string
  time: string
  place: string
  notes: string
  estado: 'nuevo' | 'contactado' | 'cita' | 'completado'
}

// Colores consistentes para clientes
const getClientColor = (clientName: string): string => {
  const colors = ['#2563eb', '#dc2626', '#16a34a', '#ea580c', '#9333ea', '#0891b2', '#e11d48', '#854d0e']
  let hash = 0
  for (let i = 0; i < clientName.length; i++) {
    hash = ((hash << 5) - hash) + clientName.charCodeAt(i)
    hash = hash & hash
  }
  return colors[Math.abs(hash) % colors.length]
}

const getClientBg = (color: string): string => {
  const bgMap: Record<string, string> = {
    '#2563eb': '#dbeafe',
    '#dc2626': '#fcebeb',
    '#16a34a': '#dcfce7',
    '#ea580c': '#ffedd5',
    '#9333ea': '#f3e8ff',
    '#0891b2': '#cffafe',
    '#e11d48': '#ffe4e6',
    '#854d0e': '#fef3c7',
  }
  return bgMap[color] || '#f3f0ea'
}

const getClientTextColor = (color: string): string => {
  const textMap: Record<string, string> = {
    '#2563eb': '#1d4ed8',
    '#dc2626': '#991b1b',
    '#16a34a': '#166534',
    '#ea580c': '#c2410c',
    '#9333ea': '#6b21a8',
    '#0891b2': '#0e7490',
    '#e11d48': '#be185d',
    '#854d0e': '#92400e',
  }
  return textMap[color] || '#0a0f14'
}

export default function Agenda() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const today = new Date()
  const [viewDate, setViewDate] = useState(today)
  const [citas, setCitas] = useState<Cita[]>([])
  const [clientes, setClientes] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editingCitaId, setEditingCitaId] = useState<string | null>(null)

  const [formDate, setFormDate] = useState(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`)
  const [formTime, setFormTime] = useState('10:00')
  const [formTitle, setFormTitle] = useState('')
  const [formPlace, setFormPlace] = useState('')
  const [formNotes, setFormNotes] = useState('')
  const [formClientId, setFormClientId] = useState('')
  const [formClientName, setFormClientName] = useState('')
  const [formEstado, setFormEstado] = useState('pendiente')

  const [miniCalendarMonth, setMiniCalendarMonth] = useState(today.getMonth())
  const [miniCalendarYear, setMiniCalendarYear] = useState(today.getFullYear())

  // Cargar citas y clientes
  const loadData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      // Cargar citas
      const { data: citasData, error: citasError } = await supabase
        .from('citas')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true })

      if (!citasError) {
        setCitas(citasData || [])
      }

      // Cargar clientes
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true })

      if (!clientesError) {
        setClientes(clientesData || [])
      }
    } catch (err) {
      console.error('Error cargando datos:', err)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/')
      return
    }
    loadData()
  }, [authLoading, user, loadData, router])

  // Efecto separado para el client_id de URL (solo al cargar clientes)
  useEffect(() => {
    const clientId = searchParams.get('client_id')
    if (clientId && clientes.length > 0) {
      const cliente = clientes.find(c => c.id === clientId)
      if (cliente) {
        setFormClientId(clientId)
        setFormClientName(cliente.name)
        setShowForm(true)
      }
    }
  }, [searchParams, clientes])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = firstDay === 0 ? 6 : firstDay - 1

  // Citas del mes actual
  const citasDelMes = citas.filter(c => {
    const [y, m] = c.date.split('-')
    return Number(y) === year && Number(m) === month + 1
  })

  // Agrupar citas por día
  const citasPorDia = citasDelMes.reduce((acc, cita) => {
    const day = Number(cita.date.split('-')[2])
    if (!acc[day]) acc[day] = []
    acc[day].push(cita)
    return acc
  }, {} as Record<number, Cita[]>)

  const selectedEvents = selectedDay ? (citasPorDia[selectedDay] || []) : []

  // Próximas citas
  const proximasCitas = citas
    .filter(c => new Date(c.date + 'T' + c.time) >= new Date())
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 6)

  const resetForm = () => {
    setEditingCitaId(null)
    setFormDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`)
    setFormTime('10:00')
    setFormTitle('')
    setFormPlace('')
    setFormNotes('')
    setFormClientId('')
    setFormClientName('')
    setFormEstado('pendiente')
    setMiniCalendarMonth(today.getMonth())
    setMiniCalendarYear(today.getFullYear())
  }

  const openNewCita = (day?: number) => {
    resetForm()
    if (day) {
      setFormDate(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
    }
    setShowForm(true)
  }

  const openEditCita = (cita: Cita) => {
    setEditingCitaId(cita.id)
    setFormDate(cita.date)
    setFormTime(cita.time)
    setFormTitle(cita.title)
    setFormPlace(cita.place || '')
    setFormNotes(cita.notes || '')
    setFormClientId(cita.client_id)
    setFormClientName(cita.client_name)
    setFormEstado(cita.estado)
    setShowForm(true)
  }

  const saveCita = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return
    if (!formTitle.trim()) {
      alert('Escribe el título de la visita')
      return
    }
    if (!formClientId && !formClientName.trim()) {
      alert('Selecciona o escribe el cliente')
      return
    }

    const payload = {
      user_id: user.id,
      client_id: formClientId || null,
      client_name: formClientName.trim(),
      title: formTitle.trim(),
      date: formDate,
      time: formTime,
      place: formPlace.trim(),
      notes: formNotes.trim(),
      estado: formEstado,
    }

    try {
      if (editingCitaId) {
        const { error } = await supabase
          .from('citas')
          .update(payload)
          .eq('id', editingCitaId)

        if (error) {
          alert('Error al actualizar: ' + error.message)
          return
        }
      } else {
        const { error } = await supabase
          .from('citas')
          .insert([payload])

        if (error) {
          alert('Error al crear: ' + error.message)
          return
        }
      }

      await loadData()
      resetForm()
      setShowForm(false)
      alert(editingCitaId ? '✅ Cita actualizada' : '✅ Cita creada')
    } catch (err) {
      console.error(err)
      alert('Error inesperado')
    }
  }

  const deleteCita = async (id: string) => {
    if (!confirm('¿Eliminar esta cita?')) return

    try {
      const { error } = await supabase
        .from('citas')
        .delete()
        .eq('id', id)

      if (error) {
        alert('Error: ' + error.message)
        return
      }

      await loadData()
      resetForm()
      setShowForm(false)
      alert('✅ Cita eliminada')
    } catch (err) {
      console.error(err)
      alert('Error inesperado')
    }
  }

  if (loading) {
    return (
      <div className={styles.app}>
        <Sidebar active="/dashboard/agenda" />
        <main className={styles.main}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e2ddd4', borderTopColor: '#2d5a27', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748b', fontSize: '.875rem' }}>Cargando agenda…</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/agenda" />

      <main className={styles.main}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Agenda</h1>
            <p className={styles.phSub}>Toca una cita para editarla o añade una nueva.</p>
          </div>

          <button className={styles.btnDark} onClick={() => openNewCita()}>
            + Nueva cita
          </button>
        </div>

        <div className={aStyles.layout}>
          {/* CALENDARIO */}
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
                const dayEvents = citasPorDia[d] || []
                const isSelected = d === selectedDay
                const maxShow = 2

                return (
                  <div
                    key={d}
                    className={`${aStyles.calDay} ${isToday ? aStyles.today : ''} ${isSelected ? aStyles.selected : ''}`}
                    onClick={() => setSelectedDay(d === selectedDay ? null : d)}
                  >
                    <span className={aStyles.calDayNum}>{d}</span>

                    {dayEvents.slice(0, maxShow).map((cita) => (
                      <button
                        key={cita.id}
                        type="button"
                        className={aStyles.calEvent}
                        style={{
                          background: getClientBg(getClientColor(cita.client_name)),
                          color: getClientTextColor(getClientColor(cita.client_name)),
                          borderLeft: `3px solid ${getClientColor(cita.client_name)}`,
                          fontSize: '.65rem',
                          padding: '.35rem .4rem',
                          lineHeight: '1.2',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '.1rem',
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditCita(cita)
                        }}
                        title={`${cita.title}\n${cita.time} · ${cita.client_name}${cita.place ? '\n📍 ' + cita.place : ''}${cita.notes ? '\n' + cita.notes : ''}`}
                      >
                        <span style={{ fontWeight: 700, fontSize: '.7rem' }}>{cita.time}</span>
                        <span style={{ fontSize: '.6rem', fontWeight: 500 }}>{cita.client_name}</span>
                        {cita.place && (
                          <span style={{ fontSize: '.6rem', opacity: 0.85 }}>📍 {cita.place.slice(0, 15)}{cita.place.length > 15 ? '…' : ''}</span>
                        )}
                        {cita.notes && (
                          <span style={{ fontSize: '.6rem', opacity: 0.75, fontStyle: 'italic' }}>
                            {cita.notes.slice(0, 20)}{cita.notes.length > 20 ? '…' : ''}
                          </span>
                        )}
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

          {/* SIDEBAR */}
          <div className={aStyles.sidePanel}>
            {selectedDay ? (
              <div className={styles.card}>
                <div className={styles.cardH}>
                  <div className={styles.cardT}>
                    {selectedDay} de {MONTHS_FULL[month]}
                    <span style={{ marginLeft: '.5rem', fontSize: '.78rem', color: '#64748b', fontWeight: 400 }}>
                      {selectedEvents.length} cita{selectedEvents.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <button
                    className={styles.btnDark}
                    style={{ padding: '.35rem .7rem', fontSize: '.78rem' }}
                    onClick={() => openNewCita(selectedDay)}
                  >
                    + Añadir
                  </button>
                </div>

                {selectedEvents.length > 0 ? selectedEvents.map((cita) => (
                  <div
                    key={cita.id}
                    className={aStyles.evItem}
                    onClick={() => openEditCita(cita)}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: getClientColor(cita.client_name),
                        flexShrink: 0,
                        marginTop: '.35rem',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div className={aStyles.evTitle}>{cita.title}</div>
                      <div className={aStyles.evClient}>{cita.time} · {cita.client_name}</div>
                    </div>
                    <button
                      className={aStyles.icoBtn}
                      onClick={(e) => {
                        e.stopPropagation()
                        openEditCita(cita)
                      }}
                    >
                      ✎
                    </button>

                    <button
                      className={`${aStyles.icoBtn} ${aStyles.del}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteCita(cita.id)
                      }}
                    >
                      🗑
                    </button>
                  </div>
                )) : (
                  <div style={{ padding: '1.5rem 0', textAlign: 'center', color: '#94a3b8', fontSize: '.875rem' }}>
                    Sin citas este día.
                    <br />
                    <button
                      style={{
                        marginTop: '.65rem',
                        padding: '.45rem .9rem',
                        background: '#0a0f14',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: '.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                      onClick={() => openNewCita(selectedDay)}
                    >
                      + Añadir cita
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.card}>
                <div className={styles.cardH}>
                  <div className={styles.cardT}>Próximas citas</div>
                </div>

                {proximasCitas.length > 0 ? proximasCitas.map((cita) => {
                  const [y, m, d] = cita.date.split('-')
                  return (
                    <div
                      key={cita.id}
                      className={aStyles.evItem}
                      onClick={() => {
                        setSelectedDay(Number(d))
                        openEditCita(cita)
                      }}
                    >
                      <div className={aStyles.evDate}>
                        <span style={{ fontSize: '.58rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
                          {MONTHS_FULL[Number(m) - 1].slice(0, 3)}
                        </span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'Syne', lineHeight: 1, color: '#0a0f14' }}>
                          {d}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className={aStyles.evTitle}>{cita.title}</div>
                        <div className={aStyles.evClient}>{cita.time} · {cita.client_name}</div>
                      </div>
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: getClientColor(cita.client_name),
                          flexShrink: 0,
                        }}
                      />
                    </div>
                  )
                }) : (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '.875rem' }}>
                    No hay citas próximas
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* MODAL */}
        {showForm && (
          <div className={aStyles.modalOverlay}>
            <div className={aStyles.modalBox}>
              <div className={aStyles.modalHead}>
                <div>
                  <h2>{editingCitaId ? 'Editar cita' : 'Nueva cita'}</h2>
                  <p>{editingCitaId ? 'Modifica los datos de esta cita.' : 'Agenda una cita o seguimiento.'}</p>
                </div>

                <button className={aStyles.modalClose} onClick={() => { resetForm(); setShowForm(false) }}>
                  ×
                </button>
              </div>

              <form onSubmit={saveCita} className={aStyles.modalForm}>
                <div className={aStyles.field} style={{ gridColumn: '1/-1' }}>
                  <label>¿Cuál es la cita? *</label>
                  <input
                    value={formTitle}
                    onChange={e => setFormTitle(e.target.value)}
                    placeholder="Ej: Visita técnica inicial"
                    autoFocus
                  />
                </div>

                <div className={aStyles.field} style={{ gridColumn: '1/-1' }}>
                  <label>Cliente *</label>
                  {clientes.length > 0 ? (
                    <select value={formClientId} onChange={e => {
                      const selected = clientes.find(c => c.id === e.target.value)
                      setFormClientId(e.target.value)
                      if (selected) setFormClientName(selected.name)
                    }}>
                      <option value="">Selecciona un cliente…</option>
                      {clientes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      value={formClientName}
                      onChange={e => setFormClientName(e.target.value)}
                      placeholder="Nombre del cliente"
                    />
                  )}
                </div>

                {/* MINI CALENDARIO */}
                <div className={aStyles.field} style={{ gridColumn: '1/-1' }}>
                  <label>Fecha</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem', marginBottom: '.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setMiniCalendarMonth(m => m === 0 ? 11 : m - 1)}
                      style={{ padding: '.35rem', fontSize: '.75rem', background: '#f3f0ea', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                    >
                      ← {MONTHS_FULL[(miniCalendarMonth === 0 ? 11 : miniCalendarMonth - 1)].slice(0, 3)}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMiniCalendarMonth(m => m === 11 ? 0 : m + 1)}
                      style={{ padding: '.35rem', fontSize: '.75rem', background: '#f3f0ea', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                    >
                      {MONTHS_FULL[(miniCalendarMonth === 11 ? 0 : miniCalendarMonth + 1)].slice(0, 3)} →
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '.35rem', marginBottom: '.75rem' }}>
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                      <div key={d} style={{ textAlign: 'center', fontSize: '.65rem', fontWeight: 700, color: '#64748b' }}>
                        {d}
                      </div>
                    ))}

                    {Array.from({ length: new Date(miniCalendarYear, miniCalendarMonth, 1).getDay() === 0 ? 6 : new Date(miniCalendarYear, miniCalendarMonth, 1).getDay() - 1 }).map((_, i) => (
                      <div key={`e${i}`} />
                    ))}

                    {Array.from({ length: new Date(miniCalendarYear, miniCalendarMonth + 1, 0).getDate() }).map((_, i) => {
                      const d = i + 1
                      const dateStr = `${miniCalendarYear}-${String(miniCalendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                      const isSelected = formDate === dateStr

                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setFormDate(dateStr)}
                          style={{
                            padding: '.3rem',
                            borderRadius: 4,
                            border: isSelected ? '2px solid #2d5a27' : '1px solid #e5ddcf',
                            background: isSelected ? '#e8f5e9' : '#fff',
                            fontSize: '.75rem',
                            fontWeight: isSelected ? 700 : 400,
                            cursor: 'pointer',
                          }}
                        >
                          {d}
                        </button>
                      )
                    })}
                  </div>

                  <input
                    type="date"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    style={{ width: '100%', padding: '.5rem', border: '1px solid #cbd5e1', borderRadius: 4 }}
                  />
                </div>

                <div className={aStyles.field}>
                  <label>Hora</label>
                  <input type="time" value={formTime} onChange={e => setFormTime(e.target.value)} />
                </div>

                <div className={aStyles.field}>
                  <label>Lugar</label>
                  <input value={formPlace} onChange={e => setFormPlace(e.target.value)} placeholder="Ej: En casa del cliente" />
                </div>

                <div className={aStyles.field} style={{ gridColumn: '1/-1' }}>
                  <label>Notas</label>
                  <textarea
                    value={formNotes}
                    onChange={e => setFormNotes(e.target.value)}
                    placeholder="Qué llevar, qué revisar…"
                    rows={3}
                  />
                </div>

                <div className={aStyles.field} style={{ gridColumn: '1/-1' }}>
                  <label>Estado</label>
                  <select value={formEstado} onChange={e => setFormEstado(e.target.value)}>
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                <div className={aStyles.modalActions}>
                  <button type="button" className={styles.btnGhost} onClick={() => { resetForm(); setShowForm(false) }}>
                    Cancelar
                  </button>

                  {editingCitaId && (
                    <button
                      type="button"
                      className={`${styles.btnGhost}`}
                      style={{ color: '#991f1f', borderColor: '#fca5a5' }}
                      onClick={() => deleteCita(editingCitaId)}
                    >
                      🗑️ Eliminar
                    </button>
                  )}

                  <button type="submit" className={styles.btnDark}>
                    {editingCitaId ? 'Guardar cambios' : 'Crear cita'}
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
