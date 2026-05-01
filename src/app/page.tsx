'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
import styles from './page.module.css'

function clearSupabaseStorage() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('sb-')) localStorage.removeItem(key)
  })
  sessionStorage.clear()
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [infoMsg, setInfoMsg] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get('reset') === 'ok') {
      clearSupabaseStorage()
      setInfoMsg('Contraseña actualizada. Ya puedes iniciar sesión.')
      window.history.replaceState({}, '', '/')
    }
  }, [])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setInfoMsg('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (error) {
      setLoading(false)

      if (error.message.toLowerCase().includes('invalid login')) {
        setErrorMsg('Email o contraseña incorrectos.')
      } else if (error.message.toLowerCase().includes('email not confirmed')) {
        setErrorMsg('Confirma tu email antes de entrar.')
      } else {
        setErrorMsg(error.message)
      }

      return
    }

    if (!data.session) {
      setLoading(false)
      setErrorMsg('No se pudo crear la sesión.')
      return
    }

    window.location.replace('/dashboard')
  }

  return (
    <div className={styles.auth}>
      <section className={styles.authSide}>
        <div>
          <div className={styles.brand}>
            Clientos <span className={styles.brandDot}></span>
          </div>

          <h1 className={styles.tagline}>
            Menos papeleo.<br />
            Más <em>clientes</em>.
          </h1>

          <p className={styles.taglineSub}>
            CRM + agenda + presupuestos + landing propia. Todo en uno para emprendedores sin tiempo.
          </p>
        </div>

        <div className={styles.pills}>
          <span>✓ Landing propia</span>
          <span>✓ CRM clientes</span>
          <span>✓ Facturación</span>
        </div>
      </section>

      <section className={styles.authMain}>
        <form className={styles.authForm} onSubmit={handleLogin}>
          <h2>Bienvenido de vuelta</h2>
          <p className={styles.lead}>Inicia sesión para gestionar tu negocio.</p>

          {infoMsg && (
            <div style={{
              background: '#dcfce7',
              color: '#166534',
              padding: '.85rem 1rem',
              borderRadius: 6,
              fontSize: '.9rem',
              marginBottom: '1.2rem',
              fontWeight: 700,
              borderLeft: '4px solid #16a34a',
            }}>
              {infoMsg}
            </div>
          )}

          {errorMsg && (
            <div style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '.85rem 1rem',
              borderRadius: 6,
              fontSize: '.9rem',
              marginBottom: '1.2rem',
              fontWeight: 600,
              borderLeft: '4px solid #dc2626',
            }}>
              {errorMsg}
            </div>
          )}

          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={styles.btnDark}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Entrando…' : 'Iniciar sesión'}
          </button>

          <a className={styles.forgot} href="/forgot">
            ¿Olvidaste tu contraseña?
          </a>

          <div className={styles.authSep}>
            <span></span>
            <b>o</b>
            <span></span>
          </div>

          <p className={styles.authFoot}>
            ¿Aún no tienes cuenta? <a href="/register">Crear cuenta</a>
          </p>
        </form>
      </section>
    </div>
  )
}