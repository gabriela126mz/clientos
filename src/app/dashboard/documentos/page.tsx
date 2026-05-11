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
  cliente_cif: string
  cliente_cp: string
  metodo_pago: string
}

interface Cliente {
  id: string
  name: string
  apellido?: string
  email?: string
  phone?: string
  local?: string
  address?: string
  cif?: string
  cp?: string
  ciudad?: string
}

const STATUS_LABEL: Record<string, string> = { borrador: 'Borrador', enviado: 'Enviado', aceptado: 'Aceptado', rechazado: 'Rechazado' }
const STATUS_BG: Record<string, string> = { borrador: '#f3f0ea', enviado: '#dbeafe', aceptado: '#dcfce7', rechazado: '#fee2e2' }
const STATUS_COLOR: Record<string, string> = { borrador: '#64748b', enviado: '#1d4ed8', aceptado: '#166534', rechazado: '#991b1b' }

const fmt = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 })

const STORAGE_KEY = 'presupuesto_form'

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
  const [showPDFModal, setShowPDFModal] = useState(false)
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const [pdfType, setPdfType] = useState<'presupuesto' | 'factura'>('presupuesto')

  const [clienteExterno, setClienteExterno] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientApellido, setClientApellido] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientCity, setClientCity] = useState('')
  const [clientAddress, setClientAddress] = useState('')
  const [clientCif, setClientCif] = useState('')
  const [clientCp, setClientCp] = useState('')
  const [items, setItems] = useState<LineItem[]>([])
  const [notas, setNotas] = useState('')
  const [numero, setNumero] = useState('')
  const [fecha, setFecha] = useState('')
  const [estado, setEstado] = useState<'borrador' | 'enviado' | 'aceptado' | 'rechazado'>('borrador')
  const [metodoPago, setMetodoPago] = useState('transferencia')

  // ✅ GUARDAR EN LOCALSTORAGE
  useEffect(() => {
    if (showForm) {
      const formData = {
        clienteExterno,
        selectedClientId,
        clientName,
        clientApellido,
        clientEmail,
        clientPhone,
        clientCity,
        clientAddress,
        clientCif,
        clientCp,
        items,
        notas,
        numero,
        fecha,
        estado,
        metodoPago,
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
      } catch (e) {
        console.error('localStorage:', e)
      }
    }
  }, [showForm, clienteExterno, selectedClientId, clientName, clientApellido, clientEmail, clientPhone, clientCity, clientAddress, clientCif, clientCp, items, notas, numero, fecha, estado, metodoPago])

  const loadData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const [profileRes, clientesRes, docsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('clientes').select('*').eq('user_id', user.id),
        supabase.from('presupuestos').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      ])

      if (profileRes.data) setProfile(profileRes.data)
      if (clientesRes.data) setClientes(clientesRes.data as Cliente[])
      if (docsRes.data) {
        setDocumentos(docsRes.data.map(doc => ({ ...doc, items: Array.isArray(doc.items) ? doc.items : [] })))
      }
    } catch (err) {
      console.error('Error:', err)
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

  // ✅ GENERAR NÚMERO ÚNICO
  const generarNumeroUnico = useCallback(async () => {
    if (!user) return ''
    try {
      const { data, error } = await supabase
        .from('presupuestos')
        .select('id, numero')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      const ultimoNumero = data?.[0]?.numero?.split('-').pop()
const siguienteNum = ultimoNumero ? parseInt(ultimoNumero, 10) + 1 : 1

return `PRES-${new Date().getFullYear()}-${String(siguienteNum).padStart(4, '0')}`
      return `PRES-${new Date().getFullYear()}-${String(siguienteNum).padStart(4, '0')}`
    } catch (e) {
      console.error('Error:', e)
      return `PRES-${new Date().getFullYear()}-0001`
    }
  }, [user, supabase])

  const resetForm = useCallback(async () => {
    const nuevoNumero = await generarNumeroUnico()
    setEditingDoc(null)
    setClienteExterno(false)
    setSelectedClientId('')
    setClientName('')
    setClientApellido('')
    setClientEmail('')
    setClientPhone('')
    setClientCity('')
    setClientAddress('')
    setClientCif('')
    setClientCp('')
    setItems([{ id: '1', concepto: '', descripcion: '', cantidad: 0, precio: 0, iva: 21, descuento: 0 }])
    setNotas('')
    setMetodoPago('transferencia')
    setEstado('borrador')
    setFecha(new Date().toISOString().split('T')[0])
    setNumero(nuevoNumero)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error('localStorage:', e)
    }
  }, [generarNumeroUnico])

  // ✅ NUEVO PRESUPUESTO
  const openNewDoc = useCallback(async () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        setClienteExterno(data.clienteExterno || false)
        setSelectedClientId(data.selectedClientId || '')
        setClientName(data.clientName || '')
        setClientApellido(data.clientApellido || '')
        setClientEmail(data.clientEmail || '')
        setClientPhone(data.clientPhone || '')
        setClientCity(data.clientCity || '')
        setClientAddress(data.clientAddress || '')
        setClientCif(data.clientCif || '')
        setClientCp(data.clientCp || '')
        setItems(data.items?.length > 0 ? data.items : [{ id: '1', concepto: '', descripcion: '', cantidad: 0, precio: 0, iva: 21, descuento: 0 }])
        setNotas(data.notas || '')
        setNumero(data.numero || (await generarNumeroUnico()))
        setFecha(data.fecha || new Date().toISOString().split('T')[0])
        setEstado(data.estado || 'borrador')
        setMetodoPago(data.metodoPago || 'transferencia')
        setEditingDoc(null)
      } else {
        await resetForm()
      }
    } catch (e) {
      console.error('localStorage:', e)
      await resetForm()
    }
    setShowForm(true)
  }, [generarNumeroUnico, resetForm])

  // ✅ EDITAR
  const openEditDoc = (doc: Documento) => {
    setEditingDoc(doc)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        if (data.numero === doc.numero) {
          setClienteExterno(data.clienteExterno || doc.cliente_externo)
          setSelectedClientId(data.selectedClientId || doc.client_id)
          setClientName(data.clientName || doc.client_name)
          setClientApellido(data.clientApellido || doc.cliente_apellido)
          setClientEmail(data.clientEmail || doc.cliente_email)
          setClientPhone(data.clientPhone || doc.cliente_telefono)
          setClientCity(data.clientCity || doc.cliente_ciudad)
          setClientAddress(data.clientAddress || doc.cliente_direccion)
          setClientCif(data.clientCif || doc.cliente_cif)
          setClientCp(data.clientCp || doc.cliente_cp)
          setItems(data.items?.length > 0 ? data.items : doc.items)
          setNotas(data.notas || doc.notas)
          setNumero(doc.numero)
          setFecha(data.fecha || doc.fecha)
          setEstado(data.estado || doc.estado)
          setMetodoPago(data.metodoPago || doc.metodo_pago)
          setShowForm(true)
          return
        }
      }
    } catch (e) {
      console.error('localStorage:', e)
    }

    setSelectedClientId(doc.client_id || '')
    setClientName(doc.client_name || '')
    setClientApellido(doc.cliente_apellido || '')
    setClientEmail(doc.cliente_email || '')
    setClientPhone(doc.cliente_telefono || '')
    setClientCity(doc.cliente_ciudad || '')
    setClientAddress(doc.cliente_direccion || '')
    setClientCif(doc.cliente_cif || '')
    setClientCp(doc.cliente_cp || '')
    setItems(doc.items?.length > 0 ? doc.items : [{ id: '1', concepto: '', descripcion: '', cantidad: 0, precio: 0, iva: 21, descuento: 0 }])
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
      setClientCif('')
      setClientCp('')
    } else if (clientId) {
      const cliente = clientes.find(c => c.id === clientId)
      if (cliente) {
        setClienteExterno(false)
        setSelectedClientId(clientId)
        setClientName(cliente.name || '')
        setClientApellido(cliente.apellido || '')
        setClientEmail(cliente.email || '')
        setClientPhone(cliente.phone || '')
        setClientCity(cliente.ciudad || '')
        setClientAddress(cliente.address || '')
        setClientCif(cliente.cif || '')
        setClientCp(cliente.cp || '')
      }
    }
  }

  // ✅ CÁLCULOS CORRECTOS
  const calcularTotalLinea = (item: LineItem) => {
    const cant = Number(item.cantidad) || 0
    const prec = Number(item.precio) || 0
    const subtotal = cant * prec
    const desc = Number(item.descuento) || 0
    const descuentoLinea = desc > 0 ? (subtotal * desc) / 100 : 0
    const base = subtotal - descuentoLinea
    const iv = Number(item.iva) || 0
    const iva = (base * iv) / 100
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
    return { base: baseTotal, iva: ivaTotal, total: baseTotal + ivaTotal }
  }

  const saveDoc = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert('❌ Usuario no autenticado')
      return
    }

    if (!clientName.trim()) {
      alert('⚠️ Selecciona o escribe el cliente')
      return
    }

    const validItems = items.filter(i => i.concepto.trim())
    if (validItems.length === 0) {
      alert('⚠️ Añade al menos una línea con concepto')
      return
    }

    const invalidItems = validItems.filter(i => !i.cantidad || !i.precio)
    if (invalidItems.length > 0) {
      alert('⚠️ Cantidad y Precio son obligatorios en todas las líneas')
      return
    }

    setSaving(true)
    try {
      const totales = calcularTotales()
      const payload: any = {
        user_id: user.id,
        client_id: selectedClientId || null,
        client_name: clientName.trim(),
        numero: numero.trim(),
        fecha,
        total: totales.total,
        estado,
        items: validItems,
        notas: notas.trim(),
        cliente_externo: clienteExterno,
        cliente_apellido: clientApellido || '',
        cliente_email: clientEmail || '',
        cliente_telefono: clientPhone || '',
        cliente_ciudad: clientCity || '',
        cliente_direccion: clientAddress || '',
        cliente_cif: clientCif || '',
        cliente_cp: clientCp || '',
        metodo_pago: metodoPago,
      }

      let result
      if (editingDoc) {
        result = await supabase.from('presupuestos').update(payload).eq('id', editingDoc.id).select()
      } else {
        result = await supabase.from('presupuestos').insert([payload]).select()
      }

      if (result.error) {
        console.error('Error:', result.error)
        alert('❌ Error: ' + result.error.message)
        setSaving(false)
        return
      }

      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (e) {
        console.error('localStorage:', e)
      }

      await loadData()
      setShowForm(false)
      await resetForm()
      alert(editingDoc ? '✅ Actualizado' : '✅ Creado')
    } catch (err: any) {
      console.error('Error:', err)
      alert('❌ Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const deleteDoc = async (id: string) => {
    if (!confirm('¿Eliminar?')) return
    try {
      const result = await supabase.from('presupuestos').delete().eq('id', id)
      if (result.error) throw result.error
      await loadData()
      alert('✅ Eliminado')
    } catch (err: any) {
      alert('❌ Error: ' + err.message)
    }
  }

  const generarPDF = (doc?: Documento, type: 'presupuesto' | 'factura' = 'presupuesto') => {
    const docData = doc || {
      numero,
      fecha,
      client_name: clientName,
      cliente_apellido: clientApellido,
      cliente_direccion: clientAddress,
      cliente_ciudad: clientCity,
      cliente_cp: clientCp,
      cliente_cif: clientCif,
      cliente_telefono: clientPhone,
      cliente_email: clientEmail,
      items,
      notas,
      metodo_pago: metodoPago,
    }
    setPdfDoc(docData)
    setPdfType(type)
    setShowPDFModal(true)
  }

  const descargarPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF('p', 'mm', 'a4')
      const totales = calcularTotales()
      const titulo = pdfType === 'presupuesto' ? 'PRESUPUESTO' : 'FACTURA'

      // TÍTULO
      doc.setFontSize(28)
      doc.setFont('helvetica', 'bold')
      doc.text(titulo, 105, 20, { align: 'center' })

      // NÚMERO Y FECHA
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Número: ${pdfDoc.numero}`, 20, 35)
      doc.text(`Fecha: ${new Date(pdfDoc.fecha).toLocaleDateString('es-ES')}`, 120, 35)

      // EMISOR Y CLIENTE EN LÍNEA
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text('EMISOR:', 20, 50)
      doc.text('CLIENTE:', 120, 50)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      let yPos = 57

      // DATOS EMISOR
      doc.text(`${profile?.business_name || 'Empresa'}`, 20, yPos)
      doc.text(`${pdfDoc.client_name} ${pdfDoc.cliente_apellido || ''}`, 120, yPos)
      yPos += 5

      doc.text(`${profile?.owner_name || ''}`, 20, yPos)
      doc.text(`CIF: ${pdfDoc.cliente_cif || '—'}`, 120, yPos)
      yPos += 5

      if (profile?.cif) {
        doc.text(`CIF: ${profile.cif}`, 20, yPos)
        doc.text(`CP: ${pdfDoc.cliente_cp || '—'}`, 120, yPos)
        yPos += 5
      }

      doc.text(`Email: ${profile?.email || ''}`, 20, yPos)
      doc.text(`Email: ${pdfDoc.cliente_email || '—'}`, 120, yPos)
      yPos += 5

      doc.text(`Tel: ${profile?.phone || ''}`, 20, yPos)
      doc.text(`Tel: ${pdfDoc.cliente_telefono || '—'}`, 120, yPos)
      yPos += 5

      doc.text(`Dir: ${profile?.address || ''}`, 20, yPos)
      doc.text(`Dir: ${pdfDoc.cliente_direccion || '—'}`, 120, yPos)
      yPos += 5

      doc.text(`${profile?.cp || ''} ${profile?.city || ''}`, 20, yPos)
      doc.text(`${pdfDoc.cliente_ciudad || '—'}`, 120, yPos)

      // TABLA
      yPos = 100
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setFillColor(240, 240, 240)
      doc.rect(15, yPos - 5, 180, 7, 'F')
      doc.text('CONCEPTO', 18, yPos)
      doc.text('DESCRIPCIÓN', 50, yPos)
      doc.text('CANTIDAD', 105, yPos)
      doc.text('PRECIO', 130, yPos)
      doc.text('IVA', 150, yPos)
      doc.text('TOTAL', 170, yPos)

      yPos += 10
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)

      pdfDoc.items.forEach((item: LineItem) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
        const calc = calcularTotalLinea(item)
        doc.text(item.concepto.substring(0, 18), 18, yPos)
        doc.text(item.descripcion.substring(0, 18), 50, yPos)
        doc.text(String(item.cantidad), 105, yPos, { align: 'center' })
        doc.text(`${item.precio.toFixed(2)}€`, 130, yPos, { align: 'right' })
        doc.text(`${item.iva}%`, 150, yPos, { align: 'center' })
        doc.text(`${calc.total.toFixed(2)}€`, 170, yPos, { align: 'right' })
        yPos += 7
      })

      // TOTALES
      yPos += 10
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text(`BASE: ${totales.base.toFixed(2)}€`, 130, yPos, { align: 'right' })
      yPos += 7
      doc.text(`IVA 21%: ${totales.iva.toFixed(2)}€`, 130, yPos, { align: 'right' })
      yPos += 10
      doc.setFontSize(12)
      doc.setFillColor(255, 255, 255)
      doc.rect(120, yPos - 6, 60, 10, 'S')
      doc.text(`TOTAL: ${totales.total.toFixed(2)}€`, 150, yPos, { align: 'right' })

      yPos += 18
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text(`Método: ${pdfDoc.metodo_pago?.toUpperCase() || 'N/A'}`, 20, yPos)

      if (pdfDoc.notas) {
        yPos += 10
        doc.text('Observaciones:', 20, yPos)
        yPos += 5
        doc.setFontSize(8)
        const notasLines = doc.splitTextToSize(pdfDoc.notas, 170)
        doc.text(notasLines, 20, yPos)
      }

      doc.save(`${pdfType}-${pdfDoc.numero}.pdf`)
      alert('✅ PDF descargado')
    } catch (err: any) {
      alert('❌ Error: ' + err.message)
    }
  }

  if (loading) {
    return (
      <div className={styles.app}>
        <Sidebar active="/dashboard/documentos" />
        <main className={styles.main}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e2ddd4', borderTopColor: '#2d5a27', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ color: '#64748b', fontSize: '.875rem' }}>Cargando…</p>
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
            <p className={styles.phSub}>Presupuestos y facturas</p>
          </div>
          <button className={styles.btnDark} onClick={openNewDoc} style={{ background: '#2563eb' }}>+ Nuevo presupuesto</button>
        </div>

        {/* FORM MODAL */}
        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,20,.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'max(0.5rem, 2vw)', backdropFilter: 'blur(8px)', overflowY: 'auto' }} onClick={() => setShowForm(false)}>
            <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 'min(1000px, 95vw)', maxHeight: '95vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: 'clamp(0.8rem, 2vw, 1.2rem)', borderBottom: '2px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fafafa', zIndex: 10 }}>
                <h2 style={{ margin: 0, fontSize: 'clamp(1rem, 4vw, 1.1rem)', fontWeight: 700, color: '#1a202c' }}>{editingDoc ? 'Editar' : 'Nuevo'} Presupuesto</h2>
                <button onClick={() => setShowForm(false)} style={{ width: 32, height: 32, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '1.2rem', color: '#999', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>×</button>
              </div>

              <form onSubmit={saveDoc}>
                <div style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column', gap: 'clamp(0.8rem, 2vw, 1.2rem)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'clamp(0.5rem, 2vw, 1rem)' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: '#666', marginBottom: '.4rem', textTransform: 'uppercase' }}>Número</label>
                      <input value={numero} disabled style={{ width: '100%', padding: '.65rem', border: '1px solid #ddd', borderRadius: 6, background: '#f5f5f5', cursor: 'not-allowed', fontWeight: 600, fontSize: 'clamp(0.8rem, 2vw, 1rem)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: '#666', marginBottom: '.4rem', textTransform: 'uppercase' }}>Fecha</label>
                      <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} required style={{ width: '100%', padding: '.65rem', border: '1px solid #ddd', borderRadius: 6, fontSize: 'clamp(0.8rem, 2vw, 1rem)' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: '#666', marginBottom: '.4rem', textTransform: 'uppercase' }}>Estado</label>
                      <select value={estado} onChange={e => setEstado(e.target.value as any)} style={{ width: '100%', padding: '.65rem', border: '1px solid #ddd', borderRadius: 6, fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>
                        <option value="borrador">Borrador</option>
                        <option value="enviado">Enviado</option>
                        <option value="aceptado">Aceptado</option>
                        <option value="rechazado">Rechazado</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: '#666', marginBottom: '.4rem', textTransform: 'uppercase' }}>Cliente</label>
                    <select onChange={e => selectClient(e.target.value)} value={selectedClientId} style={{ width: '100%', padding: '.65rem', border: '1px solid #ddd', borderRadius: 6, fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>
                      <option value="">Selecciona…</option>
                      {clientes.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                      <option value="externo">+ Cliente Externo</option>
                    </select>
                  </div>

                  {clienteExterno && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'clamp(0.5rem, 2vw, 0.8rem)', padding: 'clamp(0.8rem, 2vw, 1rem)', background: '#f8f8f8', borderRadius: 8 }}>
                      {[
                        { label: 'Nombre *', state: clientName, setState: setClientName },
                        { label: 'Apellido', state: clientApellido, setState: setClientApellido },
                        { label: 'CIF', state: clientCif, setState: setClientCif },
                        { label: 'CP', state: clientCp, setState: setClientCp },
                        { label: 'Email', state: clientEmail, setState: setClientEmail, type: 'email' },
                        { label: 'Teléfono', state: clientPhone, setState: setClientPhone },
                        { label: 'Ciudad', state: clientCity, setState: setClientCity },
                        { label: 'Dirección', state: clientAddress, setState: setClientAddress },
                      ].map((field, i) => (
                        <div key={i}>
                          <label style={{ fontSize: '.65rem', fontWeight: 700, color: '#666', marginBottom: '.3rem', display: 'block' }}>{field.label}</label>
                          <input type={field.type || 'text'} value={field.state} onChange={e => field.setState(e.target.value)} required={field.label.includes('*')} style={{ width: '100%', padding: '.5rem', border: '1px solid #ddd', borderRadius: 4, fontSize: 'clamp(0.8rem, 2vw, 0.85rem)' }} />
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: '#666', marginBottom: '.6rem', textTransform: 'uppercase' }}>Líneas</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '.5rem', padding: '.7rem', background: '#f0f0f0', borderRadius: 6, fontWeight: 700, fontSize: '.7rem', marginBottom: '.6rem' }}>
                      <div>Concepto</div>
                      <div>Descripción</div>
                      <div>Cantidad *</div>
                      <div>Precio *</div>
                      <div>IVA</div>
                      <div>Total</div>
                    </div>

                    {items.map((item, i) => {
                      const calc = calcularTotalLinea(item)
                      return (
                        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '.5rem', marginBottom: '.5rem', padding: '.6rem', border: '1px solid #e0e0e0', borderRadius: 6 }}>
                          <input type="text" placeholder="Concepto" value={item.concepto} onChange={e => setItems(items.map((it, idx) => idx === i ? { ...it, concepto: e.target.value } : it))} style={{ width: '100%', padding: '.4rem', border: '1px solid #ddd', borderRadius: 4, fontSize: '.8rem', minWidth: 0 }} />
                          <textarea placeholder="Desc" value={item.descripcion} onChange={e => setItems(items.map((it, idx) => idx === i ? { ...it, descripcion: e.target.value } : it))} style={{ width: '100%', padding: '.4rem', border: '1px solid #ddd', borderRadius: 4, fontSize: '.8rem', minHeight: '45px', resize: 'vertical', minWidth: 0 }} />
                          <input type="number" value={item.cantidad || ''} onChange={e => setItems(items.map((it, idx) => idx === i ? { ...it, cantidad: Number(e.target.value) || 0 } : it))} min={0} step={0.01} style={{ width: '100%', padding: '.4rem', border: '1px solid #ddd', borderRadius: 4, fontSize: '.8rem', textAlign: 'center', minWidth: 0, borderColor: !item.cantidad && item.concepto ? '#ef4444' : '#ddd' }} />
                          <input type="number" value={item.precio || ''} onChange={e => setItems(items.map((it, idx) => idx === i ? { ...it, precio: Number(e.target.value) || 0 } : it))} min={0} step={0.01} style={{ width: '100%', padding: '.4rem', border: '1px solid #ddd', borderRadius: 4, fontSize: '.8rem', textAlign: 'right', minWidth: 0, borderColor: !item.precio && item.concepto ? '#ef4444' : '#ddd' }} />
                          <select value={item.iva} onChange={e => setItems(items.map((it, idx) => idx === i ? { ...it, iva: Number(e.target.value) } : it))} style={{ width: '100%', padding: '.4rem', border: '1px solid #ddd', borderRadius: 4, fontSize: '.8rem', minWidth: 0 }}>
                            <option value={0}>0%</option>
                            <option value={10}>10%</option>
                            <option value={15}>15%</option>
                            <option value={21}>21%</option>
                          </select>
                          <div style={{ display: 'flex', gap: '.3rem', alignItems: 'center', minWidth: 0 }}>
                            <div style={{ flex: 1, padding: '.4rem', background: '#f9f9f9', borderRadius: 4, fontSize: '.8rem', fontWeight: 700, textAlign: 'right', minWidth: 0 }}>{calc.total.toFixed(2)}€</div>
                            <button type="button" onClick={() => setItems(items.filter((_, idx) => idx !== i))} style={{ padding: '.3rem .4rem', background: '#fee2e2', border: 'none', borderRadius: 4, color: '#991b1b', cursor: 'pointer', fontWeight: 600, fontSize: '.7rem', flexShrink: 0 }}>✕</button>
                          </div>
                        </div>
                      )
                    })}

                    <button type="button" onClick={() => setItems([...items, { id: String(items.length + 1), concepto: '', descripcion: '', cantidad: 0, precio: 0, iva: 21, descuento: 0 }])} style={{ width: '100%', padding: '.7rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontSize: 'clamp(0.8rem, 2vw, 0.85rem)', fontWeight: 700, cursor: 'pointer' }}>+ Añadir línea</button>
                  </div>

                  <div style={{ padding: '1rem', background: '#f8f8f8', borderRadius: 8, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '.7rem', color: '#666', fontWeight: 600, marginBottom: '.3rem' }}>BASE</div>
                      <div style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', fontWeight: 700 }}>{fmt(totales.base)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '.7rem', color: '#666', fontWeight: 600, marginBottom: '.3rem' }}>IVA 21%</div>
                      <div style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)', fontWeight: 700 }}>{fmt(totales.iva)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '.7rem', color: '#666', fontWeight: 600, marginBottom: '.3rem' }}>TOTAL</div>
                      <div style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)', fontWeight: 900, color: '#2563eb' }}>{fmt(totales.total)}</div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: '#666', marginBottom: '.4rem', textTransform: 'uppercase' }}>Notas</label>
                    <textarea value={notas} onChange={e => setNotas(e.target.value)} placeholder="Condiciones de pago, observaciones…" rows={3} style={{ width: '100%', padding: '.65rem', border: '1px solid #ddd', borderRadius: 6, fontSize: 'clamp(0.8rem, 2vw, 0.85rem)', resize: 'vertical' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: '#666', marginBottom: '.5rem', textTransform: 'uppercase' }}>Método de pago</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                      {['efectivo', 'tarjeta', 'transferencia', 'al_contado'].map(metodo => (
                        <label key={metodo} style={{ display: 'flex', alignItems: 'center', gap: '.4rem', cursor: 'pointer', fontSize: 'clamp(0.8rem, 2vw, 0.85rem)' }}>
                          <input type="radio" name="metodo" value={metodo} checked={metodoPago === metodo} onChange={e => setMetodoPago(e.target.value)} style={{ cursor: 'pointer' }} />
                          {metodo.charAt(0).toUpperCase() + metodo.slice(1).replace('_', ' ')}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ padding: 'clamp(0.8rem, 2vw, 1rem)', borderTop: '2px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: 'clamp(0.4rem, 1vw, 0.6rem)', background: '#fafafa', position: 'sticky', bottom: 0, flexWrap: 'wrap' }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{ padding: 'clamp(0.5rem, 2vw, 0.6rem) clamp(0.8rem, 2vw, 1.2rem)', background: 'transparent', color: '#333', border: '1px solid #ddd', borderRadius: 6, fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Cancelar</button>
                  <button type="button" onClick={() => generarPDF(undefined, 'presupuesto')} style={{ padding: 'clamp(0.5rem, 2vw, 0.6rem) clamp(0.8rem, 2vw, 1.2rem)', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>👁️ Vista Pres.</button>
                  <button type="button" onClick={() => generarPDF(undefined, 'factura')} style={{ padding: 'clamp(0.5rem, 2vw, 0.6rem) clamp(0.8rem, 2vw, 1.2rem)', background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 6, fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>🧾 Vista Fact.</button>
                  <button type="submit" disabled={saving} style={{ padding: 'clamp(0.5rem, 2vw, 0.6rem) clamp(0.8rem, 2vw, 1.2rem)', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, whiteSpace: 'nowrap' }}>{saving ? 'Guardando…' : 'Guardar'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PDF MODAL */}
        {showPDFModal && pdfDoc && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,20,.55)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'max(0.5rem, 2vw)', backdropFilter: 'blur(8px)' }} onClick={() => setShowPDFModal(false)}>
            <div style={{ background: '#fff', borderRadius: 12, width: '100%', maxWidth: 'min(950px, 95vw)', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: 'clamp(0.8rem, 2vw, 1rem)', borderBottom: '2px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, fontSize: 'clamp(0.9rem, 3vw, 1rem)', fontWeight: 700 }}>{pdfType === 'presupuesto' ? 'Presupuesto' : 'Factura'} - {pdfDoc.numero}</h2>
                <button onClick={() => setShowPDFModal(false)} style={{ width: 32, height: 32, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '1.2rem', color: '#999', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>×</button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 'clamp(1rem, 3vw, 2rem)', background: '#f5f5f5' }}>
                <div style={{ background: 'white', padding: 'clamp(1.5rem, 4vw, 40px)', borderRadius: 8, fontFamily: 'Arial, sans-serif', fontSize: 'clamp(9px, 2vw, 11px)', lineHeight: '1.6', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 'bold', marginBottom: 'clamp(1rem, 3vw, 30px)', textAlign: 'center' }}>{pdfType === 'presupuesto' ? 'PRESUPUESTO' : 'FACTURA'}</div>

                  <div style={{ marginBottom: 'clamp(1rem, 3vw, 20px)', fontSize: 'clamp(10px, 2vw, 11px)' }}>
                    <div><strong>Número:</strong> {pdfDoc.numero}</div>
                    <div><strong>Fecha:</strong> {new Date(pdfDoc.fecha).toLocaleDateString('es-ES')}</div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(1.5rem, 4vw, 40px)', marginBottom: 'clamp(1.5rem, 4vw, 40px)' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: 'clamp(0.5rem, 2vw, 10px)', fontSize: 'clamp(10px, 2vw, 11px)' }}>EMISOR:</div>
                      <div style={{ fontSize: 'clamp(9px, 2vw, 10px)', lineHeight: '1.8' }}>
                        <p><strong>{profile?.business_name || 'Empresa'}</strong></p>
                        <p>{profile?.owner_name}</p>
                        {profile?.cif && <p><strong>CIF:</strong> {profile.cif}</p>}
                        <p><strong>Email:</strong> {profile?.email || '—'}</p>
                        <p><strong>Tel:</strong> {profile?.phone || '—'}</p>
                        <p><strong>Dir:</strong> {profile?.address || '—'}</p>
                        <p>{profile?.cp} {profile?.city}</p>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: 'clamp(0.5rem, 2vw, 10px)', fontSize: 'clamp(10px, 2vw, 11px)' }}>CLIENTE:</div>
                      <div style={{ fontSize: 'clamp(9px, 2vw, 10px)', lineHeight: '1.8' }}>
                        <p><strong>{pdfDoc.client_name} {pdfDoc.cliente_apellido || ''}</strong></p>
                        {pdfDoc.cliente_cif && <p><strong>CIF:</strong> {pdfDoc.cliente_cif}</p>}
                        <p><strong>Email:</strong> {pdfDoc.cliente_email || '—'}</p>
                        <p><strong>Tel:</strong> {pdfDoc.cliente_telefono || '—'}</p>
                        <p><strong>Dir:</strong> {pdfDoc.cliente_direccion || '—'}</p>
                        <p>{pdfDoc.cliente_cp} {pdfDoc.cliente_ciudad}</p>
                      </div>
                    </div>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 'clamp(1.5rem, 4vw, 30px)', fontSize: 'clamp(9px, 2vw, 10px)' }}>
                    <thead>
                      <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #333' }}>
                        <th style={{ padding: 'clamp(0.5rem, 1vw, 10px)', textAlign: 'left', fontWeight: 'bold' }}>CONCEPTO</th>
                        <th style={{ padding: 'clamp(0.5rem, 1vw, 10px)', textAlign: 'left', fontWeight: 'bold' }}>DESCRIPCIÓN</th>
                        <th style={{ padding: 'clamp(0.5rem, 1vw, 10px)', textAlign: 'center', fontWeight: 'bold' }}>CANTIDAD</th>
                        <th style={{ padding: 'clamp(0.5rem, 1vw, 10px)', textAlign: 'right', fontWeight: 'bold' }}>PRECIO</th>
                        <th style={{ padding: 'clamp(0.5rem, 1vw, 10px)', textAlign: 'center', fontWeight: 'bold' }}>IVA</th>
                        <th style={{ padding: 'clamp(0.5rem, 1vw, 10px)', textAlign: 'right', fontWeight: 'bold' }}>TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pdfDoc.items.map((item: LineItem, i: number) => {
                        const calc = calcularTotalLinea(item)
                        return (
                          <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: 'clamp(0.4rem, 1vw, 8px)' }}>{item.concepto}</td>
                            <td style={{ padding: 'clamp(0.4rem, 1vw, 8px)', fontSize: 'clamp(8px, 2vw, 9px)', color: '#666' }}>{item.descripcion}</td>
                            <td style={{ padding: 'clamp(0.4rem, 1vw, 8px)', textAlign: 'center' }}>{item.cantidad}</td>
                            <td style={{ padding: 'clamp(0.4rem, 1vw, 8px)', textAlign: 'right' }}>{item.precio.toFixed(2)}€</td>
                            <td style={{ padding: 'clamp(0.4rem, 1vw, 8px)', textAlign: 'center' }}>{item.iva}%</td>
                            <td style={{ padding: 'clamp(0.4rem, 1vw, 8px)', textAlign: 'right', fontWeight: 'bold' }}>{calc.total.toFixed(2)}€</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>

                  <div style={{ textAlign: 'right', marginBottom: 'clamp(1.5rem, 4vw, 30px)', paddingBottom: 'clamp(1rem, 2vw, 20px)', borderBottom: '2px solid #333' }}>
                    <div style={{ marginBottom: 'clamp(0.3rem, 1vw, 8px)', fontSize: 'clamp(10px, 2vw, 11px)' }}><strong>BASE:</strong> {fmt(totales.base)}</div>
                    <div style={{ marginBottom: 'clamp(0.3rem, 1vw, 8px)', fontSize: 'clamp(10px, 2vw, 11px)' }}><strong>IVA 21%:</strong> {fmt(totales.iva)}</div>
                    <div style={{ fontSize: 'clamp(12px, 3vw, 14px)', fontWeight: 'bold', color: '#2563eb', marginTop: 'clamp(0.8rem, 2vw, 15px)' }}>TOTAL: {fmt(totales.total)}</div>
                  </div>

                  {pdfDoc.metodo_pago && <div style={{ marginBottom: 'clamp(0.8rem, 2vw, 15px)', fontSize: 'clamp(9px, 2vw, 10px)' }}><strong>Método de pago:</strong> {pdfDoc.metodo_pago.toUpperCase()}</div>}
                  {pdfDoc.notas && <div style={{ marginTop: 'clamp(0.8rem, 2vw, 15px)', padding: 'clamp(0.8rem, 2vw, 12px)', background: '#f9f9f9', borderLeft: '4px solid #2563eb', fontSize: 'clamp(9px, 2vw, 10px)', whiteSpace: 'pre-wrap' }}><strong>Observaciones:</strong> {pdfDoc.notas}</div>}
                </div>
              </div>

              <div style={{ padding: 'clamp(0.8rem, 2vw, 1rem)', borderTop: '2px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: 'clamp(0.4rem, 1vw, 0.6rem)', flexWrap: 'wrap' }}>
                <button onClick={() => setShowPDFModal(false)} style={{ padding: 'clamp(0.5rem, 2vw, 0.6rem) clamp(0.8rem, 2vw, 1.2rem)', background: 'transparent', color: '#333', border: '1px solid #ddd', borderRadius: 6, fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Cerrar</button>
                <button onClick={descargarPDF} style={{ padding: 'clamp(0.5rem, 2vw, 0.6rem) clamp(0.8rem, 2vw, 1.2rem)', background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, fontSize: 'clamp(0.75rem, 2vw, 0.85rem)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>📥 Descargar</button>
              </div>
            </div>
          </div>
        )}

        {/* TABLA */}
        <div className={styles.card} style={{ padding: 0, marginTop: '2rem', overflowX: 'auto' }}>
          <table className={styles.tbl} style={{ fontSize: 'clamp(0.75rem, 2vw, 1rem)' }}>
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
                  <td><strong>{doc.numero}</strong></td>
                  <td style={{ fontSize: 'clamp(0.7rem, 2vw, 1rem)' }}>{doc.client_name}</td>
                  <td style={{ color: '#64748b', fontSize: 'clamp(0.7rem, 2vw, 0.875rem)' }}>{new Date(doc.fecha).toLocaleDateString('es-ES')}</td>
                  <td><strong>{fmt(doc.total)}</strong></td>
                  <td><span style={{ background: STATUS_BG[doc.estado], color: STATUS_COLOR[doc.estado], padding: '.18rem .55rem', borderRadius: 20, fontSize: 'clamp(0.6rem, 1.5vw, 0.66rem)', fontWeight: 700, textTransform: 'uppercase', display: 'inline-block' }}>{STATUS_LABEL[doc.estado]}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '.2rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                      <button onClick={() => generarPDF(doc, 'presupuesto')} title="Presupuesto" style={{ padding: '.25rem .4rem', background: '#dbeafe', color: '#1d4ed8', border: 'none', borderRadius: 4, fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)', fontWeight: 600, cursor: 'pointer' }}>👁️</button>
                      <button onClick={() => generarPDF(doc, 'factura')} title="Factura" style={{ padding: '.25rem .4rem', background: '#e8d5f2', color: '#7c3aed', border: 'none', borderRadius: 4, fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)', fontWeight: 600, cursor: 'pointer' }}>🧾</button>
                      <button onClick={() => openEditDoc(doc)} title="Editar" style={{ padding: '.25rem .4rem', background: '#f3f0ea', color: '#0a0f14', border: 'none', borderRadius: 4, fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)', fontWeight: 600, cursor: 'pointer' }}>✎</button>
                      <button onClick={() => deleteDoc(doc.id)} title="Eliminar" style={{ padding: '.25rem .4rem', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 4, fontSize: 'clamp(0.65rem, 1.5vw, 0.7rem)', fontWeight: 600, cursor: 'pointer' }}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {documentos.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'clamp(2rem, 5vw, 4rem) 1rem' }}>
              <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem', opacity: 0.3 }}>📄</div>
              <div style={{ fontWeight: 700, fontSize: 'clamp(0.9rem, 2vw, 1rem)', marginBottom: '.5rem', color: '#1c2b3a' }}>Sin documentos</div>
              <button onClick={openNewDoc} className={styles.btnDark} style={{ marginTop: '1rem', background: '#2563eb', padding: 'clamp(0.5rem, 2vw, 0.65rem) clamp(1rem, 3vw, 1.1rem)', fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>+ Nuevo presupuesto</button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
