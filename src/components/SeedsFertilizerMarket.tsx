import React, { useState } from 'react';
import { FarmerProfile, Language, SeedFertilizerItem } from '../types';
import { translations } from '../data/translations';
import { seedsAndFertilizerInventory } from '../data/storesAndMandiData';
import { 
  Sprout, 
  Store, 
  MapPin, 
  PhoneCall, 
  CheckCircle2, 
  IndianRupee, 
  ShieldCheck, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SeedsFertilizerMarketProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
}

export const SeedsFertilizerMarket: React.FC<SeedsFertilizerMarketProps> = ({
  currentFarmer,
  currentLanguage
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [activeSubTab, setActiveSubTab] = useState<'fertilizer' | 'seed' | 'pesticide'>('fertilizer');
  const [reservedItemId, setReservedItemId] = useState<string | null>(null);

  const handleReserveStock = (itemId: string) => {
    setReservedItemId(itemId);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => setReservedItemId(null), 3500);
  };

  const filteredItems = seedsAndFertilizerInventory.filter(item => item.type === activeSubTab);

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-green-950 via-emerald-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-green-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-400/30 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {t.seedsFertilizer}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {t.seedsFertilizer}
            </h1>
            <p className="text-xs sm:text-sm text-green-200/90 font-medium max-w-2xl mt-1">
              {t.seedsFertilizerDesc}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-green-500/30 text-xs text-green-200 self-start md:self-auto">
            <div className="font-bold text-white">{currentFarmer.district}</div>
            <div className="text-[11px] text-green-300">Govt DBT Subsidy Active</div>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm max-w-md">
        {[
          { id: 'fertilizer', label: t.subsidizedKhad },
          { id: 'seed', label: t.certifiedSeeds },
          { id: 'pesticide', label: '🌿 Bio Inputs' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-black transition-all truncate ${
              activeSubTab === tab.id
                ? 'bg-emerald-900 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 space-y-3 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 truncate max-w-[180px]">
                  {item.brandOrGovt}
                </span>
                <span className="text-[10px] font-bold text-slate-500 flex-shrink-0">{item.unit}</span>
              </div>

              <h3 className="font-black text-base text-slate-900">{item.name}</h3>

              {/* Subsidized Price Display */}
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">Farmer Price:</span>
                  <span className="text-lg font-black text-emerald-800 font-mono">₹{item.subsidizedPriceRupees.toFixed(2)}</span>
                </div>
                {item.mrpRupees && (
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span>Non-Subsidized MRP:</span>
                    <span className="line-through">₹{item.mrpRupees}</span>
                  </div>
                )}
                {item.subsidyPercentage && (
                  <div className="text-[10px] font-black text-emerald-700">
                    ✨ Govt Subsidy: {item.subsidyPercentage}%
                  </div>
                )}
              </div>

              {/* Dealer info */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-0.5">
                <div className="font-bold text-slate-900 truncate">🏪 {item.dealerName} ({item.dealerDistanceKm} km)</div>
                <div className="text-[10px] text-slate-500 truncate">📍 {item.dealerLocation}</div>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <a
                href={`tel:${item.dealerPhone}`}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center flex-shrink-0"
                title={t.callMandi}
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              </a>

              <button
                onClick={() => handleReserveStock(item.id)}
                className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow active:scale-95 truncate ${
                  reservedItemId === item.id 
                    ? 'bg-emerald-600 text-white animate-bounce' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{reservedItemId === item.id ? t.tokenReserved : t.reserveToken}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
