import React, { useState, useMemo } from 'react';
import { Search, Filter, MoreHorizontal, Download, Plus, X, ChevronDown } from 'lucide-react';
import { FixedSizeList as List } from 'react-window';
import { useAppContext } from '../context/AppContext';
import { downloadTrackedAlumniXlsx } from '../utils/exportTrackedAlumni';

export default function Alumni({ onNavigateToProfile }: { onNavigateToProfile: (id: string) => void }) {
  const { alumni, addAlumni, csvLoading, csvError, csvLoaded } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAlumni, setNewAlumni] = useState({ name: '', prodi: '', year: '' });
  const shouldHideTrackedFields = (item: any) => item.status === 'Belum Ditemukan' || item.status === 'Belum Dilacak';

  const filterOptions = ['Semua', 'Teridentifikasi', 'Perlu Verifikasi', 'Belum Ditemukan', 'Belum Dilacak'];
  const tableColumns = [
    { key: 'name', label: 'Nama Lengkap', render: (item: any) => <span className="font-medium">{item.name || '-'}</span> },
    { key: 'prodi', label: 'Program Studi', render: (item: any) => item.prodi || '-' },
    { key: 'year', label: 'Tahun Lulus', render: (item: any) => item.tanggalLulus || item.year || '-' },
    { key: 'nim', label: 'NIM', render: (item: any) => item.nim || '-' },
    { key: 'email', label: 'Email', render: (item: any) => shouldHideTrackedFields(item) ? '-' : (item.email || '-') },
    { key: 'phone', label: 'No HP', render: (item: any) => shouldHideTrackedFields(item) ? '-' : (item.phone || '-') },
    { key: 'company', label: 'Tempat Kerja', render: (item: any) => shouldHideTrackedFields(item) ? '-' : (item.company || '-') },
    { key: 'companyAddress', label: 'Alamat Kerja', render: (item: any) => shouldHideTrackedFields(item) ? '-' : (item.companyAddress || '-') },
    { key: 'position', label: 'Posisi', render: (item: any) => shouldHideTrackedFields(item) ? '-' : (item.position || '-') },
    { key: 'jobType', label: 'Jenis Pekerjaan', render: (item: any) => shouldHideTrackedFields(item) ? '-' : (item.jobType || '-') },
    { key: 'companySocial', label: 'Sosial Media Tempat Kerja', render: (item: any) => shouldHideTrackedFields(item) ? '-' : (item.companySocial || '-') },
    { key: 'linkedin', label: 'LinkedIn', render: (item: any) => shouldHideTrackedFields(item) ? '-' : (item.linkedin || '-') },
    { key: 'instagram', label: 'Instagram', render: (item: any) => shouldHideTrackedFields(item) ? '-' : (item.instagram || '-') },
    { key: 'facebook', label: 'Facebook', render: (item: any) => shouldHideTrackedFields(item) ? '-' : (item.facebook || '-') },
    { key: 'tiktok', label: 'Tiktok', render: (item: any) => shouldHideTrackedFields(item) ? '-' : (item.tiktok || '-') }
  ];
  const tableGridColumns = '220px 220px 140px 150px 240px 160px 220px 260px 180px 180px 260px 240px 200px 200px 200px 72px';

  // If CSV was loaded, render all rows directly (no filtering/pagination) per requirement.
  const filteredAlumni = useMemo(() => {
    if (csvLoaded) return alumni;

    return alumni.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            a.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            a.prodi.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'Semua' || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [alumni, searchQuery, statusFilter, csvLoaded]);

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addAlumni({ ...newAlumni, status: 'Belum Dilacak', source: '-' });
    setIsModalOpen(false);
    setNewAlumni({ name: '', prodi: '', year: '' });
  };

  const handleExport = () => {
    downloadTrackedAlumniXlsx(filteredAlumni, 'hasil_pelacakan_alumni.xlsx');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Data Alumni</h2>
          <p className="text-sm text-[#666666] mt-1">Kelola profil target pencarian dan status pelacakan.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[#EAEAEA] bg-white rounded-md hover:bg-[#F5F5F5] transition-colors">
            <Download className="w-4 h-4" />
            Export XLSX
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-[#333333] transition-colors">
            <Plus className="w-4 h-4" />
            Tambah Data
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#EAEAEA] rounded-xl shadow-sm overflow-hidden">
        {/* Loading / Error banner for CSV */}
        {csvLoading && (
          <div className="p-3 border-b border-[#EAEAEA] text-sm text-[#444444]">Memuat data alumni dari CSV…</div>
        )}
        {csvError && (
          <div className="p-3 border-b border-[#EAEAEA] text-sm text-red-600">Gagal memuat CSV: {csvError}</div>
        )}
        <div className="p-4 border-b border-[#EAEAEA] flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, ID, atau prodi..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
            />
          </div>
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-[#EAEAEA] bg-white rounded-md hover:bg-[#F5F5F5] transition-colors text-[#666666]"
            >
              <Filter className="w-4 h-4" />
              <span className="flex items-center gap-1">
                {statusFilter === 'Semua' ? 'Semua Status' : statusFilter}
                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>
            
            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#EAEAEA] rounded-xl shadow-lg z-20 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {filterOptions.map(opt => (
                    <button
                      key={opt}
                      onClick={() => { setStatusFilter(opt); setIsFilterOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${statusFilter === opt ? 'bg-[#F5F5F5] font-medium text-black' : 'text-[#666666] hover:bg-[#FAFAFA] hover:text-black'}`}
                    >
                      {opt === 'Semua' ? 'Semua Status' : opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          {/* If csvLoaded, use virtualized list to avoid rendering thousands of DOM nodes */}
          {csvLoaded ? (
            <div className="overflow-x-auto">
              <div className="text-xs text-[#666666] uppercase bg-[#FAFAFA] border-b border-[#EAEAEA]">
                <div className="grid gap-0 items-center min-w-max" style={{ gridTemplateColumns: tableGridColumns }}>
                  {tableColumns.map((column) => (
                    <div key={column.key} className="px-6 py-3 font-medium">
                      {column.label}
                    </div>
                  ))}
                  <div className="px-6 py-3 font-medium text-right">Aksi</div>
                </div>
              </div>
              <List
                height={600}
                itemCount={filteredAlumni.length}
                itemSize={64}
                width={3600}
              >
                {({ index, style }) => {
                  const alumni = filteredAlumni[index];
                  return (
                    <div style={style} key={alumni.id} className="hover:bg-[#FAFAFA] transition-colors border-b border-[#EAEAEA]">
                      <div className="grid items-center min-w-max" style={{ gridTemplateColumns: tableGridColumns }}>
                        {tableColumns.map((column) => (
                          <div key={column.key} className="px-6 py-4 text-[#666666] truncate" title={String(column.render(alumni) ?? '')}>
                            {column.render(alumni)}
                          </div>
                        ))}
                        <div className="px-6 py-4 text-right">
                          <button 
                            onClick={() => onNavigateToProfile(alumni.id)}
                            className="text-[#888888] hover:text-black transition-colors"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }}
              </List>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[#666666] uppercase bg-[#FAFAFA] border-b border-[#EAEAEA]">
                  <tr>
                    {tableColumns.map((column) => (
                      <th key={column.key} className="px-6 py-3 font-medium whitespace-nowrap">
                        {column.label}
                      </th>
                    ))}
                    <th className="px-6 py-3 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAEA]">
                  {filteredAlumni.length > 0 ? (
                    filteredAlumni.map((alumni) => (
                      <tr key={alumni.id} className="hover:bg-[#FAFAFA] transition-colors">
                        {tableColumns.map((column) => (
                          <td key={column.key} className="px-6 py-4 text-[#666666] whitespace-nowrap">
                            {column.render(alumni)}
                          </td>
                        ))}
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => onNavigateToProfile(alumni.id)}
                            className="text-[#888888] hover:text-black transition-colors"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={tableColumns.length + 1} className="px-6 py-8 text-center text-[#666666]">
                        Tidak ada data yang ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-[#EAEAEA] flex items-center justify-between text-sm text-[#666666]">
          <p>Menampilkan {filteredAlumni.length} entri</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-[#EAEAEA] rounded-md hover:bg-[#F5F5F5] disabled:opacity-50">Sebelumnya</button>
            <button className="px-3 py-1 border border-[#EAEAEA] rounded-md hover:bg-[#F5F5F5] disabled:opacity-50">Selanjutnya</button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-[#EAEAEA]">
            <div className="flex items-center justify-between p-4 border-b border-[#EAEAEA]">
              <h3 className="font-semibold">Tambah Data Alumni</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#888888] hover:text-black transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1">Nama Lengkap</label>
                <input required type="text" value={newAlumni.name} onChange={e => setNewAlumni({...newAlumni, name: e.target.value})} className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1">Program Studi</label>
                <input required type="text" value={newAlumni.prodi} onChange={e => setNewAlumni({...newAlumni, prodi: e.target.value})} className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#666666] mb-1">Tahun Lulus</label>
                <input required type="number" value={newAlumni.year} onChange={e => setNewAlumni({...newAlumni, year: e.target.value})} className="w-full px-3 py-2 text-sm border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium border border-[#EAEAEA] rounded-md hover:bg-[#F5F5F5] transition-colors">Batal</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-[#333333] transition-colors">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
