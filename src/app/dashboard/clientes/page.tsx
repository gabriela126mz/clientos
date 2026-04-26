'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import c from './clientes.module.css'
import { useAuth } from '@/lib/context'
import { getClients, createClient, updateClient, deleteClient } from '@/lib/db'
import type { Client } from '@/lib/types'

const ESTADO_STRIPE: Record<string,string> = { nuevo:'#2563eb', contactado:'#ea580c', cita:'#e8a820', completado:'#16a34a' }
const ESTADO_BG: Record<string,string> = { nuevo:'#dbeafe', contactado:'#ffedd5', cita:'#fdf3d6', completado:'#dcfce7' }
const ESTADO_COLOR: Record<string,string> = { nuevo:'#1d4ed8', contactado:'#c2410c', cita:'#92400e', completado:'#166534' }
const ESTADO_LABEL: Record<string,string> = { nuevo:'Nuevo', contactado:'Contactado', cita:'Cita agendada', completado:'Completado' }

export default function ClientesPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'table'|'cards'>('cards')

  /* MODAL */
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name:'', phone:'', email:'', address:'', estado:'nuevo', tags:'', notes:'' })

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await getClients(user.id)
    setClients(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { load() }, [load])

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
    setForm({ name:'', phone:'', email:'', address:'', estado:'nuevo', tags:'', notes:'' })
    setShowModal(true)
  }

  const openEdit = (cl: Client) => {
    setEditing(cl)
    setForm({ name:cl.name, phone:cl.phone||'', email:cl.email||'', address:cl.address||'', estado:cl.estado, tags:cl.tags||'', notes:cl.notes||'' })
    setShowModal(true)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !form.name.trim()) return
    setSaving(true)

    if (editing) {
      await updateClient(editing.id, form)
    } else {
      await createClient({ ...form, user_id: user.id })
    }

    setSaving(false)
    setShowModal(false)
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('¿Eliminar este cliente?')) return
    await deleteClient(id)
    load()
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
              <thead><tr><th>Nombre</th><th>Teléfono</th><th>Estado</th><th>Alta</th><th></th></tr></thead>
              <tbody>
                {list.map(cl => (
                  <tr key={cl.id} onClick={() => router.push(`/dashboard/clientes/${cl.id}`)}>
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'.65rem' }}>
                        <div className={c.ccAv} style={{ background:ESTADO_BG[cl.estado], color:ESTADO_COLOR[cl.estado] }}>
                          {cl.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}
                        </div>
                        <div>
                          <strong>{cl.name}</strong>
                          {cl.notes && <div style={{ fontSize:'.73rem', color:'#64748b', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{cl.notes}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ color:'#64748b', fontSize:'.82rem' }}>{cl.phone || '—'}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <select value={cl.estado} onChange={e => changeEstado(cl.id, e.target.value)}
                        style={{ padding:'.22rem .5rem', borderRadius:20, fontSize:'.66rem', fontWeight:700, border:'none', cursor:'pointer', fontFamily:'inherit', background:ESTADO_BG[cl.estado], color:ESTADO_COLOR[cl.estado] }}>
                        {Object.entries(ESTADO_LABEL).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </td>
                    <td style={{ color:'#64748b', fontSize:'.78rem' }}>{cl.created_at?.split('T')[0]}</td>
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
                <div className={c.ccStripe} style={{ background:ESTADO_STRIPE[cl.estado] }} />
                <div className={c.ccBody}>
                  <div className={c.ccHead}>
                    <div className={c.ccHeadLeft}>
                      <div className={c.ccAvLg} style={{ background:ESTADO_BG[cl.estado], color:ESTADO_COLOR[cl.estado] }}>
                        {cl.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase()}
                      </div>
                      <div style={{ minWidth:0 }}>
                        <div className={c.ccName}>{cl.name}</div>
                        <div className={c.ccPhone}>{cl.phone || cl.email || 'Sin contacto'}</div>
                      </div>
                    </div>
                    <span style={{ background:ESTADO_BG[cl.estado], color:ESTADO_COLOR[cl.estado], padding:'.18rem .5rem', borderRadius:20, fontSize:'.62rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.3px', whiteSpace:'nowrap', flexShrink:0 }}>
                      {ESTADO_LABEL[cl.estado]}
                    </span>
                  </div>
                  {cl.notes && <div className={c.ccNotes}>{cl.notes}</div>}
                  {cl.tags && <div style={{ marginBottom:'.6rem' }}><span style={{ background:'#f1f5f9', color:'#475569', padding:'.15rem .5rem', borderRadius:4, fontSize:'.7rem', fontWeight:600 }}>🏷 {cl.tags}</span></div>}
                  <div className={c.ccFoot}>
                    <span className={c.ccDate}>{cl.created_at?.split('T')[0]}</span>
                    <div className={c.ccActions} onClick={e => e.stopPropagation()}>
                      {cl.phone && <a href={`https://wa.me/${cl.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className={c.waBtn}>💬</a>}
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
            <div style={{ background:'#fff', borderRadius:16, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 16px 48px rgba(10,15,20,.13)' }}
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
