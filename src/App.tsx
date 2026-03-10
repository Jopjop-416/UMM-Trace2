import { useState, useRef, useEffect } from 'react';
const logo = 'src/asset/images.png';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  CheckCircle, 
  Settings,
  Search,
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
import { AppProvider } from './context/AppContext';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeAlumniId, setActiveAlumniId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
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
        return <Dashboard />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'alumni', label: 'Data Alumni', icon: Users },
    { id: 'jobs', label: 'Scheduler', icon: Activity },
    { id: 'verification', label: 'Verifikasi', icon: CheckCircle },
  ];

  return (
        <div className="flex h-screen w-full bg-[#FAFAFA] text-[#111111] font-sans selection:bg-black selection:text-white pt-12">
      {/* Top persistent bar */}
      <div className="fixed top-0 left-0 right-0 h-12 bg-[#1f1f1f] text-white flex items-center justify-center z-50">
        <div className="text-xs font-medium tracking-wide">UMM Alumni Trace</div>
      </div>
      {/* Sidebar */}
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
        <div className="p-4 border-t border-[#EAEAEA]">
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

      {/* Main Content */}
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

            {/* Dropdown Menu */}
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
                    onClick={() => { setIsAuthenticated(false); setIsDropdownOpen(false); }}
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
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
