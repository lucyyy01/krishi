import React, { useState } from 'react';
import { FarmerProfile, Language } from '../types';
import { 
  X, 
  Send, 
  CheckCheck, 
  Smartphone, 
  Volume2, 
  Sparkles,
  MessageCircle,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WhatsAppSimulatorModalProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppSimulatorModal: React.FC<WhatsAppSimulatorModalProps> = ({
  currentFarmer,
  currentLanguage,
  isOpen,
  onClose
}) => {
  const [hasSentTestAlert, setHasSentTestAlert] = useState(false);

  if (!isOpen) return null;

  const triggerMobileDispatch = () => {
    setHasSentTestAlert(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  const getVernacularAlertText = () => {
    switch (currentLanguage) {
      case 'hi':
        return `🚨 *कृषि को-पायलट सतर्कता संदेश* 🚨\n\nनमस्ते ${currentFarmer.name} जी,\n\n⚠️ *सावधानी:* आपके क्षेत्र (${currentFarmer.district}) में अगले 24 घंटों में भारी बारिश की संभावना है।\n\n❌ *आज क्या न करें:* अपनी ${currentFarmer.cropNameEn} फसल में आज पानी (सिंचाई) न दें और न ही कोई कीटनाशक दवा का छिड़काव करें।\n\n✅ *आज क्या करें:* खेत के पानी निकास नालों को तुरंत साफ करें।\n\n💰 *योजना सूचना:* PMFBY फसल बीमा की अंतिम तिथि 15 सितंबर है।\n\nकृषि को-पायलट सहायता केंद्र: 1800-180-1551`;
      case 'mr':
        return `🚨 *कृषी को-पायलट सतर्कता संदेश* 🚨\n\nनमस्कार ${currentFarmer.name} शेतकरी बंधू,\n\n⚠️ *हवामान इशारा:* तुमच्या भागात (${currentFarmer.district}) पुढील २४ तासांत जोरदार पावसाची शक्यता आहे.\n\n❌ *आज काय करू नये:* ${currentFarmer.cropNameEn} पिकाला आज पाणी देऊ नका व कोणतीही फवारणी करू नका.\n\n✅ *आज काय करावे:* शेतातील पाण्याचा निचरा होण्यासाठी बांध व चर मोकळे करा.\n\n💰 *योजना:* पीक विम्यातील नोंदणी मुदत १५ सप्टेंबरपर्यंत आहे.\n\nकृषी को-पायलट टोल फ्री: 1800-180-1551`;
      default:
        return `🚨 *KRISHI COPILOT PROACTIVE ALERT* 🚨\n\nNamaste ${currentFarmer.name} ji,\n\n⚠️ *Weather Alert:* Heavy rain expected in ${currentFarmer.district} in ${currentFarmer.weather.rainForecastWindow} (${currentFarmer.weather.rainProbability}% prob).\n\n❌ *Action Restricted:* DO NOT irrigate your ${currentFarmer.cropNameEn} field today. DO NOT spray any pesticide.\n\n✅ *Action Recommended:* Inspect and clear field furrow drainage outlets before 5 PM.\n\n💰 *Scheme Reminder:* PMFBY Kharif enrollment closes on Sep 15.\n\nHelpline: 1800-180-1551 (Toll-Free)`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden text-white">
        
        {/* Smartphone Shell Frame Header */}
        <div className="p-4 bg-emerald-950 border-b border-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-sm shadow">
              💬
            </div>
            <div>
              <div className="font-extrabold text-sm text-white flex items-center gap-1">
                <span>Krishi Copilot AI (Verified)</span>
                <span className="text-green-400 text-xs">✓</span>
              </div>
              <div className="text-[10px] text-emerald-300 font-mono">{currentFarmer.phone}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-900 text-slate-300 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* WhatsApp Mobile Chat View */}
        <div className="p-4 bg-slate-950 flex-1 space-y-4 min-h-[360px] overflow-y-auto">
          
          <div className="text-center text-[10px] text-slate-400 bg-slate-900/90 py-1 px-3 rounded-full w-fit mx-auto border border-slate-800">
            🔒 Messages and calls are end-to-end encrypted
          </div>

          {/* Incoming Proactive Push Message Bubble */}
          <div className="bg-emerald-950/80 border border-emerald-600/40 rounded-2xl rounded-tl-none p-4 text-xs text-slate-100 space-y-2 shadow-lg">
            <div className="whitespace-pre-line leading-relaxed font-sans">
              {getVernacularAlertText()}
            </div>
            <div className="flex justify-end items-center gap-1 text-[10px] text-emerald-300/80 pt-1">
              <span>11:15 AM</span>
              <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>

          {hasSentTestAlert && (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tr-none p-3 text-xs text-white max-w-[80%] ml-auto space-y-1">
              <p>धन्यवाद, मी शेतात जाऊन नाली साफ करतो. (Thank you, checking field drainage now.)</p>
              <div className="flex justify-end items-center gap-1 text-[10px] text-slate-400">
                <span>Just now</span>
                <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
          )}

        </div>

        {/* Action Dispatch Buttons */}
        <div className="p-4 bg-slate-900 border-t border-emerald-900/60 space-y-2">
          <button
            onClick={triggerMobileDispatch}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black text-xs shadow-lg shadow-green-600/25 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Simulate Farmer Response via SMS / WhatsApp</span>
          </button>
          
          <p className="text-center text-[10px] text-slate-400">
            Works over WhatsApp Business API & Telecom SMS Gateways without internet.
          </p>
        </div>

      </div>
    </div>
  );
};
