import React, { useState } from 'react';
import { Github, Key, AlertCircle, CheckCircle2, LoaderCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

import logo from "../asset/images.png";

interface LoginProps {
  onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
  const { csvLoading, csvLoaded, csvError } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const appReady = csvLoaded && !csvLoading && !csvError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appReady) {
      setError('Data alumni masih diproses. Harap tunggu beberapa detik sampai website siap dipakai.');
      return;
    }
    if (email === 'admin@gmail.com' && password === 'admin12345') {
      onLogin();
    } else {
      setError('Email atau password salah.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-black">
      {/* Header */}
      <header className="flex justify-between items-center p-6 ">
        <div className="flex items-center gap-2 font-semibold tracking-tight text-lg">
          <img src={logo} alt="UMM Logo" className="w-6 h-6 object-contain" referrerPolicy="no-referrer" />
          UMM Trace
        </div>
        <button 
          disabled
          className="px-4 py-2 text-sm font-medium border border-[#EAEAEA] rounded-md text-[#666666] bg-[#FAFAFA] cursor-not-allowed"
        >
          Sign Up
        </button>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[400px] space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">Log in ke UMM Trace</h1>
              <p className="text-sm text-[#666666]">
                Sistem Pelacakan Alumni Universitas Muhammadiyah Malang
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-[#EAEAEA] rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!appReady}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  appReady
                    ? 'bg-black text-white hover:bg-[#333333]'
                    : 'bg-[#D9D9D9] text-[#666666] cursor-not-allowed'
                }`}
              >
                Continue with Email
              </button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#EAEAEA]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-[#666666]">or</span>
              </div>
            </div>

            <div className="space-y-3">
              <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium border border-[#EAEAEA] rounded-md hover:bg-[#FAFAFA] transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
              <button type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium border border-[#EAEAEA] rounded-md hover:bg-[#FAFAFA] transition-colors">
                <Github className="w-5 h-5" />
                Continue with GitHub
              </button>
            </div>

            <div className="p-4 bg-[#F5F5F5] border border-[#EAEAEA] rounded-md text-sm text-[#666666] space-y-2">
              <p className="font-medium text-black flex items-center gap-2">
                <Key className="w-4 h-4" /> Catatan Login:
              </p>
              <p>Email: <span className="font-mono text-black">admin@gmail.com</span></p>
              <p>Password: <span className="font-mono text-black">admin12345</span></p>
            </div>
          </div>

        <div className="mt-8 w-full max-w-[420px] lg:mt-0 lg:absolute lg:right-6 xl:right-12 2xl:right-20 lg:top-1/2 lg:-translate-y-1/2">
            <div
              className={`rounded-2xl border px-5 py-5 text-sm shadow-sm ${
                appReady
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              <div className="flex items-start gap-3">
                {appReady ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" />
                ) : csvLoading ? (
                  <LoaderCircle className="mt-0.5 h-5 w-5 flex-none animate-spin" />
                ) : (
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-none" />
                )}
                <div className="space-y-1.5">
                  <p className="font-medium">
                    {appReady ? 'Anda sudah bisa masuk, silahkan login' : 'Website tidak bisa dipencet? harap tunggu beberapa detik'}
                  </p>
                  <p className={appReady ? 'text-green-600' : 'text-red-600'}>
                    {appReady
                      ? 'Status siap. Data alumni sudah selesai digenerate dan website sudah bisa dipakai.'
                      : 'Notifikasi ini akan berubah hijau jika website sudah bisa dipencet.'}
                  </p>
                  {csvError && (
                    <p className="text-red-600">
                      Gagal memuat data: {csvError}
                    </p>
                  )}
                </div>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
}
