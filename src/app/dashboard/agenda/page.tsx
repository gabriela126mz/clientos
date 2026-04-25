'use client'
import { useState } from 'react'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import aStyles from './agenda.module.css'

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS_SHORT = ['L','M','X','J','V','S','D']

const EVENTS = [
  { day: 26, time: '10:00', title: 'Visita técnica olivo', client: 'Carmen Ruiz' },
  { day: 28, time: '16:30', title: 'Revisión riego automático', client: 'Javier Romero' },
  { day: 30, time: '09:00', title: 'Mantenimiento mensual', client: 'Bufete Martín' },
  { day: 2,  time: '11:00', title: 'Entrega proyecto piscina', client: 'Pedro Alonso' },
]

export default function Agenda() {
  const today = new Date()
  const [viewDate, setViewDate] = useState(today)
  const [showForm, setShowForm] = useState(false)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = firstDay === 0 ? 6 : firstDay - 1

  const eventDays = new Set(EVENTS.map(e => e.day))

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/agenda" />
      <main className={styles.main}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Agenda</h1>
            <p className={styles.phSub}>Visitas y citas con clientes.</p>
          </div>
          <button className={styles.btnDark} onClick={() => setShowForm(true)}>+ Nueva visita</button>
        </div>

        {showForm && (
          <div className={aStyles.formCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
              <div className={styles.cardT}>Nueva visita</div>
              <button onClick={() => setShowForm(false)} style={{ width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', cursor: 'pointer', fontSize: '1.1rem', color: 'var(--grey)' }}>×</button>
            </div>
            <div className={aStyles.formGrid}>
              <div className={aStyles.field} style={{ gridColumn: '1/-1' }}>
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
              <div className={aStyles.field} style={{ gridColumn: '1/-1' }}>
                <label>Cliente</label>
                <select>
                  <option>Selecciona un cliente…</option>
                  <option>Carmen Ruiz</option>
                  <option>Javier Romero</option>
                  <option>Bufete Martín</option>
                </select>
              </div>
              <div className={aStyles.field} style={{ gridColumn: '1/-1' }}>
                <label>Notas</label>
                <textarea placeholder="Qué llevar, qué revisar…" rows={2} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '.55rem', marginTop: '1rem' }}>
              <button className={styles.btnGhost} onClick={() => setShowForm(false)}>Cancelar</button>
              <button className={styles.btnDark} onClick={() => setShowForm(false)}>Guardar visita</button>
            </div>
          </div>
        )}

        <div className={aStyles.layout}>
          {/* CALENDARIO */}
          <div className={styles.card}>
            <div className={styles.cardH}>
              <button className={styles.btnGhost} style={{ padding: '.35rem .7rem', fontSize: '.78rem' }}
                onClick={() => setViewDate(new Date(year, month - 1, 1))}>←</button>
              <div className={styles.cardT} style={{ textTransform: 'capitalize' }}>
                {MONTHS[month]} {year}
              </div>
              <button className={styles.btnGhost} style={{ padding: '.35rem .7rem', fontSize: '.78rem' }}
                onClick={() => setViewDate(new Date(year, month + 1, 1))}>→</button>
            </div>
            <div className={aStyles.calGrid}>
              {DAYS_SHORT.map(d => (
                <div key={d} className={aStyles.calDayName}>{d}</div>
              ))}
              {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1
                const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                const hasEvent = eventDays.has(d)
                return (
                  <div key={d} className={`${aStyles.calDay} ${isToday ? aStyles.today : ''}`}
                    onClick={() => setShowForm(true)}>
                    {d}
                    {hasEvent && <span className={aStyles.dot} />}
                  </div>
                )
              })}
            </div>
          </div>

          {/* LISTA VISITAS */}
          <div className={styles.card} style={{ padding: 0 }}>
            <div className={styles.cardH} style={{ padding: '1.1rem 1.35rem 0' }}>
              <div className={styles.cardT}>Todas las visitas</div>
            </div>
            <table className={styles.tbl}>
              <thead>
                <tr><th>Fecha</th><th>Hora</th><th>Visita</th><th>Cliente</th><th></th></tr>
              </thead>
              <tbody>
                {EVENTS.map((e, i) => (
                  <tr key={i}>
                    <td><strong>{String(e.day).padStart(2,'0')}/04/2026</strong></td>
                    <td style={{ color: 'var(--grey)' }}>{e.time}</td>
                    <td>{e.title}</td>
                    <td style={{ color: 'var(--grey)' }}>{e.client}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '.15rem', justifyContent: 'flex-end' }}>
                        <button className={aStyles.icoBtn}>✎</button>
                        <button className={`${aStyles.icoBtn} ${aStyles.del}`}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}