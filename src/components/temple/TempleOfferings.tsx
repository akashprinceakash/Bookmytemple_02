import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Offering } from '../../types';
import { 
  Sparkles, 
  Plus, 
  Search, 
  Clock, 
  Edit3, 
  Power,
  Users,
  Info,
  ChevronDown
} from 'lucide-react';

interface TempleOfferingsProps {
  onOpenCreateOffering: () => void;
  onOpenEditOffering: (offering: Offering) => void;
}

export const TempleOfferings: React.FC<TempleOfferingsProps> = ({
  onOpenCreateOffering,
  onOpenEditOffering,
}) => {
  const { currentTemple, offerings, toggleOfferingEnabled } = useApp();

  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!currentTemple) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
        Temple sanctum data not found.
      </div>
    );
  }

  // Scoped strictly to this temple
  const templeOfferings = offerings.filter(o => o.templeId === currentTemple.id);

  const filteredOfferings = templeOfferings.filter((o) => {
    if (typeFilter !== 'ALL' && o.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = o.title.toLowerCase().includes(q);
      const matchDeity = o.deity.toLowerCase().includes(q);
      const matchDesc = o.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDeity && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Create Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-500 font-medium">
            Ritual Catalog & Scheduling for {currentTemple.name}
          </p>
        </div>

        <button
          id="btn-create-new-offering"
          onClick={onOpenCreateOffering}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#0B1528] text-white hover:bg-[#162744] shadow transition flex items-center justify-center space-x-2 shrink-0 cursor-pointer text-center"
        >
          <Plus className="w-4 h-4 text-[#F59E0B]" />
          <span>Create New Offering</span>
        </button>
      </div>

      {/* Filter and Search Bar matching screenshot */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 w-full md:flex-1 min-w-0">
          
          <div className="relative w-full sm:w-auto sm:min-w-[200px] flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              id="input-search-offerings"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rituals by title, deity..."
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition"
            />
          </div>

          <div className="relative w-full sm:w-auto min-w-[150px]">
            <select
              id="select-filter-offering-type"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter offerings by category"
              className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-8 text-sm text-slate-700 font-medium hover:border-slate-300 focus:outline-none cursor-pointer shadow-sm transition"
            >
              <option value="ALL">All Categories</option>
              <option value="Seva">Daily Sevas</option>
              <option value="Special Pooja">Special Poojas & Homams</option>
              <option value="Classes">Devotional Classes & Upanyasam</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

        </div>

        <span className="text-xs text-slate-500">
          Showing <strong className="text-slate-800">{filteredOfferings.length}</strong> Offerings
        </span>
      </div>

      {/* Offerings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredOfferings.length === 0 ? (
          <div className="col-span-2 p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-500">
            <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">No offerings match your search</h3>
            <p className="text-xs text-slate-400 mt-1">
              Click "Create New Offering" above to add a Seva or Special Pooja for your temple.
            </p>
          </div>
        ) : (
          filteredOfferings.map((off) => (
            <div 
              key={off.id}
              className={`bg-white rounded-2xl border p-4 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 transition ${
                off.approvalStatus === 'approved' && off.isEnabled 
                  ? 'border-slate-200 hover:border-slate-300' 
                  : off.approvalStatus === 'pending_approval'
                  ? 'border-amber-200 bg-amber-50/20'
                  : 'border-slate-200 opacity-80'
              }`}
            >
              <div className="space-y-3">
                {/* Status Pills */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                      {off.type}
                    </span>
                    <span className="text-xs text-slate-500">Deity: <strong className="text-slate-800">{off.deity}</strong></span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* BMT Approval Status */}
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                      off.approvalStatus === 'approved' ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]' :
                      off.approvalStatus === 'pending_approval' ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]' :
                      'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]'
                    }`}>
                      {off.approvalStatus === 'pending_approval' ? 'Pending BMT Approval' : off.approvalStatus}
                    </span>

                    {/* Enable / Disable toggle */}
                    {off.approvalStatus === 'approved' && (
                      <button
                        onClick={() => toggleOfferingEnabled(off.id)}
                        title={off.isEnabled ? 'Pause Bookings' : 'Resume Bookings'}
                        className={`p-1.5 rounded-lg border transition cursor-pointer ${
                          off.isEnabled 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                            : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-700'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Title & Price */}
                <div className="flex items-start justify-between gap-3 pt-1">
                  <div>
                    <h3 className="text-base font-serif font-bold text-slate-900">
                      {off.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Duration: <strong className="text-slate-700">{off.durationMinutes} mins</strong>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-bold font-serif text-slate-900">
                      ₹{off.price.toLocaleString('en-IN')}
                    </span>
                    <span className="block text-[10px] text-slate-400">per devotee</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {off.description}
                </p>

                {/* Rejection notice if any */}
                {off.rejectionReason && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
                    <span className="font-semibold block text-[11px] mb-0.5">BMT Review Notes:</span>
                    <p className="italic text-rose-800">"{off.rejectionReason}"</p>
                  </div>
                )}

                {/* Prasad Details */}
                {off.prasadDetails && (
                  <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-semibold text-slate-900">Sacred Prasad: </span>
                    {off.prasadDetails}
                  </div>
                )}

                {/* Schedules & Slot Capacities */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-700 font-semibold text-[11px]">
                    <span className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Configured Ritual Slots</span>
                    </span>
                    <span className="text-slate-500 font-mono">{off.schedules.length} slot rules</span>
                  </div>

                  <div className="space-y-1.5">
                    {off.schedules.map((sch, i) => (
                      <div key={i} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs">
                        <div>
                          <span className="font-semibold text-slate-900">{sch.startTime} - {sch.endTime}</span>
                          <span className="text-[10px] text-slate-500 ml-2">({sch.dayOfWeek.join(', ')})</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-700 font-mono text-[11px]">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span>Max {sch.capacity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => toggleOfferingEnabled(off.id)}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition cursor-pointer text-center ${
                    off.isEnabled
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  <Power className="w-3 h-3" />
                  <span>{off.isEnabled ? 'Pause Bookings' : 'Open Bookings'}</span>
                </button>

                <button
                  onClick={() => onOpenEditOffering(off)}
                  className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#0B1528] text-white hover:bg-[#162744] transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm text-center"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Offering / Slots</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
