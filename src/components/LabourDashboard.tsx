import React, { useState } from 'react';
import { AuthUser, Language, FarmJobOffer } from '../types';
import { translations } from '../data/translations';
import { sampleFarmJobOffers } from '../data/labourJobsData';
import { 
  Users, 
  Briefcase, 
  MapPin, 
  PhoneCall, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  Sparkles,
  TrendingUp,
  Clock,
  Send,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LabourDashboardProps {
  currentUser: AuthUser;
  currentLanguage: Language;
  onSwitchToFarmerMode?: () => void;
}

export const LabourDashboard: React.FC<LabourDashboardProps> = ({
  currentUser,
  currentLanguage,
  onSwitchToFarmerMode
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [jobOffers, setJobOffers] = useState<FarmJobOffer[]>(sampleFarmJobOffers);
  const [acceptedJobId, setAcceptedJobId] = useState<string | null>(null);
  const [isAvailableToday, setIsAvailableToday] = useState(true);

  const handleAcceptJob = (jobId: string) => {
    setAcceptedJobId(jobId);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setJobOffers(prev => prev.map(job => {
        if (job.id === jobId) {
          return { ...job, status: 'accepted' };
        }
        return job;
      }));
      setAcceptedJobId(null);
    }, 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-amber-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0">
              {currentUser.avatar || '👷'}
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {currentUser.role === 'both' ? 'किसान + मजदूर संयुक्त पोर्टल' : 'कृषि मजदूर व कारीगर पोर्टल'}
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                {currentUser.name}
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/90 font-medium">
                📍 {currentUser.village}, {currentUser.district} ({currentUser.state}) • Verified Agricultural Worker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {currentUser.role === 'both' && onSwitchToFarmerMode && (
              <button
                onClick={onSwitchToFarmerMode}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg transition-all"
              >
                <span>🌾 Switch to Farmer View (किसान मोड)</span>
              </button>
            )}

            {/* Availability Toggle */}
            <button
              onClick={() => setIsAvailableToday(!isAvailableToday)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-black text-xs transition-all shadow ${
                isAvailableToday
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  : 'bg-red-500/20 text-red-300 border border-red-400/40'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isAvailableToday ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              <span>{isAvailableToday ? '🟢 Available for Work Today' : '🔴 Booked Today'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
        
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">This Month Earnings</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">₹14,200</div>
          <div className="text-[10px] text-emerald-600 font-bold">✓ 24 Days Worked</div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Nearby Job Requests</span>
          <div className="text-xl sm:text-2xl font-black text-amber-700 font-mono">
            {jobOffers.filter(j => j.status === 'open').length} Active
          </div>
          <div className="text-[10px] text-slate-500">Within 10 km radius</div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Kisan Trust Rating</span>
          <div className="text-xl sm:text-2xl font-black text-indigo-700 font-mono flex items-center gap-1">
            <span>4.95</span>
            <span className="text-amber-500 text-sm">★</span>
          </div>
          <div className="text-[10px] text-slate-500">38 Farmer Reviews</div>
        </div>

        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Guarantee</span>
          <div className="text-sm sm:text-base font-black text-slate-900 mt-1">Direct Bank / UPI</div>
          <div className="text-[10px] text-emerald-700 font-bold">Zero commission cut</div>
        </div>

      </div>

      {/* Live Available Jobs Stream */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-700" />
              <span>खेतों से आए काम के अवसर (Live Farm Job Offers)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Direct job requests from verified local farmers in {currentUser.district}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {jobOffers.map((job) => {
            const isAccepted = job.status === 'accepted' || acceptedJobId === job.id;

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 space-y-3 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-black text-amber-800 uppercase">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span>{job.farmerVillage}, {job.farmerDistrict}</span>
                      </div>
                      <h3 className="font-black text-base text-slate-900 mt-0.5">
                        {job.workType}
                      </h3>
                      <div className="text-xs text-slate-500">
                        Farmer: <strong>{job.farmerName}</strong> • Crop: {job.cropName}
                      </div>
                    </div>

                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${
                      job.urgency === 'urgent' ? 'bg-red-100 text-red-800 border border-red-300 animate-pulse' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {job.urgency === 'urgent' ? '🚨 Urgent Work' : 'Scheduled'}
                    </span>
                  </div>

                  {/* Wage & Work Details */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200">
                      <span className="text-[10px] font-bold text-amber-800 block">Daily Wage Offered:</span>
                      <span className="text-base sm:text-lg font-black text-amber-950 font-mono">₹{job.dailyWageOffered} / day</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-600 block">Workers Needed:</span>
                      <span className="text-base sm:text-lg font-black text-slate-900 font-mono">{job.workersNeeded} Workers</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 flex items-center justify-between mt-2">
                    <span>📅 Start: <strong>{job.startDate}</strong></span>
                    <span>⏱️ Duration: <strong>{job.durationDays} Days</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 flex items-center gap-2 border-t border-slate-100">
                  <a
                    href={`tel:${job.farmerPhone}`}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center flex-shrink-0"
                    title="Call Farmer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  </a>

                  <button
                    onClick={() => handleAcceptJob(job.id)}
                    disabled={isAccepted}
                    className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow active:scale-95 ${
                      isAccepted
                        ? 'bg-slate-100 text-emerald-800 border border-emerald-300 cursor-default'
                        : acceptedJobId === job.id
                        ? 'bg-emerald-600 text-white animate-pulse'
                        : 'bg-amber-800 hover:bg-amber-700 text-white'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{isAccepted ? '✓ Job Accepted / Farmer Notified' : acceptedJobId === job.id ? 'Connecting...' : 'Accept Job Offer (काम स्वीकारें)'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
