// src/app/landing/page.tsx
import { Metadata } from 'next';
import styles from '../landing.css'
export const metadata: Metadata = {
  title: 'Emprenix | CRM + Agenda + Facturación para Autónomos en España',
  description: 'Software todo-en-uno para fontaneros, electricistas y autónomos. CRM, Agenda, Facturación y Web pública. Prueba gratis 14 días. ¡Transforma tu negocio ahora!',
  keywords: 'CRM autónomos, software gestión clientes, facturación online, agenda citas, fontaneros, electricistas',
};

export default function Landing() {
  const whatsappNumber = '34692209204'; // REEMPLAZA CON TU NÚMERO
  const whatsappMessage = 'Hola, me interesa conocer más sobre Emprenix para mi negocio';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="py-24 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Tu Negocio Completo en Una Plataforma
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            CRM, Agenda, Facturación y Web Pública integrados. Todo lo que necesitas para crecer.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition"
            >
              💬 Habla con Nosotros por WhatsApp
            </a>
            <a 
              href="#prueba-gratis"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
            >
              📱 Prueba Gratis 14 Días
            </a>
          </div>

          <p className="text-blue-100">
            ✅ Sin tarjeta de crédito | ✅ Sin contrato | ✅ Cancela cuando quieras
          </p>
        </div>
      </section>

      {/* PROBLEMA - SOLUCIÓN */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">¿Por Qué Emprenix?</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded">
              <h3 className="text-2xl font-bold text-red-600 mb-4">❌ El Problema</h3>
              <ul className="space-y-3 text-gray-700">
                <li>📱 Pierdes clientes en WhatsApp y SMS</li>
                <li>📊 No sabes quién te debe dinero</li>
                <li>📅 Citas esparcidas en múltiples calendarios</li>
                <li>📄 Facturas en Word o papelitos</li>
                <li>⏰ Horas perdidas en admin</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-8 rounded">
              <h3 className="text-2xl font-bold text-green-600 mb-4">✅ La Solución: Emprenix</h3>
              <ul className="space-y-3 text-gray-700">
                <li>💬 CRM integrado con WhatsApp</li>
                <li>💰 Sabe automáticamente quién debe</li>
                <li>📆 Calendario único de todas tus citas</li>
                <li>🧾 Facturas en PDF en segundos</li>
                <li>⚡ Admin automatizado, tú vendes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Funcionalidades Principales</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border rounded-lg p-8 hover:shadow-lg transition">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">CRM Inteligente</h3>
              <p className="text-gray-600">Gestiona todos tus clientes en un lugar. Pipeline automático, notas, historial de contactos, seguimiento.</p>
            </div>

            <div className="border rounded-lg p-8 hover:shadow-lg transition">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold mb-3">Agenda de Citas</h3>
              <p className="text-gray-600">Calendario mensual vinculado a clientes. Estados de citas, recordatorios automáticos, próximas citas en el dashboard.</p>
            </div>

            <div className="border rounded-lg p-8 hover:shadow-lg transition">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-bold mb-3">Facturación Automática</h3>
              <p className="text-gray-600">Presupuestos y facturas en segundos. IVA variable, descuentos, numeración automática, PDF listo.</p>
            </div>

            <div className="border rounded-lg p-8 hover:shadow-lg transition">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold mb-3">WhatsApp Integrado</h3>
              <p className="text-gray-600">Botón WhatsApp en tu web. Captura clientes directamente. Chats vinculados a su perfil en CRM.</p>
            </div>

            <div className="border rounded-lg p-8 hover:shadow-lg transition">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold mb-3">Web Pública Propia</h3>
              <p className="text-gray-600">Cada negocio tiene su landing. Hero personalizado, servicios, testimonios, galería, FAQs, formulario.</p>
            </div>

            <div className="border rounded-lg p-8 hover:shadow-lg transition">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">Super Simple</h3>
              <p className="text-gray-600">Interfaz intuitiva, sin curva de aprendizaje. Empieza en minutos, domina en horas. Soporte en español.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRECIOS */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Planes Flexibles</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border rounded-lg p-8 hover:shadow-lg transition">
              <h3 className="text-2xl font-bold mb-2">Básico</h3>
              <p className="text-4xl font-bold text-green-600 mb-6">Gratis</p>
              
              <ul className="space-y-3 mb-8 text-gray-700">
                <li>✅ CRM básico</li>
                <li>✅ Hasta 50 clientes</li>
                <li>✅ Agenda de citas</li>
                <li>✅ Panel de control</li>
                <li className="text-gray-400">❌ Facturación</li>
                <li className="text-gray-400">❌ Web pública</li>
              </ul>
              
              <button className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition">
                Empezar Gratis
              </button>
            </div>

            <div className="border-2 border-blue-600 rounded-lg p-8 bg-blue-50 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                ⭐ MÁS POPULAR
              </div>
              
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-4xl font-bold text-blue-600 mb-6">€19<span className="text-lg">/mes</span></p>
              
              <ul className="space-y-3 mb-8 text-gray-700">
                <li>✅ CRM completo</li>
                <li>✅ Clientes ilimitados</li>
                <li>✅ Agenda avanzada</li>
                <li>✅ Facturación con PDF</li>
                <li>✅ IVA variable (0/10/15/21%)</li>
                <li>✅ WhatsApp integrado</li>
              </ul>
              
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition text-center"
              >
                💬 Prueba Pro Gratis
              </a>
            </div>

            <div className="border rounded-lg p-8 hover:shadow-lg transition">
              <h3 className="text-2xl font-bold mb-2">Business</h3>
              <p className="text-4xl font-bold text-blue-600 mb-6">€49<span className="text-lg">/mes</span></p>
              
              <ul className="space-y-3 mb-8 text-gray-700">
                <li>✅ Todo de Pro</li>
                <li>✅ Web pública personalizada</li>
                <li>✅ Dominio personalizado</li>
                <li>✅ Analytics avanzados</li>
                <li>✅ Soporte prioritario</li>
                <li>✅ Integraciones custom</li>
              </ul>
              
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition text-center"
              >
                💬 Info Business
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="prueba-gratis" className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">¿Listo para Transformar tu Negocio?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Prueba Emprenix gratis durante 14 días. Sin tarjeta de crédito. Sin compromiso.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg transition"
            >
              💬 Contactar por WhatsApp
            </a>
            <button className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
              📱 Registrarse Gratis
            </button>
          </div>

          <p className="mt-8 text-blue-100">
            Únete a cientos de autónomos que ya transformaron su negocio con Emprenix
          </p>
        </div>
      </section>
    </main>
  );
}