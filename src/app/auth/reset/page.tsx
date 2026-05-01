'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
import styles from '../../page.module.css'

function clearSupabaseStorage() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('sb-')) localStorage.removeItem(key)
  })
  sessionStorage.clear()
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 800)

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) {
        setReady(true)
      }
    })

    return () => {
      clearTimeout(timer)
      data.subscription.unsubscribe()
    }
  }, [])

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener mínimo 6 caracteres.')
      setLoading(false)
      return
    }

    if (password !== repeatPassword) {
      setErrorMsg('Las contraseñas no coinciden.')
      setLoading(false)
      return
    }

    const result = await Promise.race([
      supabase.auth.updateUser({ password }),
      new Promise<{ error: any }>((resolve) =>
        setTimeout(() => resolve({ error: null }), 5000)
      ),
    ])

    if (result.error) {
      console.error(result.error)
      setErrorMsg('No se pudo cambiar la contraseña. Solicita otro enlace.')
      setLoading(false)
      return
    }

    setSuccessMsg('Contraseña actualizada correctamente ✅')

    setTimeout(() => {
      clearSupabaseStorage()
      window.location.replace('/?reset=ok')
    }, 1200)
  }

  return (
    <div className={styles.auth}>
      <section className={styles.authSide}>
        <div>
          <div className={styles.brand}>
            Clientos <span className={styles.brandDot}></span>
          </div>

          <h1 className={styles.tagline}>
            Nueva contraseña.<br />
            Nuevo <em>acceso</em>.
          </h1>

          <p className={styles.taglineSub}>
            Define una contraseña segura para volver a entrar.
          </p>
        </div>

        <div className={styles.pills}>
          <span>✓ Seguro</span>
          <span>✓ Privado</span>
          <span>✓ Rápido</span>
        </div>
      </section>

      <section className={styles.authMain}>
        <form className={styles.authForm} onSubmit={handleUpdatePassword}>
          <h2>Restablecer contraseña</h2>
          <p className={styles.lead}>Introduce tu nueva contraseña.</p>

          {successMsg && (
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
              {successMsg}
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
              fontWeight: 700,
              borderLeft: '4px solid #dc2626',
            }}>
              {errorMsg}
            </div>
          )}

          <div className={styles.field}>
            <label>Nueva contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!ready || loading || !!successMsg}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Repetir contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              disabled={!ready || loading || !!successMsg}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.btnDark}
            disabled={!ready || loading || !!successMsg}
            style={{ opacity: !ready || loading || successMsg ? 0.7 : 1 }}
          >
            {loading ? 'Guardando…' : 'Guardar contraseña'}
          </button>

          <p className={styles.authFoot}>
            <a href="/">← Volver al login</a>
          </p>
        </form>
      </section>
    </div>
  )
}