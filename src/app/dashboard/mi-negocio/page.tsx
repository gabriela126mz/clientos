'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import mStyles from './mi-negocio.module.css'
import { useAuth } from '@/lib/context'
import { createClient } from '@/lib/supabase/client'

interface ProfileData {
  id: string
  business_name: string
  owner_name: string
  trade: string
  phone: string
  email: string
  city: string
  address: string
  nif: string
  iban: string
  opening_hours: string
  headline: string
  subtitle: string
  intro_text: string
  experience_years: string
  service_1_title: string
  service_1_desc: string
  service_2_title: string
  service_2_desc: string
  service_3_title: string
  service_3_desc: string
  benefit_1: string
  benefit_2: string
  benefit_3: string
  cta_text: string
  whatsapp_message: string
  slug: string
  logo_url: string
  hero_image_url: string
  zone: string
}

export default function MiNegocio() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [form, setForm] = useState<Partial<ProfileData>>({})

  // Cargar perfil
  const loadProfile = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error cargando perfil:', error)
        return
      }

      setProfile(data as ProfileData)
      setForm(data as ProfileData)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/')
      return
    }
    loadProfile()
  }, [authLoading, user, loadProfile, router])

  // Guardar perfil
  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update(form)
        .eq('id', user.id)

      if (error) {
        console.error(error)
        setMessage('Error al guardar: ' + error.message)
        return
      }

      setMessage('✅ Cambios guardados correctamente')
      await loadProfile()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error(err)
      setMessage('Error inesperado')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.app}>
        <Sidebar active="/dashboard/mi-negocio" />
        <main className={styles.main}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e2ddd4', borderTopColor: '#2d5a27', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748b', fontSize: '.875rem' }}>Cargando perfil…</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        </main>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className={styles.app}>
        <Sidebar active="/dashboard/mi-negocio" />
        <main className={styles.main}>
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>⚠️</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '.5rem', color: '#1c2b3a' }}>
              No se pudo cargar tu perfil
            </div>
            <p style={{ color: '#64748b', fontSize: '.875rem' }}>
              Intenta actualizar la página o contacta con soporte.
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/mi-negocio" />

      <main className={styles.main}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Mi negocio</h1>
            <p className={styles.phSub}>
              Rellena lo esencial. Tu landing se genera automáticamente.
            </p>
          </div>

          <button onClick={() => window.open(`/${form.slug || 'perfil'}`, '_blank')} className={styles.btnGold}>
            Ver mi landing →
          </button>
        </div>

        {message && (
          <div style={{ padding: '1rem 1.4rem', borderRadius: 8, background: message.includes('✅') ? '#dcfce7' : '#fcebeb', color: message.includes('✅') ? '#166534' : '#991f1f', marginBottom: '1.5rem', fontSize: '.875rem', fontWeight: 600 }}>
            {message}
          </div>
        )}

        <form onSubmit={save}>
          <div className={mStyles.layout}>
            <div className={mStyles.mainCol}>

              {/* DATOS DEL NEGOCIO - PRIVADO */}
              <section className={mStyles.sectionPrivate}>
                <div className={mStyles.sectionHead}>
                  <span className={mStyles.badgePrivate}>Privado</span>
                  <div>
                    <h2>Datos del negocio</h2>
                    <p>Esto sirve para tu cuenta, contacto y facturación. No todo se muestra en la landing.</p>
                  </div>
                </div>

                <div className={mStyles.grid2}>
                  <div className={mStyles.field}>
                    <label>Nombre del negocio</label>
                    <input
                      value={form.business_name || ''}
                      onChange={e => setForm({ ...form, business_name: e.target.value })}
                    />
                  </div>

                  <div className={mStyles.field}>
                    <label>Oficio</label>
                    <select
                      value={form.trade || 'jardineria'}
                      onChange={e => setForm({ ...form, trade: e.target.value })}
                    >
                      <option value="jardineria">🌿 Jardinería</option>
                      <option value="paisajismo">🌱 Paisajismo</option>
                      <option value="mantenimiento">🧹 Mantenimiento</option>
                      <option value="reformas">🏗️ Reformas</option>
                      <option value="limpieza">✨ Limpieza</option>
                      <option value="estetica">💆 Estética</option>
                      <option value="fontaneria">🔧 Fontanería</option>
                      <option value="electricidad">⚡ Electricidad</option>
                    </select>
                  </div>

                  <div className={mStyles.field}>
                    <label>Tu nombre</label>
                    <input
                      value={form.owner_name || ''}
                      onChange={e => setForm({ ...form, owner_name: e.target.value })}
                    />
                  </div>

                  <div className={mStyles.field}>
                    <label>WhatsApp</label>
                    <input
                      value={form.phone || ''}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>

                  <div className={mStyles.field}>
                    <label>Email</label>
                    <input
                      type="email"
                      value={form.email || ''}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className={mStyles.field}>
                    <label>Ciudad</label>
                    <input
                      value={form.city || ''}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                    />
                  </div>
                </div>

                <div className={mStyles.grid2}>
                  <div className={mStyles.field}>
                    <label>Dirección fiscal</label>
                    <input
                      placeholder="C/ Olivos, 12, Madrid"
                      value={form.address || ''}
                      onChange={e => setForm({ ...form, address: e.target.value })}
                    />
                  </div>

                  <div className={mStyles.field}>
                    <label>Horario</label>
                    <input
                      value={form.opening_hours || ''}
                      onChange={e => setForm({ ...form, opening_hours: e.target.value })}
                    />
                  </div>

                  <div className={mStyles.field}>
                    <label>NIF / CIF</label>
                    <input
                      placeholder="Para facturas"
                      value={form.nif || ''}
                      onChange={e => setForm({ ...form, nif: e.target.value })}
                    />
                  </div>

                  <div className={mStyles.field}>
                    <label>IBAN</label>
                    <input
                      placeholder="ES91 2100…"
                      value={form.iban || ''}
                      onChange={e => setForm({ ...form, iban: e.target.value })}
                    />
                  </div>
                </div>
              </section>

              {/* LANDING PÚBLICA */}
              <section className={mStyles.sectionPublic}>
                <div className={mStyles.sectionHead}>
                  <span className={mStyles.badgePublic}>Landing pública</span>
                  <div>
                    <h2>Lo que verá tu cliente</h2>
                    <p>Con estos campos se genera una web tipo premium en menos de 2 minutos.</p>
                  </div>
                </div>

                <div className={mStyles.field}>
                  <label>Titular principal</label>
                  <input
                    value={form.headline || ''}
                    onChange={e => setForm({ ...form, headline: e.target.value })}
                  />
                </div>

                <div className={mStyles.field}>
                  <label>Subtítulo</label>
                  <input
                    value={form.subtitle || ''}
                    onChange={e => setForm({ ...form, subtitle: e.target.value })}
                  />
                </div>

                <div className={mStyles.field}>
                  <label>Presentación breve</label>
                  <textarea
                    value={form.intro_text || ''}
                    onChange={e => setForm({ ...form, intro_text: e.target.value })}
                  />
                </div>

                <div className={mStyles.grid2}>
                  <div className={mStyles.field}>
                    <label>Zona de trabajo</label>
                    <input
                      value={(form as any).zone || ''}
                      onChange={e => setForm({ ...form, zone: e.target.value } as any)}
                    />
                  </div>

                  <div className={mStyles.field}>
                    <label>Años de experiencia</label>
                    <input
                      value={form.experience_years || ''}
                      onChange={e => setForm({ ...form, experience_years: e.target.value })}
                    />
                  </div>
                </div>

                {/* SERVICIOS */}
                <div className={mStyles.quickGroup}>
                  <h3>Servicios principales</h3>

                  {[
                    { title: 'service_1_title', desc: 'service_1_desc' },
                    { title: 'service_2_title', desc: 'service_2_desc' },
                    { title: 'service_3_title', desc: 'service_3_desc' },
                  ].map((s, i) => (
                    <div key={i} className={mStyles.serviceRow}>
                      <div className={mStyles.field}>
                        <label>Servicio {i + 1}</label>
                        <input
                          value={form[s.title as keyof ProfileData] as string || ''}
                          onChange={e => setForm({ ...form, [s.title]: e.target.value })}
                        />
                      </div>

                      <div className={mStyles.field}>
                        <label>Descripción</label>
                        <input
                          value={form[s.desc as keyof ProfileData] as string || ''}
                          onChange={e => setForm({ ...form, [s.desc]: e.target.value })}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* BENEFICIOS */}
                <div className={mStyles.quickGroup}>
                  <h3>Por qué elegirnos</h3>

                  <div className={mStyles.grid3}>
                    <div className={mStyles.field}>
                      <label>Punto 1</label>
                      <input
                        value={form.benefit_1 || ''}
                        onChange={e => setForm({ ...form, benefit_1: e.target.value })}
                      />
                    </div>

                    <div className={mStyles.field}>
                      <label>Punto 2</label>
                      <input
                        value={form.benefit_2 || ''}
                        onChange={e => setForm({ ...form, benefit_2: e.target.value })}
                      />
                    </div>

                    <div className={mStyles.field}>
                      <label>Punto 3</label>
                      <input
                        value={form.benefit_3 || ''}
                        onChange={e => setForm({ ...form, benefit_3: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* WHATSAPP CTA */}
                <div className={mStyles.grid2}>
                  <div className={mStyles.field}>
                    <label>Texto del botón WhatsApp</label>
                    <input
                      value={form.cta_text || ''}
                      onChange={e => setForm({ ...form, cta_text: e.target.value })}
                    />
                  </div>

                  <div className={mStyles.field}>
                    <label>Mensaje automático</label>
                    <input
                      value={form.whatsapp_message || ''}
                      onChange={e => setForm({ ...form, whatsapp_message: e.target.value })}
                    />
                  </div>
                </div>
              </section>

              {/* BOTONES ACCIÓN */}
              <div className={mStyles.actionsBottom}>
                <button
                  type="button"
                  onClick={() => setForm(profile)}
                  className={styles.btnGhost}
                >
                  Descartar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={styles.btnDark}
                  style={{ opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? 'Guardando…' : 'Guardar cambios'}
                </button>
              </div>
            </div>

            {/* SIDEBAR */}
            <aside className={mStyles.sideCol}>
              <div className={mStyles.urlCard}>
                <div className={mStyles.urlLabel}>Tu URL pública</div>

                <div className={mStyles.urlBox}>
                  clientos.app/{form.slug || 'perfil'}
                </div>

                <div className={mStyles.urlActions}>
                  <button
                    type="button"
                    onClick={() => window.open(`/${form.slug || 'perfil'}`, '_blank')}
                    className={styles.btnGold}
                  >
                    Ver landing
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`clientos.app/${form.slug || 'perfil'}`)
                      alert('URL copiada al portapapeles')
                    }}
                    className={mStyles.copyBtn}
                  >
                    ⎘
                  </button>
                </div>
              </div>

              <div className={mStyles.mediaCard}>
                <h3>Logo</h3>
                <div className={mStyles.uploadZone}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const reader = new FileReader()
                        reader.onload = (evt) => {
                          setForm({ ...form, logo_url: evt.target?.result as string })
                        }
                        reader.readAsDataURL(e.target.files[0])
                      }
                    }}
                  />
                  <div className={mStyles.uploadIcon}>🖼️</div>
                  <div className={mStyles.uploadText}>Subir logo</div>
                </div>
                {form.logo_url && (
                  <img src={form.logo_url} alt="Logo" style={{ maxWidth: '100%', maxHeight: 100, marginTop: '.5rem', borderRadius: 6 }} />
                )}
              </div>

              <div className={mStyles.mediaCard}>
                <h3>Imagen principal</h3>
                <div className={mStyles.uploadZoneLarge}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const reader = new FileReader()
                        reader.onload = (evt) => {
                          setForm({ ...form, hero_image_url: evt.target?.result as string })
                        }
                        reader.readAsDataURL(e.target.files[0])
                      }
                    }}
                  />
                  <div className={mStyles.uploadIcon}>🌿</div>
                  <div className={mStyles.uploadText}>Foto hero</div>
                </div>
                {form.hero_image_url && (
                  <img src={form.hero_image_url} alt="Hero" style={{ maxWidth: '100%', maxHeight: 200, marginTop: '.5rem', borderRadius: 6 }} />
                )}
              </div>
            </aside>
          </div>
        </form>
      </main>
    </div>
  )
}
