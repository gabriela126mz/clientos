'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import cStyles from './clientes.module.css'

const CLIENTES = Array.from({ length: 50 }, (_, i) => ({
  id: `c${i + 1}`,
  name: ['Carmen Ruiz','Javier Romero','María García','Pedro Alonso','Lucía Navarro','Antonio López','Sofía Pérez','Carlos Díaz','Ana Martín','Roberto Sánchez'][i % 10],
  tel: `+34 6${String(i).padStart(2,'0')} ${String(i*3).padStart(3,'0')} ${String(i*7).padStart(3,'0')}`,
  email: `cliente${i+1}@email.com`,
  tags: ['VIP','Empresa','Chalet','','Comunidad','Particular','','Referido','',''][i % 10],
  notes: ['Jardín 300m² con olivo.','Sistema de riego 2025.','Terraza en Madrid centro.','Piscina + jardín.','Mantenimiento mensual.','','','','',''][i % 10],
  estado: ['nuevo','nuevo','contactado','cita','completado','contactado','nuevo','completado','cita','contactado'][i % 10],
  created: `${String(Math.floor(Math.random()*28)+1).padStart(2,'0')}/${String(Math.floor(Math.random()*12)+1).padStart(2,'0')}/2026`,
}))

const EL: Record<string,string> = { nuevo:'Nuevo', contactado:'Contactado', cita:'Cita agendada', completado:'Completado' }
const EC: Record<string,string> = { nuevo:'bNuevo', contactado:'bContactado', cita:'bCita', completado:'bCompletado' }

export default function Clientes() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [tel, setTel] = useState('')
  const [estado, setEstado] = useState('nuevo')

  const counts = { nuevo: 0, contactado: 0, cita: 0, completado: 0 }
  CLIENTES.forEach(c => { if (counts[c.estado as keyof typeof counts] !== undefined) counts[c.estado as keyof typeof counts]++ })

  let list = filter === 'all' ? CLIENTES : CLIENTES.filter(c => c.estado === filter)
  if (search) {
    const q = search.toLowerCase()
    list = list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.tel.includes(q) ||
      c.tags.toLowerCase().includes(q) ||
      c.notes.toLowerCase().includes(q)
    )
  }

  const quickAdd = () => {
    if (!name.trim()) return
    alert(`Cliente "${name}" añadido ✓`)
    setName(''); setTel('')
  }

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/clientes" />
      <main className={styles.main}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Clientes</h1>
            <p className={styles.phSub}>{CLIENTES.length} clientes · {list.length} mostrando</p>
          </div>
          <div className={styles.phActions}>
            <button className={styles.btnGhost} onClick={() => {}}>↓ CSV</button>
            <button className={styles.btnDark}>+ Nuevo cliente completo</button>
          </div>
        </div>

        {/* ⚡ AÑADIR EN 3 SEGUNDOS */}
        <div className={cStyles.quickAdd}>
          <div className={cStyles.qaLabel}>⚡ Añadir cliente rápido</div>
          <div className={cStyles.qaRow}>
            <div className={cStyles.qaField}>
              <label>Nombre *</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ej: Carmen Ruiz"
                onKeyDown={e => e.key === 'Enter' && document.getElementById('qa-tel')?.focus()}
                autoFocus
              />
            </div>
            <div className={cStyles.qaField}>
              <label>Teléfono</label>
              <input
                id="qa-tel"
                value={tel}
                onChange={e => setTel(e.target.value)}
                placeholder="+34 600..."
                onKeyDown={e => e.key === 'Enter' && quickAdd()}
              />
            </div>
            <div className={cStyles.qaField}>
              <label>Estado</label>
              <select value={estado} onChange={e => setEstado(e.target.value)}>
                {Object.entries(EL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <button className={styles.btnGold} onClick={quickAdd} style={{ alignSelf: 'flex-end' }}>
              Añadir ⚡
            </button>
          </div>
          <div className={cStyles.qaHint}>Tab entre campos · Enter para añadir · Después completas la ficha</div>
        </div>

        {/* PIPELINE */}
        <div className={cStyles.pipeBar}>
          {[
            { key: 'all', label: 'Todos', count: CLIENTES.length, cls: 'all' },
            { key: 'nuevo', label: 'Nuevos', count: counts.nuevo, cls: 'n' },
            { key: 'contactado', label: 'Contactados', count: counts.contactado, cls: 'c' },
            { key: 'cita', label: 'Cita agendada', count: counts.cita, cls: 'ci' },
            { key: 'completado', label: 'Completados', count: counts.completado, cls: 'co' },
          ].map(p => (
            <div
              key={p.key}
              className={`${cStyles.ps} ${filter === p.key ? cStyles.psOn : ''}`}
              onClick={() => setFilter(p.key)}
            >
              <div className={cStyles.psLabel}>{p.label}</div>
              <div className={`${cStyles.psNum} ${cStyles[p.cls]}`}>{p.count}</div>
            </div>
          ))}
        </div>

        {/* BÚSQUEDA */}
        <div className={cStyles.searchRow}>
          <div className={cStyles.searchWrap}>
            <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              className={cStyles.searchInp}
              placeholder="Buscar nombre, teléfono, etiqueta, notas…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* TABLA */}
        <div className={styles.card} style={{ padding: 0 }}>
          <table className={styles.tbl}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Etiqueta</th>
                <th>Estado</th>
                <th>Alta</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
                      <div className={cStyles.ccAv}>
                        {c.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <strong>{c.name}</strong>
                        {c.notes && <div style={{ fontSize: '.73rem', color: 'var(--grey)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.notes}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--grey)', fontSize: '.82rem' }}>{c.tel}</td>
                  <td>{c.tags && <span className={`${styles.bdg} ${styles.bCita}`} style={{ fontSize: '.62rem' }}>{c.tags}</span>}</td>
                  <td>
                    <div className={cStyles.epills}>
                      {Object.entries(EL).map(([k, v]) => (
                        <button
                          key={k}
                          className={`${cStyles.epill} ${cStyles[k]} ${c.estado === k ? cStyles.cur : ''}`}
                          title={v}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td style={{ color: 'var(--grey)', fontSize: '.78rem' }}>{c.created}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '.15rem', justifyContent: 'flex-end' }}>
                      <button className={cStyles.icoBtn} title="Editar">✎</button>
                      <button className={`${cStyles.icoBtn} ${cStyles.del}`} title="Eliminar">🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}