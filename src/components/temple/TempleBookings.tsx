import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, BookingStatus } from '../../types';
import { 
  Search, 
  ChevronDown, 
  Download, 
  UserCheck, 
  AlertCircle, 
  ExternalLink,
  CheckCircle2,
  Calendar,
  Clock
} from 'lucide-react';
import { SanctumSankalpaRosterModal } from '../modals/SanctumSankalpaRosterModal';

interface TempleBookingsProps {
  onOpenBooking: (booking: Booking) => void;
}

export const TempleBookings: React.FC<TempleBookingsProps> = ({ onOpenBooking }) => {
  const { currentTemple, bookings, offerings } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [offeringFilter, setOfferingFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL');
  const [isRosterOpen, setIsRosterOpen] = useState<boolean>(false);

  if (!currentTemple) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
        Temple sanctum data not found.
      </div>
    );
  }

  // Filter bookings strictly scoped to this temple
  const templeBookings = bookings.filter(b => b.templeId === currentTemple.id);

  const filteredBookings = templeBookings.filter((b) => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (offeringFilter !== 'ALL' && b.offeringId !== offeringFilter) return false;
    
    if (dateFilter === 'TODAY' && b.bookingDate !== '2026-09-04') return false;
    if (dateFilter === 'UPCOMING' && b.bookingDate < '2026-09-04') return false;
    if (dateFilter === 'PAST' && b.bookingDate >= '2026-09-04') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = b.devoteeName.toLowerCase().includes(q);
      const matchPhone = b.devoteePhone.includes(q);
      const matchRef = b.bookingRef.toLowerCase().includes(q);
      const matchGotra = (b.gotra || '').toLowerCase().includes(q);
      const matchOffering = b.offeringTitle.toLowerCase().includes(q);
      const matchPriest = (b.priestName || '').toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchRef && !matchGotra && !matchOffering && !matchPriest) return false;
    }

    return true;
  });

  // Soft badges exactly matching the screenshot aesthetic
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-[#DCFCE7] text-[#15803D] border border-[#BBF7D0]';
      case 'Completed':
        return 'bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD]';
      case 'In-Progress':
        return 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]';
      case 'Cancelled':
        return 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA]';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Booking Ref', 
      'Devotee Name', 
      'Phone', 
      'Gotra', 
      'Nakshatra', 
      'Offering', 
      'Date', 
      'Time Slot', 
      'Amount', 
      'Status', 
      'Assigned Priest', 
      'Prasad Delivery Mode', 
      'Tracking No', 
      'Settlement ID'
    ];
    const rows = filteredBookings.map(b => [
      b.bookingRef,
      `"${b.devoteeName}"`,
      b.devoteePhone,
      b.gotra || '',
      b.nakshatra || '',
      `"${b.offeringTitle}"`,
      b.bookingDate,
      `"${b.slotTime}"`,
      b.amount,
      b.status,
      `"${b.priestName || ''}"`,
      b.prasadDelivery,
      b.trackingNumber || '',
      b.settlementId || 'Unsettled',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${currentTemple.name.replace(/\s+/g, '_')}_Bookings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
        
        {/* Filter Controls matching screenshot */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2.5 w-full md:flex-1 min-w-0">
            
            {/* Search Input matching screenshot */}
            <div className="relative w-full sm:w-auto sm:min-w-[200px] max-w-xs">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                id="input-search-bookings"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
              />
            </div>

            {/* Date Dropdown matching screenshot */}
            <div className="relative flex-1 sm:flex-initial min-w-[130px]">
              <select
                id="select-date-filter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                aria-label="Filter by date range"
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-8 text-sm text-slate-700 font-medium hover:border-slate-300 focus:outline-none cursor-pointer shadow-sm transition"
              >
                <option value="ALL">Date</option>
                <option value="TODAY">Today (04 Sep 2026)</option>
                <option value="UPCOMING">Upcoming Dates</option>
                <option value="PAST">Past Dates</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Booking Status Dropdown matching screenshot */}
            <div className="relative flex-1 sm:flex-initial min-w-[140px]">
              <select
                id="select-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by booking status"
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-8 text-sm text-slate-700 font-medium hover:border-slate-300 focus:outline-none cursor-pointer shadow-sm transition"
              >
                <option value="ALL">Booking Status</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Offering Dropdown matching screenshot */}
            <div className="relative flex-1 sm:flex-initial min-w-[130px]">
              <select
                id="select-offering-filter"
                value={offeringFilter}
                onChange={(e) => setOfferingFilter(e.target.value)}
                aria-label="Filter by offering"
                className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-8 text-sm text-slate-700 font-medium hover:border-slate-300 focus:outline-none cursor-pointer shadow-sm transition"
              >
                <option value="ALL">Offering</option>
                {offerings
                  .filter(o => o.templeId === currentTemple.id)
                  .map((off) => (
                    <option key={off.id} value={off.id}>
                      {off.title}
                    </option>
                  ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

          </div>

          {/* Operational Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full md:w-auto">
            <button
              id="btn-open-sanctum-roster"
              onClick={() => setIsRosterOpen(true)}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#0B1528] text-white hover:bg-[#152542] shadow-sm transition flex items-center justify-center space-x-1.5 cursor-pointer text-center"
            >
              <UserCheck className="w-4 h-4 text-[#F59E0B]" />
              <span>Sanctum Sankalpa Roster</span>
            </button>

            <button
              id="btn-export-bookings-csv"
              onClick={handleExportCSV}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition flex items-center justify-center space-x-1.5 cursor-pointer text-center"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>

        </div>

        {/* Data Table exactly matching screenshot */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[760px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-xs font-semibold">
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Devotee</th>
                <th className="py-3 px-4">Offering</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Net Share</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                    <p className="font-medium text-slate-600">No bookings found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr 
                    key={b.id} 
                    className="hover:bg-slate-50/80 transition group"
                  >
                    <td className="py-4 px-4 font-mono font-medium text-slate-900">
                      {b.bookingRef}
                    </td>

                    <td className="py-4 px-4 text-slate-800">
                      <div className="font-medium text-slate-900">{b.devoteeName}</div>
                      {b.gotra && (
                        <div className="text-xs text-slate-400">Gotra: {b.gotra}</div>
                      )}
                    </td>

                    <td className="py-4 px-4 text-slate-700">
                      <div className="font-medium text-slate-900">{b.offeringTitle}</div>
                      <div className="text-xs text-slate-400">{b.slotTime}</div>
                    </td>

                    <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                      {b.bookingDate}
                    </td>

                    <td className="py-4 px-4">
                      <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${getStatusBadge(b.status)}`}>
                        {b.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right font-mono font-semibold text-slate-900 whitespace-nowrap">
                      ₹{b.templeShare.toLocaleString('en-IN')}
                    </td>

                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => onOpenBooking(b)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                      >
                        Archaka Desk
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing <strong className="text-slate-800">{filteredBookings.length}</strong> of {templeBookings.length} total temple bookings</span>
          <span className="font-mono">Current Sanctum: <strong className="text-slate-800">{currentTemple.name}</strong></span>
        </div>

      </div>

      {/* Sankalpa Roster Modal */}
      <SanctumSankalpaRosterModal
        isOpen={isRosterOpen}
        onClose={() => setIsRosterOpen(false)}
        templeId={currentTemple.id}
      />

    </div>
  );
};
