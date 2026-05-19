"use client"

import { useRouter } from "next/navigation"

export default function Pricing() {

  const handleCheckout = async () => {

    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({
        userId: "USER_ID",
        email: "EMAIL"
      })
    })

    const data = await res.json()

    window.location.href = data.url
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Emprenix</h1>

      <p>
        Tu negocio en un solo lugar: web, clientes, agenda y facturación.
      </p>

      <h2>34,99€/mes</h2>

      <button onClick={handleCheckout}>
        Empezar prueba gratuita 7 días
      </button>
    </div>
  )
}