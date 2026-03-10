import { Users, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getRelativeTime } from '../utils/time';

export default function Dashboard() {
  const { alumni, activities } = useAppContext();

  const totalAlumni = alumni.length;
  const identified = alumni.filter(a => a.status === 'Teridentifikasi').length;
  const needVerification = alumni.filter(a => a.status === 'Perlu Verifikasi').length;
  const notFound = alumni.filter(a => a.status === 'Belum Ditemukan').length;

  const stats = [
    { label: 'Total Alumni', value: totalAlumni, icon: Users, color: 'text-black' },
    { label: 'Teridentifikasi', value: identified, icon: CheckCircle2, color: 'text-emerald-600' },
    { label: 'Perlu Verifikasi', value: needVerification, icon: AlertCircle, color: 'text-amber-600' },
    { label: 'Belum Ditemukan', value: notFound, icon: Search, color: 'text-gray-400' },
  ];

  // Calculate source percentages based on identified alumni
  const identifiedAlumni = alumni.filter(a => a.status === 'Teridentifikasi');
  const sourceCounts = identifiedAlumni.reduce((acc, curr) => {
    if (curr.source && curr.source !== '-') {
      acc[curr.source] = (acc[curr.source] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const sources = Object.entries(sourceCounts)
    .map(([name, count]) => ({
      name,
      count: count as number,
      percent: identifiedAlumni.length > 0 ? Math.round(((count as number) / identifiedAlumni.length) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Ringkasan Pelacakan</h2>
        <p className="text-sm text-[#666666] mt-1">Status pelacakan alumni dari berbagai sumber publik.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-white border border-[#EAEAEA] rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#666666]">{stat.label}</p>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-3xl font-semibold mt-4 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-white border border-[#EAEAEA] rounded-xl shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Aktivitas Pelacakan Terakhir</h3>
          <div className="space-y-4">
            {activities.length > 0 ? activities.slice(0, 5).map((act) => (
              <div key={act.id} className="flex items-center justify-between py-3 border-b border-[#F5F5F5] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F5F5F5] flex items-center justify-center text-xs font-medium">
                    {act.alumniName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {act.alumniName}
                    </p>
                    <p className="text-xs text-[#888888]">{act.prodi} • {act.year}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium bg-[#F5F5F5] text-[#444444]">
                    {act.type === 'ADD' ? 'Ditambahkan' : act.type === 'RESOLVE' ? 'Diverifikasi' : 'Diperbarui'}
                  </span>
                  <p className="text-xs text-[#888888] mt-1">{getRelativeTime(act.timestamp)}</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-[#666666] py-4">Belum ada aktivitas pelacakan.</p>
            )}
          </div>
        </div>

        <div className="p-6 bg-white border border-[#EAEAEA] rounded-xl shadow-sm">
          <h3 className="text-sm font-semibold mb-4">Sumber Data</h3>
          <div className="space-y-4">
            {sources.length > 0 ? sources.map((source) => (
              <div key={source.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{source.name}</span>
                  <span className="text-[#666666]">{source.count}</span>
                </div>
                <div className="w-full h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-black rounded-full" 
                    style={{ width: `${source.percent}%` }}
                  />
                </div>
              </div>
            )) : (
              <p className="text-sm text-[#666666] py-4">Belum ada data sumber yang teridentifikasi.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
