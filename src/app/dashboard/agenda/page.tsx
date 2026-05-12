'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
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
  client_id: string | null
  client_name: string
  title: string
  date: string
  time: string
  place: string | null
  notes: string | null
  estado: 'nuevo' | 'contactado' | 'cita' | 'completado' | 'pendiente' | 'confirmada' | 'completada' | 'cancelada'
}

interface CitaFormData {
  title: string
  date: string
  time: string
  place: string
  notes: string
  clientId: string
  clientName: string
  estado: string
}

const STORAGE_KEYS = {
  NEW_CITA_FORM: 'form_agenda_new_cita',
  EDIT_CITA_FORM: (citaId: string) => `form_agenda_edit_cita_${citaId}`,
}

const getTodayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const getDefaultForm = (): CitaFormData => ({
  title: '',
  date: getTodayStr(),
  time: '10:00',
  place: '',
  notes: '',
  clientId: '',
  clientName: '',
  estado: 'pendiente',
})

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

const loadFormFromStorage = (key: string, defaultForm: CitaFormData): CitaFormData => {
  if (typeof window === 'undefined') return defaultForm
  try {
    const stored = localStorage.getItem(key)
    if (stored) return JSON.parse(stored)
  } catch (err) {
    console.error('Error loading form from storage:', err)
  }
  return defaultForm
}

const saveFormToStorage = (key: string, formData: CitaFormData) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(formData))
  } catch (err) {
    console.error('Error saving form to storage:', err)
  }
}

const clearFormStorage = (key: string) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch (err) {
    console.error('Error clearing form storage:', err)
  }
}

function AgendaContent() {
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
  const [error, setError] = useState('')

  const [miniCalendarMonth, setMiniCalendarMonth] = useState(today.getMonth())
  const [miniCalendarYear, setMiniCalendarYear] = useState(today.getFullYear())
  const [formData, setFormData] = useState<CitaFormData>(getDefaultForm())

  const loadData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data: citasData, error: citasError } = await supabase
        .from('citas')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true })

      if (!citasError) setCitas((citasData || []) as Cita[])

      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true })

      if (!clientesError) setClientes((clientesData || []) as Client[])
    } catch (err) {
      console.error('Error cargando datos:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/')
      return
    }
    loadData()
  }, [authLoading, user, loadData, router])

  useEffect(() => {
    const storedForm = loadFormFromStorage(STORAGE_KEYS.NEW_CITA_FORM, getDefaultForm())
    setFormData(storedForm)
  }, [])

  useEffect(() => {
    const clientId = searchParams.get('client_id')
    if (!clientId || clientes.length === 0) return

    const cliente = clientes.find(c => c.id === clientId)
    if (!cliente) return

    const updatedForm = {
      ...formData,
      clientId,
      clientName: cliente.name,
    }

    setFormData(updatedForm)
    saveFormToStorage(STORAGE_KEYS.NEW_CITA_FORM, updatedForm)
    setShowForm(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, clientes])

  const persistForm = (updatedForm: CitaFormData) => {
    if (editingCitaId) {
      saveFormToStorage(STORAGE_KEYS.EDIT_CITA_FORM(editingCitaId), updatedForm)
    } else {
      saveFormToStorage(STORAGE_KEYS.NEW_CITA_FORM, updatedForm)
    }
  }

  const handleFormChange = (field: keyof CitaFormData, value: string) => {
    const updatedForm = { ...formData, [field]: value }
    setFormData(updatedForm)
    persistForm(updatedForm)
  }

  const handleClientSelect = (clientId: string) => {
    const selected = clientes.find(c => c.id === clientId)

    const updatedForm = {
      ...formData,
      clientId,
      clientName: selected ? selected.name : '',
    }

    setFormData(updatedForm)
    persistForm(updatedForm)
  }

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = firstDay === 0 ? 6 : firstDay - 1

  const citasDelMes = citas.filter(c => {
    const [y, m] = c.date.split('-')
    return Number(y) === year && Number(m) === month + 1
  })

  const citasPorDia = citasDelMes.reduce((acc, cita) => {
    const day = Number(cita.date.split('-')[2])
    if (!acc[day]) acc[day] = []
    acc[day].push(cita)
    return acc
  }, {} as Record<number, Cita[]>)

  const selectedEvents = selectedDay ? (citasPorDia[selectedDay] || []) : []

  const proximasCitas = citas
    .filter(c => new Date(`${c.date}T${c.time}`) >= new Date())
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 6)

  const resetForm = () => {
    setFormData(getDefaultForm())
    setEditingCitaId(null)
    setMiniCalendarMonth(today.getMonth())
    setMiniCalendarYear(today.getFullYear())
    setError('')
  }

  const openNewCita = (day?: number) => {
    const storedForm = loadFormFromStorage(STORAGE_KEYS.NEW_CITA_FORM, getDefaultForm())

    if (day) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const updatedForm = { ...storedForm, date: dateStr }
      setFormData(updatedForm)
      saveFormToStorage(STORAGE_KEYS.NEW_CITA_FORM, updatedForm)
    } else {
      setFormData(storedForm)
    }

    setEditingCitaId(null)
    setMiniCalendarMonth(today.getMonth())
    setMiniCalendarYear(today.getFullYear())
    setError('')
    setShowForm(true)
  }

  const openEditCita = (cita: Cita) => {
    const editForm: CitaFormData = {
      title: cita.title || '',
      date: cita.date || getTodayStr(),
      time: cita.time || '10:00',
      place: cita.place || '',
      notes: cita.notes || '',
      clientId: cita.client_id || '',
      clientName: cita.client_name || '',
      estado: cita.estado || 'pendiente',
    }

    const storedForm = loadFormFromStorage(STORAGE_KEYS.EDIT_CITA_FORM(cita.id), editForm)

    setEditingCitaId(cita.id)
    setFormData(storedForm)
    setShowForm(true)
    setError('')
  }

  const saveCita = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return
    if (!formData.title.trim()) {
      setError('Escribe el título de la visita')
      return
    }
    if (!formData.clientId && !formData.clientName.trim()) {
      setError('Selecciona o escribe el cliente')
      return
    }

    const selectedClient = clientes.find(c => c.id === formData.clientId)

    const payload = {
      user_id: user.id,
      client_id: formData.clientId || null,
      client_name: formData.clientName.trim() || selectedClient?.name || '',
      title: formData.title.trim(),
      date: formData.date,
      time: formData.time,
      place: formData.place.trim(),
      notes: formData.notes.trim(),
      estado: formData.estado,
    }

    try {
      if (editingCitaId) {
        const { error: updateError } = await supabase
          .from('citas')
          .update(payload)
          .eq('id', editingCitaId)

        if (updateError) {
          setError('Error al actualizar: ' + updateError.message)
          return
        }

        clearFormStorage(STORAGE_KEYS.EDIT_CITA_FORM(editingCitaId))
      } else {
        const { error: insertError } = await supabase
          .from('citas')
          .insert([payload])

        if (insertError) {
          setError('Error al crear: ' + insertError.message)
          return
        }

        clearFormStorage(STORAGE_KEYS.NEW_CITA_FORM)
      }

      await loadData()
      resetForm()
      setShowForm(false)
      alert(editingCitaId ? '✅ Cita actualizada' : '✅ Cita creada')
    } catch (err) {
      console.error(err)
      setError('Error inesperado')
    }
  }

  const deleteCita = async (id: string) => {
    if (!confirm('¿Eliminar esta cita?')) return

    try {
      const { error: deleteError } = await supabase
        .from('citas')
        .delete()
        .eq('id', id)

      if (deleteError) {
        alert('Error: ' + deleteError.message)
        return
      }

      clearFormStorage(STORAGE_KEYS.EDIT_CITA_FORM(id))
      await loadData()
      resetForm()
      setShowForm(false)
      alert('✅ Cita eliminada')
    } catch (err) {
      console.error(err)
      alert('Error inesperado')
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setError('')
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

      <main className={styles.main} style={{ background: '#ffffff' }}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>📅 Agenda</h1>
            <p className={styles.phSub}>Toca una cita para editarla o añade una nueva.</p>
          </div>

          <button className={styles.btnDark} onClick={() => openNewCita()} style={{ background: '#2563eb' }}>
            + Nueva cita
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

                    {dayEvents.slice(0, maxShow).map((cita) => {
                      const clientColor = getClientColor(cita.client_name || '')
                      return (
                        <button
                          key={cita.id}
                          type="button"
                          className={aStyles.calEvent}
                          style={{
                            background: getClientBg(clientColor),
                            color: getClientTextColor(clientColor),
                            borderLeft: `3px solid ${clientColor}`,
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
                          {cita.place && <span style={{ fontSize: '.6rem', opacity: 0.85 }}>📍 {cita.place.slice(0, 15)}{cita.place.length > 15 ? '…' : ''}</span>}
                          {cita.notes && (
                            <span style={{ fontSize: '.6rem', opacity: 0.75, fontStyle: 'italic' }}>
                              {cita.notes.slice(0, 20)}{cita.notes.length > 20 ? '…' : ''}
                            </span>
                          )}
                        </button>
                      )
                    })}

                    {dayEvents.length > maxShow && <div className={aStyles.moreEvents}>+{dayEvents.length - maxShow} más</div>}
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
                    <span style={{ marginLeft: '.5rem', fontSize: '.78rem', color: '#64748b', fontWeight: 400 }}>
                      {selectedEvents.length} cita{selectedEvents.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <button className={styles.btnDark} style={{ padding: '.35rem .7rem', fontSize: '.78rem', background: '#2563eb' }} onClick={() => openNewCita(selectedDay)}>
                    + Añadir
                  </button>
                </div>

                {selectedEvents.length > 0 ? selectedEvents.map((cita) => (
                  <div key={cita.id} className={aStyles.evItem} onClick={() => openEditCita(cita)}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: getClientColor(cita.client_name || ''), flexShrink: 0, marginTop: '.35rem' }} />
                    <div style={{ flex: 1 }}>
                      <div className={aStyles.evTitle}>{cita.title}</div>
                      <div className={aStyles.evClient}>{cita.time} · {cita.client_name}</div>
                    </div>
                    <button className={aStyles.icoBtn} onClick={(e) => { e.stopPropagation(); openEditCita(cita) }}>✎</button>
                    <button className={`${aStyles.icoBtn} ${aStyles.del}`} onClick={(e) => { e.stopPropagation(); deleteCita(cita.id) }}>🗑</button>
                  </div>
                )) : (
                  <div style={{ padding: '1.5rem 0', textAlign: 'center', color: '#94a3b8', fontSize: '.875rem' }}>
                    Sin citas este día.
                    <br />
                    <button style={{ marginTop: '.65rem', padding: '.45rem .9rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }} onClick={() => openNewCita(selectedDay)}>
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
                  const [, m, d] = cita.date.split('-')
                  return (
                    <div key={cita.id} className={aStyles.evItem} onClick={() => { setSelectedDay(Number(d)); openEditCita(cita) }}>
                      <div className={aStyles.evDate}>
                        <span style={{ fontSize: '.58rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>{MONTHS_FULL[Number(m) - 1].slice(0, 3)}</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'Syne', lineHeight: 1, color: '#0a0f14' }}>{d}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className={aStyles.evTitle}>{cita.title}</div>
                        <div className={aStyles.evClient}>{cita.time} · {cita.client_name}</div>
                      </div>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: getClientColor(cita.client_name || ''), flexShrink: 0 }} />
                    </div>
                  )
                }) : (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '.875rem' }}>No hay citas próximas</div>
                )}
              </div>
            )}
          </div>
        </div>

        {showForm && (
          <div className={aStyles.modalOverlay}>
            <div className={aStyles.modalBox}>
              <div className={aStyles.modalHead}>
                <div>
                  <h2>{editingCitaId ? 'Editar cita' : 'Nueva cita'}</h2>
                  <p>{editingCitaId ? 'Modifica los datos de esta cita.' : 'Agenda una cita o seguimiento.'}</p>
                </div>
                <button className={aStyles.modalClose} onClick={handleCloseForm}>×</button>
              </div>

              <form onSubmit={saveCita} className={aStyles.modalForm}>
                {error && (
                  <div style={{ background: '#fee2e2', color: '#991f1f', padding: '.75rem 1rem', borderRadius: '6px', fontSize: '.85rem', borderLeft: '4px solid #dc2626', gridColumn: '1/-1' }}>
                    {error}
                  </div>
                )}

                <div className={aStyles.field} style={{ gridColumn: '1/-1' }}>
                  <label>¿Cuál es la cita? *</label>
                  <input value={formData.title} onChange={e => handleFormChange('title', e.target.value)} placeholder="Ej: Visita técnica inicial" autoFocus />
                </div>

                <div className={aStyles.field} style={{ gridColumn: '1/-1' }}>
                  <label>Cliente *</label>
                  {clientes.length > 0 ? (
                    <select
                      value={formData.clientId || ''}
                      onChange={e => handleClientSelect(e.target.value)}
                      style={{ width: '100%', padding: '.65rem .85rem', background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: 8, fontSize: '.875rem', fontFamily: 'inherit', color: '#0a0f14', cursor: 'pointer' }}
                    >
                      <option value="">Selecciona un cliente…</option>
                      {clientes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  ) : (
                    <input value={formData.clientName || ''} onChange={e => handleFormChange('clientName', e.target.value)} placeholder="Escribe el nombre del cliente" />
                  )}
                </div>

                <div className={aStyles.field} style={{ gridColumn: '1/-1' }}>
                  <label>Fecha</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem', marginBottom: '.75rem' }}>
                    <button type="button" onClick={() => setMiniCalendarMonth(m => m === 0 ? 11 : m - 1)} style={{ padding: '.35rem', fontSize: '.75rem', background: '#f3f0ea', border: 'none', borderRadius: 4, cursor: 'pointer' }}>← {MONTHS_FULL[(miniCalendarMonth === 0 ? 11 : miniCalendarMonth - 1)].slice(0, 3)}</button>
                    <button type="button" onClick={() => setMiniCalendarMonth(m => m === 11 ? 0 : m + 1)} style={{ padding: '.35rem', fontSize: '.75rem', background: '#f3f0ea', border: 'none', borderRadius: 4, cursor: 'pointer' }}>{MONTHS_FULL[(miniCalendarMonth === 11 ? 0 : miniCalendarMonth + 1)].slice(0, 3)} →</button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '.35rem', marginBottom: '.75rem' }}>
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => <div key={d} style={{ textAlign: 'center', fontSize: '.65rem', fontWeight: 700, color: '#64748b' }}>{d}</div>)}
                    {Array.from({ length: new Date(miniCalendarYear, miniCalendarMonth, 1).getDay() === 0 ? 6 : new Date(miniCalendarYear, miniCalendarMonth, 1).getDay() - 1 }).map((_, i) => <div key={`e${i}`} />)}
                    {Array.from({ length: new Date(miniCalendarYear, miniCalendarMonth + 1, 0).getDate() }).map((_, i) => {
                      const d = i + 1
                      const dateStr = `${miniCalendarYear}-${String(miniCalendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                      const isSelected = formData.date === dateStr
                      return (
                        <button key={d} type="button" onClick={() => handleFormChange('date', dateStr)} style={{ padding: '.3rem', borderRadius: 4, border: isSelected ? '2px solid #2563eb' : '1px solid #e5ddcf', background: isSelected ? '#dbeafe' : '#fff', fontSize: '.75rem', fontWeight: isSelected ? 700 : 400, cursor: 'pointer', color: isSelected ? '#1d4ed8' : '#0a0f14' }}>{d}</button>
                      )
                    })}
                  </div>

                  <input type="date" value={formData.date} onChange={e => handleFormChange('date', e.target.value)} style={{ width: '100%', padding: '.5rem', border: '1px solid #cbd5e1', borderRadius: 4 }} />
                </div>

                <div className={aStyles.field}>
                  <label>Hora</label>
                  <input type="time" value={formData.time} onChange={e => handleFormChange('time', e.target.value)} />
                </div>

                <div className={aStyles.field}>
                  <label>Lugar</label>
                  <input value={formData.place} onChange={e => handleFormChange('place', e.target.value)} placeholder="Ej: En casa del cliente" />
                </div>

                <div className={aStyles.field} style={{ gridColumn: '1/-1' }}>
                  <label>Notas</label>
                  <textarea value={formData.notes} onChange={e => handleFormChange('notes', e.target.value)} placeholder="Qué llevar, qué revisar…" rows={3} />
                </div>

                <div className={aStyles.field} style={{ gridColumn: '1/-1' }}>
                  <label>Estado</label>
                  <select value={formData.estado} onChange={e => handleFormChange('estado', e.target.value)}>
                    <option value="pendiente">Pendiente</option>
                    <option value="confirmada">Confirmada</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                <div className={aStyles.modalActions}>
                  <button type="button" className={styles.btnGhost} onClick={handleCloseForm}>Cancelar</button>
                  {editingCitaId && (
                    <button type="button" className={styles.btnGhost} style={{ color: '#991f1f', borderColor: '#fca5a5' }} onClick={() => deleteCita(editingCitaId)}>🗑️ Eliminar</button>
                  )}
                  <button type="submit" className={styles.btnDark} style={{ background: '#2563eb' }}>{editingCitaId ? 'Guardar cambios' : 'Crear cita'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function Agenda() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><p>Cargando agenda…</p></div>}>
      <AgendaContent />
    </Suspense>
  )
}


