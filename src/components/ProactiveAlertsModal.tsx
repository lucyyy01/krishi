import React from 'react';
import { FarmerProfile, Language, ProactiveAlert } from '../types';
import { translations } from '../data/translations';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface ProactiveAlertsModalProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
  isOpen: boolean;
  onClose: () => void;
  alerts: ProactiveAlert[];
  onOpenWhatsApp: () => void;
}

export const ProactiveAlertsModal: React.FC<ProactiveAlertsModalProps> = ({
  currentFarmer,
  currentLanguage,
  isOpen,
  onClose,
  alerts,
  onOpenWhatsApp
}) => {
  const t = translations[currentLanguage];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-emerald-950 text-white border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">
                {t.proactiveAlerts}
              </h3>
              <p className="text-xs text-emerald-200/80 font-medium">
                Early Warning Intelligence for {currentFarmer.name}
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

        {/* Alerts Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl border transition-all ${
                alert.severity === 'critical'
                  ? 'bg-red-50/80 border-red-200 text-red-950'
                  : alert.severity === 'warning'
                  ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-black/5">
                <span className="text-xs font-black flex items-center gap-1.5">
                  {alert.severity === 'critical' ? '🔴 URGENT WARNING' : '🟡 ADVISORY'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp}</span>
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 mt-2">
                {alert.title}
              </h4>

              <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">
                {alert.message}
              </p>

              <div className="mt-3 p-2.5 rounded-xl bg-white/90 border border-black/5 text-xs text-slate-800 flex items-start gap-2">
                <span className="text-emerald-700 font-bold">⚡ Action Required:</span>
                <span className="font-semibold">{alert.actionPrompt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer with WhatsApp Simulator trigger */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenWhatsApp();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-extrabold text-xs shadow-md transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.sendWhatsAppAlert}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
};
