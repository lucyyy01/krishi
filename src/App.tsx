import React, { useState } from 'react';
import { 
  FarmerProfile, 
  Language, 
  DailyAction, 
  ProactiveAlert,
  AuthUser
} from './types';
import { farmerPresets } from './data/farmerPresets';
import { translations } from './data/translations';
import { generateTodaysActionPlan, getProactiveAlerts } from './utils/decisionEngine';

import { LoginPage } from './components/LoginPage';
import { LabourDashboard } from './components/LabourDashboard';
import { Header } from './components/Header';
import { TodaysActionPlan } from './components/TodaysActionPlan';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { SchemeMatcher } from './components/SchemeMatcher';
import { CropDiseaseDetector } from './components/CropDiseaseDetector';
import { FertilizerCalculator } from './components/FertilizerCalculator';
import { VoiceAssistant } from './components/VoiceAssistant';
import { ProactiveAlertsModal } from './components/ProactiveAlertsModal';
import { WhatsAppSimulatorModal } from './components/WhatsAppSimulatorModal';
import { FarmConfigModal } from './components/FarmConfigModal';

// Extended Components
import { P2PLendingHub } from './components/P2PLendingHub';
import { MandiLocationFinder } from './components/MandiLocationFinder';
import { SeedsFertilizerMarket } from './components/SeedsFertilizerMarket';
import { CropProductionTracker } from './components/CropProductionTracker';
import { IoTHardwareHub } from './components/IoTHardwareHub';
import { FarmerCommunityForum } from './components/FarmerCommunityForum';
import { RentalTruckService } from './components/RentalTruckService';
import { FarmLabourHub } from './components/FarmLabourHub';

import { 
  PhoneCall, 
  ShieldCheck,
  Mic,
  X,
  ChevronRight
} from 'lucide-react';

export function App() {
  // Authentication & Role State - Initially NULL so Login Page opens first!
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const [currentFarmer, setCurrentFarmer] = useState<FarmerProfile>(farmerPresets[0]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('hi');
  const [activeTab, setActiveTab] = useState<string>('today');
  const [selectedSimulatorScenario, setSelectedSimulatorScenario] = useState<string>('irrigate_today');
  
  // Modals & Drawers state
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);

  const t = translations[currentLanguage] || translations.en;
  
  // Fully language-aware actions and proactive alerts!
  const actions: DailyAction[] = generateTodaysActionPlan(currentFarmer, currentLanguage);
  const activeAlerts: ProactiveAlert[] = getProactiveAlerts(currentFarmer, currentLanguage);

  const handleSimulateScenario = (scenarioType: string) => {
    setSelectedSimulatorScenario(scenarioType);
    setActiveTab('what-if');
  };

  const handleToggleActiveRoleMode = () => {
    if (!currentUser || currentUser.role !== 'both') return;
    setCurrentUser({
      ...currentUser,
      activeRoleMode: currentUser.activeRoleMode === 'farmer' ? 'labour' : 'farmer'
    });
  };

  // 1. If not logged in, show the Login Page first!
  if (!currentUser) {
    return (
      <LoginPage
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          if (user.farmerProfile) {
            setCurrentFarmer(user.farmerProfile);
          }
        }}
      />
    );
  }

  const navTabs = [
    { id: 'today', label: t.todaysActionPlan, shortLabel: t.todaysActionPlan.split(' ')[0], icon: '🌾', badge: `${actions.filter(a => a.urgency === 'critical').length} Urgent` },
    { id: 'what-if', label: t.whatIfSimulator, shortLabel: t.whatIfSimulator.split(' ')[0], icon: '🌦️', badge: 'Decision' },
    { id: 'trucks', label: t.rentalTrucks, shortLabel: t.rentalTrucks.split(' ')[0], icon: '🚚', badge: 'Transport' },
    { id: 'labour', label: t.farmLabour, shortLabel: t.farmLabour.split(' ')[0], icon: '👷', badge: 'Labour' },
    { id: 'production', label: t.cropProduction, shortLabel: t.cropProduction.split(' ')[0], icon: '📊', badge: 'Yield' },
    { id: 'iot', label: t.iotSensors, shortLabel: t.iotSensors.split(' ')[0], icon: '📡', badge: 'IoT' },
    { id: 'diseases', label: t.cropDiseaseAi, shortLabel: t.cropDiseaseAi.split(' ')[0], icon: '📸', badge: 'Spray' },
    { id: 'schemes', label: t.schemeMatcher, shortLabel: t.schemeMatcher.split(' ')[0], icon: '💰', badge: 'Subsidy' },
    { id: 'p2p-loans', label: t.p2pLending, shortLabel: t.p2pLending.split(' ')[0], icon: '🤝', badge: '1% Loan' },
    { id: 'mandi-locator', label: t.mandiLocator, shortLabel: t.mandiLocator.split(' ')[0], icon: '🏛️', badge: 'APMC' },
    { id: 'seeds-fertilizer', label: t.seedsFertilizer, shortLabel: t.seedsFertilizer.split(' ')[0], icon: '🌱', badge: 'Kendra' },
    { id: 'community', label: t.communityForum, shortLabel: t.communityForum.split(' ')[0], icon: '👥', badge: 'Chopal' },
    { id: 'fertilizer', label: t.fertilizerCalc, shortLabel: t.fertilizerCalc.split(' ')[0], icon: '🧪', badge: 'NPK' }
  ];

  const mobileBottomTabs = [
    { id: 'today', label: t.todaysActionPlan.split(' ')[0] || 'Today', icon: '🌾' },
    { id: 'what-if', label: t.whatIfSimulator.split(' ')[0] || 'Simulator', icon: '🌦️' },
    { id: 'trucks', label: t.rentalTrucks.split(' ')[0] || 'Trucks', icon: '🚚' },
    { id: 'labour', label: t.farmLabour.split(' ')[0] || 'Labour', icon: '👷' },
    { id: 'more', label: 'More / मेनू', icon: '☰' }
  ];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 overflow-x-hidden ${
      isHighContrast ? 'bg-black text-yellow-300' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Platform Header */}
      <Header
        currentFarmer={currentFarmer}
        onSelectFarmer={setCurrentFarmer}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        activeAlerts={activeAlerts}
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
        actions={actions}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        onToggleActiveRoleMode={handleToggleActiveRoleMode}
      />

      {/* If Labour Role is active, show Labour Portal Dashboard */}
      {currentUser.activeRoleMode === 'labour' ? (
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 pb-28 sm:pb-12">
          <LabourDashboard
            currentUser={currentUser}
            currentLanguage={currentLanguage}
            onSwitchToFarmerMode={currentUser.role === 'both' ? handleToggleActiveRoleMode : undefined}
          />
        </main>
      ) : (
        /* Otherwise, show Full Farmer Agricultural Suite */
        <>
          {/* Desktop/Tablet Horizontal Navigation Bar */}
          <div className="bg-white border-b border-slate-200 sticky top-[57px] sm:top-[65px] z-30 shadow-sm overflow-x-auto scrollbar-none">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center gap-1.5 py-2">
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex-shrink-0 ${
                      isActive
                        ? 'bg-emerald-800 text-white shadow-md'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span className="text-sm">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                    {tab.badge && (
                      <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-mono ${
                        isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6 pb-28 sm:pb-12">
            
            {activeTab === 'today' && (
              <TodaysActionPlan
                currentFarmer={currentFarmer}
                currentLanguage={currentLanguage}
                actions={actions}
                onSimulateScenario={handleSimulateScenario}
                onNavigateToTab={setActiveTab}
              />
            )}

            {activeTab === 'what-if' && (
              <WhatIfSimulator
                currentFarmer={currentFarmer}
                currentLanguage={currentLanguage}
                selectedScenarioKey={selectedSimulatorScenario}
              />
            )}

            {activeTab === 'trucks' && (
              <RentalTruckService
                currentFarmer={currentFarmer}
                currentLanguage={currentLanguage}
              />
            )}

            {activeTab === 'labour' && (
              <FarmLabourHub
                currentFarmer={currentFarmer}
                currentLanguage={currentLanguage}
              />
            )}

            {activeTab === 'production' && (
              <CropProductionTracker
                currentFarmer={currentFarmer}
                currentLanguage={currentLanguage}
              />
            )}

            {activeTab === 'iot' && (
              <IoTHardwareHub
                currentFarmer={currentFarmer}
                currentLanguage={currentLanguage}
              />
            )}

            {activeTab === 'diseases' && (
              <CropDiseaseDetector
                currentFarmer={currentFarmer}
                currentLanguage={currentLanguage}
              />
            )}

            {activeTab === 'schemes' && (
              <SchemeMatcher
                currentFarmer={currentFarmer}
                currentLanguage={currentLanguage}
              />
            )}

            {activeTab === 'p2p-loans' && (
              <P2PLendingHub
                currentFarmer={currentFarmer}
                currentLanguage={currentLanguage}
              />
            )}

            {activeTab === 'mandi-locator' && (
              <MandiLocationFinder
                currentFarmer={currentFarmer}
                currentLanguage={currentLanguage}
              />
            )}

            {activeTab === 'seeds-fertilizer' && (
              <SeedsFertilizerMarket
                currentFarmer={currentFarmer}
                currentLanguage={currentLanguage}
              />
            )}

            {activeTab === 'community' && (
              <FarmerCommunityForum
                currentFarmer={currentFarmer}
                currentLanguage={currentLanguage}
              />
            )}

            {activeTab === 'fertilizer' && (
              <FertilizerCalculator
                currentFarmer={currentFarmer}
                currentLanguage={currentLanguage}
              />
            )}

          </main>
        </>
      )}

      {/* Floating Krishi Voice AI Trigger Button */}
      <button
        onClick={() => setIsVoiceOpen(true)}
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-2xl shadow-emerald-500/50 border border-emerald-300/40 transition-all transform hover:scale-105 active:scale-95 group pulse-ring"
        title={t.voiceAssistant}
      >
        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
          <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </span>
        <span className="font-bold text-xs sm:text-sm">{t.voiceAssistant}</span>
      </button>

      {/* Fixed Sticky Mobile Bottom Navigation Bar */}
      {currentUser.activeRoleMode === 'farmer' && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-2xl">
          {mobileBottomTabs.map((tab) => {
            const isActive = tab.id === 'more' ? isMobileMenuOpen : activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'more') {
                    setIsMobileMenuOpen(true);
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
                className={`flex flex-col items-center justify-center p-1 rounded-xl min-w-[58px] transition-all ${
                  isActive ? 'text-emerald-800 font-black' : 'text-slate-500 font-medium'
                }`}
              >
                <span className={`text-lg sm:text-xl p-1 rounded-xl ${
                  isActive ? 'bg-emerald-100 scale-110' : ''
                }`}>
                  {tab.icon}
                </span>
                <span className="text-[10px] mt-0.5 leading-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌾</span>
                <div>
                  <h3 className="font-black text-base text-slate-900">{t.appName}</h3>
                  <p className="text-[11px] text-slate-500">All Modules & Tools</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {navTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    activeTab === tab.id
                      ? 'bg-emerald-800 text-white border-emerald-700 shadow-md font-bold'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xl">{tab.icon}</span>
                    <span className="text-xs font-black truncate">{tab.shortLabel}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modals */}
      <VoiceAssistant
        currentFarmer={currentFarmer}
        currentLanguage={currentLanguage}
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onNavigateToTab={setActiveTab}
      />

      <ProactiveAlertsModal
        currentFarmer={currentFarmer}
        currentLanguage={currentLanguage}
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={activeAlerts}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
      />

      <WhatsAppSimulatorModal
        currentFarmer={currentFarmer}
        currentLanguage={currentLanguage}
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
      />

      <FarmConfigModal
        currentFarmer={currentFarmer}
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        onSaveProfile={setCurrentFarmer}
      />

      {/* Platform Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-6 sm:py-8 px-4 sm:px-6 hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌾</span>
            <div>
              <div className="font-extrabold text-white text-sm">{t.appName}</div>
              <div className="text-[11px] text-emerald-400 font-medium">
                {t.tagline}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              Kisan Helpline: <strong>1800-180-1551</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              ICAR, IMD & e-NAM Verified
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
