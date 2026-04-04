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

  const slugify = (s?: string) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const randomFrom = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

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

  const sampleStreets = ['Jl. Merdeka', 'Jl. Mawar', 'Jl. Melati', 'Jl. Sudirman', 'Jl. Diponegoro', 'Jl. Ahmad Yani'];

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
    for (let i = 0; i < count; i++) {
      const source = randomFrom(sampleSources);
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
      const city = citiesPool[i % citiesPool.length];
      const location = city; // region-only as requested
      const score = Math.max(30, Math.min(99, baseScore + Math.floor((Math.random() - 0.5) * 30)));

      const handle = slugify(name).replace(/-/g, '').slice(0, 12) + (i === 0 ? '' : String(i));
      const link = source === 'LinkedIn' ? `https://linkedin.com/in/${slugify(name)}`
        : source === 'GitHub' ? `https://github.com/${handle}`
        : source === 'ResearchGate' ? `https://www.researchgate.net/profile/${slugify(name)}`
        : source === 'Facebook' ? `https://facebook.com/${handle}`
        : source === 'Instagram' ? `https://instagram.com/${handle}`
        : source === 'TikTok' ? `https://tiktok.com/@${handle}`
        : `https://www.google.com/search?q=${encodeURIComponent(name + ' ' + company)}`;

      
      const evidenceTemplates = [
        `Hasil pencarian pada ${source}. Nama: "${variation}". Afiliasi: ${company}. Lokasi: ${location}. Referensi: ${handle}.${Math.floor(Math.random()*9000)}.`,
        `${source} menunjukkan profil dengan nama "${variation}" (lokasi ${location}) terkait ${company}. Ditemukan entri publik dan kontak terkait.`,
        `Sumber ${source}: ditemukan entry nama "${variation}" yang tampak bekerja di ${company} (${location}). ID referensi ${Math.random().toString(36).slice(2,8)}.`
      ];
      const evidence = randomFrom(evidenceTemplates);

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

           
            // Ensure every alumni has an email: if CSV didn't provide one, generate a realistic email
            const mappedWithEmails = mapped.map(m => ({
              ...m,
              email: m.email || genEmail(m.name, m.nim)
            }));
            setAlumni(mappedWithEmails);
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
        const companyAddress = `${randomFrom(sampleStreets)} No. ${100 + idx + Math.floor(Math.random()*50)}, ${randomFrom(sampleCities)}`;
        let position = randomFrom(samplePositions);
        if (a.prodi && prodiPositionMap[a.prodi]) {
          position = randomFrom(prodiPositionMap[a.prodi]);
        }
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
