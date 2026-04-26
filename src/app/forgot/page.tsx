'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import styles from '../page.module.css'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/auth/reset`,
      }
    )

    if (error) {
      console.error(error)
      setErrorMsg('No se pudo enviar el correo. Revisa el email e inténtalo otra vez.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className={styles.auth}>
      <section className={styles.authSide}>
        <div>
          <div className={styles.brand}>
            Clientos <span className={styles.brandDot}></span>
          </div>

          <h1 className={styles.tagline}>
            Recupera acceso.<br />
            Vuelve a tus <em>clientes</em>.
          </h1>

          <p className={styles.taglineSub}>
            Te enviaremos un enlace seguro para crear una nueva contraseña.
          </p>
        </div>

        <div className={styles.pills}>
          <span>✓ Seguro</span>
          <span>✓ Rápido</span>
          <span>✓ Por email</span>
        </div>
      </section>

      <section className={styles.authMain}>
        <form className={styles.authForm} onSubmit={handleReset}>
          <h2>¿Olvidaste tu contraseña?</h2>

          <p className={styles.lead}>
            Escribe tu email y te enviaremos un enlace para restablecerla.
          </p>

          {success && (
            <div
              style={{
                background: '#dcfce7',
                color: '#166534',
                padding: '.85rem 1rem',
                borderRadius: 6,
                fontSize: '.9rem',
                marginBottom: '1.2rem',
                fontWeight: 600,
                borderLeft: '4px solid #16a34a',
              }}
            >
              Correo enviado ✅ Revisa tu bandeja de entrada.
            </div>
          )}

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

          <button
            type="submit"
            className={styles.btnDark}
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Enviando…' : 'Enviar enlace'}
          </button>

          <p className={styles.authFoot}>
            <Link href="/">← Volver al inicio de sesión</Link>
          </p>
        </form>
      </section>
    </div>
  )
}