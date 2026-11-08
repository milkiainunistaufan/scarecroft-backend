import { getSupabaseServer } from '@/lib/supabaseServer'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    const supabase = await getSupabaseServer()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }

    return Response.json({ success: true, user: data.user })
  } catch (err) {
    return Response.json({ error: 'Terjadi kesalahan pada server' }, { status: 500 })
  }
}