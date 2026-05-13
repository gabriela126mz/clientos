import { Metadata } from 'next';
import { AuthProvider } from '@/lib/context'
import './globals.css'

export const metadata: Metadata = {
  verification: {
    google: "dDztqwVwtx8fmwINC0sNiN6eYNlXhumYuRPYHyL8lig"
  },
  title: 'Emprenix | CRM + Agenda + Facturación para Autónomos',
  description: 'Software todo-en-uno para fontaneros, electricistas y autónomos en España. Gestión de clientes, agenda, facturación y web pública. Prueba gratis 14 días.',
  keywords: 'CRM autónomos, software gestión clientes, facturación online, agenda citas',
  metadataBase: new URL('https://emprenix.com'),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Emprenix',
    description: 'CRM + Agenda + Facturación para Autónomos en España',
    url: 'https://emprenix.com',
    siteName: 'Emprenix',
    type: 'website',
    locale: 'es_ES',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Emprenix - Software para autónomos',
        type: 'image/jpeg',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emprenix',
    description: 'CRM + Agenda + Facturación para Autónomos',
  },
  alternates: {
    canonical: 'https://emprenix.com',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}