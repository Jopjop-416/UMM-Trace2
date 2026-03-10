import { useState } from 'react';
import { Check, X, ExternalLink, AlertTriangle, Briefcase, MapPin, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Verification() {
  const { verifications, resolveVerification } = useAppContext();
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

  if (candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-[#666666] animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-black mb-1">Semua antrean telah diverifikasi</h2>
        <p className="text-sm">Tidak ada kandidat yang perlu ditinjau saat ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Verifikasi Manual</h2>
          <p className="text-sm text-[#666666] mt-1">Tinjau kandidat dengan skor menengah atau data yang saling bertentangan.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium bg-[#F5F5F5] px-3 py-1.5 rounded-md text-[#666666]">
            {candidates.length} Antrean
          </span>
        </div>
      </div>

      {candidates.map((candidate) => (
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
      ))}
    </div>
  );
}
