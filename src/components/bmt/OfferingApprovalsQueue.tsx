import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Building2, 
  ShieldCheck, 
  MessageSquare
} from 'lucide-react';

export const OfferingApprovalsQueue: React.FC = () => {
  const { offerings, approveOffering, rejectOffering } = useApp();
  const [activeSubTab, setActiveSubTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [rejectingOfferingId, setRejectingOfferingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const pendingList = offerings.filter(o => o.approvalStatus === 'pending_approval');
  const approvedList = offerings.filter(o => o.approvalStatus === 'approved');
  const rejectedList = offerings.filter(o => o.approvalStatus === 'rejected');

  const handleConfirmReject = () => {
    if (!rejectingOfferingId) return;
    if (!rejectionReason.trim()) {
      alert('Please specify a reason or revision note for the temple team.');
      return;
    }
    rejectOffering(rejectingOfferingId, rejectionReason);
    setRejectingOfferingId(null);
    setRejectionReason('');
  };

  const currentList = activeSubTab === 'pending' ? pendingList : activeSubTab === 'approved' ? approvedList : rejectedList;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 font-medium">
            Operational quality control: Temple offerings vetted and published by BMT
          </p>
        </div>

        {/* Tab switcher matching segmented pill style */}
        <div className="flex items-center bg-slate-100 p-0.5 sm:p-1 rounded-xl border border-slate-200 text-xs w-full sm:w-auto overflow-x-auto">
          <button
            id="tab-pending-offerings"
            onClick={() => setActiveSubTab('pending')}
            className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition flex items-center justify-center space-x-1 sm:space-x-1.5 cursor-pointer text-center ${
              activeSubTab === 'pending'
                ? 'bg-[#0B1528] text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>Pending ({pendingList.length})</span>
          </button>

          <button
            id="tab-approved-offerings"
            onClick={() => setActiveSubTab('approved')}
            className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition flex items-center justify-center space-x-1 sm:space-x-1.5 cursor-pointer text-center ${
              activeSubTab === 'approved'
                ? 'bg-[#0B1528] text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Approved ({approvedList.length})</span>
          </button>

          <button
            id="tab-rejected-offerings"
            onClick={() => setActiveSubTab('rejected')}
            className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition flex items-center justify-center space-x-1 sm:space-x-1.5 cursor-pointer text-center ${
              activeSubTab === 'rejected'
                ? 'bg-[#0B1528] text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Revisions ({rejectedList.length})</span>
          </button>
        </div>
      </div>

      {/* Rejection / Revision Note Modal */}
      {rejectingOfferingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-amber-600" />
              <span>Request Revision / Reject Offering</span>
            </h3>
            <p className="text-xs text-slate-600">
              Provide feedback for the temple administration explaining what needs to be adjusted (e.g. pricing benchmark, schedule conflict, or ritual guidelines).
            </p>
            <textarea
              id="textarea-rejection-reason"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Please clarify if dakshina includes courier dispatch of dry fruit prasad to devotee home address."
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
            />
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => { setRejectingOfferingId(null); setRejectionReason(''); }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#0B1528] text-white hover:bg-[#162744] transition cursor-pointer shadow-sm"
              >
                Send Revision Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offerings Cards Feed */}
      {currentList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-500 shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800">No offerings in this state</h3>
          <p className="text-xs text-slate-400 mt-1">
            {activeSubTab === 'pending'
              ? 'All temple submissions have been reviewed and verified!'
              : 'No records found in this category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {currentList.map((off) => (
            <div 
              key={off.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{off.templeName}</span>
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                    off.approvalStatus === 'approved' ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]' :
                    off.approvalStatus === 'pending_approval' ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]' :
                    'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]'
                  }`}>
                    {off.approvalStatus === 'pending_approval' ? 'Pending Approval' : off.approvalStatus}
                  </span>
                </div>

                <h3 className="text-base font-serif font-bold text-slate-900 pt-1">
                  {off.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                    {off.type}
                  </span>
                  <span className="text-slate-500">Deity: <strong className="text-slate-800">{off.deity}</strong></span>
                  <span className="text-slate-400">&bull; Duration: <strong className="text-slate-700">{off.durationMinutes} mins</strong></span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {off.description}
                </p>

                {/* Prasad and Schedules Details */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Devotee Dakshina:</span>
                    <span className="font-bold text-slate-900 text-sm font-mono">₹{off.price.toLocaleString('en-IN')}</span>
                  </div>
                  {off.prasadDetails && (
                    <div className="text-xs text-slate-700">
                      <span className="font-semibold text-slate-900">Prasad: </span>
                      {off.prasadDetails}
                    </div>
                  )}

                  {/* Schedules breakdown */}
                  <div className="pt-2 border-t border-slate-200 text-xs">
                    <span className="text-slate-500 font-medium block mb-1">Configured Schedules:</span>
                    <div className="space-y-1">
                      {off.schedules.map((sch, i) => (
                        <div key={i} className="flex items-center justify-between text-slate-700 bg-white px-2.5 py-1 rounded border border-slate-200">
                          <span>{sch.dayOfWeek.join(', ')}: {sch.startTime} - {sch.endTime}</span>
                          <span className="text-slate-900 font-mono font-medium">Max {sch.capacity} devotees</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {off.rejectionReason && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
                    <span className="font-bold block mb-0.5">Revision Feedback Provided:</span>
                    <p className="italic">"{off.rejectionReason}"</p>
                  </div>
                )}
              </div>

              {/* Action Buttons for BMT Admin */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-[11px] text-slate-400">
                  Submitted: {new Date(off.submittedAt).toLocaleDateString()}
                </span>

                {off.approvalStatus === 'pending_approval' ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setRejectingOfferingId(off.id)}
                      className="px-3 py-1.5 rounded-xl font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition flex items-center space-x-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Request Revision</span>
                    </button>
                    <button
                      onClick={() => approveOffering(off.id)}
                      className="px-4 py-1.5 rounded-xl font-semibold bg-[#0B1528] text-white hover:bg-[#162744] shadow transition flex items-center space-x-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Approve & Publish</span>
                    </button>
                  </div>
                ) : off.approvalStatus === 'approved' ? (
                  <div className="flex items-center space-x-2 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Live on Platform</span>
                  </div>
                ) : (
                  <button
                    onClick={() => approveOffering(off.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200 transition text-xs font-medium cursor-pointer"
                  >
                    Re-evaluate & Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
