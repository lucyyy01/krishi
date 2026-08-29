import React, { useState } from 'react';
import { FarmerProfile, Language, IoTSensorData } from '../types';
import { translations } from '../data/translations';
import { getFarmerIoTTelemetry } from '../data/iotData';
import { 
  Radio, 
  Droplet, 
  Thermometer, 
  Sun, 
  Activity, 
  Power, 
  Layers, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface IoTHardwareHubProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
}

export const IoTHardwareHub: React.FC<IoTHardwareHubProps> = ({
  currentFarmer,
  currentLanguage
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [telemetry, setTelemetry] = useState<IoTSensorData>(getFarmerIoTTelemetry(currentFarmer));
  const [isValveToggling, setIsValveToggling] = useState(false);

  const toggleSmartValve = () => {
    setIsValveToggling(true);
    setTimeout(() => {
      setTelemetry(prev => {
        const nextState = prev.smartDripValveState === 'OPEN' ? 'CLOSED' : 'OPEN';
        if (nextState === 'OPEN') {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.6 }
          });
        }
        return {
          ...prev,
          smartDripValveState: nextState,
          lastPingTime: 'Just now (Acknowledged)'
        };
      });
      setIsValveToggling(false);
    }, 600);
  };

  const refreshSensorNodes = () => {
    setTelemetry(getFarmerIoTTelemetry(currentFarmer));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-emerald-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-teal-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5">
              <Radio className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse text-emerald-400" />
              {t.iotSensors}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {t.iotSensors}
            </h1>
            <p className="text-xs sm:text-sm text-teal-200/90 font-medium max-w-2xl mt-1">
              {t.iotDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={refreshSensorNodes}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
              <span>Ping Nodes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gateway Status & Actuator Control Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Remote Valve Actuator Controller (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-teal-500/30 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Power className="w-5 h-5 text-emerald-400" />
                <h3 className="font-black text-xs sm:text-sm text-white">
                  {t.valveControl}
                </h3>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                telemetry.smartDripValveState === 'OPEN' 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 animate-pulse'
                  : 'bg-red-500/20 text-red-300 border-red-400/40'
              }`}>
                Valve: {telemetry.smartDripValveState}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5 mt-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Hardware Node ID:</span>
                <span className="font-mono text-white">KRISHI-NODE-YAV-01</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Last Gateway Heartbeat:</span>
                <span className="text-teal-300">{telemetry.lastPingTime}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Solar Battery Health:</span>
                <span className="text-emerald-400 font-bold">{telemetry.batteryLevelPercent}% (Optimal)</span>
              </div>
            </div>

            {/* Automated Rain Shut-Off Safety Alert */}
            {currentFarmer.weather.rainProbability >= 60 && (
              <div className="mt-3 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block">{t.cautionAdvisory}:</strong>
                  Rain forecasted in {currentFarmer.weather.rainForecastWindow}. {t.dontIrrigate}
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={toggleSmartValve}
              disabled={isValveToggling}
              className={`w-full py-3 sm:py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 ${
                telemetry.smartDripValveState === 'OPEN'
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>
                {isValveToggling 
                  ? 'Transmitting LoRa Command...' 
                  : telemetry.smartDripValveState === 'OPEN' 
                  ? t.closeValve 
                  : t.openValve}
              </span>
            </button>
          </div>
        </div>

        {/* Live Multi-Depth Soil Telemetry Grid (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-md space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-600" />
              {t.iotSensors}
            </h3>
            <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Streaming
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
            
            {/* Moisture 15cm */}
            <div className="p-3 sm:p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200">
              <div className="text-[10px] uppercase font-bold text-cyan-800 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-cyan-600 flex-shrink-0" />
                {t.moistureShallow}
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 mt-1 font-mono">{telemetry.soilMoisture15cm}%</div>
              <div className="text-[9px] sm:text-[10px] text-cyan-700">Root zone</div>
            </div>

            {/* Moisture 30cm */}
            <div className="p-3 sm:p-4 rounded-2xl bg-blue-50/80 border border-blue-200">
              <div className="text-[10px] uppercase font-bold text-blue-800 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                {t.moistureDeep}
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 mt-1 font-mono">{telemetry.soilMoisture30cm}%</div>
              <div className="text-[9px] sm:text-[10px] text-blue-700">Deep taproot</div>
            </div>

            {/* Soil Temp */}
            <div className="p-3 sm:p-4 rounded-2xl bg-amber-50/80 border border-amber-200">
              <div className="text-[10px] uppercase font-bold text-amber-800 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                {t.soilTemp}
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 mt-1 font-mono">{telemetry.soilTemperatureC.toFixed(1)}°C</div>
              <div className="text-[9px] sm:text-[10px] text-amber-700">Optimal</div>
            </div>

            {/* Solar Radiation */}
            <div className="p-3 sm:p-4 rounded-2xl bg-yellow-50/80 border border-yellow-200">
              <div className="text-[10px] uppercase font-bold text-yellow-800 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
                {t.solarLux}
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 mt-1 font-mono">{(telemetry.solarRadiationLux / 1000).toFixed(0)}k Lux</div>
              <div className="text-[9px] sm:text-[10px] text-yellow-700">Sunlight</div>
            </div>

            {/* Leaf Wetness */}
            <div className="p-3 sm:p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
              <div className="text-[10px] uppercase font-bold text-emerald-800 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                {t.leafWetness}
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 mt-1 font-mono">{telemetry.leafWetnessPercent}%</div>
              <div className="text-[9px] sm:text-[10px] text-emerald-700">Dew index</div>
            </div>

            {/* Soil pH */}
            <div className="p-3 sm:p-4 rounded-2xl bg-purple-50/80 border border-purple-200">
              <div className="text-[10px] uppercase font-bold text-purple-800 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                Soil pH
              </div>
              <div className="text-lg sm:text-xl font-black text-slate-900 mt-1 font-mono">{telemetry.soilPh}</div>
              <div className="text-[9px] sm:text-[10px] text-purple-700">Neutral</div>
            </div>

          </div>

          {/* NPK Live Soil Chemistry Bar */}
          <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-900">
              🧪 N-P-K In-Situ Soil Chemistry:
            </div>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-xs font-mono">
              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-sans block truncate">Nitrogen (N)</span>
                <strong className="text-blue-700 text-xs sm:text-sm">{telemetry.soilNitrogenMgKg} mg/kg</strong>
              </div>
              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-sans block truncate">Phosphorus (P)</span>
                <strong className="text-amber-700 text-xs sm:text-sm">{telemetry.soilPhosphorusMgKg} mg/kg</strong>
              </div>
              <div className="p-2 rounded-xl bg-white border border-slate-200">
                <span className="text-[9px] sm:text-[10px] text-slate-500 font-sans block truncate">Potassium (K)</span>
                <strong className="text-purple-700 text-xs sm:text-sm">{telemetry.soilPotassiumMgKg} mg/kg</strong>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
