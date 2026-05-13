import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/context'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://emprenix.com'),

  verification: {
    google: 'dDztqwVwtx8fmwINC0sNiN6eYNlXhumYuRPYHyL8lig',
  },

  title: 'Emprenix — Crea tu web profesional y consigue más clientes',

  description:
    'Crea tu propia web profesional y organiza clientes, citas, presupuestos y facturas desde un solo lugar. La forma más fácil de dejar de parecer un negocio improvisado.',

  keywords:
    'crear web profesional, web para autónomos, CRM autónomos, agenda citas, presupuestos online, facturación autónomos, negocios de servicios',

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: 'https://emprenix.com',
  },

  openGraph: {
    title: 'Deja de parecer un negocio improvisado.',
    description:
      'Crea tu propia web profesional y organiza tu negocio desde un solo lugar.',
    url: 'https://emprenix.com',
    siteName: 'Emprenix',
    type: 'website',
    locale: 'es_ES',
  },

  twitter: {
    card: 'summary',
    title: 'Deja de parecer un negocio improvisado.',
    description:
      'Web profesional + clientes + citas + presupuestos. Todo desde un solo lugar.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}