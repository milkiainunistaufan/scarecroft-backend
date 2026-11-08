'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase.js';

export default function PortfolioTableBody({ initialPortfolios }) {
  const [portfolios, setPortfolios] = useState(initialPortfolios);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();

  const handleDelete = async (id, imageUrl) => {
    const confirmDelete = confirm('Apakah Anda yakin ingin menghapus portofolio ini secara permanen?');
    if (!confirmDelete) return;

    setDeletingId(id);

    try {
      // 1. Hapus gambar dari Storage Supabase terlebih dahulu jika ada
      if (imageUrl) {
        // Ekstrak nama file unik dari URL publik Supabase
        // Contoh URL: .../storage/v1/object/public/portfolio-images/171829-nama.png
        const fileName = imageUrl.split('/').pop();
        
        const { error: storageError } = await supabase
          .storage
          .from('portfolio-images')
          .remove([fileName]);

        if (storageError) {
          console.error('Gagal menghapus gambar dari storage:', storageError.message);
        }
      }

      // 2. Hapus baris data dari Tabel Database Portfolios
      const { error: dbError } = await supabase
        .from('portfolios')
        .delete()
        .eq('id', id);

      if (dbError) {
        alert(`❌ Gagal menghapus data: ${dbError.message}`);
      } else {
        // Update state lokal agar baris langsung hilang dari layar tanpa full refresh
        setPortfolios(portfolios.filter(p => p.id !== id));
        // Refresh router server agar data sync
        router.refresh();
      }
    } catch (err) {
      alert('❌ Terjadi kesalahan saat menghapus data.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <tbody className="divide-y divide-gray-700 text-sm">
      {portfolios.map((project) => (
        <tr key={project.id} className="hover:bg-gray-750 transition">
          {/* Kolom Thumbnail Gambar */}
          <td className="p-4">
            <div className="w-16 h-12 bg-gray-900 rounded overflow-hidden border border-gray-700 flex items-center justify-center">
              {project.image_url ? (
                <img 
                  src={project.image_url} 
                  alt={project.title} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="text-[10px] text-gray-500">No Image</span>
              )}
            </div>
          </td>

          {/* Kolom Judul & Deskripsi */}
          <td className="p-4 max-w-xs md:max-w-sm">
            <div className="font-semibold text-white truncate">{project.title}</div>
            <div className="text-gray-400 text-xs truncate mt-0.5">{project.description}</div>
          </td>

          {/* Kolom Tech Stack / Tags */}
          <td className="p-4">
            <div className="flex flex-wrap gap-1 max-w-xs">
              {project.tag?.map((t, idx) => (
                <span key={idx} className="text-[11px] bg-gray-700 text-indigo-300 px-2 py-0.5 rounded border border-gray-600">
                  {t}
                </span>
              ))}
            </div>
          </td>

          {/* Kolom Status Badge */}
          <td className="p-4 whitespace-nowrap">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
              project.status === 'Live' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              {project.status}
            </span>
          </td>

          {/* Kolom Tombol Aksi (Delete) */}
          <td className="p-4 text-right whitespace-nowrap">
            <button
              onClick={() => handleDelete(project.id, project.image_url)}
              disabled={deletingId === project.id}
              className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 px-3 py-1.5 rounded-lg text-xs font-medium transition duration-200 disabled:opacity-50"
            >
              {deletingId === project.id ? 'Menghapus...' : '🗑️ Hapus'}
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
}