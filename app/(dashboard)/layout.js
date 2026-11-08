'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase.js';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  // Fungsi Logout
  const handleLogout = async () => {
    try {
      // Panggil route API internal untuk menghapus seluruh sisa cookie
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Hapus cache routing Next.js agar status benar-benar bersih kembali ke tamu (guest)
        router.push('/login');
        router.refresh();
      } else {
        console.error('Gagal membersihkan sesi cookie.');
      }
    } catch (err) {
      console.error('Terjadi kesalahan koneksi logout:', err);
    }
  };

  // Daftar Menu Navigasi Sidebar
  const menuItems = [
    { name: 'Overview', href: '/', icon: '📊' },
    { name: 'Portfolio', href: '/portfolio', icon: '📁' },
    { name: 'Pesan Masuk', href: '/inbox', icon: '📥' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      
      {/* 3. TOMBOL BURGER (Hanya muncul di HP / layar di bawah md) */}
      <div className="md:hidden bg-gray-800 border-b border-gray-700 p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex gap-2 items-center">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-indigo-400">ScareCroft</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-400 hover:text-white focus:outline-none"
        >
          {/* Icon garis 3 (Burger) atau X (Close) */}
          {isOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* 4. OVERLAY HITAM (Menutup konten saat menu kebuka di HP) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 5. SIDEBAR RESPONSIF */}
      <aside className={`w-48 bg-gray-800 border-r border-gray-700 flex flex-col justify-between fixed h-full z-10 transition-transform duration-300 md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Logo / Branding */}
          <div className="px-2 py-4 flex gap-4 border-b border-gray-700">
            <img src="/logo.png" alt="Logo" className="w-12 h-12" />
            <div className="">
              <h2 className="font-bold text-indigo-400 tracking-wider">ScareCroft</h2>
              <p className="text-gray-400">Indonesia</p>
            </div>
          </div>

          {/* Menu Link Navigasi */}
          <nav className="pl-4 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = item.href === '/' 
                    ? pathname === '/' 
                    : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  onClick={() => setIsOpen(false)} // Otomatis tutup sidebar di HP setelah klik menu
                  href={item.href}
                  className={`flex items-center gap-1 pl-2 py-1 rounded-l-md text-sm transition duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-100'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bagian Bawah Sidebar (Tombol Logout) */}
        <div className="px-4">
          <p className="text-xs text-gray-400 mb-2">Admin Panel v1.0</p>
          <div className="p-4 border-t border-gray-700 mb-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition duration-200"
            >
              <span>🚪</span>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* 6. AREA KONTEN UTAMA (Menyesuaikan padding kiri di desktop) */}
      <div className="flex-1 md:pl-48">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </div>

    </div>
  );
}