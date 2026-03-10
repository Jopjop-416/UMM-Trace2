import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Key } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Pengaturan</h2>
        <p className="text-sm text-[#666666] mt-1">Kelola preferensi akun dan konfigurasi sistem.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <nav className="flex flex-col space-y-1">
            <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-[#F5F5F5] text-black rounded-md transition-colors">
              <SettingsIcon className="w-4 h-4" />
              Umum
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#666666] hover:bg-[#FAFAFA] hover:text-black rounded-md transition-colors">
              <Bell className="w-4 h-4" />
              Notifikasi
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#666666] hover:bg-[#FAFAFA] hover:text-black rounded-md transition-colors">
              <Shield className="w-4 h-4" />
              Keamanan
            </button>
            <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#666666] hover:bg-[#FAFAFA] hover:text-black rounded-md transition-colors">
              <Key className="w-4 h-4" />
              API Keys
            </button>
          </nav>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="p-6 bg-white border border-[#EAEAEA] rounded-xl shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-medium">Profil Admin</h3>
              <p className="text-sm text-[#666666] mt-1">Informasi dasar akun Anda.</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Nama Tampilan</label>
                <input 
                  type="text" 
                  defaultValue="Admin Dashboard" 
                  className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">Email</label>
                <input 
                  type="email" 
                  defaultValue="admin@gmail.com" 
                  disabled
                  className="w-full px-3 py-2 text-sm border border-[#EAEAEA] bg-[#F5F5F5] text-[#666666] rounded-md cursor-not-allowed"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAEAEA] flex justify-end">
              <button className="px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-[#333333] transition-colors">
                Simpan Perubahan
              </button>
            </div>
          </div>

          <div className="p-6 bg-white border border-[#EAEAEA] rounded-xl shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-medium">Preferensi Sistem</h3>
              <p className="text-sm text-[#666666] mt-1">Atur bagaimana sistem pelacakan bekerja.</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-black">Pelacakan Otomatis</p>
                  <p className="text-xs text-[#666666]">Jalankan scheduler secara berkala</p>
                </div>
                <div className="w-10 h-5 bg-black rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-black">Notifikasi Email</p>
                  <p className="text-xs text-[#666666]">Kirim laporan harian ke email admin</p>
                </div>
                <div className="w-10 h-5 bg-[#EAEAEA] rounded-full relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
