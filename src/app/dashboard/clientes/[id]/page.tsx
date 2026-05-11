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

const STORAGE_EDIT = 'cliente_detalle_edit'

const saveEditToStorage = (data: any) => {
  try {
    localStorage.setItem(STORAGE_EDIT, JSON.stringify(data))
  } catch (e) {
    console.error('localStorage:', e)
  }
}

const loadEditFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_EDIT)
    return stored ? JSON.parse(stored) : null
  } catch (e) {
    console.error('localStorage:', e)
    return null
  }
}

const clearEditFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_EDIT)
  } catch (e) {
    console.error('localStorage:', e)
  }
}

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
  const [showEditModal, setShowEditModal] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({ name:'', phone:'', email:'', address:'', local:'', cif:'', cp:'', ciudad:'', estado:'nuevo', tags:'', notes:'' })
  
  const [validation, setValidation] = useState({
    name: { valid: true, message: '' },
    phone: { valid: true, message: '' },
    email: { valid: true, message: '' },
    cif: { valid: true, message: '' },
    cp: { valid: true, message: '' }
  })

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

  // ✅ GUARDAR EN LOCALSTORAGE AUTOMÁTICAMENTE
  useEffect(() => {
    if (showEditModal) {
      saveEditToStorage(form)
    }
  }, [form, showEditModal])

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
        .select('*')
        .eq('client_id', clientId)
        .eq('user_id', user.id)
        .order('fecha', { ascending: false })

      setPresupuestos(presupuestosData || [])

      const { data: citasData, error: citasError } = await supabase
        .from('citas')
        .select('*')
        .eq('client_id', clientId)
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (citasError) {
        console.error('Error cargando citas:', citasError)
      } else {
        console.log('✅ Citas cargadas:', citasData)
        setCitas(citasData || [])
      }

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

  const openEdit = () => {
    const stored = loadEditFromStorage()
    if (stored) {
      setForm(stored)
    }
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
  }

  const validateForm = (): boolean => {
    return validation.name.valid && validation.phone.valid && validation.email.valid && validation.cif.valid && validation.cp.valid
  }

  const saveCliente = async () => {
    if (!user || !cliente) return
    
    if (!validateForm()) {
      alert('⚠️ Corrige los errores antes de guardar')
      return
    }

    setSaving(true)
    
    try {
      const { error } = await supabase
        .from('clientes')
        .update({
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
          notes: sanitizeInput(form.notes.trim())
        })
        .eq('id', clientId)

      if (error) throw error
      
      clearEditFromStorage()
      setShowEditModal(false)
      await loadCliente()
      alert('✅ Cliente actualizado')
    } catch (err) {
      console.error('Error:', err)
      alert('❌ Error al actualizar cliente')
    } finally {
      setSaving(false)
    }
  }

  const descargarPDF = async (presupuesto: Presupuesto, type: 'presupuesto' | 'factura') => {
    try {
      // ✅ TRAER DETALLES COMPLETOS DEL PRESUPUESTO
      const { data: presupuestoCompleto } = await supabase
        .from('presupuestos')
        .select('*')
        .eq('id', presupuesto.id)
        .single()

      if (!presupuestoCompleto) {
        alert('❌ No se pudo cargar el presupuesto')
        return
      }

      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF('p', 'mm', 'a4')
      const titulo = type === 'presupuesto' ? 'PRESUPUESTO' : 'FACTURA'

      // TÍTULO
      doc.setFontSize(28)
      doc.setFont('helvetica', 'bold')
      doc.text(titulo, 105, 20, { align: 'center' })

      // NÚMERO Y FECHA
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`Número: ${presupuestoCompleto.numero}`, 20, 35)
      doc.text(`Fecha: ${new Date(presupuestoCompleto.fecha).toLocaleDateString('es-ES')}`, 120, 35)

      // EMISOR Y CLIENTE EN LÍNEA
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text('EMISOR:', 20, 50)
      doc.text('CLIENTE:', 120, 50)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      let yPos = 57

      // DATOS EMISOR (placeholder, ya que no tenemos perfil en esta página)
      doc.text('Mi Empresa', 20, yPos)
      doc.text(`${presupuestoCompleto.client_name}`, 120, yPos)
      yPos += 5

      doc.text('Propietario', 20, yPos)
      doc.text(`CIF: ${presupuestoCompleto.cliente_cif || '—'}`, 120, yPos)
      yPos += 5

      doc.text('CIF: 12345678X', 20, yPos)
      doc.text(`CP: ${presupuestoCompleto.cliente_cp || '—'}`, 120, yPos)
      yPos += 5

      doc.text('Email: info@empresa.com', 20, yPos)
      doc.text(`Email: ${presupuestoCompleto.cliente_email || '—'}`, 120, yPos)
      yPos += 5

      doc.text('Tel: 123456789', 20, yPos)
      doc.text(`Tel: ${presupuestoCompleto.cliente_telefono || '—'}`, 120, yPos)
      yPos += 5

      doc.text('Dir: Calle Principal, 123', 20, yPos)
      doc.text(`Dir: ${presupuestoCompleto.cliente_direccion || '—'}`, 120, yPos)
      yPos += 5

      doc.text('28000 Madrid', 20, yPos)
      doc.text(`${presupuestoCompleto.cliente_ciudad || '—'}`, 120, yPos)

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

      // ✅ ITEMS DEL PRESUPUESTO
      const items = Array.isArray(presupuestoCompleto.items) ? presupuestoCompleto.items : []
      
      items.forEach((item: any) => {
        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }

        const cant = Number(item.cantidad) || 0
        const prec = Number(item.precio) || 0
        const subtotal = cant * prec
        const desc = Number(item.descuento) || 0
        const descuentoLinea = desc > 0 ? (subtotal * desc) / 100 : 0
        const base = subtotal - descuentoLinea
        const iv = Number(item.iva) || 0
        const iva = (base * iv) / 100
        const total = base + iva

        doc.text(item.concepto?.substring(0, 18) || '', 18, yPos)
        doc.text(item.descripcion?.substring(0, 18) || '', 50, yPos)
        doc.text(String(cant), 105, yPos, { align: 'center' })
        doc.text(`${prec.toFixed(2)}€`, 130, yPos, { align: 'right' })
        doc.text(`${iv}%`, 150, yPos, { align: 'center' })
        doc.text(`${total.toFixed(2)}€`, 170, yPos, { align: 'right' })
        yPos += 7
      })

      // TOTALES
      yPos += 10
      const itemsTotal = items.reduce((acc: number, item: any) => {
        const cant = Number(item.cantidad) || 0
        const prec = Number(item.precio) || 0
        const subtotal = cant * prec
        const desc = Number(item.descuento) || 0
        const descuentoLinea = desc > 0 ? (subtotal * desc) / 100 : 0
        const base = subtotal - descuentoLinea
        const iv = Number(item.iva) || 0
        const iva = (base * iv) / 100
        return acc + base + iva
      }, 0)

      const totalBase = items.reduce((acc: number, item: any) => {
        const cant = Number(item.cantidad) || 0
        const prec = Number(item.precio) || 0
        const subtotal = cant * prec
        const desc = Number(item.descuento) || 0
        const descuentoLinea = desc > 0 ? (subtotal * desc) / 100 : 0
        return acc + (subtotal - descuentoLinea)
      }, 0)

      const totalIVA = itemsTotal - totalBase

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text(`BASE: ${totalBase.toFixed(2)}€`, 130, yPos, { align: 'right' })
      yPos += 7
      doc.text(`IVA 21%: ${totalIVA.toFixed(2)}€`, 130, yPos, { align: 'right' })
      yPos += 10
      doc.setFontSize(12)
      doc.setFillColor(255, 255, 255)
      doc.rect(120, yPos - 6, 60, 10, 'S')
      doc.text(`TOTAL: ${itemsTotal.toFixed(2)}€`, 150, yPos, { align: 'right' })

      yPos += 18
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text(`Método: ${presupuestoCompleto.metodo_pago?.toUpperCase() || 'N/A'}`, 20, yPos)

      if (presupuestoCompleto.notas) {
        yPos += 10
        doc.text('Observaciones:', 20, yPos)
        yPos += 5
        doc.setFontSize(8)
        const notasLines = doc.splitTextToSize(presupuestoCompleto.notas, 170)
        doc.text(notasLines, 20, yPos)
      }

      doc.save(`${type}-${presupuestoCompleto.numero}.pdf`)
      alert('✅ PDF descargado')
    } catch (err) {
      console.error('Error:', err)
      alert('❌ Error al descargar PDF')
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

      <main className={styles.main} style={{ background: '#f6f2ea', minHeight: '100vh', padding: 'clamp(1rem, 2vw, 1.5rem)' }}>
        <button onClick={() => router.push('/dashboard/clientes')} style={{ color: '#d96b5b', textDecoration: 'none', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' }}>← Clientes</button>

        <section style={{ display: 'flex', justifyContent: 'space-between', gap: 'clamp(0.5rem, 2vw, 1.5rem)', alignItems: 'flex-start', marginTop: 'clamp(1rem, 2vw, 1.5rem)', marginBottom: 'clamp(1rem, 2vw, 2rem)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 1rem)', minWidth: '200px' }}>
            <div style={{ width: 'clamp(48px, 8vw, 64px)', height: 'clamp(48px, 8vw, 64px)', borderRadius: '16px', background: color, opacity: 0.2, flexShrink: 0 }} />
            <div>
              <h1 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: 'clamp(1.5rem, 5vw, 2.6rem)', lineHeight: 1.1, color: '#071018' }}>{cliente.name}</h1>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'clamp(0.4rem, 1vw, 0.7rem)', flexWrap: 'wrap' }}>
            <button onClick={openEdit} style={{ padding: 'clamp(0.4rem, 1.5vw, 0.65rem) clamp(0.8rem, 2vw, 1.2rem)', borderRadius: '6px', border: '1px solid #ddd6c9', background: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', whiteSpace: 'nowrap' }}>✎ Editar</button>
            <button onClick={() => router.push('/dashboard/documentos')} style={{ padding: 'clamp(0.4rem, 1.5vw, 0.65rem) clamp(0.8rem, 2vw, 1.2rem)', borderRadius: '6px', border: 'none', background: '#0b1820', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', whiteSpace: 'nowrap' }}>+ Documentos</button>
            <button onClick={() => router.push('/dashboard/agenda')} style={{ padding: 'clamp(0.4rem, 1.5vw, 0.65rem) clamp(0.8rem, 2vw, 1.2rem)', borderRadius: '6px', border: 'none', background: '#2d5a27', color: '#fff', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', whiteSpace: 'nowrap' }}>📅 Agenda</button>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(250px, 80vw, 300px), 1fr))', gap: 'clamp(1rem, 2vw, 1.5rem)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.8rem, 2vw, 1.2rem)' }}>
            {/* PRESUPUESTOS */}
            <div style={{ background: '#fff', border: '1px solid #e5ddcf', borderRadius: '8px', padding: 'clamp(1rem, 2vw, 1.5rem)', overflow: 'auto' }}>
              <h2 style={{ marginTop: 0, fontFamily: 'Georgia, serif', fontSize: 'clamp(1rem, 3vw, 1.3rem)' }}>Presupuestos</h2>
              {presupuestos.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'clamp(0.65rem, 2vw, 0.8rem)' }}>
                    <thead>
                      <tr style={{ background: '#f3f0ea' }}>
                        <th style={{ textAlign: 'left', padding: 'clamp(0.4rem, 1vw, 0.7rem)', color: '#64748b', fontWeight: 700 }}>N°</th>
                        <th style={{ textAlign: 'left', padding: 'clamp(0.4rem, 1vw, 0.7rem)', color: '#64748b', fontWeight: 700 }}>Fecha</th>
                        <th style={{ textAlign: 'left', padding: 'clamp(0.4rem, 1vw, 0.7rem)', color: '#64748b', fontWeight: 700 }}>Importe</th>
                        <th style={{ textAlign: 'center', padding: 'clamp(0.4rem, 1vw, 0.7rem)', color: '#64748b', fontWeight: 700 }}>PDF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {presupuestos.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #e5ddcf', borderLeft: `4px solid ${ESTADO_STRIPE[p.estado]}` }}>
                          <td style={{ padding: 'clamp(0.5rem, 1.5vw, 0.9rem)', fontWeight: 800, fontSize: 'clamp(0.65rem, 2vw, 0.8rem)' }}>{p.numero}</td>
                          <td style={{ padding: 'clamp(0.5rem, 1.5vw, 0.9rem)', fontSize: 'clamp(0.65rem, 2vw, 0.8rem)' }}>{new Date(p.fecha).toLocaleDateString('es-ES')}</td>
                          <td style={{ padding: 'clamp(0.5rem, 1.5vw, 0.9rem)', fontWeight: 700, fontSize: 'clamp(0.65rem, 2vw, 0.8rem)' }}>{p.total.toFixed(2)}€</td>
                          <td style={{ padding: 'clamp(0.5rem, 1.5vw, 0.9rem)', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                              <button onClick={() => descargarPDF(p, 'presupuesto')} title="Presupuesto" style={{ padding: '0.25rem 0.4rem', background: '#dbeafe', color: '#1d4ed8', border: 'none', borderRadius: 4, fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>📄</button>
                              <button onClick={() => descargarPDF(p, 'factura')} title="Factura" style={{ padding: '0.25rem 0.4rem', background: '#e8d5f2', color: '#7c3aed', border: 'none', borderRadius: 4, fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>🧾</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ color: '#64748b', margin: '1rem 0 0 0', fontSize: 'clamp(0.7rem, 2vw, 0.85rem)' }}>Sin presupuestos. <button onClick={() => router.push('/dashboard/presupuestos')} style={{ color: '#2d5a27', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600, fontFamily: 'inherit' }}>Ver panel</button></p>
              )}
            </div>

            {/* CITAS */}
            <div style={{ background: '#fff', border: '1px solid #e5ddcf', borderRadius: '8px', padding: 'clamp(1rem, 2vw, 1.5rem)', overflow: 'auto' }}>
              <h2 style={{ marginTop: 0, fontFamily: 'Georgia, serif', fontSize: 'clamp(1rem, 3vw, 1.3rem)' }}>Visitas y citas</h2>
              {citas.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.6rem, 1.5vw, 1rem)', maxHeight: '400px', overflowY: 'auto' }}>
                  {citas.map(c => (
                    <div key={c.id} style={{ paddingBottom: 'clamp(0.6rem, 1.5vw, 1rem)', borderBottom: '1px solid #e5ddcf', borderLeft: `4px solid ${ESTADO_STRIPE[c.estado]}`, paddingLeft: '0.8rem' }}>
                      <p style={{ margin: 0, color: '#64748b', fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)' }}>{new Date(c.date).toLocaleDateString('es-ES')} · {c.time}</p>
                      <strong style={{ display: 'block', marginTop: '0.3rem', fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}>{c.title}</strong>
                      {c.place && <p style={{ marginTop: '0.3rem', color: '#64748b', fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)' }}>📍 {c.place}</p>}
                      {c.notes && <p style={{ marginTop: '0.3rem', color: '#64748b', fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)' }}>{c.notes}</p>}
                      <span style={{ display: 'inline-block', marginTop: '0.5rem', background: ESTADO_BG[c.estado], color: ESTADO_COLOR[c.estado], padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)', fontWeight: 700 }}>{c.estado}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#64748b', margin: '1rem 0 0 0', fontSize: 'clamp(0.7rem, 2vw, 0.85rem)' }}>Sin citas programadas. <button onClick={() => router.push('/dashboard/agenda')} style={{ color: color, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600, fontFamily: 'inherit' }}>Ver agenda</button></p>
              )}
            </div>
          </div>

          {/* SIDEBAR - FICHA */}
          <aside style={{ background: '#fff', border: '1px solid #e5ddcf', borderRadius: '8px', padding: 'clamp(1rem, 2vw, 1.5rem)', minHeight: '300px', position: 'sticky', top: 'clamp(0.5rem, 2vw, 1.5rem)' }}>
            <h2 style={{ marginTop: 0, fontFamily: 'Georgia, serif', fontSize: 'clamp(1rem, 3vw, 1.3rem)' }}>Ficha</h2>
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
              <button onClick={async () => { if (confirm('¿Eliminar este cliente?')) { const { error } = await supabase.from('clientes').delete().eq('id', clientId); if (!error) router.push('/dashboard/clientes') } }} style={{ width: '100%', padding: 'clamp(0.4rem, 1.5vw, 0.65rem)', background: '#fcebeb', color: '#991f1f', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', fontFamily: 'inherit' }}>🗑️ Eliminar cliente</button>
            </div>
          </aside>
        </section>

        {/* MODAL EDITAR CLIENTE */}
        {showEditModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,15,20,.55)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(1rem, 2vw, 1.5rem)', backdropFilter: 'blur(8px)', overflow: 'auto' }} onClick={closeEditModal}>
            <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 'clamp(300px, 95vw, 600px)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 16px 48px rgba(10,15,20,.13)', margin: 'auto' }} onClick={e => e.stopPropagation()}>
              <div style={{ padding: 'clamp(0.8rem, 2vw, 1.1rem) clamp(1rem, 2vw, 1.4rem)', borderBottom: '1px solid #e2ddd4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
                <div style={{ fontFamily: 'Syne,sans-serif', fontSize: 'clamp(0.9rem, 2vw, 1rem)', fontWeight: 700 }}>Editar cliente</div>
                <button onClick={closeEditModal} style={{ width: 'clamp(24px, 5vw, 28px)', height: 'clamp(24px, 5vw, 28px)', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>×</button>
              </div>
              <div style={{ padding: 'clamp(1rem, 2vw, 1.35rem)', display: 'flex', flexDirection: 'column', gap: 'clamp(0.6rem, 2vw, 0.85rem)' }}>
                {[
                  { label:'Nombre *', key:'name', type:'text', validation: 'name' },
                  { label:'Teléfono / WhatsApp', key:'phone', type:'tel', validation: 'phone' },
                  { label:'Email', key:'email', type:'email', validation: 'email' },
                  { label:'CIF', key:'cif', type:'text', validation: 'cif' },
                  { label:'Código Postal', key:'cp', type:'text', validation: 'cp' },
                  { label:'Ciudad', key:'ciudad', type:'text', validation: null },
                  { label:'Dirección', key:'address', type:'text', validation: null },
                  { label:'Nombre del local', key:'local', type:'text', validation: null },
                  { label:'Etiqueta', key:'tags', type:'text', validation: null },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: 'clamp(0.6rem, 1.5vw, 0.68rem)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#1c2b3a', marginBottom: '.3rem' }}>{f.label}</label>
                    <input
                      type={f.type}
                      value={form[f.key as keyof typeof form]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      style={{ 
                        width: '100%', 
                        padding: 'clamp(0.5rem, 1.5vw, 0.7rem) clamp(0.6rem, 1.5vw, 0.85rem)', 
                        background: '#fff', 
                        border: f.validation && !validation[f.validation as keyof typeof validation].valid 
                          ? '1.5px solid #dc2626' 
                          : '1.5px solid #cbd5e1', 
                        borderRadius: 8, 
                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', 
                        fontFamily: 'inherit', 
                        transition: 'all .15s', 
                        color: '#0a0f14', 
                        outline: 'none' 
                      }}
                    />
                    {f.validation && validation[f.validation as keyof typeof validation].message && (
                      <div style={{ 
                        fontSize: 'clamp(0.6rem, 1.5vw, 0.7rem)', 
                        color: validation[f.validation as keyof typeof validation].valid ? '#16a34a' : '#dc2626', 
                        marginTop: '.25rem',
                        fontWeight: 600
                      }}>
                        {validation[f.validation as keyof typeof validation].message}
                      </div>
                    )}
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: 'clamp(0.6rem, 1.5vw, 0.68rem)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#1c2b3a', marginBottom: '.3rem' }}>Estado</label>
                  <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} style={{ width: '100%', padding: 'clamp(0.5rem, 1.5vw, 0.7rem) clamp(0.6rem, 1.5vw, 0.85rem)', background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: 8, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', fontFamily: 'inherit', color: '#0a0f14' }}>
                    <option value="nuevo">Nuevo</option>
                    <option value="contactado">Contactado</option>
                    <option value="cita">Cita agendada</option>
                    <option value="completado">Completado</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'clamp(0.6rem, 1.5vw, 0.68rem)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#1c2b3a', marginBottom: '.3rem' }}>Notas internas</label>
                  <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} style={{ width: '100%', padding: 'clamp(0.5rem, 1.5vw, 0.7rem) clamp(0.6rem, 1.5vw, 0.85rem)', background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: 8, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', fontFamily: 'inherit', resize: 'vertical', color: '#0a0f14' }} />
                </div>
              </div>
              <div style={{ padding: 'clamp(0.8rem, 2vw, 1rem) clamp(1rem, 2vw, 1.4rem)', borderTop: '1px solid #e2ddd4', display: 'flex', justifyContent: 'flex-end', gap: 'clamp(0.4rem, 1vw, 0.55rem)', flexWrap: 'wrap' }}>
                <button onClick={closeEditModal} style={{ padding: 'clamp(0.5rem, 1.5vw, 0.65rem) clamp(0.8rem, 2vw, 1.1rem)', background: 'transparent', color: '#0a0f14', border: '1.5px solid #cbd5e1', borderRadius: 8, fontSize: 'clamp(0.7rem, 2vw, 0.84rem)', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Cancelar</button>
                <button onClick={saveCliente} disabled={saving || !validateForm()} style={{ padding: 'clamp(0.5rem, 1.5vw, 0.65rem) clamp(0.8rem, 2vw, 1.1rem)', background: validateForm() ? '#0a0f14' : '#cbd5e1', color: '#fff', border: 'none', borderRadius: 8, fontSize: 'clamp(0.7rem, 2vw, 0.84rem)', fontWeight: 600, cursor: validateForm() ? 'pointer' : 'not-allowed', fontFamily: 'inherit', opacity: saving ? 0.7 : 1, whiteSpace: 'nowrap' }}>{saving ? 'Guardando…' : 'Guardar cambios'}</button>
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
    <div style={{ marginBottom: 'clamp(0.8rem, 2vw, 1.2rem)' }}>
      <div style={{ textTransform: 'uppercase', letterSpacing: '2px', color: '#1c2b3a', fontSize: 'clamp(0.7rem, 1.5vw, 0.8rem)', marginBottom: '0.4rem', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.95rem)', color: '#071018', wordBreak: 'break-word' }}>{value}</div>
    </div>
  )
}
