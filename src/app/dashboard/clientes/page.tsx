'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import c from './clientes.module.css'
import { useAuth } from '@/lib/context'
import { getClients, addClient, updateClient, deleteClient } from '@/lib/db'
import { createClient } from '@/lib/supabase/client'
import type { Client } from '@/lib/types'

const ESTADO_STRIPE: Record<string,string> = { nuevo:'#2563eb', contactado:'#ea580c', cita:'#e8a820', completado:'#16a34a' }
const ESTADO_BG: Record<string,string> = { nuevo:'#dbeafe', contactado:'#ffedd5', cita:'#fdf3d6', completado:'#dcfce7' }
const ESTADO_COLOR: Record<string,string> = { nuevo:'#1d4ed8', contactado:'#c2410c', cita:'#92400e', completado:'#166534' }
const ESTADO_LABEL: Record<string,string> = { nuevo:'Nuevo', contactado:'Contactado', cita:'Cita agendada', completado:'Completado' }

const getClientColor = (clientName: string): string => {
  const colors = ['#2563eb', '#dc2626', '#16a34a', '#ea580c', '#9333ea', '#0891b2', '#e11d48', '#854d0e']
  let hash = 0
  for (let i = 0; i < clientName.length; i++) {
    hash = ((hash << 5) - hash) + clientName.charCodeAt(i)
    hash = hash & hash
  }
  return colors[Math.abs(hash) % colors.length]
}

const validateCIF = (cif: string): boolean => {
  if (!cif) return true
  const cifRegex = /^[A-Z]{1}[0-9]{7}[0-9A-Z]{1}$/
  return cifRegex.test(cif)
}

const validateCP = (cp: string): boolean => {
  if (!cp) return true
  const cpRegex = /^[0-9]{5}$/
  return cpRegex.test(cp)
}

const validatePhone = (phone: string): boolean => {
  if (!phone) return true
  const phoneRegex = /^[\d\s+\-()]{9,}$/
  return phoneRegex.test(phone)
}

const validateEmail = (email: string): boolean => {
  if (!email) return true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const sanitizeInput = (input: string, allowedChars = 'normal'): string => {
  if (allowedChars === 'normal') {
    return input.replace(/[<>]/g, '')
  }
  if (allowedChars === 'numeric') {
    return input.replace(/[^0-9]/g, '')
  }
  if (allowedChars === 'alphanumeric') {
    return input.replace(/[^a-zA-Z0-9ñÑ\s\-]/g, '')
  }
  return input
}

export default function ClientesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'table'|'cards'>('cards')

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name:'', phone:'', email:'', address:'', local:'', cif:'', cp:'', ciudad:'', estado:'nuevo', tags:'', notes:'' })
  const [errors, setErrors] = useState<Record<string,string>>({})

  const [miniCalMonth, setMiniCalMonth] = useState(new Date().getMonth())
  const [miniCalYear, setMiniCalYear] = useState(new Date().getFullYear())
  const [selectedCitaDate, setSelectedCitaDate] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await getClients(user.id)
      if (error) console.error('Error cargando clientes:', error)
      setClients(data || [])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.push('/'); return }
    load()
  }, [authLoading, user, load, router])

  const counts = { nuevo:0, contactado:0, cita:0, completado:0 }
  clients.forEach(cl => { if (counts[cl.estado as keyof typeof counts] !== undefined) counts[cl.estado as keyof typeof counts]++ })

  let list = filter === 'all' ? clients : clients.filter(cl => cl.estado === filter)
  if (search) {
    const q = search.toLowerCase()
    list = list.filter(cl =>
      cl.name.toLowerCase().includes(q) ||
      (cl.phone || '').includes(q) ||
      (cl.email || '').toLowerCase().includes(q) ||
      (cl.tags || '').toLowerCase().includes(q) ||
      (cl.notes || '').toLowerCase().includes(q)
    )
  }

  const resetForm = () => {
    setForm({ name:'', phone:'', email:'', address:'', local:'', cif:'', cp:'', ciudad:'', estado:'nuevo', tags:'', notes:'' })
    setErrors({})
    setEditing(null)
  }

  const openNew = () => {
    resetForm()
    setMiniCalMonth(new Date().getMonth())
    setMiniCalYear(new Date().getFullYear())
    setSelectedCitaDate(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`)
    setShowModal(true)
  }

  const openEdit = (cl: Client) => {
    setEditing(cl)
    setErrors({})
    setForm({
      name: cl.name||'',
      phone: cl.phone||'',
      email: cl.email||'',
      address: cl.address||'',
      local: cl.local||'',
      cif: (cl as any).cif||'',
      cp: (cl as any).cp||'',
      ciudad: (cl as any).ciudad||'',
      estado: cl.estado,
      tags: cl.tags||'',
      notes: cl.notes||''
    })
    setShowModal(true)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string,string> = {}

    if (!form.name.trim()) {
      newErrors.name = 'Nombre requerido'
    } else if (form.name.length > 100) {
      newErrors.name = 'Máximo 100 caracteres'
    }

    if (form.phone && !validatePhone(form.phone)) {
      newErrors.phone = 'Formato de teléfono inválido (mín. 9 dígitos)'
    }

    if (form.email && !validateEmail(form.email)) {
      newErrors.email = 'Email inválido'
    }

    if (form.cif && !validateCIF(form.cif)) {
      newErrors.cif = 'CIF inválido. Formato: L0000000X'
    }

    if (form.cp && !validateCP(form.cp)) {
      newErrors.cp = 'CP inválido. Debe ser 5 dígitos'
    }

    if (form.address && form.address.length > 200) {
      newErrors.address = 'Máximo 200 caracteres'
    }

    if (form.local && form.local.length > 100) {
      newErrors.local = 'Máximo 100 caracteres'
    }

    if (form.ciudad && form.ciudad.length > 100) {
      newErrors.ciudad = 'Máximo 100 caracteres'
    }

    if (form.tags && form.tags.length > 100) {
      newErrors.tags = 'Máximo 100 caracteres'
    }

    if (form.notes && form.notes.length > 1000) {
      newErrors.notes = 'Máximo 1000 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert('No hay sesión activa')
      return
    }

    if (!validateForm()) {
      return
    }

    setSaving(true)

    try {
      const payload: any = {
        user_id: user.id,
        name: sanitizeInput(form.name.trim()),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: sanitizeInput(form.address.trim()),
        local: sanitizeInput(form.local.trim()),
        cif: form.cif.trim().toUpperCase(),
        cp: form.cp.trim(),
        ciudad: sanitizeInput(form.ciudad.trim()),
        estado: form.estado,
        tags: sanitizeInput(form.tags.trim()),
        notes: sanitizeInput(form.notes.trim()),
      }

      const result = editing
        ? await updateClient(editing.id, payload)
        : await addClient(payload)

      if (result.error) {
        console.error(result.error)
        alert('Error al guardar cliente: ' + result.error.message)
        return
      }

      if (!editing && result.data) {
        const fechaInput = (document.getElementById('agendarFecha') as HTMLInputElement)?.value
        const tituloInput = (document.getElementById('agendarTitulo') as HTMLInputElement)?.value
        const horaInput = (document.getElementById('agendarHora') as HTMLInputElement)?.value
        const placeInput = (document.getElementById('agendarPlace') as HTMLInputElement)?.value
        const notasInput = (document.getElementById('agendarNotas') as HTMLTextAreaElement)?.value

        if (fechaInput && tituloInput.trim()) {
          const clientId = Array.isArray(result.data) ? result.data[0]?.id : result.data?.id

          const citaPayload = {
            user_id: user.id,
            client_id: clientId,
            client_name: form.name.trim(),
            title: tituloInput.trim(),
            date: fechaInput,
            time: horaInput || '10:00',
            place: placeInput?.trim() || '',
            notes: notasInput?.trim() || '',
            estado: 'pendiente',
          }

          await supabase.from('citas').insert([citaPayload])
        }
      }

      setShowModal(false)
      resetForm()
      await load()
      alert(editing ? 'Cliente actualizado ✅' : 'Cliente creado ✅')
    } catch (err) {
      console.error(err)
      alert('Error inesperado al guardar cliente')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar este cliente? Esta acción no se puede deshacer.')) return

    const { error } = await deleteClient(id)

    if (error) {
      console.error(error)
      alert('Error al eliminar cliente: ' + error.message)
      return
    }

    await load()
  }

  const changeEstado = async (id: string, estado: 'nuevo' | 'contactado' | 'cita' | 'completado') => {
    await updateClient(id, { estado } as any)
    setClients(prev => prev.map(cl => cl.id === id ? { ...cl, estado } : cl))
  }

  if (loading) return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/clientes" />
      <main className={styles.main}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', flexDirection:'column', gap:'1rem' }}>
          <div style={{ width:40, height:40, border:'3px solid #e2ddd4', borderTopColor:'#2d5a27', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
          <p style={{ color:'#64748b', fontSize:'.875rem' }}>Cargando clientes…</p>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </main>
    </div>
  )

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/clientes" />
      <main className={styles.main}>

        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Clientes</h1>
            <p className={styles.phSub}>{clients.length} clientes · {list.length} mostrando</p>
          </div>
          <div className={styles.phActions}>
            <button className={styles.btnGhost} onClick={() => {
              const rows = [['Nombre','Teléfono','Email','CIF','CP','Ciudad','Estado','Alta'], ...clients.map(cl => [cl.name, cl.phone||'', cl.email||'', (cl as any).cif||'', (cl as any).cp||'', (cl as any).ciudad||'', ESTADO_LABEL[cl.estado]||cl.estado, cl.created_at.split('T')[0]])]
              const csv = rows.map(r => r.map(v => `"${v.replace(/"/g,'""')}"`).join(',')).join('\n')
              const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = 'clientes.csv'; a.click()
            }}>↓ CSV</button>
            <button className={styles.btnDark} onClick={openNew}>+ Nuevo cliente</button>
          </div>
        </div>

        <div className={c.pipeBar}>
          {([
            { key:'all', label:'Todos', count:clients.length, cls:'all' },
            { key:'nuevo', label:'Nuevos', count:counts.nuevo, cls:'n' },
            { key:'contactado', label:'Contactados', count:counts.contactado, cls:'c' },
            { key:'cita', label:'Cita agendada', count:counts.cita, cls:'ci' },
            { key:'completado', label:'Completados', count:counts.completado, cls:'co' },
          ] as const).map(p => (
            <div key={p.key} className={`${c.ps} ${filter === p.key ? c.psOn : ''}`} onClick={() => setFilter(p.key)}>
              <div className={c.psLabel}>{p.label}</div>
              <div className={`${c.psNum} ${c[p.cls]}`}>{p.count}</div>
            </div>
          ))}
        </div>

        <div className={c.searchRow} style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div className={c.searchWrap} style={{ flex: '1 1 auto', minWidth: '200px' }}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className={c.searchInp} placeholder="Buscar nombre, teléfono, notas…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div style={{ display:'flex', gap:'.3rem', background:'#ede9e1', padding:'.22rem', borderRadius:8 }}>
            {(['table','cards'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding:'.3rem .65rem', borderRadius:6, fontSize:'.75rem', fontWeight:600, border:'none', cursor:'pointer', fontFamily:'inherit', background:view===v?'#fff':'transparent', color:view===v?'#0a0f14':'#64748b', boxShadow:view===v?'0 1px 3px rgba(10,15,20,.07)':'none' }}>
                {v === 'table' ? '☰ Lista' : '⊞ Tarjetas'}
              </button>
            ))}
          </div>
        </div>

        {list.length === 0 && !loading && (
          <div style={{ textAlign:'center', padding:'4rem 1rem' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem', opacity:.3 }}>👤</div>
            <div style={{ fontWeight:700, fontSize:'1rem', marginBottom:'.5rem', color:'#1c2b3a' }}>
              {search ? 'Sin resultados para esa búsqueda' : 'Aún no tienes clientes'}
            </div>
            <p style={{ color:'#64748b', fontSize:'.875rem', marginBottom:'1.25rem' }}>
              {search ? 'Prueba con otro término.' : 'Añade tu primer cliente y empieza a organizarte.'}
            </p>
            {!search && <button className={styles.btnDark} onClick={openNew}>+ Añadir primer cliente</button>}
          </div>
        )}

        {view === 'table' && list.length > 0 && (
          <div className={styles.card} style={{ padding:0, overflowX:'auto' }}>
            <table className={styles.tbl}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>CIF</th>
                  <th>CP</th>
                  <th>Estado</th>
                  <th style={{ width: '120px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {list.map(cl => (
                  <tr key={cl.id} style={{ borderLeft: `5px solid ${ESTADO_STRIPE[cl.estado]}` }} onClick={() => router.push(`/dashboard/clientes/${cl.id}`)}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'.65rem' }}>
                        <div style={{ width:36, height:36, borderRadius:8, background:getClientColor(cl.name), opacity:.15 }} />
                        <strong>{cl.name}</strong>
                      </div>
                    </td>
                    <td style={{ color:'#64748b', fontSize:'.82rem' }}>{cl.phone || '—'}</td>
                    <td style={{ color:'#64748b', fontSize:'.82rem' }}>{(cl as any).cif || '—'}</td>
                    <td style={{ color:'#64748b', fontSize:'.82rem' }}>{(cl as any).cp || '—'}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <select value={cl.estado || 'nuevo'} onChange={(e) => changeEstado(cl.id, e.target.value as 'nuevo' | 'contactado' | 'cita' | 'completado')} style={{ padding:'.22rem .5rem', borderRadius:20, fontSize:'.66rem', fontWeight:700, border:'none', cursor:'pointer', fontFamily:'inherit', background: ESTADO_BG[cl.estado], color: ESTADO_COLOR[cl.estado] }}>
                        {Object.entries(ESTADO_LABEL).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display:'flex', gap:'.15rem', justifyContent:'flex-end', flexWrap: 'wrap' }}>
                        <button className={c.icoBtn} onClick={() => openEdit(cl)}>✎</button>
                        <button className={`${c.icoBtn} ${c.del}`} onClick={() => remove(cl.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === 'cards' && list.length > 0 && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'0.7rem', alignItems:'stretch' }}>
            {list.map(cl => {
              const color = getClientColor(cl.name)
              return (
                <div 
                  key={cl.id}
                  onClick={() => router.push(`/dashboard/clientes/${cl.id}`)}
                  style={{
                    background:'#fff',
                    border:'1px solid #e5ddcf',
                    borderLeft: `5px solid ${ESTADO_STRIPE[cl.estado]}`,
                    borderRadius:'10px',
                    overflow:'hidden',
                    cursor:'pointer',
                    transition:'all 0.2s ease',
                    boxShadow:'0 1px 3px rgba(10,15,20,0.05)',
                    display:'flex',
                    flexDirection:'column',
                    padding:'0.7rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(10,15,20,0.1)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(10,15,20,0.05)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{ display:'flex', gap:'0.5rem', alignItems:'flex-start', marginBottom:'0.6rem' }}>
                    <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:color, opacity:.2 }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:'0.85rem', color:'#0a0f14', lineHeight:1.2, marginBottom:'0.2rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{cl.name}</div>
                      <span style={{ background:ESTADO_BG[cl.estado], color:ESTADO_COLOR[cl.estado], padding:'0.15rem 0.4rem', borderRadius:'999px', fontSize:'0.6rem', fontWeight:700, textTransform:'uppercase', display:'inline-block' }}>{ESTADO_LABEL[cl.estado]}</span>
                    </div>
                  </div>

                  <div style={{ fontSize:'0.7rem', color:'#64748b', marginBottom:'0.5rem', lineHeight:1.4 }}>
                    {cl.phone && <div>📱 {cl.phone}</div>}
                    {(cl as any).cif && <div>🔖 {(cl as any).cif}</div>}
                    {(cl as any).cp && <div>📮 {(cl as any).cp}</div>}
                    {(cl as any).ciudad && <div>🏙️ {(cl as any).ciudad}</div>}
                  </div>

                  <div style={{ display:'flex', gap:'0.35rem', justifyContent:'flex-end', paddingTop:'0.5rem', borderTop:'1px solid #e5ddcf', marginTop:'auto', flexWrap: 'wrap' }}>
                    {cl.phone && (
                      <a href={`https://wa.me/${cl.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ width:'24px', height:'24px', borderRadius:'6px', background:'#25d366', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', transition:'all 0.2s', textDecoration:'none' }} onMouseEnter={(e) => { e.currentTarget.style.background='#1eaa55'; e.currentTarget.style.transform='scale(1.1)' }} onMouseLeave={(e) => { e.currentTarget.style.background='#25d366'; e.currentTarget.style.transform='scale(1)' }}>💬</a>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); openEdit(cl) }} style={{ width:'24px', height:'24px', borderRadius:'6px', background:'#f3f0ea', color:'#2d5a27', border:'none', cursor:'pointer', fontWeight:700, transition:'all 0.2s', fontSize:'0.7rem', padding:0 }} onMouseEnter={(e) => { e.currentTarget.style.background='#e8dcc8' }} onMouseLeave={(e) => { e.currentTarget.style.background='#f3f0ea' }}>✎</button>
                    <button onClick={(e) => { e.stopPropagation(); remove(cl.id) }} style={{ width:'24px', height:'24px', borderRadius:'6px', background:'#fee2e2', color:'#991b1b', border:'none', cursor:'pointer', fontWeight:700, transition:'all 0.2s', fontSize:'0.7rem', padding:0 }} onMouseEnter={(e) => { e.currentTarget.style.background='#fecaca' }} onMouseLeave={(e) => { e.currentTarget.style.background='#fee2e2' }}>🗑</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {showModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(10,15,20,.55)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem', backdropFilter:'blur(8px)', overflow: 'auto' }} onClick={() => { setShowModal(false); resetForm() }}>
            <div style={{ background:'#fff', borderRadius:16, width:'100%', maxWidth:600, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 16px 48px rgba(10,15,20,.13)', margin: 'auto' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding:'1.1rem 1.4rem', borderBottom:'1px solid #e2ddd4', display:'flex', justifyContent:'space-between', alignItems:'center', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1rem', fontWeight:700 }}>{editing ? 'Editar cliente' : 'Nuevo cliente'}</div>
                <button onClick={() => { setShowModal(false); resetForm() }} style={{ width:28, height:28, borderRadius:'50%', display:'grid', placeItems:'center', fontSize:'1.1rem', color:'#64748b', background:'none', border:'none', cursor:'pointer' }}>×</button>
              </div>
              <form onSubmit={save}>
                <div style={{ padding:'1.35rem', display:'flex', flexDirection:'column', gap:'.85rem' }}>
                  {[
                    { label:'Nombre *', key:'name', type:'text', placeholder:'', required:true },
                    { label:'Teléfono / WhatsApp', key:'phone', type:'tel', placeholder:'', required:false },
                    { label:'Email', key:'email', type:'email', placeholder:'', required:false },
                    { label:'CIF', key:'cif', type:'text', placeholder:'', required:false },
                    { label:'Código Postal', key:'cp', type:'text', placeholder:'', required:false },
                    { label:'Ciudad', key:'ciudad', type:'text', placeholder:'', required:false },
                    { label:'Dirección', key:'address', type:'text', placeholder:'', required:false },
                    { label:'Nombre del local', key:'local', type:'text', placeholder:'', required:false },
                    { label:'Etiqueta', key:'tags', type:'text', placeholder:'', required:false },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display:'block', fontSize:'.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'#1c2b3a', marginBottom:'.3rem' }}>{f.label}</label>
                      <input
                        type={f.type} placeholder={f.placeholder} required={f.required}
                        value={form[f.key as keyof typeof form]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        style={{ width:'100%', padding:'.7rem .85rem', background:'#fff', border:errors[f.key] ? '1.5px solid #dc2626' : '1.5px solid #cbd5e1', borderRadius:8, fontSize:'.875rem', fontFamily:'inherit', transition:'all .15s', color:'#0a0f14', outline:'none' }}
                        autoFocus={f.key === 'name'}
                      />
                      {errors[f.key] && <div style={{ fontSize:'.7rem', color:'#dc2626', marginTop:'.25rem' }}>❌ {errors[f.key]}</div>}
                    </div>
                  ))}
                  <div>
                    <label style={{ display:'block', fontSize:'.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'#1c2b3a', marginBottom:'.3rem' }}>Estado</label>
                    <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} style={{ width:'100%', padding:'.7rem .85rem', background:'#fff', border:'1.5px solid #cbd5e1', borderRadius:8, fontSize:'.875rem', fontFamily:'inherit', color:'#0a0f14' }}>
                      {Object.entries(ESTADO_LABEL).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:'.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'#1c2b3a', marginBottom:'.3rem' }}>Notas internas</label>
                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="" rows={3} style={{ width:'100%', padding:'.7rem .85rem', background:'#fff', border:errors.notes ? '1.5px solid #dc2626' : '1.5px solid #cbd5e1', borderRadius:8, fontSize:'.875rem', fontFamily:'inherit', resize:'vertical', color:'#0a0f14' }} />
                    {errors.notes && <div style={{ fontSize:'.7rem', color:'#dc2626', marginTop:'.25rem' }}>❌ {errors.notes}</div>}
                  </div>

                  {!editing && (
                    <div style={{ marginTop: '.5rem', paddingTop: '.85rem', borderTop: '1px solid #e2ddd4' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer', fontSize: '.85rem', fontWeight: 600, color: '#1c2b3a' }}>
                        <input 
                          type="checkbox" 
                          id="agendarCita"
                          style={{ cursor: 'pointer' }}
                          onChange={(e) => {
                            const el = document.getElementById('panelAgendarCita') as HTMLElement
                            if (el) el.style.display = e.target.checked ? 'block' : 'none'
                          }}
                        />
                        📅 Agendar cita para este cliente
                      </label>

                      <div id="panelAgendarCita" style={{ display: 'none', marginTop: '.85rem', padding: '1rem', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '.65rem' }}>Selecciona fecha y hora</div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.65rem', flexWrap: 'wrap', gap: '.5rem' }}>
                          <button type="button" onClick={() => { if (miniCalMonth === 0) { setMiniCalMonth(11); setMiniCalYear(miniCalYear - 1) } else { setMiniCalMonth(miniCalMonth - 1) } }} style={{ padding: '.25rem .5rem', fontSize: '.7rem', background: '#e8f5e9', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>← Anterior</button>
                          <div style={{ fontSize: '.75rem', fontWeight: 700, color: '#1c2b3a' }}>{['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][miniCalMonth]} {miniCalYear}</div>
                          <button type="button" onClick={() => { if (miniCalMonth === 11) { setMiniCalMonth(0); setMiniCalYear(miniCalYear + 1) } else { setMiniCalMonth(miniCalMonth + 1) } }} style={{ padding: '.25rem .5rem', fontSize: '.7rem', background: '#e8f5e9', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Siguiente →</button>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '.35rem' }}>
                            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                              <div key={d} style={{ textAlign: 'center', fontSize: '.65rem', fontWeight: 700, color: '#64748b', padding: '.2rem 0' }}>{d}</div>
                            ))}

                            {Array.from({ length: new Date(miniCalYear, miniCalMonth, 1).getDay() === 0 ? 6 : new Date(miniCalYear, miniCalMonth, 1).getDay() - 1 }).map((_, i) => (
                              <div key={`e${i}`} />
                            ))}

                            {Array.from({ length: new Date(miniCalYear, miniCalMonth + 1, 0).getDate() }).map((_, i) => {
                              const d = i + 1
                              const dateStr = `${miniCalYear}-${String(miniCalMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                              const today = new Date()
                              const isToday = d === today.getDate() && miniCalMonth === today.getMonth() && miniCalYear === today.getFullYear()
                              const isSelected = dateStr === selectedCitaDate

                              return (
                                <button key={d} type="button" onClick={(e) => { e.preventDefault(); setSelectedCitaDate(dateStr); const input = document.getElementById('agendarFecha') as HTMLInputElement; if (input) input.value = dateStr }} style={{ padding: '.3rem', borderRadius: 4, border: isSelected ? '2px solid #2d5a27' : isToday ? '1px solid #2d5a27' : '1px solid #e5ddcf', background: isSelected ? '#2d5a27' : isToday ? '#e8f5e9' : '#fff', color: isSelected ? '#fff' : '#0a0f14', fontSize: '.7rem', fontWeight: isSelected || isToday ? 700 : 400, cursor: 'pointer' }}>{d}</button>
                              )
                            })}
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem', marginBottom: '.5rem' }}>
                          <div>
                            <label style={{ fontSize: '.7rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '.3rem' }}>Fecha</label>
                            <input id="agendarFecha" type="date" value={selectedCitaDate} onChange={e => setSelectedCitaDate(e.target.value)} style={{ width: '100%', padding: '.4rem', fontSize: '.75rem', border: '1px solid #cbd5e1', borderRadius: 4, fontFamily: 'inherit' }} />
                          </div>
                          <div>
                            <label style={{ fontSize: '.7rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '.3rem' }}>Hora</label>
                            <input id="agendarHora" type="time" defaultValue="10:00" style={{ width: '100%', padding: '.4rem', fontSize: '.75rem', border: '1px solid #cbd5e1', borderRadius: 4, fontFamily: 'inherit' }} />
                          </div>
                        </div>

                        <div style={{ marginBottom: '.5rem' }}>
                          <label style={{ fontSize: '.7rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '.3rem' }}>Tipo de visita *</label>
                          <input id="agendarTitulo" type="text" placeholder="" style={{ width: '100%', padding: '.4rem', fontSize: '.75rem', border: '1px solid #cbd5e1', borderRadius: 4, fontFamily: 'inherit' }} />
                        </div>

                        <div style={{ marginBottom: '.5rem' }}>
                          <label style={{ fontSize: '.7rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '.3rem' }}>Lugar</label>
                          <input id="agendarPlace" type="text" placeholder="" style={{ width: '100%', padding: '.4rem', fontSize: '.75rem', border: '1px solid #cbd5e1', borderRadius: 4, fontFamily: 'inherit' }} />
                        </div>

                        <div>
                          <label style={{ fontSize: '.7rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '.3rem' }}>Notas</label>
                          <textarea id="agendarNotas" placeholder="" rows={2} style={{ width: '100%', padding: '.4rem', fontSize: '.75rem', border: '1px solid #cbd5e1', borderRadius: 4, fontFamily: 'inherit', resize: 'vertical' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ padding:'1rem 1.4rem', borderTop:'1px solid #e2ddd4', display:'flex', justifyContent:'flex-end', gap:'.55rem', flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => { setShowModal(false); resetForm() }} style={{ padding:'.65rem 1.1rem', background:'transparent', color:'#0a0f14', border:'1.5px solid #cbd5e1', borderRadius:8, fontSize:'.84rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>Cancelar</button>
                  <button type="submit" disabled={saving} style={{ padding:'.65rem 1.1rem', background:'#0a0f14', color:'#fff', border:'none', borderRadius:8, fontSize:'.84rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit', opacity:saving?0.7:1 }}>{saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear cliente'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
