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

export default function ClientesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'table'|'cards'>('cards')

  /* MODAL */
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name:'', phone:'', email:'', address:'',  local:'', estado:'nuevo', tags:'', notes:'' })

  // Mini calendario
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

  const openNew = () => {
    setEditing(null)
    setForm({ name:'', phone:'', email:'', address:'', estado:'nuevo', tags:'',  local:'', notes:'' })
    setMiniCalMonth(new Date().getMonth())
    setMiniCalYear(new Date().getFullYear())
    setSelectedCitaDate(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`)
    setShowModal(true)
  }

  const openEdit = (cl: Client) => {
    setEditing(cl)
    setForm({ name:cl.name, phone:cl.phone||'', email:cl.email||'', address:cl.address||'',   local: cl.local || '', estado:cl.estado, tags:cl.tags||'', notes:cl.notes||'' })
    setShowModal(true)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert('No hay sesión activa')
      return
    }

    if (!form.name.trim()) {
      alert('Escribe el nombre del cliente')
      return
    }

    setSaving(true)

    try {
      const payload = {
        user_id: user.id,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        local: form.local.trim(),
        estado: form.estado,
        tags: form.tags.trim(),
        notes: form.notes.trim(),
      }

      const result = editing
        ? await updateClient(editing.id, payload as any)
        : await addClient(payload as any)

      if (result.error) {
        console.error(result.error)
        alert('Error al guardar cliente: ' + result.error.message)
        return
      }

      // SI ES NUEVO CLIENTE Y TIENE CITA AGENDADA
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

          const { error: citaError } = await supabase
            .from('citas')
            .insert([citaPayload])

          if (citaError) {
            console.error('Error al crear cita:', citaError)
            alert('Cliente creado pero hubo error al agendar la cita. Ve a Agenda para crearla.')
          }
        }
      }

      setShowModal(false)
      setEditing(null)
      await load()
      alert(editing ? 'Cliente actualizado ✅' : 'Cliente y cita creados ✅')
    } catch (err) {
      console.error(err)
      alert('Error inesperado al guardar cliente')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar este cliente?')) return

    const { error } = await deleteClient(id)

    if (error) {
      console.error(error)
      alert('Error al eliminar cliente: ' + error.message)
      return
    }

    await load()
  }

  const changeEstado = async (id: string, estado: string) => {
    await updateClient(id, { estado })
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
              const rows = [['Nombre','Teléfono','Email','Estado','Alta'], ...clients.map(cl => [cl.name, cl.phone||'', cl.email||'', ESTADO_LABEL[cl.estado]||cl.estado, cl.created_at.split('T')[0]])]
              const csv = rows.map(r => r.map(v => `"${v.replace(/"/g,'""')}"`).join(',')).join('\n')
              const a = document.createElement('a'); a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv); a.download = 'clientes.csv'; a.click()
            }}>↓ CSV</button>
            <button className={styles.btnDark} onClick={openNew}>+ Nuevo cliente</button>
          </div>
        </div>

        {/* PIPELINE */}
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

        {/* SEARCH + VIEW */}
        <div className={c.searchRow}>
          <div className={c.searchWrap}>
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

        {/* EMPTY STATE */}
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

        {/* TABLE */}
        {view === 'table' && list.length > 0 && (
          <div className={styles.card} style={{ padding:0 }}>
            <table className={styles.tbl}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Dirección</th>
                  <th>Local</th>
                  <th>Estado</th>
                  <th>Notas</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {list.map(cl => (
                  <tr key={cl.id} onClick={() => router.push(`/dashboard/clientes/${cl.id}`)}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'.65rem' }}>
                        <div
                          className={c.ccAv}
                          style={{ background: ESTADO_BG[cl.estado], color: ESTADO_COLOR[cl.estado] }}
                        >
                          {cl.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}
                        </div>
                        <div>
                          <strong>{cl.name}</strong>
                        </div>
                      </div>
                    </td>

                    <td style={{ color:'#0f172a', fontSize:'.82rem', fontWeight:700 }}>
                      {cl.local || '—'}
                    </td>

                    <td style={{ color:'#64748b', fontSize:'.82rem' }}>
                      {cl.address || '—'}
                    </td>

                    <td onClick={e => e.stopPropagation()}>
                      <select
                        value={cl.estado}
                        onChange={e => changeEstado(cl.id, e.target.value)}
                        style={{
                          padding:'.22rem .5rem',
                          borderRadius:20,
                          fontSize:'.66rem',
                          fontWeight:700,
                          border:'none',
                          cursor:'pointer',
                          fontFamily:'inherit',
                          background: ESTADO_BG[cl.estado],
                          color: ESTADO_COLOR[cl.estado],
                        }}
                      >
                        {Object.entries(ESTADO_LABEL).map(([k,v]) => (
                          <option key={k} value={k}>{v}</option>
                        ))}
                      </select>
                    </td>

                    <td style={{ color:'#64748b', fontSize:'.78rem', maxWidth:220, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {cl.notes || '—'}
                    </td>

                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display:'flex', gap:'.15rem', justifyContent:'flex-end' }}>
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

        {/* CARDS */}
        {view === 'cards' && list.length > 0 && (
          <div className={c.ccGrid}>
            {list.map(cl => (
              <div key={cl.id} className={c.cc} onClick={() => router.push(`/dashboard/clientes/${cl.id}`)}>
                <div className={c.ccStripe} style={{ background: ESTADO_STRIPE[cl.estado] }} />

                <div className={c.ccBody}>
                  <div className={c.ccHead}>
                    <div className={c.ccHeadLeft}>
                      <div
                        className={c.ccAvLg}
                        style={{
                          background: ESTADO_BG[cl.estado],
                          color: ESTADO_COLOR[cl.estado],
                        }}
                      >
                        {cl.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div className={c.ccName} style={{ fontWeight: 900 }}>{cl.name}</div>
                        <div style={{ fontSize: '.78rem', color: '#64748b', marginTop: '.15rem' }}>
                          {cl.phone || cl.email || 'Sin contacto'}
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        background: ESTADO_BG[cl.estado],
                        color: ESTADO_COLOR[cl.estado],
                        padding: '.22rem .55rem',
                        borderRadius: 999,
                        fontSize: '.62rem',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '.3px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {ESTADO_LABEL[cl.estado]}
                    </span>
                  </div>

                  <div style={{
                    display:'grid',
                    gap:'.45rem',
                    marginTop:'.85rem',
                    marginBottom:'.8rem'
                  }}>
                    <div style={{
                      background:'#f8fafc',
                      border:'1px solid #e2e8f0',
                      borderRadius:10,
                      padding:'.55rem .65rem',
                      fontSize:'.78rem'
                    }}>
                      <strong style={{ color:'#0f172a' }}>Local:</strong>{' '}
                      <span style={{ color:'#475569' }}>{cl.local || '—'}</span>
                    </div>

                    <div style={{
                      background:'#fff7ed',
                      border:'1px solid #fed7aa',
                      borderRadius:10,
                      padding:'.55rem .65rem',
                      fontSize:'.78rem'
                    }}>
                      <strong style={{ color:'#9a3412' }}>Dirección:</strong>{' '}
                      <span style={{ color:'#7c2d12' }}>{cl.address || '—'}</span>
                    </div>

                    {cl.notes && (
                      <div style={{
                        background:'#f1f5f9',
                        border:'1px solid #e2e8f0',
                        borderRadius:10,
                        padding:'.55rem .65rem',
                        fontSize:'.78rem',
                        color:'#475569',
                        lineHeight:1.4
                      }}>
                        <strong style={{ color:'#0f172a' }}>Notas:</strong> {cl.notes}
                      </div>
                    )}
                  </div>

                  <div className={c.ccFoot}>
                    <span className={c.ccDate}>{cl.created_at?.split('T')[0]}</span>

                    <div className={c.ccActions} onClick={e => e.stopPropagation()}>
                      {cl.phone && (
                        <a
                          href={`https://wa.me/${cl.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={c.waBtn}
                        >
                          💬
                        </a>
                      )}
                      <button className={c.icoBtn} onClick={() => openEdit(cl)}>✎</button>
                      <button className={`${c.icoBtn} ${c.del}`} onClick={() => remove(cl.id)}>🗑</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL NUEVO/EDITAR */}
        {showModal && (
          <div style={{ position:'fixed', inset:0, background:'rgba(10,15,20,.55)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem', backdropFilter:'blur(8px)' }}
            onClick={() => setShowModal(false)}>
            <div style={{ background:'#fff', borderRadius:16, width:'100%', maxWidth:600, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 16px 48px rgba(10,15,20,.13)' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ padding:'1.1rem 1.4rem', borderBottom:'1px solid #e2ddd4', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ fontFamily:'Syne,sans-serif', fontSize:'1rem', fontWeight:700 }}>{editing ? 'Editar cliente' : 'Nuevo cliente'}</div>
                <button onClick={() => setShowModal(false)} style={{ width:28, height:28, borderRadius:'50%', display:'grid', placeItems:'center', fontSize:'1.1rem', color:'#64748b', background:'none', border:'none', cursor:'pointer' }}>×</button>
              </div>
              <form onSubmit={save}>
                <div style={{ padding:'1.35rem', display:'flex', flexDirection:'column', gap:'.85rem' }}>
                  {[
                    { label:'Nombre *', key:'name', type:'text', placeholder:'Ej: Carmen Ruiz', required:true },
                    { label:'Teléfono / WhatsApp', key:'phone', type:'tel', placeholder:'+34 600 000 000', required:false },
                    { label:'Email', key:'email', type:'email', placeholder:'email@ejemplo.com', required:false },
                    { label:'Dirección', key:'address', type:'text', placeholder:'C/ Ejemplo, 12, Madrid', required:false },
                    { label:'Nombre del local', key:'local', type:'text', placeholder:'Ej: Bar La Esquina, Chalet Los Olivos…', required:false },
                    { label:'Etiqueta', key:'tags', type:'text', placeholder:'VIP, Empresa, Chalet…', required:false },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display:'block', fontSize:'.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'#1c2b3a', marginBottom:'.3rem' }}>{f.label}</label>
                      <input
                        type={f.type} placeholder={f.placeholder} required={f.required}
                        value={form[f.key as keyof typeof form]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        style={{ width:'100%', padding:'.7rem .85rem', background:'#fff', border:'1.5px solid #cbd5e1', borderRadius:8, fontSize:'.875rem', fontFamily:'inherit', transition:'all .15s', color:'#0a0f14', outline:'none' }}
                        autoFocus={f.key === 'name'}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ display:'block', fontSize:'.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'#1c2b3a', marginBottom:'.3rem' }}>Estado</label>
                    <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })}
                      style={{ width:'100%', padding:'.7rem .85rem', background:'#fff', border:'1.5px solid #cbd5e1', borderRadius:8, fontSize:'.875rem', fontFamily:'inherit', color:'#0a0f14' }}>
                      {Object.entries(ESTADO_LABEL).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:'.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.5px', color:'#1c2b3a', marginBottom:'.3rem' }}>Notas internas</label>
                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                      placeholder="Todo lo relevante de este cliente…" rows={3}
                      style={{ width:'100%', padding:'.7rem .85rem', background:'#fff', border:'1.5px solid #cbd5e1', borderRadius:8, fontSize:'.875rem', fontFamily:'inherit', resize:'vertical', color:'#0a0f14' }} />
                  </div>

                  {/* OPCIÓN AGENDAR CITA - SOLO PARA NUEVOS CLIENTES */}
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

                        {/* CONTROLES DEL MES */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.65rem' }}>
                          <button
                            type="button"
                            onClick={() => {
                              if (miniCalMonth === 0) {
                                setMiniCalMonth(11)
                                setMiniCalYear(miniCalYear - 1)
                              } else {
                                setMiniCalMonth(miniCalMonth - 1)
                              }
                            }}
                            style={{ padding: '.25rem .5rem', fontSize: '.7rem', background: '#e8f5e9', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}
                          >
                            ← Anterior
                          </button>

                          <div style={{ fontSize: '.75rem', fontWeight: 700, color: '#1c2b3a' }}>
                            {['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][miniCalMonth]} {miniCalYear}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (miniCalMonth === 11) {
                                setMiniCalMonth(0)
                                setMiniCalYear(miniCalYear + 1)
                              } else {
                                setMiniCalMonth(miniCalMonth + 1)
                              }
                            }}
                            style={{ padding: '.25rem .5rem', fontSize: '.7rem', background: '#e8f5e9', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}
                          >
                            Siguiente →
                          </button>
                        </div>

                        {/* Mini calendario */}
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '.35rem' }}>
                            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                              <div key={d} style={{ textAlign: 'center', fontSize: '.65rem', fontWeight: 700, color: '#64748b', padding: '.2rem 0' }}>
                                {d}
                              </div>
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
                                <button
                                  key={d}
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setSelectedCitaDate(dateStr)
                                    const input = document.getElementById('agendarFecha') as HTMLInputElement
                                    if (input) input.value = dateStr
                                  }}
                                  style={{
                                    padding: '.3rem',
                                    borderRadius: 4,
                                    border: isSelected ? '2px solid #2d5a27' : isToday ? '1px solid #2d5a27' : '1px solid #e5ddcf',
                                    background: isSelected ? '#2d5a27' : isToday ? '#e8f5e9' : '#fff',
                                    color: isSelected ? '#fff' : '#0a0f14',
                                    fontSize: '.7rem',
                                    fontWeight: isSelected || isToday ? 700 : 400,
                                    cursor: 'pointer',
                                  }}
                                >
                                  {d}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Campos de cita */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem', marginBottom: '.5rem' }}>
                          <div>
                            <label style={{ fontSize: '.7rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '.3rem' }}>Fecha</label>
                            <input 
                              id="agendarFecha"
                              type="date" 
                              value={selectedCitaDate}
                              onChange={e => setSelectedCitaDate(e.target.value)}
                              style={{ width: '100%', padding: '.4rem', fontSize: '.75rem', border: '1px solid #cbd5e1', borderRadius: 4, fontFamily: 'inherit' }}
                            />
                          </div>

                          <div>
                            <label style={{ fontSize: '.7rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '.3rem' }}>Hora</label>
                            <input 
                              id="agendarHora"
                              type="time" 
                              defaultValue="10:00"
                              style={{ width: '100%', padding: '.4rem', fontSize: '.75rem', border: '1px solid #cbd5e1', borderRadius: 4, fontFamily: 'inherit' }}
                            />
                          </div>
                        </div>

                        <div style={{ marginBottom: '.5rem' }}>
                          <label style={{ fontSize: '.7rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '.3rem' }}>Tipo de visita *</label>
                          <input 
                            id="agendarTitulo"
                            type="text" 
                            placeholder="Ej: Visita técnica, Presupuesto…"
                            style={{ width: '100%', padding: '.4rem', fontSize: '.75rem', border: '1px solid #cbd5e1', borderRadius: 4, fontFamily: 'inherit' }}
                          />
                        </div>

                        <div style={{ marginBottom: '.5rem' }}>
                          <label style={{ fontSize: '.7rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '.3rem' }}>Lugar</label>
                          <input 
                            id="agendarPlace"
                            type="text" 
                            placeholder="Ej: En el jardín, en oficina…"
                            style={{ width: '100%', padding: '.4rem', fontSize: '.75rem', border: '1px solid #cbd5e1', borderRadius: 4, fontFamily: 'inherit' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '.7rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '.3rem' }}>Notas</label>
                          <textarea 
                            id="agendarNotas"
                            placeholder="Qué llevar, qué revisar…"
                            rows={2}
                            style={{ width: '100%', padding: '.4rem', fontSize: '.75rem', border: '1px solid #cbd5e1', borderRadius: 4, fontFamily: 'inherit', resize: 'vertical' }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ padding:'1rem 1.4rem', borderTop:'1px solid #e2ddd4', display:'flex', justifyContent:'flex-end', gap:'.55rem' }}>
                  <button type="button" onClick={() => setShowModal(false)}
                    style={{ padding:'.65rem 1.1rem', background:'transparent', color:'#0a0f14', border:'1.5px solid #cbd5e1', borderRadius:8, fontSize:'.84rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                    Cancelar
                  </button>
                  <button type="submit" disabled={saving}
                    style={{ padding:'.65rem 1.1rem', background:'#0a0f14', color:'#fff', border:'none', borderRadius:8, fontSize:'.84rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit', opacity:saving?.7:1 }}>
                    {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear cliente'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
