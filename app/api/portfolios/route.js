import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Inisialisasi Supabase khusus di server menggunakan SERVICE ROLE KEY
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // Pastikan ini sudah ada di .env.local Anda
    );

    const { data, error } = await supabaseAdmin
      .from('portfolios')
      .insert([body]);

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, data });
  } catch (err) {
    return Response.json({ error: 'Server Error' }, { status: 500 });
  }
}
