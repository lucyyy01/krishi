import React, { useState, useEffect, useRef } from 'react';
import { FarmerProfile, Language } from '../types';
import { translations } from '../data/translations';
import { speakVernacularText, stopSpeech, getSpeechLanguageCode } from '../utils/audioSpeech';
import { generateSmartFarmerAIResponse, AIResponseWithAction } from '../utils/aiFarmerBrain';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  X, 
  Bot, 
  Sparkles,
  ArrowRight,
  Gauge,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

interface VoiceAssistantProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tabId: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  spokenText?: string;
  suggestedAction?: {
    label: string;
    tabId: string;
    icon: string;
  };
  timestamp: string;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  currentFarmer,
  currentLanguage,
  isOpen,
  onClose,
  onNavigateToTab
}) => {
  const t = translations[currentLanguage];
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechRate, setSpeechRate] = useState<number>(0.92);
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: currentLanguage === 'mr'
        ? `राम राम **${currentFarmer.name} भाऊ!** 🙏\n\nमी तुमचा **कृषी को-पायलट एआय सहाय्यक** आहे. तुमच्या **${currentFarmer.village} (${currentFarmer.district})** मधील **${currentFarmer.totalAcreage} एकर ${currentFarmer.cropNameEn}** पिकाबद्दल काहीही विचारा (पाणी, खत, कीड, मंडी भाव किंवा अनुदान).`
        : `नमस्ते **${currentFarmer.name} जी!** 🙏\n\nमैं आपका निजी **कृषि को-पायलट एआई सलाहकार** हूँ। आपके **${currentFarmer.village} (${currentFarmer.district})** में **${currentFarmer.totalAcreage} एकड़ ${currentFarmer.cropNameEn}** के खेत से जुड़ी कोई भी जानकारी (सिंचाई, खाद, रोग, मंडी भाव या सरकारी योजना) के बारे में पूछने के लिए माइक दबाएं!`,
      spokenText: currentLanguage === 'mr'
        ? `राम राम ${currentFarmer.name} भाऊ! मी तुमचा कृषी मित्र एआय आहे. पाणी, खत किंवा बाजारभावाबद्दल काहीही विचारा!`
        : `नमस्ते ${currentFarmer.name} जी! मैं आपका कृषि मित्र एआई हूँ। सिंचाई, खाद, रोग या मंडी भाव के बारे में कुछ भी पूछें!`,
      timestamp: 'अभी'
    }
  ]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePromptChips: Record<Language, string[]> = {
    hi: [
      "क्या मुझे आज खेत में पानी देना चाहिए?",
      "पत्ते पीले हो रहे हैं, कौन सी दवाई छिड़कें?",
      "यूरिया और डीएपी खाद कब और कितनी दें?",
      "आज का मंडी भाव क्या है और कब बेचें?",
      "ट्रैक्टर सब्सिडी के लिए कौन से कागज लगेंगे?",
      "खेत की मिट्टी में अभी नमी कितनी है?"
    ],
    mr: [
      "माझ्या पिकाला आज पाणी द्यावे का?",
      "पाने पिवळी पडत आहेत, काय फवारणी करावी?",
      "युरिया खत कधी व किती प्रमाणात द्यावे?",
      "आजचा कापूस बाजारभाव काय आहे?",
      "ट्रॅक्टर अनुदानासाठी कोणती कागदपत्रे लागतील?"
    ],
    en: [
      "Should I water my crop today?",
      "Leaves are turning yellow, what medicine to spray?",
      "What is the best fertilizer dose right now?",
      "What is today's mandi price and sell recommendation?",
      "How to get 50% tractor subsidy under SMAM?"
    ],
    te: ["ఈరోజు నీరు పెట్టవచ్చా?", "ఆకులు పసుపు రంగులోకి మారితే ఏమి చేయాలి?", "మార్కెట్ ధర ఎంత?"],
    ta: ["இன்று தண்ணீர் பாய்ச்சலாமா?", "இலைகள் மஞ்சளானால் என்ன செய்வது?", "சந்தை விலை என்ன?"],
    kn: ["ಇಂದು ನೀರು ಹಾಯಿಸಬಹುದೇ?", "ಎಲೆಗಳು ಹಳದಿಯಾದರೆ ಏನು ಮಾಡಬೇಕು?", "ಮಾರುಕಟ್ಟೆ ದರ ಎಷ್ಟು?"],
    gu: ["આજે પિયત આપવું જોઈએ?", "ખાતર ક્યારે આપવું?", "બજાર ભાવ શું છે?"],
    pa: ["ਕੀ ਅੱਜ ਪਾਣੀ ਲਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?", "ਸਪਰੇਅ ਕਦੋਂ ਕਰੀਏ?", "ਮੰਡੀ ਰੇਟ ਕੀ ਹੈ?"],
    bn: ["আজ কি সেচ দেওয়া উচিত?", "সার কখন দেওয়া উচিত?", "বাজার দর কত?"]
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported on this browser. You can type in the box below.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = getSpeechLanguageCode(currentLanguage);
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const text = Array.from(event.results).map((r: any) => r[0].transcript).join('');
      setTranscript(text);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => {
      setIsListening(false);
      if (transcript.trim()) {
        handleSendMessage(transcript);
        setTranscript('');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleSendMessage = (textToSend?: string) => {
    const queryText = (textToSend || transcript).trim();
    if (!queryText) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: 'अभी'
    };

    setChatHistory(prev => [...prev, userMessage]);
    setTranscript('');

    setTimeout(() => {
      const aiResult: AIResponseWithAction = generateSmartFarmerAIResponse(queryText, currentFarmer, currentLanguage);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResult.responseText,
        spokenText: aiResult.spokenText,
        suggestedAction: aiResult.suggestedAction,
        timestamp: 'अभी'
      };

      setChatHistory(prev => [...prev, aiMessage]);

      speakVernacularText(
        aiResult.spokenText || aiResult.responseText, 
        currentLanguage, 
        () => setIsSpeaking(true), 
        () => setIsSpeaking(false),
        speechRate
      );
    }, 400);
  };

  const handleReplaySpeech = (msg: Message) => {
    const text = msg.spokenText || msg.text;
    speakVernacularText(
      text,
      currentLanguage,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      speechRate
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl w-full max-w-2xl h-[92vh] max-h-[720px] flex flex-col shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-3.5 sm:p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 border border-emerald-300/40 flex items-center justify-center text-white shadow-lg flex-shrink-0">
              <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-sm sm:text-base md:text-lg text-white truncate">
                  कृषि मित्र AI वॉयस को-पायलट
                </h3>
                <span className="text-[9px] sm:text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex-shrink-0">
                  Smart Brain
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-emerald-200/90 font-medium truncate">
                {currentFarmer.name} • {currentFarmer.cropNameEn} ({currentFarmer.totalAcreage} एकड़, {currentFarmer.district})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Speed Control Pill */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-xl border border-slate-700 text-[10px] text-slate-300">
              <Gauge className="w-3 h-3 text-emerald-400" />
              <select
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                title="आवाज़ गति"
              >
                <option value="0.8" className="bg-slate-900">0.8x (धीमी)</option>
                <option value="0.95" className="bg-slate-900">1.0x (सामान्य)</option>
                <option value="1.15" className="bg-slate-900">1.2x (तेज)</option>
              </select>
            </div>

            {isSpeaking && (
              <button
                onClick={() => {
                  stopSpeech();
                  setIsSpeaking(false);
                }}
                className="px-2.5 py-1 rounded-xl bg-red-500/20 text-red-400 text-[11px] font-black flex items-center gap-1 border border-red-500/30 animate-pulse"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>रोकें</span>
              </button>
            )}

            <button onClick={onClose} className="p-1.5 sm:p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Live Audio Equalizer Waveform Banner (Active when listening or speaking) */}
        {(isListening || isSpeaking) && (
          <div className="bg-slate-950 py-2 px-4 border-b border-slate-800 flex items-center justify-between animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-red-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
              <span className="text-xs font-bold text-emerald-300">
                {isListening ? '🎙️ आपकी आवाज़ सुन रहा हूँ... बोलिए' : '🔊 कृषि मित्र बोल रहा है...'}
              </span>
            </div>

            {/* Glowing Equalizer Bars */}
            <div className="flex items-center gap-1 h-4">
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.1s]" />
              <span className="w-1 h-4 bg-emerald-300 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.3s]" />
              <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1 h-3 bg-emerald-300 rounded-full animate-bounce [animation-delay:0.25s]" />
            </div>
          </div>
        )}

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3.5">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-lg ${
                msg.sender === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none font-bold' 
                  : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tl-none font-medium'
              }`}>
                {/* Formatted Markdown Content */}
                <div className="whitespace-pre-line space-y-1">
                  {msg.text}
                </div>

                {/* Suggested Tab Action Shortcut Button */}
                {msg.suggestedAction && (
                  <div className="mt-3 pt-2 border-t border-slate-700">
                    <button
                      onClick={() => {
                        onNavigateToTab(msg.suggestedAction!.tabId);
                        onClose();
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow transition-all active:scale-95"
                    >
                      <span>{msg.suggestedAction.icon}</span>
                      <span>{msg.suggestedAction.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                    </button>
                  </div>
                )}

                {/* Message Footer: Timestamp & Replay Button */}
                <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-white/10 text-[10px] text-emerald-200/80">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'ai' && (
                    <button
                      onClick={() => handleReplaySpeech(msg)}
                      className="hover:text-white flex items-center gap-1 font-bold bg-slate-900/60 px-2 py-0.5 rounded-md"
                      title="दोबारा सुनें"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>🔊 दोबारा सुनें</span>
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-800 flex items-center justify-center text-white flex-shrink-0 mt-1 font-bold text-xs">
                  👨🏽‍🌾
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips Carousel */}
        <div className="px-3 sm:px-4 py-2 bg-slate-950/70 border-t border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-black uppercase text-slate-400 flex-shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            पूछें:
          </span>
          {(samplePromptChips[currentLanguage] || samplePromptChips.hi).map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="px-3 py-1 rounded-full text-xs bg-slate-800 hover:bg-emerald-900 border border-slate-700 hover:border-emerald-500 text-emerald-200 whitespace-nowrap font-bold transition-all flex-shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Voice & Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-emerald-500/30">
          <div className="flex items-center gap-2">
            
            {/* Big Mic Button with Active Pulse */}
            <button
              onClick={toggleListening}
              className={`p-3 sm:p-3.5 rounded-2xl font-black transition-all shadow-lg active:scale-95 flex-shrink-0 ${
                isListening 
                  ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-500/30' 
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
              title="माइक दबाकर बोलें"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              type="text"
              placeholder={isListening ? "आपकी आवाज़ सुन रहा हूँ... बोलिए" : "सवाल टाइप करें या माइक दबाकर बोलें..."}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              className="flex-1 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-900 border border-slate-700 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium min-w-0"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!transcript.trim()}
              className="p-3 sm:p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold transition-all flex-shrink-0"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
