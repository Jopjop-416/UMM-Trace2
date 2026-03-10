import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, User, Briefcase, MapPin, GraduationCap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Profile({ alumniId, goBack }: { alumniId: string, goBack: () => void }) {
  const { alumni, updateAlumni } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    prodi: '',
    year: '',
    status: '',
    source: ''
  });

  useEffect(() => {
    const data = alumni.find(a => a.id === alumniId);
    if (data) {
      setFormData({
        name: data.name,
        prodi: data.prodi,
        year: data.year,
        status: data.status,
        source: data.source
      });
    }
  }, [alumniId, alumni]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateAlumni(alumniId, formData);
    goBack();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={goBack} className="p-2 hover:bg-[#F5F5F5] rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Profil Alumni</h2>
            <p className="text-sm text-[#666666] mt-1">Detail dan pengaturan data alumni.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#EAEAEA] rounded-xl shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[#EAEAEA] bg-[#FAFAFA] flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center text-white text-2xl font-semibold">
            {formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight">{formData.name}</h3>
            <p className="text-sm text-[#666666] flex items-center gap-2 mt-1">
              <span className="font-mono text-xs bg-[#EAEAEA] px-2 py-0.5 rounded">{alumniId}</span>
            </p>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1 flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Nama Lengkap
              </label>
              <input 
                required 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1 flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5" /> Program Studi
              </label>
              <input 
                required 
                type="text" 
                value={formData.prodi} 
                onChange={e => setFormData({...formData, prodi: e.target.value})} 
                className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Tahun Lulus
              </label>
              <input 
                required 
                type="number" 
                value={formData.year} 
                onChange={e => setFormData({...formData, year: e.target.value})} 
                className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" /> Sumber Utama
              </label>
              <input 
                type="text" 
                value={formData.source} 
                onChange={e => setFormData({...formData, source: e.target.value})} 
                className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-[#666666] mb-1">Status Pelacakan</label>
              <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all bg-white"
              >
                <option value="Teridentifikasi">Teridentifikasi</option>
                <option value="Perlu Verifikasi">Perlu Verifikasi</option>
                <option value="Belum Ditemukan">Belum Ditemukan</option>
                <option value="Belum Dilacak">Belum Dilacak</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#EAEAEA] bg-[#FAFAFA] flex justify-end gap-3">
          <button type="button" onClick={goBack} className="px-4 py-2 text-sm font-medium border border-[#EAEAEA] bg-white rounded-md hover:bg-[#F5F5F5] transition-colors">
            Batal
          </button>
          <button type="submit" className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-[#333333] transition-colors">
            <Save className="w-4 h-4" />
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
}
