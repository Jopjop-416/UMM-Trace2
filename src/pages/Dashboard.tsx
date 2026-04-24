import { useMemo } from 'react';
import { Users, Search, AlertCircle, CheckCircle2, BarChart3, ShieldCheck, Database, MoreHorizontal } from 'lucide-react';
import { FixedSizeList as List } from 'react-window';
import { useAppContext } from '../context/AppContext';
import { getRelativeTime } from '../utils/time';

const isFilledValue = (value?: string | null) => {
  if (value === undefined || value === null) return false;
  const normalized = String(value).trim();
  return Boolean(normalized && normalized !== '-' && normalized.toLowerCase() !== 'null' && normalized.toLowerCase() !== 'undefined');
};

const getCoverageScore = (foundCount: number, totalCount: number) => {
  if (totalCount <= 0) return 0;
  const ratio = foundCount / totalCount;
  if (ratio <= 0.2) return 40;
  if (ratio <= 0.4) return 60;
  if (ratio <= 0.6) return 80;
  if (ratio <= 0.75) return 90;
  return 100;
};

const getAccuracyScore = (correctCount: number) => {
  if (correctCount <= 349) return 50;
  if (correctCount <= 425) return 75;
  if (correctCount <= 475) return 90;
  return 100;
};

const getCompletenessScore = (averageFilledFields: number) => {
  if (averageFilledFields < 2) return 50;
  if (averageFilledFields < 3) return 70;
  if (averageFilledFields < 4) return 85;
  return 100;
};

type DashboardProps = {
  onNavigateToProfile: (id: string) => void;
};

export default function Dashboard({ onNavigateToProfile }: DashboardProps) {
  const { alumni, activities, csvLoading } = useAppContext();
  const shouldHideTrackedFields = (item: any) => item.status === 'Belum Ditemukan' || item.status === 'Belum Dilacak';
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

  const identifiedAlumni = useMemo(
    () => alumni.filter(a => a.status === 'Teridentifikasi'),
    [alumni]
  );
  const trackedAlumni = useMemo(
    () => alumni.filter(a => a.status === 'Teridentifikasi' || a.status === 'Perlu Verifikasi'),
    [alumni]
  );
  const needVerification = alumni.filter(a => a.status === 'Perlu Verifikasi').length;
  const notFound = alumni.filter(a => a.status === 'Belum Ditemukan').length;

  const stats = [
    { label: 'Total Alumni', value: alumni.length, icon: Users, color: 'text-black' },
    { label: 'Data alumni teridentifikasi', value: identifiedAlumni.length, icon: CheckCircle2, color: 'text-emerald-600' },
    { label: 'Perlu Verifikasi', value: needVerification, icon: AlertCircle, color: 'text-amber-600' },
    { label: 'Belum Ditemukan', value: notFound, icon: Search, color: 'text-gray-400' },
  ];

  const trackedByProdi = useMemo(() => {
    const prodiCounts = identifiedAlumni.reduce((acc, curr) => {
      const prodiName = curr.prodi?.trim() || 'Jurusan Tidak Diketahui';
      acc[prodiName] = (acc[prodiName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(prodiCounts)
      .map(([name, count]) => ({
        name,
        count: count as number,
        percent: identifiedAlumni.length > 0 ? Math.round(((count as number) / identifiedAlumni.length) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count);
  }, [identifiedAlumni]);

  const trackedByYear = useMemo(() => {
    const yearCounts = trackedAlumni.reduce((acc, curr) => {
      const year = String(curr.year || '').match(/\b(19|20)\d{2}\b/)?.[0];
      if (!year) return acc;
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(yearCounts)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([year, count]) => ({ year, count }));
  }, [trackedAlumni]);

  const chartMax = trackedByYear.reduce((max, item) => Math.max(max, item.count), 0);

  const scoring = useMemo(() => {
    const foundAlumni = alumni.filter(item => item.status !== 'Belum Ditemukan');
    const foundCount = foundAlumni.length;
    const sampleSize = Math.min(500, foundAlumni.length);
    const sampled = foundAlumni.slice(0, sampleSize);
    const correctSample = sampled.filter(item => {
      const hasPublicLink = [
        item.linkedin,
        item.instagram,
        item.facebook,
        item.tiktok,
        item.companySocial
      ].some(value => isFilledValue(value));
      const coreFields = [
        item.company,
        item.companyAddress,
        item.position,
        item.jobType
      ].filter(value => isFilledValue(value)).length;
      return hasPublicLink && coreFields >= 4;
    }).length;

    const completenessFields = foundAlumni.map(item => (
      [
        isFilledValue(item.email),
        isFilledValue(item.phone),
        isFilledValue(item.company),
        isFilledValue(item.companyAddress)
      ].filter(Boolean).length
    ));
    const averageFilledFields = completenessFields.length > 0
      ? completenessFields.reduce((sum, value) => sum + value, 0) / completenessFields.length
      : 0;

    return {
      foundCount,
      sampleSize,
      correctSample,
      averageFilledFields,
      coverageScore: getCoverageScore(foundCount, alumni.length),
      accuracyScore: getAccuracyScore(correctSample),
      completenessScore: getCompletenessScore(averageFilledFields)
    };
  }, [alumni]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Ringkasan Pelacakan</h2>
        <p className="text-sm text-[#666666] mt-1">Status pelacakan alumni dari berbagai sumber publik.</p>
      </div>

      {csvLoading && (
        <div className="p-4 bg-white border border-[#EAEAEA] rounded-xl shadow-sm text-sm text-[#666666]">
          Data alumni sedang dimuat dan dipetakan otomatis agar seluruh data langsung terlacak saat website dibuka.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 bg-white border border-[#EAEAEA] rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#666666]">{stat.label}</p>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-3xl font-semibold mt-4 tracking-tight">{stat.value.toLocaleString('id-ID')}</p>
          </div>
        ))}
      </div>

      <div className="p-6 bg-white border border-[#EAEAEA] rounded-xl shadow-sm space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Grafik Jumlah Data Terlacak per Tahun Lulus
            </h3>
            <p className="text-xs text-[#666666] mt-1">Menampilkan jumlah alumni terlacak berdasarkan tahun kelulusan.</p>
          </div>
          <div className="text-xs text-[#666666]">
            Total terlacak: <span className="font-semibold text-black">{trackedAlumni.length.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="h-72 flex items-end gap-3 border-b border-l border-[#EAEAEA] px-4 pt-4">
              {trackedByYear.length > 0 ? trackedByYear.map((item) => (
                <div key={item.year} className="flex-1 min-w-[28px] flex flex-col items-center justify-end gap-2">
                  <div className="text-[10px] text-[#666666]">{item.count.toLocaleString('id-ID')}</div>
                  <div
                    className="w-full rounded-t-md bg-black/85 hover:bg-black transition-colors"
                    style={{ height: `${chartMax > 0 ? Math.max(10, (item.count / chartMax) * 220) : 10}px` }}
                    title={`${item.year}: ${item.count.toLocaleString('id-ID')} data`}
                  />
                  <div className="text-[10px] text-[#666666] pb-2">{item.year}</div>
                </div>
              )) : (
                <div className="w-full flex items-center justify-center text-sm text-[#666666] pb-6">
                  Belum ada data tahun lulus yang bisa divisualisasikan.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-[#EAEAEA] bg-[#FAFAFA]">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Database className="w-4 h-4" />
              Coverage
            </div>
            <p className="text-2xl font-semibold mt-3">{scoring.coverageScore}</p>
            <p className="text-xs text-[#666666] mt-1">
              {scoring.foundCount.toLocaleString('id-ID')} dari {alumni.length.toLocaleString('id-ID')} data ditemukan.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-[#EAEAEA] bg-[#FAFAFA]">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Accuracy
            </div>
            <p className="text-2xl font-semibold mt-3">{scoring.accuracyScore}</p>
            <p className="text-xs text-[#666666] mt-1">
              {scoring.correctSample.toLocaleString('id-ID')} data valid dari sampling {scoring.sampleSize.toLocaleString('id-ID')} data.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-[#EAEAEA] bg-[#FAFAFA]">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Completeness
            </div>
            <p className="text-2xl font-semibold mt-3">{scoring.completenessScore}</p>
            <p className="text-xs text-[#666666] mt-1">
              Rata-rata field terisi: {scoring.averageFilledFields.toFixed(2)} dari 4 field utama.
            </p>
          </div>
        </div>
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
                    <p className="text-sm font-medium">{act.alumniName}</p>
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
          <h3 className="text-sm font-semibold mb-4">Data Telacak per Jurusan</h3>
          <div className="space-y-4 max-h-[430px] overflow-y-auto pr-2">
            {trackedByProdi.length > 0 ? trackedByProdi.map((prodi) => (
              <div key={prodi.name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium">{prodi.name}</span>
                  <span className="text-[#666666]">{prodi.count.toLocaleString('id-ID')}</span>
                </div>
                <div className="w-full h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
                  <div className="h-full bg-black rounded-full" style={{ width: `${prodi.percent}%` }} />
                </div>
              </div>
            )) : (
              <p className="text-sm text-[#666666] py-4">Belum ada data jurusan yang berhasil terlacak.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#EAEAEA] rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#EAEAEA]">
          <h3 className="text-sm font-semibold">Data Alumni</h3>
          <p className="text-xs text-[#666666] mt-1">Tabel data alumni langsung dari dashboard dengan tampilan yang sama seperti menu Data Alumni.</p>
        </div>

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
            itemCount={alumni.length}
            itemSize={64}
            width={3600}
          >
            {({ index, style }) => {
              const item = alumni[index];
              return (
                <div style={style} key={item.id} className="hover:bg-[#FAFAFA] transition-colors border-b border-[#EAEAEA]">
                  <div className="grid items-center min-w-max" style={{ gridTemplateColumns: tableGridColumns }}>
                    {tableColumns.map((column) => (
                      <div key={column.key} className="px-6 py-4 text-[#666666] truncate" title={String(column.render(item) ?? '')}>
                        {column.render(item)}
                      </div>
                    ))}
                    <div className="px-6 py-4 text-right">
                      <button
                        onClick={() => onNavigateToProfile(item.id)}
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

        <div className="p-4 border-t border-[#EAEAEA] text-sm text-[#666666]">
          Menampilkan {alumni.length.toLocaleString('id-ID')} entri data alumni.
        </div>
      </div>
    </div>
  );
}
