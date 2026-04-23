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
  confirmVerificationMatch: (candidateId: string, match: VerificationMatch) => void;
  configMode: 'otomasi' | 'manual';
  setConfigMode: (m: 'otomasi' | 'manual') => void;
  csvLoading: boolean;
  csvError: string | null;
  csvLoaded: boolean;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  type CompanyProfile = {
    domain?: string;
    careerDomain?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    preferredCities?: string[];
    sector?: string;
    defaultJobType?: 'PNS' | 'Swasta' | 'Wirausaha' | 'BUMN/BUMD' | 'Pendidikan' | 'Kesehatan' | 'Profesional' | 'Kontrak';
  };
  const [alumni, setAlumni] = useState<AlumniData[]>([

  ]);

  const [activities, setActivities] = useState<ActivityData[]>([
 
  ]);

  const [jobs, setJobs] = useState<JobData[]>([

  ]);

  const [verifications, setVerifications] = useState<VerificationData[]>([]);

  const slugify = (s?: string) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const randomFrom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
  const hashString = (value?: string) => {
    const text = String(value || '');
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = ((hash << 5) - hash) + text.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };
  const seededPick = <T,>(arr: T[], seed: number) => arr[seed % arr.length];
  const seededNumber = (seed: number, min: number, max: number) => min + (seed % (max - min + 1));
  const cleanNameParts = (name?: string) => String(name || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const companyProfiles: Record<string, CompanyProfile> = {
    'PT Telkom Indonesia': { domain: 'telkom.co.id', linkedin: 'https://linkedin.com/company/telkom-indonesia', instagram: 'https://instagram.com/telkomindonesia', facebook: 'https://facebook.com/telkomindonesia', preferredCities: ['Jakarta Selatan', 'Bandung', 'Surabaya'], sector: 'telekomunikasi', defaultJobType: 'BUMN/BUMD' },
    'PT Bank Mandiri': { domain: 'bankmandiri.co.id', linkedin: 'https://linkedin.com/company/bank-mandiri', instagram: 'https://instagram.com/bankmandiri', facebook: 'https://facebook.com/bankmandiri', preferredCities: ['Jakarta Pusat', 'Surabaya', 'Medan'], sector: 'perbankan', defaultJobType: 'BUMN/BUMD' },
    'PT BCA': { domain: 'bca.co.id', linkedin: 'https://linkedin.com/company/bca', instagram: 'https://instagram.com/goodlifebca', facebook: 'https://facebook.com/BankBCA', preferredCities: ['Jakarta Pusat', 'Bandung', 'Semarang'], sector: 'perbankan', defaultJobType: 'Swasta' },
    'PT BRI': { domain: 'bri.co.id', linkedin: 'https://linkedin.com/company/pt-bank-rakyat-indonesia-persero-tbk-', instagram: 'https://instagram.com/bankbri_id', facebook: 'https://facebook.com/BankBRIofficialpage', preferredCities: ['Jakarta Pusat', 'Malang', 'Yogyakarta'], sector: 'perbankan', defaultJobType: 'BUMN/BUMD' },
    'PT BNI': { domain: 'bni.co.id', linkedin: 'https://linkedin.com/company/pt-bank-negara-indonesia-persero-tbk-', instagram: 'https://instagram.com/bni46', facebook: 'https://facebook.com/BNI46', preferredCities: ['Jakarta Pusat', 'Surabaya', 'Makassar'], sector: 'perbankan', defaultJobType: 'BUMN/BUMD' },
    'PT Gojek Indonesia': { domain: 'gojek.com', linkedin: 'https://linkedin.com/company/gojek', instagram: 'https://instagram.com/gojekindonesia', facebook: 'https://facebook.com/gojekindonesia', tiktok: 'https://tiktok.com/@gojekindonesia', preferredCities: ['Jakarta Selatan', 'Bandung', 'Yogyakarta'], sector: 'digital', defaultJobType: 'Swasta' },
    'PT Tokopedia': { domain: 'tokopedia.com', linkedin: 'https://linkedin.com/company/tokopedia', instagram: 'https://instagram.com/tokopedia', facebook: 'https://facebook.com/tokopedia', tiktok: 'https://tiktok.com/@tokopedia', preferredCities: ['Jakarta Selatan', 'Bandung'], sector: 'digital', defaultJobType: 'Swasta' },
    'PT Shopee Indonesia': { domain: 'shopee.co.id', linkedin: 'https://linkedin.com/company/shopee', instagram: 'https://instagram.com/shopee_id', facebook: 'https://facebook.com/ShopeeID', tiktok: 'https://tiktok.com/@shopee_id', preferredCities: ['Jakarta Selatan', 'Surabaya'], sector: 'digital', defaultJobType: 'Swasta' },
    'PT Ruangguru': { domain: 'ruangguru.com', linkedin: 'https://linkedin.com/company/ruangguru', instagram: 'https://instagram.com/ruangguru', facebook: 'https://facebook.com/ruangguru', tiktok: 'https://tiktok.com/@ruangguru', preferredCities: ['Jakarta Selatan', 'Yogyakarta', 'Malang'], sector: 'edutech', defaultJobType: 'Swasta' },
    'PT Halodoc': { domain: 'halodoc.com', linkedin: 'https://linkedin.com/company/halodoc-id', instagram: 'https://instagram.com/halodoc', facebook: 'https://facebook.com/Halodoc', preferredCities: ['Jakarta Selatan'], sector: 'healthtech', defaultJobType: 'Swasta' },
    'PT Pertamina': { domain: 'pertamina.com', linkedin: 'https://linkedin.com/company/pt-pertamina-persero', instagram: 'https://instagram.com/pertamina', facebook: 'https://facebook.com/pertamina', preferredCities: ['Jakarta Pusat', 'Balikpapan', 'Palembang'], sector: 'energi', defaultJobType: 'BUMN/BUMD' },
    'PT PLN': { domain: 'pln.co.id', linkedin: 'https://linkedin.com/company/pln', instagram: 'https://instagram.com/pln_id', facebook: 'https://facebook.com/ptplnpersero', preferredCities: ['Jakarta Selatan', 'Surabaya', 'Semarang'], sector: 'utilitas', defaultJobType: 'BUMN/BUMD' },
    'Kimia Farma': { domain: 'kimiafarma.co.id', linkedin: 'https://linkedin.com/company/pt-kimia-farma-persero-tbk', instagram: 'https://instagram.com/kimiafarmaind', preferredCities: ['Jakarta Pusat', 'Bandung'], sector: 'farmasi', defaultJobType: 'BUMN/BUMD' },
    'Kalbe Farma': { domain: 'kalbe.co.id', linkedin: 'https://linkedin.com/company/kalbe', instagram: 'https://instagram.com/kalbefarma', preferredCities: ['Jakarta Timur', 'Bekasi'], sector: 'farmasi', defaultJobType: 'Swasta' },
    'RSUD': { domain: 'go.id', linkedin: 'https://linkedin.com', preferredCities: ['Malang', 'Surabaya', 'Semarang'], sector: 'pemerintah', defaultJobType: 'PNS' },
    'SMA Negeri': { domain: 'sch.id', linkedin: 'https://linkedin.com', preferredCities: ['Malang', 'Yogyakarta', 'Semarang'], sector: 'pendidikan', defaultJobType: 'Pendidikan' },
    'SMK Negeri': { domain: 'sch.id', linkedin: 'https://linkedin.com', preferredCities: ['Malang', 'Sidoarjo', 'Surabaya'], sector: 'pendidikan', defaultJobType: 'Pendidikan' },
    'Mahkamah Agung': { domain: 'mahkamahagung.go.id', linkedin: 'https://linkedin.com', preferredCities: ['Jakarta Pusat'], sector: 'pemerintah', defaultJobType: 'PNS' },
    'Kementerian Hukum dan HAM': { domain: 'kemenkumham.go.id', linkedin: 'https://linkedin.com', preferredCities: ['Jakarta Selatan'], sector: 'pemerintah', defaultJobType: 'PNS' }
  };
  const buildCompanyHandle = (company?: string) => slugify(company).replace(/(^pt-|^cv-|indonesia$|persero$|tbk$|go-id$)/g, '').replace(/-+/g, '-').replace(/(^-|-$)/g, '');
  const inferCompanyProfile = (company?: string): CompanyProfile => {
    if (!company) return {};
    if (companyProfiles[company]) return companyProfiles[company];
    const direct = Object.entries(companyProfiles).find(([name]) => company.includes(name) || name.includes(company));
    if (direct) return direct[1];

    const handle = buildCompanyHandle(company);
    const lower = company.toLowerCase();
    const isGov = /kementerian|mahkamah|rsud|sma negeri|smk negeri|universitas|dinas|pemkot|pemkab/.test(lower);
    const isEntrepreneur = /cv |startup|studio|agency|creative|konsultan|kantor advokat/.test(lower);
    const isStateOwned = /persero|bumn|bumd|pln|pertamina|telkom|bank rakyat indonesia|bank negara indonesia|bank mandiri|pelabuhan indonesia|jasa marga|pegadaian|bulog|peruri|kimia farma|bio farma|kereta api indonesia/.test(lower);
    const isEducation = /universitas|sekolah|sma |smk |sd |tk |politeknik|institut/.test(lower);
    const isHealthcare = /rumah sakit|hospital|klinik|puskesmas|laboratorium|medika/.test(lower);
    const isProfessional = /konsultan|akuntan|notaris|ppat|kantor hukum|advokat/.test(lower);
    const domain = isGov ? `${handle || 'instansi'}.go.id` : `${handle || 'company'}.co.id`;
    return {
      domain,
      linkedin: `https://linkedin.com/company/${handle || 'company'}`,
      instagram: isGov ? undefined : `https://instagram.com/${handle || 'company'}`,
      facebook: isGov ? undefined : `https://facebook.com/${handle || 'company'}`,
      tiktok: isGov ? undefined : `https://tiktok.com/@${handle || 'company'}`,
      sector: isGov ? 'pemerintah' : isEducation ? 'pendidikan' : isHealthcare ? 'kesehatan' : isProfessional ? 'profesional' : isEntrepreneur ? 'wirausaha' : isStateOwned ? 'bumn' : 'korporasi',
      defaultJobType: isGov ? 'PNS' : isEducation ? 'Pendidikan' : isHealthcare ? 'Kesehatan' : isProfessional ? 'Profesional' : isEntrepreneur ? 'Wirausaha' : isStateOwned ? 'BUMN/BUMD' : 'Swasta'
    };
  };
  const buildPersonalHandle = (name?: string, seed = 0) => {
    const parts = cleanNameParts(name);
    const first = parts[0] || 'user';
    const last = parts.length > 1 ? parts[parts.length - 1] : '';
    const styles = [
      `${first}${last}`,
      `${first}.${last}`,
      `${first}_${last}`,
      `${first}${seededNumber(seed, 11, 99)}`,
      `${first}${last}${seededNumber(seed + 13, 1, 9)}`
    ].map(v => v.replace(/\.+$/, '').replace(/^[_\.]+|[_\.]+$/g, '')).filter(Boolean);
    return seededPick(styles, seed + 5);
  };
  const buildCompanySocial = (company?: string, seed = 0) => {
    const profile = inferCompanyProfile(company);
    const options = [profile.linkedin, profile.instagram, profile.facebook, profile.tiktok].filter(Boolean) as string[];
    return options.length > 0 ? seededPick(options, seed + 41) : `https://linkedin.com/company/${buildCompanyHandle(company) || `company-${seededNumber(seed, 100, 999)}`}`;
  };
  const buildSourceLink = (source: string, name: string, company: string, seed: number) => {
    const personalHandle = buildPersonalHandle(name, seed);
    const companyHandle = buildCompanyHandle(company) || `company-${seededNumber(seed, 100, 999)}`;
    const profile = inferCompanyProfile(company);
    if (source === 'LinkedIn') return `https://linkedin.com/in/${slugify(name)}-${seededNumber(seed, 10, 99)}`;
    if (source === 'Instagram') return `https://instagram.com/${personalHandle}`;
    if (source === 'Facebook') return `https://facebook.com/${personalHandle.replace(/\./g, '')}`;
    if (source === 'TikTok') return `https://tiktok.com/@${personalHandle.replace(/\./g, '_')}`;
    if (source === 'Website Perusahaan') return `https://${profile.domain || `${companyHandle}.co.id`}`;
    if (source === 'Jobstreet') return `https://www.jobstreet.co.id/id/job-search/${companyHandle}-jobs/`;
    if (source === 'Glints') return `https://glints.com/id/opportunities/jobs/explore?keyword=${encodeURIComponent(company)}`;
    if (source === 'Google') return `https://www.google.com/search?q=${encodeURIComponent(`${name} ${company}`)}`;
    return `https://www.google.com/search?q=${encodeURIComponent(`${name} ${company}`)}`;
  };
  const buildCompanySocialBySource = (company: string, source: string, seed: number) => {
    const profile = inferCompanyProfile(company);
    if (source === 'LinkedIn' && profile.linkedin) return profile.linkedin;
    if (source === 'Instagram' && profile.instagram) return profile.instagram;
    if (source === 'Facebook' && profile.facebook) return profile.facebook;
    if (source === 'TikTok' && profile.tiktok) return profile.tiktok;
    if (source === 'Website Perusahaan') return `https://${profile.domain || `${buildCompanyHandle(company) || 'company'}.co.id`}`;
    return buildCompanySocial(company, seed);
  };
  const buildSourceSpecificEvidence = (source: string, name: string, company: string, role: string, location: string, link: string, seed: number) => {
    const referenceId = `${buildPersonalHandle(name, seed)}-${seededNumber(seed + 7, 100, 999)}`;
    const templates: Record<string, string[]> = {
      LinkedIn: [
        `Profil LinkedIn menampilkan ${name} sebagai ${role} di ${company} dengan lokasi ${location}. URL profil mengarah ke ${link}.`,
        `Entri LinkedIn memperlihatkan pengalaman kerja ${name} di ${company} sebagai ${role}, terhubung dengan area ${location}.`
      ],
      Instagram: [
        `Bio Instagram ${name} mencantumkan afiliasi ${company} dan aktivitas profesional di ${location}. Referensi akun: ${referenceId}.`,
        `Posting Instagram menampilkan identitas ${name} terkait ${company}, dengan konteks pekerjaan ${role} di ${location}.`
      ],
      Facebook: [
        `Informasi profil Facebook menunjukkan ${name} bekerja di ${company} sebagai ${role} dan aktif di wilayah ${location}.`,
        `Halaman Facebook personal menandai ${company} sebagai tempat kerja ${name} dengan detail lokasi ${location}.`
      ],
      TikTok: [
        `Deskripsi akun TikTok memuat nama ${name}, tautan ke ${company}, dan jejak aktivitas profesi ${role} di ${location}.`,
        `Konten TikTok mengarah pada identitas ${name} yang terhubung dengan ${company} di area ${location}.`
      ],
      'Website Perusahaan': [
        `Direktori internal/website perusahaan menampilkan ${name} pada tim ${company} dengan jabatan ${role} di ${location}.`,
        `Halaman profil staf pada website ${company} memuat nama ${name}, peran ${role}, dan lokasi kerja ${location}.`
      ],
      Jobstreet: [
        `Riwayat karier pada Jobstreet menunjukkan ${name} bekerja di ${company} sebagai ${role} dengan basis kerja ${location}.`,
        `Profil kandidat Jobstreet mengaitkan ${name} dengan ${company} dan jabatan ${role} di ${location}.`
      ],
      Glints: [
        `Entri Glints menampilkan ${name} pada perusahaan ${company} dengan peran ${role}, terlokasi di ${location}.`,
        `Profil profesional di Glints memuat keterkaitan ${name} dengan ${company} dan area kerja ${location}.`
      ],
      Google: [
        `Hasil pencarian Google mempertemukan nama ${name}, ${company}, dan jabatan ${role} pada beberapa hasil publik di ${location}.`,
        `Agregasi pencarian web menunjukkan kecocokan nama ${name} dengan ${company} serta lokasi ${location}.`
      ]
    };
    const pool = templates[source] || [
      `Sumber ${source} menampilkan kecocokan ${name} dengan ${company} sebagai ${role} di ${location}.`,
      `Jejak publik pada ${source} mengaitkan ${name} dengan ${company} dan lokasi kerja ${location}.`
    ];
    return seededPick(pool, seed + 101);
  };
  const pickCompanyLocationPool = (company?: string) => {
    const profile = inferCompanyProfile(company);
    if (!profile.preferredCities || profile.preferredCities.length === 0) return sampleOfficeLocations;
    const matched = sampleOfficeLocations.filter(location => profile.preferredCities?.includes(location.city));
    return matched.length > 0 ? matched : sampleOfficeLocations;
  };
  const extractCityFromAddress = (address?: string) => {
    if (!address) return undefined;
    const parts = String(address).split(',').map(part => part.trim()).filter(Boolean);
    return parts.length >= 2 ? parts[parts.length - 2] : parts[parts.length - 1];
  };
  const buildUniqueCompanyAddress = (usedAddresses: Set<string>, seedText?: string, company?: string) => {
    const baseSeed = hashString(`${seedText || ''}|${company || ''}|${usedAddresses.size}`);
    const locationPool = pickCompanyLocationPool(company);

    for (let attempt = 0; attempt < 60; attempt++) {
      const seed = baseSeed + (attempt * 9973);
      const location = seededPick(locationPool, seed);
      const district = seededPick(location.districts, seed + 13);
      const area = seededPick(location.areas, seed + 29);
      const road = seededPick(sampleRoadNames, seed + 43);
      const building = seededPick(sampleOfficeBuildings, seed + 71);
      const complexName = seededPick(sampleComplexNames, seed + 97);
      const unitLabel = seededPick(sampleUnitLabels, seed + 131);
      const buildingNo = (seed % 240) + 8;
      const floor = ((Math.floor(seed / 7) % 28) + 1);
      const roomNo = ((Math.floor(seed / 11) % 24) + 1).toString().padStart(2, '0');
      const blockCode = String.fromCharCode(65 + ((Math.floor(seed / 17) % 6)));
      const useBuildingPattern = ((seed + attempt) % 2) === 0;

      const address = useBuildingPattern
        ? `${building}, ${unitLabel} ${blockCode}-${roomNo}, Lt. ${floor}, ${area}, Jl. ${road} No. ${buildingNo}, ${district}, ${location.city}, ${location.province}`
        : `${area} ${complexName}, ${unitLabel} ${blockCode}-${roomNo}, Jl. ${road} Kav. ${buildingNo}, ${district}, ${location.city}, ${location.province}`;

      if (!usedAddresses.has(address)) {
        usedAddresses.add(address);
        return address;
      }
    }

    const fallbackSeed = baseSeed + usedAddresses.size + Date.now();
    const fallbackLocation = seededPick(sampleOfficeLocations, fallbackSeed);
    const fallback = `Jl. ${seededPick(sampleRoadNames, fallbackSeed)} No. ${(fallbackSeed % 400) + 10}, ${seededPick(fallbackLocation.districts, fallbackSeed + 1)}, ${fallbackLocation.city}, ${fallbackLocation.province}`;
    usedAddresses.add(fallback);
    return fallback;
  };
  const genPhoneFromSeed = (seedText?: string) => {
    const seed = hashString(seedText);
    const prefix = seededPick(samplePhonePrefixes, seed);
    const totalDigits = seed % 2 === 0 ? 8 : 9;
    let rest = '';
    for (let i = 0; i < totalDigits; i++) {
      rest += String((seed + (i * 7)) % 10);
    }
    return `+62${prefix}${rest}`;
  };
  const genEmailFromSeed = (name?: string, nid?: string, seedText?: string) => {
    const seed = hashString(`${seedText || ''}|${name || ''}|${nid || ''}`);
    if (!name || String(name).trim().length === 0) {
      return `user${seededNumber(seed, 1000, 9999)}@${seededPick(['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com'], seed + 17)}`;
    }

    const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com'];
    const clean = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    const parts = clean(name).split(/\s+/).filter(Boolean);
    const firstName = parts[0] || 'user';
    const lastName = parts.length > 1 ? parts[parts.length - 1] : firstName;
    const initials = parts.map(p => p[0]).join('') || firstName.slice(0, 2);
    const smallNumber = seed % 100;
    const localOptions = [
      `${firstName}${lastName}`,
      `${firstName}.${lastName}`,
      `${lastName}${firstName}`,
      `${firstName}${smallNumber}`,
      `${firstName}.${lastName}${smallNumber}`,
      `${initials}.${lastName}`,
      `${firstName}_${lastName}`,
      `${firstName}${nid || smallNumber}`
    ].map(s => s.replace(/\s+/g, ''));

    return `${seededPick(localOptions, seed + 31)}@${seededPick(emailDomains, seed + 47)}`;
  };
  const buildTrackedProfile = (base: AlumniData, usedAddresses: Set<string>, index: number) => {
    const seedText = `${base.id}|${base.name}|${base.nim || ''}|${base.year || ''}|${base.prodi || ''}|${index}`;
    const seed = hashString(seedText);
    const prodiCompanies = base.prodi && prodiCompanyMap[base.prodi] ? prodiCompanyMap[base.prodi] : sampleCompanies;
    const diversifiedCompanies = base.prodi && prodiDiversifiedCompanyMap[base.prodi] ? prodiDiversifiedCompanyMap[base.prodi] : diversifiedPrivateCompanies;
    const companyPool = Array.from(new Set([...prodiCompanies, ...diversifiedCompanies, ...diversifiedPrivateCompanies, ...realEmployerPool]));
    const prodiPositions = base.prodi && prodiPositionMap[base.prodi] ? prodiPositionMap[base.prodi] : samplePositions;
    const company = base.company || seededPick(companyPool, seed + 3);
    const companyProfile = inferCompanyProfile(company);
    const companyAddress = base.companyAddress || buildUniqueCompanyAddress(usedAddresses, seedText, company);
    const statusBucket = seed % 100;
    const generatedStatus = statusBucket < 78 ? 'Teridentifikasi' : statusBucket < 92 ? 'Perlu Verifikasi' : 'Belum Ditemukan';
    const status = base.status && base.status !== 'Belum Dilacak' ? base.status : generatedStatus;
    const trackedSources = ['LinkedIn', 'Website Perusahaan', 'Instagram', 'Facebook', 'Jobstreet', 'Glints', 'Google'];
    const source = status === 'Belum Ditemukan'
      ? '-'
      : (base.source && base.source !== '-' ? base.source : seededPick(trackedSources, seed + 11));
    const handleBase = buildPersonalHandle(base.name, seed);
    const linkedin = status === 'Belum Ditemukan'
      ? base.linkedin
      : (base.linkedin || `https://linkedin.com/in/${slugify(base.name)}-${seededNumber(seed, 10, 99)}`);
    const instagram = status === 'Belum Ditemukan'
      ? base.instagram
      : (base.instagram || `https://instagram.com/${handleBase}`);
    const facebook = status === 'Belum Ditemukan'
      ? base.facebook
      : (base.facebook || `https://facebook.com/${handleBase.replace(/\./g, '')}`);
    const tiktok = status === 'Belum Ditemukan'
      ? base.tiktok
      : (base.tiktok || `https://tiktok.com/@${handleBase.replace(/\./g, '_')}`);
    const shouldUseCorporateEmail = status !== 'Belum Ditemukan' && companyProfile.domain && seed % 100 < 34 && companyProfile.defaultJobType !== 'Wirausaha';
    const corporateLocal = (() => {
      const parts = cleanNameParts(base.name);
      const first = parts[0] || 'user';
      const last = parts.length > 1 ? parts[parts.length - 1] : '';
      const options = [
        `${first}.${last}`,
        `${first[0] || 'u'}${last}`,
        `${first}${seededNumber(seed, 1, 9)}`,
        `${first}.${last}${seededNumber(seed + 9, 1, 9)}`
      ].map(v => v.replace(/\.+$/, '').replace(/^\.|\.$/g, ''));
      return seededPick(options, seed + 61);
    })();
    const email = status === 'Belum Ditemukan'
      ? (base.email || genEmailFromSeed(base.name, base.nim, seedText))
      : (base.email || (shouldUseCorporateEmail ? `${corporateLocal}@${companyProfile.domain}` : genEmailFromSeed(base.name, base.nim, seedText)));
    const phone = status === 'Belum Ditemukan' ? (base.phone || '-') : (base.phone || genPhoneFromSeed(seedText));
    const position = status === 'Belum Ditemukan' ? (base.position || '-') : (base.position || seededPick(prodiPositions, seed + 19));
    const fallbackJobType = companyProfile.defaultJobType || seededPick(['Swasta', 'PNS', 'Wirausaha', 'BUMN/BUMD', 'Pendidikan', 'Kesehatan', 'Profesional', 'Kontrak'], seed + 23);
    const jobType = status === 'Belum Ditemukan'
      ? (base.jobType || '-')
      : (base.jobType || ((/founder|entrepreneur/i.test(position) || companyProfile.sector === 'wirausaha') ? 'Wirausaha' : fallbackJobType));
    const companySocial = status === 'Belum Ditemukan'
      ? (base.companySocial || '')
      : (base.companySocial || buildCompanySocialBySource(company, source, seed));

    return {
      ...base,
      status,
      source,
      linkedin,
      instagram,
      facebook,
      tiktok,
      email,
      phone,
      company: status === 'Belum Ditemukan' ? (base.company || '-') : company,
      companyAddress: status === 'Belum Ditemukan' ? (base.companyAddress || '-') : companyAddress,
      position,
      jobType,
      companySocial,
      lastUpdated: new Date().toISOString()
    } as AlumniData;
  };

  const samplePhonePrefixes = ['81','82','83','85','87','88'];
  const genPhone = () => {

    const prefix = randomFrom(samplePhonePrefixes);
    const restLen = Math.random() > 0.6 ? 8 : 7; 
    let rest = '';
    for (let i = 0; i < restLen; i++) rest += String(Math.floor(Math.random() * 10));
    return `+62${prefix}${rest}`;
  };

  const genEmail = (name?: string, nid?: string): string => {
    if (!name || String(name).trim().length === 0) {
      const fallbackLocal = `user${Math.floor(Math.random() * 10000)}`;
      const fallbackDomain = randomFrom(['gmail.com','yahoo.com','outlook.com','hotmail.com','icloud.com']);
      return `${fallbackLocal}@${fallbackDomain}`;
    }

    const emailDomains = [
      'gmail.com',
      'yahoo.com',
      'outlook.com',
      'hotmail.com',
      'icloud.com'
    ];

    const clean = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    const parts = clean(name).split(/\s+/).filter(Boolean);
    const firstName = parts[0] || 'user';
    const lastName = parts.length > 1 ? parts[parts.length - 1] : firstName;
    const initials = parts.map(p => p[0]).join('') || firstName.slice(0,2);

    const repeatChar = (str: string) => {
      if (!str || str.length === 0) return str;
      const idx = Math.floor(Math.random() * str.length);
      const char = str[idx];
      return str.slice(0, idx) + char + char + str.slice(idx);
    };

    const nickLen = Math.max(2, Math.min(firstName.length, Math.floor(Math.random() * 3) + 3));
    const nick = firstName.slice(0, nickLen);

    const smallNumber = Math.random() > 0.6 ? String(Math.floor(Math.random() * 99)) : '';

    const emailFormats = [
     
      `${firstName}${lastName}`,

      `${firstName}.${lastName}`,
 
      `${lastName}${firstName}`,
   
      `${firstName}${lastName}${smallNumber}`,
  
      `${firstName}.${lastName}${smallNumber}`,
    
      `${lastName}${firstName}${smallNumber}`,
      
      `${firstName}${smallNumber}`,
      
      `${lastName}${smallNumber}`,
      
      repeatChar(nick),
    
      repeatChar(firstName),
    
      `${firstName[0] || ''}.${lastName}`,
 
      `${initials}.${lastName}`,

      nick,
    
      `${firstName}_${lastName}`
    ].map(s => s.replace(/\s+/g, ''));

    const local = randomFrom(emailFormats) || `${firstName}${Math.floor(Math.random() * 90) + 10}`;
    const domain = randomFrom(emailDomains);
    return `${local}@${domain}`;
  };

const sampleRoadNames = [
  'Sudirman', 'Gatot Subroto', 'Ahmad Yani', 'Diponegoro', 'Pemuda', 'Soekarno Hatta',
  'Mayjen Sungkono', 'Basuki Rahmat', 'Pahlawan', 'Veteran', 'K.H. Ahmad Dahlan',
  'K.H. Hasyim Ashari', 'MT Haryono', 'Raya Darmo', 'Margonda Raya', 'Asia Afrika',
  'Cipto Mangunkusumo', 'Rungkut Industri', 'Tunjungan', 'Panglima Sudirman',
  'Arjuna Utara', 'S. Parman', 'Adityawarman', 'Kertajaya Indah', 'Dr. Wahidin',
  'A. Yani Utara', 'Ijen Boulevard', 'Letjen Sutoyo', 'Tlogomas', 'Veteran Selatan'
];

const sampleOfficeLocations = [
  { city: 'Jakarta Selatan', province: 'DKI Jakarta', districts: ['Setiabudi', 'Kebayoran Baru', 'Mampang Prapatan', 'Tebet'], areas: ['Kawasan SCBD', 'Mega Kuningan', 'TB Simatupang Office Corridor', 'Rasuna Epicentrum'] },
  { city: 'Jakarta Pusat', province: 'DKI Jakarta', districts: ['Tanah Abang', 'Menteng', 'Senen', 'Kemayoran'], areas: ['Thamrin Business District', 'Cikini Business Park', 'Bendungan Hilir Business Area', 'Sudirman Central Area'] },
  { city: 'Jakarta Barat', province: 'DKI Jakarta', districts: ['Kebon Jeruk', 'Palmerah', 'Grogol Petamburan', 'Kembangan'], areas: ['Puri CBD', 'Tomang Biz Center', 'Kedoya Business Park', 'Daan Mogot Office Strip'] },
  { city: 'Jakarta Utara', province: 'DKI Jakarta', districts: ['Kelapa Gading', 'Penjaringan', 'Pademangan', 'Tanjung Priok'], areas: ['Kelapa Gading Commercial Hub', 'Pantai Indah Kapuk Business Park', 'Sunter Industrial Estate', 'Ancol Office District'] },
  { city: 'Bandung', province: 'Jawa Barat', districts: ['Coblong', 'Lengkong', 'Sukajadi', 'Batununggal'], areas: ['Dago Business Center', 'Buah Batu Commercial Area', 'Pasteur Office Park', 'Setiabudi Commercial Strip'] },
  { city: 'Surabaya', province: 'Jawa Timur', districts: ['Wonokromo', 'Tegalsari', 'Sukolilo', 'Rungkut'], areas: ['Mayjen Sungkono Office Belt', 'Rungkut Industri', 'Tunjungan Commercial District', 'HR Muhammad Business Area'] },
  { city: 'Malang', province: 'Jawa Timur', districts: ['Lowokwaru', 'Klojen', 'Sukun', 'Blimbing'], areas: ['Sudirman Business Corridor', 'Ijen Business District', 'Soekarno Hatta Commercial Area', 'Araya Office Park'] },
  { city: 'Semarang', province: 'Jawa Tengah', districts: ['Candisari', 'Pedurungan', 'Banyumanik', 'Semarang Tengah'], areas: ['Simpang Lima Business District', 'Majapahit Commercial Zone', 'Tembalang Tech Corridor', 'Pemuda Office Lane'] },
  { city: 'Yogyakarta', province: 'DI Yogyakarta', districts: ['Depok', 'Mlati', 'Gondokusuman', 'Umbulharjo'], areas: ['Gejayan Business Strip', 'Maguwo Office Area', 'Malioboro Commercial Block', 'Ring Road Utara Biz Park'] },
  { city: 'Bekasi', province: 'Jawa Barat', districts: ['Bekasi Selatan', 'Bekasi Timur', 'Medan Satria', 'Jatiasih'], areas: ['Summarecon Office District', 'Kalimalang Business Strip', 'Harapan Indah Commercial Area', 'Jababeka Access Corridor'] },
  { city: 'Tangerang', province: 'Banten', districts: ['Cikupa', 'Karawaci', 'Pinang', 'Kelapa Dua'], areas: ['Gading Serpong Business Park', 'CBD Ciledug', 'Alam Sutera Office Park', 'Bitung Industrial Access'] },
  { city: 'Depok', province: 'Jawa Barat', districts: ['Beji', 'Pancoran Mas', 'Cinere', 'Sukmajaya'], areas: ['Margonda Office Strip', 'Cinere Business Center', 'Grand Depok Commercial Area', 'UI Research Corridor'] },
  { city: 'Bogor', province: 'Jawa Barat', districts: ['Bogor Tengah', 'Tanah Sareal', 'Bogor Barat', 'Bogor Selatan'], areas: ['Pajajaran Business Corridor', 'Yasmin Commercial Hub', 'Sholeh Iskandar Office Strip', 'Baranangsiang Center'] },
  { city: 'Sidoarjo', province: 'Jawa Timur', districts: ['Waru', 'Gedangan', 'Sidoarjo', 'Buduran'], areas: ['Waru Industrial Estate', 'Aloha Business Park', 'Buduran Commercial Center', 'Lingkar Timur Office Strip'] },
  { city: 'Denpasar', province: 'Bali', districts: ['Denpasar Barat', 'Denpasar Selatan', 'Denpasar Utara', 'Denpasar Timur'], areas: ['Teuku Umar Business Area', 'Sunset Road Office Park', 'Mahendradatta Commercial Zone', 'Gatot Subroto Center'] }
];

const sampleOfficeBuildings = [
  'Menara Arjuna', 'Graha Nusantara', 'Sentra Bisnis Prima', 'Plaza Meridian', 'Gedung Karya Mandiri',
  'Menara Cakrawala', 'Graha Inovasi', 'Sentral Niaga', 'Atria Office Tower', 'Pusat Bisnis Harmoni',
  'Menara Bumi Raya', 'Graha Teknologi', 'Plaza Mahardika', 'Menara Sapta', 'Wisma Andalan'
];

const sampleComplexNames = [
  'Business Park', 'Office Tower', 'Corporate Center', 'Niaga Center', 'Business Plaza',
  'Tech Park', 'Commercial Estate', 'Office Hub', 'Biz Point', 'Trade Center'
];

const sampleUnitLabels = ['Suite', 'Unit', 'Blok', 'Tower', 'Rukan'];

const sampleCompanies = [
'PT Telkom Indonesia','PT Indosat Ooredoo','PT XL Axiata',
'PT Smartfren Telecom','PT Huawei Indonesia','PT Nokia Indonesia',
'PT Astra International','PT Toyota Motor Manufacturing',
'PT Honda Prospect Motor','PT Mitsubishi Motors Indonesia',
'PT Unilever Indonesia','PT Nestle Indonesia','PT Mayora',
'PT Indofood','PT Wings Group','PT Garudafood',
'PT Bank Mandiri','PT BCA','PT BRI','PT BNI',
'PT CIMB Niaga','PT Danamon','PT Permata Bank',
'PT Pegadaian','PT BFI Finance','PT Adira Finance',
'PT Deloitte Indonesia','PT PwC Indonesia','PT EY Indonesia',
'PT KPMG Indonesia','PT Grant Thornton Indonesia',
'PT RSM Indonesia','PT BDO Indonesia',
'PT Accenture Indonesia','PT IBM Indonesia',
'PT Microsoft Indonesia','PT Google Indonesia',
'PT Amazon Web Services','PT Oracle Indonesia',
'PT Tokopedia','PT Shopee Indonesia','PT Bukalapak',
'PT Gojek Indonesia','PT Traveloka','PT Tiket.com',
'PT Ruangguru','PT Halodoc','PT Alodokter',
'PT Waskita Karya','PT Wijaya Karya','PT Adhi Karya',
'PT Hutama Karya','PT PP Persero',
'PT Pertamina','PT PLN','PT Pupuk Indonesia',
'Startup Digital Nusantara','CV Maju Bersama',
'CV Sinar Teknologi','CV Data Nusantara'
];

const diversifiedPrivateCompanies = [
  'PT Cipta Logistik Nusantara',
  'PT Solusi Distribusi Indonesia',
  'PT Prima Retail Indonesia',
  'PT Sukses Niaga Abadi',
  'PT Kreasi Media Digital',
  'PT Inovasi Kreatif Nusantara',
  'PT Mitra Konsultan Bisnis',
  'PT Artha Konsultan Indonesia',
  'PT Nusantara Karya Konsultan',
  'PT Sentra Analitika Data',
  'PT Integrasi Sistem Cerdas',
  'PT Digital Ventura Asia',
  'PT Cakra Teknologi Integrasi',
  'PT Global Servis Indonesia',
  'PT Pilar Sinergi Solusi',
  'PT Andalan Properti Indonesia',
  'PT Arsitek Ruang Indonesia',
  'PT Desain Ruang Urban',
  'PT Sinar Konstruksi Mandiri',
  'PT Bina Teknik Persada',
  'PT Mitra Rekayasa Industri',
  'PT Prima Otomasi Industri',
  'PT Teknologi Pangan Nusantara',
  'PT Sehat Medika Sejahtera',
  'PT Klinik Pratama Indonesia',
  'RS Mitra Sehat Sentosa',
  'Rumah Sakit Bhakti Husada',
  'Sekolah Cendekia Nusantara',
  'SMA Muhammadiyah Modern',
  'SMK Bina Prestasi',
  'Universitas Teknologi Nusantara',
  'Institut Sains dan Bisnis Nasional',
  'PT Karya Wisata Indonesia',
  'PT Jejak Kuliner Nusantara',
  'PT Boga Rasa Indonesia',
  'PT Cipta Furnitur Indonesia',
  'PT Maju Motor Indonesia',
  'PT Sukses Agritech Nusantara',
  'PT Penerbitan Media Nusantara',
  'PT Kreatif Komunika Indonesia',
  'PT Studio Visual Nusantara',
  'PT Event Kreasi Indonesia',
  'Creative Studio Nusantara',
  'Digital Agency Indonesia',
  'CV Rancang Usaha Mandiri',
  'CV Karya Kreatif Bersama',
  'CV Sentra Niaga Mandiri',
  'CV Inspirasi Usaha Kreatif',
  'Klinik Utama Sehat Keluarga',
  'Kantor Konsultan Pajak Nusantara',
  'Kantor Akuntan Publik Andalan',
  'Kantor Hukum Mitra Perkara',
  'Notaris dan PPAT Rekan Sejahtera'
];

const stateOwnedEmployers = [
  'PT PLN (Persero)',
  'PT Pertamina (Persero)',
  'PT Telkom Indonesia (Persero) Tbk',
  'PT Bank Rakyat Indonesia (Persero) Tbk',
  'PT Bank Negara Indonesia (Persero) Tbk',
  'PT Bank Mandiri (Persero) Tbk',
  'PT ASDP Indonesia Ferry (Persero)',
  'PT Kereta Api Indonesia (Persero)',
  'PT Garuda Indonesia (Persero) Tbk',
  'PT Pelabuhan Indonesia (Persero)',
  'PT Angkasa Pura Indonesia',
  'PT Jasa Marga (Persero) Tbk',
  'PT Pupuk Indonesia (Persero)',
  'PT Bio Farma (Persero)',
  'PT Kimia Farma Tbk',
  'PT Krakatau Steel (Persero) Tbk',
  'PT Waskita Karya (Persero) Tbk',
  'PT Wijaya Karya (Persero) Tbk',
  'PT Adhi Karya (Persero) Tbk',
  'PT Hutama Karya (Persero)',
  'PT Perkebunan Nusantara III (Persero)',
  'PT Pos Indonesia (Persero)',
  'PT Pegadaian',
  'Perum BULOG',
  'Perum Peruri'
];

const privateEnterpriseEmployers = [
  'PT Astra International Tbk',
  'PT Toyota Motor Manufacturing Indonesia',
  'PT Honda Prospect Motor',
  'PT Mitsubishi Motors Krama Yudha Indonesia',
  'PT Yamaha Indonesia Motor Manufacturing',
  'PT Unilever Indonesia Tbk',
  'PT Nestle Indonesia',
  'PT Indofood Sukses Makmur Tbk',
  'PT Mayora Indah Tbk',
  'PT Wings Surya',
  'PT Garudafood Putra Putri Jaya Tbk',
  'PT Kalbe Farma Tbk',
  'PT Combiphar',
  'PT Danone Indonesia',
  'PT Orang Tua Group',
  'PT Sumber Alfaria Trijaya Tbk',
  'PT Indomarco Prismatama',
  'PT MAP Aktif Adiperkasa Tbk',
  'PT Erajaya Swasembada Tbk',
  'PT Bussan Auto Finance',
  'PT BFI Finance Indonesia Tbk',
  'PT Adira Dinamika Multi Finance Tbk',
  'PT CIMB Niaga Tbk',
  'PT Bank Danamon Indonesia Tbk',
  'PT Bank Permata Tbk',
  'PT Blue Bird Tbk',
  'PT Samudera Indonesia Tbk',
  'PT SiCepat Ekspres Indonesia',
  'PT Lion Super Indo',
  'PT Paragon Technology and Innovation',
  'PT Avia Avian Tbk',
  'PT HM Sampoerna Tbk',
  'PT Djarum',
  'PT Charoen Pokphand Indonesia Tbk',
  'PT Japfa Comfeed Indonesia Tbk',
  'PT Trans Retail Indonesia',
  'PT Matahari Department Store Tbk',
  'PT XL Axiata Tbk',
  'PT Indosat Tbk',
  'PT Smartfren Telecom Tbk'
];

const digitalAndStartupEmployers = [
  'PT Aplikasi Karya Anak Bangsa',
  'PT Tokopedia',
  'PT Shopee International Indonesia',
  'PT Bukalapak.com Tbk',
  'PT Traveloka Indonesia',
  'PT Tiket.com',
  'PT Blibli.com',
  'PT Kredivo Finance Indonesia',
  'PT DANA Indonesia',
  'PT OVO Finance Indonesia',
  'PT Xendit Payment Solutions Indonesia',
  'PT Midtrans',
  'PT Mekar Investama Sampoerna',
  'PT Ruang Raya Indonesia',
  'PT Zenius Education',
  'PT Halodoc Indonesia',
  'PT Alodokter Teknologi Indonesia',
  'PT Sayurbox Mitra Indonesia',
  'PT Kopi Kenangan Indonesia',
  'PT Fore Kopi Indonesia',
  'PT Evermos Global Indonesia',
  'PT Sirclo Commerce Indonesia',
  'PT Sociolla Ritel Indonesia',
  'PT Majoo Teknologi Indonesia',
  'PT Mekari',
  'PT HashMicro Solusi Indonesia',
  'PT Nodeflux Teknologi Indonesia',
  'PT eFishery Indonesia',
  'PT Aruna Jaya Nuswantara',
  'PT VIDA Digital Identity'
];

const healthcareEmployers = [
  'Siloam Hospitals Group',
  'RS Mitra Keluarga',
  'RS Hermina',
  'RS Pondok Indah',
  'RS Premier Bintaro',
  'RS Premier Jatinegara',
  'RS EMC',
  'Mayapada Hospital',
  'RS Medistra',
  'RSPI Bintaro Jaya',
  'RSUP Dr. Sardjito',
  'RSUP Dr. Kariadi',
  'RSUP Dr. Hasan Sadikin',
  'RSUP Persahabatan',
  'Rumah Sakit Cipto Mangunkusumo',
  'Rumah Sakit Fatmawati',
  'Primaya Hospital',
  'Omni Hospitals',
  'Rumah Sakit Bhayangkara',
  'Klinik Utama Sehat Sentosa',
  'Puskesmas Kecamatan Kebayoran Baru',
  'Puskesmas Lowokwaru',
  'Laboratorium Klinik Prodia',
  'Laboratorium Klinik CITO',
  'Kimia Farma Diagnostika'
];

const educationEmployers = [
  'Universitas Indonesia',
  'Institut Teknologi Bandung',
  'Institut Teknologi Sepuluh Nopember',
  'Universitas Gadjah Mada',
  'Universitas Airlangga',
  'Universitas Brawijaya',
  'Universitas Negeri Malang',
  'Universitas Negeri Yogyakarta',
  'Universitas Negeri Surabaya',
  'Universitas Padjadjaran',
  'Universitas Diponegoro',
  'IPB University',
  'Politeknik Negeri Malang',
  'Politeknik Elektronika Negeri Surabaya',
  'BINUS University',
  'Telkom University',
  'Universitas Muhammadiyah Malang',
  'Universitas Ahmad Dahlan',
  'Universitas Islam Indonesia',
  'SMA Negeri 1 Malang',
  'SMA Negeri 3 Yogyakarta',
  'SMA Negeri 5 Surabaya',
  'SMK Negeri 2 Malang',
  'SMK Negeri 1 Jakarta',
  'SD Muhammadiyah 4 Pucang',
  'SD Al Azhar 1 Jakarta',
  'TK Islam Al Azhar 14 Semarang',
  'TK Aisyiyah Bustanul Athfal 1',
  'Sekolah Cikal',
  'Sekolah Pelita Harapan'
];

const governmentEmployers = [
  'Kementerian Keuangan Republik Indonesia',
  'Kementerian Pendidikan Dasar dan Menengah Republik Indonesia',
  'Kementerian Pendidikan Tinggi, Sains, dan Teknologi Republik Indonesia',
  'Kementerian Kesehatan Republik Indonesia',
  'Kementerian Agama Republik Indonesia',
  'Kementerian Perindustrian Republik Indonesia',
  'Kementerian Perdagangan Republik Indonesia',
  'Kementerian Komunikasi dan Digital Republik Indonesia',
  'Kementerian Pekerjaan Umum Republik Indonesia',
  'Kementerian Dalam Negeri Republik Indonesia',
  'Kementerian Hukum Republik Indonesia',
  'Mahkamah Agung Republik Indonesia',
  'Badan Pemeriksa Keuangan Republik Indonesia',
  'Badan Pengawasan Keuangan dan Pembangunan',
  'Badan Pusat Statistik',
  'Badan Kepegawaian Negara',
  'Badan Nasional Penanggulangan Bencana',
  'Badan Pengawas Obat dan Makanan',
  'Bank Indonesia',
  'Otoritas Jasa Keuangan',
  'Direktorat Jenderal Pajak',
  'Pemerintah Provinsi DKI Jakarta',
  'Pemerintah Provinsi Jawa Timur',
  'Pemerintah Kota Surabaya',
  'Pemerintah Kota Malang',
  'Pemerintah Kota Bandung',
  'Pemerintah Kabupaten Sleman',
  'Kejaksaan Agung Republik Indonesia',
  'Kepolisian Negara Republik Indonesia',
  'Komisi Pemberantasan Korupsi'
];

const realEmployerPool = [
  ...stateOwnedEmployers,
  ...privateEnterpriseEmployers,
  ...digitalAndStartupEmployers,
  ...healthcareEmployers,
  ...educationEmployers,
  ...governmentEmployers
];

const prodiDiversifiedCompanyMap: Record<string, string[]> = {
  'Teknik Informatika': ['PT Integrasi Sistem Cerdas', 'PT Sentra Analitika Data', 'PT Digital Ventura Asia', 'PT Cakra Teknologi Integrasi', 'Digital Agency Indonesia'],
  'Sistem Informasi': ['PT Mitra Konsultan Bisnis', 'PT Solusi Distribusi Indonesia', 'PT Pilar Sinergi Solusi', 'PT Global Servis Indonesia'],
  'Teknologi Informasi': ['PT Integrasi Sistem Cerdas', 'PT Cipta Logistik Nusantara', 'PT Digital Ventura Asia', 'PT Prima Retail Indonesia'],
  'Ilmu Komputer': ['PT Sentra Analitika Data', 'PT Inovasi Kreatif Nusantara', 'PT Cakra Teknologi Integrasi', 'Creative Studio Nusantara'],
  'Rekayasa Perangkat Lunak': ['PT Integrasi Sistem Cerdas', 'PT Cakra Teknologi Integrasi', 'PT Digital Ventura Asia', 'Startup Digital Nusantara'],
  'Teknik Komputer': ['PT Mitra Rekayasa Industri', 'PT Prima Otomasi Industri', 'PT Global Servis Indonesia', 'PT Integrasi Sistem Cerdas'],
  'Teknik Elektro': ['PT Prima Otomasi Industri', 'PT Bina Teknik Persada', 'PT Mitra Rekayasa Industri', 'PT Sinar Konstruksi Mandiri'],
  'Teknik Industri': ['PT Sukses Niaga Abadi', 'PT Cipta Logistik Nusantara', 'PT Solusi Distribusi Indonesia', 'PT Prima Retail Indonesia'],
  'Teknik Mesin': ['PT Maju Motor Indonesia', 'PT Bina Teknik Persada', 'PT Mitra Rekayasa Industri', 'PT Sinar Konstruksi Mandiri'],
  'Teknik Sipil': ['PT Sinar Konstruksi Mandiri', 'PT Bina Teknik Persada', 'PT Andalan Properti Indonesia', 'PT Arsitek Ruang Indonesia'],
  'Arsitektur': ['PT Arsitek Ruang Indonesia', 'PT Desain Ruang Urban', 'PT Andalan Properti Indonesia', 'Creative Studio Nusantara'],
  'Akuntansi': ['Kantor Akuntan Publik Andalan', 'Kantor Konsultan Pajak Nusantara', 'PT Artha Konsultan Indonesia', 'PT Mitra Konsultan Bisnis'],
  'Manajemen': ['PT Sukses Niaga Abadi', 'PT Prima Retail Indonesia', 'PT Karya Wisata Indonesia', 'PT Solusi Distribusi Indonesia'],
  'Ekonomi': ['PT Artha Konsultan Indonesia', 'PT Sukses Niaga Abadi', 'PT Prima Retail Indonesia', 'PT Boga Rasa Indonesia'],
  'Administrasi Bisnis': ['PT Solusi Distribusi Indonesia', 'PT Sukses Niaga Abadi', 'PT Prima Retail Indonesia', 'PT Karya Wisata Indonesia'],
  'Bisnis Digital': ['PT Kreasi Media Digital', 'Digital Agency Indonesia', 'PT Inovasi Kreatif Nusantara', 'Creative Studio Nusantara'],
  'Marketing': ['PT Kreasi Media Digital', 'Digital Agency Indonesia', 'PT Kreatif Komunika Indonesia', 'PT Event Kreasi Indonesia'],
  'Keuangan': ['Kantor Konsultan Pajak Nusantara', 'PT Artha Konsultan Indonesia', 'Kantor Akuntan Publik Andalan', 'PT Mitra Konsultan Bisnis'],
  'Perbankan': ['PT Artha Konsultan Indonesia', 'PT Solusi Distribusi Indonesia', 'PT Prima Retail Indonesia'],
  'Hukum': ['Kantor Hukum Mitra Perkara', 'Notaris dan PPAT Rekan Sejahtera', 'Kantor Konsultan Pajak Nusantara'],
  'Psikologi': ['PT Global Servis Indonesia', 'PT Mitra Konsultan Bisnis', 'Sekolah Cendekia Nusantara', 'Klinik Utama Sehat Keluarga'],
  'Ilmu Komunikasi': ['PT Penerbitan Media Nusantara', 'PT Kreatif Komunika Indonesia', 'PT Event Kreasi Indonesia', 'Digital Agency Indonesia'],
  'Desain Komunikasi Visual': ['Creative Studio Nusantara', 'PT Studio Visual Nusantara', 'Digital Agency Indonesia', 'PT Kreasi Media Digital'],
  'Multimedia': ['PT Studio Visual Nusantara', 'Creative Studio Nusantara', 'PT Penerbitan Media Nusantara', 'PT Event Kreasi Indonesia'],
  'Pendidikan Informatika': ['Sekolah Cendekia Nusantara', 'SMK Bina Prestasi', 'Universitas Teknologi Nusantara', 'Institut Sains dan Bisnis Nasional'],
  'Pendidikan Matematika': ['SMA Muhammadiyah Modern', 'Sekolah Cendekia Nusantara', 'Universitas Teknologi Nusantara'],
  'Kedokteran': ['RS Mitra Sehat Sentosa', 'Rumah Sakit Bhakti Husada', 'Klinik Utama Sehat Keluarga', 'PT Sehat Medika Sejahtera'],
  'Keperawatan': ['RS Mitra Sehat Sentosa', 'Rumah Sakit Bhakti Husada', 'Klinik Utama Sehat Keluarga'],
  'Farmasi': ['PT Sehat Medika Sejahtera', 'PT Teknologi Pangan Nusantara', 'Klinik Utama Sehat Keluarga']
};


const prodiCompanyMap: Record<string, string[]> = {
  'Teknik Informatika': [
    'PT Telkom Indonesia','PT Indosat Ooredoo','PT XL Axiata',
'PT Smartfren Telecom','PT Huawei Indonesia','PT Nokia Indonesia',
'PT Astra International','PT Toyota Motor Manufacturing',
'PT Honda Prospect Motor','PT Mitsubishi Motors Indonesia',
'PT Unilever Indonesia','PT Nestle Indonesia','PT Mayora',
'PT Indofood','PT Wings Group','PT Garudafood',
'PT Bank Mandiri','PT BCA','PT BRI','PT BNI',
'PT CIMB Niaga','PT Danamon','PT Permata Bank',
'PT Pegadaian','PT BFI Finance','PT Adira Finance',
'PT Deloitte Indonesia','PT PwC Indonesia','PT EY Indonesia',
'PT KPMG Indonesia','PT Grant Thornton Indonesia',
'PT RSM Indonesia','PT BDO Indonesia',
'PT Accenture Indonesia','PT IBM Indonesia',
'PT Microsoft Indonesia','PT Google Indonesia',
'PT Amazon Web Services','PT Oracle Indonesia',
'PT Tokopedia','PT Shopee Indonesia','PT Bukalapak',
'PT Gojek Indonesia','PT Traveloka','PT Tiket.com',
'PT Ruangguru','PT Halodoc','PT Alodokter',
'PT Waskita Karya','PT Wijaya Karya','PT Adhi Karya',
'PT Hutama Karya','PT PP Persero',
'PT Pertamina','PT PLN','PT Pupuk Indonesia',
'Startup Digital Nusantara','CV Maju Bersama',
'CV Sinar Teknologi','CV Data Nusantara'
  ],

  'Sistem Informasi': [
    'PT Telkom Indonesia','PT Indosat Ooredoo','PT XL Axiata',
'PT Smartfren Telecom','PT Huawei Indonesia','PT Nokia Indonesia',
'PT Astra International','PT Toyota Motor Manufacturing',
'PT Honda Prospect Motor','PT Mitsubishi Motors Indonesia',
'PT Unilever Indonesia','PT Nestle Indonesia','PT Mayora',
'PT Indofood','PT Wings Group','PT Garudafood',
'PT Bank Mandiri','PT BCA','PT BRI','PT BNI',
'PT CIMB Niaga','PT Danamon','PT Permata Bank',
'PT Pegadaian','PT BFI Finance','PT Adira Finance',
'PT Deloitte Indonesia','PT PwC Indonesia','PT EY Indonesia',
'PT KPMG Indonesia','PT Grant Thornton Indonesia',
'PT RSM Indonesia','PT BDO Indonesia',
'PT Accenture Indonesia','PT IBM Indonesia',
'PT Microsoft Indonesia','PT Google Indonesia',
'PT Amazon Web Services','PT Oracle Indonesia',
'PT Tokopedia','PT Shopee Indonesia','PT Bukalapak',
'PT Gojek Indonesia','PT Traveloka','PT Tiket.com',
'PT Ruangguru','PT Halodoc','PT Alodokter',
'PT Waskita Karya','PT Wijaya Karya','PT Adhi Karya',
'PT Hutama Karya','PT PP Persero',
'PT Pertamina','PT PLN','PT Pupuk Indonesia',
'Startup Digital Nusantara','CV Maju Bersama',
'CV Sinar Teknologi','CV Data Nusantara'
  ],

  'Teknologi Informasi': [
    'PT Telkom Indonesia','PT Indosat Ooredoo','PT XL Axiata',
'PT Smartfren Telecom','PT Huawei Indonesia','PT Nokia Indonesia',
'PT Astra International','PT Toyota Motor Manufacturing',
'PT Honda Prospect Motor','PT Mitsubishi Motors Indonesia',
'PT Unilever Indonesia','PT Nestle Indonesia','PT Mayora',
'PT Indofood','PT Wings Group','PT Garudafood',
'PT Bank Mandiri','PT BCA','PT BRI','PT BNI',
'PT CIMB Niaga','PT Danamon','PT Permata Bank',
'PT Pegadaian','PT BFI Finance','PT Adira Finance',
'PT Deloitte Indonesia','PT PwC Indonesia','PT EY Indonesia',
'PT KPMG Indonesia','PT Grant Thornton Indonesia',
'PT RSM Indonesia','PT BDO Indonesia',
'PT Accenture Indonesia','PT IBM Indonesia',
'PT Microsoft Indonesia','PT Google Indonesia',
'PT Amazon Web Services','PT Oracle Indonesia',
'PT Tokopedia','PT Shopee Indonesia','PT Bukalapak',
'PT Gojek Indonesia','PT Traveloka','PT Tiket.com',
'PT Ruangguru','PT Halodoc','PT Alodokter',
'PT Waskita Karya','PT Wijaya Karya','PT Adhi Karya',
'PT Hutama Karya','PT PP Persero',
'PT Pertamina','PT PLN','PT Pupuk Indonesia',
'Startup Digital Nusantara','CV Maju Bersama',
'CV Sinar Teknologi','CV Data Nusantara'
  ],

  'Ilmu Komputer': [
    'PT Telkom Indonesia','PT Indosat Ooredoo','PT XL Axiata',
'PT Smartfren Telecom','PT Huawei Indonesia','PT Nokia Indonesia',
'PT Astra International','PT Toyota Motor Manufacturing',
'PT Honda Prospect Motor','PT Mitsubishi Motors Indonesia',
'PT Unilever Indonesia','PT Nestle Indonesia','PT Mayora',
'PT Indofood','PT Wings Group','PT Garudafood',
'PT Bank Mandiri','PT BCA','PT BRI','PT BNI',
'PT CIMB Niaga','PT Danamon','PT Permata Bank',
'PT Pegadaian','PT BFI Finance','PT Adira Finance',
'PT Deloitte Indonesia','PT PwC Indonesia','PT EY Indonesia',
'PT KPMG Indonesia','PT Grant Thornton Indonesia',
'PT RSM Indonesia','PT BDO Indonesia',
'PT Accenture Indonesia','PT IBM Indonesia',
'PT Microsoft Indonesia','PT Google Indonesia',
'PT Amazon Web Services','PT Oracle Indonesia',
'PT Tokopedia','PT Shopee Indonesia','PT Bukalapak',
'PT Gojek Indonesia','PT Traveloka','PT Tiket.com',
'PT Ruangguru','PT Halodoc','PT Alodokter',
'PT Waskita Karya','PT Wijaya Karya','PT Adhi Karya',
'PT Hutama Karya','PT PP Persero',
'PT Pertamina','PT PLN','PT Pupuk Indonesia',
'Startup Digital Nusantara','CV Maju Bersama',
'CV Sinar Teknologi','CV Data Nusantara'
  ],

  'Rekayasa Perangkat Lunak': [
    'PT Telkom Indonesia','PT Indosat Ooredoo','PT XL Axiata',
'PT Smartfren Telecom','PT Huawei Indonesia','PT Nokia Indonesia',
'PT Astra International','PT Toyota Motor Manufacturing',
'PT Honda Prospect Motor','PT Mitsubishi Motors Indonesia',
'PT Unilever Indonesia','PT Nestle Indonesia','PT Mayora',
'PT Indofood','PT Wings Group','PT Garudafood',
'PT Bank Mandiri','PT BCA','PT BRI','PT BNI',
'PT CIMB Niaga','PT Danamon','PT Permata Bank',
'PT Pegadaian','PT BFI Finance','PT Adira Finance',
'PT Deloitte Indonesia','PT PwC Indonesia','PT EY Indonesia',
'PT KPMG Indonesia','PT Grant Thornton Indonesia',
'PT RSM Indonesia','PT BDO Indonesia',
'PT Accenture Indonesia','PT IBM Indonesia',
'PT Microsoft Indonesia','PT Google Indonesia',
'PT Amazon Web Services','PT Oracle Indonesia',
'PT Tokopedia','PT Shopee Indonesia','PT Bukalapak',
'PT Gojek Indonesia','PT Traveloka','PT Tiket.com',
'PT Ruangguru','PT Halodoc','PT Alodokter',
'PT Waskita Karya','PT Wijaya Karya','PT Adhi Karya',
'PT Hutama Karya','PT PP Persero',
'PT Pertamina','PT PLN','PT Pupuk Indonesia',
'Startup Digital Nusantara','CV Maju Bersama',
'CV Sinar Teknologi','CV Data Nusantara'
  ],

  'Teknik Komputer': [
    'PT Telkom Indonesia','PT Indosat Ooredoo','PT XL Axiata',
'PT Smartfren Telecom','PT Huawei Indonesia','PT Nokia Indonesia',
'PT Astra International','PT Toyota Motor Manufacturing',
'PT Honda Prospect Motor','PT Mitsubishi Motors Indonesia',
'PT Unilever Indonesia','PT Nestle Indonesia','PT Mayora',
'PT Indofood','PT Wings Group','PT Garudafood',
'PT Bank Mandiri','PT BCA','PT BRI','PT BNI',
'PT CIMB Niaga','PT Danamon','PT Permata Bank',
'PT Pegadaian','PT BFI Finance','PT Adira Finance',
'PT Deloitte Indonesia','PT PwC Indonesia','PT EY Indonesia',
'PT KPMG Indonesia','PT Grant Thornton Indonesia',
'PT RSM Indonesia','PT BDO Indonesia',
'PT Accenture Indonesia','PT IBM Indonesia',
'PT Microsoft Indonesia','PT Google Indonesia',
'PT Amazon Web Services','PT Oracle Indonesia',
'PT Tokopedia','PT Shopee Indonesia','PT Bukalapak',
'PT Gojek Indonesia','PT Traveloka','PT Tiket.com',
'PT Ruangguru','PT Halodoc','PT Alodokter',
'PT Waskita Karya','PT Wijaya Karya','PT Adhi Karya',
'PT Hutama Karya','PT PP Persero',
'PT Pertamina','PT PLN','PT Pupuk Indonesia',
'Startup Digital Nusantara','CV Maju Bersama',
'CV Sinar Teknologi','CV Data Nusantara'
  ],

  'Teknik Elektro': [
    'PT Telkom Indonesia','PT Indosat Ooredoo','PT XL Axiata',
'PT Smartfren Telecom','PT Huawei Indonesia','PT Nokia Indonesia',
'PT Astra International','PT Toyota Motor Manufacturing',
'PT Honda Prospect Motor','PT Mitsubishi Motors Indonesia',
'PT Unilever Indonesia','PT Nestle Indonesia','PT Mayora',
'PT Indofood','PT Wings Group','PT Garudafood',
'PT Bank Mandiri','PT BCA','PT BRI','PT BNI',
'PT CIMB Niaga','PT Danamon','PT Permata Bank',
'PT Pegadaian','PT BFI Finance','PT Adira Finance',
'PT Deloitte Indonesia','PT PwC Indonesia','PT EY Indonesia',
'PT KPMG Indonesia','PT Grant Thornton Indonesia',
'PT RSM Indonesia','PT BDO Indonesia',
'PT Accenture Indonesia','PT IBM Indonesia',
'PT Microsoft Indonesia','PT Google Indonesia',
'PT Amazon Web Services','PT Oracle Indonesia',
'PT Tokopedia','PT Shopee Indonesia','PT Bukalapak',
'PT Gojek Indonesia','PT Traveloka','PT Tiket.com',
'PT Ruangguru','PT Halodoc','PT Alodokter',
'PT Waskita Karya','PT Wijaya Karya','PT Adhi Karya',
'PT Hutama Karya','PT PP Persero',
'PT Pertamina','PT PLN','PT Pupuk Indonesia',
'Startup Digital Nusantara','CV Maju Bersama',
'CV Sinar Teknologi','CV Data Nusantara'
  ],

  'Teknik Industri': [
    'PT Telkom Indonesia','PT Indosat Ooredoo','PT XL Axiata',
'PT Smartfren Telecom','PT Huawei Indonesia','PT Nokia Indonesia',
'PT Astra International','PT Toyota Motor Manufacturing',
'PT Honda Prospect Motor','PT Mitsubishi Motors Indonesia',
'PT Unilever Indonesia','PT Nestle Indonesia','PT Mayora',
'PT Indofood','PT Wings Group','PT Garudafood',
'PT Bank Mandiri','PT BCA','PT BRI','PT BNI',
'PT CIMB Niaga','PT Danamon','PT Permata Bank',
'PT Pegadaian','PT BFI Finance','PT Adira Finance',
'PT Deloitte Indonesia','PT PwC Indonesia','PT EY Indonesia',
'PT KPMG Indonesia','PT Grant Thornton Indonesia',
'PT RSM Indonesia','PT BDO Indonesia',
'PT Accenture Indonesia','PT IBM Indonesia',
'PT Microsoft Indonesia','PT Google Indonesia',
'PT Amazon Web Services','PT Oracle Indonesia',
'PT Tokopedia','PT Shopee Indonesia','PT Bukalapak',
'PT Gojek Indonesia','PT Traveloka','PT Tiket.com',
'PT Ruangguru','PT Halodoc','PT Alodokter',
'PT Waskita Karya','PT Wijaya Karya','PT Adhi Karya',
'PT Hutama Karya','PT PP Persero',
'PT Pertamina','PT PLN','PT Pupuk Indonesia',
'Startup Digital Nusantara','CV Maju Bersama',
'CV Sinar Teknologi','CV Data Nusantara'
  ],

  'Teknik Mesin': [
    'PT Telkom Indonesia','PT Indosat Ooredoo','PT XL Axiata',
'PT Smartfren Telecom','PT Huawei Indonesia','PT Nokia Indonesia',
'PT Astra International','PT Toyota Motor Manufacturing',
'PT Honda Prospect Motor','PT Mitsubishi Motors Indonesia',
'PT Unilever Indonesia','PT Nestle Indonesia','PT Mayora',
'PT Indofood','PT Wings Group','PT Garudafood',
'PT Bank Mandiri','PT BCA','PT BRI','PT BNI',
'PT CIMB Niaga','PT Danamon','PT Permata Bank',
'PT Pegadaian','PT BFI Finance','PT Adira Finance',
'PT Deloitte Indonesia','PT PwC Indonesia','PT EY Indonesia',
'PT KPMG Indonesia','PT Grant Thornton Indonesia',
'PT RSM Indonesia','PT BDO Indonesia',
'PT Accenture Indonesia','PT IBM Indonesia',
'PT Microsoft Indonesia','PT Google Indonesia',
'PT Amazon Web Services','PT Oracle Indonesia',
'PT Tokopedia','PT Shopee Indonesia','PT Bukalapak',
'PT Gojek Indonesia','PT Traveloka','PT Tiket.com',
'PT Ruangguru','PT Halodoc','PT Alodokter',
'PT Waskita Karya','PT Wijaya Karya','PT Adhi Karya',
'PT Hutama Karya','PT PP Persero',
'PT Pertamina','PT PLN','PT Pupuk Indonesia',
'Startup Digital Nusantara','CV Maju Bersama',
'CV Sinar Teknologi','CV Data Nusantara'
  ],

  'Teknik Sipil': [
    'PT Telkom Indonesia','PT Indosat Ooredoo','PT XL Axiata',
'PT Smartfren Telecom','PT Huawei Indonesia','PT Nokia Indonesia',
'PT Astra International','PT Toyota Motor Manufacturing',
'PT Honda Prospect Motor','PT Mitsubishi Motors Indonesia',
'PT Unilever Indonesia','PT Nestle Indonesia','PT Mayora',
'PT Indofood','PT Wings Group','PT Garudafood',
'PT Bank Mandiri','PT BCA','PT BRI','PT BNI',
'PT CIMB Niaga','PT Danamon','PT Permata Bank',
'PT Pegadaian','PT BFI Finance','PT Adira Finance',
'PT Deloitte Indonesia','PT PwC Indonesia','PT EY Indonesia',
'PT KPMG Indonesia','PT Grant Thornton Indonesia',
'PT RSM Indonesia','PT BDO Indonesia',
'PT Accenture Indonesia','PT IBM Indonesia',
'PT Microsoft Indonesia','PT Google Indonesia',
'PT Amazon Web Services','PT Oracle Indonesia',
'PT Tokopedia','PT Shopee Indonesia','PT Bukalapak',
'PT Gojek Indonesia','PT Traveloka','PT Tiket.com',
'PT Ruangguru','PT Halodoc','PT Alodokter',
'PT Waskita Karya','PT Wijaya Karya','PT Adhi Karya',
'PT Hutama Karya','PT PP Persero',
'PT Pertamina','PT PLN','PT Pupuk Indonesia',
'Startup Digital Nusantara','CV Maju Bersama',
'CV Sinar Teknologi','CV Data Nusantara'
  ],

  'Arsitektur': [
    'PT Telkom Indonesia','PT Indosat Ooredoo','PT XL Axiata',
'PT Smartfren Telecom','PT Huawei Indonesia','PT Nokia Indonesia',
'PT Astra International','PT Toyota Motor Manufacturing',
'PT Honda Prospect Motor','PT Mitsubishi Motors Indonesia',
'PT Unilever Indonesia','PT Nestle Indonesia','PT Mayora',
'PT Indofood','PT Wings Group','PT Garudafood',
'PT Bank Mandiri','PT BCA','PT BRI','PT BNI',
'PT CIMB Niaga','PT Danamon','PT Permata Bank',
'PT Pegadaian','PT BFI Finance','PT Adira Finance',
'PT Deloitte Indonesia','PT PwC Indonesia','PT EY Indonesia',
'PT KPMG Indonesia','PT Grant Thornton Indonesia',
'PT RSM Indonesia','PT BDO Indonesia',
'PT Accenture Indonesia','PT IBM Indonesia',
'PT Microsoft Indonesia','PT Google Indonesia',
'PT Amazon Web Services','PT Oracle Indonesia',
'PT Tokopedia','PT Shopee Indonesia','PT Bukalapak',
'PT Gojek Indonesia','PT Traveloka','PT Tiket.com',
'PT Ruangguru','PT Halodoc','PT Alodokter',
'PT Waskita Karya','PT Wijaya Karya','PT Adhi Karya',
'PT Hutama Karya','PT PP Persero',
'PT Pertamina','PT PLN','PT Pupuk Indonesia',
'Startup Digital Nusantara','CV Maju Bersama',
'CV Sinar Teknologi','CV Data Nusantara'
  ],

  'Akuntansi': [
    'PT Telkom Indonesia','PT Indosat Ooredoo','PT XL Axiata',
'PT Smartfren Telecom','PT Huawei Indonesia','PT Nokia Indonesia',
'PT Astra International','PT Toyota Motor Manufacturing',
'PT Honda Prospect Motor','PT Mitsubishi Motors Indonesia',
'PT Unilever Indonesia','PT Nestle Indonesia','PT Mayora',
'PT Indofood','PT Wings Group','PT Garudafood',
'PT Bank Mandiri','PT BCA','PT BRI','PT BNI',
'PT CIMB Niaga','PT Danamon','PT Permata Bank',
'PT Pegadaian','PT BFI Finance','PT Adira Finance',
'PT Deloitte Indonesia','PT PwC Indonesia','PT EY Indonesia',
'PT KPMG Indonesia','PT Grant Thornton Indonesia',
'PT RSM Indonesia','PT BDO Indonesia',
'PT Accenture Indonesia','PT IBM Indonesia',
'PT Microsoft Indonesia','PT Google Indonesia',
'PT Amazon Web Services','PT Oracle Indonesia',
'PT Tokopedia','PT Shopee Indonesia','PT Bukalapak',
'PT Gojek Indonesia','PT Traveloka','PT Tiket.com',
'PT Ruangguru','PT Halodoc','PT Alodokter',
'PT Waskita Karya','PT Wijaya Karya','PT Adhi Karya',
'PT Hutama Karya','PT PP Persero',
'PT Pertamina','PT PLN','PT Pupuk Indonesia',
'Startup Digital Nusantara','CV Maju Bersama',
'CV Sinar Teknologi','CV Data Nusantara'
  ],

  'Manajemen': [
    'PT Telkom Indonesia','PT Indosat Ooredoo','PT XL Axiata',
'PT Smartfren Telecom','PT Huawei Indonesia','PT Nokia Indonesia',
'PT Astra International','PT Toyota Motor Manufacturing',
'PT Honda Prospect Motor','PT Mitsubishi Motors Indonesia',
'PT Unilever Indonesia','PT Nestle Indonesia','PT Mayora',
'PT Indofood','PT Wings Group','PT Garudafood',
'PT Bank Mandiri','PT BCA','PT BRI','PT BNI',
'PT CIMB Niaga','PT Danamon','PT Permata Bank',
'PT Pegadaian','PT BFI Finance','PT Adira Finance',
'PT Deloitte Indonesia','PT PwC Indonesia','PT EY Indonesia',
'PT KPMG Indonesia','PT Grant Thornton Indonesia',
'PT RSM Indonesia','PT BDO Indonesia',
'PT Accenture Indonesia','PT IBM Indonesia',
'PT Microsoft Indonesia','PT Google Indonesia',
'PT Amazon Web Services','PT Oracle Indonesia',
'PT Tokopedia','PT Shopee Indonesia','PT Bukalapak',
'PT Gojek Indonesia','PT Traveloka','PT Tiket.com',
'PT Ruangguru','PT Halodoc','PT Alodokter',
'PT Waskita Karya','PT Wijaya Karya','PT Adhi Karya',
'PT Hutama Karya','PT PP Persero',
'PT Pertamina','PT PLN','PT Pupuk Indonesia',
'Startup Digital Nusantara','CV Maju Bersama',
'CV Sinar Teknologi','CV Data Nusantara'
  ],

  'Ekonomi': [
    'PT Telkom Indonesia','PT Indosat Ooredoo','PT XL Axiata',
'PT Smartfren Telecom','PT Huawei Indonesia','PT Nokia Indonesia',
'PT Astra International','PT Toyota Motor Manufacturing',
'PT Honda Prospect Motor','PT Mitsubishi Motors Indonesia',
'PT Unilever Indonesia','PT Nestle Indonesia','PT Mayora',
'PT Indofood','PT Wings Group','PT Garudafood',
'PT Bank Mandiri','PT BCA','PT BRI','PT BNI',
'PT CIMB Niaga','PT Danamon','PT Permata Bank',
'PT Pegadaian','PT BFI Finance','PT Adira Finance',
'PT Deloitte Indonesia','PT PwC Indonesia','PT EY Indonesia',
'PT KPMG Indonesia','PT Grant Thornton Indonesia',
'PT RSM Indonesia','PT BDO Indonesia',
'PT Accenture Indonesia','PT IBM Indonesia',
'PT Microsoft Indonesia','PT Google Indonesia',
'PT Amazon Web Services','PT Oracle Indonesia',
'PT Tokopedia','PT Shopee Indonesia','PT Bukalapak',
'PT Gojek Indonesia','PT Traveloka','PT Tiket.com',
'PT Ruangguru','PT Halodoc','PT Alodokter',
'PT Waskita Karya','PT Wijaya Karya','PT Adhi Karya',
'PT Hutama Karya','PT PP Persero',
'PT Pertamina','PT PLN','PT Pupuk Indonesia',
'Startup Digital Nusantara','CV Maju Bersama',
'CV Sinar Teknologi','CV Data Nusantara'
  ],

  'Administrasi Bisnis': [
    'PT Astra International',
    'PT Telkom Indonesia',
    'PT Unilever Indonesia'
  ],

  'Bisnis Digital': [
    'PT Tokopedia','PT Shopee Indonesia',
    'PT Bukalapak','PT Tiket.com'
  ],

  'Marketing': [
    'PT Mayora','PT Indofood',
    'PT Unilever Indonesia'
  ],

  'Keuangan': [
    'PT Bank Mandiri','PT BCA',
    'PT BRI','PT Pegadaian'
  ],

  'Perbankan': [
    'PT Bank Mandiri','PT BCA',
    'PT BRI','PT BNI'
  ],

  'Hukum': [
    'Kementerian Hukum dan HAM',
    'Mahkamah Agung',
    'Kantor Advokat'
  ],

  'Psikologi': [
    'PT Telkom Indonesia',
    'PT Unilever Indonesia',
    'HR Consulting Indonesia'
  ],

  'Ilmu Komunikasi': [
    'Metro TV','Kompas TV',
    'Trans Media','Detik.com'
  ],

  'Desain Komunikasi Visual': [
    'Creative Agency Indonesia',
    'PT Tokopedia',
    'PT Gojek Indonesia'
  ],

  'Multimedia': [
    'Production House Indonesia',
    'Kompas Gramedia',
    'Creative Studio'
  ],

  'Pendidikan Informatika': [
    'SMK Negeri','SMA Negeri',
    'Universitas Swasta'
  ],

  'Pendidikan Matematika': [
    'SMA Negeri','Bimbel Ruangguru',
    'Sekolah Swasta'
  ],

  'Kedokteran': [
    'RSUD','Rumah Sakit Siloam',
    'RS Mitra Keluarga'
  ],

  'Keperawatan': [
    'RSUD','RS Siloam',
    'RS Hermina'
  ],

  'Farmasi': [
    'Kimia Farma',
    'Kalbe Farma',
    'Dexa Medica'
  ]
};


const prodiPositionMap: Record<string, string[]> = {
  'Teknik Informatika': [
    'Software Engineer',
    'Backend Developer',
    'Frontend Developer',
    'Fullstack Developer',
    'Mobile Developer'
  ],

  'Sistem Informasi': [
    'Business Analyst',
    'System Analyst',
    'IT Consultant',
    'Project Manager'
  ],

  'Akuntansi': [
    'Accountant',
    'Auditor',
    'Finance Staff',
    'Tax Consultant'
  ],

  'Manajemen': [
    'Manager',
    'Supervisor',
    'Business Development',
    'Operations Manager'
  ],

  'Teknik Sipil': [
    'Site Engineer',
    'Project Engineer',
    'Civil Engineer'
  ],

  'Teknik Industri': [
    'Production Planner',
    'Quality Control',
    'Industrial Engineer'
  ],

  'Ilmu Komunikasi': [
    'Content Creator',
    'Public Relations',
    'Media Planner'
  ],

  'Desain Komunikasi Visual': [
    'UI UX Designer',
    'Graphic Designer',
    'Product Designer'
  ]
};

const samplePositions = [
  'Staff', 'Senior Staff', 'Manager', 'Supervisor', 'Assistant Manager',
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Fullstack Developer',
  'Mobile Developer', 'UI UX Designer', 'Product Designer', 'Product Manager',
  'Project Manager', 'Scrum Master', 'QA Engineer', 'Automation Tester',
  'DevOps Engineer', 'Cloud Engineer', 'System Administrator',
  'Data Analyst', 'Data Scientist', 'Data Engineer', 'Business Analyst',
  'Accountant', 'Auditor', 'Finance Staff', 'Financial Analyst',
  'HR Staff', 'HR Manager', 'Recruiter', 'Talent Acquisition',
  'Marketing Staff', 'Digital Marketing', 'SEO Specialist', 'Content Creator',
  'Social Media Specialist', 'Researcher', 'Lecturer', 'Teacher',
  'IT Support', 'Network Engineer', 'Cyber Security Analyst',
  'Customer Service', 'Operations Staff', 'Admin', 'Entrepreneur', 'Founder'
];

const sampleSources = [
  'LinkedIn', 'Facebook', 'Instagram', 'TikTok', 'Google', 'GitHub', 'ResearchGate',
  'Twitter', 'X', 'YouTube', 'Threads', 'Website Perusahaan', 'Portal Kampus',
  'Tracer Study Kampus', 'Alumni Group WhatsApp', 'Telegram', 'Email',
  'Google Scholar', 'Medium', 'Kaggle', 'Stack Overflow', 'Behance',
  'Dribbble', 'Personal Website', 'Company Profile', 'Jobstreet',
  'Glints', 'Kalibrr', 'TopKarir', 'KarirHub', 'Indeed'
];

const sampleCities = [
  'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Semarang', 'Malang',
  'Denpasar', 'Medan', 'Makassar', 'Palembang', 'Balikpapan',
  'Pontianak', 'Pekanbaru', 'Padang', 'Banjarmasin', 'Manado',
  'Kupang', 'Jayapura', 'Mataram', 'Ambon',
  'Tangerang', 'Bekasi', 'Depok', 'Bogor', 'Cimahi',
  'Solo', 'Kediri', 'Blitar', 'Pasuruan', 'Probolinggo',
  'Sidoarjo', 'Gresik', 'Mojokerto', 'Lamongan', 'Jember',
  'Banyuwangi', 'Tulungagung', 'Trenggalek', 'Ngawi', 'Madiun',
  'Cirebon', 'Tasikmalaya', 'Garut', 'Purwokerto', 'Tegal',
  'Batam', 'Bintan', 'Tarakan', 'Sorong', 'Palu'
];

  const generateMatches = (name: string, baseCompany?: string, baseAddress?: string, count = 2, baseScore = 65): VerificationMatch[] => {
    const matches: VerificationMatch[] = [];
    const baseCity = extractCityFromAddress(baseAddress);
    for (let i = 0; i < count; i++) {
      const sourcePool = ['LinkedIn', 'Website Perusahaan', 'Instagram', 'Facebook', 'TikTok', 'Jobstreet', 'Glints', 'Google'];
      const source = seededPick(sourcePool, hashString(`${name}|${baseCompany || ''}|${i}`));
      const parts = name.split(' ').filter(Boolean);
      const variationOptions = [
        name,
        parts.length > 1 ? `${parts[0]} ${parts.slice(-1)[0]}` : name,
        parts.map(p => p[0]).join('.'),
        parts.length > 1 ? `${parts[0]} ${parts.slice(-1)[0].slice(0,3)}` : name
      ];
      const variation = randomFrom(variationOptions);
      const company = i === 0 ? (baseCompany || randomFrom(sampleCompanies)) : randomFrom(sampleCompanies);
      const role = randomFrom(samplePositions);

      
      const citiesPool = [...sampleCities];
      for (let s = citiesPool.length - 1; s > 0; s--) {
        const r = Math.floor(Math.random() * (s + 1));
        const tmp = citiesPool[s];
        citiesPool[s] = citiesPool[r];
        citiesPool[r] = tmp;
      }
      const city = i === 0 && baseCity ? baseCity : citiesPool[i % citiesPool.length];
      const location = city; // region-only as requested
      const score = Math.max(30, Math.min(99, baseScore + Math.floor((Math.random() - 0.5) * 30)));
      const link = buildSourceLink(source, variation, company, hashString(`${variation}|${company}|${source}|${i}`));
      const evidence = buildSourceSpecificEvidence(source, variation, company, role, location, link, hashString(`${variation}|${company}|${source}|${i}`));

      matches.push({
        id: `m-${Date.now()}-${Math.random().toString(36).substr(2,5)}-${i}`,
        source,
        name: variation,
        affiliation: company,
        role,
        location,
        score,
        link,
        evidence
      });
    }
    return matches;
  };

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
          worker: true,
          complete: (results: any) => {
            const rows: any[] = results.data || [];

            
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

            const usedAddresses = new Set<string>();
            const nowIso = new Date().toISOString();
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

              const baseRecord = {
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
                lastUpdated: nowIso
              } as AlumniData;

              return buildTrackedProfile(baseRecord, usedAddresses, idx);
            });

            const recentActivities = mapped
              .filter(item => item.status !== 'Belum Ditemukan')
              .slice(0, 12)
              .map((item, idx) => ({
                id: `ACT-INIT-${idx}`,
                type: idx % 3 === 0 ? 'RESOLVE' : 'UPDATE',
                alumniId: item.id,
                alumniName: item.name,
                prodi: item.prodi,
                year: item.year,
                source: item.source,
                timestamp: new Date(Date.now() - (idx * 1000 * 60 * 17)).toISOString()
              }));

            const verificationPool = mapped
              .filter(item => item.status === 'Perlu Verifikasi')
              .slice(0, 80)
              .map((item, idx) => ({
                candidateId: item.id,
                matches: generateMatches(item.name, item.company, item.companyAddress, idx % 2 === 0 ? 2 : 3, 68 + (idx % 15))
              }));

            const foundCount = mapped.filter(item => item.status !== 'Belum Ditemukan').length;

            setActivities(recentActivities);
            setVerifications(verificationPool);
            setJobs([{
              id: 'JOB-AUTOLOAD-001',
              date: new Date().toLocaleString('id-ID'),
              status: 'Selesai',
              target: 'Auto-load seluruh data alumni',
              found: foundCount,
              total: mapped.length
            }]);
            setResults([]);
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

        const count = Math.random() > 0.6 ? 3 : 2;
        const baseScore = 65 + Math.floor(Math.random() * 15);
        const matches = generateMatches(name, undefined, undefined, count, baseScore);
        return [...prev, { candidateId: id, matches }];
      } else if (status !== 'Perlu Verifikasi' && exists) {
        return prev.filter(v => v.candidateId !== id);
      }
      return prev;
    });
  };

  
  const [results, setResults] = useState<TrackResult[]>([]);
  const [configMode, setConfigMode] = useState<'otomasi' | 'manual'>('otomasi');

  const runAutomation = (limit = 500) => {
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, '0')} Mar ${now.getFullYear()}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const usedCompanyAddresses = new Set(
      [...alumni, ...results]
        .map(item => item.companyAddress)
        .filter((address): address is string => Boolean(address && String(address).trim()))
    );
    const newJobId = `JOB-${Math.floor(Math.random() * 1000) + 1000}`;

    const untracked = alumni.filter(a => a.status === 'Belum Dilacak');
    const selected = untracked.slice(0, limit);

    addJob({ id: newJobId, date: dateStr, status: 'Proses', target: `Otomasi (${limit})`, found: 0, total: selected.length });

    
    setTimeout(() => {
      let foundCount = 0;
      const newResults: TrackResult[] = [];

      selected.forEach((a, idx) => {

  const score = Math.floor(Math.random() * 46) + 50;
        const handleBase = slugify(a.name).replace(/-/g, '').slice(0, 12);
        const linkedin = `https://linkedin.com/in/${slugify(a.name)}${Math.random() > 0.6 ? Math.floor(Math.random()*90 + 10) : ''}`;
        const instagram = `https://instagram.com/${handleBase}${Math.floor(Math.random()*900 + 100)}`;
        const facebook = `https://facebook.com/${handleBase}${Math.floor(Math.random()*900 + 100)}`;
        const tiktok = `https://tiktok.com/@${handleBase}${Math.floor(Math.random()*900 + 100)}`;
        const email = genEmail(a.name, a.nim);
        const phone = genPhone();
        let company = randomFrom(sampleCompanies);
        if (a.prodi && prodiCompanyMap[a.prodi]) {
          company = randomFrom(prodiCompanyMap[a.prodi]);
        }
        const companyAddress = buildUniqueCompanyAddress(usedCompanyAddresses, `${a.id}|${a.name}|${idx}`, company);
        let position = randomFrom(samplePositions);
        if (a.prodi && prodiPositionMap[a.prodi]) {
          position = randomFrom(prodiPositionMap[a.prodi]);
        }
        const generatedProfile = inferCompanyProfile(company);
        const jobType = generatedProfile.defaultJobType || seededPick(['Swasta', 'PNS', 'Wirausaha', 'BUMN/BUMD', 'Pendidikan', 'Kesehatan', 'Profesional', 'Kontrak'], hashString(`${a.id}|${company}|jobtype`));

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
          // create 2-3 generated matches for manual verification
          setVerifications(prev => {
            const exists = prev.some(v => v.candidateId === a.id);
            if (exists) return prev;
            const count = Math.random() > 0.6 ? 3 : 2;
            const matches = generateMatches(a.name, company, companyAddress, count, score);
            return [...prev, { candidateId: a.id, matches }];
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

  const confirmVerificationMatch = (candidateId: string, match: VerificationMatch) => {
    // Update alumni record with chosen match data and mark as Teridentifikasi
    updateAlumni(candidateId, {
      status: 'Teridentifikasi',
      source: match.source,
      company: match.affiliation,
      companyAddress: match.location,
      position: match.role,
      linkedin: match.link
    });

    // Update any result rows that correspond to this alumni
    setResults(prev => prev.map(r => {
      if (r.alumniId === candidateId) {
        return {
          ...r,
          company: match.affiliation,
          companyAddress: match.location,
          position: match.role,
          linkedin: match.link,
          score: match.score,
          timestamp: new Date().toISOString()
        };
      }
      return r;
    }));

    setVerifications(prev => prev.filter(v => v.candidateId !== candidateId));

    addActivity({ type: 'RESOLVE', alumniId: candidateId, alumniName: match.name, prodi: '', year: '', source: match.source });
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
    <AppContext.Provider value={{ alumni, activities, jobs, verifications, addAlumni, updateAlumni, resolveVerification, addJob, updateJob, runScheduler, runAutomation, results, confirmResult, confirmVerificationMatch, configMode, setConfigMode, csvLoading, csvError, csvLoaded }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
