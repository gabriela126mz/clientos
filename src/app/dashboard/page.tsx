'use client'
import Link from 'next/link'
import styles from './page.module.css'

const NAV = [
  { href: '/dashboard', label: 'Panel', section: 'General', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { href: '/dashboard/clientes', label: 'Clientes', section: 'Negocio', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="7" r="3"/><path d="M3 21v-1a5 5 0 015-5h2a5 5 0 015 5v1"/><path d="M16 3.13a4 4 0 010 7.75M21 21v-1a4 4 0 00-3-3.85"/></svg> },
  { href: '/dashboard/agenda', label: 'Agenda', section: '', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { href: '/dashboard/presupuestos', label: 'Presupuestos', section: '', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/></svg> },
  { href: '/dashboard/facturas', label: 'Facturas', section: '', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg> },
  { href: '/dashboard/mi-negocio', label: 'Mi negocio', section: 'Mi web', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1"/></svg> },
  { href: '/dashboard/qr', label: 'QR y landing', section: '', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { href: '/dashboard/plan', label: 'Plan y pagos', section: 'Cuenta', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
]

export function Sidebar({ active }: { active: string }) {
  let lastSection = ''
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>Clientos <span className={styles.brandDot}></span></div>
      <nav style={{ flex: 1 }}>
        {NAV.map(item => {
          const showSection = item.section && item.section !== lastSection
          if (showSection) lastSection = item.section
          return (
            <div key={item.href}>
              {showSection && <div className={styles.navSection}>{item.section}</div>}
              <Link href={item.href} className={`${styles.navBtn} ${active === item.href ? styles.active : ''}`}>
                {item.icon}{item.label}
              </Link>
            </div>
          )
        })}
      </nav>
      <div className={styles.sbFoot}>
        <div className={styles.userChip}>
          <div className={styles.avatar}>G</div>
          <div>
            <div className={styles.userName}>Gabriela</div>
            <div className={styles.userRole}>Jardinería</div>
          </div>
        </div>
        <button className={styles.logoutBtn}>Cerrar sesión</button>
      </div>
    </aside>
  )
}

export default function Dashboard() {
  const today = new Date()
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  const monthsFull = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = firstDay === 0 ? 6 : firstDay - 1

  const agenda = [
    { time: '10:00', title: 'Visita técnica olivo', client: 'Carmen Ruiz', place: 'C/ Alcalá 45, Madrid', day: today.getDate() + 1, isToday: false },
    { time: '16:30', title: 'Revisión riego', client: 'Javier Romero', place: 'Urb. Los Pinos, Pozuelo', day: today.getDate() + 3, isToday: false },
    { time: '11:00', title: 'Entrega proyecto piscina', client: 'Pedro Alonso', place: 'Av. Principal 10, Madrid', day: today.getDate() + 7, isToday: false },
    { time: '09:00', title: 'Presupuesto jardín', client: 'Lucía Navarro', place: 'C/ Olmos 3, Madrid', day: today.getDate() + 10, isToday: false },
  ]

  const eventDays = new Set(agenda.map(a => a.day))

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard" />
      <main className={styles.main}>

        {/* HEADER LIMPIO */}
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Buenos días, Gabriela 👋</h1>
            <p className={styles.phSub}>Jardines Mediterráneos · {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          </div>
          <div className={styles.phActions}>
            <Link href="/dashboard/clientes" className={styles.btnGhost}>+ Cliente</Link>
            <Link href="/dashboard/presupuestos" className={styles.btnGhost}>+ Presupuesto</Link>
            <Link href="/dashboard/agenda" className={styles.btnGold}>+ Visita</Link>
          </div>
        </div>

        {/* STATS — 4 cifras clave */}
        <div className={styles.stats}>
          {[
            { label: 'Clientes', value: '50', sub: '3 nuevos esta semana', color: 'gold' },
            { label: 'Cobrado este mes', value: '4.820€', sub: '3 facturas pagadas', color: 'green' },
            { label: 'Por cobrar', value: '8.450€', sub: '5 presupuestos abiertos', color: 'blue' },
            { label: 'Visitas esta semana', value: '3', sub: 'Próxima: mañana 10:00', color: 'accent' },
          ].map(s => (
            <div key={s.label} className={`${styles.stat} ${styles[s.color as keyof typeof styles]}`}>
              <div className={styles.statLbl}>{s.label}</div>
              <div className={styles.statVal}>{s.value}</div>
              <div className={styles.statSub}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* LAYOUT PRINCIPAL: agenda grande + calendario */}
        <div className={styles.dashMain}>

          {/* AGENDA — protagonista */}
          <div className={styles.card}>
            <div className={styles.cardH}>
              <div className={styles.cardT}>📅 Próximas visitas</div>
              <Link href="/dashboard/agenda" className={styles.cardLink}>Ver agenda completa →</Link>
            </div>
            <div className={styles.agendaList}>
              {agenda.map((a, i) => (
                <div key={i} className={styles.agendaItem}>
                  {/* Fecha visual */}
                  <div className={styles.agendaDate}>
                    <span className={styles.agendaMonth}>{months[month]}</span>
                    <span className={styles.agendaDay}>{a.day}</span>
                  </div>
                  {/* Info */}
                  <div className={styles.agendaInfo}>
                    <div className={styles.agendaTitle}>{a.title}</div>
                    <div className={styles.agendaClient}>
                      <span className={styles.agendaClientName}>{a.client}</span>
                      <span className={styles.agendaPlace}>📍 {a.place}</span>
                    </div>
                  </div>
                  {/* Hora */}
                  <div className={styles.agendaTime}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CALENDARIO — compacto pero útil */}
          <div className={styles.card}>
            <div className={styles.cardH}>
              <div className={styles.cardT}>{monthsFull[month]} {year}</div>
            </div>
            <div className={styles.calGrid}>
              {['L','M','X','J','V','S','D'].map(d => (
                <div key={d} className={styles.calDayName}>{d}</div>
              ))}
              {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1
                const isToday = d === today.getDate()
                const hasEvent = eventDays.has(d)
                return (
                  <div key={d} className={`${styles.calDay} ${isToday ? styles.calToday : ''}`}>
                    {d}
                    {hasEvent && <span className={styles.calDot} />}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
