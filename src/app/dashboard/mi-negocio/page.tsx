'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import { useAuth } from '@/lib/context'
import { createClient } from '@/lib/supabase/client'
import { TRADES, getTradeConfig } from '@/lib/trades'

interface ProfileData {
  id: string
  business_name: string
  owner_name: string
  trade: string
  phone: string
  email: string
  city: string
  address: string
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
  process_1_title: string
  process_1_text: string
  process_2_title: string
  process_2_text: string
  process_3_title: string
  process_3_text: string
  process_4_title: string
  process_4_text: string
  testimonial_1_name: string
  testimonial_1_role: string
  testimonial_1_text: string
  testimonial_2_name: string
  testimonial_2_role: string
  testimonial_2_text: string
  testimonial_3_name: string
  testimonial_3_role: string
  testimonial_3_text: string
  faq_1_q: string
  faq_1_a: string
  faq_2_q: string
  faq_2_a: string
  faq_3_q: string
  faq_3_a: string
  faq_4_q: string
  faq_4_a: string
  whatsapp_message: string
  slug: string
  logo_url: string
  hero_image_url: string
  gallery_urls?: string[]
  color_primary?: string
  color_secondary?: string
  color_accent?: string
}

const inputStyle = { padding: '.75rem', border: '1px solid #ddd', borderRadius: '6px', fontFamily: 'inherit', fontSize: '.9rem' }
const labelStyle = { fontWeight: 600, fontSize: '.85rem', textTransform: 'uppercase' as const, color: '#2d5a27' }
const sectionStyle = { padding: '1.5rem', background: '#f9f6f0', borderRadius: '8px', marginBottom: '2rem' }

export default function MiNegocio() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [section, setSection] = useState<'datos' | 'landing' | 'galeria'>('datos')
  const [form, setForm] = useState<Partial<ProfileData>>({})
  const [tradeConfig, setTradeConfig] = useState(getTradeConfig('emprendedor'))

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
        console.error('Error:', error)
        return
      }

      setProfile(data as ProfileData)
      setForm(data as ProfileData)
      const config = getTradeConfig(data.trade)
      setTradeConfig(config)
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

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setMessage('')

    try {
      const updateData = {
        ...form,
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (error) {
        setMessage('❌ Error: ' + error.message)
        return
      }

      setMessage('✅ Cambios guardados')
      await loadProfile()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('❌ Error inesperado')
    } finally {
      setSaving(false)
    }
  }

  const aplicarPlantilla = () => {
    const config = getTradeConfig(form.trade || 'emprendedor')
    setForm({
      ...form,
      headline: config.defaultHeadline,
      subtitle: config.defaultSubtitle,
      intro_text: config.defaultIntro,
      service_1_title: config.defaultServices[0].name,
      service_1_desc: config.defaultServices[0].desc,
      service_2_title: config.defaultServices[1].name,
      service_2_desc: config.defaultServices[1].desc,
      service_3_title: config.defaultServices[2].name,
      service_3_desc: config.defaultServices[2].desc,
      benefit_1: config.defaultBenefits[0],
      benefit_2: config.defaultBenefits[1],
      benefit_3: config.defaultBenefits[2],
      process_1_title: config.defaultProcess[0].title,
      process_1_text: config.defaultProcess[0].text,
      process_2_title: config.defaultProcess[1].title,
      process_2_text: config.defaultProcess[1].text,
      process_3_title: config.defaultProcess[2].title,
      process_3_text: config.defaultProcess[2].text,
      process_4_title: config.defaultProcess[3].title,
      process_4_text: config.defaultProcess[3].text,
      testimonial_1_name: config.defaultTestimonials[0].name,
      testimonial_1_role: config.defaultTestimonials[0].role,
      testimonial_1_text: config.defaultTestimonials[0].text,
      testimonial_2_name: config.defaultTestimonials[1]?.name || '',
      testimonial_2_role: config.defaultTestimonials[1]?.role || '',
      testimonial_2_text: config.defaultTestimonials[1]?.text || '',
      testimonial_3_name: config.defaultTestimonials[2]?.name || '',
      testimonial_3_role: config.defaultTestimonials[2]?.role || '',
      testimonial_3_text: config.defaultTestimonials[2]?.text || '',
      faq_1_q: config.defaultFaqs[0]?.q || '',
      faq_1_a: config.defaultFaqs[0]?.a || '',
      faq_2_q: config.defaultFaqs[1]?.q || '',
      faq_2_a: config.defaultFaqs[1]?.a || '',
      faq_3_q: config.defaultFaqs[2]?.q || '',
      faq_3_a: config.defaultFaqs[2]?.a || '',
      faq_4_q: config.defaultFaqs[3]?.q || '',
      faq_4_a: config.defaultFaqs[3]?.a || '',
      color_primary: config.colors.primary,
      color_secondary: config.colors.secondary,
      color_accent: config.colors.accent,
    })
    setMessage('✨ Plantilla aplicada')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleTradeChange = (newTrade: string) => {
    setForm({ ...form, trade: newTrade })
    const newConfig = getTradeConfig(newTrade)
    setTradeConfig(newConfig)
  }

  const removeImage = (tipo: 'logo' | 'hero') => {
    if (tipo === 'logo') {
      setForm({ ...form, logo_url: '' })
    } else {
      setForm({ ...form, hero_image_url: '' })
    }
  }

  const addGalleryImage = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const gallery = form.gallery_urls || []
      gallery.push(e.target?.result as string)
      setForm({ ...form, gallery_urls: gallery })
    }
    reader.readAsDataURL(file)
  }

  const removeGalleryImage = (index: number) => {
    const gallery = (form.gallery_urls || []).filter((_, i) => i !== index)
    setForm({ ...form, gallery_urls: gallery })
  }

  if (loading) {
    return (
      <div className={styles.app}>
        <Sidebar active="/dashboard/mi-negocio" />
        <main className={styles.main} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e2ddd4', borderTopColor: '#2d5a27', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748b' }}>Cargando...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/mi-negocio" />

      <main className={styles.main}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '.5rem', color: '#1a2818' }}>Mi negocio</h1>
            <p style={{ color: '#64748b', fontSize: '.95rem' }}>Crea y personaliza tu landing premium</p>
          </div>
          {form.slug && (
            <a href={`/${form.slug}`} target="_blank" rel="noopener noreferrer" style={{
              padding: '.75rem 1.5rem',
              background: '#2d5a27',
              color: 'white',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '.85rem',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all .2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '.5rem',
              whiteSpace: 'nowrap',
            }} onMouseEnter={e => e.currentTarget.style.background = '#1f4620'} onMouseLeave={e => e.currentTarget.style.background = '#2d5a27'}>
              👁️ Ver mi landing
            </a>
          )}
        </div>

        {message && (
          <div style={{
            padding: '1rem 1.4rem',
            borderRadius: 8,
            background: message.includes('✅') ? '#dcfce7' : message.includes('✨') ? '#fef3c7' : '#fee2e2',
            color: message.includes('✅') ? '#166534' : message.includes('✨') ? '#92400e' : '#991f1f',
            marginBottom: '1.5rem',
            fontSize: '.875rem',
            fontWeight: 600,
          }}>
            {message}
          </div>
        )}

        {/* TABS - SIN COLORES */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e5dcc9', paddingBottom: '1rem', flexWrap: 'wrap' }}>
          {[
            { id: 'datos', label: '📋 Datos' },
            { id: 'landing', label: '🎨 Landing' },
            { id: 'galeria', label: '🖼️ Galería' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSection(tab.id as any)}
              style={{
                padding: '0.75rem 1.5rem',
                background: section === tab.id ? '#2d5a27' : 'transparent',
                color: section === tab.id ? 'white' : '#666',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: section === tab.id ? 700 : 500,
                fontSize: '.9rem',
                transition: 'all .2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={save}>
          {/* DATOS */}
          {section === 'datos' && (
            <div>
              <div style={{ ...sectionStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  <span style={labelStyle}>Nombre negocio</span>
                  <input type="text" value={form.business_name || ''} onChange={e => setForm({ ...form, business_name: e.target.value })} style={inputStyle} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  <span style={labelStyle}>Oficio</span>
                  <select value={form.trade || 'emprendedor'} onChange={e => handleTradeChange(e.target.value)} style={inputStyle}>
                    {Object.values(TRADES).map(t => <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>)}
                  </select>
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  <span style={labelStyle}>Tu nombre</span>
                  <input type="text" value={form.owner_name || ''} onChange={e => setForm({ ...form, owner_name: e.target.value })} style={inputStyle} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  <span style={labelStyle}>WhatsApp</span>
                  <input type="tel" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  <span style={labelStyle}>Email</span>
                  <input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  <span style={labelStyle}>Ciudad</span>
                  <input type="text" value={form.city || ''} onChange={e => setForm({ ...form, city: e.target.value })} style={inputStyle} />
                </label>
                <label style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  <span style={labelStyle}>Dirección</span>
                  <input type="text" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} style={inputStyle} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  <span style={labelStyle}>Años experiencia</span>
                  <input type="text" value={form.experience_years || ''} onChange={e => setForm({ ...form, experience_years: e.target.value })} style={inputStyle} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  <span style={labelStyle}>Slug (URL)</span>
                  <input type="text" value={form.slug || ''} onChange={e => setForm({ ...form, slug: e.target.value })} style={inputStyle} />
                </label>
              </div>

              {/* IMÁGENES EN DATOS */}
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', marginTop: '2rem' }}>Imágenes</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {/* LOGO */}
                <div style={sectionStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontWeight: 700 }}>Logo</h4>
                    {form.logo_url && <button type="button" onClick={() => removeImage('logo')} style={{ color: '#dc2626', fontSize: '.75rem', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer' }}>✕ Eliminar</button>}
                  </div>
                  
                  {form.logo_url ? (
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                      <img src={form.logo_url} alt="Logo" style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8 }} />
                      <button
                        type="button"
                        onClick={() => removeImage('logo')}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          width: '32px',
                          height: '32px',
                          background: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '1.2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label style={{ display: 'block', padding: '1.5rem', border: '2px dashed #ddd', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}>
                      <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && addGalleryImage(e.target.files[0])} style={{ display: 'none' }} />
                      <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>🖼️</div>
                      <div style={{ fontSize: '.85rem', color: '#666' }}>Subir logo</div>
                    </label>
                  )}
                </div>

                {/* HERO IMAGE */}
                <div style={sectionStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h4 style={{ fontWeight: 700 }}>Imagen Principal</h4>
                    {form.hero_image_url && <button type="button" onClick={() => removeImage('hero')} style={{ color: '#dc2626', fontSize: '.75rem', fontWeight: 700, background: 'transparent', border: 'none', cursor: 'pointer' }}>✕ Eliminar</button>}
                  </div>

                  {form.hero_image_url ? (
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem', width: '100%' }}>
                      <img src={form.hero_image_url} alt="Hero" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
                      <button
                        type="button"
                        onClick={() => removeImage('hero')}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          width: '32px',
                          height: '32px',
                          background: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '1.2rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <label style={{ display: 'block', padding: '1.5rem', border: '2px dashed #ddd', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          if (e.target.files?.[0]) {
                            const reader = new FileReader()
                            reader.onload = (evt) => setForm({ ...form, hero_image_url: evt.target?.result as string })
                            reader.readAsDataURL(e.target.files[0])
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                      <div style={{ fontSize: '1.5rem', marginBottom: '.5rem' }}>🌿</div>
                      <div style={{ fontSize: '.85rem', color: '#666' }}>Foto principal</div>
                    </label>
                  )}
                </div>
              </div>

              <button type="button" onClick={aplicarPlantilla} style={{ marginTop: '2rem', padding: '.75rem 1.5rem', background: '#ce93d8', color: '#2d0052', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                ✨ Aplicar plantilla del oficio
              </button>
            </div>
          )}

          {/* LANDING */}
          {section === 'landing' && (
            <div>
              <div style={sectionStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Hero</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                    <span style={labelStyle}>Titular principal</span>
                    <input type="text" value={form.headline || ''} onChange={e => setForm({ ...form, headline: e.target.value })} style={inputStyle} />
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                    <span style={labelStyle}>Subtítulo</span>
                    <input type="text" value={form.subtitle || ''} onChange={e => setForm({ ...form, subtitle: e.target.value })} style={inputStyle} />
                  </label>
                  <label style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                    <span style={labelStyle}>Introducción</span>
                    <textarea value={form.intro_text || ''} onChange={e => setForm({ ...form, intro_text: e.target.value })} rows={3} style={{...inputStyle, resize: 'vertical' }} />
                  </label>
                </div>
              </div>

              <div style={sectionStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Servicios (3)</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                        <span style={labelStyle}>Servicio {i}</span>
                        <input type="text" value={form[`service_${i}_title` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`service_${i}_title`]: e.target.value })} style={inputStyle} />
                      </label>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                        <span style={labelStyle}>Descripción</span>
                        <input type="text" value={form[`service_${i}_desc` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`service_${i}_desc`]: e.target.value })} style={inputStyle} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div style={sectionStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Beneficios (3)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  {[1, 2, 3].map(i => (
                    <label key={i} style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                      <span style={labelStyle}>Beneficio {i}</span>
                      <input type="text" value={form[`benefit_${i}` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`benefit_${i}`]: e.target.value })} style={inputStyle} />
                    </label>
                  ))}
                </div>
              </div>

              <div style={sectionStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Proceso (4 pasos)</h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                        <span style={labelStyle}>Paso {i} - Título</span>
                        <input type="text" value={form[`process_${i}_title` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`process_${i}_title`]: e.target.value })} style={inputStyle} />
                      </label>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                        <span style={labelStyle}>Descripción</span>
                        <input type="text" value={form[`process_${i}_text` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`process_${i}_text`]: e.target.value })} style={inputStyle} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div style={sectionStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Testimonios (3)</h3>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                        <span style={labelStyle}>Nombre {i}</span>
                        <input type="text" value={form[`testimonial_${i}_name` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`testimonial_${i}_name`]: e.target.value })} style={inputStyle} />
                      </label>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                        <span style={labelStyle}>Rol</span>
                        <input type="text" value={form[`testimonial_${i}_role` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`testimonial_${i}_role`]: e.target.value })} style={inputStyle} />
                      </label>
                      <label style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                        <span style={labelStyle}>Opinión</span>
                        <textarea value={form[`testimonial_${i}_text` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`testimonial_${i}_text`]: e.target.value })} rows={2} style={{...inputStyle, resize: 'vertical' }} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div style={sectionStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>FAQ (4 preguntas)</h3>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {[1, 2, 3, 4].map(i => (
                    <div key={i}>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginBottom: '.5rem' }}>
                        <span style={labelStyle}>Pregunta {i}</span>
                        <input type="text" value={form[`faq_${i}_q` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`faq_${i}_q`]: e.target.value })} style={inputStyle} />
                      </label>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                        <span style={labelStyle}>Respuesta</span>
                        <textarea value={form[`faq_${i}_a` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`faq_${i}_a`]: e.target.value })} rows={2} style={{...inputStyle, resize: 'vertical' }} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div style={sectionStyle}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  <span style={labelStyle}>Mensaje WhatsApp predeterminado</span>
                  <textarea value={form.whatsapp_message || ''} onChange={e => setForm({ ...form, whatsapp_message: e.target.value })} rows={2} style={{...inputStyle, resize: 'vertical' }} />
                </label>
              </div>
            </div>
          )}

          {/* GALERÍA */}
          {section === 'galeria' && (
            <div>
              <div style={sectionStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Tus fotos</h3>
                <label style={{ display: 'block', padding: '2rem', border: '2px dashed #2d5a27', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', background: '#fef7f2', transition: 'all .2s' }}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={e => Array.from(e.target.files || []).forEach(file => addGalleryImage(file))}
                    style={{ display: 'none' }}
                  />
                  <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>📸</div>
                  <div style={{ fontWeight: 600, color: '#1a2818', marginBottom: '.25rem' }}>Sube tus fotos aquí</div>
                  <div style={{ fontSize: '.85rem', color: '#999' }}>O arrastra y suelta</div>
                </label>
              </div>

              {form.gallery_urls && form.gallery_urls.length > 0 && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Fotos cargadas ({form.gallery_urls.length})</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
                    {form.gallery_urls.map((url, i) => (
                      <div key={i} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,.1)' }}>
                        <img src={url} alt={`Foto ${i + 1}`} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(i)}
                          style={{
                            position: 'absolute',
                            top: '.75rem',
                            right: '.75rem',
                            width: '36px',
                            height: '36px',
                            background: 'rgba(220, 38, 38, 0.95)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '1.3rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all .2s',
                            boxShadow: '0 2px 8px rgba(0,0,0,.2)',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220, 38, 38, 0.95)'; e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BOTONES */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e5dcc9' }}>
            <button type="button" onClick={() => setForm(profile!)} style={{ padding: '.75rem 1.5rem', background: 'transparent', color: '#666', border: '1px solid #ddd', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>
              Descartar
            </button>
            <button type="submit" disabled={saving} style={{ padding: '.75rem 1.5rem', background: '#2d5a27', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Guardando…' : '✅ Guardar cambios'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
