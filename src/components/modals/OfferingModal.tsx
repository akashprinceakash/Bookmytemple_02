import React, { useState } from 'react';
import { Offering, OfferingType, ScheduleSlot } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, Sparkles, Clock, IndianRupee } from 'lucide-react';

interface OfferingModalProps {
  offering: Offering | null; // null if creating
  onClose: () => void;
}

export const OfferingModal: React.FC<OfferingModalProps> = ({ offering, onClose }) => {
  const { createOffering, updateOffering, activeTempleId, currentTemple, temples, role } = useApp();

  const [templeId, setTempleId] = useState(offering?.templeId || (role === 'TEMPLE_ADMIN' ? activeTempleId : (temples[0]?.id || 'temple-kashi')));
  const [title, setTitle] = useState(offering?.title || '');
  const [type, setType] = useState<OfferingType>(offering?.type || 'Seva');
  const [deity, setDeity] = useState(offering?.deity || currentTemple?.primaryDeity || 'Lord Shiva');
  const [price, setPrice] = useState<number>(offering?.price || 2100);
  const [durationMinutes, setDurationMinutes] = useState<number>(offering?.durationMinutes || 60);
  const [description, setDescription] = useState(offering?.description || '');
  const [prasadIncluded, setPrasadIncluded] = useState<boolean>(offering?.prasadIncluded ?? true);
  const [prasadDetails, setPrasadDetails] = useState(offering?.prasadDetails || '');
  const [dressCode, setDressCode] = useState(offering?.dressCode || 'Traditional Indian attire mandatory.');

  // Schedules state
  const [schedules, setSchedules] = useState<ScheduleSlot[]>(
    offering?.schedules || [
      { id: 'sch-new-1', dayOfWeek: ['Mon', 'Wed', 'Fri'], startTime: '07:00 AM', endTime: '08:00 AM', capacity: 20 },
    ]
  );

  const handleAddSchedule = () => {
    const newSlot: ScheduleSlot = {
      id: `sch-${Date.now()}`,
      dayOfWeek: ['Daily'],
      startTime: '06:00 AM',
      endTime: '07:00 AM',
      capacity: 25,
    };
    setSchedules([...schedules, newSlot]);
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const handleUpdateSchedule = (index: number, key: keyof ScheduleSlot, val: any) => {
    const copy = [...schedules];
    copy[index] = { ...copy[index], [key]: val };
    setSchedules(copy);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please provide offering title and sacred description.');
      return;
    }

    if (offering) {
      updateOffering(offering.id, {
        title,
        type,
        deity,
        price,
        durationMinutes,
        description,
        prasadIncluded,
        prasadDetails,
        dressCode,
        schedules,
      });
    } else {
      createOffering({
        templeId,
        title,
        type,
        deity,
        price,
        durationMinutes,
        description,
        prasadIncluded,
        prasadDetails,
        dressCode,
        schedules,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        id="offering-modal-card"
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col text-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B1528] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 font-mono">
                {offering ? 'Catalogue Governance' : 'Offering Submission'}
              </span>
              <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                {offering ? 'Edit Sanctum Offering' : 'Register New Offering'}
              </h2>
            </div>
          </div>

          <button
            id="btn-close-offering-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto text-sm flex-1 bg-white">
            
            {/* Temple Selector (if BMT Admin creating) */}
            {role === 'BMT_ADMIN' && !offering && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label htmlFor="select-offering-temple" className="text-xs font-semibold text-slate-700 block mb-1">
                  Assign Offering to Temple Sanctum:
                </label>
                <select
                  id="select-offering-temple"
                  value={templeId}
                  onChange={(e) => setTempleId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-medium"
                >
                  {temples.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
                  ))}
                </select>
              </div>
            )}

            {/* Core Offering Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="input-offering-title" className="text-xs font-semibold text-slate-700 block mb-1">
                  Offering / Seva Name *
                </label>
                <input
                  id="input-offering-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Maha Rudrabhishekam with Bilva Patra"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label htmlFor="select-offering-type" className="text-xs font-semibold text-slate-700 block mb-1">
                  Ritual Classification
                </label>
                <select
                  id="select-offering-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as OfferingType)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                >
                  <option value="Seva">Seva</option>
                  <option value="Pooja">Pooja</option>
                  <option value="Archana">Archana</option>
                  <option value="Special Darshan">Special Darshan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="input-offering-deity" className="text-xs font-semibold text-slate-700 block mb-1">
                  Presiding Deity
                </label>
                <input
                  id="input-offering-deity"
                  type="text"
                  value={deity}
                  onChange={(e) => setDeity(e.target.value)}
                  placeholder="e.g. Lord Shiva, Goddess Lakshmi"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label htmlFor="input-offering-price" className="text-xs font-semibold text-slate-700 block mb-1">
                  Fixed Seva Dakshina (₹ INR) *
                </label>
                <div className="relative">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="input-offering-price"
                    type="number"
                    min="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="input-offering-duration" className="text-xs font-semibold text-slate-700 block mb-1">
                  Ritual Duration (Minutes)
                </label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="input-offering-duration"
                    type="number"
                    min="15"
                    step="15"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="textarea-offering-description" className="text-xs font-semibold text-slate-700 block mb-1">
                Sacred Significance & Ritual Script *
              </label>
              <textarea
                id="textarea-offering-description"
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the scriptural lineage, sanctum procedure, and astrological benefits for the devotee..."
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400"
              />
            </div>

            {/* Prasad and Logistics */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">
                  Prasad Distribution Details
                </span>
                <label className="flex items-center space-x-2 text-xs cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={prasadIncluded}
                    onChange={(e) => setPrasadIncluded(e.target.checked)}
                    className="rounded text-[#0B1528] focus:ring-0"
                  />
                  <span>Sacred Prasad Dispatched to Devotee</span>
                </label>
              </div>

              {prasadIncluded && (
                <div>
                  <input
                    type="text"
                    value={prasadDetails}
                    onChange={(e) => setPrasadDetails(e.target.value)}
                    placeholder="e.g. Sacred Bhasma, Dry Fruit Panchamritam, and Raksha Sutra"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
              )}

              <div>
                <label htmlFor="input-dress-code" className="text-[11px] text-slate-500 block mb-1">
                  Dress Code / Sanctum Protocol
                </label>
                <input
                  id="input-dress-code"
                  type="text"
                  value={dressCode}
                  onChange={(e) => setDressCode(e.target.value)}
                  placeholder="e.g. Traditional Dhoti/Kurta for Men, Saree/Salwar for Women."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            {/* Timetable & Capacity Slots */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                    Ritual Schedule Slots & Capacity Constraints
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Defines recurring day slots and max devotee sankalpas per batch.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSchedule}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 cursor-pointer transition border border-slate-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Slot</span>
                </button>
              </div>

              <div className="space-y-2">
                {schedules.map((slot, index) => (
                  <div 
                    key={slot.id || index}
                    className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs"
                  >
                    <div className="w-full sm:w-1/3">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Active Days (Comma Sep)</span>
                      <input
                        type="text"
                        value={slot.dayOfWeek.join(', ')}
                        onChange={(e) => handleUpdateSchedule(index, 'dayOfWeek', e.target.value.split(',').map(s => s.trim()))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>

                    <div className="w-full sm:w-1/4">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Start Time</span>
                      <input
                        type="text"
                        value={slot.startTime}
                        onChange={(e) => handleUpdateSchedule(index, 'startTime', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>

                    <div className="w-full sm:w-1/4">
                      <span className="text-[10px] text-slate-400 block mb-0.5">End Time</span>
                      <input
                        type="text"
                        value={slot.endTime}
                        onChange={(e) => handleUpdateSchedule(index, 'endTime', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>

                    <div className="w-full sm:w-1/6">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Max Sankalpas</span>
                      <input
                        type="number"
                        min="1"
                        value={slot.capacity}
                        onChange={(e) => handleUpdateSchedule(index, 'capacity', Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSchedule(index)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition sm:mt-4 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50/70">
            <span className="text-xs text-slate-500">
              {role === 'TEMPLE_ADMIN' 
                ? 'Changes are submitted to BMT Admin for mandatory compliance review.' 
                : 'Directly applied by Platform Super Admin.'}
            </span>

            <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="btn-submit-offering"
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#0B1528] text-white hover:bg-[#162744] shadow transition cursor-pointer flex items-center space-x-1.5"
              >
                <span>{offering ? 'Save & Request Re-approval' : 'Submit for BMT Review'}</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
