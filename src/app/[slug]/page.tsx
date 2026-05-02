'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getTradeConfig } from '@/lib/trades'

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

export default function PublicLanding() {
  const params = useParams()
  const slug = params?.slug as string
  const supabase = createClient()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [colors, setColors] = useState({ primary: '#c2185b', secondary: '#e91e63', accent: '#ffb6c1' })
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formSent, setFormSent] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!slug) {
        setLoading(false)
        return
      }
      try {
        const { data } = await supabase.from('profiles').select('*').eq('slug', slug).single()
        if (data) {
          setProfile(data as ProfileData)
          const config = getTradeConfig(data.trade || 'emprendedor')
          setColors({
            primary: data.color_primary || config.colors.primary,
            secondary: data.color_secondary || config.colors.secondary,
            accent: data.color_accent || config.colors.accent,
          })
        }
      } catch (err) {
        console.error('Error loading profile:', err)
      }
      setLoading(false)
    }
    load()
  }, [slug, supabase])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#faf7f2', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '3px solid #e2ddd4', borderTopColor: colors.primary, borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#64748b' }}>Cargando landing...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#faf7f2', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤷</div>
          <h1>Landing no encontrada</h1>
        </div>
      </div>
    )
  }

  const tradeConfig = getTradeConfig(profile.trade || 'emprendedor')

  const safe = {
    business_name: profile?.business_name?.trim() ? profile.business_name : 'Mi Negocio',
    headline: profile?.headline?.trim() ? profile.headline : tradeConfig.defaultHeadline,
    subtitle: profile?.subtitle?.trim() ? profile.subtitle : tradeConfig.defaultSubtitle,
    intro_text: profile?.intro_text?.trim() ? profile.intro_text : tradeConfig.defaultIntro,
    service_1_title: profile?.service_1_title?.trim() ? profile.service_1_title : tradeConfig.defaultServices[0]?.name || 'Servicio 1',
    service_1_desc: profile?.service_1_desc?.trim() ? profile.service_1_desc : tradeConfig.defaultServices[0]?.desc || 'Descripción',
    service_2_title: profile?.service_2_title?.trim() ? profile.service_2_title : tradeConfig.defaultServices[1]?.name || 'Servicio 2',
    service_2_desc: profile?.service_2_desc?.trim() ? profile.service_2_desc : tradeConfig.defaultServices[1]?.desc || 'Descripción',
    service_3_title: profile?.service_3_title?.trim() ? profile.service_3_title : tradeConfig.defaultServices[2]?.name || 'Servicio 3',
    service_3_desc: profile?.service_3_desc?.trim() ? profile.service_3_desc : tradeConfig.defaultServices[2]?.desc || 'Descripción',
    benefit_1: profile?.benefit_1?.trim() ? profile.benefit_1 : tradeConfig.defaultBenefits[0] || 'Beneficio 1',
    benefit_2: profile?.benefit_2?.trim() ? profile.benefit_2 : tradeConfig.defaultBenefits[1] || 'Beneficio 2',
    benefit_3: profile?.benefit_3?.trim() ? profile.benefit_3 : tradeConfig.defaultBenefits[2] || 'Beneficio 3',
    process_1_title: profile?.process_1_title?.trim() ? profile.process_1_title : tradeConfig.defaultProcess[0]?.title || 'Paso 1',
    process_1_text: profile?.process_1_text?.trim() ? profile.process_1_text : tradeConfig.defaultProcess[0]?.text || 'Descripción',
    process_2_title: profile?.process_2_title?.trim() ? profile.process_2_title : tradeConfig.defaultProcess[1]?.title || 'Paso 2',
    process_2_text: profile?.process_2_text?.trim() ? profile.process_2_text : tradeConfig.defaultProcess[1]?.text || 'Descripción',
    process_3_title: profile?.process_3_title?.trim() ? profile.process_3_title : tradeConfig.defaultProcess[2]?.title || 'Paso 3',
    process_3_text: profile?.process_3_text?.trim() ? profile.process_3_text : tradeConfig.defaultProcess[2]?.text || 'Descripción',
    process_4_title: profile?.process_4_title?.trim() ? profile.process_4_title : tradeConfig.defaultProcess[3]?.title || 'Paso 4',
    process_4_text: profile?.process_4_text?.trim() ? profile.process_4_text : tradeConfig.defaultProcess[3]?.text || 'Descripción',
    testimonial_1_name: profile?.testimonial_1_name?.trim() ? profile.testimonial_1_name : tradeConfig.defaultTestimonials[0]?.name || 'Cliente',
    testimonial_1_role: profile?.testimonial_1_role?.trim() ? profile.testimonial_1_role : tradeConfig.defaultTestimonials[0]?.role || 'Rol',
    testimonial_1_text: profile?.testimonial_1_text?.trim() ? profile.testimonial_1_text : tradeConfig.defaultTestimonials[0]?.text || 'Opinión',
    testimonial_2_name: profile?.testimonial_2_name?.trim() ? profile.testimonial_2_name : tradeConfig.defaultTestimonials[1]?.name || '',
    testimonial_2_role: profile?.testimonial_2_role?.trim() ? profile.testimonial_2_role : tradeConfig.defaultTestimonials[1]?.role || '',
    testimonial_2_text: profile?.testimonial_2_text?.trim() ? profile.testimonial_2_text : tradeConfig.defaultTestimonials[1]?.text || '',
    testimonial_3_name: profile?.testimonial_3_name?.trim() ? profile.testimonial_3_name : tradeConfig.defaultTestimonials[2]?.name || '',
    testimonial_3_role: profile?.testimonial_3_role?.trim() ? profile.testimonial_3_role : tradeConfig.defaultTestimonials[2]?.role || '',
    testimonial_3_text: profile?.testimonial_3_text?.trim() ? profile.testimonial_3_text : tradeConfig.defaultTestimonials[2]?.text || '',
    faq_1_q: profile?.faq_1_q?.trim() ? profile.faq_1_q : tradeConfig.defaultFaqs[0]?.q || '',
    faq_1_a: profile?.faq_1_a?.trim() ? profile.faq_1_a : tradeConfig.defaultFaqs[0]?.a || '',
    faq_2_q: profile?.faq_2_q?.trim() ? profile.faq_2_q : tradeConfig.defaultFaqs[1]?.q || '',
    faq_2_a: profile?.faq_2_a?.trim() ? profile.faq_2_a : tradeConfig.defaultFaqs[1]?.a || '',
    faq_3_q: profile?.faq_3_q?.trim() ? profile.faq_3_q : tradeConfig.defaultFaqs[2]?.q || '',
    faq_3_a: profile?.faq_3_a?.trim() ? profile.faq_3_a : tradeConfig.defaultFaqs[2]?.a || '',
    faq_4_q: profile?.faq_4_q?.trim() ? profile.faq_4_q : tradeConfig.defaultFaqs[3]?.q || '',
    faq_4_a: profile?.faq_4_a?.trim() ? profile.faq_4_a : tradeConfig.defaultFaqs[3]?.a || '',
    whatsapp_message: profile?.whatsapp_message?.trim() ? profile.whatsapp_message : '¡Hola! Me interesa conocer más sobre tus servicios',
    experience_years: profile?.experience_years?.trim() ? profile.experience_years : '10',
    city: profile?.city?.trim() ? profile.city : 'Madrid',
    phone: profile?.phone?.trim() ? profile.phone : '+34 600 000 000',
    email: profile?.email?.trim() ? profile.email : 'info@negocio.com',
    hero_image_url: profile?.hero_image_url?.trim() ? profile.hero_image_url : tradeConfig.heroImage,
    logo_url: profile?.logo_url?.trim() ? profile.logo_url : '',
  }

  const wa = `https://wa.me/${safe.phone.replace(/\D/g, '')}?text=${encodeURIComponent(safe.whatsapp_message)}`

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', sans-serif; color: ${colors.primary}; background: #faf7f2; overflow-x: hidden; }
    img { display: block; max-width: 100%; }
    a { text-decoration: none; color: inherit; }
    button { font-family: inherit; cursor: pointer; border: none; background: none; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: none; } }
    @keyframes slideLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: none; } }
    @keyframes slideRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: none; } }
    @keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(10px); } }
    .a { opacity: 0; transform: translateY(28px); transition: opacity .75s ease, transform .75s ease; }
    .a.vis { opacity: 1; transform: none; }
    .al { opacity: 0; transform: translateX(-36px); transition: opacity .75s ease, transform .75s ease; }
    .al.vis { opacity: 1; transform: none; }
    .ar { opacity: 0; transform: translateX(36px); transition: opacity .75s ease, transform .75s ease; }
    .ar.vis { opacity: 1; transform: none; }
    .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 200; padding: 1.25rem 3.5rem; display: flex; justify-content: space-between; align-items: center; transition: all .35s ease; }
    .nav.sc { background: rgba(${parseInt(colors.primary.slice(1,3),16)}, ${parseInt(colors.primary.slice(3,5),16)}, ${parseInt(colors.primary.slice(5,7),16)}, 0.95); backdrop-filter: blur(20px); box-shadow: 0 2px 24px rgba(0,0,0,.15); }
    .nav-brand { font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 800; color: ${scrolled ? 'white' : colors.primary}; display: flex; align-items: center; gap: .5rem; }
    .nav-logo { width: 36px; height: 36px; border-radius: 6px; object-fit: cover; }
    .nav-links { display: flex; gap: 2.5rem; align-items: center; }
    .nav-links a { font-size: .82rem; font-weight: 500; color: ${scrolled ? 'rgba(255,255,255,.8)' : '#666'}; transition: color .2s; }
    .nav-links a:hover { color: ${scrolled ? 'white' : colors.primary}; }
    .nav-btn { padding: .55rem 1.35rem; background: ${colors.accent}; color: ${colors.primary}; border-radius: 3px; font-size: .72rem; font-weight: 700; transition: all .2s; }
    .nav-btn:hover { background: white; }
    .hero { min-height: 100vh; position: relative; background: linear-gradient(135deg, rgba(10,15,20,.75) 0%, rgba(10,15,20,.4) 100%), url('${safe.hero_image_url}') center/cover no-repeat; display: flex; align-items: center; overflow: hidden; }
    .hero-inner { position: relative; z-index: 2; padding: 0 3.5rem; max-width: 900px; text-align: center; margin: 5rem auto 0; }
    .hero-eyebrow { display: inline-flex; align-items: center; gap: .75rem; font-size: .7rem; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: ${colors.accent}; margin-bottom: 2rem; animation: slideUp 0.8s ease 0.2s both; }
    .hero-eyebrow::before { content: ''; width: 30px; height: 1.5px; background: ${colors.accent}; }
    .hero h1 { font-family: 'Playfair Display', serif; font-size: clamp(3.2rem, 8vw, 6.5rem); font-weight: 400; line-height: 1; color: white; margin-bottom: .4rem; animation: slideUp 0.8s ease 0.3s both; }
    .hero h1 em { font-style: italic; color: ${colors.accent}; display: block; }
    .hero-sub { font-size: clamp(.9rem, 2vw, 1.2rem); line-height: 1.75; color: rgba(255,255,255,.85); max-width: 600px; margin: 2rem auto 3rem; animation: slideUp 0.8s ease 0.4s both; }
    .hero-ctas { display: flex; gap: 1.25rem; flex-wrap: wrap; justify-content: center; animation: slideUp 0.8s ease 0.5s both; }
    .btn-primary { padding: 1rem 2.5rem; background: ${colors.accent}; color: ${colors.primary}; font-size: .75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; border-radius: 6px; transition: all .3s; display: inline-block; }
    .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 40px rgba(0,0,0,.3); }
    .btn-secondary { padding: 1rem 2.5rem; background: transparent; color: white; border: 2px solid rgba(255,255,255,.6); font-size: .75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; border-radius: 6px; transition: all .3s; display: inline-block; }
    .btn-secondary:hover { background: white; color: ${colors.primary}; border-color: white; transform: translateY(-3px); }
    .hero-scroll { position: absolute; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 2; display: flex; flex-direction: column; align-items: center; gap: .5rem; animation: bounce 2.5s ease infinite; }
    .hero-scroll span { font-size: .6rem; letter-spacing: 3px; text-transform: uppercase; color: rgba(255,255,255,.45); }
    .stats { background: ${colors.primary}; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); padding: 4rem 3.5rem; }
    .stat { padding: 2rem; text-align: center; border-right: 1px solid rgba(255,255,255,.1); animation: slideUp 0.8s ease forwards; }
    .stat:last-child { border-right: none; }
    .stat-n { font-family: 'Playfair Display', serif; font-size: clamp(2rem, 5vw, 3.5rem); color: ${colors.accent}; display: block; line-height: 1; margin-bottom: .5rem; }
    .stat-l { font-size: .85rem; color: rgba(255,255,255,.8); }
    .section { padding: 8rem 3.5rem; background: #faf7f2; }
    .section-dark { background: ${colors.primary}; color: white; }
    .section-grid { max-width: 1280px; margin: 0 auto; }
    .section-head { text-align: center; max-width: 700px; margin: 0 auto 4rem; }
    .tag { font-size: .65rem; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: ${colors.primary}; display: flex; align-items: center; justify-content: center; gap: .75rem; margin-bottom: 1.5rem; }
    .section-dark .tag { color: ${colors.accent}; }
    .tag::before { content: ''; width: 32px; height: 1.5px; background: currentColor; }
    .tag::after { content: ''; width: 32px; height: 1.5px; background: currentColor; }
    .h2 { font-family: 'Playfair Display', serif; font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 400; line-height: 1.1; margin-bottom: 1.5rem; }
    .h2 em { font-style: italic; color: ${colors.accent}; }
    .cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-top: 3rem; }
    .card { padding: 2.5rem; background: white; border-radius: 12px; border: 1px solid #ddd; transition: all .35s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,.12); }
    .card h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: ${colors.primary}; margin-bottom: 1rem; margin-top: 1rem; }
    .card p { font-size: .9rem; line-height: 1.7; color: #666; }
    .card-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
    .process-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; margin-top: 3rem; }
    .process-step { position: relative; text-align: center; }
    .process-step::after { content: ''; position: absolute; top: 40px; left: calc(100% + 1rem); width: calc(100% - 2rem); height: 2px; background: rgba(255,255,255,.2); }
    .process-step:last-child::after { display: none; }
    .process-num { width: 80px; height: 80px; border-radius: 50%; background: ${colors.accent}; color: ${colors.primary}; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; margin: 0 auto 1.5rem; font-family: 'Syne', sans-serif; }
    .process-title { font-size: 1.1rem; font-weight: 700; margin-bottom: .75rem; }
    .process-text { font-size: .85rem; line-height: 1.6; opacity: .9; }
    .benefits-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3rem; }
    .benefit-card { padding: 2.5rem; background: #fff; border-radius: 12px; border: 1px solid #ddd; transition: all .3s; }
    .benefit-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,.1); }
    .benefit-icon { font-size: 2.5rem; margin-bottom: 1rem; display: block; }
    .benefit-title { font-size: 1.15rem; font-weight: 700; color: ${colors.primary}; margin-bottom: .75rem; }
    .benefit-text { font-size: .9rem; line-height: 1.7; color: #666; }
    .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-top: 3rem; }
    .tcard { padding: 2.5rem; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12); border-radius: 12px; transition: all .25s; }
    .tcard:hover { background: rgba(255,255,255,.12); transform: translateY(-4px); }
    .tcard-stars { font-size: 1.1rem; color: ${colors.accent}; letter-spacing: 3px; margin-bottom: 1.25rem; }
    .tcard-text { font-family: 'Playfair Display', serif; font-style: italic; font-size: 1.05rem; line-height: 1.7; color: rgba(255,255,255,.95); margin-bottom: 1.5rem; }
    .tcard-auth { display: flex; gap: 1rem; align-items: center; }
    .tcard-av { width: 45px; height: 45px; border-radius: 50%; background: ${colors.accent}; color: ${colors.primary}; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; font-size: .9rem; }
    .tcard-name { font-weight: 700; color: white; font-size: .9rem; }
    .tcard-role { font-size: .75rem; color: ${colors.accent}; margin-top: .1rem; }
    .faq-item { background: white; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 1.5rem; overflow: hidden; transition: all .3s; }
    .faq-item:hover { box-shadow: 0 8px 24px rgba(0,0,0,.1); }
    .faq-q { padding: 1.5rem; cursor: pointer; display: flex; justify-content: space-between; align-items: center; background: #faf7f2; }
    .faq-question { font-weight: 700; color: ${colors.primary}; font-size: 1rem; }
    .faq-toggle { color: ${colors.accent}; font-size: 1.5rem; transition: transform .3s; }
    .faq-item.open .faq-toggle { transform: rotate(180deg); }
    .faq-a { padding: 1.5rem; color: #666; line-height: 1.8; font-size: .95rem; border-top: 1px solid #ddd; max-height: 0; overflow: hidden; transition: max-height .3s ease; }
    .faq-item.open .faq-a { max-height: 500px; }
    .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: start; margin-top: 3rem; }
    .cinfo { display: flex; flex-direction: column; gap: 2rem; }
    .ci { display: flex; gap: 1.25rem; align-items: flex-start; }
    .ci-ico { width: 48px; height: 48px; border-radius: 8px; background: ${colors.primary}; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; }
    .ci-lbl { font-size: .65rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: ${colors.primary}; margin-bottom: .3rem; }
    .ci-val { font-size: .95rem; color: #1a2818; font-weight: 500; }
    .wa-btn { display: inline-flex; align-items: center; gap: .75rem; padding: 1.1rem 2rem; background: #25D366; color: white; border-radius: 8px; font-size: .78rem; font-weight: 700; text-transform: uppercase; transition: all .3s; margin-top: 1.5rem; }
    .wa-btn:hover { background: #1db954; transform: translateY(-2px); box-shadow: 0 12px 30px rgba(37,211,102,.4); }
    .fcard { background: white; border-radius: 12px; padding: 3rem; box-shadow: 0 10px 50px rgba(0,0,0,.08); border: 1px solid #ddd; }
    .fcard h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #1a2818; margin-bottom: .5rem; }
    .fcard-sub { font-size: .85rem; color: #888; margin-bottom: 2rem; }
    .fgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    .fgrid.full { grid-column: 1/-1; }
    .ffield { display: flex; flex-direction: column; gap: .4rem; }
    .ffield label { font-size: .65rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: ${colors.primary}; }
    .ffield input, .ffield select, .ffield textarea { padding: .9rem 1rem; background: #f8f7f4; border: 1.5px solid transparent; border-radius: 8px; font-size: .9rem; color: #1a2818; transition: all .2s; outline: none; }
    .ffield input:focus, .ffield select:focus, .ffield textarea:focus { border-color: ${colors.primary}; background: white; box-shadow: 0 0 0 4px rgba(${parseInt(colors.primary.slice(1,3),16)}, ${parseInt(colors.primary.slice(3,5),16)}, ${parseInt(colors.primary.slice(5,7),16)}, 0.1); }
    .fsubmit { width: 100%; padding: 1.1rem; margin-top: 1rem; background: ${colors.primary}; color: white; font-size: .78rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; border-radius: 8px; cursor: pointer; transition: all .3s; }
    .fsubmit:hover { background: ${colors.secondary}; transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,0,0,.2); }
    .sent { text-align: center; padding: 4rem 1rem; }
    .sent-ico { font-size: 4rem; margin-bottom: 1.5rem; display: block; animation: bounce 0.6s cubic-bezier(.34,1.56,.64,1); }
    .sent h3 { font-family: 'Playfair Display', serif; font-size: 1.5rem; color: #1a2818; margin-bottom: .75rem; }
    .sent p { font-size: .95rem; color: #888; }
    .footer { background: #1a2818; padding: 4rem 3.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 2rem; color: white; }
    .footer-brand { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 800; margin-bottom: .5rem; }
    .footer-copy { font-size: .75rem; opacity: .6; }
    .footer-powered { font-size: .75rem; opacity: .5; }
    .waf { position: fixed; bottom: 2rem; right: 2rem; z-index: 100; width: 70px; height: 70px; border-radius: 50%; background: #25D366; display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: 0 8px 30px rgba(37,211,102,.4); transition: all .3s; animation: slideUp 0.8s ease 3s both; }
    .waf:hover { transform: scale(1.15); box-shadow: 0 12px 40px rgba(37,211,102,.6); }
    @media(max-width: 1024px) {
      .contact-grid { grid-template-columns: 1fr; gap: 3rem; }
      .cards-grid, .testimonials-grid { grid-template-columns: 1fr 1fr; }
      .process-grid { grid-template-columns: 1fr 1fr; }
      .process-step::after { display: none; }
      .benefits-grid { grid-template-columns: 1fr 1fr; }
    }
    @media(max-width: 768px) {
      .nav, .nav.sc { padding: .9rem 1.5rem; }
      .nav-links { display: none; }
      .section { padding: 4rem 1.5rem; }
      .hero-inner { padding: 0 1.5rem; }
      .cards-grid, .testimonials-grid, .benefits-grid, .fgrid { grid-template-columns: 1fr; }
      .process-grid { grid-template-columns: 1fr 1fr; }
      .footer { flex-direction: column; text-align: center; }
      .fgrid.full { grid-column: 1; }
      .stats { grid-template-columns: 1fr 1fr; }
    }
  `

  return (
    <>
      <style>{styles}</style>
      <nav className={`nav ${scrolled ? 'sc' : ''}`}>
        <div className="nav-brand">
          {safe.logo_url && <img src={safe.logo_url} alt="Logo" className="nav-logo" />}
          {safe.business_name.split(' ')[0]}
        </div>
        <div className="nav-links">
          <a href="#servicios">Servicios</a>
          <a href="#proceso">Proceso</a>
          <a href="#testimonios">Testimonios</a>
          <a href="#contacto" className="nav-btn">Contacto</a>
        </div>
      </nav>
      <header className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">{safe.city}</div>
          <h1>{safe.headline}<em>{safe.subtitle}</em></h1>
          <p className="hero-sub">{safe.intro_text}</p>
          <div className="hero-ctas">
            <a href="#contacto" className="btn-primary">Solicitar presupuesto</a>
            <a href="#servicios" className="btn-secondary">Ver servicios</a>
          </div>
        </div>
        <div className="hero-scroll">
          <div style={{ width: '1px', height: '42px', background: 'linear-gradient(to bottom, rgba(255,255,255,.5), transparent)' }} />
          <span>Scroll</span>
        </div>
      </header>
      <div className="stats">
        {[
          { n: `+${safe.experience_years}`, l: 'años de experiencia' },
          { n: '+1000', l: 'clientes satisfechos' },
          { n: '99%', l: 'tasa de recomendación' },
          { n: '24h', l: 'respuesta garantizada' },
        ].map((s, i) => (
          <div key={i} className="stat a">
            <span className="stat-n">{s.n}</span>
            <div className="stat-l">{s.l}</div>
          </div>
        ))}
      </div>
      <section className="section">
        <div className="section-grid">
          <div className="section-head">
            <div className="tag">Quiénes somos</div>
            <h2 className="h2">Pasión por la <em>excelencia</em></h2>
            <p>{safe.intro_text}</p>
          </div>
        </div>
      </section>
      <section className="section section-dark">
        <div className="section-grid">
          <div className="section-head">
            <div className="tag">Lo que hacemos</div>
            <h2 className="h2">Nuestros <em>servicios</em></h2>
          </div>
          <div className="cards-grid">
            {[
              { title: safe.service_1_title, desc: safe.service_1_desc, icon: '🎯' },
              { title: safe.service_2_title, desc: safe.service_2_desc, icon: '⚡' },
              { title: safe.service_3_title, desc: safe.service_3_desc, icon: '✨' },
            ].map((s, i) => (
              <div key={i} className={`card a`} id={i === 0 ? 'servicios' : ''}>
                <span className="card-icon">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section section-dark" id="proceso">
        <div className="section-grid">
          <div className="section-head">
            <div className="tag">Cómo trabajamos</div>
            <h2 className="h2">Nuestro <em>proceso</em></h2>
          </div>
          <div className="process-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="process-step a">
                <div className="process-num">{i}</div>
                <div className="process-title">{safe[`process_${i}_title` as keyof typeof safe]}</div>
                <div className="process-text">{safe[`process_${i}_text` as keyof typeof safe]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-grid">
          <div className="section-head">
            <div className="tag">Por qué elegirnos</div>
            <h2 className="h2">Ventajas de trabajar <em>con nosotros</em></h2>
          </div>
          <div className="benefits-grid">
            {[
              { icon: '👥', title: 'Equipo profesional' },
              { icon: '📋', title: 'Transparencia total' },
              { icon: '✅', title: 'Garantía incluida' },
            ].map((b, i) => (
              <div key={i} className={`benefit-card a`}>
                <span className="benefit-icon">{b.icon}</span>
                <h3 className="benefit-title">{b.title}</h3>
                <p className="benefit-text">{safe[`benefit_${i + 1}` as keyof typeof safe]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section section-dark" id="testimonios">
        <div className="section-grid">
          <div className="section-head">
            <div className="tag">Nuestros clientes</div>
            <h2 className="h2">Ellos ya <em>confían</em> en nosotros</h2>
          </div>
          <div className="testimonials-grid">
            {[1, 2, 3].filter(i => safe[`testimonial_${i}_name` as keyof typeof safe]).map(i => (
              <div key={i} className={`tcard a`}>
                <span className="tcard-stars">{'⭐'.repeat(5)}</span>
                <p className="tcard-text">"{safe[`testimonial_${i}_text` as keyof typeof safe]}"</p>
                <div className="tcard-auth">
                  <div className="tcard-av">{(safe[`testimonial_${i}_name` as keyof typeof safe] as string)?.[0] || 'C'}</div>
                  <div>
                    <div className="tcard-name">{safe[`testimonial_${i}_name` as keyof typeof safe]}</div>
                    <div className="tcard-role">{safe[`testimonial_${i}_role` as keyof typeof safe]}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-grid">
          <div className="section-head">
            <div className="tag">Preguntas frecuentes</div>
            <h2 className="h2">Resolvemos tus <em>dudas</em></h2>
          </div>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {[1, 2, 3, 4].filter(i => safe[`faq_${i}_q` as keyof typeof safe]).map(i => (
              <div
                key={i}
                className={`faq-item a ${openFaq === i ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="faq-q">
                  <span className="faq-question">{safe[`faq_${i}_q` as keyof typeof safe]}</span>
                  <span className="faq-toggle">▼</span>
                </div>
                <div className="faq-a">{safe[`faq_${i}_a` as keyof typeof safe]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section" id="contacto">
        <div className="section-grid">
          <div className="contact-grid">
            <div className="al">
              <div className="tag">Hablemos</div>
              <h2 className="h2">Cuéntanos tu <em>proyecto</em></h2>
              <div className="cinfo">
                <div className="ci">
                  <div className="ci-ico">📞</div>
                  <div><div className="ci-lbl">Teléfono / WhatsApp</div><div className="ci-val">{safe.phone}</div></div>
                </div>
                <div className="ci">
                  <div className="ci-ico">✉️</div>
                  <div><div className="ci-lbl">Email</div><div className="ci-val">{safe.email}</div></div>
                </div>
                <div className="ci">
                  <div className="ci-ico">📍</div>
                  <div><div className="ci-lbl">Ubicación</div><div className="ci-val">{safe.city}</div></div>
                </div>
              </div>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="wa-btn">💬 Escribir por WhatsApp</a>
            </div>
            <div className="ar">
              <div className="fcard">
                {formSent ? (
                  <div className="sent">
                    <span className="sent-ico">✨</span>
                    <h3>¡Mensaje recibido!</h3>
                    <p>{safe.business_name} te responderá pronto.</p>
                  </div>
                ) : (
                  <>
                    <h3>Solicitar presupuesto</h3>
                    <p className="fcard-sub">Gratis y sin compromiso</p>
                    <form onSubmit={e => { e.preventDefault(); setFormSent(true) }}>
                      <div className="fgrid">
                        <div className="ffield">
                          <label>Nombre</label>
                          <input type="text" placeholder="Tu nombre" required />
                        </div>
                        <div className="ffield">
                          <label>Teléfono</label>
                          <input type="tel" placeholder="+34 600 000 000" required />
                        </div>
                        <div className="ffield fgrid full">
                          <label>Email</label>
                          <input type="email" placeholder="tu@email.com" required />
                        </div>
                        <div className="ffield fgrid full">
                          <label>Mensaje</label>
                          <textarea placeholder="Cuéntanos tu proyecto…" rows={3} required></textarea>
                        </div>
                      </div>
                      <button type="submit" className="fsubmit">Enviar solicitud →</button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div>
          <div className="footer-brand">{safe.business_name.split(' ')[0]}</div>
          <div className="footer-copy">© {new Date().getFullYear()} · {safe.city}</div>
        </div>
        <div className="footer-powered">Creado con <strong style={{ color: colors.accent }}>Clientos</strong></div>
      </footer>
      <a href={wa} target="_blank" rel="noopener noreferrer" className="waf">💬</a>
    </>
  )
}
