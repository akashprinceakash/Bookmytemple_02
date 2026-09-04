import React, { useState } from 'react';
import { Settlement, SettlementStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, ArrowRight, Printer, CreditCard, ShieldCheck, Download, Building2, Check, Clock } from 'lucide-react';

interface SettlementDetailModalProps {
  settlement: Settlement | null;
  onClose: () => void;
}

export const SettlementDetailModal: React.FC<SettlementDetailModalProps> = ({ settlement, onClose }) => {
  const { advanceSettlementStatus, role, bookings } = useApp();
  const [targetStatus, setTargetStatus] = useState<SettlementStatus>('Processing');
  const [utrRef, setUtrRef] = useState(settlement?.utrRef || '');
  const [transitionNotes, setTransitionNotes] = useState('');

  if (!settlement) return null;

  const getStatusBadge = (st: SettlementStatus) => {
    switch (st) {
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

  const steps: SettlementStatus[] = ['Draft', 'Generated', 'Processing', 'Completed'];
  const currentStepIdx = steps.indexOf(settlement.status);

  const handleAdvance = () => {
    advanceSettlementStatus(settlement.id, targetStatus, utrRef, transitionNotes);
    onClose();
  };

  const coveredBookings = bookings.filter(b => settlement.bookingIds?.includes(b.id));

  const handlePrint = () => {
    window.print();
  };

  const handleExportNEFT = () => {
    // Generate standard bank NEFT upload file format
    const headers = ['Beneficiary Name', 'Account Number', 'IFSC Code', 'Amount (INR)', 'Payment Mode', 'Settlement Reference', 'Remarks'];
    const row = [
      `"${settlement.bankAccount.accountHolder}"`,
      settlement.bankAccount.accountNumberMasked.replace(/\s+/g, ''),
      settlement.bankAccount.ifsc,
      settlement.netPayoutAmount,
      settlement.paymentMode || 'NEFT',
      settlement.settlementRef,
      `"BookMyTemples Payout for ${settlement.templeName.replace(/"/g, '')}"`
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), row.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NEFT_Upload_${settlement.settlementRef}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const gstOnCommission = settlement.gstOnCommission ?? Math.round(settlement.platformCommission * 0.18);
  const tdsDeduction = settlement.tdsDeduction ?? Math.round(settlement.grossAmount * 0.01);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        id="settlement-detail-modal-card"
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col text-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                {settlement.settlementRef}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-md border font-semibold ${getStatusBadge(settlement.status)}`}>
                {settlement.status}
              </span>
              {settlement.paymentMode && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {settlement.paymentMode}
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 mt-1">
              {settlement.templeName}
            </h2>
            <p className="text-xs text-slate-500">
              Audit Settlement Period: {settlement.periodStart} &rarr; {settlement.periodEnd}
            </p>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 ml-2">
            <button
              id="btn-export-neft"
              onClick={handleExportNEFT}
              title="Download NEFT Clearing File"
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              id="btn-print-settlement"
              onClick={handlePrint}
              title="Print Settlement Statement"
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              id="btn-close-settlement-modal"
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto text-sm flex-1 bg-white">
          
          {/* Progress Tracker */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Settlement Lifecycle Progress
            </p>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={st} className="relative z-10 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition shadow-sm ${
                      isPassed 
                        ? 'bg-[#0B1528] text-white border-2 border-[#F59E0B]' 
                        : 'bg-white text-slate-400 border border-slate-200'
                    }`}>
                      {isPassed ? <Check className="w-4 h-4 text-[#F59E0B]" /> : idx + 1}
                    </div>
                    <span className={`text-[11px] mt-1.5 font-medium ${isCurrent ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                      {st}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statement Calculations */}
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-slate-500" />
              <span>Financial Statement & Reconciliation</span>
            </h3>

            <div className="space-y-2 text-xs pt-1">
              <div className="flex justify-between text-slate-600">
                <span>Gross Seva Collection ({settlement.bookingCount} Devotee Bookings):</span>
                <span className="font-semibold text-slate-900">₹{settlement.grossAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Less: BMT Platform Fee (Agreed Commission):</span>
                <span className="text-rose-600 font-medium">-₹{settlement.platformCommission.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Less: GST on Platform Fee (18% Statutory):</span>
                <span className="text-rose-600 font-medium">-₹{gstOnCommission.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Less: TDS Deduction (Sec 194C / Statutory):</span>
                <span className="text-rose-600 font-medium">-₹{tdsDeduction.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-900">Net Disbursement Amount:</span>
                <span className="text-emerald-700 font-mono text-base">
                  ₹{settlement.netPayoutAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>

          {/* Bank Account Details */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-700 font-semibold flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Verified Beneficiary Bank Account</span>
              </span>
              <span className="text-emerald-700 flex items-center space-x-1 font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>NPCI / Penny Drop Verified</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block">Bank Name</span>
                <p className="font-medium text-slate-800">{settlement.bankAccount.bankName}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Account Number</span>
                <p className="font-mono text-slate-800 font-medium">{settlement.bankAccount.accountNumberMasked}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Account Holder / Trust</span>
                <p className="font-medium text-slate-800">{settlement.bankAccount.accountHolder}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">IFSC Code</span>
                <p className="font-mono text-slate-800 font-medium">{settlement.bankAccount.ifsc}</p>
              </div>
            </div>

            {settlement.utrRef && (
              <div className="mt-2 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono text-xs">
                Bank UTR Confirmation: <strong>{settlement.utrRef}</strong>
              </div>
            )}
          </div>

          {/* Bookings Covered in this Settlement */}
          {coveredBookings.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-semibold text-slate-700 block">
                Audited Bookings Included in Payout ({coveredBookings.length}):
              </span>
              <div className="max-h-36 overflow-y-auto divide-y divide-slate-200 text-xs">
                {coveredBookings.map(b => (
                  <div key={b.id} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-slate-900">{b.bookingRef}</span>
                      <span className="text-slate-500 ml-2">{b.offeringTitle}</span>
                    </div>
                    <span className="font-semibold text-slate-900 font-mono">₹{b.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Advancement Form (Only for BMT Admin or when not yet completed) */}
          {role === 'BMT_ADMIN' && settlement.status !== 'Completed' && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-semibold text-slate-800">
                Advance Lifecycle State
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label htmlFor="select-advance-status" className="text-slate-500 block mb-1">Target Stage</label>
                  <select
                    id="select-advance-status"
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.target.value as SettlementStatus)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  >
                    {settlement.status === 'Draft' && <option value="Generated">Generated (Invoice Created)</option>}
                    {(settlement.status === 'Draft' || settlement.status === 'Generated') && (
                      <option value="Processing">Processing (Transferred to Bank)</option>
                    )}
                    <option value="Completed">Completed (UTR Received & Disbursed)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="input-settlement-utr" className="text-slate-500 block mb-1">
                    Bank UTR Reference Number
                  </label>
                  <input
                    id="input-settlement-utr"
                    type="text"
                    value={utrRef}
                    onChange={(e) => setUtrRef(e.target.value)}
                    placeholder="e.g. UTR-HDFC-991283"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="input-audit-notes" className="text-slate-500 block mb-1 text-xs">
                  Audit Notes / Bank Batch ID
                </label>
                <input
                  id="input-audit-notes"
                  type="text"
                  value={transitionNotes}
                  onChange={(e) => setTransitionNotes(e.target.value)}
                  placeholder="e.g. Approved by Treasury Officer. Disbursed via Corporate Netbanking."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="btn-confirm-advance-settlement"
                  onClick={handleAdvance}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0B1528] text-white hover:bg-[#162744] shadow transition flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Apply State Transition</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#F59E0B]" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-200 bg-slate-50/70 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            Close Statement
          </button>
        </div>

      </div>
    </div>
  );
};
