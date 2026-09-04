import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, History, Building2, ChevronDown } from 'lucide-react';

export const AuditTracking: React.FC = () => {
  const { auditLogs } = useApp();
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    if (categoryFilter !== 'ALL' && log.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchActor = log.actorName.toLowerCase().includes(q);
      const matchAction = log.action.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchTemple = log.templeName?.toLowerCase().includes(q);
      if (!matchActor && !matchAction && !matchDetails && !matchTemple) return false;
    }
    return true;
  });

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'OFFERING':
        return 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]';
      case 'SETTLEMENT':
        return 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]';
      case 'TEMPLE':
        return 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]';
      case 'BOOKING':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <p className="text-xs text-slate-500 font-medium">
          Immutable event log of all administrative actions, offering approvals, and settlement state updates.
        </p>
      </div>

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
        
        {/* Filter toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 w-full md:flex-1 min-w-0">
            <div className="relative w-full sm:w-auto sm:min-w-[200px] flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                id="input-search-audit"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit trail by actor, temple, action..."
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
              />
            </div>

            <div className="relative w-full sm:w-auto min-w-[150px]">
              <select
                id="select-filter-audit-category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                aria-label="Filter audit logs by operational category"
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-8 text-sm text-slate-700 font-medium hover:border-slate-300 focus:outline-none cursor-pointer shadow-sm transition"
              >
                <option value="ALL">All Event Categories</option>
                <option value="OFFERING">Offering Approvals & Updates</option>
                <option value="SETTLEMENT">Settlements & Payouts</option>
                <option value="TEMPLE">Temple Governance</option>
                <option value="BOOKING">Booking Status Updates</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <span className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{filteredLogs.length}</strong> Audit Events
          </span>
        </div>

        {/* Audit Log Timeline Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Temple Scope</th>
                <th className="py-3 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-mono text-xs">
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getCategoryBadge(log.category)}`}>
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-900 font-semibold text-xs">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 text-slate-900">
                    <span className="font-medium">{log.actorName}</span>
                    <span className="block text-[11px] text-slate-400 uppercase">{log.actorRole}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {log.templeName ? (
                      <span className="flex items-center space-x-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[140px] font-medium">{log.templeName}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-xs">Platform-wide</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 leading-relaxed max-w-md text-xs">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
