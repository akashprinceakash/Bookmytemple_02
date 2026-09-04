import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Printer, X, Calendar, UserCheck, Sparkles, Building2, Download } from 'lucide-react';

interface SanctumSankalpaRosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  templeId?: string;
}

export const SanctumSankalpaRosterModal: React.FC<SanctumSankalpaRosterModalProps> = ({
  isOpen,
  onClose,
  templeId,
}) => {
  const { bookings, currentTemple, temples } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>('2026-09-04');

  if (!isOpen) return null;

  const targetTemple = templeId 
    ? temples.find(t => t.id === templeId) 
    : currentTemple;

  const targetBookings = bookings.filter(b => {
    if (targetTemple && b.templeId !== targetTemple.id) return false;
    if (b.bookingDate !== selectedDate) return false;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'Sl No', 
      'Booking Ref', 
      'Devotee Name', 
      'Gotra', 
      'Nakshatra', 
      'Rashi', 
      'Seva / Pooja', 
      'Slot Time', 
      'Sankalpa Intention', 
      'Assigned Priest', 
      'Status'
    ];
    const rows = targetBookings.map((b, idx) => [
      idx + 1,
      b.bookingRef,
      `"${b.devoteeName}"`,
      b.gotra || 'Not Specified',
      b.nakshatra || 'Not Specified',
      b.rashi || 'Not Specified',
      `"${b.offeringTitle}"`,
      `"${b.slotTime}"`,
      `"${(b.sankalpaNotes || '').replace(/"/g, '""')}"`,
      b.priestName || 'Unassigned',
      b.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sanctum_Roster_${(targetTemple?.name || 'Temple').replace(/\s+/g, '_')}_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        id="sanctum-roster-modal"
        className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col text-slate-900"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B1528] text-white flex items-center justify-center shrink-0 shadow-sm">
              <UserCheck className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 tracking-tight">
                Daily Sanctum Sankalpa Roster & Priest Ledger
              </h2>
              <p className="text-xs text-slate-500">
                Official ceremonial execution roster for {targetTemple?.name || 'Sanctum'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 ml-2">
            <button
              id="btn-print-roster"
              onClick={handlePrint}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white text-slate-800 hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1 sm:space-x-1.5 border border-slate-200 shadow-sm transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Print Roster</span>
            </button>
            <button
              id="btn-export-roster-csv"
              onClick={handleExportCSV}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0B1528] text-white hover:bg-[#162744] text-xs font-semibold flex items-center space-x-1 sm:space-x-1.5 shadow transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#F59E0B]" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              id="btn-close-roster-modal"
              onClick={onClose}
              aria-label="Close roster"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-slate-700 font-medium">Seva Date:</span>
              <input
                id="roster-date-picker"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-slate-600">Scheduled:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-800 font-bold text-[11px]">
                {targetBookings.length} Devotee Sevas
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Vedic Astrological Alignment &bull; Gotra Lineage Recital
          </div>
        </div>

        {/* Roster Document Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 text-slate-900 bg-white">
          
          {/* Official Document Banner */}
          <div className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">
                <Building2 className="w-4 h-4 text-slate-600" />
                <span>BookMyTemples &bull; Sacred Ritual Fulfillment</span>
              </div>
              <h1 className="text-xl font-serif font-bold text-slate-900">
                {targetTemple?.name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Deity: <strong className="text-slate-800">{targetTemple?.primaryDeity}</strong> &bull; Location: {targetTemple?.city}, {targetTemple?.state}
              </p>
            </div>

            <div className="text-left sm:text-right sm:border-l sm:border-slate-200 sm:pl-5 text-xs">
              <p className="text-slate-500">Roster Execution Date</p>
              <p className="text-base font-bold text-slate-900 font-mono">{selectedDate}</p>
              <p className="text-[11px] text-slate-400">Batch: BMT-ROSTER-{selectedDate.replace(/-/g, '')}</p>
            </div>
          </div>

          {/* Roster Table */}
          {targetBookings.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-50 border border-slate-200">
              <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-900">No sevas scheduled for {selectedDate}</p>
              <p className="text-xs text-slate-500 mt-1">Select another date (e.g. 2026-09-04 or 2026-09-05) to view upcoming sankalpas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
              <table className="w-full text-left text-xs min-w-[780px]">
                <thead className="bg-slate-50/80 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200 font-mono">
                  <tr>
                    <th className="px-3.5 py-3 font-semibold">#</th>
                    <th className="px-3.5 py-3 font-semibold">Booking ID</th>
                    <th className="px-3.5 py-3 font-semibold">Devotee Name</th>
                    <th className="px-3.5 py-3 font-semibold">Gotra</th>
                    <th className="px-3.5 py-3 font-semibold">Nakshatra / Rashi</th>
                    <th className="px-3.5 py-3 font-semibold">Seva & Slot</th>
                    <th className="px-3.5 py-3 font-semibold">Sankalpa Intention</th>
                    <th className="px-3.5 py-3 font-semibold">Assigned Priest</th>
                    <th className="px-3.5 py-3 font-semibold">Archaka Sign-off</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {targetBookings.map((b, idx) => (
                    <tr key={b.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-3.5 py-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="px-3.5 py-3 font-mono font-bold text-slate-900">{b.bookingRef}</td>
                      <td className="px-3.5 py-3">
                        <div className="font-semibold text-slate-900">{b.devoteeName}</div>
                        <div className="text-[10px] text-slate-400">{b.devoteePhone}</div>
                      </td>
                      <td className="px-3.5 py-3">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium border border-slate-200 font-serif">
                          {b.gotra || 'Kashyapa'}
                        </span>
                      </td>
                      <td className="px-3.5 py-3">
                        <div className="font-medium text-slate-800">{b.nakshatra || 'Rohini'}</div>
                        <div className="text-[10px] text-slate-400">{b.rashi || 'Vrishabha'}</div>
                      </td>
                      <td className="px-3.5 py-3">
                        <div className="font-medium text-slate-800">{b.offeringTitle}</div>
                        <div className="text-[10px] text-slate-500">{b.slotTime}</div>
                      </td>
                      <td className="px-3.5 py-3 max-w-xs">
                        <p className="text-[11px] text-slate-700 italic line-clamp-2">
                          "{b.sankalpaNotes || 'General prayer for peace, health and spiritual prosperity.'}"
                        </p>
                        {b.familyMembers && (
                          <p className="text-[10px] text-slate-400 mt-0.5">Family: {b.familyMembers}</p>
                        )}
                      </td>
                      <td className="px-3.5 py-3">
                        <div className="text-slate-900 font-medium">
                          {b.priestName || 'Pt. Vidya Shankar'}
                        </div>
                        <div className="text-[10px] text-slate-400">Sanctum Archaka</div>
                      </td>
                      <td className="px-3.5 py-3">
                        <div className="w-24 h-8 border border-dashed border-slate-300 rounded bg-slate-50 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                          [ Signature ]
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Sanctum Execution Sign-off Block */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-slate-500 text-[11px]">Chief Archaka / Head Priest</p>
              <div className="mt-2 h-10 border-b border-slate-300 flex items-end">
                <span className="text-xs text-slate-900 font-serif font-semibold">Pt. Rameshwar Shastri</span>
              </div>
              <span className="text-[10px] text-slate-400">Garbhagriha In-Charge</span>
            </div>

            <div>
              <p className="text-slate-500 text-[11px]">Temple Trust Executive Officer</p>
              <div className="mt-2 h-10 border-b border-slate-300 flex items-end">
                <span className="text-xs text-slate-900 font-medium">Shri S. Gokhale</span>
              </div>
              <span className="text-[10px] text-slate-400">Administration & Audit</span>
            </div>

            <div>
              <p className="text-slate-500 text-[11px]">Prasad Logistics Dispatch Verification</p>
              <div className="mt-2 h-10 border-b border-slate-300 flex items-end">
                <span className="text-xs text-slate-900 font-medium">Verified &bull; {targetBookings.length} Packets Packed</span>
              </div>
              <span className="text-[10px] text-slate-400">Dispatch Desk Handover</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-slate-500">
            BookMyTemples Sanctum Fulfillment Subsystem &bull; Operational Record
          </span>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0B1528] text-white hover:bg-[#162744] font-semibold transition cursor-pointer text-center justify-center"
          >
            Close Roster
          </button>
        </div>

      </div>
    </div>
  );
};
