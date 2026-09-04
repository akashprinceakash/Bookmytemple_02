import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settlement, SettlementStatus } from '../../types';
import { 
  Plus, 
  Search, 
  Eye, 
  ArrowRight, 
  AlertCircle, 
  CreditCard,
  ChevronDown
} from 'lucide-react';

interface SettlementManagementProps {
  onOpenCreateModal: () => void;
  onOpenDetailModal: (settlement: Settlement) => void;
}

export const SettlementManagement: React.FC<SettlementManagementProps> = ({
  onOpenCreateModal,
  onOpenDetailModal,
}) => {
  const { settlements, temples, advanceSettlementStatus } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [templeFilter, setTempleFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSettlements = settlements.filter((s) => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (templeFilter !== 'ALL' && s.templeId !== templeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRef = s.settlementRef.toLowerCase().includes(q);
      const matchTemple = s.templeName.toLowerCase().includes(q);
      const matchUtr = s.utrRef?.toLowerCase().includes(q);
      if (!matchRef && !matchTemple && !matchUtr) return false;
    }
    return true;
  });

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

  const handleQuickAdvance = (s: Settlement) => {
    if (s.status === 'Draft') {
      advanceSettlementStatus(s.id, 'Generated');
    } else if (s.status === 'Generated') {
      advanceSettlementStatus(s.id, 'Processing');
    } else if (s.status === 'Processing') {
      const utr = prompt('Enter Bank Transaction UTR reference for disbursement:', `UTR-NEFT-${Date.now().toString().slice(-6)}`);
      if (utr) {
        advanceSettlementStatus(s.id, 'Completed', utr);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-xs text-slate-500 font-medium">
            Payout Lifecycles: Draft &rarr; Generated &rarr; Processing &rarr; Completed
          </p>
        </div>

        <button
          id="btn-open-create-settlement-modal"
          onClick={onOpenCreateModal}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#0B1528] text-white hover:bg-[#162744] shadow transition flex items-center justify-center space-x-2 shrink-0 cursor-pointer text-center"
        >
          <Plus className="w-4 h-4 text-[#F59E0B]" />
          <span>Generate Settlement Batch</span>
        </button>
      </div>

      {/* Lifecycle Flow Summary Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {(['Draft', 'Generated', 'Processing', 'Completed'] as SettlementStatus[]).map((st) => {
          const count = settlements.filter(s => s.status === st).length;
          const totalVal = settlements.filter(s => s.status === st).reduce((sum, s) => sum + s.netPayoutAmount, 0);
          const isSelected = statusFilter === st;

          return (
            <div 
              key={st} 
              onClick={() => setStatusFilter(statusFilter === st ? 'ALL' : st)}
              className={`p-3 sm:p-4 rounded-2xl border transition cursor-pointer ${
                isSelected 
                  ? 'bg-slate-50 border-slate-900 shadow-sm ring-1 ring-slate-900' 
                  : 'bg-white border-slate-200/90 shadow-sm hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${getStatusBadge(st)}`}>
                  {st}
                </span>
                <span className="text-[11px] sm:text-xs font-bold text-slate-500 font-mono">{count} batches</span>
              </div>
              <p className="text-base sm:text-lg font-bold font-serif text-slate-900 mt-2">
                ₹{totalVal.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-slate-400">Total Net Payout</p>
            </div>
          );
        })}
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
        
        {/* Filter Toolbar matching screenshot */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 w-full md:flex-1 min-w-0">
            
            {/* Search Box */}
            <div className="relative w-full sm:w-auto sm:min-w-[200px] max-w-xs">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                id="input-search-settlements"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ref, temple, or UTR..."
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
              />
            </div>

            {/* Temple Filter */}
            <div className="relative flex-1 sm:flex-initial min-w-[140px]">
              <select
                id="select-settlement-filter-temple"
                value={templeFilter}
                onChange={(e) => setTempleFilter(e.target.value)}
                aria-label="Filter settlements by temple"
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-8 text-sm text-slate-700 font-medium hover:border-slate-300 focus:outline-none cursor-pointer shadow-sm transition"
              >
                <option value="ALL">All Temples</option>
                {temples.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative flex-1 sm:flex-initial min-w-[140px]">
              <select
                id="select-settlement-filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter settlements by lifecycle status"
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-8 text-sm text-slate-700 font-medium hover:border-slate-300 focus:outline-none cursor-pointer shadow-sm transition"
              >
                <option value="ALL">All Lifecycle Stages</option>
                <option value="Draft">Draft</option>
                <option value="Generated">Generated</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{filteredSettlements.length}</strong> settlement batches
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[840px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold">
                <th className="py-3 px-4">Settlement Ref</th>
                <th className="py-3 px-4">Temple</th>
                <th className="py-3 px-4">Coverage Period</th>
                <th className="py-3 px-4 text-center">Sevas</th>
                <th className="py-3 px-4 text-right">Gross Amount</th>
                <th className="py-3 px-4 text-right">BMT Fee</th>
                <th className="py-3 px-4 text-right">Net Payout</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Bank / UTR</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSettlements.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="font-medium text-slate-600">No settlement records match your selected filters</p>
                  </td>
                </tr>
              ) : (
                filteredSettlements.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 font-mono text-slate-900 font-semibold">{s.settlementRef}</td>
                    <td className="py-4 px-4 text-slate-900 font-medium">{s.templeName}</td>
                    <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                      {s.periodStart} &rarr; {s.periodEnd}
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-slate-900">{s.bookingCount}</td>
                    <td className="py-4 px-4 text-right text-slate-700">₹{s.grossAmount.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-4 text-right text-slate-500">-₹{s.platformCommission.toLocaleString('en-IN')}</td>
                    <td className="py-4 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                      ₹{s.netPayoutAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getStatusBadge(s.status)}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      <p className="truncate max-w-[130px] font-mono text-xs text-slate-900 font-medium">{s.bankAccount.bankName}</p>
                      {s.utrRef ? (
                        <p className="text-[11px] text-slate-500 font-mono truncate max-w-[130px]">{s.utrRef}</p>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">No UTR yet</p>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1.5">
                        
                        {/* Quick Advance Button */}
                        {s.status !== 'Completed' && (
                          <button
                            onClick={() => handleQuickAdvance(s)}
                            className="px-2.5 py-1 rounded-lg bg-[#0B1528] hover:bg-[#162744] text-white text-xs font-medium flex items-center space-x-1 transition cursor-pointer shadow-sm"
                            title={`Advance lifecycle to ${s.status === 'Draft' ? 'Generated' : s.status === 'Generated' ? 'Processing' : 'Completed'}`}
                          >
                            <span>Advance</span>
                            <ArrowRight className="w-3 h-3 text-[#F59E0B]" />
                          </button>
                        )}

                        {/* View Statement Details */}
                        <button
                          onClick={() => onOpenDetailModal(s)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                          title="View statement breakdown & print"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
