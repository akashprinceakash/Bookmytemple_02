import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Building2, User, Landmark, ShieldCheck, FileCheck } from 'lucide-react';

interface OnboardTempleModalProps {
  onClose: () => void;
}

export const OnboardTempleModal: React.FC<OnboardTempleModalProps> = ({ onClose }) => {
  const { registerTemple } = useApp();

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [primaryDeity, setPrimaryDeity] = useState('');
  const [trustRegNumber, setTrustRegNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [payoutCycle, setPayoutCycle] = useState<'Daily (T+1)' | 'Weekly (T+2)' | 'Bi-Weekly'>('Weekly (T+2)');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [bankName, setBankName] = useState('State Bank of India');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [commissionRatePercent, setCommissionRatePercent] = useState<number>(5);
  const [establishedYear, setEstablishedYear] = useState<number>(1850);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim()) {
      alert('Please provide temple name and city.');
      return;
    }

    const maskedAcc = accountNumber.length > 4 
      ? `•••• •••• ${accountNumber.slice(-4)}` 
      : '•••• •••• 1234';

    registerTemple({
      name,
      city,
      state,
      primaryDeity,
      trustRegNumber: trustRegNumber || `TR-BMT-${Date.now().toString().slice(-6)}`,
      panNumber: panNumber || 'AAATB1234F',
      payoutCycle,
      bankVerificationStatus: 'Verified',
      isActive: true,
      contactPerson,
      contactPhone,
      contactEmail,
      bankDetails: {
        bankName,
        accountNumberMasked: maskedAcc,
        ifsc: ifsc.toUpperCase() || 'SBIN0001000',
        accountHolder: accountHolder || `${name} Religious & Charitable Trust`,
      },
      commissionRatePercent,
      establishedYear,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        id="onboard-temple-modal-card"
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col text-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B1528] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Building2 className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 font-mono">
                Temple Network Governance
              </span>
              <h2 className="text-base sm:text-lg font-serif font-bold text-slate-900">
                Onboard Religious Trust & Sanctum
              </h2>
            </div>
          </div>

          <button
            id="btn-close-onboard-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto text-sm flex-1 bg-white">
            
            {/* Section 1: Sacred Entity Details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                <Building2 className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Temple Identification & Geographic Jurisdiction
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="input-temple-name" className="text-xs font-semibold text-slate-700 block mb-1">
                    Temple Sanctum Official Name *
                  </label>
                  <input
                    id="input-temple-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sri Meenakshi Sundareswarar Temple"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label htmlFor="input-primary-deity" className="text-xs font-semibold text-slate-700 block mb-1">
                    Primary Presiding Deity *
                  </label>
                  <input
                    id="input-primary-deity"
                    type="text"
                    required
                    value={primaryDeity}
                    onChange={(e) => setPrimaryDeity(e.target.value)}
                    placeholder="e.g. Goddess Meenakshi & Lord Shiva"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label htmlFor="input-temple-city" className="text-xs font-semibold text-slate-700 block mb-1">
                    City / Holy Town *
                  </label>
                  <input
                    id="input-temple-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Madurai"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label htmlFor="input-temple-state" className="text-xs font-semibold text-slate-700 block mb-1">
                    State / Union Territory *
                  </label>
                  <input
                    id="input-temple-state"
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Tamil Nadu"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Legal Trust & Statutory Compliance */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Trust Registration & Statutory Identity
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="input-trust-reg" className="text-xs font-semibold text-slate-700 block mb-1">
                    Trust Registration Number
                  </label>
                  <input
                    id="input-trust-reg"
                    type="text"
                    value={trustRegNumber}
                    onChange={(e) => setTrustRegNumber(e.target.value)}
                    placeholder="e.g. TR-TN-88210-A"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="input-pan-number" className="text-xs font-semibold text-slate-700 block mb-1">
                    Entity PAN (Income Tax)
                  </label>
                  <input
                    id="input-pan-number"
                    type="text"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. AAATB9920F"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono uppercase"
                  />
                </div>

                <div>
                  <label htmlFor="select-payout-cycle" className="text-xs font-semibold text-slate-700 block mb-1">
                    Settlement Payout Cycle
                  </label>
                  <select
                    id="select-payout-cycle"
                    value={payoutCycle}
                    onChange={(e) => setPayoutCycle(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  >
                    <option value="Daily (T+1)">Daily (T+1)</option>
                    <option value="Weekly (T+2)">Weekly (T+2)</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 3: Verified Beneficiary Bank Details */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center space-x-2">
                  <Landmark className="w-4 h-4 text-slate-500" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Beneficiary Bank Account for Seva Disbursements
                  </h3>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Instant Verification Active</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="input-bank-account-holder" className="text-[11px] text-slate-600 block mb-1">
                    Account Holder Legal Name (Trust / Board)
                  </label>
                  <input
                    id="input-bank-account-holder"
                    type="text"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    placeholder="Official name per bank passbook"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label htmlFor="input-bank-name" className="text-[11px] text-slate-600 block mb-1">
                    Bank Name
                  </label>
                  <input
                    id="input-bank-name"
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. State Bank of India, Canara Bank"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label htmlFor="input-bank-account-number" className="text-[11px] text-slate-600 block mb-1">
                    Bank Account Number
                  </label>
                  <input
                    id="input-bank-account-number"
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g. 100293849182"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="input-bank-ifsc" className="text-[11px] text-slate-600 block mb-1">
                    Bank IFSC Code
                  </label>
                  <input
                    id="input-bank-ifsc"
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                    placeholder="e.g. SBIN0001000"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Contact Person & Commercial Terms */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="input-contact-person" className="text-xs font-semibold text-slate-700 block mb-1">
                  Temple Representative Name
                </label>
                <input
                  id="input-contact-person"
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Sri R. Sundaram (EO)"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label htmlFor="input-contact-phone" className="text-xs font-semibold text-slate-700 block mb-1">
                  Official Contact Phone
                </label>
                <input
                  id="input-contact-phone"
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. +91 94431 12345"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label htmlFor="input-commission-percent" className="text-xs font-semibold text-slate-700 block mb-1">
                  Platform Commission (%)
                </label>
                <input
                  id="input-commission-percent"
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={commissionRatePercent}
                  onChange={(e) => setCommissionRatePercent(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-mono"
                />
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-slate-200 bg-slate-50/70">
            <span className="text-xs text-slate-500">
              Upon submission, Sanctum Credentials and Settlement Account will be initialized.
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
                id="btn-submit-onboard-temple"
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#0B1528] text-white hover:bg-[#162744] shadow transition cursor-pointer flex items-center space-x-1.5"
              >
                <FileCheck className="w-4 h-4 text-[#F59E0B]" />
                <span>Onboard Temple Entity</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
