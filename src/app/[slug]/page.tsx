'use client'
import { useEffect, useState } from 'react'

const BIZ = {
  name: 'Jardines Mediterráneos',
  trade: 'Jardinería profesional',
  phone: '+34600123456',
  email: 'hola@jardinesmediterraneos.es',
  city: 'Madrid',
  address: 'C/ Olivos, 12, Madrid',
  schedule: 'Lunes a viernes · 9:00–18:00',
  headline: 'Jardines que',
  headline2: 'enamoran.',
  sub: 'Diseño, construcción y mantenimiento de jardines en Madrid. Equipo propio, presupuesto claro, sin sorpresas.',
  about: 'Somos un equipo de jardineros apasionados que llevamos más de 12 años creando espacios verdes únicos en Madrid. Cada jardín es diferente, cada cliente también. Por eso escuchamos primero y diseñamos después.',
  years: '12',
  waText: 'Hola, he visto vuestra web y quiero pedir presupuesto sin compromiso.',
  services: [
    {
      icon: '🌿',
      name: 'Diseño y paisajismo',
      desc: 'Proyectamos tu jardín desde cero: estudio del espacio, elección de plantas, materiales y estilo. Un jardín pensado para ti y para durar.',
      img: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
    },
    {
      icon: '🏗️',
      name: 'Obra y ejecución',
      desc: 'Transformamos el proyecto en realidad con equipo propio, sin subcontratas. Materiales de primera, trabajo limpio y plazos cumplidos.',
      img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80',
    },
    {
      icon: '✂️',
      name: 'Mantenimiento',
      desc: 'El mismo equipo que crea tu jardín lo cuida mes a mes. Poda, riego, abonados y tratamientos para que siempre esté en su mejor momento.',
      img: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=600&q=80',
    },
  ],
  gallery: [
    'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80',
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80',
    'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4e4?w=800&q=80',
    'https://images.unsplash.com/photo-1572560521827-e9d87cb8e50a?w=800&q=80',
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&q=80',
  ],
  testimonials: [
    { name: 'Carmen R.', role: 'Propietaria en Pozuelo', text: 'Transformaron nuestro jardín por completo. Puntuales, limpios y el resultado fue exactamente lo que imaginábamos, incluso mejor.', stars: 5 },
    { name: 'Bufete Martín', role: 'Empresa en Madrid Centro', text: 'Llevan el mantenimiento de nuestras terrazas hace 3 años. Siempre impecable y siempre puntuales. Los recomendamos a todos.', stars: 5 },
    { name: 'Pedro A.', role: 'Chalet en Majadahonda', text: 'Sin sorpresas en el presupuesto. El jardín quedó tal como lo imaginábamos. Muy profesionales en todo momento.', stars: 5 },
  ],
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [formSent, setFormSent] = useState(false)
  const [lb, setLb] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', msg: '' })

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
      document.querySelectorAll('.a').forEach(el => obs.observe(el))
      return () => obs.disconnect()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

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
          background:rgba(30,58,26,.95);
          backdrop-filter:blur(20px);
          padding:.85rem 3.5rem;
          box-shadow:0 2px 24px rgba(0,0,0,.18);
        }
        .nav-brand {
          font-family:'Syne',sans-serif; font-size:1.25rem; font-weight:800;
          color:#fff; letter-spacing:-.3px; display:flex; align-items:center; gap:.5rem;
        }
        .nav-dot { width:8px; height:8px; background:#c8a96e; border-radius:50%; }
        .nav-links { display:flex; gap:2.5rem; align-items:center; }
        .nav-links a {
          font-size:.82rem; font-weight:500; color:rgba(255,255,255,.8);
          letter-spacing:.3px; transition:color .2s;
        }
        .nav-links a:hover { color:#fff; }
        .nav-btn {
          padding:.55rem 1.35rem;
          background:#c8a96e; color:#1a2818;
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
          background:#1e3a1a;
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2.5rem;
          transform:translateX(101%); transition:transform .35s ease;
        }
        .mmenu.open { transform:translateX(0); }
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
          background:linear-gradient(110deg, rgba(15,35,12,.82) 0%, rgba(15,35,12,.5) 55%, rgba(15,35,12,.2) 100%);
        }
        .hero-inner {
          position:relative; z-index:2;
          padding:0 3.5rem; max-width:860px; margin-top:5rem;
        }
        .hero-eyebrow {
          display:inline-flex; align-items:center; gap:.65rem;
          font-size:.68rem; font-weight:700; letter-spacing:4px; text-transform:uppercase;
          color:#c8a96e; margin-bottom:1.75rem;
          animation:fu .8s ease .3s both;
        }
        .hero-eyebrow-bar { width:30px; height:1px; background:#c8a96e; }
        .hero h1 {
          font-family:'Playfair Display',serif;
          font-size:clamp(3.2rem,7.5vw,6.5rem);
          font-weight:400; line-height:.95; letter-spacing:-2px;
          color:#fff; margin-bottom:.4rem;
          animation:fu .9s ease .5s both;
        }
        .hero h1 em { font-style:italic; color:#c8a96e; display:block; }
        .hero-sub {
          font-size:clamp(.9rem,1.8vw,1.1rem); line-height:1.75;
          color:rgba(255,255,255,.82); max-width:520px;
          margin:1.5rem 0 2.75rem;
          animation:fu .9s ease .7s both;
        }
        .hero-ctas { display:flex; gap:1rem; flex-wrap:wrap; animation:fu .9s ease .9s both; }
        .btn-g {
          padding:.92rem 2.2rem;
          background:#c8a96e; color:#1a2818;
          font-size:.75rem; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          border-radius:3px; transition:all .25s; display:inline-block;
        }
        .btn-g:hover { background:#fff; transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,.3); }
        .btn-o {
          padding:.92rem 2.2rem;
          background:transparent; color:#fff;
          border:1.5px solid rgba(255,255,255,.55);
          font-size:.75rem; font-weight:700; letter-spacing:2px; text-transform:uppercase;
          border-radius:3px; transition:all .25s; display:inline-block;
        }
        .btn-o:hover { background:#fff; color:#1a2818; transform:translateY(-3px); }
        .hero-scroll {
          position:absolute; bottom:2rem; left:50%; transform:translateX(-50%);
          z-index:2; display:flex; flex-direction:column; align-items:center; gap:.5rem;
          animation:bounce 2.5s ease infinite;
        }
        .hero-scroll span { font-size:.6rem; letter-spacing:3px; text-transform:uppercase; color:rgba(255,255,255,.45); }
        .hero-scroll-line { width:1px; height:42px; background:linear-gradient(to bottom, rgba(255,255,255,.5), transparent); }
        @keyframes fu { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }
        @keyframes bounce { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(10px)} }

        /* STATS */
        .stats {
          background:#2d5a27;
          display:grid; grid-template-columns:repeat(4,1fr);
        }
        .stat {
          padding:2.75rem 1.5rem; text-align:center;
          border-right:1px solid rgba(255,255,255,.1);
          transition:background .2s;
        }
        .stat:last-child { border-right:none; }
        .stat:hover { background:rgba(255,255,255,.06); }
        .stat-n {
          font-family:'Playfair Display',serif; font-size:2.8rem;
          color:#c8a96e; display:block; line-height:1; margin-bottom:.4rem;
        }
        .stat-l { font-size:.78rem; color:rgba(255,255,255,.65); }

        /* ABOUT */
        .about { background:#faf7f2; padding:8rem 3.5rem; }
        .about-grid { max-width:1180px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr; gap:6rem; align-items:center; }
        .stag {
          font-size:.65rem; font-weight:700; letter-spacing:4px; text-transform:uppercase;
          color:#2d5a27; display:flex; align-items:center; gap:.65rem; margin-bottom:1.2rem;
        }
        .stag::before { content:''; width:28px; height:1px; background:#2d5a27; }
        .h2 {
          font-family:'Playfair Display',serif;
          font-size:clamp(2rem,4vw,3.2rem); font-weight:400;
          line-height:1.1; letter-spacing:-.5px; color:#1a2818; margin-bottom:1.25rem;
        }
        .h2 em { font-style:italic; color:#2d5a27; }
        .body { font-size:.95rem; line-height:1.8; color:#4a5548; margin-bottom:1.25rem; }
        .chips { display:flex; flex-wrap:wrap; gap:.6rem; margin-top:1.5rem; }
        .chip {
          display:flex; align-items:center; gap:.5rem;
          padding:.55rem .95rem;
          background:#fff; border:1px solid #ddd8cc; border-radius:4px;
          font-size:.82rem; font-weight:500; color:#2d5a27;
          transition:all .2s;
        }
        .chip:hover { border-color:#2d5a27; transform:translateY(-2px); }
        .about-img-wrap { position:relative; padding:0 1.5rem 1.5rem 0; }
        .about-img {
          width:100%; aspect-ratio:3/4; object-fit:cover;
          border-radius:6px; display:block;
          box-shadow:0 20px 60px rgba(0,0,0,.15);
        }
        .about-badge {
          position:absolute; bottom:-1.5rem; left:-1rem;
          background:#2d5a27; border-radius:6px; padding:1.2rem 1.5rem;
          text-align:center; box-shadow:0 12px 32px rgba(45,90,39,.4);
        }
        .about-badge-n { font-family:'Playfair Display',serif; font-size:2.4rem; color:#c8a96e; display:block; line-height:1; }
        .about-badge-l { font-size:.7rem; color:rgba(255,255,255,.7); margin-top:.2rem; }

        /* ─── SERVICE CARDS ─── */
        .services { background:#fff; padding:8rem 3.5rem; }
        .services-cont { max-width:1180px; margin:0 auto; }
        .section-head { text-align:center; max-width:580px; margin:0 auto 3.5rem; }
        .section-head .stag { justify-content:center; }
        .section-head .stag::before { display:none; }
        .cards-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
        .scard {
          background:#faf7f2; border-radius:10px; overflow:hidden;
          border:1px solid #e8dfd0;
          transition:transform .3s ease, box-shadow .3s ease;
          display:flex; flex-direction:column;
        }
        .scard:hover { transform:translateY(-6px); box-shadow:0 16px 48px rgba(45,90,39,.15); }
        .scard-img { width:100%; height:220px; object-fit:cover; transition:transform .5s ease; }
        .scard:hover .scard-img { transform:scale(1.04); }
        .scard-img-wrap { overflow:hidden; position:relative; }
        .scard-img-wrap::after {
          content:''; position:absolute; bottom:0; left:0; right:0; height:60px;
          background:linear-gradient(to bottom, transparent, #faf7f2);
        }
        .scard-body { padding:1.5rem; flex:1; display:flex; flex-direction:column; }
        .scard-icon { font-size:1.75rem; margin-bottom:.75rem; display:block; }
        .scard-name {
          font-family:'Playfair Display',serif; font-size:1.35rem;
          color:#1a2818; margin-bottom:.65rem; font-weight:600;
        }
        .scard-desc { font-size:.875rem; line-height:1.7; color:#4a5548; flex:1; margin-bottom:1.25rem; }
        .scard-btn {
          display:inline-flex; align-items:center; gap:.5rem;
          padding:.65rem 1.25rem;
          background:#2d5a27; color:#fff;
          border-radius:4px; font-size:.78rem; font-weight:700;
          letter-spacing:1px; text-transform:uppercase;
          transition:all .2s; align-self:flex-start;
        }
        .scard-btn:hover { background:#3d7a35; transform:translateY(-2px); box-shadow:0 6px 20px rgba(45,90,39,.3); }

        /* BANNER 1 */
        .banner1 {
          background:#2d5a27;
          padding:5rem 3.5rem;
          display:flex; justify-content:space-between; align-items:center;
          gap:3rem; flex-wrap:wrap;
        }
        .banner1 h2 {
          font-family:'Playfair Display',serif;
          font-size:clamp(1.8rem,3.5vw,2.6rem); font-style:italic;
          color:#fff; margin-bottom:.5rem;
        }
        .banner1 p { font-size:.95rem; color:#c8a96e; max-width:480px; }

        /* GALLERY */
        .gallery { background:#f2ede4; padding:8rem 3.5rem; }
        .gallery-cont { max-width:1180px; margin:0 auto; }
        .gallery-head { text-align:center; max-width:560px; margin:0 auto 3rem; }
        .gallery-head .stag { justify-content:center; }
        .gallery-head .stag::before { display:none; }
        .g-grid {
          display:grid;
          grid-template-columns:2fr 1fr 1fr;
          grid-template-rows:260px 260px;
          gap:8px;
        }
        .g-item { overflow:hidden; border-radius:5px; cursor:pointer; position:relative; }
        .g-item:first-child { grid-row:1/3; }
        .g-item img { width:100%; height:100%; object-fit:cover; transition:transform .5s ease; }
        .g-item:hover img { transform:scale(1.06); }
        .g-overlay {
          position:absolute; inset:0; background:rgba(30,60,25,.45);
          display:grid; place-items:center; opacity:0; transition:opacity .3s;
        }
        .g-item:hover .g-overlay { opacity:1; }
        .g-overlay span {
          color:#fff; font-size:.72rem; font-weight:700;
          letter-spacing:2px; text-transform:uppercase;
          border:1px solid rgba(255,255,255,.6); padding:.4rem .9rem; border-radius:3px;
        }

        /* LIGHTBOX */
        .lb {
          position:fixed; inset:0; z-index:500;
          background:rgba(0,0,0,.94);
          display:flex; align-items:center; justify-content:center; padding:2rem;
          animation:fin .2s ease;
        }
        @keyframes fin { from{opacity:0} to{opacity:1} }
        .lb img { max-width:90vw; max-height:85vh; object-fit:contain; border-radius:4px; }
        .lb-x {
          position:fixed; top:1.5rem; right:1.5rem;
          width:44px; height:44px; border-radius:50%;
          background:rgba(255,255,255,.15); color:#fff;
          display:grid; place-items:center; font-size:1.25rem; cursor:pointer;
          transition:background .2s;
        }
        .lb-x:hover { background:rgba(255,255,255,.3); }

        /* TESTIMONIALS */
        .testi { background:#2d5a27; padding:8rem 3.5rem; }
        .testi-cont { max-width:1180px; margin:0 auto; }
        .testi-head { text-align:center; margin-bottom:3.5rem; }
        .testi-head .stag { justify-content:center; color:#c8a96e; }
        .testi-head .stag::before { background:#c8a96e; }
        .testi-head .h2 { color:#fff; }
        .t-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
        .tcard {
          background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12);
          border-radius:10px; padding:2rem;
          transition:all .25s;
        }
        .tcard:hover { background:rgba(255,255,255,.12); transform:translateY(-4px); }
        .tcard-stars { color:#c8a96e; font-size:1.05rem; letter-spacing:3px; margin-bottom:1.25rem; display:block; }
        .tcard-text {
          font-family:'Playfair Display',serif; font-style:italic;
          font-size:1.08rem; line-height:1.65; color:rgba(255,255,255,.92);
          margin-bottom:1.5rem;
        }
        .tcard-auth { display:flex; gap:.75rem; align-items:center; }
        .tcard-av {
          width:40px; height:40px; border-radius:50%;
          background:#c8a96e; color:#1a2818;
          display:grid; place-items:center;
          font-family:'Syne',sans-serif; font-weight:800; font-size:.85rem; flex-shrink:0;
        }
        .tcard-name { font-weight:700; font-size:.85rem; color:#fff; }
        .tcard-role { font-size:.75rem; color:#c8a96e; margin-top:.1rem; }

        /* BANNER 2 */
        .banner2 {
          position:relative; overflow:hidden;
          background:url('${BIZ.gallery[3]}') center/cover no-repeat;
          padding:7rem 3.5rem; text-align:center;
        }
        .banner2::before {
          content:''; position:absolute; inset:0;
          background:rgba(15,35,12,.78);
        }
        .banner2-inner { position:relative; z-index:1; max-width:700px; margin:0 auto; }
        .banner2 h2 {
          font-family:'Playfair Display',serif;
          font-size:clamp(2rem,4vw,3rem); font-style:italic;
          color:#fff; margin-bottom:1rem;
        }
        .banner2 p { font-size:.95rem; color:#c8a96e; margin-bottom:2rem; }

        /* CONTACT */
        .contact { background:#faf7f2; padding:8rem 3.5rem; }
        .contact-cont { max-width:1180px; margin:0 auto; display:grid; grid-template-columns:1fr 1.15fr; gap:5rem; align-items:start; }
        .contact-body { font-size:.95rem; line-height:1.8; color:#4a5548; margin-bottom:2rem; }
        .cinfo { display:flex; flex-direction:column; gap:1rem; margin-bottom:2rem; }
        .ci { display:flex; gap:.85rem; align-items:flex-start; }
        .ci-ico {
          width:40px; height:40px; border-radius:6px; background:#2d5a27;
          color:#fff; display:grid; place-items:center; font-size:1rem; flex-shrink:0;
        }
        .ci-lbl { font-size:.65rem; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:#2d5a27; margin-bottom:.15rem; }
        .ci-val { font-size:.9rem; color:#1a2818; font-weight:500; }
        .wa-btn {
          display:inline-flex; align-items:center; gap:.65rem;
          padding:1rem 1.75rem; background:#25D366; color:#fff;
          border-radius:4px; font-size:.78rem; font-weight:700;
          letter-spacing:1.5px; text-transform:uppercase; transition:all .25s;
        }
        .wa-btn:hover { background:#1db954; transform:translateY(-2px); box-shadow:0 8px 24px rgba(37,211,102,.4); }

        /* FORM CARD */
        .fcard {
          background:#fff; border-radius:12px; padding:2.5rem;
          box-shadow:0 8px 40px rgba(0,0,0,.08);
          border:1px solid #e8dfd0;
        }
        .fcard h3 {
          font-family:'Playfair Display',serif; font-size:1.4rem;
          color:#1a2818; margin-bottom:.3rem;
        }
        .fcard-sub { font-size:.82rem; color:#6b7b68; margin-bottom:1.75rem; }
        .fg { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
        .fg .full { grid-column:1/-1; }
        .ff { display:flex; flex-direction:column; gap:.35rem; }
        .ff label {
          font-size:.64rem; font-weight:700; letter-spacing:1.5px;
          text-transform:uppercase; color:#2d5a27;
        }
        .ff input, .ff select, .ff textarea {
          padding:.72rem .9rem;
          background:#f0f5ee; border:1.5px solid transparent;
          border-radius:6px; font-family:'Inter',sans-serif; font-size:.9rem;
          color:#1a2818; transition:all .2s; outline:none;
        }
        .ff textarea { resize:vertical; min-height:100px; }
        .ff input:focus, .ff select:focus, .ff textarea:focus {
          border-color:#2d5a27; background:#fff;
          box-shadow:0 0 0 4px rgba(45,90,39,.08);
        }
        .ff input::placeholder, .ff textarea::placeholder { color:#a8b8a5; }
        .f-submit {
          width:100%; padding:1rem; margin-top:.75rem;
          background:#2d5a27; color:#fff;
          font-family:'Inter',sans-serif; font-size:.78rem; font-weight:700;
          letter-spacing:2px; text-transform:uppercase;
          border-radius:6px; border:none; cursor:pointer;
          transition:all .25s;
        }
        .f-submit:hover { background:#3d7a35; transform:translateY(-2px); box-shadow:0 8px 24px rgba(45,90,39,.3); }
        .sent { text-align:center; padding:3rem 1rem; }
        .sent-ico { font-size:3.5rem; margin-bottom:1rem; display:block; animation:pop .5s cubic-bezier(.34,1.56,.64,1); }
        @keyframes pop { from{transform:scale(0)} to{transform:scale(1)} }
        .sent h3 { font-family:'Playfair Display',serif; font-size:1.35rem; color:#1a2818; margin-bottom:.5rem; }
        .sent p { font-size:.9rem; color:#6b7b68; }

        /* FOOTER */
        .footer {
          background:#1a2818; padding:3rem 3.5rem;
          display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;
        }
        .footer-brand {
          font-family:'Syne',sans-serif; font-size:1.1rem; font-weight:800;
          color:#fff; margin-bottom:.3rem;
        }
        .footer-brand span { color:#c8a96e; }
        .footer-copy { font-size:.75rem; color:rgba(255,255,255,.4); }
        .footer-powered { font-size:.75rem; color:rgba(255,255,255,.35); }
        .footer-powered span { color:#c8a96e; }

        /* WA FLOAT */
        .waf {
          position:fixed; bottom:2rem; right:2rem; z-index:100;
          width:60px; height:60px; border-radius:50%;
          background:#25D366; display:flex; align-items:center; justify-content:center;
          font-size:1.7rem; box-shadow:0 6px 28px rgba(37,211,102,.5);
          transition:all .25s;
          animation:wap .7s cubic-bezier(.34,1.56,.64,1) 2s both;
        }
        .waf:hover { transform:scale(1.12); box-shadow:0 12px 40px rgba(37,211,102,.6); }
        @keyframes wap { from{opacity:0;transform:scale(0)} to{opacity:1;transform:scale(1)} }
        .waf-tip {
          position:absolute; right:72px; top:50%; transform:translateY(-50%);
          background:#fff; color:#1a2818; padding:.4rem .85rem; border-radius:6px;
          font-size:.78rem; font-weight:600; white-space:nowrap;
          box-shadow:0 4px 16px rgba(0,0,0,.12);
          opacity:0; transition:opacity .2s; pointer-events:none;
        }
        .waf:hover .waf-tip { opacity:1; }

        /* MARQUEE */
        .mq { background:#2d5a27; padding:1.75rem 0; overflow:hidden; white-space:nowrap; }
        .mq-inner { display:inline-block; animation:sc 30s linear infinite; }
        .mq-inner:hover { animation-play-state:paused; }
        .mq-text {
          font-family:'Playfair Display',serif;
          font-size:1.65rem; color:#fff;
          display:inline-flex; align-items:center; gap:1.5rem;
        }
        .mq-text em { font-style:italic; color:#c8a96e; }
        .mq-sep { opacity:.25; }
        @keyframes sc { to { transform:translateX(-50%); } }

        /* RESPONSIVE */
        @media(max-width:1024px) {
          .about-grid,.contact-cont { grid-template-columns:1fr; gap:3rem; }
          .t-grid { grid-template-columns:1fr 1fr; }
          .cards-grid { grid-template-columns:1fr 1fr; }
          .g-grid { grid-template-columns:1fr 1fr; grid-template-rows:auto; }
          .g-item:first-child { grid-row:auto; }
        }
        @media(max-width:768px) {
          .nav,.nav.sc { padding:.9rem 1.25rem; }
          .nav-links { display:none; }
          .burger { display:flex; }
          .hero-inner { padding:0 1.25rem; }
          .about,.services,.testi,.contact,.gallery { padding:5rem 1.25rem; }
          .banner1,.banner2 { padding:4.5rem 1.25rem; }
          .stats { grid-template-columns:1fr 1fr; }
          .cards-grid { grid-template-columns:1fr; }
          .t-grid { grid-template-columns:1fr; }
          .g-grid { grid-template-columns:1fr 1fr; }
          .fg { grid-template-columns:1fr; }
          .hero-ctas { flex-direction:column; }
          .banner1 { flex-direction:column; text-align:center; }
          .footer { flex-direction:column; text-align:center; padding:2.5rem 1.25rem; }
        }
        @media(max-width:480px) {
          .g-grid { grid-template-columns:1fr; }
          .stats { grid-template-columns:1fr 1fr; }
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav ${scrolled ? 'sc' : ''}`}>
        <div className="nav-brand">{BIZ.name.split(' ')[0]}<span className="nav-dot" /></div>
        <div className="nav-links">
          <a href="#servicios">Servicios</a>
          <a href="#galeria">Galería</a>
          <a href="#testimonios">Clientes</a>
          <a href="#contacto" className="nav-btn">Presupuesto gratis</a>
        </div>
        <div className="burger" onClick={() => setMenuOpen(true)}>
          <span/><span/><span/>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mmenu ${menuOpen ? 'open' : ''}`}>
        <button className="mmenu-x" onClick={() => setMenuOpen(false)}>×</button>
        {['#servicios:Servicios','#galeria:Galería','#testimonios:Clientes','#contacto:Contacto'].map(x => {
          const [href, label] = x.split(':')
          return <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
        })}
      </div>

      {/* HERO */}
      <header className="hero">
        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-bar" />
            {BIZ.trade} · {BIZ.city}
          </div>
          <h1>
            {BIZ.headline}
            <em>{BIZ.headline2}</em>
          </h1>
          <p className="hero-sub">{BIZ.sub}</p>
          <div className="hero-ctas">
            <a href="#contacto" className="btn-g">Solicitar presupuesto gratis</a>
            <a href="#servicios" className="btn-o">Ver servicios</a>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          <span>Scroll</span>
        </div>
      </header>

      {/* STATS */}
      <div className="stats">
        {[
          { n: `+${BIZ.years}`, l: 'años de experiencia' },
          { n: '+200', l: 'jardines creados' },
          { n: '98%', l: 'clientes satisfechos' },
          { n: '24h', l: 'respuesta garantizada' },
        ].map((s, i) => (
          <div key={i} className={`stat a d${i + 1}`}>
            <span className="stat-n">{s.n}</span>
            <div className="stat-l">{s.l}</div>
          </div>
        ))}
      </div>

      {/* ABOUT */}
      <section className="about" id="nosotros">
        <div className="about-grid">
          <div className="al">
            <div className="stag">Quiénes somos</div>
            <h2 className="h2">Pasión por los <em>espacios verdes</em>.</h2>
            <p className="body">{BIZ.about}</p>
            <p className="body">Trabajamos en <strong style={{color:'#2d5a27'}}>Madrid y alrededores</strong>, siempre con equipo propio, materiales de primera y el mismo trato independientemente del tamaño del jardín.</p>
            <div className="chips">
              {['👥 Equipo propio','📋 Presupuesto cerrado','🌱 Garantía incluida','🏆 +12 años de experiencia'].map(c => (
                <span key={c} className="chip">{c}</span>
              ))}
            </div>
          </div>
          <div className="ar" style={{position:'relative',paddingRight:'1.5rem',paddingBottom:'1.5rem'}}>
            <img src={BIZ.gallery[1]} alt={BIZ.name} className="about-img" loading="lazy" />
            <div className="about-badge">
              <span className="about-badge-n">+200</span>
              <div className="about-badge-l">proyectos</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES CARDS */}
      <section className="services" id="servicios">
        <div className="services-cont">
          <div className="section-head a">
            <div className="stag">Lo que hacemos</div>
            <h2 className="h2">Nuestros <em>servicios</em>.</h2>
          </div>
          <div className="cards-grid">
            {BIZ.services.map((s, i) => (
              <div key={i} className={`scard a d${i + 1}`}>
                <div className="scard-img-wrap">
                  <img src={s.img} alt={s.name} className="scard-img" loading="lazy" />
                </div>
                <div className="scard-body">
                  <span className="scard-icon">{s.icon}</span>
                  <h3 className="scard-name">{s.name}</h3>
                  <p className="scard-desc">{s.desc}</p>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="scard-btn">
                    Preguntar más →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANNER 1 */}
      <div className="banner1 a">
        <div>
          <h2>¿Tienes un jardín en mente?</h2>
          <p>Cuéntanos qué necesitas. Presupuesto sin compromiso en menos de 24 horas.</p>
        </div>
        <a href="#contacto" className="btn-g" style={{flexShrink:0}}>Pedir presupuesto gratis</a>
      </div>

      {/* GALLERY */}
      <section className="gallery" id="galeria">
        <div className="gallery-cont">
          <div className="gallery-head a">
            <div className="stag">Nuestros trabajos</div>
            <h2 className="h2">Una imagen vale <em>mil palabras</em>.</h2>
          </div>
          <div className="g-grid">
            {BIZ.gallery.map((src, i) => (
              <div key={i} className={`g-item a d${Math.min(i + 1, 6)}`} onClick={() => setLb(i)}>
                <img src={src} alt={`Trabajo ${i + 1}`} loading="lazy" />
                <div className="g-overlay"><span>Ver foto</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIGHTBOX */}
      {lb !== null && (
        <div className="lb" onClick={() => setLb(null)}>
          <button className="lb-x" onClick={() => setLb(null)}>×</button>
          <img src={BIZ.gallery[lb]} alt="" onClick={e => e.stopPropagation()} />
        </div>
      )}

      {/* MARQUEE */}
      <div className="mq">
        <div className="mq-inner">
          {[1,2].map(x => (
            <span key={x} className="mq-text">
              {BIZ.trade.toUpperCase()} <em>{BIZ.city}</em>
              <span className="mq-sep">·</span>
              CALIDAD <em>garantizada</em>
              <span className="mq-sep">·</span>
              {BIZ.years} AÑOS DE <em>experiencia</em>
              <span className="mq-sep">·</span>
              PRESUPUESTO <em>sin compromiso</em>
              <span className="mq-sep">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <section className="testi" id="testimonios">
        <div className="testi-cont">
          <div className="testi-head a">
            <div className="stag">Lo que dicen nuestros clientes</div>
            <h2 className="h2">Ellos ya <em>confían</em> en nosotros.</h2>
          </div>
          <div className="t-grid">
            {BIZ.testimonials.map((t, i) => (
              <div key={i} className={`tcard a d${i + 1}`}>
                <span className="tcard-stars">{'★'.repeat(t.stars)}</span>
                <p className="tcard-text">"{t.text}"</p>
                <div className="tcard-auth">
                  <div className="tcard-av">{t.name.charAt(0)}</div>
                  <div>
                    <div className="tcard-name">{t.name}</div>
                    <div className="tcard-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANNER 2 */}
      <div className="banner2">
        <div className="banner2-inner a">
          <h2>Tu jardín perfecto está a una llamada.</h2>
          <p>Sin letra pequeña. Sin sorpresas. Solo resultados que te van a encantar.</p>
          <a href="#contacto" className="btn-g">Solicitar presupuesto sin compromiso</a>
        </div>
      </div>

      {/* CONTACT */}
      <section className="contact" id="contacto">
        <div className="contact-cont">
          <div className="al">
            <div className="stag">Hablemos</div>
            <h2 className="h2">Cuéntanos tu <em>proyecto</em>.</h2>
            <p className="contact-body">Respondemos en menos de 24 horas. Sin compromisos. Solo nos cuentas qué necesitas y te preparamos un presupuesto detallado y gratuito.</p>
            <div className="cinfo">
              {[
                { ico: '📞', lbl: 'Teléfono / WhatsApp', val: BIZ.phone },
                { ico: '✉️', lbl: 'Email', val: BIZ.email },
                { ico: '📍', lbl: 'Dirección', val: BIZ.address },
                { ico: '🕐', lbl: 'Horario', val: BIZ.schedule },
              ].map((ci, i) => (
                <div key={i} className="ci">
                  <div className="ci-ico">{ci.ico}</div>
                  <div>
                    <div className="ci-lbl">{ci.lbl}</div>
                    <div className="ci-val">{ci.val}</div>
                  </div>
                </div>
              ))}
            </div>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="wa-btn">
              💬 Escribir por WhatsApp
            </a>
          </div>

          <div className="ar">
            <div className="fcard">
              {formSent ? (
                <div className="sent">
                  <span className="sent-ico">🌿</span>
                  <h3>¡Mensaje recibido!</h3>
                  <p>{BIZ.name} te responderá antes de 24h. ¡Muchas gracias!</p>
                </div>
              ) : (
                <>
                  <h3>Solicitar presupuesto</h3>
                  <p className="fcard-sub">Gratis y sin compromiso · Respuesta en menos de 24h</p>
                  <form onSubmit={e => { e.preventDefault(); setFormSent(true); }}>
                    <div className="fg">
                      <div className="ff">
                        <label>Nombre *</label>
                        <input type="text" placeholder="Tu nombre completo" required
                          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                      </div>
                      <div className="ff">
                        <label>Teléfono *</label>
                        <input type="tel" placeholder="+34 600 000 000" required
                          value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                      </div>
                      <div className="ff full">
                        <label>Email</label>
                        <input type="email" placeholder="tu@email.com"
                          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                      </div>
                      <div className="ff full">
                        <label>¿Qué necesitas?</label>
                        <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                          <option value="">Selecciona un servicio…</option>
                          {BIZ.services.map(s => <option key={s.name}>{s.name}</option>)}
                          <option>Otro servicio</option>
                        </select>
                      </div>
                      <div className="ff full">
                        <label>Cuéntanos tu proyecto</label>
                        <textarea
                          placeholder="Describe el espacio, lo que buscas, tamaño aproximado… Cualquier detalle nos ayuda."
                          value={form.msg} onChange={e => setForm({ ...form, msg: e.target.value })} />
                      </div>
                    </div>
                    <button type="submit" className="f-submit">Enviar solicitud →</button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <div className="footer-brand">{BIZ.name.split(' ')[0]}<span>.</span></div>
          <div className="footer-copy">© {new Date().getFullYear()} {BIZ.name} · {BIZ.city}</div>
        </div>
        <div className="footer-powered">Creado con <span>Clientos</span></div>
      </footer>

      {/* WA FLOAT */}
      <a href={wa} target="_blank" rel="noopener noreferrer" className="waf">
        💬
        <span className="waf-tip">¡Escríbenos ahora!</span>
      </a>
    </>
  )
}
