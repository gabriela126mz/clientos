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

// ✅ LOCALSTORAGE KEY
const STORAGE_CLIENTE = 'cliente_form_datos'

const getClientColor = (clientName: string): string => {
  const colors = ['#2563eb', '#dc2626', '#16a34a', '#ea580c', '#9333ea', '#0891b2', '#e11d48', '#854d0e']
  let hash = 0
  for (let i = 0; i < clientName.length; i++) {
    hash = ((hash << 5) - hash) + clientName.charCodeAt(i)
    hash = hash & hash
  }
  return colors[Math.abs(hash) % colors.length]
}

// ✅ VALIDACIONES EN TIEMPO REAL
const validateCIF = (cif: string): { valid: boolean; message: string } => {
  if (!cif.trim()) return { valid: true, message: '' }
  if (cif.length !== 9) return { valid: false, message: 'CIF debe tener 9 caracteres' }
  const cifRegex = /^[A-Z]{1}[0-9]{7}[0-9A-Z]{1}$/
  return cifRegex.test(cif.toUpperCase())
    ? { valid: true, message: '✅ CIF válido' }
    : { valid: false, message: 'Formato: L0000000X' }
}

const validateCP = (cp: string): { valid: boolean; message: string } => {
  if (!cp.trim()) return { valid: true, message: '' }
  if (cp.length !== 5) return { valid: false, message: 'CP debe tener 5 dígitos' }
  const cpRegex = /^[0-9]{5}$/
  return cpRegex.test(cp)
    ? { valid: true, message: '✅ CP válido' }
    : { valid: false, message: 'Solo números, 5 dígitos' }
}

const validatePhone = (phone: string): { valid: boolean; message: string } => {
  if (!phone.trim()) return { valid: true, message: '' }
  const phoneRegex = /^[\d\s+\-()]{9,}$/
  return phoneRegex.test(phone)
    ? { valid: true, message: '✅ Teléfono válido' }
    : { valid: false, message: 'Mínimo 9 dígitos' }
}

const validateEmail = (email: string): { valid: boolean; message: string } => {
  if (!email.trim()) return { valid: true, message: '' }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
    ? { valid: true, message: '✅ Email válido' }
    : { valid: false, message: 'Email inválido' }
}

const validateName = (name: string): { valid: boolean; message: string } => {
  if (!name.trim()) return { valid: false, message: 'Nombre requerido' }
  if (name.length > 100) return { valid: false, message: 'Máximo 100 caracteres' }
  return { valid: true, message: '' }
}

const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '')
}

// ✅ GUARDAR FORMULARIO COMPLETO EN LOCALSTORAGE
const saveFormToStorage = (data: any) => {
  try {
    localStorage.setItem(STORAGE_CLIENTE, JSON.stringify(data))
  } catch (e) {
    console.error('localStorage:', e)
  }
}

const loadFormFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_CLIENTE)
    return stored ? JSON.parse(stored) : null
  } catch (e) {
    console.error('localStorage:', e)
    return null
  }
}

const clearFormFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_CLIENTE)
  } catch (e) {
    console.error('localStorage:', e)
  }
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

  interface ModalState {
  type: 'success' | 'error' | 'warning'
  title: string
  message: string
}
const [showModal, setShowModal] = useState<boolean>(false)

  const [editing, setEditing] = useState<Client | null>(null)
  const [saving, setSaving] = useState(false)

  // ✅ ESTADO FORMULARIO CLIENTE
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    local: '',
    cif: '',
    cp: '',
    ciudad: '',
    estado: 'nuevo',
    tags: '',
    notes: ''
  })

  // ✅ VALIDACIONES EN TIEMPO REAL
  const [validation, setValidation] = useState({
    name: { valid: true, message: '' },
    phone: { valid: true, message: '' },
    email: { valid: true, message: '' },
    cif: { valid: true, message: '' },
    cp: { valid: true, message: '' }
  })

  // ✅ ESTADO AGENDA
  const [showAgenda, setShowAgenda] = useState(false)
  const [miniCalMonth, setMiniCalMonth] = useState(new Date().getMonth())
  const [miniCalYear, setMiniCalYear] = useState(new Date().getFullYear())
  const [selectedCitaDate, setSelectedCitaDate] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`)
  const [agendaForm, setAgendaForm] = useState({
    agendarHora: '10:00',
    agendarTitulo: '',
    agendarPlace: '',
    agendarNotas: ''
  })

  // ✅ GUARDAR AUTOMÁTICAMENTE EN LOCALSTORAGE - SIEMPRE
  useEffect(() => {
    saveFormToStorage({
      form,
      showAgenda,
      agendaForm,
      miniCalMonth,
      miniCalYear,
      selectedCitaDate,
      editingId: editing?.id || null
    })
  }, [form, showAgenda, agendaForm, miniCalMonth, miniCalYear, selectedCitaDate, editing])

  // ✅ VALIDAR MIENTRAS ESCRIBE
  useEffect(() => {
    setValidation({
      name: validateName(form.name),
      phone: validatePhone(form.phone),
      email: validateEmail(form.email),
      cif: validateCIF(form.cif),
      cp: validateCP(form.cp)
    })
  }, [form.name, form.phone, form.email, form.cif, form.cp])

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

  // ✅ RESETEAR SOLO EL ESTADO, NO BORRA LOCALSTORAGE
  const resetFormState = () => {
    setForm({ name:'', phone:'', email:'', address:'', local:'', cif:'', cp:'', ciudad:'', estado:'nuevo', tags:'', notes:'' })
    setAgendaForm({ agendarHora: '10:00', agendarTitulo: '', agendarPlace: '', agendarNotas: '' })
    setShowAgenda(false)
    setEditing(null)
    setMiniCalMonth(new Date().getMonth())
    setMiniCalYear(new Date().getFullYear())
    setSelectedCitaDate(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`)
    setValidation({
      name: { valid: true, message: '' },
      phone: { valid: true, message: '' },
      email: { valid: true, message: '' },
      cif: { valid: true, message: '' },
      cp: { valid: true, message: '' }
    })
  }

  // ✅ NUEVO CLIENTE - RECUPERA DATOS SI EXISTEN
const openNew = () => {
  const stored = loadFormFromStorage()

  if (stored && !stored.editingId) {
    setForm(stored.form || {
      name: '',
      phone: '',
      email: '',
      address: '',
      local: '',
      cif: '',
      cp: '',
      ciudad: '',
      estado: 'nuevo',
      tags: '',
      notes: '',
    })

    setShowAgenda(stored.showAgenda || false)
    setAgendaForm(stored.agendaForm || {
      agendarHora: '10:00',
      agendarTitulo: '',
      agendarPlace: '',
      agendarNotas: '',
    })
    setMiniCalMonth(stored.miniCalMonth || new Date().getMonth())
    setMiniCalYear(stored.miniCalYear || new Date().getFullYear())
    setSelectedCitaDate(
      stored.selectedCitaDate ||
      `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`
    )
  } else {
    resetFormState()
  }

  setEditing(null)
  setShowModal(true)
}
  // ✅ EDITAR CLIENTE - RECUPERA DATOS DEL CLIENTE + LOCALSTORAGE SI EXISTE
  const openEdit = (cl: Client) => {
    const stored = loadFormFromStorage()
    
    // Si hay datos en localStorage Y es el mismo cliente que estamos editando, usar esos
    if (stored && stored.editingId === cl.id) {
      setEditing(cl)
      setForm(stored.form || {
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
      setShowAgenda(stored.showAgenda || false)
      setAgendaForm(stored.agendaForm || { agendarHora: '10:00', agendarTitulo: '', agendarPlace: '', agendarNotas: '' })
      setMiniCalMonth(stored.miniCalMonth || new Date().getMonth())
      setMiniCalYear(stored.miniCalYear || new Date().getFullYear())
      setSelectedCitaDate(stored.selectedCitaDate || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`)
    } else {
      // Si no hay datos en localStorage, cargar datos del cliente
      setEditing(cl)
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
      setShowAgenda(false)
      setAgendaForm({ agendarHora: '10:00', agendarTitulo: '', agendarPlace: '', agendarNotas: '' })
      setMiniCalMonth(new Date().getMonth())
      setMiniCalYear(new Date().getFullYear())
      setSelectedCitaDate(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`)
    }
    
    setShowModal(true)
    // ✅ NO BORRA LOCALSTORAGE - SE GUARDA AUTOMÁTICAMENTE
  }

  const validateForm = (): boolean => {
    return validation.name.valid && validation.phone.valid && validation.email.valid && validation.cif.valid && validation.cp.valid
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('🔍 DEBUG SAVE:')
    console.log('  - editing:', editing)
    console.log('  - showAgenda:', showAgenda)
    console.log('  - agendarTitulo:', agendaForm.agendarTitulo)
    console.log('  - selectedCitaDate:', selectedCitaDate)
    console.log('  - agendarHora:', agendaForm.agendarHora)

    if (!user) {
      alert('No hay sesión activa')
      return
    }

    if (!validateForm()) {
      alert('⚠️ Corrige los errores antes de guardar')
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
        alert('❌ Error: ' + result.error.message)
        setSaving(false)
        return
      }

      // ✅ AGENDAR CITA SI ESTÁ HABILITADA Y ES NUEVO CLIENTE
      if (!editing && showAgenda) {
        try {
          const clientId = Array.isArray(result.data) ? result.data[0]?.id : result.data?.id
          
          if (!clientId) {
            console.error('No client ID found')
            throw new Error('No client ID')
          }

          const citaPayload = {
            user_id: user.id,
            client_id: clientId,
            client_name: form.name.trim(),
            title: agendaForm.agendarTitulo.trim() || 'Cita agendada',
            date: selectedCitaDate,
            time: agendaForm.agendarHora || '10:00',
            place: agendaForm.agendarPlace?.trim() || '',
            notes: agendaForm.agendarNotas?.trim() || '',
            estado: 'pendiente',
          }

          const citaResult = await supabase.from('citas').insert([citaPayload])
          
          if (citaResult.error) {
            console.error('Error agendando cita:', citaResult.error)
            alert('⚠️ Cliente creado pero cita no se pudo agendar: ' + citaResult.error.message)
          } else {
            console.log('✅ Cita creada correctamente')
          }
        } catch (err) {
          console.error('Error agendando cita:', err)
          alert('⚠️ Error al agendar cita: ' + (err instanceof Error ? err.message : 'Error desconocido'))
        }
      }

      // ✅ SOLO BORRA LOCALSTORAGE SI SE GUARDA OK (NUEVO O EDICIÓN)
      clearFormFromStorage()
      setShowModal(false)
      resetFormState()
      await load()
      alert(editing ? '✅ Cliente actualizado' : '✅ Cliente creado')
    } catch (err) {
      console.error(err)
      alert('❌ Error al guardar cliente')
    } finally {
      setSaving(false)
    }
  }

  // ✅ CERRAR MODAL SIN PERDER DATOS
  const closeModal = () => {
    setShowModal(false)
    // NO LIMPIA - LOS DATOS SE GUARDAN EN LOCALSTORAGE
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar este cliente? Esta acción no se puede deshacer.')) return

    const { error } = await deleteClient(id)

    if (error) {
      console.error(error)
      alert('❌ Error: ' + error.message)
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
              <button key={v} onClick={() => setView(v)} style={{ padding:'.3rem .65rem', borderRadius:6, fontSize:'clamp(0.7rem, 2vw, 0.75rem)', fontWeight:600, border:'none', cursor:'pointer', fontFamily:'inherit', background:view===v?'#fff':'transparent', color:view===v?'#0a0f14':'#64748b', boxShadow:view===v?'0 1px 3px rgba(10,15,20,.07)':'none' }}>
                {v === 'table' ? '☰ Lista' : '⊞ Tarjetas'}
              </button>
            ))}
          </div>
        </div>

        {list.length === 0 && !loading && (
          <div style={{ textAlign:'center', padding:'clamp(2rem, 5vw, 4rem) 1rem' }}>
            <div style={{ fontSize:'clamp(2rem, 5vw, 3rem)', marginBottom:'1rem', opacity:.3 }}>👤</div>
            <div style={{ fontWeight:700, fontSize:'clamp(0.9rem, 2vw, 1rem)', marginBottom:'.5rem', color:'#1c2b3a' }}>
              {search ? 'Sin resultados para esa búsqueda' : 'Aún no tienes clientes'}
            </div>
            <p style={{ color:'#64748b', fontSize:'clamp(0.75rem, 2vw, 0.875rem)', marginBottom:'1.25rem' }}>
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
                  <th>Dirección</th>
                  <th>CP</th>
                  <th>Local</th>
                  <th>Estado</th>
                  <th style={{ width: 'clamp(80px, 15vw, 120px)' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {list.map(cl => (
                  <tr key={cl.id} style={{ borderLeft: `5px solid ${ESTADO_STRIPE[cl.estado]}` }} onClick={() => router.push(`/dashboard/clientes/${cl.id}`)}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'clamp(0.4rem, 2vw, 0.65rem)' }}>
                        <div style={{ width:'clamp(28px, 3vw, 36px)', height:'clamp(28px, 3vw, 36px)', borderRadius:8, background:getClientColor(cl.name), opacity:.15, flexShrink: 0 }} />
                        <strong style={{ fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>{cl.name}</strong>
                      </div>
                    </td>
                    <td style={{ color:'#64748b', fontSize:'clamp(0.7rem, 2vw, 0.82rem)' }}>{cl.phone || '—'}</td>
                    <td style={{ color:'#64748b', fontSize:'clamp(0.7rem, 2vw, 0.82rem)' }}>{cl.address || '—'}</td>
                    <td style={{ color:'#64748b', fontSize:'clamp(0.7rem, 2vw, 0.82rem)' }}>{(cl as any).cp || '—'}</td>
                    <td style={{ color:'#64748b', fontSize:'clamp(0.7rem, 2vw, 0.82rem)' }}>{cl.local || '—'}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <select value={cl.estado || 'nuevo'} onChange={(e) => changeEstado(cl.id, e.target.value as 'nuevo' | 'contactado' | 'cita' | 'completado')} style={{ padding:'clamp(0.15rem, 1vw, 0.22rem) clamp(0.3rem, 1vw, 0.5rem)', borderRadius:20, fontSize:'clamp(0.6rem, 1.5vw, 0.66rem)', fontWeight:700, border:'none', cursor:'pointer', fontFamily:'inherit', background: ESTADO_BG[cl.estado], color: ESTADO_COLOR[cl.estado] }}>
                        {Object.entries(ESTADO_LABEL).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display:'flex', gap:'clamp(0.1rem, 1vw, 0.15rem)', justifyContent:'flex-end', flexWrap: 'wrap' }}>
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
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(clamp(150px, 80vw, 200px), 1fr))', gap:'clamp(0.5rem, 2vw, 0.7rem)', alignItems:'stretch' }}>
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
                    padding:'clamp(0.5rem, 2vw, 0.7rem)',
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
                  <div style={{ display:'flex', gap:'clamp(0.3rem, 1vw, 0.5rem)', alignItems:'flex-start', marginBottom:'0.6rem' }}>
                    <div style={{ width:'clamp(24px, 4vw, 32px)', height:'clamp(24px, 4vw, 32px)', borderRadius:'8px', background:color, opacity:.2, flexShrink: 0 }} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:'clamp(0.75rem, 2vw, 0.85rem)', color:'#0a0f14', lineHeight:1.2, marginBottom:'0.2rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{cl.name}</div>
                      <span style={{ background:ESTADO_BG[cl.estado], color:ESTADO_COLOR[cl.estado], padding:'0.15rem 0.4rem', borderRadius:'999px', fontSize:'clamp(0.55rem, 1.5vw, 0.6rem)', fontWeight:700, textTransform:'uppercase', display:'inline-block' }}>{ESTADO_LABEL[cl.estado]}</span>
                    </div>
                  </div>

                  <div style={{ fontSize:'clamp(0.65rem, 1.5vw, 0.7rem)', color:'#64748b', marginBottom:'0.5rem', lineHeight:1.4 }}>
                    {cl.phone && <div>📱 {cl.phone}</div>}
                    {(cl as any).cif && <div>🔖 {(cl as any).cif}</div>}
                    {(cl as any).cp && <div>📮 {(cl as any).cp}</div>}
                    {(cl as any).ciudad && <div>🏙️ {(cl as any).ciudad}</div>}
                  </div>

                  <div style={{ display:'flex', gap:'clamp(0.2rem, 1vw, 0.35rem)', justifyContent:'flex-end', paddingTop:'0.5rem', borderTop:'1px solid #e5ddcf', marginTop:'auto', flexWrap: 'wrap' }}>
                    {cl.phone && (
                      <a href={`https://wa.me/${cl.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ width:'clamp(20px, 4vw, 24px)', height:'clamp(20px, 4vw, 24px)', borderRadius:'6px', background:'#25d366', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'clamp(0.6rem, 1.5vw, 0.75rem)', transition:'all 0.2s', textDecoration:'none', padding:'2px', overflow:'hidden', flexShrink: 0 }} onMouseEnter={(e) => { e.currentTarget.style.background='#1eaa55'; e.currentTarget.style.transform='scale(1.1)' }} onMouseLeave={(e) => { e.currentTarget.style.background='#25d366'; e.currentTarget.style.transform='scale(1)' }}>
                        <img src="/wasap.png" alt="WhatsApp" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                      </a>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); openEdit(cl) }} style={{ width:'clamp(20px, 4vw, 24px)', height:'clamp(20px, 4vw, 24px)', borderRadius:'6px', background:'#f3f0ea', color:'#2d5a27', border:'none', cursor:'pointer', fontWeight:700, transition:'all 0.2s', fontSize:'clamp(0.6rem, 1.5vw, 0.7rem)', padding:0, flexShrink: 0 }} onMouseEnter={(e) => { e.currentTarget.style.background='#e8dcc8' }} onMouseLeave={(e) => { e.currentTarget.style.background='#f3f0ea' }}>✎</button>
                    <button onClick={(e) => { e.stopPropagation(); remove(cl.id) }} style={{ width:'clamp(20px, 4vw, 24px)', height:'clamp(20px, 4vw, 24px)', borderRadius:'6px', background:'#fee2e2', color:'#991b1b', border:'none', cursor:'pointer', fontWeight:700, transition:'all 0.2s', fontSize:'clamp(0.6rem, 1.5vw, 0.7rem)', padding:0, flexShrink: 0 }} onMouseEnter={(e) => { e.currentTarget.style.background='#fecaca' }} onMouseLeave={(e) => { e.currentTarget.style.background='#fee2e2' }}>🗑</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {showModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(10,15,20,.55)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(1rem, 2vw, 1.5rem)', backdropFilter:'blur(8px)', overflow: 'auto' }} onClick={closeModal}>
            <div style={{ background:'#fff', borderRadius:16, width:'100%', maxWidth:'clamp(300px, 95vw, 600px)', maxHeight:'90vh', overflowY:'auto', boxShadow:'0 16px 48px rgba(10,15,20,.13)', margin: 'auto' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding:'clamp(0.8rem, 2vw, 1.1rem) clamp(1rem, 2vw, 1.4rem)', borderBottom:'1px solid #e2ddd4', display:'flex', justifyContent:'space-between', alignItems:'center', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:'clamp(0.9rem, 2vw, 1rem)', fontWeight:700 }}>{editing ? 'Editar cliente' : 'Nuevo cliente'}</div>
                <button onClick={closeModal} style={{ width:'clamp(24px, 5vw, 28px)', height:'clamp(24px, 5vw, 28px)', borderRadius:'50%', display:'grid', placeItems:'center', fontSize:'clamp(0.9rem, 2vw, 1.1rem)', color:'#64748b', background:'none', border:'none', cursor:'pointer', flexShrink: 0 }}>×</button>
              </div>
              <form onSubmit={save}>
                <div style={{ padding:'clamp(1rem, 2vw, 1.35rem)', display:'flex', flexDirection:'column', gap:'clamp(0.6rem, 2vw, 0.85rem)' }}>
                  {[
                    { label:'Nombre *', key:'name', type:'text', placeholder:'', validation: 'name' },
                    { label:'Teléfono / WhatsApp', key:'phone', type:'tel', placeholder:'', validation: 'phone' },
                    { label:'Email', key:'email', type:'email', placeholder:'', validation: 'email' },
                    { label:'CIF', key:'cif', type:'text', placeholder:'L0000000X', validation: 'cif' },
                    { label:'Código Postal', key:'cp', type:'text', placeholder:'28000', validation: 'cp' },
                    { label:'Ciudad', key:'ciudad', type:'text', placeholder:'', validation: null },
                    { label:'Dirección', key:'address', type:'text', placeholder:'', validation: null },
                    { label:'Nombre del local', key:'local', type:'text', placeholder:'', validation: null },
                    { label:'Etiqueta', key:'tags', type:'text', placeholder:'', validation: null },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display:'block', fontSize:'clamp(0.6rem, 1.5vw, 0.68rem)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'#1c2b3a', marginBottom:'.3rem' }}>{f.label}</label>
                      <input
                        type={f.type} placeholder={f.placeholder}
                        value={form[f.key as keyof typeof form]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        style={{ 
                          width:'100%', 
                          padding:'clamp(0.5rem, 1.5vw, 0.7rem) clamp(0.6rem, 1.5vw, 0.85rem)', 
                          background:'#fff', 
                          border: f.validation && !validation[f.validation as keyof typeof validation].valid 
                            ? '1.5px solid #dc2626' 
                            : '1.5px solid #cbd5e1', 
                          borderRadius:8, 
                          fontSize:'clamp(0.75rem, 2vw, 0.875rem)', 
                          fontFamily:'inherit', 
                          transition:'all .15s', 
                          color:'#0a0f14', 
                          outline:'none' 
                        }}
                        autoFocus={f.key === 'name'}
                      />
                      {f.validation && validation[f.validation as keyof typeof validation].message && (
                        <div style={{ 
                          fontSize:'clamp(0.6rem, 1.5vw, 0.7rem)', 
                          color: validation[f.validation as keyof typeof validation].valid ? '#16a34a' : '#dc2626', 
                          marginTop:'.25rem',
                          fontWeight: 600
                        }}>
                          {validation[f.validation as keyof typeof validation].message}
                        </div>
                      )}
                    </div>
                  ))}
                  <div>
                    <label style={{ display:'block', fontSize:'clamp(0.6rem, 1.5vw, 0.68rem)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'#1c2b3a', marginBottom:'.3rem' }}>Estado</label>
                    <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} style={{ width:'100%', padding:'clamp(0.5rem, 1.5vw, 0.7rem) clamp(0.6rem, 1.5vw, 0.85rem)', background:'#fff', border:'1.5px solid #cbd5e1', borderRadius:8, fontSize:'clamp(0.75rem, 2vw, 0.875rem)', fontFamily:'inherit', color:'#0a0f14' }}>
                      {Object.entries(ESTADO_LABEL).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:'clamp(0.6rem, 1.5vw, 0.68rem)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'#1c2b3a', marginBottom:'.3rem' }}>Notas internas</label>
                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="" rows={3} style={{ width:'100%', padding:'clamp(0.5rem, 1.5vw, 0.7rem) clamp(0.6rem, 1.5vw, 0.85rem)', background:'#fff', border:'1.5px solid #cbd5e1', borderRadius:8, fontSize:'clamp(0.75rem, 2vw, 0.875rem)', fontFamily:'inherit', resize:'vertical', color:'#0a0f14' }} />
                  </div>

                  {!editing && (
                    <div style={{ marginTop: '.5rem', paddingTop: '.85rem', borderTop: '1px solid #e2ddd4' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer', fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', fontWeight: 600, color: '#1c2b3a' }}>
                        <input 
                          type="checkbox" 
                          checked={showAgenda}
                          onChange={(e) => setShowAgenda(e.target.checked)}
                          style={{ cursor: 'pointer', width: 'clamp(16px, 3vw, 18px)', height: 'clamp(16px, 3vw, 18px)' }}
                        />
                        📅 Agendar cita para este cliente
                      </label>

                      {showAgenda && (
                        <div style={{ marginTop: '.85rem', padding: 'clamp(0.8rem, 2vw, 1rem)', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                          <div style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '.65rem' }}>Selecciona fecha y hora</div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.65rem', flexWrap: 'wrap', gap: '.5rem' }}>
                            <button type="button" onClick={() => { if (miniCalMonth === 0) { setMiniCalMonth(11); setMiniCalYear(miniCalYear - 1) } else { setMiniCalMonth(miniCalMonth - 1) } }} style={{ padding: '.25rem .5rem', fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)', background: '#e8f5e9', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>← Anterior</button>
                            <div style={{ fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', fontWeight: 700, color: '#1c2b3a' }}>{['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][miniCalMonth]} {miniCalYear}</div>
                            <button type="button" onClick={() => { if (miniCalMonth === 11) { setMiniCalMonth(0); setMiniCalYear(miniCalYear + 1) } else { setMiniCalMonth(miniCalMonth + 1) } }} style={{ padding: '.25rem .5rem', fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)', background: '#e8f5e9', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}>Siguiente →</button>
                          </div>

                          <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '.35rem' }}>
                              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                                <div key={d} style={{ textAlign: 'center', fontSize: 'clamp(0.6rem, 1.5vw, 0.65rem)', fontWeight: 700, color: '#64748b', padding: '.2rem 0' }}>{d}</div>
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
                                  <button key={d} type="button" onClick={(e) => { e.preventDefault(); setSelectedCitaDate(dateStr) }} style={{ padding: '.3rem', borderRadius: 4, border: isSelected ? '2px solid #2d5a27' : isToday ? '1px solid #2d5a27' : '1px solid #e5ddcf', background: isSelected ? '#2d5a27' : isToday ? '#e8f5e9' : '#fff', color: isSelected ? '#fff' : '#0a0f14', fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)', fontWeight: isSelected || isToday ? 700 : 400, cursor: 'pointer' }}>{d}</button>
                                )
                              })}
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem', marginBottom: '.5rem' }}>
                            <div>
                              <label style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '.3rem' }}>Fecha</label>
                              <input type="date" value={selectedCitaDate} onChange={e => setSelectedCitaDate(e.target.value)} style={{ width: '100%', padding: '.4rem', fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)', border: '1px solid #cbd5e1', borderRadius: 4, fontFamily: 'inherit' }} />
                            </div>
                            <div>
                              <label style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '.3rem' }}>Hora</label>
                              <input type="time" value={agendaForm.agendarHora} onChange={e => setAgendaForm({ ...agendaForm, agendarHora: e.target.value })} style={{ width: '100%', padding: '.4rem', fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)', border: '1px solid #cbd5e1', borderRadius: 4, fontFamily: 'inherit' }} />
                            </div>
                          </div>

                          <div style={{ marginBottom: '.5rem' }}>
                            <label style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '.3rem' }}>Tipo de visita</label>
                            <input type="text" value={agendaForm.agendarTitulo} onChange={e => setAgendaForm({ ...agendaForm, agendarTitulo: e.target.value })} placeholder="" style={{ width: '100%', padding: '.4rem', fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)', border: '1px solid #cbd5e1', borderRadius: 4, fontFamily: 'inherit' }} />
                          </div>

                          <div style={{ marginBottom: '.5rem' }}>
                            <label style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '.3rem' }}>Lugar</label>
                            <input type="text" value={agendaForm.agendarPlace} onChange={e => setAgendaForm({ ...agendaForm, agendarPlace: e.target.value })} placeholder="" style={{ width: '100%', padding: '.4rem', fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)', border: '1px solid #cbd5e1', borderRadius: 4, fontFamily: 'inherit' }} />
                          </div>

                          <div>
                            <label style={{ fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '.3rem' }}>Notas</label>
                            <textarea value={agendaForm.agendarNotas} onChange={e => setAgendaForm({ ...agendaForm, agendarNotas: e.target.value })} placeholder="" rows={2} style={{ width: '100%', padding: '.4rem', fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)', border: '1px solid #cbd5e1', borderRadius: 4, fontFamily: 'inherit', resize: 'vertical' }} />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ padding:'clamp(0.8rem, 2vw, 1rem) clamp(1rem, 2vw, 1.4rem)', borderTop:'1px solid #e2ddd4', display:'flex', justifyContent:'flex-end', gap:'clamp(0.4rem, 1vw, 0.55rem)', flexWrap: 'wrap' }}>
                  <button type="button" onClick={closeModal} style={{ padding:'clamp(0.5rem, 1.5vw, 0.65rem) clamp(0.8rem, 2vw, 1.1rem)', background:'transparent', color:'#0a0f14', border:'1.5px solid #cbd5e1', borderRadius:8, fontSize:'clamp(0.7rem, 2vw, 0.84rem)', fontWeight:600, cursor:'pointer', fontFamily:'inherit', whiteSpace: 'nowrap' }}>Cancelar</button>
                  <button type="submit" disabled={saving || !validateForm()} style={{ padding:'clamp(0.5rem, 1.5vw, 0.65rem) clamp(0.8rem, 2vw, 1.1rem)', background: validateForm() ? '#0a0f14' : '#cbd5e1', color:'#fff', border:'none', borderRadius:8, fontSize:'clamp(0.7rem, 2vw, 0.84rem)', fontWeight:600, cursor: validateForm() ? 'pointer' : 'not-allowed', fontFamily:'inherit', opacity:saving?0.7:1, whiteSpace: 'nowrap' }}>{saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear cliente'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
