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
  cif?: string
  instagram?: string
  tiktok?: string
  facebook?: string
  linkedin?: string
  youtube?: string
}

const inputStyle = { padding: '.9rem', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'inherit', fontSize: '.9rem', width: '100%' }
const labelStyle = { fontWeight: 700, fontSize: '.8rem', textTransform: 'uppercase' as const, color: '#2d5a27', marginBottom: '.5rem', display: 'block' }

export default function MiNegocio() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState<Partial<ProfileData>>({})
  const [tradeConfig, setTradeConfig] = useState(getTradeConfig('emprendedor'))
  
  // ✅ SECCIONES COLAPSABLES
  const [expandedSections, setExpandedSections] = useState({
    basicos: true,
    imagenes: false,
    galeria: false,
    hero: false,
    servicios: false,
    beneficios: false,
    proceso: false,
    testimonios: false,
    faq: false,
    redes: false,
    whatsapp: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

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
      const updateData = { ...form }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (error) {
        setMessage('❌ Error: ' + error.message)
        return
      }

      setMessage('✅ Cambios guardados correctamente')
      await loadProfile()
      setTimeout(() => setMessage(''), 4000)
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
    setMessage('✨ Plantilla aplicada correctamente')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleTradeChange = (newTrade: string) => {
    setForm({ ...form, trade: newTrade })
    const newConfig = getTradeConfig(newTrade)
    setTradeConfig(newConfig)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'logo' | 'hero') => {
    if (e.target.files?.[0]) {
      const reader = new FileReader()
      reader.onload = (evt) => {
        if (tipo === 'logo') {
          setForm({ ...form, logo_url: evt.target?.result as string })
        } else {
          setForm({ ...form, hero_image_url: evt.target?.result as string })
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
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

  // ✅ GENERAR TABLA WHATSAPP
  const generarTablaWhatsApp = () => {
    const datos = `
  Hola, te escribo desde el formulario de la web
📋 *Datos de contacto:*
👤 Nombre: ${form.owner_name || '(No especificado)'}
🏢 Negocio: ${form.business_name || '(No especificado)'}
📧 Email: ${form.email || '(No especificado)'}
📱 Teléfono: ${form.phone || '(No especificado)'}
📍 Localidad: ${form.city || '(No especificado)'}

¿Podemos agendar una cita?
    `.trim()
    return datos
  }

  const enviarWhatsApp = () => {
    const mensaje = generarTablaWhatsApp()
    const whatsappUrl = `https://wa.me/${form.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`
    window.open(whatsappUrl, '_blank')
  }

  if (loading) {
    return (
      <div className={styles.app}>
        <Sidebar active="/dashboard/mi-negocio" />
        <main className={styles.main} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 50, height: 50, border: '4px solid #e2ddd4', borderTopColor: '#2d5a27', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748b', fontSize: '.95rem' }}>Cargando tu negocio...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/mi-negocio" />

      <main className={styles.main} style={{ paddingBottom: '6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 700, marginBottom: '.5rem', color: '#1a2818' }}>Mi negocio</h1>
            <p style={{ color: '#64748b', fontSize: 'clamp(.85rem, 2vw, 0.95rem)' }}>Personaliza tu landing profesional</p>
          </div>
          {form.slug && (
            <a href={`/${form.slug}`} target="_blank" rel="noopener noreferrer" style={{
              padding: 'clamp(.6rem, 1.5vw, .85rem) clamp(1rem, 2vw, 1.8rem)',
              background: '#2d5a27',
              color: 'white',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: 'clamp(.75rem, 2vw, .85rem)',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all .2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '.6rem',
              whiteSpace: 'nowrap',
            }} onMouseEnter={e => e.currentTarget.style.background = '#1f4620'} onMouseLeave={e => e.currentTarget.style.background = '#2d5a27'}>
              👁️ Ver mi web
            </a>
          )}
        </div>

        {message && (
          <div style={{
            padding: 'clamp(.8rem, 2vw, 1.1rem) clamp(1rem, 2vw, 1.5rem)',
            borderRadius: 10,
            background: message.includes('✅') ? '#dcfce7' : message.includes('✨') ? '#fef3c7' : '#fee2e2',
            color: message.includes('✅') ? '#166534' : message.includes('✨') ? '#92400e' : '#991f1f',
            marginBottom: '2rem',
            fontSize: 'clamp(.8rem, 2vw, .9rem)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '.75rem',
          }}>
            <span style={{ fontSize: '1.3rem' }}>{message.includes('✅') ? '✅' : message.includes('✨') ? '✨' : '❌'}</span>
            {message}
          </div>
        )}

        <form onSubmit={save}>
          {/* ✅ DATOS BÁSICOS */}
          <SectionCollapsible
            title="📋 Datos básicos"
            isOpen={expandedSections.basicos}
            onClick={() => toggleSection('basicos')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 100%, 300px), 1fr))', gap: '1.5rem' }}>
              <label>
                <span style={labelStyle}>Nombre del negocio</span>
                <input type="text" value={form.business_name || ''} onChange={e => setForm({ ...form, business_name: e.target.value })} style={inputStyle} />
              </label>
              <label>
                <span style={labelStyle}>Tu nombre</span>
                <input type="text" value={form.owner_name || ''} onChange={e => setForm({ ...form, owner_name: e.target.value })} style={inputStyle} />
              </label>
              <label>
                <span style={labelStyle}>CIF / NIF</span>
                <input type="text" value={form.cif || ''} onChange={e => setForm({ ...form, cif: e.target.value })} style={inputStyle} placeholder="A12345678" />
              </label>
              <label>
                <span style={labelStyle}>Oficio / Profesión</span>
                <select value={form.trade || 'emprendedor'} onChange={e => handleTradeChange(e.target.value)} style={inputStyle}>
                  {Object.values(TRADES).map(t => <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>)}
                </select>
              </label>
              <label>
                <span style={labelStyle}>Teléfono / WhatsApp</span>
                <input type="tel" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
              </label>
              <label>
                <span style={labelStyle}>Email</span>
                <input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
              </label>
              <label>
                <span style={labelStyle}>Ciudad</span>
                <input type="text" value={form.city || ''} onChange={e => setForm({ ...form, city: e.target.value })} style={inputStyle} />
              </label>
              <label>
                <span style={labelStyle}>Dirección</span>
                <input type="text" value={form.address || ''} onChange={e => setForm({ ...form, address: e.target.value })} style={inputStyle} />
              </label>
              <label>
                <span style={labelStyle}>Años de experiencia</span>
                <input type="number" value={form.experience_years || ''} onChange={e => setForm({ ...form, experience_years: e.target.value })} style={inputStyle} />
              </label>
            </div>
          </SectionCollapsible>

          {/* ✅ IMÁGENES */}
          <SectionCollapsible
            title="🖼️ Imágenes"
            isOpen={expandedSections.imagenes}
            onClick={() => toggleSection('imagenes')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 100%, 300px), 1fr))', gap: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '.75rem' }}>
                  <span style={labelStyle}>Logo</span>
                </label>
                {form.logo_url ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={form.logo_url} alt="Logo" style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 8 }} />
                    <button type="button" onClick={() => removeImage('logo')} style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '-12px',
                      width: '40px',
                      height: '40px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontWeight: 700,
                      fontSize: '1.2rem',
                    }}>×</button>
                  </div>
                ) : (
                  <label style={{ display: 'block', padding: '2rem', border: '2px dashed #ddd', borderRadius: 8, cursor: 'pointer', textAlign: 'center', background: '#fafafa' }}>
                    <input type="file" accept="image/*" onChange={e => handleImageChange(e, 'logo')} style={{ display: 'none' }} />
                    <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>🖼️</div>
                    <div style={{ fontSize: 'clamp(.75rem, 2vw, .85rem)', color: '#666' }}>Sube tu logo</div>
                  </label>
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '.75rem' }}>
                  <span style={labelStyle}>Imagen principal</span>
                </label>
                {form.hero_image_url ? (
                  <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                    <img src={form.hero_image_url} alt="Hero" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
                    <button type="button" onClick={() => removeImage('hero')} style={{
                      position: 'absolute',
                      top: '-12px',
                      right: '-12px',
                      width: '40px',
                      height: '40px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      fontWeight: 700,
                    }}>×</button>
                  </div>
                ) : (
                  <label style={{ display: 'block', padding: '2rem', border: '2px dashed #ddd', borderRadius: 8, cursor: 'pointer', textAlign: 'center', background: '#fafafa' }}>
                    <input type="file" accept="image/*" onChange={e => handleImageChange(e, 'hero')} style={{ display: 'none' }} />
                    <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>🌄</div>
                    <div style={{ fontSize: 'clamp(.75rem, 2vw, .85rem)', color: '#666' }}>Sube imagen principal</div>
                  </label>
                )}
              </div>
            </div>
          </SectionCollapsible>

          {/* ✅ GALERÍA */}
          <SectionCollapsible
            title="📸 Galería de fotos"
            isOpen={expandedSections.galeria}
            onClick={() => toggleSection('galeria')}
          >
            <label style={{ display: 'block', padding: '2.5rem', border: '2px dashed #2d5a27', borderRadius: 8, cursor: 'pointer', textAlign: 'center', background: '#fef7f2', marginBottom: '2rem' }}>
              <input type="file" multiple accept="image/*" onChange={e => Array.from(e.target.files || []).forEach(file => addGalleryImage(file))} style={{ display: 'none' }} />
              <div style={{ fontSize: '3rem', marginBottom: '.75rem' }}>📸</div>
              <div style={{ fontWeight: 700, color: '#1a2818', marginBottom: '.3rem', fontSize: 'clamp(.85rem, 2vw, 1rem)' }}>Sube tus fotos aquí</div>
              <div style={{ fontSize: 'clamp(.75rem, 2vw, .85rem)', color: '#999' }}>O arrastra y suelta</div>
            </label>

            {form.gallery_urls && form.gallery_urls.length > 0 && (
              <div>
                <h3 style={{ fontSize: 'clamp(.9rem, 2vw, 1rem)', fontWeight: 700, marginBottom: '1.5rem', color: '#1a2818' }}>Fotos cargadas ({form.gallery_urls.length})</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(120px, 25vw, 150px), 1fr))', gap: '1.5rem' }}>
                  {form.gallery_urls.map((url, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,.1)', aspectRatio: '1' }}>
                      <img src={url} alt={`Foto ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" onClick={() => removeGalleryImage(i)} style={{
                        position: 'absolute',
                        top: '.5rem',
                        right: '.5rem',
                        width: '36px',
                        height: '36px',
                        background: 'rgba(220, 38, 38, 0.95)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontWeight: 700,
                        fontSize: '1.2rem',
                      }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SectionCollapsible>

          {/* ✅ HERO */}
          <SectionCollapsible
            title="⭐ Hero (Portada)"
            isOpen={expandedSections.hero}
            onClick={() => toggleSection('hero')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 100%, 300px), 1fr))', gap: '1.5rem' }}>
              <label style={{ gridColumn: 'auto' }}>
                <span style={labelStyle}>Titular principal</span>
                <input type="text" value={form.headline || ''} onChange={e => setForm({ ...form, headline: e.target.value })} style={inputStyle} />
              </label>
              <label style={{ gridColumn: 'auto' }}>
                <span style={labelStyle}>Subtítulo</span>
                <input type="text" value={form.subtitle || ''} onChange={e => setForm({ ...form, subtitle: e.target.value })} style={inputStyle} />
              </label>
              <label style={{ gridColumn: '1 / -1' }}>
                <span style={labelStyle}>Introducción</span>
                <textarea value={form.intro_text || ''} onChange={e => setForm({ ...form, intro_text: e.target.value })} rows={3} style={{...inputStyle, resize: 'vertical'}} />
              </label>
            </div>
          </SectionCollapsible>

          {/* ✅ SERVICIOS */}
          <SectionCollapsible
            title="🎯 Servicios (3)"
            isOpen={expandedSections.servicios}
            onClick={() => toggleSection('servicios')}
          >
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 100%, 300px), 1fr))', gap: '1.5rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: i < 3 ? '1px solid #e5dcc9' : 'none' }}>
                <label>
                  <span style={labelStyle}>Servicio {i}</span>
                  <input type="text" value={form[`service_${i}_title` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`service_${i}_title`]: e.target.value })} style={inputStyle} />
                </label>
                <label>
                  <span style={labelStyle}>Descripción</span>
                  <input type="text" value={form[`service_${i}_desc` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`service_${i}_desc`]: e.target.value })} style={inputStyle} />
                </label>
              </div>
            ))}
          </SectionCollapsible>

          {/* ✅ BENEFICIOS */}
          <SectionCollapsible
            title="💎 Beneficios (3)"
            isOpen={expandedSections.beneficios}
            onClick={() => toggleSection('beneficios')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 100%, 250px), 1fr))', gap: '1.5rem' }}>
              {[1, 2, 3].map(i => (
                <label key={i}>
                  <span style={labelStyle}>Beneficio {i}</span>
                  <input type="text" value={form[`benefit_${i}` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`benefit_${i}`]: e.target.value })} style={inputStyle} />
                </label>
              ))}
            </div>
          </SectionCollapsible>

          {/* ✅ PROCESO */}
          <SectionCollapsible
            title="🔄 Proceso (4 pasos)"
            isOpen={expandedSections.proceso}
            onClick={() => toggleSection('proceso')}
          >
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 100%, 300px), 1fr))', gap: '1.5rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: i < 4 ? '1px solid #e5dcc9' : 'none' }}>
                <label>
                  <span style={labelStyle}>Paso {i} - Título</span>
                  <input type="text" value={form[`process_${i}_title` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`process_${i}_title`]: e.target.value })} style={inputStyle} />
                </label>
                <label>
                  <span style={labelStyle}>Descripción</span>
                  <input type="text" value={form[`process_${i}_text` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`process_${i}_text`]: e.target.value })} style={inputStyle} />
                </label>
              </div>
            ))}
          </SectionCollapsible>

          {/* ✅ TESTIMONIOS */}
          <SectionCollapsible
            title="⭐ Testimonios (3)"
            isOpen={expandedSections.testimonios}
            onClick={() => toggleSection('testimonios')}
          >
            {[1, 2, 3].map(i => (
              <div key={i} style={{ paddingBottom: i < 3 ? '1.5rem' : '0', borderBottom: i < 3 ? '1px solid #e5dcc9' : 'none', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 100%, 250px), 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
                  <label>
                    <span style={labelStyle}>Nombre {i}</span>
                    <input type="text" value={form[`testimonial_${i}_name` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`testimonial_${i}_name`]: e.target.value })} style={inputStyle} />
                  </label>
                  <label>
                    <span style={labelStyle}>Rol / Empresa</span>
                    <input type="text" value={form[`testimonial_${i}_role` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`testimonial_${i}_role`]: e.target.value })} style={inputStyle} />
                  </label>
                </div>
                <label>
                  <span style={labelStyle}>Opinión</span>
                  <textarea value={form[`testimonial_${i}_text` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`testimonial_${i}_text`]: e.target.value })} rows={2} style={{...inputStyle, resize: 'vertical'}} />
                </label>
              </div>
            ))}
          </SectionCollapsible>

          {/* ✅ FAQ */}
          <SectionCollapsible
            title="❓ FAQ (4 preguntas)"
            isOpen={expandedSections.faq}
            onClick={() => toggleSection('faq')}
          >
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ paddingBottom: '1.5rem', borderBottom: i < 4 ? '1px solid #e5dcc9' : 'none', marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '1rem' }}>
                  <span style={labelStyle}>Pregunta {i}</span>
                  <input type="text" value={form[`faq_${i}_q` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`faq_${i}_q`]: e.target.value })} style={inputStyle} />
                </label>
                <label>
                  <span style={labelStyle}>Respuesta</span>
                  <textarea value={form[`faq_${i}_a` as keyof ProfileData] as string || ''} onChange={e => setForm({ ...form, [`faq_${i}_a`]: e.target.value })} rows={2} style={{...inputStyle, resize: 'vertical'}} />
                </label>
              </div>
            ))}
          </SectionCollapsible>

          {/* ✅ REDES SOCIALES */}
          <SectionCollapsible
            title="📱 Redes sociales"
            isOpen={expandedSections.redes}
            onClick={() => toggleSection('redes')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 100%, 250px), 1fr))', gap: '1.5rem' }}>
              {[
                { key: 'instagram', label: 'Instagram', icon: '📷' },
                { key: 'tiktok', label: 'TikTok', icon: '🎵' },
                { key: 'facebook', label: 'Facebook', icon: '👍' },
                { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
                { key: 'youtube', label: 'YouTube', icon: '▶️' },
              ].map(social => (
                <label key={social.key}>
                  <span style={labelStyle}>{social.icon} {social.label}</span>
                  <input 
                    type="text" 
                    value={form[social.key as keyof ProfileData] as string || ''} 
                    onChange={e => setForm({ ...form, [social.key]: e.target.value })} 
                    style={inputStyle}
                    placeholder={`Tu perfil de ${social.label}`}
                  />
                </label>
              ))}
            </div>
          </SectionCollapsible>

          {/* ✅ WHATSAPP */}
          <SectionCollapsible
            title="💬 Contacto directo (WhatsApp)"
            isOpen={expandedSections.whatsapp}
            onClick={() => toggleSection('whatsapp')}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <label>
                <span style={labelStyle}>Mensaje WhatsApp predeterminado</span>
                <textarea value={form.whatsapp_message || ''} onChange={e => setForm({ ...form, whatsapp_message: e.target.value })} rows={3} style={{...inputStyle, resize: 'vertical'}} placeholder="Personaliza el mensaje que enviarán tus clientes" />
              </label>
            </div>

            <div style={{ background: '#f0f9ff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #bae6fd', marginBottom: '1.5rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: 'clamp(.85rem, 2vw, .95rem)', fontWeight: 700, color: '#0369a1' }}>📋 Vista previa de la tabla de datos:</h4>
              <div style={{ background: '#fff', padding: '1rem', borderRadius: '6px', fontSize: 'clamp(.75rem, 2vw, .85rem)', lineHeight: '1.8', fontFamily: 'monospace', color: '#334155' }}>
                <div>📋 <strong>Datos de contacto:</strong></div>
                <div>👤 Nombre: {form.owner_name || '(No especificado)'}</div>
                <div>🏢 Negocio: {form.business_name || '(No especificado)'}</div>
                <div>📧 Email: {form.email || '(No especificado)'}</div>
                <div>📱 Teléfono: {form.phone || '(No especificado)'}</div>
                <div>📍 Localidad: {form.city || '(No especificado)'}</div>
                <div style={{ marginTop: '0.5rem', fontWeight: 700 }}>¿Podemos agendar una cita?</div>
              </div>
            </div>

            <button 
              type="button"
              onClick={enviarWhatsApp}
              style={{
                width: '100%',
                padding: 'clamp(.7rem, 2vw, 1rem)',
                background: '#25d366',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: 'clamp(.8rem, 2vw, .9rem)',
                transition: 'all .2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#20ba5c'}
              onMouseLeave={e => e.currentTarget.style.background = '#25d366'}
            >
              📱 Enviar tabla de prueba a WhatsApp
            </button>
          </SectionCollapsible>

          {/* ✅ COLORES */}
          <SectionCollapsible
            title="🎨 Colores personalizados"
            isOpen={expandedSections.whatsapp}
            onClick={() => toggleSection('whatsapp')}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(150px, 100%, 180px), 1fr))', gap: '1.5rem' }}>
              <label>
                <span style={labelStyle}>Color primario</span>
                <input type="color" value={form.color_primary || tradeConfig.colors.primary} onChange={e => setForm({ ...form, color_primary: e.target.value })} style={{...inputStyle, height: '50px', cursor: 'pointer'}} />
              </label>
              <label>
                <span style={labelStyle}>Color secundario</span>
                <input type="color" value={form.color_secondary || tradeConfig.colors.secondary} onChange={e => setForm({ ...form, color_secondary: e.target.value })} style={{...inputStyle, height: '50px', cursor: 'pointer'}} />
              </label>
              <label>
                <span style={labelStyle}>Color acento</span>
                <input type="color" value={form.color_accent || tradeConfig.colors.accent} onChange={e => setForm({ ...form, color_accent: e.target.value })} style={{...inputStyle, height: '50px', cursor: 'pointer'}} />
              </label>
            </div>
          </SectionCollapsible>
        </form>
      </main>

      {/* ✅ BOTONES STICKY - RESPONSIVE */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        borderTop: '1px solid #e5ddcf',
        padding: 'clamp(1rem, 2vw, 1.5rem)',
        display: 'flex',
        gap: 'clamp(.8rem, 2vw, 1.5rem)',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        zIndex: 100,
        boxShadow: '0 -4px 12px rgba(0,0,0,.08)',
      }}>
        <button 
          type="button"
          onClick={aplicarPlantilla}
          style={{
            padding: 'clamp(.6rem, 1.5vw, .85rem) clamp(1rem, 2vw, 1.8rem)',
            background: 'linear-gradient(135deg, #ce93d8, #ba68c8)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: 'clamp(.75rem, 2vw, .85rem)',
            cursor: 'pointer',
            transition: 'all .3s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(206, 147, 216, 0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          ✨ Aplicar plantilla
        </button>

        {form.slug && (
          <a 
            href={`/${form.slug}`} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              padding: 'clamp(.6rem, 1.5vw, .85rem) clamp(1rem, 2vw, 1.8rem)',
              background: '#2d5a27',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: 'clamp(.75rem, 2vw, .85rem)',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '.6rem',
              whiteSpace: 'nowrap',
              transition: 'all .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1f4620'}
            onMouseLeave={e => e.currentTarget.style.background = '#2d5a27'}
          >
            👁️ Ver web
          </a>
        )}

        <button 
          type="submit"
          onClick={(e) => {
            const form = document.querySelector('form') as HTMLFormElement
            form?.dispatchEvent(new Event('submit', { bubbles: true }))
          }}
          disabled={saving}
          style={{
            flex: '1',
            minWidth: 'clamp(150px, 100%, 200px)',
            padding: 'clamp(.6rem, 1.5vw, .85rem) clamp(1rem, 2vw, 1.8rem)',
            background: '#0a0f14',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: 'clamp(.75rem, 2vw, .85rem)',
            cursor: 'pointer',
            opacity: saving ? 0.7 : 1,
            transition: 'all .3s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => !saving && (e.currentTarget.style.background = '#1c2b3a')}
          onMouseLeave={e => e.currentTarget.style.background = '#0a0f14'}
        >
          {saving ? '⏳ Guardando...' : '✅ Guardar cambios'}
        </button>
      </div>
    </div>
  )
}

// ✅ COMPONENTE SECCIÓN COLAPSABLE
function SectionCollapsible({ title, isOpen, onClick, children }: {
  title: string
  isOpen: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <div style={{
      background: '#f9f6f0',
      borderRadius: '12px',
      marginBottom: '2rem',
      border: '1px solid #e5dcc9',
      overflow: 'hidden',
    }}>
      <button
        type="button"
        onClick={onClick}
        style={{
          width: '100%',
          padding: 'clamp(1rem, 2vw, 1.5rem)',
          background: '#f9f6f0',
          border: 'none',
          borderBottom: isOpen ? '1px solid #e5dcc9' : 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 'clamp(.9rem, 2vw, 1.1rem)',
          fontWeight: 700,
          color: '#1a2818',
          transition: 'all .2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#f3f0ea'}
        onMouseLeave={e => e.currentTarget.style.background = '#f9f6f0'}
      >
        {title}
        <span style={{
          fontSize: '1.5rem',
          transition: 'transform .3s',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div style={{ padding: 'clamp(1rem, 2vw, 2rem)', animation: 'slideDown 0.3s ease' }}>
          {children}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
