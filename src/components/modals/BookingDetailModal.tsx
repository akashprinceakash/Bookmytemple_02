import React, { useState } from 'react';
import { Booking, BookingStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CheckCircle2, 
  User, 
  Phone, 
  Sparkles, 
  Calendar, 
  CreditCard, 
  Truck, 
  Printer, 
  Send, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

interface BookingDetailModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ booking, onClose }) => {
  const { updateBookingDetails, role } = useApp();

  const [status, setStatus] = useState<BookingStatus>(booking?.status || 'Confirmed');
  const [priestName, setPriestName] = useState<string>(booking?.priestName || 'Pt. Vidya Shankar Shastri');
  const [priestPhone, setPriestPhone] = useState<string>(booking?.priestPhone || '+91 94150 11220');
  const [priestNotes, setPriestNotes] = useState<string>(booking?.priestNotes || '');
  const [trackingNumber, setTrackingNumber] = useState<string>(booking?.trackingNumber || '');
  const [familyMembers, setFamilyMembers] = useState<string>(booking?.familyMembers || '');
  const [notificationSent, setNotificationSent] = useState<boolean>(booking?.notificationSent || false);
  const [isTriggeringNotice, setIsTriggeringNotice] = useState<boolean>(false);

  if (!booking) return null;

  const handleSave = () => {
    updateBookingDetails(booking.id, {
      status,
      priestName,
      priestPhone,
      priestNotes,
      trackingNumber,
      familyMembers,
      notificationSent,
      ...(status === 'Completed' && !booking.performedAt ? { performedAt: new Date().toISOString() } : {}),
    });
    onClose();
  };

  const handleTriggerNotification = () => {
    setIsTriggeringNotice(true);
    setTimeout(() => {
      setNotificationSent(true);
      setIsTriggeringNotice(false);
    }, 600);
  };

  const handlePrintVoucher = () => {
    window.print();
  };

  const getStatusBadge = (st: BookingStatus) => {
    switch (st) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        id="booking-detail-modal-card"
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col text-slate-900"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B1528] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  {booking.bookingRef}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-md border font-semibold ${getStatusBadge(status)}`}>
                  {status}
                </span>
                {booking.settlementId && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    Settled ({booking.settlementId})
                  </span>
                )}
              </div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900 mt-1">
                {booking.offeringTitle}
              </h2>
              <p className="text-xs text-slate-500">{booking.templeName}</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 ml-2">
            <button
              onClick={handlePrintVoucher}
              title="Print Priest Seva Voucher"
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 border border-slate-200 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              id="btn-close-booking-modal"
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto text-sm flex-1 bg-white">
          
          {/* Section 1: Devotee & Astrological Lineage */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Devotee & Vedic Coordinates</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                Booking Date: {booking.bookingDate}
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <p className="text-[11px] text-slate-500">Devotee Name</p>
                <p className="font-semibold text-slate-900 text-base">{booking.devoteeName}</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Contact Phone</p>
                <p className="text-slate-800 flex items-center space-x-1 font-mono text-xs">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{booking.devoteePhone}</span>
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500">Email Address</p>
                <p className="text-slate-800 text-xs truncate">{booking.devoteeEmail}</p>
              </div>
            </div>

            {/* Sacred Astrological Lineage */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Gotra</span>
                <span className="font-bold text-slate-900 font-serif">{booking.gotra || 'Kashyapa'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Nakshatra</span>
                <span className="font-semibold text-slate-900">{booking.nakshatra || 'Rohini'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Rashi</span>
                <span className="font-semibold text-slate-900">{booking.rashi || 'Vrishabha'}</span>
              </div>
            </div>

            {/* Sankalpa Notes */}
            {booking.sankalpaNotes && (
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
                <span className="font-semibold text-amber-900 flex items-center space-x-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Sankalpa Purpose & Devotee Prayers:</span>
                </span>
                <p className="text-amber-800 italic">"{booking.sankalpaNotes}"</p>
              </div>
            )}

            <div>
              <label htmlFor="input-family-members" className="text-[11px] text-slate-600 font-medium block mb-1">
                Family Members Included in Sankalpa Recital
              </label>
              <input
                id="input-family-members"
                type="text"
                value={familyMembers}
                onChange={(e) => setFamilyMembers(e.target.value)}
                placeholder="e.g. Smt. Sumitra (Wife), Master Aditya (Son)"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 transition"
              />
            </div>
          </div>

          {/* Section 2: Schedule & Financial Accounting */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-[11px] text-slate-500">Scheduled Slot</p>
                <p className="font-bold text-slate-900 text-sm">{booking.bookingDate}</p>
                <p className="text-xs text-slate-600 mt-0.5">{booking.slotTime}</p>
                <div className="mt-2 text-[10px] text-slate-500">
                  Offering Type: <strong className="text-slate-800">{booking.offeringType}</strong>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-slate-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-[11px] text-slate-500">Financial Accounting</p>
                <p className="font-bold text-slate-900 text-sm">
                  Total Paid: ₹{booking.amount.toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Temple Share: <strong className="text-slate-900">₹{booking.templeShare.toLocaleString('en-IN')}</strong> &bull; Platform Fee: ₹{booking.platformFee}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  {booking.paymentMethod} &bull; {booking.paymentRef}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Archaka (Priest) Execution Desk */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Sanctum Archaka Assignment & Execution</span>
              </h3>
              {booking.performedAt && (
                <span className="text-[10px] font-mono text-emerald-700 flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  <span>Executed: {new Date(booking.performedAt).toLocaleTimeString()}</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="select-execution-status" className="text-[11px] text-slate-600 font-medium block mb-1">
                  Lifecycle Status
                </label>
                <select
                  id="select-execution-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BookingStatus)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-medium"
                >
                  <option value="Confirmed">Confirmed (Upcoming)</option>
                  <option value="In-Progress">In-Progress (Performing)</option>
                  <option value="Completed">Completed (Performed)</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label htmlFor="input-archaka-name" className="text-[11px] text-slate-600 font-medium block mb-1">
                  Assigned Priest (Archaka)
                </label>
                <input
                  id="input-archaka-name"
                  type="text"
                  value={priestName}
                  onChange={(e) => setPriestName(e.target.value)}
                  placeholder="Presiding Archaka name"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label htmlFor="input-archaka-phone" className="text-[11px] text-slate-600 font-medium block mb-1">
                  Archaka Direct Phone
                </label>
                <input
                  id="input-archaka-phone"
                  type="text"
                  value={priestPhone}
                  onChange={(e) => setPriestPhone(e.target.value)}
                  placeholder="+91 Archaka phone"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="textarea-priest-notes-modal" className="text-[11px] text-slate-600 font-medium block mb-1">
                Archaka Ritual Notes & Sankalpa Confirmation
              </label>
              <textarea
                id="textarea-priest-notes-modal"
                value={priestNotes}
                onChange={(e) => setPriestNotes(e.target.value)}
                placeholder="Enter archana notes, sacred mantra recitals, or sanctum completion observations..."
                rows={2}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          {/* Section 4: Prasad Fulfillment & Devotee Communications */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-500" />
                <span>Prasad Logistics & Devotee Communication</span>
              </h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-md font-medium border ${
                booking.prasadDelivery === 'Home Delivery'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}>
                {booking.prasadDelivery}
              </span>
            </div>

            {booking.prasadDelivery === 'Home Delivery' ? (
              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs">
                  <span className="text-[10px] text-slate-400 block">Devotee Shipping Address:</span>
                  <p className="text-slate-800 mt-0.5">{booking.deliveryAddress || 'Address on file'}</p>
                </div>

                <div>
                  <label htmlFor="input-tracking-awb" className="text-[11px] text-slate-600 font-medium block mb-1">
                    Courier AWB / SpeedPost Tracking Number
                  </label>
                  <input
                    id="input-tracking-awb"
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. INP-SPEEDPOST-98218204 or BLUEDART-481920"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono"
                  />
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <p className="text-slate-900 font-medium">In-Person Counter Pickup at Temple</p>
                  <p className="text-[11px] text-slate-500">Devotee will collect prasad with voucher {booking.bookingRef} at the sanctum desk.</p>
                </div>
                <div className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-800 font-mono text-xs font-semibold">
                  Token: #{booking.bookingRef.slice(-4)}
                </div>
              </div>
            )}

            {/* Notification Dispatch */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${notificationSent ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                <span className="text-xs text-slate-600">
                  {notificationSent 
                    ? 'Devotee WhatsApp / SMS notification sent with sankalpa confirmation.' 
                    : 'Devotee notification pending dispatch.'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleTriggerNotification}
                disabled={isTriggeringNotice || notificationSent}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
                  notificationSent 
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-default'
                    : 'bg-[#0B1528] text-white hover:bg-[#162744] cursor-pointer shadow-sm'
                }`}
              >
                <Send className="w-3 h-3 text-[#F59E0B]" />
                <span>{notificationSent ? 'Sent' : isTriggeringNotice ? 'Sending...' : 'Send WhatsApp Alert'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50/70">
          <span className="text-xs text-slate-500">
            Operator: <strong className="text-slate-800">{role === 'BMT_ADMIN' ? 'BMT Admin Console' : 'Temple Sanctum Desk'}</strong>
          </span>

          <div className="flex items-center space-x-3">
            <button
              id="btn-cancel-booking-modal"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-save-booking-status"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0B1528] text-white hover:bg-[#162744] shadow transition flex items-center space-x-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#F59E0B]" />
              <span>Update Fulfillment Record</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
