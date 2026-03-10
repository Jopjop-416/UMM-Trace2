import { Play, Clock, CheckCircle, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Jobs() {
  const { jobs, runScheduler } = useAppContext();
  
  const isRunning = jobs.some(j => j.status === 'Proses');

  const handleRunManual = () => {
    if (isRunning) return;
    runScheduler();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Scheduler Pelacakan</h2>
          <p className="text-sm text-[#666666] mt-1">Atur jadwal dan pantau proses pelacakan otomatis.</p>
        </div>
        <button 
          onClick={handleRunManual}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-[#333333] transition-colors disabled:opacity-50"
        >
          {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Sedang Berjalan...' : 'Jalankan Manual'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-white border border-[#EAEAEA] rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isRunning ? 'bg-blue-50' : 'bg-emerald-50'}`}>
                <RefreshCw className={`w-5 h-5 ${isRunning ? 'text-blue-600 animate-spin' : 'text-emerald-600'}`} />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Status Scheduler</h3>
                <p className={`text-xs font-medium ${isRunning ? 'text-blue-600' : 'text-emerald-600'}`}>
                  {isRunning ? 'Proses pelacakan...' : 'Aktif berjalan'}
                </p>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-[#EAEAEA]">
              <div className="flex justify-between text-sm">
                <span className="text-[#666666]">Jadwal Berikutnya</span>
                <span className="font-medium">11 Mar, 08:00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#666666]">Frekuensi</span>
                <span className="font-medium">Harian</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#666666]">Target</span>
                <span className="font-medium">Belum Dilacak</span>
              </div>
            </div>
            <button className="w-full mt-6 px-4 py-2 text-sm font-medium border border-[#EAEAEA] bg-white rounded-md hover:bg-[#F5F5F5] transition-colors">
              Ubah Konfigurasi
            </button>
          </div>

          <div className="p-6 bg-white border border-[#EAEAEA] rounded-xl shadow-sm">
            <h3 className="text-sm font-semibold mb-4">Prioritas Sumber</h3>
            <div className="space-y-3">
              {[
                { name: 'Google Scholar', type: 'Akademik' },
                { name: 'LinkedIn', type: 'Profesional' },
                { name: 'ResearchGate', type: 'Akademik' },
                { name: 'Pencarian Web Umum', type: 'Verifikasi' },
              ].map((source, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border border-[#EAEAEA] rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#888888]">0{idx + 1}</span>
                    <span className="text-sm font-medium">{source.name}</span>
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-[#666666] bg-[#F5F5F5] px-2 py-1 rounded">
                    {source.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-[#EAEAEA] rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-[#EAEAEA]">
            <h3 className="text-sm font-semibold">Riwayat Pelacakan</h3>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[#666666] uppercase bg-[#FAFAFA] border-b border-[#EAEAEA]">
                <tr>
                  <th className="px-6 py-3 font-medium">ID Job</th>
                  <th className="px-6 py-3 font-medium">Waktu Mulai</th>
                  <th className="px-6 py-3 font-medium">Target</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Hasil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-[#666666]">{job.id}</td>
                    <td className="px-6 py-4 font-medium flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#888888]" />
                      {job.date}
                    </td>
                    <td className="px-6 py-4 text-[#666666]">{job.target}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider
                        ${job.status === 'Selesai' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 
                          job.status === 'Proses' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-red-50 text-red-700 border border-red-200'}`}>
                        {job.status === 'Selesai' ? <CheckCircle className="w-3 h-3" /> : 
                         job.status === 'Proses' ? <Loader2 className="w-3 h-3 animate-spin" /> : 
                         <AlertCircle className="w-3 h-3" />}
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">
                      {job.status === 'Proses' ? '-' : (
                        <>{job.found} <span className="text-[#888888] font-normal">/ {job.total}</span></>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
