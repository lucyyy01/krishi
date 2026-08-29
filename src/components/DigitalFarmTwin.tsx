import React, { useState } from 'react';
import { FarmerProfile, Language, FarmZone, FarmRiskScore } from '../types';
import { translations } from '../data/translations';
import { calculateFarmRiskScore } from '../utils/decisionEngine';
import { 
  Droplet, 
  Thermometer, 
  Sprout, 
  AlertTriangle, 
  Radio, 
  Layers
} from 'lucide-react';

interface DigitalFarmTwinProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
}

export const DigitalFarmTwin: React.FC<DigitalFarmTwinProps> = ({
  currentFarmer,
  currentLanguage
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [selectedZone, setSelectedZone] = useState<FarmZone>(currentFarmer.zones[0] || {} as FarmZone);

  const riskScore: FarmRiskScore = calculateFarmRiskScore(currentFarmer);

  const getStatusColor = (status: FarmZone['status']) => {
    switch (status) {
      case 'healthy':
        return 'bg-emerald-500/20 border-emerald-500 text-emerald-400';
      case 'water_stress':
        return 'bg-blue-500/20 border-blue-500 text-blue-400';
      case 'pest_alert':
        return 'bg-red-500/20 border-red-500 text-red-400';
      case 'nutrient_deficiency':
        return 'bg-amber-500/20 border-amber-500 text-amber-400';
      case 'harvest_ready':
        return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      default:
        return 'bg-emerald-500/20 border-emerald-500 text-emerald-400';
    }
  };

  const getStatusIcon = (status: FarmZone['status']) => {
    switch (status) {
      case 'healthy': return '🌱';
      case 'water_stress': return '💧';
      case 'pest_alert': return '🐛';
      case 'nutrient_deficiency': return '🧪';
      case 'harvest_ready': return '🌾';
      default: return '🌱';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5">
              <Radio className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse text-emerald-400" />
              {t.digitalFarmTwin}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {t.digitalFarmTwin}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium max-w-2xl mt-1">
              {t.digitalFarmTwinDesc}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-emerald-500/30 text-xs text-emerald-200 self-start md:self-auto">
            <div className="font-bold text-white">Spatial Grid: {currentFarmer.zones.length} Parcels</div>
            <div className="text-[11px] text-emerald-300">{currentFarmer.totalAcreage} {t.acreage}</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Field Plot + Risk Radar (12 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Left Column: 2D Field Plot representation (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-950 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-emerald-500/30 shadow-2xl text-white space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-xs sm:text-sm text-white">
                  Field Spatial Parcels & Zones
                </h3>
              </div>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                Click zone to inspect
              </span>
            </div>

            {/* Visual 2D Farm Plot Matrix */}
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {currentFarmer.zones.map((zone) => {
                  const isSelected = selectedZone.id === zone.id;
                  const statusColor = getStatusColor(zone.status);

                  return (
                    <button
                      key={zone.id}
                      onClick={() => setSelectedZone(zone)}
                      className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden ${
                        isSelected 
                          ? 'border-emerald-400 bg-emerald-950/60 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/40' 
                          : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl sm:text-2xl">{getStatusIcon(zone.status)}</span>
                        <span className={`text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${statusColor}`}>
                          {zone.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="font-extrabold text-xs sm:text-sm text-white truncate">
                        {zone.name.split(' - ')[0]}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-emerald-300 font-medium">
                        {zone.areaAcre} {t.acreage} • {zone.crop}
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{t.soilMoisture}: <strong className="text-white font-mono">{zone.soilMoisture}%</strong></span>
                        <span>NDVI: <strong className="text-emerald-400 font-mono">{zone.ndviHealth}</strong></span>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Zone Telemetry Deep Dive Box */}
            {selectedZone.id && (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getStatusIcon(selectedZone.status)}</span>
                    <div>
                      <h4 className="font-extrabold text-sm sm:text-base text-white">{selectedZone.name}</h4>
                      <span className="text-[11px] text-emerald-300">{selectedZone.areaAcre} {t.acreage}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(selectedZone.status)}`}>
                    {selectedZone.status.toUpperCase().replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                      <Droplet className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                      {t.soilMoisture}
                    </div>
                    <div className="text-sm sm:text-base font-black text-white mt-0.5 font-mono">{selectedZone.soilMoisture}%</div>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      Temp
                    </div>
                    <div className="text-sm sm:text-base font-black text-white mt-0.5 font-mono">{selectedZone.temp}°C</div>
                  </div>

                  <div className="p-2 sm:p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                      <Sprout className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      NDVI
                    </div>
                    <div className="text-sm sm:text-base font-black text-emerald-400 mt-0.5 font-mono">{selectedZone.ndviHealth}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <strong className="text-emerald-300 block mb-0.5">Agronomist Field Notes:</strong>
                  {selectedZone.notes}
                </div>

                <div className="text-xs text-amber-200 bg-amber-950/40 p-3 rounded-xl border border-amber-500/30 font-semibold flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300 block">{t.immediateAction}:</strong>
                    {selectedZone.recommendedAction}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

        {/* Right Column: Composite Farm Risk Index Score (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-md space-y-4 sm:space-y-5">
            
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  AI Composite Risk
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {t.farmRiskScore}
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-xl text-xs font-black ${
                riskScore.status === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                riskScore.status === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                riskScore.status === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                'bg-emerald-100 text-emerald-800'
              }`}>
                {riskScore.status}
              </span>
            </div>

            {/* Big Risk Score Gauge */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-slate-950 text-white text-center shadow-inner space-y-1.5">
              <div className="text-[10px] sm:text-xs uppercase font-black tracking-widest text-slate-400">
                {t.farmRiskScore} (0 - 100)
              </div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-400 to-rose-500 font-mono">
                {riskScore.totalScore} <span className="text-lg sm:text-xl text-slate-500 font-normal">/ 100</span>
              </div>
              <div className="text-[11px] sm:text-xs text-emerald-300 font-medium pt-1 truncate">
                Primary: {riskScore.primaryRiskFactor}
              </div>
            </div>

            {/* Risk Breakdown Category Gauges */}
            <div className="space-y-2.5 text-xs">
              
              {/* Weather Risk */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span className="flex items-center gap-1">🌧️ {t.weatherRisk} (35%)</span>
                  <span className="font-mono text-slate-900">{riskScore.breakdown.weatherRisk}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                    style={{ width: `${riskScore.breakdown.weatherRisk}%` }} 
                  />
                </div>
              </div>

              {/* Pest & Fungal Risk */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span className="flex items-center gap-1">🐛 {t.pestRisk} (25%)</span>
                  <span className="font-mono text-slate-900">{riskScore.breakdown.pestRisk}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                    style={{ width: `${riskScore.breakdown.pestRisk}%` }} 
                  />
                </div>
              </div>

              {/* Water Stress */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span className="flex items-center gap-1">💧 {t.waterStress} (20%)</span>
                  <span className="font-mono text-slate-900">{riskScore.breakdown.waterStress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 rounded-full transition-all duration-500" 
                    style={{ width: `${riskScore.breakdown.waterStress}%` }} 
                  />
                </div>
              </div>

              {/* Crop Health */}
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span className="flex items-center gap-1">🌱 {t.cropHealth} (15%)</span>
                  <span className="font-mono text-slate-900">{riskScore.breakdown.cropHealthRisk}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${riskScore.breakdown.cropHealthRisk}%` }} 
                  />
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
