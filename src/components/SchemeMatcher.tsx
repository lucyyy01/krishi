import React, { useState } from 'react';
import { FarmerProfile, Language, SchemeMatchResult, AppliedSchemeApplication } from '../types';
import { translations } from '../data/translations';
import { matchSchemesForFarmer } from '../data/schemesData';
import { speakVernacularText, stopSpeech } from '../utils/audioSpeech';
import { 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert,
  Search,
  Volume2,
  VolumeX,
  Send,
  Check,
  AlertCircle,
  X,
  Download,
  Building2,
  PhoneCall,
  Calendar,
  CreditCard,
  UserCheck,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SchemeMatcherProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
}

export const SchemeMatcher: React.FC<SchemeMatcherProps> = ({
  currentFarmer,
  currentLanguage
}) => {
  const t = translations[currentLanguage] || translations.en;
  
  // Navigation: Available Schemes vs My Applied Schemes
  const [activeSubTab, setActiveSubTab] = useState<'available' | 'applied'>('available');

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);
  const [speakingSchemeId, setSpeakingSchemeId] = useState<string | null>(null);

  // Application Flow State
  const [selectedSchemeForApply, setSelectedSchemeForApply] = useState<SchemeMatchResult | null>(null);
  const [applyStep, setApplyStep] = useState<'form' | 'review' | 'success' | null>(null);
  
  // Form Inputs
  const [khasraNumber, setKhasraNumber] = useState('78/2-A (Sawangi Gut)');
  const [aadhaarNumber, setAadhaarNumber] = useState('5839 2940 1829');
  const [bankAccount, setBankAccount] = useState('918273645019');
  const [ifscCode, setIfscCode] = useState('MAHB0001234');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([
    'Aadhaar Card (आधार कार्ड)',
    '7/12 Land Record (सातबारा / खसरा)',
    'Bank Passbook (बैंक पासबुक)',
    'Soil Health Card (मृदा स्वास्थ्य पत्रक)'
  ]);
  const [hasAcceptedDeclaration, setHasAcceptedDeclaration] = useState(true);
  const [lastSubmittedAppId, setLastSubmittedAppId] = useState<string>('');

  // Applied Schemes Registry (starts with realistic existing + newly submitted applications)
  const [appliedSchemes, setAppliedSchemes] = useState<AppliedSchemeApplication[]>([
    {
      id: 'PM-KISAN-2026-MH84920',
      schemeId: 'pm-kisan',
      schemeName: 'PM-KISAN (प्रधानमंत्री किसान सम्मान निधि)',
      schemeCode: 'PM-KISAN-18TH-INST',
      subsidyValue: '₹6,000 / वर्ष (₹2,000 प्रति 4 माह)',
      applicantName: currentFarmer.name,
      phone: currentFarmer.phone,
      village: currentFarmer.village,
      district: currentFarmer.district,
      state: currentFarmer.state,
      aadhaarLast4: '1829',
      khasraNumber: '78/2-A',
      bankAccountLast4: '5019',
      ifscCode: 'MAHB0001234',
      submittedAt: '12 अगस्त 2026',
      status: 'approved_dbt_scheduled',
      statusLabelHindi: '✅ स्वीकृत - 18वीं किस्त DBT शेड्यूल',
      trackingStep: 4,
      talukaOffice: 'तहसीलदार कार्यालय व तालुका कृषि अधिकारी, यवतमाल',
      estimatedDisbursementDate: '15 सितम्बर 2026'
    }
  ]);

  const matchedSchemes: SchemeMatchResult[] = matchSchemesForFarmer(currentFarmer);

  const filteredSchemes = matchedSchemes.filter(result => {
    const matchesCat = selectedCategory === 'ALL' || result.scheme.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      result.scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.scheme.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.scheme.benefitsSummary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSpeakScheme = (matchResult: SchemeMatchResult, e: React.MouseEvent) => {
    e.stopPropagation();
    const id = matchResult.scheme.id;
    if (speakingSchemeId === id) {
      stopSpeech();
      setSpeakingSchemeId(null);
      return;
    }

    const eligibleText = matchResult.whyEligiblePoints.join('. ');
    const ineligibleText = matchResult.whyNotEligiblePoints.join('. ');
    const textToSpeak = `${matchResult.scheme.name}. ${matchResult.scheme.benefitsSummary}. ${t.whyEligible}: ${eligibleText}. ${ineligibleText ? `${t.whyNotEligible}: ${ineligibleText}` : ''}`;
    
    setSpeakingSchemeId(id);
    speakVernacularText(
      textToSpeak,
      currentLanguage,
      () => setSpeakingSchemeId(id),
      () => setSpeakingSchemeId(null)
    );
  };

  const handleStartApply = (matchResult: SchemeMatchResult, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSchemeForApply(matchResult);
    setApplyStep('form');
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setApplyStep('review');
  };

  const handleFinalSubmitApplication = () => {
    if (!selectedSchemeForApply) return;

    const randomId = `${selectedSchemeForApply.scheme.code.replace(/[^A-Z0-9]/g, '')}-2026-MH${Math.floor(10000 + Math.random() * 90000)}`;
    setLastSubmittedAppId(randomId);

    const newApp: AppliedSchemeApplication = {
      id: randomId,
      schemeId: selectedSchemeForApply.scheme.id,
      schemeName: selectedSchemeForApply.scheme.name,
      schemeCode: selectedSchemeForApply.scheme.code,
      subsidyValue: selectedSchemeForApply.potentialBenefit || selectedSchemeForApply.scheme.benefitsSummary,
      applicantName: currentFarmer.name,
      phone: currentFarmer.phone,
      village: currentFarmer.village,
      district: currentFarmer.district,
      state: currentFarmer.state,
      aadhaarLast4: aadhaarNumber.replace(/\s/g, '').slice(-4) || '1829',
      khasraNumber: khasraNumber,
      bankAccountLast4: bankAccount.slice(-4) || '5019',
      ifscCode: ifscCode,
      submittedAt: new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'under_review',
      statusLabelHindi: '🟡 तालुका कृषि अधिकारी सत्यापन में (Under Review)',
      trackingStep: 2,
      talukaOffice: `तालुका कृषि अधिकारी कार्यालय, ${currentFarmer.district}`,
      estimatedDisbursementDate: '25 कार्य दिवस में (Within 25 Working Days)'
    };

    setAppliedSchemes([newApp, ...appliedSchemes]);
    setApplyStep('success');

    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 }
    });
  };

  const handleDownloadReceipt = () => {
    window.print();
  };

  const getMatchBadge = (score: number, isEligible: boolean) => {
    if (score >= 85 && isEligible) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
          🟢 {score}% ({t.whyEligible})
        </span>
      );
    } else if (score >= 60) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
          🟡 {score}% ({t.cautionAdvisory})
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-300">
          🔴 {score}% ({t.whyNotEligible})
        </span>
      );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-indigo-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {t.schemeMatcher}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
              सरकारी योजनाएं व 1-क्लिक आवेदन (Scheme Portal)
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/90 font-medium mt-1">
              पारदर्शी पात्रता मिलान, ऑनलाइन आवेदन, समीक्षा व डायरेक्ट बेनिफिट ट्रांसफर (DBT) ट्रैकिंग
            </p>
          </div>

          {/* Sub-Tab Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-2xl border border-indigo-500/40 text-xs font-black self-start md:self-auto">
            <button
              onClick={() => setActiveSubTab('available')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeSubTab === 'available'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>उपलब्ध योजनाएं ({matchedSchemes.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('applied')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeSubTab === 'applied'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>मेरे आवेदन ({appliedSchemes.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: AVAILABLE SCHEMES LIST */}
      {activeSubTab === 'available' && (
        <div className="space-y-4">
          
          {/* Filters & Search */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="योजना खोजें (Search Scheme)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
              {['ALL', 'CENTRAL', 'STATE', 'INSURANCE', 'SUBSIDY', 'CREDIT'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-indigo-800 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? 'सभी योजनाएं' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Scheme Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSchemes.map((result) => {
              const isExpanded = expandedSchemeId === result.scheme.id;
              const isSpeaking = speakingSchemeId === result.scheme.id;

              return (
                <div
                  key={result.scheme.id}
                  className={`bg-white rounded-2xl border transition-all shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden ${
                    result.isEligible ? 'border-emerald-200' : 'border-slate-200'
                  }`}
                >
                  {/* Card Top */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                            {result.scheme.code}
                          </span>
                          <span className="text-[11px] text-slate-500 font-bold uppercase">
                            {result.scheme.category}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                          {result.scheme.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={(e) => handleSpeakScheme(result, e)}
                          className={`p-2 rounded-xl transition-all ${
                            isSpeaking
                              ? 'bg-red-600 text-white animate-pulse'
                              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                          }`}
                          title="योजना की जानकारी सुनें"
                        >
                          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Benefit Highlight Card */}
                    <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center justify-between">
                      <span>💰 संभावित लाभ:</span>
                      <span className="font-black text-emerald-800">{result.potentialBenefit}</span>
                    </div>

                    {/* Match Score & Deadline */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      {getMatchBadge(result.matchScore, result.isEligible)}

                      <div className="flex items-center gap-1 text-slate-500 font-medium text-[11px]">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>अंतिम तिथि: <strong>{result.scheme.daysRemaining} दिन शेष</strong></span>
                      </div>
                    </div>

                    {/* Why Eligible / Why Not Eligible Summary */}
                    <div className="space-y-1 text-xs pt-2">
                      <div className="font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{t.whyEligible}:</span>
                      </div>
                      <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5 pl-1">
                        {result.whyEligiblePoints.slice(0, 2).map((point, idx) => (
                          <li key={idx} className="truncate">{point}</li>
                        ))}
                      </ul>

                      {result.whyNotEligiblePoints.length > 0 && (
                        <div className="pt-1.5">
                          <div className="font-bold text-red-800 flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                            <span>{t.whyNotEligible}:</span>
                          </div>
                          <ul className="list-disc list-inside text-red-600 text-[11px] space-y-0.5 pl-1">
                            {result.whyNotEligiblePoints.slice(0, 1).map((point, idx) => (
                              <li key={idx} className="truncate">{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-3 sm:px-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setExpandedSchemeId(isExpanded ? null : result.scheme.id)}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'कम देखें' : 'विस्तृत विवरण'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {result.isEligible ? (
                      <button
                        onClick={(e) => handleStartApply(result, e)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>आवेदन करें (Apply)</span>
                      </button>
                    ) : (
                      <a
                        href={result.scheme.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                      >
                        <span>पोर्टल लिंक</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Expanded Details Section */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-100/80 border-t border-slate-200 text-xs space-y-3 animate-in fade-in">
                      <div>
                        <div className="font-bold text-slate-800 mb-1">📋 आवश्यक दस्तावेज (Required Documents):</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {result.scheme.requiredDocuments.map((doc, idx) => (
                            <div key={idx} className="p-1.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 flex items-center gap-1">
                              <FileText className="w-3 h-3 text-indigo-600 flex-shrink-0" />
                              <span className="truncate">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="font-bold text-slate-800 mb-1">👣 आगे की प्रक्रिया (Next Steps):</div>
                        <ul className="list-decimal list-inside text-slate-600 text-[11px] space-y-1">
                          {result.nextSteps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: MY APPLIED SCHEMES & STATUS TRACKER */}
      {activeSubTab === 'applied' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {appliedSchemes.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-200 shadow-md space-y-5"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-mono font-black border border-emerald-300">
                        {app.id}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">
                        आवेदन दिनांक: {app.submittedAt}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {app.schemeName}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      {app.statusLabelHindi}
                    </span>
                    <div className="text-[11px] text-slate-500 font-bold mt-1">
                      वितरण अनुमान: <strong className="text-emerald-700">{app.estimatedDisbursementDate}</strong>
                    </div>
                  </div>
                </div>

                {/* 4-Stage Progress Timeline */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      1. आवेदन जमा (Submitted)
                    </span>
                    <span className={`flex items-center gap-1 ${app.trackingStep >= 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      2. दस्तावेज सत्यापन (Verification)
                    </span>
                    <span className={`flex items-center gap-1 ${app.trackingStep >= 3 ? 'text-emerald-700' : 'text-slate-400'}`}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      3. मौका मुआयना (Field Check)
                    </span>
                    <span className={`flex items-center gap-1 ${app.trackingStep >= 4 ? 'text-emerald-700' : 'text-slate-400'}`}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      4. DBT भुगतान (Disbursed)
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(app.trackingStep / 4) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl text-xs">
                  <div>
                    <div className="text-slate-500">आवेदक का नाम:</div>
                    <div className="font-bold text-slate-900">{app.applicantName}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">खसरा / सातबारा:</div>
                    <div className="font-bold text-slate-900">{app.khasraNumber}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">आधार (Last 4):</div>
                    <div className="font-bold text-slate-900">XXXX-XXXX-{app.aadhaarLast4}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">बैंक खाता:</div>
                    <div className="font-bold text-slate-900">•••• {app.bankAccountLast4} ({app.ifscCode})</div>
                  </div>
                </div>

                {/* Authority & Download Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Building2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>सत्यापन कार्यालय: <strong>{app.talukaOffice}</strong></span>
                  </div>

                  <button
                    onClick={handleDownloadReceipt}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>पावती डाउनलोड करें (Receipt Slip)</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3-STEP SCHEME APPLICATION MODAL FLOW                                      */}
      {/* ========================================================================= */}
      {applyStep && selectedSchemeForApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-900">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center text-xl font-bold">
                  📜
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base">
                    {applyStep === 'form' && 'चरण 1: ऑनलाइन आवेदन फॉर्म'}
                    {applyStep === 'review' && 'चरण 2: आवेदन समीक्षा व पुष्टि'}
                    {applyStep === 'success' && 'चरण 3: आवेदन सफलतापूर्वक जमा! 🎉'}
                  </h3>
                  <p className="text-[11px] text-indigo-200 font-medium truncate max-w-xs sm:max-w-md">
                    {selectedSchemeForApply.scheme.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setApplyStep(null);
                  setSelectedSchemeForApply(null);
                }}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* MODAL STEP 1: FORM INPUT */}
            {applyStep === 'form' && (
              <form onSubmit={handleProceedToReview} className="p-5 overflow-y-auto space-y-4 text-xs">
                
                {/* Scheme Benefit Banner */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-950 font-bold">
                  <span>अनुदान / सब्सिडी राशि:</span>
                  <span className="font-black text-sm text-emerald-700">{selectedSchemeForApply.potentialBenefit}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">आवेदक किसान का नाम:</label>
                    <input
                      type="text"
                      disabled
                      value={currentFarmer.name}
                      className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">मोबाइल नंबर (Aadhaar Linked):</label>
                    <input
                      type="text"
                      disabled
                      value={currentFarmer.phone}
                      className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-xl font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">खसरा / सातबारा गट नंबर:</label>
                    <input
                      type="text"
                      value={khasraNumber}
                      onChange={(e) => setKhasraNumber(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">12-अंकों का आधार नंबर:</label>
                    <input
                      type="text"
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">बैंक खाता नंबर (DBT Enabled):</label>
                    <input
                      type="text"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">बैंक IFSC कोड:</label>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-800 uppercase focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Document Checklist */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1.5">
                    सत्यापित दस्तावेज चेकलिस्ट (Attached Documents):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedDocs.map((doc, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <span className="text-slate-700 font-medium">{doc}</span>
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyStep(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                  >
                    रद्द करें (Cancel)
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>समीक्षा करें (Proceed to Review)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            )}

            {/* MODAL STEP 2: REVIEW & DECLARATION */}
            {applyStep === 'review' && (
              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                
                {/* Official Review Badge */}
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-indigo-900 font-black text-xs">
                      {selectedSchemeForApply.scheme.code}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-md text-[10px] font-black">
                      AI पात्रता 100% Verified
                    </span>
                  </div>

                  <h4 className="font-black text-sm text-slate-900">
                    {selectedSchemeForApply.scheme.name}
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-500">आवेदक: </span>
                      <strong>{currentFarmer.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">स्थान: </span>
                      <strong>{currentFarmer.village}, {currentFarmer.district}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">खसरा / भूमि: </span>
                      <strong>{khasraNumber} ({currentFarmer.totalAcreage} एकड़)</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">बैंक खाता: </span>
                      <strong>•••• {bankAccount.slice(-4)} ({ifscCode})</strong>
                    </div>
                  </div>
                </div>

                {/* Declaration Checkbox */}
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAcceptedDeclaration}
                    onChange={(e) => setHasAcceptedDeclaration(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-slate-600 leading-tight text-[11px]">
                    मैं प्रमाणित करता हूँ कि मेरे द्वारा दी गई भूमि, आधार एवं बैंक खाता जानकारी पूर्णतः सत्य है। पात्रता अनुसार सरकारी अनुदान मेरे आधार से लिंक बैंक खाते में DBT के माध्यम से प्राप्त होगा।
                  </span>
                </label>

                {/* Review Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyStep('form')}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                  >
                    वापस (Edit Details)
                  </button>

                  <button
                    type="button"
                    disabled={!hasAcceptedDeclaration}
                    onClick={handleFinalSubmitApplication}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>अंतिम आवेदन जमा करें (Submit Official Application)</span>
                  </button>
                </div>

              </div>
            )}

            {/* MODAL STEP 3: SUCCESS & RECEIPT */}
            {applyStep === 'success' && (
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-center">
                
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 border-2 border-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-lg animate-bounce">
                  ✓
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    आवेदन सफलतापूर्वक जमा हो गया!
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    आपका सरकारी योजना आवेदन संबंधित तालुका कृषि अधिकारी को अग्रेषित कर दिया गया है।
                  </p>
                </div>

                {/* Application ID Card */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">आधिकारिक आवेदन संदर्भ क्रमांक (Application ID):</span>
                    <span className="text-emerald-400 font-bold">🟢 Live Track Active</span>
                  </div>
                  <div className="text-lg sm:text-xl font-mono font-black text-amber-300 tracking-wider">
                    {lastSubmittedAppId}
                  </div>
                  <div className="text-[11px] text-slate-300 border-t border-slate-800 pt-2 flex items-center justify-between">
                    <span>आवेदक: <strong>{currentFarmer.name}</strong></span>
                    <span>अनुमानित DBT: <strong>{selectedSchemeForApply.potentialBenefit}</strong></span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={handleDownloadReceipt}
                    className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4 text-indigo-600" />
                    <span>पावती डाउनलोड करें (Receipt Slip)</span>
                  </button>

                  <button
                    onClick={() => {
                      setApplyStep(null);
                      setActiveSubTab('applied');
                    }}
                    className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    <ClipboardList className="w-4 h-4" />
                    <span>स्थिति ट्रैक करें (Track in My Schemes)</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
