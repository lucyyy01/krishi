import React, { useState } from 'react';
import { FarmerProfile, Language, SchemeMatchResult } from '../types';
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
  VolumeX
} from 'lucide-react';

interface SchemeMatcherProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
}

export const SchemeMatcher: React.FC<SchemeMatcherProps> = ({
  currentFarmer,
  currentLanguage
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);
  const [speakingSchemeId, setSpeakingSchemeId] = useState<string | null>(null);

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
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-indigo-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {t.schemeMatcher}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {t.schemeMatcher}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 font-medium max-w-2xl mt-1">
              {t.schemeMatcherDesc}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-indigo-500/30 text-xs space-y-0.5 self-start md:self-auto">
            <div className="font-bold text-white">{currentFarmer.name} ({currentFarmer.state})</div>
            <div className="text-emerald-400 font-black">
              ✨ {matchedSchemes.filter(s => s.isEligible).length} Eligible Schemes
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Schemes' },
            { id: 'central', label: 'Central Govt' },
            { id: 'state', label: 'State Govt' },
            { id: 'subsidy', label: 'Machinery Subsidy' },
            { id: 'insurance', label: 'Crop Insurance' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                selectedCategory === tab.id
                  ? 'bg-indigo-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 font-semibold"
          />
        </div>
      </div>

      {/* Scheme Cards */}
      <div className="space-y-3 sm:space-y-4">
        {filteredSchemes.map((matchResult) => {
          const { scheme, matchScore, isEligible, whyEligiblePoints, whyNotEligiblePoints, nextSteps, potentialBenefit } = matchResult;
          const isExpanded = expandedSchemeId === scheme.id;
          const isSpeaking = speakingSchemeId === scheme.id;

          return (
            <div
              key={scheme.id}
              className={`rounded-2xl sm:rounded-3xl border transition-all duration-200 overflow-hidden bg-white shadow-md hover:shadow-lg ${
                isEligible ? 'border-emerald-300' : 'border-slate-200'
              }`}
            >
              <div className="p-4 sm:p-6">
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {getMatchBadge(matchScore, isEligible)}

                      <button
                        onClick={(e) => handleSpeakScheme(matchResult, e)}
                        className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black transition-all shadow-sm ${
                          isSpeaking 
                            ? 'bg-red-600 text-white animate-pulse' 
                            : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-950 border border-indigo-300'
                        }`}
                      >
                        {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span>{isSpeaking ? 'Stop' : '🔊 Listen'}</span>
                      </button>

                      <span className="text-[11px] sm:text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        {t.deadlineIn}: {scheme.applicationDeadline} ({scheme.daysRemaining} {t.days})
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-slate-900 break-words">
                      {scheme.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                      {scheme.benefitsSummary}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 flex-shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Benefit</span>
                      <span className="text-base sm:text-lg font-black text-emerald-700">{potentialBenefit}</span>
                    </div>

                    <a
                      href={scheme.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-black shadow transition-all"
                    >
                      <span>{t.applyNow}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Why Eligible & Why NOT Eligible */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-black text-emerald-950">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{t.whyEligible}:</span>
                    </div>
                    <ul className="space-y-1 text-xs text-emerald-950 font-semibold pl-5 list-disc">
                      {whyEligiblePoints.map((pt, pIdx) => (
                        <li key={pIdx} className="leading-tight">{pt}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={`p-3.5 sm:p-4 rounded-2xl border space-y-1 ${
                    whyNotEligiblePoints.length > 0
                      ? 'bg-red-50 border-red-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-1.5 text-xs font-black text-red-950">
                      <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span>{t.whyNotEligible}:</span>
                    </div>
                    {whyNotEligiblePoints.length > 0 ? (
                      <ul className="space-y-1 text-xs text-red-950 font-semibold pl-5 list-disc">
                        {whyNotEligiblePoints.map((pt, pIdx) => (
                          <li key={pIdx} className="leading-tight">{pt}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-emerald-800 font-bold">
                        ✅ 100% Eligible!
                      </p>
                    )}
                  </div>
                </div>

                {/* Expandable Documents */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between items-center">
                  <button
                    onClick={() => setExpandedSchemeId(isExpanded ? null : scheme.id)}
                    className="flex items-center gap-1 text-xs font-black text-indigo-800 hover:text-indigo-950"
                  >
                    <span>{isExpanded ? 'Hide Documents' : t.documentsRequired}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200 bg-slate-50/90 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-4 sm:p-6 space-y-2 animate-in fade-in duration-150">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      {t.documentsRequired}:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {scheme.requiredDocuments.map((doc, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
