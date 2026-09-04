import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../data/authUsers';
import { AuthUser, UserRole } from '../../types';
import { ShieldCheck, Building2, ArrowRight, Lock, Mail, KeyRound, Info } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, temples } = useApp();

  const [activeTab, setActiveTab] = useState<'quick' | 'credentials'>('quick');
  const [emailInput, setEmailInput] = useState<string>('admin@bookmytemples.com');
  const [passwordInput, setPasswordInput] = useState<string>('••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('BMT_ADMIN');
  const [selectedTempleId, setSelectedTempleId] = useState<string>('temple-kashi');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleQuickLogin = (user: AuthUser) => {
    login(user);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }

    // Check if matching demo user
    const matchedUser = DEMO_USERS.find(u => u.email.toLowerCase() === emailInput.trim().toLowerCase());
    if (matchedUser) {
      login(matchedUser);
      return;
    }

    // Otherwise construct custom auth user with chosen role & temple
    const assignedTemple = temples.find(t => t.id === selectedTempleId);
    const customUser: AuthUser = {
      id: `custom-user-${Date.now()}`,
      name: emailInput.split('@')[0],
      email: emailInput.trim(),
      role: selectedRole,
      templeId: selectedRole === 'TEMPLE_ADMIN' ? selectedTempleId : undefined,
      templeName: selectedRole === 'TEMPLE_ADMIN' ? (assignedTemple?.name || 'Assigned Temple') : undefined,
      designation: selectedRole === 'BMT_ADMIN' ? 'Platform Operations Officer' : 'Temple Operations Officer',
      avatarText: emailInput.slice(0, 2).toUpperCase(),
    };

    login(customUser);
  };

  const bmtUsers = DEMO_USERS.filter(u => u.role === 'BMT_ADMIN');
  const templeUsers = DEMO_USERS.filter(u => u.role === 'TEMPLE_ADMIN');

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between font-sans antialiased">
      
      {/* Top Brand Bar */}
      <header className="border-b border-slate-200 bg-white py-4 px-6 sm:px-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            {/* Sacred Golden Kalash Emblem in Navy Box */}
            <div className="w-9 h-9 rounded-xl bg-[#0B1528] flex items-center justify-center text-[#F59E0B] shadow-sm">
              <svg 
                className="w-5 h-5 text-[#F59E0B]" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.75" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 2L8 6H16L12 2Z" fill="#F59E0B" fillOpacity="0.2" />
                <path d="M6 6L4 10H20L18 6H6Z" />
                <path d="M3 10L2 15H22L21 10H3Z" />
                <path d="M2 15L1 21H23L22 15H2Z" />
                <path d="M10 21V16H14V21" />
                <circle cx="12" cy="3" r="0.75" fill="#F59E0B" />
              </svg>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-lg font-bold tracking-tight text-slate-900">
                  BookMyTemples
                </span>
                <span className="text-[10px] font-mono tracking-wider text-slate-600 uppercase bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  RBAC Gate
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Role-Gated Backend Operations</span>
          </div>

        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm">
          
          {/* Header / Intro */}
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3 border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              <span>Authorized Personnel Only</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
              Portal Authentication Desk
            </h1>
            
            <p className="text-sm text-slate-500 mt-2">
              Select your role profile below to access either Central BMT Operations or your designated Temple Sanctum.
            </p>
          </div>

          {/* Navigation Tabs between Quick Role Demo & Manual Credentials */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 inline-flex">
              <button
                id="tab-login-quick"
                onClick={() => { setActiveTab('quick'); setErrorMsg(''); }}
                className={`px-5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'quick'
                    ? 'bg-[#0B1528] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Role Profiles (Quick Demo Access)
              </button>
              <button
                id="tab-login-credentials"
                onClick={() => { setActiveTab('credentials'); setErrorMsg(''); }}
                className={`px-5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'credentials'
                    ? 'bg-[#0B1528] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Custom Credentials
              </button>
            </div>
          </div>

          {/* Tab 1: Quick Role Selection */}
          {activeTab === 'quick' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Column 1: BMT Platform Admin Users */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#0B1528] text-white flex items-center justify-center font-bold shadow-sm">
                        <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                          BMT Platform Admin
                        </h2>
                        <p className="text-[11px] text-slate-500">Centralized Super Admin Desk</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      All Temples
                    </span>
                  </div>

                  <div className="my-3 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80">
                    <p className="font-semibold text-slate-800 mb-1">Provides access to:</p>
                    <ul className="space-y-1 text-[11px] text-slate-500 list-disc list-inside">
                      <li>Unified Platform GMV & Revenue Analytics</li>
                      <li>Offering Approvals Queue & Compliance</li>
                      <li>Multi-Temple Settlement Batches & Payouts</li>
                      <li>Temple Trust Onboarding & Full Audit Log</li>
                    </ul>
                  </div>

                  <div className="space-y-2 mt-4">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Select Demo Admin Profile:
                    </p>
                    {bmtUsers.map((user) => (
                      <button
                        key={user.id}
                        id={`quick-login-${user.id}`}
                        onClick={() => handleQuickLogin(user)}
                        className="w-full text-left p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition group flex items-center justify-between shadow-xs cursor-pointer"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-[#0B1528] text-white flex items-center justify-center font-serif text-xs font-bold shrink-0 shadow-sm">
                            {user.avatarText}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 group-hover:text-blue-900">
                              {user.name}
                            </p>
                            <p className="text-[11px] text-slate-500">{user.designation}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-slate-600 group-hover:text-slate-900 font-semibold">
                          <span>Sign In</span>
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-500 flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Unconstrained platform governance across all temples.</span>
                </div>
              </div>

              {/* Column 2: Temple Teams Users */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#0B1528] text-white flex items-center justify-center font-bold shadow-sm">
                        <Building2 className="w-4 h-4 text-[#F59E0B]" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                          Temple Teams
                        </h2>
                        <p className="text-[11px] text-slate-500">Scoped Sanctum Operations</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      Scoped Temple
                    </span>
                  </div>

                  <div className="my-3 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80">
                    <p className="font-semibold text-slate-800 mb-1">Provides access to:</p>
                    <ul className="space-y-1 text-[11px] text-slate-500 list-disc list-inside">
                      <li>Sanctum Seva Bookings, Gotra, & Devotee Sankalpas</li>
                      <li>Daily Priest Ritual Roster & Fulfillment Desk</li>
                      <li>Offering Catalogue Submissions & Scheduling</li>
                      <li>Disbursed Settlements & Bank UTR Statements</li>
                    </ul>
                  </div>

                  <div className="space-y-2 mt-4 max-h-[220px] overflow-y-auto pr-1">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      Select Temple Administrator Profile:
                    </p>
                    {templeUsers.map((user) => (
                      <button
                        key={user.id}
                        id={`quick-login-${user.id}`}
                        onClick={() => handleQuickLogin(user)}
                        className="w-full text-left p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 transition group flex items-center justify-between shadow-xs cursor-pointer"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-9 h-9 rounded-full bg-[#0B1528] text-white flex items-center justify-center font-serif text-xs font-bold shrink-0 shadow-sm">
                            {user.avatarText}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 group-hover:text-blue-900 truncate">
                              {user.name}
                            </p>
                            <p className="text-[11px] text-slate-600 font-medium truncate">
                              {user.templeName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono truncate">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-slate-600 group-hover:text-slate-900 font-semibold shrink-0 ml-2">
                          <span>Sign In</span>
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-slate-500 flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Strictly isolated to devotee bookings and sevas of the logged-in temple.</span>
                </div>
              </div>

            </div>
          ) : (
            /* Tab 2: Manual Credentials Form */
            <form onSubmit={handleCredentialsSubmit} className="max-w-lg mx-auto bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
              
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                  <Info className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Email input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="login-email"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@bookmytemples.com"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Password input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    id="login-password"
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Demo security bypass active: any password will be accepted.
                </p>
              </div>

              {/* Target Role Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Access Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    id="btn-role-bmt"
                    onClick={() => setSelectedRole('BMT_ADMIN')}
                    className={`p-3 rounded-xl text-left border transition cursor-pointer ${
                      selectedRole === 'BMT_ADMIN'
                        ? 'bg-[#0B1528] border-[#0B1528] text-white font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-xs">BMT Admin</span>
                    </div>
                    <p className={`text-[10px] mt-1 ${selectedRole === 'BMT_ADMIN' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Platform Operations
                    </p>
                  </button>

                  <button
                    type="button"
                    id="btn-role-temple"
                    onClick={() => setSelectedRole('TEMPLE_ADMIN')}
                    className={`p-3 rounded-xl text-left border transition cursor-pointer ${
                      selectedRole === 'TEMPLE_ADMIN'
                        ? 'bg-[#0B1528] border-[#0B1528] text-white font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4" />
                      <span className="text-xs">Temple Team</span>
                    </div>
                    <p className={`text-[10px] mt-1 ${selectedRole === 'TEMPLE_ADMIN' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Sanctum Access
                    </p>
                  </button>
                </div>
              </div>

              {/* If Temple Team, Temple Assignment Dropdown */}
              {selectedRole === 'TEMPLE_ADMIN' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Assigned Temple Sanctum
                  </label>
                  <select
                    id="login-temple-select"
                    value={selectedTempleId}
                    onChange={(e) => setSelectedTempleId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  >
                    {temples.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.city}, {t.state})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Submit button */}
              <button
                id="btn-submit-login"
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-[#0B1528] text-white hover:bg-[#162744] font-semibold text-xs transition shadow flex items-center justify-center space-x-2 mt-4 cursor-pointer"
              >
                <span>Authenticate & Enter Portal</span>
                <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
              </button>

            </form>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        <p>
          BookMyTemples &copy; {new Date().getFullYear()} &bull; Enterprise Sanctum Operations &bull; Strict Role Isolation Enforced
        </p>
      </footer>

    </div>
  );
};
