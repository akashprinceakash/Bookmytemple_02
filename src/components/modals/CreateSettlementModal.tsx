import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckSquare, Square, Building2, IndianRupee, ShieldCheck, AlertCircle, FileCheck, Layers } from 'lucide-react';

interface CreateSettlementModalProps {
  onClose: () => void;
}

export const CreateSettlementModal: React.FC<CreateSettlementModalProps> = ({ onClose }) => {
  const { temples, bookings, createSettlementBatch } = useApp();
  const [selectedTempleId, setSelectedTempleId] = useState(temples[0]?.id || '');
  const [paymentMode, setPaymentMode] = useState<'NEFT' | 'RTGS' | 'CMS_BULK'>('NEFT');
  const [notes, setNotes] = useState('');

  const selectedTemple = temples.find(t => t.id === selectedTempleId);

  // Completed bookings for this temple that have NOT been settled yet
  const eligibleBookings = bookings.filter(
    b => b.templeId === selectedTempleId && b.status === 'Completed' && !b.settlementId
  );

  const [selectedBookingIds, setSelectedBookingIds] = useState<string[]>(
    eligibleBookings.map(b => b.id)
  );

  const handleToggleBooking = (id: string) => {
    setSelectedBookingIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedBookingIds.length === eligibleBookings.length) {
      setSelectedBookingIds([]);
    } else {
      setSelectedBookingIds(eligibleBookings.map(b => b.id));
    }
  };

  const selectedBookings = eligibleBookings.filter(b => selectedBookingIds.includes(b.id));
  const grossAmount = selectedBookings.reduce((sum, b) => sum + b.amount, 0);
  const commissionRate = selectedTemple?.commissionRatePercent || 5;
  const platformCommission = Math.round((grossAmount * commissionRate) / 100);
  const gstOnCommission = Math.round(platformCommission * 0.18); // 18% GST
  const tdsDeduction = Math.round(grossAmount * 0.01); // 1% TDS Sec 194C
  const netPayout = grossAmount - platformCommission - gstOnCommission - tdsDeduction;

  const handleCreate = () => {
    if (selectedBookingIds.length === 0) {
      alert('Please select at least one completed booking to include in this settlement batch.');
      return;
    }
    createSettlementBatch(selectedTempleId, selectedBookingIds, notes, paymentMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        id="create-settlement-modal-card"
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col text-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B1528] text-white flex items-center justify-center shrink-0 shadow-sm">
              <FileCheck className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 font-mono">
                BMT Central Treasury Operations
              </span>
              <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                Generate Temple Payout Settlement Batch
              </h2>
            </div>
          </div>

          <button
            id="btn-close-settlement-create"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto text-sm flex-1 bg-white">
          
          {/* Temple Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label htmlFor="select-settle-temple" className="text-xs font-semibold text-slate-700 block mb-1">
                Select Beneficiary Temple Sanctum:
              </label>
              <select
                id="select-settle-temple"
                value={selectedTempleId}
                onChange={(e) => {
                  setSelectedTempleId(e.target.value);
                  const freshEligible = bookings.filter(
                    b => b.templeId === e.target.value && b.status === 'Completed' && !b.settlementId
                  );
                  setSelectedBookingIds(freshEligible.map(b => b.id));
                }}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-slate-400"
              >
                {temples.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.city})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="select-settle-mode" className="text-xs font-semibold text-slate-700 block mb-1">
                Clearing / Payment Mode:
              </label>
              <select
                id="select-settle-mode"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono"
              >
                <option value="NEFT">NEFT (National Electronic Funds Transfer)</option>
                <option value="RTGS">RTGS (Real-Time Gross Settlement)</option>
                <option value="CMS_BULK">CMS Bulk Direct Bank Clearing</option>
              </select>
            </div>
          </div>

          {/* Beneficiary Account Snapshot */}
          {selectedTemple && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[#0B1528] text-white flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4 text-[#F59E0B]" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{selectedTemple.bankDetails.accountHolder}</p>
                  <p className="text-slate-500 font-mono text-[11px]">
                    {selectedTemple.bankDetails.bankName} &bull; {selectedTemple.bankDetails.accountNumberMasked} &bull; IFSC: {selectedTemple.bankDetails.ifsc}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Commission Rate</span>
                <span className="font-bold text-slate-900">{selectedTemple.commissionRatePercent}%</span>
              </div>
            </div>
          )}

          {/* Booking Selection Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Unsettled Completed Sevas ({eligibleBookings.length} Available)
                </h3>
              </div>
              
              {eligibleBookings.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  {selectedBookingIds.length === eligibleBookings.length ? 'Deselect All' : 'Select All'}
                </button>
              )}
            </div>

            {eligibleBookings.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                <AlertCircle className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p>No unsettled completed bookings found for this temple sanctum.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Only bookings marked 'Completed' by Archaka are eligible for settlement generation.
                </p>
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
                {eligibleBookings.map(b => {
                  const isChecked = selectedBookingIds.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      onClick={() => handleToggleBooking(b.id)}
                      className={`p-3 flex items-center justify-between text-xs cursor-pointer transition ${
                        isChecked ? 'bg-slate-50/80' : 'hover:bg-slate-50/40'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-slate-700">
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-[#0B1528]" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-mono font-bold text-slate-900">{b.bookingRef}</p>
                          <p className="text-slate-500">{b.offeringTitle} &bull; {b.devoteeName}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-mono font-bold text-slate-900">₹{b.amount.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-slate-400">{b.bookingDate}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Settlement Calculations Box */}
          {selectedBookings.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Selected Seva Volume ({selectedBookings.length} Bookings):</span>
                <span className="font-semibold text-slate-900">₹{grossAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Platform Commission ({commissionRate}%):</span>
                <span className="text-rose-600 font-medium">-₹{platformCommission.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>18% GST on Commission:</span>
                <span className="text-rose-600 font-medium">-₹{gstOnCommission.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>1% Statutory TDS (Sec 194C):</span>
                <span className="text-rose-600 font-medium">-₹{tdsDeduction.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-900">Net Temple Payout Batch:</span>
                <span className="text-emerald-700 font-mono text-base">
                  ₹{netPayout.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="input-batch-notes" className="text-xs font-semibold text-slate-700 block mb-1">
              Internal Treasury Audit Notes:
            </label>
            <input
              id="input-batch-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Scheduled bi-weekly disbursement following Temple Board approval."
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50/70">
          <span className="text-xs text-slate-500">
            {selectedBookings.length} items selected
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-confirm-create-settlement"
              onClick={handleCreate}
              disabled={selectedBookings.length === 0}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shadow transition flex items-center space-x-1.5 ${
                selectedBookings.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-[#0B1528] text-white hover:bg-[#162744] cursor-pointer'
              }`}
            >
              <FileCheck className="w-4 h-4 text-[#F59E0B]" />
              <span>Create Payout Batch</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
