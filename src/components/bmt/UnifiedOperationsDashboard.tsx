import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { 
  TrendingUp, 
  IndianRupee, 
  CalendarCheck, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Sparkles, 
  ArrowUpRight, 
  Filter, 
  Eye,
  Layers,
  ChevronDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface UnifiedOperationsDashboardProps {
  onOpenBooking: (booking: Booking) => void;
  onNavigateTab: (tabId: string) => void;
}

export const UnifiedOperationsDashboard: React.FC<UnifiedOperationsDashboardProps> = ({ 
  onOpenBooking, 
  onNavigateTab 
}) => {
  const { bookings, settlements, temples, offerings } = useApp();

  // Platform Dashboard Filters
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');
  const [templeFilter, setTempleFilter] = useState<string>('ALL');
  const [offeringTypeFilter, setOfferingTypeFilter] = useState<string>('ALL');

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    if (templeFilter !== 'ALL' && b.templeId !== templeFilter) return false;
    if (offeringTypeFilter !== 'ALL' && b.offeringType !== offeringTypeFilter) return false;
    
    if (dateFilter === 'TODAY') {
      return b.bookingDate === '2026-09-04';
    } else if (dateFilter === 'WEEK') {
      return b.bookingDate >= '2026-08-28';
    }
    return true;
  });

  // Business Metrics Calculations
  const totalBookingsCount = filteredBookings.length;
  const platformGMV = filteredBookings.reduce((sum, b) => sum + b.amount, 0);
  const platformRevenue = filteredBookings.reduce((sum, b) => sum + b.platformFee, 0);

  // Settlement Metrics
  const pendingSettlements = settlements.filter(s => s.status !== 'Completed');
  const completedSettlements = settlements.filter(s => s.status === 'Completed');
  const pendingSettlementTotal = pendingSettlements.reduce((sum, s) => sum + s.netPayoutAmount, 0);
  const completedSettlementTotal = completedSettlements.reduce((sum, s) => sum + s.netPayoutAmount, 0);

  // Pending Offerings for Approval
  const pendingOfferings = offerings.filter(o => o.approvalStatus === 'pending_approval');

  // Chart 1: Revenue by Temple
  const templePerformanceData = temples.map((t) => {
    const templeBks = filteredBookings.filter(b => b.templeId === t.id);
    const rev = templeBks.reduce((sum, b) => sum + b.amount, 0);
    return {
      name: t.name.replace('Temple', '').replace('Arulmigu', '').replace('Shri', '').trim().slice(0, 15),
      fullTitle: t.name,
      revenue: rev,
      bookings: templeBks.length,
    };
  }).filter(d => d.revenue > 0 || templeFilter === 'ALL');

  // Chart 2: Offering Type Split
  const offeringTypes = ['Seva', 'Special Pooja', 'Classes'];
  const COLORS = ['#0B1528', '#2563EB', '#10B981'];
  const typeSplitData = offeringTypes.map(type => ({
    name: type,
    value: filteredBookings.filter(b => b.offeringType === type).length,
  })).filter(d => d.value > 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]';
      case 'Completed':
        return 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]';
      case 'In-Progress':
        return 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]';
      case 'Cancelled':
        return 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Pending Approvals Urgent Notice */}
      {pendingOfferings.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 text-amber-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-900">
                {pendingOfferings.length} Temple Offering{pendingOfferings.length > 1 ? 's' : ''} Awaiting BMT Verification
              </h3>
              <p className="text-xs text-amber-700 mt-0.5">
                New sevas submitted by temple administrators require BMT compliance and pricing approval before appearing on the devotee portal.
              </p>
            </div>
          </div>
          <button
            id="btn-goto-approvals-queue"
            onClick={() => onNavigateTab('approvals')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0B1528] text-white hover:bg-[#162744] shadow transition flex items-center space-x-1.5 shrink-0 cursor-pointer"
          >
            <span>Review Queue</span>
            <ArrowUpRight className="w-4 h-4 text-[#F59E0B]" />
          </button>
        </div>
      )}

      {/* Global Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
          <Filter className="w-4 h-4 text-slate-500" />
          <span>Operations Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          
          {/* Temple Filter */}
          <div className="relative flex-1 sm:flex-initial min-w-[140px]">
            <select
              id="filter-bmt-temple"
              value={templeFilter}
              onChange={(e) => setTempleFilter(e.target.value)}
              aria-label="Filter by temple location"
              className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2 pr-8 text-xs text-slate-700 font-medium hover:border-slate-300 focus:outline-none cursor-pointer shadow-sm transition"
            >
              <option value="ALL">All Temples ({temples.length})</option>
              {temples.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Offering Type Filter */}
          <div className="relative flex-1 sm:flex-initial min-w-[130px]">
            <select
              id="filter-bmt-offering-type"
              value={offeringTypeFilter}
              onChange={(e) => setOfferingTypeFilter(e.target.value)}
              aria-label="Filter by offering type"
              className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3.5 py-2 pr-8 text-xs text-slate-700 font-medium hover:border-slate-300 focus:outline-none cursor-pointer shadow-sm transition"
            >
              <option value="ALL">All Offering Types</option>
              <option value="Seva">Seva</option>
              <option value="Special Pooja">Special Pooja</option>
              <option value="Classes">Classes</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Date Range Tabs */}
          <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200 text-xs w-full sm:w-auto overflow-x-auto">
            <button
              id="date-filter-all"
              onClick={() => setDateFilter('ALL')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap text-center ${dateFilter === 'ALL' ? 'bg-[#0B1528] text-white font-semibold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              All Time
            </button>
            <button
              id="date-filter-today"
              onClick={() => setDateFilter('TODAY')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap text-center ${dateFilter === 'TODAY' ? 'bg-[#0B1528] text-white font-semibold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Today
            </button>
            <button
              id="date-filter-week"
              onClick={() => setDateFilter('WEEK')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap text-center ${dateFilter === 'WEEK' ? 'bg-[#0B1528] text-white font-semibold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Past 7 Days
            </button>
          </div>

        </div>
      </div>

      {/* Business Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Bookings</span>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <CalendarCheck className="w-4 h-4 text-[#0B1528]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">{totalBookingsCount}</span>
            <span className="text-xs text-emerald-700 font-semibold ml-2 inline-flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +14.8%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all registered sanctums</p>
        </div>

        {/* Metric 2: Platform GMV */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Platform GMV</span>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <IndianRupee className="w-4 h-4 text-[#0B1528]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
              ₹{platformGMV.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            BMT Platform Fee: ₹{platformRevenue.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Metric 3: Pending Settlements */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Settlements</span>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <Clock className="w-4 h-4 text-[#0B1528]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
              ₹{pendingSettlementTotal.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {pendingSettlements.length} batches awaiting payout execution
          </p>
        </div>

        {/* Metric 4: Completed Settlements */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Completed Payouts</span>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-[#0B1528]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
              ₹{completedSettlementTotal.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Reconciled with bank UTR validation
          </p>
        </div>

      </div>

      {/* Analytical Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue by Temple Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-serif font-bold text-slate-900 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-slate-700" />
                <span>Gross Seva Revenue by Temple Location</span>
              </h3>
              <p className="text-xs text-slate-500">Comparing booking revenue across registered temples</p>
            </div>
            <span className="text-xs font-semibold text-slate-700 font-mono bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              Active: {temples.filter(t => t.isActive).length}
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={templePerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '10px', color: '#0F172A', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#0B1528" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Offering Type Distribution Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-serif font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-slate-700" />
              <span>Offering Distribution</span>
            </h3>
            <p className="text-xs text-slate-500">Breakdown of booking types</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeSplitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {typeSplitData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '10px', color: '#0F172A', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-center items-center space-x-4 text-xs pt-2 border-t border-slate-100">
            {typeSplitData.map((d, i) => (
              <div key={d.name} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                <span className="text-slate-600 font-medium">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Platform Activity Table: Recent High-Value Bookings */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-serif font-bold text-slate-900 flex items-center space-x-2">
              <CalendarCheck className="w-4 h-4 text-slate-700" />
              <span>Recent Platform Seva Bookings ({filteredBookings.length})</span>
            </h3>
            <p className="text-xs text-slate-500">Live feed of devotee bookings across temples</p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-500 font-mono">Real-time operational view</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Ref ID</th>
                <th className="p-3.5">Temple</th>
                <th className="p-3.5">Devotee</th>
                <th className="p-3.5">Offering</th>
                <th className="p-3.5">Scheduled Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredBookings.slice(0, 8).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-mono text-slate-900 font-semibold">{b.bookingRef}</td>
                  <td className="p-3.5 font-medium text-slate-800">{b.templeName}</td>
                  <td className="p-3.5 text-slate-900">
                    <p className="font-semibold">{b.devoteeName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{b.devoteePhone}</p>
                  </td>
                  <td className="p-3.5 text-slate-700 max-w-[200px] truncate">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-800 mr-1.5 border border-slate-200 font-medium">
                      {b.offeringType}
                    </span>
                    {b.offeringTitle}
                  </td>
                  <td className="p-3.5 text-slate-600">
                    <p>{b.bookingDate}</p>
                    <p className="text-[10px] text-slate-400">{b.slotTime}</p>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${getStatusBadge(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-bold text-slate-900 font-mono">
                    ₹{b.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => onOpenBooking(b)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                      title="Inspect booking details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
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
