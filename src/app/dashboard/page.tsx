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

function Sidebar({ active }: { active: string }) {
  let lastSection = ''
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        Clientos <span className={styles.brandDot}></span>
      </div>
      <nav style={{ flex: 1 }}>
        {NAV.map(item => {
          const showSection = item.section && item.section !== lastSection
          if (showSection) lastSection = item.section
          return (
            <div key={item.href}>
              {showSection && <div className={styles.navSection}>{item.section}</div>}
              <Link
                href={item.href}
                className={`${styles.navBtn} ${active === item.href ? styles.active : ''}`}
              >
                {item.icon}
                {item.label}
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
  const stats = [
    { label: 'Clientes totales', value: '50', sub: '3 nuevos sin atender', color: 'gold' },
    { label: 'Facturado cobrado', value: '4.820€', sub: '3 facturas pagadas', color: 'green' },
    { label: 'Presupuestos abiertos', value: '5', sub: 'pendientes de cierre', color: 'blue' },
    { label: 'Próximas visitas', value: '3', sub: 'en agenda', color: 'accent' },
  ]

  const recentDocs = [
    { num: 'TRB-001', ref: 'PRES-2026-001', client: 'Carmen Ruiz', amount: '694€', status: 'sent' },
    { num: 'TRB-002', ref: 'FAC-2026-015', client: 'Javier Romero', amount: '823€', status: 'paid' },
    { num: 'TRB-003', ref: 'PRES-2026-002', client: 'Bufete Martín', amount: '3.872€', status: 'draft' },
  ]

  const upcoming = [
    { date: 'Mañana', time: '10:00', title: 'Visita técnica olivo', client: 'Carmen Ruiz' },
    { date: '28 abr', time: '16:30', title: 'Revisión riego automático', client: 'Javier Romero' },
    { date: '01 may', time: '11:00', title: 'Entrega proyecto piscina', client: 'Pedro Alonso' },
  ]

  const pipeline = [
    { label: 'Nuevos', count: 12, total: 50, color: '#2563eb' },
    { label: 'Contactados', count: 18, total: 50, color: '#ea580c' },
    { label: 'Cita agendada', count: 10, total: 50, color: '#e8a820' },
    { label: 'Completados', count: 10, total: 50, color: '#16a34a' },
  ]

  const badgeClass: Record<string, string> = {
    draft: styles.bDraft,
    sent: styles.bSent,
    paid: styles.bPaid,
    overdue: styles.bOver,
  }

  const badgeLabel: Record<string, string> = {
    draft: 'Borrador', sent: 'Enviado', paid: 'Pagado', overdue: 'Vencido',
  }

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard" />
      <main className={styles.main}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Buenos días, Gabriela 👋</h1>
            <p className={styles.phSub}>Jardines Mediterráneos</p>
          </div>
          <div className={styles.phActions}>
            <button className={styles.btnGhost}>+ Cliente rápido</button>
            <button className={styles.btnGold}>Ver mi landing →</button>
          </div>
        </div>

        <div className={styles.stats}>
          {stats.map(s => (
            <div key={s.label} className={`${styles.stat} ${styles[s.color]}`}>
              <div className={styles.statLbl}>{s.label}</div>
              <div className={styles.statVal}>{s.value}</div>
              <div className={styles.statSub}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className={styles.dashGrid}>
          <div className={styles.dashCol}>
            <div className={styles.card} style={{ padding: 0 }}>
              <div className={styles.cardH} style={{ padding: '1.1rem 1.35rem 0' }}>
                <div className={styles.cardT}>Últimos documentos</div>
                <Link href="/dashboard/presupuestos" className={styles.cardLink}>Ver todos →</Link>
              </div>
              <table className={styles.tbl}>
                <thead>
                  <tr>
                    <th>N.Trabajo</th>
                    <th>Número</th>
                    <th>Cliente</th>
                    <th>Importe</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDocs.map(d => (
                    <tr key={d.ref}>
                      <td style={{ color: 'var(--grey)' }}>{d.num}</td>
                      <td><strong>{d.ref}</strong></td>
                      <td>{d.client}</td>
                      <td><strong>{d.amount}</strong></td>
                      <td>
                        <span className={`${styles.bdg} ${badgeClass[d.status]}`}>
                          {badgeLabel[d.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.card}>
              <div className={styles.cardH}>
                <div className={styles.cardT}>Pipeline de clientes</div>
                <Link href="/dashboard/clientes" className={styles.cardLink}>CRM →</Link>
              </div>
              <div className={styles.pipeBar}>
                {pipeline.map(p => (
                  <div key={p.label} className={styles.pipeRow}>
                    <div className={styles.pipeRowHead}>
                      <span className={styles.pipeRowLabel}>{p.label}</span>
                      <span className={styles.pipeRowCount} style={{ color: p.color }}>{p.count}</span>
                    </div>
                    <div className={styles.pipeBar2}>
                      <div
                        className={styles.pipeBar2Inner}
                        style={{ width: `${(p.count / p.total) * 100}%`, background: p.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.dashCol}>
            <div className={styles.card}>
              <div className={styles.cardH}>
                <div className={styles.cardT}>Agenda próxima</div>
                <Link href="/dashboard/agenda" className={styles.cardLink}>Ver →</Link>
              </div>
              {upcoming.map((a, i) => (
                <div key={i} style={{ padding: '.7rem 0', borderBottom: i < upcoming.length - 1 ? '1px solid var(--bg2)' : 'none' }}>
                  <div style={{ fontSize: '.73rem', color: 'var(--grey)', marginBottom: '.12rem' }}>
                    {a.date} · {a.time}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '.865rem' }}>{a.title}</div>
                  <div style={{ fontSize: '.76rem', color: 'var(--grey)', marginTop: '.08rem' }}>{a.client}</div>
                </div>
              ))}
            </div>

            <div className={styles.card}>
              <div className={styles.cardH}>
                <div className={styles.cardT}>Actividad reciente</div>
              </div>
              <div className={styles.actFeed}>
                {[
                  { ico: '📥', cl: 'b', text: <><strong>Carmen Ruiz</strong> añadida al CRM</>, time: 'hace 2 min' },
                  { ico: '✅', cl: 'g', text: <>Factura pagada: <strong>823€</strong></>, time: 'hace 1h' },
                  { ico: '📅', cl: 'y', text: <>Visita con <strong>Javier Romero</strong></>, time: 'hace 3h' },
                ].map((a, i) => (
                  <div key={i} className={styles.actItem}>
                    <div className={`${styles.actIco} ${styles[a.cl]}`}>{a.ico}</div>
                    <div>
                      <div className={styles.actTxt}>{a.text}</div>
                      <div className={styles.actTime}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}