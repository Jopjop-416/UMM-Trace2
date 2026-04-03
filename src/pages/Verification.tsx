import { useState } from 'react';
import { Check, X, ExternalLink, AlertTriangle, Briefcase, MapPin, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Verification() {
  const { verifications, resolveVerification, results, confirmResult } = useAppContext();
  const { alumni } = useAppContext();

  // We need to map the candidateId to the actual alumni data
  const candidates = verifications.map(v => {
    const alumniData = alumni.find(a => a.id === v.candidateId);
    return {
      ...v,
      name: alumniData?.name || 'Unknown',
      prodi: alumniData?.prodi || 'Unknown',
      year: alumniData?.year || 'Unknown',
    };
  });

  const handleConfirm = (candidateId: string, matchSource: string) => {
    resolveVerification(candidateId, 'Teridentifikasi', matchSource);
  };

  const handleRejectMatch = (candidateId: string) => {
    // In a real app, we might just remove this specific match.
    // For simplicity, we'll mark the whole candidate as not found if they reject.
    resolveVerification(candidateId, 'Belum Ditemukan', '-');
  };

  const handleSkip = (candidateId: string) => {
    resolveVerification(candidateId, 'Belum Dilacak', '-');
  };

  const handleNotFound = (candidateId: string) => {
    resolveVerification(candidateId, 'Belum Ditemukan', '-');
  };

  const [tab, setTab] = useState<'manual' | 'hasil'>('manual');


  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Verifikasi</h2>
          <p className="text-sm text-[#666666] mt-1">Tinjau hasil otomatis dan verifikasi manual kandidat.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#F5F5F5] rounded-md px-2 py-1 text-sm">
            <button onClick={() => setTab('manual')} className={`px-3 py-1 ${tab === 'manual' ? 'font-semibold text-black' : 'text-[#666666]'}`}>Verifikasi Manual</button>
            <button onClick={() => setTab('hasil')} className={`px-3 py-1 ${tab === 'hasil' ? 'font-semibold text-black' : 'text-[#666666]'}`}>Data Hasil</button>
          </div>
        </div>
      </div>

      {tab === 'manual' && (
        candidates.map((candidate) => (
          <div key={candidate.candidateId} className="bg-white border border-[#EAEAEA] rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#EAEAEA] bg-[#FAFAFA] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-semibold">
                  {candidate.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight">{candidate.name}</h3>
                  <p className="text-sm text-[#666666] flex items-center gap-2">
                    <span className="font-mono text-xs">{candidate.candidateId}</span>
                    <span>•</span>
                    <span>{candidate.prodi}</span>
                    <span>•</span>
                    <span>Lulusan {candidate.year}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleSkip(candidate.candidateId)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-[#EAEAEA] bg-white rounded-md hover:bg-[#F5F5F5] transition-colors text-[#666666]"
                >
                  Lewati
                </button>
                <button 
                  onClick={() => handleNotFound(candidate.candidateId)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-[#333333] transition-colors"
                >
                  Tandai Tidak Ditemukan
                </button>
              </div>
            </div>

            <div className="p-6">
              <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Kandidat Ditemukan (Disambiguasi)
              </h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {candidate.matches.map((match) => (
                  <div key={match.id} className="border border-[#EAEAEA] rounded-lg p-5 relative overflow-hidden group hover:border-black transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-black opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider bg-[#F5F5F5] text-[#444444] mb-2">
                          {match.source}
                        </span>
                        <h5 className="font-semibold text-lg flex items-center gap-2">
                          {match.name}
                          <a href={match.link} target="_blank" rel="noopener noreferrer" className="text-[#888888] hover:text-black transition-colors">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </h5>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-semibold tracking-tight">
                          {match.score}<span className="text-sm text-[#888888] font-normal">%</span>
                        </div>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[#666666]">Confidence</p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm mb-6">
                      <div className="flex items-start gap-3">
                        <Briefcase className="w-4 h-4 text-[#888888] mt-0.5" />
                        <div>
                          <p className="font-medium">{match.role}</p>
                          <p className="text-[#666666] text-xs">{match.affiliation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-[#888888]" />
                        <span className="text-[#666666]">{match.location}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAFAFA] rounded-md border border-[#EAEAEA] text-xs text-[#666666] mb-6">
                      <span className="font-medium text-black">Jejak Bukti: </span>
                      {match.evidence}
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleConfirm(candidate.candidateId, match.source)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-[#333333] transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Konfirmasi Cocok
                      </button>
                      <button 
                        onClick={() => handleRejectMatch(candidate.candidateId)}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-[#EAEAEA] bg-white rounded-md hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-[#666666]"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}

      {tab === 'hasil' && (
        <div className="bg-white border border-[#EAEAEA] rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#EAEAEA]"><h3 className="text-sm font-semibold">Data Hasil</h3></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[#666666] uppercase bg-[#FAFAFA] border-b border-[#EAEAEA]">
                <tr>
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">NIM</th>
                  <th className="px-4 py-3">LinkedIn</th>
                  <th className="px-4 py-3">Instagram</th>
                  <th className="px-4 py-3">Facebook</th>
                  <th className="px-4 py-3">Tiktok</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">No HP</th>
                  <th className="px-4 py-3">Tempat Kerja</th>
                  <th className="px-4 py-3">Posisi</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3 text-right">Verifikasi Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAEAEA]">
                {results.map(r => (
                  <tr key={r.id} className="hover:bg-[#FAFAFA] transition-colors">
                    <td className="px-4 py-3">{r.name}</td>
                    <td className="px-4 py-3">{r.nim}</td>
                    <td className="px-4 py-3 text-[#666666] break-words max-w-[120px]">{r.linkedin}</td>
                    <td className="px-4 py-3">{r.instagram}</td>
                    <td className="px-4 py-3">{r.facebook}</td>
                    <td className="px-4 py-3">{r.tiktok}</td>
                    <td className="px-4 py-3">{r.email}</td>
                    <td className="px-4 py-3">{r.phone}</td>
                    <td className="px-4 py-3">{r.company}</td>
                    <td className="px-4 py-3">{r.position}</td>
                    <td className="px-4 py-3">{r.jobType}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => confirmResult(r.id, true)} className="px-3 py-1 bg-black text-white rounded text-sm">Terima</button>
                        <button onClick={() => confirmResult(r.id, false)} className="px-3 py-1 border border-[#EAEAEA] text-gray-600 rounded text-sm">Tolak</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
