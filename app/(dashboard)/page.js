import { supabase } from '@/lib/supabase.js';
import Link from 'next/link';

// Fungsi untuk mengambil statistik data dari Supabase
async function getDashboardStats() {
  // 1. Hitung total portofolio
  const { count: portfolioCount, error: portfolioError } = await supabase
    .from('portfolios')
    .select('*', { count: 'exact', head: true });

  // 2. Hitung total pesan masuk
  const { count: messageCount, error: messageError } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true });

  // 3. Ambil 3 pesan masuk terbaru untuk ringkasan cepat
  const { data: recentMessages } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  if (portfolioError || messageError) {
    console.error('Gagal memuat statistik dashboard');
  }

  return {
    portfolios: portfolioCount || 0,
    messages: messageCount || 0,
    recentMessages: recentMessages || []
  };
}

export default async function AdminDashboardHome() {
  const stats = await getDashboardStats();

  return (
    <main className="text-white">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Dashboard */}
        <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-indigo-400 tracking-tight">ScareCroft Admin Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Selamat datang kembali! Berikut ringkasan operasional website saat ini.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/portfolio/add" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm transition duration-200 shadow-md">
              ➕ Tambah Portofolio
            </Link>
          </div>
        </header>

        {/* Grid Kartu Statistik (Stats Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          
          {/* Card Total Portofolio */}
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Total Portofolio</p>
              <h3 className="text-4xl font-bold text-white mt-2">{stats.portfolios}</h3>
              <Link href="/portfolio" className="text-xs text-indigo-400 hover:underline inline-block mt-4">
                Lihat Semua Portofolio →
              </Link>
            </div>
            <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-3xl">
              📁
            </div>
          </div>

          {/* Card Total Pesan Masuk (Leads) */}
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-xl flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Pesan Masuk (Leads)</p>
              <h3 className="text-4xl font-bold text-white mt-2">{stats.messages}</h3>
              <Link href="/inbox" className="text-xs text-indigo-400 hover:underline inline-block mt-4">
                Buka Kotak Masuk →
              </Link>
            </div>
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-3xl">
              💬
            </div>
          </div>

        </div>

        {/* Bagian Bawah: Pintasan & Aktivitas Terbaru */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* List Pesan Terbaru (2/3 width di desktop) */}
          <div className="lg:col-span-2 bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-200">Pesan Masuk Terbaru</h2>
              <Link href="/inbox" className="text-xs text-indigo-400 hover:underline">Lihat Semua</Link>
            </div>

            {stats.recentMessages.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">Belum ada pesan dari klien.</p>
            ) : (
              <div className="divide-y divide-gray-700">
                {stats.recentMessages.map((msg) => (
                  <div key={msg.id} className="py-3.5 first:pt-0 last:pb-0 flex justify-between items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-100 truncate">{msg.name}</p>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{msg.message}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links Menu (1/3 width di desktop) */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-200 mb-4">Akses Cepat Panel</h2>
              <nav className="space-y-2">
                <Link href="/portfolio/add" className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-sm font-medium transition text-gray-300 hover:text-white border border-gray-700">
                  <span>✨</span> Form Tambah Proyek
                </Link>
                <Link href="/inbox" className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-sm font-medium transition text-gray-300 hover:text-white border border-gray-700">
                  <span>📥</span> Kelola Pesan Masuk
                </Link>
              </nav>
            </div>
            
            <div className="text-center pt-6 text-xs text-gray-500 border-t border-gray-700 mt-6 lg:mt-0">
              ScareCroft Backend v1.0 • Powered by Supabase
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}