'use client'
import Link from 'next/link'
import styles from './page.module.css'

const NAV = [
  { href: '/dashboard', label: 'Panel', section: 'General', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { href: '/dashboard/clientes', label: 'Clientes', section: 'Negocio', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="7" r="3"/><path d="M3 21v-1a5 5 0 015-5h2a5 5 0 015 5v1"/><path d="M16 3.13a4 4 0 010 7.75M21 21v-1a4 4 0 00-3-3.85"/></svg> },
  { href: '/dashboard/agenda', label: 'Agenda', section: '', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { href: '/dashboard/presupuestos', label: 'Presupuestos', section: '', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
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
  const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']

  // Generar días del mes actual para el mini calendario
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = firstDay === 0 ? 6 : firstDay - 1

  const agenda = [
    { time: '10:00', title: 'Visita técnica olivo', client: 'Carmen Ruiz', day: today.getDate() + 1 },
    { time: '16:30', title: 'Revisión riego', client: 'Javier Romero', day: today.getDate() + 3 },
    { time: '11:00', title: 'Entrega proyecto', client: 'Pedro Alonso', day: today.getDate() + 7 },
  ]

  const eventDays = new Set(agenda.map(a => a.day))

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard" />
      <main className={styles.main}>

        {/* HEADER SUPER LIMPIO */}
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Buenos días, Gabriela 👋</h1>
            <p className={styles.phSub}>Sábado, 26 de abril · Jardines Mediterráneos</p>
          </div>
          <div className={styles.phActions}>
            <Link href="/dashboard/clientes" className={styles.btnGhost}>+ Cliente</Link>
            <Link href="/dashboard/presupuestos" className={styles.btnGhost}>+ Presupuesto</Link>
            <Link href="/dashboard/agenda" className={styles.btnGold}>+ Visita</Link>
          </div>
        </div>

        {/* STATS — solo 4, muy limpias */}
        <div className={styles.stats}>
          {[
            { label: 'Clientes', value: '50', sub: '3 nuevos', color: 'gold' },
            { label: 'Cobrado', value: '4.820€', sub: 'este mes', color: 'green' },
            { label: 'Pendiente cobrar', value: '8.450€', sub: '5 presupuestos', color: 'blue' },
            { label: 'Visitas esta semana', value: '3', sub: 'próxima: mañana', color: 'accent' },
          ].map(s => (
            <div key={s.label} className={`${styles.stat} ${styles[s.color as keyof typeof styles]}`}>
              <div className={styles.statLbl}>{s.label}</div>
              <div className={styles.statVal}>{s.value}</div>
              <div className={styles.statSub}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* DOS COLUMNAS: calendario + agenda del día */}
        <div className={styles.dashGrid}>
          <div className={styles.dashCol}>

            {/* CALENDARIO VISUAL */}
            <div className={styles.card}>
              <div className={styles.cardH}>
                <div className={styles.cardT}>
                  {months[month]} {year}
                </div>
                <Link href="/dashboard/agenda" className={styles.cardLink}>Ver agenda completa →</Link>
              </div>
              <div className={styles.calGrid}>
                {['L','M','X','J','V','S','D'].map(d => (
                  <div key={d} className={styles.calDayName}>{d}</div>
                ))}
                {Array.from({ length: offset }).map((_, i) => (
                  <div key={`e${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const d = i + 1
                  const isToday = d === today.getDate()
                  const hasEvent = eventDays.has(d)
                  return (
                    <div
                      key={d}
                      className={`${styles.calDay} ${isToday ? styles.calToday : ''}`}
                    >
                      {d}
                      {hasEvent && <span className={styles.calDot}></span>}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ÚLTIMOS CLIENTES */}
            <div className={styles.card} style={{ padding: 0 }}>
              <div className={styles.cardH} style={{ padding: '1.1rem 1.35rem 0' }}>
                <div className={styles.cardT}>Últimos clientes</div>
                <Link href="/dashboard/clientes" className={styles.cardLink}>Ver CRM →</Link>
              </div>
              <table className={styles.tbl}>
                <thead>
                  <tr><th>Nombre</th><th>Teléfono</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Carmen Ruiz', tel: '+34 611 222 333', estado: 'completado' },
                    { name: 'Javier Romero', tel: '+34 677 888 999', estado: 'cita' },
                    { name: 'María García', tel: '+34 699 000 111', estado: 'nuevo' },
                    { name: 'Pedro Alonso', tel: '+34 622 111 222', estado: 'contactado' },
                  ].map(c => (
                    <tr key={c.name}>
                      <td><strong>{c.name}</strong></td>
                      <td style={{ color: 'var(--grey)' }}>{c.tel}</td>
                      <td>
                        <span className={`${styles.bdg} ${styles[`b${c.estado.charAt(0).toUpperCase() + c.estado.slice(1)}` as keyof typeof styles]}`}>
                          {c.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* COLUMNA DERECHA: agenda próxima + docs */}
          <div className={styles.dashCol}>
            <div className={styles.card}>
              <div className={styles.cardH}>
                <div className={styles.cardT}>Próximas visitas</div>
                <Link href="/dashboard/agenda" className={styles.cardLink}>Ver →</Link>
              </div>
              {agenda.map((a, i) => (
                <div key={i} style={{
                  padding: '.85rem 0',
                  borderBottom: i < agenda.length - 1 ? '1px solid var(--bg2)' : 'none',
                  display: 'flex', gap: '1rem', alignItems: 'center'
                }}>
                  <div style={{
                    background: 'var(--gold2)', borderRadius: 'var(--r)',
                    padding: '.4rem .6rem', textAlign: 'center', flexShrink: 0
                  }}>
                    <div style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--grey)', textTransform: 'uppercase' }}>
                      {months[month]}
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'Syne', lineHeight: 1 }}>
                      {a.day}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '.875rem' }}>{a.title}</div>
                    <div style={{ fontSize: '.76rem', color: 'var(--grey)', marginTop: '.1rem' }}>
                      {a.time} · {a.client}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.card} style={{ padding: 0 }}>
              <div className={styles.cardH} style={{ padding: '1.1rem 1.35rem 0' }}>
                <div className={styles.cardT}>Documentos recientes</div>
                <Link href="/dashboard/presupuestos" className={styles.cardLink}>Ver →</Link>
              </div>
              <table className={styles.tbl}>
                <thead>
                  <tr><th>Número</th><th>Cliente</th><th>Total</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {[
                    { ref: 'PRES-2026-001', client: 'Carmen Ruiz', amount: '694€', status: 'sent' },
                    { ref: 'FAC-2026-015', client: 'Javier Romero', amount: '823€', status: 'paid' },
                    { ref: 'PRES-2026-002', client: 'Bufete Martín', amount: '3.872€', status: 'draft' },
                  ].map(d => (
                    <tr key={d.ref}>
                      <td><strong>{d.ref}</strong></td>
                      <td style={{ color: 'var(--grey)' }}>{d.client}</td>
                      <td><strong>{d.amount}</strong></td>
                      <td>
                        <span className={`${styles.bdg} ${styles[`b${d.status.charAt(0).toUpperCase() + d.status.slice(1)}` as keyof typeof styles]}`}>
                          {{ draft: 'Borrador', sent: 'Enviado', paid: 'Pagado' }[d.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}