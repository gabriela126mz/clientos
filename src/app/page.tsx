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
  const [errorMsg, setErrorMsg] = useState('')

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    console.log('LOGIN DATA:', data)
    console.log('LOGIN ERROR:', error)

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

    console.log('SESION CREADA:', data.session)

    setLoading(false)

    // 🔥 REDIRECCIÓN FORZADA (esto evita todos los bugs)
    window.location.href = '/dashboard'
  }

  return (
    <div className={styles.auth}>
      {/* LADO IZQUIERDO */}
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

      {/* LADO DERECHO */}
      <section className={styles.authMain}>
        <form className={styles.authForm} onSubmit={handleLogin}>
          <h2>Bienvenido de vuelta</h2>
          <p className={styles.lead}>
            Inicia sesión para gestionar tu negocio.
          </p>

          {errorMsg && (
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
            ¿Aún no tienes cuenta?{' '}
            <a href="/register">Crear cuenta</a>
          </p>
        </form>
      </section>
    </div>
  )
}