import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutGrid, 
  Calendar, 
  CreditCard, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  ChevronDown, 
  LogOut,
  User,
  Check,
  X
} from 'lucide-react';
import { DEMO_USERS } from '../data/authUsers';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const { 
    role, 
    currentUser, 
    currentTemple, 
    temples, 
    activeTempleId, 
    setActiveTempleId, 
    offerings, 
    logout,
    switchUser
  } = useApp();

  const [isTempleDropdownOpen, setIsTempleDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const pendingApprovalsCount = offerings.filter(o => o.approvalStatus === 'pending_approval').length;

  const handleNavClick = (tab: string) => {
    onSelectTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden transition-opacity duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Drawer on mobile/tablet, persistent on lg+) */}
      <aside 
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] lg:static lg:w-64 bg-[#0B1528] text-slate-300 flex flex-col justify-between shrink-0 min-h-screen border-r border-[#162544] select-none transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Section */}
        <div className="flex flex-col">
          
          {/* Brand Logo matching screenshot */}
          <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-5 border-b border-[#14233F] relative">
            
            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#162744] transition cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start space-x-3 pr-8 lg:pr-0">
            {/* Sacred Golden Kalash / Temple Icon */}
            <div className="w-8 h-8 rounded-lg bg-[#122240] border border-[#F59E0B]/40 flex items-center justify-center text-[#F59E0B] shrink-0 mt-0.5 shadow-sm">
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
              <h1 className="font-serif text-lg font-bold text-white tracking-wide leading-tight">
                BookMyTemples
              </h1>
              <span className="text-xs font-serif font-bold text-[#F59E0B] tracking-wider block">
                Admin
              </span>
            </div>
          </div>

          {/* Temple Identifier Section */}
          <div className="mt-5 relative">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
              {role === 'BMT_ADMIN' ? 'CENTRAL OPERATIONS' : 'TEMPLE'}
            </span>

            {role === 'TEMPLE_ADMIN' ? (
              <div>
                <button
                  id="btn-sidebar-temple-switch"
                  onClick={() => setIsTempleDropdownOpen(!isTempleDropdownOpen)}
                  className="w-full text-left flex items-center justify-between text-sm font-semibold text-white hover:text-blue-200 transition group py-0.5"
                >
                  <span className="truncate pr-1">
                    {currentTemple?.name || 'Sri Venkateswara Temple'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition shrink-0 ${isTempleDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown to switch active temple */}
                {isTempleDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-[#0F1E38] border border-[#1E3A68] rounded-xl shadow-2xl p-1.5 z-50 max-h-56 overflow-y-auto">
                    <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Temple Sanctum:
                    </p>
                    {temples.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setActiveTempleId(t.id);
                          setIsTempleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                          t.id === activeTempleId 
                            ? 'bg-[#1E3A8A] text-white font-bold' 
                            : 'text-slate-300 hover:bg-[#162747] hover:text-white'
                        }`}
                      >
                        <span className="truncate">{t.name}</span>
                        {t.id === activeTempleId && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm font-semibold text-white">
                BookMyTemples Central HQ
              </p>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-4 space-y-1">
          {role === 'TEMPLE_ADMIN' ? (
            <>
              <button
                id="nav-temple-dashboard"
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  currentTab === 'dashboard'
                    ? 'bg-[#162744] text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-[#101D36]'
                }`}
              >
                <LayoutGrid className="w-4 h-4 shrink-0" />
                <span>Dashboard</span>
              </button>

              <button
                id="nav-temple-bookings"
                onClick={() => handleNavClick('bookings')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  currentTab === 'bookings'
                    ? 'bg-[#162744] text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-[#101D36]'
                }`}
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Bookings</span>
              </button>

              <button
                id="nav-temple-settlements"
                onClick={() => handleNavClick('settlements')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  currentTab === 'settlements'
                    ? 'bg-[#162744] text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-[#101D36]'
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>Settlements</span>
              </button>

              <button
                id="nav-temple-offerings"
                onClick={() => handleNavClick('offerings')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  currentTab === 'offerings'
                    ? 'bg-[#162744] text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-[#101D36]'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Offerings</span>
              </button>
            </>
          ) : (
            <>
              <button
                id="nav-bmt-dashboard"
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  currentTab === 'dashboard'
                    ? 'bg-[#162744] text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-[#101D36]'
                }`}
              >
                <LayoutGrid className="w-4 h-4 shrink-0" />
                <span>Dashboard</span>
              </button>

              <button
                id="nav-bmt-settlements"
                onClick={() => handleNavClick('settlements')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  currentTab === 'settlements'
                    ? 'bg-[#162744] text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-[#101D36]'
                }`}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>Settlements</span>
              </button>

              <button
                id="nav-bmt-approvals"
                onClick={() => handleNavClick('approvals')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  currentTab === 'approvals'
                    ? 'bg-[#162744] text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-[#101D36]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>Offerings</span>
                </div>
                {pendingApprovalsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F59E0B] text-slate-950">
                    {pendingApprovalsCount}
                  </span>
                )}
              </button>

              <button
                id="nav-bmt-temples"
                onClick={() => handleNavClick('temples')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  currentTab === 'temples'
                    ? 'bg-[#162744] text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-[#101D36]'
                }`}
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <span>Temple Network</span>
              </button>

              <button
                id="nav-bmt-audit"
                onClick={() => handleNavClick('audit')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  currentTab === 'audit'
                    ? 'bg-[#162744] text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-[#101D36]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Audit Trail</span>
              </button>
            </>
          )}
        </nav>

      </div>

      {/* Bottom User Profile Section */}
      <div className="p-3 border-t border-[#14233F] relative">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-[#101D36] transition">
          <button
            id="btn-sidebar-user-menu"
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            className="flex items-center space-x-2.5 text-left flex-1 min-w-0 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#162744] border border-[#233B66] text-[#F59E0B] flex items-center justify-center text-xs font-serif font-bold shrink-0">
              {currentUser?.avatarText || (role === 'BMT_ADMIN' ? 'BA' : 'SV')}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {currentUser?.name || (role === 'BMT_ADMIN' ? 'BMT Admin' : 'Temple Admin')}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {currentUser?.designation || (role === 'BMT_ADMIN' ? 'Platform Head' : 'Temple Team')}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          <button
            id="btn-sidebar-logout"
            onClick={logout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1A2D4F] transition cursor-pointer ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* User Account Switcher Dropdown */}
        {isUserDropdownOpen && (
          <div className="absolute left-3 right-3 bottom-full mb-2 bg-[#0F1E38] border border-[#1E3A68] rounded-xl shadow-2xl p-2 z-50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              Switch User Account:
            </p>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {DEMO_USERS.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    switchUser(u);
                    setIsUserDropdownOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between transition ${
                    currentUser?.id === u.id
                      ? 'bg-[#1E3A8A] text-white font-bold'
                      : 'text-slate-300 hover:bg-[#162747] hover:text-white'
                  }`}
                >
                  <div className="truncate pr-1">
                    <span className="block truncate font-semibold">{u.name}</span>
                    <span className="block text-[10px] text-slate-400 truncate">
                      {u.role === 'BMT_ADMIN' ? 'BMT Admin' : u.templeName}
                    </span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 text-slate-300">
                    {u.role === 'BMT_ADMIN' ? 'BMT' : 'TEMPLE'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      </aside>
    </>
  );
};
