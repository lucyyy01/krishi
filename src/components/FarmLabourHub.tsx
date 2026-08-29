import React, { useState } from 'react';
import { FarmerProfile, Language, FarmLabourProfile } from '../types';
import { translations } from '../data/translations';
import { sampleFarmLabourProfiles } from '../data/logisticsAndLabourData';
import { 
  Users, 
  UserCheck, 
  PhoneCall, 
  Star, 
  MapPin, 
  PlusCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Calendar,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FarmLabourHubProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
}

export const FarmLabourHub: React.FC<FarmLabourHubProps> = ({
  currentFarmer,
  currentLanguage
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [labourers, setLabourers] = useState<FarmLabourProfile[]>(sampleFarmLabourProfiles);
  const [hiredLabourId, setHiredLabourId] = useState<string | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [activeFilterSkill, setActiveFilterSkill] = useState<string>('ALL');

  // "Apply as Labour" Form State
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantVillage, setApplicantVillage] = useState(currentFarmer.village);
  const [applicantSkills, setApplicantSkills] = useState('Cotton Picking, Weeding');
  const [applicantWage, setApplicantWage] = useState('450');
  const [applicantType, setApplicantType] = useState<'male' | 'female' | 'crew_group'>('male');
  const [applicantCrewSize, setApplicantCrewSize] = useState('1');

  const handleHireLabour = (labourId: string) => {
    setHiredLabourId(labourId);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setLabourers(prev => prev.map(lb => {
        if (lb.id === labourId) {
          return { ...lb, availabilityStatus: 'booked_this_week' };
        }
        return lb;
      }));
      setHiredLabourId(null);
    }, 2500);
  };

  const handleRegisterLabour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !applicantPhone.trim()) return;

    const newWorker: FarmLabourProfile = {
      id: `labour-${Date.now()}`,
      name: applicantName,
      gender: applicantType,
      ageOrCrewSize: applicantType === 'crew_group' ? `Crew of ${applicantCrewSize} Workers` : '30 yrs',
      phone: applicantPhone,
      village: applicantVillage,
      district: currentFarmer.district,
      state: currentFarmer.state,
      distanceKm: 1.0,
      primarySkills: applicantSkills.split(',').map(s => s.trim()),
      expectedDailyWageRupees: parseInt(applicantWage) || 450,
      experienceYears: 5,
      kisanRating: 5.0,
      availabilityStatus: 'available_today',
      preferredWork: 'Both',
      photoAvatar: applicantType === 'crew_group' ? '👥' : applicantType === 'female' ? '👩🏽‍🌾' : '👨🏽‍🌾'
    };

    setLabourers([newWorker, ...labourers]);
    setIsApplyModalOpen(false);
    setApplicantName('');
    setApplicantPhone('');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const filteredLabourers = labourers.filter(lb => {
    if (activeFilterSkill === 'ALL') return true;
    return lb.primarySkills.some(sk => sk.toLowerCase().includes(activeFilterSkill.toLowerCase()));
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-emerald-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-amber-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5">
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {t.farmLabour}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {t.farmLabour}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 font-medium max-w-2xl mt-1">
              {t.farmLabourDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsApplyModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.applyAsLabour}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Skill Filters Bar */}
      <div className="flex items-center gap-1 overflow-x-auto bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm scrollbar-none">
        {[
          { id: 'ALL', label: 'All Workers & Crews' },
          { id: 'cotton', label: 'Cotton Pickers (कपास चुनाई)' },
          { id: 'paddy', label: 'Paddy Transplanting (धान रोपाई)' },
          { id: 'harvester', label: 'Combine / Tractor Drivers' },
          { id: 'sprayer', label: 'Sprayer Operators (छिड़काव)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilterSkill(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
              activeFilterSkill === tab.id
                ? 'bg-amber-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Labourers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredLabourers.map((worker) => {
          const isBooked = worker.availabilityStatus === 'booked_this_week' || hiredLabourId === worker.id;

          return (
            <div
              key={worker.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 space-y-3 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                {/* Worker Top Row */}
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl flex-shrink-0">
                      {worker.photoAvatar}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <h3 className="font-black text-sm sm:text-base text-slate-900 truncate">{worker.name}</h3>
                        <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        📍 {worker.village} ({worker.distanceKm} km) • {worker.ageOrCrewSize}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-xs font-black text-amber-900 flex-shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{worker.kisanRating}</span>
                  </div>
                </div>

                {/* Rate and Skills */}
                <div className="space-y-2 mt-3 text-xs">
                  <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-200 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 block">{t.dailyWage}:</span>
                      <span className="text-base sm:text-lg font-black text-amber-950 font-mono">₹{worker.expectedDailyWageRupees} / day</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-white px-2 py-0.5 rounded border">
                      {worker.preferredWork}
                    </span>
                  </div>

                  {/* Skills Tag Pills */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-black uppercase text-slate-400">Expertise:</span>
                    <div className="flex flex-wrap gap-1">
                      {worker.primarySkills.map((sk, sIdx) => (
                        <span key={sIdx} className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded-md text-slate-800">
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 font-medium pt-0.5">
                    Experience: {worker.experienceYears} Years in {worker.district} farms
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center gap-2 border-t border-slate-100">
                <a
                  href={`tel:${worker.phone}`}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center flex-shrink-0"
                  title="Call Worker / Mukadam"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
                </a>

                <button
                  onClick={() => handleHireLabour(worker.id)}
                  disabled={isBooked}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow active:scale-95 ${
                    isBooked
                      ? 'bg-slate-100 text-emerald-800 border border-emerald-300 cursor-default'
                      : hiredLabourId === worker.id
                      ? 'bg-emerald-600 text-white animate-pulse'
                      : 'bg-amber-800 hover:bg-amber-700 text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{isBooked ? '✓ Booked for Farm' : hiredLabourId === worker.id ? 'Confirming...' : t.hireLabour}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* "Apply as Farm Labour" Registration Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">{t.applyAsLabour}</h3>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="p-1 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterLabour} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Registration Type:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'male', label: '👨🏽 Single Worker (Male)' },
                    { id: 'female', label: '👩🏽 Single Worker (Female)' },
                    { id: 'crew_group', label: '👥 Work Crew / Toli' }
                  ].map(tp => (
                    <button
                      key={tp.id}
                      type="button"
                      onClick={() => setApplicantType(tp.id as any)}
                      className={`p-2 rounded-xl text-left font-bold text-[11px] border transition-all ${
                        applicantType === tp.id
                          ? 'bg-amber-100 border-amber-500 text-amber-950 font-black'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {tp.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name / Crew Leader Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Rameshwar Shinde / Mahila Bachat Gat"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                  required
                />
              </div>

              {applicantType === 'crew_group' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Workers in Crew (संख्या):</label>
                  <input
                    type="number"
                    value={applicantCrewSize}
                    onChange={(e) => setApplicantCrewSize(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold font-mono"
                    required
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone (मोबाइल नंबर):</label>
                  <input
                    type="tel"
                    placeholder="9823456789"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Expected Daily Wage (₹/दिन):</label>
                  <input
                    type="number"
                    value={applicantWage}
                    onChange={(e) => setApplicantWage(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl font-mono font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Village & Taluka (गांव व तहसील):</label>
                <input
                  type="text"
                  value={applicantVillage}
                  onChange={(e) => setApplicantVillage(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Skills & Experience (काम का हुनर):</label>
                <input
                  type="text"
                  placeholder="e.g. Cotton Picking, Paddy Sowing, Spraying, Harvester Operator"
                  value={applicantSkills}
                  onChange={(e) => setApplicantSkills(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl font-bold"
                  required
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-amber-950 text-[11px]">
                💡 Your profile will be instantly visible to nearby farmers looking for farm labour in {currentFarmer.district}.
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-700 font-black text-white shadow"
                >
                  Register Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
