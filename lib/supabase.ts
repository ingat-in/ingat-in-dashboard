import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  client = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  })

  return client
}

export interface User {
  id?: string
  number: string
  absen_pagi: boolean
  absen_sore: boolean
  last_checkin?: string | null
  created_at?: string
  updated_at?: string
}

export interface Stats {
  totalUsers: number
  absenPagi: {
    sudah: number
    belum: number
    percentage: number
  }
  absenSore: {
    sudah: number
    belum: number
    percentage: number
  }
}
