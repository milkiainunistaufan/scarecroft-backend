import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Inisialisasi Supabase menggunakan Service Role Key agar otomatis BYPASS RLS
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Ambil data langsung dari tabel 'messages'
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: 'Server Error: Gagal mengambil data pesan.' }, { status: 500 });
  }
}