// src/lib/trades.ts
// ============================================
// CONFIGURACIÓN COMPLETA DE OFICIOS POR MERCADO
// ============================================

export interface TradeConfig {
  id: string
  name: string
  emoji: string
  category: 'construccion' | 'servicios' | 'salud' | 'belleza' | 'tech' | 'legal' | 'educacion' | 'entretenimiento' | 'negocio'
  colors: {
    primary: string
    secondary: string
    accent: string
    cream: string
    ink: string
  }
  heroImage: string
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
  // ============ CONSTRUCCIÓN Y REFORMAS ============
  jardineria: {
    id: 'jardineria',
    name: 'Jardinería',
    emoji: '🌿',
    category: 'construccion',
    colors: {
      primary: '#2d5a27',
      secondary: '#3d7a35',
      accent: '#c8a96e',
      cream: '#faf7f2',
      ink: '#1a2818',
    },
    heroImage: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1200&q=80',
    defaultHeadline: 'Jardines que',
    defaultSubtitle: 'enamoran',
    defaultIntro: 'Diseño, construcción y mantenimiento de jardines profesionales. Equipo propio, presupuesto claro, sin sorpresas.',
    defaultServices: [
      { name: 'Diseño y paisajismo', desc: 'Proyectamos tu jardín desde cero: estudio del espacio, elección de plantas, materiales y estilo.', icon: '🌿' },
      { name: 'Obra y ejecución', desc: 'Transformamos el proyecto en realidad con equipo propio, sin subcontratas. Materiales de primera.', icon: '🏗️' },
      { name: 'Mantenimiento', desc: 'El mismo equipo que crea tu jardín lo cuida mes a mes. Poda, riego, tratamientos profesionales.', icon: '✂️' },
    ],
    defaultBenefits: ['👥 Equipo propio y profesional', '📋 Presupuesto claro sin sorpresas', '🌱 Garantía de satisfacción incluida'],
    defaultProcess: [
      { title: 'Consulta', text: 'Entendemos tu necesidad y visitamos el espacio' },
      { title: 'Diseño', text: 'Creamos una propuesta personalizada y presupuesto' },
      { title: 'Ejecución', text: 'Realizamos la obra con profesionalismo y calidad' },
      { title: 'Mantenimiento', text: 'Cuidamos tu proyecto a largo plazo' },
    ],
    defaultTestimonials: [
      { name: 'Carmen R.', role: 'Propietaria en Pozuelo', text: 'Transformaron nuestro jardín por completo. Puntuales, limpios y el resultado fue exactamente lo que imaginábamos, incluso mejor.' },
      { name: 'Bufete Martín', role: 'Empresa en Madrid Centro', text: 'Llevan el mantenimiento de nuestras terrazas hace 3 años. Siempre impecable y siempre puntuales. Los recomendamos a todos.' },
      { name: 'Pedro A.', role: 'Chalet en Majadahonda', text: 'Sin sorpresas en el presupuesto. El jardín quedó tal como lo imaginábamos. Muy profesionales en todo momento.' },
    ],
    defaultFaqs: [
      { q: '¿Cuál es el presupuesto mínimo?', a: 'No hay mínimo. Desde pequeños trabajos de mantenimiento hasta proyectos completos. Hacemos presupuesto sin compromiso.' },
      { q: '¿Cuánto tarda un proyecto?', a: 'Depende de la magnitud. Un jardín pequeño: 1-2 semanas. Proyectos grandes: 4-8 semanas. Lo decidimos en la consulta.' },
      { q: '¿Dais garantía?', a: 'Sí. Garantizamos la calidad de nuestro trabajo durante 2 años. Si hay problemas, lo arreglamos.' },
      { q: '¿Trabajáis fuera de Madrid?', a: 'Principalmente en Madrid y alrededores. Consulta tu zona y confirmamos disponibilidad.' },
    ],
  },

  paisajismo: {
    id: 'paisajismo',
    name: 'Paisajismo',
    emoji: '🌱',
    category: 'construccion',
    colors: {
      primary: '#3d8d4d',
      secondary: '#5ba366',
      accent: '#a8d5a8',
      cream: '#f0faf0',
      ink: '#1a3a1a',
    },
    heroImage: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80',
    defaultHeadline: 'Paisajes que',
    defaultSubtitle: 'inspiran',
    defaultIntro: 'Diseño paisajístico avanzado con conceptos sostenibles, plantas de clima y funcionalidad.',
    defaultServices: [
      { name: 'Diseño sostenible', desc: 'Paisajes con especies nativas, bajo mantenimiento y respetuosos con el medio ambiente.', icon: '♻️' },
      { name: 'Terrazas y patios', desc: 'Espacios exteriores funcionales y hermosos para disfrutar con familia y amigos.', icon: '🏠' },
      { name: 'Riego automático', desc: 'Sistemas de riego inteligentes y eficientes que ahorran agua y mantenimiento.', icon: '💧' },
    ],
    defaultBenefits: ['🌍 Diseño sostenible y eficiente', '💡 Tecnología inteligente incluida', '✅ Mantenimiento mínimo garantizado'],
    defaultProcess: [
      { title: 'Visita', text: 'Análisis del terreno y condiciones climáticas' },
      { title: 'Proyecto', text: 'Diseño 3D sostenible y presupuesto' },
      { title: 'Plantación', text: 'Ejecución profesional y experta' },
      { title: 'Control', text: 'Seguimiento y ajustes posteriores' },
    ],
    defaultTestimonials: [
      { name: 'Ángel M.', role: 'Propietario casa campo', text: 'Paisaje perfecto y sostenible. Muy satisfecho con el resultado y el equipo.' },
      { name: 'Verde Hotel', role: 'Hotel boutique', text: 'Transformó nuestras áreas exteriores completamente. Clientes encantados.' },
    ],
    defaultFaqs: [
      { q: '¿Qué plantas son mejores para mi zona?', a: 'Hacemos un estudio completo de tu clima, suelo y luz. Recomendamos las mejores especies.' },
      { q: '¿Cuánto riego necesita?', a: 'Nuestros sistemas son eficientes. Con riego automático, minimizas mantenimiento y agua.' },
    ],
  },

  reformas: {
    id: 'reformas',
    name: 'Reformas',
    emoji: '🏗️',
    category: 'construccion',
    colors: {
      primary: '#6b4423',
      secondary: '#8b5a2b',
      accent: '#d4a574',
      cream: '#f9f6f0',
      ink: '#2c1810',
    },
    heroImage: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&q=80',
    defaultHeadline: 'Reformas que',
    defaultSubtitle: 'transforman',
    defaultIntro: 'Expertos en reformas integrales. Proyecto, obra y acabados con profesionalismo y calidad premium.',
    defaultServices: [
      { name: 'Proyecto y diseño', desc: 'Planificamos cada detalle: diseño 3D, presupuesto ajustado, cronograma realista y flexible.', icon: '📐' },
      { name: 'Ejecución profesional', desc: 'Obra limpia y organizada. Equipo certificado, materiales de calidad, cumplimiento de plazos.', icon: '🔨' },
      { name: 'Acabados premium', desc: 'Detalles que marcan diferencia. Pintura, alicatados, electricidad, fontanería de calidad.', icon: '✨' },
    ],
    defaultBenefits: ['🏗️ Profesionales certificados', '📐 Reformas sin sorpresas', '✅ Garantía de obra 2 años'],
    defaultProcess: [
      { title: 'Proyecto', text: 'Diseño 3D y presupuesto detallado' },
      { title: 'Permisos', text: 'Gestión de licencias y trámites' },
      { title: 'Ejecución', text: 'Obra con control de calidad' },
      { title: 'Entrega', text: 'Inspección final y certificado' },
    ],
    defaultTestimonials: [
      { name: 'Juan López', role: 'Propietario en Retiro', text: 'Reforma integral de piso. Puntuales, presupuesto respetado, resultado perfecto.' },
      { name: 'Rosa García', role: 'Promotora inmobiliaria', text: 'Llevamos 5 años con ellos. Profesionales de confianza, acabados impecables.' },
    ],
    defaultFaqs: [
      { q: '¿Cuánto tiempo tarda una reforma?', a: 'Depende del alcance. Reforma pequeña: 2-3 semanas. Integral: 6-12 semanas. Lo detallamos en el proyecto.' },
      { q: '¿Necesito desalojar la vivienda?', a: 'En reformas integrales sí. En parciales, minimizamos molestias. Planificamos juntos.' },
      { q: '¿Qué pasa si costo más de lo presupuestado?', a: 'No pasa nada sin tu aprobación. Cualquier cambio se consulta y presupuesta primero.' },
    ],
  },

  construccion: {
    id: 'construccion',
    name: 'Construcción',
    emoji: '🏢',
    category: 'construccion',
    colors: {
      primary: '#424242',
      secondary: '#616161',
      accent: '#b39ddb',
      cream: '#f5f5f5',
      ink: '#1a1a1a',
    },
    heroImage: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80',
    defaultHeadline: 'Construcción de',
    defaultSubtitle: 'calidad',
    defaultIntro: 'Proyectos de construcción desde cero con planificación, calidad y transparencia total.',
    defaultServices: [
      { name: 'Obras nuevas', desc: 'Construcción de viviendas, locales comerciales y edificios con máxima calidad.', icon: '🏗️' },
      { name: 'Ampliaciones', desc: 'Ampliaciones estructurales con permisos y seguimiento regulatorio completo.', icon: '📐' },
      { name: 'Legalización', desc: 'Legalización de construcciones existentes con tramitación de permisos.', icon: '📋' },
    ],
    defaultBenefits: ['👷 Maestros de obras certificados', '📋 Todas las licencias incluidas', '✅ Control de calidad permanente'],
    defaultProcess: [
      { title: 'Proyecto', text: 'Diseño y licencias administrativas' },
      { title: 'Preparación', text: 'Preparación del solar y materiales' },
      { title: 'Ejecución', text: 'Construcción con control de calidad' },
      { title: 'Entrega', text: 'Inspección final y entrega' },
    ],
    defaultTestimonials: [
      { name: 'Promotora Centro', role: 'Empresa constructora', text: 'Excelente gestoría de obras. Cumplen plazos y presupuestos al detalle.' },
    ],
    defaultFaqs: [
      { q: '¿Cuánto cuesta construir?', a: 'Depende de muchos factores. Hacemos presupuesto inicial según especificaciones.' },
      { q: '¿Qué licencias necesito?', a: 'Nos encargamos de toda la tramitación administrativa y permisos necesarios.' },
    ],
  },

  mantenimiento: {
    id: 'mantenimiento',
    name: 'Mantenimiento',
    emoji: '🧹',
    category: 'servicios',
    colors: {
      primary: '#616161',
      secondary: '#757575',
      accent: '#b0bec5',
      cream: '#f5f5f5',
      ink: '#212121',
    },
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    defaultHeadline: 'Mantenimiento',
    defaultSubtitle: 'preventivo',
    defaultIntro: 'Servicios de mantenimiento regular para mantener tus instalaciones en perfecto estado.',
    defaultServices: [
      { name: 'Mantenimiento preventivo', desc: 'Revisiones periódicas para evitar averías y prolongar la vida de tus instalaciones.', icon: '🔧' },
      { name: 'Reparaciones rápidas', desc: 'Respuesta urgente a cualquier problema con profesionales disponibles.', icon: '⚡' },
      { name: 'Planes personalizados', desc: 'Contratamos según tus necesidades: semanal, mensual, trimestral o anual.', icon: '📅' },
    ],
    defaultBenefits: ['📞 Disponibilidad 24/7', '✅ Mantenimiento scheduled', '💪 Sin sorpresas'],
    defaultProcess: [
      { title: 'Contratación', text: 'Elige el plan que necesitas' },
      { title: 'Revisiones', text: 'Inspecciones preventivas programadas' },
      { title: 'Reparación', text: 'Solución rápida de problemas' },
      { title: 'Seguimiento', text: 'Control continuo' },
    ],
    defaultTestimonials: [
      { name: 'Comunidad El Retiro', role: 'Administración de fincas', text: 'Mantenimiento impecable. Nunca tenemos sorpresas.' },
    ],
    defaultFaqs: [
      { q: '¿Cuánto cuesta el mantenimiento?', a: 'Depende del plan. Mensual desde 50€. Presupuestamos según tus necesidades.' },
    ],
  },

  // ============ SERVICIOS TÉCNICOS ============
  fontaneria: {
    id: 'fontaneria',
    name: 'Fontanería',
    emoji: '🔧',
    category: 'servicios',
    colors: {
      primary: '#0288d1',
      secondary: '#0097a7',
      accent: '#4dd0e1',
      cream: '#e0f7fa',
      ink: '#001a33',
    },
    heroImage: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1200&q=80',
    defaultHeadline: 'Tuberías y agua',
    defaultSubtitle: 'sin problemas',
    defaultIntro: 'Servicios de fontanería profesional con urgencias 24/7 y garantía total.',
    defaultServices: [
      { name: 'Reparación de averías', desc: 'Identificación rápida y reparación de fugas, atascos y problemas urgentes.', icon: '🔍' },
      { name: 'Instalación de sistemas', desc: 'Tuberías, griferías, calefacción y agua caliente con materiales premium.', icon: '⚙️' },
      { name: 'Mantenimiento preventivo', desc: 'Revisiones periódicas para evitar problemas y mantener tu sistema perfecto.', icon: '🛠️' },
    ],
    defaultBenefits: ['🚨 Servicio de urgencia 24/7', '✅ Garantía en todas las reparaciones', '⚡ Respuesta en menos de 1 hora'],
    defaultProcess: [
      { title: 'Llamada', text: 'Llamada y presupuesto sin compromiso' },
      { title: 'Desplazamiento', text: 'Llegada rápida a tu domicilio' },
      { title: 'Reparación', text: 'Solución profesional del problema' },
      { title: 'Garantía', text: 'Garantía en toda la reparación' },
    ],
    defaultTestimonials: [
      { name: 'Miguel R.', role: 'Administración de fincas', text: 'Profesionales rápidos y eficientes. Solucionan problemas sin alboroto.' },
    ],
    defaultFaqs: [
      { q: '¿Cuánto cuesta una reparación?', a: 'Hacemos presupuesto sin compromiso. Precios según complejidad.' },
      { q: '¿Tenéis urgencias 24 horas?', a: 'Sí, disponibles 24/7 incluidos festivos y fines de semana.' },
    ],
  },

  electricidad: {
    id: 'electricidad',
    name: 'Electricidad',
    emoji: '⚡',
    category: 'servicios',
    colors: {
      primary: '#f57c00',
      secondary: '#ff9800',
      accent: '#ffe082',
      cream: '#fff3e0',
      ink: '#331a00',
    },
    heroImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
    defaultHeadline: 'Luz y energía',
    defaultSubtitle: 'seguras',
    defaultIntro: 'Servicios eléctricos profesionales con certificación y máximas garantías de seguridad.',
    defaultServices: [
      { name: 'Reparación eléctrica', desc: 'Solución rápida de problemas eléctricos, cambio de circuitos y averías urgentes.', icon: '🔌' },
      { name: 'Instalaciones nuevas', desc: 'Instalación de sistemas eléctricos completos para reformas y construcciones nuevas.', icon: '⚡' },
      { name: 'Energías renovables', desc: 'Instalación de placas solares, aerotermia y sistemas de ahorro energético.', icon: '♻️' },
    ],
    defaultBenefits: ['🔒 Profesionales certificados', '⚙️ Trabajo garantizado y asegurado', '🔌 Sistemas seguros y modernos'],
    defaultProcess: [
      { title: 'Inspección', text: 'Evaluación del sistema eléctrico' },
      { title: 'Proyecto', text: 'Plan de trabajo y presupuesto' },
      { title: 'Instalación', text: 'Trabajo con todas las normas de seguridad' },
      { title: 'Certificado', text: 'Certificado de conformidad incluido' },
    ],
    defaultTestimonials: [
      { name: 'Javier L.', role: 'Propietario', text: 'Cambio completo de instalación eléctrica. Profesionales seguros y certificados.' },
    ],
    defaultFaqs: [
      { q: '¿Necesito certificado?', a: 'Sí, toda instalación nueva o modificación necesita certificado de conformidad.' },
      { q: '¿Cuánto cuesta un cambio de instalación?', a: 'Presupuestamos según especificaciones. Presupuesto sin compromiso.' },
    ],
  },

  limpieza: {
    id: 'limpieza',
    name: 'Limpieza Profesional',
    emoji: '✨',
    category: 'servicios',
    colors: {
      primary: '#1e5a96',
      secondary: '#2471c4',
      accent: '#f39c12',
      cream: '#f0f8ff',
      ink: '#0d2438',
    },
    heroImage: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&q=80',
    defaultHeadline: 'Espacios',
    defaultSubtitle: 'impecables',
    defaultIntro: 'Limpieza profesional con higiene, eficiencia y confianza en cada trabajo.',
    defaultServices: [
      { name: 'Limpieza profunda', desc: 'Limpieza exhaustiva de todos los espacios. Desinfección, eliminación de ácaros, acabado brillante.', icon: '🧹' },
      { name: 'Mantenimiento periódico', desc: 'Planes de limpieza semanal, quincenal o mensual adaptados a tus necesidades.', icon: '📅' },
      { name: 'Limpieza especializada', desc: 'Cristales, alfombras, tapicería. Técnicas especializadas para cada superficie.', icon: '🪟' },
    ],
    defaultBenefits: ['👔 Personal cualificado y certificado', '🌿 Productos ecológicos y seguros', '⏰ Servicio garantizado 24/7'],
    defaultProcess: [
      { title: 'Evaluación', text: 'Análisis del espacio y necesidades' },
      { title: 'Presupuesto', text: 'Plan personalizado de limpieza' },
      { title: 'Ejecución', text: 'Limpieza profesional y desinfección' },
      { title: 'Mantenimiento', text: 'Seguimiento regular y revisiones' },
    ],
    defaultTestimonials: [
      { name: 'Inmobiliaria Centro', role: 'Empresa de servicios', text: 'Limpieza impecable en viviendas nuevas. Profesionales, puntuales, eficientes.' },
    ],
    defaultFaqs: [
      { q: '¿Qué productos usáis?', a: 'Productos ecológicos y seguros para familia, mascotas y medio ambiente.' },
      { q: '¿Hacéis desinfección?', a: 'Sí, tratamiento de desinfección y sanitización completo.' },
    ],
  },

  // ============ BELLEZA Y BIENESTAR ============
  estetica: {
    id: 'estetica',
    name: 'Estética y Belleza',
    emoji: '💆',
    category: 'belleza',
    colors: {
      primary: '#c2185b',
      secondary: '#e91e63',
      accent: '#ffb6c1',
      cream: '#fff5f7',
      ink: '#3d1429',
    },
    heroImage: 'https://images.unsplash.com/photo-1560066169-b763a5433e40?w=1200&q=80',
    defaultHeadline: 'Tu mejor',
    defaultSubtitle: 'versión',
    defaultIntro: 'Tratamientos de estética y belleza con profesionales certificados y productos premium.',
    defaultServices: [
      { name: 'Tratamientos faciales', desc: 'Limpieza profunda, hidratación y rejuvenecimiento facial con técnicas modernas.', icon: '💅' },
      { name: 'Cuidados corporales', desc: 'Masajes terapéuticos, drenaje linfático y tratamientos corporales especializados.', icon: '🧖' },
      { name: 'Depilación y cuidados', desc: 'Depilación láser, cuidados de piel y tratamientos especializados de cabello.', icon: '✨' },
    ],
    defaultBenefits: ['👩‍⚕️ Profesionales certificados', '💎 Productos premium importados', '🕐 Citas flexibles y personalizadas'],
    defaultProcess: [
      { title: 'Consulta', text: 'Análisis de tu piel y necesidades' },
      { title: 'Tratamiento', text: 'Sesión profesional personalizada' },
      { title: 'Cuidados', text: 'Recomendaciones post-tratamiento' },
      { title: 'Seguimiento', text: 'Resultados duraderos garantizados' },
    ],
    defaultTestimonials: [
      { name: 'Laura M.', role: 'Cliente frecuente', text: 'Excelentes tratamientos faciales. Resultados visibles desde la primera sesión.' },
    ],
    defaultFaqs: [
      { q: '¿Cuántas sesiones necesito?', a: 'Depende del tratamiento. Te asesoramos en la primera consulta.' },
      { q: '¿Los productos son seguros?', a: 'Sí, todos dermatológicamente testados y con garantía de calidad.' },
    ],
  },

  peluqueria: {
    id: 'peluqueria',
    name: 'Peluquería',
    emoji: '💇',
    category: 'belleza',
    colors: {
      primary: '#8b4513',
      secondary: '#a0522d',
      accent: '#deb887',
      cream: '#fff8dc',
      ink: '#3e2723',
    },
    heroImage: 'https://images.unsplash.com/photo-1610734254957-11eda9dbd29f?w=1200&q=80',
    defaultHeadline: 'Tu estilo',
    defaultSubtitle: 'hecho realidad',
    defaultIntro: 'Peluquería profesional con expertos en corte, color y cuidados de cabello.',
    defaultServices: [
      { name: 'Corte y peinado', desc: 'Cortes personalizados y peinados profesionales para cualquier ocasión.', icon: '✂️' },
      { name: 'Coloración', desc: 'Tinte, mechas, balayage y coloración especializada con productos premium.', icon: '🎨' },
      { name: 'Tratamientos capilares', desc: 'Alisados, rizados, botox capilar y tratamientos reparadores especializados.', icon: '💆' },
    ],
    defaultBenefits: ['👨‍🎓 Estilistas experimentados', '💎 Productos de marca premium', '🕐 Citas online disponibles'],
    defaultProcess: [
      { title: 'Consulta', text: 'Análisis de tu cabello y estilo' },
      { title: 'Propuesta', text: 'Sugerencias personalizadas' },
      { title: 'Ejecución', text: 'Servicio profesional de calidad' },
      { title: 'Cuidados', text: 'Consejos de mantenimiento incluidos' },
    ],
    defaultTestimonials: [
      { name: 'María L.', role: 'Cliente regular', text: 'Excelente atención. Mi nuevo corte y color quedaron exactamente como quería.' },
    ],
    defaultFaqs: [
      { q: '¿Cuánto dura el corte?', a: 'Entre 30-45 minutos según complejidad.' },
      { q: '¿Qué precio tienen los servicios?', a: 'Presupuestamos según lo que necesites. Cita para ver opciones.' },
    ],
  },

  gym: {
    id: 'gym',
    name: 'Gimnasio y Fitness',
    emoji: '💪',
    category: 'salud',
    colors: {
      primary: '#d32f2f',
      secondary: '#f44336',
      accent: '#ef5350',
      cream: '#ffebee',
      ink: '#b71c1c',
    },
    heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80',
    defaultHeadline: 'Transforma tu',
    defaultSubtitle: 'cuerpo',
    defaultIntro: 'Gimnasio con equipo moderno, entrenadores personales y planes de fitness personalizados.',
    defaultServices: [
      { name: 'Entrenamiento personal', desc: 'Sesiones personalizadas con entrenador certificado según tus objetivos.', icon: '🏋️' },
      { name: 'Clases grupales', desc: 'Clases de aeróbic, yoga, pilates, zumba y crossfit con instructores.', icon: '👥' },
      { name: 'Asesoramiento nutricional', desc: 'Planes nutricionales personalizados y asesoramiento dietético profesional.', icon: '🥗' },
    ],
    defaultBenefits: ['🏋️ Equipamiento de marcas líderes', '👨‍🏫 Entrenadores con certificaciones', '📊 Seguimiento y evolución garantizados'],
    defaultProcess: [
      { title: 'Inscripción', text: 'Formulario de salud y objetivos' },
      { title: 'Evaluación', text: 'Test físico y composición corporal' },
      { title: 'Plan', text: 'Programa de entrenamiento personalizado' },
      { title: 'Seguimiento', text: 'Revisiones mensuales de progreso' },
    ],
    defaultTestimonials: [
      { name: 'Carlos M.', role: 'Miembro activo', text: 'Excelente gimnasio. Los entrenadores son profesionales y muy motivadores.' },
    ],
    defaultFaqs: [
      { q: '¿Qué planes tenéis?', a: 'Desde acceso ilimitado hasta clases específicas. Presupuestamos según necesidades.' },
      { q: '¿Incluye nutrición?', a: 'Sí, asesoramiento nutricional incluido en planes premium.' },
    ],
  },

  veterinaria: {
    id: 'veterinaria',
    name: 'Veterinaria',
    emoji: '🐾',
    category: 'salud',
    colors: {
      primary: '#558b2f',
      secondary: '#7cb342',
      accent: '#dcedc8',
      cream: '#f1f8e9',
      ink: '#1b5e20',
    },
    heroImage: 'https://images.unsplash.com/photo-1576091160550-112173f7fd8b?w=1200&q=80',
    defaultHeadline: 'Salud de tus',
    defaultSubtitle: 'mascotas',
    defaultIntro: 'Clínica veterinaria con equipos modernos y profesionales dedicados al cuidado animal.',
    defaultServices: [
      { name: 'Consulta general', desc: 'Revisiones, diagnóstico y tratamiento de enfermedades comunes en mascotas.', icon: '🩺' },
      { name: 'Cirugía y anestesia', desc: 'Intervenciones quirúrgicas, esterilización y procedimientos bajo anestesia profesional.', icon: '🔬' },
      { name: 'Peluquería e higiene', desc: 'Baño, peluquería, limpieza de oídos y cuidados de higiene especializada.', icon: '🛁' },
    ],
    defaultBenefits: ['🏥 Veterinarios colegiados', '⏰ Atención de urgencia 24h', '💊 Farmacia veterinaria incluida'],
    defaultProcess: [
      { title: 'Cita', text: 'Reserva de cita según disponibilidad' },
      { title: 'Consulta', text: 'Revisión y diagnóstico veterinario' },
      { title: 'Tratamiento', text: 'Aplicación del tratamiento recomendado' },
      { title: 'Seguimiento', text: 'Control y evolución posterior' },
    ],
    defaultTestimonials: [
      { name: 'Juan y sus mascotas', role: 'Cliente frecuente', text: 'Profesionales muy amables. Mis mascotas siempre reciben la mejor atención.' },
    ],
    defaultFaqs: [
      { q: '¿Tenéis urgencias?', a: 'Sí, servicio de urgencias 24 horas incluido.' },
      { q: '¿Qué vacunas recomiendáis?', a: 'Hacemos un plan de vacunación personalizado según la edad y especie.' },
    ],
  },

  // ============ TECNOLOGÍA ============
  informatica: {
    id: 'informatica',
    name: 'Servicios Informáticos',
    emoji: '💻',
    category: 'tech',
    colors: {
      primary: '#1976d2',
      secondary: '#2196f3',
      accent: '#64b5f6',
      cream: '#ecf0f1',
      ink: '#0d3b66',
    },
    heroImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
    defaultHeadline: 'Tecnología que',
    defaultSubtitle: 'funciona',
    defaultIntro: 'Soluciones informáticas integrales para empresas y particulares con soporte técnico 24/7.',
    defaultServices: [
      { name: 'Soporte técnico', desc: 'Reparación, mantenimiento y soporte técnico para ordenadores y dispositivos.', icon: '🖥️' },
      { name: 'Desarrollo web', desc: 'Diseño y desarrollo de webs profesionales, tiendas online y aplicaciones.', icon: '🌐' },
      { name: 'Ciberseguridad', desc: 'Protección de datos, antivirus, copias de seguridad y asesoría en seguridad digital.', icon: '🔒' },
    ],
    defaultBenefits: ['👨‍💻 Técnicos certificados', '🛡️ Protección de datos garantizada', '📞 Soporte 24/7 incluido'],
    defaultProcess: [
      { title: 'Diagnóstico', text: 'Análisis completo del sistema' },
      { title: 'Solución', text: 'Implementación de la solución' },
      { title: 'Pruebas', text: 'Verificación y pruebas de funcionamiento' },
      { title: 'Soporte', text: 'Soporte continuo garantizado' },
    ],
    defaultTestimonials: [
      { name: 'TechCorp SA', role: 'Empresa de servicios', text: 'Excelente soporte técnico. Solucionan problemas rápido y profesionalmente.' },
    ],
    defaultFaqs: [
      { q: '¿Cuánto cuesta el soporte?', a: 'Desde 30€/mes en planes básicos hasta customizados según necesidades.' },
      { q: '¿Hacéis respaldo de datos?', a: 'Sí, copias de seguridad automáticas incluidas en planes premium.' },
    ],
  },

  // ============ CREATIVOS ============
  fotografia: {
    id: 'fotografia',
    name: 'Fotografía',
    emoji: '📸',
    category: 'entretenimiento',
    colors: {
      primary: '#37474f',
      secondary: '#455a64',
      accent: '#80deea',
      cream: '#eceff1',
      ink: '#1a1a1a',
    },
    heroImage: 'https://images.unsplash.com/photo-1516035069371-29a08f8aa6e4?w=1200&q=80',
    defaultHeadline: 'Momentos que',
    defaultSubtitle: 'perduran',
    defaultIntro: 'Fotografía profesional para bodas, eventos, sesiones de fotos y proyectos comerciales.',
    defaultServices: [
      { name: 'Bodas y eventos', desc: 'Fotografía de bodas, comuniones, cumpleaños y eventos especiales con estilo.', icon: '💒' },
      { name: 'Sesiones personales', desc: 'Book de modelos, sesiones de fotos familiares y retratos profesionales.', icon: '👥' },
      { name: 'Fotografía comercial', desc: 'Fotografía para empresas, productos, inmuebles y contenido para redes sociales.', icon: '📷' },
    ],
    defaultBenefits: ['📸 Fotógrafo profesional con años de experiencia', '🎨 Edición artística incluida', '💿 Galería digital con acceso completo'],
    defaultProcess: [
      { title: 'Consulta', text: 'Conocemos tu visión y estilo' },
      { title: 'Propuesta', text: 'Paquete personalizado y presupuesto' },
      { title: 'Sesión', text: 'Sesión fotográfica profesional' },
      { title: 'Edición', text: 'Edición artística y entrega digital' },
    ],
    defaultTestimonials: [
      { name: 'Boda Rodríguez', role: 'Evento privado', text: 'Fotos espectaculares. Capturó los momentos más especiales de nuestra boda.' },
    ],
    defaultFaqs: [
      { q: '¿Cuántas fotos entregáis?', a: 'Depende del evento. Bodas: 300-500 fotos. Sesiones: 50-100.' },
      { q: '¿Cuál es el precio?', a: 'Presupuestamos según tipo de evento. Consulta sin compromiso.' },
    ],
  },

  diseño: {
    id: 'diseño',
    name: 'Diseño Gráfico',
    emoji: '🎨',
    category: 'entretenimiento',
    colors: {
      primary: '#e91e63',
      secondary: '#ff1744',
      accent: '#ff80ab',
      cream: '#fce4ec',
      ink: '#880e4f',
    },
    heroImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80',
    defaultHeadline: 'Diseño que',
    defaultSubtitle: 'comunica',
    defaultIntro: 'Servicios de diseño gráfico para empresas con identidad visual profesional y moderna.',
    defaultServices: [
      { name: 'Identidad corporativa', desc: 'Diseño de logo, paleta cromática, tipografía y manual de marca profesional.', icon: '🏢' },
      { name: 'Diseño de materiales', desc: 'Tarjetas de visita, folletos, carteles, catálogos y material impreso profesional.', icon: '📄' },
      { name: 'Diseño digital', desc: 'Diseño web, app, redes sociales y contenido digital para empresas.', icon: '🌐' },
    ],
    defaultBenefits: ['🎨 Diseñadores con portafolio premiado', '💡 Conceptos originales y creativos', '🔄 Revisiones ilimitadas incluidas'],
    defaultProcess: [
      { title: 'Briefing', text: 'Entendemos tu marca y objetivos' },
      { title: 'Propuestas', text: 'Presentamos conceptos y opciones' },
      { title: 'Desarrollo', text: 'Refinamos el diseño elegido' },
      { title: 'Entrega', text: 'Archivos finales y manual de uso' },
    ],
    defaultTestimonials: [
      { name: 'StartUp Tech', role: 'Empresa de tecnología', text: 'Identidad visual espectacular. Nos ayudaron a comunicar nuestra marca correctamente.' },
    ],
    defaultFaqs: [
      { q: '¿Cuánto cuesta un logo?', a: 'Desde 300€ hasta proyectos customizados. Presupuestamos según complejidad.' },
      { q: '¿Hacéis revisiones?', a: 'Sí, revisiones ilimitadas hasta que quedes satisfecho.' },
    ],
  },

  musica: {
    id: 'musica',
    name: 'Música y Eventos',
    emoji: '🎵',
    category: 'entretenimiento',
    colors: {
      primary: '#6a1b9a',
      secondary: '#7b1fa2',
      accent: '#ce93d8',
      cream: '#f3e5f5',
      ink: '#2d0052',
    },
    heroImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80',
    defaultHeadline: 'Música que',
    defaultSubtitle: 'emociona',
    defaultIntro: 'Músicos profesionales para bodas, eventos corporativos, celebraciones y conciertos.',
    defaultServices: [
      { name: 'Eventos y bodas', desc: 'Música en vivo para bodas, celebraciones y eventos con artistas profesionales.', icon: '🎤' },
      { name: 'Clases particulares', desc: 'Clases de guitarra, piano, voz y otros instrumentos con profesores certificados.', icon: '🎸' },
      { name: 'Producción musical', desc: 'Grabación, producción y masterización de proyectos musicales profesionales.', icon: '🎙️' },
    ],
    defaultBenefits: ['🎓 Músicos profesionales y certificados', '🎼 Repertorio personalizable', '🔊 Equipamiento de calidad profesional'],
    defaultProcess: [
      { title: 'Consulta', text: 'Entendemos tus preferencias musicales' },
      { title: 'Propuesta', text: 'Presupuesto y propuesta personalizada' },
      { title: 'Ensayo', text: 'Preparación y prueba de sonido' },
      { title: 'Evento', text: 'Actuación profesional garantizada' },
    ],
    defaultTestimonials: [
      { name: 'Boda García-López', role: 'Evento privado', text: 'Música excepcional en nuestra boda. Los invitados disfrutaron toda la noche.' },
    ],
    defaultFaqs: [
      { q: '¿Qué géneros tocáis?', a: 'Todos: clásico, pop, rock, jazz, flamenco, latino. Adaptamos a tu evento.' },
      { q: '¿Cuál es el presupuesto?', a: 'Desde 300€ para eventos pequeños hasta lo que necesites. Presupuestamos.' },
    ],
  },

  // ============ LEGAL Y FINANZAS ============
  abogacia: {
    id: 'abogacia',
    name: 'Abogacía',
    emoji: '⚖️',
    category: 'legal',
    colors: {
      primary: '#1a237e',
      secondary: '#283593',
      accent: '#8c9eff',
      cream: '#f3f3ff',
      ink: '#0d0d2b',
    },
    heroImage: 'https://images.unsplash.com/photo-1554224311-beee415c15cb?w=1200&q=80',
    defaultHeadline: 'Asesoría legal',
    defaultSubtitle: 'de confianza',
    defaultIntro: 'Servicios legales profesionales en derecho civil, mercantil y laboral con experiencia probada.',
    defaultServices: [
      { name: 'Derecho civil', desc: 'Asesoría en herencias, divorcios, compraventas inmobiliarias y contratos.', icon: '📜' },
      { name: 'Derecho mercantil', desc: 'Constitución de empresas, asesoría fiscal y litigios comerciales.', icon: '💼' },
      { name: 'Derecho laboral', desc: 'Asesoría laboral, despidos, reclamaciones y defensa ante inspecciones.', icon: '👥' },
    ],
    defaultBenefits: ['⚖️ Abogados colegiados', '🔒 Confidencialidad garantizada', '💪 Experiencia en litigios complejos'],
    defaultProcess: [
      { title: 'Consulta', text: 'Análisis del caso sin compromiso' },
      { title: 'Estrategia', text: 'Plan legal personalizado' },
      { title: 'Acción', text: 'Tramitación y representación' },
      { title: 'Resultado', text: 'Seguimiento hasta la resolución' },
    ],
    defaultTestimonials: [
      { name: 'Empresa García SA', role: 'Cliente corporativo', text: 'Excelentes abogados. Nos asesoraron en operación M&A con total profesionalidad.' },
    ],
    defaultFaqs: [
      { q: '¿Cuánto cuesta una asesoría?', a: 'Primera consulta gratuita. Luego según trabajo: por horas o proyecto.' },
      { q: '¿Hacéis litigios?', a: 'Sí, representamos en juzgados civiles, mercantiles y laborales.' },
    ],
  },

  contabilidad: {
    id: 'contabilidad',
    name: 'Contabilidad y Gestoría',
    emoji: '📊',
    category: 'legal',
    colors: {
      primary: '#00695c',
      secondary: '#00897b',
      accent: '#80deea',
      cream: '#e0f2f1',
      ink: '#002c2c',
    },
    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    defaultHeadline: 'Gestión fiscal',
    defaultSubtitle: 'transparente',
    defaultIntro: 'Servicios de contabilidad, asesoría fiscal y gestoría integral para empresas y autónomos.',
    defaultServices: [
      { name: 'Contabilidad completa', desc: 'Llevanza de libros, cuadres de caja y gestión contable integral de tu empresa.', icon: '📚' },
      { name: 'Asesoría fiscal', desc: 'Planificación fiscal, IVA, Impuesto de Sociedades y asesoría en impuestos.', icon: '💰' },
      { name: 'Gestoría administrativa', desc: 'Tramitación de permisos, licencias, registros y trámites administrativos.', icon: '📋' },
    ],
    defaultBenefits: ['🔐 Contables certificados', '📱 Software de contabilidad incluido', '⏰ Asesoría permanente'],
    defaultProcess: [
      { title: 'Análisis', text: 'Estudio de tu situación fiscal' },
      { title: 'Planificación', text: 'Plan fiscal personalizado' },
      { title: 'Ejecución', text: 'Tramitación de impuestos' },
      { title: 'Revisión', text: 'Auditoría y seguimiento anual' },
    ],
    defaultTestimonials: [
      { name: 'PyME Solutions', role: 'Empresa de software', text: 'Excelente gestoría. Nos han optimizado la fiscalidad y nos ahorran tiempo.' },
    ],
    defaultFaqs: [
      { q: '¿Cuánto cuesta la gestoría?', a: 'Desde 50€/mes en autónomos hasta planes empresariales customizados.' },
      { q: '¿Hacéis declaraciones de impuestos?', a: 'Sí, Renta, IVA, Impuesto de Sociedades, incluidas en el servicio.' },
    ],
  },

  // ============ NEGOCIO ============
  marketing: {
    id: 'marketing',
    name: 'Marketing Digital',
    emoji: '📱',
    category: 'negocio',
    colors: {
      primary: '#c41c3b',
      secondary: '#e63946',
      accent: '#f1faee',
      cream: '#f8f9fa',
      ink: '#1a1a1a',
    },
    heroImage: 'https://images.unsplash.com/photo-1460925895917-aaf4e01e843d?w=1200&q=80',
    defaultHeadline: 'Crece',
    defaultSubtitle: 'digitalmente',
    defaultIntro: 'Estrategias de marketing digital para aumentar visibilidad y convertir clientes.',
    defaultServices: [
      { name: 'Posicionamiento SEO', desc: 'Optimización en buscadores para que tus clientes te encuentren fácilmente.', icon: '🔍' },
      { name: 'Publicidad digital', desc: 'Campañas en Google Ads, redes sociales y publicidad programática.', icon: '📢' },
      { name: 'Gestión de redes', desc: 'Estrategia de contenido, community management y engagement en redes sociales.', icon: '📲' },
    ],
    defaultBenefits: ['📊 Resultados medibles y ROI claro', '🎯 Estrategia personalizada', '📈 Informes mensuales detallados'],
    defaultProcess: [
      { title: 'Análisis', text: 'Análisis de mercado y competencia' },
      { title: 'Estrategia', text: 'Plan de marketing personalizado' },
      { title: 'Ejecución', text: 'Campañas y seguimiento continuo' },
      { title: 'Optimización', text: 'Mejora constante según métricas' },
    ],
    defaultTestimonials: [
      { name: 'Tienda Online XYZ', role: 'E-commerce', text: 'Aumentamos ventas un 300% en 6 meses. Excelente estrategia de marketing.' },
    ],
    defaultFaqs: [
      { q: '¿Cuál es el ROI esperado?', a: 'Depende del sector y competencia. Normalmente 3-5x en 6 meses.' },
      { q: '¿Cuánto cuesta una campaña?', a: 'Desde 500€/mes en startups hasta planes enterprise customizados.' },
    ],
  },

  emprendedor: {
    id: 'emprendedor',
    name: 'Emprendedor',
    emoji: '🚀',
    category: 'negocio',
    colors: {
      primary: '#6a1b9a',
      secondary: '#7b1fa2',
      accent: '#ce93d8',
      cream: '#f3e5f5',
      ink: '#2d0052',
    },
    heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
    defaultHeadline: 'Tu idea es',
    defaultSubtitle: 'realidad',
    defaultIntro: 'Asesoría integral para emprendedores. Estrategia, ejecución y crecimiento garantizado.',
    defaultServices: [
      { name: 'Consultoría estratégica', desc: 'Análisis de mercado, plan de negocio y estrategia de crecimiento personalizada.', icon: '🎯' },
      { name: 'Implementación', desc: 'Ejecución de proyectos, gestión operativa y desarrollo de negocios.', icon: '⚙️' },
      { name: 'Mentoría y coaching', desc: 'Acompañamiento continuo, coaching empresarial y networking de negocios.', icon: '💼' },
    ],
    defaultBenefits: ['🚀 Experiencia en startups', '📈 Casos de éxito comprobados', '🤝 Red de contactos y partners'],
    defaultProcess: [
      { title: 'Diagnóstico', text: 'Análisis de tu idea y mercado' },
      { title: 'Plan', text: 'Plan de negocio y roadmap' },
      { title: 'Ejecución', text: 'Implementación y gestión' },
      { title: 'Escalado', text: 'Crecimiento y optimización' },
    ],
    defaultTestimonials: [
      { name: 'StartUp XYZ', role: 'Empresa emergente', text: 'Nos ayudaron a crecer de 0 a 1M en ingresos. Asesoría integral y valiosa.' },
    ],
    defaultFaqs: [
      { q: '¿Cuánto cuesta la mentoría?', a: 'Desde 200€/sesión individual hasta planes anuales con descuento.' },
      { q: '¿Hacéis pitch deck?', a: 'Sí, preparamos presentaciones para inversores y pitch perfeccionado.' },
    ],
  },
}

export function getTradeConfig(tradeId: string): TradeConfig {
  return TRADES[tradeId] || TRADES.emprendedor
}

export function getAllTrades(): Array<{ id: string; name: string; emoji: string; category: string }> {
  return Object.values(TRADES).map(t => ({ id: t.id, name: t.name, emoji: t.emoji, category: t.category }))
}

export function getTradesByCategory(category: string): TradeConfig[] {
  return Object.values(TRADES).filter(t => t.category === category)
}
