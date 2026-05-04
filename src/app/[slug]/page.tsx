// src/app/[slug]/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getTradeConfig } from '@/lib/trades'

type AnyProfile = Record<string, any>

const fallbackImages = [
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1800&q=90&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1800&q=90&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&q=90&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1800&q=90&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1800&q=90&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800&q=90&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1800&q=90&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1800&q=90&fit=crop&auto=format',
]

function normalizeTrade(value?: string) {
  return (value || 'emprendedor')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
}

function cleanPhone(phone?: string) {
  return (phone || '').replace(/\D/g, '') || '34600000000'
}

function readSocial(profile: AnyProfile, keys: string[]) {
  const raw = keys.map(k => profile?.[k]).find(Boolean)
  if (!raw) return ''
  const value = String(raw).trim()
  if (!value) return ''
  if (value.startsWith('http')) return value
  if (value.startsWith('@')) return `https://www.instagram.com/${value.slice(1)}`
  return value.includes('.') ? `https://${value}` : `https://www.instagram.com/${value}`
}

function ensureImages(profile: AnyProfile, config: any) {
  const uploaded = Array.isArray(profile?.gallery_urls) ? profile.gallery_urls.filter(Boolean) : []
  const configImages = Array.isArray(config?.galleryImages) ? config.galleryImages.filter(Boolean) : []
  const base = [profile?.hero_image_url, config?.heroImage, ...uploaded, ...configImages, ...fallbackImages].filter(Boolean)
  const unique = Array.from(new Set(base))
  while (unique.length < 10) unique.push(fallbackImages[unique.length % fallbackImages.length])
  return unique.slice(0, 10)
}

function getFaqs(profile: AnyProfile, config: any) {
  const list = [0, 1, 2, 3].map(i => ({
    q: profile?.[`faq_${i + 1}_q`] || config?.defaultFaqs?.[i]?.q,
    a: profile?.[`faq_${i + 1}_a`] || config?.defaultFaqs?.[i]?.a,
  })).filter(x => x.q && x.a)
  return list.length ? list : [
    { q: '¿Cómo puedo pedir presupuesto?', a: 'Puedes escribir por WhatsApp o completar el formulario. Te responderemos con una propuesta clara y sin compromiso.' },
    { q: '¿Trabajáis en mi zona?', a: 'Trabajamos principalmente en la ciudad indicada en esta página y alrededores. Escríbenos y confirmamos disponibilidad.' },
    { q: '¿El presupuesto tiene compromiso?', a: 'No. Primero entendemos lo que necesitas y después te damos una propuesta clara.' },
  ]
}

function getServiceTitle(tradeName: string) {
  const name = tradeName.toLowerCase()
  if (name.includes('chef') || name.includes('catering') || name.includes('cocina')) return 'Experiencias pensadas para disfrutar desde el primer bocado.'
  if (name.includes('jardin') || name.includes('paisaj')) return 'Espacios verdes cuidados para vivirlos todos los días.'
  if (name.includes('reforma')) return 'Soluciones profesionales para transformar tu espacio sin complicaciones.'
  if (name.includes('transporte')) return 'Movemos lo importante con orden, cuidado y puntualidad.'
  return 'Servicios claros, profesionales y pensados para resolver lo que necesitas.'
}



function isCulinaryTrade(tradeName: string) {
  const name = tradeName.toLowerCase()
  return name.includes('chef') || name.includes('catering') || name.includes('cocina') || name.includes('restaurante')
}

function getClientSectionCopy(tradeName: string, businessName: string) {
  const culinary = isCulinaryTrade(tradeName)
  if (culinary) {
    return {
      trustTitle: 'Elige con tranquilidad desde el primer mensaje.',
      trustSub: 'Detalles claros, trato cercano y una propuesta cuidada para que reservar sea fácil, seguro y sin dudas.',
      serviceTitle: 'Opciones pensadas para cada tipo de ocasión.',
      serviceSub: `Mira las opciones disponibles y contacta directamente con ${businessName} para resolver dudas o reservar.`,
      processTitle: 'Así será tu experiencia, paso a paso.',
      processSub: 'Un proceso sencillo, claro y pensado para que todo esté organizado antes del día del servicio.',
      galleryTitle: 'Mira el estilo antes de reservar.',
      gallerySub: 'Una selección visual para que puedas imaginar el resultado antes del primer mensaje.',
      faqTitle: 'Resuelve tus dudas en segundos.',
      aboutKicker: 'Quiénes somos',
      experienceTitle: 'Una experiencia que se siente profesional antes de empezar.',
      experienceSub: 'Desde la primera consulta hasta el resultado final, todo está pensado para transmitir confianza, buen gusto y claridad.'
    }
  }
  return {
    trustTitle: 'Todo claro para elegir con seguridad.',
    trustSub: 'Atención directa, explicación sencilla y una propuesta preparada para que sepas exactamente qué vas a contratar.',
    serviceTitle: 'Soluciones para lo que necesitas ahora.',
    serviceSub: `Revisa las opciones y habla directamente con ${businessName} para recibir orientación sin compromiso.`,
    processTitle: 'Así será el proceso, sin complicaciones.',
    processSub: 'Pasos simples, comunicación clara y acompañamiento desde la primera consulta.',
    galleryTitle: 'Mira el estilo y los detalles.',
    gallerySub: 'Imágenes para ayudarte a decidir con más seguridad antes de contactar.',
    faqTitle: 'Resuelve tus dudas en segundos.',
    aboutKicker: 'Quiénes somos',
    experienceTitle: 'Una experiencia profesional desde el primer contacto.',
    experienceSub: 'Pregunta, compara y decide con tranquilidad. La atención está pensada para que todo sea fácil desde el inicio.'
  }
}

function getAboutTitle(tradeName: string) {
  const name = tradeName.toLowerCase()
  if (name.includes('chef') || name.includes('catering') || name.includes('cocina')) return 'Cocina con presencia, sabor y una experiencia que se recuerda.'
  if (name.includes('jardin') || name.includes('paisaj')) return 'Cuidamos cada detalle para que tu espacio hable por sí solo.'
  if (name.includes('reforma')) return 'Obra bien planificada, acabados cuidados y comunicación clara.'
  return 'Un servicio cercano con presencia de empresa grande.'
}

export default function LandingPublica() {
  const params = useParams()
  const slug = params?.slug as string
  const supabase = createClient()

  const [profile, setProfile] = useState<AnyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [formSent, setFormSent] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!slug) { setLoading(false); return }
      const { data } = await supabase.from('profiles').select('*').eq('slug', slug).single()
      setProfile(data || null)
      setLoading(false)
    }
    load()
  }, [slug, supabase])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 48)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show') })
    }, { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [profile])

  const data = useMemo(() => {
    if (!profile) return null
    const tradeId = normalizeTrade(profile.trade)
    const config = getTradeConfig(tradeId)
    const gallery = ensureImages(profile, config)
    const heroImage = profile.hero_image_url || config.heroImage || gallery[0]
    const colors = {
      primary: profile.color_primary || config.colors?.primary || '#3a1d1d',
      secondary: profile.color_secondary || config.colors?.secondary || '#7a332c',
      accent: profile.color_accent || config.colors?.accent || '#d8a15d',
      cream: config.colors?.cream || '#fff7f0',
      ink: config.colors?.ink || '#1c1512',
    }

    const services = [0, 1, 2].map(i => ({
      icon: config.defaultServices?.[i]?.icon || ['✨', '🤝', '📍'][i],
      name: profile[`service_${i + 1}_title`] || config.defaultServices?.[i]?.name || `Servicio ${i + 1}`,
      desc: profile[`service_${i + 1}_desc`] || config.defaultServices?.[i]?.desc || 'Servicio profesional personalizado para cada cliente.',
    })).filter(s => s.name && s.desc)

    const benefits = [
      profile.benefit_1 || config.defaultBenefits?.[0] || 'Atención profesional desde el primer contacto',
      profile.benefit_2 || config.defaultBenefits?.[1] || 'Presupuesto claro y sin sorpresas',
      profile.benefit_3 || config.defaultBenefits?.[2] || 'Trabajo cuidado hasta el último detalle',
    ]

    const process = [0, 1, 2, 3].map(i => ({
      title: profile[`process_${i + 1}_title`] || config.defaultProcess?.[i]?.title || ['Consulta', 'Propuesta', 'Preparación', 'Resultado'][i],
      text: profile[`process_${i + 1}_text`] || config.defaultProcess?.[i]?.text || 'Te acompañamos con claridad en cada paso.',
    }))

    const testimonials = [0, 1, 2].map(i => ({
      name: profile[`testimonial_${i + 1}_name`] || config.defaultTestimonials?.[i]?.name || ['Cliente satisfecho', 'María G.', 'Carlos L.'][i],
      role: profile[`testimonial_${i + 1}_role`] || config.defaultTestimonials?.[i]?.role || 'Cliente',
      text: profile[`testimonial_${i + 1}_text`] || config.defaultTestimonials?.[i]?.text || 'Servicio serio, cercano y con un resultado excelente.',
    }))

    const instagram = readSocial(profile, ['instagram_url', 'instagram', 'ig_url', 'ig'])
    const tiktok = readSocial(profile, ['tiktok_url', 'tiktok', 'tik_tok']) || ''
    const waMsg = profile.whatsapp_message || `Hola, he visto la web de ${profile.business_name || 'tu negocio'} y me gustaría pedir información.`
    const phone = profile.phone || '+34 600 000 000'
    const wa = `https://wa.me/${cleanPhone(phone)}?text=${encodeURIComponent(waMsg)}`

    const businessName = profile.business_name || 'Mi Negocio'
    const sectionCopy = getClientSectionCopy(config.name || profile.trade || '', businessName)

    return {
      businessName,
      ownerName: profile.owner_name || 'Profesional',
      tradeName: config.name || profile.trade || 'Servicio profesional',
      tradeEmoji: config.emoji || '✨',
      city: profile.city || 'Madrid',
      address: profile.address || '',
      phone,
      email: profile.email || 'info@ejemplo.com',
      logo: profile.logo_url || '',
      heroImage,
      gallery,
      colors,
      headline: profile.headline || config.defaultHeadline || 'Servicio profesional',
      subtitle: profile.subtitle || config.defaultSubtitle || 'con atención cercana',
      intro: profile.intro_text || config.defaultIntro || 'Atención profesional, presupuesto claro y un resultado cuidado para cada cliente.',
      years: profile.experience_years || '10',
      services,
      benefits,
      process,
      testimonials,
      faqs: getFaqs(profile, config),
      instagram,
      tiktok,
      wa,
      serviceTitle: getServiceTitle(config.name || profile.trade || ''),
      aboutTitle: getAboutTitle(config.name || profile.trade || ''),
      sectionCopy,
      isCulinary: isCulinaryTrade(config.name || profile.trade || ''),
    }
  }, [profile])

  if (loading) return <div className="loader"><div>✨</div><p>Cargando experiencia...</p></div>
  if (!data) return <div className="loader"><div>🤷</div><h1>Landing no encontrada</h1><p>El slug “{slug}” no existe.</p></div>

  const c = data.colors
  const mapUrl = data.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${data.address}, ${data.city}`)}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.city)}`

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,500;0,700;1,700&display=swap');
        :root{--p:${c.primary};--s:${c.secondary};--a:${c.accent};--cream:${c.cream};--ink:${c.ink};--white:#fff;--soft:rgba(255,255,255,.82);}
        *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;overflow-x:hidden;background:var(--cream);font-family:Inter,system-ui,sans-serif;color:var(--ink)}a{text-decoration:none;color:inherit}img{max-width:100%;display:block}button{font:inherit}
        .loader{min-height:100vh;display:grid;place-items:center;text-align:center;background:linear-gradient(135deg,var(--cream),#fff);color:var(--ink);font-size:1.1rem}.loader div{font-size:4rem;margin-bottom:1rem}
        .reveal{opacity:0;transform:translateY(34px);transition:opacity .8s ease,transform .8s ease}.reveal.show{opacity:1;transform:none}@keyframes softFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}@keyframes cardPulse{0%,100%{box-shadow:0 20px 60px rgba(0,0,0,.06)}50%{box-shadow:0 30px 80px rgba(0,0,0,.11)}}
        .nav{position:fixed;top:0;left:0;right:0;z-index:50;padding:18px clamp(18px,5vw,72px);display:flex;align-items:center;justify-content:space-between;transition:.35s;background:linear-gradient(180deg,rgba(0,0,0,.38),transparent)}
        .nav.sc{background:rgba(18,18,18,.82);backdrop-filter:blur(20px);padding-block:12px;box-shadow:0 20px 50px rgba(0,0,0,.22)}
        .brand{display:flex;align-items:center;gap:12px;color:white;font-weight:900;letter-spacing:-.04em;font-size:clamp(1.05rem,2vw,1.45rem)}.logo{width:46px;height:46px;border-radius:14px;object-fit:cover;background:white;padding:3px}.logo-fallback{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:var(--a);color:var(--p);font-size:1.4rem;box-shadow:0 10px 30px rgba(0,0,0,.18)}
        .links{display:flex;align-items:center;gap:28px;color:white;font-size:.9rem;font-weight:800}.links a{opacity:.9}.links a:hover{opacity:1;color:var(--a)}.nav-cta{background:var(--a);color:var(--p)!important;padding:13px 18px;border-radius:999px;box-shadow:0 12px 30px rgba(0,0,0,.18);opacity:1!important}.burger{display:none;color:white;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.25);border-radius:16px;padding:11px 13px;font-weight:900}
        .mobile{position:fixed;inset:0;z-index:70;background:var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;transform:translateX(${menuOpen ? '0' : '105%'});transition:.35s}.mobile a{font:700 2rem 'Playfair Display';color:white}.mobile button{position:absolute;top:24px;right:24px;width:54px;height:54px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.1);color:white;font-size:1.4rem}
        .hero{position:relative;min-height:100svh;display:grid;align-items:center;isolation:isolate;background:#111;overflow:hidden}.hero-bg{position:absolute;inset:0;z-index:-3}.hero-bg img{width:100%;height:100%;object-fit:cover;filter:saturate(1.05) contrast(1.04)}.hero:before{content:'';position:absolute;inset:0;z-index:-2;background:linear-gradient(90deg,rgba(6,10,18,.82),rgba(6,10,18,.42) 48%,rgba(6,10,18,.72)),linear-gradient(0deg,rgba(6,10,18,.78),rgba(6,10,18,.08) 45%,rgba(6,10,18,.48))}.orb{position:absolute;border-radius:50%;filter:blur(52px);opacity:.22;animation:float 10s ease-in-out infinite}.orb.one{width:260px;height:260px;right:8%;top:18%;background:var(--a)}.orb.two{width:180px;height:180px;left:8%;bottom:20%;background:var(--s);animation-delay:-2s}@keyframes float{50%{transform:translateY(-24px) translateX(12px)}}
        .hero-inner{width:min(1240px,100%);margin:auto;padding:118px clamp(20px,5vw,72px) 72px;display:grid;grid-template-columns:1.05fr .78fr;gap:54px;align-items:center}.eyebrow{display:inline-flex;align-items:center;gap:10px;color:var(--a);font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;font-weight:900;margin-bottom:22px}.eyebrow:before{content:'';width:42px;height:2px;background:var(--a)}
        h1,.h2{font-family:'Playfair Display',serif;font-weight:700;line-height:.94;letter-spacing:-.055em;margin:0;color:inherit}h1{font-size:clamp(3.2rem,7.2vw,7rem);color:white;max-width:900px;text-wrap:balance}.italic{font-style:italic;color:var(--a)}.hero p{font-size:clamp(1.08rem,2vw,1.35rem);line-height:1.75;color:rgba(255,255,255,.9);max-width:690px;margin:28px 0 34px}.hero-actions{display:flex;flex-wrap:wrap;gap:14px}.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;border-radius:999px;padding:17px 24px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;font-size:.82rem;transition:.25s;border:0}.btn.main{background:var(--a);color:var(--p);box-shadow:0 18px 45px rgba(0,0,0,.25)}.btn.main:hover{transform:translateY(-4px);box-shadow:0 28px 65px rgba(0,0,0,.32)}.btn.ghost{border:1px solid rgba(255,255,255,.4);background:rgba(255,255,255,.11);color:white;backdrop-filter:blur(12px)}
        .hero-card{background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.24);border-radius:34px;padding:18px;backdrop-filter:blur(22px);box-shadow:0 36px 90px rgba(0,0,0,.38);color:white;transform:translateY(10px)}.hero-card img{width:100%;height:360px;object-fit:cover;border-radius:26px;margin-bottom:18px}.mini-row{display:grid;gap:10px}.mini{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:13px 14px;font-weight:800}.hero-address{margin-top:14px;color:rgba(255,255,255,.82);font-size:.95rem;line-height:1.5}
        .section{padding:clamp(70px,10vw,126px) clamp(20px,5vw,72px);position:relative}.wrap{width:min(1180px,100%);margin:auto}.section.alt{background:#fff}.section.dark{background:linear-gradient(135deg,var(--ink),color-mix(in srgb,var(--p) 72%,#101522));color:white}.section.photo-band{background:linear-gradient(135deg,rgba(6,10,18,.88),rgba(6,10,18,.72)),var(--band-img) center/cover no-repeat;color:white}.photo-band .wrap{background:linear-gradient(135deg,rgba(255,255,255,.12),rgba(255,255,255,.05));border:1px solid rgba(255,255,255,.2);border-radius:38px;padding:clamp(42px,6vw,78px);backdrop-filter:blur(14px);box-shadow:0 30px 90px rgba(0,0,0,.28)}.photo-band .h2{font-size:clamp(3rem,6.8vw,6.2rem);text-shadow:0 10px 34px rgba(0,0,0,.34)}.photo-band .sub{color:rgba(255,255,255,.9);font-size:clamp(1.08rem,2vw,1.3rem)}.head{text-align:center;margin:0 auto 46px;max-width:930px}.tag{display:flex;align-items:center;justify-content:center;gap:12px;color:var(--s);font-weight:900;font-size:.78rem;letter-spacing:.22em;text-transform:uppercase;margin-bottom:18px}.tag:before,.tag:after{content:'';width:36px;height:2px;background:currentColor}.h2{font-size:clamp(2.5rem,6.5vw,5.5rem)}.sub{font-size:clamp(1rem,1.8vw,1.18rem);line-height:1.8;color:#5b6478;max-width:760px;margin:22px auto 0}.dark .sub{color:rgba(255,255,255,.78)}
        .trust{background:#fff;padding-block:58px}.trust-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.trust-card{background:linear-gradient(180deg,#fff,var(--cream));border:1px solid rgba(0,0,0,.08);border-radius:28px;padding:32px 26px;text-align:center;box-shadow:0 18px 55px rgba(0,0,0,.06);min-height:170px;display:flex;flex-direction:column;justify-content:center}.trust-card b{display:block;font-size:clamp(2rem,4.4vw,3.5rem);font-family:'Playfair Display';color:var(--p);line-height:1}.trust-card span{display:block;margin-top:10px;color:#5b6478;font-weight:800;line-height:1.45}
        .about{display:grid;grid-template-columns:.85fr 1fr;gap:46px;align-items:center}.photo-stack{position:relative;min-height:580px}.photo-main{position:absolute;inset:0 14% 8% 0;border-radius:34px;overflow:hidden;box-shadow:0 30px 90px rgba(0,0,0,.18)}.photo-main img,.photo-small img{width:100%;height:100%;object-fit:cover}.photo-small{position:absolute;right:0;bottom:0;width:44%;height:260px;border:10px solid var(--cream);border-radius:30px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.16)}.logo-badge{position:absolute;left:28px;top:28px;background:rgba(255,255,255,.92);backdrop-filter:blur(14px);border-radius:24px;padding:14px 18px;display:flex;align-items:center;gap:12px;font-weight:900;box-shadow:0 20px 60px rgba(0,0,0,.16)}.logo-badge img{width:46px;height:46px;border-radius:14px;object-fit:cover}.about-text p{font-size:1.1rem;line-height:1.9;color:#4f5870;margin:0 0 18px}.address-box{margin-top:22px;padding:18px 20px;border:1px solid rgba(0,0,0,.08);border-radius:22px;background:#fff;display:flex;gap:14px;align-items:flex-start;box-shadow:0 18px 50px rgba(0,0,0,.06)}.address-box strong{display:block;color:var(--p);margin-bottom:4px}
        .benefit-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;margin-top:42px}.benefit{position:relative;overflow:hidden;min-height:240px;background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:34px;padding:34px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 20px 60px rgba(0,0,0,.06);transition:transform .35s ease,box-shadow .35s ease,border-color .35s ease}.benefit:before{content:'';position:absolute;inset:-1px;background:radial-gradient(circle at 20% 20%, color-mix(in srgb,var(--a) 25%,transparent), transparent 35%),linear-gradient(135deg,transparent,rgba(255,255,255,.7));opacity:.75;pointer-events:none}.benefit:after{content:'✦';position:absolute;right:24px;top:18px;color:var(--a);font-size:1.8rem;opacity:.7;animation:softFloat 3.4s ease-in-out infinite}.benefit>*{position:relative}.benefit:hover{transform:translateY(-12px) scale(1.025);box-shadow:0 34px 90px rgba(0,0,0,.14);border-color:color-mix(in srgb,var(--a) 70%,#fff)}.benefit h3{font-size:1.28rem;color:var(--p);margin:0 0 14px}.benefit p{font-size:1.05rem;color:#566075;line-height:1.75;margin:0;max-width:280px}
        .services{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}.service{position:relative;overflow:hidden;border-radius:34px;background:white;box-shadow:0 24px 80px rgba(0,0,0,.08);border:1px solid rgba(0,0,0,.08);min-height:460px;display:flex;flex-direction:column}.service-img{height:210px;overflow:hidden}.service-img img{width:100%;height:100%;object-fit:cover;transition:.45s}.service:hover .service-img img{transform:scale(1.08)}.service-body{padding:32px;text-align:center;display:flex;flex-direction:column;align-items:center;flex:1}.service-icon{width:70px;height:70px;margin-top:-68px;margin-bottom:18px;border-radius:22px;display:grid;place-items:center;background:var(--cream);border:8px solid white;font-size:2rem;box-shadow:0 18px 40px rgba(0,0,0,.08)}.service h3{margin:0 0 12px;font-size:1.38rem;color:var(--p);letter-spacing:-.04em}.service p{margin:0;color:#5b6478;line-height:1.75}.service a{margin-top:auto;color:var(--s);font-weight:900;padding-top:22px}
        .marquee{display:none}
        .process-layout{display:block}.process-photo{display:none}.process-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}.step{position:relative;overflow:hidden;border-radius:32px;padding:34px 26px;background:#fff;border:1px solid rgba(0,0,0,.08);box-shadow:0 18px 55px rgba(0,0,0,.06);min-height:250px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:transform .35s ease,box-shadow .35s ease}.step:before{content:'';position:absolute;inset:auto -30% -45% -30%;height:75%;background:radial-gradient(circle,color-mix(in srgb,var(--a) 28%,transparent),transparent 62%);transition:.35s}.step:hover{transform:translateY(-12px);box-shadow:0 34px 90px rgba(0,0,0,.14)}.step:hover:before{transform:translateY(-16px) scale(1.08)}.step-num{position:relative;width:64px;height:64px;border-radius:20px;background:var(--a);color:var(--p);display:grid;place-items:center;font-weight:900;margin:0 auto 24px;box-shadow:0 16px 36px color-mix(in srgb,var(--a) 45%,transparent);animation:softFloat 4s ease-in-out infinite}.step h3{position:relative;font-size:1.28rem;margin:0 0 12px;color:var(--p)}.step p{position:relative;margin:0;line-height:1.75;color:#566075}
        .gallery{display:grid;grid-template-columns:repeat(12,1fr);grid-auto-rows:230px;gap:16px}.g{border-radius:28px;overflow:hidden;position:relative;cursor:pointer;box-shadow:0 22px 70px rgba(0,0,0,.11);background:#ddd}.g:nth-child(1){grid-column:span 6;grid-row:span 2}.g:nth-child(2),.g:nth-child(3),.g:nth-child(4),.g:nth-child(5){grid-column:span 3}.g img{width:100%;height:100%;object-fit:cover;transition:.45s}.g:hover img{transform:scale(1.08)}.g:after{content:'Ver imagen';position:absolute;inset:auto 18px 18px auto;background:rgba(255,255,255,.9);border-radius:999px;padding:9px 13px;font-weight:900;color:var(--p);opacity:0;transform:translateY(8px);transition:.25s}.g:hover:after{opacity:1;transform:none}
        .reviews{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}.review{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16);border-radius:30px;padding:30px;min-height:300px}.stars{color:var(--a);letter-spacing:3px;margin-bottom:18px}.review p{font-family:'Playfair Display';font-size:1.25rem;line-height:1.55;margin:0 0 24px;color:white}.avatar{display:flex;align-items:center;gap:12px}.avatar span{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:var(--a);color:var(--p);font-weight:900}.avatar b{display:block}.avatar small{color:rgba(255,255,255,.68)}
        .faq{max-width:960px;margin:auto;display:grid;gap:18px}.faq-item{opacity:1!important;transform:none!important;background:white;border-radius:26px;border:1px solid rgba(0,0,0,.08);box-shadow:0 16px 50px rgba(0,0,0,.06);overflow:hidden;transition:box-shadow .3s,transform .3s,border-color .3s}.faq-item:hover{transform:translateY(-4px)!important;box-shadow:0 28px 75px rgba(0,0,0,.1);border-color:color-mix(in srgb,var(--a) 65%,#fff)}.faq-q{width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;text-align:left;padding:25px 28px;background:white;color:var(--ink);border:0;cursor:pointer;font-weight:900;font-size:1.12rem}.faq-plus{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--cream);color:var(--s);font-weight:900;font-size:1.65rem;flex:none;transition:.25s}.faq-item.open .faq-plus{transform:rotate(45deg);background:var(--a);color:var(--p)}.faq-a{max-height:0;overflow:hidden;border-top:0 solid rgba(0,0,0,.06);background:linear-gradient(180deg,#fff,var(--cream));transition:max-height .35s ease,border-top-width .25s}.faq-item.open .faq-a{max-height:260px;border-top-width:1px}.faq-a-inner{padding:0}.faq-a p{margin:0;padding:22px 28px 30px;color:#5b6478;line-height:1.75;font-size:1.03rem}
        .contact{display:grid;grid-template-columns:.9fr 1.1fr;gap:36px;align-items:stretch}.contact-card,.form-card{border-radius:34px;padding:34px;background:#fff;box-shadow:0 24px 80px rgba(0,0,0,.08);border:1px solid rgba(0,0,0,.08)}.contact-card{background:linear-gradient(135deg,var(--p),var(--ink));color:white}.contact-card h2{font:700 clamp(2.4rem,5vw,4.4rem)/.98 'Playfair Display';letter-spacing:-.05em;margin:0 0 20px}.info{display:grid;gap:14px;margin:28px 0}.info a,.info div{display:flex;gap:12px;align-items:flex-start;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:16px;color:white}.socials{display:flex;gap:12px;flex-wrap:wrap}.socials a{display:inline-flex;align-items:center;gap:9px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.16);padding:12px 15px;border-radius:999px;color:white;font-weight:900}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.field.full{grid-column:1/-1}.field label{display:block;margin-bottom:7px;color:var(--p);font-size:.78rem;text-transform:uppercase;letter-spacing:.1em;font-weight:900}.field input,.field textarea{width:100%;border:1px solid rgba(0,0,0,.1);background:#fafafa;border-radius:16px;padding:15px;font:inherit;outline:none}.field textarea{min-height:130px;resize:vertical}.field input:focus,.field textarea:focus{border-color:var(--s);box-shadow:0 0 0 5px color-mix(in srgb,var(--s) 12%,transparent)}.submit{width:100%;margin-top:16px;border:0;border-radius:999px;padding:17px;background:var(--p);color:white;font-weight:900;text-transform:uppercase;letter-spacing:.1em}.sent{text-align:center;padding:54px 16px}.sent b{font-family:'Playfair Display';font-size:2rem;display:block;margin:12px 0;color:var(--p)}
        .footer{position:relative;overflow:hidden;background:#0e1117;color:white;padding:72px clamp(20px,5vw,72px) 28px}.footer:before{content:'';position:absolute;inset:-20% -10% auto auto;width:520px;height:520px;background:radial-gradient(circle,var(--s),transparent 70%);opacity:.28;filter:blur(24px)}.foot-wrap{position:relative;width:min(1180px,100%);margin:auto}.foot-top{display:grid;grid-template-columns:1.1fr .9fr .9fr;gap:32px;padding-bottom:42px;border-bottom:1px solid rgba(255,255,255,.12)}.foot-brand{font:900 clamp(2rem,5vw,4rem)/.9 'Playfair Display';letter-spacing:-.06em;margin-bottom:18px}.foot-brand em{color:var(--a)}.foot-col h4{margin:0 0 16px;color:var(--a);text-transform:uppercase;letter-spacing:.14em;font-size:.82rem}.foot-col a,.foot-col p{display:block;color:rgba(255,255,255,.74);line-height:1.9;margin:0 0 8px}.foot-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}.foot-bottom{display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;padding-top:26px;color:rgba(255,255,255,.58);font-size:.92rem}.powered{color:rgba(255,255,255,.48)}.powered strong{color:var(--a)}
        .social-strip{display:flex;gap:12px;flex-wrap:wrap;margin-top:18px}.social-pill{display:inline-flex;align-items:center;gap:10px;border-radius:999px;padding:12px 16px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);color:white;font-weight:900}.social-pill.wa{background:#25D366;color:white;border-color:#25D366}.floating{position:fixed;right:22px;bottom:22px;z-index:60;display:flex;flex-direction:column;gap:12px}.float-btn{width:62px;height:62px;border-radius:50%;display:grid;place-items:center;background:#25D366;color:white;font-size:1.55rem;box-shadow:0 18px 45px rgba(37,211,102,.42);animation:pulse 2.6s infinite}.float-social{width:50px;height:50px;border-radius:50%;display:grid;place-items:center;background:#111;color:white;box-shadow:0 12px 35px rgba(0,0,0,.25);font-weight:900}@keyframes pulse{50%{transform:translateY(-7px) scale(1.04)}}
        .sticky-wa{position:fixed;left:50%;bottom:20px;z-index:55;transform:translateX(-50%);background:#25D366;color:white;border:8px solid rgba(255,255,255,.88);border-radius:999px;padding:12px 22px;font-weight:900;text-transform:uppercase;font-size:.78rem;box-shadow:0 18px 55px rgba(0,0,0,.22)}
        .lb{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.94);display:grid;place-items:center;padding:24px}.lb img{max-height:86vh;max-width:92vw;border-radius:24px;object-fit:contain}.lb button{position:absolute;top:22px;right:22px;width:54px;height:54px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.12);color:white;font-size:1.3rem}
        @media(max-width:980px){.links{display:none}.burger{display:block}.hero-inner,.about,.contact{grid-template-columns:1fr}.hero-card img{height:260px}.trust-grid,.process-grid{grid-template-columns:repeat(2,1fr)}.services,.reviews,.benefit-grid{grid-template-columns:1fr}.gallery{grid-template-columns:1fr 1fr}.g:nth-child(1),.g:nth-child(2),.g:nth-child(3),.g:nth-child(4),.g:nth-child(5){grid-column:auto;grid-row:auto}.foot-top{grid-template-columns:1fr}.photo-stack{min-height:470px}.sticky-wa{display:none}}
        @media(max-width:620px){.hero-inner{padding-top:110px}.hero-actions .btn{width:100%}.trust-grid,.gallery,.process-grid{grid-template-columns:1fr}.g:nth-child(1),.g:nth-child(2),.g:nth-child(3),.g:nth-child(4),.g:nth-child(5){grid-row:auto;grid-column:auto}.photo-main{inset:0 0 80px 0}.photo-small{width:58%;height:180px}.form-grid{grid-template-columns:1fr}.floating{right:14px;bottom:14px}.float-social{display:none}.section{padding-inline:18px}.hero-card{display:none}.footer{padding-bottom:86px}}
      `}</style>

      <nav className={`nav ${scrolled ? 'sc' : ''}`}>
        <a className="brand" href="#top" aria-label={data.businessName}>
          {data.logo ? <img className="logo" src={data.logo} alt={`Logo ${data.businessName}`} /> : <span className="logo-fallback">{data.tradeEmoji}</span>}
          <span>{data.businessName}</span>
        </a>
        <div className="links">
          <a href="#servicios">Servicios</a>
          <a href="#galeria">Galería</a>
          <a href="#ubicacion">Ubicación</a>
          <a href="#faq">Dudas</a>
          <a className="nav-cta" href={data.wa} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
        </div>
        <button className="burger" onClick={() => setMenuOpen(true)}>Menú</button>
      </nav>

      <div className="mobile">
        <button onClick={() => setMenuOpen(false)}>×</button>
        {['servicios','proceso','galeria','ubicacion','faq','contacto'].map(x => <a key={x} href={`#${x}`} onClick={() => setMenuOpen(false)}>{x}</a>)}
        <a href={data.wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>

      <header className="hero" id="top">
        <div className="hero-bg"><img src={data.heroImage} alt={data.businessName} /></div>
        <div className="orb one"/><div className="orb two"/>
        <div className="hero-inner">
          <div className="reveal show">
            <div className="eyebrow">{data.tradeEmoji} {data.tradeName} en {data.city}</div>
            <h1>{data.headline} <span className="italic">{data.subtitle}</span></h1>
            <p>{data.intro}</p>
            <div className="hero-actions">
              <a className="btn main" href={data.wa} target="_blank" rel="noopener noreferrer">💬 Pedir disponibilidad</a>
              <a className="btn ghost" href="#servicios">Ver servicios</a>
            </div>
            <div className="social-strip"><a className="social-pill wa" href={data.wa} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>{data.instagram && <a className="social-pill" href={data.instagram} target="_blank" rel="noopener noreferrer">📸 Instagram</a>}{data.tiktok && <a className="social-pill" href={data.tiktok} target="_blank" rel="noopener noreferrer">🎵 TikTok</a>}</div>
          </div>
          <aside className="hero-card reveal show">
            <img src={data.gallery[0] || data.heroImage} alt={`Trabajo de ${data.businessName}`} />
            <div className="mini-row">
              {data.benefits.map((b: string, i: number) => <div className="mini" key={i}>✓ <span>{b}</span></div>)}
            </div>
            <div className="hero-address">📍 {data.address ? `${data.address}, ` : ''}{data.city}</div>
          </aside>
        </div>
      </header>

      <section className="trust">
        <div className="wrap trust-grid">
          <div className="trust-card reveal"><b>+{data.years}</b><span>años de experiencia</span></div>
          <div className="trust-card reveal"><b>24h</b><span>respuesta rápida</span></div>
          <div className="trust-card reveal"><b>100%</b><span>trato personalizado</span></div>
          <div className="trust-card reveal"><b>{data.city}</b><span>servicio local</span></div>
        </div>
      </section>

      <section className="section" id="nosotros">
        <div className="wrap about">
          <div className="photo-stack reveal">
            <div className="photo-main"><img src={data.gallery[2] || data.heroImage} alt={`${data.businessName} en acción`} /></div>
            <div className="photo-small"><img src={data.gallery[3] || data.heroImage} alt={`Detalle de ${data.businessName}`} /></div>
            <div className="logo-badge">{data.logo ? <img src={data.logo} alt="Logo" /> : <span>{data.tradeEmoji}</span>} {data.businessName}</div>
          </div>
          <div className="about-text reveal">
            <div className="tag" style={{justifyContent:'flex-start'}}>{data.sectionCopy.aboutKicker}</div>
            <h2 className="h2">{data.aboutTitle}</h2>
            <p>{data.intro}</p>
            <p>Detrás de <strong>{data.businessName}</strong> está {data.ownerName}, un profesional que cuida la atención, la comunicación y cada detalle para que el cliente se sienta seguro desde el primer mensaje.</p>
            <div className="address-box" id="ubicacion">
              <span style={{fontSize:'1.6rem'}}>📍</span>
              <div><strong>Estamos en {data.city}</strong><span>{data.address || 'Consulta disponibilidad por zona'}.</span><br/><a href={mapUrl} target="_blank" rel="noopener noreferrer" style={{color:'var(--s)',fontWeight:900}}>Abrir ubicación →</a></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="head reveal"><div className="tag">Por qué elegirnos</div><h2 className="h2">{data.sectionCopy.trustTitle}</h2><p className="sub">{data.sectionCopy.trustSub}</p></div>
          <div className="benefit-grid">
            {data.benefits.map((b: string, i: number) => <div className="benefit reveal" key={i}><h3>{['Confianza desde el inicio','Claridad en cada paso','Resultado cuidado'][i] || 'Servicio profesional'}</h3><p>{b}</p></div>)}
          </div>
          <div className="hero-actions" style={{justifyContent:'center', marginTop: '34px'}}><a href={data.wa} className="btn main" target="_blank" rel="noopener noreferrer">💬 Hablar ahora</a></div>
        </div>
      </section>

      <section className="section photo-band" style={{'--band-img': `url(${data.gallery[4] || data.heroImage})`} as any}>
        <div className="wrap">
          <div className="head reveal"><div className="tag">Experiencia</div><h2 className="h2">{data.sectionCopy.experienceTitle}</h2><p className="sub">{data.sectionCopy.experienceSub}</p></div>
          <div className="hero-actions" style={{justifyContent:'center'}}><a href={data.wa} className="btn main" target="_blank" rel="noopener noreferrer">💬 Consultar disponibilidad</a><a href={mapUrl} className="btn ghost" target="_blank" rel="noopener noreferrer">📍 Ver zona de servicio</a></div>
        </div>
      </section>

      <section className="section" id="servicios">
        <div className="wrap">
          <div className="head reveal"><div className="tag">Servicios</div><h2 className="h2">{data.sectionCopy.serviceTitle}</h2><p className="sub">{data.sectionCopy.serviceSub}</p></div>
          <div className="services">
            {data.services.map((s: any, i: number) => <article className="service reveal" key={i}>
              <div className="service-img"><img src={data.gallery[(i + 4) % data.gallery.length]} alt={s.name} /></div>
              <div className="service-body"><div className="service-icon">{s.icon}</div><h3>{s.name}</h3><p>{s.desc}</p><a href={data.wa} target="_blank" rel="noopener noreferrer">Consultar este servicio →</a></div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="section alt" id="proceso">
        <div className="wrap">
          <div className="head reveal"><div className="tag">Proceso</div><h2 className="h2">{data.sectionCopy.processTitle}</h2><p className="sub">{data.sectionCopy.processSub}</p></div>
          <div className="process-layout">
            <div className="process-grid">{data.process.map((p: any, i: number) => <div className="step reveal" key={i}><div className="step-num">{i+1}</div><h3>{p.title}</h3><p>{p.text}</p></div>)}</div>
          </div>
        </div>
      </section>

      <section className="section alt" id="galeria">
        <div className="wrap">
          <div className="head reveal"><div className="tag">Galería</div><h2 className="h2">{data.sectionCopy.galleryTitle}</h2><p className="sub">{data.sectionCopy.gallerySub}</p></div>
          <div className="gallery">{data.gallery.slice(0,5).map((src: string, i: number) => <div className="g reveal" key={`${src}-${i}`} onClick={() => setLightbox(i)}><img src={src} alt={`Imagen ${i + 1} de ${data.businessName}`} loading="lazy" /></div>)}</div>
        </div>
      </section>

      <section className="section dark" id="testimonios">
        <div className="wrap">
          <div className="head reveal"><div className="tag">Opiniones</div><h2 className="h2">Clientes que ya confiaron.</h2></div>
          <div className="reviews">{data.testimonials.map((t: any, i: number) => <div className="review reveal" key={i}><div className="stars">★★★★★</div><p>“{t.text}”</p><div className="avatar"><span>{String(t.name || 'C')[0]}</span><div><b>{t.name}</b><small>{t.role}</small></div></div></div>)}</div>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="wrap">
          <div className="head reveal"><div className="tag">Dudas frecuentes</div><h2 className="h2">{data.sectionCopy.faqTitle}</h2></div>
          <div className="faq">{data.faqs.map((f: any, i: number) => <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={i}>
            <button type="button" className="faq-q" aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)}><span>{f.q}</span><span className="faq-plus">+</span></button>
            <div className="faq-a"><div className="faq-a-inner"><p>{f.a}</p></div></div>
          </div>)}</div>
        </div>
      </section>

      <section className="section alt" id="contacto">
        <div className="wrap contact">
          <div className="contact-card reveal"><h2>Contacto directo</h2><p style={{lineHeight:1.8,color:'rgba(255,255,255,.78)'}}>Pide información, disponibilidad o presupuesto. {data.businessName} te responderá de forma directa.</p><div className="info"><a href={data.wa} target="_blank" rel="noopener noreferrer">💬 <span>{data.phone}</span></a><a href={`mailto:${data.email}`}>✉️ <span>{data.email}</span></a><a href={mapUrl} target="_blank" rel="noopener noreferrer">📍 <span>{data.address ? `${data.address}, ` : ''}{data.city}</span></a></div><div className="socials">{data.instagram && <a href={data.instagram} target="_blank" rel="noopener noreferrer">📸 Instagram</a>}{data.tiktok && <a href={data.tiktok} target="_blank" rel="noopener noreferrer">🎵 TikTok</a>}<a href={data.wa} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a></div></div>
          <div className="form-card reveal">{formSent ? <div className="sent"><span style={{fontSize:'4rem'}}>✨</span><b>Solicitud enviada</b><p>Gracias. Te responderemos lo antes posible.</p></div> : <form onSubmit={e => { e.preventDefault(); setFormSent(true) }}><div className="form-grid"><div className="field"><label>Nombre</label><input required placeholder="Tu nombre" /></div><div className="field"><label>Teléfono</label><input required placeholder="Tu teléfono" /></div><div className="field full"><label>Email</label><input type="email" placeholder="tu@email.com" /></div><div className="field full"><label>Mensaje</label><textarea required placeholder="Cuéntanos qué necesitas..." /></div></div><button className="submit">Enviar solicitud</button></form>}</div>
        </div>
      </section>

      <footer className="footer">
        <div className="foot-wrap">
          <div className="foot-top">
            <div><div className="foot-brand">{data.businessName} <em>{data.tradeEmoji}</em></div><p style={{color:'rgba(255,255,255,.72)',lineHeight:1.8,maxWidth:520}}>{data.intro}</p><div className="foot-actions"><a className="btn main" href={data.wa} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a><a className="btn ghost" href={mapUrl} target="_blank" rel="noopener noreferrer">📍 Ver ubicación</a></div></div>
            <div className="foot-col"><h4>Contacto</h4><a href={data.wa} target="_blank" rel="noopener noreferrer">{data.phone}</a><a href={`mailto:${data.email}`}>{data.email}</a><p>{data.address ? `${data.address}, ` : ''}{data.city}</p></div>
            <div className="foot-col"><h4>Redes</h4>{data.instagram ? <a href={data.instagram} target="_blank" rel="noopener noreferrer">Instagram</a> : <p>Instagram disponible próximamente</p>}{data.tiktok ? <a href={data.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a> : <p>TikTok disponible próximamente</p>}<a href={data.wa} target="_blank" rel="noopener noreferrer">WhatsApp directo</a></div>
          </div>
          <div className="foot-bottom"><span>© {new Date().getFullYear()} {data.businessName}. Servicio profesional en {data.city}.</span><span className="powered">Creado con <strong>Clientos</strong></span></div>
        </div>
      </footer>

      <div className="floating"><a className="float-btn" href={data.wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">💬</a>{data.instagram && <a className="float-social" href={data.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>}{data.tiktok && <a className="float-social" href={data.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">TT</a>}</div>
      <a className="sticky-wa" href={data.wa} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>

      {lightbox !== null && <div className="lb" onClick={() => setLightbox(null)}><button onClick={() => setLightbox(null)}>×</button><img onClick={e => e.stopPropagation()} src={data.gallery[lightbox]} alt="Imagen ampliada" /></div>}
    </>
  )
}
