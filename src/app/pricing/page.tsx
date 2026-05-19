'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export default function PricingPage() {
  const [loading, setLoading] = useState(false)

 const handleCheckout = async () => {
  setLoading(true)

  try {
    const userRes = await supabase.auth.getUser()

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userRes.data.user?.id,
        email: userRes.data.user?.email,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.error || 'Error iniciando pago')
      setLoading(false)
      return
    }

    window.location.href = data.url
  } catch (err) {
    console.error(err)
    alert('Error conectando con Stripe')
    setLoading(false)
  }
}
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        fontFamily: 'Arial, sans-serif',
        padding: '2rem',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: 460,
          background: '#fff',
          borderRadius: 24,
          padding: '3rem 2rem',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(15,23,42,.12)',
          border: '1px solid #e5e7eb',
        }}
      >
        <h1
          style={{
            fontSize: '2.4rem',
            fontWeight: 900,
            margin: 0,
            color: '#0f172a',
          }}
        >
          Emprenix Pro
        </h1>

        <p
          style={{
            color: '#64748b',
            margin: '1rem 0 2rem',
            lineHeight: 1.5,
          }}
        >
          Crea tu web profesional y organiza clientes, citas,
          presupuestos y facturas desde un solo lugar.
        </p>

        <div
          style={{
            fontSize: '3rem',
            fontWeight: 900,
            color: '#0f172a',
          }}
        >
          34,99€
          <span
            style={{
              fontSize: '1rem',
              color: '#64748b',
              fontWeight: 700,
            }}
          >
            /mes
          </span>
        </div>

        <p
          style={{
            color: '#16a34a',
            fontWeight: 800,
            margin: '.5rem 0 2rem',
          }}
        >
          7 días gratis
        </p>

        <button
          onClick={handleCheckout}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            border: 'none',
            borderRadius: 14,
            background: '#111827',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 800,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Abriendo Stripe…' : 'Empezar prueba gratis'}
        </button>

        <p
          style={{
            marginTop: '1rem',
            fontSize: '.9rem',
            color: '#94a3b8',
          }}
        >
          Cancela cuando quieras. Pago seguro con Stripe.
        </p>
      </section>
    </main>
  )
}