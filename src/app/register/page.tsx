'use client'

import { useState } from 'react'
import { createClient } from '@/lib/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../page.module.css'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombreNegocio, setNombreNegocio] = useState('')
  const [nombreContacto, setNombreContacto] = useState('')
  const [telefono, setTelefono] = useState('')
  const [ciudad, setCiudad] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre_negocio: nombreNegocio,
            nombre_contacto: nombreContacto,
            telefono,
            ciudad,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) throw signUpError

      setSuccess(true)

      if (data.session) {
        router.push('/dashboard')
      }
    } catch (err: any) {
      console.error('Error en registro:', err)
      setError(err.message || 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.auth}>
      <section className={styles.authSide}>
        <div>
          <div className={styles.brand}>
            Clientos <span className={styles.brandDot}></span>
          </div>

          <h1 className={styles.tagline}>
            Crea tu cuenta.<br />
            Lanza tu <em>negocio</em>.
          </h1>

          <p className={styles.taglineSub}>
            Entra a Clientos y empieza a gestionar clientes, agenda, presupuestos, facturas y tu landing.
          </p>
        </div>

        <div className={styles.pills}>
          <span>✓ CRM rápido</span>
          <span>✓ Landing propia</span>
          <span>✓ Facturación</span>
        </div>
      </section>

      <section className={styles.authMain}>
        <form className={styles.authForm} onSubmit={handleRegister}>
          {success ? (
            <>
              <h2>Cuenta creada</h2>
              <p className={styles.lead}>
                Revisa tu correo electrónico para confirmar tu cuenta.
              </p>

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
                Te enviamos un enlace de confirmación ✅
              </div>

              <Link href="/" className={styles.btnDark} style={{ display: 'grid', placeItems: 'center', textDecoration: 'none' }}>
                Ir al inicio de sesión
              </Link>
            </>
          ) : (
            <>
              <h2>Crear cuenta</h2>
              <p className={styles.lead}>Comienza a gestionar tu negocio.</p>

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
                <label>Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                  autoComplete="email"
                />
              </div>

              <div className={styles.field}>
                <label>Contraseña *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                />
              </div>

              <div style={{ borderTop: '1px solid #d6d0c6', paddingTop: '20px', marginTop: '22px' }}>
                <p
                  style={{
                    margin: '0 0 16px',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '1.2px',
                    fontWeight: 900,
                    color: '#0c1a1f',
                  }}
                >
                  Datos del negocio
                </p>

                <div className={styles.field}>
                  <label>Nombre del negocio *</label>
                  <input
                    type="text"
                    value={nombreNegocio}
                    onChange={(e) => setNombreNegocio(e.target.value)}
                    required
                    placeholder="Mi Empresa S.L."
                  />
                </div>

                <div className={styles.field}>
                  <label>Tu nombre *</label>
                  <input
                    type="text"
                    value={nombreContacto}
                    onChange={(e) => setNombreContacto(e.target.value)}
                    required
                    placeholder="Gabriela"
                  />
                </div>

                <div className={styles.field}>
                  <label>Teléfono *</label>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    required
                    placeholder="+34 600 000 000"
                  />
                </div>

                <div className={styles.field}>
                  <label>Ciudad *</label>
                  <input
                    type="text"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    required
                    placeholder="Madrid"
                  />
                </div>
              </div>

              <button
                type="submit"
                className={styles.btnDark}
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Creando cuenta…' : 'Crear mi cuenta'}
              </button>

              <p className={styles.authFoot}>
                ¿Ya tienes cuenta? <Link href="/">Inicia sesión</Link>
              </p>
            </>
          )}
        </form>
      </section>
    </div>
  )
}