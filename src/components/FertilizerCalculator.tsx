import React, { useState } from 'react';
import { FarmerProfile, Language } from '../types';
import { translations } from '../data/translations';
import { 
  Sparkles, 
  Sprout, 
  Calculator,
  Scale
} from 'lucide-react';

interface FertilizerCalculatorProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
}

export const FertilizerCalculator: React.FC<FertilizerCalculatorProps> = ({
  currentFarmer,
  currentLanguage
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [targetAcreage, setTargetAcreage] = useState<number>(currentFarmer.totalAcreage);

  // Standard N-P-K nutrient dosage calculation per acre based on crop
  const getDosageMetrics = () => {
    switch (currentFarmer.crop) {
      case 'cotton':
        return {
          ureaBags50kg: Math.ceil((48 * targetAcreage * 2.17) / 50),
          dapBags50kg: Math.ceil((24 * targetAcreage * 2.17) / 50),
          mopBags50kg: Math.ceil((24 * targetAcreage * 1.67) / 50),
          bioAlternative: `${targetAcreage * 2} Tons Vermicompost + ${targetAcreage * 4}L Jeevamrutha + Azotobacter`
        };
      case 'rice':
        return {
          ureaBags50kg: Math.ceil((40 * targetAcreage * 2.17) / 50),
          dapBags50kg: Math.ceil((20 * targetAcreage * 2.17) / 50),
          mopBags50kg: Math.ceil((20 * targetAcreage * 1.67) / 50),
          bioAlternative: `${targetAcreage * 2.5} Tons FYM + Blue Green Algae + Phosphobacteria`
        };
      case 'wheat':
        return {
          ureaBags50kg: Math.ceil((50 * targetAcreage * 2.17) / 50),
          dapBags50kg: Math.ceil((25 * targetAcreage * 2.17) / 50),
          mopBags50kg: Math.ceil((15 * targetAcreage * 1.67) / 50),
          bioAlternative: `${targetAcreage * 3} Tons Compost + PSB biofertilizer seed inoculant`
        };
      case 'tomato':
        return {
          ureaBags50kg: Math.ceil((60 * targetAcreage * 2.17) / 50),
          dapBags50kg: Math.ceil((40 * targetAcreage * 2.17) / 50),
          mopBags50kg: Math.ceil((50 * targetAcreage * 1.67) / 50),
          bioAlternative: `${targetAcreage * 4} Tons Enriched Compost + 19-19-19 water soluble via drip`
        };
      default:
        return {
          ureaBags50kg: Math.ceil((35 * targetAcreage * 2.17) / 50),
          dapBags50kg: Math.ceil((20 * targetAcreage * 2.17) / 50),
          mopBags50kg: Math.ceil((20 * targetAcreage * 1.67) / 50),
          bioAlternative: `${targetAcreage * 2} Tons Organic Manure`
        };
    }
  };

  const metrics = getDosageMetrics();

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5">
              <Calculator className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {t.fertilizerCalc}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {t.fertilizerCalc}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium max-w-2xl mt-1">
              Customized N-P-K nutrient dosage prescription based on {currentFarmer.cropNameEn} stage & soil telemetry.
            </p>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-emerald-500/30 text-xs text-emerald-200 self-start md:self-auto">
            <div className="font-bold text-white">{currentFarmer.cropStageName}</div>
            <div className="text-[11px] text-emerald-300">{currentFarmer.soilType.replace('_', ' ')}</div>
          </div>
        </div>
      </div>

      {/* Acreage Adjuster Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="font-black text-slate-900 text-xs sm:text-sm">Compute for Target Landholding</h3>
          <p className="text-[11px] sm:text-xs text-slate-500">Adjust the acreage slider to calculate bag requirement</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0.5"
            max="25"
            step="0.5"
            value={targetAcreage}
            onChange={(e) => setTargetAcreage(Number(e.target.value))}
            className="w-36 sm:w-44 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <span className="font-mono font-bold text-xs sm:text-sm bg-emerald-50 text-emerald-900 px-3 py-1 rounded-xl border border-emerald-200 whitespace-nowrap">
            {targetAcreage} {t.acreage}
          </span>
        </div>
      </div>

      {/* Fertilizer Bags Requirement Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        
        {/* Urea */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400">Nitrogen (N)</span>
            <span className="text-xs font-mono font-bold bg-blue-50 text-blue-800 px-2 py-0.5 rounded">46% N</span>
          </div>
          <h3 className="font-black text-base sm:text-lg text-slate-900">Urea Fertilizer</h3>
          <div className="text-xl sm:text-2xl font-black text-blue-700 font-mono">
            {metrics.ureaBags50kg} <span className="text-xs font-bold text-slate-500">Bags (50kg)</span>
          </div>
          <div className="text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed">
            Split into 3 doses: Basal (30%), Vegetative (40%), Flowering (30%).
          </div>
        </div>

        {/* DAP */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400">Phosphorus (P)</span>
            <span className="text-xs font-mono font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded">18:46:0</span>
          </div>
          <h3 className="font-black text-base sm:text-lg text-slate-900">DAP (Di-Ammonium)</h3>
          <div className="text-xl sm:text-2xl font-black text-amber-700 font-mono">
            {metrics.dapBags50kg} <span className="text-xs font-bold text-slate-500">Bags (50kg)</span>
          </div>
          <div className="text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed">
            Apply 100% at basal sowing stage placed 5cm below the seed.
          </div>
        </div>

        {/* MOP */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400">Potassium (K)</span>
            <span className="text-xs font-mono font-bold bg-purple-50 text-purple-800 px-2 py-0.5 rounded">60% K2O</span>
          </div>
          <h3 className="font-black text-base sm:text-lg text-slate-900">MOP (Potash)</h3>
          <div className="text-xl sm:text-2xl font-black text-purple-700 font-mono">
            {metrics.mopBags50kg} <span className="text-xs font-bold text-slate-500">Bags (50kg)</span>
          </div>
          <div className="text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed">
            Improves drought resilience, fiber strength, and disease tolerance.
          </div>
        </div>

      </div>

      {/* Organic Bio Alternative Card */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-emerald-50 border border-emerald-200 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-emerald-900 font-black text-xs sm:text-sm">
          <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
          <span>PKVY Approved Bio-Organic Alternative Formulation:</span>
        </div>
        <p className="text-xs sm:text-sm text-emerald-950 font-semibold leading-relaxed">
          {metrics.bioAlternative}
        </p>
        <div className="text-[10px] sm:text-[11px] text-emerald-800 font-medium pt-1">
          💡 Eligible for 100% organic subsidy assistance under Paramparagat Krishi Vikas Yojana (PKVY).
        </div>
      </div>

    </div>
  );
};
