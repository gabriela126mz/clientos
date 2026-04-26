'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'

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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

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
      <section className={styles.authSide}>
        <div>
          <div className={styles.brand}>
            Atelia <span className={styles.brandDot}></span>
          </div>

          <h1 className={styles.tagline}>
            Menos papeleo.<br />
            Más <em>clientes</em>.
          </h1>

          <p className={styles.taglineSub}>
            La plataforma todo-en-uno para emprendedores que no tienen tiempo para perder en administración.
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

          {error && (
            <div
              style={{
                background: '#fee2e2',
                color: '#991b1b',
                padding: '.85rem 1rem',
                borderRadius: 6,
                fontSize: '.9rem',
                marginBottom: '1.2rem',
                fontWeight: 600,
                borderLeft: '4px solid #dc2626',
              }}
            >
              {error}
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
              autoFocus
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

          <button
            type="button"
            className={styles.btnGhost}
            onClick={() => {
              setEmail('demo@atelia.app')
              setPassword('demo123456')
            }}
          >
            Probar con cuenta demo
          </button>

          <p className={styles.authFoot}>
            ¿Aún no tienes cuenta? <a href="/register">Crear cuenta</a>
          </p>
        </form>
      </section>
    </div>
  )
}