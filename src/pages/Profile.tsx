import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, User, Briefcase, MapPin, GraduationCap } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Profile({ alumniId, goBack }: { alumniId: string, goBack: () => void }) {
  const { alumni, updateAlumni } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    prodi: '',
    status: '',
    source: '',
    nim: '',
    tahunMasuk: '',
    tanggalLulus: '',
    fakultas: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    email: '',
    phone: '',
    company: '',
    companyAddress: '',
    position: '',
    jobType: '',
    companySocial: ''
  });

  useEffect(() => {
    const data = alumni.find(a => a.id === alumniId);
    if (data) {
  setFormData({
        name: data.name,
        prodi: data.prodi,
        status: data.status,
        source: data.source,
        nim: data.nim || '',
        tahunMasuk: data.tahunMasuk || '',
        tanggalLulus: data.tanggalLulus || '',
        fakultas: (data as any).fakultas || '',
        linkedin: data.linkedin || '',
        instagram: data.instagram || '',
        facebook: data.facebook || '',
        tiktok: data.tiktok || '',
        email: data.email || '',
        phone: data.phone || '',
        company: data.company || '',
        companyAddress: data.companyAddress || '',
        position: data.position || '',
        jobType: data.jobType || '',
        companySocial: data.companySocial || ''
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
                <User className="w-3.5 h-3.5" /> NIM
              </label>
              <input
                type="text"
                value={formData.nim}
                onChange={e => setFormData({...formData, nim: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Tahun Masuk
              </label>
              <input
                type="text"
                value={formData.tahunMasuk}
                onChange={e => setFormData({...formData, tahunMasuk: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1 flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5" /> Tanggal Lulus
              </label>
              <input
                type="text"
                value={formData.tanggalLulus}
                onChange={e => setFormData({...formData, tanggalLulus: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" /> Fakultas
              </label>
              <input
                type="text"
                value={formData.fakultas}
                onChange={e => setFormData({...formData, fakultas: e.target.value})}
                className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
              />
            </div>
            {/* Tahun Lulus removed per user request; keep Tanggal Lulus intact */}
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
          </div>
        </div>

        <div className="p-8 border-t border-[#EAEAEA]">
          <h4 className="text-sm font-semibold mb-4">Informasi Tambahan</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">LinkedIn</label>
              <input type="text" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">Instagram</label>
              <input type="text" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">Facebook</label>
              <input type="text" value={formData.facebook} onChange={e => setFormData({...formData, facebook: e.target.value})} className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">Tiktok</label>
              <input type="text" value={formData.tiktok} onChange={e => setFormData({...formData, tiktok: e.target.value})} className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">No HP</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">Tempat Kerja</label>
              <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">Alamat Kerja</label>
              <input type="text" value={formData.companyAddress} onChange={e => setFormData({...formData, companyAddress: e.target.value})} className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">Posisi</label>
              <input type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#666666] mb-1">Jenis Pekerjaan</label>
              <input type="text" value={formData.jobType} onChange={e => setFormData({...formData, jobType: e.target.value})} className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-[#666666] mb-1">Sosial Media Tempat Kerja</label>
              <input type="text" value={formData.companySocial} onChange={e => setFormData({...formData, companySocial: e.target.value})} className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md" />
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
