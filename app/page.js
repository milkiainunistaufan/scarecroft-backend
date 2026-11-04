'use client';
import { useState } from 'react';

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tag: '',
    image_url: '',
    project_url: '',
    status: 'Live',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Mengubah string tag koma menjadi array (ex: "Laravel, React" -> ["Laravel", "React"])
    const formattedTags = formData.tag.split(',').map((tag) => tag.trim());

    try {
      // GANTI URL INI DENGAN URL BACKEND API VERCEL ANDA
      const response = await fetch('https://scarecroft-restfulapi.vercel.app/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tag: formattedTags, // dikirim sebagai array sesuai kolom Supabase
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('✅ Portofolio berhasil ditambahkan!');
        setFormData({ title: '', description: '', tag: '', image_url: '', project_url: '', status: 'Live' });
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (err) {
      setMessage('❌ Gagal terhubung ke server API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-indigo-400">ScareCroft Admin — Tambah Portofolio</h1>
        
        {message && <div className="mb-4 p-3 rounded bg-gray-700 text-sm">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nama Proyek / Klien</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full p-2.5 rounded bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none" placeholder="Contoh: PT RMW DIPTA NUSANTARA" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Deskripsi Proyek</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="w-full p-2.5 rounded bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none" placeholder="Jelaskan singkat tentang sistem yang dibuat..."></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tech Stack (Pisahkan dengan koma)</label>
            <input type="text" name="tag" value={formData.tag} onChange={handleChange} required className="w-full p-2.5 rounded bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none" placeholder="Contoh: Tailwind CSS, Laravel, PostgreSQL" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL Gambar Screenshot</label>
            <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} className="w-full p-2.5 rounded bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none" placeholder="https://example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL Live Website (Opsional)</label>
            <input type="text" name="project_url" value={formData.project_url} onChange={handleChange} className="w-full p-2.5 rounded bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none" placeholder="https://klien-website.com" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status Proyek</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2.5 rounded bg-gray-700 border border-gray-600 focus:border-indigo-500 outline-none text-white">
              <option value="Live">Live</option>
              <option value="Coming Soon">Coming Soon</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white font-medium py-2.5 rounded transition duration-200 mt-2">
            {loading ? 'Menyimpan...' : 'Simpan Portofolio'}
          </button>
        </form>
      </div>
    </main>
  );
}
