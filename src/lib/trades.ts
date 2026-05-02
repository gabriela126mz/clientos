// src/lib/trades.ts
// CONFIGURACIÓN COMPLETA DE OFICIOS CON IMÁGENES ESPECÍFICAS

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
  jardineria: {
    id: 'jardineria',
    name: 'Jardinería',
    emoji: '🌿',
    category: 'construccion',
    colors: { primary: '#2d5a27', secondary: '#3d7a35', accent: '#c8a96e', cream: '#faf7f2', ink: '#1a2818' },
    heroImage: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1600&q=80',
    defaultHeadline: 'Jardines que',
    defaultSubtitle: 'enamoran',
    defaultIntro: 'Diseño, construcción y mantenimiento de jardines profesionales. Equipo propio, presupuesto claro, sin sorpresas.',
    defaultServices: [
      { name: 'Diseño y paisajismo', desc: 'Proyectamos tu jardín desde cero: estudio del espacio, elección de plantas, materiales y estilo.', icon: '🌿' },
      { name: 'Obra y ejecución', desc: 'Transformamos el proyecto en realidad con equipo propio, sin subcontratas. Materiales de primera.', icon: '🏗️' },
      { name: 'Mantenimiento', desc: 'El mismo equipo que crea tu jardín lo cuida mes a mes. Poda, riego, tratamientos profesionales.', icon: '✂️' },
    ],
    defaultBenefits: ['Equipo propio y profesional', 'Presupuesto claro sin sorpresas', 'Garantía de satisfacción incluida'],
    defaultProcess: [
      { title: 'Consulta', text: 'Entendemos tu necesidad y visitamos el espacio' },
      { title: 'Diseño', text: 'Creamos una propuesta personalizada y presupuesto' },
      { title: 'Ejecución', text: 'Realizamos la obra con profesionalismo y calidad' },
      { title: 'Mantenimiento', text: 'Cuidamos tu proyecto a largo plazo' },
    ],
    defaultTestimonials: [
      { name: 'Carmen R.', role: 'Propietaria', text: 'Transformaron nuestro jardín por completo. Puntuales, limpios y el resultado superó nuestras expectativas.' },
      { name: 'Bufete Martín', role: 'Empresa', text: 'Llevan el mantenimiento de nuestras terrazas hace 3 años. Siempre impecable y puntuales.' },
      { name: 'Pedro A.', role: 'Particular', text: 'Sin sorpresas en el presupuesto. El jardín quedó tal como lo imaginábamos. Muy profesionales.' },
    ],
    defaultFaqs: [
      { q: '¿Cuál es el presupuesto mínimo?', a: 'No hay mínimo. Desde pequeños trabajos de mantenimiento hasta proyectos completos.' },
      { q: '¿Cuánto tarda un proyecto?', a: 'Depende de la magnitud. Un jardín pequeño: 1-2 semanas. Proyectos grandes: 4-8 semanas.' },
      { q: '¿Dais garantía?', a: 'Sí. Garantizamos la calidad de nuestro trabajo durante 2 años.' },
      { q: '¿Trabajáis fuera de Madrid?', a: 'Principalmente en Madrid y alrededores. Consulta tu zona y confirmamos disponibilidad.' },
    ],
  },

  reformas: {
    id: 'reformas',
    name: 'Reformas',
    emoji: '🏗️',
    category: 'construccion',
    colors: { primary: '#6b4423', secondary: '#8b5a2b', accent: '#d4a574', cream: '#faf8f5', ink: '#3d2817' },
    heroImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80',
    defaultHeadline: 'Reformas',
    defaultSubtitle: 'con garantía',
    defaultIntro: 'Reformas integrales y parciales. Cocinas, baños, locales. Proyecto, licencias y ejecución llave en mano.',
    defaultServices: [
      { name: 'Reformas integrales', desc: 'Transformamos tu vivienda completa. Desde el proyecto hasta la última bombilla.', icon: '🏠' },
      { name: 'Cocinas y baños', desc: 'Especialistas en reformar los espacios más técnicos de tu casa con acabados impecables.', icon: '🚿' },
      { name: 'Locales comerciales', desc: 'Adecuamos tu local al negocio que imaginas. Permisos, obra y puesta en marcha.', icon: '🏪' },
    ],
    defaultBenefits: ['Proyecto y licencias incluidas', 'Acabados de alta calidad', 'Garantía de 10 años en obra'],
    defaultProcess: [
      { title: 'Visita', text: 'Medimos y entendemos lo que necesitas' },
      { title: 'Proyecto', text: 'Diseño 3D y presupuesto cerrado' },
      { title: 'Obra', text: 'Ejecución limpia y en plazo' },
      { title: 'Entrega', text: 'Revisión final y garantías' },
    ],
    defaultTestimonials: [
      { name: 'Ana M.', role: 'Piso en Chamberí', text: 'Reforma integral impecable. Cumplieron plazos y presupuesto. Lo recomiendo sin dudarlo.' },
      { name: 'Restaurante La Ola', role: 'Local comercial', text: 'Nos abrieron el local en tiempo récord. Profesionales en todo momento.' },
      { name: 'Jorge S.', role: 'Baño completo', text: 'Tardaron exactamente lo que dijeron. Quedó perfecto y sin sorpresas.' },
    ],
    defaultFaqs: [
      { q: '¿Incluye el proyecto?', a: 'Sí. Proyecto técnico, renders 3D y tramitación de licencias incluido en el presupuesto.' },
      { q: '¿Cuánto dura una reforma integral?', a: 'Entre 6 y 12 semanas según tamaño. Te damos calendario realista desde el inicio.' },
      { q: '¿Puedo vivir en casa durante la obra?', a: 'Depende. En reformas parciales sí. En integrales recomendamos mudarse temporalmente.' },
      { q: '¿Qué garantía ofrecéis?', a: '10 años en estructura, 5 en instalaciones y 2 en acabados. Todo por escrito.' },
    ],
  },

  fontaneria: {
    id: 'fontaneria',
    name: 'Fontanería',
    emoji: '🔧',
    category: 'servicios',
    colors: { primary: '#0288d1', secondary: '#03a9f4', accent: '#81d4fa', cream: '#e1f5fe', ink: '#01579b' },
    heroImage: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1600&q=80',
    defaultHeadline: 'Fontanería',
    defaultSubtitle: '24 horas',
    defaultIntro: 'Servicio de fontanería urgente y programado. Reparaciones, instalaciones y mantenimiento profesional.',
    defaultServices: [
      { name: 'Urgencias 24h', desc: 'Atendemos fugas, atascos y averías graves cualquier día a cualquier hora.', icon: '🚨' },
      { name: 'Instalaciones', desc: 'Calderas, radiadores, agua caliente. Instalación y certificado oficial.', icon: '🔧' },
      { name: 'Reformas de baño', desc: 'Cambiamos todo el sistema de fontanería en tu reforma de baño o cocina.', icon: '🚿' },
    ],
    defaultBenefits: ['Disponibles 24/7 todo el año', 'Presupuesto antes de empezar', 'Materiales de calidad garantizada'],
    defaultProcess: [
      { title: 'Llamada', text: 'Explicas el problema y concretamos visita' },
      { title: 'Diagnóstico', text: 'Revisamos y te damos presupuesto cerrado' },
      { title: 'Reparación', text: 'Arreglamos el problema con garantía' },
      { title: 'Garantía', text: 'Seguimiento y garantía por escrito' },
    ],
    defaultTestimonials: [
      { name: 'Laura P.', role: 'Urgencia nocturna', text: 'Fuga a las 2 AM. En 40 minutos estaban en casa y lo arreglaron. Increíble servicio.' },
      { name: 'Comunidad Alcalá 125', role: 'Edificio completo', text: 'Nos cambiaron todas las bajantes. Obra limpia, rápida y sin problemas.' },
      { name: 'Miguel R.', role: 'Caldera nueva', text: 'Instalación perfecta. Explicaron todo claramente y dejaron la casa impoluta.' },
    ],
    defaultFaqs: [
      { q: '¿Cobráis la visita?', a: 'No. La visita y diagnóstico son gratis. Solo pagas si aceptas el presupuesto.' },
      { q: '¿Cuánto tardáis en urgencias?', a: 'En Madrid ciudad llegamos en menos de 1 hora. En zona sur, 90 minutos máximo.' },
      { q: '¿Tenéis garantía?', a: 'Sí. 2 años en todas nuestras reparaciones e instalaciones.' },
      { q: '¿Trabajáis festivos?', a: 'Sí. Estamos operativos 365 días al año, 24 horas.' },
    ],
  },

  electricidad: {
    id: 'electricidad',
    name: 'Electricidad',
    emoji: '⚡',
    category: 'servicios',
    colors: { primary: '#f57c00', secondary: '#ff9800', accent: '#ffb74d', cream: '#fff3e0', ink: '#e65100' },
    heroImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&q=80',
    defaultHeadline: 'Electricistas',
    defaultSubtitle: 'certificados',
    defaultIntro: 'Instalaciones eléctricas, boletines, urgencias 24h. Electricistas autorizados con certificado oficial.',
    defaultServices: [
      { name: 'Boletines eléctricos', desc: 'Certificados oficiales para compraventa, alquiler o inspección. Entrega en 48h.', icon: '📋' },
      { name: 'Cuadros eléctricos', desc: 'Actualizamos tu cuadro antiguo a normativa. Magnetotérmicos, diferenciales, ICP.', icon: '⚡' },
      { name: 'Averías urgentes', desc: 'Sin luz, saltos de corriente, enchufes que no funcionan. Lo arreglamos ya.', icon: '🚨' },
    ],
    defaultBenefits: ['Electricistas autorizados oficialmente', 'Boletín en 48 horas', 'Garantía de 3 años en instalaciones'],
    defaultProcess: [
      { title: 'Contacto', text: 'Nos cuentas qué necesitas' },
      { title: 'Visita', text: 'Revisamos y hacemos presupuesto' },
      { title: 'Instalación', text: 'Trabajo certificado y limpio' },
      { title: 'Boletín', text: 'Te damos certificado oficial sellado' },
    ],
    defaultTestimonials: [
      { name: 'Inmobiliaria Casanova', role: 'Agencia', text: 'Nos hacen todos los boletines. Rápidos, serios y precio justo.' },
      { name: 'Carlos M.', role: 'Piso antiguo', text: 'Cambiaron todo el cuadro en una mañana. Dejaron todo limpio y funcionando perfecto.' },
      { name: 'Sara G.', role: 'Urgencia fin de semana', text: 'Me quedé sin luz un sábado. Vinieron en 1 hora y lo arreglaron. Salvadores.' },
    ],
    defaultFaqs: [
      { q: '¿Cuánto cuesta un boletín?', a: 'Desde 90€ según metros. Incluye visita, revisión y certificado oficial sellado.' },
      { q: '¿Cuánto tarda el boletín?', a: 'Una vez revisada la instalación, entregamos el boletín en 48 horas.' },
      { q: '¿Sois electricistas autorizados?', a: 'Sí. Instaladores autorizados por la Comunidad de Madrid. Certificados oficiales.' },
      { q: '¿Atendéis urgencias?', a: 'Sí. Urgencias 24h todos los días. Consulta coste de desplazamiento nocturno.' },
    ],
  },

  limpieza: {
    id: 'limpieza',
    name: 'Limpieza',
    emoji: '✨',
    category: 'servicios',
    colors: { primary: '#1e5a96', secondary: '#2874b5', accent: '#6db3f2', cream: '#e8f4fc', ink: '#0d3d66' },
    heroImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1600&q=80',
    defaultHeadline: 'Limpieza',
    defaultSubtitle: 'profesional',
    defaultIntro: 'Servicio de limpieza para hogares, oficinas y comunidades. Personal propio, productos ecológicos, total confianza.',
    defaultServices: [
      { name: 'Limpieza de hogar', desc: 'Servicio recurrente o puntual. Plancha incluida si lo necesitas. Productos ecológicos.', icon: '🏠' },
      { name: 'Oficinas', desc: 'Limpieza diaria o semanal de oficinas y espacios de trabajo. Discreción garantizada.', icon: '🏢' },
      { name: 'Fin de obra', desc: 'Dejamos tu reforma reluciente. Polvo, escombros, ventanas. Todo impecable.', icon: '🔨' },
    ],
    defaultBenefits: ['Personal de confianza verificado', 'Productos ecológicos certificados', 'Seguro de responsabilidad civil'],
    defaultProcess: [
      { title: 'Consulta', text: 'Nos cuentas qué necesitas limpiar' },
      { title: 'Presupuesto', text: 'Te damos precio fijo mensual o puntual' },
      { title: 'Primera visita', text: 'Limpieza a fondo para empezar bien' },
      { title: 'Recurrente', text: 'Mismo equipo cada semana o quincena' },
    ],
    defaultTestimonials: [
      { name: 'Familia Ortega', role: 'Hogar', text: 'Vienen cada semana desde hace 2 años. Son de total confianza. La casa siempre perfecta.' },
      { name: 'Estudio de Arquitectura', role: 'Oficina', text: 'Servicio impecable. Vienen por la tarde y respetan nuestro material. Muy profesionales.' },
      { name: 'Promotora SUR', role: 'Fin de obra', text: 'Nos limpian todos los pisos nuevos antes de entrega. Trabajo excepcional siempre.' },
    ],
    defaultFaqs: [
      { q: '¿Tengo que estar en casa?', a: 'No. Muchos clientes nos dejan llave. Trabajamos con total confianza y discreción.' },
      { q: '¿Traéis productos?', a: 'Sí. Llevamos todo el material y productos ecológicos certificados sin coste adicional.' },
      { q: '¿Qué pasa si rompen algo?', a: 'Tenemos seguro de responsabilidad civil. Cualquier incidencia queda cubierta.' },
      { q: '¿Cuánto cuesta?', a: 'Desde 15€/hora. Hogar 3h semanal: 180€/mes. Presupuesto personalizado sin compromiso.' },
    ],
  },

  estetica: {
    id: 'estetica',
    name: 'Estética',
    emoji: '💆',
    category: 'belleza',
    colors: { primary: '#c2185b', secondary: '#e91e63', accent: '#ffb6c1', cream: '#fce4ec', ink: '#880e4f' },
    heroImage: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=1600&q=80',
    defaultHeadline: 'Belleza',
    defaultSubtitle: 'natural',
    defaultIntro: 'Centro de estética avanzada. Tratamientos faciales, corporales, depilación láser. Profesionales tituladas, tecnología puntera.',
    defaultServices: [
      { name: 'Tratamientos faciales', desc: 'Limpieza profunda, radiofrecuencia, peeling. Piel radiante y rejuvenecida.', icon: '✨' },
      { name: 'Depilación láser', desc: 'Tecnología diodo de última generación. Resultados permanentes, sin dolor.', icon: '💆' },
      { name: 'Corporal', desc: 'Presoterapia, cavitación, radiofrecuencia. Reafirma y esculpe tu silueta.', icon: '🌟' },
    ],
    defaultBenefits: ['Esteticistas tituladas y certificadas', 'Aparatología de última generación', 'Primera consulta y diagnóstico gratis'],
    defaultProcess: [
      { title: 'Consulta', text: 'Diagnóstico de piel y objetivos gratis' },
      { title: 'Plan', text: 'Diseñamos tu tratamiento personalizado' },
      { title: 'Sesiones', text: 'Cada sesión con la misma especialista' },
      { title: 'Seguimiento', text: 'Evaluamos resultados y ajustamos' },
    ],
    defaultTestimonials: [
      { name: 'Marta L.', role: 'Depilación láser', text: '8 sesiones y ya no tengo que depilarme. No me lo creía. Lo mejor que he hecho.' },
      { name: 'Cristina R.', role: 'Tratamiento facial', text: 'Mi piel cambió completamente. Profesionales, atentas y resultados increíbles.' },
      { name: 'Elena S.', role: 'Radiofrecuencia', text: 'Notaba la piel flácida y ahora está firme. El cambio fue progresivo pero real.' },
    ],
    defaultFaqs: [
      { q: '¿La depilación láser duele?', a: 'Apenas se nota. Nuestro láser tiene sistema de frío integrado. Muy tolerable.' },
      { q: '¿Cuántas sesiones necesito?', a: 'Depilación: 8-10 sesiones. Faciales: desde 6. Te damos plan personalizado en consulta.' },
      { q: '¿Tenéis financiación?', a: 'Sí. Bonos con descuento y financiación hasta 12 meses sin intereses.' },
      { q: '¿La primera consulta es gratis?', a: 'Sí. Diagnóstico completo sin compromiso. Solo pagas si decides hacer tratamiento.' },
    ],
  },

  peluqueria: {
    id: 'peluqueria',
    name: 'Peluquería',
    emoji: '💇',
    category: 'belleza',
    colors: { primary: '#8b4513', secondary: '#a0522d', accent: '#daa520', cream: '#faebd7', ink: '#5d2e0f' },
    heroImage: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1600&q=80',
    defaultHeadline: 'Tu pelo',
    defaultSubtitle: 'perfecto',
    defaultIntro: 'Salón de peluquería especializado en color, mechas y tratamientos capilares. Productos profesionales, estilistas con experiencia.',
    defaultServices: [
      { name: 'Color y mechas', desc: 'Balayage, babylights, tintes personalizados. Color natural y duradero con productos premium.', icon: '🎨' },
      { name: 'Corte y peinado', desc: 'Asesoramiento de estilo según tu rostro. Corte, secado y peinado profesional.', icon: '✂️' },
      { name: 'Tratamientos', desc: 'Keratina, botox capilar, hidratación profunda. Pelo sano desde la raíz.', icon: '💆' },
    ],
    defaultBenefits: ['Estilistas especializados con formación continua', 'Productos profesionales de alta gama', 'Diagnóstico capilar personalizado gratis'],
    defaultProcess: [
      { title: 'Consulta', text: 'Analizamos tu cabello y estilo' },
      { title: 'Propuesta', text: 'Te mostramos resultado con fotos' },
      { title: 'Servicio', text: 'Trabajamos con calma y detalle' },
      { title: 'Mantenimiento', text: 'Te damos plan de cuidado en casa' },
    ],
    defaultTestimonials: [
      { name: 'Patricia M.', role: 'Clienta habitual', text: 'Llevo 5 años viniendo. Nunca me han fallado. Siempre salgo encantada del salón.' },
      { name: 'Andrea V.', role: 'Mechas balayage', text: 'El color quedó espectacular. Natural, luminoso. Justo lo que quería. Muy profesionales.' },
      { name: 'Sofía G.', role: 'Tratamiento keratina', text: 'Tenía el pelo destrozado. Después de la keratina está brillante y manejable. Brutal.' },
    ],
    defaultFaqs: [
      { q: '¿Necesito cita previa?', a: 'Sí. Trabajamos solo con cita para dedicarte el tiempo que mereces sin esperas.' },
      { q: '¿Qué productos usáis?', a: 'Productos profesionales de alta gama. Solo marcas premium reconocidas internacionalmente.' },
      { q: '¿Cuánto dura una sesión de mechas?', a: 'Entre 2.5 y 4 horas según largo y técnica. Te damos tiempo estimado al reservar.' },
      { q: '¿Hacéis servicios a domicilio?', a: 'No. Todo el equipamiento y productos están en el salón para mejor resultado.' },
    ],
  },

  gym: {
    id: 'gym',
    name: 'Gimnasio',
    emoji: '💪',
    category: 'salud',
    colors: { primary: '#d32f2f', secondary: '#f44336', accent: '#ff5252', cream: '#ffebee', ink: '#b71c1c' },
    heroImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80',
    defaultHeadline: 'Tu mejor',
    defaultSubtitle: 'versión',
    defaultIntro: 'Centro deportivo con sala fitness, clases dirigidas y entrenamiento personal. Instalaciones modernas, ambiente motivador.',
    defaultServices: [
      { name: 'Sala de musculación', desc: 'Equipamiento Technogym de última generación. Espacio amplio, climatizado, música motivadora.', icon: '💪' },
      { name: 'Clases dirigidas', desc: 'Spinning, yoga, pilates, zumba, funcional. Grupos reducidos con instructores certificados.', icon: '🧘' },
      { name: 'Entrenador personal', desc: 'Plan personalizado según tus objetivos. Seguimiento semanal, nutrición incluida.', icon: '👨‍🏫' },
    ],
    defaultBenefits: ['Instalaciones nuevas y climatizadas', 'Horario amplío 6:00-23:00', 'Primera semana gratis de prueba'],
    defaultProcess: [
      { title: 'Prueba gratis', text: 'Primera semana sin compromiso' },
      { title: 'Valoración', text: 'Medimos composición corporal' },
      { title: 'Plan', text: 'Rutina personalizada y objetivos' },
      { title: 'Seguimiento', text: 'Ajustamos según evolución' },
    ],
    defaultTestimonials: [
      { name: 'Javier M.', role: 'Socio desde 2022', text: 'Mejor gym de la zona. Limpio, buenas máquinas y buen rollo. Vale cada euro.' },
      { name: 'Laura S.', role: 'Entrenamiento personal', text: 'Perdí 15 kilos en 6 meses con mi entrenador. Cambió mi vida completamente.' },
      { name: 'David R.', role: 'Clases de spinning', text: 'Las clases son adictivas. Instructores motivadores y grupos pequeños. Me encanta.' },
    ],
    defaultFaqs: [
      { q: '¿Tenéis cuota de matrícula?', a: 'No. Solo pagas la mensualidad. Sin permanencia, puedes darte de baja cuando quieras.' },
      { q: '¿Qué incluye la cuota?', a: 'Sala de musculación ilimitada + todas las clases dirigidas. Entrenador personal aparte.' },
      { q: '¿Hay vestuarios?', a: 'Sí. Vestuarios amplios con taquillas, duchas y productos de higiene gratuitos.' },
      { q: '¿Hacéis descuentos?', a: 'Sí. Parejas, familias y estudiantes tienen precio especial. Pregunta en recepción.' },
    ],
  },

  veterinaria: {
    id: 'veterinaria',
    name: 'Veterinaria',
    emoji: '🐾',
    category: 'salud',
    colors: { primary: '#558b2f', secondary: '#689f38', accent: '#aed581', cream: '#f1f8e9', ink: '#33691e' },
    heroImage: 'https://images.unsplash.com/photo-1530041539828-114de669390e?w=1600&q=80',
    defaultHeadline: 'Cuidamos',
    defaultSubtitle: 'tu mascota',
    defaultIntro: 'Clínica veterinaria con servicio integral. Medicina preventiva, cirugía, urgencias 24h. Equipo de veterinarios especializados.',
    defaultServices: [
      { name: 'Consulta y vacunación', desc: 'Revisiones completas, vacunas obligatorias, desparasitación. Cartilla al día.', icon: '💉' },
      { name: 'Cirugía', desc: 'Quirófano equipado, anestesia monitorizada. Castraciones, limpiezas, cirugías complejas.', icon: '🏥' },
      { name: 'Urgencias 24h', desc: 'Veterinario de guardia todos los días. Atendemos emergencias inmediatamente.', icon: '🚨' },
    ],
    defaultBenefits: ['Veterinarios colegiados con especialización', 'Quirófano propio con tecnología avanzada', 'Urgencias 24 horas los 365 días'],
    defaultProcess: [
      { title: 'Primera visita', text: 'Conocemos a tu mascota y hacemos historial' },
      { title: 'Diagnóstico', text: 'Revisión completa y pruebas si hacen falta' },
      { title: 'Tratamiento', text: 'Explicamos opciones y decidimos juntos' },
      { title: 'Seguimiento', text: 'Llamamos para ver evolución' },
    ],
    defaultTestimonials: [
      { name: 'Carmen con Luna', role: 'Perra mestiza', text: 'Salvaron a Luna de una urgencia grave. Profesionales, empáticos. Ahora solo vamos aquí.' },
      { name: 'Miguel con Thor', role: 'Pastor alemán', text: 'Le operaron la cadera y la recuperación fue perfecta. Trato excelente en todo momento.' },
      { name: 'Ana con Misi', role: 'Gata persa', text: 'Misi tiene diabetes y la controlan genial. Siempre disponibles para dudas. Muy implicados.' },
    ],
    defaultFaqs: [
      { q: '¿Cuánto cuesta una consulta?', a: 'Consulta general 35€. Incluye revisión completa y asesoramiento. Pruebas aparte si hacen falta.' },
      { q: '¿Atendéis urgencias por la noche?', a: 'Sí. Urgencias 24h todos los días. Llama antes de venir para que te esperen preparados.' },
      { q: '¿Hacéis análisis?', a: 'Sí. Laboratorio propio. Analíticas de sangre, orina, copro. Resultados en el día.' },
      { q: '¿Tenéis hospitalización?', a: 'Sí. Boxes de hospitalización con vigilancia continua. Actualizamos a dueños cada 4 horas.' },
    ],
  },

  informatica: {
    id: 'informatica',
    name: 'Informática',
    emoji: '💻',
    category: 'tech',
    colors: { primary: '#1976d2', secondary: '#2196f3', accent: '#64b5f6', cream: '#e3f2fd', ink: '#0d47a1' },
    heroImage: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1600&q=80',
    defaultHeadline: 'Soporte',
    defaultSubtitle: 'informático',
    defaultIntro: 'Servicio técnico de informática para empresas y particulares. Reparación, redes, servidores. Asistencia remota y presencial.',
    defaultServices: [
      { name: 'Reparación ordenadores', desc: 'Arreglamos portátiles, sobremesa, Mac. Pantallas, teclados, discos duros, virus.', icon: '🔧' },
      { name: 'Redes y servidores', desc: 'Instalamos WiFi profesional, NAS, servidores. Configuración segura y estable.', icon: '🌐' },
      { name: 'Soporte empresas', desc: 'Mantenimiento informático mensual. Resolvemos incidencias en remoto o presencial.', icon: '🏢' },
    ],
    defaultBenefits: ['Diagnóstico gratuito sin compromiso', 'Asistencia remota en 15 minutos', 'Garantía de 6 meses en reparaciones'],
    defaultProcess: [
      { title: 'Contacto', text: 'Nos cuentas el problema' },
      { title: 'Diagnóstico', text: 'Revisamos y damos presupuesto' },
      { title: 'Reparación', text: 'Arreglamos y probamos todo' },
      { title: 'Entrega', text: 'Devolvemos con factura y garantía' },
    ],
    defaultTestimonials: [
      { name: 'Despacho de abogados', role: 'Empresa', text: 'Nos llevan el soporte hace 2 años. Incidencias resueltas rápido, siempre disponibles.' },
      { name: 'Roberto M.', role: 'Particular', text: 'Me recuperaron datos de un disco roto. No me lo creía. Profesionales de verdad.' },
      { name: 'StartUp TechFlow', role: 'Oficina', text: 'Nos montaron toda la red y servidores. Funciona perfecto desde el día 1.' },
    ],
    defaultFaqs: [
      { q: '¿Venís a domicilio?', a: 'Sí. Servicio a domicilio en Madrid y alrededores. También tenemos taller si prefieres traerlo.' },
      { q: '¿Recuperáis datos borrados?', a: 'Sí. Recuperación de datos de discos dañados, formateados o rotos. Valoración gratuita.' },
      { q: '¿Trabajáis con Mac?', a: 'Sí. Reparamos Mac, Windows y Linux. Tenemos piezas originales Apple certificadas.' },
      { q: '¿Cuánto tarda una reparación?', a: 'Urgente: 24-48h. Normal: 3-5 días. Depende de disponibilidad de piezas.' },
    ],
  },

  fotografia: {
    id: 'fotografia',
    name: 'Fotografía',
    emoji: '📸',
    category: 'entretenimiento',
    colors: { primary: '#37474f', secondary: '#546e7a', accent: '#90a4ae', cream: '#eceff1', ink: '#263238' },
    heroImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1600&q=80',
    defaultHeadline: 'Capturamos',
    defaultSubtitle: 'momentos',
    defaultIntro: 'Fotografía profesional para bodas, eventos, retrato y producto. Estilo natural, emotivo y atemporal.',
    defaultServices: [
      { name: 'Bodas', desc: 'Cobertura completa desde preparativos hasta fiesta. Estilo documental, emotivo y elegante.', icon: '💍' },
      { name: 'Eventos corporativos', desc: 'Fotografía de empresa, congresos, presentaciones. Entrega express en 48h.', icon: '🏢' },
      { name: 'Producto y publicidad', desc: 'Fotos de producto para ecommerce, catálogos. Fondo blanco o lifestyle.', icon: '📦' },
    ],
    defaultBenefits: ['Fotógrafo profesional con 10 años de experiencia', 'Todas las fotos editadas y en alta resolución', 'Álbum de boda diseñado incluido'],
    defaultProcess: [
      { title: 'Reunión', text: 'Conocemos tu idea y te enseñamos portfolio' },
      { title: 'Propuesta', text: 'Presupuesto detallado según cobertura' },
      { title: 'Sesión', text: 'Fotografía relajada y natural' },
      { title: 'Entrega', text: 'Galería online + USB + álbum si aplica' },
    ],
    defaultTestimonials: [
      { name: 'Marta y David', role: 'Boda 2024', text: 'Inmortalizó nuestra boda perfectamente. Fotos preciosas, naturales, llenas de emoción.' },
      { name: 'Empresa TextilMad', role: 'Catálogo producto', text: 'Fotografías de catálogo impecables. Profesional, rápido y precio muy competitivo.' },
      { name: 'Congreso MedTech', role: 'Evento corporativo', text: 'Cubrió nuestro congreso de 3 días. Fotos entregadas al día siguiente. Increíble.' },
    ],
    defaultFaqs: [
      { q: '¿Cuántas fotos entregáis de una boda?', a: 'Entre 400 y 600 fotos editadas en alta. Todas las que merezcan la pena, sin límite.' },
      { q: '¿Cuánto tarda la entrega?', a: 'Bodas: 4-6 semanas. Eventos: 48h. Producto: 1 semana. Adelanto de 20 fotos en 48h.' },
      { q: '¿Hacéis vídeo también?', a: 'No, solo fotografía. Podemos recomendar videógrafos de confianza si lo necesitas.' },
      { q: '¿Viajáis fuera de Madrid?', a: 'Sí. Trabajamos por toda España. Gastos de desplazamiento y alojamiento aparte.' },
    ],
  },

  abogacia: {
    id: 'abogacia',
    name: 'Abogacía',
    emoji: '⚖️',
    category: 'legal',
    colors: { primary: '#1a237e', secondary: '#283593', accent: '#5c6bc0', cream: '#e8eaf6', ink: '#0d1451' },
    heroImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=80',
    defaultHeadline: 'Defensa',
    defaultSubtitle: 'legal experta',
    defaultIntro: 'Despacho de abogados especializado en civil, laboral y familia. Asesoramiento personalizado, trato cercano, experiencia probada.',
    defaultServices: [
      { name: 'Derecho de familia', desc: 'Divorcios, custodias, pensiones. Te acompañamos con empatía en momentos difíciles.', icon: '👨‍👩‍👧' },
      { name: 'Derecho laboral', desc: 'Despidos, reclamaciones, accidentes. Defendemos tus derechos como trabajador.', icon: '💼' },
      { name: 'Derecho civil', desc: 'Contratos, herencias, reclamaciones. Asesoramiento claro en lenguaje sencillo.', icon: '📄' },
    ],
    defaultBenefits: ['Primera consulta gratuita de 30 minutos', 'Abogados colegiados con 15 años de experiencia', 'Honorarios claros sin sorpresas'],
    defaultProcess: [
      { title: 'Consulta gratis', text: 'Analizamos tu caso sin compromiso' },
      { title: 'Presupuesto', text: 'Honorarios claros desde el inicio' },
      { title: 'Estrategia', text: 'Plan de acción adaptado a tu caso' },
      { title: 'Defensa', text: 'Te representamos hasta el final' },
    ],
    defaultTestimonials: [
      { name: 'Laura M.', role: 'Divorcio contencioso', text: 'Proceso duro pero me acompañaron en todo. Resultado justo y trato humano. Gracias.' },
      { name: 'Javier R.', role: 'Despido improcedente', text: 'Gané el juicio y recuperé mi puesto. Abogados luchadores que saben lo que hacen.' },
      { name: 'Familia García', role: 'Herencia', text: 'Resolvieron una herencia complicada. Claros, profesionales y pacientes. Muy recomendables.' },
    ],
    defaultFaqs: [
      { q: '¿Cuánto cuesta la primera consulta?', a: 'Gratis. 30 minutos para conocer tu caso y explicarte opciones sin compromiso.' },
      { q: '¿Cómo cobráis?', a: 'Según tipo de caso: cuota fija, cuota + éxito, o solo éxito. Lo hablamos en consulta.' },
      { q: '¿Cuánto dura un juicio?', a: 'Depende. Laboral: 6-12 meses. Civil: 1-2 años. Familia: 6-18 meses. Te damos estimación.' },
      { q: '¿Tenéis justicia gratuita?', a: 'Sí. Si cumples requisitos económicos podemos tramitarte el turno de oficio.' },
    ],
  },

  contabilidad: {
    id: 'contabilidad',
    name: 'Contabilidad',
    emoji: '📊',
    category: 'negocio',
    colors: { primary: '#00695c', secondary: '#00897b', accent: '#4db6ac', cream: '#e0f2f1', ink: '#004d40' },
    heroImage: 'https://images.unsplash.com/photo-1554224311-beee415c15cb?w=1600&q=80',
    defaultHeadline: 'Gestoría',
    defaultSubtitle: 'de confianza',
    defaultIntro: 'Asesoría fiscal y contable para autónomos y pymes. Llevamos tus impuestos, nóminas y contabilidad. Trato cercano, digitalización total.',
    defaultServices: [
      { name: 'Autónomos', desc: 'Alta, trimestres, IRPF, seguros sociales. Todo gestionado para que te centres en tu negocio.', icon: '👤' },
      { name: 'Pymes', desc: 'Contabilidad, IVA, IS, nóminas. Gestoría completa adaptada a tu empresa.', icon: '🏢' },
      { name: 'Asesoría fiscal', desc: 'Optimizamos tu carga fiscal legalmente. Planificación y gestión de inspecciones.', icon: '📈' },
    ],
    defaultBenefits: ['Gestores colegiados con 20 años de experiencia', 'Plataforma online para ver documentos 24/7', 'Respuesta en menos de 24 horas'],
    defaultProcess: [
      { title: 'Diagnóstico', text: 'Vemos tu situación actual gratis' },
      { title: 'Propuesta', text: 'Cuota fija mensual sin sorpresas' },
      { title: 'Alta', text: 'Digitalizamos todo tu historial' },
      { title: 'Gestión', text: 'Llevamos todo, tú tranquilo' },
    ],
    defaultTestimonials: [
      { name: 'Carlos - Autónomo', role: 'Diseñador freelance', text: 'Llevo 3 años con ellos. No me preocupo de nada. Siempre disponibles para dudas.' },
      { name: 'Cafetería Nube', role: 'Hostelería', text: 'Nos llevan contabilidad y nóminas. Serios, atentos y precio justo. Muy contentos.' },
      { name: 'Startup InnovaTech', role: 'Tecnología', text: 'Nos ayudaron desde la constitución. Asesoramiento fiscal impecable. Totalmente recomendables.' },
    ],
    defaultFaqs: [
      { q: '¿Cuánto cuesta para autónomos?', a: 'Desde 50€/mes todo incluido: trimestres, IRPF, seguros sociales, consultas ilimitadas.' },
      { q: '¿Hacéis el alta de autónomo?', a: 'Sí. Alta en Hacienda, Seguridad Social y gestoría. Sin coste adicional al contratar.' },
      { q: '¿Puedo ver mis documentos online?', a: 'Sí. Plataforma web donde ves facturas, declaraciones, nóminas. Acceso 24/7.' },
      { q: '¿Qué pasa si Hacienda me inspecciona?', a: 'Te representamos y defendemos sin coste extra. Está incluido en la cuota mensual.' },
    ],
  },

  marketing: {
    id: 'marketing',
    name: 'Marketing',
    emoji: '📱',
    category: 'negocio',
    colors: { primary: '#c41c3b', secondary: '#d32f2f', accent: '#ff5252', cream: '#ffebee', ink: '#8e1428' },
    heroImage: 'https://images.unsplash.com/photo-1460925895917-aaf4e01e843d?w=1600&q=80',
    defaultHeadline: 'Marketing',
    defaultSubtitle: 'que vende',
    defaultIntro: 'Agencia de marketing digital y diseño. Webs, redes sociales, publicidad online. Estrategia clara, resultados medibles.',
    defaultServices: [
      { name: 'Redes sociales', desc: 'Gestión completa de Instagram, Facebook, TikTok. Contenido, diseño, respuestas, estrategia.', icon: '📱' },
      { name: 'Publicidad online', desc: 'Campañas en Google Ads, Meta Ads, TikTok Ads. Optimizadas para vender, no para gastar.', icon: '🎯' },
      { name: 'Diseño web', desc: 'Webs modernas, rápidas y optimizadas para Google. WordPress, tiendas online, landings.', icon: '💻' },
    ],
    defaultBenefits: ['Informes mensuales transparentes con datos reales', 'Sin permanencia, cancelas cuando quieras', 'Estrategia personalizada según tu negocio'],
    defaultProcess: [
      { title: 'Auditoría', text: 'Analizamos tu presencia digital gratis' },
      { title: 'Estrategia', text: 'Plan de acción con objetivos claros' },
      { title: 'Ejecución', text: 'Contenido, diseño, campañas y gestión' },
      { title: 'Optimización', text: 'Medimos y mejoramos cada mes' },
    ],
    defaultTestimonials: [
      { name: 'Restaurante La Mar', role: 'Hostelería', text: 'Doblamos reservas en 3 meses con sus campañas. Retorno brutal de la inversión.' },
      { name: 'Clínica DentalPlus', role: 'Salud', text: 'Instagram pasó de 200 a 5.000 seguidores reales. Y lo mejor: reservan desde stories.' },
      { name: 'E-commerce ModaUrbana', role: 'Moda online', text: 'Nuestra web nueva convierte 3 veces más. Inversión recuperada en 2 meses.' },
    ],
    defaultFaqs: [
      { q: '¿Cuánto cuesta gestionar redes sociales?', a: 'Desde 300€/mes. Incluye estrategia, 12 posts, diseño y respuestas a comentarios.' },
      { q: '¿Cuánto hay que invertir en publicidad?', a: 'Mínimo 300€/mes en presupuesto de anuncios + 200€ de gestión. Escalable según resultados.' },
      { q: '¿Cuánto tarda una web?', a: 'Web corporativa: 3-4 semanas. Tienda online: 6-8 semanas. Te damos calendario al empezar.' },
      { q: '¿Hay permanencia?', a: 'No. Contratas mes a mes. Si no funciona, cancelas sin penalización.' },
    ],
  },

  emprendedor: {
    id: 'emprendedor',
    name: 'Emprendedor',
    emoji: '🚀',
    category: 'negocio',
    colors: { primary: '#6a1b9a', secondary: '#8e24aa', accent: '#ba68c8', cream: '#f3e5f5', ink: '#4a148c' },
    heroImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80',
    defaultHeadline: 'Tu proyecto',
    defaultSubtitle: 'en marcha',
    defaultIntro: 'Servicios profesionales adaptados a tu negocio. Soluciones personalizadas, presupuesto claro, resultados garantizados.',
    defaultServices: [
      { name: 'Servicio principal', desc: 'Descripción detallada del servicio principal que ofreces. Beneficios y valor que aportas.', icon: '🎯' },
      { name: 'Servicio secundario', desc: 'Segundo servicio complementario. Cómo ayudas a tus clientes a conseguir sus objetivos.', icon: '⚡' },
      { name: 'Servicio adicional', desc: 'Tercer servicio o producto. Diferenciación y ventajas competitivas que ofreces.', icon: '✨' },
    ],
    defaultBenefits: ['Calidad profesional garantizada', 'Presupuesto transparente sin sorpresas', 'Atención personalizada y cercana'],
    defaultProcess: [
      { title: 'Consulta', text: 'Entendemos tu necesidad específica' },
      { title: 'Propuesta', text: 'Diseñamos solución a medida' },
      { title: 'Ejecución', text: 'Trabajamos con profesionalidad' },
      { title: 'Seguimiento', text: 'Garantizamos tu satisfacción' },
    ],
    defaultTestimonials: [
      { name: 'Cliente satisfecho', role: 'Empresa', text: 'Servicio excepcional. Cumplieron todo lo prometido y el resultado superó nuestras expectativas.' },
      { name: 'Socio comercial', role: 'Autónomo', text: 'Profesionales de confianza. Trato cercano y resultados excelentes. Totalmente recomendable.' },
      { name: 'Usuario frecuente', role: 'Particular', text: 'Llevo años trabajando con ellos. Nunca me han fallado. Calidad y seriedad garantizada.' },
    ],
    defaultFaqs: [
      { q: '¿Cómo funciona el proceso?', a: 'Primero hacemos una consulta gratuita, luego presupuesto personalizado y después ejecución.' },
      { q: '¿Qué incluye el servicio?', a: 'Todo lo necesario para conseguir el resultado esperado. Sin costes ocultos ni sorpresas.' },
      { q: '¿Cuánto tiempo tarda?', a: 'Depende del proyecto. Te damos estimación realista en la consulta inicial sin compromiso.' },
      { q: '¿Ofrecen garantía?', a: 'Sí. Garantizamos la calidad de nuestro trabajo y tu satisfacción con el resultado final.' },
    ],
  },
}

export function getTradeConfig(tradeId: string): TradeConfig {
  return TRADES[tradeId] || TRADES.emprendedor
}

export function getAllTrades(): TradeConfig[] {
  return Object.values(TRADES)
}

export function getTradesByCategory(category: string): TradeConfig[] {
  return Object.values(TRADES).filter(t => t.category === category)
}
