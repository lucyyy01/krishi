import { Scheme, FarmerProfile, SchemeMatchResult, Language } from '../types';

export const agriculturalSchemes: Scheme[] = [
  {
    id: 'pm-kisan',
    code: 'PM-KISAN',
    name: 'Pradhan Mantri Kisan Samman Nidhi',
    category: 'central',
    stateApplicability: ['ALL'],
    benefitsSummary: 'Direct cash transfer of ₹6,000 per year in 3 equal four-monthly installments of ₹2,000 directly into Aadhaar-linked bank accounts.',
    maxBenefitAmount: '₹6,000 / year',
    eligibilityCriteria: {
      taxPayerAllowed: false,
      requiresAadhaarLinkedBank: true,
      allowedFarmerCategories: ['marginal_small', 'medium', 'large', 'women_sc_st', 'fpo_member']
    },
    requiredDocuments: [
      'Aadhaar Card (Mandatory biometric KYC)',
      'Landholding Record (7/12, RoR / Khatiyan)',
      'Aadhaar-seeded Active Bank Account Passbook',
      'Citizenship / Identity Proof'
    ],
    applicationDeadline: '2026-10-31',
    daysRemaining: 63,
    officialPortalUrl: 'https://pmkisan.gov.in'
  },
  {
    id: 'pmfby-insurance',
    code: 'PMFBY',
    name: 'Pradhan Mantri Fasal Bima Yojana (Crop Insurance)',
    category: 'insurance',
    stateApplicability: ['ALL'],
    benefitsSummary: 'Comprehensive risk coverage from pre-sowing to post-harvest against natural perils (drought, flood, unseasonal rain, pest outbreaks). Farmer premium only 1.5% - 2.0%.',
    maxBenefitAmount: 'Up to ₹45,000 / Acre (Sum Insured)',
    eligibilityCriteria: {
      taxPayerAllowed: true,
      requiresAadhaarLinkedBank: true,
      applicableCrops: ['ALL', 'cotton', 'rice', 'wheat', 'soybean', 'maize']
    },
    requiredDocuments: [
      'Land Ownership Certificate (7/12 or Tenant declaration)',
      'Crop Sowing Certificate (Pahani / e-Pik Pahani / Girdawari)',
      'Bank Account details with IFSC',
      'Aadhaar Card'
    ],
    applicationDeadline: '2026-09-15',
    daysRemaining: 17,
    officialPortalUrl: 'https://pmfby.gov.in'
  },
  {
    id: 'pmksy-per-drop',
    code: 'PMKSY-PDMC',
    name: 'PM Krishi Sinchayee Yojana — Per Drop More Crop (Micro Irrigation)',
    category: 'subsidy',
    stateApplicability: ['ALL'],
    benefitsSummary: 'Subsidy of 55% for Small & Marginal Farmers and 45% for other farmers for installation of Drip & Sprinkler Micro Irrigation systems.',
    maxBenefitAmount: 'Up to 55% subsidy (~₹38,000 / Acre)',
    subsidyPercentage: 55,
    eligibilityCriteria: {
      minLandAcre: 0.5,
      maxLandAcre: 12.5,
      taxPayerAllowed: true,
      requiresAadhaarLinkedBank: true,
      requiredIrrigation: ['drip', 'sprinkler', 'borewell_canal', 'flood_furrow', 'rainfed']
    },
    requiredDocuments: [
      'Valid Land Record (RoR / 7/12 with water source entry)',
      'Electricity Bill / Borewell NOC',
      'Quotation from Empanelled Micro-Irrigation vendor',
      'Soil & Water Quality Test Report'
    ],
    applicationDeadline: '2026-11-15',
    daysRemaining: 78,
    officialPortalUrl: 'https://pmksy.gov.in'
  },
  {
    id: 'smam-farm-mechanization',
    code: 'SMAM',
    name: 'Sub-Mission on Agricultural Mechanization (Tractor & Implements)',
    category: 'subsidy',
    stateApplicability: ['ALL'],
    benefitsSummary: 'Financial assistance of 40% to 50% for procurement of modern agricultural machinery (Tractors, Rotavators, Power Tillers, Laser Levelers, Drone Sprayers).',
    maxBenefitAmount: '40% - 50% Subsidy (Up to ₹2,50,000)',
    subsidyPercentage: 50,
    eligibilityCriteria: {
      maxLandAcre: 15.0,
      taxPayerAllowed: true,
      requiresAadhaarLinkedBank: true,
      allowedFarmerCategories: ['marginal_small', 'medium', 'women_sc_st', 'fpo_member']
    },
    requiredDocuments: [
      'Aadhaar Card and Caste Certificate',
      'Land Record 7/12 / 8A',
      'Bank Passbook photocopy',
      'Authorized Dealer Machinery Proforma Invoice'
    ],
    applicationDeadline: '2026-09-30',
    daysRemaining: 32,
    officialPortalUrl: 'https://agrimachinery.nic.in'
  },
  {
    id: 'kusum-solar-pump',
    code: 'PM-KUSUM-B',
    name: 'PM-KUSUM Component-B (Standalone Solar Agriculture Pumps)',
    category: 'subsidy',
    stateApplicability: ['ALL'],
    benefitsSummary: 'Up to 60% Central + State Government subsidy for replacement of diesel / grid pumps with 3HP to 7.5HP off-grid Solar Powered Agriculture Pumps.',
    maxBenefitAmount: 'Up to 60% (~₹1,45,000 subsidy)',
    subsidyPercentage: 60,
    eligibilityCriteria: {
      minLandAcre: 1.0,
      maxLandAcre: 20.0,
      taxPayerAllowed: true,
      requiresAadhaarLinkedBank: true,
      requiredIrrigation: ['borewell_canal', 'flood_furrow', 'rainfed']
    },
    requiredDocuments: [
      'Land Record (7/12 extract showing boring / well source)',
      'Aadhaar Card copy',
      'Bank Account passbook linked to Aadhaar',
      'Groundwater NOC from District Authority'
    ],
    applicationDeadline: '2026-10-15',
    daysRemaining: 47,
    officialPortalUrl: 'https://pmkusum.mnre.gov.in'
  },
  {
    id: 'pkvy-organic',
    code: 'PKVY',
    name: 'Paramparagat Krishi Vikas Yojana (Organic Farming Cluster)',
    category: 'credit',
    stateApplicability: ['ALL'],
    benefitsSummary: 'Financial assistance of ₹50,000 per hectare for 3 years for organic cluster formation, PGS India organic certification, and bio-fertilizer procurement.',
    maxBenefitAmount: '₹50,000 / hectare / 3 years',
    eligibilityCriteria: {
      minLandAcre: 0.5,
      taxPayerAllowed: true,
      requiresAadhaarLinkedBank: true,
      allowedFarmerCategories: ['marginal_small', 'medium', 'women_sc_st', 'fpo_member']
    },
    requiredDocuments: [
      'PGS Organic Group Membership certificate',
      'Landholding documents',
      'Soil Health Card',
      'Aadhaar & Bank Passbook'
    ],
    applicationDeadline: '2026-11-30',
    daysRemaining: 93,
    officialPortalUrl: 'https://pgsindia-ncof.gov.in'
  }
];

// Vernacular localization dictionaries for Scheme Evaluation
const vernacularDictionary: Record<Language, {
  stateCovered: (state: string) => string;
  stateExcluded: (states: string, farmerState: string) => string;
  nonTaxPayerPassed: string;
  taxPayerExcluded: string;
  landPassed: (acre: number, max: number) => string;
  landExceeded: (acre: number, max: number) => string;
  cropApproved: (crop: string) => string;
  cropExcluded: (crop: string, approved: string) => string;
  categoryQualified: (cat: string) => string;
  irrigationMatched: (irrig: string) => string;
  soilCardVerified: string;
}> = {
  hi: {
    stateCovered: (s) => `आपका राज्य (${s}) योजना के दिशा-निर्देशों में पूर्णतः सम्मिलित है।`,
    stateExcluded: (st, fs) => `यह योजना केवल ${st} के लिए है (आपका खेत ${fs} में पंजीकृत है)।`,
    nonTaxPayerPassed: "आप गैर-आयकर दाता की अनिवार्य पात्रता शर्त को पूरा करते हैं।",
    taxPayerExcluded: "आयकर दाता व संस्थागत भू-स्वामी धारा 4.2 के तहत अपात्र हैं।",
    landPassed: (a, m) => `आपकी भूमि (${a} एकड़) निर्धारित सीमा (< ${m} एकड़) के अनुकूल है।`,
    landExceeded: (a, m) => `आपकी कुल भूमि (${a} एकड़) अधिकतम सीमा (${m} एकड़) से अधिक है।`,
    cropApproved: (c) => `आपकी बोई गई फसल (${c}) स्वीकृत प्राथमिकता सूची में शामिल है।`,
    cropExcluded: (c, a) => `आपकी फसल (${c}) इस योजना की सूची (${a}) में नहीं है।`,
    categoryQualified: (cat) => `आपकी किसान श्रेणी (${cat}) अधिकतम सरकारी अनुदान के लिए योग्य है।`,
    irrigationMatched: (i) => `आपकी सिंचाई विधि (${i}) उपकरण पात्रता से पूरी तरह मेल खाती है।`,
    soilCardVerified: "मृदा स्वास्थ्य कार्ड (Soil Health Card) आपके प्रोफाइल में सत्यापित है।"
  },
  mr: {
    stateCovered: (s) => `तुमचे राज्य (${s}) या योजनेच्या कार्यक्षेत्रात पूर्णपणे समाविष्ट आहे.`,
    stateExcluded: (st, fs) => `ही योजना फक्त ${st} साठी आहे (तुमची शेती ${fs} मध्ये आहे).`,
    nonTaxPayerPassed: "तुम्ही बिगर-आयकरदाते असल्यामुळे थेट अनुदानास पात्र आहात.",
    taxPayerExcluded: "आयकरदाते शेतकरी या योजनेसाठी अपात्र आहेत.",
    landPassed: (a, m) => `तुमची जमीन (${a} एकर) विहित मर्यादेत (< ${m} एकर) बसते.`,
    landExceeded: (a, m) => `तुमचे क्षेत्र (${a} एकर) कमाल मर्यादेपेक्षा (${m} एकर) जास्त आहे.`,
    cropApproved: (c) => `तुमचे पेरलेले पीक (${c}) अनुदान यादीत मंजूर आहे.`,
    cropExcluded: (c, a) => `तुमचे पीक (${c}) मंजूर पिकांच्या यादीत (${a}) नाही.`,
    categoryQualified: (cat) => `तुमचा शेतकरी प्रवर्ग (${cat}) कमाल अनुदानासाठी पात्र आहे.`,
    irrigationMatched: (i) => `तुमची सिंचन पद्धत (${i}) उपकरणांच्या निकषांशी जुळते.`,
    soilCardVerified: "मृदा आरोग्य पत्रिका (Soil Health Card) प्रोफाईलमध्ये पडताळलेली आहे."
  },
  te: {
    stateCovered: (s) => `మీ రాష్ట్రం (${s}) ఈ పథకంలో పూర్తిగా చేర్చబడింది.`,
    stateExcluded: (st, fs) => `ఈ పథకం ${st} రైతులకు మాత్రమే (మీ భూమి ${fs} లో ఉంది).`,
    nonTaxPayerPassed: "మీరు ఆదాయపు పన్ను చెల్లించని రైతుగా అర్హత కలిగి ఉన్నారు.",
    taxPayerExcluded: "ఆదాయపు పన్ను చెల్లించేవారు ఈ పథకానికి అనర్హులు.",
    landPassed: (a, m) => `మీ భూమి (${a} ఎకరాలు) అర్హత పరిమితి (< ${m} ఎకరాలు) లోపల ఉంది.`,
    landExceeded: (a, m) => `మీ భూమి (${a} ఎకరాలు) గరిష్ట పరిమితి (${m} ఎకరాలు) కంటే ఎక్కువ.`,
    cropApproved: (c) => `మీ పంట (${c}) ఆమోదించబడిన పంటల జాబితాలో ఉంది.`,
    cropExcluded: (c, a) => `మీ పంట (${c}) ఈ జాబితాలో (${a}) లేదు.`,
    categoryQualified: (cat) => `మీ రైతు వర్గం (${cat}) పూర్తి సబ్సిడీకి అర్హత పొందింది.`,
    irrigationMatched: (i) => `మీ సాగునీటి విధానం (${i}) అవసరాలకు సరిపోలుతుంది.`,
    soilCardVerified: "సాయిల్ హెల్త్ కార్డ్ ధృవీకరించబడింది."
  },
  ta: {
    stateCovered: (s) => `உங்கள் மாநிலம் (${s}) இத்திட்டத்தில் முழுமையாக சேர்க்கப்பட்டுள்ளது.`,
    stateExcluded: (st, fs) => `இத்திட்டம் ${st} விவசாயிகளுக்கு மட்டுமே (உங்கள் நிலம் ${fs} இல் உள்ளது).`,
    nonTaxPayerPassed: "வருமான வரி செலுத்தாத விவசாயி என்ற நிபந்தனையை பூர்த்தி செய்கிறீர்கள்.",
    taxPayerExcluded: "வருமான வரி செலுத்துபவர்கள் தகுதியற்றவர்கள்.",
    landPassed: (a, m) => `உங்கள் நிலம் (${a} ஏக்கர்) தகுதி வரம்பிற்குள் (< ${m} ஏக்கர்) உள்ளது.`,
    landExceeded: (a, m) => `உங்கள் நிலம் (${a} ஏக்கர்) அதிகபட்ச வரம்பை (${m} ஏக்கர்) தாண்டியுள்ளது.`,
    cropApproved: (c) => `உங்கள் பயிர் (${c}) அங்கீகரிக்கப்பட்ட பயிர் பட்டியலில் உள்ளது.`,
    cropExcluded: (c, a) => `உங்கள் பயிர் (${c}) பட்டியலில் (${a}) இல்லை.`,
    categoryQualified: (cat) => `உங்கள் விவசாயி பிரிவு (${cat}) அதிகபட்ச மானியத்திற்கு தகுதியானது.`,
    irrigationMatched: (i) => `உங்கள் பாசன முறை (${i}) பொருத்துகிறது.`,
    soilCardVerified: "மண் வள அட்டை சரிபார்க்கப்பட்டது."
  },
  kn: {
    stateCovered: (s) => `ನಿಮ್ಮ ರಾಜ್ಯ (${s}) ಈ ಯೋಜನೆಯಲ್ಲಿ ಸಂಪೂರ್ಣವಾಗಿ ಒಳಗೊಂಡಿದೆ.`,
    stateExcluded: (st, fs) => `ಈ ಯೋಜನೆ ಕೇವಲ ${st} ರೈತರಿಗೆ ಮಾತ್ರ (ನಿಮ್ಮ ಜಮೀನು ${fs} ನಲ್ಲಿದೆ).`,
    nonTaxPayerPassed: "ನೀವು ಆದಾಯ ತೆರಿಗೆ ಪಾವತಿಸದ ರೈತರಾಗಿದ್ದು ಅರ್ಹರಾಗಿದ್ದೀರಿ.",
    taxPayerExcluded: "ಆದಾಯ ತೆರಿಗೆ ಪಾವತಿಸುವವರು ಅನರ್ಹರು.",
    landPassed: (a, m) => `ನಿಮ್ಮ ಜಮೀನು (${a} ಎಕರೆ) ನಿಗದಿತ ಮಿತಿಯೊಳಗೆ (< ${m} ಎಕರೆ) ಇದೆ.`,
    landExceeded: (a, m) => `ನಿಮ್ಮ ಒಟ್ಟು ಜಮೀನು (${a} ಎಕರೆ) ಗರಿಷ್ಠ ಮಿತಿಗಿಂತ (${m} ಎಕರೆ) ಹೆಚ್ಚಿದೆ.`,
    cropApproved: (c) => `ನಿಮ್ಮ ಬೆಳೆ (${c}) ಅನುಮೋದಿತ ಪಟ್ಟಿಯಲ್ಲಿದೆ.`,
    cropExcluded: (c, a) => `ನಿಮ್ಮ ಬೆಳೆ (${c}) ಪಟ್ಟಿಯಲ್ಲಿ (${a}) ಇಲ್ಲ.`,
    categoryQualified: (cat) => `ನಿಮ್ಮ ರೈತ ವರ್ಗ (${cat}) ಗರಿಷ್ಠ ಸಬ್ಸಿಡಿಗೆ ಅರ್ಹವಾಗಿದೆ.`,
    irrigationMatched: (i) => `ನಿಮ್ಮ ನೀರಾವರಿ ಪದ್ಧತಿ (${i}) ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತದೆ.`,
    soilCardVerified: "ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ."
  },
  gu: {
    stateCovered: (s) => `તમારું રાજ્ય (${s}) આ યોજનામાં સંપૂર્ણપણે સામેલ છે.`,
    stateExcluded: (st, fs) => `આ યોજના માત્ર ${st} માટે છે (તમારી જમીન ${fs} માં છે).`,
    nonTaxPayerPassed: "તમે બિન-આવકવેરા દાતાની શરત પૂર્ણ કરો છો.",
    taxPayerExcluded: "આવકવેરો ભરતા ખેડૂતો આ યોજના માટે અપાત્ર છે.",
    landPassed: (a, m) => `તમારી જમીન (${a} એકર) નિર્ધારિત મર્યાદા (< ${m} એકર) માં છે.`,
    landExceeded: (a, m) => `તમારી જમીન (${a} એકર) મહત્તમ મર્યાદા (${m} એકર) કરતા વધારે છે.`,
    cropApproved: (c) => `તમારો પાક (${c}) મંજૂર યાદીમાં છે.`,
    cropExcluded: (c, a) => `તમારો પાક (${c}) યોજનાની યાદી (${a}) માં નથી.`,
    categoryQualified: (cat) => `તમારી ખેડૂત શ્રેણી (${cat}) મહત્તમ સબસિડી માટે લાયક છે.`,
    irrigationMatched: (i) => `તમારી સિંચાઈ પદ્ધતિ (${i}) યોગ્ય છે.`,
    soilCardVerified: "સોઇલ હેલ્થ કાર્ડ ચકાસાયેલ છે."
  },
  pa: {
    stateCovered: (s) => `ਤੁਹਾਡਾ ਰਾਜ (${s}) ਇਸ ਸਕੀਮ ਵਿੱਚ ਪੂਰੀ ਤਰ੍ਹਾਂ ਸ਼ਾਮਲ ਹੈ।`,
    stateExcluded: (st, fs) => `ਇਹ ਸਕੀਮ ਸਿਰਫ ${st} ਲਈ ਹੈ (ਤੁਹਾਡੀ ਜ਼ਮੀਨ ${fs} ਵਿੱਚ ਹੈ)।`,
    nonTaxPayerPassed: "ਤੁਸੀਂ ਗੈਰ-ਆਮਦਨ ਟੈਕਸ ਦਾਤਾ ਵਜੋਂ ਯੋਗ ਹੋ।",
    taxPayerExcluded: "ਇਨਕਮ ਟੈਕਸ ਭਰਨ ਵਾਲੇ ਅਯੋਗ ਹਨ।",
    landPassed: (a, m) => `ਤੁਹਾਡੀ ਜ਼ਮੀਨ (${a} ਏਕੜ) ਨਿਰਧਾਰਤ ਸੀਮਾ (< ${m} ਏਕੜ) ਦੇ ਅੰਦਰ ਹੈ।`,
    landExceeded: (a, m) => `ਤੁਹਾਡੀ ਜ਼ਮੀਨ (${a} ਏਕੜ) ਵੱਧ ਤੋਂ ਵੱਧ ਸੀਮਾ (${m} ਏਕੜ) ਤੋਂ ਵੱਧ ਹੈ।`,
    cropApproved: (c) => `ਤੁਹਾਡੀ ਫਸਲ (${c}) ਮਨਜ਼ੂਰਸ਼ੁਦਾ ਸੂਚੀ ਵਿੱਚ ਹੈ।`,
    cropExcluded: (c, a) => `ਤੁਹਾਡੀ ਫਸਲ (${c}) ਸੂਚੀ (${a}) ਵਿੱਚ ਨਹੀਂ ਹੈ।`,
    categoryQualified: (cat) => `ਤੁਹਾਡੀ ਕਿਸਾਨ ਸ਼੍ਰੇਣੀ (${cat}) ਵੱਧ ਤੋਂ ਵੱਧ ਸਬਸਿਡੀ ਲਈ ਯੋਗ ਹੈ।`,
    irrigationMatched: (i) => `ਤੁਹਾਡਾ ਸਿੰਚਾਈ ਤਰੀਕਾ (${i}) ਢੁਕਵਾਂ ਹੈ।`,
    soilCardVerified: "ਸੋਇਲ ਹੈਲਥ ਕਾਰਡ ਵੈਰੀਫਾਈ ਹੋ ਗਿਆ ਹੈ।"
  },
  bn: {
    stateCovered: (s) => `আপনার রাজ্য (${s}) এই প্রকল্পের আওতাভুক্ত।`,
    stateExcluded: (st, fs) => `এই প্রকল্প শুধুমাত্র ${st} এর জন্য (আপনার জমি ${fs} এ রয়েছে)।`,
    nonTaxPayerPassed: "আপনি অ-আয়কর দাতা হিসাবে সম্পূর্ণ যোগ্য।",
    taxPayerExcluded: "আয়কর দাতারা এই প্রকল্পের জন্য অযোগ্য।",
    landPassed: (a, m) => `আপনার জমি (${a} একর) নির্ধারিত সীমার (< ${m} একর) মধ্যে রয়েছে।`,
    landExceeded: (a, m) => `আপনার মোট জমি (${a} একর) সর্বোচ্চ সীমার (${m} একর) বেশি।`,
    cropApproved: (c) => `আপনার ফসল (${c}) অনুমোদিত তালিকায় রয়েছে।`,
    cropExcluded: (c, a) => `আপনার ফসল (${c}) এই তালিকায় (${a}) নেই।`,
    categoryQualified: (cat) => `আপনার কৃষক বিভাগ (${cat}) সর্বোচ্চ ভরতুকির জন্য যোগ্য।`,
    irrigationMatched: (i) => `আপনার সেচ পদ্ধতি (${i}) উপযুক্ত।`,
    soilCardVerified: "মাটি স্বাস্থ্য কার্ড যাচাই করা হয়েছে।"
  },
  en: {
    stateCovered: (s) => `Your state (${s}) is fully covered under the operational guidelines.`,
    stateExcluded: (st, fs) => `Scheme is exclusive to farmers in ${st} (Your farm is registered in ${fs}).`,
    nonTaxPayerPassed: "You meet the non-income tax payer criterion for 100% direct benefit transfer.",
    taxPayerExcluded: "Institutional landholders and income tax paying individuals are legally excluded.",
    landPassed: (a, m) => `Your landholding of ${a} acres falls comfortably within the < ${m} acres limit.`,
    landExceeded: (a, m) => `Your landholding (${a} acres) exceeds the maximum ceiling of ${m} acres.`,
    cropApproved: (c) => `Your sown crop (${c}) is in the priority approved list for this benefit.`,
    cropExcluded: (c, a) => `Your crop (${c}) is not among the mandated crops (${a}).`,
    categoryQualified: (cat) => `Your farmer classification (${cat}) qualifies for maximum subsidy slab.`,
    irrigationMatched: (i) => `Your irrigation method (${i}) matches the target equipment criteria.`,
    soilCardVerified: "Soil Health Card requirement already verified in your digital profile."
  }
};

export function matchSchemesForFarmer(farmer: FarmerProfile, lang: Language = 'hi'): SchemeMatchResult[] {
  const dict = vernacularDictionary[lang] || vernacularDictionary.hi;

  return agriculturalSchemes.map(scheme => {
    let score = 100;
    const whyEligible: string[] = [];
    const whyNotEligible: string[] = [];

    // State check
    if (!scheme.stateApplicability.includes('ALL') && !scheme.stateApplicability.includes(farmer.state)) {
      score -= 50;
      whyNotEligible.push(dict.stateExcluded(scheme.stateApplicability.join(', '), farmer.state));
    } else {
      whyEligible.push(dict.stateCovered(farmer.state));
    }

    // Taxpayer check (PM-KISAN excludes income tax payers)
    if (scheme.eligibilityCriteria.taxPayerAllowed === false && farmer.isTaxPayer) {
      score -= 40;
      whyNotEligible.push(dict.taxPayerExcluded);
    } else if (scheme.eligibilityCriteria.taxPayerAllowed === false && !farmer.isTaxPayer) {
      whyEligible.push(dict.nonTaxPayerPassed);
    }

    // Land Size check
    if (scheme.eligibilityCriteria.maxLandAcre && farmer.totalAcreage > scheme.eligibilityCriteria.maxLandAcre) {
      score -= 30;
      whyNotEligible.push(dict.landExceeded(farmer.totalAcreage, scheme.eligibilityCriteria.maxLandAcre));
    } else if (scheme.eligibilityCriteria.maxLandAcre) {
      whyEligible.push(dict.landPassed(farmer.totalAcreage, scheme.eligibilityCriteria.maxLandAcre));
    }

    // Crop match check
    if (scheme.eligibilityCriteria.applicableCrops && !scheme.eligibilityCriteria.applicableCrops.includes('ALL')) {
      if (scheme.eligibilityCriteria.applicableCrops.includes(farmer.crop)) {
        whyEligible.push(dict.cropApproved(farmer.cropNameEn));
      } else {
        score -= 35;
        whyNotEligible.push(dict.cropExcluded(farmer.cropNameEn, scheme.eligibilityCriteria.applicableCrops.join(', ')));
      }
    }

    // Farmer Category check
    if (scheme.eligibilityCriteria.allowedFarmerCategories && !scheme.eligibilityCriteria.allowedFarmerCategories.includes(farmer.farmerCategory)) {
      score -= 25;
      whyNotEligible.push(dict.categoryQualified(scheme.eligibilityCriteria.allowedFarmerCategories.join(', ')));
    } else if (scheme.eligibilityCriteria.allowedFarmerCategories) {
      whyEligible.push(dict.categoryQualified(farmer.farmerCategory.replace('_', ' ')));
    }

    // Irrigation setup
    if (scheme.eligibilityCriteria.requiredIrrigation && scheme.eligibilityCriteria.requiredIrrigation.includes(farmer.irrigationType)) {
      whyEligible.push(dict.irrigationMatched(farmer.irrigationType));
    }

    // Document readiness
    if (farmer.hasSoilHealthCard && scheme.requiredDocuments.some(d => d.includes('Soil Health Card'))) {
      whyEligible.push(dict.soilCardVerified);
    }

    // Final score clamping
    score = Math.max(10, Math.min(98, score));
    const isEligible = whyNotEligible.length === 0 && score >= 70;

    const nextSteps = isEligible
      ? [
          `KYC: ${scheme.requiredDocuments.slice(0, 2).join(', ')}`,
          `Deadline: ${scheme.applicationDeadline} (${scheme.daysRemaining} days remaining)`
        ]
      : [
          whyNotEligible[0] || 'Check alternate state welfare schemes.'
        ];

    return {
      scheme,
      matchScore: score,
      isEligible,
      whyEligiblePoints: whyEligible,
      whyNotEligiblePoints: whyNotEligible,
      nextSteps,
      potentialBenefit: scheme.maxBenefitAmount
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}
