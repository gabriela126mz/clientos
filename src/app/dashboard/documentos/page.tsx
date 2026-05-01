'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import { useAuth } from '@/lib/context'
import { createClient } from '@/lib/supabase/client'
import type { Client } from '@/lib/types'

type DocType = 'presupuesto' | 'factura'
type DocStatus = 'borrador' | 'enviado' | 'aceptado' | 'rechazado' | 'pagada' | 'vencida'

interface Documento {
  id: string
  user_id: string
  client_id: string | null
  client_name: string
  numero: string
  fecha: string
  total: number
  estado: DocStatus
  items: DocItem[]
  notas: string
  presupuesto_id?: string | null
  created_at: string
  updated_at: string
}

interface DocItem {
  descripcion: string
  cantidad: number
  precio: number
  iva: number
}

const STATUS_LABEL: Record<DocStatus, string> = {
  borrador: 'Borrador',
  enviado: 'Enviado',
  aceptado: 'Aceptado',
  rechazado: 'Rechazado',
  pagada: 'Pagada',
  vencida: 'Vencida',
}

const STATUS_BG: Record<DocStatus, string> = {
  borrador: '#f3f0ea',
  enviado: '#dbeafe',
  aceptado: '#dcfce7',
  rechazado: '#fee2e2',
  pagada: '#dcfce7',
  vencida: '#fee2e2',
}

const STATUS_COLOR: Record<DocStatus, string> = {
  borrador: '#64748b',
  enviado: '#1d4ed8',
  aceptado: '#166534',
  rechazado: '#991b1b',
  pagada: '#166534',
  vencida: '#991b1b',
}

const fmt = (n: number) =>
  n.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

export default function Documentos() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [activeTab, setActiveTab] = useState<DocType>('presupuesto')
  const [clientes, setClientes] = useState<Client[]>([])
  const [presupuestos, setPresupuestos] = useState<Documento[]>([])
  const [facturas, setFacturas] = useState<Documento[]>([])
  const [loading, setLoading] = useState(true)

  const [showForm, setShowForm] = useState(false)
  const [editingDoc, setEditingDoc] = useState<Documento | null>(null)
  const [saving, setSaving] = useState(false)

  const [isExterno, setIsExterno] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState('')
  const [clientNameInput, setClientNameInput] = useState('')
  const [items, setItems] = useState<DocItem[]>([{ descripcion: '', cantidad: 1, precio: 0, iva: 21 }])
  const [notas, setNotas] = useState('')
  const [numero, setNumero] = useState('')
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [estado, setEstado] = useState<DocStatus>('borrador')

  const loadData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    try {
      const { data: clientesData } = await supabase
        .from('clientes')
        .select('*')
        .eq('user_id', user.id)

      if (clientesData) setClientes(clientesData)

      const { data: presData } = await supabase
        .from('presupuestos')
        .select('*')
        .eq('user_id', user.id)
        .order('fecha', { ascending: false })

      if (presData) setPresupuestos(presData)

      const { data: facData } = await supabase
        .from('facturas')
        .select('*')
        .eq('user_id', user.id)
        .order('fecha', { ascending: false })

      if (facData) setFacturas(facData)
    } catch (err) {
      console.error('Error cargando datos:', err)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/')
      return
    }
    loadData()
  }, [authLoading, user, loadData, router])

  const resetForm = () => {
    setEditingDoc(null)
    setIsExterno(false)
    setSelectedClientId('')
    setClientNameInput('')
    setItems([{ descripcion: '', cantidad: 1, precio: 0, iva: 21 }])
    setNotas('')
    setNumero('')
    setFecha(new Date().toISOString().split('T')[0])
    setEstado('borrador')
  }

  const openNewDoc = () => {
    resetForm()
    setShowForm(true)
  }

  const openEditDoc = (doc: Documento) => {
    setEditingDoc(doc)
    setSelectedClientId(doc.client_id || '')
    setClientNameInput(doc.client_name)
    setItems(doc.items)
    setNotas(doc.notas)
    setNumero(doc.numero)
    setFecha(doc.fecha)
    setEstado(doc.estado as DocStatus)
    setShowForm(true)
  }

  const saveDoc = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return
    if (!numero.trim()) {
      alert('Escribe el número del documento')
      return
    }
    if (!clientNameInput.trim() && !selectedClientId) {
      alert('Selecciona o escribe el cliente')
      return
    }
    if (items.some(i => !i.descripcion.trim())) {
      alert('Todos los ítems deben tener descripción')
      return
    }

    setSaving(true)

    try {
      const base = items.reduce((s, i) => s + i.cantidad * i.precio, 0)
      const tax = items.reduce((s, i) => s + i.cantidad * i.precio * (i.iva / 100), 0)
      const total = base + tax

      const payload = {
        user_id: user.id,
        client_id: selectedClientId || null,
        client_name: clientNameInput.trim(),
        numero: numero.trim(),
        fecha,
        total,
        estado,
        items,
        notas: notas.trim(),
      }

      if (editingDoc) {
        const { error } = await supabase
          .from(activeTab === 'presupuesto' ? 'presupuestos' : 'facturas')
          .update(payload)
          .eq('id', editingDoc.id)

        if (error) {
          alert('Error: ' + error.message)
          return
        }
      } else {
        const { error } = await supabase
          .from(activeTab === 'presupuesto' ? 'presupuestos' : 'facturas')
          .insert([payload])

        if (error) {
          alert('Error: ' + error.message)
          return
        }
      }

      await loadData()
      setShowForm(false)
      resetForm()
      alert(editingDoc ? '✅ Documento actualizado' : '✅ Documento creado')
    } catch (err) {
      console.error(err)
      alert('Error inesperado')
    } finally {
      setSaving(false)
    }
  }

  const deleteDoc = async (id: string) => {
    if (!confirm('¿Eliminar este documento?')) return

    try {
      const { error } = await supabase
        .from(activeTab === 'presupuesto' ? 'presupuestos' : 'facturas')
        .delete()
        .eq('id', id)

      if (error) {
        alert('Error: ' + error.message)
        return
      }

      await loadData()
      alert('✅ Documento eliminado')
    } catch (err) {
      console.error(err)
      alert('Error inesperado')
    }
  }

  const convertToInvoice = async (presupuesto: Documento) => {
    if (!user) return
    if (presupuesto.estado !== 'aceptado') {
      alert('Solo presupuestos aceptados se pueden convertir')
      return
    }

    try {
      const factura = {
        user_id: user.id,
        client_id: presupuesto.client_id,
        presupuesto_id: presupuesto.id,
        client_name: presupuesto.client_name,
        numero: `FAC-${Date.now()}`,
        fecha: new Date().toISOString().split('T')[0],
        total: presupuesto.total,
        estado: 'enviado' as DocStatus,
        items: presupuesto.items,
        notas: presupuesto.notas,
      }

      const { error } = await supabase
        .from('facturas')
        .insert([factura])

      if (error) {
        alert('Error: ' + error.message)
        return
      }

      await loadData()
      alert('✅ Factura creada desde presupuesto')
    } catch (err) {
      console.error(err)
      alert('Error inesperado')
    }
  }

  const generatePDF = async (doc: Documento) => {
    try {
      const { jsPDF } = await import('jspdf')
      const pdfDoc = new jsPDF()

      pdfDoc.setFont('helvetica', 'bold')
      pdfDoc.setFontSize(18)
      pdfDoc.text(activeTab === 'presupuesto' ? 'PRESUPUESTO' : 'FACTURA', 20, 20)

      pdfDoc.setFont('helvetica', 'normal')
      pdfDoc.setFontSize(10)
      pdfDoc.text(`Número: ${doc.numero}`, 20, 35)
      pdfDoc.text(`Fecha: ${doc.fecha}`, 20, 42)
      pdfDoc.text(`Estado: ${STATUS_LABEL[doc.estado]}`, 20, 49)

      pdfDoc.setFont('helvetica', 'bold')
      pdfDoc.text('CLIENTE:', 20, 60)
      pdfDoc.setFont('helvetica', 'normal')
      pdfDoc.text(doc.client_name, 20, 67)

      let yPos = 80
      pdfDoc.setFont('helvetica', 'bold')
      pdfDoc.setFontSize(9)
      pdfDoc.text('Descripción', 20, yPos)
      pdfDoc.text('Cantidad', 100, yPos)
      pdfDoc.text('Precio', 130, yPos)
      pdfDoc.text('Subtotal', 160, yPos)

      pdfDoc.setFont('helvetica', 'normal')
      yPos += 8

      doc.items.forEach(item => {
        const subtotal = item.cantidad * item.precio
        pdfDoc.text(item.descripcion.substring(0, 30), 20, yPos)
        pdfDoc.text(item.cantidad.toString(), 100, yPos)
        pdfDoc.text(`${item.precio.toFixed(2)}€`, 130, yPos)
        pdfDoc.text(`${subtotal.toFixed(2)}€`, 160, yPos)
        yPos += 8
      })

      yPos += 5
      pdfDoc.setFont('helvetica', 'bold')
      pdfDoc.text(`TOTAL: ${fmt(doc.total)}`, 130, yPos)

      if (doc.notas) {
        pdfDoc.setFont('helvetica', 'normal')
        pdfDoc.setFontSize(8)
        yPos += 15
        pdfDoc.text('Notas:', 20, yPos)
        pdfDoc.text(doc.notas.substring(0, 80), 20, yPos + 7)
      }

      pdfDoc.save(`${doc.numero}.pdf`)
      alert('✅ PDF descargado')
    } catch (err) {
      console.error(err)
      alert('Error generando PDF. Instala jsPDF: npm install jspdf')
    }
  }

  if (loading) {
    return (
      <div className={styles.app}>
        <Sidebar active="/dashboard/documentos" />
        <main className={styles.main}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e2ddd4', borderTopColor: '#2d5a27', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748b', fontSize: '.875rem' }}>Cargando documentos…</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        </main>
      </div>
    )
  }

  const docs = activeTab === 'presupuesto' ? presupuestos : facturas
  const base = items.reduce((s, i) => s + i.cantidad * i.precio, 0)
  const tax = items.reduce((s, i) => s + i.cantidad * i.precio * (i.iva / 100), 0)
  const total = base + tax

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/documentos" />

      <main className={styles.main}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Documentos</h1>
            <p className={styles.phSub}>Presupuestos y facturas de tus clientes</p>
          </div>
          <button className={styles.btnDark} onClick={openNewDoc}>
            + {activeTab === 'presupuesto' ? 'Nuevo presupuesto' : 'Nueva factura'}
          </button>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2ddd4', paddingBottom: '1rem' }}>
          {(['presupuesto', 'factura'] as DocType[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '.5rem 1rem',
                background: activeTab === tab ? '#0a0f14' : 'transparent',
                color: activeTab === tab ? '#fff' : '#64748b',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '.875rem',
                fontFamily: 'inherit',
              }}
            >
              {tab === 'presupuesto' ? '📋 Presupuestos' : '📄 Facturas'}
            </button>
          ))}
        </div>

        {/* FORM */}
        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,20,.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowForm(false)}>
            <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 800, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 16px 48px rgba(10,15,20,.13)' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ padding: '1.1rem 1.4rem', borderBottom: '1px solid #e2ddd4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ margin: 0, fontFamily: 'Syne', fontSize: '1rem', fontWeight: 700 }}>
                    {editingDoc ? 'Editar' : 'Nuevo'} {activeTab === 'presupuesto' ? 'Presupuesto' : 'Factura'}
                  </h2>
                </div>
                <button onClick={() => setShowForm(false)} style={{ width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '1.1rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
              </div>

              <form onSubmit={saveDoc}>
                <div style={{ padding: '1.35rem', display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
                  {/* DATOS BÁSICOS */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.65rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#1c2b3a', marginBottom: '.3rem' }}>Número *</label>
                      <input value={numero} onChange={e => setNumero(e.target.value)} placeholder="PRES-2026-001" style={{ width: '100%', padding: '.7rem .85rem', border: '1.5px solid #cbd5e1', borderRadius: 8, fontFamily: 'inherit', fontSize: '.875rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#1c2b3a', marginBottom: '.3rem' }}>Fecha *</label>
                      <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: '100%', padding: '.7rem .85rem', border: '1.5px solid #cbd5e1', borderRadius: 8, fontFamily: 'inherit', fontSize: '.875rem' }} />
                    </div>
                  </div>

                  {/* CLIENTE */}
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem', cursor: 'pointer', fontSize: '.85rem', fontWeight: 600, color: '#1c2b3a' }}>
                      <input type="checkbox" checked={isExterno} onChange={e => setIsExterno(e.target.checked)} style={{ cursor: 'pointer' }} />
                      Cliente externo
                    </label>
                  </div>

                  {isExterno ? (
                    <div>
                      <label style={{ display: 'block', fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#1c2b3a', marginBottom: '.3rem' }}>Nombre cliente *</label>
                      <input value={clientNameInput} onChange={e => setClientNameInput(e.target.value)} placeholder="Ej: Carmen Ruiz" style={{ width: '100%', padding: '.7rem .85rem', border: '1.5px solid #cbd5e1', borderRadius: 8, fontFamily: 'inherit', fontSize: '.875rem' }} />
                    </div>
                  ) : (
                    <div>
                      <label style={{ display: 'block', fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#1c2b3a', marginBottom: '.3rem' }}>Selecciona cliente *</label>
                      <select value={selectedClientId} onChange={e => {
                        const cliente = clientes.find(c => c.id === e.target.value)
                        setSelectedClientId(e.target.value)
                        if (cliente) setClientNameInput(cliente.name)
                      }} style={{ width: '100%', padding: '.7rem .85rem', border: '1.5px solid #cbd5e1', borderRadius: 8, fontFamily: 'inherit', fontSize: '.875rem' }}>
                        <option value="">Selecciona cliente…</option>
                        {clientes.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* ITEMS */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.65rem' }}>
                      <label style={{ fontWeight: 700, fontSize: '.875rem' }}>Conceptos</label>
                      <button type="button" onClick={() => setItems([...items, { descripcion: '', cantidad: 1, precio: 0, iva: 21 }])} style={{ padding: '.3rem .65rem', background: '#f3f0ea', border: 'none', borderRadius: 4, fontSize: '.75rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>+ Añadir</button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 0.5fr', gap: '.35rem', marginBottom: '.65rem' }}>
                      {items.map((item, i) => (
                        <div key={i} style={{ display: 'contents' }}>
                          <input value={item.descripcion} onChange={e => setItems(items.map((it, idx) => idx === i ? { ...it, descripcion: e.target.value } : it))} placeholder="Descripción" style={{ padding: '.4rem', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: '.75rem', fontFamily: 'inherit' }} />
                          <input type="number" value={item.cantidad} onChange={e => setItems(items.map((it, idx) => idx === i ? { ...it, cantidad: +e.target.value } : it))} min={1} style={{ padding: '.4rem', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: '.75rem', fontFamily: 'inherit' }} />
                          <input type="number" value={item.precio} onChange={e => setItems(items.map((it, idx) => idx === i ? { ...it, precio: +e.target.value } : it))} min={0} step={0.01} style={{ padding: '.4rem', border: '1px solid #cbd5e1', borderRadius: 4, fontSize: '.75rem', fontFamily: 'inherit' }} />
                          <button type="button" onClick={() => setItems(items.filter((_, idx) => idx !== i))} style={{ padding: '.4rem', background: '#fee2e2', border: 'none', borderRadius: 4, color: '#991b1b', cursor: 'pointer', fontWeight: 600 }}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* NOTAS */}
                  <div>
                    <label style={{ display: 'block', fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', color: '#1c2b3a', marginBottom: '.3rem' }}>Notas</label>
                    <textarea value={notas} onChange={e => setNotas(e.target.value)} placeholder="Condiciones de pago, observaciones…" rows={3} style={{ width: '100%', padding: '.7rem .85rem', border: '1.5px solid #cbd5e1', borderRadius: 8, fontFamily: 'inherit', fontSize: '.875rem', resize: 'vertical' }} />
                  </div>

                  {/* TOTALES */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.65rem', padding: '1rem', background: '#f8fafc', borderRadius: 8 }}>
                    <div>
                      <div style={{ fontSize: '.7rem', color: '#64748b', fontWeight: 600 }}>Base</div>
                      <div style={{ fontSize: '.95rem', fontWeight: 700 }}>{fmt(base)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '.7rem', color: '#64748b', fontWeight: 600 }}>IVA</div>
                      <div style={{ fontSize: '.95rem', fontWeight: 700 }}>{fmt(tax)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '.7rem', color: '#64748b', fontWeight: 600 }}>Total</div>
                      <div style={{ fontSize: '.95rem', fontWeight: 700, color: '#2d5a27' }}>{fmt(total)}</div>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '1rem 1.4rem', borderTop: '1px solid #e2ddd4', display: 'flex', justifyContent: 'flex-end', gap: '.55rem' }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{ padding: '.65rem 1.1rem', background: 'transparent', color: '#0a0f14', border: '1.5px solid #cbd5e1', borderRadius: 8, fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
                  <button type="submit" disabled={saving} style={{ padding: '.65rem 1.1rem', background: '#0a0f14', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.84rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}>{saving ? 'Guardando…' : editingDoc ? 'Guardar cambios' : 'Crear documento'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TABLA */}
        <div className={styles.card} style={{ padding: 0 }}>
          <table className={styles.tbl}>
            <thead>
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {docs.map(doc => (
                <tr key={doc.id}>
                  <td><strong>{doc.numero}</strong></td>
                  <td>{doc.client_name}</td>
                  <td style={{ color: '#64748b', fontSize: '.875rem' }}>{doc.fecha}</td>
                  <td><strong>{fmt(doc.total)}</strong></td>
                  <td>
                    <span style={{ background: STATUS_BG[doc.estado], color: STATUS_COLOR[doc.estado], padding: '.18rem .55rem', borderRadius: 20, fontSize: '.66rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      {STATUS_LABEL[doc.estado]}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '.3rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      {activeTab === 'presupuesto' && doc.estado === 'aceptado' && (
                        <button onClick={() => convertToInvoice(doc)} style={{ padding: '.25rem .55rem', background: '#e8f5e9', color: '#166534', border: 'none', borderRadius: 4, fontSize: '.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>→ Factura</button>
                      )}
                      <button onClick={() => generatePDF(doc)} style={{ padding: '.25rem .55rem', background: '#dbeafe', color: '#1d4ed8', border: 'none', borderRadius: 4, fontSize: '.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>📄 PDF</button>
                      <button onClick={() => openEditDoc(doc)} style={{ padding: '.25rem .55rem', background: '#f3f0ea', color: '#0a0f14', border: 'none', borderRadius: 4, fontSize: '.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>✎ Editar</button>
                      <button onClick={() => deleteDoc(doc.id)} style={{ padding: '.25rem .55rem', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 4, fontSize: '.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {docs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>📄</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '.5rem', color: '#1c2b3a' }}>
              Sin {activeTab === 'presupuesto' ? 'presupuestos' : 'facturas'}
            </div>
            <p style={{ color: '#64748b', fontSize: '.875rem', marginBottom: '1.25rem' }}>
              {activeTab === 'presupuesto' ? 'Crea tu primer presupuesto' : 'Crea tu primera factura'}
            </p>
            <button onClick={openNewDoc} className={styles.btnDark}>
              + {activeTab === 'presupuesto' ? 'Nuevo presupuesto' : 'Nueva factura'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
