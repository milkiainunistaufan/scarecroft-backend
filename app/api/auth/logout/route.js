import { getSupabaseServer } from '@/lib/supabaseServer'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const supabase = await getSupabaseServer()
    const cookieStore = await cookies()

    // 1. Sign out dari session server Supabase
    await supabase.auth.signOut()

    // 2. Cari dan hapus semua cookie token bawaan Supabase secara paksa
    const allCookies = cookieStore.getAll()
    allCookies.forEach((cookie) => {
      if (cookie.name.includes('supabase') || cookie.name.includes('sb-')) {
        cookieStore.delete(cookie.name)
      }
    })

    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: 'Gagal memproses logout server' }, { status: 500 })
  }
}