import React from 'react';
import { FarmerProfile, Language, CropYieldAnalytics } from '../types';
import { translations } from '../data/translations';
import { 
  BarChart3, 
  TrendingUp, 
  Sprout, 
  Store
} from 'lucide-react';

interface CropProductionTrackerProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
}

export const CropProductionTracker: React.FC<CropProductionTrackerProps> = ({
  currentFarmer,
  currentLanguage
}) => {
  const t = translations[currentLanguage] || translations.en;

  const getYieldData = (): CropYieldAnalytics => {
    switch (currentFarmer.crop) {
      case 'cotton':
        return {
          cropName: currentFarmer.cropNameEn,
          variety: currentFarmer.variety,
          totalAcreage: currentFarmer.totalAcreage,
          sowingDate: currentFarmer.sowingDate,
          growthDaysElapsed: currentFarmer.cropDays,
          totalGrowthCycleDays: 160,
          growthCompletionPercent: Math.round((currentFarmer.cropDays / 160) * 100),
          currentBiomassHealthNDVI: 0.81,
          projectedYieldQuintals: Math.round(currentFarmer.totalAcreage * 8.8),
          projectedYieldPerAcre: 8.8,
          districtAverageYieldPerAcre: 6.9,
          stateAverageYieldPerAcre: 7.2,
          yieldPerformanceRatio: 1.28,
          historicalHarvests: [
            { year: '2025-26', season: 'Kharif', yieldQuintals: 26.5, revenueRupees: 185500, priceRealizedPerQtl: 7000 }
          ],
          inventoryDistribution: {
            soldTonnes: 1.8,
            storedWarehouseTonnes: 0.8,
            retainedForSeedTonnes: 0.05
          }
        };
      case 'rice':
        return {
          cropName: currentFarmer.cropNameEn,
          variety: currentFarmer.variety,
          totalAcreage: currentFarmer.totalAcreage,
          sowingDate: currentFarmer.sowingDate,
          growthDaysElapsed: currentFarmer.cropDays,
          totalGrowthCycleDays: 135,
          growthCompletionPercent: Math.round((currentFarmer.cropDays / 135) * 100),
          currentBiomassHealthNDVI: 0.86,
          projectedYieldQuintals: Math.round(currentFarmer.totalAcreage * 24.5),
          projectedYieldPerAcre: 24.5,
          districtAverageYieldPerAcre: 21.0,
          stateAverageYieldPerAcre: 22.4,
          yieldPerformanceRatio: 1.17,
          historicalHarvests: [
            { year: '2025-26', season: 'Kharif', yieldQuintals: 118.0, revenueRupees: 271400, priceRealizedPerQtl: 2300 }
          ],
          inventoryDistribution: {
            soldTonnes: 9.5,
            storedWarehouseTonnes: 2.0,
            retainedForSeedTonnes: 0.3
          }
        };
      case 'wheat':
        return {
          cropName: currentFarmer.cropNameEn,
          variety: currentFarmer.variety,
          totalAcreage: currentFarmer.totalAcreage,
          sowingDate: currentFarmer.sowingDate,
          growthDaysElapsed: currentFarmer.cropDays,
          totalGrowthCycleDays: 140,
          growthCompletionPercent: Math.round((currentFarmer.cropDays / 140) * 100),
          currentBiomassHealthNDVI: 0.84,
          projectedYieldQuintals: Math.round(currentFarmer.totalAcreage * 22.0),
          projectedYieldPerAcre: 22.0,
          districtAverageYieldPerAcre: 19.5,
          stateAverageYieldPerAcre: 20.2,
          yieldPerformanceRatio: 1.13,
          historicalHarvests: [
            { year: '2025-26', season: 'Rabi', yieldQuintals: 182.0, revenueRupees: 450450, priceRealizedPerQtl: 2475 }
          ],
          inventoryDistribution: {
            soldTonnes: 14.0,
            storedWarehouseTonnes: 3.5,
            retainedForSeedTonnes: 0.7
          }
        };
      default:
        return {
          cropName: currentFarmer.cropNameEn,
          variety: currentFarmer.variety,
          totalAcreage: currentFarmer.totalAcreage,
          sowingDate: currentFarmer.sowingDate,
          growthDaysElapsed: currentFarmer.cropDays,
          totalGrowthCycleDays: 110,
          growthCompletionPercent: Math.round((currentFarmer.cropDays / 110) * 100),
          currentBiomassHealthNDVI: 0.82,
          projectedYieldQuintals: Math.round(currentFarmer.totalAcreage * 80.0),
          projectedYieldPerAcre: 80.0,
          districtAverageYieldPerAcre: 68.0,
          stateAverageYieldPerAcre: 72.0,
          yieldPerformanceRatio: 1.18,
          historicalHarvests: [
            { year: '2025-26', season: 'Kharif', yieldQuintals: 155.0, revenueRupees: 496000, priceRealizedPerQtl: 3200 }
          ],
          inventoryDistribution: {
            soldTonnes: 12.0,
            storedWarehouseTonnes: 3.0,
            retainedForSeedTonnes: 0.5
          }
        };
    }
  };

  const yieldData = getYieldData();

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-green-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5">
              <BarChart3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {t.cropProduction}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight break-words">
              {t.cropProduction}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium mt-1">
              {t.cropProductionDesc}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-emerald-500/30 text-xs text-emerald-200 flex-shrink-0 self-start md:self-auto">
            <div className="font-bold text-white">{currentFarmer.sowingDate} ({currentFarmer.cropDays} {t.days})</div>
            <div className="text-[11px] text-emerald-300">{currentFarmer.cropStageName}</div>
          </div>
        </div>
      </div>

      {/* Production Analytics 4 Top Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        {/* Growth Completion */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.growthProgress}</span>
          <div className="text-lg sm:text-2xl font-black text-slate-900 font-mono">
            {yieldData.growthCompletionPercent}% <span className="text-[10px] sm:text-xs text-slate-500 font-normal">{t.completed}</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${yieldData.growthCompletionPercent}%` }} />
          </div>
          <div className="text-[10px] text-slate-500 font-medium">{t.days} {yieldData.growthDaysElapsed} / {yieldData.totalGrowthCycleDays}</div>
        </div>

        {/* Projected Total Yield */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.projectedYield}</span>
          <div className="text-lg sm:text-2xl font-black text-emerald-700 font-mono">
            ~{yieldData.projectedYieldQuintals} <span className="text-[10px] sm:text-xs text-slate-500 font-normal">{t.quintal}</span>
          </div>
          <div className="text-[10px] sm:text-[11px] text-emerald-600 font-bold">~{(yieldData.projectedYieldQuintals * 0.1).toFixed(1)} {t.tonnes}</div>
        </div>

        {/* Yield Per Acre vs District */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.aboveDistrictAvg}</span>
          <div className="text-lg sm:text-2xl font-black text-indigo-700 font-mono flex items-center gap-0.5">
            <TrendingUp className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            +{Math.round((yieldData.yieldPerformanceRatio - 1) * 100)}%
          </div>
          <div className="text-[10px] text-slate-500">
            {yieldData.projectedYieldPerAcre} Q/ac
          </div>
        </div>

        {/* Estimated Gross Revenue */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">{t.estimatedValue}</span>
          <div className="text-lg sm:text-2xl font-black text-slate-900 font-mono truncate">
            ₹{(yieldData.projectedYieldQuintals * 7450).toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-700 font-bold truncate">{t.mandiRates}</div>
        </div>

      </div>

      {/* Growth Timeline & Inventory Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Growth Cycle Stages (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-md space-y-3 sm:space-y-4">
          <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{t.growthProgress}</span>
          </h3>

          <div className="space-y-2 pt-1">
            {[
              { stage: 'Germination & Sowing', days: '0 - 15 Days', status: 'completed' },
              { stage: 'Vegetative Canopy', days: '15 - 45 Days', status: 'completed' },
              { stage: 'Flowering & Square', days: '45 - 80 Days', status: 'in_progress' },
              { stage: 'Fruit / Boll Filling', days: '80 - 120 Days', status: 'upcoming' },
              { stage: 'Maturity & Harvest', days: '120 - 160 Days', status: 'upcoming' }
            ].map((step, sIdx) => (
              <div
                key={sIdx}
                className={`p-3 rounded-xl sm:rounded-2xl border flex items-center justify-between text-xs ${
                  step.status === 'completed' ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950 font-bold' :
                  step.status === 'in_progress' ? 'bg-amber-50 border-amber-300 text-amber-950 font-black ring-1 ring-amber-400' :
                  'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm sm:text-base flex-shrink-0">
                    {step.status === 'completed' ? '✓' : step.status === 'in_progress' ? '⏳' : '⚪'}
                  </span>
                  <div className="min-w-0">
                    <div className="truncate">{step.stage}</div>
                    <div className="text-[10px] font-mono text-slate-500 font-normal">{step.days}</div>
                  </div>
                </div>

                <span className={`text-[9px] sm:text-[10px] uppercase font-mono px-2 py-0.5 rounded flex-shrink-0 ${
                  step.status === 'completed' ? 'bg-emerald-200/60 text-emerald-900' :
                  step.status === 'in_progress' ? 'bg-amber-200 text-amber-900' :
                  'bg-slate-200 text-slate-600'
                }`}>
                  {step.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Harvest Inventory Ledger (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-md space-y-3 sm:space-y-4">
          <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Store className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>{t.harvestLedger}</span>
          </h3>

          <div className="space-y-2.5 pt-1 text-xs">
            
            <div className="p-3 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-900 block">{t.soldMandi}</span>
                <span className="text-[10px] text-slate-500">APMC e-NAM</span>
              </div>
              <span className="font-black text-xs sm:text-sm text-emerald-700 font-mono">
                {yieldData.inventoryDistribution.soldTonnes} {t.tonnes}
              </span>
            </div>

            <div className="p-3 rounded-xl sm:rounded-2xl bg-indigo-50 border border-indigo-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-indigo-950 block">{t.storedWarehouse}</span>
                <span className="text-[10px] text-indigo-700">{t.storedWarehouse}</span>
              </div>
              <span className="font-black text-xs sm:text-sm text-indigo-900 font-mono">
                {yieldData.inventoryDistribution.storedWarehouseTonnes} {t.tonnes}
              </span>
            </div>

            <div className="p-3 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-200 flex justify-between items-center">
              <div>
                <span className="font-bold text-amber-950 block">{t.retainedSeed}</span>
                <span className="text-[10px] text-amber-700">{t.certifiedSeeds}</span>
              </div>
              <span className="font-black text-xs sm:text-sm text-amber-900 font-mono">
                {yieldData.inventoryDistribution.retainedForSeedTonnes} {t.tonnes}
              </span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
