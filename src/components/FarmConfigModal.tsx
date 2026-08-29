import React, { useState } from 'react';
import { FarmerProfile, Language, CropType, SoilType, IrrigationType, FarmerCategory } from '../types';
import { 
  X, 
  Save, 
  Sparkles, 
  MapPin, 
  Layers, 
  Droplet, 
  Tractor, 
  CheckCircle2 
} from 'lucide-react';

interface FarmConfigModalProps {
  currentFarmer: FarmerProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (updatedProfile: FarmerProfile) => void;
}

export const FarmConfigModal: React.FC<FarmConfigModalProps> = ({
  currentFarmer,
  isOpen,
  onClose,
  onSaveProfile
}) => {
  const [formData, setFormData] = useState<FarmerProfile>({ ...currentFarmer });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950 to-slate-900 text-white border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">
                Customize Farm & Farmer Profile
              </h3>
              <p className="text-xs text-emerald-200/80 font-medium">
                Live updates will re-evaluate Action Plans, Schemes & Simulations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Farmer Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Farmer Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-semibold"
                required
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
              <select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-semibold"
              >
                <option value="Maharashtra">Maharashtra</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Punjab">Punjab</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Telangana">Telangana</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">District / Region</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-semibold"
              />
            </div>

            {/* Total Acreage */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Farm Area (Acres)</label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="50"
                value={formData.totalAcreage}
                onChange={(e) => setFormData({ ...formData, totalAcreage: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-semibold"
                required
              />
            </div>

            {/* Crop Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Sown Crop</label>
              <select
                value={formData.crop}
                onChange={(e) => {
                  const val = e.target.value as CropType;
                  setFormData({ 
                    ...formData, 
                    crop: val,
                    cropNameEn: val === 'cotton' ? 'Bt Cotton Hybrid' :
                                val === 'rice' ? 'Paddy Rice' :
                                val === 'wheat' ? 'Wheat (High Yield)' :
                                val === 'tomato' ? 'Tomato Hybrid' : val
                  });
                }}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-semibold"
              >
                <option value="cotton">Cotton (Bt Cotton)</option>
                <option value="rice">Rice / Paddy</option>
                <option value="wheat">Wheat</option>
                <option value="tomato">Tomato</option>
                <option value="soybean">Soybean</option>
                <option value="chilli">Chilli</option>
              </select>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Soil Type</label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value as SoilType })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-semibold"
              >
                <option value="black_cotton">Black Cotton Soil</option>
                <option value="alluvial">Alluvial Loam</option>
                <option value="red_loamy">Red Loamy Soil</option>
                <option value="sandy_loam">Sandy Loam</option>
                <option value="clay_loam">Clay Loam</option>
              </select>
            </div>

            {/* Irrigation Setup */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Irrigation System</label>
              <select
                value={formData.irrigationType}
                onChange={(e) => setFormData({ ...formData, irrigationType: e.target.value as IrrigationType })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-semibold"
              >
                <option value="drip">Drip Irrigation System</option>
                <option value="sprinkler">Sprinkler Irrigation</option>
                <option value="borewell_canal">Borewell / Canal Furrow</option>
                <option value="flood_furrow">Flood Irrigation</option>
                <option value="rainfed">Purely Rainfed</option>
              </select>
            </div>

            {/* Farmer Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Farmer Category</label>
              <select
                value={formData.farmerCategory}
                onChange={(e) => setFormData({ ...formData, farmerCategory: e.target.value as FarmerCategory })}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 font-semibold"
              >
                <option value="marginal_small">Small & Marginal (&lt; 5 Acres)</option>
                <option value="medium">Medium Farmer (5-10 Acres)</option>
                <option value="large">Large Farmer (&gt; 10 Acres)</option>
                <option value="women_sc_st">Women / SC / ST Farmer</option>
                <option value="fpo_member">FPO Member</option>
              </select>
            </div>

          </div>

          {/* Taxpayer Status Toggle for Scheme Disqualification demonstration */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-slate-900 block">Income Tax Payer Status</span>
              <span className="text-[11px] text-slate-500">
                Taxpayers are excluded from PM-KISAN by law (Demonstrates "Why Not Eligible").
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.isTaxPayer}
              onChange={(e) => setFormData({ ...formData, isTaxPayer: e.target.checked })}
              className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              Save & Recompute Everything
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
