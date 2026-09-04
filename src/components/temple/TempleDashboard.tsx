import React from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { 
  Building2, 
  CalendarCheck, 
  IndianRupee, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface TempleDashboardProps {
  onOpenBooking: (booking: Booking) => void;
  onNavigateTab: (tabId: string) => void;
}

export const TempleDashboard: React.FC<TempleDashboardProps> = ({
  onOpenBooking,
  onNavigateTab,
}) => {
  const { currentTemple, bookings, settlements, offerings } = useApp();

  if (!currentTemple) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
        Temple sanctum data not found.
      </div>
    );
  }

  // Filter scoped strictly to this temple
  const templeBookings = bookings.filter(b => b.templeId === currentTemple.id);
  const todayBookings = templeBookings.filter(b => b.bookingDate === '2026-09-04');
  const upcomingBookings = templeBookings.filter(b => b.status === 'Confirmed');
  const completedBookings = templeBookings.filter(b => b.status === 'Completed');

  const totalTempleRevenue = templeBookings.reduce((sum, b) => sum + b.templeShare, 0);
  const todayTempleRevenue = todayBookings.reduce((sum, b) => sum + b.templeShare, 0);

  // Temple settlements
  const templeSettlements = settlements.filter(s => s.templeId === currentTemple.id);
  const pendingPayout = templeSettlements
    .filter(s => s.status !== 'Completed')
    .reduce((sum, s) => sum + s.netPayoutAmount, 0);

  // Offerings
  const templeOfferings = offerings.filter(o => o.templeId === currentTemple.id);
  const liveOfferings = templeOfferings.filter(o => o.approvalStatus === 'approved' && o.isEnabled);
  const pendingOfferings = templeOfferings.filter(o => o.approvalStatus === 'pending_approval');

  // Chart data: Bookings trend
  const trendData = [
    { day: 'Aug 29', bookings: 4, revenue: 11200 },
    { day: 'Aug 30', bookings: 6, revenue: 16800 },
    { day: 'Aug 31', bookings: 9, revenue: 24500 },
    { day: 'Sep 01', bookings: 12, revenue: 33600 },
    { day: 'Sep 02', bookings: 8, revenue: 22400 },
    { day: 'Sep 03', bookings: 10, revenue: 28000 },
    { day: 'Sep 04', bookings: 14, revenue: 39200 },
  ];

  // Status breakdown
  const statusCounts = [
    { name: 'Confirmed', value: upcomingBookings.length, color: '#10B981' },
    { name: 'Completed', value: completedBookings.length, color: '#0284C7' },
    { name: 'In-Progress', value: templeBookings.filter(b => b.status === 'In-Progress').length, color: '#F59E0B' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      
      {/* Temple Profile Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#0B1528] text-white flex items-center justify-center font-serif font-bold text-xl shadow-md shrink-0">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#F59E0B]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                Authorized Temple Administration
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active Sanctum
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-serif font-bold text-slate-900 mt-1">
              {currentTemple.name}
            </h1>
            <p className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentTemple.city}, {currentTemple.state}</span>
              </span>
              <span>&bull;</span>
              <span>Primary Deity: <strong className="text-slate-700">{currentTemple.primaryDeity}</strong></span>
              <span>&bull;</span>
              <span>Trustee: <strong className="text-slate-700">{currentTemple.contactPerson}</strong></span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full md:w-auto">
          <button
            id="btn-temple-dash-add-offering"
            onClick={() => onNavigateTab('offerings')}
            className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm text-center"
          >
            <Sparkles className="w-4 h-4 text-slate-500" />
            <span>Manage Offerings ({templeOfferings.length})</span>
          </button>
          <button
            id="btn-temple-dash-view-bookings"
            onClick={() => onNavigateTab('bookings')}
            className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold bg-[#0B1528] text-white hover:bg-[#152542] shadow transition flex items-center justify-center space-x-1.5 cursor-pointer text-center"
          >
            <CalendarCheck className="w-4 h-4 text-[#F59E0B]" />
            <span>Seva Bookings Desk</span>
          </button>
        </div>
      </div>

      {/* Pending Approval Notice if any */}
      {pendingOfferings.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>{pendingOfferings.length} Offering(s) Pending Approval:</strong> "{pendingOfferings.map(o => o.title).join(', ')}" is currently under review by BookMyTemples Operations.
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('offerings')}
            className="text-xs text-amber-900 font-semibold underline hover:text-amber-950 shrink-0 ml-2 cursor-pointer"
          >
            View Status
          </button>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Today's Sevas</span>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <CalendarCheck className="w-4 h-4 text-[#0B1528]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">{todayBookings.length}</span>
            <span className="text-xs text-emerald-700 font-medium ml-2">Scheduled Today</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Total {templeBookings.length} bookings all time</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Temple Net Earnings</span>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <IndianRupee className="w-4 h-4 text-[#0B1528]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
              ₹{totalTempleRevenue.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Today: <strong className="text-slate-900">₹{todayTempleRevenue.toLocaleString('en-IN')}</strong> (Post BMT commission)
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending Settlement</span>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <Clock className="w-4 h-4 text-[#0B1528]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">
              ₹{pendingPayout.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Processing into temple bank account</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Offerings</span>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
              <Sparkles className="w-4 h-4 text-[#0B1528]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-bold font-serif text-slate-900">{liveOfferings.length}</span>
            <span className="text-xs text-slate-500 ml-2 font-medium">Live for Devotees</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{templeOfferings.length} total services configured</p>
        </div>

      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Seva Volume Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-serif font-bold text-slate-900 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-slate-700" />
                <span>Daily Seva Booking Volume & Devotee Participation</span>
              </h3>
              <p className="text-xs text-slate-500">7-day rolling window for {currentTemple.name}</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B1528" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0B1528" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '10px', color: '#0F172A', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="bookings" stroke="#0B1528" strokeWidth={2} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-serif font-bold text-slate-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-slate-700" />
              <span>Seva Fulfillment Status</span>
            </h3>
            <p className="text-xs text-slate-500">Current state of temple bookings</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusCounts}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusCounts.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '10px', color: '#0F172A', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap justify-center gap-3 text-xs pt-2 border-t border-slate-100">
            {statusCounts.map((d) => (
              <div key={d.name} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></span>
                <span className="text-slate-600 font-medium">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Today's Seva Execution Schedule */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-serif font-bold text-slate-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-700" />
              <span>Today's Seva Schedule & Devotee Sankalpa List (Sep 04, 2026)</span>
            </h3>
            <p className="text-xs text-slate-500">Archaka execution checklist for {currentTemple.name}</p>
          </div>

          <button
            onClick={() => onNavigateTab('bookings')}
            className="text-xs text-slate-900 hover:text-blue-700 hover:underline font-semibold cursor-pointer"
          >
            View All Bookings &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[680px]">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Time Slot</th>
                <th className="p-3.5">Devotee Name</th>
                <th className="p-3.5">Gotra & Nakshatra</th>
                <th className="p-3.5">Offering (Seva)</th>
                <th className="p-3.5">Prasad Mode</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Execution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {todayBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">
                    No sevas scheduled for today. Check upcoming dates.
                  </td>
                </tr>
              ) : (
                todayBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 font-semibold text-slate-900">{b.slotTime}</td>
                    <td className="p-3.5 font-medium text-slate-900">
                      {b.devoteeName}
                      <span className="block text-[10px] text-slate-400 font-mono">{b.devoteePhone}</span>
                    </td>
                    <td className="p-3.5 text-slate-600">
                      <span className="text-slate-900 font-medium">{b.gotra || 'Gotra N/A'}</span> &bull; <span>{b.nakshatra || 'N/A'}</span>
                    </td>
                    <td className="p-3.5 text-slate-800 max-w-[180px] truncate">{b.offeringTitle}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        b.prasadDelivery === 'Home Delivery' ? 'bg-slate-100 text-slate-800 font-medium border border-slate-200' : 'bg-slate-50 text-slate-600 border border-slate-200'
                      }`}>
                        {b.prasadDelivery}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${
                        b.status === 'Confirmed' ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]' :
                        b.status === 'Completed' ? 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]' :
                        'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => onOpenBooking(b)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-medium transition cursor-pointer"
                      >
                        Details & Complete
                      </button>
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
