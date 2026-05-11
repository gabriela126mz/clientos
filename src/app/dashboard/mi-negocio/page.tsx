'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import { useAuth } from '@/lib/context'
import { createClient } from '@/lib/supabase/client'
import { TRADES, getTradeConfig } from '@/lib/trades'
import { optimizeImage, validateImage, imageConfigs } from '@/lib/imageOptimization'

interface ProfileData {
  id: string
  business_name: string
  owner_name: string
  trade: string
  phone: string
  email: string
  business_email: string
  cif: string
  city: string
  address: string
  headline: string
  subtitle: string
  intro_text: string
  about_title: string
  about_text: string
  about_image: string
  experience_years: string
  service_1_title: string
  service_1_desc: string
  service_1_image: string
  service_2_title: string
  service_2_desc: string
  service_2_image: string
  service_3_title: string
  service_3_desc: string
  service_3_image: string
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
  instagram?: string
  tiktok?: string
  facebook?: string
  linkedin?: string
  youtube?: string
  twitter?: string
}

// ESTILOS RESPONSIVE
const inputStyle = { 
  padding: 'clamp(0.7rem, 2vw, 0.9rem)', 
  border: '1px solid #ddd', 
  borderRadius: '8px', 
  fontFamily: 'inherit', 
  fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', 
  width: '100%',
  boxSizing: 'border-box' as const,
}

const labelStyle = { 
  fontWeight: 700, 
  fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', 
  textTransform: 'uppercase' as const, 
  color: '#2d5a27', 
  marginBottom: '0.5rem', 
  display: 'block' as const,
}

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical' as const,
  minHeight: '100px',
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
  const [tradeConfig, setTradeConfig] = useState(getTradeConfig('fontanero'))
  const [optimizingImages, setOptimizingImages] = useState(false)
  
  const [expandedSections, setExpandedSections] = useState({
    basicos: true,
    imagenes: false,
    quienesomos: false,
    hero: false,
    servicios: false,
    beneficios: false,
    proceso: false,
    testimonios: false,
    faq: false,
    redes: false,
    whatsapp: false,
    colores: false,
    galeria: false,
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

      console.log('✅ Datos cargados correctamente')
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

  const autoSave = useCallback(async (dataToSave: Partial<ProfileData>) => {
    if (!user) return

    try {
      const updateData = {
        ...dataToSave,
        cif: (dataToSave.cif || '').trim().toUpperCase(),
        business_email: (dataToSave.business_email || '').trim().toLowerCase(),
        // 🔧 ASEGURAR QUE LOS COLORES SE GUARDEN CORRECTAMENTE
        color_primary: dataToSave.color_primary || null,
        color_secondary: dataToSave.color_secondary || null,
        color_accent: dataToSave.color_accent || null,
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (error) {
        console.error('Error guardando:', error)
        return false
      }
      console.log('✅ AutoSave guardado:', updateData)
      return true
    } catch (err) {
      console.error('Error:', err)
      return false
    }
  }, [user, supabase])

  const handleFieldChange = (field: string, value: any) => {
    const newForm = { ...form, [field]: value }
    setForm(newForm)
    autoSave(newForm)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setMessage('')

    try {
      const updateData = {
        ...form,
        cif: (form.cif || '').trim().toUpperCase(),
        business_email: (form.business_email || '').trim().toLowerCase(),
        // 🔧 ASEGURAR QUE LOS COLORES SE GUARDEN EN LA BD
        color_primary: form.color_primary || null,
        color_secondary: form.color_secondary || null,
        color_accent: form.color_accent || null,
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

      if (error) {
        setMessage('❌ Error: ' + error.message)
        console.error('Error guardando:', error)
        return
      }

      setMessage('✅ Cambios guardados correctamente')
      await loadProfile()
      setTimeout(() => setMessage(''), 4000)
    } catch (err) {
      setMessage('❌ Error inesperado')
      console.error('Error:', err)
    } finally {
      setSaving(false)
    }
  }

  const aplicarPlantilla = async () => {
    // 🔧 APLICAR PLANTILLA Y GUARDAR EN BD
    const config = getTradeConfig(form.trade || 'fontanero')
    
    // 🎯 SIEMPRE usar los valores de config (no usar || porque queremos sobrescribir)
    const newForm = {
      ...form,
      // HEADLINE + HERO
      headline: config.defaultHeadline,
      subtitle: config.defaultSubtitle,
      intro_text: config.defaultIntro,
      hero_image_url: config.galleryImages[0],
      
      // QUIÉNES SOMOS
      about_title: config.defaultAboutTitle,
      about_text: config.defaultAboutText,
      about_image: config.defaultAboutImage || config.galleryImages[1],
      
      // SERVICIOS
      service_1_title: config.defaultServices[0].name,
      service_1_desc: config.defaultServices[0].desc,
      service_1_image: config.galleryImages[2],
      service_2_title: config.defaultServices[1].name,
      service_2_desc: config.defaultServices[1].desc,
      service_2_image: config.galleryImages[3],
      service_3_title: config.defaultServices[2].name,
      service_3_desc: config.defaultServices[2].desc,
      service_3_image: config.galleryImages[4],
      
      // BENEFICIOS
      benefit_1: config.defaultBenefits[0],
      benefit_2: config.defaultBenefits[1],
      benefit_3: config.defaultBenefits[2],
      
      // PROCESO
      process_1_title: config.defaultProcess[0].title,
      process_1_text: config.defaultProcess[0].text,
      process_2_title: config.defaultProcess[1].title,
      process_2_text: config.defaultProcess[1].text,
      process_3_title: config.defaultProcess[2].title,
      process_3_text: config.defaultProcess[2].text,
      process_4_title: config.defaultProcess[3].title,
      process_4_text: config.defaultProcess[3].text,
      
      // TESTIMONIOS
      testimonial_1_name: config.defaultTestimonials[0]?.name || '',
      testimonial_1_role: config.defaultTestimonials[0]?.role || '',
      testimonial_1_text: config.defaultTestimonials[0]?.text || '',
      testimonial_2_name: config.defaultTestimonials[1]?.name || '',
      testimonial_2_role: config.defaultTestimonials[1]?.role || '',
      testimonial_2_text: config.defaultTestimonials[1]?.text || '',
      testimonial_3_name: config.defaultTestimonials[2]?.name || '',
      testimonial_3_role: config.defaultTestimonials[2]?.role || '',
      testimonial_3_text: config.defaultTestimonials[2]?.text || '',
      
      // FAQ
      faq_1_q: config.defaultFaqs[0]?.q || '',
      faq_1_a: config.defaultFaqs[0]?.a || '',
      faq_2_q: config.defaultFaqs[1]?.q || '',
      faq_2_a: config.defaultFaqs[1]?.a || '',
      faq_3_q: config.defaultFaqs[2]?.q || '',
      faq_3_a: config.defaultFaqs[2]?.a || '',
      faq_4_q: config.defaultFaqs[3]?.q || '',
      faq_4_a: config.defaultFaqs[3]?.a || '',
      
      // COLORES
      color_primary: config.colors.primary,
      color_secondary: config.colors.secondary,
      color_accent: config.colors.accent,
      
      // LOGO
      logo_url: config.galleryImages[0],
    }
    
    console.log('📋 Aplicando plantilla con:', {
      headline: newForm.headline,
      about_image: newForm.about_image,
      color_primary: newForm.color_primary,
      service_1_image: newForm.service_1_image,
    })
    
    setForm(newForm)
    const success = await autoSave(newForm)
    
    if (success) {
      setMessage('✨ ¡Plantilla aplicada! Todas las fotos y textos están listos')
      setTimeout(() => setMessage(''), 4000)
    } else {
      setMessage('❌ Error al guardar plantilla')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleTradeChange = async (newTrade: string) => {
    // 🔧 NO BORRAR DATOS - SOLO CAMBIAR TRADE Y CONFIG
    const newForm = { ...form, trade: newTrade }
    setForm(newForm)
    await autoSave(newForm)
    const newConfig = getTradeConfig(newTrade)
    setTradeConfig(newConfig)
    setMessage('✅ Oficio actualizado (tus datos se mantienen)')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo_url' | 'hero_image_url' | 'about_image' | 'service_1_image' | 'service_2_image' | 'service_3_image') => {
    if (!e.target.files?.[0]) return

    const file = e.target.files[0]
    const validation = validateImage(file)
    
    if (!validation.valid) {
      setMessage(`❌ ${validation.error}`)
      return
    }

    setOptimizingImages(true)
    try {
      let section: 'logo' | 'hero' | 'about' | 'servicio' = 'servicio'
      if (field === 'logo_url') section = 'logo'
      else if (field === 'hero_image_url') section = 'hero'
      else if (field === 'about_image') section = 'about'
      
      const optimized = await optimizeImage(file, section as keyof typeof imageConfigs)
      
      const newForm = { ...form, [field]: optimized }
      setForm(newForm)
      await autoSave(newForm)
      setMessage(`✅ Imagen optimizada`)
      setTimeout(() => setMessage(''), 2000)
    } catch (err) {
      setMessage('❌ Error al procesar la imagen')
      console.error(err)
    } finally {
      setOptimizingImages(false)
    }
  }

  const removeImage = async (field: keyof ProfileData) => {
    const newForm = { ...form, [field]: '' }
    setForm(newForm)
    await autoSave(newForm)
  }

  const addGalleryImage = async (file: File) => {
    const validation = validateImage(file)
    if (!validation.valid) {
      setMessage(`❌ ${validation.error}`)
      return
    }

    // 🔧 VERIFICAR MÁXIMO 5 IMÁGENES ANTES DE PROCESAR
    const currentGallery = (form.gallery_urls || [])
    if (currentGallery.length >= 5) {
      setMessage('❌ Máximo 5 imágenes en la galería')
      return
    }

    setOptimizingImages(true)
    try {
      const optimized = await optimizeImage(file, 'galeria')
      const gallery = [...currentGallery]
      gallery.push(optimized)
      const newForm = { ...form, gallery_urls: gallery }
      setForm(newForm)
      await autoSave(newForm)
      setMessage(`✅ Imagen añadida (${gallery.length}/5)`)
      setTimeout(() => setMessage(''), 2000)
    } catch (err) {
      console.error(err)
      setMessage('❌ Error al añadir imagen')
    } finally {
      setOptimizingImages(false)
    }
  }

  const removeGalleryImage = async (index: number) => {
    const gallery = (form.gallery_urls || []).filter((_, i) => i !== index)
    const newForm = { ...form, gallery_urls: gallery }
    setForm(newForm)
    await autoSave(newForm)
  }

  if (loading) {
    return (
      <div className={styles.app}>
        <Sidebar active="/dashboard/mi-negocio" />
        <main className={styles.main} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 50, height: 50, border: '4px solid #e2ddd4', borderTopColor: '#2d5a27', borderRadius: '50%', margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748b', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>Cargando tu negocio...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/mi-negocio" />

      <main className={styles.main} style={{ paddingBottom: '8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'clamp(1.5rem, 4vw, 2.5rem)', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.2rem)', fontWeight: 700, marginBottom: '0.5rem', color: '#1a2818' }}>Mi negocio</h1>
            <p style={{ color: '#64748b', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' }}>Personaliza tu landing profesional</p>
          </div>
          {form.slug && (
            <a href={`/${form.slug}`} target="_blank" rel="noopener noreferrer" style={{
              padding: 'clamp(0.6rem, 1.5vw, 0.85rem) clamp(1rem, 2vw, 1.8rem)',
              background: form.color_primary || '#2d5a27',
              color: 'white',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: 'clamp(0.7rem, 2vw, 0.85rem)',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all .2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              whiteSpace: 'nowrap',
            }} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              👁️ Ver mi landing
            </a>
          )}
        </div>

        {message && (
          <div style={{
            padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1rem, 2vw, 1.5rem)',
            borderRadius: 10,
            background: message.includes('✅') ? '#dcfce7' : message.includes('✨') ? '#fef3c7' : '#fee2e2',
            color: message.includes('✅') ? '#166534' : message.includes('✨') ? '#92400e' : '#991f1f',
            marginBottom: '2rem',
            fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <span style={{ fontSize: '1.2rem' }}>{message.includes('✅') ? '✅' : message.includes('✨') ? '✨' : '❌'}</span>
            {message}
          </div>
        )}

        <form onSubmit={save}>
          {/* ✅ DATOS BÁSICOS */}
          <SectionCollapsible title="📋 Datos básicos" isOpen={expandedSections.basicos} onClick={() => toggleSection('basicos')}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 100%, 300px), 1fr))', gap: '1.5rem' }}>
              <label>
                <span style={labelStyle}>Nombre del negocio</span>
                <input type="text" value={form.business_name || ''} onChange={e => handleFieldChange('business_name', e.target.value)} style={inputStyle} />
              </label>
              <label>
                <span style={labelStyle}>Tu nombre</span>
                <input type="text" value={form.owner_name || ''} onChange={e => handleFieldChange('owner_name', e.target.value)} style={inputStyle} />
              </label>
              <label>
                <span style={labelStyle}>CIF / NIF</span>
                <input type="text" value={form.cif || ''} onChange={e => handleFieldChange('cif', e.target.value.toUpperCase())} style={inputStyle} placeholder="A12345678" />
              </label>
              <label>
                <span style={labelStyle}>Email Personal</span>
                <input type="email" value={form.email || ''} onChange={e => handleFieldChange('email', e.target.value)} style={inputStyle} />
              </label>
              <label>
                <span style={labelStyle}>Email Negocio</span>
                <input type="email" value={form.business_email || ''} onChange={e => handleFieldChange('business_email', e.target.value)} style={inputStyle} placeholder="contacto@miempresa.com" />
              </label>
              <label>
                <span style={labelStyle}>Teléfono / WhatsApp</span>
                <input type="tel" value={form.phone || ''} onChange={e => handleFieldChange('phone', e.target.value)} style={inputStyle} />
              </label>
              <label>
                <span style={labelStyle}>Oficio / Profesión</span>
                <select value={form.trade || 'fontanero'} onChange={e => handleTradeChange(e.target.value)} style={inputStyle}>
                  {Object.values(TRADES).sort((a, b) => (b.demand || 5) - (a.demand || 5)).map(t => <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>)}
                </select>
              </label>
              <label>
                <span style={labelStyle}>Ciudad</span>
                <input type="text" value={form.city || ''} onChange={e => handleFieldChange('city', e.target.value)} style={inputStyle} />
              </label>
              <label>
                <span style={labelStyle}>Dirección</span>
                <input type="text" value={form.address || ''} onChange={e => handleFieldChange('address', e.target.value)} style={inputStyle} />
              </label>
              <label>
                <span style={labelStyle}>Años de experiencia</span>
                <input type="number" value={form.experience_years || ''} onChange={e => handleFieldChange('experience_years', e.target.value)} style={inputStyle} />
              </label>
            </div>
          </SectionCollapsible>

          {/* ✅ IMÁGENES PRINCIPALES */}
          <SectionCollapsible title="🖼️ Imágenes principales" isOpen={expandedSections.imagenes} onClick={() => toggleSection('imagenes')}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 100%, 300px), 1fr))', gap: '2rem' }}>
              {[
                { field: 'logo_url', title: 'Logo (300x300px)', icon: '📌', desc: 'Tamaño ideal: 300x300px' },
                { field: 'hero_image_url', title: 'Imagen Principal (1200x600px)', icon: '🌄', desc: 'Tamaño ideal: 1200x600px' },
              ].map(({ field, title, icon, desc }) => (
                <div key={field}>
                  <label style={{ display: 'block', marginBottom: '0.75rem' }}>
                    <span style={labelStyle}>{icon} {title}</span>
                    <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)', color: '#999', marginTop: '0.25rem' }}>{desc}</div>
                  </label>
                  {form[field as keyof typeof form] ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img src={form[field as keyof typeof form] as string} alt={title} style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 8 }} />
                      <button type="button" onClick={() => removeImage(field as keyof ProfileData)} style={{
                        position: 'absolute', top: '-12px', right: '-12px', width: '40px', height: '40px',
                        background: '#dc2626', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', fontWeight: 700, fontSize: '1.2rem',
                      }}>×</button>
                    </div>
                  ) : (
                    <label style={{ display: 'block', padding: 'clamp(1.5rem, 3vw, 2rem)', border: '2px dashed #ddd', borderRadius: 8, cursor: 'pointer', textAlign: 'center', background: '#fafafa' }}>
                      <input type="file" accept="image/*" onChange={e => handleImageChange(e, field as any)} style={{ display: 'none' }} disabled={optimizingImages} />
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📤</div>
                      <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', color: '#666' }}>{optimizingImages ? 'Optimizando...' : 'Sube imagen'}</div>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </SectionCollapsible>

          {/* ✅ SERVICIOS */}
          <SectionCollapsible title="🎯 Servicios (3) + Imágenes" isOpen={expandedSections.servicios} onClick={() => toggleSection('servicios')}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 100%, 300px), 1fr))', gap: '1.5rem', marginBottom: '2rem', paddingBottom: '2rem', borderBottom: i < 3 ? '1px solid #e5dcc9' : 'none' }}>
                <label>
                  <span style={labelStyle}>Servicio {i} - Nombre</span>
                  <input type="text" value={form[`service_${i}_title` as keyof ProfileData] as string || ''} onChange={e => handleFieldChange(`service_${i}_title`, e.target.value)} style={inputStyle} />
                </label>
                <label>
                  <span style={labelStyle}>Descripción</span>
                  <input type="text" value={form[`service_${i}_desc` as keyof ProfileData] as string || ''} onChange={e => handleFieldChange(`service_${i}_desc`, e.target.value)} style={inputStyle} />
                </label>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.75rem' }}>
                    <span style={labelStyle}>Imagen (600x400px)</span>
                    <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)', color: '#999', marginTop: '0.25rem' }}>Tamaño ideal: 600x400px</div>
                  </label>
                  {form[`service_${i}_image` as keyof typeof form] ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img src={form[`service_${i}_image` as keyof typeof form] as string} alt={`Servicio ${i}`} style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8 }} />
                      <button type="button" onClick={() => removeImage(`service_${i}_image` as keyof ProfileData)} style={{
                        position: 'absolute', top: '-12px', right: '-12px', width: '40px', height: '40px',
                        background: '#dc2626', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', fontWeight: 700,
                      }}>×</button>
                    </div>
                  ) : (
                    <label style={{ display: 'block', padding: '1.5rem', border: '2px dashed #ddd', borderRadius: 8, cursor: 'pointer', textAlign: 'center', background: '#fafafa' }}>
                      <input type="file" accept="image/*" onChange={e => handleImageChange(e, `service_${i}_image` as any)} style={{ display: 'none' }} disabled={optimizingImages} />
                      <div style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>📷</div>
                      <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', color: '#666' }}>{optimizingImages ? 'Optimizando...' : 'Sube imagen'}</div>
                    </label>
                  )}
                </div>
              </div>
            ))}
          </SectionCollapsible>

          {/* ✅ QUIÉNES SOMOS */}
          <SectionCollapsible title="👥 Quiénes Somos" isOpen={expandedSections.quienesomos} onClick={() => toggleSection('quienesomos')}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 100%, 500px), 1fr))', gap: '2rem' }}>
              <div>
                <label>
                  <span style={labelStyle}>Título de la sección</span>
                  <input type="text" value={form.about_title || ''} onChange={e => handleFieldChange('about_title', e.target.value)} style={inputStyle} />
                </label>
              </div>
              <label style={{ gridColumn: '1 / -1' }}>
                <span style={labelStyle}>Descripción (max 500 caracteres)</span>
                <textarea value={form.about_text || ''} onChange={e => handleFieldChange('about_text', e.target.value.slice(0, 500))} rows={4} style={textareaStyle} maxLength={500} />
                <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)', color: '#999', marginTop: '0.25rem' }}>
                  {(form.about_text || '').length}/500 caracteres
                </div>
              </label>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.75rem' }}>
                  <span style={labelStyle}>📸 Foto (600x600px cuadrada)</span>
                  <div style={{ fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)', color: '#999', marginTop: '0.25rem' }}>Tamaño ideal: 600x600px (cuadrada)</div>
                </label>
                {form.about_image ? (
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img src={form.about_image} alt="Quiénes Somos" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }} />
                    <button type="button" onClick={() => removeImage('about_image')} style={{
                      position: 'absolute', top: '-12px', right: '-12px', width: '40px', height: '40px',
                      background: '#dc2626', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', fontWeight: '700', fontSize: '1.2rem',
                    }}>×</button>
                  </div>
                ) : (
                  <label style={{ display: 'block', padding: 'clamp(1.5rem, 3vw, 2rem)', border: '2px dashed #2d5a27', borderRadius: 8, cursor: 'pointer', textAlign: 'center', background: '#fef7f2' }}>
                    <input type="file" accept="image/*" onChange={e => handleImageChange(e, 'about_image')} style={{ display: 'none' }} disabled={optimizingImages} />
                    <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📤</div>
                    <div style={{ fontWeight: 700, color: '#1a2818', marginBottom: '0.3rem', fontSize: 'clamp(0.8rem, 2vw, 0.95rem)' }}>{optimizingImages ? 'Optimizando foto...' : 'Sube tu foto'}</div>
                    <div style={{ fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', color: '#999' }}>O arrastra y suelta</div>
                  </label>
                )}
              </div>
            </div>
          </SectionCollapsible>

          {/* ✅ HERO */}
          <SectionCollapsible title="⭐ Hero (Portada)" isOpen={expandedSections.hero} onClick={() => toggleSection('hero')}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 100%, 300px), 1fr))', gap: '1.5rem' }}>
              <label style={{ gridColumn: 'auto' }}>
                <span style={labelStyle}>Titular principal</span>
                <input type="text" value={form.headline || ''} onChange={e => handleFieldChange('headline', e.target.value)} style={inputStyle} />
              </label>
              <label style={{ gridColumn: 'auto' }}>
                <span style={labelStyle}>Subtítulo</span>
                <input type="text" value={form.subtitle || ''} onChange={e => handleFieldChange('subtitle', e.target.value)} style={inputStyle} />
              </label>
              <label style={{ gridColumn: '1 / -1' }}>
                <span style={labelStyle}>Introducción</span>
                <textarea value={form.intro_text || ''} onChange={e => handleFieldChange('intro_text', e.target.value)} rows={3} style={textareaStyle} />
              </label>
            </div>
          </SectionCollapsible>

          {/* ✅ BENEFICIOS */}
          <SectionCollapsible title="💎 Beneficios (3)" isOpen={expandedSections.beneficios} onClick={() => toggleSection('beneficios')}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 100%, 250px), 1fr))', gap: '1.5rem' }}>
              {[1, 2, 3].map(i => (
                <label key={i}>
                  <span style={labelStyle}>Beneficio {i}</span>
                  <input type="text" value={form[`benefit_${i}` as keyof ProfileData] as string || ''} onChange={e => handleFieldChange(`benefit_${i}`, e.target.value)} style={inputStyle} />
                </label>
              ))}
            </div>
          </SectionCollapsible>

          {/* ✅ PROCESO */}
          <SectionCollapsible title="🔄 Proceso (4 pasos)" isOpen={expandedSections.proceso} onClick={() => toggleSection('proceso')}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 100%, 300px), 1fr))', gap: '1.5rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: i < 4 ? '1px solid #e5dcc9' : 'none' }}>
                <label>
                  <span style={labelStyle}>Paso {i} - Título</span>
                  <input type="text" value={form[`process_${i}_title` as keyof ProfileData] as string || ''} onChange={e => handleFieldChange(`process_${i}_title`, e.target.value)} style={inputStyle} />
                </label>
                <label>
                  <span style={labelStyle}>Descripción</span>
                  <input type="text" value={form[`process_${i}_text` as keyof ProfileData] as string || ''} onChange={e => handleFieldChange(`process_${i}_text`, e.target.value)} style={inputStyle} />
                </label>
              </div>
            ))}
          </SectionCollapsible>

          {/* ✅ TESTIMONIOS */}
          <SectionCollapsible title="⭐ Testimonios (3)" isOpen={expandedSections.testimonios} onClick={() => toggleSection('testimonios')}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ paddingBottom: i < 3 ? '1.5rem' : '0', borderBottom: i < 3 ? '1px solid #e5dcc9' : 'none', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 100%, 250px), 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
                  <label>
                    <span style={labelStyle}>Nombre {i}</span>
                    <input type="text" value={form[`testimonial_${i}_name` as keyof ProfileData] as string || ''} onChange={e => handleFieldChange(`testimonial_${i}_name`, e.target.value)} style={inputStyle} />
                  </label>
                  <label>
                    <span style={labelStyle}>Rol / Empresa</span>
                    <input type="text" value={form[`testimonial_${i}_role` as keyof ProfileData] as string || ''} onChange={e => handleFieldChange(`testimonial_${i}_role`, e.target.value)} style={inputStyle} />
                  </label>
                </div>
                <label>
                  <span style={labelStyle}>Opinión</span>
                  <textarea value={form[`testimonial_${i}_text` as keyof ProfileData] as string || ''} onChange={e => handleFieldChange(`testimonial_${i}_text`, e.target.value)} rows={2} style={textareaStyle} />
                </label>
              </div>
            ))}
          </SectionCollapsible>

          {/* ✅ FAQ */}
          <SectionCollapsible title="❓ FAQ (4 preguntas)" isOpen={expandedSections.faq} onClick={() => toggleSection('faq')}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ paddingBottom: '1.5rem', borderBottom: i < 4 ? '1px solid #e5dcc9' : 'none', marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '1rem' }}>
                  <span style={labelStyle}>Pregunta {i}</span>
                  <input type="text" value={form[`faq_${i}_q` as keyof ProfileData] as string || ''} onChange={e => handleFieldChange(`faq_${i}_q`, e.target.value)} style={inputStyle} />
                </label>
                <label>
                  <span style={labelStyle}>Respuesta</span>
                  <textarea value={form[`faq_${i}_a` as keyof ProfileData] as string || ''} onChange={e => handleFieldChange(`faq_${i}_a`, e.target.value)} rows={2} style={textareaStyle} />
                </label>
              </div>
            ))}
          </SectionCollapsible>

          {/* ✅ REDES SOCIALES */}
          <SectionCollapsible title="📱 Redes sociales" isOpen={expandedSections.redes} onClick={() => toggleSection('redes')}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(200px, 100%, 250px), 1fr))', gap: '1.5rem' }}>
              {[
                { key: 'instagram', label: 'Instagram', icon: '📷' },
                { key: 'tiktok', label: 'TikTok', icon: '🎵' },
                { key: 'facebook', label: 'Facebook', icon: '👍' },
                { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
                { key: 'youtube', label: 'YouTube', icon: '▶️' },
                { key: 'twitter', label: 'Twitter', icon: '𝕏' },
              ].map(social => (
                <label key={social.key}>
                  <span style={labelStyle}>{social.icon} {social.label}</span>
                  <input type="text" value={form[social.key as keyof ProfileData] as string || ''} onChange={e => handleFieldChange(social.key, e.target.value)} style={inputStyle} placeholder={`Tu usuario de ${social.label}`} />
                </label>
              ))}
            </div>
          </SectionCollapsible>

          {/* ✅ COLORES - FIXED */}
          <SectionCollapsible title="🎨 Colores personalizados" isOpen={expandedSections.colores} onClick={() => toggleSection('colores')}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(150px, 100%, 180px), 1fr))', gap: '1.5rem' }}>
              <label>
                <span style={labelStyle}>Color primario</span>
                <input 
                  type="color" 
                  value={form.color_primary || tradeConfig.colors.primary} 
                  onChange={e => {
                    const newForm = { ...form, color_primary: e.target.value }
                    setForm(newForm)
                    autoSave(newForm)
                  }} 
                  style={{...inputStyle, height: '50px', cursor: 'pointer'}} 
                />
                <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.25rem' }}>
                  {form.color_primary || tradeConfig.colors.primary}
                </div>
              </label>
              <label>
                <span style={labelStyle}>Color secundario</span>
                <input 
                  type="color" 
                  value={form.color_secondary || tradeConfig.colors.secondary} 
                  onChange={e => {
                    const newForm = { ...form, color_secondary: e.target.value }
                    setForm(newForm)
                    autoSave(newForm)
                  }} 
                  style={{...inputStyle, height: '50px', cursor: 'pointer'}} 
                />
                <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.25rem' }}>
                  {form.color_secondary || tradeConfig.colors.secondary}
                </div>
              </label>
              <label>
                <span style={labelStyle}>Color acento</span>
                <input 
                  type="color" 
                  value={form.color_accent || tradeConfig.colors.accent} 
                  onChange={e => {
                    const newForm = { ...form, color_accent: e.target.value }
                    setForm(newForm)
                    autoSave(newForm)
                  }} 
                  style={{...inputStyle, height: '50px', cursor: 'pointer'}} 
                />
                <div style={{ fontSize: '0.7rem', color: '#999', marginTop: '0.25rem' }}>
                  {form.color_accent || tradeConfig.colors.accent}
                </div>
              </label>
            </div>
          </SectionCollapsible>

          {/* ✅ GALERÍA - MÁXIMO 5 IMÁGENES */}
          <SectionCollapsible title="📸 Galería de fotos (máx. 5)" isOpen={expandedSections.galeria} onClick={() => toggleSection('galeria')}>
            <label style={{ display: 'block', padding: 'clamp(1.5rem, 3vw, 2.5rem)', border: '2px dashed #2d5a27', borderRadius: 8, cursor: 'pointer', textAlign: 'center', background: '#fef7f2', marginBottom: '2rem', opacity: (form.gallery_urls || []).length >= 5 ? 0.5 : 1, pointerEvents: (form.gallery_urls || []).length >= 5 ? 'none' : 'auto' }}>
              <input type="file" multiple accept="image/*" onChange={e => Array.from(e.target.files || []).forEach(file => addGalleryImage(file))} style={{ display: 'none' }} disabled={optimizingImages || (form.gallery_urls || []).length >= 5} />
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📸</div>
              <div style={{ fontWeight: 700, color: '#1a2818', marginBottom: '0.3rem', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>{optimizingImages ? 'Optimizando fotos...' : `Sube tus fotos (${(form.gallery_urls || []).length}/5)`}</div>
              <div style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', color: '#999' }}>O arrastra y suelta</div>
            </label>

            {form.gallery_urls && form.gallery_urls.length > 0 && (
              <div>
                <h3 style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', fontWeight: 700, marginBottom: '1.5rem', color: '#1a2818' }}>Fotos cargadas ({form.gallery_urls.length}/5)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(120px, 25vw, 150px), 1fr))', gap: '1.5rem' }}>
                  {form.gallery_urls.map((url, i) => (
                    <div key={i} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,.1)', aspectRatio: '1' }}>
                      <img src={url} alt={`Foto ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" onClick={() => removeGalleryImage(i)} style={{
                        position: 'absolute', top: '.5rem', right: '.5rem', width: '36px', height: '36px',
                        background: 'rgba(220, 38, 38, 0.95)', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer', fontWeight: '700', fontSize: '1.2rem',
                      }}>✕</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SectionCollapsible>
        </form>
      </main>

      {/* ✅ BOTONES STICKY */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e5ddcf',
        padding: 'clamp(0.8rem, 2vw, 1.2rem)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(120px, 100%, 180px), 1fr))', gap: 'clamp(0.6rem, 2vw, 1rem)', zIndex: 100, boxShadow: '0 -4px 12px rgba(0,0,0,.08)',
      }}>
        <button type="button" onClick={aplicarPlantilla} style={{
          padding: 'clamp(0.6rem, 1.5vw, 0.8rem) clamp(1rem, 2vw, 1.5rem)', background: 'linear-gradient(135deg, #6B4E71, #9B7B9E)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', cursor: 'pointer', transition: 'all .3s', whiteSpace: 'nowrap',
        }} onMouseEnter={e => e.currentTarget.style.opacity = '0.9'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          ✨ Plantilla
        </button>
        {form.slug && (
          <a href={`/${form.slug}`} target="_blank" rel="noopener noreferrer" style={{
            padding: 'clamp(0.6rem, 1.5vw, 0.8rem) clamp(1rem, 2vw, 1.5rem)', background: form.color_primary || '#2d5a27', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', whiteSpace: 'nowrap', transition: 'all .2s',
          }} onMouseEnter={e => e.currentTarget.style.opacity = '0.8'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            👁️ Ver
          </a>
        )}
        <button type="submit" onClick={(e) => {const form = document.querySelector('form') as HTMLFormElement; form?.dispatchEvent(new Event('submit', { bubbles: true }))}} disabled={saving} style={{
          padding: 'clamp(0.6rem, 1.5vw, 0.8rem) clamp(1rem, 2vw, 1.5rem)', background: '#0a0f14', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: 'clamp(0.7rem, 2vw, 0.8rem)', cursor: 'pointer', opacity: saving ? 0.7 : 1, transition: 'all .3s', whiteSpace: 'nowrap',
        }} onMouseEnter={e => !saving && (e.currentTarget.style.opacity = '0.8')} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
          {saving ? '⏳ Guardando' : '✅ Guardar'}
        </button>
      </div>
    </div>
  )
}

// ✅ SECCIÓN COLAPSABLE
function SectionCollapsible({ title, isOpen, onClick, children }: {
  title: string
  isOpen: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <div style={{ background: '#f9f6f0', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e5dcc9', overflow: 'hidden' }}>
      <button type="button" onClick={onClick} style={{
        width: '100%', padding: 'clamp(0.9rem, 2vw, 1.3rem)', background: '#f9f6f0', border: 'none', borderBottom: isOpen ? '1px solid #e5dcc9' : 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'clamp(0.85rem, 2vw, 1rem)', fontWeight: 700, color: '#1a2818', transition: 'all .2s',
      }} onMouseEnter={e => e.currentTarget.style.background = '#f3f0ea'} onMouseLeave={e => e.currentTarget.style.background = '#f9f6f0'}>
        {title}
        <span style={{ fontSize: '1.3rem', transition: 'transform .3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
      </button>
      {isOpen && <div style={{ padding: 'clamp(1rem, 2vw, 1.8rem)', animation: 'slideDown 0.3s ease' }}>{children}</div>}
      <style>{`@keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}
