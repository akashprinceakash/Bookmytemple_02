import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronDown, LogOut, ShieldCheck, Building2, Menu } from 'lucide-react';
import { DEMO_USERS } from '../data/authUsers';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onToggleMobileMenu }) => {
  const { 
    role, 
    setRole, 
    currentUser, 
    currentTemple, 
    switchUser, 
    logout 
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Handle switching role via the segmented pill in the screenshot
  const handleToggleRole = (newRole: 'TEMPLE_ADMIN' | 'BMT_ADMIN') => {
    if (newRole === role) return;
    
    // Find a matching demo user for smooth context switch
    const defaultUser = newRole === 'BMT_ADMIN'
      ? DEMO_USERS.find(u => u.role === 'BMT_ADMIN')
      : DEMO_USERS.find(u => u.role === 'TEMPLE_ADMIN');

    if (defaultUser) {
      switchUser(defaultUser);
    } else {
      setRole(newRole);
    }
  };

  const displaySubtitle = subtitle || (role === 'TEMPLE_ADMIN' ? 'Temple Admin Portal' : 'BMT Operations Portal');

  // Avatar text like 'SV' in screenshot
  const avatarText = currentUser?.avatarText || (role === 'TEMPLE_ADMIN' ? 'SV' : 'BA');

  return (
    <header className="px-3.5 sm:px-6 lg:px-8 py-3.5 sm:py-5 flex items-center justify-between border-b border-slate-200/80 bg-white/80 backdrop-blur-sm sticky top-0 z-30 gap-2 sm:gap-4">
      
      {/* Left: Mobile Drawer Trigger + Title */}
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        {onToggleMobileMenu && (
          <button
            id="btn-mobile-sidebar-toggle"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 -ml-1.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
            {displaySubtitle}
          </p>
          <h1 className="text-base sm:text-2xl lg:text-3xl font-serif font-semibold text-slate-900 tracking-tight mt-0.5 truncate">
            {title}
          </h1>
        </div>
      </div>

      {/* Right Controls: Segmented Role Pill & Avatar */}
      <div className="flex items-center space-x-2 sm:space-x-3.5 shrink-0">
        
        {/* Role Toggle Pill matching screenshot */}
        <div 
          id="role-segmented-switcher"
          className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200/90 shadow-inner"
        >
          <button
            id="btn-role-temple-team"
            onClick={() => handleToggleRole('TEMPLE_ADMIN')}
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              role === 'TEMPLE_ADMIN'
                ? 'bg-[#0B1528] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="hidden xs:inline sm:inline">Temple Team</span>
            <span className="inline xs:hidden sm:hidden">Temple</span>
          </button>

          <button
            id="btn-role-bmt-admin"
            onClick={() => handleToggleRole('BMT_ADMIN')}
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
              role === 'BMT_ADMIN'
                ? 'bg-[#0B1528] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="hidden xs:inline sm:inline">BMT Admin</span>
            <span className="inline xs:hidden sm:hidden">BMT</span>
          </button>
        </div>

        {/* User Avatar Circle matching screenshot */}
        <div className="relative shrink-0">
          <button
            id="btn-header-avatar"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            title="User Profile & Accounts"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0B1528] text-white flex items-center justify-center font-serif text-xs font-bold shadow hover:ring-2 hover:ring-slate-300 transition cursor-pointer"
          >
            {avatarText}
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-slate-800 text-xs">
              <div className="pb-2 border-b border-slate-100 mb-2">
                <p className="font-semibold text-slate-900">
                  {currentUser?.name || 'Authorized Official'}
                </p>
                <p className="text-[11px] text-slate-500 font-mono truncate">
                  {currentUser?.email || 'admin@bookmytemples.com'}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                  {role === 'BMT_ADMIN' ? 'BMT Central Superadmin' : (currentTemple?.name || 'Temple Admin')}
                </span>
              </div>

              <div className="space-y-1 mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  Quick Switch:
                </p>
                {DEMO_USERS.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u);
                      setIsProfileOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition ${
                      currentUser?.id === u.id 
                        ? 'bg-slate-100 font-semibold text-slate-900' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{u.name}</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {u.role === 'BMT_ADMIN' ? 'BMT' : 'Temple'}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                  className="w-full py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 transition flex items-center justify-center space-x-1.5 cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
