import { useState, useRef, useEffect } from 'react';
import logo from "./asset/images.png";
import {
  LayoutDashboard,
  Users,
  Activity,
  CheckCircle,
  CheckCircle2,
  Download,
  Settings,
  AlertCircle,
  LoaderCircle,
  LogOut,
  User
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Alumni from './pages/Alumni';
import Jobs from './pages/Jobs';
import Verification from './pages/Verification';
import Profile from './pages/Profile';
import Login from './pages/Login';
import SettingsPage from './pages/Settings';
import { AppProvider, useAppContext } from './context/AppContext';
import { downloadTrackedAlumniXlsx } from './utils/exportTrackedAlumni';

function AuthenticatedApp({ onLogout }: { onLogout: () => void }) {
  const { alumni, csvLoading, csvLoaded, csvError } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeAlumniId, setActiveAlumniId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDataNotice, setShowDataNotice] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const wasLoadingRef = useRef(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (csvLoading) {
      setShowDataNotice(true);
      wasLoadingRef.current = true;
    }
  }, [csvLoading]);

  useEffect(() => {
    if (csvError) {
      setShowDataNotice(true);
    }
  }, [csvError]);

  useEffect(() => {
    if (!csvLoading && csvLoaded && wasLoadingRef.current) {
      setShowDataNotice(true);
      const timeoutId = window.setTimeout(() => {
        setShowDataNotice(false);
      }, 2000);
      wasLoadingRef.current = false;
      return () => window.clearTimeout(timeoutId);
    }
    return undefined;
  }, [csvLoading, csvLoaded]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigateToProfile={(id) => { setActiveAlumniId(id); setActiveTab('profile'); }} />;
      case 'alumni':
        return <Alumni onNavigateToProfile={(id) => { setActiveAlumniId(id); setActiveTab('profile'); }} />;
      case 'jobs':
        return <Jobs />;
      case 'verification':
        return <Verification />;
      case 'profile':
        if (activeAlumniId) {
          return <Profile alumniId={activeAlumniId} goBack={() => setActiveTab('alumni')} />;
        }
        return <Alumni onNavigateToProfile={(id) => { setActiveAlumniId(id); setActiveTab('profile'); }} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard onNavigateToProfile={(id) => { setActiveAlumniId(id); setActiveTab('profile'); }} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'alumni', label: 'Data Alumni', icon: Users },
    { id: 'jobs', label: 'Scheduler', icon: Activity },
    { id: 'verification', label: 'Verifikasi', icon: CheckCircle },
  ];

  const handleExportXlsx = () => {
    downloadTrackedAlumniXlsx(alumni, 'hasil_pelacakan_alumni.xlsx');
  };

  const noticeTone = csvError
    ? 'error'
    : csvLoading
      ? 'loading'
      : csvLoaded
        ? 'success'
        : 'loading';

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] text-[#111111] font-sans selection:bg-black selection:text-white pt-12">
      <div className="fixed top-0 left-0 right-0 h-12 bg-[#1f1f1f] text-white flex items-center justify-center z-50">
        <div className="text-xs font-medium tracking-wide">UMM Alumni Trace</div>
      </div>

      {showDataNotice && (
        <div className="fixed top-16 left-1/2 z-[60] w-[360px] max-w-[calc(100vw-2rem)] -translate-x-1/2 animate-in fade-in slide-in-from-top-2 duration-300">
          <div
            className={`rounded-2xl border px-5 py-4 shadow-lg backdrop-blur-sm ${
              noticeTone === 'success'
                ? 'border-green-200 bg-green-50 text-green-700'
                : noticeTone === 'error'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-amber-200 bg-amber-50 text-amber-700'
            }`}
          >
            <div className="flex items-start gap-3">
              {noticeTone === 'success' ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" />
              ) : noticeTone === 'error' ? (
                <AlertCircle className="mt-0.5 h-5 w-5 flex-none" />
              ) : (
                <LoaderCircle className="mt-0.5 h-5 w-5 flex-none animate-spin" />
              )}
              <div className="space-y-1.5">
                <p className="text-sm font-semibold">
                  {noticeTone === 'success'
                    ? 'Data alumni selesai dimuat'
                    : noticeTone === 'error'
                      ? 'Gagal memuat data alumni'
                      : 'Data alumni sedang digenerate'}
                </p>
                <p className="text-sm">
                  {noticeTone === 'success'
                    ? 'Semua fitur sudah siap dipakai. Notifikasi ini akan hilang otomatis dalam 2 detik.'
                    : noticeTone === 'error'
                      ? `Terjadi kendala saat memuat data: ${csvError}`
                      : 'Mohon tunggu sebentar. Sistem sedang memproses data pelacakan agar website bisa digunakan dengan normal.'}
                </p>
                {noticeTone === 'loading' && (
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-amber-100">
                    <div className="h-full w-1/3 animate-[pulse_1.4s_ease-in-out_infinite] rounded-full bg-amber-500" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <aside className="w-64 border-r border-[#EAEAEA] bg-white flex flex-col justify-between">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-[#EAEAEA]">
            <div className="flex items-center gap-2 font-semibold tracking-tight text-lg">
              <img src={logo} alt="UMM Logo" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
              UMM Trace
            </div>
          </div>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === item.id || (activeTab === 'profile' && item.id === 'alumni')
                    ? 'bg-black text-white'
                    : 'text-[#666666] hover:bg-[#F5F5F5] hover:text-black'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-[#EAEAEA] space-y-2">
          <button
            onClick={handleExportXlsx}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium bg-black rounded-md hover:bg-green-900 transition-colors text-white hover:text-white"
          >
            <Download className="w-4 h-4" />
            Export XLSX
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'settings'
                ? 'bg-black text-white'
                : 'text-[#666666] hover:bg-[#F5F5F5] hover:text-black'
            }`}
          >
            <Settings className="w-4 h-4" />
            Pengaturan
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-[#EAEAEA] bg-white flex items-center justify-between px-8 relative z-10">
          <h1 className="text-sm font-medium text-[#666666]">
            {activeTab === 'profile' ? 'Profil Alumni' :
             activeTab === 'settings' ? 'Pengaturan' :
             navItems.find(item => item.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-8 h-8 rounded-full bg-[#EAEAEA] border border-[#CCCCCC] flex items-center justify-center text-xs font-semibold hover:bg-[#DEDEDE] transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
            >
              AD
            </button>

            {isDropdownOpen && (
              <div className="absolute top-10 right-0 mt-2 w-56 bg-white border border-[#EAEAEA] rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-[#EAEAEA] bg-[#FAFAFA]">
                  <p className="text-sm font-medium text-black">admin@gmail.com</p>
                  <p className="text-xs text-[#666666] mt-0.5">Admin Dashboard</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => { setActiveTab('settings'); setIsDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#666666] hover:bg-[#F5F5F5] hover:text-black rounded-md transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => { onLogout(); setIsDropdownOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <AppProvider>
      <AuthenticatedApp onLogout={() => setIsAuthenticated(false)} />
    </AppProvider>
  );
}
