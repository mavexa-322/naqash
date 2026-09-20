import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Use placeholder strings if environment variables are not set yet
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co"
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
