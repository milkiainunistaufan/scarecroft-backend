'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase.js'; // 1. Import konfigurasi Supabase Client Anda

export default function InboxDashboard() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(() => {
  const fetchMessages = async () => {
    try {
      // Memanggil API internal Next.js yang sudah di-bypass di sisi server
      const response = await fetch('/api/messages');
      const data = await response.json();
      
      if (response.ok) {
        setMessages(data);
      } else {
        setError(data.error || 'Gagal mengambil data pesan.');
      }
    } catch (err) {
      setError('Gagal terhubung ke server API.');
    } finally {
      setLoading(false);
    }
  };

  fetchMessages();
}, []);

  return (
    <main className="text-white">
      <div className="max-w-5xl mx-auto">
        {/* Navigasi Panel Admin */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-indigo-400">ScareCroft Admin — Pesan Masuk</h1>
            <p className="text-gray-400 text-sm mt-1">Daftar leads dan konsultasi dari landing page.</p>
          </div>
        </div>

        {/* Status Loading / Error */}
        {loading && <p className="text-gray-400">Memuat pesan masuk...</p>}
        {error && <div className="p-4 bg-red-950 border border-red-800 text-red-200 rounded">{error}</div>}

        {/* Tabel Konten Pesan */}
        {!loading && !error && (
          <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
            {messages.length === 0 ? (
              <p className="p-6 text-center text-gray-500">Belum ada pesan masuk dari klien.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-700 text-gray-300 text-sm uppercase tracking-wider">
                      <th className="p-4 font-semibold">Tanggal</th>
                      <th className="p-4 font-semibold">Nama Klien</th>
                      <th className="p-4 font-semibold">Kontak</th>
                      <th className="p-4 font-semibold">Isi Pesan / Kebutuhan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 text-sm">
                    {messages.map((msg) => (
                      <tr key={msg.id} className="hover:bg-gray-750 transition">
                        <td className="p-4 text-gray-450 whitespace-nowrap">
                          {new Date(msg.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="p-4 font-medium text-white">{msg.name}</td>
                        <td className="p-4 space-y-1">
                          <div className="text-gray-300">{msg.email}</div>
                          <div className="text-indigo-400 hover:underline">
                            {msg.whatsapp ? (
                              <a href={`https://wa.me/${msg.whatsapp.replace(/\D/g, '').replace(/^0+/, '62')}`} target="_blank" rel="noopener noreferrer">
                                💬 {msg.whatsapp}
                              </a>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-gray-300 max-w-xs md:max-w-md wrap-break-word">{msg.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}