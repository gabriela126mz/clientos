import { createClient } from '@/lib/supabase/client'
import type { Client, Cita, Presupuesto, Factura, Profile } from './types'

const supabase = createClient()

// =====================================================
// CLIENTES
// =====================================================

export async function getClients(userId: string) {
  return await supabase
    .from('clientes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function getClient(id: string) {
  return await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single()
}

export async function addClient(client: Partial<Client>) {
  return await supabase
    .from('clientes')
    .insert([client])
    .select()
    .single()
}

export async function updateClient(id: string, updates: Partial<Client>) {
  return await supabase
    .from('clientes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
}

export async function deleteClient(id: string) {
  return await supabase
    .from('clientes')
    .delete()
    .eq('id', id)
}

// =====================================================
// CITAS (AGENDA)
// =====================================================

export async function getCitas(userId: string) {
  return await supabase
    .from('citas')
    .select(`
      *,
      cliente:clientes(id, name, phone)
    `)
    .eq('user_id', userId)
    .order('date', { ascending: true })
    .order('time', { ascending: true })
}

export async function getCitasByMonth(userId: string, year: number, month: number) {
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const endDate = new Date(year, month + 1, 0)
  const endDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${endDate.getDate()}`
  
  return await supabase
    .from('citas')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDateStr)
    .order('date', { ascending: true })
}

export async function getUpcomingCitas(userId: string, limit = 5) {
  const today = new Date().toISOString().split('T')[0]
  
  return await supabase
    .from('citas')
    .select(`
      *,
      cliente:clientes(id, name, phone)
    `)
    .eq('user_id', userId)
    .gte('date', today)
    .in('estado', ['pendiente', 'confirmada'])
    .order('date', { ascending: true })
    .order('time', { ascending: true })
    .limit(limit)
}

export async function addCita(cita: Partial<Cita>) {
  return await supabase
    .from('citas')
    .insert([cita])
    .select()
    .single()
}

export async function updateCita(id: string, updates: Partial<Cita>) {
  return await supabase
    .from('citas')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
}

export async function deleteCita(id: string) {
  return await supabase
    .from('citas')
    .delete()
    .eq('id', id)
}

// =====================================================
// PRESUPUESTOS
// =====================================================

export async function getPresupuestos(userId: string) {
  return await supabase
    .from('presupuestos')
    .select(`
      *,
      cliente:clientes(id, name, phone, email)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function getPresupuesto(id: string) {
  return await supabase
    .from('presupuestos')
    .select(`
      *,
      cliente:clientes(*)
    `)
    .eq('id', id)
    .single()
}

export async function addPresupuesto(presupuesto: Partial<Presupuesto>) {
  // Generar número automático
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('No user')
  
  const { data: numero } = await supabase.rpc('generate_presupuesto_numero', {
    user_uuid: user.user.id
  })
  
  return await supabase
    .from('presupuestos')
    .insert([{ ...presupuesto, numero }])
    .select()
    .single()
}

export async function updatePresupuesto(id: string, updates: Partial<Presupuesto>) {
  return await supabase
    .from('presupuestos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
}

export async function deletePresupuesto(id: string) {
  return await supabase
    .from('presupuestos')
    .delete()
    .eq('id', id)
}

export async function getPresupuestoStats(userId: string) {
  const { data } = await supabase
    .from('presupuestos')
    .select('total, estado')
    .eq('user_id', userId)
  
  if (!data) return { total: 0, abiertos: 0, aceptados: 0, count: 0 }
  
  const total = data.reduce((sum, p) => sum + (Number(p.total) || 0), 0)
  const abiertos = data.filter(p => p.estado === 'enviado').reduce((sum, p) => sum + (Number(p.total) || 0), 0)
  const aceptados = data.filter(p => p.estado === 'aceptado').reduce((sum, p) => sum + (Number(p.total) || 0), 0)
  
  return { total, abiertos, aceptados, count: data.length }
}

// =====================================================
// FACTURAS
// =====================================================

export async function getFacturas(userId: string) {
  return await supabase
    .from('facturas')
    .select(`
      *,
      cliente:clientes(id, name, phone, email)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function getFactura(id: string) {
  return await supabase
    .from('facturas')
    .select(`
      *,
      cliente:clientes(*)
    `)
    .eq('id', id)
    .single()
}

export async function addFactura(factura: Partial<Factura>) {
  // Generar número automático
  const { data: user } = await supabase.auth.getUser()
  if (!user.user) throw new Error('No user')
  
  const { data: numero } = await supabase.rpc('generate_factura_numero', {
    user_uuid: user.user.id
  })
  
  return await supabase
    .from('facturas')
    .insert([{ ...factura, numero }])
    .select()
    .single()
}

export async function updateFactura(id: string, updates: Partial<Factura>) {
  return await supabase
    .from('facturas')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
}

export async function deleteFactura(id: string) {
  return await supabase
    .from('facturas')
    .delete()
    .eq('id', id)
}

export async function getFacturaStats(userId: string) {
  const { data } = await supabase
    .from('facturas')
    .select('total, estado, fecha_vencimiento')
    .eq('user_id', userId)
  
  if (!data) return { cobrado: 0, porCobrar: 0, vencidas: 0, count: 0 }
  
  const today = new Date().toISOString().split('T')[0]
  
  const cobrado = data.filter(f => f.estado === 'pagada').reduce((sum, f) => sum + (Number(f.total) || 0), 0)
  const porCobrar = data.filter(f => f.estado === 'pendiente').reduce((sum, f) => sum + (Number(f.total) || 0), 0)
  const vencidas = data.filter(f => f.estado === 'pendiente' && f.fecha_vencimiento && f.fecha_vencimiento < today).length
  
  return { cobrado, porCobrar, vencidas, count: data.length }
}

// =====================================================
// PERFIL / MI NEGOCIO
// =====================================================

export async function getProfile(userId: string) {
  return await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  return await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
}

// =====================================================
// ESTADÍSTICAS DEL DASHBOARD
// =====================================================

export async function getDashboardStats(userId: string) {
  // Clientes
  const { data: clientes } = await supabase
    .from('clientes')
    .select('id, estado, created_at')
    .eq('user_id', userId)
  
  const totalClientes = clientes?.length || 0
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const nuevosEstaSemana = clientes?.filter(c => new Date(c.created_at) > weekAgo).length || 0
  
  // Facturas
  const facturaStats = await getFacturaStats(userId)
  
  // Presupuestos
  const presupuestoStats = await getPresupuestoStats(userId)
  
  // Citas esta semana
  const today = new Date()
  const endOfWeek = new Date()
  endOfWeek.setDate(today.getDate() + (7 - today.getDay()))
  
  const { data: citasSemana } = await supabase
    .from('citas')
    .select('*')
    .eq('user_id', userId)
    .gte('date', today.toISOString().split('T')[0])
    .lte('date', endOfWeek.toISOString().split('T')[0])
    .in('estado', ['pendiente', 'confirmada'])
  
  return {
    clientes: {
      total: totalClientes,
      nuevosEstaSemana
    },
    facturas: facturaStats,
    presupuestos: presupuestoStats,
    citas: {
      estaSemana: citasSemana?.length || 0
    }
  }
}
