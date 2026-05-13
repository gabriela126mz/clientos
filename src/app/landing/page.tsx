// src/app/landing/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Emprenix | CRM + Agenda + Facturación para Autónomos en España',
  description: 'Software todo-en-uno para fontaneros, electricistas y autónomos. CRM, Agenda, Facturación y Web pública. Prueba gratis 14 días.',
};

export default function Landing() {
  const whatsappNumber = '34692209204';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hola,%20me%20interesa%20conocer%20Emprenix`;

  const styles = {
    container: { fontFamily: 'Arial, sans-serif', lineHeight: '1.6', color: '#333' },
    heroSection: { background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', color: 'white', padding: '60px 20px', textAlign: 'center' as const },
    h1: { fontSize: '48px', fontWeight: 'bold', marginBottom: '20px', lineHeight: '1.2' },
    h2: { fontSize: '32px', fontWeight: 'bold', marginBottom: '30px', textAlign: 'center' as const },
    h3: { fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' },
    button: { padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', marginRight: '10px', marginBottom: '10px' },
    buttonGreen: { background: '#10b981', color: 'white' },
    buttonWhite: { background: 'white', color: '#2563eb' },
    section: { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' },
    sectionGray: { background: '#f3f4f6' },
    grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '30px' },
    card: { border: '1px solid #ddd', borderRadius: '8px', padding: '20px', background: 'white' },
    cardWithBorder: { borderLeft: '4px solid #ef4444' },
    cardGreen: { borderLeft: '4px solid #10b981' },
    priceCard: { border: '2px solid #2563eb', background: '#eff6ff', borderRadius: '8px', padding: '30px 20px' },
    priceText: { fontSize: '36px', fontWeight: 'bold', color: '#2563eb', marginBottom: '20px' },
    ctaSection: { background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', color: 'white', padding: '60px 20px', textAlign: 'center' as const },
    detailsBox: { border: '1px solid #ddd', borderRadius: '8px', marginBottom: '15px', padding: '20px', background: 'white' },
    featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' },
  };

  return (
    <main style={styles.container}>
      {/* HERO */}
      <section style={{ ...styles.heroSection }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={styles.h1}>Tu Negocio Completo en Una Plataforma</h1>
          <p style={{ fontSize: '20px', marginBottom: '30px', color: '#dbeafe' }}>CRM, Agenda, Facturación y Web Pública integrados.</p>
          
          <div style={{ marginBottom: '20px' }}>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ ...styles.button, ...styles.buttonGreen }}>
              💬 Habla por WhatsApp
            </a>
            <a href="#prueba" style={{ ...styles.button, ...styles.buttonWhite }}>
              📱 Prueba Gratis
            </a>
          </div>

          <p style={{ color: '#dbeafe', fontSize: '14px' }}>✅ Sin tarjeta | ✅ Sin contrato | ✅ Cancela cuando quieras</p>
        </div>
      </section>

      {/* PROBLEMA - SOLUCIÓN */}
      <section style={{ ...styles.section, ...styles.sectionGray }}>
        <h2 style={styles.h2}>¿Por Qué Emprenix?</h2>
        <div style={styles.grid2}>
          <div style={{ ...styles.card, ...styles.cardWithBorder }}>
            <h3 style={styles.h3}>❌ El Problema</h3>
            <ul style={{ listStyle: 'none', marginTop: '15px' }}>
              <li>📱 Pierdes clientes en WhatsApp</li>
              <li>📊 No sabes quién debe dinero</li>
              <li>📅 Citas en múltiples calendarios</li>
              <li>📄 Facturas en Word o papelitos</li>
              <li>⏰ Horas perdidas en admin</li>
            </ul>
          </div>

          <div style={{ ...styles.card, ...styles.cardGreen }}>
            <h3 style={{ ...styles.h3, color: '#10b981' }}>✅ La Solución</h3>
            <ul style={{ listStyle: 'none', marginTop: '15px' }}>
              <li>💬 CRM con WhatsApp integrado</li>
              <li>💰 Sabe quién debe automáticamente</li>
              <li>📆 Un calendario único</li>
              <li>🧾 Facturas en PDF en segundos</li>
              <li>⚡ Admin automatizado</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.section}>
        <h2 style={styles.h2}>Funcionalidades Principales</h2>
        <div style={styles.featureGrid}>
          <div style={styles.card}>
            <h3>🎯 CRM Inteligente</h3>
            <p>Gestiona todos tus clientes en un lugar. Pipeline automático, notas, historial.</p>
          </div>
          <div style={styles.card}>
            <h3>📅 Agenda de Citas</h3>
            <p>Calendario mensual vinculado a clientes. Recordatorios automáticos.</p>
          </div>
          <div style={styles.card}>
            <h3>📄 Facturación Automática</h3>
            <p>Presupuestos y facturas en segundos. IVA variable, PDF automático.</p>
          </div>
          <div style={styles.card}>
            <h3>💬 WhatsApp Integrado</h3>
            <p>Botón WhatsApp en tu web. Captura clientes directamente.</p>
          </div>
          <div style={styles.card}>
            <h3>🌐 Web Pública Propia</h3>
            <p>Cada negocio tiene su landing. Personalizable, responsiva.</p>
          </div>
          <div style={styles.card}>
            <h3>⚡ Super Simple</h3>
            <p>Interfaz intuitiva. Empieza en minutos, domina en horas.</p>
          </div>
        </div>
      </section>

      {/* PRECIOS */}
      <section style={{ ...styles.section, ...styles.sectionGray }}>
        <h2 style={styles.h2}>Planes Flexibles</h2>
        <div style={styles.grid3}>
          <div style={styles.card}>
            <h3 style={styles.h3}>Básico</h3>
            <div style={styles.priceText}>Gratis</div>
            <ul style={{ listStyle: 'none', fontSize: '14px', marginBottom: '20px' }}>
              <li>✅ CRM básico</li>
              <li>✅ Hasta 50 clientes</li>
              <li>✅ Agenda de citas</li>
              <li style={{ color: '#999' }}>❌ Facturación</li>
            </ul>
            <button style={{ ...styles.button, width: '100%', background: '#2563eb', color: 'white' }}>Empezar Gratis</button>
          </div>

          <div style={{ ...styles.card, ...styles.priceCard }}>
            <div style={{ background: '#2563eb', color: 'white', padding: '8px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px', display: 'inline-block' }}>⭐ MÁS POPULAR</div>
            <h3 style={styles.h3}>Pro</h3>
            <div style={styles.priceText}>€19<span style={{ fontSize: '16px' }}>/mes</span></div>
            <ul style={{ listStyle: 'none', fontSize: '14px', marginBottom: '20px' }}>
              <li>✅ CRM completo</li>
              <li>✅ Clientes ilimitados</li>
              <li>✅ Facturación con PDF</li>
              <li>✅ WhatsApp integrado</li>
            </ul>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ ...styles.button, width: '100%', background: '#2563eb', color: 'white', textAlign: 'center', display: 'block' }}>💬 Prueba Pro Gratis</a>
          </div>

          <div style={styles.card}>
            <h3 style={styles.h3}>Business</h3>
            <div style={styles.priceText}>€49<span style={{ fontSize: '16px' }}>/mes</span></div>
            <ul style={{ listStyle: 'none', fontSize: '14px', marginBottom: '20px' }}>
              <li>✅ Todo de Pro</li>
              <li>✅ Web pública personalizada</li>
              <li>✅ Soporte prioritario</li>
            </ul>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ ...styles.button, width: '100%', background: '#2563eb', color: 'white', textAlign: 'center', display: 'block' }}>💬 Info Business</a>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="prueba" style={{ ...styles.ctaSection }}>
        <h2 style={styles.h2}>¿Listo para Transformar tu Negocio?</h2>
        <p style={{ fontSize: '18px', marginBottom: '30px', color: '#dbeafe' }}>Prueba Emprenix gratis 14 días. Sin tarjeta. Sin compromiso.</p>
        <div>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={{ ...styles.button, ...styles.buttonGreen }}>💬 Contactar por WhatsApp</a>
          <button style={{ ...styles.button, ...styles.buttonWhite }}>📱 Registrarse Gratis</button>
        </div>
        <p style={{ marginTop: '20px', color: '#dbeafe', fontSize: '14px' }}>Únete a cientos de autónomos que transformaron su negocio con Emprenix</p>
      </section>

      {/* FAQ */}
      <section style={styles.section}>
        <h2 style={styles.h2}>Preguntas Frecuentes</h2>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <details style={styles.detailsBox}>
            <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>¿Hay contrato?</summary>
            <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>No. Puedes cancelar en cualquier momento sin penalizaciones.</p>
          </details>
          <details style={styles.detailsBox}>
            <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>¿Puedo cambiar de plan?</summary>
            <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>Sí. Upgraa o downgrade cuando quieras.</p>
          </details>
          <details style={styles.detailsBox}>
            <summary style={{ fontWeight: 'bold', cursor: 'pointer' }}>¿Qué pasa después de 14 días?</summary>
            <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>Tu suscripción se activa. Pero puedes cancelar antes sin costo.</p>
          </details>
        </div>
      </section>
    </main>
  );
}