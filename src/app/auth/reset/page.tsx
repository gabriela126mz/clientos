'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import styles from '../../page.module.css'

export default function ResetPasswordPage() {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const checkRecoverySession = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session) {
        setReady(true)
        return
      }

      setTimeout(async () => {
        const { data: retry } = await supabase.auth.getSession()

        if (retry.session) {
          setReady(true)
        } else {
          setErrorMsg('El enlace ha caducado. Solicita uno nuevo.')
        }
      }, 800)
    }

    checkRecoverySession()
  }, [])

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    if (password.length < 6) {
      setErrorMsg('Mínimo 6 caracteres.')
      setLoading(false)
      return
    }

    if (password !== repeatPassword) {
      setErrorMsg('Las contraseñas no coinciden.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      console.error(error)
      setErrorMsg('Error al cambiar la contraseña.')
      setLoading(false)
      return
    }

    // 🔥 CLAVE: cerrar sesión temporal del recovery
    await supabase.auth.signOut()

    alert('Contraseña actualizada correctamente ✅')

    // 🔥 Redirección limpia (evita bug de router)
    window.location.href = '/'
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

          <p className={styles.lead}>
            Introduce tu nueva contraseña.
          </p>

          {!ready && !errorMsg && (
            <div style={{ marginBottom: '1rem', color: '#64748b' }}>
              Validando enlace…
            </div>
          )}

          {errorMsg && (
            <div
              style={{
                background: '#fee2e2',
                color: '#991b1b',
                padding: '.8rem',
                borderRadius: 6,
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              {errorMsg}
            </div>
          )}

          <div className={styles.field}>
            <label>Nueva contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!ready}
              required
            />
          </div>

          <div className={styles.field}>
            <label>Repetir contraseña</label>
            <input
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              disabled={!ready}
              required
            />
          </div>

          <button
            type="submit"
            className={styles.btnDark}
            disabled={!ready || loading}
            style={{ opacity: !ready || loading ? 0.7 : 1 }}
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