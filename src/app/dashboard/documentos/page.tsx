'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import { useAuth } from '@/lib/context'
import { createClient } from '@/lib/supabase/client'

interface LineItem {
  id: string
  concepto: string
  descripcion: string
  cantidad: number
  precio: number
  iva: number
  descuento: number
}

interface Documento {
  id: string
  user_id: string
  client_id: string | null
  client_name: string
  numero: string
  fecha: string
  total: number
  estado: 'borrador' | 'enviado' | 'aceptado' | 'rechazado'
  items: LineItem[]
  notas: string
  cliente_externo: boolean
  cliente_apellido: string
  cliente_email: string
  cliente_telefono: string
  cliente_ciudad: string
  cliente_direccion: string
  metodo_pago: string
  created_at: string
  updated_at: string
}

interface Cliente {
  id: string
  name: string
  apellido?: string
  email?: string
  phone?: string
  local?: string
  address?: string
}

const STATUS_LABEL: Record<string, string> = {
  borrador: 'Borrador',
  enviado: 'Enviado',
  aceptado: 'Aceptado',
  rechazado: 'Rechazado',
}

const STATUS_BG: Record<string, string> = {
  borrador: '#f3f0ea',
  enviado: '#dbeafe',
  aceptado: '#dcfce7',
  rechazado: '#fee2e2',
}

const STATUS_COLOR: Record<string, string> = {
  borrador: '#64748b',
  enviado: '#1d4ed8',
  aceptado: '#166534',
  rechazado: '#991b1b',
}

const fmt = (n: number) =>
  n.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const STORAGE_KEY = 'presupuesto_borrador'

export default function Documentos() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<any>(null)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [loading, setLoading] = useState(true)

  const [showForm, setShowForm] = useState(false)
  const [editingDoc, setEditingDoc] = useState<Documento | null>(null)
  const [saving, setSaving] = useState(false)

  const [clienteExterno, setClienteExterno] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientApellido, setClientApellido] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientCity, setClientCity] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', concepto: '', descripcion: '', cantidad: 1, precio: 0, iva: 21, descuento: 0 },
  ])
  const [notas, setNotas] = useState('')
  const [numero, setNumero] = useState('')
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0])
  const [estado, setEstado] = useState<'borrador' | 'enviado' | 'aceptado' | 'rechazado'>('borrador')
  const [metodoPago, setMetodoPago] = useState('transferencia')
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [pdfTipo, setPdfTipo] = useState<'presupuesto' | 'factura'>('presupuesto')
  const [pdfDoc, setPdfDoc] = useState<any>(null)

  // ========== GUARDAR EN LOCALSTORAGE AUTOMÁTICAMENTE ==========
  const guardarBorrador = useCallback(() => {
    const borrador = {
      clienteExterno,
      selectedClientId,
      clientName,
      clientApellido,
      clientEmail,
      clientPhone,
      clientCity,
      clientAddress,
      items,
      notas,
      numero,
      fecha,
      estado,
      metodoPago,
      editingDocId: editingDoc?.id || null,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(borrador))
  }, [clienteExterno, selectedClientId, clientName, clientApellido, clientEmail, clientPhone, clientCity, clientAddress, items, notas, numero, fecha, estado, metodoPago, editingDoc])

  // Guardar automáticamente cada vez que cambia algo
  useEffect(() => {
    if (showForm) {
      guardarBorrador()
    }
  }, [showForm, guardarBorrador])

  // ========== CARGAR BORRADOR ==========
  const cargarBorrador = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setClienteExterno(data.clienteExterno || false)
        setSelectedClientId(data.selectedClientId || '')
        setClientName(data.clientName || '')
        setClientApellido(data.clientApellido || '')
        setClientEmail(data.clientEmail || '')
        setClientPhone(data.clientPhone || '')
        setClientCity(data.clientCity || '')
        setClientAddress(data.clientAddress || '')
        setItems(data.items || [{ id: '1', concepto: '', descripcion: '', cantidad: 1, precio: 0, iva: 21, descuento: 0 }])
        setNotas(data.notas || '')
        setNumero(data.numero || '')
        setFecha(data.fecha || new Date().toISOString().split('T')[0])
        setEstado(data.estado || 'borrador')
        setMetodoPago(data.metodoPago || 'transferencia')
        if (data.editingDocId) {
          // Encontrar el documento
          const doc = documentos.find(d => d.id === data.editingDocId)
          if (doc) {
            setEditingDoc(doc)
          }
        }
      } catch (e) {
        console.error('Error cargando borrador:', e)
      }
    }
  }, [documentos])

  const loadData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    try {
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profileData) setProfile(profileData)

      const { data: clientesData } = await supabase.from('clientes').select('*').eq('user_id', user.id)
      if (clientesData) setClientes(clientesData as Cliente[])

      const { data: docsData } = await supabase
        .from('presupuestos')
        .select('*')
        .eq('user_id', user.id)
        .order('fecha', { ascending: false })

      if (docsData) {
        setDocumentos(
          docsData.map(doc => ({
            ...doc,
            items: Array.isArray(doc.items) ? doc.items : [],
          }))
        )
      }

      const siguienteNumero = (docsData?.length || 0) + 1
      setNumero(`PRES-${new Date().getFullYear()}-${String(siguienteNumero).padStart(4, '0')}`)
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
    setClienteExterno(false)
    setSelectedClientId('')
    setClientName('')
    setClientApellido('')
    setClientEmail('')
    setClientPhone('')
    setClientCity('')
    setClientAddress('')
    setItems([{ id: '1', concepto: '', descripcion: '', cantidad: 1, precio: 0, iva: 21, descuento: 0 }])
    setNotas('')
    setMetodoPago('transferencia')
    setEstado('borrador')
    setFecha(new Date().toISOString().split('T')[0])
    localStorage.removeItem(STORAGE_KEY)
  }

  const openNewDoc = () => {
    resetForm()
    setShowForm(true)
  }

  const openEditDoc = (doc: Documento) => {
    setEditingDoc(doc)
    setSelectedClientId(doc.client_id || '')
    setClientName(doc.client_name || '')
    setClientApellido(doc.cliente_apellido || '')
    setClientEmail(doc.cliente_email || '')
    setClientPhone(doc.cliente_telefono || '')
    setClientCity(doc.cliente_ciudad || '')
    setClientAddress(doc.cliente_direccion || '')
    setItems(doc.items || [])
    setNotas(doc.notas || '')
    setNumero(doc.numero)
    setFecha(doc.fecha)
    setEstado(doc.estado)
    setMetodoPago(doc.metodo_pago || 'transferencia')
    setClienteExterno(doc.cliente_externo || false)
    setShowForm(true)
  }

  const selectClient = (clientId: string) => {
    if (clientId === 'externo') {
      setClienteExterno(true)
      setSelectedClientId('')
      setClientName('')
      setClientApellido('')
      setClientEmail('')
      setClientPhone('')
      setClientCity('')
      setClientAddress('')
    } else {
      const cliente = clientes.find(c => c.id === clientId)
      if (cliente) {
        setClienteExterno(false)
        setSelectedClientId(clientId)
        setClientName(cliente.name || '')
        setClientApellido(cliente.apellido || '')
        setClientEmail(cliente.email || '')
        setClientPhone(cliente.phone || '')
        setClientCity(cliente.local || '')
        setClientAddress(cliente.address || '')
      }
    }
  }

  const calcularTotalLinea = (item: LineItem) => {
    const subtotal = item.cantidad * item.precio
    const descuentoLinea = item.descuento > 0 ? (subtotal * item.descuento) / 100 : 0
    const base = subtotal - descuentoLinea
    const iva = (base * item.iva) / 100
    return { subtotal, descuentoLinea, base, iva, total: base + iva }
  }

  const calcularTotales = () => {
    let baseTotal = 0
    let ivaTotal = 0

    items.forEach(item => {
      const calc = calcularTotalLinea(item)
      baseTotal += calc.base
      ivaTotal += calc.iva
    })

    return {
      base: baseTotal,
      iva: ivaTotal,
      total: baseTotal + ivaTotal,
    }
  }

  const saveDoc = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return
    if (!numero.trim()) {
      alert('Escribe el número del documento')
      return
    }
    if (!clientName.trim()) {
      alert('Selecciona o escribe el cliente')
      return
    }
    if (items.some(i => !i.concepto.trim())) {
      alert('Todos los ítems deben tener concepto')
      return
    }

    setSaving(true)

    try {
      const totales = calcularTotales()

      const payload = {
        user_id: user.id,
        client_id: selectedClientId || null,
        client_name: clientName.trim(),
        numero: numero.trim(),
        fecha,
        total: totales.total,
        estado,
        items,
        notas: notas.trim(),
        cliente_externo: clienteExterno,
        cliente_apellido: clientApellido,
        cliente_email: clientEmail,
        cliente_telefono: clientPhone,
        cliente_ciudad: clientCity,
        cliente_direccion: clientAddress,
        metodo_pago: metodoPago,
      }

      if (editingDoc) {
        const { error } = await supabase.from('presupuestos').update(payload).eq('id', editingDoc.id)
        if (error) {
          alert('Error: ' + error.message)
          return
        }
      } else {
        const { error } = await supabase.from('presupuestos').insert([payload])
        if (error) {
          alert('Error: ' + error.message)
          return
        }
      }

      localStorage.removeItem(STORAGE_KEY)
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
      const { error } = await supabase.from('presupuestos').delete().eq('id', id)
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

  const generarPDF = (tipo: 'presupuesto' | 'factura', doc?: Documento) => {
    const docData = doc || {
      numero,
      fecha,
      client_name: clientName,
      cliente_apellido: clientApellido,
      cliente_direccion: clientAddress,
      cliente_ciudad: clientCity,
      cliente_telefono: clientPhone,
      cliente_email: clientEmail,
      items,
      notas,
      metodo_pago: metodoPago,
    }

    setPdfDoc(docData)
    setPdfTipo(tipo)
    setShowPDFModal(true)
  }

  const descargarPDFReal = async () => {
    try {
      const { jsPDF } = await import('jspdf')

      const doc = new jsPDF('p', 'mm', 'a4')
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPos = 15

      // TÍTULO CENTRADO
      doc.setFontSize(22)
      doc.setFont(undefined, 'bold')
      const titulo = pdfTipo === 'presupuesto' ? 'PRESUPUESTO' : 'FACTURA'
      const tituloWidth = doc.getTextWidth(titulo)
      doc.text(titulo, (210 - tituloWidth) / 2, yPos)

      // DATOS BÁSICOS
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      yPos += 10
      doc.text(`Nº: ${pdfDoc.numero}`, 14, yPos)
      yPos += 6
      doc.text(`Fecha: ${new Date(pdfDoc.fecha).toLocaleDateString('es-ES')}`, 14, yPos)

      // EMISOR (IZQUIERDA)
      yPos += 12
      doc.setFont(undefined, 'bold')
      doc.setFontSize(9)
      doc.text('EMITIDO POR:', 14, yPos)
      doc.setFont(undefined, 'normal')
      doc.setFontSize(9)
      yPos += 6
      doc.text(profile?.business_name || 'Tu empresa', 14, yPos)
      yPos += 5
      doc.text(`${profile?.owner_name || ''} - ${profile?.phone || ''}`, 14, yPos)
      yPos += 5
      doc.text(profile?.address || '', 14, yPos)
      yPos += 5
      doc.text(`${profile?.city || ''} - ${profile?.email || ''}`, 14, yPos)

      // CLIENTE (DERECHA) - ALINEADO
      yPos = 27
      doc.setFont(undefined, 'bold')
      doc.setFontSize(9)
      doc.text('CLIENTE:', 120, yPos)
      doc.setFont(undefined, 'normal')
      doc.setFontSize(9)
      yPos += 6
      doc.text(`${pdfDoc.client_name} ${pdfDoc.cliente_apellido || ''}`, 120, yPos)
      yPos += 5
      doc.text(pdfDoc.cliente_email || '', 120, yPos)
      yPos += 5
      doc.text(pdfDoc.cliente_telefono || '', 120, yPos)
      yPos += 5
      doc.text(pdfDoc.cliente_direccion || '', 120, yPos)
      yPos += 5
      doc.text(pdfDoc.cliente_ciudad || '', 120, yPos)

      // TABLA
      yPos = 75
      doc.setFont(undefined, 'bold')
      doc.setFontSize(9)

      const col1 = 14
      const col2 = 50
      const col3 = 95
      const col4 = 115
      const col5 = 145
      const col6 = 175

      doc.text('CONCEPTO', col1, yPos)
      doc.text('DESC.', col2, yPos)
      doc.text('CANTIDAD', col3, yPos)
      doc.text('PRECIO', col4, yPos)
      doc.text('IVA', col5, yPos)
      doc.text('TOTAL', col6, yPos)

      yPos += 7
      doc.setFont(undefined, 'normal')
      doc.setFontSize(9)

      pdfDoc.items.forEach(item => {
        const calc = calcularTotalLinea(item)
        if (yPos > pageHeight - 40) {
          doc.addPage()
          yPos = 15
        }

        const concepto = item.descuento > 0 ? `${item.concepto} (-${item.descuento}%)` : item.concepto
        doc.text(concepto.substring(0, 20), col1, yPos)
        doc.text(item.descripcion.substring(0, 15), col2, yPos)
        doc.text(String(item.cantidad), col3, yPos)
        doc.text(`${item.precio.toFixed(2)}€`, col4, yPos)
        doc.text(`${item.iva}%`, col5, yPos)
        doc.text(`${calc.total.toFixed(2)}€`, col6, yPos)
        yPos += 7
      })

      // TOTALES
      yPos += 5
      const totales = calcularTotales()

      doc.setFont(undefined, 'bold')
      doc.text(`Base: ${totales.base.toFixed(2)}€`, 14, yPos)
      doc.text(`IVA: ${totales.iva.toFixed(2)}€`, 100, yPos)
      yPos += 10
      doc.setFontSize(12)
      doc.text(`TOTAL: ${totales.total.toFixed(2)}€`, 14, yPos)

      // MÉTODO DE PAGO
      yPos += 10
      doc.setFont(undefined, 'normal')
      doc.setFontSize(9)
      doc.text(`Método de pago: ${pdfDoc.metodo_pago?.toUpperCase() || 'N/A'}`, 14, yPos)

      // NOTAS
      if (pdfDoc.notas) {
        yPos += 8
        doc.text('Observaciones:', 14, yPos)
        yPos += 5
        doc.text(pdfDoc.notas.substring(0, 100), 14, yPos)
      }

      doc.save(`${pdfTipo}-${pdfDoc.numero}.pdf`)
      alert('✅ PDF descargado correctamente')
    } catch (err) {
      console.error('Error:', err)
      alert('Error descargando PDF')
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

  const totales = calcularTotales()

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
            + Nuevo presupuesto
          </button>
        </div>

        {/* FORM MODAL */}
        {showForm && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10,15,20,.55)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              backdropFilter: 'blur(8px)',
              overflowY: 'auto',
            }}
            onClick={() => setShowForm(false)}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                width: '100%',
                maxWidth: 1100,
                maxHeight: '95vh',
                overflowY: 'auto',
                boxShadow: '0 16px 48px rgba(10,15,20,.13)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ padding: '1rem 1.2rem', borderBottom: '1px solid #e2ddd4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
                <h2 style={{ margin: 0, fontFamily: 'Syne', fontSize: '1rem', fontWeight: 700, textAlign: 'center', flex: 1 }}>
                  {editingDoc ? 'Editar' : 'Nuevo'} Presupuesto
                </h2>
                <button onClick={() => setShowForm(false)} style={{ width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '1.1rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>
                  ×
                </button>
              </div>

              <form onSubmit={saveDoc}>
                <div style={{ padding: '1rem 1.2rem', display: 'flex', flexDirection: 'column', gap: '.8rem' }}>
                  {/* NÚMERO Y FECHA */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#1c2b3a', marginBottom: '.2rem', textAlign: 'center' }}>
                        Número
                      </label>
                      <input
                        value={numero}
                        disabled
                        style={{ width: '100%', padding: '.5rem .7rem', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'inherit', fontSize: '.8rem', background: '#f5f5f5', cursor: 'not-allowed' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#1c2b3a', marginBottom: '.2rem', textAlign: 'center' }}>
                        Fecha
                      </label>
                      <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: '100%', padding: '.5rem .7rem', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'inherit', fontSize: '.8rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#1c2b3a', marginBottom: '.2rem', textAlign: 'center' }}>
                        Estado
                      </label>
                      <select
                        value={estado}
                        onChange={e => setEstado(e.target.value as any)}
                        style={{ width: '100%', padding: '.5rem .7rem', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'inherit', fontSize: '.8rem' }}
                      >
                        <option value="borrador">Borrador</option>
                        <option value="enviado">Enviado</option>
                        <option value="aceptado">Aceptado</option>
                        <option value="rechazado">Rechazado</option>
                      </select>
                    </div>
                  </div>

                  {/* CLIENTE */}
                  <div>
                    <label style={{ display: 'block', fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#1c2b3a', marginBottom: '.2rem', textAlign: 'center' }}>
                      Selecciona cliente
                    </label>
                    <select
                      onChange={e => selectClient(e.target.value)}
                      value={selectedClientId}
                      style={{ width: '100%', padding: '.5rem .7rem', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'inherit', fontSize: '.8rem' }}
                    >
                      <option value="">Selecciona cliente…</option>
                      {clientes.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                      <option value="externo">+ Cliente Externo</option>
                    </select>
                  </div>

                  {/* DATOS CLIENTE EXTERNO */}
                  {clienteExterno && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.5rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#1c2b3a', marginBottom: '.2rem' }}>
                          Nombre
                        </label>
                        <input
                          value={clientName}
                          onChange={e => setClientName(e.target.value)}
                          style={{ width: '100%', padding: '.5rem .7rem', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'inherit', fontSize: '.8rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#1c2b3a', marginBottom: '.2rem' }}>
                          Apellido
                        </label>
                        <input
                          value={clientApellido}
                          onChange={e => setClientApellido(e.target.value)}
                          style={{ width: '100%', padding: '.5rem .7rem', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'inherit', fontSize: '.8rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#1c2b3a', marginBottom: '.2rem' }}>
                          Email
                        </label>
                        <input
                          type="email"
                          value={clientEmail}
                          onChange={e => setClientEmail(e.target.value)}
                          style={{ width: '100%', padding: '.5rem .7rem', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'inherit', fontSize: '.8rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#1c2b3a', marginBottom: '.2rem' }}>
                          Teléfono
                        </label>
                        <input
                          value={clientPhone}
                          onChange={e => setClientPhone(e.target.value)}
                          style={{ width: '100%', padding: '.5rem .7rem', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'inherit', fontSize: '.8rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#1c2b3a', marginBottom: '.2rem' }}>
                          Ciudad
                        </label>
                        <input
                          value={clientCity}
                          onChange={e => setClientCity(e.target.value)}
                          style={{ width: '100%', padding: '.5rem .7rem', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'inherit', fontSize: '.8rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#1c2b3a', marginBottom: '.2rem' }}>
                          Dirección
                        </label>
                        <input
                          value={clientAddress}
                          onChange={e => setClientAddress(e.target.value)}
                          style={{ width: '100%', padding: '.5rem .7rem', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'inherit', fontSize: '.8rem' }}
                        />
                      </div>
                    </div>
                  )}

                  {/* TABLA CONCEPTOS */}
                  <div>
                    <label style={{ display: 'block', fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#1c2b3a', marginBottom: '.6rem', textAlign: 'center' }}>
                      Conceptos
                    </label>

                    {/* ENCABEZADOS TABLA */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 0.5fr 0.7fr 0.5fr 0.9fr', gap: '.4rem', marginBottom: '.6rem', padding: '.6rem', background: '#f3f0ea', borderRadius: 6, fontWeight: 700, fontSize: '.7rem', textTransform: 'uppercase', color: '#1c2b3a', textAlign: 'center' }}>
                      <div>Concepto</div>
                      <div>Descripción</div>
                      <div>Qty</div>
                      <div>Precio</div>
                      <div>IVA</div>
                      <div>Total</div>
                    </div>

                    {/* FILAS TABLA */}
                    {items.map((item, i) => {
                      const calc = calcularTotalLinea(item)
                      return (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 0.5fr 0.7fr 0.5fr 0.9fr', gap: '.4rem', marginBottom: '.6rem', padding: '.6rem', border: '1px solid #e2ddd4', borderRadius: 6, alignItems: 'flex-start' }}>
                          {/* CONCEPTO CON DESCUENTO AL FINAL */}
                          <div>
                            <input
                              type="text"
                              placeholder="Concepto"
                              value={item.concepto}
                              onChange={e => setItems(items.map((it, idx) => (idx === i ? { ...it, concepto: e.target.value } : it)))}
                              style={{ width: '100%', padding: '.4rem', border: '1px solid #ddd', borderRadius: 4, fontSize: '.75rem', fontFamily: 'inherit', marginBottom: '.2rem' }}
                            />
                            {item.descuento > 0 && (
                              <div style={{ fontSize: '.65rem', color: '#ef4444', fontWeight: 700 }}>
                                Desc: -{item.descuento}%
                              </div>
                            )}
                          </div>

                          {/* DESCRIPCIÓN */}
                          <textarea
                            placeholder="Descripción"
                            value={item.descripcion}
                            onChange={e => setItems(items.map((it, idx) => (idx === i ? { ...it, descripcion: e.target.value } : it)))}
                            style={{ width: '100%', padding: '.4rem', border: '1px solid #ddd', borderRadius: 4, fontSize: '.75rem', fontFamily: 'inherit', minHeight: '50px', resize: 'vertical' }}
                          />

                          {/* CANTIDAD */}
                          <input
                            type="number"
                            placeholder="Qty"
                            value={item.cantidad || ''}
                            onChange={e => setItems(items.map((it, idx) => (idx === i ? { ...it, cantidad: e.target.value ? Number(e.target.value) : '' } : it)))}
                            min={1}
                            style={{ width: '100%', padding: '.4rem', border: '1px solid #ddd', borderRadius: 4, fontSize: '.75rem', fontFamily: 'inherit', textAlign: 'center' }}
                          />

                          {/* PRECIO */}
                          <input
                            type="number"
                            placeholder="Precio"
                            value={item.precio || ''}
                            onChange={e => setItems(items.map((it, idx) => (idx === i ? { ...it, precio: e.target.value ? Number(e.target.value) : '' } : it)))}
                            step={0.01}
                            style={{ width: '100%', padding: '.4rem', border: '1px solid #ddd', borderRadius: 4, fontSize: '.75rem', fontFamily: 'inherit', textAlign: 'right' }}
                          />

                          {/* IVA */}
                          <select
                            value={item.iva}
                            onChange={e => setItems(items.map((it, idx) => (idx === i ? { ...it, iva: Number(e.target.value) } : it)))}
                            style={{ width: '100%', padding: '.4rem', border: '1px solid #ddd', borderRadius: 4, fontSize: '.75rem', fontFamily: 'inherit', textAlign: 'center' }}
                          >
                            <option value={0}>0%</option>
                            <option value={10}>10%</option>
                            <option value={15}>15%</option>
                            <option value={21}>21%</option>
                          </select>

                          {/* BOTONES Y TOTAL */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '.2rem' }}>
                            <div style={{ padding: '.4rem', background: '#f9f9f9', borderRadius: 4, fontSize: '.75rem', fontWeight: 700, textAlign: 'right' }}>
                              {calc.total.toFixed(2)}€
                            </div>
                            <div style={{ display: 'flex', gap: '.2rem' }}>
                              <button
                                type="button"
                                onClick={() => {
                                  const desc = prompt('Descuento %:')
                                  if (desc && !isNaN(Number(desc)) && Number(desc) > 0) {
                                    setItems(items.map((it, idx) => (idx === i ? { ...it, descuento: Number(desc) } : it)))
                                  }
                                }}
                                style={{ flex: 1, padding: '.3rem', background: '#f3f0ea', border: 'none', borderRadius: 4, fontSize: '.65rem', fontWeight: 600, cursor: 'pointer', color: '#2d5a27' }}
                              >
                                Desc.
                              </button>
                              <button
                                type="button"
                                onClick={() => setItems(items.filter((_, idx) => idx !== i))}
                                style={{ padding: '.3rem .4rem', background: '#fee2e2', border: 'none', borderRadius: 4, color: '#991b1b', cursor: 'pointer', fontWeight: 600, fontSize: '.65rem' }}
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {/* BOTÓN AÑADIR */}
                    <button
                      type="button"
                      onClick={() => setItems([...items, { id: String(items.length + 1), concepto: '', descripcion: '', cantidad: 1, precio: 0, iva: 21, descuento: 0 }])}
                      style={{ width: '100%', padding: '.6rem', background: '#2d5a27', color: 'white', border: 'none', borderRadius: 6, fontSize: '.8rem', fontWeight: 700, cursor: 'pointer', marginTop: '.6rem' }}
                    >
                      + Añadir línea
                    </button>
                  </div>

                  {/* TOTALES */}
                  <div style={{ padding: '.8rem', background: '#f8fafc', borderRadius: 8, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.8rem', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '.65rem', color: '#64748b', fontWeight: 600, marginBottom: '.2rem' }}>Base</div>
                      <div style={{ fontSize: '.9rem', fontWeight: 700 }}>{fmt(totales.base)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '.65rem', color: '#64748b', fontWeight: 600, marginBottom: '.2rem' }}>IVA</div>
                      <div style={{ fontSize: '.9rem', fontWeight: 700 }}>{fmt(totales.iva)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '.65rem', color: '#64748b', fontWeight: 600, marginBottom: '.2rem' }}>Total</div>
                      <div style={{ fontSize: '1rem', fontWeight: 900, color: '#2d5a27' }}>{fmt(totales.total)}</div>
                    </div>
                  </div>

                  {/* NOTAS */}
                  <div>
                    <label style={{ display: 'block', fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#1c2b3a', marginBottom: '.2rem', textAlign: 'center' }}>
                      Notas
                    </label>
                    <textarea
                      value={notas}
                      onChange={e => setNotas(e.target.value)}
                      placeholder="Condiciones de pago, observaciones…"
                      rows={2}
                      style={{ width: '100%', padding: '.5rem .7rem', border: '1px solid #cbd5e1', borderRadius: 6, fontFamily: 'inherit', fontSize: '.8rem', resize: 'vertical' }}
                    />
                  </div>

                  {/* MÉTODO DE PAGO */}
                  <div>
                    <label style={{ display: 'block', fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', color: '#1c2b3a', marginBottom: '.4rem', textAlign: 'center' }}>
                      Método de pago
                    </label>
                    <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {['efectivo', 'tarjeta', 'transferencia', 'al_contado'].map(metodo => (
                        <label key={metodo} style={{ display: 'flex', alignItems: 'center', gap: '.4rem', cursor: 'pointer', fontSize: '.8rem' }}>
                          <input
                            type="radio"
                            name="metodo"
                            value={metodo}
                            checked={metodoPago === metodo}
                            onChange={e => setMetodoPago(e.target.value)}
                            style={{ cursor: 'pointer' }}
                          />
                          {metodo.charAt(0).toUpperCase() + metodo.slice(1).replace('_', ' ')}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* BOTONES ACCIÓN */}
                <div style={{ padding: '.8rem 1.2rem', borderTop: '1px solid #e2ddd4', display: 'flex', justifyContent: 'flex-end', gap: '.4rem', position: 'sticky', bottom: 0, background: '#fff', zIndex: 10 }}>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    style={{ padding: '.5rem .9rem', background: 'transparent', color: '#0a0f14', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => generarPDF('presupuesto')}
                    style={{ padding: '.5rem .9rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                  >
                    👁️ Previsualizar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{ padding: '.5rem .9rem', background: '#0a0f14', color: '#fff', border: 'none', borderRadius: 6, fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}
                  >
                    {saving ? 'Guardando…' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL PREVISUALIZAR PDF */}
        {showPDFModal && pdfDoc && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10,15,20,.55)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              backdropFilter: 'blur(8px)',
            }}
            onClick={() => setShowPDFModal(false)}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: 16,
                width: '100%',
                maxWidth: 900,
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 16px 48px rgba(10,15,20,.13)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ padding: '.9rem 1.2rem', borderBottom: '1px solid #e2ddd4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontFamily: 'Syne', fontSize: '.95rem', fontWeight: 700 }}>
                  {pdfTipo === 'presupuesto' ? 'Presupuesto' : 'Factura'} - {pdfDoc.numero}
                </h2>
                <button onClick={() => setShowPDFModal(false)} style={{ width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '1.1rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}>
                  ×
                </button>
              </div>

              {/* CONTENIDO PDF */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', background: '#f5f5f5' }}>
                <div style={{ background: 'white', padding: '30px', borderRadius: 8, fontFamily: 'Arial, sans-serif', fontSize: '13px', lineHeight: '1.5' }}>
                  {/* TÍTULO CENTRADO */}
                  <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px', textAlign: 'center' }}>
                    {pdfTipo === 'presupuesto' ? 'PRESUPUESTO' : 'FACTURA'}
                  </div>

                  {/* DATOS BÁSICOS */}
                  <div style={{ marginBottom: '15px', fontSize: '11px', textAlign: 'center' }}>
                    <p>
                      <strong>Nº:</strong> {pdfDoc.numero}
                    </p>
                    <p>
                      <strong>Fecha:</strong> {new Date(pdfDoc.fecha).toLocaleDateString('es-ES')}
                    </p>
                  </div>

                  {/* EMISOR Y CLIENTE - ALINEADOS */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>EMITIDO POR:</div>
                      <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
                        <p>{profile?.business_name || 'Tu empresa'}</p>
                        <p>{profile?.owner_name}</p>
                        <p>{profile?.phone}</p>
                        <p>{profile?.address}</p>
                        <p>
                          {profile?.city} - {profile?.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>CLIENTE:</div>
                      <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
                        <p>
                          {pdfDoc.client_name} {pdfDoc.cliente_apellido}
                        </p>
                        <p>{pdfDoc.cliente_email}</p>
                        <p>{pdfDoc.cliente_telefono}</p>
                        <p>{pdfDoc.cliente_direccion}</p>
                        <p>{pdfDoc.cliente_ciudad}</p>
                      </div>
                    </div>
                  </div>

                  {/* TABLA */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '25px', fontSize: '11px' }}>
                    <thead>
                      <tr style={{ background: '#f3f0ea' }}>
                        <th style={{ padding: '8px', textAlign: 'left', fontWeight: 'bold' }}>CONCEPTO</th>
                        <th style={{ padding: '8px', textAlign: 'left', fontWeight: 'bold' }}>DESCRIPCIÓN</th>
                        <th style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>QTY</th>
                        <th style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>PRECIO</th>
                        <th style={{ padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>IVA</th>
                        <th style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pdfDoc.items.map((item: LineItem, i: number) => {
                        const calc = calcularTotalLinea(item)
                        const concepto = item.descuento > 0 ? `${item.concepto} (-${item.descuento}%)` : item.concepto
                        return (
                          <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '8px' }}>{concepto}</td>
                            <td style={{ padding: '8px', fontSize: '10px', color: '#666', whiteSpace: 'pre-wrap' }}>{item.descripcion}</td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>{item.cantidad}</td>
                            <td style={{ padding: '8px', textAlign: 'right' }}>{item.precio.toFixed(2)}€</td>
                            <td style={{ padding: '8px', textAlign: 'center' }}>{item.iva}%</td>
                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>{calc.total.toFixed(2)}€</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>

                  {/* TOTALES */}
                  <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                    <div style={{ marginBottom: '6px', fontSize: '11px' }}>
                      <strong>Base:</strong> {fmt(totales.base)}
                    </div>
                    <div style={{ marginBottom: '6px', fontSize: '11px' }}>
                      <strong>IVA:</strong> {fmt(totales.iva)}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#2d5a27', marginTop: '10px', paddingTop: '10px', borderTop: '2px solid #ddd' }}>
                      TOTAL: {fmt(totales.total)}
                    </div>
                  </div>

                  {/* MÉTODO DE PAGO */}
                  {pdfDoc.metodo_pago && (
                    <div style={{ marginBottom: '15px', fontSize: '11px' }}>
                      <strong>Método de pago:</strong> {pdfDoc.metodo_pago.toUpperCase()}
                    </div>
                  )}

                  {/* NOTAS */}
                  {pdfDoc.notas && (
                    <div style={{ marginTop: '15px', padding: '12px', background: '#f9f9f9', borderLeft: '3px solid #2d5a27', fontSize: '11px', whiteSpace: 'pre-wrap' }}>
                      <strong>Observaciones:</strong> {pdfDoc.notas}
                    </div>
                  )}
                </div>
              </div>

              {/* BOTONES */}
              <div style={{ padding: '.8rem 1.2rem', borderTop: '1px solid #e2ddd4', display: 'flex', justifyContent: 'flex-end', gap: '.4rem' }}>
                <button
                  onClick={() => setShowPDFModal(false)}
                  style={{ padding: '.5rem .9rem', background: 'transparent', color: '#0a0f14', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Cerrar
                </button>
                <button
                  onClick={descargarPDFReal}
                  style={{ padding: '.5rem .9rem', background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, fontSize: '.8rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  📥 Descargar PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TABLA DOCUMENTOS */}
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
              {documentos.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <strong>{doc.numero}</strong>
                  </td>
                  <td>{doc.client_name}</td>
                  <td style={{ color: '#64748b', fontSize: '.875rem' }}>{new Date(doc.fecha).toLocaleDateString('es-ES')}</td>
                  <td>
                    <strong>{fmt(doc.total)}</strong>
                  </td>
                  <td>
                    <span style={{ background: STATUS_BG[doc.estado], color: STATUS_COLOR[doc.estado], padding: '.18rem .55rem', borderRadius: 20, fontSize: '.66rem', fontWeight: 700, textTransform: 'uppercase' }}>
                      {STATUS_LABEL[doc.estado]}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '.3rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => generarPDF('presupuesto', doc)}
                        style={{ padding: '.25rem .55rem', background: '#dbeafe', color: '#1d4ed8', border: 'none', borderRadius: 4, fontSize: '.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        👁️ Ver
                      </button>
                      <button
                        onClick={() => generarPDF('factura', doc)}
                        style={{ padding: '.25rem .55rem', background: '#e8f5e9', color: '#166534', border: 'none', borderRadius: 4, fontSize: '.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        🧾 Factura
                      </button>
                      <button
                        onClick={() => openEditDoc(doc)}
                        style={{ padding: '.25rem .55rem', background: '#f3f0ea', color: '#0a0f14', border: 'none', borderRadius: 4, fontSize: '.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        ✎ Editar
                      </button>
                      <button
                        onClick={() => deleteDoc(doc.id)}
                        style={{ padding: '.25rem .55rem', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 4, fontSize: '.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {documentos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>📄</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '.5rem', color: '#1c2b3a' }}>
                Sin presupuestos
              </div>
              <p style={{ color: '#64748b', fontSize: '.875rem', marginBottom: '1.25rem' }}>
                Crea tu primer presupuesto
              </p>
              <button onClick={openNewDoc} className={styles.btnDark}>
                + Nuevo presupuesto
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
