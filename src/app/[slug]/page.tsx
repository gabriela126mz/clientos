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
  cta_text: string
  whatsapp_message: string
  slug: string
  logo_url: string
  hero_image_url: string
  zone: string
  color_primary?: string
  color_secondary?: string
  color_accent?: string
}

export default function LandingPage() {
  const params = useParams()
  const slug = params?.slug as string
  const supabase = createClient()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [formSent, setFormSent] = useState(false)
  const [lb, setLb] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', msg: '' })
  const [colors, setColors] = useState({ primary: '#2d5a27', secondary: '#3d7a35', accent: '#c8a96e' })
  const [tradeConfig, setTradeConfig] = useState<any>(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (!slug) return
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('slug', slug)
        .single()

      if (data) {
        setProfile(data as ProfileData)
        const config = getTradeConfig(data.trade || 'emprendedor')
        setTradeConfig(config)
        setColors({
          primary: data.color_primary || config.colors.primary,
          secondary: data.color_secondary || config.colors.secondary,
          accent: data.color_accent || config.colors.accent,
        })
      }
    }
    loadProfile()
  }, [slug, supabase])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).classList.add('vis') })
      }, { threshold: 0.08 })
      document.querySelectorAll('.a, .al, .ar').forEach(el => obs.observe(el))
      return () => obs.disconnect()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  if (!profile || !tradeConfig) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p>Cargando...</p>
    </div>
  }

  // RELLENAR CON DATOS DEL OFICIO SI FALTAN
  const BIZ = {
    name: profile.business_name || tradeConfig.name,
    trade: profile.trade || 'Emprendedor',
    phone: profile.phone || '+34 600 000 000',
    email: profile.email || 'info@negocio.com',
    city: profile.city || 'Madrid',
    address: profile.address || '',
    headline: profile.headline || tradeConfig.defaultHeadline,
    headline2: profile.subtitle || tradeConfig.defaultSubtitle,
    sub: profile.intro_text || tradeConfig.defaultIntro,
    about: profile.intro_text || tradeConfig.defaultIntro,
    years: profile.experience_years || '10',
    waText: profile.whatsapp_message || '¡Hola! Me interesa conocer más sobre tus servicios',
    services: [
      {
        icon: tradeConfig.defaultServices[0]?.icon || '🎯',
        name: profile.service_1_title || tradeConfig.defaultServices[0]?.name || 'Servicio 1',
        desc: profile.service_1_desc || tradeConfig.defaultServices[0]?.desc || 'Descripción del servicio',
        img: tradeConfig.heroImage
      },
      {
        icon: tradeConfig.defaultServices[1]?.icon || '⚡',
        name: profile.service_2_title || tradeConfig.defaultServices[1]?.name || 'Servicio 2',
        desc: profile.service_2_desc || tradeConfig.defaultServices[1]?.desc || 'Descripción del servicio',
        img: tradeConfig.heroImage
      },
      {
        icon: tradeConfig.defaultServices[2]?.icon || '✨',
        name: profile.service_3_title || tradeConfig.defaultServices[2]?.name || 'Servicio 3',
        desc: profile.service_3_desc || tradeConfig.defaultServices[2]?.desc || 'Descripción del servicio',
        img: tradeConfig.heroImage
      },
    ],
    gallery: [tradeConfig.heroImage, tradeConfig.heroImage, tradeConfig.heroImage, tradeConfig.heroImage, tradeConfig.heroImage, tradeConfig.heroImage],
    testimonials: tradeConfig.defaultTestimonials || [
      { name: 'Cliente 1', role: 'Empresa', text: 'Excelente servicio', stars: 5 },
      { name: 'Cliente 2', role: 'Particular', text: 'Muy profesionales', stars: 5 },
      { name: 'Cliente 3', role: 'Comercio', text: 'Recomendable 100%', stars: 5 },
    ],
  }

  const wa = `https://wa.me/${BIZ.phone.replace(/\D/g, '')}?text=${encodeURIComponent(BIZ.waText)}`

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; font-size:16px; }
        body { font-family:'Inter',sans-serif; overflow-x:hidden; background:#faf7f2; color:#1a2818; }
        img { display:block; max-width:100%; }
        a { text-decoration:none; color:inherit; }
        button { font-family:inherit; cursor:pointer; border:none; background:none; }

        /* ANIMATIONS */
        .a { opacity:0; transform:translateY(28px); transition:opacity .75s ease, transform .75s ease; }
        .a.vis { opacity:1; transform:none; }
        .al { opacity:0; transform:translateX(-36px); transition:opacity .75s ease, transform .75s ease; }
        .al.vis { opacity:1; transform:none; }
        .ar { opacity:0; transform:translateX(36px); transition:opacity .75s ease, transform .75s ease; }
        .ar.vis { opacity:1; transform:none; }
        .d1{transition-delay:.1s} .d2{transition-delay:.2s} .d3{transition-delay:.3s}
        .d4{transition-delay:.35s} .d5{transition-delay:.45s} .d6{transition-delay:.55s}

        /* NAV */
        .nav {
          position:fixed; top:0; left:0; right:0; z-index:200;
          padding:1.25rem 3.5rem;
          display:flex; justify-content:space-between; align-items:center;
          transition:all .35s ease;
        }
        .nav.sc {
          background:rgba(${parseInt(colors.primary.slice(1,3),16)}, ${parseInt(colors.primary.slice(3,5),16)}, ${parseInt(colors.primary.slice(5,7),16)}, 0.95);
          backdrop-filter:blur(20px);
          padding:.85rem 3.5rem;
          box-shadow:0 2px 24px rgba(0,0,0,.18);
        }
        .nav-brand {
          font-family:'Syne',sans-serif; font-size:1.25rem; font-weight:800;
          color:#fff; letter-spacing:-.3px; display:flex; align-items:center; gap:.5rem;
        }
        .nav-dot { width:8px; height:8px; background:${colors.accent}; border-radius:50%; }
        .nav-links { display:flex; gap:2.5rem; align-items:center; }
        .nav-links a {
          font-size:.82rem; font-weight:500; color:rgba(255,255,255,.8);
          letter-spacing:.3px; transition:color .2s;
        }
        .nav-links a:hover { color:#fff; }
        .nav-btn {
          padding:.55rem 1.35rem;
          background:${colors.accent}; color:#1a2818;
          border-radius:3px; font-size:.72rem; font-weight:700;
          letter-spacing:1.5px; text-transform:uppercase;
          transition:all .2s;
        }
        .nav-btn:hover { background:#fff; transform:translateY(-1px); }
        .burger { display:none; flex-direction:column; gap:5px; cursor:pointer; padding:4px; }
        .burger span { width:22px; height:2px; background:#fff; border-radius:2px; display:block; }

        /* MOBILE MENU */
        .mmenu {
          position:fixed; inset:0; z-index:300;
          background:${colors.primary};
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2.5rem;
          transform:translateX(${menuOpen ? '0' : '101%'}); transition:transform .35s ease;
        }
        .mmenu a { font-family:'Playfair Display',serif; font-size:2rem; font-style:italic; color:#fff; }
        .mmenu-x {
          position:absolute; top:1.5rem; right:1.5rem;
          width:40px; height:40px; border-radius:50%;
          background:rgba(255,255,255,.12); color:#fff;
          display:grid; place-items:center; font-size:1.2rem;
        }

        /* HERO */
        .hero {
          min-height:100vh; position:relative;
          background:url('${BIZ.gallery[0]}') center/cover no-repeat;
          display:flex; align-items:center;
          overflow:hidden;
        }
        .hero::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(110deg, rgba(${parseInt(colors.primary.slice(1,3),16)}, ${parseInt(colors.primary.slice(3,5),16)}, ${parseInt(colors.primary.slice(5,7),16)}, 0.82) 0%, rgba(${parseInt(colors.primary.slice(1,3),16)}, ${parseInt(colors.primary.slice(3,5),16)}, ${parseInt(colors.primary.slice(5,7),16)}, 0.5) 55%, rgba(${parseInt(colors.primary.slice(1,3),16)}, ${parseInt(colors.primary.slice(3,5),16)}, ${parseInt(colors.primary.slice(5,7),16)}, 0.2) 100%);
        }
        .hero-inner {
          position:relative; z-index:2;
          max-width:800px; padding:0 3.5rem;
        }
        .hero-eye {
          display:inline-flex; align-items:center; gap:.75rem;
          font-size:.7rem; font-weight:700; letter-spacing:4px; text-transform:uppercase;
          color:${colors.accent}; margin-bottom:1.5rem;
        }
        .hero-eye::before { content:''; width:30px; height:1.5px; background:${colors.accent}; }
        .hero h1 {
          font-family:'Playfair Display',serif;
          font-size:clamp(3.8rem,9.5vw,7.5rem); font-weight:400; line-height:.96;
          color:#fff; margin-bottom:.4rem;
        }
        .hero h1 em {
          font-style:italic; color:${colors.accent}; display:block;
        }
        .hero-sub {
          font-size:clamp(.95rem,2.2vw,1.28rem); line-height:1.7;
          color:rgba(255,255,255,.88); max-width:540px; margin:2rem 0 3rem;
        }
        .hero-ctas { display:flex; gap:1.2rem; flex-wrap:wrap; }
        .btn {
          padding:1.05rem 2.6rem;
          font-size:.72rem; font-weight:700; letter-spacing:2.2px; text-transform:uppercase;
          border-radius:3px; transition:all .28s; display:inline-block;
        }
        .btn-p { background:${colors.accent}; color:#1a2818; }
        .btn-p:hover { background:#fff; transform:translateY(-2px); box-shadow:0 12px 28px rgba(0,0,0,.2); }
        .btn-s { background:transparent; color:#fff; border:1.5px solid rgba(255,255,255,.5); }
        .btn-s:hover { background:#fff; color:#1a2818; border-color:#fff; }

        /* STATS */
        .stats {
          background:${colors.primary};
          display:grid; grid-template-columns:repeat(4,1fr);
          padding:4.5rem 3.5rem;
        }
        .stat {
          padding:1.8rem; text-align:center;
          border-right:1px solid rgba(255,255,255,.1);
        }
        .stat:last-child { border-right:none; }
        .stat-n {
          font-family:'Playfair Display',serif;
          font-size:clamp(2.2rem,5.5vw,4rem); color:${colors.accent};
          display:block; line-height:1; margin-bottom:.5rem;
        }
        .stat-l { font-size:.85rem; color:rgba(255,255,255,.82); }

        /* SECTIONS */
        .sec { padding:8rem 3.5rem; background:#faf7f2; }
        .sec-dark { background:${colors.primary}; color:#fff; }
        .sec-g { max-width:1280px; margin:0 auto; }
        .sec-h { text-align:center; max-width:700px; margin:0 auto 4rem; }
        .tag {
          font-size:.65rem; font-weight:700; letter-spacing:4px; text-transform:uppercase;
          color:${colors.primary};
          display:flex; align-items:center; justify-content:center; gap:.75rem;
          margin-bottom:1.5rem;
        }
        .sec-dark .tag { color:${colors.accent}; }
        .tag::before, .tag::after { content:''; width:32px; height:1.5px; background:currentColor; }
        .h2 {
          font-family:'Playfair Display',serif;
          font-size:clamp(2.5rem,5.5vw,4rem); font-weight:400; line-height:1.08;
          margin-bottom:1.5rem;
        }
        .h2 em { font-style:italic; color:${colors.accent}; }

        /* SERVICES */
        .srv-g { display:grid; grid-template-columns:repeat(3,1fr); gap:2rem; margin-top:3rem; }
        .srv {
          padding:2.8rem; background:#fff;
          border-radius:12px; border:1px solid #ddd;
          transition:all .32s cubic-bezier(.34,1.56,.64,1);
        }
        .srv:hover { transform:translateY(-8px); box-shadow:0 20px 50px rgba(0,0,0,.12); }
        .srv-i { font-size:3rem; display:block; margin-bottom:1rem; }
        .srv h3 {
          font-family:'Playfair Display',serif;
          font-size:1.5rem; color:${colors.primary}; margin-bottom:1rem;
        }
        .srv p { font-size:.9rem; line-height:1.7; color:#666; }

        /* TESTIMONIALS */
        .test-g { display:grid; grid-template-columns:repeat(3,1fr); gap:2rem; margin-top:3rem; }
        .test {
          padding:2.5rem; background:rgba(255,255,255,.08);
          border:1px solid rgba(255,255,255,.12); border-radius:12px;
          transition:all .25s;
        }
        .test:hover { background:rgba(255,255,255,.12); transform:translateY(-4px); }
        .test-st { font-size:1.1rem; color:${colors.accent}; letter-spacing:3px; margin-bottom:1.25rem; }
        .test-t {
          font-family:'Playfair Display',serif; font-style:italic;
          font-size:1.05rem; line-height:1.7; color:rgba(255,255,255,.95); margin-bottom:1.5rem;
        }
        .test-a { display:flex; gap:1rem; align-items:center; }
        .test-av {
          width:45px; height:45px; border-radius:50%;
          background:${colors.accent}; color:${colors.primary};
          display:flex; align-items:center; justify-content:center;
          font-family:'Syne',sans-serif; font-weight:800; font-size:.9rem;
        }
        .test-n { font-weight:700; color:#fff; font-size:.9rem; }
        .test-r { font-size:.75rem; color:${colors.accent}; margin-top:.1rem; }

        /* CONTACT */
        .contact-g { display:grid; grid-template-columns:1fr 1fr; gap:5rem; align-items:start; margin-top:3rem; }
        .ci { display:flex; gap:1.25rem; align-items:flex-start; margin-bottom:2rem; }
        .ci-i {
          width:48px; height:48px; border-radius:8px;
          background:${colors.primary}; color:#fff;
          display:flex; align-items:center; justify-content:center; font-size:1.3rem;
        }
        .ci-l { font-size:.65rem; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:${colors.primary}; margin-bottom:.3rem; }
        .ci-v { font-size:.95rem; color:#1a2818; font-weight:500; }
        .wa-btn {
          display:inline-flex; align-items:center; gap:.75rem;
          padding:1.1rem 2rem; background:#25D366; color:#fff;
          border-radius:8px; font-size:.78rem; font-weight:700; text-transform:uppercase;
          transition:all .3s; margin-top:1.5rem;
        }
        .wa-btn:hover { background:#1db954; transform:translateY(-2px); box-shadow:0 12px 30px rgba(37,211,102,.4); }

        .fcard {
          background:#fff; border-radius:12px; padding:3rem;
          box-shadow:0 10px 50px rgba(0,0,0,.08); border:1px solid #ddd;
        }
        .fcard h3 { font-family:'Playfair Display',serif; font-size:1.5rem; color:#1a2818; margin-bottom:.5rem; }
        .fcard-sub { font-size:.85rem; color:#888; margin-bottom:2rem; }
        .fgrid { display:grid; grid-template-columns:1fr 1fr; gap:1.25rem; }
        .ffield { display:flex; flex-direction:column; gap:.4rem; }
        .ffield label { font-size:.65rem; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:${colors.primary}; }
        .ffield input, .ffield select, .ffield textarea {
          padding:.9rem 1rem; background:#f8f7f4;
          border:1.5px solid transparent; border-radius:8px;
          font-size:.9rem; color:#1a2818; transition:all .2s; outline:none;
        }
        .ffield input:focus, .ffield select:focus, .ffield textarea:focus {
          border-color:${colors.primary}; background:#fff;
          box-shadow:0 0 0 4px rgba(${parseInt(colors.primary.slice(1,3),16)}, ${parseInt(colors.primary.slice(3,5),16)}, ${parseInt(colors.primary.slice(5,7),16)}, 0.1);
        }
        .fsubmit {
          width:100%; padding:1.1rem; margin-top:1rem;
          background:${colors.primary}; color:#fff;
          font-size:.78rem; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          border-radius:8px; cursor:pointer; transition:all .3s;
        }
        .fsubmit:hover { background:${colors.secondary}; transform:translateY(-2px); box-shadow:0 12px 30px rgba(0,0,0,.2); }

        /* FOOTER */
        .foot {
          background:#1a2818; padding:4rem 3.5rem;
          display:flex; justify-content:space-between; align-items:center;
          flex-wrap:wrap; gap:2rem; color:#fff;
        }
        .foot-b { font-family:'Syne',sans-serif; font-size:1.2rem; font-weight:800; margin-bottom:.5rem; }
        .foot-c { font-size:.75rem; opacity:.6; }
        .foot-p { font-size:.75rem; opacity:.5; }

        /* WA FLOAT */
        .waf {
          position:fixed; bottom:2rem; right:2rem; z-index:100;
          width:70px; height:70px; border-radius:50%;
          background:#25D366; display:flex; align-items:center; justify-content:center;
          font-size:2rem; box-shadow:0 8px 30px rgba(37,211,102,.4);
          transition:all .3s;
        }
        .waf:hover { transform:scale(1.15); box-shadow:0 12px 40px rgba(37,211,102,.6); }

        /* RESPONSIVE */
        @media(max-width:1024px) {
          .contact-g { grid-template-columns:1fr; gap:3rem; }
          .srv-g, .test-g { grid-template-columns:1fr 1fr; }
        }
        @media(max-width:768px) {
          .nav, .nav.sc { padding:.9rem 1.5rem; }
          .nav-links { display:none; }
          .burger { display:flex; }
          .sec { padding:4rem 1.5rem; }
          .hero-inner { padding:0 1.5rem; }
          .srv-g, .test-g, .fgrid { grid-template-columns:1fr; }
          .stats { grid-template-columns:1fr 1fr; }
          .foot { flex-direction:column; text-align:center; }
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav ${scrolled ? 'sc' : ''}`}>
        <div className="nav-brand">{BIZ.name.split(' ')[0]}<div className="nav-dot" /></div>
        <div className="nav-links">
          <a href="#servicios">Servicios</a>
          <a href="#testimonios">Testimonios</a>
          <a href="#contacto" className="nav-btn">Contacto</a>
        </div>
        <button className="burger" onClick={() => setMenuOpen(true)}>
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className="mmenu">
        <button className="mmenu-x" onClick={() => setMenuOpen(false)}>×</button>
        <a href="#servicios" onClick={() => setMenuOpen(false)}>Servicios</a>
        <a href="#testimonios" onClick={() => setMenuOpen(false)}>Testimonios</a>
        <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
      </div>

      {/* HERO */}
      <header className="hero">
        <div className="hero-inner">
          <div className="hero-eye">{BIZ.city}</div>
          <h1 className="a d1">{BIZ.headline}<em>{BIZ.headline2}</em></h1>
          <p className="hero-sub a d2">{BIZ.sub}</p>
          <div className="hero-ctas a d3">
            <a href="#contacto" className="btn btn-p">Solicitar presupuesto</a>
            <a href="#servicios" className="btn btn-s">Ver servicios</a>
          </div>
        </div>
      </header>

      {/* STATS */}
      <div className="stats">
        <div className="stat a d1"><span className="stat-n">+{BIZ.years}</span><div className="stat-l">años de experiencia</div></div>
        <div className="stat a d2"><span className="stat-n">+1000</span><div className="stat-l">clientes satisfechos</div></div>
        <div className="stat a d3"><span className="stat-n">99%</span><div className="stat-l">tasa de recomendación</div></div>
        <div className="stat a d4"><span className="stat-n">24h</span><div className="stat-l">respuesta garantizada</div></div>
      </div>

      {/* SERVICES */}
      <section className="sec sec-dark">
        <div className="sec-g">
          <div className="sec-h">
            <div className="tag">Lo que hacemos</div>
            <h2 className="h2">Nuestros <em>servicios</em></h2>
          </div>
          <div className="srv-g" id="servicios">
            {BIZ.services.map((s: any, i: number) => (
              <div key={i} className={`srv a d${i+1}`}>
                <span className="srv-i">{s.icon}</span>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="sec sec-dark" id="testimonios">
        <div className="sec-g">
          <div className="sec-h">
            <div className="tag">Nuestros clientes</div>
            <h2 className="h2">Ellos ya <em>confían</em> en nosotros</h2>
          </div>
          <div className="test-g">
            {BIZ.testimonials.map((t: any, i: number) => (
              <div key={i} className={`test a d${i+1}`}>
                <div className="test-st">{'⭐'.repeat(t.stars)}</div>
                <p className="test-t">"{t.text}"</p>
                <div className="test-a">
                  <div className="test-av">{t.name[0]}</div>
                  <div>
                    <div className="test-n">{t.name}</div>
                    <div className="test-r">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="sec" id="contacto">
        <div className="sec-g">
          <div className="contact-g">
            <div className="al">
              <div className="tag">Hablemos</div>
              <h2 className="h2">Cuéntanos tu <em>proyecto</em></h2>
              <div>
                <div className="ci">
                  <div className="ci-i">📞</div>
                  <div><div className="ci-l">Teléfono / WhatsApp</div><div className="ci-v">{BIZ.phone}</div></div>
                </div>
                <div className="ci">
                  <div className="ci-i">✉️</div>
                  <div><div className="ci-l">Email</div><div className="ci-v">{BIZ.email}</div></div>
                </div>
                <div className="ci">
                  <div className="ci-i">📍</div>
                  <div><div className="ci-l">Ubicación</div><div className="ci-v">{BIZ.city}</div></div>
                </div>
              </div>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="wa-btn">💬 Escribir por WhatsApp</a>
            </div>
            <div className="ar">
              <div className="fcard">
                {formSent ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <span style={{ fontSize: '3rem' }}>✨</span>
                    <h3>¡Mensaje recibido!</h3>
                    <p>{BIZ.name} te responderá pronto.</p>
                  </div>
                ) : (
                  <>
                    <h3>Solicitar presupuesto</h3>
                    <p className="fcard-sub">Gratis y sin compromiso</p>
                    <form onSubmit={e => { e.preventDefault(); setFormSent(true) }}>
                      <div className="fgrid">
                        <div className="ffield"><label>Nombre</label><input type="text" placeholder="Tu nombre" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
                        <div className="ffield"><label>Teléfono</label><input type="tel" placeholder="+34 600 000 000" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                        <div className="ffield" style={{ gridColumn: '1/-1' }}><label>Email</label><input type="email" placeholder="tu@email.com" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                        <div className="ffield" style={{ gridColumn: '1/-1' }}><label>Mensaje</label><textarea placeholder="Cuéntanos tu proyecto…" rows={3} required value={form.msg} onChange={e => setForm({...form, msg: e.target.value})}></textarea></div>
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

      {/* FOOTER */}
      <footer className="foot">
        <div>
          <div className="foot-b">{BIZ.name.split(' ')[0]}</div>
          <div className="foot-c">© {new Date().getFullYear()} · {BIZ.city}</div>
        </div>
        <div className="foot-p">Creado con <strong style={{ color: colors.accent }}>Clientos</strong></div>
      </footer>

      {/* WA FLOAT */}
      <a href={wa} target="_blank" rel="noopener noreferrer" className="waf">💬</a>
    </>
  )
}
