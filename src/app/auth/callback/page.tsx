'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const finishAuth = async () => {
      await supabase.auth.getSession()
      router.push('/dashboard')
      router.refresh()
    }

    finishAuth()
  }, [router])

  return (
    <main style={{ padding: 24, fontFamily: 'Arial' }}>
      Confirmando cuenta...
    </main>
  )
}