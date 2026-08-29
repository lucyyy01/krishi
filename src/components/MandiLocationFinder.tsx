import React, { useState } from 'react';
import { FarmerProfile, Language, MandiLocationItem } from '../types';
import { translations } from '../data/translations';
import { nearbyMandisList } from '../data/storesAndMandiData';
import { 
  Store, 
  MapPin, 
  PhoneCall, 
  TrendingUp, 
  Navigation, 
  Clock, 
  Search,
  Sparkles
} from 'lucide-react';

interface MandiLocationFinderProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
}

export const MandiLocationFinder: React.FC<MandiLocationFinderProps> = ({
  currentFarmer,
  currentLanguage
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [selectedCrop, setSelectedCrop] = useState<string>(currentFarmer.crop);
  const [searchDistrict, setSearchDistrict] = useState<string>('');

  const mandis = nearbyMandisList.filter(m => {
    const matchesCrop = selectedCrop === 'ALL' || m.commodities.some(c => c.crop === selectedCrop);
    const matchesSearch = searchDistrict === '' || 
      m.name.toLowerCase().includes(searchDistrict.toLowerCase()) ||
      m.district.toLowerCase().includes(searchDistrict.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {t.mandiLocator}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {t.mandiLocator}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium max-w-2xl mt-1">
              {t.mandiLocatorDesc}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-emerald-500/30 text-xs text-emerald-200 self-start md:self-auto">
            <div className="font-bold text-white">📍 {currentFarmer.village}</div>
            <div className="text-[11px] text-emerald-300">{currentFarmer.district} ({currentFarmer.state})</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: t.allCrops },
            { id: 'cotton', label: 'Cotton' },
            { id: 'rice', label: 'Paddy / Rice' },
            { id: 'wheat', label: 'Wheat' },
            { id: 'tomato', label: 'Tomato' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCrop(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                selectedCrop === tab.id
                  ? 'bg-emerald-900 text-white shadow-sm'
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
            value={searchDistrict}
            onChange={(e) => setSearchDistrict(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-semibold"
          />
        </div>
      </div>

      {/* Mandi Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {mandis.map((mandi) => (
          <div
            key={mandi.id}
            className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 space-y-3 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-[11px] font-black text-emerald-700 uppercase">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{mandi.distanceKm} km • ~{mandi.travelTimeMinutes} min</span>
                  </div>
                  <h3 className="font-black text-base text-slate-900 mt-0.5 truncate">
                    {mandi.name}
                  </h3>
                  <div className="text-[11px] text-slate-500 truncate">
                    {mandi.district}, {mandi.state}
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 bg-emerald-100 text-emerald-800 border border-emerald-300">
                  APMC
                </span>
              </div>

              {/* Price Boards */}
              <div className="space-y-1.5 mt-3">
                <div className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                  {t.mandiRates} (₹/Qtl):
                </div>
                {mandi.commodities.map((rate, rIdx) => (
                  <div
                    key={rIdx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block truncate">{rate.commodityName}</span>
                      <span className="text-[10px] text-slate-500">Arrival: {mandi.dailyArrivalTonnes} {t.tonnes}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="font-black text-sm text-emerald-700 font-mono block">
                        ₹{rate.modalPrice}
                      </span>
                      <span className="text-[9px] text-slate-500">
                        ₹{rate.minPrice} - ₹{rate.maxPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center gap-2 border-t border-slate-100 text-xs">
              <a
                href={`tel:${mandi.contactNumber}`}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-1.5 transition-all truncate"
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>{t.callMandi}</span>
              </a>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mandi.name + ' ' + mandi.district)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm truncate"
              >
                <Navigation className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{t.getDirections}</span>
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
