import React, { useState } from 'react';
import { FarmerProfile, Language, MandiItem } from '../types';
import { translations } from '../data/translations';
import { mandiRatesDatabase } from '../data/mandiData';
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  Store, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownRight, 
  HelpCircle, 
  CheckCircle2, 
  Clock,
  Filter
} from 'lucide-react';

interface MandiForecasterProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
}

export const MandiForecaster: React.FC<MandiForecasterProps> = ({
  currentFarmer,
  currentLanguage
}) => {
  const t = translations[currentLanguage];
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('ALL');

  const filteredMandiItems = mandiRatesDatabase.filter(item => 
    selectedCropFilter === 'ALL' || item.crop === selectedCropFilter
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-yellow-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              e-NAM & APMC Market Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.mandiRates}
            </h1>
            <p className="text-sm text-amber-200/90 font-medium max-w-2xl mt-1">
              {t.mandiRatesDesc} Live mandi rates with AI price forecasts and net storage gain calculations.
            </p>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-2xl border border-amber-500/30 text-xs text-amber-200 flex items-center gap-3">
            <span className="text-2xl">📈</span>
            <div>
              <div className="font-bold text-white">Market Focus: {currentFarmer.district} APMC</div>
              <div className="text-[11px] text-amber-300">Crop: {currentFarmer.cropNameEn}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: 'All Commodities' },
          { id: 'cotton', label: 'Cotton' },
          { id: 'rice', label: 'Paddy / Rice' },
          { id: 'wheat', label: 'Wheat' },
          { id: 'tomato', label: 'Tomato' },
          { id: 'soybean', label: 'Soybean' },
          { id: 'chilli', label: 'Chilli' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedCropFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
              selectedCropFilter === tab.id
                ? 'bg-amber-800 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mandi Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMandiItems.map((item, idx) => {
          const isFarmerCrop = item.crop === currentFarmer.crop;
          const isProfitableToStore = item.aiRecommendation === 'HOLD_AND_STORE';

          return (
            <div
              key={idx}
              className={`bg-white rounded-3xl border p-6 space-y-4 shadow-md transition-all ${
                isFarmerCrop ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  {isFarmerCrop && (
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300 mb-1 inline-block">
                      ⭐ Your Sown Crop
                    </span>
                  )}
                  <h3 className="font-black text-lg text-slate-900">
                    {item.commodityName}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">
                    {item.variety} • 📍 {item.marketName}, {item.state}
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase ${
                  item.aiRecommendation === 'SELL_NOW' ? 'bg-emerald-100 text-emerald-800' :
                  item.aiRecommendation === 'HOLD_AND_STORE' ? 'bg-indigo-100 text-indigo-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {item.aiRecommendation.replace('_', ' ')}
                </span>
              </div>

              {/* Price Numbers & Trends */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Modal Price</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    ₹{item.currentModalPrice.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">/qtl</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Govt MSP</div>
                  <div className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                    ₹{item.mspPrice.toLocaleString()} <span className="text-[10px] font-normal text-slate-500">/qtl</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400">7-Day Trend</div>
                  <div className={`text-sm sm:text-base font-black mt-0.5 flex items-center ${
                    item.priceChange7Days >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {item.priceChange7Days >= 0 ? <ArrowUpRight className="w-4 h-4 mr-0.5" /> : <ArrowDownRight className="w-4 h-4 mr-0.5" />}
                    {item.priceChange7Days >= 0 ? `+${item.priceChange7Days}%` : `${item.priceChange7Days}%`}
                  </div>
                </div>
              </div>

              {/* AI Strategic Advisory & Storage Calculation */}
              <div className={`p-4 rounded-2xl border space-y-1.5 ${
                isProfitableToStore ? 'bg-indigo-50/70 border-indigo-200' : 'bg-emerald-50/70 border-emerald-200'
              }`}>
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>AI "Sell vs Store" Strategic Advisory:</span>
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {item.aiReasoning}
                </p>
                <div className="text-[10px] font-bold text-slate-500 pt-1 flex justify-between">
                  <span>Warehouse Storage Cost: ~₹{item.storageCostEstimatePerMonth}/qtl/month</span>
                  <span className="text-emerald-700">Projected 14d Price: ₹{item.forecastPriceNextWeek}/qtl</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
