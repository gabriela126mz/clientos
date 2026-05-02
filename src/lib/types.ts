export interface Client {
  id: string
  user_id: string
  name: string
  phone?: string
  email?: string
  address?: string
  local?: string
  estado: 'nuevo' | 'contactado' | 'cita' | 'completado' 
  tags?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Cita {
  id: string
  user_id: string
  client_id?: string
  client_name: string
  title: string
  date: string
  time: string
  place?: string
  notes?: string
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada'
  created_at: string
  updated_at: string
  cliente?: Partial<Client>
}

export interface PresupuestoItem {
  concepto: string
  cantidad: number
  precio: number
  total: number
}

export interface Presupuesto {
  id: string
  user_id: string
  client_id?: string
  client_name: string
  numero: string
  fecha: string
  total: number
  estado: 'borrador' | 'enviado' | 'aceptado' | 'rechazado'
  items: PresupuestoItem[]
  notas?: string
  created_at: string
  updated_at: string
  cliente?: Partial<Client>
}

export interface FacturaItem {
  concepto: string
  cantidad: number
  precio: number
  total: number
}

export interface Factura {
  id: string
  user_id: string
  client_id?: string
  presupuesto_id?: string
  client_name: string
  numero: string
  fecha: string
  fecha_vencimiento?: string
  total: number
  estado: 'pendiente' | 'pagada' | 'vencida' | 'cancelada'
  items: FacturaItem[]
  notas?: string
  created_at: string
  updated_at: string
  cliente?: Partial<Client>
}

export interface Profile {
  id: string
  business_name?: string
  owner_name?: string
  trade?: string
  phone?: string
  email?: string
  city?: string
  address?: string
  nif?: string
  iban?: string
  slug?: string
  plan?: string
  avatar_url?: string
  oficio?: string
  color_principal?: string
  url_publica?: string
  logo_url?: string
  hero_image_url?: string
  zone?: string
  opening_hours?: string
  headline?: string
  subtitle?: string
  intro_text?: string
  experience_years?: string
  service_1_title?: string
  service_1_desc?: string
  service_2_title?: string
  service_2_desc?: string
  service_3_title?: string
  service_3_desc?: string
  benefit_1?: string
  benefit_2?: string
  benefit_3?: string
  cta_text?: string
  whatsapp_message?: string
  gallery_1?: string
  gallery_2?: string
  gallery_3?: string
  created_at?: string
}

export interface DashboardStats {
  clientes: {
    total: number
    nuevosEstaSemana: number
  }
  facturas: {
    cobrado: number
    porCobrar: number
    vencidas: number
    count: number
  }
  presupuestos: {
    total: number
    abiertos: number
    aceptados: number
    count: number
  }
  citas: {
    estaSemana: number
  }
}

// Oficios con su configuración de colorimetría
export interface OficioConfig {
  id: string
  nombre: string
  emoji: string
  colorPrincipal: string
  colorSecundario: string
  colorFondo: string
  gradiente: string
}

export const OFICIOS: OficioConfig[] = [
  {
    id: 'jardineria',
    nombre: 'Jardinería',
    emoji: '🌿',
    colorPrincipal: '#2d5a27',
    colorSecundario: '#4a8b3f',
    colorFondo: '#f0f7ed',
    gradiente: 'linear-gradient(135deg, #2d5a27 0%, #4a8b3f 100%)'
  },
  {
    id: 'paisajismo',
    nombre: 'Paisajismo',
    emoji: '🌱',
    colorPrincipal: '#166534',
    colorSecundario: '#22c55e',
    colorFondo: '#dcfce7',
    gradiente: 'linear-gradient(135deg, #166534 0%, #22c55e 100%)'
  },
  {
    id: 'limpieza',
    nombre: 'Limpieza',
    emoji: '✨',
    colorPrincipal: '#0ea5e9',
    colorSecundario: '#38bdf8',
    colorFondo: '#e0f2fe',
    gradiente: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)'
  },
  {
    id: 'mantenimiento',
    nombre: 'Mantenimiento',
    emoji: '🧹',
    colorPrincipal: '#64748b',
    colorSecundario: '#94a3b8',
    colorFondo: '#f1f5f9',
    gradiente: 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)'
  },
  {
    id: 'reformas',
    nombre: 'Reformas',
    emoji: '🏗️',
    colorPrincipal: '#ea580c',
    colorSecundario: '#fb923c',
    colorFondo: '#ffedd5',
    gradiente: 'linear-gradient(135deg, #ea580c 0%, #fb923c 100%)'
  },
  {
    id: 'fontaneria',
    nombre: 'Fontanería',
    emoji: '🔧',
    colorPrincipal: '#0284c7',
    colorSecundario: '#0ea5e9',
    colorFondo: '#e0f2fe',
    gradiente: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%)'
  },
  {
    id: 'electricidad',
    nombre: 'Electricidad',
    emoji: '⚡',
    colorPrincipal: '#eab308',
    colorSecundario: '#fbbf24',
    colorFondo: '#fef3c7',
    gradiente: 'linear-gradient(135deg, #eab308 0%, #fbbf24 100%)'
  },
  {
    id: 'estetica',
    nombre: 'Estética',
    emoji: '💆',
    colorPrincipal: '#db2777',
    colorSecundario: '#ec4899',
    colorFondo: '#fce7f3',
    gradiente: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)'
  },
  {
    id: 'peluqueria',
    nombre: 'Peluquería',
    emoji: '💇',
    colorPrincipal: '#c026d3',
    colorSecundario: '#d946ef',
    colorFondo: '#fae8ff',
    gradiente: 'linear-gradient(135deg, #c026d3 0%, #d946ef 100%)'
  },
  {
    id: 'marketing',
    nombre: 'Marketing Digital',
    emoji: '📱',
    colorPrincipal: '#f97316',
    colorSecundario: '#fb923c',
    colorFondo: '#ffedd5',
    gradiente: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)'
  },
  {
    id: 'fotografía',
    nombre: 'Fotografía',
    emoji: '📸',
    colorPrincipal: '#6366f1',
    colorSecundario: '#818cf8',
    colorFondo: '#e0e7ff',
    gradiente: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)'
  },
  {
    id: 'pintura',
    nombre: 'Pintura',
    emoji: '🎨',
    colorPrincipal: '#8b5cf6',
    colorSecundario: '#a78bfa',
    colorFondo: '#ede9fe',
    gradiente: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
  },
  {
    id: 'carpinteria',
    nombre: 'Carpintería',
    emoji: '🪚',
    colorPrincipal: '#92400e',
    colorSecundario: '#b45309',
    colorFondo: '#fef3c7',
    gradiente: 'linear-gradient(135deg, #92400e 0%, #b45309 100%)'
  },
  {
    id: 'coaching',
    nombre: 'Coaching',
    emoji: '🎯',
    colorPrincipal: '#0891b2',
    colorSecundario: '#06b6d4',
    colorFondo: '#cffafe',
    gradiente: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)'
  },
  {
    id: 'asesoria',
    nombre: 'Asesoría',
    emoji: '📊',
    colorPrincipal: '#1e40af',
    colorSecundario: '#3b82f6',
    colorFondo: '#dbeafe',
    gradiente: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)'
  }
]

export function getOficioConfig(oficioId: string): OficioConfig {
  return OFICIOS.find(o => o.id === oficioId) || OFICIOS[0]
}
