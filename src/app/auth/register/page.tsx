'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createProfile } from '@/lib/db'
import styles from '../page.module.css'

const TRADES = [
  { key: 'jardineria',    label: 'Jardinería',        icon: '🌿' },
  { key: 'fontaneria',    label: 'Fontanería',         icon: '🔧' },
  { key: 'electricidad',  label: 'Electricidad',       icon: '⚡' },
  { key: 'carpinteria',   label: 'Carpintería',        icon: '🪵' },
  { key: 'pintura',       label: 'Pintura',            icon: '🎨' },
  { key: 'reformas',      label: 'Reformas',           icon: '🏗️' },
  { key: 'limpieza',      label: 'Limpieza',           icon: '✨' },
  { key: 'estetica',      label: 'Estética',           icon: '💆' },
  { key: 'peluqueria',    label: 'Peluquería',         icon: '✂️' },
  { key: 'trainer',       label: 'Personal Trainer',   icon: '💪' },
  { key: 'nutricion',     label: 'Nutrición',          icon: '🥗' },
  { key: 'fotografia',    label: 'Fotografía',         icon: '📸' },
  { key: 'consultoria',   label: 'Consultoría',        icon: '📊' },
  { key: 'marketing',     label: 'Marketing',          icon: '📣' },
  { key: 'diseño',        label: 'Diseño gráfico',     icon: '🎭' },
  { key: 'informatica',   label: 'Informática',        icon: '💻' },
  { key: 'transporte',    label: 'Transporte',         icon: '🚚' },
  { key: 'mecanica',      label: 'Mecánica',           icon: '🔩' },
  { key: 'cerrajeria',    label: 'Cerrajería',         icon: '🔑' },
  { key: 'mudanzas',      label: 'Mudanzas',           icon: '📦' },
  { key: 'catering',      label: 'Catering',           icon: '🍽️' },
  { key: 'eventos',       label: 'Organización eventos', icon: '🎪' },
  { key: 'yoga',          label: 'Yoga / Pilates',     icon: '🧘' },
  { key: 'abogado',       label: 'Abogado',            icon: '⚖️' },
  { key: 'gestor',        label: 'Gestor / Asesor',    icon: '🗂️' },
  { key: 'emprendedor',   label: 'Emprendedor',        icon: '🚀' },
  { key: 'otro',          label: 'Otro',               icon: '💼' },
]

function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
}

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  /* Step 1 */
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  /* Step 2 */
  const [trade, setTrade] = useState('')

  /* Step 3 */
  const [biz, setBiz] = useState('')
  const [owner, setOwner] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    if (password !== password2) { setError('Las contraseñas no coinciden.'); return }
    setStep(2)
  }

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trade) { setError('Elige un oficio para continuar.'); return }
    setError('')
    setStep(3)
  }

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    /* 1. Crear usuario en Supabase Auth */
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` }
    })

    if (authError || !authData.user) {
      setError(authError?.message || 'Error al crear la cuenta.')
      setLoading(false)
      return
    }

    /* 2. Crear perfil en la tabla profiles */
    const slug = slugify(biz) + '-' + Math.random().toString(36).slice(2,6)

    const { error: profileError } = await createProfile({
      id: authData.user.id,
      business_name: biz,
      owner_name: owner,
      trade,
      phone,
      email,
      city,
      slug,
      plan: 'free',
    })

    if (profileError) {
      setError('Cuenta creada pero hubo un error al guardar el perfil. Contacta soporte.')
      setLoading(false)
      return
    }

    /* 3. Redirigir al dashboard */
    router.push('/dashboard')
  }

  return (
    <div className={styles.auth}>
      <div className={styles.authSide}>
        <div className={styles.authSideInner}>
          <div className={styles.brand}>Clientos <span className={styles.brandDot}></span></div>
          <div className={styles.tagline}>Tu negocio.<br />Tu <em>escaparate</em>.</div>
          <p className={styles.taglineSub}>En 60 segundos: web propia + CRM + presupuestos. Sin tarjeta.</p>
        </div>
        <div className={styles.pills}>
          <span className={styles.pill}>Gratis para empezar</span>
          <span className={styles.pill}>Sin tarjeta</span>
          <span className={styles.pill}>60 segundos</span>
        </div>
      </div>

      <div className={styles.authMain}>
        <div className={styles.authForm}>
          {/* STEPS */}
          <div className={styles.steps}>
            {[1,2,3].map(n => (
              <div key={n} className={`${styles.step} ${step === n ? styles.on : ''} ${step > n ? styles.done : ''}`} data-s={n} />
            ))}
          </div>

          {error && (
            <div style={{ background:'#fee2e2', color:'#991b1b', padding:'.75rem 1rem', borderRadius:8, fontSize:'.84rem', marginBottom:'1rem', fontWeight:500 }}>
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleStep1}>
              <h2>Crea tu cuenta</h2>
              <p className={styles.lead}>Email y contraseña para entrar.</p>
              <div className={styles.field}>
                <label>Email</label>
                <input type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className={styles.field}>
                <label>Contraseña</label>
                <input type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className={styles.field}>
                <label>Confirmar contraseña</label>
                <input type="password" placeholder="Repite la contraseña" value={password2} onChange={e => setPassword2(e.target.value)} required />
              </div>
              <button type="submit" className={styles.btnDark}>Continuar →</button>
              <div className={styles.authFoot}>
                ¿Ya tienes cuenta? <a href="/">Inicia sesión</a>
              </div>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleStep2}>
              <h2>¿A qué te dedicas?</h2>
              <p className={styles.lead}>Personalizamos tu web al instante.</p>
              <div className={styles.trades}>
                {TRADES.map(t => (
                  <div
                    key={t.key}
                    className={`${styles.trade} ${trade === t.key ? styles.sel : ''}`}
                    onClick={() => setTrade(t.key)}
                  >
                    <span className={styles.ti}>{t.icon}</span>
                    {t.label}
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:'.6rem', marginTop:'.5rem' }}>
                <button type="button" className={styles.btnGhost} onClick={() => setStep(1)}>← Atrás</button>
                <button type="submit" className={styles.btnDark} style={{ flex:1 }}>Continuar →</button>
              </div>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={handleStep3}>
              <h2>Datos del negocio</h2>
              <p className={styles.lead}>Podrás editarlos en cualquier momento.</p>
              <div className={styles.field}>
                <label>Nombre del negocio</label>
                <input placeholder="Ej: Fontanería García" value={biz} onChange={e => setBiz(e.target.value)} required />
              </div>
              <div className={styles.field}>
                <label>Tu nombre</label>
                <input placeholder="Nombre y apellido" value={owner} onChange={e => setOwner(e.target.value)} required />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <div className={styles.field}>
                  <label>Teléfono</label>
                  <input type="tel" placeholder="+34 600 000 000" value={phone} onChange={e => setPhone(e.target.value)} required />
                </div>
                <div className={styles.field}>
                  <label>Ciudad</label>
                  <input placeholder="Madrid" value={city} onChange={e => setCity(e.target.value)} required />
                </div>
              </div>
              <div style={{ display:'flex', gap:'.6rem', marginTop:'.5rem' }}>
                <button type="button" className={styles.btnGhost} onClick={() => setStep(2)}>← Atrás</button>
                <button type="submit" className={styles.btnDark} style={{ flex:1, background:'#e8a820', color:'#0a0f14' }} disabled={loading}>
                  {loading ? 'Creando cuenta…' : '🚀 ¡Crear mi cuenta!'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
