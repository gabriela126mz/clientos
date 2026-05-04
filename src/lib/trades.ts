// src/lib/trades.ts
// CLIENTOS - CONFIGURACIÓN COMPLETA DE OFICIOS
// Mantiene todos los oficios visibles en el selector y genera configuración premium para oficios nuevos.

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

type TradeSeed = {
  id: string
  name: string
  emoji: string
  category: keyof typeof CATEGORY_STYLES
  headline: string
  subtitle: string
  intro: string
  services: Array<{ name: string; desc: string; icon: string }>
  benefits: string[]
  process: Array<{ title: string; text: string }>
  faqs?: Array<{ q: string; a: string }>
}

const CATEGORY_STYLES = {
  hogar: {
    colors: { primary: '#12372a', secondary: '#2d6a4f', accent: '#c6a15b', cream: '#f8fafc', ink: '#0f172a' },
    images: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=1200&q=85&fit=crop',
    ],
  },
  jardin: {
    colors: { primary: '#174a2a', secondary: '#2f6f45', accent: '#b7a46a', cream: '#f6f8f4', ink: '#102014' },
    images: [
      'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1598282209224-2e7720b84e1c?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1563241527-3006b33bdc2f?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1548843476-f4e2b2c2f1b8?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1598902108854-10e335adac99?w=1200&q=85&fit=crop',
    ],
  },
  obra: {
    colors: { primary: '#1f2937', secondary: '#374151', accent: '#d97706', cream: '#f8fafc', ink: '#111827' },
    images: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=85&fit=crop',
    ],
  },
  belleza: {
    colors: { primary: '#422006', secondary: '#78350f', accent: '#d6a84f', cream: '#fffaf0', ink: '#1c1917' },
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=1200&q=85&fit=crop',
    ],
  },
  salud: {
    colors: { primary: '#0f3d3e', secondary: '#176b87', accent: '#64ccc5', cream: '#f0fdfa', ink: '#102a2b' },
    images: [
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=1200&q=85&fit=crop',
    ],
  },
  gastronomia: {
    colors: { primary: '#301114', secondary: '#7f1d1d', accent: '#d97706', cream: '#fffaf0', ink: '#1f0a0c' },
    images: [
      'https://images.unsplash.com/photo-1556910103-2bac2b332071?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1485521585311-498e557330a5?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1504674900967-b87b3f7c3d5e?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1495959915551-4e8d30928e4f?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=85&fit=crop',
    ],
  },
  eventos: {
    colors: { primary: '#2e1065', secondary: '#581c87', accent: '#c084fc', cream: '#faf5ff', ink: '#1e1b4b' },
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=85&fit=crop',
    ],
  },
  servicios: {
    colors: { primary: '#172554', secondary: '#1d4ed8', accent: '#f59e0b', cream: '#f8fafc', ink: '#0f172a' },
    images: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=85&fit=crop',
    ],
  },
  transporte: {
    colors: { primary: '#082f49', secondary: '#0369a1', accent: '#f59e0b', cream: '#f8fafc', ink: '#0c1b2a' },
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1200&q=85&fit=crop',
    ],
  },
  motor: {
    colors: { primary: '#111827', secondary: '#374151', accent: '#ef4444', cream: '#f8fafc', ink: '#111827' },
    images: [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200&q=85&fit=crop',
    ],
  },
}

const DEFAULT_FAQS = [
  { q: '¿Cómo puedo pedir presupuesto?', a: 'Puedes escribir por WhatsApp o enviar el formulario. Te responderemos con una propuesta clara y sin compromiso.' },
  { q: '¿Cuánto tiempo tarda el servicio?', a: 'Depende del tipo de trabajo. Antes de empezar te indicaremos plazos reales para que puedas organizarte bien.' },
  { q: '¿Trabajáis con cita previa?', a: 'Sí. Así podemos reservar el tiempo necesario y atenderte con calma desde el primer contacto.' },
  { q: '¿En qué zona trabajáis?', a: 'Trabajamos principalmente en la zona indicada en la web. Consulta disponibilidad por WhatsApp para confirmarlo.' },
]

const DEFAULT_TESTIMONIALS = [
  { name: 'Cliente verificado', role: 'Particular', text: 'Trato cercano, explicación clara y resultado muy cuidado. Lo recomendaría sin dudarlo.' },
  { name: 'María G.', role: 'Cliente', text: 'Respondieron rápido, entendieron lo que necesitaba y todo quedó tal como esperaba.' },
  { name: 'Carlos R.', role: 'Empresa', text: 'Servicio profesional de principio a fin. Se nota cuando alguien cuida los detalles.' },
]

function makeTrade(seed: TradeSeed): TradeConfig {
  const style = CATEGORY_STYLES[seed.category]
  return {
    id: seed.id,
    name: seed.name,
    emoji: seed.emoji,
    category: seed.category,
    colors: style.colors,
    heroImage: style.images[0],
    galleryImages: style.images,
    defaultHeadline: seed.headline,
    defaultSubtitle: seed.subtitle,
    defaultIntro: seed.intro,
    defaultServices: seed.services,
    defaultBenefits: seed.benefits,
    defaultProcess: seed.process,
    defaultTestimonials: DEFAULT_TESTIMONIALS,
    defaultFaqs: seed.faqs || DEFAULT_FAQS,
  }
}

const SEEDS: TradeSeed[] = [
  {
    id: 'jardineria', name: 'Jardinería', emoji: '🌿', category: 'jardin',
    headline: 'Jardines cuidados', subtitle: 'para disfrutar todo el año',
    intro: 'Diseño, mantenimiento y puesta a punto de jardines con atención cercana, orden y resultados visibles desde el primer servicio.',
    services: [
      { name: 'Mantenimiento de jardines', desc: 'Poda, limpieza, riego y cuidado general para que tu jardín esté siempre presentable.', icon: '🌿' },
      { name: 'Diseño de espacios verdes', desc: 'Propuestas bonitas, funcionales y adaptadas a tu espacio, clima y presupuesto.', icon: '🌱' },
      { name: 'Puesta a punto', desc: 'Recuperamos jardines descuidados y los dejamos listos para volver a disfrutarlos.', icon: '✨' },
    ],
    benefits: ['🌿 Espacios más cuidados', '📋 Presupuesto claro', '✅ Trabajo limpio y puntual'],
    process: [
      { title: 'Visita', text: 'Vemos el espacio y lo que necesitas' },
      { title: 'Propuesta', text: 'Te damos una solución clara' },
      { title: 'Trabajo', text: 'Cuidamos cada detalle del jardín' },
      { title: 'Seguimiento', text: 'Mantenimiento según temporada' },
    ],
  },
  {
    id: 'paisajismo', name: 'Paisajismo', emoji: '🌳', category: 'jardin',
    headline: 'Espacios verdes', subtitle: 'con diseño y armonía',
    intro: 'Creamos zonas exteriores bonitas, prácticas y pensadas para transmitir calma, valor y personalidad desde el primer vistazo.',
    services: [
      { name: 'Proyecto paisajístico', desc: 'Diseño completo del espacio con plantas, materiales y distribución visual.', icon: '🌳' },
      { name: 'Terrazas y patios', desc: 'Transformamos pequeños espacios en rincones acogedores y con estilo.', icon: '🏡' },
      { name: 'Riego y mantenimiento', desc: 'Soluciones para que el espacio se mantenga bonito con menos esfuerzo.', icon: '💧' },
    ],
    benefits: ['🌱 Diseño natural', '🏡 Más valor para tu espacio', '💧 Soluciones prácticas'],
    process: [
      { title: 'Análisis', text: 'Estudiamos luz, espacio y uso' },
      { title: 'Diseño', text: 'Creamos una propuesta visual' },
      { title: 'Ejecución', text: 'Montaje ordenado y cuidado' },
      { title: 'Cuidado', text: 'Te orientamos para mantenerlo' },
    ],
  },
  {
    id: 'reformas', name: 'Reformas Integrales', emoji: '🏗️', category: 'obra',
    headline: 'Reformas bien hechas', subtitle: 'sin sorpresas ni complicaciones',
    intro: 'Reformas de viviendas, locales y espacios profesionales con planificación clara, acabados cuidados y comunicación directa.',
    services: [
      { name: 'Reforma integral', desc: 'Coordinamos todo el proyecto para renovar tu espacio de principio a fin.', icon: '🏗️' },
      { name: 'Baños y cocinas', desc: 'Espacios funcionales, modernos y pensados para el uso diario.', icon: '🛁' },
      { name: 'Acabados y mejoras', desc: 'Pintura, suelos, detalles y ajustes para elevar la imagen del espacio.', icon: '✨' },
    ],
    benefits: ['📋 Presupuesto detallado', '👷 Equipo profesional', '🏠 Resultado cuidado'],
    process: [
      { title: 'Visita', text: 'Revisamos el espacio y prioridades' },
      { title: 'Presupuesto', text: 'Todo claro antes de empezar' },
      { title: 'Obra', text: 'Trabajo ordenado y coordinado' },
      { title: 'Entrega', text: 'Revisión final contigo' },
    ],
  },
  {
    id: 'cocinero', name: 'Catering y Chef', emoji: '👨‍🍳', category: 'gastronomia',
    headline: 'Una experiencia gastronómica', subtitle: 'para recordar',
    intro: 'Catering, menús privados y eventos gastronómicos con una propuesta cuidada, sabrosa y adaptada a cada ocasión.',
    services: [
      { name: 'Catering para eventos', desc: 'Menús personalizados para bodas, reuniones, celebraciones y empresas.', icon: '🍽️' },
      { name: 'Chef privado', desc: 'Una experiencia culinaria especial en casa, local o espacio privado.', icon: '👨‍🍳' },
      { name: 'Menús personalizados', desc: 'Opciones adaptadas a gustos, invitados, intolerancias y estilo del evento.', icon: '🥂' },
    ],
    benefits: ['👨‍🍳 Cocina cuidada', '🍽️ Menús personalizados', '✨ Presentación con detalle'],
    process: [
      { title: 'Consulta', text: 'Conocemos tu evento y gustos' },
      { title: 'Menú', text: 'Preparamos una propuesta clara' },
      { title: 'Servicio', text: 'Cocina y atención profesional' },
      { title: 'Experiencia', text: 'Todo listo para disfrutar' },
    ],
    faqs: [
      { q: '¿Hacéis menús personalizados?', a: 'Sí. Adaptamos la propuesta al tipo de evento, número de invitados y preferencias gastronómicas.' },
      { q: '¿Podéis adaptar intolerancias?', a: 'Sí. Podemos preparar opciones para intolerancias, alergias o dietas específicas si se avisa con antelación.' },
      { q: '¿Cuál es el mínimo de personas?', a: 'Depende del tipo de servicio. Escríbenos por WhatsApp y te indicamos disponibilidad y condiciones.' },
      { q: '¿Trabajáis en eventos privados?', a: 'Sí. Atendemos cenas privadas, celebraciones, empresas y eventos especiales según disponibilidad.' },
    ],
  },
  {
    id: 'transporte', name: 'Transporte y Logística', emoji: '🚚', category: 'transporte',
    headline: 'Transporte seguro', subtitle: 'cuando más lo necesitas',
    intro: 'Mudanzas, reparto y logística con coordinación clara, cuidado de la mercancía y respuesta rápida.',
    services: [
      { name: 'Mudanzas', desc: 'Traslado organizado para hogares, oficinas y pequeños negocios.', icon: '📦' },
      { name: 'Reparto local', desc: 'Entregas ágiles con seguimiento y comunicación clara.', icon: '🚚' },
      { name: 'Logística para negocios', desc: 'Apoyo flexible para mover productos, materiales o pedidos.', icon: '📍' },
    ],
    benefits: ['📦 Cuidado del material', '⏱️ Puntualidad', '🚚 Servicio flexible'],
    process: [
      { title: 'Consulta', text: 'Nos dices qué hay que mover' },
      { title: 'Plan', text: 'Organizamos ruta y horarios' },
      { title: 'Recogida', text: 'Cargamos con cuidado' },
      { title: 'Entrega', text: 'Confirmamos al finalizar' },
    ],
  },
  {
    id: 'emprendedor', name: 'Emprendedor', emoji: '🚀', category: 'servicios',
    headline: 'Una presencia profesional', subtitle: 'para vender con más confianza',
    intro: 'Soluciones para emprendedores que quieren mostrar una imagen clara, moderna y preparada para conseguir más oportunidades.',
    services: [
      { name: 'Servicio principal', desc: 'Presenta tu propuesta con claridad para que tus clientes entiendan rápido el valor.', icon: '🚀' },
      { name: 'Atención personalizada', desc: 'Acompañamiento directo, sencillo y enfocado en resolver necesidades reales.', icon: '🤝' },
      { name: 'Soluciones a medida', desc: 'Opciones adaptadas al momento, presupuesto y objetivo de cada cliente.', icon: '✨' },
    ],
    benefits: ['💼 Imagen profesional', '📲 Contacto directo', '✅ Propuesta clara'],
    process: [
      { title: 'Consulta', text: 'Entendemos lo que necesitas' },
      { title: 'Propuesta', text: 'Te damos opciones claras' },
      { title: 'Servicio', text: 'Trabajamos con orden' },
      { title: 'Resultado', text: 'Te acompañamos hasta cerrar' },
    ],
  },
  {
    id: 'fontaneria', name: 'Fontanería', emoji: '🔧', category: 'hogar',
    headline: 'Soluciones de fontanería', subtitle: 'rápidas y bien hechas',
    intro: 'Reparaciones, instalaciones y urgencias de fontanería con respuesta clara, trabajo limpio y presupuesto transparente.',
    services: [
      { name: 'Reparación de fugas', desc: 'Detectamos y solucionamos fugas con rapidez para evitar daños mayores.', icon: '💧' },
      { name: 'Instalaciones', desc: 'Montaje y sustitución de grifos, sanitarios, tuberías y equipos.', icon: '🔧' },
      { name: 'Urgencias', desc: 'Atención rápida para incidencias que no pueden esperar.', icon: '⚡' },
    ],
    benefits: ['💧 Respuesta rápida', '🧰 Trabajo limpio', '📋 Precio claro'],
    process: [{ title: 'Aviso', text: 'Nos explicas el problema' }, { title: 'Diagnóstico', text: 'Revisamos la solución' }, { title: 'Reparación', text: 'Trabajamos con cuidado' }, { title: 'Comprobación', text: 'Probamos todo antes de irnos' }],
  },
  {
    id: 'electricidad', name: 'Electricidad', emoji: '💡', category: 'hogar',
    headline: 'Electricidad segura', subtitle: 'para tu hogar o negocio',
    intro: 'Instalaciones, averías y mejoras eléctricas realizadas con seriedad, seguridad y explicación clara.',
    services: [
      { name: 'Averías eléctricas', desc: 'Localizamos el fallo y lo solucionamos con seguridad.', icon: '⚡' },
      { name: 'Instalaciones', desc: 'Enchufes, iluminación, cuadros eléctricos y mejoras para tu espacio.', icon: '💡' },
      { name: 'Mantenimiento', desc: 'Revisiones para prevenir problemas y mejorar la seguridad.', icon: '🧰' },
    ],
    benefits: ['⚡ Seguridad primero', '📋 Explicación clara', '✅ Trabajo garantizado'],
    process: [{ title: 'Consulta', text: 'Recibimos tu aviso' }, { title: 'Revisión', text: 'Detectamos la causa' }, { title: 'Solución', text: 'Reparamos con seguridad' }, { title: 'Verificación', text: 'Comprobamos funcionamiento' }],
  },
  {
    id: 'limpieza', name: 'Limpieza', emoji: '🧽', category: 'hogar',
    headline: 'Limpieza profesional', subtitle: 'para espacios que se notan',
    intro: 'Limpieza de hogares, oficinas, comunidades y locales con detalle, organización y resultados visibles.',
    services: [
      { name: 'Limpieza de hogar', desc: 'Servicio puntual o recurrente adaptado a tu rutina.', icon: '🏠' },
      { name: 'Oficinas y locales', desc: 'Espacios profesionales limpios, ordenados y listos para recibir clientes.', icon: '🏢' },
      { name: 'Limpieza profunda', desc: 'Puesta a punto tras obra, mudanza o temporadas de uso intenso.', icon: '✨' },
    ],
    benefits: ['🧽 Resultado visible', '⏱️ Puntualidad', '🔒 Confianza'],
    process: [{ title: 'Reserva', text: 'Elegimos día y horario' }, { title: 'Plan', text: 'Definimos prioridades' }, { title: 'Limpieza', text: 'Trabajamos cada zona' }, { title: 'Revisión', text: 'Confirmamos el resultado' }],
  },
  {
    id: 'pintura', name: 'Pintura', emoji: '🎨', category: 'obra',
    headline: 'Pintura que renueva', subtitle: 'tu espacio al instante',
    intro: 'Pintura interior y exterior con acabados limpios, protección del espacio y asesoramiento en color.',
    services: [
      { name: 'Pintura interior', desc: 'Habitaciones, salones, locales y oficinas con acabado profesional.', icon: '🎨' },
      { name: 'Pintura exterior', desc: 'Fachadas y exteriores preparados para resistir mejor el paso del tiempo.', icon: '🏘️' },
      { name: 'Reparación de paredes', desc: 'Alisado, masillado y preparación para un resultado impecable.', icon: '🧱' },
    ],
    benefits: ['🎨 Acabado limpio', '🧼 Protección del espacio', '📋 Presupuesto claro'],
    process: [{ title: 'Visita', text: 'Vemos paredes y medidas' }, { title: 'Color', text: 'Te orientamos si lo necesitas' }, { title: 'Preparación', text: 'Protegemos y preparamos' }, { title: 'Pintura', text: 'Entregamos limpio y cuidado' }],
  },
  {
    id: 'carpinteria', name: 'Carpintería', emoji: '🪵', category: 'hogar',
    headline: 'Carpintería a medida', subtitle: 'con acabados que elevan tu espacio',
    intro: 'Muebles, puertas, armarios y trabajos en madera realizados con precisión, estilo y atención al detalle.',
    services: [
      { name: 'Muebles a medida', desc: 'Diseñados para aprovechar cada rincón y adaptarse a tu estilo.', icon: '🪵' },
      { name: 'Puertas y armarios', desc: 'Instalación, reparación y renovación con acabados cuidados.', icon: '🚪' },
      { name: 'Reparaciones', desc: 'Ajustes, restauración y mejoras para piezas existentes.', icon: '🧰' },
    ],
    benefits: ['🪵 Trabajo a medida', '📐 Precisión', '✨ Acabados cuidados'],
    process: [{ title: 'Medición', text: 'Tomamos medidas exactas' }, { title: 'Diseño', text: 'Definimos materiales y estilo' }, { title: 'Fabricación', text: 'Preparamos cada pieza' }, { title: 'Montaje', text: 'Instalación limpia y segura' }],
  },
  {
    id: 'cerrajeria', name: 'Cerrajería', emoji: '🔐', category: 'hogar',
    headline: 'Cerrajería de confianza', subtitle: 'cuando necesitas seguridad',
    intro: 'Aperturas, cambios de cerradura y soluciones de seguridad con atención rápida y trato profesional.',
    services: [
      { name: 'Apertura de puertas', desc: 'Servicio rápido para accesos bloqueados o pérdida de llaves.', icon: '🔑' },
      { name: 'Cambio de cerraduras', desc: 'Sustitución e instalación de cerraduras más seguras.', icon: '🔐' },
      { name: 'Seguridad', desc: 'Bombines, escudos y refuerzos para proteger mejor tu vivienda o local.', icon: '🛡️' },
    ],
    benefits: ['⚡ Atención rápida', '🔐 Seguridad', '📋 Precio claro'],
    process: [{ title: 'Aviso', text: 'Nos cuentas la urgencia' }, { title: 'Llegada', text: 'Acudimos lo antes posible' }, { title: 'Solución', text: 'Abrimos o cambiamos' }, { title: 'Consejo', text: 'Te orientamos en seguridad' }],
  },
  {
    id: 'albanileria', name: 'Albañilería', emoji: '🧱', category: 'obra',
    headline: 'Trabajos de albañilería', subtitle: 'con base sólida',
    intro: 'Reparaciones, tabiquería, alicatados y pequeños trabajos de obra con orden, limpieza y buen acabado.',
    services: [
      { name: 'Reparaciones', desc: 'Solucionamos desperfectos, humedades, grietas y mejoras puntuales.', icon: '🧱' },
      { name: 'Alicatados', desc: 'Colocación de azulejos y revestimientos con acabado profesional.', icon: '⬜' },
      { name: 'Pequeñas reformas', desc: 'Cambios prácticos para mejorar tu vivienda, local u oficina.', icon: '🏗️' },
    ],
    benefits: ['🧱 Trabajo resistente', '🧼 Obra limpia', '📋 Presupuesto claro'],
    process: [{ title: 'Revisión', text: 'Vemos el trabajo a realizar' }, { title: 'Materiales', text: 'Definimos opciones' }, { title: 'Ejecución', text: 'Trabajamos con orden' }, { title: 'Entrega', text: 'Revisamos el acabado' }],
  },
  {
    id: 'peluqueria', name: 'Peluquería', emoji: '💇‍♀️', category: 'belleza',
    headline: 'Un look que te favorece', subtitle: 'desde el primer momento',
    intro: 'Cortes, color y peinados con asesoramiento cercano para que salgas con una imagen cuidada y segura.',
    services: [
      { name: 'Corte y estilo', desc: 'Corte adaptado a tu rostro, rutina y forma de llevar el cabello.', icon: '✂️' },
      { name: 'Coloración', desc: 'Color, mechas y tratamientos con acabado natural y cuidado del cabello.', icon: '🎨' },
      { name: 'Peinados', desc: 'Looks para eventos, celebraciones o momentos especiales.', icon: '✨' },
    ],
    benefits: ['💇 Asesoramiento cercano', '✨ Imagen cuidada', '🧴 Productos de calidad'],
    process: [{ title: 'Consulta', text: 'Vemos qué buscas' }, { title: 'Asesoría', text: 'Te proponemos opciones' }, { title: 'Servicio', text: 'Trabajamos tu look' }, { title: 'Acabado', text: 'Te vas lista para lucirlo' }],
  },
  {
    id: 'barberia', name: 'Barbería', emoji: '💈', category: 'belleza',
    headline: 'Estilo cuidado', subtitle: 'con precisión de barbería',
    intro: 'Cortes, barba y perfilado con atención al detalle para una imagen limpia, actual y con personalidad.',
    services: [
      { name: 'Corte masculino', desc: 'Cortes modernos, clásicos o personalizados según tu estilo.', icon: '💇‍♂️' },
      { name: 'Arreglo de barba', desc: 'Perfilado, hidratación y acabado para una barba impecable.', icon: '🧔' },
      { name: 'Ritual completo', desc: 'Corte, barba y acabado premium en una sola visita.', icon: '💈' },
    ],
    benefits: ['💈 Precisión', '🧔 Imagen cuidada', '⏱️ Reserva fácil'],
    process: [{ title: 'Reserva', text: 'Eliges hora' }, { title: 'Consulta', text: 'Definimos estilo' }, { title: 'Corte', text: 'Trabajamos con detalle' }, { title: 'Acabado', text: 'Perfilado final' }],
  },
  {
    id: 'estetica', name: 'Estética', emoji: '💆‍♀️', category: 'belleza',
    headline: 'Cuidado personal', subtitle: 'para verte y sentirte mejor',
    intro: 'Tratamientos faciales, corporales y de belleza con atención personalizada, higiene y resultados visibles.',
    services: [
      { name: 'Tratamientos faciales', desc: 'Limpieza, hidratación y cuidado de la piel según tus necesidades.', icon: '💆‍♀️' },
      { name: 'Tratamientos corporales', desc: 'Opciones para relajación, firmeza y bienestar.', icon: '🌿' },
      { name: 'Belleza y cuidado', desc: 'Servicios para ocasiones especiales o mantenimiento personal.', icon: '✨' },
    ],
    benefits: ['✨ Cuidado personalizado', '🧴 Higiene profesional', '🌿 Bienestar'],
    process: [{ title: 'Valoración', text: 'Analizamos lo que necesitas' }, { title: 'Tratamiento', text: 'Elegimos la mejor opción' }, { title: 'Cuidado', text: 'Aplicamos cada paso' }, { title: 'Recomendación', text: 'Te guiamos para mantenerlo' }],
  },
  {
    id: 'manicura', name: 'Manicura y Uñas', emoji: '💅', category: 'belleza',
    headline: 'Uñas cuidadas', subtitle: 'con estilo propio',
    intro: 'Manicura, esmaltado y diseño de uñas con acabado limpio, duración y atención al detalle.',
    services: [
      { name: 'Manicura clásica', desc: 'Cuidado de manos y uñas con acabado elegante y natural.', icon: '💅' },
      { name: 'Semipermanente', desc: 'Color duradero, brillo y acabado resistente.', icon: '✨' },
      { name: 'Diseño de uñas', desc: 'Decoraciones personalizadas para cada estilo u ocasión.', icon: '🎨' },
    ],
    benefits: ['💅 Acabado limpio', '✨ Duración', '🎨 Diseño personalizado'],
    process: [{ title: 'Elección', text: 'Definimos color y estilo' }, { title: 'Preparación', text: 'Cuidamos la uña' }, { title: 'Aplicación', text: 'Trabajamos el diseño' }, { title: 'Acabado', text: 'Sellado final' }],
  },
  {
    id: 'maquillaje', name: 'Maquillaje', emoji: '💄', category: 'belleza',
    headline: 'Maquillaje que realza', subtitle: 'tu mejor versión',
    intro: 'Maquillaje social, eventos, novias y sesiones con una propuesta adaptada a tu rostro, estilo y ocasión.',
    services: [
      { name: 'Maquillaje social', desc: 'Look favorecedor para celebraciones, reuniones o momentos especiales.', icon: '💄' },
      { name: 'Novias y eventos', desc: 'Maquillaje duradero, elegante y pensado para fotografía.', icon: '👰' },
      { name: 'Asesoría', desc: 'Aprende tonos, productos y técnicas que te favorecen.', icon: '✨' },
    ],
    benefits: ['💄 Look favorecedor', '📸 Acabado fotogénico', '✨ Duración'],
    process: [{ title: 'Consulta', text: 'Vemos estilo y ocasión' }, { title: 'Prueba', text: 'Ajustamos detalles' }, { title: 'Maquillaje', text: 'Aplicación profesional' }, { title: 'Retoque', text: 'Acabado perfecto' }],
  },
  {
    id: 'masajes', name: 'Masajes', emoji: '💆', category: 'salud',
    headline: 'Relaja el cuerpo', subtitle: 'y recupera energía',
    intro: 'Masajes de bienestar, relajación y descarga muscular en un ambiente cuidado y con atención personalizada.',
    services: [
      { name: 'Masaje relajante', desc: 'Ideal para liberar tensión y desconectar del estrés diario.', icon: '🌿' },
      { name: 'Descarga muscular', desc: 'Trabajo enfocado en zonas cargadas por deporte, trabajo o postura.', icon: '💪' },
      { name: 'Bienestar integral', desc: 'Sesiones adaptadas a lo que tu cuerpo necesita en cada momento.', icon: '✨' },
    ],
    benefits: ['🌿 Relax', '💪 Alivio muscular', '🕯️ Atención personalizada'],
    process: [{ title: 'Valoración', text: 'Hablamos de molestias' }, { title: 'Sesión', text: 'Trabajamos por zonas' }, { title: 'Ajuste', text: 'Adaptamos intensidad' }, { title: 'Bienestar', text: 'Te vas con más calma' }],
  },
  {
    id: 'fisioterapia', name: 'Fisioterapia', emoji: '🦴', category: 'salud',
    headline: 'Muévete mejor', subtitle: 'con tratamiento profesional',
    intro: 'Fisioterapia para dolor, recuperación y mejora funcional con valoración individual y seguimiento cercano.',
    services: [
      { name: 'Dolor y lesiones', desc: 'Tratamientos para molestias musculares, articulares y sobrecargas.', icon: '🦴' },
      { name: 'Rehabilitación', desc: 'Recuperación progresiva tras lesión, cirugía o baja movilidad.', icon: '🏃' },
      { name: 'Prevención', desc: 'Pautas y ejercicios para evitar recaídas y mejorar tu día a día.', icon: '✅' },
    ],
    benefits: ['🦴 Valoración individual', '📋 Plan claro', '✅ Seguimiento'],
    process: [{ title: 'Valoración', text: 'Entendemos tu caso' }, { title: 'Tratamiento', text: 'Aplicamos terapia adecuada' }, { title: 'Ejercicios', text: 'Te damos pautas' }, { title: 'Seguimiento', text: 'Medimos evolución' }],
  },
  {
    id: 'entrenador', name: 'Entrenador Personal', emoji: '🏋️', category: 'salud',
    headline: 'Entrena con objetivo', subtitle: 'y avanza con seguridad',
    intro: 'Entrenamiento personal adaptado a tu nivel, tiempo y meta, con acompañamiento para mantener constancia.',
    services: [
      { name: 'Plan personalizado', desc: 'Rutinas adaptadas a tu nivel, objetivo y disponibilidad.', icon: '🏋️' },
      { name: 'Pérdida de grasa', desc: 'Entrenamiento y hábitos para mejorar composición corporal.', icon: '🔥' },
      { name: 'Fuerza y salud', desc: 'Mejora física con técnica, progresión y seguridad.', icon: '💪' },
    ],
    benefits: ['🏋️ Plan a medida', '📈 Progreso medible', '🤝 Acompañamiento'],
    process: [{ title: 'Valoración', text: 'Medimos punto de partida' }, { title: 'Plan', text: 'Definimos objetivos' }, { title: 'Entreno', text: 'Trabajamos paso a paso' }, { title: 'Seguimiento', text: 'Ajustamos según progreso' }],
  },
  {
    id: 'nutricion', name: 'Nutrición', emoji: '🥗', category: 'salud',
    headline: 'Come mejor', subtitle: 'sin complicarte la vida',
    intro: 'Planes de nutrición realistas, adaptados a tus horarios, gustos y objetivos para mejorar hábitos de forma sostenible.',
    services: [
      { name: 'Plan nutricional', desc: 'Propuesta adaptada a tu rutina y objetivo.', icon: '🥗' },
      { name: 'Educación alimentaria', desc: 'Aprende a comer mejor sin depender de dietas extremas.', icon: '📘' },
      { name: 'Seguimiento', desc: 'Ajustes periódicos para mantener motivación y resultados.', icon: '📈' },
    ],
    benefits: ['🥗 Plan realista', '📋 Hábitos sostenibles', '✅ Seguimiento'],
    process: [{ title: 'Consulta', text: 'Conocemos tu rutina' }, { title: 'Plan', text: 'Diseñamos opciones' }, { title: 'Aplicación', text: 'Empiezas con guía' }, { title: 'Ajuste', text: 'Mejoramos según evolución' }],
  },
  {
    id: 'psicologia', name: 'Psicología', emoji: '🧠', category: 'salud',
    headline: 'Un espacio seguro', subtitle: 'para entenderte mejor',
    intro: 'Acompañamiento psicológico profesional, cercano y respetuoso para trabajar lo que necesitas a tu ritmo.',
    services: [
      { name: 'Terapia individual', desc: 'Sesiones para ansiedad, estrés, autoestima, duelo o procesos personales.', icon: '🧠' },
      { name: 'Acompañamiento emocional', desc: 'Herramientas para afrontar situaciones difíciles con más claridad.', icon: '🌿' },
      { name: 'Orientación personal', desc: 'Un espacio para tomar decisiones y recuperar equilibrio.', icon: '🤝' },
    ],
    benefits: ['🤝 Confidencialidad', '🌿 Trato cercano', '📋 Proceso personalizado'],
    process: [{ title: 'Primera sesión', text: 'Conocemos tu situación' }, { title: 'Objetivos', text: 'Definimos prioridades' }, { title: 'Trabajo', text: 'Avanzamos sesión a sesión' }, { title: 'Seguimiento', text: 'Revisamos progreso' }],
  },
  {
    id: 'fotografia', name: 'Fotografía', emoji: '📸', category: 'eventos',
    headline: 'Imágenes que cuentan', subtitle: 'lo importante',
    intro: 'Fotografía para eventos, marcas, familias y proyectos con mirada cuidada, natural y profesional.',
    services: [
      { name: 'Eventos', desc: 'Capturamos momentos clave con discreción y sensibilidad.', icon: '📸' },
      { name: 'Retratos y marca', desc: 'Imágenes profesionales para mostrar tu mejor versión.', icon: '👤' },
      { name: 'Producto y negocio', desc: 'Fotos cuidadas para vender mejor y transmitir confianza.', icon: '🛍️' },
    ],
    benefits: ['📸 Mirada profesional', '✨ Edición cuidada', '⏱️ Entrega clara'],
    process: [{ title: 'Brief', text: 'Entendemos el estilo' }, { title: 'Sesión', text: 'Fotografiamos con guía' }, { title: 'Edición', text: 'Cuidamos color y detalle' }, { title: 'Entrega', text: 'Recibes galería final' }],
  },
  {
    id: 'video', name: 'Vídeo y Producción', emoji: '🎥', category: 'eventos',
    headline: 'Vídeos que conectan', subtitle: 'y elevan tu imagen',
    intro: 'Producción de vídeo para marcas, eventos y redes sociales con narrativa, ritmo y acabado profesional.',
    services: [
      { name: 'Vídeo corporativo', desc: 'Presenta tu negocio de forma clara, atractiva y profesional.', icon: '🎥' },
      { name: 'Contenido para redes', desc: 'Piezas ágiles para Instagram, TikTok y campañas digitales.', icon: '📱' },
      { name: 'Eventos', desc: 'Grabación y edición de momentos importantes con calidad visual.', icon: '🎬' },
    ],
    benefits: ['🎥 Imagen profesional', '📱 Formato redes', '✨ Edición cuidada'],
    process: [{ title: 'Idea', text: 'Definimos mensaje' }, { title: 'Guion', text: 'Organizamos tomas' }, { title: 'Rodaje', text: 'Grabamos con calidad' }, { title: 'Edición', text: 'Entregamos pieza final' }],
  },
  {
    id: 'musica', name: 'Música y Eventos', emoji: '🎵', category: 'eventos',
    headline: 'Ambiente perfecto', subtitle: 'para cada celebración',
    intro: 'Música en vivo, DJ y animación para eventos con selección cuidada y energía adaptada al público.',
    services: [
      { name: 'DJ para eventos', desc: 'Música adaptada al ambiente, público y momento de la celebración.', icon: '🎧' },
      { name: 'Música en vivo', desc: 'Actuaciones para crear una experiencia cercana y especial.', icon: '🎵' },
      { name: 'Animación', desc: 'Dinámica y energía para que el evento fluya mejor.', icon: '🎤' },
    ],
    benefits: ['🎵 Ambiente cuidado', '🎧 Repertorio flexible', '✨ Experiencia memorable'],
    process: [{ title: 'Consulta', text: 'Vemos estilo y evento' }, { title: 'Selección', text: 'Preparamos repertorio' }, { title: 'Montaje', text: 'Organizamos sonido' }, { title: 'Evento', text: 'Creamos el ambiente' }],
  },
  {
    id: 'decoracion', name: 'Decoración de Eventos', emoji: '🎈', category: 'eventos',
    headline: 'Eventos con estilo', subtitle: 'desde el primer detalle',
    intro: 'Decoración para bodas, cumpleaños, empresas y celebraciones con estética cuidada y montaje profesional.',
    services: [
      { name: 'Decoración temática', desc: 'Diseño visual adaptado a tu celebración y personalidad.', icon: '🎈' },
      { name: 'Mesas y ambientes', desc: 'Montajes bonitos, equilibrados y listos para sorprender.', icon: '🕯️' },
      { name: 'Eventos corporativos', desc: 'Imagen cuidada para presentaciones, cenas y experiencias de marca.', icon: '🏢' },
    ],
    benefits: ['🎈 Estética cuidada', '📋 Montaje organizado', '✨ Resultado memorable'],
    process: [{ title: 'Idea', text: 'Definimos estilo' }, { title: 'Propuesta', text: 'Elegimos colores y elementos' }, { title: 'Montaje', text: 'Instalamos con detalle' }, { title: 'Evento', text: 'Todo listo para disfrutar' }],
  },
  {
    id: 'inmobiliaria', name: 'Inmobiliaria', emoji: '🏡', category: 'servicios',
    headline: 'Encuentra tu lugar', subtitle: 'con asesoría clara',
    intro: 'Compra, venta y alquiler de propiedades con acompañamiento cercano, información transparente y gestión profesional.',
    services: [
      { name: 'Venta de inmuebles', desc: 'Valoración, publicación y gestión para vender con mayor seguridad.', icon: '🏡' },
      { name: 'Alquiler', desc: 'Búsqueda y gestión de alquileres para propietarios e inquilinos.', icon: '🔑' },
      { name: 'Asesoría', desc: 'Te guiamos en documentación, visitas y decisiones importantes.', icon: '📋' },
    ],
    benefits: ['🏡 Gestión clara', '📋 Acompañamiento', '🔑 Trato directo'],
    process: [{ title: 'Consulta', text: 'Entendemos lo que buscas' }, { title: 'Selección', text: 'Filtramos opciones' }, { title: 'Visitas', text: 'Coordinamos cada paso' }, { title: 'Cierre', text: 'Acompañamos la gestión' }],
  },
  {
    id: 'asesoria', name: 'Asesoría', emoji: '📊', category: 'servicios',
    headline: 'Gestión clara', subtitle: 'para tomar mejores decisiones',
    intro: 'Asesoría fiscal, laboral y contable para autónomos, empresas y emprendedores que quieren tranquilidad.',
    services: [
      { name: 'Fiscalidad', desc: 'Declaraciones, impuestos y planificación para evitar sorpresas.', icon: '📊' },
      { name: 'Contabilidad', desc: 'Control ordenado de cuentas, facturas y obligaciones.', icon: '📚' },
      { name: 'Laboral', desc: 'Nóminas, contratos y gestión administrativa con seguimiento.', icon: '👥' },
    ],
    benefits: ['📊 Orden financiero', '📋 Explicación sencilla', '✅ Cumplimiento'],
    process: [{ title: 'Consulta', text: 'Revisamos tu situación' }, { title: 'Organización', text: 'Pedimos documentación' }, { title: 'Gestión', text: 'Tramitamos lo necesario' }, { title: 'Seguimiento', text: 'Te avisamos a tiempo' }],
  },
  {
    id: 'abogado', name: 'Abogado', emoji: '⚖️', category: 'servicios',
    headline: 'Defiende tus intereses', subtitle: 'con orientación profesional',
    intro: 'Asesoramiento legal claro y acompañamiento en trámites, conflictos y decisiones importantes.',
    services: [
      { name: 'Consulta legal', desc: 'Analizamos tu caso y te explicamos opciones de forma sencilla.', icon: '⚖️' },
      { name: 'Contratos y documentos', desc: 'Revisión y preparación de documentos legales con detalle.', icon: '📄' },
      { name: 'Representación', desc: 'Acompañamiento en procedimientos y negociaciones.', icon: '🤝' },
    ],
    benefits: ['⚖️ Claridad legal', '📋 Estrategia', '🤝 Acompañamiento'],
    process: [{ title: 'Consulta', text: 'Nos cuentas el caso' }, { title: 'Análisis', text: 'Revisamos documentos' }, { title: 'Estrategia', text: 'Te damos opciones' }, { title: 'Acción', text: 'Avanzamos con seguridad' }],
  },
  {
    id: 'marketing', name: 'Marketing Digital', emoji: '📣', category: 'servicios',
    headline: 'Más visibilidad', subtitle: 'para atraer clientes reales',
    intro: 'Publicidad, redes sociales y estrategia digital para negocios que quieren vender mejor y proyectar confianza.',
    services: [
      { name: 'Publicidad online', desc: 'Campañas enfocadas en clientes potenciales y resultados medibles.', icon: '📣' },
      { name: 'Redes sociales', desc: 'Contenido y presencia para que tu marca se vea activa y profesional.', icon: '📱' },
      { name: 'Estrategia', desc: 'Plan claro para ordenar tu comunicación y mejorar conversiones.', icon: '📈' },
    ],
    benefits: ['📣 Más alcance', '📱 Imagen activa', '📈 Datos claros'],
    process: [{ title: 'Diagnóstico', text: 'Vemos tu situación actual' }, { title: 'Plan', text: 'Definimos objetivos' }, { title: 'Campaña', text: 'Lanzamos acciones' }, { title: 'Optimización', text: 'Medimos y ajustamos' }],
  },
  {
    id: 'diseno_web', name: 'Diseño Web', emoji: '🌐', category: 'servicios',
    headline: 'Una web profesional', subtitle: 'que transmite confianza',
    intro: 'Diseño de páginas web modernas, claras y enfocadas en convertir visitas en contactos reales.',
    services: [
      { name: 'Landing page', desc: 'Página clara, atractiva y pensada para captar clientes.', icon: '🌐' },
      { name: 'Web corporativa', desc: 'Presencia digital completa para mostrar servicios y autoridad.', icon: '💻' },
      { name: 'Optimización', desc: 'Mejoras de velocidad, diseño, contenido y conversión.', icon: '⚡' },
    ],
    benefits: ['🌐 Imagen profesional', '📲 Contacto directo', '⚡ Carga rápida'],
    process: [{ title: 'Brief', text: 'Entendemos tu negocio' }, { title: 'Diseño', text: 'Creamos la estructura' }, { title: 'Desarrollo', text: 'Montamos la web' }, { title: 'Lanzamiento', text: 'Publicamos y revisamos' }],
  },
  {
    id: 'academia', name: 'Academia y Formación', emoji: '🎓', category: 'servicios',
    headline: 'Aprende con guía', subtitle: 'y avanza con claridad',
    intro: 'Clases, cursos y acompañamiento formativo para estudiantes, profesionales y personas que quieren mejorar habilidades.',
    services: [
      { name: 'Clases particulares', desc: 'Apoyo adaptado al nivel y objetivos de cada alumno.', icon: '📚' },
      { name: 'Cursos', desc: 'Formación estructurada para aprender de forma práctica.', icon: '🎓' },
      { name: 'Preparación', desc: 'Ayuda para exámenes, pruebas o procesos concretos.', icon: '✅' },
    ],
    benefits: ['🎓 Método claro', '📚 Atención personalizada', '📈 Progreso'],
    process: [{ title: 'Nivel', text: 'Vemos punto de partida' }, { title: 'Objetivo', text: 'Definimos metas' }, { title: 'Clases', text: 'Trabajamos con método' }, { title: 'Seguimiento', text: 'Medimos avances' }],
  },
  {
    id: 'consultoria', name: 'Consultoría', emoji: '💼', category: 'servicios',
    headline: 'Decisiones más claras', subtitle: 'para crecer con orden',
    intro: 'Consultoría para negocios que necesitan estrategia, organización y acompañamiento para avanzar mejor.',
    services: [
      { name: 'Diagnóstico', desc: 'Analizamos situación, problemas y oportunidades del negocio.', icon: '🔎' },
      { name: 'Plan de acción', desc: 'Definimos pasos concretos, prioridades y métricas.', icon: '📋' },
      { name: 'Acompañamiento', desc: 'Seguimiento para implementar sin perder foco.', icon: '🤝' },
    ],
    benefits: ['💼 Estrategia', '📋 Orden', '📈 Crecimiento'],
    process: [{ title: 'Análisis', text: 'Entendemos el negocio' }, { title: 'Plan', text: 'Priorizamos acciones' }, { title: 'Implementación', text: 'Avanzamos paso a paso' }, { title: 'Medición', text: 'Revisamos resultados' }],
  },
  {
    id: 'tienda', name: 'Tienda y Comercio', emoji: '🛍️', category: 'servicios',
    headline: 'Productos con atención cercana', subtitle: 'y compra sencilla',
    intro: 'Comercio local y venta de productos con asesoramiento, trato directo y una experiencia de compra cuidada.',
    services: [
      { name: 'Venta de productos', desc: 'Selección cuidada para que encuentres justo lo que necesitas.', icon: '🛍️' },
      { name: 'Asesoramiento', desc: 'Te ayudamos a elegir según uso, gusto y presupuesto.', icon: '🤝' },
      { name: 'Pedidos y reservas', desc: 'Consulta disponibilidad y encarga por WhatsApp fácilmente.', icon: '📲' },
    ],
    benefits: ['🛍️ Atención cercana', '📲 Reserva fácil', '✨ Selección cuidada'],
    process: [{ title: 'Consulta', text: 'Dinos qué buscas' }, { title: 'Opciones', text: 'Te recomendamos' }, { title: 'Reserva', text: 'Confirmamos disponibilidad' }, { title: 'Entrega', text: 'Recogida o envío según caso' }],
  },
  {
    id: 'restaurante', name: 'Restaurante', emoji: '🍽️', category: 'gastronomia',
    headline: 'Sabores que invitan', subtitle: 'a volver',
    intro: 'Cocina cuidada, ambiente agradable y atención cercana para disfrutar una experiencia completa.',
    services: [
      { name: 'Carta y menú', desc: 'Platos preparados con mimo y opciones para diferentes gustos.', icon: '🍽️' },
      { name: 'Reservas', desc: 'Organiza tu visita de forma fácil y recibe atención directa.', icon: '📅' },
      { name: 'Eventos y grupos', desc: 'Opciones para celebraciones, comidas de empresa o reuniones.', icon: '🥂' },
    ],
    benefits: ['🍽️ Cocina cuidada', '📍 Ambiente agradable', '📲 Reserva fácil'],
    process: [{ title: 'Reserva', text: 'Elige día y hora' }, { title: 'Llegada', text: 'Te recibimos con atención' }, { title: 'Servicio', text: 'Disfrutas la experiencia' }, { title: 'Final', text: 'Cuidamos cada detalle' }],
  },
  {
    id: 'panaderia', name: 'Panadería', emoji: '🥐', category: 'gastronomia',
    headline: 'Producto fresco', subtitle: 'con sabor de cada día',
    intro: 'Pan, bollería y elaboraciones artesanas preparadas con cuidado para disfrutar en casa, trabajo o celebraciones.',
    services: [
      { name: 'Pan artesano', desc: 'Variedades frescas con buena textura, sabor y elaboración cuidada.', icon: '🥖' },
      { name: 'Bollería', desc: 'Dulces y piezas perfectas para desayunos, meriendas y eventos.', icon: '🥐' },
      { name: 'Pedidos', desc: 'Encargos para reuniones, empresas y celebraciones.', icon: '📦' },
    ],
    benefits: ['🥐 Frescura diaria', '🥖 Elaboración cuidada', '📲 Encargos fáciles'],
    process: [{ title: 'Consulta', text: 'Dinos qué necesitas' }, { title: 'Preparación', text: 'Elaboramos el pedido' }, { title: 'Recogida', text: 'Lo dejamos listo' }, { title: 'Disfrute', text: 'Producto fresco en tu mesa' }],
  },
  {
    id: 'pasteleria', name: 'Pastelería', emoji: '🍰', category: 'gastronomia',
    headline: 'Dulces momentos', subtitle: 'con presentación impecable',
    intro: 'Tartas, postres y mesas dulces para celebraciones con sabor, detalle y un acabado que entra por los ojos.',
    services: [
      { name: 'Tartas personalizadas', desc: 'Diseños adaptados a cumpleaños, bodas y eventos especiales.', icon: '🎂' },
      { name: 'Postres', desc: 'Opciones dulces para compartir o sorprender.', icon: '🍰' },
      { name: 'Mesas dulces', desc: 'Montajes bonitos y completos para celebraciones.', icon: '✨' },
    ],
    benefits: ['🎂 Diseño personalizado', '🍰 Sabor cuidado', '✨ Presentación bonita'],
    process: [{ title: 'Idea', text: 'Vemos ocasión y estilo' }, { title: 'Diseño', text: 'Definimos sabores y formato' }, { title: 'Preparación', text: 'Elaboramos con cuidado' }, { title: 'Entrega', text: 'Todo listo para celebrar' }],
  },
  {
    id: 'floristeria', name: 'Floristería', emoji: '💐', category: 'jardin',
    headline: 'Flores que emocionan', subtitle: 'en cada ocasión',
    intro: 'Ramos, arreglos y decoración floral para regalar, celebrar o dar vida a cualquier espacio.',
    services: [
      { name: 'Ramos personalizados', desc: 'Composiciones adaptadas al mensaje, estilo y presupuesto.', icon: '💐' },
      { name: 'Eventos', desc: 'Decoración floral para bodas, empresas y celebraciones.', icon: '🌸' },
      { name: 'Entrega', desc: 'Encargos preparados con mimo y opción de entrega según zona.', icon: '🚚' },
    ],
    benefits: ['💐 Diseño floral', '🌸 Frescura', '📲 Encargos fáciles'],
    process: [{ title: 'Ocasión', text: 'Nos dices para quién es' }, { title: 'Diseño', text: 'Elegimos flores y colores' }, { title: 'Preparación', text: 'Montamos con detalle' }, { title: 'Entrega', text: 'Listo para sorprender' }],
  },
  {
    id: 'mascotas', name: 'Mascotas', emoji: '🐾', category: 'servicios',
    headline: 'Cuidado para mascotas', subtitle: 'con cariño y confianza',
    intro: 'Servicios para perros, gatos y mascotas con trato responsable, atención cercana y mucho cuidado.',
    services: [
      { name: 'Paseos', desc: 'Salidas seguras y adaptadas al ritmo de cada mascota.', icon: '🐕' },
      { name: 'Cuidado', desc: 'Atención en casa o por horas según necesidad.', icon: '🐾' },
      { name: 'Higiene y bienestar', desc: 'Apoyo para mantener a tu mascota cómoda y cuidada.', icon: '🛁' },
    ],
    benefits: ['🐾 Trato cariñoso', '🔒 Confianza', '📲 Comunicación directa'],
    process: [{ title: 'Conocer', text: 'Hablamos de tu mascota' }, { title: 'Rutina', text: 'Definimos horarios' }, { title: 'Servicio', text: 'Cuidamos con atención' }, { title: 'Aviso', text: 'Te mantenemos informado' }],
  },
  {
    id: 'veterinaria', name: 'Veterinaria', emoji: '🐶', category: 'salud',
    headline: 'Salud animal', subtitle: 'con atención de confianza',
    intro: 'Atención veterinaria para cuidar la salud y bienestar de tu mascota con explicación clara y trato cercano.',
    services: [
      { name: 'Consulta veterinaria', desc: 'Revisión, diagnóstico y orientación para el cuidado de tu mascota.', icon: '🐶' },
      { name: 'Vacunas y prevención', desc: 'Control sanitario para proteger su salud a largo plazo.', icon: '💉' },
      { name: 'Seguimiento', desc: 'Acompañamiento en tratamientos y evolución.', icon: '📋' },
    ],
    benefits: ['🐶 Trato cercano', '📋 Diagnóstico claro', '❤️ Bienestar animal'],
    process: [{ title: 'Consulta', text: 'Vemos síntomas o revisión' }, { title: 'Diagnóstico', text: 'Explicamos opciones' }, { title: 'Tratamiento', text: 'Indicamos cuidados' }, { title: 'Control', text: 'Hacemos seguimiento' }],
  },
  {
    id: 'taller_mecanico', name: 'Taller Mecánico', emoji: '🔩', category: 'motor',
    headline: 'Tu vehículo en buenas manos', subtitle: 'con diagnóstico claro',
    intro: 'Mecánica, mantenimiento y reparaciones para que conduzcas con seguridad y confianza.',
    services: [
      { name: 'Mantenimiento', desc: 'Revisiones, aceite, filtros y puesta a punto del vehículo.', icon: '🔧' },
      { name: 'Reparaciones', desc: 'Solución de averías mecánicas con explicación clara.', icon: '🔩' },
      { name: 'Diagnóstico', desc: 'Identificamos el problema antes de cambiar piezas innecesarias.', icon: '🧰' },
    ],
    benefits: ['🔧 Diagnóstico claro', '🚗 Seguridad', '📋 Presupuesto transparente'],
    process: [{ title: 'Entrada', text: 'Recibimos el vehículo' }, { title: 'Diagnóstico', text: 'Revisamos avería' }, { title: 'Reparación', text: 'Trabajamos con piezas adecuadas' }, { title: 'Entrega', text: 'Explicamos lo realizado' }],
  },
  {
    id: 'lavado_coches', name: 'Lavado de Coches', emoji: '🚗', category: 'motor',
    headline: 'Tu coche como nuevo', subtitle: 'por dentro y por fuera',
    intro: 'Lavado, detailing y limpieza profunda de vehículos con acabado cuidado y atención a cada detalle.',
    services: [
      { name: 'Lavado exterior', desc: 'Limpieza y acabado brillante para una mejor imagen del vehículo.', icon: '🚗' },
      { name: 'Interior', desc: 'Aspirado, limpieza de tapicería y detalle interior.', icon: '🧽' },
      { name: 'Detailing', desc: 'Tratamientos más completos para proteger y mejorar el acabado.', icon: '✨' },
    ],
    benefits: ['🚗 Acabado brillante', '🧽 Interior cuidado', '✨ Detalle premium'],
    process: [{ title: 'Reserva', text: 'Eliges servicio' }, { title: 'Limpieza', text: 'Trabajamos exterior e interior' }, { title: 'Detalle', text: 'Cuidamos acabados' }, { title: 'Entrega', text: 'Vehículo listo' }],
  },
  {
    id: 'seguridad', name: 'Seguridad', emoji: '🛡️', category: 'servicios',
    headline: 'Protección y tranquilidad', subtitle: 'para tu espacio',
    intro: 'Servicios y soluciones de seguridad para viviendas, negocios y eventos con profesionalidad y discreción.',
    services: [
      { name: 'Seguridad privada', desc: 'Apoyo profesional para eventos, locales o instalaciones.', icon: '🛡️' },
      { name: 'Control de accesos', desc: 'Gestión de entradas y supervisión de zonas sensibles.', icon: '🚪' },
      { name: 'Asesoría de seguridad', desc: 'Evaluación de riesgos y recomendaciones prácticas.', icon: '📋' },
    ],
    benefits: ['🛡️ Tranquilidad', '👁️ Supervisión', '🤝 Discreción'],
    process: [{ title: 'Análisis', text: 'Vemos necesidad' }, { title: 'Plan', text: 'Definimos cobertura' }, { title: 'Servicio', text: 'Ejecutamos con control' }, { title: 'Informe', text: 'Cerramos con seguimiento' }],
  },
  {
    id: 'mudanzas', name: 'Mudanzas', emoji: '📦', category: 'transporte',
    headline: 'Mudanzas sin estrés', subtitle: 'con todo organizado',
    intro: 'Traslados de hogar, oficina y pequeños negocios con cuidado, planificación y comunicación constante.',
    services: [
      { name: 'Mudanza completa', desc: 'Organizamos carga, traslado y descarga de tus pertenencias.', icon: '📦' },
      { name: 'Embalaje', desc: 'Protección de objetos delicados y preparación segura.', icon: '🧰' },
      { name: 'Transporte puntual', desc: 'Traslados pequeños, muebles o entregas especiales.', icon: '🚚' },
    ],
    benefits: ['📦 Cuidado', '⏱️ Puntualidad', '🚚 Organización'],
    process: [{ title: 'Consulta', text: 'Vemos volumen y ruta' }, { title: 'Plan', text: 'Definimos fecha' }, { title: 'Traslado', text: 'Movemos con cuidado' }, { title: 'Entrega', text: 'Dejamos todo en destino' }],
  },
  {
    id: 'mensajeria', name: 'Mensajería', emoji: '📮', category: 'transporte',
    headline: 'Entregas rápidas', subtitle: 'con seguimiento claro',
    intro: 'Mensajería local y entregas para particulares o negocios con respuesta ágil y trato responsable.',
    services: [
      { name: 'Entrega local', desc: 'Recogida y entrega dentro de la zona con rapidez.', icon: '📮' },
      { name: 'Documentos', desc: 'Transporte de documentos y paquetes pequeños con cuidado.', icon: '📄' },
      { name: 'Empresas', desc: 'Apoyo recurrente para repartos de negocios.', icon: '🏢' },
    ],
    benefits: ['📮 Rapidez', '📲 Comunicación', '✅ Entrega confirmada'],
    process: [{ title: 'Pedido', text: 'Indicas recogida y destino' }, { title: 'Ruta', text: 'Organizamos entrega' }, { title: 'Reparto', text: 'Transportamos con cuidado' }, { title: 'Confirmación', text: 'Avisamos al entregar' }],
  },
  {
    id: 'organizacion_eventos', name: 'Organización de Eventos', emoji: '🥂', category: 'eventos',
    headline: 'Eventos bien pensados', subtitle: 'para disfrutar sin preocuparte',
    intro: 'Planificación y coordinación de celebraciones, empresas y experiencias privadas con estética y orden.',
    services: [
      { name: 'Planificación', desc: 'Organizamos proveedores, tiempos y necesidades del evento.', icon: '📋' },
      { name: 'Coordinación', desc: 'Acompañamos el día del evento para que todo fluya.', icon: '🥂' },
      { name: 'Diseño de experiencia', desc: 'Cuidamos ambiente, detalles y recorrido de los invitados.', icon: '✨' },
    ],
    benefits: ['🥂 Organización', '📋 Tranquilidad', '✨ Detalle'],
    process: [{ title: 'Idea', text: 'Entendemos el evento' }, { title: 'Plan', text: 'Definimos presupuesto y estilo' }, { title: 'Gestión', text: 'Coordinamos proveedores' }, { title: 'Evento', text: 'Cuidamos el día completo' }],
  },
]

export const TRADES: Record<string, TradeConfig> = Object.fromEntries(
  SEEDS.map(seed => [seed.id, makeTrade(seed)])
) as Record<string, TradeConfig>

const TRADE_ALIASES: Record<string, string> = {
  chef: 'cocinero',
  catering: 'cocinero',
  cocinera: 'cocinero',
  cocina: 'cocinero',
  restaurante: 'restaurante',
  restaurante_bar: 'restaurante',
  jardinero: 'jardineria',
  jardinera: 'jardineria',
  jardin: 'jardineria',
  paisajista: 'paisajismo',
  reforma: 'reformas',
  reformas_integrales: 'reformas',
  construccion: 'reformas',
  obra: 'albanileria',
  albanil: 'albanileria',
  fontanero: 'fontaneria',
  fontanera: 'fontaneria',
  electricista: 'electricidad',
  limpieza_hogar: 'limpieza',
  limpiador: 'limpieza',
  pintor: 'pintura',
  pintora: 'pintura',
  carpintero: 'carpinteria',
  carpintera: 'carpinteria',
  cerrajero: 'cerrajeria',
  cerrajera: 'cerrajeria',
  peluquero: 'peluqueria',
  peluquera: 'peluqueria',
  barber: 'barberia',
  esteticien: 'estetica',
  uñas: 'manicura',
  unas: 'manicura',
  maquillaje: 'maquillaje',
  maquilladora: 'maquillaje',
  masajista: 'masajes',
  fisio: 'fisioterapia',
  fisioterapeuta: 'fisioterapia',
  personal_trainer: 'entrenador',
  entrenador_personal: 'entrenador',
  nutricionista: 'nutricion',
  psicologo: 'psicologia',
  psicologa: 'psicologia',
  fotografo: 'fotografia',
  fotografa: 'fotografia',
  videografo: 'video',
  videografa: 'video',
  dj: 'musica',
  musico: 'musica',
  musica_eventos: 'musica',
  decorador: 'decoracion',
  decoradora: 'decoracion',
  inmobiliario: 'inmobiliaria',
  asesor: 'asesoria',
  asesoria_fiscal: 'asesoria',
  abogada: 'abogado',
  marketing_digital: 'marketing',
  web: 'diseno_web',
  diseño_web: 'diseno_web',
  diseno_web: 'diseno_web',
  formacion: 'academia',
  cursos: 'academia',
  consultor: 'consultoria',
  consultora: 'consultoria',
  comercio: 'tienda',
  tienda_online: 'tienda',
  panadero: 'panaderia',
  panadera: 'panaderia',
  pastelero: 'pasteleria',
  pastelera: 'pasteleria',
  florista: 'floristeria',
  mascota: 'mascotas',
  veterinario: 'veterinaria',
  veterinaria: 'veterinaria',
  mecanico: 'taller_mecanico',
  mecanica: 'taller_mecanico',
  taller: 'taller_mecanico',
  lavado: 'lavado_coches',
  lavado_coches: 'lavado_coches',
  seguridad_privada: 'seguridad',
  mudanza: 'mudanzas',
  mensajero: 'mensajeria',
  organizador_eventos: 'organizacion_eventos',
  organizadora_eventos: 'organizacion_eventos',
}

function slugifyTrade(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')
    .replace(/&/g, 'y')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

function buildAutoTrade(rawTrade: string): TradeConfig {
  const clean = rawTrade?.trim() || 'Emprendedor'
  const id = slugifyTrade(clean) || 'emprendedor'
  const lower = id

  let category: keyof typeof CATEGORY_STYLES = 'servicios'
  let emoji = '🚀'

  if (/jardin|paisaj|flor/.test(lower)) { category = 'jardin'; emoji = '🌿' }
  else if (/reform|obra|alban|pint|carpint|fontan|electric|cerraj|limp/.test(lower)) { category = 'obra'; emoji = '🧰' }
  else if (/cocin|chef|catering|restaurante|panader|pasteler|comida|bar/.test(lower)) { category = 'gastronomia'; emoji = '🍽️' }
  else if (/pelu|barber|estetic|unas|uñas|maquill/.test(lower)) { category = 'belleza'; emoji = '✨' }
  else if (/fisio|salud|nutri|psico|masaj|entren|veterin/.test(lower)) { category = 'salud'; emoji = '🌿' }
  else if (/foto|video|evento|musica|dj|decor/.test(lower)) { category = 'eventos'; emoji = '🎉' }
  else if (/transport|mudanz|mensaj|logistic|repart/.test(lower)) { category = 'transporte'; emoji = '🚚' }
  else if (/taller|mecanic|coche|auto|lavado/.test(lower)) { category = 'motor'; emoji = '🚗' }

  return makeTrade({
    id,
    name: clean.charAt(0).toUpperCase() + clean.slice(1),
    emoji,
    category,
    headline: 'Un servicio profesional',
    subtitle: 'pensado para ayudarte',
    intro: 'Atención cercana, comunicación clara y una forma de trabajar pensada para que sepas qué vas a recibir desde el primer mensaje.',
    services: [
      { name: 'Atención personalizada', desc: 'Escuchamos lo que necesitas y te damos una solución clara.', icon: '🤝' },
      { name: 'Servicio profesional', desc: 'Trabajamos con orden, cuidado y compromiso en cada detalle.', icon: emoji },
      { name: 'Presupuesto claro', desc: 'Te explicamos opciones, tiempos y condiciones antes de empezar.', icon: '📋' },
    ],
    benefits: ['🤝 Trato cercano', '📋 Información clara', '✅ Resultado cuidado'],
    process: [
      { title: 'Consulta', text: 'Nos cuentas qué necesitas' },
      { title: 'Propuesta', text: 'Te explicamos opciones' },
      { title: 'Servicio', text: 'Trabajamos con cuidado' },
      { title: 'Resultado', text: 'Revisamos contigo' },
    ],
  })
}

export function getTradeConfig(tradeId: string): TradeConfig {
  const normalized = slugifyTrade(tradeId || 'emprendedor')
  const resolved = TRADE_ALIASES[normalized] || normalized
  return TRADES[resolved] || buildAutoTrade(tradeId || 'Emprendedor')
}
