// src/app/[slug]/page.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getTradeConfig } from '@/lib/trades'

type AnyProfile = Record<string, any>

const fallbackImages = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1800&q=90&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1800&q=90&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800&q=90&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1800&q=90&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1800&q=90&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=1800&q=90&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1800&q=90&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1800&q=90&fit=crop&auto=format',
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

    return {
      businessName: profile.business_name || 'Mi Negocio',
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
        .reveal{opacity:0;transform:translateY(34px);transition:opacity .8s ease,transform .8s ease}.reveal.show{opacity:1;transform:none}
        .nav{position:fixed;top:0;left:0;right:0;z-index:50;padding:18px clamp(18px,5vw,72px);display:flex;align-items:center;justify-content:space-between;transition:.35s;background:linear-gradient(180deg,rgba(0,0,0,.38),transparent)}
        .nav.sc{background:rgba(18,18,18,.82);backdrop-filter:blur(20px);padding-block:12px;box-shadow:0 20px 50px rgba(0,0,0,.22)}
        .brand{display:flex;align-items:center;gap:12px;color:white;font-weight:900;letter-spacing:-.04em;font-size:clamp(1.05rem,2vw,1.45rem)}.logo{width:46px;height:46px;border-radius:14px;object-fit:cover;background:white;padding:3px}.logo-fallback{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:var(--a);color:var(--p);font-size:1.4rem;box-shadow:0 10px 30px rgba(0,0,0,.18)}
        .links{display:flex;align-items:center;gap:28px;color:white;font-size:.9rem;font-weight:800}.links a{opacity:.9}.links a:hover{opacity:1;color:var(--a)}.nav-cta{background:var(--a);color:var(--p)!important;padding:13px 18px;border-radius:999px;box-shadow:0 12px 30px rgba(0,0,0,.18);opacity:1!important}.burger{display:none;color:white;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.25);border-radius:16px;padding:11px 13px;font-weight:900}
        .mobile{position:fixed;inset:0;z-index:70;background:var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;transform:translateX(${menuOpen ? '0' : '105%'});transition:.35s}.mobile a{font:700 2rem 'Playfair Display';color:white}.mobile button{position:absolute;top:24px;right:24px;width:54px;height:54px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.1);color:white;font-size:1.4rem}
        .hero{position:relative;min-height:100svh;display:grid;align-items:end;isolation:isolate;background:#111;overflow:hidden}.hero-bg{position:absolute;inset:0;z-index:-3}.hero-bg img{width:100%;height:100%;object-fit:cover;filter:saturate(1.05) contrast(1.04)}.hero:before{content:'';position:absolute;inset:0;z-index:-2;background:linear-gradient(90deg,rgba(0,0,0,.72),rgba(0,0,0,.3) 48%,rgba(0,0,0,.65)),linear-gradient(0deg,rgba(0,0,0,.78),transparent 42%)}.orb{position:absolute;border-radius:50%;filter:blur(36px);opacity:.55;animation:float 7s ease-in-out infinite}.orb.one{width:260px;height:260px;right:8%;top:18%;background:var(--a)}.orb.two{width:180px;height:180px;left:8%;bottom:20%;background:var(--s);animation-delay:-2s}@keyframes float{50%{transform:translateY(-24px) translateX(12px)}}
        .hero-inner{width:min(1180px,100%);margin:auto;padding:130px clamp(20px,5vw,72px) 56px;display:grid;grid-template-columns:1.1fr .72fr;gap:42px;align-items:end}.eyebrow{display:inline-flex;align-items:center;gap:10px;color:var(--a);font-size:.78rem;letter-spacing:.18em;text-transform:uppercase;font-weight:900;margin-bottom:22px}.eyebrow:before{content:'';width:42px;height:2px;background:var(--a)}
        h1,.h2{font-family:'Playfair Display',serif;font-weight:700;line-height:.94;letter-spacing:-.055em;margin:0;color:inherit}h1{font-size:clamp(3.3rem,8.4vw,7.8rem);color:white;max-width:840px}.italic{font-style:italic;color:var(--a)}.hero p{font-size:clamp(1.08rem,2vw,1.35rem);line-height:1.75;color:rgba(255,255,255,.9);max-width:690px;margin:28px 0 34px}.hero-actions{display:flex;flex-wrap:wrap;gap:14px}.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;border-radius:999px;padding:17px 24px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;font-size:.82rem;transition:.25s;border:0}.btn.main{background:var(--a);color:var(--p);box-shadow:0 18px 45px rgba(0,0,0,.25)}.btn.main:hover{transform:translateY(-4px);box-shadow:0 28px 65px rgba(0,0,0,.32)}.btn.ghost{border:1px solid rgba(255,255,255,.4);background:rgba(255,255,255,.11);color:white;backdrop-filter:blur(12px)}
        .hero-card{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);border-radius:30px;padding:22px;backdrop-filter:blur(18px);box-shadow:0 30px 80px rgba(0,0,0,.35);color:white}.hero-card img{width:100%;height:320px;object-fit:cover;border-radius:22px;margin-bottom:18px}.mini-row{display:grid;gap:10px}.mini{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:13px 14px;font-weight:800}.hero-address{margin-top:14px;color:rgba(255,255,255,.82);font-size:.95rem;line-height:1.5}
        .section{padding:clamp(70px,10vw,126px) clamp(20px,5vw,72px);position:relative}.wrap{width:min(1180px,100%);margin:auto}.section.alt{background:#fff}.section.dark{background:linear-gradient(135deg,var(--ink),var(--p));color:white}.head{text-align:center;margin:0 auto 46px;max-width:930px}.tag{display:flex;align-items:center;justify-content:center;gap:12px;color:var(--s);font-weight:900;font-size:.78rem;letter-spacing:.22em;text-transform:uppercase;margin-bottom:18px}.tag:before,.tag:after{content:'';width:36px;height:2px;background:currentColor}.h2{font-size:clamp(2.5rem,6.5vw,5.5rem)}.sub{font-size:clamp(1rem,1.8vw,1.18rem);line-height:1.8;color:#5b6478;max-width:760px;margin:22px auto 0}.dark .sub{color:rgba(255,255,255,.78)}
        .trust{background:#fff;padding-block:58px}.trust-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.trust-card{background:linear-gradient(180deg,#fff,var(--cream));border:1px solid rgba(0,0,0,.08);border-radius:24px;padding:26px;text-align:center;box-shadow:0 18px 55px rgba(0,0,0,.06)}.trust-card b{display:block;font-size:clamp(1.8rem,4vw,3.2rem);font-family:'Playfair Display';color:var(--p);line-height:1}.trust-card span{display:block;margin-top:8px;color:#5b6478;font-weight:700}
        .about{display:grid;grid-template-columns:.85fr 1fr;gap:46px;align-items:center}.photo-stack{position:relative;min-height:580px}.photo-main{position:absolute;inset:0 14% 8% 0;border-radius:34px;overflow:hidden;box-shadow:0 30px 90px rgba(0,0,0,.18)}.photo-main img,.photo-small img{width:100%;height:100%;object-fit:cover}.photo-small{position:absolute;right:0;bottom:0;width:44%;height:260px;border:10px solid var(--cream);border-radius:30px;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.16)}.logo-badge{position:absolute;left:28px;top:28px;background:rgba(255,255,255,.92);backdrop-filter:blur(14px);border-radius:24px;padding:14px 18px;display:flex;align-items:center;gap:12px;font-weight:900;box-shadow:0 20px 60px rgba(0,0,0,.16)}.logo-badge img{width:46px;height:46px;border-radius:14px;object-fit:cover}.about-text p{font-size:1.1rem;line-height:1.9;color:#4f5870;margin:0 0 18px}.address-box{margin-top:22px;padding:18px 20px;border:1px solid rgba(0,0,0,.08);border-radius:22px;background:#fff;display:flex;gap:14px;align-items:flex-start;box-shadow:0 18px 50px rgba(0,0,0,.06)}.address-box strong{display:block;color:var(--p);margin-bottom:4px}
        .benefit-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:34px}.benefit{min-height:190px;background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:28px;padding:30px;display:flex;flex-direction:column;justify-content:center;box-shadow:0 20px 60px rgba(0,0,0,.06);transition:.25s}.benefit:hover{transform:translateY(-7px)}.benefit h3{font-size:1.2rem;color:var(--p);margin:0 0 10px}.benefit p{font-size:1.02rem;color:#566075;line-height:1.7;margin:0}
        .services{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}.service{position:relative;overflow:hidden;border-radius:34px;background:white;box-shadow:0 24px 80px rgba(0,0,0,.08);border:1px solid rgba(0,0,0,.08);min-height:460px;display:flex;flex-direction:column}.service-img{height:210px;overflow:hidden}.service-img img{width:100%;height:100%;object-fit:cover;transition:.45s}.service:hover .service-img img{transform:scale(1.08)}.service-body{padding:32px;text-align:center;display:flex;flex-direction:column;align-items:center;flex:1}.service-icon{width:70px;height:70px;margin-top:-68px;margin-bottom:18px;border-radius:22px;display:grid;place-items:center;background:var(--cream);border:8px solid white;font-size:2rem;box-shadow:0 18px 40px rgba(0,0,0,.08)}.service h3{margin:0 0 12px;font-size:1.38rem;color:var(--p);letter-spacing:-.04em}.service p{margin:0;color:#5b6478;line-height:1.75}.service a{margin-top:auto;color:var(--s);font-weight:900;padding-top:22px}
        .marquee{overflow:hidden;background:var(--p);color:white;padding:22px 0}.track{display:flex;width:max-content;animation:mar 28s linear infinite}.track span{font-family:'Playfair Display';font-size:clamp(2rem,5vw,4.4rem);font-weight:700;font-style:italic;margin-right:42px;white-space:nowrap;color:rgba(255,255,255,.96)}@keyframes mar{to{transform:translateX(-50%)}}
        .process-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.step{border-radius:28px;padding:28px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(12px);min-height:250px}.step-num{width:58px;height:58px;border-radius:18px;background:var(--a);color:var(--p);display:grid;place-items:center;font-weight:900;margin-bottom:28px}.step h3{font-size:1.25rem;margin:0 0 10px}.step p{margin:0;line-height:1.7;color:rgba(255,255,255,.78)}
        .gallery{display:grid;grid-template-columns:1.3fr .9fr .9fr;grid-auto-rows:250px;gap:16px}.g{border-radius:28px;overflow:hidden;position:relative;cursor:pointer;box-shadow:0 22px 70px rgba(0,0,0,.11);background:#ddd}.g:first-child{grid-row:span 2}.g:nth-child(6){grid-column:span 2}.g img{width:100%;height:100%;object-fit:cover;transition:.45s}.g:hover img{transform:scale(1.08)}.g:after{content:'Ver imagen';position:absolute;inset:auto 18px 18px auto;background:rgba(255,255,255,.9);border-radius:999px;padding:9px 13px;font-weight:900;color:var(--p);opacity:0;transform:translateY(8px);transition:.25s}.g:hover:after{opacity:1;transform:none}
        .reviews{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}.review{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16);border-radius:30px;padding:30px;min-height:300px}.stars{color:var(--a);letter-spacing:3px;margin-bottom:18px}.review p{font-family:'Playfair Display';font-size:1.25rem;line-height:1.55;margin:0 0 24px;color:white}.avatar{display:flex;align-items:center;gap:12px}.avatar span{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:var(--a);color:var(--p);font-weight:900}.avatar b{display:block}.avatar small{color:rgba(255,255,255,.68)}
        .faq{max-width:920px;margin:auto;display:grid;gap:14px}.faq-item{background:white;border-radius:24px;border:1px solid rgba(0,0,0,.08);box-shadow:0 16px 50px rgba(0,0,0,.06);overflow:hidden}.faq-q{width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px;text-align:left;padding:24px 26px;background:white;color:var(--ink);border:0;cursor:pointer;font-weight:900;font-size:1.05rem}.faq-plus{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:var(--cream);color:var(--s);font-weight:900;font-size:1.4rem;flex:none;transition:.25s}.faq-item.open .faq-plus{transform:rotate(45deg);background:var(--a);color:var(--p)}.faq-a{display:grid;grid-template-rows:0fr;transition:grid-template-rows .3s ease}.faq-item.open .faq-a{grid-template-rows:1fr}.faq-a-inner{overflow:hidden}.faq-a p{margin:0;padding:0 26px 26px;color:#5b6478;line-height:1.75}
        .contact{display:grid;grid-template-columns:.9fr 1.1fr;gap:36px;align-items:stretch}.contact-card,.form-card{border-radius:34px;padding:34px;background:#fff;box-shadow:0 24px 80px rgba(0,0,0,.08);border:1px solid rgba(0,0,0,.08)}.contact-card{background:linear-gradient(135deg,var(--p),var(--ink));color:white}.contact-card h2{font:700 clamp(2.4rem,5vw,4.4rem)/.98 'Playfair Display';letter-spacing:-.05em;margin:0 0 20px}.info{display:grid;gap:14px;margin:28px 0}.info a,.info div{display:flex;gap:12px;align-items:flex-start;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:16px;color:white}.socials{display:flex;gap:12px;flex-wrap:wrap}.socials a{display:inline-flex;align-items:center;gap:9px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.16);padding:12px 15px;border-radius:999px;color:white;font-weight:900}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.field.full{grid-column:1/-1}.field label{display:block;margin-bottom:7px;color:var(--p);font-size:.78rem;text-transform:uppercase;letter-spacing:.1em;font-weight:900}.field input,.field textarea{width:100%;border:1px solid rgba(0,0,0,.1);background:#fafafa;border-radius:16px;padding:15px;font:inherit;outline:none}.field textarea{min-height:130px;resize:vertical}.field input:focus,.field textarea:focus{border-color:var(--s);box-shadow:0 0 0 5px color-mix(in srgb,var(--s) 12%,transparent)}.submit{width:100%;margin-top:16px;border:0;border-radius:999px;padding:17px;background:var(--p);color:white;font-weight:900;text-transform:uppercase;letter-spacing:.1em}.sent{text-align:center;padding:54px 16px}.sent b{font-family:'Playfair Display';font-size:2rem;display:block;margin:12px 0;color:var(--p)}
        .footer{position:relative;overflow:hidden;background:#0e1117;color:white;padding:72px clamp(20px,5vw,72px) 28px}.footer:before{content:'';position:absolute;inset:-20% -10% auto auto;width:520px;height:520px;background:radial-gradient(circle,var(--s),transparent 70%);opacity:.28;filter:blur(24px)}.foot-wrap{position:relative;width:min(1180px,100%);margin:auto}.foot-top{display:grid;grid-template-columns:1.1fr .9fr .9fr;gap:32px;padding-bottom:42px;border-bottom:1px solid rgba(255,255,255,.12)}.foot-brand{font:900 clamp(2rem,5vw,4rem)/.9 'Playfair Display';letter-spacing:-.06em;margin-bottom:18px}.foot-brand em{color:var(--a)}.foot-col h4{margin:0 0 16px;color:var(--a);text-transform:uppercase;letter-spacing:.14em;font-size:.82rem}.foot-col a,.foot-col p{display:block;color:rgba(255,255,255,.74);line-height:1.9;margin:0 0 8px}.foot-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}.foot-bottom{display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;padding-top:26px;color:rgba(255,255,255,.58);font-size:.92rem}.powered{color:rgba(255,255,255,.48)}.powered strong{color:var(--a)}
        .floating{position:fixed;right:22px;bottom:22px;z-index:60;display:flex;flex-direction:column;gap:12px}.float-btn{width:62px;height:62px;border-radius:50%;display:grid;place-items:center;background:#25D366;color:white;font-size:1.55rem;box-shadow:0 18px 45px rgba(37,211,102,.42);animation:pulse 2.6s infinite}.float-social{width:50px;height:50px;border-radius:50%;display:grid;place-items:center;background:#111;color:white;box-shadow:0 12px 35px rgba(0,0,0,.25);font-weight:900}@keyframes pulse{50%{transform:translateY(-7px) scale(1.04)}}
        .sticky-wa{position:fixed;left:50%;bottom:20px;z-index:55;transform:translateX(-50%);background:#25D366;color:white;border:8px solid rgba(255,255,255,.88);border-radius:999px;padding:12px 22px;font-weight:900;text-transform:uppercase;font-size:.78rem;box-shadow:0 18px 55px rgba(0,0,0,.22)}
        .lb{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.94);display:grid;place-items:center;padding:24px}.lb img{max-height:86vh;max-width:92vw;border-radius:24px;object-fit:contain}.lb button{position:absolute;top:22px;right:22px;width:54px;height:54px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:rgba(255,255,255,.12);color:white;font-size:1.3rem}
        @media(max-width:980px){.links{display:none}.burger{display:block}.hero-inner,.about,.contact{grid-template-columns:1fr}.hero-card img{height:260px}.trust-grid,.process-grid{grid-template-columns:repeat(2,1fr)}.services,.reviews,.benefit-grid{grid-template-columns:1fr}.gallery{grid-template-columns:1fr 1fr}.foot-top{grid-template-columns:1fr}.photo-stack{min-height:470px}.sticky-wa{display:none}}
        @media(max-width:620px){.hero-inner{padding-top:110px}.hero-actions .btn{width:100%}.trust-grid,.gallery,.process-grid{grid-template-columns:1fr}.g:first-child,.g:nth-child(6){grid-row:auto;grid-column:auto}.photo-main{inset:0 0 80px 0}.photo-small{width:58%;height:180px}.form-grid{grid-template-columns:1fr}.floating{right:14px;bottom:14px}.float-social{display:none}.section{padding-inline:18px}.hero-card{display:none}.footer{padding-bottom:86px}}
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
        {['servicios','galeria','ubicacion','faq','contacto'].map(x => <a key={x} href={`#${x}`} onClick={() => setMenuOpen(false)}>{x}</a>)}
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
          </div>
          <aside className="hero-card reveal show">
            <img src={data.gallery[1] || data.heroImage} alt={`Trabajo de ${data.businessName}`} />
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
            <div className="tag" style={{justifyContent:'flex-start'}}>Quiénes somos</div>
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
          <div className="head reveal"><div className="tag">Por qué elegirnos</div><h2 className="h2">Calidad visible antes del primer contacto.</h2><p className="sub">Una atención clara, una imagen cuidada y una forma de trabajar pensada para que el cliente sepa exactamente con quién está tratando.</p></div>
          <div className="benefit-grid">
            {data.benefits.map((b: string, i: number) => <div className="benefit reveal" key={i}><h3>{['Confianza desde el inicio','Claridad en cada paso','Resultado cuidado'][i] || 'Servicio profesional'}</h3><p>{b}</p></div>)}
          </div>
        </div>
      </section>

      <section className="section" id="servicios">
        <div className="wrap">
          <div className="head reveal"><div className="tag">Servicios</div><h2 className="h2">{data.serviceTitle}</h2><p className="sub">Elige el servicio que necesitas y habla directamente con {data.businessName}. Te orientamos sin compromiso.</p></div>
          <div className="services">
            {data.services.map((s: any, i: number) => <article className="service reveal" key={i}>
              <div className="service-img"><img src={data.gallery[(i + 4) % data.gallery.length]} alt={s.name} /></div>
              <div className="service-body"><div className="service-icon">{s.icon}</div><h3>{s.name}</h3><p>{s.desc}</p><a href={data.wa} target="_blank" rel="noopener noreferrer">Consultar este servicio →</a></div>
            </article>)}
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true"><div className="track"><span>{data.businessName}</span><span>{data.tradeName}</span><span>{data.city}</span><span>Atención cuidada</span><span>{data.businessName}</span><span>{data.tradeName}</span><span>{data.city}</span><span>Atención cuidada</span></div></div>

      <section className="section dark">
        <div className="wrap">
          <div className="head reveal"><div className="tag">Proceso</div><h2 className="h2">Así pasamos de la idea al resultado.</h2><p className="sub">Un proceso simple, claro y acompañado de principio a fin.</p></div>
          <div className="process-grid">{data.process.map((p: any, i: number) => <div className="step reveal" key={i}><div className="step-num">{i+1}</div><h3>{p.title}</h3><p>{p.text}</p></div>)}</div>
        </div>
      </section>

      <section className="section alt" id="galeria">
        <div className="wrap">
          <div className="head reveal"><div className="tag">Galería</div><h2 className="h2">Mira de cerca el estilo de {data.businessName}.</h2><p className="sub">Imágenes seleccionadas para transmitir confianza, calidad y el tipo de experiencia que recibirá cada cliente.</p></div>
          <div className="gallery">{data.gallery.slice(0,8).map((src: string, i: number) => <div className="g reveal" key={`${src}-${i}`} onClick={() => setLightbox(i)}><img src={src} alt={`Imagen ${i + 1} de ${data.businessName}`} loading="lazy" /></div>)}</div>
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
          <div className="head reveal"><div className="tag">Dudas frecuentes</div><h2 className="h2">Antes de contactar, esto suele ayudar.</h2></div>
          <div className="faq">{data.faqs.map((f: any, i: number) => <div className={`faq-item reveal ${openFaq === i ? 'open' : ''}`} key={i}>
            <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}><span>{f.q}</span><span className="faq-plus">+</span></button>
            <div className="faq-a"><div className="faq-a-inner"><p>{f.a}</p></div></div>
          </div>)}</div>
        </div>
      </section>

      <section className="section alt" id="contacto">
        <div className="wrap contact">
          <div className="contact-card reveal"><h2>¿Hablamos hoy?</h2><p style={{lineHeight:1.8,color:'rgba(255,255,255,.78)'}}>Pide información, disponibilidad o presupuesto. {data.businessName} te responderá de forma directa.</p><div className="info"><a href={data.wa} target="_blank" rel="noopener noreferrer">💬 <span>{data.phone}</span></a><a href={`mailto:${data.email}`}>✉️ <span>{data.email}</span></a><a href={mapUrl} target="_blank" rel="noopener noreferrer">📍 <span>{data.address ? `${data.address}, ` : ''}{data.city}</span></a></div><div className="socials">{data.instagram && <a href={data.instagram} target="_blank" rel="noopener noreferrer">📸 Instagram</a>}{data.tiktok && <a href={data.tiktok} target="_blank" rel="noopener noreferrer">🎵 TikTok</a>}<a href={data.wa} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a></div></div>
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
