import React, { useState } from 'react';
import { FarmerProfile, Language, P2PLoanRequest } from '../types';
import { translations } from '../data/translations';
import { sampleP2PLoans } from '../data/p2pData';
import { 
  HandCoins, 
  ShieldCheck, 
  PlusCircle, 
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface P2PLendingHubProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
}

export const P2PLendingHub: React.FC<P2PLendingHubProps> = ({
  currentFarmer,
  currentLanguage
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [loans, setLoans] = useState<P2PLoanRequest[]>(sampleP2PLoans);
  const [fundedLoanId, setFundedLoanId] = useState<string | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [newAmount, setNewAmount] = useState('15000');
  const [newPurpose, setNewPurpose] = useState<'Emergency Seeds' | 'Borewell / Drip Repair' | 'Organic Input Purchase' | 'Diesel & Harvesting' | 'Fertilizer Pre-booking'>('Borewell / Drip Repair');
  const [newDuration, setNewDuration] = useState('2');

  const handleFundLoan = (loanId: string) => {
    setFundedLoanId(loanId);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setLoans(prev => prev.map(l => {
        if (l.id === loanId) {
          return {
            ...l,
            fundedAmountRupees: l.loanAmountRupees,
            status: 'fully_funded',
            lendersCount: l.lendersCount + 1
          };
        }
        return l;
      }));
      setFundedLoanId(null);
    }, 1200);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const created: P2PLoanRequest = {
      id: `loan-${Date.now()}`,
      borrowerName: currentFarmer.name,
      borrowerAvatar: currentFarmer.avatar,
      borrowerVillage: currentFarmer.village,
      borrowerDistrict: currentFarmer.district,
      borrowerState: currentFarmer.state,
      crop: currentFarmer.crop,
      landAcre: currentFarmer.totalAcreage,
      kisanTrustScore: 880,
      loanAmountRupees: parseInt(newAmount) || 10000,
      fundedAmountRupees: 0,
      purpose: newPurpose,
      description: 'Community P2P loan for seasonal farm inputs.',
      dateRequested: 'Just now',
      repaymentDeadline: 'November 2026',
      interestRateMonthlyPercent: 1.0,
      durationMonths: parseInt(newDuration) || 2,
      status: 'active',
      lendersCount: 0
    };

    setLoans([created, ...loans]);
    setIsRequestModalOpen(false);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5">
              <HandCoins className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {t.p2pLending}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {t.p2pLending}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium max-w-2xl mt-1">
              {t.p2pDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.requestLoan}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Interest Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.interestRate}</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono mt-0.5">1.0% / month</div>
          <div className="text-[10px] text-slate-500">Zero middlemen commission</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.trustScore}</span>
          <div className="text-xl sm:text-2xl font-black text-indigo-700 font-mono mt-0.5">94 / 100</div>
          <div className="text-[10px] text-emerald-600 font-bold">✓ Aadhaar & 7/12 Verified</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Instant Settlement</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono mt-0.5">UPI Auto-Debit</div>
          <div className="text-[10px] text-slate-500">Post-harvest settlement</div>
        </div>
      </div>

      {/* Active Loan Marketplace */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {loans.map((loan) => (
          <div
            key={loan.id}
            className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 space-y-3 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="font-black text-base text-slate-900 truncate">{loan.borrowerName}</h3>
                    <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    📍 {loan.borrowerVillage}, {loan.borrowerDistrict} ({loan.crop})
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono flex-shrink-0">
                  Score: {loan.kisanTrustScore}
                </span>
              </div>

              {/* Loan Details */}
              <div className="space-y-2 mt-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Amount:</span>
                  <span className="text-lg font-black text-slate-900 font-mono">₹{loan.loanAmountRupees.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Purpose:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[160px]">{loan.purpose}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Duration:</span>
                  <span className="font-bold text-slate-900">{loan.durationMonths * 30} {t.days}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleFundLoan(loan.id)}
                disabled={loan.status === 'fully_funded' || fundedLoanId === loan.id}
                className={`w-full py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow active:scale-95 ${
                  loan.status === 'fully_funded'
                    ? 'bg-slate-100 text-emerald-800 border border-emerald-300 cursor-default'
                    : fundedLoanId === loan.id
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <span>{loan.status === 'fully_funded' ? '✓ Loan Funded via UPI' : fundedLoanId === loan.id ? 'Processing UPI Transfer...' : t.fundLoan}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New Loan Request */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border space-y-4">
            <h3 className="text-lg font-black text-slate-900">{t.requestLoan}</h3>
            
            <form onSubmit={handleCreateRequest} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Amount (₹):</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono text-sm font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Purpose:</label>
                <select
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                >
                  <option value="Borewell / Drip Repair">Borewell / Drip Repair</option>
                  <option value="Emergency Seeds">Emergency Seeds</option>
                  <option value="Organic Input Purchase">Organic Input Purchase</option>
                  <option value="Diesel & Harvesting">Diesel & Harvesting</option>
                  <option value="Fertilizer Pre-booking">Fertilizer Pre-booking</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Duration (Months):</label>
                <select
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                >
                  <option value="1">1 Month (30 {t.days})</option>
                  <option value="2">2 Months (60 {t.days})</option>
                  <option value="3">3 Months (90 {t.days})</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-900 text-[11px]">
                💡 Interest will be fixed at 1.0%/mo. P2P smart contract backed by Kisan FPO.
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 font-black text-white shadow"
                >
                  Publish Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
