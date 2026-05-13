// src/app/landing/page.tsx
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Emprenix | Todo tu negocio en un solo lugar',
  description:
    'Gestiona clientes, citas, presupuestos, facturas y tu web profesional desde una sola plataforma. Pensado para autónomos y negocios de servicios.',
  keywords:
    'CRM autónomos, software autónomos, agenda citas, presupuestos online, facturación autónomos, web para autónomos, CRM pequeños negocios',
  openGraph: {
    title: 'Emprenix | Todo tu negocio en un solo lugar',
    description:
      'Clientes, agenda, presupuestos, facturas y web profesional. La herramienta sencilla para autónomos que quieren organizarse y vender mejor.',
    url: 'https://emprenix.com/landing',
    type: 'website',
    images: [
      {
        url: 'https://emprenix.com/emprenix-og.png',
        width: 1200,
        height: 630,
        alt: 'Emprenix - Todo tu negocio en un solo lugar',
      },
    ],
    siteName: 'Emprenix',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emprenix | Todo tu negocio en un solo lugar',
    description:
      'CRM, agenda, presupuestos, facturas y web profesional para autónomos y pequeños negocios.',
    images: ['https://emprenix.com/emprenix-og.png'],
  },
}

export default function Landing() {
  const whatsappNumber = '34XXXXXXXXXX'
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'Hola, quiero probar Emprenix para organizar mi negocio.'
  )}`

  const styles = {
    page: {
      fontFamily:
        'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#0f172a',
      background: '#f8fafc',
      margin: 0,
      overflowX: 'hidden' as const,
    },
    nav: {
      position: 'sticky' as const,
      top: 0,
      zIndex: 50,
      background: 'rgba(248,250,252,.88)',
      backdropFilter: 'blur(18px)',
      borderBottom: '1px solid rgba(15,23,42,.08)',
    },
    navInner: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontWeight: 900,
      letterSpacing: '-.04em',
      fontSize: 22,
      color: '#0f172a',
    },
    mark: {
      width: 38,
      height: 38,
      borderRadius: 12,
      background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
      display: 'grid',
      placeItems: 'center',
      boxShadow: '0 14px 28px rgba(37,99,235,.28)',
      color: '#fff',
      fontWeight: 900,
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap' as const,
      justifyContent: 'flex-end',
    },
    navLink: {
      color: '#475569',
      textDecoration: 'none',
      fontWeight: 700,
      fontSize: 14,
    },
    btnPrimary: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '13px 20px',
      borderRadius: 14,
      border: '0',
      background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
      color: '#fff',
      fontWeight: 900,
      textDecoration: 'none',
      boxShadow: '0 18px 35px rgba(37,99,235,.26)',
      cursor: 'pointer',
    },
    btnDark: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '13px 20px',
      borderRadius: 14,
      border: '1px solid rgba(255,255,255,.18)',
      background: '#0f172a',
      color: '#fff',
      fontWeight: 900,
      textDecoration: 'none',
      cursor: 'pointer',
    },
    btnSoft: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: '13px 20px',
      borderRadius: 14,
      border: '1px solid rgba(15,23,42,.12)',
      background: '#fff',
      color: '#0f172a',
      fontWeight: 900,
      textDecoration: 'none',
      cursor: 'pointer',
    },
    hero: {
      position: 'relative' as const,
      overflow: 'hidden',
      background:
        'radial-gradient(circle at 15% 10%, rgba(37,99,235,.25), transparent 30%), radial-gradient(circle at 85% 0%, rgba(16,185,129,.18), transparent 28%), linear-gradient(180deg,#ffffff 0%,#eff6ff 100%)',
    },
    heroInner: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '86px 20px 70px',
      display: 'grid',
      gridTemplateColumns: '1.05fr .95fr',
      gap: 42,
      alignItems: 'center',
    },
    pill: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      borderRadius: 999,
      background: '#dbeafe',
      color: '#1d4ed8',
      fontSize: 13,
      fontWeight: 900,
      marginBottom: 20,
    },
    h1: {
      fontSize: 'clamp(42px,7vw,76px)',
      lineHeight: '.92',
      letterSpacing: '-.075em',
      margin: '0 0 22px',
      color: '#0f172a',
      fontWeight: 950,
    },
    lead: {
      fontSize: 'clamp(18px,2vw,22px)',
      lineHeight: 1.55,
      color: '#475569',
      margin: '0 0 28px',
      maxWidth: 650,
      fontWeight: 550,
    },
    heroActions: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap' as const,
      marginBottom: 20,
      justifyContent: 'center',
    },
    proof: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap' as const,
      color: '#64748b',
      fontSize: 14,
      fontWeight: 800,
    },
    appMock: {
      background: '#0f172a',
      borderRadius: 28,
      padding: 16,
      boxShadow: '0 35px 80px rgba(15,23,42,.28)',
      border: '1px solid rgba(255,255,255,.12)',
      transform: 'rotate(1.5deg)',
    },
    mockTop: {
      background: '#111827',
      borderRadius: 18,
      padding: 14,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
      color: '#fff',
      fontWeight: 900,
    },
    mockBody: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
    },
    mockCard: {
      background: '#fff',
      borderRadius: 18,
      padding: 18,
      minHeight: 110,
    },
    mockLabel: {
      color: '#64748b',
      fontSize: 12,
      fontWeight: 900,
      textTransform: 'uppercase' as const,
      letterSpacing: '.08em',
      marginBottom: 8,
    },
    mockValue: {
      color: '#0f172a',
      fontSize: 28,
      fontWeight: 950,
      letterSpacing: '-.05em',
    },
    fullMock: {
      gridColumn: '1 / -1',
      background: '#fff',
      borderRadius: 18,
      padding: 18,
    },
    section: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '76px 20px',
    },
    sectionCenter: {
      textAlign: 'center' as const,
      maxWidth: 800,
      margin: '0 auto 42px',
    },
    eyebrow: {
      color: '#2563eb',
      fontWeight: 950,
      letterSpacing: '.14em',
      textTransform: 'uppercase' as const,
      fontSize: 12,
      marginBottom: 12,
    },
    h2: {
      fontSize: 'clamp(34px,5vw,54px)',
      lineHeight: 1,
      letterSpacing: '-.06em',
      margin: '0 0 16px',
      fontWeight: 950,
      color: '#0f172a',
    },
    sub: {
      fontSize: 18,
      lineHeight: 1.65,
      color: '#64748b',
      margin: 0,
      fontWeight: 550,
    },
    grid3: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 18,
    },
    grid2: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 22,
      alignItems: 'stretch',
    },
    card: {
      background: '#fff',
      border: '1px solid rgba(15,23,42,.09)',
      borderRadius: 24,
      padding: 28,
      boxShadow: '0 18px 45px rgba(15,23,42,.06)',
    },
    icon: {
      width: 48,
      height: 48,
      borderRadius: 16,
      background: '#eff6ff',
      display: 'grid',
      placeItems: 'center',
      fontSize: 24,
      marginBottom: 16,
    },
    cardTitle: {
      fontSize: 21,
      lineHeight: 1.15,
      margin: '0 0 10px',
      letterSpacing: '-.03em',
      fontWeight: 950,
    },
    cardText: {
      color: '#64748b',
      lineHeight: 1.65,
      margin: 0,
      fontWeight: 550,
    },
    painBox: {
      background: '#fff7ed',
      border: '1px solid #fed7aa',
      borderRadius: 26,
      padding: 30,
    },
    solveBox: {
      background: '#ecfdf5',
      border: '1px solid #a7f3d0',
      borderRadius: 26,
      padding: 30,
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: '18px 0 0',
      display: 'grid',
      gap: 12,
      color: '#334155',
      fontWeight: 750,
    },
    band: {
      background: '#0f172a',
      color: '#fff',
    },
    bandInner: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '72px 20px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 34,
      alignItems: 'center',
    },
    step: {
      display: 'flex',
      gap: 14,
      alignItems: 'flex-start',
      padding: '18px 0',
      borderBottom: '1px solid rgba(255,255,255,.1)',
    },
    stepNum: {
      width: 34,
      height: 34,
      borderRadius: 12,
      background: '#2563eb',
      display: 'grid',
      placeItems: 'center',
      fontWeight: 950,
      flexShrink: 0,
    },
    priceGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 18,
      alignItems: 'stretch',
    },
    priceCard: {
      background: '#fff',
      border: '1px solid rgba(15,23,42,.1)',
      borderRadius: 28,
      padding: 28,
      boxShadow: '0 18px 45px rgba(15,23,42,.06)',
      display: 'flex',
      flexDirection: 'column' as const,
    },
    priceFeatured: {
      background: 'linear-gradient(180deg,#eff6ff,#fff)',
      border: '2px solid #2563eb',
      transform: 'translateY(-10px)',
      boxShadow: '0 28px 65px rgba(37,99,235,.16)',
    },
    price: {
      fontSize: 44,
      fontWeight: 950,
      letterSpacing: '-.06em',
      margin: '10px 0',
      color: '#0f172a',
    },
    faq: {
      maxWidth: 860,
      margin: '0 auto',
      display: 'grid',
      gap: 12,
    },
    details: {
      background: '#fff',
      border: '1px solid rgba(15,23,42,.1)',
      borderRadius: 18,
      padding: 20,
      boxShadow: '0 12px 30px rgba(15,23,42,.04)',
    },
    cta: {
      maxWidth: 1180,
      margin: '0 auto',
      padding: '76px 20px',
    },
    ctaBox: {
      borderRadius: 34,
      background:
        'radial-gradient(circle at 20% 0%, rgba(37,99,235,.5), transparent 35%), linear-gradient(135deg,#0f172a,#111827)',
      color: '#fff',
      padding: '56px 28px',
      textAlign: 'center' as const,
      boxShadow: '0 30px 80px rgba(15,23,42,.25)',
    },
    footer: {
      padding: '30px 20px',
      textAlign: 'center' as const,
      color: '#64748b',
      fontSize: 14,
    },
    mobileStyle: `
      @media (max-width: 900px) {
        .ep-hero-inner,
        .ep-grid-2,
        .ep-band-inner,
        .ep-price-grid {
          grid-template-columns: 1fr !important;
        }
        .ep-grid-3 {
          grid-template-columns: 1fr !important;
        }
        .ep-nav-links {
          display: none !important;
        }
        .ep-app-mock {
          transform: none !important;
        }
        .ep-section {
          padding: 54px 18px !important;
        }
        .ep-price-featured {
          transform: none !important;
        }
        .ep-hero-actions {
          justify-content: flex-start !important;
        }
      }
    `,
  }

  return (
    <main style={styles.page}>
      <style>{styles.mobileStyle}</style>

      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <div style={styles.brand}>
            <div style={styles.mark}>E</div>
            Emprenix
          </div>

          <div className="ep-nav-links" style={styles.navLinks}>
            <a style={styles.navLink} href="#como-funciona">Cómo funciona</a>
            <a style={styles.navLink} href="#incluye">Qué incluye</a>
            <a style={styles.navLink} href="#precios">Precios</a>
            <Link href="/register" style={styles.btnPrimary}>Empieza gratis</Link>
          </div>
        </div>
      </nav>

      <section style={styles.hero}>
        <div className="ep-hero-inner" style={styles.heroInner}>
          <div>
            <div style={styles.pill}>Para autónomos y negocios de servicios</div>

            <h1 style={styles.h1}>
              Todo tu negocio.
              <br />
              Un solo lugar.
            </h1>

            <p style={styles.lead}>
              Clientes, citas, presupuestos, facturas y una web profesional para que empieces,
              te organices y vendas mejor sin complicarte.
            </p>

            <div className="ep-hero-actions" style={styles.heroActions}>
              <Link href="/register" style={styles.btnPrimary}>🚀 Crear mi cuenta gratis</Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={styles.btnSoft}>
                💬 Hablar por WhatsApp
              </a>
            </div>

            <div style={styles.proof}>
              <span>Sin tarjeta</span>
              <span>Listo en minutos</span>
              <span>Hecho para emprendedores reales</span>
            </div>
          </div>

          <div className="ep-app-mock" style={styles.appMock}>
            <div style={styles.mockTop}>
              <span>Panel Emprenix</span>
              <span style={{ color: '#93c5fd' }}>● online</span>
            </div>

            <div style={styles.mockBody}>
              <div style={styles.mockCard}>
                <div style={styles.mockLabel}>Clientes</div>
                <div style={styles.mockValue}>128</div>
                <div style={styles.cardText}>Contactos ordenados</div>
              </div>

              <div style={styles.mockCard}>
                <div style={styles.mockLabel}>Agenda</div>
                <div style={styles.mockValue}>9</div>
                <div style={styles.cardText}>Citas esta semana</div>
              </div>

              <div style={styles.fullMock}>
                <div style={styles.mockLabel}>Presupuesto enviado</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
                  <strong>Reforma baño</strong>
                  <strong style={{ color: '#16a34a' }}>1.240 €</strong>
                </div>
              </div>

              <div style={styles.fullMock}>
                <div style={styles.mockLabel}>Tu web pública</div>
                <div style={{ color: '#2563eb', fontWeight: 900 }}>emprenix.com/tu-negocio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ep-section" style={styles.section}>
        <div style={styles.sectionCenter}>
          <div style={styles.eyebrow}>El problema</div>
          <h2 style={styles.h2}>Empezar ya es difícil. Gestionarlo no debería serlo.</h2>
          <p style={styles.sub}>
            Muchos autónomos trabajan bien, pero pierden tiempo y oportunidades porque tienen todo repartido entre WhatsApp, notas, Excel y PDFs sueltos.
          </p>
        </div>

        <div className="ep-grid-2" style={styles.grid2}>
          <div style={styles.painBox}>
            <h3 style={styles.cardTitle}>Antes de Emprenix</h3>
            <ul style={styles.list}>
              <li>❌ Clientes perdidos entre mensajes</li>
              <li>❌ Citas olvidadas o mal apuntadas</li>
              <li>❌ Presupuestos hechos tarde</li>
              <li>❌ Facturas poco profesionales</li>
              <li>❌ Sin web que dé confianza</li>
            </ul>
          </div>

          <div style={styles.solveBox}>
            <h3 style={styles.cardTitle}>Con Emprenix</h3>
            <ul style={styles.list}>
              <li>✅ Todos tus clientes ordenados</li>
              <li>✅ Agenda conectada a cada contacto</li>
              <li>✅ Presupuestos y facturas en segundos</li>
              <li>✅ Web profesional incluida</li>
              <li>✅ WhatsApp siempre visible para vender</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="incluye" className="ep-section" style={{ ...styles.section, paddingTop: 30 }}>
        <div style={styles.sectionCenter}>
          <div style={styles.eyebrow}>Qué incluye</div>
          <h2 style={styles.h2}>Lo esencial para trabajar con imagen profesional.</h2>
          <p style={styles.sub}>
            No está hecho para grandes empresas. Está hecho para quien ofrece servicios y quiere organizarse desde el primer día.
          </p>
        </div>

        <div className="ep-grid-3" style={styles.grid3}>
          {[
            ['👥', 'Clientes en orden', 'Guarda contactos, notas, estado de cada cliente e historial para no perder oportunidades.'],
            ['📅', 'Agenda clara', 'Crea citas, vincúlalas a clientes y visualiza tu semana sin depender de mil aplicaciones.'],
            ['🧾', 'Presupuestos y facturas', 'Genera documentos profesionales con IVA, totales y PDF listo para enviar.'],
            ['🌐', 'Web pública incluida', 'Cada negocio tiene su landing para enseñar servicios, generar confianza y recibir contactos.'],
            ['💬', 'WhatsApp directo', 'Botones preparados para que el cliente final escriba rápido y sin fricción.'],
            ['🔳', 'QR para tu negocio', 'Comparte tu web en tarjetas, local, vehículo o redes con un QR siempre actualizado.'],
          ].map(([emoji, title, text]) => (
            <div key={title} style={styles.card}>
              <div style={styles.icon}>{emoji}</div>
              <h3 style={styles.cardTitle}>{title}</h3>
              <p style={styles.cardText}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="como-funciona" style={styles.band}>
        <div className="ep-band-inner" style={styles.bandInner}>
          <div>
            <div style={{ ...styles.eyebrow, color: '#93c5fd' }}>Cómo funciona</div>
            <h2 style={{ ...styles.h2, color: '#fff' }}>Entra, configura y empieza a trabajar mejor.</h2>
            <p style={{ ...styles.sub, color: '#cbd5e1' }}>
              Emprenix reduce la parte pesada de gestionar un negocio para que puedas dedicarte a atender clientes y vender.
            </p>
          </div>

          <div>
            {[
              ['1', 'Crea tu cuenta y añade los datos de tu negocio.'],
              ['2', 'Empieza a guardar clientes y citas.'],
              ['3', 'Envía presupuestos y facturas profesionales.'],
              ['4', 'Comparte tu web pública con WhatsApp y QR.'],
            ].map(([n, text]) => (
              <div key={n} style={styles.step}>
                <div style={styles.stepNum}>{n}</div>
                <div style={{ fontWeight: 800, lineHeight: 1.5 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="precios" className="ep-section" style={styles.section}>
        <div style={styles.sectionCenter}>
          <div style={styles.eyebrow}>Precios simples</div>
          <h2 style={styles.h2}>Empieza gratis. Mejora cuando lo necesites.</h2>
          <p style={styles.sub}>
            Planes pensados para emprendedores, autónomos y pequeños negocios que están creciendo.
          </p>
        </div>

        <div className="ep-price-grid" style={styles.priceGrid}>
          <div style={styles.priceCard}>
            <h3 style={styles.cardTitle}>Básico</h3>
            <div style={styles.price}>Gratis</div>
            <p style={styles.cardText}>Para empezar a ordenar clientes y citas.</p>
            <ul style={styles.list}>
              <li>✅ CRM básico</li>
              <li>✅ Agenda</li>
              <li>✅ Hasta 50 clientes</li>
              <li>✅ Ideal para probar</li>
            </ul>
            <div style={{ marginTop: 'auto', paddingTop: 22 }}>
              <Link href="/register" style={{ ...styles.btnSoft, width: '100%' }}>Empezar gratis</Link>
            </div>
          </div>

          <div className="ep-price-featured" style={{ ...styles.priceCard, ...styles.priceFeatured }}>
            <div style={styles.pill}>Más elegido</div>
            <h3 style={styles.cardTitle}>Pro</h3>
            <div style={styles.price}>19€<span style={{ fontSize: 18, color: '#64748b' }}>/mes</span></div>
            <p style={styles.cardText}>Para trabajar con imagen profesional y ahorrar tiempo.</p>
            <ul style={styles.list}>
              <li>✅ Clientes ilimitados</li>
              <li>✅ Agenda completa</li>
              <li>✅ Presupuestos y facturas PDF</li>
              <li>✅ WhatsApp integrado</li>
              <li>✅ QR de negocio</li>
            </ul>
            <div style={{ marginTop: 'auto', paddingTop: 22 }}>
              <Link href="/register" style={{ ...styles.btnPrimary, width: '100%' }}>Probar Pro</Link>
            </div>
          </div>

          <div style={styles.priceCard}>
            <h3 style={styles.cardTitle}>Business</h3>
            <div style={styles.price}>49€<span style={{ fontSize: 18, color: '#64748b' }}>/mes</span></div>
            <p style={styles.cardText}>Para negocios que quieren destacar y crecer más rápido.</p>
            <ul style={styles.list}>
              <li>✅ Todo lo de Pro</li>
              <li>✅ Web pública avanzada</li>
              <li>✅ Más personalización</li>
              <li>✅ Soporte prioritario</li>
            </ul>
            <div style={{ marginTop: 'auto', paddingTop: 22 }}>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ ...styles.btnSoft, width: '100%' }}>
                Consultar
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="ep-section" style={{ ...styles.section, paddingTop: 20 }}>
        <div style={styles.sectionCenter}>
          <div style={styles.eyebrow}>Preguntas frecuentes</div>
          <h2 style={styles.h2}>Claro desde el principio.</h2>
        </div>

        <div style={styles.faq}>
          {[
            ['¿Esto es para grandes empresas?', 'No. Emprenix está pensado para autónomos, emprendedores y negocios de servicios que necesitan algo simple, claro y útil.'],
            ['¿Necesito saber de tecnología?', 'No. La idea es que puedas empezar sin complicarte: clientes, citas, documentos y web en un mismo lugar.'],
            ['¿Puedo cancelar cuando quiera?', 'Sí. Sin permanencia y sin letra pequeña.'],
            ['¿La web pública viene incluida?', 'Sí. Cada negocio puede tener su página pública para mostrar servicios y recibir contactos por WhatsApp.'],
          ].map(([q, a]) => (
            <details key={q} style={styles.details}>
              <summary style={{ cursor: 'pointer', fontWeight: 950, fontSize: 17 }}>{q}</summary>
              <p style={{ ...styles.cardText, marginTop: 12 }}>{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section style={styles.cta}>
        <div style={styles.ctaBox}>
          <h2 style={{ ...styles.h2, color: '#fff' }}>Empieza a gestionar tu negocio con más orden.</h2>
          <p style={{ ...styles.sub, color: '#cbd5e1', maxWidth: 720, margin: '0 auto 26px' }}>
            Crea tu cuenta, organiza tus clientes y empieza a enviar presupuestos profesionales desde hoy.
          </p>
          <div style={styles.heroActions}>
            <Link href="/register" style={styles.btnPrimary}>🚀 Crear cuenta gratis</Link>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={styles.btnDark}>
              💬 Tengo una duda
            </a>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        © {new Date().getFullYear()} Emprenix · Todo tu negocio en un solo lugar.
      </footer>
    </main>
  )
}
