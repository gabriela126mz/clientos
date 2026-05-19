'use client'

export default function PricingPage() {

  const handleCheckout = async () => {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
      })

      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error(err)
      alert('Error iniciando pago')
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial',
        background: '#f8fafc',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '3rem',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0,0,0,.08)',
          maxWidth: '450px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            marginBottom: '.5rem',
          }}
        >
          Emprenix
        </h1>

        <p
          style={{
            color: '#64748b',
            marginBottom: '2rem',
            lineHeight: 1.5,
          }}
        >
          Tu web profesional + clientes + agenda + presupuestos
          desde un solo lugar.
        </p>

        <div
          style={{
            fontSize: '3rem',
            fontWeight: '900',
            marginBottom: '.2rem',
          }}
        >
          34,99€
          <span
            style={{
              fontSize: '1rem',
              color: '#64748b',
            }}
          >
            /mes
          </span>
        </div>

        <p
          style={{
            color: '#16a34a',
            fontWeight: '700',
            marginBottom: '2rem',
          }}
        >
          7 días gratis
        </p>

        <button
          onClick={handleCheckout}
          style={{
            width: '100%',
            padding: '1rem',
            border: 'none',
            borderRadius: '12px',
            background: '#111827',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          Empezar ahora
        </button>

        <p
          style={{
            marginTop: '1rem',
            fontSize: '.9rem',
            color: '#94a3b8',
          }}
        >
          Cancela cuando quieras.
        </p>
      </div>
    </main>
  )
}