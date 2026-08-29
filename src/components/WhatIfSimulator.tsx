import React, { useState } from 'react';
import { FarmerProfile, Language, SimulationResult } from '../types';
import { translations } from '../data/translations';
import { runFarmSimulation } from '../utils/decisionEngine';
import { speakVernacularText, stopSpeech } from '../utils/audioSpeech';
import { 
  Droplet, 
  IndianRupee, 
  Bug, 
  AlertOctagon, 
  Sliders, 
  RefreshCw, 
  Sparkles,
  ShieldCheck,
  CloudRain,
  Volume2,
  VolumeX
} from 'lucide-react';

interface WhatIfSimulatorProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
  selectedScenarioKey?: string;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  currentFarmer,
  currentLanguage,
  selectedScenarioKey = 'irrigate_today'
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [activeScenario, setActiveScenario] = useState<'irrigate_today' | 'spray_pesticide_now' | 'delay_fertilizer_4d' | 'heavy_rain_unseasonal'>(
    selectedScenarioKey as any || 'irrigate_today'
  );

  const [simulatedRainProb, setSimulatedRainProb] = useState<number>(currentFarmer.weather.rainProbability);
  const [simulatedSoilMoisture, setSimulatedSoilMoisture] = useState<number>(currentFarmer.soilMoisture);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const simulatedFarmer: FarmerProfile = {
    ...currentFarmer,
    soilMoisture: simulatedSoilMoisture,
    weather: {
      ...currentFarmer.weather,
      rainProbability: simulatedRainProb,
      expectedRainfallMm: simulatedRainProb > 50 ? Math.round(simulatedRainProb * 0.3) : 0
    }
  };

  const simulation: SimulationResult = runFarmSimulation(activeScenario, simulatedFarmer, currentLanguage);

  const handleSpeakVerdict = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${simulation.verdictTitle}. ${simulation.verdictExplanation}. ${simulation.bestAlternative}`;
    setIsSpeaking(true);
    speakVernacularText(
      textToSpeak, 
      currentLanguage, 
      () => setIsSpeaking(true), 
      () => setIsSpeaking(false)
    );
  };

  const resetSliders = () => {
    setSimulatedRainProb(currentFarmer.weather.rainProbability);
    setSimulatedSoilMoisture(currentFarmer.soilMoisture);
  };

  const scenariosList = [
    {
      id: 'irrigate_today',
      title: currentLanguage === 'hi' ? '💧 क्या आज पानी दूं?' : currentLanguage === 'mr' ? '💧 आज पाणी द्यावे का?' : '💧 Irrigate Field Today?',
      desc: currentLanguage === 'hi' ? 'पानी की बर्बादी व बिजली खर्च का हिसाब' : currentLanguage === 'mr' ? 'पाण्याचा अपव्यय व वीज बिलाचा हिशोब' : 'Water wastage & electricity cost impact'
    },
    {
      id: 'spray_pesticide_now',
      title: currentLanguage === 'hi' ? '🐛 आज दवाई छिड़कें?' : currentLanguage === 'mr' ? '🐛 आज फवारणी करावी का?' : '🐛 Spray Pesticide Now?',
      desc: currentLanguage === 'hi' ? 'दवाई के बारिश में बहने का नुकसान' : currentLanguage === 'mr' ? 'पावसामुळे औषध वाहून जाण्याचा धोका' : 'Rain washout & cost calculation'
    },
    {
      id: 'delay_fertilizer_4d',
      title: currentLanguage === 'hi' ? '🧪 खाद 4 दिन बाद दें?' : currentLanguage === 'mr' ? '🧪 खत ४ दिवस उशिरा द्यावे का?' : '🧪 Delay Fertilizer 4 Days?',
      desc: currentLanguage === 'hi' ? 'खाद के बहने से बचाव व सही पोषण' : currentLanguage === 'mr' ? 'खत वाहून जाण्यापासून संरक्षण' : 'Prevent fertilizer runoff & root absorption'
    },
    {
      id: 'heavy_rain_unseasonal',
      title: currentLanguage === 'hi' ? '🌧️ भारी बारिश का खतरा?' : currentLanguage === 'mr' ? '🌧️ मुसळधार पावसाचा धोका?' : '🌧️ Heavy Rain Threat?',
      desc: currentLanguage === 'hi' ? 'खेत में पानी भरने व नाली सफाई' : currentLanguage === 'mr' ? 'शेतात पाणी साचणे व निचरा व्यवस्था' : 'Waterlogging risk & drainage plan'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-950 via-emerald-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-teal-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {t.whatIfSimulator}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {t.whatIfSimulator}
            </h1>
            <p className="text-xs sm:text-sm text-teal-200/90 font-medium max-w-2xl mt-1">
              {t.whatIfDesc}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-teal-500/30 text-xs text-teal-200 self-start md:self-auto">
            <div className="font-bold text-white">{currentFarmer.name}</div>
            <div className="text-[11px] text-teal-300">{currentFarmer.cropNameEn} ({currentFarmer.totalAcreage} {t.acreage})</div>
          </div>
        </div>
      </div>

      {/* Scenario Selector Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {scenariosList.map((sc) => (
          <button
            key={sc.id}
            onClick={() => setActiveScenario(sc.id as any)}
            className={`p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl border text-left transition-all relative overflow-hidden ${
              activeScenario === sc.id
                ? 'bg-emerald-900 text-white border-emerald-400 shadow-lg ring-2 ring-emerald-500/40'
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm'
            }`}
          >
            <div className="text-xs sm:text-sm font-black mb-1">
              {sc.title}
            </div>
            <p className={`text-[11px] sm:text-xs ${activeScenario === sc.id ? 'text-emerald-200' : 'text-slate-500'}`}>
              {sc.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Main Grid: Variables + AI Outcome */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Left Column: Sliders (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-md space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <h3 className="font-black text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
                <Sliders className="w-4 h-4 text-emerald-600" />
                {t.simulateImpact}
              </h3>
              <button
                onClick={resetSliders}
                className="text-xs font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Slider 1: Rain Probability */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700 flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                  {t.rainExpected} (%)
                </span>
                <span className="font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-bold">
                  {simulatedRainProb}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={simulatedRainProb}
                onChange={(e) => setSimulatedRainProb(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>0% (Clear Sun)</span>
                <span>50% (Drizzle)</span>
                <span>100% (Downpour)</span>
              </div>
            </div>

            {/* Slider 2: Soil Moisture */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700 flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-cyan-500" />
                  {t.soilMoisture} (%)
                </span>
                <span className="font-mono text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded-md font-bold">
                  {simulatedSoilMoisture}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="90"
                step="2"
                value={simulatedSoilMoisture}
                onChange={(e) => setSimulatedSoilMoisture(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>20% (Dry)</span>
                <span>55% (Balanced)</span>
                <span>90% (Waterlogged)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-black text-slate-900 text-[10px] uppercase">{currentFarmer.cropNameEn}</div>
              <div className="text-slate-700">{currentFarmer.totalAcreage} {t.acreage} • {currentFarmer.district}</div>
            </div>

          </div>
        </div>

        {/* Right Column: AI Simulation Verdict (8 Cols) */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-5">
          <div className={`p-5 sm:p-7 rounded-2xl sm:rounded-3xl border shadow-lg ${
            simulation.verdict === 'not_recommended' 
              ? 'bg-red-50 border-red-300 text-red-950' 
              : simulation.verdict === 'proceed_with_caution'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : 'bg-emerald-50 border-emerald-300 text-emerald-950'
          }`}>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-70">
                  {t.whatIfSimulator}
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-0.5">
                  {simulation.verdictTitle}
                </h2>
              </div>

              <button
                onClick={handleSpeakVerdict}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl font-black text-xs shadow transition-all ${
                  isSpeaking
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-white text-slate-900 border hover:bg-slate-100'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeaking ? 'Stop' : '🔊 Listen'}</span>
              </button>
            </div>

            <p className="mt-3 text-xs sm:text-sm md:text-base font-bold leading-relaxed">
              {simulation.verdictExplanation}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-4">
              
              <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-black/5 shadow-sm">
                <div className="text-[11px] text-slate-500 font-bold mb-1 flex items-center gap-1 truncate">
                  <Droplet className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  <span>Water Impact</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 font-mono">
                  {simulation.metrics.waterWastedLitrePerAcre > 0 ? (
                    <span className="text-red-600">
                      ~{(simulation.metrics.waterWastedLitrePerAcre * currentFarmer.totalAcreage).toLocaleString()} L
                    </span>
                  ) : (
                    <span className="text-emerald-600">0 L</span>
                  )}
                </div>
              </div>

              <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-black/5 shadow-sm">
                <div className="text-[11px] text-slate-500 font-bold mb-1 flex items-center gap-1 truncate">
                  <IndianRupee className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Finance</span>
                </div>
                <div className="text-base sm:text-lg font-black text-slate-900 font-mono">
                  {simulation.metrics.financialImpactRupees > 0 ? (
                    <span className="text-red-600">-₹{simulation.metrics.financialImpactRupees.toLocaleString()}</span>
                  ) : (
                    <span className="text-emerald-600">₹0 loss</span>
                  )}
                </div>
              </div>

              <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-black/5 shadow-sm">
                <div className="text-[11px] text-slate-500 font-bold mb-1 flex items-center gap-1 truncate">
                  <Bug className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  <span>Pest Risk</span>
                </div>
                <div className="text-base sm:text-lg font-black font-mono">
                  {simulation.metrics.diseaseRiskChangePercent > 0 ? (
                    <span className="text-red-600">+{simulation.metrics.diseaseRiskChangePercent}%</span>
                  ) : (
                    <span className="text-emerald-600">{simulation.metrics.diseaseRiskChangePercent}%</span>
                  )}
                </div>
              </div>

              <div className="bg-white/90 p-3 sm:p-4 rounded-2xl border border-black/5 shadow-sm">
                <div className="text-[11px] text-slate-500 font-bold mb-1 flex items-center gap-1 truncate">
                  <AlertOctagon className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                  <span>Runoff Risk</span>
                </div>
                <div className="text-sm sm:text-base font-black text-slate-900 truncate">
                  {simulation.metrics.soilRunoffRisk === 'Severe' || simulation.metrics.soilRunoffRisk === 'High' ? (
                    <span className="text-red-600">High Risk</span>
                  ) : (
                    <span className="text-emerald-600">Safe</span>
                  )}
                </div>
              </div>

            </div>

            {/* Key Takeaways */}
            <div className="mt-4 p-3.5 rounded-2xl bg-white/80 border border-black/5 space-y-1.5 text-xs">
              <div className="font-black text-slate-900 uppercase text-[11px]">
                📌 Consequence:
              </div>
              <ul className="space-y-1 font-semibold text-slate-800">
                {simulation.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Best Action */}
            <div className="mt-3 p-3.5 rounded-2xl bg-slate-950 text-white flex items-start gap-2.5 shadow-md">
              <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-300 text-xs font-black uppercase tracking-wider block">
                  {t.immediateAction}:
                </strong>
                <p className="text-xs font-bold text-white mt-0.5">
                  {simulation.bestAlternative}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
