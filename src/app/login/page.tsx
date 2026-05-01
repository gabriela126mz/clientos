'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import styles from './page.module.css'

const supabase = createClient()


export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setError('Confirma tu email antes de entrar. Revisa tu bandeja de entrada.')
      } else if (error.message.includes('Invalid login')) {
        setError('Email o contraseña incorrectos.')
      } else {
        setError(error.message)
      }
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className={styles.auth}>
      <div className={styles.authSide}>
        <div className={styles.authSideInner}>
          <div className={styles.brand}>
            Clientos <span className={styles.brandDot}></span>
          </div>
          <div className={styles.tagline}>
            Menos papel.<br />Más <em>clientes</em>.
          </div>
          <p className={styles.taglineSub}>
            CRM + agenda + presupuestos + landing propia. Todo en uno para emprendedores sin tiempo.
          </p>
        </div>
        <div className={styles.pills}>
          <span className={styles.pill}>Landing propia</span>
          <span className={styles.pill}>CRM rápido</span>
          <span className={styles.pill}>Presupuestos</span>
          <span className={styles.pill}>Agenda</span>
        </div>
      </div>

      <div className={styles.authMain}>
        <form className={styles.authForm} onSubmit={handleLogin}>
          <h2>Bienvenido de vuelta</h2>
          <p className={styles.lead}>Entra y ponte al día en segundos.</p>

          {error && (
            <div style={{ background:'#fee2e2', color:'#991b1b', padding:'.75rem 1rem', borderRadius:8, fontSize:'.84rem', marginBottom:'1rem', fontWeight:500, borderLeft:'3px solid #dc2626' }}>
              {error}
            </div>
          )}

          <div className={styles.field}>
            <label>Email</label>
            <input type="email" placeholder="tu@email.com" value={email}
              onChange={e => setEmail(e.target.value)} required autoComplete="email" autoFocus />
          </div>

          <div className={styles.field}>
            <label>Contraseña</label>
            <input type="password" placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>

          <button type="submit" className={styles.btnDark}
            disabled={loading} style={{ opacity: loading ? .7 : 1, marginTop:'.25rem' }}>
            {loading ? 'Entrando…' : 'Iniciar sesión →'}
          </button>

          <div className={styles.authFoot} style={{ marginTop:'.75rem' }}>
            <a href="/forgot">¿Olvidaste tu contraseña?</a>
          </div>
          <div className={styles.authSep}>o</div>
          <div className={styles.authFoot}>
            ¿Sin cuenta? <a href="/register">Crear cuenta gratis</a>
          </div>
        </form>
      </div>
    </div>
  )
}
