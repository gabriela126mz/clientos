import { supabase } from './supabase'
import type { Profile, Client, Quote, QuoteLine, Appointment } from './types'

/* ══════════════════════════════
   PROFILES
══════════════════════════════ */
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
   .maybeSingle()
  return { data, error }
}

export async function createProfile(profile: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .maybeSingle()
  return { data, error }
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .maybeSingle()
  return { data, error }
}

export async function getProfileBySlug(slug: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  return { data, error }
}

/* ══════════════════════════════
   CLIENTS
══════════════════════════════ */
/* ══════════════════════════════
   CLIENTS
══════════════════════════════ */
export async function getClients(userId: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getClientById(id: string, userId: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle()

  return { data, error }
}

export async function createClient(client: Partial<Client>) {
  const { data, error } = await supabase
    .from('clients')
    .insert({
      user_id: client.user_id,
      name: client.name,
      phone: client.phone || null,
      email: client.email || null,
      address: client.address || null,
      local: client.local || null,
      tags: client.tags || null,
      notes: client.notes || null,
      estado: client.estado || 'nuevo',
      avatar_url: client.avatar_url || null,
    })
    .select()
    .maybeSingle()

  return { data, error }
}

export async function updateClient(id: string, updates: Partial<Client>) {
  const cleanUpdates = {
    name: updates.name,
    phone: updates.phone || null,
    email: updates.email || null,
    address: updates.address || null,
    local: updates.local || null,
    tags: updates.tags || null,
    notes: updates.notes || null,
    estado: updates.estado,
    avatar_url: updates.avatar_url || null,
  }

  const { data, error } = await supabase
    .from('clients')
    .update(cleanUpdates)
    .eq('id', id)
    .select()
    .maybeSingle()

  return { data, error }
}

export async function deleteClient(id: string) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)

  return { error }
}
/* ══════════════════════════════
   QUOTES
══════════════════════════════ */
export async function getQuotes(userId: string) {
  const { data, error } = await supabase
    .from('quotes')
    .select('*, quote_lines(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function createQuote(quote: Partial<Quote>, lines: Partial<QuoteLine>[]) {
  const { data: quoteData, error: quoteError } = await supabase
    .from('quotes')
    .insert(quote)
    .select()
    .maybeSingle()
  if (quoteError || !quoteData) return { data: null, error: quoteError }

  if (lines.length > 0) {
    const linesWithId = lines.map(l => ({ ...l, quote_id: quoteData.id }))
    const { error: linesError } = await supabase
      .from('quote_lines')
      .insert(linesWithId)
    if (linesError) return { data: null, error: linesError }
  }
  return { data: quoteData, error: null }
}

export async function updateQuote(id: string, updates: Partial<Quote>) {
  const { data, error } = await supabase
    .from('quotes')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle()
  return { data, error }
}

export async function deleteQuote(id: string) {
  const { error } = await supabase
    .from('quotes')
    .delete()
    .eq('id', id)
  return { error }
}

/* ══════════════════════════════
   APPOINTMENTS
══════════════════════════════ */
export async function getAppointments(userId: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, clients(name, phone)')
    .eq('user_id', userId)
    .order('date', { ascending: true })
  return { data, error }
}

export async function createAppointment(appt: Partial<Appointment>) {
  const { data, error } = await supabase
    .from('appointments')
    .insert(appt)
    .select()
    .maybeSingle()
  return { data, error }
}

export async function updateAppointment(id: string, updates: Partial<Appointment>) {
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle()
  return { data, error }
}

export async function deleteAppointment(id: string) {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id)
  return { error }
}

/* ══════════════════════════════
   IMAGES (Storage)
══════════════════════════════ */
export async function uploadClientImage(clientId: string, file: File) {
  const ext = file.name.split('.').pop()
  const path = `clients/${clientId}/${Date.now()}.${ext}`

  const { data, error } = await supabase.storage
    .from('client-images')
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) return { url: null, error }

  const { data: urlData } = supabase.storage
    .from('client-images')
    .getPublicUrl(path)

  // Save to client_images table
  await supabase.from('client_images').insert({
    client_id: clientId,
    url: urlData.publicUrl
  })

  return { url: urlData.publicUrl, error: null }
}

export async function uploadAvatar(userId: string, file: File) {
  const ext = file.name.split('.').pop()
  const path = `avatars/${userId}.${ext}`

  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { cacheControl: '3600', upsert: true })

  if (error) return { url: null, error }

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return { url: data.publicUrl, error: null }
}