'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import qStyles from './qr.module.css'
import { useAuth } from '@/lib/context'
import { createClient } from '@/lib/supabase/client'

interface QRData {
  id: string
  user_id: string
  qr_unique_id: string
  url_actual: string
  slug_original: string
  slug_actual: string
  qr_code: string
  business_name: string
  activo: boolean
  created_at: string
  updated_at: string
}

export default function QR() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [qrData, setQrData] = useState<QRData | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generando, setGenerando] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/')
      return
    }
    loadData()
  }, [authLoading, user])

  const loadData = async () => {
    try {
      setLoading(true)

      // Cargar perfil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (profileData) {
        setProfile(profileData)

        // Cargar QR activo
        const { data: qrExistente } = await supabase
          .from('qr_codes')
          .select('*')
          .eq('user_id', user?.id)
          .eq('activo', true)
          .single()

        if (qrExistente) {
          setQrData(qrExistente)

          // Si el slug cambió, actualizar automáticamente
          if (qrExistente.slug_actual !== profileData.slug) {
            await actualizarQRPorCambioSlug(qrExistente, profileData.slug)
          }
        } else {
          // Si no existe QR, generarlo automáticamente
          await generarQRAutomatico(profileData)
        }
      }
    } catch (err) {
      console.error('Error cargando datos:', err)
    } finally {
      setLoading(false)
    }
  }

  const generarQRUnico = () => {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    return `qr-${timestamp}-${random}`
  }
const generarQRAutomatico = async (profileData: any) => {
  try {
    setGenerando(true)

    const qrUniqueId = generarQRUnico()
    const urlPublica = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://clientos.vercel.app'}/${profileData.slug}`

    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&margin=10&color=0a0f14&bgcolor=ffffff&data=${encodeURIComponent(urlPublica)}`

    const response = await fetch(qrImageUrl)
    const blob = await response.blob()
    const reader = new FileReader()

    reader.onloadend = async () => {
      const base64 = reader.result as string

      const { data: qrCreado, error } = await supabase
        .from('qr_codes')
        .insert([
          {
            user_id: user?.id,
            qr_unique_id: qrUniqueId,
            url_actual: urlPublica,
            slug_original: profileData.slug,
            slug_actual: profileData.slug,
            qr_code: base64,
            business_name: profileData.business_name,
            activo: true,
          },
        ])
        .select('*')
        .single()

      if (error || !qrCreado) {
        console.error('Error guardando QR:', error)
        alert('❌ No se pudo crear el QR')
        setGenerando(false)
        return
      }

      await supabase.from('qr_history').insert([
        {
          qr_id: qrCreado.id,
          user_id: user?.id,
          slug_anterior: null,
          slug_nuevo: profileData.slug,
          razon: 'creacion_inicial',
        },
      ])

      setQrData(qrCreado)
      setGenerando(false)
    }

    reader.readAsDataURL(blob)
  } catch (err) {
    console.error('Error generando QR:', err)
    setGenerando(false)
  }
}
  const actualizarQRPorCambioSlug = async (qrData: QRData, nuevoSlug: string) => {
  try {
    const nuevaURL = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://clientos.vercel.app'}/${nuevoSlug}`

    await supabase
      .from('qr_codes')
      .update({
        url_actual: nuevaURL,
        slug_actual: nuevoSlug,
        updated_at: new Date().toISOString(),
      })
      .eq('id', qrData.id)

    await supabase.from('qr_history').insert([
      {
        qr_id: qrData.id,
        user_id: user?.id,
        slug_anterior: qrData.slug_actual,
        slug_nuevo: nuevoSlug,
        razon: 'cambio_slug',
      },
    ])

    setQrData({
      ...qrData,
      url_actual: nuevaURL,
      slug_actual: nuevoSlug,
    })
  } catch (err) {
    console.error('Error actualizando QR:', err)
  }
}

  const copyLink = async () => {
    if (qrData) {
      await navigator.clipboard.writeText(qrData.url_actual)
      alert('Link copiado ✅')
    }
  }

  const descargarQR = () => {
    if (!qrData) return

    const link = document.createElement('a')
    link.href = qrData.qr_code
    link.download = `qr-${qrData.slug_actual}-${profile?.business_name?.replace(/\s+/g, '-') || 'clientos'}.png`
    link.click()
  }

  const descargarQRPDF = async () => {
    if (!qrData || !profile) return

    try {
      const { jsPDF } = await import('jspdf')
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      })

      // Título
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text(profile.business_name, 105, 20, { align: 'center' })

      // Subtítulo
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Código QR - Permanente e inmutable', 105, 28, { align: 'center' })

      // Línea separadora
      doc.setDrawColor(200)
      doc.line(20, 32, 190, 32)

      // QR imagen
      doc.addImage(qrData.qr_code, 'PNG', 55, 45, 100, 100)

      // URL
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('URL:', 20, 160)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      const urlLines = doc.splitTextToSize(qrData.url_actual, 170)
      doc.text(urlLines, 20, 167)

      // Info importante
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 102, 0)
      doc.text('ℹ️ INFORMACIÓN IMPORTANTE', 20, 200)

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0)
      doc.setFontSize(8)
      const infoText = `Este QR es ÚNICO, PERMANENTE e INMUTABLE. Aunque cambies el nombre de tu negocio 10, 50 o 100 veces, este QR SEGUIRÁ FUNCIONANDO SIEMPRE y se redirigirá automáticamente a tu nueva landing.

Generado el: ${new Date(qrData.created_at).toLocaleDateString('es-ES')}
QR ID: ${qrData.qr_unique_id}`

      const infoLines = doc.splitTextToSize(infoText, 170)
      doc.text(infoLines, 20, 207)

      doc.save(`QR-${qrData.slug_actual}-${profile.business_name.replace(/\s+/g, '-')}.pdf`)
      alert('PDF descargado ✅')
    } catch (err) {
      console.error('Error descargando PDF:', err)
      alert('Error descargando PDF')
    }
  }

  if (loading || !qrData || !profile) {
    return (
      <div className={styles.app}>
        <Sidebar active="/dashboard/qr" />
        <main className={styles.main}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <p style={{ color: '#64748b' }}>Cargando tu QR...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/qr" />

      <main className={styles.main}>
        <div className={qStyles.hero}>
          <div>
            <span className={qStyles.kicker}>Código QR profesional</span>
            <h1 className={qStyles.title}>Tu QR y tu web</h1>
            <p className={qStyles.subtitle}>
              Imprime tu QR, pégalo en tu local, tarjetas o furgoneta, y tus clientes accederán directamente a tu web. Este QR es permanente e inmutable - nunca cambiará aunque tú lo hagas.
            </p>
          </div>
        </div>

        <div className={qStyles.layout}>
          <section className={qStyles.qrCard}>
            <div className={qStyles.qrTop}>
              <span className={qStyles.bizName}>{profile.business_name}</span>
              <span className={qStyles.status}>
                {qrData.slug_actual !== qrData.slug_original ? '🔄 Actualizado' : '✅ Activo'}
              </span>
            </div>

            <div className={qStyles.qrFrame}>
              <img src={qrData.qr_code} alt={`QR de ${profile.business_name}`} width={260} height={260} />
            </div>

            <div className={qStyles.qrLabel}>Escanea para conocernos</div>
            <div className={qStyles.qrUrl}>{qrData.url_actual}</div>

            {/* INFO ADICIONAL */}
            {qrData.slug_actual !== qrData.slug_original && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#fef3e2', borderRadius: '6px', border: '1px solid #fcd34d', fontSize: '.85rem', color: '#92400e' }}>
                <strong>⚠️ Cambio detectado</strong>
                <p style={{ margin: '.5rem 0 0 0', fontSize: '.8rem' }}>
                  Nombre original: <strong>{qrData.slug_original}</strong><br />
                  Nombre actual: <strong>{qrData.slug_actual}</strong>
                </p>
                <p style={{ margin: '.5rem 0 0 0', fontSize: '.75rem' }}>
                  ✅ El QR sigue siendo el mismo. Se actualiza automáticamente.
                </p>
              </div>
            )}
          </section>

          <section className={qStyles.side}>
            <div className={qStyles.infoCard}>
              <h2>Qué hacer con tu QR</h2>

              <div className={qStyles.steps}>
                {[
                  ['01', 'Descárgalo y pégalo en tu furgoneta, local o tarjeta de visita.'],
                  ['02', 'Cuando un cliente lo escanee verá tu web profesional.'],
                  ['03', 'Podrá contactarte desde ahí y entrar directo a tu CRM.'],
                  ['04', 'Este QR es permanente - nunca cambiará aunque tú lo hagas.'],
                ].map(([n, t]) => (
                  <div key={n} className={qStyles.step}>
                    <span>{n}</span>
                    <p>{t}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={qStyles.actions}>
              <button onClick={descargarQR} className={qStyles.primaryBtn}>
                ↓ Descargar QR PNG
              </button>

              <button onClick={descargarQRPDF} className={qStyles.primaryBtn} style={{ background: '#ef4444' }}>
                📄 Descargar QR PDF
              </button>

              <button className={qStyles.secondaryBtn} onClick={copyLink}>
                Copiar link
              </button>

              <a href={qrData.url_actual} target="_blank" rel="noopener noreferrer" className={qStyles.secondaryBtn}>
                Ver web
              </a>
            </div>

            <div className={qStyles.tipCard}>
              <strong>🔒 Información importante</strong>
              <p>
                <strong>Este QR es único, permanente e inmutable.</strong> Aunque cambies el nombre de tu negocio 10, 50 o 100 veces, este QR SEGUIRÁ FUNCIONANDO SIEMPRE y se redirigirá automáticamente a tu nueva web.
              </p>
              <p style={{ fontSize: '.85rem', color: '#666', marginTop: '.5rem' }}>
                Generado el {new Date(qrData.created_at).toLocaleDateString('es-ES')}<br />
                ID: <code style={{ background: '#f3f0ea', padding: '.2rem .4rem', borderRadius: 4, fontFamily: 'monospace', fontSize: '.8rem' }}>{qrData.qr_unique_id}</code>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
