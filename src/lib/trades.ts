// src/lib/trades.ts
// CONFIGURACIÓN CON IMÁGENES DE UNSPLASH POR OFICIO

export interface TradeConfig {
  id: string
  name: string
  emoji: string
  category: string
  colors: { primary: string; secondary: string; accent: string; cream: string; ink: string }
  heroImage: string
  galleryImages: string[]
  defaultHeadline: string
  defaultSubtitle: string
  defaultIntro: string
  defaultServices: Array<{ name: string; desc: string; icon: string }>
  defaultBenefits: string[]
  defaultProcess: Array<{ title: string; text: string }>
  defaultTestimonials: Array<{ name: string; role: string; text: string }>
  defaultFaqs: Array<{ q: string; a: string }>
}

export const TRADES: Record<string, TradeConfig> = {
  jardineria: {
    id: 'jardineria',
    name: 'Jardinería',
    emoji: '🌿',
    category: 'construccion',
    colors: { primary: '#2d5a27', secondary: '#3d7a35', accent: '#c8a96e', cream: '#faf7f2', ink: '#1a2818' },
    heroImage: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1600&q=85&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1598282209224-2e7720b84e1c?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1548843476-f4e2b2c2f1b8?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1563241527-3006b33bdc2f?w=800&q=85&fit=crop',
    ],
    defaultHeadline: 'Jardines que',
    defaultSubtitle: 'enamoran',
    defaultIntro: 'Diseño, construcción y mantenimiento de jardines profesionales. Equipo propio, presupuesto claro, sin sorpresas.',
    defaultServices: [
      { name: 'Diseño y paisajismo', desc: 'Proyectamos tu jardín desde cero: estudio del espacio, elección de plantas, materiales y estilo.', icon: '🌿' },
      { name: 'Obra y ejecución', desc: 'Transformamos el proyecto en realidad con equipo propio. Materiales de primera calidad.', icon: '🏗️' },
      { name: 'Mantenimiento', desc: 'El mismo equipo que crea tu jardín lo cuida mes a mes. Poda, riego, tratamientos profesionales.', icon: '✂️' },
    ],
    defaultBenefits: ['👥 Equipo propio certificado', '📋 Presupuesto claro y cerrado', '✅ Garantía de 2 años'],
    defaultProcess: [
      { title: 'Consulta', text: 'Visitamos y analizamos tu espacio' },
      { title: 'Diseño', text: 'Propuesta personalizada en 3D' },
      { title: 'Ejecución', text: 'Obra profesional y limpia' },
      { title: 'Mantenimiento', text: 'Cuidado continuado' },
    ],
    defaultTestimonials: [
      { name: 'María García', role: 'Propietaria', text: 'Transformaron mi jardín en un oasis. Equipo impecable y profesional.' },
      { name: 'Carlos López', role: 'Empresa', text: 'Profesionalidad de principio a fin. Muy recomendables sin dudarlo.' },
      { name: 'Ana Martínez', role: 'Particular', text: 'Superaron todas mis expectativas. El mejor equipo de jardinería.' },
    ],
    defaultFaqs: [
      { q: '¿Cuánto cuesta un jardín?', a: 'Depende del tamaño y complejidad. Presupuesto sin compromiso en 48h garantizado.' },
      { q: '¿Cuánto tiempo tarda la obra?', a: 'Proyectos pequeños 2-4 semanas, grandes 4-12 semanas. Plazos garantizados.' },
      { q: '¿Qué garantía dáis?', a: '2 años de garantía en todas las plantas y estructuras. Total tranquilidad.' },
      { q: '¿Trabajáis fuera de Madrid?', a: 'Sí, toda la Comunidad de Madrid y alrededores con disponibilidad confirmada.' },
    ],
  },

  paisajismo: {
    id: 'paisajismo',
    name: 'Paisajismo',
    emoji: '🌳',
    category: 'construccion',
    colors: { primary: '#1b5e20', secondary: '#2e7d32', accent: '#8bc34a', cream: '#f1f8e9', ink: '#0d3818' },
    heroImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=85&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1548843476-f4e2b2c2f1b8?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1598282209224-2e7720b84e1c?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1569420285789-7b69945fb226?w=800&q=85&fit=crop',
    ],
    defaultHeadline: 'Espacios verdes',
    defaultSubtitle: 'sostenibles',
    defaultIntro: 'Diseño de paisajes con enfoque sostenible y armónico con la naturaleza. Bajo mantenimiento, máxima belleza.',
    defaultServices: [
      { name: 'Diseño ecológico', desc: 'Proyectos respetando el medio ambiente y flora local. Sostenibilidad garantizada.', icon: '🌱' },
      { name: 'Terrazas y patios', desc: 'Espacios funcionales y bellos para disfrutar al aire libre con familia.', icon: '🏠' },
      { name: 'Riego automático', desc: 'Sistemas inteligentes y eficientes para el riego. Ahorro de agua garantizado.', icon: '💧' },
    ],
    defaultBenefits: ['♻️ Diseño sostenible', '🌍 Bajo mantenimiento', '💚 Plantas nativas'],
    defaultProcess: [
      { title: 'Análisis', text: 'Estudio del terreno y clima' },
      { title: 'Proyecto', text: 'Propuesta ecológica personalizada' },
      { title: 'Implantación', text: 'Ejecución profesional' },
      { title: 'Monitoreo', text: 'Seguimiento y ajustes continuos' },
    ],
    defaultTestimonials: [
      { name: 'Francisco Ruiz', role: 'Empresa', text: 'Paisajismo de lujo con conciencia ambiental. Proyecto perfecto.' },
      { name: 'Isabel Sánchez', role: 'Particular', text: 'Mi jardín es ahora un paraíso natural y requiere poco mantenimiento.' },
      { name: 'Miguel Hernández', role: 'Hotel', text: 'Transformaron nuestras terrazas completamente. Clientes encantados.' },
    ],
    defaultFaqs: [
      { q: '¿Es caro lo sostenible?', a: 'No, a menudo es más económico a largo plazo. Menor mantenimiento significa ahorro.' },
      { q: '¿Qué plantas recomendáis?', a: 'Solo nativas, perfectamente adaptadas al clima de la región.' },
      { q: '¿Necesita mucho riego?', a: 'No, nuestro diseño minimiza riego. Las plantas nativas necesitan poco.' },
      { q: '¿Cuánto dura un paisaje así?', a: 'Décadas con mínimo mantenimiento. Inversión a largo plazo muy rentable.' },
    ],
  },

  reformas: {
    id: 'reformas',
    name: 'Reformas Integrales',
    emoji: '🏗️',
    category: 'construccion',
    colors: { primary: '#bf360c', secondary: '#e64a19', accent: '#ff7043', cream: '#ffebee', ink: '#3e2723' },
    heroImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=85&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1559574615-cd4628902249?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?w=800&q=85&fit=crop',
    ],
    defaultHeadline: 'Reformas que',
    defaultSubtitle: 'transforman',
    defaultIntro: 'Expertos en reformas integrales. Proyecto, obra y acabados con profesionalismo y calidad premium garantizados.',
    defaultServices: [
      { name: 'Proyecto y diseño', desc: 'Planificamos cada detalle: diseño 3D, presupuesto ajustado, cronograma realista.', icon: '📐' },
      { name: 'Ejecución profesional', desc: 'Obra limpia y organizada. Equipo certificado, materiales de calidad, plazos cumplidos.', icon: '🔨' },
      { name: 'Acabados premium', desc: 'Detalles que marcan diferencia. Pintura, alicatados, electricidad, fontanería de calidad.', icon: '✨' },
    ],
    defaultBenefits: ['👷 Equipo profesional', '📋 Presupuesto cerrado', '⏱️ Plazos garantizados'],
    defaultProcess: [
      { title: 'Proyecto', text: 'Diseño y planificación 3D' },
      { title: 'Presupuesto', text: 'Desglose claro y sin sorpresas' },
      { title: 'Obra', text: 'Ejecución profesional y limpia' },
      { title: 'Acabados', text: 'Detalles de calidad premium' },
    ],
    defaultTestimonials: [
      { name: 'Pedro Díaz', role: 'Vivienda', text: 'Mi casa se transformó completamente. Equipo impecable desde inicio a fin.' },
      { name: 'Laura Fernández', role: 'Empresa', text: 'Reforma de oficinas perfecta. En tiempo y presupuesto garantizado.' },
      { name: 'Juan Moreno', role: 'Local', text: 'Reforma integral exitosa. Repetiríamos sin dudarlo con este equipo.' },
    ],
    defaultFaqs: [
      { q: '¿Cuánto tiempo tarda una reforma?', a: 'Depende del alcance. Presupuestamos con cronograma realista y garantizado.' },
      { q: '¿Qué hago durante la reforma?', a: 'Planificamos para minimizar molestias. Podemos gestionar servicios temporales.' },
      { q: '¿Qué pasa si hay sorpresas?', a: 'Consultamos antes de ejecutar. Presupuesto cerrado = sin sorpresas garantizado.' },
      { q: '¿Tenéis licencias?', a: 'Sí, equipo completamente certificado y licenciado en todas las disciplinas.' },
    ],
  },

  cocinero: {
    id: 'cocinero',
    name: 'Catering y Chef',
    emoji: '👨‍🍳',
    category: 'entretenimiento',
    colors: { primary: '#4a1f16', secondary: '#8f3d24', accent: '#d8a15d', cream: '#fff4ed', ink: '#1f120e' },
    heroImage: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1800&q=90&fit=crop&auto=format',
    galleryImages: [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1400&q=90&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=90&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=90&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=90&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=1400&q=90&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1400&q=90&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&q=90&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1400&q=90&fit=crop&auto=format',
    ],
    defaultHeadline: 'Cocina cuidada',
    defaultSubtitle: 'para momentos especiales',
    defaultIntro: 'Servicio gastronómico para bodas, eventos, cenas privadas y celebraciones. Menús personalizados, presentación cuidada y atención profesional de principio a fin.',
    defaultServices: [
      { name: 'Catering para bodas', desc: 'Menú personalizado, presentación elegante y servicio atento para que tus invitados recuerden cada detalle.', icon: '💒' },
      { name: 'Eventos corporativos', desc: 'Propuestas gastronómicas cuidadas para reuniones, empresas y celebraciones profesionales.', icon: '🍽️' },
      { name: 'Cenas privadas', desc: 'Una experiencia gastronómica íntima, cuidada y adaptada al gusto de tus invitados.', icon: '🍷' },
    ],
    defaultBenefits: ['👨‍🍳 Atención profesional y cercana', '🍽️ Menús personalizados', '✨ Presentación cuidada'],
    defaultProcess: [
      { title: 'Consulta', text: 'Conocemos tus preferencias culinarias' },
      { title: 'Menú', text: 'Propuesta gastronómica personalizada' },
      { title: 'Preparación', text: 'Cocina y servicio profesional el día' },
      { title: 'Experiencia', text: 'Cena memorable de principio a fin' },
    ],
    defaultTestimonials: [
      { name: 'Mercedes López', role: 'Novia', text: 'Chef excepcional. Comida de boda absolutamente inolvidable y deliciosa.' },
      { name: 'Carlos Sánchez', role: 'Empresa', text: 'Comida corporativa que dejó boquiabiertos a todos nuestros clientes.' },
      { name: 'Anabel Ruiz', role: 'Particular', text: 'Cena privada gastronómica. Experiencia de lujo absoluto en mi casa.' },
    ],
    defaultFaqs: [
      { q: '¿Presupuesto por persona?', a: 'Desde 40€ básico a 150€+ menú premium. Presupuesto personalizado.' },
      { q: '¿Menú personalizado?', a: 'Sí, adaptado a dietas y preferencias de todos los invitados.' },
      { q: '¿Número mínimo?', a: 'Mínimo 20 personas. Sin límite máximo de invitados.' },
      { q: '¿Dónde ofrecéis el servicio?', a: 'Trabajamos principalmente en la ciudad indicada y alrededores. Escríbenos para confirmar disponibilidad según fecha y ubicación.' },
    ],
  },

  transporte: {
    id: 'transporte',
    name: 'Transporte y Logística',
    emoji: '🚚',
    category: 'servicios',
    colors: { primary: '#1565c0', secondary: '#1976d2', accent: '#ffb300', cream: '#e3f2fd', ink: '#0d47a1' },
    heroImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=85&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1578792268213-ebeba007c7c7?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1527224050556-5b2dd9f9ccd9?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=85&fit=crop',
    ],
    defaultHeadline: 'Transporte',
    defaultSubtitle: 'eficiente',
    defaultIntro: 'Empresa de transporte confiable: mudanzas, logística y distribución rápida en toda la región.',
    defaultServices: [
      { name: 'Mudanzas completas', desc: 'Traslado profesional de vivienda u oficina. Seguros incluidos siempre.', icon: '📦' },
      { name: 'Distribución', desc: 'Reparto de paquetes y mercancía a domicilio en tiempo récord.', icon: '🚚' },
      { name: 'Logística integral', desc: 'Almacenamiento y gestión de inventario profesional y segura.', icon: '📊' },
    ],
    defaultBenefits: ['🚗 Flotas modernas', '📦 Seguros incluidos', '⏱️ Entrega a tiempo'],
    defaultProcess: [
      { title: 'Presupuesto', text: 'Evaluación gratuita sin compromiso' },
      { title: 'Planificación', text: 'Coordinación de fecha y horario' },
      { title: 'Transporte', text: 'Ejecución profesional y segura' },
      { title: 'Entrega', text: 'Confirmación y seguimiento posterior' },
    ],
    defaultTestimonials: [
      { name: 'Javier Martín', role: 'Mudanza', text: 'Mudanza perfecta. Todo llegó en perfecto estado. Muy profesionales.' },
      { name: 'Rosa García', role: 'Empresa', text: 'Distribución rápida y confiable para nuestro negocio de ecommerce.' },
      { name: 'Miguel Ruiz', role: 'Empresa', text: 'Logística completa y eficiente para toda nuestra cadena de tiendas.' },
    ],
    defaultFaqs: [
      { q: '¿Presupuesto mudanza?', a: 'Presupuesto gratuito tras visita a domicilio. Sin sorpresas garantizado.' },
      { q: '¿Seguro incluido?', a: 'Sí, seguro de responsabilidad civil incluido en toda mudanza.' },
      { q: '¿Embalaje?', a: 'Sí, materiales de embalaje de calidad premium siempre incluidos.' },
      { q: '¿Disponibilidad?', a: '365 días al año, incluso festivos con precio ajustado.' },
    ],
  },

  emprendedor: {
    id: 'emprendedor',
    name: 'Emprendedor',
    emoji: '🚀',
    category: 'negocio',
    colors: { primary: '#1a237e', secondary: '#3949ab', accent: '#5c6bc0', cream: '#f5f5ff', ink: '#0d1854' },
    heroImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=85&fit=crop',
    galleryImages: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=85&fit=crop',
      'https://images.unsplash.com/photo-1522869635100-ce0846a1f55e?w=800&q=85&fit=crop',
    ],
    defaultHeadline: 'Tu startup',
    defaultSubtitle: 'profesional',
    defaultIntro: 'Soluciones para emprendedores: web profesional, branding y mentoría empresarial de éxito.',
    defaultServices: [
      { name: 'Web profesional', desc: 'Diseño web moderno, rápido y optimizado para SEO. Conversión garantizada.', icon: '🌐' },
      { name: 'Branding', desc: 'Logo, identidad visual y estrategia de marca que comunica tu esencia.', icon: '🎨' },
      { name: 'Mentoría', desc: 'Asesoramiento empresarial y estratégico de emprendedor a emprendedor.', icon: '📈' },
    ],
    defaultBenefits: ['💼 Paquetes startup', '🚀 Crecimiento acelerado', '📊 Métricas claras'],
    defaultProcess: [
      { title: 'Idea', text: 'Validación de modelo de negocio' },
      { title: 'Branding', text: 'Identidad y posicionamiento en mercado' },
      { title: 'Online', text: 'Presencia digital profesional' },
      { title: 'Crecimiento', text: 'Mentoría y seguimiento continuo' },
    ],
    defaultTestimonials: [
      { name: 'Álvaro Pérez', role: 'Startup', text: 'De idea a empresa en 6 meses. Imprescindible para emprendedor.' },
      { name: 'Claudia Ruiz', role: 'Freelancer', text: 'Web y marca que proyectan profesionalidad. Clientes inmediatamente.' },
      { name: 'Roberto López', role: 'Emprendedor', text: 'Mentoría que aceleró mi crecimiento de forma exponencial.' },
    ],
    defaultFaqs: [
      { q: '¿Costo total?', a: 'Desde 1500€ pack completo startup a 5000€ premium con mentoría.' },
      { q: '¿Incluye mentoría?', a: 'Sí, asesoramiento directo durante 12 meses completos incluido.' },
      { q: '¿Resultados?', a: 'Típicamente clientes en primeros 2-3 meses con web y branding.' },
      { q: '¿Formato?', a: 'Online, presencial o híbrido según necesidades y ubicación.' },
    ],
  },
}

export function normalizeTradeId(tradeId: string): string {
  const normalized = (tradeId || 'emprendedor')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')

  const aliases: Record<string, string> = {
    // Gastronomía
    chef: 'cocinero',
    cocina: 'cocinero',
    cocinero: 'cocinero',
    cocinera: 'cocinero',
    catering: 'cocinero',
    caterin: 'cocinero',
    restaurante: 'cocinero',
    restaurantes: 'cocinero',
    comida: 'cocinero',
    gastronomia: 'cocinero',
    gastronomico: 'cocinero',

    // Jardín / exteriores
    jardin: 'jardineria',
    jardinero: 'jardineria',
    jardinera: 'jardineria',
    jardines: 'jardineria',
    paisajista: 'paisajismo',

    // Construcción / reformas
    reforma: 'reformas',
    reformista: 'reformas',
    obra: 'reformas',
    obras: 'reformas',
    construccion: 'reformas',
    constructor: 'reformas',

    // Transporte
    mudanza: 'transporte',
    mudanzas: 'transporte',
    transportista: 'transporte',
    transporte: 'transporte',
    repartidor: 'transporte',
  }

  return aliases[normalized] || normalized
}

export function getTradeConfig(tradeId: string): TradeConfig {
  const normalized = normalizeTradeId(tradeId)
  return TRADES[normalized] || TRADES.emprendedor
}
