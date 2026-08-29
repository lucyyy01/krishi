import React, { useState } from 'react';
import { FarmerProfile, Language, DailyAction } from '../types';
import { translations } from '../data/translations';
import { speakVernacularText, stopSpeech } from '../utils/audioSpeech';
import { 
  CheckCircle2, 
  DropletOff, 
  Droplets, 
  ShieldAlert, 
  Bug, 
  Sparkles, 
  Landmark, 
  Clock, 
  Check, 
  TrendingUp, 
  HelpCircle, 
  PlayCircle,
  Volume2,
  VolumeX, 
  CloudRain,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface TodaysActionPlanProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
  actions: DailyAction[];
  onSimulateScenario: (scenarioType: any) => void;
  onNavigateToTab: (tabId: string) => void;
}

export const TodaysActionPlan: React.FC<TodaysActionPlanProps> = ({
  currentFarmer,
  currentLanguage,
  actions,
  onSimulateScenario,
  onNavigateToTab
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [completedActionIds, setCompletedActionIds] = useState<Record<string, boolean>>({});
  const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(null);
  const [speakingActionId, setSpeakingActionId] = useState<string | null>(null);

  const toggleActionDone = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowDone = !completedActionIds[id];
    setCompletedActionIds(prev => ({ ...prev, [id]: isNowDone }));

    if (isNowDone) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#3b82f6', '#f59e0b', '#22c55e']
      });
    }
  };

  const handleSpeakCard = (action: DailyAction, e: React.MouseEvent) => {
    e.stopPropagation();
    if (speakingActionId === action.id) {
      stopSpeech();
      setSpeakingActionId(null);
      return;
    }

    const textToSpeak = `${action.title}. ${action.actionText}. ${action.reasoning}. ${action.savingsImpact || ''}`;
    setSpeakingActionId(action.id);
    speakVernacularText(
      textToSpeak, 
      currentLanguage, 
      () => setSpeakingActionId(action.id), 
      () => setSpeakingActionId(null)
    );
  };

  const getUrgencyBadge = (urgency: DailyAction['urgency'], title: string) => {
    const isStop = title.includes('DO NOT') || title.includes('🛑') || title.includes('मत') || title.includes('नका') || title.includes('వద్దు') || title.includes('வேண்டாம்') || title.includes('ಬೇಡಿ');
    
    if (isStop) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white shadow-sm animate-pulse">
          {t.doNotSpray.includes('DO NOT') ? '🛑 STOP / DO NOT DO THIS' : `🛑 ${t.doNotSpray}`}
        </span>
      );
    }

    switch (urgency) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-sm">
            ✅ {t.urgentActionRequired}
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950">
            ⏳ {t.cautionAdvisory}
          </span>
        );
      case 'optimal':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            🟢 {t.optimalProgress}
          </span>
        );
      default:
        return null;
    }
  };

  const getActionIcon = (iconName: string) => {
    switch (iconName) {
      case 'DropletOff': return <DropletOff className="w-6 h-6 text-blue-600" />;
      case 'Droplets': return <Droplets className="w-6 h-6 text-cyan-600" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6 text-red-600" />;
      case 'Bug': return <Bug className="w-6 h-6 text-amber-600" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-emerald-600" />;
      case 'Landmark': return <Landmark className="w-6 h-6 text-indigo-600" />;
      default: return <CheckCircle2 className="w-6 h-6 text-emerald-600" />;
    }
  };

  const completedCount = Object.values(completedActionIds).filter(Boolean).length;
  const progressPercent = actions.length > 0 ? Math.round((completedCount / actions.length) * 100) : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Hero "Your Farm Today" Simple Farmer Overview Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white p-4 sm:p-6 md:p-8 shadow-2xl border border-emerald-500/30">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-emerald-700/40">
            <div>
              <div className="flex items-center gap-2.5 sm:gap-3">
                <span className="text-3xl sm:text-4xl">🌾</span>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                    {currentFarmer.name} — {t.todaysActionPlan}
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-200 font-semibold mt-0.5">
                    {currentFarmer.cropNameEn} • {currentFarmer.cropStageName} • {currentFarmer.totalAcreage} {t.acreage} ({currentFarmer.village}, {currentFarmer.district})
                  </p>
                </div>
              </div>
            </div>

            {/* Daily Execution Progress Meter */}
            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-3.5 sm:p-4 min-w-[220px] shadow-inner">
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-emerald-300 uppercase tracking-wider">{t.todaysActionPlan}</span>
                <span className="text-white font-mono">{completedCount} / {actions.length} {t.completed} ({progressPercent}%)</span>
              </div>
              <div className="w-full h-2.5 sm:h-3 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-green-400 transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick 5 Status Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 pt-4 sm:pt-6">
            
            <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-3 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                <CloudRain className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold truncate">{t.liveWeather}</div>
                <div className="text-xs font-black text-white truncate">
                  {currentFarmer.weather.rainProbability >= 50 ? t.rainExpected : '☀️ Clear'}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-3 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
                <DropletOff className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold truncate">{t.waterStress}</div>
                <div className="text-xs font-black text-white truncate">
                  {currentFarmer.weather.rainProbability >= 60 ? t.dontIrrigate : '✅ Water'}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-3 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Bug className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold truncate">{t.pestRisk}</div>
                <div className="text-xs font-black text-white truncate">
                  {currentFarmer.weather.rainProbability >= 60 ? t.doNotSpray : t.safeToSpray}
                </div>
              </div>
            </div>

            <div 
              onClick={() => onNavigateToTab('schemes')}
              className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-3 flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Landmark className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold truncate">{t.schemeMatcher}</div>
                <div className="text-xs font-black text-emerald-300 group-hover:underline truncate">
                  💰 {t.whyEligible}
                </div>
              </div>
            </div>

            <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-3 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold truncate">{t.fertilizerCalc}</div>
                <div className="text-xs font-black text-white truncate">
                  {currentFarmer.weather.rainProbability >= 60 ? '⏳ Delay 2d' : '🧪 NPK Ready'}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Action Cards List */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>{t.todaysActionPlan}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {t.todaysActionDesc}
            </p>
          </div>

          <button
            onClick={() => onNavigateToTab('what-if')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-extrabold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-200 shadow-sm"
          >
            <PlayCircle className="w-4 h-4 text-emerald-600" />
            {t.whatIfSimulator}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {actions.map((action) => {
            const isDone = !!completedActionIds[action.id];
            const isExpanded = expandedDetailsId === action.id;
            const isSpeaking = speakingActionId === action.id;

            return (
              <div
                key={action.id}
                className={`rounded-2xl sm:rounded-3xl border transition-all duration-200 overflow-hidden ${
                  isDone 
                    ? 'bg-slate-100/80 border-slate-300 opacity-75' 
                    : action.urgency === 'critical'
                    ? 'bg-white border-red-300 shadow-md hover:border-red-400'
                    : action.urgency === 'warning'
                    ? 'bg-white border-amber-300 shadow-md hover:border-amber-400'
                    : 'bg-white border-emerald-300 shadow-md hover:border-emerald-400'
                }`}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                    
                    <div className="flex items-start gap-3 sm:gap-4 flex-1">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow ${
                        action.urgency === 'critical' ? 'bg-red-50 border border-red-200' :
                        action.urgency === 'warning' ? 'bg-amber-50 border border-amber-200' :
                        'bg-emerald-50 border border-emerald-200'
                      }`}>
                        {getActionIcon(action.iconName)}
                      </div>

                      <div className="space-y-1.5 sm:space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          {getUrgencyBadge(action.urgency, action.title)}
                          
                          {/* 🔊 Read Aloud Speaker Button on EVERY Card */}
                          <button
                            onClick={(e) => handleSpeakCard(action, e)}
                            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black transition-all shadow-sm ${
                              isSpeaking 
                                ? 'bg-red-600 text-white animate-pulse' 
                                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                            }`}
                            title="Listen"
                          >
                            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                            <span>{isSpeaking ? 'Stop' : '🔊 Listen'}</span>
                          </button>

                          <span className="text-[11px] sm:text-xs font-semibold text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400" />
                            {action.timingWindow}
                          </span>
                        </div>

                        <h3 className={`text-base sm:text-lg font-black text-slate-900 break-words ${isDone ? 'line-through text-slate-500' : ''}`}>
                          {action.title}
                        </h3>

                        <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                          {action.actionText}
                        </p>

                        {/* Simple Farmer Reason Box */}
                        <div className="p-3 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium leading-relaxed flex items-start gap-2">
                          <HelpCircle className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-emerald-950 font-black block mb-0.5">{t.whyThisAction}:</strong>
                            <span>{action.reasoning}</span>
                          </div>
                        </div>

                        {/* Direct Savings Impact Badge */}
                        {action.savingsImpact && (
                          <div className="inline-flex items-center gap-1 text-xs font-black text-emerald-900 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-300">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>{action.savingsImpact}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                      
                      <button
                        onClick={(e) => toggleActionDone(action.id, e)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-black text-xs transition-all shadow-md active:scale-95 flex-shrink-0 ${
                          isDone
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {isDone ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{t.completed}</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{t.markDone}</span>
                          </>
                        )}
                      </button>

                      {action.category === 'irrigation' && (
                        <button
                          onClick={() => {
                            onSimulateScenario('irrigate_today');
                            onNavigateToTab('what-if');
                          }}
                          className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1.5 rounded-xl border border-blue-200"
                        >
                          <PlayCircle className="w-3.5 h-3.5 text-blue-600" />
                          {t.simulateImpact}
                        </button>
                      )}

                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
