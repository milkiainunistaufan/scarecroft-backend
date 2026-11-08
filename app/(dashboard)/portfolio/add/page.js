'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase.js'; // Memanggil konfigurasi client Supabase

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tag: '',
    project_url: '',
    status: 'Live',
  });
  const [imageFile, setImageFile] = useState(null); // State baru untuk menyimpan file mentah gambar
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]); // Menangkap file pertama yang dipilih
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formattedTags = formData.tag.split(',').map((tag) => tag.trim());

    try {
      let uploadedImageUrl = '';

      // 1. Proses Unggah Gambar ke Supabase Storage jika ada file yang dipilih
      if (imageFile) {
        // Membuat nama file unik agar tidak bentrok (contoh: 17182938129-nama-gambar.png)
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        
        const { data: storageData, error: storageError } = await supabase
          .storage
          .from('portfolio-images') // Sesuaikan dengan nama bucket yang Anda buat
          .upload(fileName, imageFile);

        if (storageError) {
          throw new Error(`Gagal upload gambar: ${storageError.message}`);
        }

        // 2. Dapatkan Public URL dari gambar yang sukses diunggah
        const { data: publicUrlData } = supabase
          .storage
          .from('portfolio-images')
          .getPublicUrl(fileName);

        uploadedImageUrl = publicUrlData.publicUrl;
      }

      // 3. Kirim data lengkap ke API internal Next.js
      const response = await fetch('/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          tag: formattedTags,
          image_url: uploadedImageUrl, // Menggunakan URL publik dari Supabase Storage
          project_url: formData.project_url,
          status: formData.status,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('✅ Portofolio & Gambar berhasil disimpan ke Supabase!');
        setFormData({ title: '', description: '', tag: '', project_url: '', status: 'Live' });
        setImageFile(null);
        // Reset file input secara manual di DOM
        e.target.reset();
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (err) {
      setMessage(`❌ Terjadi kesalahan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6 text-indigo-400">ScareCroft Admin — Tambah Portofolio</h1>
      <div className="max-w-full bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        
        {message && <div className="mb-4 p-3 rounded bg-gray-700 text-sm">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">Nama Proyek / Klien</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className="w-full p-2.5 rounded bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none" placeholder="Contoh: PT RMW DIPTA NUSANTARA" />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Deskripsi Proyek</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows="3" className="w-full p-2.5 rounded bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none" placeholder="Jelaskan singkat tentang sistem yang dibuat..."></textarea>
              </div>
              <div>
                <label htmlFor="tag" className="block text-sm font-medium mb-1">Tech Stack (Pisahkan dengan koma)</label>
                <input type="text" id="tag" name="tag" value={formData.tag} onChange={handleChange} required className="w-full p-2.5 rounded bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none" placeholder="Contoh: Tailwind CSS, Laravel, PostgreSQL" />
              </div>
            </div>

            <div>
              {/* Mengubah ke input File */}
              <div>
                <label htmlFor="screenshot" className="block text-sm font-medium mb-1">Gambar Screenshot Proyek</label>
                <input type="file" id="screenshot" accept="image/*" onChange={handleFileChange} required className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 text-gray-400" />
              </div>

              <div>
                <label htmlFor="project_url" className="block text-sm font-medium mb-1">URL Live Website (Opsional)</label>
                <input type="text" id="project_url" name="project_url" value={formData.project_url} onChange={handleChange} className="w-full p-2.5 rounded bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none" placeholder="https://klien-website.com" />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">Status Proyek</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 rounded bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none text-white">
                  <option value="Live">Live</option>
                  <option value="Coming Soon">Coming Soon</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex">
            {/* Tombol Submit */}
            <button type="submit" disabled={loading} className="px-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-medium py-2.5 rounded transition duration-200 mt-2">
              {loading ? 'Menyimpan...' : 'Simpan Portofolio'}
            </button>
            <a href="/portfolio" className="ml-4 px-3 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 rounded transition duration-200 mt-2">
              Kembali
            </a>
          </div>

        </form>
      </div>
    </main>
  );
}