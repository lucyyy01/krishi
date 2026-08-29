import React, { useState } from 'react';
import { 
  FarmerProfile, 
  Language, 
  ProactiveAlert,
  DailyAction,
  AuthUser
} from '../types';
import { translations } from '../data/translations';
import { farmerPresets } from '../data/farmerPresets';
import { speakVernacularText, stopSpeech } from '../utils/audioSpeech';
import { 
  CloudRain, 
  Sun, 
  CloudFog, 
  CloudSun, 
  Mic, 
  Bell, 
  MessageSquare, 
  SlidersHorizontal, 
  Languages, 
  Volume2, 
  VolumeX, 
  Eye, 
  Droplets,
  Menu,
  LogOut,
  Repeat
} from 'lucide-react';

interface HeaderProps {
  currentFarmer: FarmerProfile;
  onSelectFarmer: (farmer: FarmerProfile) => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onOpenVoice: () => void;
  onOpenAlerts: () => void;
  onOpenWhatsApp: () => void;
  onOpenConfig: () => void;
  onOpenMobileMenu: () => void;
  activeAlerts: ProactiveAlert[];
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
  actions?: DailyAction[];
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  onToggleActiveRoleMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentFarmer,
  onSelectFarmer,
  currentLanguage,
  onSelectLanguage,
  onOpenVoice,
  onOpenAlerts,
  onOpenWhatsApp,
  onOpenConfig,
  onOpenMobileMenu,
  activeAlerts,
  isHighContrast,
  onToggleHighContrast,
  actions = [],
  currentUser,
  onLogout,
  onToggleActiveRoleMode
}) => {
  const t = translations[currentLanguage] || translations.en;
  const [showPresetsDropdown, setShowPresetsDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [isReadingScreen, setIsReadingScreen] = useState(false);

  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'cloud-rain': return <CloudRain className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 animate-bounce" />;
      case 'sun': return <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />;
      case 'cloud-fog': return <CloudFog className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />;
      case 'cloud-sun': return <CloudSun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />;
      default: return <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />;
    }
  };

  const languageLabels: Record<Language, { label: string; native: string }> = {
    hi: { label: 'Hindi', native: 'हिन्दी' },
    mr: { label: 'Marathi', native: 'मराठी' },
    te: { label: 'Telugu', native: 'తెలుగు' },
    ta: { label: 'Tamil', native: 'தமிழ்' },
    kn: { label: 'Kannada', native: 'ಕನ್ನಡ' },
    gu: { label: 'Gujarati', native: 'ગુજરાતી' },
    pa: { label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    bn: { label: 'Bengali', native: 'বাংলা' },
    en: { label: 'English', native: 'English' }
  };

  const handleReadTopAdvisory = () => {
    if (isReadingScreen) {
      stopSpeech();
      setIsReadingScreen(false);
      return;
    }

    const urgentAction = actions.find(a => a.urgency === 'critical') || actions[0];
    const speechText = urgentAction 
      ? `${urgentAction.title}. ${urgentAction.actionText}. ${urgentAction.reasoning}`
      : `${t.optimalProgress}`;

    setIsReadingScreen(true);
    speakVernacularText(
      speechText, 
      currentLanguage, 
      () => setIsReadingScreen(true), 
      () => setIsReadingScreen(false)
    );
  };

  return (
    <header className={`${isHighContrast ? 'bg-black border-yellow-400 text-yellow-300' : 'bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white'} border-b shadow-xl sticky top-0 z-40`}>
      
      {/* Top Urgent Alert Strip */}
      {currentFarmer.weather.rainProbability >= 60 && (
        <div className="bg-amber-500 text-slate-950 px-3 sm:px-4 py-1 text-[11px] sm:text-xs font-black flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 border-b border-amber-400/50 shadow-inner">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="flex h-2 w-2 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-700"></span>
            </span>
            <span className="truncate">
              ⚠️ <strong>{t.cautionAdvisory}:</strong> {currentFarmer.weather.rainForecastWindow} ({currentFarmer.weather.rainProbability}%) — <strong>{t.dontIrrigate} & {t.doNotSpray}</strong>
            </span>
          </div>
          <button 
            onClick={onOpenAlerts}
            className="text-[10px] sm:text-xs bg-slate-950 text-amber-300 hover:bg-slate-900 px-2 py-0.5 rounded-full font-black self-end sm:self-auto flex-shrink-0 shadow"
          >
            {t.proactiveAlerts}
          </button>
        </div>
      )}

      {/* Main Top Header Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-md border border-emerald-300/30 text-lg sm:text-2xl flex-shrink-0">
              🌾
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base sm:text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-emerald-100 to-green-300 bg-clip-text text-transparent truncate">
                  {t.appName}
                </span>
                {currentUser && (
                  <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded-full border ${
                    currentUser.role === 'labour' 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                      : currentUser.role === 'both'
                      ? 'bg-teal-500/20 text-teal-300 border-teal-400/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                  }`}>
                    {currentUser.role === 'both' 
                      ? (currentUser.activeRoleMode === 'farmer' ? '🔄 Farmer Mode' : '🔄 Labour Mode')
                      : currentUser.role === 'labour' ? '👷 Labour' : '👨🏽‍🌾 Farmer'}
                  </span>
                )}
              </div>
              <p className="hidden sm:block text-[10px] sm:text-xs text-emerald-200/80 font-medium truncate">
                {t.copilotSubtitle}
              </p>
            </div>
          </div>

          {/* Center Weather Widget (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 bg-slate-950/70 border border-emerald-700/40 rounded-2xl px-3.5 py-1.5 text-xs shadow-inner">
            <div className="flex items-center gap-2">
              {getWeatherIcon(currentFarmer.weather.conditionIcon)}
              <div>
                <div className="flex items-center gap-1 font-black text-xs text-white">
                  <span>{currentFarmer.weather.temp}°C</span>
                  <span className="text-[10px] font-normal text-emerald-300">({currentFarmer.district})</span>
                </div>
                <div className="text-[9px] text-emerald-200">
                  {currentFarmer.weather.condition}
                </div>
              </div>
            </div>

            <div className="h-5 w-px bg-emerald-700/60" />

            <div className="flex items-center gap-2.5 text-emerald-200 text-[11px]">
              <div className="flex items-center gap-1">
                <CloudRain className="w-3 h-3 text-blue-400" />
                <span className="font-bold text-white">{currentFarmer.weather.rainProbability}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="w-3 h-3 text-cyan-400" />
                <span className="font-bold text-white">{currentFarmer.soilMoisture}%</span>
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* Quick Toggle for Both-Role users */}
            {currentUser?.role === 'both' && onToggleActiveRoleMode && (
              <button
                onClick={onToggleActiveRoleMode}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-black shadow transition-all active:scale-95"
                title="Switch between Farmer and Labour View"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {currentUser.activeRoleMode === 'farmer' ? 'Switch to Labour' : 'Switch to Farmer'}
                </span>
              </button>
            )}

            {/* 🔊 1-Tap Read Advisory */}
            <button
              onClick={handleReadTopAdvisory}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl font-black text-xs transition-all ${
                isReadingScreen
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
              }`}
              title="सलाह सुनें"
            >
              {isReadingScreen ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isReadingScreen ? 'Stop' : '🔊 Listen'}</span>
            </button>

            {/* Profile Switcher (When in Farmer Mode) */}
            {(!currentUser || currentUser.activeRoleMode === 'farmer') && (
              <div className="relative">
                <button
                  onClick={() => setShowPresetsDropdown(!showPresetsDropdown)}
                  className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-white text-xs font-bold transition-all"
                  title={t.switchProfile}
                >
                  <span className="text-sm sm:text-base">{currentFarmer.avatar}</span>
                  <span className="hidden sm:inline truncate max-w-[80px] md:max-w-[100px]">{currentFarmer.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-emerald-300 font-mono">▾</span>
                </button>

                {showPresetsDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in duration-150">
                    <div className="px-3 py-1.5 text-[11px] font-black uppercase text-emerald-400 border-b border-slate-800">
                      🏆 {t.demoJudgePresets}
                    </div>
                    <div className="space-y-1 mt-1.5">
                      {farmerPresets.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => {
                            onSelectFarmer(preset);
                            setShowPresetsDropdown(false);
                          }}
                          className={`w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs transition-colors ${
                            currentFarmer.id === preset.id ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-200'
                          }`}
                        >
                          <span className="text-xl p-1 bg-slate-800 rounded-lg">{preset.avatar}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs truncate">{preset.name}</div>
                            <div className="text-[10px] text-emerald-300 truncate">{preset.cropNameEn} • {preset.totalAcreage} {t.acreage}</div>
                            <div className="text-[9px] text-slate-400 truncate">📍 {preset.district}, {preset.state}</div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-slate-800 mt-2 pt-2">
                      <button
                        onClick={() => {
                          setShowPresetsDropdown(false);
                          onOpenConfig();
                        }}
                        className="w-full flex items-center justify-center gap-1 py-1.5 text-xs text-emerald-300 bg-emerald-950/80 rounded-xl border border-emerald-700 font-bold"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        {t.switchProfile}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-100 text-xs font-black transition-all"
              >
                <Languages className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs">{languageLabels[currentLanguage]?.native || 'हिन्दी'}</span>
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl p-1.5 z-50 grid grid-cols-1 gap-1">
                  {(Object.keys(languageLabels) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        onSelectLanguage(lang);
                        setShowLangDropdown(false);
                      }}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs ${
                        currentLanguage === lang ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span>{languageLabels[lang].native}</span>
                      <span className="text-[9px] text-slate-400 font-mono">({languageLabels[lang].label})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Voice Assistant */}
            <button
              onClick={onOpenVoice}
              className="flex items-center gap-1 p-2 sm:px-3 sm:py-1.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black text-xs shadow-md transition-all active:scale-95"
              title={t.voiceAssistant}
            >
              <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span className="hidden sm:inline">{t.voiceAssistant}</span>
            </button>

            {/* Bell Alerts */}
            <button
              onClick={onOpenAlerts}
              className="p-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/40 text-amber-300 transition-all relative"
              title={t.proactiveAlerts}
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 px-1 min-w-[14px] h-3.5 bg-red-500 text-white rounded-full text-[8px] font-black flex items-center justify-center animate-pulse">
                  {activeAlerts.length}
                </span>
              )}
            </button>

            {/* Logout Button (Returns to Login Page) */}
            {currentUser && onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-300 transition-all"
                title="Logout (लॉगआउट)"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={onOpenMobileMenu}
              className="flex sm:hidden p-2 rounded-xl bg-emerald-950/80 text-emerald-300 border border-emerald-600/40"
              title="Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
