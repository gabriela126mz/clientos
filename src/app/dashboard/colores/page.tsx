'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '../page'
import styles from '../page.module.css'
import { useAuth } from '@/lib/context'
import { createClient } from '@/lib/supabase/client'
import { getTradeConfig } from '@/lib/trades'

interface ProfileData {
  id: string
  business_name: string
  trade: string
  color_primary?: string
  color_secondary?: string
  color_accent?: string
}

export default function CustomizationPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    color_primary: '',
    color_secondary: '',
    color_accent: '',
  })

  const loadProfile = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('Error cargando perfil:', error)
        return
      }

      setProfile(data as ProfileData)

      // Cargar colores personalizados o los por defecto del trade
      const tradeConfig = getTradeConfig(data.trade)
      setForm({
        color_primary: data.color_primary || tradeConfig.colors.primary,
        color_secondary: data.color_secondary || tradeConfig.colors.secondary,
        color_accent: data.color_accent || tradeConfig.colors.accent,
      })
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
    loadProfile()
  }, [authLoading, user, loadProfile, router])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update(form)
        .eq('id', user.id)

      if (error) {
        console.error(error)
        setMessage('Error al guardar: ' + error.message)
        return
      }

      setMessage('✅ Colores actualizados correctamente')
      await loadProfile()
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error(err)
      setMessage('Error inesperado')
    } finally {
      setSaving(false)
    }
  }

  const resetToDefault = () => {
    if (!profile) return
    const tradeConfig = getTradeConfig(profile.trade)
    setForm({
      color_primary: tradeConfig.colors.primary,
      color_secondary: tradeConfig.colors.secondary,
      color_accent: tradeConfig.colors.accent,
    })
  }

  if (loading) {
    return (
      <div className={styles.app}>
        <Sidebar active="/dashboard/colores" />
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

  return (
    <div className={styles.app}>
      <Sidebar active="/dashboard/colores" />

      <main className={styles.main}>
        <div className={styles.ph}>
          <div>
            <h1 className={styles.phTitle}>Personalizar colores</h1>
            <p className={styles.phSub}>Elige los colores que mejor representen tu marca.</p>
          </div>
          <button onClick={resetToDefault} className={styles.btnGhost}>
            ↺ Restaurar predeterminados
          </button>
        </div>

        {message && (
          <div style={{ padding: '1rem 1.4rem', borderRadius: 8, background: message.includes('✅') ? '#dcfce7' : '#fcebeb', color: message.includes('✅') ? '#166534' : '#991f1f', marginBottom: '1.5rem', fontSize: '.875rem', fontWeight: 600 }}>
            {message}
          </div>
        )}

        <form onSubmit={save}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className={styles.card} style={{ padding: '2rem' }}>
              {/* COLOR PRIMARIO */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#1c2b3a', marginBottom: '1rem' }}>
                  Color primario
                </label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={form.color_primary}
                    onChange={e => setForm({ ...form, color_primary: e.target.value })}
                    style={{ width: 80, height: 80, border: 'none', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '.85rem', fontWeight: 600, color: '#0a0f14', fontFamily: 'monospace' }}>
                      {form.color_primary}
                    </div>
                    <p style={{ fontSize: '.75rem', color: '#64748b', marginTop: '.5rem', maxWidth: 300 }}>
                      Color principal de botones, títulos y elementos principales.
                    </p>
                  </div>
                </div>
              </div>

              {/* COLOR SECUNDARIO */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#1c2b3a', marginBottom: '1rem' }}>
                  Color secundario
                </label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={form.color_secondary}
                    onChange={e => setForm({ ...form, color_secondary: e.target.value })}
                    style={{ width: 80, height: 80, border: 'none', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '.85rem', fontWeight: 600, color: '#0a0f14', fontFamily: 'monospace' }}>
                      {form.color_secondary}
                    </div>
                    <p style={{ fontSize: '.75rem', color: '#64748b', marginTop: '.5rem', maxWidth: 300 }}>
                      Color para hover, estados alternativos y navegación.
                    </p>
                  </div>
                </div>
              </div>

              {/* COLOR ACENTO */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#1c2b3a', marginBottom: '1rem' }}>
                  Color acento
                </label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={form.color_accent}
                    onChange={e => setForm({ ...form, color_accent: e.target.value })}
                    style={{ width: 80, height: 80, border: 'none', borderRadius: 8, cursor: 'pointer' }}
                  />
                  <div>
                    <div style={{ fontSize: '.85rem', fontWeight: 600, color: '#0a0f14', fontFamily: 'monospace' }}>
                      {form.color_accent}
                    </div>
                    <p style={{ fontSize: '.75rem', color: '#64748b', marginTop: '.5rem', maxWidth: 300 }}>
                      Color destacado para acentos, iconos y elementos especiales.
                    </p>
                  </div>
                </div>
              </div>

              {/* PREVIEW */}
              <div style={{ marginTop: '3rem', padding: '2rem', borderRadius: 8, background: '#f8fafc', border: '1px solid #cbd5e1' }}>
                <div style={{ fontSize: '.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', color: '#64748b', marginBottom: '1rem' }}>
                  Vista previa
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    style={{
                      padding: '.65rem 1.5rem',
                      background: form.color_primary,
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: '.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Botón primario
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: '.65rem 1.5rem',
                      background: form.color_secondary,
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: '.875rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Botón secundario
                  </button>
                  <div
                    style={{
                      padding: '.65rem 1.5rem',
                      background: form.color_accent,
                      color: '#fff',
                      borderRadius: 6,
                      fontSize: '.875rem',
                      fontWeight: 600,
                    }}
                  >
                    Acento
                  </div>
                </div>
              </div>

              {/* ACCIONES */}
              <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={resetToDefault}
                  className={styles.btnGhost}
                  style={{ padding: '.65rem 1.1rem' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={styles.btnDark}
                  style={{ padding: '.65rem 1.1rem', opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? 'Guardando…' : 'Guardar colores'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}
