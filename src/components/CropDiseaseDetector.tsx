import React, { useState } from 'react';
import { FarmerProfile, Language, DiseaseRecord } from '../types';
import { translations } from '../data/translations';
import { cropDiseasesDatabase, getDynamicWeatherAdvice } from '../data/diseasesData';
import { speakVernacularText, stopSpeech } from '../utils/audioSpeech';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  FlaskConical, 
  Sprout, 
  Volume2, 
  VolumeX
} from 'lucide-react';

interface CropDiseaseDetectorProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
}

export const CropDiseaseDetector: React.FC<CropDiseaseDetectorProps> = ({
  currentFarmer,
  currentLanguage
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [selectedDisease, setSelectedDisease] = useState<DiseaseRecord>(cropDiseasesDatabase[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const dynamicWeatherAdvice = getDynamicWeatherAdvice(selectedDisease, currentFarmer.weather);

  const handleSelectSample = (disease: DiseaseRecord) => {
    setIsScanning(true);
    setCustomImage(null);
    setTimeout(() => {
      setSelectedDisease(disease);
      setIsScanning(false);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomImage(event.target?.result as string);
        setIsScanning(true);
        const matched = cropDiseasesDatabase.find(d => d.crop === currentFarmer.crop) || cropDiseasesDatabase[0];
        setTimeout(() => {
          setSelectedDisease(matched);
          setIsScanning(false);
        }, 900);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpeakDiagnosis = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `${selectedDisease.name}. ${dynamicWeatherAdvice.sprayingWindowRecommendation}. ${selectedDisease.chemicalTreatment.dosage}`;
    setIsSpeaking(true);
    speakVernacularText(
      textToSpeak, 
      currentLanguage, 
      () => setIsSpeaking(true), 
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-green-950 to-teal-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-emerald-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] sm:text-xs font-black uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {t.cropDiseaseAi}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {t.cropDiseaseAi}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 font-medium max-w-2xl mt-1">
              {t.cropDiseaseDesc}
            </p>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-2xl border border-emerald-500/30 text-xs text-emerald-200 self-start md:self-auto">
            <div className="font-bold text-white">{currentFarmer.cropNameEn}</div>
            <div className="text-[11px] text-emerald-300">{currentFarmer.weather.condition}</div>
          </div>
        </div>
      </div>

      {/* Main Diagnostic Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        {/* Left Column: Image Upload / Samples (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-md space-y-4 text-center">
            
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border-2 border-dashed border-emerald-400/50 flex flex-col items-center justify-center group">
              {customImage || selectedDisease.imageUrl ? (
                <img
                  src={customImage || selectedDisease.imageUrl}
                  alt="Crop Leaf Analysis"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-slate-400 space-y-2">
                  <Camera className="w-10 h-10 mx-auto text-emerald-500" />
                  <p className="text-xs font-semibold">{t.uploadLeafPhoto}</p>
                </div>
              )}

              {isScanning && (
                <div className="absolute inset-0 bg-emerald-950/80 flex flex-col items-center justify-center backdrop-blur-sm z-20">
                  <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="text-xs font-black text-white animate-pulse">
                    {t.analyzingImage}
                  </span>
                </div>
              )}

              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-xs font-bold gap-2">
                <Upload className="w-4 h-4" />
                {t.uploadLeafPhoto}
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <label className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black cursor-pointer transition-all shadow-md active:scale-95">
              <Camera className="w-4 h-4" />
              <span>{t.takePhoto}</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Quick Sample Selector */}
            <div className="pt-3 border-t border-slate-100 text-left space-y-2">
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
                {t.orSelectSample}:
              </div>
              <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                {cropDiseasesDatabase.map((disease) => (
                  <button
                    key={disease.id}
                    onClick={() => handleSelectSample(disease)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all ${
                      selectedDisease.id === disease.id
                        ? 'bg-emerald-100 text-emerald-950 font-bold border border-emerald-400 shadow-sm'
                        : 'hover:bg-slate-100 text-slate-700 border border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-sm flex-shrink-0">🍃</span>
                      <span className="truncate">{disease.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 bg-white px-1.5 py-0.5 rounded border flex-shrink-0">
                      {disease.crop}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Diagnosis & Weather-Linked Spray Window (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-md space-y-3 sm:space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {t.cropDiseaseAi}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {selectedDisease.name}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSpeakDiagnosis}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                    isSpeaking ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isSpeaking ? 'Stop' : '🔊 Listen'}</span>
                </button>
              </div>
            </div>

            {/* Weather-Linked Spray Window Box */}
            <div className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border shadow-md space-y-2 ${
              !dynamicWeatherAdvice.isSprayingRecommendedNow
                ? 'bg-red-50 border-red-300 text-red-950'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {!dynamicWeatherAdvice.isSprayingRecommendedNow ? (
                    <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0" />
                  )}
                  <strong className="text-xs sm:text-sm font-black">
                    {!dynamicWeatherAdvice.isSprayingRecommendedNow ? t.doNotSpray : t.safeToSpray}
                  </strong>
                </div>
              </div>

              <p className="text-xs sm:text-sm font-bold leading-relaxed">
                {dynamicWeatherAdvice.sprayingWindowRecommendation}
              </p>
            </div>

            {/* Simple Treatment Dosages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              
              {/* Chemical Spray */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                  <FlaskConical className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>{t.chemicalTreatment}:</span>
                </div>
                <div className="text-sm font-black text-slate-900">
                  {selectedDisease.chemicalTreatment.name}
                </div>
                <div className="text-xs text-slate-700 font-bold bg-white p-2 rounded-xl border">
                  🎯 {t.dosage}: {selectedDisease.chemicalTreatment.dosage}
                </div>
              </div>

              {/* Organic Treatment */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900">
                  <Sprout className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{t.organicTreatment}:</span>
                </div>
                <div className="text-sm font-black text-emerald-950">
                  {selectedDisease.organicTreatment.name}
                </div>
                <div className="text-xs text-emerald-900 font-bold bg-white p-2 rounded-xl border">
                  🌿 {t.dosage}: {selectedDisease.organicTreatment.dosage}
                </div>
              </div>

            </div>

            {/* Immediate Action Steps */}
            <div className="space-y-1.5 pt-1">
              <h4 className="text-xs font-black uppercase text-slate-900">
                {t.immediateAction}:
              </h4>
              <ul className="space-y-1 text-xs text-slate-800 font-medium pl-5 list-disc">
                {selectedDisease.immediateActions.map((act, aIdx) => (
                  <li key={aIdx} className="leading-relaxed">{act}</li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
