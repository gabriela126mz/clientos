import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: false,
    detectSessionInUrl: true,
  },
})

if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('sb-')) localStorage.removeItem(key)
      })
      sessionStorage.clear()
    }
  })

  window.addEventListener('unhandledrejection', (event) => {
    const message = String(event.reason?.message || '')

    if (
      message.includes('Invalid Refresh Token') ||
      message.includes('Refresh Token Not Found')
    ) {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('sb-')) localStorage.removeItem(key)
      })
      sessionStorage.clear()
      window.location.replace('/')
    }
  })
}