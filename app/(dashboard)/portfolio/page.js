import { supabase } from '@/lib/supabase.js';
import Link from 'next/link';
import PortfolioTableBody from './PortfolioTableBody';

// Fungsi untuk mengambil data portofolio dengan limit dan range pagination
async function getPortfolios(page = 1) {
  const limit = 5;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // 1. Ambil data dengan range tertentu dan hitung total baris (count)
  const { data, error, count } = await supabase
    .from('portfolios')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Gagal mengambil data portofolio:', error.message);
    return { data: [], totalPages: 0 };
  }

  const totalPages = Math.ceil((count || 0) / limit);

  return {
    data: data || [],
    totalPages,
    currentPage: page
  };
}

export default async function PortfolioManagementPage({ searchParams }) {
  // Membaca query string ?page= dari URL, default ke halaman 1
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams?.page) || 1;
  
  const { data: portfolios, totalPages } = await getPortfolios(currentPage);

  return (
    <main className="text-white">
      {/* Header Halaman */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-indigo-400">Kelola Portofolio</h1>
          <p className="text-gray-400 text-sm mt-1">Daftar semua proyek portofolio ScareCroft Indonesia.</p>
        </div>
        <Link 
          href="/portfolio/add" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-center font-medium px-4 py-2 rounded-lg text-sm transition shadow-md"
        >
          ➕ Tambah Portofolio
        </Link>
      </div>

      {/* Tabel Data */}
      <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden mb-6">
        {portfolios.length === 0 ? (
          <p className="p-8 text-center text-gray-500">Belum ada portofolio yang diunggah.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-700 text-gray-300 text-xs uppercase tracking-wider border-b border-gray-600">
                  <th className="p-4 font-semibold w-24">Screenshot</th>
                  <th className="p-4 font-semibold">Nama Proyek / Klien</th>
                  <th className="p-4 font-semibold">Tech Stack</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <PortfolioTableBody initialPortfolios={portfolios} />
            </table>
          </div>
        )}
      </div>

      {/* 🧩 KOMPONEN NAVIGASI PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4 pb-8">
          {/* Tombol Previous */}
          <Link
            href={`/portfolio?page=${currentPage - 1}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 transition ${
              currentPage <= 1 
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed pointer-events-none' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            ◀ Previous
          </Link>

          {/* Nomor Halaman */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Link
              key={pageNum}
              href={`/portfolio?page=${pageNum}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                pageNum === currentPage
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {pageNum}
            </Link>
          ))}

          {/* Tombol Next */}
          <Link
            href={`/portfolio?page=${currentPage + 1}`}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-700 transition ${
              currentPage >= totalPages 
                ? 'bg-gray-800 text-gray-600 cursor-not-allowed pointer-events-none' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Next ▶
          </Link>
        </div>
      )}
    </main>
  );
}