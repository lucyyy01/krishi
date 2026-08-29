import React, { useState } from 'react';
import { FarmerProfile, Language, SchemeMatchResult, AppliedSchemeApplication } from '../types';
import { translations } from '../data/translations';
import { matchSchemesForFarmer } from '../data/schemesData';
import { speakVernacularText, stopSpeech } from '../utils/audioSpeech';
import { 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Clock, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert,
  Search,
  Volume2,
  VolumeX,
  Send,
  Check,
  AlertCircle,
  X,
  Download,
  Building2,
  PhoneCall,
  Calendar,
  CreditCard,
  UserCheck,
  ArrowRight,
  ClipboardList
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SchemeMatcherProps {
  currentFarmer: FarmerProfile;
  currentLanguage: Language;
}

export const SchemeMatcher: React.FC<SchemeMatcherProps> = ({
  currentFarmer,
  currentLanguage
}) => {
  const t = translations[currentLanguage] || translations.en;
  
  // Navigation: Available Schemes vs My Applied Schemes
  const [activeSubTab, setActiveSubTab] = useState<'available' | 'applied'>('available');

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedSchemeId, setExpandedSchemeId] = useState<string | null>(null);
  const [speakingSchemeId, setSpeakingSchemeId] = useState<string | null>(null);

  // Application Flow State
  const [selectedSchemeForApply, setSelectedSchemeForApply] = useState<SchemeMatchResult | null>(null);
  const [applyStep, setApplyStep] = useState<'form' | 'review' | 'success' | null>(null);
  
  // Form Inputs
  const [khasraNumber, setKhasraNumber] = useState('78/2-A (Sawangi Gut)');
  const [aadhaarNumber, setAadhaarNumber] = useState('5839 2940 1829');
  const [bankAccount, setBankAccount] = useState('918273645019');
  const [ifscCode, setIfscCode] = useState('MAHB0001234');
  const [hasAcceptedDeclaration, setHasAcceptedDeclaration] = useState(true);
  const [lastSubmittedAppId, setLastSubmittedAppId] = useState<string>('');

  // 9-Language Localization Dictionary for Scheme Matcher UI
  const schemeUi: Record<Language, {
    title: string;
    subtitle: string;
    availableTab: string;
    appliedTab: string;
    searchPlaceholder: string;
    allSchemes: string;
    potentialBenefit: string;
    deadlineDays: (days: number) => string;
    viewDetails: string;
    viewLess: string;
    applyButton: string;
    portalLink: string;
    reqDocs: string;
    nextSteps: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    applicantName: string;
    phoneLabel: string;
    khasraLabel: string;
    aadhaarLabel: string;
    bankLabel: string;
    ifscLabel: string;
    docsChecklist: string;
    proceedReview: string;
    cancel: string;
    editDetails: string;
    submitFinal: string;
    declarationText: string;
    successTitle: string;
    successDesc: string;
    appRefLabel: string;
    downloadReceipt: string;
    trackStatus: string;
    stage1: string;
    stage2: string;
    stage3: string;
    stage4: string;
    authorityOffice: string;
    estimatedDisbursement: string;
  }> = {
    hi: {
      title: "सरकारी योजनाएं व 1-क्लिक आवेदन (Scheme Portal)",
      subtitle: "पारदर्शी पात्रता मिलान, ऑनलाइन आवेदन, समीक्षा व डायरेक्ट बेनिफिट ट्रांसफर (DBT) ट्रैकिंग",
      availableTab: "उपलब्ध योजनाएं",
      appliedTab: "मेरे आवेदन",
      searchPlaceholder: "योजना खोजें (Search Scheme)...",
      allSchemes: "सभी योजनाएं",
      potentialBenefit: "💰 संभावित लाभ:",
      deadlineDays: (d) => `अंतिम तिथि: ${d} दिन शेष`,
      viewDetails: "विस्तृत विवरण",
      viewLess: "कम देखें",
      applyButton: "आवेदन करें (Apply)",
      portalLink: "पोर्टल लिंक",
      reqDocs: "📋 आवश्यक दस्तावेज:",
      nextSteps: "👣 आगे की प्रक्रिया:",
      step1Title: "चरण 1: ऑनलाइन आवेदन फॉर्म",
      step2Title: "चरण 2: आवेदन समीक्षा व पुष्टि",
      step3Title: "चरण 3: आवेदन सफलतापूर्वक जमा! 🎉",
      applicantName: "आवेदक किसान का नाम:",
      phoneLabel: "मोबाइल नंबर (Aadhaar Linked):",
      khasraLabel: "खसरा / सातबारा गट नंबर:",
      aadhaarLabel: "12-अंकों का आधार नंबर:",
      bankLabel: "बैंक खाता नंबर (DBT Enabled):",
      ifscLabel: "बैंक IFSC कोड:",
      docsChecklist: "सत्यापित दस्तावेज चेकलिस्ट (Attached Documents):",
      proceedReview: "समीक्षा करें (Proceed to Review)",
      cancel: "रद्द करें (Cancel)",
      editDetails: "वापस (Edit Details)",
      submitFinal: "अंतिम आवेदन जमा करें (Submit Application)",
      declarationText: "मैं प्रमाणित करता हूँ कि मेरे द्वारा दी गई भूमि, आधार एवं बैंक खाता जानकारी सत्य है। सरकारी अनुदान आधार से लिंक बैंक खाते में DBT के माध्यम से प्राप्त होगा।",
      successTitle: "आवेदन सफलतापूर्वक जमा हो गया!",
      successDesc: "आपका सरकारी योजना आवेदन संबंधित तालुका कृषि अधिकारी को अग्रेषित कर दिया गया है।",
      appRefLabel: "आधिकारिक आवेदन संदर्भ क्रमांक (Application ID):",
      downloadReceipt: "पावती डाउनलोड करें (Receipt Slip)",
      trackStatus: "स्थिति ट्रैक करें (Track in My Schemes)",
      stage1: "1. आवेदन जमा (Submitted)",
      stage2: "2. दस्तावेज सत्यापन (Verification)",
      stage3: "3. मौका मुआयना (Field Check)",
      stage4: "4. DBT भुगतान (Disbursed)",
      authorityOffice: "सत्यापन कार्यालय:",
      estimatedDisbursement: "वितरण अनुमान:"
    },
    mr: {
      title: "सरकारी योजना व १-क्लिक अर्ज (Scheme Portal)",
      subtitle: "पारदर्शक पात्रता पडताळणी, ऑनलाइन अर्ज, पुनरावलोकन आणि थेट बँक लाभ (DBT) ट्रॅकिंग",
      availableTab: "उपलब्ध योजना",
      appliedTab: "माझे अर्ज",
      searchPlaceholder: "योजना शोधा...",
      allSchemes: "सर्व योजना",
      potentialBenefit: "💰 संभाव्य लाभ:",
      deadlineDays: (d) => `अंतिम मुदत: ${d} दिवस शिल्लक`,
      viewDetails: "तपशील पहा",
      viewLess: "कमी पहा",
      applyButton: "अर्ज करा (Apply)",
      portalLink: "पोर्टल लिंक",
      reqDocs: "📋 आवश्यक कागदपत्रे:",
      nextSteps: "👣 पुढील पायऱ्या:",
      step1Title: "पायरी १: ऑनलाइन अर्ज फॉर्म",
      step2Title: "पायरी २: अर्ज पडताळणी व पुष्टी",
      step3Title: "पायरी ३: अर्ज यशस्वीरित्या जमा झाला! 🎉",
      applicantName: "शेतकऱ्याचे नाव:",
      phoneLabel: "मोबाईल नंबर (आधार लिंक):",
      khasraLabel: "७/१२ गट नंबर:",
      aadhaarLabel: "१२-अंकी आधार नंबर:",
      bankLabel: "बँक खाते क्रमांक (DBT सुरू):",
      ifscLabel: "बँक IFSC कोड:",
      docsChecklist: "जोडलेली कागदपत्रे:",
      proceedReview: "तपासा आणि पुढे जा (Review)",
      cancel: "रद्द करा",
      editDetails: "मागे (बदला)",
      submitFinal: "अंतिम अर्ज जमा करा (Submit)",
      declarationText: "मी प्रमाणित करतो की दिलेली सर्व माहिती सत्य आहे. अनुदान माझ्या आधार लिंक बँक खात्यात DBT द्वारे जमा होईल.",
      successTitle: "अर्ज यशस्वीरित्या सबमिट झाला!",
      successDesc: "तुमचा अर्ज तालुका कृषी अधिकाऱ्यांकडे पडताळणीसाठी पाठवला आहे.",
      appRefLabel: "अधिकृत अर्ज संदर्भ क्रमांक (Application ID):",
      downloadReceipt: "पावती डाउनलोड करा (Receipt)",
      trackStatus: "अर्जाची स्थिती पहा",
      stage1: "१. अर्ज जमा (Submitted)",
      stage2: "२. कागदपत्र पडताळणी (Verification)",
      stage3: "३. प्रत्यक्ष पाहणी (Inspection)",
      stage4: "४. DBT थेट खात्यात जमा (Disbursed)",
      authorityOffice: "पडताळणी कार्यालय:",
      estimatedDisbursement: "अंदाजित जमा तारीख:"
    },
    te: {
      title: "ప్రభుత్వ పథకాలు & దరఖాస్తు (Scheme Portal)",
      subtitle: "పారదర్శక అర్హత పరిశీలన, ఆన్‌లైన్ దరఖాస్తు మరియు DBT ట్రాకింగ్",
      availableTab: "అందుబాటులో ఉన్న పథకాలు",
      appliedTab: "నా దరఖాస్తులు",
      searchPlaceholder: "పథకాన్ని వెతకండి...",
      allSchemes: "అన్ని పథకాలు",
      potentialBenefit: "💰 లభించే ప్రయోజనం:",
      deadlineDays: (d) => `గడువు: ${d} రోజులు మిగిలి ఉన్నాయి`,
      viewDetails: "పూర్తి వివరాలు",
      viewLess: "తక్కువ చూడండి",
      applyButton: "దరఖాస్తు చేయండి",
      portalLink: "పోర్టల్ లింక్",
      reqDocs: "📋 అవసరమైన పత్రాలు:",
      nextSteps: "👣 తదుపరి దశలు:",
      step1Title: "దశ 1: ఆన్‌లైన్ దరఖాస్తు ఫారమ్",
      step2Title: "దశ 2: దరఖాస్తు సమీక్ష",
      step3Title: "దశ 3: దరఖాస్తు విజయవంతంగా సమర్పించబడింది! 🎉",
      applicantName: "రైతు పేరు:",
      phoneLabel: "మొబైల్ నంబర్:",
      khasraLabel: "భూమి సర్వే నంబర్:",
      aadhaarLabel: "ఆధార్ నంబర్:",
      bankLabel: "బ్యాంక్ ఖాతా సంఖ్య:",
      ifscLabel: "IFSC కోడ్:",
      docsChecklist: "జతచేసిన పత్రాలు:",
      proceedReview: "సమీక్షించండి",
      cancel: "రద్దు చేయండి",
      editDetails: "వెనుకకు",
      submitFinal: "దరఖాస్తు సమర్పించండి",
      declarationText: "నేను సమర్పించిన వివరాలు సరైనవని ధృవీకరిస్తున్నాను. సబ్సిడీ మొత్తం నా బ్యాంక్ ఖాతాలో DBT ద్వారా జమ అవుతుంది.",
      successTitle: "దరఖాస్తు విజయవంతంగా సమర్పించబడింది!",
      successDesc: "మీ దరఖాస్తు తాలూకా వ్యవసాయ అధికారికి పంపబడింది.",
      appRefLabel: "దరఖాస్తు నంబర్ (Application ID):",
      downloadReceipt: "రసీదు డౌన్‌లోడ్ చేయండి",
      trackStatus: "స్థితిని ట్రాక్ చేయండి",
      stage1: "1. దరఖాస్తు సమర్పించబడింది",
      stage2: "2. పత్రాల పరిశీలన",
      stage3: "3. క్షేత్ర పరిశీలన",
      stage4: "4. DBT చెల్లింపు",
      authorityOffice: "పరిశీలన కార్యాలయం:",
      estimatedDisbursement: "చెల్లింపు అంచనా:"
    },
    ta: {
      title: "அரசு திட்டங்கள் & விண்ணப்பம் (Scheme Portal)",
      subtitle: "வெளிப்படையான தகுதி பொருத்தம், ஆன்லைன் விண்ணப்பம் & DBT கண்காணிப்பு",
      availableTab: "திட்டங்கள்",
      appliedTab: "என் விண்ணப்பங்கள்",
      searchPlaceholder: "திட்டத்தைத் தேடுங்கள்...",
      allSchemes: "அனைத்து திட்டங்கள்",
      potentialBenefit: "💰 கிடைக்கும் பயன்:",
      deadlineDays: (d) => `கடைசி தேதி: ${d} நாட்கள் உள்ளன`,
      viewDetails: "விவரங்களை பார்க்க",
      viewLess: "குறைவாக பார்க்க",
      applyButton: "விண்ணப்பிக்கவும்",
      portalLink: "இணையதள இணைப்பு",
      reqDocs: "📋 தேவையான ஆவணங்கள்:",
      nextSteps: "👣 அடுத்த படிகள்:",
      step1Title: "படி 1: விண்ணப்ப படிவம்",
      step2Title: "படி 2: விண்ணப்ப சரிபார்ப்பு",
      step3Title: "படி 3: விண்ணப்பம் சமர்ப்பிக்கப்பட்டது! 🎉",
      applicantName: "விவசாயி பெயர்:",
      phoneLabel: "மொபைல் எண்:",
      khasraLabel: "நில சர்வே எண்:",
      aadhaarLabel: "ஆதார் எண்:",
      bankLabel: "வங்கி கணக்கு எண்:",
      ifscLabel: "IFSC குறியீடு:",
      docsChecklist: "இணைக்கப்பட்ட ஆவணங்கள்:",
      proceedReview: "சரிபார்க்கவும்",
      cancel: "ரத்து செய்",
      editDetails: "திருத்து",
      submitFinal: "விண்ணப்பத்தை சமர்ப்பிக்கவும்",
      declarationText: "நான் வழங்கிய தகவல்கள் உண்மையானவை என்று உறுதியளிக்கிறேன். மானியம் DBT மூலம் எனது கணக்கில் வரவு வைக்கப்படும்.",
      successTitle: "விண்ணப்பம் சமர்ப்பிக்கப்பட்டது!",
      successDesc: "உங்கள் விண்ணப்பம் வட்டார வேளாண்மை அலுவலருக்கு அனுப்பப்பட்டுள்ளது.",
      appRefLabel: "விண்ணப்ப எண் (Application ID):",
      downloadReceipt: "ரசீதை பதிவிறக்கவும்",
      trackStatus: "நிலையை கண்காணிக்கவும்",
      stage1: "1. விண்ணப்பம் சமர்ப்பிக்கப்பட்டது",
      stage2: "2. ஆவண சரிபார்ப்பு",
      stage3: "3. நேரடி கள ஆய்வு",
      stage4: "4. DBT நிதி விடுவிப்பு",
      authorityOffice: "சரிபார்ப்பு அலுவலகம்:",
      estimatedDisbursement: "மதிப்பிடப்பட்ட தேதி:"
    },
    kn: {
      title: "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು & ಅರ್ಜಿ (Scheme Portal)",
      subtitle: "ಪಾರದರ್ಶಕ ಅರ್ಹತಾ ಪರಿಶೀಲನೆ, ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಮತ್ತು ಡಿಬಿಟಿ ಟ್ರ್ಯಾಕಿಂಗ್",
      availableTab: "ಲಭ್ಯವಿರುವ ಯೋಜನೆಗಳು",
      appliedTab: "ನನ್ನ ಅರ್ಜಿಗಳು",
      searchPlaceholder: "ಯೋಜನೆ ಹುಡುಕಿ...",
      allSchemes: "ಎಲ್ಲಾ ಯೋಜನೆಗಳು",
      potentialBenefit: "💰 ಸಂಭಾವ್ಯ ಲಾಭ:",
      deadlineDays: (d) => `ಕೊನೆಯ ದಿನಾಂಕ: ${d} ದಿನಗಳು ಬಾಕಿ`,
      viewDetails: "ವಿವರಗಳನ್ನು ನೋಡಿ",
      viewLess: "ಕಡಿಮೆ ನೋಡಿ",
      applyButton: "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
      portalLink: "ಪೋರ್ಟಲ್ ಲಿಂಕ್",
      reqDocs: "📋 ಅಗತ್ಯ ದಾಖಲೆಗಳು:",
      nextSteps: "👣 ಮುಂದಿನ ಹಂತಗಳು:",
      step1Title: "ಹಂತ 1: ಆನ್‌ಲೈನ್ ಅರ್ಜಿ ಫಾರ್ಮ್",
      step2Title: "ಹಂತ 2: ಅರ್ಜಿ ಪರಿಶೀಲನೆ",
      step3Title: "ಹಂತ 3: ಅರ್ಜಿ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ! 🎉",
      applicantName: "ರೈತರ ಹೆಸರು:",
      phoneLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ:",
      khasraLabel: "ಸರ್ವೆ ನಂಬರ್ / ಪಹಣಿ:",
      aadhaarLabel: "ಆಧಾರ್ ಸಂಖ್ಯೆ:",
      bankLabel: "ಬ್ಯಾಂಕ್ ಖಾತೆ ಸಂಖ್ಯೆ:",
      ifscLabel: "IFSC ಕೋಡ್:",
      docsChecklist: "ಲಗತ್ತಿಸಲಾದ ದಾಖಲೆಗಳು:",
      proceedReview: "ಪರಿಶೀಲಿಸಿ",
      cancel: "ರದ್ದುಮಾಡಿ",
      editDetails: "ಬದಲಾಯಿಸಿ",
      submitFinal: "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
      declarationText: "ನಾನು ನೀಡಿದ ಮಾಹಿತಿ ಸರಿಯಾಗಿದೆ ಎಂದು ಪ್ರಮಾಣೀಕರಿಸುತ್ತೇನೆ. ಸಬ್ಸಿಡಿ ಹಣ ಡಿಬಿಟಿ ಮೂಲಕ ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆಯಾಗುತ್ತದೆ.",
      successTitle: "ಅರ್ಜಿ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ!",
      successDesc: "ನಿಮ್ಮ ಅರ್ಜಿಯನ್ನು ತಾಲೂಕು ಕೃಷಿ ಅಧಿಕಾರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.",
      appRefLabel: "ಅರ್ಜಿ ಸಂಖ್ಯೆ (Application ID):",
      downloadReceipt: "ರಶೀದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
      trackStatus: "ಸ್ಥಿತಿ ಪರಿಶೀಲಿಸಿ",
      stage1: "1. ಅರ್ಜಿ ಸಲ್ಲಿಕೆಯಾಗಿದೆ",
      stage2: "2. ದಾಖಲೆ ಪರಿಶೀಲನೆ",
      stage3: "3. ಸ್ಥಳ ಪರಿಶೀಲನೆ",
      stage4: "4. ಡಿಬಿಟಿ ಪಾವತಿ",
      authorityOffice: "ಪರಿಶೀಲನಾ ಕಚೇರಿ:",
      estimatedDisbursement: "ಅಂದಾಜು ದಿನಾಂಕ:"
    },
    gu: {
      title: "સરકારી યોજનાઓ અને ૧-ક્લિક અરજી (Scheme Portal)",
      subtitle: "પારદર્શક પાત્રતા ચકાસણી, ઓનલાઈન અરજી અને DBT ટ્રેકિંગ",
      availableTab: "ઉપલબ્ધ યોજનાઓ",
      appliedTab: "મારી અરજીઓ",
      searchPlaceholder: "યોજના શોધો...",
      allSchemes: "બધી યોજનાઓ",
      potentialBenefit: "💰 સંભવિત લાભ:",
      deadlineDays: (d) => `છેલ્લી તારીખ: ${d} દિવસ બાકી`,
      viewDetails: "વિગતવાર જુઓ",
      viewLess: "ઓછું જુઓ",
      applyButton: "અરજી કરો (Apply)",
      portalLink: "પોર્ટલ લિંક",
      reqDocs: "📋 જરૂરી દસ્તાવેજો:",
      nextSteps: "👣 આગળના પગલાં:",
      step1Title: "પગલું ૧: ઓનલાઈન અરજી ફોર્મ",
      step2Title: "પગલું ૨: અરજી સમીક્ષા અને પુષ્ટિ",
      step3Title: "પગલું ૩: અરજી સફળતાપૂર્વક સબમિટ થઈ! 🎉",
      applicantName: "ખેડૂતનું નામ:",
      phoneLabel: "મોબાઇલ નંબર (આધાર લિંક):",
      khasraLabel: "૭/૧૨ સર્વે નંબર:",
      aadhaarLabel: "આધાર નંબર:",
      bankLabel: "બેંક એકાઉન્ટ નંબર:",
      ifscLabel: "IFSC કોડ:",
      docsChecklist: "જોડાયેલ દસ્તાવેજો:",
      proceedReview: "સમીક્ષા કરો",
      cancel: "રદ કરો",
      editDetails: "પાછળ",
      submitFinal: "અંતિમ અરજી સબમિટ કરો",
      declarationText: "હું પ્રમાણિત કરું છું કે આપેલી માહિતી સાચી છે. સરકારી સબસિડી મારા બેંક ખાતામાં DBT દ્વારા જમા થશે.",
      successTitle: "અરજી સફળતાપૂર્વક સબમિટ થઈ!",
      successDesc: "તમારી અરજી તાલુકા કૃષિ અધિકારીને મોકલવામાં આવી છે.",
      appRefLabel: "અરજી સંદર્ભ નંબર (Application ID):",
      downloadReceipt: "પહોંચ ડાઉનલોડ કરો",
      trackStatus: "સ્થિતિ ટ્રેક કરો",
      stage1: "૧. અરજી સબમિટ થઈ",
      stage2: "૨. દસ્તાવેજ ચકાસણી",
      stage3: "૩. સ્થળ તપાસણી",
      stage4: "૪. DBT ચૂકવણી",
      authorityOffice: "ચકાસણી કચેરી:",
      estimatedDisbursement: "ચૂકવણી અંદાજ:"
    },
    pa: {
      title: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਅਤੇ ਆਨਲਾਈਨ ਅਰਜ਼ੀ (Scheme Portal)",
      subtitle: "ਪਾਰਦਰਸ਼ੀ ਯੋਗਤਾ ਜਾਂਚ, ਆਨਲਾਈਨ ਅਪਲਾਈ ਅਤੇ DBT ਟਰੈਕਿੰਗ",
      availableTab: "ਉਪਲਬਧ ਸਕੀਮਾਂ",
      appliedTab: "ਮੇਰੀਆਂ ਅਰਜ਼ੀਆਂ",
      searchPlaceholder: "ਸਕੀਮ ਖੋਜੋ...",
      allSchemes: "ਸਾਰੀਆਂ ਸਕੀਮਾਂ",
      potentialBenefit: "💰 ਸੰਭਾਵੀ ਲਾਭ:",
      deadlineDays: (d) => `ਆਖਰੀ ਮਿਤੀ: ${d} ਦਿਨ ਬਾਕੀ`,
      viewDetails: "ਵੇਰਵੇ ਦੇਖੋ",
      viewLess: "ਘੱਟ ਦੇਖੋ",
      applyButton: "ਅਪਲਾਈ ਕਰੋ (Apply)",
      portalLink: "ਪੋਰਟਲ ਲਿੰਕ",
      reqDocs: "📋 ਲੋੜੀਂਦੇ ਦਸਤਾਵੇਜ਼:",
      nextSteps: "👣 ਅਗਲੇ ਕਦਮ:",
      step1Title: "ਕਦਮ 1: ਆਨਲਾਈਨ ਅਰਜ਼ੀ ਫਾਰਮ",
      step2Title: "ਕਦਮ 2: ਅਰਜ਼ੀ ਦੀ ਸਮੀਖਿਆ",
      step3Title: "ਕਦਮ 3: ਅਰਜ਼ੀ ਸਫਲਤਾਪੂਰਵਕ ਜਮ੍ਹਾਂ ਹੋ ਗਈ! 🎉",
      applicantName: "ਕਿਸਾਨ ਦਾ ਨਾਂ:",
      phoneLabel: "ਮੋਬਾਈਲ ਨੰਬਰ:",
      khasraLabel: "ਖਸਰਾ / ਜ਼ਮੀਨ ਨੰਬਰ:",
      aadhaarLabel: "ਆਧਾਰ ਨੰਬਰ:",
      bankLabel: "ਬੈਂਕ ਖਾਤਾ ਨੰਬਰ:",
      ifscLabel: "IFSC ਕੋਡ:",
      docsChecklist: "ਨੱਥੀ ਦਸਤਾਵੇਜ਼:",
      proceedReview: "ਸਮੀਖਿਆ ਕਰੋ",
      cancel: "ਰੱਦ ਕਰੋ",
      editDetails: "ਸੋਧੋ",
      submitFinal: "ਅਰਜ਼ੀ ਜਮ੍ਹਾਂ ਕਰੋ",
      declarationText: "ਮੈਂ ਪ੍ਰਮਾਣਿਤ ਕਰਦਾ ਹਾਂ ਕਿ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਸੱਚ ਹੈ। ਸਬਸਿਡੀ ਮੇਰੇ ਬੈਂਕ ਖਾਤੇ ਵਿੱਚ DBT ਰਾਹੀਂ ਆਵੇਗੀ।",
      successTitle: "ਅਰਜ਼ੀ ਸਫਲਤਾਪੂਰਵਕ ਜਮ੍ਹਾਂ ਹੋ ਗਈ!",
      successDesc: "ਤੁਹਾਡੀ ਅਰਜ਼ੀ ਬਲਾਕ ਖੇਤੀਬਾੜੀ ਅਫਸਰ ਨੂੰ ਭੇਜ ਦਿੱਤੀ ਗਈ ਹੈ।",
      appRefLabel: "ਅਰਜ਼ੀ ਨੰਬਰ (Application ID):",
      downloadReceipt: "ਰਸੀਦ ਡਾਊਨਲੋਡ ਕਰੋ",
      trackStatus: "ਸਥਿਤੀ ਟਰੈਕ ਕਰੋ",
      stage1: "1. ਅਰਜ਼ੀ ਜਮ੍ਹਾਂ ਹੋਈ",
      stage2: "2. ਦਸਤਾਵੇਜ਼ਾਂ ਦੀ ਜਾਂਚ",
      stage3: "3. ਮੌਕੇ ਦੀ ਪੜਤਾਲ",
      stage4: "4. DBT ਭੁਗਤਾਨ",
      authorityOffice: "ਜਾਂਚ ਦਫ਼ਤਰ:",
      estimatedDisbursement: "ਅੰਦਾਜ਼ਨ ਮਿਤੀ:"
    },
    bn: {
      title: "সরকারি প্রকল্প ও অনলাইন আবেদন (Scheme Portal)",
      subtitle: "স্বচ্ছ যোগ্যতা যাচাই, অনলাইন আবেদন এবং সরাসরি ব্যাংক স্থানান্তর (DBT) ট্র্যাকিং",
      availableTab: "উপলব্ধ প্রকল্প",
      appliedTab: "আমার আবেদন",
      searchPlaceholder: "প্রকল্প খুঁজুন...",
      allSchemes: "সমস্ত প্রকল্প",
      potentialBenefit: "💰 সম্ভাব্য সুবিধা:",
      deadlineDays: (d) => `শেষ তারিখ: ${d} দিন বাকি`,
      viewDetails: "বিস্তারিত দেখুন",
      viewLess: "কম দেখুন",
      applyButton: "আবেদন করুন (Apply)",
      portalLink: "পোর্টাল লিংক",
      reqDocs: "📋 প্রয়োজনীয় নথি:",
      nextSteps: "👣 পরবর্তী পদক্ষেপ:",
      step1Title: "ধাপ ১: অনলাইন আবেদনপত্র",
      step2Title: "ধাপ ২: আবেদন পর্যালোচনা",
      step3Title: "ধাপ ৩: আবেদন সফলভাবে জমা হয়েছে! 🎉",
      applicantName: "কৃষকের নাম:",
      phoneLabel: "মোবাইল নম্বর:",
      khasraLabel: "খতিয়ান / দাগ নম্বর:",
      aadhaarLabel: "আধার নম্বর:",
      bankLabel: "ব্যাংক অ্যাকাউন্ট নম্বর:",
      ifscLabel: "IFSC কোড:",
      docsChecklist: "সংযুক্ত নথি:",
      proceedReview: "পর্যালোচনা করুন",
      cancel: "বাতিল করুন",
      editDetails: "সংশোধন করুন",
      submitFinal: "আবেদন জমা দিন",
      declarationText: "আমি প্রত্যয়ন করছি যে প্রদত্ত তথ্য সত্য। সরকারি ভরতুকি আমার ব্যাংক অ্যাকাউন্টে DBT-এর মাধ্যমে জমা হবে।",
      successTitle: "আবেদন সফলভাবে জমা হয়েছে!",
      successDesc: "আপনার আবেদন ব্লক কৃষি কর্মকর্তার কাছে পাঠানো হয়েছে।",
      appRefLabel: "আবেদন ট্র্যাকিং নম্বর (Application ID):",
      downloadReceipt: "রসিদ ডাউনলোড করুন",
      trackStatus: "অবস্থা ট্র্যাক করুন",
      stage1: "১. আবেদন জমা হয়েছে",
      stage2: "২. নথি যাচাইকরণ",
      stage3: "৩. মাঠ পরিদর্শন",
      stage4: "৪. DBT সরাসরি টাকা প্রদান",
      authorityOffice: "যাচাইকরণ অফিস:",
      estimatedDisbursement: "আনুমানিক তারিখ:"
    },
    en: {
      title: "Government Scheme Matcher & 1-Click Apply",
      subtitle: "Transparent eligibility matching, online application, review and Direct Benefit Transfer (DBT) tracking",
      availableTab: "Available Schemes",
      appliedTab: "My Applications",
      searchPlaceholder: "Search scheme name, code or benefits...",
      allSchemes: "All Schemes",
      potentialBenefit: "💰 Potential Benefit:",
      deadlineDays: (d) => `Deadline: ${d} days left`,
      viewDetails: "View Details",
      viewLess: "View Less",
      applyButton: "Apply for Scheme",
      portalLink: "Official Portal",
      reqDocs: "📋 Required Documents:",
      nextSteps: "👣 Next Steps:",
      step1Title: "Step 1: Online Application Form",
      step2Title: "Step 2: Review & Declaration",
      step3Title: "Step 3: Application Submitted Successfully! 🎉",
      applicantName: "Applicant Farmer Name:",
      phoneLabel: "Mobile Number (Aadhaar Linked):",
      khasraLabel: "Khasra / Land Record Number:",
      aadhaarLabel: "12-Digit Aadhaar Number:",
      bankLabel: "Bank Account Number (DBT Enabled):",
      ifscLabel: "Bank IFSC Code:",
      docsChecklist: "Attached Verified Documents Checklist:",
      proceedReview: "Proceed to Review",
      cancel: "Cancel",
      editDetails: "Edit Details",
      submitFinal: "Submit Official Application",
      declarationText: "I hereby certify that all provided land, Aadhaar and bank details are true. Subsidy funds will be credited to my Aadhaar-seeded bank account via DBT.",
      successTitle: "Application Submitted Successfully!",
      successDesc: "Your application has been forwarded to the Taluka Agriculture Officer for verification.",
      appRefLabel: "Official Application Reference ID:",
      downloadReceipt: "Download Receipt Slip",
      trackStatus: "Track in My Applications",
      stage1: "1. Application Submitted",
      stage2: "2. Document Verification",
      stage3: "3. Field Inspection",
      stage4: "4. DBT Direct Disbursement",
      authorityOffice: "Verification Office:",
      estimatedDisbursement: "Estimated Disbursement:"
    }
  };

  const ui = schemeUi[currentLanguage] || schemeUi.hi;

  // Fully language-aware matched schemes!
  const matchedSchemes: SchemeMatchResult[] = matchSchemesForFarmer(currentFarmer, currentLanguage);

  // Initial applied schemes with localization
  const [appliedSchemes, setAppliedSchemes] = useState<AppliedSchemeApplication[]>([
    {
      id: 'PM-KISAN-2026-MH84920',
      schemeId: 'pm-kisan',
      schemeName: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      schemeCode: 'PM-KISAN-18TH-INST',
      subsidyValue: '₹6,000 / Year (₹2,000 every 4 months)',
      applicantName: currentFarmer.name,
      phone: currentFarmer.phone,
      village: currentFarmer.village,
      district: currentFarmer.district,
      state: currentFarmer.state,
      aadhaarLast4: '1829',
      khasraNumber: '78/2-A',
      bankAccountLast4: '5019',
      ifscCode: 'MAHB0001234',
      submittedAt: '12 Aug 2026',
      status: 'approved_dbt_scheduled',
      statusLabelHindi: ui.stage4,
      trackingStep: 4,
      talukaOffice: `${currentFarmer.district} Taluka Agriculture Office`,
      estimatedDisbursementDate: '15 Sep 2026'
    }
  ]);

  const filteredSchemes = matchedSchemes.filter(result => {
    const matchesCat = selectedCategory === 'ALL' || result.scheme.category === selectedCategory.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      result.scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.scheme.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.scheme.benefitsSummary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSpeakScheme = (matchResult: SchemeMatchResult, e: React.MouseEvent) => {
    e.stopPropagation();
    const id = matchResult.scheme.id;
    if (speakingSchemeId === id) {
      stopSpeech();
      setSpeakingSchemeId(null);
      return;
    }

    const eligibleText = matchResult.whyEligiblePoints.join('. ');
    const ineligibleText = matchResult.whyNotEligiblePoints.join('. ');
    const textToSpeak = `${matchResult.scheme.name}. ${matchResult.scheme.benefitsSummary}. ${t.whyEligible}: ${eligibleText}. ${ineligibleText ? `${t.whyNotEligible}: ${ineligibleText}` : ''}`;
    
    setSpeakingSchemeId(id);
    speakVernacularText(
      textToSpeak,
      currentLanguage,
      () => setSpeakingSchemeId(id),
      () => setSpeakingSchemeId(null)
    );
  };

  const handleStartApply = (matchResult: SchemeMatchResult, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSchemeForApply(matchResult);
    setApplyStep('form');
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setApplyStep('review');
  };

  const handleFinalSubmitApplication = () => {
    if (!selectedSchemeForApply) return;

    const randomId = `${selectedSchemeForApply.scheme.code.replace(/[^A-Z0-9]/g, '')}-2026-MH${Math.floor(10000 + Math.random() * 90000)}`;
    setLastSubmittedAppId(randomId);

    const newApp: AppliedSchemeApplication = {
      id: randomId,
      schemeId: selectedSchemeForApply.scheme.id,
      schemeName: selectedSchemeForApply.scheme.name,
      schemeCode: selectedSchemeForApply.scheme.code,
      subsidyValue: selectedSchemeForApply.potentialBenefit || selectedSchemeForApply.scheme.benefitsSummary,
      applicantName: currentFarmer.name,
      phone: currentFarmer.phone,
      village: currentFarmer.village,
      district: currentFarmer.district,
      state: currentFarmer.state,
      aadhaarLast4: aadhaarNumber.replace(/\s/g, '').slice(-4) || '1829',
      khasraNumber: khasraNumber,
      bankAccountLast4: bankAccount.slice(-4) || '5019',
      ifscCode: ifscCode,
      submittedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'under_review',
      statusLabelHindi: ui.stage2,
      trackingStep: 2,
      talukaOffice: `${currentFarmer.district} Taluka Agriculture Office`,
      estimatedDisbursementDate: 'Within 25 Working Days'
    };

    setAppliedSchemes([newApp, ...appliedSchemes]);
    setApplyStep('success');

    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 }
    });
  };

  const handleDownloadReceipt = () => {
    window.print();
  };

  const getMatchBadge = (score: number, isEligible: boolean) => {
    if (score >= 85 && isEligible) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
          🟢 {score}% ({t.whyEligible})
        </span>
      );
    } else if (score >= 60) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
          🟡 {score}% ({t.cautionAdvisory})
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-900 border border-red-300">
          🔴 {score}% ({t.whyNotEligible})
        </span>
      );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-indigo-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {t.schemeMatcher}
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
              {ui.title}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200/90 font-medium mt-1">
              {ui.subtitle}
            </p>
          </div>

          {/* Sub-Tab Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-2xl border border-indigo-500/40 text-xs font-black self-start md:self-auto">
            <button
              onClick={() => setActiveSubTab('available')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeSubTab === 'available'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{ui.availableTab} ({matchedSchemes.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('applied')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeSubTab === 'applied'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-indigo-200 hover:text-white'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>{ui.appliedTab} ({appliedSchemes.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: AVAILABLE SCHEMES LIST */}
      {activeSubTab === 'available' && (
        <div className="space-y-4">
          
          {/* Filters & Search */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={ui.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
              {[
                { id: 'ALL', label: ui.allSchemes },
                { id: 'CENTRAL', label: 'Central (केंद्रीय)' },
                { id: 'STATE', label: 'State (राज्य)' },
                { id: 'INSURANCE', label: 'Insurance (बीमा)' },
                { id: 'SUBSIDY', label: 'Subsidy (अनुदान)' },
                { id: 'CREDIT', label: 'Credit / Loan (ऋण)' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-800 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scheme Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSchemes.map((result) => {
              const isExpanded = expandedSchemeId === result.scheme.id;
              const isSpeaking = speakingSchemeId === result.scheme.id;

              return (
                <div
                  key={result.scheme.id}
                  className={`bg-white rounded-2xl border transition-all shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden ${
                    result.isEligible ? 'border-emerald-200' : 'border-slate-200'
                  }`}
                >
                  {/* Card Top */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
                            {result.scheme.code}
                          </span>
                          <span className="text-[11px] text-slate-500 font-bold uppercase">
                            {result.scheme.category}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                          {result.scheme.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={(e) => handleSpeakScheme(result, e)}
                          className={`p-2 rounded-xl transition-all ${
                            isSpeaking
                              ? 'bg-red-600 text-white animate-pulse'
                              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                          }`}
                          title="योजना सुनें"
                        >
                          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Benefit Highlight Card */}
                    <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-bold flex items-center justify-between">
                      <span>{ui.potentialBenefit}</span>
                      <span className="font-black text-emerald-800">{result.potentialBenefit}</span>
                    </div>

                    {/* Match Score & Deadline */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      {getMatchBadge(result.matchScore, result.isEligible)}

                      <div className="flex items-center gap-1 text-slate-500 font-medium text-[11px]">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>{ui.deadlineDays(result.scheme.daysRemaining)}</span>
                      </div>
                    </div>

                    {/* Why Eligible / Why Not Eligible Summary */}
                    <div className="space-y-1 text-xs pt-2">
                      <div className="font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{t.whyEligible}:</span>
                      </div>
                      <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5 pl-1">
                        {result.whyEligiblePoints.slice(0, 2).map((point, idx) => (
                          <li key={idx} className="truncate">{point}</li>
                        ))}
                      </ul>

                      {result.whyNotEligiblePoints.length > 0 && (
                        <div className="pt-1.5">
                          <div className="font-bold text-red-800 flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                            <span>{t.whyNotEligible}:</span>
                          </div>
                          <ul className="list-disc list-inside text-red-600 text-[11px] space-y-0.5 pl-1">
                            {result.whyNotEligiblePoints.slice(0, 1).map((point, idx) => (
                              <li key={idx} className="truncate">{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="p-3 sm:px-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setExpandedSchemeId(isExpanded ? null : result.scheme.id)}
                      className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
                    >
                      <span>{isExpanded ? ui.viewLess : ui.viewDetails}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {result.isEligible ? (
                      <button
                        onClick={(e) => handleStartApply(result, e)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{ui.applyButton}</span>
                      </button>
                    ) : (
                      <a
                        href={result.scheme.officialPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                      >
                        <span>{ui.portalLink}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Expanded Details Section */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-100/80 border-t border-slate-200 text-xs space-y-3 animate-in fade-in">
                      <div>
                        <div className="font-bold text-slate-800 mb-1">{ui.reqDocs}</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {result.scheme.requiredDocuments.map((doc, idx) => (
                            <div key={idx} className="p-1.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 flex items-center gap-1">
                              <FileText className="w-3 h-3 text-indigo-600 flex-shrink-0" />
                              <span className="truncate">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="font-bold text-slate-800 mb-1">{ui.nextSteps}</div>
                        <ul className="list-decimal list-inside text-slate-600 text-[11px] space-y-1">
                          {result.nextSteps.map((step, idx) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: MY APPLIED SCHEMES & STATUS TRACKER */}
      {activeSubTab === 'applied' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {appliedSchemes.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-200 shadow-md space-y-5"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-mono font-black border border-emerald-300">
                        {app.id}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">
                        {app.submittedAt}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {app.schemeName}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      {app.statusLabelHindi}
                    </span>
                    <div className="text-[11px] text-slate-500 font-bold mt-1">
                      {ui.estimatedDisbursement} <strong className="text-emerald-700">{app.estimatedDisbursementDate}</strong>
                    </div>
                  </div>
                </div>

                {/* 4-Stage Progress Timeline */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {ui.stage1}
                    </span>
                    <span className={`flex items-center gap-1 ${app.trackingStep >= 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {ui.stage2}
                    </span>
                    <span className={`flex items-center gap-1 ${app.trackingStep >= 3 ? 'text-emerald-700' : 'text-slate-400'}`}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {ui.stage3}
                    </span>
                    <span className={`flex items-center gap-1 ${app.trackingStep >= 4 ? 'text-emerald-700' : 'text-slate-400'}`}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {ui.stage4}
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(app.trackingStep / 4) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl text-xs">
                  <div>
                    <div className="text-slate-500">{ui.applicantName}</div>
                    <div className="font-bold text-slate-900">{app.applicantName}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">{ui.khasraLabel}</div>
                    <div className="font-bold text-slate-900">{app.khasraNumber}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">{ui.aadhaarLabel}</div>
                    <div className="font-bold text-slate-900">XXXX-XXXX-{app.aadhaarLast4}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">{ui.bankLabel}</div>
                    <div className="font-bold text-slate-900">•••• {app.bankAccountLast4} ({app.ifscCode})</div>
                  </div>
                </div>

                {/* Authority & Download Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Building2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span>{ui.authorityOffice} <strong>{app.talukaOffice}</strong></span>
                  </div>

                  <button
                    onClick={handleDownloadReceipt}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{ui.downloadReceipt}</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3-STEP SCHEME APPLICATION MODAL FLOW                                      */}
      {/* ========================================================================= */}
      {applyStep && selectedSchemeForApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-900">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center text-xl font-bold">
                  📜
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base">
                    {applyStep === 'form' && ui.step1Title}
                    {applyStep === 'review' && ui.step2Title}
                    {applyStep === 'success' && ui.step3Title}
                  </h3>
                  <p className="text-[11px] text-indigo-200 font-medium truncate max-w-xs sm:max-w-md">
                    {selectedSchemeForApply.scheme.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setApplyStep(null);
                  setSelectedSchemeForApply(null);
                }}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* MODAL STEP 1: FORM INPUT */}
            {applyStep === 'form' && (
              <form onSubmit={handleProceedToReview} className="p-5 overflow-y-auto space-y-4 text-xs">
                
                {/* Scheme Benefit Banner */}
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-emerald-950 font-bold">
                  <span>{ui.potentialBenefit}</span>
                  <span className="font-black text-sm text-emerald-700">{selectedSchemeForApply.potentialBenefit}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{ui.applicantName}</label>
                    <input
                      type="text"
                      disabled
                      value={currentFarmer.name}
                      className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-xl font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{ui.phoneLabel}</label>
                    <input
                      type="text"
                      disabled
                      value={currentFarmer.phone}
                      className="w-full p-2.5 bg-slate-100 border border-slate-300 rounded-xl font-mono font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{ui.khasraLabel}</label>
                    <input
                      type="text"
                      value={khasraNumber}
                      onChange={(e) => setKhasraNumber(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{ui.aadhaarLabel}</label>
                    <input
                      type="text"
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{ui.bankLabel}</label>
                    <input
                      type="text"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">{ui.ifscLabel}</label>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-slate-800 uppercase focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Document Checklist */}
                <div>
                  <label className="font-bold text-slate-800 block mb-1.5">
                    {ui.docsChecklist}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Aadhaar Card (आधार कार्ड)',
                      '7/12 Land Record (सातबारा / खसरा)',
                      'Bank Passbook (बैंक पासबुक)',
                      'Soil Health Card (मृदा कार्ड)'
                    ].map((doc, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <span className="text-slate-700 font-medium">{doc}</span>
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyStep(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                  >
                    {ui.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>{ui.proceedReview}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </form>
            )}

            {/* MODAL STEP 2: REVIEW & DECLARATION */}
            {applyStep === 'review' && (
              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                
                {/* Official Review Badge */}
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-indigo-900 font-black text-xs">
                      {selectedSchemeForApply.scheme.code}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-md text-[10px] font-black">
                      AI 100% Verified
                    </span>
                  </div>

                  <h4 className="font-black text-sm text-slate-900">
                    {selectedSchemeForApply.scheme.name}
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-500">{ui.applicantName} </span>
                      <strong>{currentFarmer.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Location: </span>
                      <strong>{currentFarmer.village}, {currentFarmer.district}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">{ui.khasraLabel} </span>
                      <strong>{khasraNumber} ({currentFarmer.totalAcreage} Acres)</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">{ui.bankLabel} </span>
                      <strong>•••• {bankAccount.slice(-4)} ({ifscCode})</strong>
                    </div>
                  </div>
                </div>

                {/* Declaration Checkbox */}
                <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasAcceptedDeclaration}
                    onChange={(e) => setHasAcceptedDeclaration(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-slate-600 leading-tight text-[11px]">
                    {ui.declarationText}
                  </span>
                </label>

                {/* Review Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyStep('form')}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200"
                  >
                    {ui.editDetails}
                  </button>

                  <button
                    type="button"
                    disabled={!hasAcceptedDeclaration}
                    onClick={handleFinalSubmitApplication}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{ui.submitFinal}</span>
                  </button>
                </div>

              </div>
            )}

            {/* MODAL STEP 3: SUCCESS & RECEIPT */}
            {applyStep === 'success' && (
              <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-center">
                
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 border-2 border-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-lg animate-bounce">
                  ✓
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {ui.successTitle}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {ui.successDesc}
                  </p>
                </div>

                {/* Application ID Card */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{ui.appRefLabel}</span>
                    <span className="text-emerald-400 font-bold">🟢 Live Track Active</span>
                  </div>
                  <div className="text-lg sm:text-xl font-mono font-black text-amber-300 tracking-wider">
                    {lastSubmittedAppId}
                  </div>
                  <div className="text-[11px] text-slate-300 border-t border-slate-800 pt-2 flex items-center justify-between">
                    <span>{ui.applicantName} <strong>{currentFarmer.name}</strong></span>
                    <span>DBT: <strong>{selectedSchemeForApply.potentialBenefit}</strong></span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={handleDownloadReceipt}
                    className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4 text-indigo-600" />
                    <span>{ui.downloadReceipt}</span>
                  </button>

                  <button
                    onClick={() => {
                      setApplyStep(null);
                      setActiveSubTab('applied');
                    }}
                    className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    <ClipboardList className="w-4 h-4" />
                    <span>{ui.trackStatus}</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
