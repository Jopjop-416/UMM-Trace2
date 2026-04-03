import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Papa from 'papaparse';

export interface AlumniData {
  id: string;
  name: string;
  prodi: string;
  year: string;
  nim?: string;
  program?: string;
  tahunMasuk?: string;
  tanggalLulus?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  email?: string;
  phone?: string;
  company?: string;
  companyAddress?: string;
  position?: string;
  jobType?: string;
  companySocial?: string;
  status: string;
  source: string;
  lastUpdated: string;
}

export interface ActivityData {
  id: string;
  type: string;
  alumniId: string;
  alumniName: string;
  prodi: string;
  year: string;
  source: string;
  timestamp: string;
}

export interface JobData {
  id: string;
  date: string;
  status: string;
  target: string;
  found: number;
  total: number;
}

export interface VerificationMatch {
  id: string;
  source: string;
  name: string;
  affiliation: string;
  role: string;
  location: string;
  score: number;
  link: string;
  evidence: string;
}

export interface VerificationData {
  candidateId: string;
  matches: VerificationMatch[];
}

export interface TrackResult {
  id: string;
  alumniId: string;
  name: string;
  nim?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  email?: string;
  phone?: string;
  company?: string;
  companyAddress?: string;
  position?: string;
  jobType?: string;
  score?: number;
  statusSuggested?: string;
  timestamp: string;
}

interface AppContextType {
  alumni: AlumniData[];
  activities: ActivityData[];
  jobs: JobData[];
  verifications: VerificationData[];
  addAlumni: (data: Omit<AlumniData, 'id' | 'lastUpdated'>) => void;
  updateAlumni: (id: string, data: Partial<AlumniData>) => void;
  resolveVerification: (candidateId: string, status: string, source: string) => void;
  addJob: (job: JobData) => void;
  updateJob: (id: string, data: Partial<JobData>) => void;
  runScheduler: () => void;
  
  runAutomation: (limit?: number) => void;
  results: TrackResult[];
  confirmResult: (resultId: string, accept: boolean) => void;
  configMode: 'otomasi' | 'manual';
  setConfigMode: (m: 'otomasi' | 'manual') => void;
  csvLoading: boolean;
  csvError: string | null;
  csvLoaded: boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [alumni, setAlumni] = useState<AlumniData[]>([

  ]);

  const [activities, setActivities] = useState<ActivityData[]>([
 
  ]);

  const [jobs, setJobs] = useState<JobData[]>([

  ]);

  const [verifications, setVerifications] = useState<VerificationData[]>([
    {
      candidateId: 'AL-002',
      matches: [
        { id: 'm1', source: 'Google Scholar', name: 'Ahmad Syauqi', affiliation: 'Universitas Muhammadiyah Malang', role: 'Peneliti', location: 'Malang', score: 85, link: 'https://scholar.google.com', evidence: 'Nama dan afiliasi cocok dengan data master.' },
        { id: 'm2', source: 'LinkedIn', name: 'A. Syauqi', affiliation: 'PT Teknologi Inovasi', role: 'Software Engineer', location: 'Jakarta', score: 60, link: 'https://linkedin.com', evidence: 'Nama mirip, namun afiliasi dan lokasi berbeda. Perlu verifikasi manual.' }
      ]
    }
  ]);

  const addActivity = (data: Omit<ActivityData, 'id' | 'timestamp'>) => {
    const newAct = {
      ...data,
      id: `ACT-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newAct, ...prev]);
  };

  const [csvLoading, setCsvLoading] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [csvLoaded, setCsvLoaded] = useState(false);

  useEffect(() => {

    const loadCsv = async () => {
      setCsvLoading(true);
      setCsvError(null);
      setCsvLoaded(false);
      try {
 
  const csvUrl = new URL('../../Alumni 2000-2025.csv', import.meta.url).href;
        const res = await fetch(csvUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const text = await res.text();

        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (results: any) => {
            const rows: any[] = results.data || [];
            console.debug('CSV HEADERS:', Object.keys(rows[0] || {}));
            console.debug('TOTAL CSV ROWS:', rows.length);

            
            const normalizeKey = (k: string) => String(k || '').toUpperCase().replace(/\s+/g, '').replace(/_/g, '');

            const getField = (row: Record<string, any>, candidates: string[]) => {
              for (const cand of candidates) {
                
                if (row.hasOwnProperty(cand) && row[cand] !== undefined && row[cand] !== null && String(row[cand]).trim() !== '') return String(row[cand]).trim();
              }
             
              const keys = Object.keys(row || {});
              for (const cand of candidates) {
                const nCand = normalizeKey(cand);
                for (const k of keys) {
                  if (normalizeKey(k) === nCand) {
                    const v = (row as any)[k];
                    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v).trim();
                  }
                }
              }
              return undefined;
            };

            const mapStatus = (raw?: string) => {
              if (!raw) return 'Belum Dilacak';
              const r = String(raw).trim().toLowerCase();
              if (r.includes('terident')) return 'Teridentifikasi';
              if (r.includes('verif') || r.includes('perlu')) return 'Perlu Verifikasi';
              if (r.includes('belum') && r.includes('dilacak')) return 'Belum Dilacak';
              if (r.includes('belum') && r.includes('ditemukan')) return 'Belum Ditemukan';
              return String(raw);
            };

            const extractYearFrom = (val?: string) => {
              if (!val) return undefined;
              const s = String(val);
             
              const m = s.match(/\b(19|20)\d{2}\b/);
              return m ? m[0] : undefined;
            };

            const mapped: AlumniData[] = rows.map((row, idx) => {

              const id = `CSV-${idx}`;
              const name = getField(row, ['NAMA LULUSAN', 'Nama Lulusan', 'NAMA LENGKAP', 'Nama Lengkap', 'Nama', 'NAMA', 'FULL NAME', 'Full Name', 'fullname']) || `CSV-${idx}`;
              const prodi = getField(row, ['PRODI', 'Program Studi', 'program studi', 'PROG', 'PROGRAM', 'PROGRAMSTUDI']) || '';
              const yearRaw = getField(row, ['YEAR', 'Tahun Lulus', 'Tahun', 'tahun', 'ANGKATAN', 'Tanggal Lulus']);
              
              const year = (yearRaw && String(yearRaw).trim()) || '';
              const nim = getField(row, ['NIM', 'nim', 'student_number']) ;
              const tahunMasuk = getField(row, ['TAHUN MASUK', 'Tahun Masuk', 'tahun masuk', 'TahunMasuk']);
              const tanggalLulus = getField(row, ['TANGGAL LULUS', 'Tanggal Lulus', 'tanggal lulus', 'TanggalLulus']);
              const fakultas = getField(row, ['FAKULTAS', 'Fakultas']);
              const linkedin = getField(row, ['LINKEDIN', 'linkedin']);
              const instagram = getField(row, ['INSTAGRAM', 'instagram', 'IG']);
              const facebook = getField(row, ['FACEBOOK', 'facebook', 'FB']);
              const tiktok = getField(row, ['TIKTOK', 'tiktok']);
              const email = getField(row, ['EMAIL', 'Email', 'E-MAIL']);
              const phone = getField(row, ['PHONE', 'Phone', 'TELEPON', 'HP']);
              const company = getField(row, ['COMPANY', 'Perusahaan', 'Employer']);
              const companyAddress = getField(row, ['COMPANYADDRESS', 'ALAMAT_PERUSAHAAN', 'Company Address', 'Alamat']);
              const position = getField(row, ['POSITION', 'Jabatan', 'Role']);
              const jobType = getField(row, ['JOBTYPE', 'Jenis Pekerjaan', 'Tipe Pekerjaan']);
              const companySocial = getField(row, ['COMPANYSOCIAL', 'Company Social', 'Sosial Perusahaan']);
              const source = getField(row, ['SOURCE', 'Sumber']) || '-';
              const statusRaw = getField(row, ['STATUS', 'Keterangan']);

              const parsedYear = year || extractYearFrom(tanggalLulus) || '';

              return {
                id,
                name,
                prodi,
                program: prodi,
                nim,
                year: parsedYear,
                tahunMasuk,
                tanggalLulus,
                fakultas,
                linkedin,
                instagram,
                facebook,
                tiktok,
                email,
                phone,
                company,
                companyAddress,
                position,
                jobType,
                companySocial,
                status: mapStatus(statusRaw),
                source,
                lastUpdated: new Date().toISOString()
              } as AlumniData;
            });

           
            setAlumni(mapped);
            setCsvLoaded(true);
          },
          error: (err) => {
            setCsvError(err?.message || String(err));
          }
        });
      } catch (err: any) {
        setCsvError(err?.message || String(err));
      } finally {
        setCsvLoading(false);
      }
    };

    loadCsv();
  }, []);

  const syncVerification = (id: string, status: string, name: string) => {
    setVerifications(prev => {
      const exists = prev.some(v => v.candidateId === id);
      if (status === 'Perlu Verifikasi' && !exists) {
        return [...prev, { 
          candidateId: id, 
          matches: [
            {
              id: `m-${Date.now()}`,
              source: 'Sistem Pencarian',
              name: name,
              affiliation: 'Afiliasi Tidak Diketahui',
              role: 'Profesional',
              location: 'Indonesia',
              score: Math.floor(Math.random() * 20) + 60,
              link: '#',
              evidence: 'Ditemukan kemiripan profil dari pencarian otomatis, namun memerlukan validasi manual oleh admin.'
            }
          ] 
        }];
      } else if (status !== 'Perlu Verifikasi' && exists) {
        return prev.filter(v => v.candidateId !== id);
      }
      return prev;
    });
  };

  
  const [results, setResults] = useState<TrackResult[]>([]);
  const [configMode, setConfigMode] = useState<'otomasi' | 'manual'>('otomasi');

  const runAutomation = (limit = 10) => {
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')} Mar ${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newJobId = `JOB-${Math.floor(Math.random() * 1000) + 1000}`;

    const untracked = alumni.filter(a => a.status === 'Belum Dilacak');
    const selected = untracked.slice(0, limit);

    addJob({ id: newJobId, date: dateStr, status: 'Proses', target: 'Otomasi (10)', found: 0, total: selected.length });

    
    setTimeout(() => {
      let foundCount = 0;
      const newResults: TrackResult[] = [];

      selected.forEach((a, idx) => {

        const score = Math.floor(Math.random() * 46) + 50;
        const linkedin = `https://linkedin.com/in/${a.name.split(' ').join('-').toLowerCase()}`;
        const instagram = `https://instagram.com/${a.name.split(' ').slice(0,2).join('').toLowerCase()}`;
        const facebook = `https://facebook.com/${a.name.split(' ').join('')}`;
        const tiktok = `https://tiktok.com/@${a.name.split(' ').join('').toLowerCase()}`;
        const email = `${(a.nim || 'user') }@example.com`;
        const phone = `+62${Math.floor(800000000 + Math.random() * 900000000)}`;
        const company = `PT ${a.prodi} Indonesia`;
        const companyAddress = `Jl. Contoh No. ${100 + idx}`;
        const position = 'Staff';
        const jobType = Math.random() > 0.66 ? 'PNS' : (Math.random() > 0.5 ? 'Swasta' : 'Wirausaha');

        const statusSuggested = score >= 80 ? 'Teridentifikasi' : 'Perlu Verifikasi';

        newResults.push({
          id: `R-${Date.now()}-${idx}`,
          alumniId: a.id,
          name: a.name,
          nim: a.nim,
          linkedin,
          instagram,
          facebook,
          tiktok,
          email,
          phone,
          company,
          companyAddress,
          position,
          jobType,
          score,
          statusSuggested,
          timestamp: new Date().toISOString()
        });

        
        if (configMode === 'otomasi' && score >= 80) {
          foundCount++;
         
          updateAlumni(a.id, { status: 'Teridentifikasi', source: 'Otomasi', linkedin, instagram, facebook, tiktok, email, phone, company, companyAddress, position, jobType });
        } else {
         
          setVerifications(prev => {
            const exists = prev.some(v => v.candidateId === a.id);
            if (exists) return prev;
            return [...prev, { candidateId: a.id, matches: [{ id: `m-${Date.now()}-${idx}`, source: 'Otomasi', name: a.name, affiliation: company, role: position, location: companyAddress, score, link: linkedin, evidence: 'Hasil pencarian otomatis, perlu verifikasi manual.' }] }];
          });
        }
      });

      setResults(prev => [...newResults, ...prev]);
      updateJob(newJobId, { status: 'Selesai', found: newResults.filter(r => r.score >= 80).length, total: selected.length });
    }, 1500 + Math.random() * 2000);
  };

  const confirmResult = (resultId: string, accept: boolean) => {
    const res = results.find(r => r.id === resultId);
    if (!res) return;
    if (accept) {
      updateAlumni(res.alumniId, { status: 'Teridentifikasi', source: 'Verifikasi Manual', linkedin: res.linkedin, instagram: res.instagram, facebook: res.facebook, tiktok: res.tiktok, email: res.email, phone: res.phone, company: res.company, companyAddress: res.companyAddress, position: res.position, jobType: res.jobType });
      
      setVerifications(prev => prev.filter(v => v.candidateId !== res.alumniId));
    } else {
      updateAlumni(res.alumniId, { status: 'Belum Ditemukan', source: '-' });
    }
    
    setResults(prev => prev.filter(r => r.id !== resultId));
  };

  const addAlumni = (data: Omit<AlumniData, 'id' | 'lastUpdated'>) => {
    setAlumni(prev => {
      const newId = `AL-${String(prev.length + 1).padStart(3, '0')}`;
      const newAlumni = {
        ...data,
        id: newId,
        lastUpdated: new Date().toISOString()
      };
      
      addActivity({
        type: 'ADD',
        alumniId: newId,
        alumniName: data.name,
        prodi: data.prodi,
        year: data.year,
        source: data.source
      });
      
      syncVerification(newId, data.status, data.name);
      return [newAlumni, ...prev];
    });
  };

  const updateAlumni = (id: string, data: Partial<AlumniData>) => {
    setAlumni(prev => {
      const target = prev.find(a => a.id === id);
      if (!target) return prev;
      
      const updatedName = data.name !== undefined ? data.name : target.name;
      const updatedStatus = data.status !== undefined ? data.status : target.status;
      
      syncVerification(id, updatedStatus, updatedName);

      return prev.map(a => {
        if (a.id === id) {
          const updated = { ...a, ...data, lastUpdated: new Date().toISOString() };
          addActivity({
            type: 'UPDATE',
            alumniId: id,
            alumniName: updated.name,
            prodi: updated.prodi,
            year: updated.year,
            source: updated.source
          });
          return updated;
        }
        return a;
      });
    });
  };

  const resolveVerification = (candidateId: string, status: string, source: string) => {
    setAlumni(prev => prev.map(a => {
      if (a.id === candidateId) {
        const updated = { ...a, status, source, lastUpdated: new Date().toISOString() };
        addActivity({
          type: 'RESOLVE',
          alumniId: candidateId,
          alumniName: updated.name,
          prodi: updated.prodi,
          year: updated.year,
          source: updated.source
        });
        return updated;
      }
      return a;
    }));
    setVerifications(prev => prev.filter(v => v.candidateId !== candidateId));
  };

  const addJob = (job: JobData) => {
    setJobs(prev => [job, ...prev]);
  };

  const updateJob = (id: string, data: Partial<JobData>) => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...data } : j));
  };

  const runScheduler = () => {
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')} Mar ${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newJobId = `JOB-${Math.floor(Math.random() * 1000) + 1000}`;

    setAlumni(prevAlumni => {
      const untracked = prevAlumni.filter(a => a.status === 'Belum Dilacak');
      const targetCount = untracked.length;

      addJob({
        id: newJobId,
        date: dateStr,
        status: 'Proses',
        target: 'Belum Dilacak',
        found: 0,
        total: targetCount
      });

      setTimeout(() => {
        setAlumni(currentAlumni => {
          let foundCount = 0;
          const nextAlumni = currentAlumni.map(a => {
            if (a.status === 'Belum Dilacak') {
             
              if (Math.random() > 0.4) {
                foundCount++;
                const isVerified = Math.random() > 0.5;
                const newStatus = isVerified ? 'Teridentifikasi' : 'Perlu Verifikasi';
                const sources = ['LinkedIn', 'Google Scholar', 'ResearchGate', 'GitHub'];
                const newSource = sources[Math.floor(Math.random() * sources.length)];

                syncVerification(a.id, newStatus, a.name);
                return { ...a, status: newStatus, source: newSource, lastUpdated: new Date().toISOString() };
              }
            }
            return a;
          });

          updateJob(newJobId, { status: 'Selesai', found: foundCount, total: targetCount });
          return nextAlumni;
        });
      }, 3000);

      return prevAlumni;
    });
  };

  return (
    <AppContext.Provider value={{ alumni, activities, jobs, verifications, addAlumni, updateAlumni, resolveVerification, addJob, updateJob, runScheduler, runAutomation, results, confirmResult, configMode, setConfigMode, csvLoading, csvError, csvLoaded }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
