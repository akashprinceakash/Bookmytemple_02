import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Temple } from '../../types';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Landmark, 
  ArrowRight,
  Power,
  ShieldCheck,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import { SanctumSankalpaRosterModal } from '../modals/SanctumSankalpaRosterModal';

interface TempleManagementProps {
  onOpenOnboardModal: () => void;
}

export const TempleManagement: React.FC<TempleManagementProps> = ({ onOpenOnboardModal }) => {
  const { temples, toggleTempleActive, offerings, bookings, setRole, setActiveTempleId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [rosterTempleId, setRosterTempleId] = useState<string | null>(null);

  const filteredTemples = temples.filter((t) => {
    if (stateFilter !== 'ALL' && t.state !== stateFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchCity = t.city.toLowerCase().includes(q);
      const matchDeity = t.primaryDeity.toLowerCase().includes(q);
      const matchTrust = (t.trustRegNumber || '').toLowerCase().includes(q);
      if (!matchName && !matchCity && !matchDeity && !matchTrust) return false;
    }
    return true;
  });

  const allStates = Array.from(new Set(temples.map(t => t.state)));

  const handleSwitchToTemple = (t: Temple) => {
    setActiveTempleId(t.id);
    setRole('TEMPLE_ADMIN');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 font-medium">
            Manage partner temple trusts, statutory registrations, operational readiness, and banking verification.
          </p>
        </div>

        <button
          id="btn-open-onboard-temple"
          onClick={onOpenOnboardModal}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#0B1528] text-white hover:bg-[#162744] shadow transition flex items-center justify-center space-x-2 shrink-0 cursor-pointer text-center"
        >
          <Plus className="w-4 h-4 text-[#F59E0B]" />
          <span>Onboard New Temple Trust</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full md:flex-1 min-w-0">
          <div className="relative w-full sm:w-auto sm:min-w-[200px] flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              id="input-search-temples"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by temple, deity, city, or trust reg #..."
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
            />
          </div>

          <div className="relative w-full sm:w-auto min-w-[150px]">
            <select
              id="select-filter-temple-state"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              aria-label="Filter temples by Indian state"
              className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-8 text-sm text-slate-700 font-medium hover:border-slate-300 focus:outline-none cursor-pointer shadow-sm transition"
            >
              <option value="ALL">All States ({allStates.length})</option>
              {allStates.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        <span className="text-xs text-slate-500">
          Showing <strong className="text-slate-800">{filteredTemples.length}</strong> of {temples.length} Temples
        </span>
      </div>

      {/* Temple Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTemples.map((t) => {
          const templeOfferings = offerings.filter(o => o.templeId === t.id);
          const liveOfferings = templeOfferings.filter(o => o.approvalStatus === 'approved' && o.isEnabled);
          const templeBookings = bookings.filter(b => b.templeId === t.id);
          const templeGMV = templeBookings.reduce((sum, b) => sum + b.amount, 0);

          return (
            <div 
              key={t.id}
              className={`bg-white rounded-2xl border p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 transition ${
                t.isActive ? 'border-slate-200/90 hover:border-slate-300' : 'border-slate-200 opacity-60'
              }`}
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      t.isActive ? 'bg-[#0B1528] text-[#F59E0B] shadow-sm' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-serif font-bold text-slate-900 leading-snug">
                        {t.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t.city}, {t.state}</span>
                        {t.establishedYear && <span className="text-slate-400">&bull; Est. {t.establishedYear}</span>}
                      </p>
                    </div>
                  </div>

                  {/* Active / Inactive Status Switch */}
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                      t.isActive 
                        ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]' 
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {t.isActive ? 'Active' : 'Deactivated'}
                    </span>
                    <button
                      onClick={() => toggleTempleActive(t.id)}
                      title={t.isActive ? 'Deactivate temple access' : 'Activate temple access'}
                      className={`p-1.5 rounded-lg border transition cursor-pointer ${
                        t.isActive 
                          ? 'text-slate-600 border-slate-200 hover:bg-slate-100' 
                          : 'text-slate-400 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Statutory Trust & Regulatory Governance */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between text-xs gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Trust Reg #</span>
                    <span className="font-mono text-slate-800 font-semibold">{t.trustRegNumber || 'TR-BMT-REG-2018'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">PAN Number</span>
                    <span className="font-mono text-slate-800 font-semibold">{t.panNumber || 'AAATB0001R'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Payout Cycle</span>
                    <span className="px-2 py-0.5 rounded bg-white text-slate-700 font-medium text-[11px] border border-slate-200 shadow-2xs">
                      {t.payoutCycle || 'Weekly (T+2)'}
                    </span>
                  </div>
                </div>

                {/* Presiding Deity & Contact */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="text-slate-500">Sanctum Presiding Deity:</span>
                    <span className="font-semibold text-slate-900">{t.primaryDeity}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-[11px] text-slate-600">
                    <span className="font-medium text-slate-800">{t.contactPerson}</span>
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{t.contactPhone}</span>
                    </span>
                    <span className="flex items-center space-x-1 truncate max-w-[150px]">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{t.contactEmail}</span>
                    </span>
                  </div>
                </div>

                {/* Operational Readiness Numbers */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 block">Offerings</span>
                    <span className="font-bold text-slate-900 text-sm">{liveOfferings.length} Live</span>
                    <span className="text-[10px] text-slate-400 block">({templeOfferings.length} total)</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 block">Total Bookings</span>
                    <span className="font-bold text-slate-900 text-sm">{templeBookings.length}</span>
                    <span className="text-[10px] text-slate-400 block">all time</span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] text-slate-400 block">Gross GMV</span>
                    <span className="font-bold text-slate-900 text-sm font-mono">₹{templeGMV.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-400 block">{t.commissionRatePercent}% comm.</span>
                  </div>
                </div>

                {/* Bank Details & Trust Verification */}
                <div className="text-xs text-slate-600 flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="flex items-center space-x-1.5">
                    <Landmark className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t.bankDetails.bankName} ({t.bankDetails.accountNumberMasked})</span>
                  </span>
                  <div className="flex items-center space-x-1 text-emerald-700 font-medium text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{t.bankVerificationStatus || 'Verified'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setRosterTempleId(t.id)}
                  className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition flex items-center justify-center space-x-1.5 cursor-pointer text-center"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span>Sanctum Roster</span>
                </button>

                <button
                  onClick={() => handleSwitchToTemple(t)}
                  className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#0B1528] hover:bg-[#162744] text-white transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm text-center"
                >
                  <span>Open Temple Sanctum Desk</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B]" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Sanctum Roster Modal for BMT Admin inspect */}
      {rosterTempleId && (
        <SanctumSankalpaRosterModal
          isOpen={true}
          onClose={() => setRosterTempleId(null)}
          templeId={rosterTempleId}
        />
      )}

    </div>
  );
};
