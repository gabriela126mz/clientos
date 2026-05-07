'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Sidebar } from '../../page'
import styles from '../../page.module.css'
import { useAuth } from '@/lib/context'
import { createClient } from '@/lib/supabase/client'
import type { Client } from '@/lib/types'

interface Presupuesto {
  id: string
  numero: string
  fecha: string
  total: number
  estado: string
}

interface Cita {
  id: string
  title: string
  date: string
  time: string
  place: string
  notes: string
  estado: string
}

interface Document {
  id: string
  nombre: string
  tipo: string
  url: string
  fecha: string
  size?: number
}

const getClientColor = (clientName: string): string => {
  const colors = ['#2563eb', '#dc2626', '#16a34a', '#ea580c', '#9333ea', '#0891b2', '#e11d48', '#854d0e']
  let hash = 0
  for (let i = 0; i < clientName.length; i++) {
    hash = ((hash << 5) - hash) + clientName.charCodeAt(i)
    hash = hash & hash
  }
  return colors[Math.abs(hash) % colors.length]
}

const ESTADO_STRIPE: Record<string,string> = { nuevo:'#2563eb', contactado:'#ea580c', cita:'#e8a820', completado:'#16a34a' }
const ESTADO_BG: Record<string,string> = { nuevo:'#dbeafe', contactado:'#ffedd5', cita:'#fdf3d6', completado:'#dcfce7' }
const ESTADO_COLOR: Record<string,string> = { nuevo:'#1d4ed8', contactado:'#c2410c', cita:'#92400e', completado:'#166534' }

export default function ClienteDetalle() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  const clientId = String(params.id)

  const [cliente, setCliente] = useState<Client | null>(null)
  const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([])
  const [citas, setCitas] = useState<Cita[]>([])
  const [documentos, setDocumentos] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [showDocModal, setShowDocModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [docFile, setDocFile] = useState<File | null>(null)
  const [docNombre, setDocNombre] = useState('')
  const [uploadingDoc, setUploadingDoc] = useState(false)
  const [docError, setDocError] = useState('')

  const [form, setForm] = useState({ name:'', phone:'', email:'', address:'', local:'', cif:'', cp:'', ciudad:'', estado:'nuevo', tags:'', notes:'' })

  const loadCliente = useCallback(async () => {
    if (!user || !clientId) return

    setLoading(true)
    try {
      const { data: clienteData, error: clienteError } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', clientId)
        .eq('user_id', user.id)
        .single()

      if (clienteError) {
        console.error('Error cargando cliente:', clienteError)
        return
      }

      setCliente(clienteData as Client)
      setForm({
        name: clienteData.name||'',
        phone: clienteData.phone||'',
        email: clienteData.email||'',
        address: clienteData.address||'',
        local: clienteData.local||'',
        cif: (clienteData as any).cif||'',
        cp: (clienteData as any).cp||'',
        ciudad: (clienteData as any).ciudad||'',
        estado: clienteData.estado,
        tags: clienteData.tags||'',
        notes: clienteData.notes||''
      })

      const { data: presupuestosData } = await supabase
        .from('presupuestos')
        .select('id, numero, fecha, total, estado')
        .eq('client_id', clientId)
        .eq('user_id', user.id)
        .order('fecha', { ascending: false })

      setPresupuestos(presupuestosData || [])

      const { data: citasData } = await supabase
        .from('citas')
        .select('id, title, date, time, place, notes, estado')
        .eq('client_id', clientId)
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      setCitas(citasData || [])

      const { data: documentosData } = await supabase
        .from('client_documents')
        .select('*')
        .eq('client_id', clientId)
        .eq('user_id', user.id)
        .order('fecha', { ascending: false })

      setDocumentos(documentosData || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }, [user, clientId, supabase])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/')
      return
    }
    loadCliente()
  }, [authLoading, user, loadCliente, router])

  const uploadDocumento = async () => {
    if (!docFile || !docNombre.trim() || !user) {
      setDocError('Selecciona archivo y escribe nombre')
      return
    }

    const maxSize = 50 * 1024 * 1024
    if (docFile.size > maxSize) {
      setDocError('Archivo muy grande. Máximo 50MB')
      return
    }

    setUploadingDoc(true)
    setDocError('')

    try {
      const fileExt = docFile.name.split('.').pop()?.toLowerCase()
      const allowedExt = ['pdf', 'doc', 'docx', 'xls', 'xlsx']
      
      if (!fileExt || !allowedExt.includes(fileExt)) {
        setDocError('Formato no permitido. Solo PDF, Word, Excel')
        setUploadingDoc(false)
        return
      }

      const fileName = `${user.id}/${clientId}/${Date.now()}_${docFile.name}`

      const { error: uploadError } = await supabase.storage
        .from('client_docs')
        .upload(fileName, docFile)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('client_docs')
        .getPublicUrl(fileName)

      const { error: insertError } = await supabase
        .from('client_documents')
        .insert([{
          client_id: clientId,
          user_id: user.id,
          nombre: docNombre.trim(),
          tipo: fileExt?.toUpperCase() || 'FILE',
          url: publicUrl,
          fecha: new Date().toISOString().split('T')[0],
          size: docFile.size
        }])

      if (insertError) throw insertError

      setDocFile(null)
      setDocNombre('')
      setShowDocModal(false)
      await loadCliente()
      alert('📄 Documento subido ✅')
    } catch (err) {
      console.error('Error subiendo documento:', err)
      setDocError('Error al subir documento. Intenta de nuevo.')
    } finally {
      setUploadingDoc(false)
    }
  }

  const deleteDocumento = async (docId: string) => {
    if (!confirm('¿Eliminar este documento?')) return
    try {
      await supabase.from('client_documents').delete().eq('id', docId)
      await loadCliente()
    } catch (err) {
      console.error('Error:', err)
      alert('Error al eliminar documento')
    }
  }

  const saveCliente = async () => {
    if (!user || !cliente) return
    
    try {
      const { error } = await supabase
        .from('clientes')
        .update({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          local: form.local.trim(),
          cif: form.cif.trim().toUpperCase(),
          cp: form.cp.trim(),
          ciudad: form.ciudad.trim(),
          estado: form.estado,
          tags: form.tags.trim(),
          notes: form.notes.trim()
        })
        .eq('id', clientId)

      if (error) throw error
      
      setShowEditModal(false)
      await loadCliente()
      alert('Cliente actualizado ✅')
    } catch (err) {
      console.error('Error:', err)
      alert('Error al actualizar cliente')
    }
  }

  if (loading) {
    return (
      <div className={styles.app}>
        <Sidebar active="/dashboard/clientes" />
        <main className={styles.main}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e2ddd4', borderTopColor: '#2d5a27', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748b', fontSize: '.875rem' }}>Cargando cliente…</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        </main>
      </div>
    )
  }

  if (!cliente) {
    return (
      <div className={styles.app}>
        <Sidebar active="/dashboard/clientes" />
        <main className={styles.main}>
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>⚠️</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '.5rem', color: '#1c2b3a' }}>Cliente no encontrado</div>
            <button onClick={() => router.push('/dashboard/clientes')} style={{ marginTop: '1rem', padding: '.65rem 1.1rem', background: '#0a0f14', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Volver a clientes</button>
          </div>
        </main>
      </div>
    )
  }

  const color = getClientColor(cliente.name)

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/clientes" />

      <main className={styles.main} style={{ background: '#f6f2ea', minHeight: '100vh', padding: '1.5rem' }}>
        <button onClick={() => router.push('/dashboard/clientes')} style={{ color: '#d96b5b', textDecoration: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' }}>← Clientes</button>

        <section style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', alignItems: 'flex-start', marginTop: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '200px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: color, opacity: 0.2, flexShrink: 0 }} />
            <div>
              <h1 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 'clamp(24px, 5vw, 42px)', lineHeight: 1.1, color: '#071018' }}>{cliente.name}</h1>
              <p style={{ marginTop: '.5rem', color: '#64748b', fontSize: '.9rem' }}>
                {cliente.tags || 'Sin categoría'} · Alta {cliente.created_at?.split('T')[0]}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap' }}>
            <button onClick={() => setShowEditModal(true)} style={{ padding: 'clamp(0.5rem, 2vw, 0.9rem) clamp(1rem, 3vw, 1.5rem)', borderRadius: '6px', border: '1px solid #ddd6c9', background: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}>✎ Editar</button>
            <button onClick={() => router.push(`/dashboard/presupuestos/nuevo?client_id=${clientId}`)} style={{ padding: 'clamp(0.5rem, 2vw, 0.9rem) clamp(1rem, 3vw, 1.5rem)', borderRadius: '6px', border: 'none', background: '#0b1820', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}>+ Presupuesto</button>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {/* PRESUPUESTOS */}
            <div style={{ background: '#fff', border: '1px solid #e5ddcf', borderRadius: '8px', padding: '1.5rem', overflow: 'auto' }}>
              <h2 style={{ marginTop: 0, fontFamily: 'Georgia, serif', fontSize: 'clamp(1.3rem, 4vw, 1.6rem)' }}>Presupuestos</h2>
              {presupuestos.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>
                    <thead>
                      <tr style={{ background: '#f3f0ea' }}>
                        <th style={{ textAlign: 'left', padding: '0.7rem', color: '#64748b', fontWeight: 700 }}>N°</th>
                        <th style={{ textAlign: 'left', padding: '0.7rem', color: '#64748b', fontWeight: 700 }}>Fecha</th>
                        <th style={{ textAlign: 'left', padding: '0.7rem', color: '#64748b', fontWeight: 700 }}>Importe</th>
                        <th style={{ textAlign: 'left', padding: '0.7rem', color: '#64748b', fontWeight: 700 }}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {presupuestos.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #e5ddcf', cursor: 'pointer', borderLeft: `4px solid ${ESTADO_STRIPE[p.estado]}` }} onClick={() => router.push(`/dashboard/presupuestos/${p.id}`)}>
                          <td style={{ padding: '0.9rem 0.7rem', fontWeight: 800 }}>{p.numero}</td>
                          <td style={{ padding: '0.9rem 0.7rem' }}>{p.fecha}</td>
                          <td style={{ padding: '0.9rem 0.7rem' }}>{p.total.toFixed(2)} €</td>
                          <td style={{ padding: '0.9rem 0.7rem' }}>
                            <span style={{ background: ESTADO_BG[p.estado], color: ESTADO_COLOR[p.estado], padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: 'clamp(0.6rem, 1.5vw, 0.75rem)', fontWeight: 800 }}>
                              {p.estado}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: '#64748b', margin: '1rem 0 0 0', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>Sin presupuestos. <button onClick={() => router.push(`/dashboard/presupuestos/nuevo?client_id=${clientId}`)} style={{ color: '#2d5a27', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600, fontFamily: 'inherit' }}>Crear uno</button></p>
              )}
            </div>

            {/* CITAS */}
            <div style={{ background: '#fff', border: '1px solid #e5ddcf', borderRadius: '8px', padding: '1.5rem', overflow: 'auto' }}>
              <h2 style={{ marginTop: 0, fontFamily: 'Georgia, serif', fontSize: 'clamp(1.3rem, 4vw, 1.6rem)' }}>Visitas y citas</h2>
              {citas.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                  {citas.map(c => (
                    <div key={c.id} style={{ paddingBottom: '1rem', borderBottom: '1px solid #e5ddcf', borderLeft: `4px solid ${ESTADO_STRIPE[c.estado]}`, paddingLeft: '0.8rem' }}>
                      <p style={{ margin: 0, color: '#64748b', fontSize: 'clamp(0.75rem, 2vw, 0.85rem)' }}>{c.date} · {c.time}</p>
                      <strong style={{ display: 'block', marginTop: '0.3rem', fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>{c.title}</strong>
                      {c.place && <p style={{ marginTop: '0.3rem', color: '#64748b', fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>📍 {c.place}</p>}
                      {c.notes && <p style={{ marginTop: '0.3rem', color: '#64748b', fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>{c.notes}</p>}
                      <span style={{ display: 'inline-block', marginTop: '0.5rem', background: ESTADO_BG[c.estado], color: ESTADO_COLOR[c.estado], padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)', fontWeight: 700 }}>{c.estado}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#64748b', margin: '1rem 0 0 0', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>Sin citas programadas. <button onClick={() => router.push(`/dashboard/agenda?client_id=${clientId}`)} style={{ color: color, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600, fontFamily: 'inherit' }}>Crear una</button></p>
              )}
            </div>
          </div>

          {/* SIDEBAR - FICHA */}
          <aside style={{ background: '#fff', border: '1px solid #e5ddcf', borderRadius: '8px', padding: '1.5rem', minHeight: '300px', position: 'sticky', top: '1.5rem' }}>
            <h2 style={{ marginTop: 0, fontFamily: 'Georgia, serif', fontSize: 'clamp(1.3rem, 4vw, 1.6rem)' }}>Ficha</h2>
            <FichaItem label="Email" value={cliente.email || '—'} />
            <FichaItem label="Teléfono" value={cliente.phone || '—'} />
            <FichaItem label="CIF" value={(cliente as any).cif || '—'} />
            <FichaItem label="CP" value={(cliente as any).cp || '—'} />
            <FichaItem label="Ciudad" value={(cliente as any).ciudad || '—'} />
            <FichaItem label="Dirección" value={cliente.address || '—'} />
            <FichaItem label="Local" value={cliente.local || '—'} />
            <FichaItem label="Estado" value={cliente.estado || '—'} />
            <FichaItem label="Notas" value={cliente.notes || '—'} />

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5ddcf' }}>
              <button onClick={async () => { if (confirm('¿Eliminar este cliente?')) { const { error } = await supabase.from('clientes').delete().eq('id', clientId); if (!error) router.push('/dashboard/clientes') } }} style={{ width: '100%', padding: '.5rem', background: '#fcebeb', color: '#991f1f', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', fontFamily: 'inherit' }}>🗑️ Eliminar cliente</button>
            </div>
          </aside>
        </section>

        {/* MODAL EDITAR CLIENTE */}
        {showEditModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,20,.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(8px)', overflow: 'auto' }} onClick={() => setShowEditModal(false)}>
            <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 16px 48px rgba(10,15,20,.13)', margin: 'auto' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: '1.1rem 1.4rem', borderBottom: '1px solid #e2ddd4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '1rem', fontWeight: 700 }}>Editar cliente</div>
                <button onClick={() => setShowEditModal(false)} style={{ width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '1.1rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
              </div>
              <div style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
                {[
                  { label:'Nombre *', key:'name', type:'text' },
                  { label:'Teléfono / WhatsApp', key:'phone', type:'tel' },
                  { label:'Email', key:'email', type:'email' },
                  { label:'CIF', key:'cif', type:'text' },
                  { label:'Código Postal', key:'cp', type:'text' },
                  { label:'Ciudad', key:'ciudad', type:'text' },
                  { label:'Dirección', key:'address', type:'text' },
                  { label:'Nombre del local', key:'local', type:'text' },
                  { label:'Etiqueta', key:'tags', type:'text' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#1c2b3a', marginBottom: '.3rem' }}>{f.label}</label>
                    <input
                      type={f.type}
                      value={form[f.key as keyof typeof form]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      style={{ width: '100%', padding: '.7rem .85rem', background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: 8, fontSize: '.875rem', fontFamily: 'inherit', transition: 'all .15s', color: '#0a0f14', outline: 'none' }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#1c2b3a', marginBottom: '.3rem' }}>Estado</label>
                  <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} style={{ width: '100%', padding: '.7rem .85rem', background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: 8, fontSize: '.875rem', fontFamily: 'inherit', color: '#0a0f14' }}>
                    <option value="nuevo">Nuevo</option>
                    <option value="contactado">Contactado</option>
                    <option value="cita">Cita agendada</option>
                    <option value="completado">Completado</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#1c2b3a', marginBottom: '.3rem' }}>Notas internas</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} style={{ width: '100%', padding: '.7rem .85rem', background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: 8, fontSize: '.875rem', fontFamily: 'inherit', resize: 'vertical', color: '#0a0f14' }} />
                </div>
              </div>
              <div style={{ padding: '1rem 1.4rem', borderTop: '1px solid #e2ddd4', display: 'flex', justifyContent: 'flex-end', gap: '.55rem', flexWrap: 'wrap' }}>
                <button onClick={() => setShowEditModal(false)} style={{ padding: '.65rem 1.1rem', background: 'transparent', color: '#0a0f14', border: '1.5px solid #cbd5e1', borderRadius: 8, fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
                <button onClick={saveCliente} style={{ padding: '.65rem 1.1rem', background: '#0a0f14', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Guardar cambios</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function FichaItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: '1.2rem' }}>
      <div style={{ textTransform: 'uppercase', letterSpacing: '2px', color: '#64748b', fontSize: 'clamp(0.75rem, 1.5vw, 0.85rem)', marginBottom: '0.4rem', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', color: '#071018', wordBreak: 'break-word' }}>{value}</div>
    </div>
  )
}
