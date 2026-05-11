
export interface TradeConfig {
  id: string
  name: string
  emoji: string
  category: string
  group: string
  demand?: number
  colors: { primary: string; secondary: string; accent: string; cream: string; ink: string }
  heroImage: string
  galleryImages: string[]
  defaultHeadline: string
  defaultSubtitle: string
  defaultIntro: string
  defaultAboutTitle: string
  defaultAboutText: string
  defaultAboutImage: string
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
  group: string
  demand?: number
  headline: string
  subtitle: string
  intro: string
  aboutTitle: string
  aboutText: string
  services: Array<{ name: string; desc: string; icon: string }>
  benefits: string[]
  process: Array<{ title: string; text: string }>
  testimonials?: Array<{ name: string; role: string; text: string }>
  faqs?: Array<{ q: string; a: string }>
}

// 🎨 PALETA DE COLORES MEJORADA POR COLORMETRÍA
// Colores armoniosos, con contraste y accesibilidad WCAG AA
const CATEGORY_STYLES = {
  hogar: {
    colors: { primary: '#2D5016', secondary: '#5A7B3D', accent: '#D4A574', cream: '#F5F3F0', ink: '#1a1a1a' },
    images: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=85&fit=crop',
    ],
  },
  jardin: {
    colors: { primary: '#1B5E4E', secondary: '#3D8A7E', accent: '#B8956A', cream: '#F4F8F6', ink: '#0f2b27' },
    images: [
      'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1598282209224-2e7720b84e1c?w=1200&q=85&fit=crop',
    ],
  },
  obra: {
    colors: { primary: '#4A4A4A', secondary: '#757575', accent: '#E8931D', cream: '#F5F5F5', ink: '#1a1a1a' },
    images: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1494145904049-0dca59b4bbad?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85&fit=crop',
    ],
  },
  belleza: {
    colors: { primary: '#6B4E71', secondary: '#9B7B9E', accent: '#D4A5A5', cream: '#FBF7FA', ink: '#2a1a2a' },
    images: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=1200&q=85&fit=crop',
    ],
  },
  salud: {
    colors: { primary: '#1B5E7E', secondary: '#3D92B8', accent: '#7BD3C7', cream: '#F0FBFA', ink: '#0f2a35' },
    images: [
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1494026892-80bbd2d6fd0d?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&q=85&fit=crop',
    ],
  },
  gastronomia: {
    colors: { primary: '#6B3838', secondary: '#A85050', accent: '#E8931D', cream: '#FBF7F4', ink: '#2a1515' },
    images: [
      'https://images.unsplash.com/photo-1556910103-2bac2b332071?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1485521585311-498e557330a5?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1504674900967-b87b3f7c3d5e?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1495959915551-4e8d30928e4f?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=85&fit=crop',
    ],
  },
  eventos: {
    colors: { primary: '#4A3B6B', secondary: '#7B5FA5', accent: '#D4B5E8', cream: '#FAF7FB', ink: '#1a0f2a' },
    images: [
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1200&q=85&fit=crop',
    ],
  },
  servicios: {
    colors: { primary: '#2D5A7B', secondary: '#5A8AB8', accent: '#D4A06B', cream: '#F5F8FA', ink: '#1a2f42' },
    images: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&q=85&fit=crop',
    ],
  },
  transporte: {
    colors: { primary: '#1A4A6B', secondary: '#3D7BA5', accent: '#D4A574', cream: '#F5F8FA', ink: '#0f1f2a' },
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&q=85&fit=crop',
    ],
  },
  motor: {
    colors: { primary: '#3A3A3A', secondary: '#6B6B6B', accent: '#E85C5C', cream: '#F5F5F5', ink: '#1a1a1a' },
    images: [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1600&q=85&fit=crop',
      'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85&fit=crop',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=85&fit=crop',
    ],
  },
}

const DEFAULT_TESTIMONIALS = [
  { name: 'Cliente verificado', role: 'Particular', text: 'Trato cercano, explicación clara y resultado muy cuidado. Lo recomendaría sin dudarlo.' },
  { name: 'María G.', role: 'Cliente', text: 'Respondieron rápido, entendieron lo que necesitaba y todo quedó tal como esperaba.' },
  { name: 'Carlos R.', role: 'Empresa', text: 'Servicio profesional de principio a fin. Se nota cuando alguien cuida los detalles.' },
]

const DEFAULT_FAQS = [
  { q: '¿Cómo puedo pedir presupuesto?', a: 'Puedes escribir por WhatsApp o enviar el formulario. Te responderemos con una propuesta clara y sin compromiso.' },
  { q: '¿Cuánto tiempo tarda el servicio?', a: 'Depende del tipo de trabajo. Antes de empezar te indicaremos plazos reales para que puedas organizarte bien.' },
  { q: '¿Trabajáis con cita previa?', a: 'Sí. Así podemos reservar el tiempo necesario y atenderte con calma desde el primer contacto.' },
  { q: '¿En qué zona trabajáis?', a: 'Trabajamos principalmente en la zona indicada en la web. Consulta disponibilidad por WhatsApp para confirmarlo.' },
]

function makeTrade(seed: TradeSeed): TradeConfig {
  const style = CATEGORY_STYLES[seed.category]
  return {
    id: seed.id,
    name: seed.name,
    emoji: seed.emoji,
    category: seed.category,
    group: seed.group,
    demand: seed.demand || 5,
    colors: style.colors,
    heroImage: style.images[0],
    galleryImages: style.images,
    defaultHeadline: seed.headline,
    defaultSubtitle: seed.subtitle,
    defaultIntro: seed.intro,
    defaultAboutTitle: seed.aboutTitle,
    defaultAboutText: seed.aboutText,
    defaultAboutImage: style.images[1],
    defaultServices: seed.services,
    defaultBenefits: seed.benefits,
    defaultProcess: seed.process,
    defaultTestimonials: seed.testimonials || DEFAULT_TESTIMONIALS,
    defaultFaqs: seed.faqs || DEFAULT_FAQS,
  }
}

const SEEDS: TradeSeed[] = [
  // ============================================
  // 🌿 GRUPO: JARDINERÍA & PAISAJISMO
  // ============================================
  {
    id: 'jardineria', name: 'Jardinería', emoji: '🌿', category: 'jardin', group: 'Jardinería & Paisajismo', demand: 8,
    headline: 'Jardines cuidados', subtitle: 'para disfrutar todo el año',
    intro: 'Diseño, mantenimiento y puesta a punto de jardines con atención cercana, orden y resultados visibles desde el primer servicio.',
    aboutTitle: 'Expertos en espacios verdes', aboutText: 'Contamos con años de experiencia transformando espacios descuidados en jardines hermosos y funcionales.',
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
    id: 'paisajismo', name: 'Paisajismo', emoji: '🌳', category: 'jardin', group: 'Jardinería & Paisajismo', demand: 7,
    headline: 'Espacios verdes', subtitle: 'con diseño y armonía',
    intro: 'Creamos zonas exteriores bonitas, prácticas y pensadas para transmitir calma, valor y personalidad desde el primer vistazo.',
    aboutTitle: 'Diseño paisajístico profesional', aboutText: 'Nos especializamos en crear ambientes exteriores que reflejan tu estilo y funcionan perfectamente.',
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
    id: 'floristeria', name: 'Floristería', emoji: '💐', category: 'jardin', group: 'Jardinería & Paisajismo', demand: 6,
    headline: 'Flores que emocionan', subtitle: 'en cada ocasión',
    intro: 'Ramos, arreglos y decoración floral para regalar, celebrar o dar vida a cualquier espacio.',
    aboutTitle: 'Arte floral con pasión', aboutText: 'Cada ramo es una obra de arte pensada para expresar sentimientos y crear momentos especiales.',
    services: [
      { name: 'Ramos personalizados', desc: 'Composiciones adaptadas al mensaje, estilo y presupuesto.', icon: '💐' },
      { name: 'Eventos', desc: 'Decoración floral para bodas, empresas y celebraciones.', icon: '🌸' },
      { name: 'Entrega', desc: 'Encargos preparados con mimo y opción de entrega según zona.', icon: '🚚' },
    ],
    benefits: ['💐 Diseño floral', '🌸 Frescura garantizada', '📲 Encargos fáciles'],
    process: [
      { title: 'Ocasión', text: 'Nos dices para quién es' },
      { title: 'Diseño', text: 'Elegimos flores y colores' },
      { title: 'Preparación', text: 'Montamos con detalle' },
      { title: 'Entrega', text: 'Listo para sorprender' },
    ],
  },

  // ============================================
  // 🏠 GRUPO: HOGAR (REPARACIONES & MEJORAS)
  // ============================================
  {
    id: 'fontaneria', name: 'Fontanería', emoji: '🔧', category: 'hogar', group: 'Hogar (Reparaciones)', demand: 9,
    headline: 'Soluciones de fontanería', subtitle: 'rápidas y bien hechas',
    intro: 'Reparaciones, instalaciones y urgencias de fontanería con respuesta clara, trabajo limpio y presupuesto transparente.',
    aboutTitle: 'Fontanería confiable', aboutText: 'Reparamos y instalamos sistemas hidráulicos con eficiencia y profesionalismo.',
    services: [
      { name: 'Reparación de fugas', desc: 'Detectamos y solucionamos fugas con rapidez para evitar daños mayores.', icon: '💧' },
      { name: 'Instalaciones', desc: 'Montaje y sustitución de grifos, sanitarios, tuberías y equipos.', icon: '🔧' },
      { name: 'Urgencias', desc: 'Atención rápida para incidencias que no pueden esperar.', icon: '⚡' },
    ],
    benefits: ['💧 Respuesta rápida', '🧰 Trabajo limpio', '📋 Precio claro'],
    process: [
      { title: 'Aviso', text: 'Nos explicas el problema' },
      { title: 'Diagnóstico', text: 'Revisamos la solución' },
      { title: 'Reparación', text: 'Trabajamos con cuidado' },
      { title: 'Comprobación', text: 'Probamos todo antes de irnos' },
    ],
  },
  {
    id: 'electricidad', name: 'Electricidad', emoji: '💡', category: 'hogar', group: 'Hogar (Reparaciones)', demand: 9,
    headline: 'Electricidad segura', subtitle: 'para tu hogar o negocio',
    intro: 'Instalaciones, averías y mejoras eléctricas realizadas con seriedad, seguridad y explicación clara.',
    aboutTitle: 'Seguridad eléctrica garantizada', aboutText: 'Electricistas certificados que garantizan instalaciones seguras y cumplidoras con toda normativa.',
    services: [
      { name: 'Averías eléctricas', desc: 'Localizamos el fallo y lo solucionamos con seguridad.', icon: '⚡' },
      { name: 'Instalaciones', desc: 'Enchufes, iluminación, cuadros eléctricos y mejoras para tu espacio.', icon: '💡' },
      { name: 'Mantenimiento', desc: 'Revisiones para prevenir problemas y mejorar la seguridad.', icon: '🧰' },
    ],
    benefits: ['⚡ Seguridad primero', '📋 Explicación clara', '✅ Trabajo garantizado'],
    process: [
      { title: 'Consulta', text: 'Recibimos tu aviso' },
      { title: 'Revisión', text: 'Detectamos la causa' },
      { title: 'Solución', text: 'Reparamos con seguridad' },
      { title: 'Verificación', text: 'Comprobamos funcionamiento' },
    ],
  },
  {
    id: 'limpieza', name: 'Limpieza', emoji: '🧽', category: 'hogar', group: 'Hogar (Reparaciones)', demand: 8,
    headline: 'Limpieza profesional', subtitle: 'para espacios que se notan',
    intro: 'Limpieza de hogares, oficinas, comunidades y locales con detalle, organización y resultados visibles.',
    aboutTitle: 'Espacios impecables', aboutText: 'Especializados en limpiezas profesionales que dejan tus espacios relucientes.',
    services: [
      { name: 'Limpieza de hogar', desc: 'Servicio puntual o recurrente adaptado a tu rutina.', icon: '🏠' },
      { name: 'Oficinas y locales', desc: 'Espacios profesionales limpios, ordenados y listos para recibir clientes.', icon: '🏢' },
      { name: 'Limpieza profunda', desc: 'Puesta a punto tras obra, mudanza o temporadas de uso intenso.', icon: '✨' },
    ],
    benefits: ['🧽 Resultado visible', '⏱️ Puntualidad', '🔒 Confianza'],
    process: [
      { title: 'Reserva', text: 'Elegimos día y horario' },
      { title: 'Plan', text: 'Definimos prioridades' },
      { title: 'Limpieza', text: 'Trabajamos cada zona' },
      { title: 'Revisión', text: 'Confirmamos el resultado' },
    ],
  },
  {
    id: 'cerrajeria', name: 'Cerrajería', emoji: '🔐', category: 'hogar', group: 'Hogar (Reparaciones)', demand: 8,
    headline: 'Cerrajería de confianza', subtitle: 'cuando necesitas seguridad',
    intro: 'Aperturas, cambios de cerradura y soluciones de seguridad con atención rápida y trato profesional.',
    aboutTitle: 'Seguridad para tu hogar', aboutText: 'Cerrajeros expertos en aperturas de emergencia, cambios de cerraduras y soluciones de seguridad integral.',
    services: [
      { name: 'Apertura de puertas', desc: 'Servicio rápido para accesos bloqueados o pérdida de llaves.', icon: '🔑' },
      { name: 'Cambio de cerraduras', desc: 'Sustitución e instalación de cerraduras más seguras.', icon: '🔐' },
      { name: 'Seguridad', desc: 'Bombines, escudos y refuerzos para proteger mejor tu vivienda o local.', icon: '🛡️' },
    ],
    benefits: ['⚡ Atención rápida', '🔐 Seguridad', '📋 Precio claro'],
    process: [
      { title: 'Aviso', text: 'Nos cuentas la urgencia' },
      { title: 'Llegada', text: 'Acudimos lo antes posible' },
      { title: 'Solución', text: 'Abrimos o cambiamos' },
      { title: 'Consejo', text: 'Te orientamos en seguridad' },
    ],
  },
  {
    id: 'carpinteria', name: 'Carpintería', emoji: '🪵', category: 'hogar', group: 'Hogar (Reparaciones)', demand: 8,
    headline: 'Carpintería a medida', subtitle: 'con acabados que elevan tu espacio',
    intro: 'Muebles, puertas, armarios y trabajos en madera realizados con precisión, estilo y atención al detalle.',
    aboutTitle: 'Maestría en madera', aboutText: 'Creamos piezas duraderas y hermosas que se adaptan perfectamente a tu hogar o negocio.',
    services: [
      { name: 'Muebles a medida', desc: 'Diseñados para aprovechar cada rincón y adaptarse a tu estilo.', icon: '🪵' },
      { name: 'Puertas y armarios', desc: 'Instalación, reparación y renovación con acabados cuidados.', icon: '🚪' },
      { name: 'Reparaciones', desc: 'Ajustes, restauración y mejoras para piezas existentes.', icon: '🧰' },
    ],
    benefits: ['🪵 Trabajo a medida', '📐 Precisión', '✨ Acabados cuidados'],
    process: [
      { title: 'Medición', text: 'Tomamos medidas exactas' },
      { title: 'Diseño', text: 'Definimos materiales y estilo' },
      { title: 'Fabricación', text: 'Preparamos cada pieza' },
      { title: 'Montaje', text: 'Instalación limpia y segura' },
    ],
  },

  // ============================================
  // 🏗️ GRUPO: REFORMA & CONSTRUCCIÓN
  // ============================================
  {
    id: 'reformas', name: 'Reformas Integrales', emoji: '🏗️', category: 'obra', group: 'Reforma & Construcción', demand: 9,
    headline: 'Reformas bien hechas', subtitle: 'sin sorpresas ni complicaciones',
    intro: 'Reformas de viviendas, locales y espacios profesionales con planificación clara, acabados cuidados y comunicación directa.',
    aboutTitle: 'Transformamos espacios', aboutText: 'Especializados en reformas integrales que respetan plazos y presupuestos.',
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
    id: 'pintura', name: 'Pintura', emoji: '🎨', category: 'obra', group: 'Reforma & Construcción', demand: 8,
    headline: 'Pintura que renueva', subtitle: 'tu espacio al instante',
    intro: 'Pintura interior y exterior con acabados limpios, protección del espacio y asesoramiento en color.',
    aboutTitle: 'Acabados impecables', aboutText: 'Con años de experiencia en pintura residencial y comercial, garantizamos acabados profesionales y duraderos.',
    services: [
      { name: 'Pintura interior', desc: 'Habitaciones, salones, locales y oficinas con acabado profesional.', icon: '🎨' },
      { name: 'Pintura exterior', desc: 'Fachadas y exteriores preparados para resistir mejor el paso del tiempo.', icon: '🏘️' },
      { name: 'Reparación de paredes', desc: 'Alisado, masillado y preparación para un resultado impecable.', icon: '🧱' },
    ],
    benefits: ['🎨 Acabado limpio', '🧼 Protección del espacio', '📋 Presupuesto claro'],
    process: [
      { title: 'Visita', text: 'Vemos paredes y medidas' },
      { title: 'Color', text: 'Te orientamos si lo necesitas' },
      { title: 'Preparación', text: 'Protegemos y preparamos' },
      { title: 'Pintura', text: 'Entregamos limpio y cuidado' },
    ],
  },

  // ============================================
  // 🍽️ GRUPO: GASTRONOMÍA & ALIMENTACIÓN
  // ============================================
  {
    id: 'cocinero', name: 'Catering y Chef', emoji: '👨‍🍳', category: 'gastronomia', group: 'Gastronomía & Alimentación', demand: 7,
    headline: 'Una experiencia gastronómica', subtitle: 'para recordar',
    intro: 'Catering, menús privados y eventos gastronómicos con una propuesta cuidada, sabrosa y adaptada a cada ocasión.',
    aboutTitle: 'Cocina de calidad', aboutText: 'Cocineros profesionales que transforman ingredientes en experiencias.',
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
  },
  {
    id: 'restaurante', name: 'Restaurante', emoji: '🍽️', category: 'gastronomia', group: 'Gastronomía & Alimentación', demand: 7,
    headline: 'Sabores que invitan', subtitle: 'a volver',
    intro: 'Cocina cuidada, ambiente agradable y atención cercana para disfrutar una experiencia completa.',
    aboutTitle: 'Tu mesa de confianza', aboutText: 'Un restaurante donde cada plato cuenta una historia y cada cliente es tratado como familia.',
    services: [
      { name: 'Carta y menú', desc: 'Platos preparados con mimo y opciones para diferentes gustos.', icon: '🍽️' },
      { name: 'Reservas', desc: 'Organiza tu visita de forma fácil y recibe atención directa.', icon: '📅' },
      { name: 'Eventos y grupos', desc: 'Opciones para celebraciones, comidas de empresa o reuniones.', icon: '🥂' },
    ],
    benefits: ['🍽️ Cocina cuidada', '📍 Ambiente agradable', '📲 Reserva fácil'],
    process: [
      { title: 'Reserva', text: 'Elige día y hora' },
      { title: 'Llegada', text: 'Te recibimos con atención' },
      { title: 'Servicio', text: 'Disfrutas la experiencia' },
      { title: 'Final', text: 'Cuidamos cada detalle' },
    ],
  },
  {
    id: 'panaderia', name: 'Panadería', emoji: '🥐', category: 'gastronomia', group: 'Gastronomía & Alimentación', demand: 6,
    headline: 'Producto fresco', subtitle: 'con sabor de cada día',
    intro: 'Pan, bollería y elaboraciones artesanas preparadas con cuidado para disfrutar en casa, trabajo o celebraciones.',
    aboutTitle: 'Pan artesano diario', aboutText: 'Panadería tradicional que elabora pan fresco cada día con ingredientes de calidad.',
    services: [
      { name: 'Pan artesano', desc: 'Variedades frescas con buena textura, sabor y elaboración cuidada.', icon: '🥖' },
      { name: 'Bollería', desc: 'Dulces y piezas perfectas para desayunos, meriendas y eventos.', icon: '🥐' },
      { name: 'Pedidos', desc: 'Encargos para reuniones, empresas y celebraciones.', icon: '📦' },
    ],
    benefits: ['🥐 Frescura diaria', '🥖 Elaboración cuidada', '📲 Encargos fáciles'],
    process: [
      { title: 'Consulta', text: 'Dinos qué necesitas' },
      { title: 'Preparación', text: 'Elaboramos el pedido' },
      { title: 'Recogida', text: 'Lo dejamos listo' },
      { title: 'Disfrute', text: 'Producto fresco en tu mesa' },
    ],
  },
  {
    id: 'pasteleria', name: 'Pastelería', emoji: '🍰', category: 'gastronomia', group: 'Gastronomía & Alimentación', demand: 6,
    headline: 'Dulces momentos', subtitle: 'con presentación impecable',
    intro: 'Tartas, postres y mesas dulces para celebraciones con sabor, detalle y un acabado que entra por los ojos.',
    aboutTitle: 'Dulces personalizados', aboutText: 'Creamos tartas y postres que son tan bonitos como deliciosos.',
    services: [
      { name: 'Tartas personalizadas', desc: 'Diseños adaptados a cumpleaños, bodas y eventos especiales.', icon: '🎂' },
      { name: 'Postres', desc: 'Opciones dulces para compartir o sorprender.', icon: '🍰' },
      { name: 'Mesas dulces', desc: 'Montajes bonitos y completos para celebraciones.', icon: '✨' },
    ],
    benefits: ['🎂 Diseño personalizado', '🍰 Sabor cuidado', '✨ Presentación bonita'],
    process: [
      { title: 'Idea', text: 'Vemos ocasión y estilo' },
      { title: 'Diseño', text: 'Definimos sabores y formato' },
      { title: 'Preparación', text: 'Elaboramos con cuidado' },
      { title: 'Entrega', text: 'Todo listo para celebrar' },
    ],
  },

  // ============================================
  // 💄 GRUPO: BELLEZA & ESTÉTICA
  // ============================================
  {
    id: 'peluqueria', name: 'Peluquería', emoji: '💇‍♀️', category: 'belleza', group: 'Belleza & Estética', demand: 8,
    headline: 'Un look que te favorece', subtitle: 'desde el primer momento',
    intro: 'Cortes, color y peinados con asesoramiento cercano para que salgas con una imagen cuidada y segura.',
    aboutTitle: 'Tu estilo perfecto', aboutText: 'Estilistas expertos que conocen las tendencias pero respetan tu personalidad.',
    services: [
      { name: 'Corte y estilo', desc: 'Corte adaptado a tu rostro, rutina y forma de llevar el cabello.', icon: '✂️' },
      { name: 'Coloración', desc: 'Color, mechas y tratamientos con acabado natural y cuidado del cabello.', icon: '🎨' },
      { name: 'Peinados', desc: 'Looks para eventos, celebraciones o momentos especiales.', icon: '✨' },
    ],
    benefits: ['💇 Asesoramiento cercano', '✨ Imagen cuidada', '🧴 Productos de calidad'],
    process: [
      { title: 'Consulta', text: 'Vemos qué buscas' },
      { title: 'Asesoría', text: 'Te proponemos opciones' },
      { title: 'Servicio', text: 'Trabajamos tu look' },
      { title: 'Acabado', text: 'Te vas lista para lucirlo' },
    ],
  },
  {
    id: 'barberia', name: 'Barbería', emoji: '💈', category: 'belleza', group: 'Belleza & Estética', demand: 7,
    headline: 'Estilo cuidado', subtitle: 'con precisión de barbería',
    intro: 'Cortes, barba y perfilado con atención al detalle para una imagen limpia, actual y con personalidad.',
    aboutTitle: 'Barbería tradicional', aboutText: 'Barberos profesionales que dominan técnicas tradicionales y modernas.',
    services: [
      { name: 'Corte masculino', desc: 'Cortes modernos, clásicos o personalizados según tu estilo.', icon: '💇‍♂️' },
      { name: 'Arreglo de barba', desc: 'Perfilado, hidratación y acabado para una barba impecable.', icon: '🧔' },
      { name: 'Ritual completo', desc: 'Corte, barba y acabado premium en una sola visita.', icon: '💈' },
    ],
    benefits: ['💈 Precisión', '🧔 Imagen cuidada', '⏱️ Reserva fácil'],
    process: [
      { title: 'Reserva', text: 'Eliges hora' },
      { title: 'Consulta', text: 'Definimos estilo' },
      { title: 'Corte', text: 'Trabajamos con detalle' },
      { title: 'Acabado', text: 'Perfilado final' },
    ],
  },
  {
    id: 'estetica', name: 'Estética', emoji: '💆‍♀️', category: 'belleza', group: 'Belleza & Estética', demand: 7,
    headline: 'Cuidado personal', subtitle: 'para verte y sentirte mejor',
    intro: 'Tratamientos faciales, corporales y de belleza con atención personalizada, higiene y resultados visibles.',
    aboutTitle: 'Belleza y bienestar', aboutText: 'Centro especializado en tratamientos de belleza que combinan lo mejor de la estética con el cuidado personal.',
    services: [
      { name: 'Tratamientos faciales', desc: 'Limpieza, hidratación y cuidado de la piel según tus necesidades.', icon: '💆‍♀️' },
      { name: 'Tratamientos corporales', desc: 'Opciones para relajación, firmeza y bienestar.', icon: '🌿' },
      { name: 'Belleza y cuidado', desc: 'Servicios para ocasiones especiales o mantenimiento personal.', icon: '✨' },
    ],
    benefits: ['✨ Cuidado personalizado', '🧴 Higiene profesional', '🌿 Bienestar'],
    process: [
      { title: 'Valoración', text: 'Analizamos lo que necesitas' },
      { title: 'Tratamiento', text: 'Elegimos la mejor opción' },
      { title: 'Cuidado', text: 'Aplicamos cada paso' },
      { title: 'Recomendación', text: 'Te guiamos para mantenerlo' },
    ],
  },
  {
    id: 'manicura', name: 'Manicura y Uñas', emoji: '💅', category: 'belleza', group: 'Belleza & Estética', demand: 7,
    headline: 'Uñas cuidadas', subtitle: 'con estilo propio',
    intro: 'Manicura, esmaltado y diseño de uñas con acabado limpio, duración y atención al detalle.',
    aboutTitle: 'Uñas perfectas', aboutText: 'Especialistas en uñas que crean diseños únicos y adaptan tratamientos a cada tipo de uña.',
    services: [
      { name: 'Manicura clásica', desc: 'Cuidado de manos y uñas con acabado elegante y natural.', icon: '💅' },
      { name: 'Semipermanente', desc: 'Color duradero, brillo y acabado resistente.', icon: '✨' },
      { name: 'Diseño de uñas', desc: 'Decoraciones personalizadas para cada estilo u ocasión.', icon: '🎨' },
    ],
    benefits: ['💅 Acabado limpio', '✨ Duración', '🎨 Diseño personalizado'],
    process: [
      { title: 'Elección', text: 'Definimos color y estilo' },
      { title: 'Preparación', text: 'Cuidamos la uña' },
      { title: 'Aplicación', text: 'Trabajamos el diseño' },
      { title: 'Acabado', text: 'Sellado final' },
    ],
  },
  {
    id: 'maquillaje', name: 'Maquillaje', emoji: '💄', category: 'belleza', group: 'Belleza & Estética', demand: 6,
    headline: 'Maquillaje que realza', subtitle: 'tu mejor versión',
    intro: 'Maquillaje social, eventos, novias y sesiones con una propuesta adaptada a tu rostro, estilo y ocasión.',
    aboutTitle: 'Maquillaje profesional', aboutText: 'Maquilladora experta que realza tu belleza natural.',
    services: [
      { name: 'Maquillaje social', desc: 'Look favorecedor para celebraciones, reuniones o momentos especiales.', icon: '💄' },
      { name: 'Novias y eventos', desc: 'Maquillaje duradero, elegante y pensado para fotografía.', icon: '👰' },
      { name: 'Asesoría', desc: 'Aprende tonos, productos y técnicas que te favorecen.', icon: '✨' },
    ],
    benefits: ['💄 Look favorecedor', '📸 Acabado fotogénico', '✨ Duración'],
    process: [
      { title: 'Consulta', text: 'Vemos estilo y ocasión' },
      { title: 'Prueba', text: 'Ajustamos detalles' },
      { title: 'Maquillaje', text: 'Aplicación profesional' },
      { title: 'Retoque', text: 'Acabado perfecto' },
    ],
  },

  // ============================================
  // 💪 GRUPO: SALUD & BIENESTAR
  // ============================================
  {
    id: 'masajes', name: 'Masajes', emoji: '💆', category: 'salud', group: 'Salud & Bienestar', demand: 7,
    headline: 'Relaja el cuerpo', subtitle: 'y recupera energía',
    intro: 'Masajes de bienestar, relajación y descarga muscular en un ambiente cuidado y con atención personalizada.',
    aboutTitle: 'Terapia del bienestar', aboutText: 'Terapeuta especializado que usa técnicas de relajación profunda para liberar tensiones.',
    services: [
      { name: 'Masaje relajante', desc: 'Ideal para liberar tensión y desconectar del estrés diario.', icon: '🌿' },
      { name: 'Descarga muscular', desc: 'Trabajo enfocado en zonas cargadas por deporte, trabajo o postura.', icon: '💪' },
      { name: 'Bienestar integral', desc: 'Sesiones adaptadas a lo que tu cuerpo necesita en cada momento.', icon: '✨' },
    ],
    benefits: ['🌿 Relax', '💪 Alivio muscular', '🕯️ Atención personalizada'],
    process: [
      { title: 'Valoración', text: 'Hablamos de molestias' },
      { title: 'Sesión', text: 'Trabajamos por zonas' },
      { title: 'Ajuste', text: 'Adaptamos intensidad' },
      { title: 'Bienestar', text: 'Te vas con más calma' },
    ],
  },
  {
    id: 'fisioterapia', name: 'Fisioterapia', emoji: '🦴', category: 'salud', group: 'Salud & Bienestar', demand: 8,
    headline: 'Muévete mejor', subtitle: 'con tratamiento profesional',
    intro: 'Fisioterapia para dolor, recuperación y mejora funcional con valoración individual y seguimiento cercano.',
    aboutTitle: 'Recuperación y movimiento', aboutText: 'Fisioterapeutas colegiados que devuelven la movilidad y alivian el dolor con técnicas probadas.',
    services: [
      { name: 'Dolor y lesiones', desc: 'Tratamientos para molestias musculares, articulares y sobrecargas.', icon: '🦴' },
      { name: 'Rehabilitación', desc: 'Recuperación progresiva tras lesión, cirugía o baja movilidad.', icon: '🏃' },
      { name: 'Prevención', desc: 'Pautas y ejercicios para evitar recaídas y mejorar tu día a día.', icon: '✅' },
    ],
    benefits: ['🦴 Valoración individual', '📋 Plan claro', '✅ Seguimiento'],
    process: [
      { title: 'Valoración', text: 'Entendemos tu caso' },
      { title: 'Tratamiento', text: 'Aplicamos terapia adecuada' },
      { title: 'Ejercicios', text: 'Te damos pautas' },
      { title: 'Seguimiento', text: 'Medimos evolución' },
    ],
  },
  {
    id: 'psicologia', name: 'Psicología', emoji: '🧠', category: 'salud', group: 'Salud & Bienestar', demand: 7,
    headline: 'Un espacio seguro', subtitle: 'para entenderte mejor',
    intro: 'Acompañamiento psicológico profesional, cercano y respetuoso para trabajar lo que necesitas a tu ritmo.',
    aboutTitle: 'Bienestar mental', aboutText: 'Psicólogo certificado que crea un espacio seguro para que avances en tu camino personal.',
    services: [
      { name: 'Terapia individual', desc: 'Sesiones para ansiedad, estrés, autoestima, duelo o procesos personales.', icon: '🧠' },
      { name: 'Acompañamiento emocional', desc: 'Herramientas para afrontar situaciones difíciles con más claridad.', icon: '🌿' },
      { name: 'Orientación personal', desc: 'Un espacio para tomar decisiones y recuperar equilibrio.', icon: '🤝' },
    ],
    benefits: ['🤝 Confidencialidad', '🌿 Trato cercano', '📋 Proceso personalizado'],
    process: [
      { title: 'Primera sesión', text: 'Conocemos tu situación' },
      { title: 'Objetivos', text: 'Definimos prioridades' },
      { title: 'Trabajo', text: 'Avanzamos sesión a sesión' },
      { title: 'Seguimiento', text: 'Revisamos progreso' },
    ],
  },

  // ============================================
  // 🎉 GRUPO: EVENTOS & ENTRETENIMIENTO
  // ============================================
  {
    id: 'fotografia', name: 'Fotografía', emoji: '📸', category: 'eventos', group: 'Eventos & Entretenimiento', demand: 7,
    headline: 'Imágenes que cuentan', subtitle: 'lo importante',
    intro: 'Fotografía para eventos, marcas, familias y proyectos con mirada cuidada, natural y profesional.',
    aboutTitle: 'Fotógrafo profesional', aboutText: 'Capturamos momentos con sensibilidad y técnica.',
    services: [
      { name: 'Eventos', desc: 'Capturamos momentos clave con discreción y sensibilidad.', icon: '📸' },
      { name: 'Retratos y marca', desc: 'Imágenes profesionales para mostrar tu mejor versión.', icon: '👤' },
      { name: 'Producto y negocio', desc: 'Fotos cuidadas para vender mejor y transmitir confianza.', icon: '🛍️' },
    ],
    benefits: ['📸 Mirada profesional', '✨ Edición cuidada', '⏱️ Entrega clara'],
    process: [
      { title: 'Brief', text: 'Entendemos el estilo' },
      { title: 'Sesión', text: 'Fotografiamos con guía' },
      { title: 'Edición', text: 'Cuidamos color y detalle' },
      { title: 'Entrega', text: 'Recibes galería final' },
    ],
  },
  {
    id: 'video', name: 'Vídeo y Producción', emoji: '🎥', category: 'eventos', group: 'Eventos & Entretenimiento', demand: 6,
    headline: 'Vídeos que conectan', subtitle: 'y elevan tu imagen',
    intro: 'Producción de vídeo para marcas, eventos y redes sociales con narrativa, ritmo y acabado profesional.',
    aboutTitle: 'Producción audiovisual', aboutText: 'Creamos vídeos que cuentan historias y generan impacto.',
    services: [
      { name: 'Vídeo corporativo', desc: 'Presenta tu negocio de forma clara, atractiva y profesional.', icon: '🎥' },
      { name: 'Contenido para redes', desc: 'Piezas ágiles para Instagram, TikTok y campañas digitales.', icon: '📱' },
      { name: 'Eventos', desc: 'Grabación y edición de momentos importantes con calidad visual.', icon: '🎬' },
    ],
    benefits: ['🎥 Imagen profesional', '📱 Formato redes', '✨ Edición cuidada'],
    process: [
      { title: 'Idea', text: 'Definimos mensaje' },
      { title: 'Guion', text: 'Organizamos tomas' },
      { title: 'Rodaje', text: 'Grabamos con calidad' },
      { title: 'Edición', text: 'Entregamos pieza final' },
    ],
  },

  // ============================================
  // 💼 GRUPO: SERVICIOS PROFESIONALES
  // ============================================
  {
    id: 'marketing', name: 'Marketing Digital', emoji: '📣', category: 'servicios', group: 'Servicios Profesionales', demand: 7,
    headline: 'Más visibilidad', subtitle: 'para atraer clientes reales',
    intro: 'Publicidad, redes sociales y estrategia digital para negocios que quieren vender mejor y proyectar confianza.',
    aboutTitle: 'Estrategia digital', aboutText: 'Especialistas en marketing que entienden cómo conectar con tus clientes ideales online.',
    services: [
      { name: 'Publicidad online', desc: 'Campañas enfocadas en clientes potenciales y resultados medibles.', icon: '📣' },
      { name: 'Redes sociales', desc: 'Contenido y presencia para que tu marca se vea activa y profesional.', icon: '📱' },
      { name: 'Estrategia', desc: 'Plan claro para ordenar tu comunicación y mejorar conversiones.', icon: '📈' },
    ],
    benefits: ['📣 Más alcance', '📱 Imagen activa', '📈 Datos claros'],
    process: [
      { title: 'Diagnóstico', text: 'Vemos tu situación actual' },
      { title: 'Plan', text: 'Definimos objetivos' },
      { title: 'Campaña', text: 'Lanzamos acciones' },
      { title: 'Optimización', text: 'Medimos y ajustamos' },
    ],
  },
  {
    id: 'diseno_web', name: 'Diseño Web', emoji: '🌐', category: 'servicios', group: 'Servicios Profesionales', demand: 8,
    headline: 'Una web profesional', subtitle: 'que transmite confianza',
    intro: 'Diseño de páginas web modernas, claras y enfocadas en convertir visitas en contactos reales.',
    aboutTitle: 'Diseño web moderno', aboutText: 'Creamos webs que no solo se ven bien, sino que convierten visitantes en clientes.',
    services: [
      { name: 'Landing page', desc: 'Página clara, atractiva y pensada para captar clientes.', icon: '🌐' },
      { name: 'Web corporativa', desc: 'Presencia digital completa para mostrar servicios y autoridad.', icon: '💻' },
      { name: 'Optimización', desc: 'Mejoras de velocidad, diseño, contenido y conversión.', icon: '⚡' },
    ],
    benefits: ['🌐 Imagen profesional', '📲 Contacto directo', '⚡ Carga rápida'],
    process: [
      { title: 'Brief', text: 'Entendemos tu negocio' },
      { title: 'Diseño', text: 'Creamos la estructura' },
      { title: 'Desarrollo', text: 'Montamos la web' },
      { title: 'Lanzamiento', text: 'Publicamos y revisamos' },
    ],
  },
  {
    id: 'emprendedor', name: 'Emprendedor', emoji: '🚀', category: 'servicios', group: 'Servicios Profesionales', demand: 5,
    headline: 'Una presencia profesional', subtitle: 'para vender con más confianza',
    intro: 'Soluciones para emprendedores que quieren mostrar una imagen clara, moderna y preparada para conseguir más oportunidades.',
    aboutTitle: 'Tu negocio, tu marca', aboutText: 'Apoyamos emprendedores que quieren escalar y profesionalizarse.',
    services: [
      { name: 'Presencia profesional', desc: 'Presenta tu propuesta con claridad para que tus clientes entiendan rápido el valor.', icon: '🚀' },
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

  // ============================================
  // 🚚 GRUPO: TRANSPORTE & LOGÍSTICA
  // ============================================
  {
    id: 'transporte', name: 'Transporte y Logística', emoji: '🚚', category: 'transporte', group: 'Transporte & Logística', demand: 7,
    headline: 'Transporte seguro', subtitle: 'cuando más lo necesitas',
    intro: 'Mudanzas, reparto y logística con coordinación clara, cuidado de la mercancía y respuesta rápida.',
    aboutTitle: 'Logística profesional', aboutText: 'Transportistas confiables que cuidan tus cosas como propias.',
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

  // ============================================
  // 🚗 GRUPO: MOTOR & AUTOMOCIÓN
  // ============================================
  {
    id: 'taller_mecanico', name: 'Taller Mecánico', emoji: '🔩', category: 'motor', group: 'Motor & Automoción', demand: 8,
    headline: 'Tu vehículo en buenas manos', subtitle: 'con diagnóstico claro',
    intro: 'Mecánica, mantenimiento y reparaciones para que conduzcas con seguridad y confianza.',
    aboutTitle: 'Mecánica profesional', aboutText: 'Mecánicos expertos que diagnostican rápido y reparan bien.',
    services: [
      { name: 'Mantenimiento', desc: 'Revisiones, aceite, filtros y puesta a punto del vehículo.', icon: '🔧' },
      { name: 'Reparaciones', desc: 'Solución de averías mecánicas con explicación clara.', icon: '🔩' },
      { name: 'Diagnóstico', desc: 'Identificamos el problema antes de cambiar piezas innecesarias.', icon: '🧰' },
    ],
    benefits: ['🔧 Diagnóstico claro', '🚗 Seguridad', '📋 Presupuesto transparente'],
    process: [
      { title: 'Entrada', text: 'Recibimos el vehículo' },
      { title: 'Diagnóstico', text: 'Revisamos avería' },
      { title: 'Reparación', text: 'Trabajamos con piezas adecuadas' },
      { title: 'Entrega', text: 'Explicamos lo realizado' },
    ],
  },
  {
    id: 'lavado_coches', name: 'Lavado de Coches', emoji: '🚗', category: 'motor', group: 'Motor & Automoción', demand: 7,
    headline: 'Tu coche como nuevo', subtitle: 'por dentro y por fuera',
    intro: 'Lavado, detailing y limpieza profunda de vehículos con acabado cuidado y atención a cada detalle.',
    aboutTitle: 'Detailing profesional', aboutText: 'Especializados en dejar vehículos relucientes por dentro y por fuera.',
    services: [
      { name: 'Lavado exterior', desc: 'Limpieza y acabado brillante para una mejor imagen del vehículo.', icon: '🚗' },
      { name: 'Interior', desc: 'Aspirado, limpieza de tapicería y detalle interior.', icon: '🧽' },
      { name: 'Detailing', desc: 'Tratamientos más completos para proteger y mejorar el acabado.', icon: '✨' },
    ],
    benefits: ['🚗 Acabado brillante', '🧽 Interior cuidado', '✨ Detalle premium'],
    process: [
      { title: 'Reserva', text: 'Eliges servicio' },
      { title: 'Limpieza', text: 'Trabajamos exterior e interior' },
      { title: 'Detalle', text: 'Cuidamos acabados' },
      { title: 'Entrega', text: 'Vehículo listo' },
    ],
  },
]

export const TRADES: Record<string, TradeConfig> = Object.fromEntries(
  SEEDS.map(seed => [seed.id, makeTrade(seed)])
) as Record<string, TradeConfig>

const TRADE_ALIASES: Record<string, string> = {
  jardinero: 'jardineria', jardinera: 'jardineria', jardin: 'jardineria', paisajista: 'paisajismo', paisaje: 'paisajismo',
  florista: 'floristeria', flor: 'floristeria', flores: 'floristeria', reforma: 'reformas', reformas_integrales: 'reformas',
  construccion: 'reformas', constructor: 'reformas', obra: 'reformas', pintor: 'pintura', pintora: 'pintura',
  carpintero: 'carpinteria', carpintera: 'carpinteria', fontanero: 'fontaneria', fontanera: 'fontaneria',
  electricista: 'electricidad', electricista_autorizado: 'electricidad', limpieza_hogar: 'limpieza', limpiador: 'limpieza',
  limpiadora: 'limpieza', cerrajero: 'cerrajeria', cerrajera: 'cerrajeria', chef: 'cocinero', catering: 'cocinero',
  cocinera: 'cocinero', cocina: 'cocinero', restaurante: 'restaurante', restaurante_bar: 'restaurante',
  panadero: 'panaderia', panadera: 'panaderia', pastelero: 'pasteleria', pastelera: 'pasteleria',
  peluquero: 'peluqueria', peluquera: 'peluqueria', peluqueria: 'peluqueria', barber: 'barberia', barbero: 'barberia',
  barbera: 'barberia', esteticien: 'estetica', esteticien_la: 'estetica', estetica: 'estetica', uñas: 'manicura',
  unas: 'manicura', manicurista: 'manicura', maquillaje: 'maquillaje', maquilladora: 'maquillaje',
  masajista: 'masajes', masaje: 'masajes', fisio: 'fisioterapia', fisioterapeuta: 'fisioterapia',
  psicologo: 'psicologia', psicologa: 'psicologia', psicologia: 'psicologia',
  fotografo: 'fotografia', fotografa: 'fotografia', fotografia: 'fotografia',
  videografo: 'video', videografa: 'video', video: 'video', produccion_video: 'video',
  dj: 'musica', musico: 'musica', musica_eventos: 'musica', animador: 'musica',
  marketing_digital: 'marketing', publicidad: 'marketing', redes_sociales: 'marketing',
  web: 'diseno_web', diseño_web: 'diseno_web', diseno_web: 'diseno_web', diseñador_web: 'diseno_web',
  asesor: 'asesoria', asesoria: 'asesoria', asesoria_fiscal: 'asesoria', contador: 'asesoria', contable: 'asesoria',
  abogada: 'abogado', abogado: 'abogado', abogacia: 'abogado',
  transporte: 'transporte', logistica: 'transporte', mudanza: 'transporte', mudanzas: 'transporte',
  mensajero: 'mensajeria', mensajeria: 'mensajeria', reparto: 'mensajeria',
  mecanico: 'taller_mecanico', mecanica: 'taller_mecanico', taller: 'taller_mecanico', taller_mecanico: 'taller_mecanico',
  lavado: 'lavado_coches', lavado_coches: 'lavado_coches', detailing: 'lavado_coches',
  emprendedor: 'emprendedor', emprendedora: 'emprendedor',
}

function slugifyTrade(value: string) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ñ/g, 'n').replace(/&/g, 'y').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
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
    id, name: clean.charAt(0).toUpperCase() + clean.slice(1), emoji, category, group: 'Otros',
    headline: 'Un servicio profesional', subtitle: 'pensado para ayudarte',
    intro: 'Atención cercana, comunicación clara y una forma de trabajar pensada para que sepas qué vas a recibir desde el primer mensaje.',
    aboutTitle: 'Quiénes somos', aboutText: 'Profesionales comprometidos con la calidad. Cada cliente es importante y nos esforzamos en superar expectativas.',
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
