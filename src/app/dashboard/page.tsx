'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/context'
import type { Cita } from '@/lib/types'
import styles from './page.module.css'

const NAV = [
  { href: '/dashboard', label: 'Panel', section: 'General', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { href: '/dashboard/clientes', label: 'Clientes', section: 'Negocio', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="7" r="3"/><path d="M3 21v-1a5 5 0 015-5h2a5 5 0 015 5v1"/><path d="M16 3.13a4 4 0 010 7.75M21 21v-1a4 4 0 00-3-3.85"/></svg> },
  { href: '/dashboard/agenda', label: 'Agenda', section: '', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { href: '/dashboard/documentos', label: 'Documentos', section: '', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/></svg> },
  { href: '/dashboard/mi-negocio', label: 'Mi negocio', section: 'Mi web', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1"/></svg> },
  { href: '/dashboard/qr', label: 'QR y landing', section: '', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { href: '/dashboard/plan', label: 'Plan y pagos', section: 'Cuenta', icon: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
]

export function Sidebar({ active }: { active: string }) {
  const { user, profile } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  let lastSection = ''

  const sessionName =
    profile?.owner_name ||
    (user?.user_metadata?.nombre_contacto as string | undefined) ||
    user?.email?.split('@')[0] ||
    'Emprendedor'

  const businessName =
    profile?.business_name ||
    (user?.user_metadata?.nombre_negocio as string | undefined) ||
    'Mi negocio'

  const activeLabel = NAV.find(item => item.href === active)?.label || 'Panel'
  const closeSidebar = () => setSidebarOpen(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <>
      <header className={styles.mobileTopbar}>
        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          <span />
          <span />
          <span />
        </button>

        <div className={styles.mobileTopbarTitleWrap}>
          <div className={styles.mobileBrand}>Emprenix <span className={styles.brandDot}></span></div>
          <div className={styles.mobileTitle}>{activeLabel}</div>
        </div>
      </header>

      <button
        type="button"
        aria-label="Cerrar menú"
        className={`${styles.sidebarOverlay} ${sidebarOpen ? styles.show : ''}`}
        onClick={closeSidebar}
      />

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHead}>
          <div className={styles.brand}>Emprenix <span className={styles.brandDot}></span></div>
          <button
            type="button"
            className={styles.sidebarClose}
            onClick={closeSidebar}
            aria-label="Cerrar menú"
          >
            ×
          </button>
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
                  onClick={closeSidebar}
                  className={`${styles.navBtn} ${active === item.href ? styles.active : ''}`}
                >
                  {item.icon}{item.label}
                </Link>
              </div>
            )
          })}
        </nav>

        <div className={styles.sbFoot}>
          <div className={styles.userChip}>
            <div className={styles.avatar}>
              {(sessionName || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className={styles.userName}>{sessionName}</div>
              <div className={styles.userRole}>{businessName}</div>
            </div>
          </div>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  )
}

interface DashboardStats {
  totalClientes: number
  citasEstaSemana: number
  cobradoEsteMes: number
  porCobrar: number
  presupuestosAbiertos: number
}

export default function Dashboard() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [citas, setCitas] = useState<Cita[]>([])

  const sessionName =
    profile?.owner_name ||
    (user?.user_metadata?.nombre_contacto as string | undefined) ||
    user?.email?.split('@')[0] ||
    'Emprendedor'

  const businessName =
    profile?.business_name ||
    (user?.user_metadata?.nombre_negocio as string | undefined) ||
    'Mi negocio'

  const getGreeting = (): string => {
    const hour = Number(
      new Intl.DateTimeFormat('es-ES', {
        hour: 'numeric',
        hour12: false,
      }).format(new Date())
    )

    if (hour >= 6 && hour < 12) return 'Buenos días'
    if (hour >= 12 && hour < 20) return 'Buenas tardes'
    return 'Buenas noches'
  }

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push('/')
      return
    }

    const loadStats = async () => {
      try {
        const supabase = createClient()

        const { data: clientesData } = await supabase
          .from('clientes')
          .select('id')
          .eq('user_id', user.id)

        const today = new Date()
        const weekStart = new Date(today)
        weekStart.setHours(0, 0, 0, 0)
        weekStart.setDate(today.getDate() - today.getDay() + 1)

        const weekEnd = new Date(weekStart)
        weekEnd.setDate(weekStart.getDate() + 6)

        const { data: citasData } = await supabase
          .from('citas')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', weekStart.toISOString().split('T')[0])
          .lte('date', weekEnd.toISOString().split('T')[0])
          .order('date', { ascending: true })

        const { data: presupuestosAceptados } = await supabase
          .from('presupuestos')
          .select('total, fecha')
          .eq('user_id', user.id)
          .eq('estado', 'aceptado')

        const { data: presupuestosEnviados } = await supabase
          .from('presupuestos')
          .select('total')
          .eq('user_id', user.id)
          .eq('estado', 'enviado')

        const { data: proximasCitasData } = await supabase
          .from('citas')
          .select('*')
          .eq('user_id', user.id)
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true })
          .limit(4)

        const totalClientes = clientesData?.length || 0
        const citasEstaSemana = citasData?.length || 0

        const thisMonth = new Date().getMonth() + 1
        const thisYear = new Date().getFullYear()
        const cobradoEsteMes = (presupuestosAceptados || []).reduce((acc, p) => {
          const [y, m] = String(p.fecha).split('-')
          if (Number(y) === thisYear && Number(m) === thisMonth) {
            return acc + (Number(p.total) || 0)
          }
          return acc
        }, 0)

        const porCobrar = (presupuestosEnviados || []).reduce((acc, p) => acc + (Number(p.total) || 0), 0)

        const { data: presupuestosAbiertoData } = await supabase
          .from('presupuestos')
          .select('id')
          .eq('user_id', user.id)
          .or('estado.eq.borrador,estado.eq.enviado')

        const presupuestosAbiertos = presupuestosAbiertoData?.length || 0

        setStats({
          totalClientes,
          citasEstaSemana,
          cobradoEsteMes,
          porCobrar,
          presupuestosAbiertos,
        })

        setCitas((proximasCitasData || []) as Cita[])
      } catch (err) {
        console.error('Error cargando stats:', err)
      }
    }

    loadStats()
  }, [user, loading, router])

  const today = new Date()
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
  const monthsFull = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = firstDay === 0 ? 6 : firstDay - 1

  const eventDays = new Set(citas.map(c => new Date(c.date + 'T00:00:00').getDate()))

  const handleCalendarDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    router.push(`/dashboard/agenda?date=${dateStr}`)
  }

  if (loading) {
    return (
      <div className={styles.app}>
        <Sidebar active="/dashboard" />
        <main className={styles.main}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#64748b' }}>
            Cargando...
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard" />

      <main className={styles.main}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>{getGreeting()}, {sessionName} 👋</h1>
            <p className={styles.phSub}>
              {businessName} · {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>

          <div className={styles.phActions}>
            <Link href="/dashboard/clientes" className={styles.btnGhost}>+ Cliente</Link>
            <Link href="/dashboard/documentos" className={styles.btnGhost}>+ Presupuesto</Link>
            <Link href="/dashboard/agenda" className={styles.btnGold}>+ Agenda</Link>
          </div>
        </div>

        <div className={styles.stats}>
          {[
            {
              label: 'Clientes',
              value: stats ? String(stats.totalClientes) : '—',
              sub: 'Total en tu cartera',
              color: 'gold',
            },
            {
              label: 'Cobrado este mes',
              value: stats ? `${stats.cobradoEsteMes.toLocaleString('es-ES')}€` : '—',
              sub: 'De presupuestos aceptados',
              color: 'green',
            },
            {
              label: 'Por cobrar',
              value: stats ? `${stats.porCobrar.toLocaleString('es-ES')}€` : '—',
              sub: stats && stats.presupuestosAbiertos > 0
                ? `${stats.presupuestosAbiertos} presupuestos en espera`
                : 'Sin presupuestos abiertos',
              color: 'blue',
            },
            {
              label: 'Visitas esta semana',
              value: stats ? String(stats.citasEstaSemana) : '—',
              sub: citas.length > 0
                ? `Próxima: ${citas[0].date} ${citas[0].time}`
                : 'Sin visitas próximas',
              color: 'accent',
            },
          ].map(s => (
            <div key={s.label} className={`${styles.stat} ${styles[s.color as keyof typeof styles]}`}>
              <div className={styles.statLbl}>{s.label}</div>
              <div className={styles.statVal}>{s.value}</div>
              <div className={styles.statSub}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div className={styles.dashMain}>
          <div className={styles.card}>
            <div className={styles.cardH}>
              <div className={styles.cardT}>📅 Próximas visitas</div>
              <Link href="/dashboard/agenda" className={styles.cardLink}>Ver agenda completa →</Link>
            </div>

            <div className={styles.agendaList}>
              {citas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '.875rem' }}>
                  Sin visitas programadas próximamente
                </div>
              ) : citas.map(c => (
                <div key={c.id} className={styles.agendaItem}>
                  <div className={styles.agendaDate}>
                    <span className={styles.agendaMonth}>{months[new Date(c.date + 'T00:00:00').getMonth()]}</span>
                    <span className={styles.agendaDay}>{new Date(c.date + 'T00:00:00').getDate()}</span>
                  </div>

                  <div className={styles.agendaInfo}>
                    <div className={styles.agendaTitle}>{c.title}</div>
                    <div className={styles.agendaClient}>
                      <span className={styles.agendaClientName}>{c.client_name}</span>
                      {c.place && <span className={styles.agendaPlace}>📍 {c.place}</span>}
                    </div>
                  </div>

                  <div className={styles.agendaTime}>{c.time}</div>
                </div>
              ))}
            </div>
          </div>

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
                  <div
                    key={d}
                    className={`${styles.calDay} ${isToday ? styles.calToday : ''}`}
                    onClick={() => handleCalendarDayClick(d)}
                  >
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
