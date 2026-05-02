'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'
import { useAuth } from '@/lib/context'

const supabase = createClient()

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
  const router = useRouter()
  let lastSection = ''

  const sessionName = profile?.business_name || user?.email?.split('@')[0] || 'Usuario'
  const businessName = profile?.business_name || 'Negocio'

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

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
  )
}
