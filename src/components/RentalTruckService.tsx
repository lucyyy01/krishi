import React, { useState } from 'react';
import { FarmerProfile, Language, RentalTruckVehicle } from '../types';
import { translations } from '../data/translations';
import { sampleRentalTrucks } from '../data/logisticsAndLabourData';
import { 
  Truck, 
  MapPin, 
  PhoneCall, 
  Star, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Navigation,
  Clock,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RentalTruckServiceProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
}

export const RentalTruckService: React.FC<RentalTruckServiceProps> = ({
  currentFarmer,
  currentLanguage
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [trucks, setTrucks] = useState<RentalTruckVehicle[]>(sampleRentalTrucks);
  const [bookedTruckId, setBookedTruckId] = useState<string | null>(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('ALL');
  const [destinationMandi, setDestinationMandi] = useState('Ghatanji APMC (12 km)');

  const handleBookTruck = (truckId: string) => {
    setBookedTruckId(truckId);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      setTrucks(prev => prev.map(tr => {
        if (tr.id === truckId) {
          return { ...tr, availability: 'booked_today' };
        }
        return tr;
      }));
      setBookedTruckId(null);
    }, 2500);
  };

  const filteredTrucks = trucks.filter(tr => {
    if (selectedVehicleType === 'ALL') return true;
    return tr.vehicleType.includes(selectedVehicleType);
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-teal-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5">
              <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {t.rentalTrucks}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {t.rentalTrucks}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium max-w-2xl mt-1">
              {t.rentalTrucksDesc}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-emerald-500/30 text-xs text-emerald-200 self-start md:self-auto">
            <div className="font-bold text-white">📍 Pickup: {currentFarmer.village} Field</div>
            <div className="text-[11px] text-emerald-300">Live GPS Transport Hub</div>
          </div>
        </div>
      </div>

      {/* Quick Booking Estimator & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Vehicles' },
            { id: 'Tata Ace', label: 'Mini Pickup (1.5-2T)' },
            { id: 'Tractor', label: 'Tractor Trolley (4.5T)' },
            { id: 'Eicher', label: 'Medium Eicher (7.5T)' },
            { id: 'Heavy', label: 'Heavy Multi-Axle (12T)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedVehicleType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                selectedVehicleType === tab.id
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Drop:</span>
          <select
            value={destinationMandi}
            onChange={(e) => setDestinationMandi(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
          >
            <option value="Ghatanji APMC (12 km)">Ghatanji APMC (12 km)</option>
            <option value="Yavatmal Main Market (32 km)">Yavatmal Main Market (32 km)</option>
            <option value="Central Warehouse / CWC (18 km)">Central Warehouse (18 km)</option>
          </select>
        </div>
      </div>

      {/* Trucks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredTrucks.map((truck) => {
          const isBooked = truck.availability === 'booked_today' || bookedTruckId === truck.id;

          return (
            <div
              key={truck.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-5 space-y-3 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                {/* Driver Top Row */}
                <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className="font-black text-base text-slate-900 truncate">{truck.driverName}</h3>
                      <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{truck.currentLocation} ({truck.distanceKm} km away)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-xs font-black text-amber-900 flex-shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{truck.driverRating}</span>
                  </div>
                </div>

                {/* Vehicle Details */}
                <div className="space-y-2 mt-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{truck.vehicleType}</span>
                      <span className="font-mono text-emerald-700 font-black">{truck.capacityTonnes} Tonnes</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Plate: {truck.vehicleNumber}
                    </div>
                  </div>

                  {/* Estimated Cost */}
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-600 block">Est. Trip Rate:</span>
                      <span className="text-sm font-black text-emerald-900 font-mono">₹{truck.baseFareRupees + truck.ratePerKmRupees * 15}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border">
                      ₹{truck.ratePerKmRupees}/km + Base ₹{truck.baseFareRupees}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] font-black uppercase text-slate-400">Included:</span>
                    <div className="flex flex-wrap gap-1">
                      {truck.features.map((feat, fIdx) => (
                        <span key={fIdx} className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded-md text-slate-700">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center gap-2 border-t border-slate-100">
                <a
                  href={`tel:${truck.driverPhone}`}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center flex-shrink-0"
                  title="Call Driver"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                </a>

                <button
                  onClick={() => handleBookTruck(truck.id)}
                  disabled={isBooked}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow active:scale-95 ${
                    isBooked
                      ? 'bg-slate-100 text-emerald-800 border border-emerald-300 cursor-default'
                      : bookedTruckId === truck.id
                      ? 'bg-emerald-600 text-white animate-pulse'
                      : 'bg-emerald-800 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>{isBooked ? t.truckBooked : bookedTruckId === truck.id ? 'Dispatching...' : t.bookTruck}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
