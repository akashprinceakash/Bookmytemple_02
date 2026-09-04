import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settlement, SettlementStatus } from '../../types';
import { 
  CreditCard, 
  Search, 
  AlertCircle, 
  Landmark, 
  FileText,
  ChevronDown
} from 'lucide-react';

interface TempleSettlementsProps {
  onOpenDetailModal: (settlement: Settlement) => void;
}

export const TempleSettlements: React.FC<TempleSettlementsProps> = ({ onOpenDetailModal }) => {
  const { currentTemple, settlements } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!currentTemple) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
        Temple sanctum data not found.
      </div>
    );
  }

  // Scoped strictly to this temple
  const templeSettlements = settlements.filter(s => s.templeId === currentTemple.id);

  const filteredSettlements = templeSettlements.filter((s) => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRef = s.settlementRef.toLowerCase().includes(q);
      const matchUtr = s.utrRef?.toLowerCase().includes(q);
      if (!matchRef && !matchUtr) return false;
    }
    return true;
  });

  const totalDisbursed = templeSettlements
    .filter(s => s.status === 'Completed')
    .reduce((sum, s) => sum + s.netPayoutAmount, 0);

  const pendingDisbursement = templeSettlements
    .filter(s => s.status !== 'Completed')
    .reduce((sum, s) => sum + s.netPayoutAmount, 0);

  const getStatusBadge = (status: SettlementStatus) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]';
      case 'Processing':
        return 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]';
      case 'Generated':
        return 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]';
      case 'Draft':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Payouts Received</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-serif text-slate-900">
              ₹{totalDisbursed.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-emerald-700 font-semibold">Credited</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Reconciled with NEFT/RTGS UTR</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Settlements In Pipeline</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-serif text-slate-900">
              ₹{pendingDisbursement.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-amber-700 font-semibold">In Progress</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {templeSettlements.filter(s => s.status !== 'Completed').length} batches generated/processing
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Agreed Platform Fee</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-serif text-slate-900">
              {currentTemple.commissionRatePercent}%
            </span>
            <span className="text-xs text-slate-500">BMT Fee</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Auto-deducted before bank remittance</p>
        </div>

      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
        
        {/* Filter Toolbar matching screenshot */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 w-full md:flex-1 min-w-0">
            
            {/* Search */}
            <div className="relative w-full sm:w-auto sm:min-w-[200px] max-w-xs">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                id="input-search-temple-settlements"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ref or UTR..."
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
              />
            </div>

            {/* Status Dropdown */}
            <div className="relative flex-1 sm:flex-initial min-w-[140px]">
              <select
                id="select-filter-settlement-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter settlements by status"
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-8 text-sm text-slate-700 font-medium hover:border-slate-300 focus:outline-none cursor-pointer shadow-sm transition"
              >
                <option value="ALL">All Settlement Stages</option>
                <option value="Draft">Draft</option>
                <option value="Generated">Generated</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 w-full sm:w-auto">
            <Landmark className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate">Bank: <strong className="text-slate-800">{currentTemple.bankDetails.bankName}</strong> ({currentTemple.bankDetails.accountNumberMasked})</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[780px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold">
                <th className="py-3 px-4">Settlement Ref</th>
                <th className="py-3 px-4">Coverage Window</th>
                <th className="py-3 px-4 text-center">Bookings</th>
                <th className="py-3 px-4 text-right">Gross Seva Revenue</th>
                <th className="py-3 px-4 text-right">Platform Fee</th>
                <th className="py-3 px-4 text-right">Net Payout</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Bank UTR Ref</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSettlements.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="font-medium text-slate-600">No settlement records found</p>
                  </td>
                </tr>
              ) : (
                filteredSettlements.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 font-mono text-slate-900 font-semibold">{s.settlementRef}</td>
                    <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                      {s.periodStart} &rarr; {s.periodEnd}
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-slate-900">
                      {s.bookingCount} sevas
                    </td>
                    <td className="py-4 px-4 text-right text-slate-700">
                      ₹{s.grossAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-right text-slate-500">
                      -₹{s.platformCommission.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                      ₹{s.netPayoutAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getStatusBadge(s.status)}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {s.utrRef ? (
                        <span className="font-mono text-slate-900 text-xs font-medium">{s.utrRef}</span>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Awaiting payout</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onOpenDetailModal(s)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-medium flex items-center space-x-1.5 mx-auto transition cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>Statement</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing <strong className="text-slate-800">{filteredSettlements.length}</strong> Statements</span>
          <span>IFSC: <strong className="text-slate-800 font-mono">{currentTemple.bankDetails.ifscCode}</strong></span>
        </div>

      </div>

    </div>
  );
};
