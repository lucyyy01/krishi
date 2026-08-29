import { FarmerProfile, Language, DailyAction, SimulationResult, FarmRiskScore, ProactiveAlert } from '../types';

export function generateTodaysActionPlan(farmer: FarmerProfile, language: Language = 'en'): DailyAction[] {
  const actions: DailyAction[] = [];
  const { weather, crop, cropStage, soilMoisture, totalAcreage, cropNameEn, cropStageName, district } = farmer;

  const isRain = weather.rainProbability >= 60 || weather.expectedRainfallMm >= 10;
  const waterSaved = Math.round(totalAcreage * 22000);
  const pumpCostSaved = Math.round(totalAcreage * 340);
  const medicineSaved = Math.round(totalAcreage * 1250);
  const insuranceCover = (totalAcreage * 35000).toLocaleString();
  const insurancePremium = Math.round(totalAcreage * 700);

  // Helper translations for Action 1: Irrigation
  const irrigationTexts: Record<Language, { title: string; text: string; reason: string; timing: string; savings: string }> = {
    en: {
      title: isRain ? "🛑 DO NOT WATER (IRRIGATE) TODAY — RAIN IS COMING" : soilMoisture < 45 ? "✅ IRRIGATE YOUR CROP TODAY (SOIL IS DRY)" : "🟢 SOIL MOISTURE IS OPTIMAL — NO WATER NEEDED",
      text: isRain 
        ? `Do NOT turn on motor pump or open canal water today. Rain is expected in ${weather.rainForecastWindow} (${weather.rainProbability}% chance, ~${weather.expectedRainfallMm} mm rain).`
        : soilMoisture < 45 
        ? `Soil moisture has dropped to ${soilMoisture}%. Turn on drip or tube-well water for 3 to 4 hours today during cool hours.`
        : `Soil moisture is at a healthy ${soilMoisture}%. Crop has enough moisture for today.`,
      reason: isRain 
        ? `Soil already has good moisture (${soilMoisture}%). If you give water today, the field will become flooded mud, roots will rot, and fertilizer will wash away into drains.`
        : soilMoisture < 45 
        ? `Crop is in '${cropStageName}'. Plants need moisture right now to form healthy flowers and grains. Dry soil will cause flower drop.`
        : `Leaves are green and upright. Weather is pleasant. Save your pump electricity.`,
      timing: isRain ? "Wait 48 Hours (Recheck soil after rain)" : "Morning (6 AM - 9 AM) or Evening (5 PM - 7 PM)",
      savings: isRain ? `💰 Saves ~${waterSaved.toLocaleString()} L water & ₹${pumpCostSaved} in electricity/diesel!` : "Protects 20% yield from moisture stress."
    },
    hi: {
      title: isRain ? "🛑 आज खेत में पानी (सिंचाई) मत दीजिए — कल बारिश है" : soilMoisture < 45 ? "✅ आज खेत में पानी जरूर दें (जमीन सूख रही है)" : "🟢 मिट्टी में नमी उत्तम है — आज पानी की जरूरत नहीं",
      text: isRain 
        ? `आज मोटर पंप या नहर का पानी बिल्कुल न चलाएं। ${weather.rainForecastWindow} में बारिश का अनुमान है (${weather.rainProbability}% संभावना, ~${weather.expectedRainfallMm} mm बारिश)।`
        : soilMoisture < 45 
        ? `मिट्टी में नमी घटकर ${soilMoisture}% रह गई है। आज सुबह या शाम के समय ड्रिप या ट्यूबवेल से ३-४ घंटे पानी दें।`
        : `मिट्टी में नमी ${soilMoisture}% पर संतुलित है। आज फसल के लिए पर्याप्त पानी मौजूद है।`,
      reason: isRain 
        ? `जमीन में पहले से ${soilMoisture}% नमी है। आज पानी दिया तो खेत में कीचड़ भरेगा, जड़ें सड़ेंगी और खाद नालियों में बह जाएगी।`
        : soilMoisture < 45 
        ? `फसल अभी '${cropStageName}' में है। फूल और दाने बनने के लिए पानी जरूरी है, सूखा रहने पर फूल झड़ जाएंगे।`
        : `पत्ते हरे और सीधे हैं। मौसम अनुकूल है। बिजली की बचत करें।`,
      timing: isRain ? "बारिश के २ दिन बाद तक रुकें" : "सुबह ६ से ९ बजे या शाम ५ से ७ बजे",
      savings: isRain ? `💰 ~${waterSaved.toLocaleString()} लीटर पानी और ₹${pumpCostSaved} बिजली बिल की सीधी बचत!` : "फसल को सूखने से बचाकर २०% पैदावार सुरक्षित करता है।"
    },
    mr: {
      title: isRain ? "🛑 आज पिकाला पाणी (सिंचन) देऊ नका — उद्या पाऊस आहे" : soilMoisture < 45 ? "✅ आज पिकाला पाणी द्या (जमीन सुकत आहे)" : "🟢 जमिनीतील ओलावा उत्तम आहे — आज पाण्याची गरज नाही",
      text: isRain 
        ? `आज मोटर पंप किंवा पाटाचे पाणी अजिबात चालू करू नका. ${weather.rainForecastWindow} दरम्यान पावसाचा अंदाज आहे (${weather.rainProbability}% शक्यता, ~${weather.expectedRainfallMm} mm पाऊस).`
        : soilMoisture < 45 
        ? `जमिनीतील ओलावा ${soilMoisture}% पर्यंत कमी झाला आहे. आज सकाळी किंवा संध्याकाळी ३ ते ४ तास ठिबक किंवा मोटर चालवा.`
        : `जमिनीतील ओलावा ${soilMoisture}% संतुलित आहे. आज पिकासाठी पुरेसे पाणी उपलब्ध आहे.`,
      reason: isRain 
        ? `जमिनीत आधीच ${soilMoisture}% ओलावा आहे. आज पाणी दिले तर मुळे सडतील आणि खत वाहून जाईल.`
        : soilMoisture < 45 
        ? `पीक आता '${cropStageName}' अवस्थेत आहे. फुलधारणा व दाणे भरण्यासाठी ओलावा आवश्यक आहे.`
        : `पिकाची पाने टवटवीत आहेत. वीज बिलाची बचत करा.`,
      timing: isRain ? "पाऊस थांबल्यानंतर २ दिवस थांबा" : "सकाळी ६ ते ९ किंवा संध्याकाळी ५ ते ७",
      savings: isRain ? `💰 ~${waterSaved.toLocaleString()} लिटर पाणी आणि ₹${pumpCostSaved} वीज बिलाची बचत!` : "फुलगळ रोखून २०% उत्पादन सुरक्षित करते."
    },
    te: {
      title: isRain ? "🛑 ఈరోజు పొలానికి నీరు పెట్టవద్దు — రేపు వర్షం ఉంది" : "✅ ఈరోజు పంటకు నీరు పెట్టండి (తేమ తగ్గింది)",
      text: isRain ? `${weather.rainForecastWindow} లో ${weather.expectedRainfallMm} mm వర్షం పడే అవకాశం ఉంది (${weather.rainProbability}%).` : `తేమ ${soilMoisture}% కు పడిపోయింది. ఈరోజు 3-4 గంటలు నీరు పెట్టండి.`,
      reason: isRain ? `ఇప్పటికే నేలలో తేమ ఉంది. నీరు పెడితే వేర్లు కుళ్ళిపోతాయి మరియు ఎరువులు కొట్టుకుపోతాయి.` : `పంట '${cropStageName}' దశలో ఉంది, తేమ అవసరం.`,
      timing: isRain ? "వర్షం తగ్గిన 2 రోజుల వరకు వేచి ఉండండి" : "ఉదయం 6-9 లేదా సాయంత్రం 5-7",
      savings: isRain ? `💰 ~${waterSaved.toLocaleString()} లీటర్ల నీరు & ₹${pumpCostSaved} ఆదా!` : "దిగుబడిని కాపాడుతుంది."
    },
    ta: {
      title: isRain ? "🛑 இன்று தண்ணீர் பாய்ச்ச வேண்டாம் — மழை வரக்கூடும்" : "✅ இன்று பயிருக்கு தண்ணீர் பாய்ச்சவும்",
      text: isRain ? `${weather.rainForecastWindow} நேரத்தில் ${weather.expectedRainfallMm} mm மழை வாய்ப்பு உள்ளது.` : `மண்ணில் ஈரம் ${soilMoisture}% ஆக குறைந்துள்ளது.`,
      reason: isRain ? `மழைக்கு முன் தண்ணீர் பாய்ச்சினால் வேர்கள் அழுகி உரம் வீணாகும்.` : `பயிர் வளர்ச்சிக்கு நீர் தேவை.`,
      timing: isRain ? "2 நாட்கள் காத்திருக்கவும்" : "காலை அல்லது மாலை நேரம்",
      savings: isRain ? `💰 ~${waterSaved.toLocaleString()} லிட்டர் நீர் சேமிப்பு!` : "மகசூலை பாதுகாக்கும்."
    },
    kn: {
      title: isRain ? "🛑 ಇಂದು ಬೆಳೆಗೆ ನೀರು ಹಾಯಿಸಬೇಡಿ — ಮಳೆ ಬರುವ ಸಾಧ್ಯತೆ ಇದೆ" : "✅ ಇಂದು ಬೆಳೆಗೆ ನೀರು ಹಾಯಿಸಿ",
      text: isRain ? `${weather.rainForecastWindow} ಸಮಯದಲ್ಲಿ ಮಳೆಯಾಗುವ ಮುನ್ಸೂಚನೆ ಇದೆ (${weather.rainProbability}%).` : `ಮಣ್ಣಿನ ತೇವಾಂಶ ${soilMoisture}% ಕ್ಕೆ ಇಳಿದಿದೆ.`,
      reason: isRain ? `ಈಗಾಗಲೇ ತೇವಾಂಶವಿದೆ. ನೀರು ಹಾಯಿಸಿದರೆ ಬೇರು ಕೊಳೆತು ಗೊಬ್ಬರ ಕೊಚ್ಚಿಹೋಗುತ್ತದೆ.` : `ಹೂವು ಮತ್ತು ಕಾಳು ಕಟ್ಟಲು ತೇವಾಂಶ ಬೇಕು.`,
      timing: isRain ? "ಮಳೆ ನಿಂತ 2 ದಿನಗಳ ನಂತರ ಪರಿಶೀಲಿಸಿ" : "ಬೆಳಿಗ್ಗೆ 6-9 ಅಥವಾ ಸಂಜೆ 5-7",
      savings: isRain ? `💰 ~${waterSaved.toLocaleString()} ಲೀಟರ್ ನೀರು ಉಳಿತಾಯ!` : "ಇಳುವರಿ ರಕ್ಷಿಸುತ್ತದೆ."
    },
    gu: {
      title: isRain ? "🛑 આજે પાકમાં પિયત ન આપો — વરસાદની આગાહી છે" : "✅ આજે પાકને પિયત આપો",
      text: isRain ? `${weather.rainForecastWindow} માં વરસાદની ${weather.rainProbability}% શક્યતા છે.` : `જમીનમાં ભેજ ઘટીને ${soilMoisture}% થઈ ગયો છે.`,
      reason: isRain ? `જમીનમાં પહેલેથી ભેજ છે. પાણી આપવાથી મૂળ સડી જશે અને ખાતર ધોવાઈ જશે.` : `ફૂલ અને દાણા બેસવા માટે પાણી જરૂરી છે.`,
      timing: isRain ? "વરસાદ પછી 2 દિવસ રાહ જુઓ" : "સવારે અથવા સાંજે",
      savings: isRain ? `💰 ~${waterSaved.toLocaleString()} લીટર પાણી અને ₹${pumpCostSaved} ની બચત!` : "ઉત્પાદન સુરક્ષિત કરે છે."
    },
    pa: {
      title: isRain ? "🛑 ਅੱਜ ਖੇਤ ਨੂੰ ਪਾਣੀ ਨਾ ਲਾਓ — ਮੀਂਹ ਪੈਣ ਵਾਲਾ ਹੈ" : "✅ ਅੱਜ ਖੇਤ ਨੂੰ ਪਾਣੀ ਲਾਓ",
      text: isRain ? `${weather.rainForecastWindow} ਦੌਰਾਨ ਮੀਂਹ ਦੀ ${weather.rainProbability}% ਸੰਭਾਵਨਾ ਹੈ।` : `ਮਿੱਟੀ ਵਿੱਚ ਨਮੀ ਘੱਟ ਕੇ ${soilMoisture}% ਰਹਿ ਗਈ ਹੈ।`,
      reason: isRain ? `ਪਾਣੀ ਲਾਉਣ ਨਾਲ ਜੜ੍ਹਾਂ ਗਲ ਜਾਣਗੀਆਂ ਅਤੇ ਖਾਦ ਰੁੜ੍ਹ ਜਾਵੇਗੀ।` : `ਫਸਲ ਨੂੰ ਵਾਧੇ ਲਈ ਪਾਣੀ ਦੀ ਲੋੜ ਹੈ।`,
      timing: isRain ? "ਮੀਂਹ ਰੁਕਣ ਤੋਂ 2 ਦਿਨ ਬਾਅਦ ਤੱਕ ਉਡੀਕ ਕਰੋ" : "ਸਵੇਰੇ ਜਾਂ ਸ਼ਾਮ ਨੂੰ",
      savings: isRain ? `💰 ~${waterSaved.toLocaleString()} ਲੀਟਰ ਪਾਣੀ ਅਤੇ ₹${pumpCostSaved} ਦੀ ਬੱਚਤ!` : "ਝਾੜ ਬਚਾਉਂਦਾ ਹੈ।"
    },
    bn: {
      title: isRain ? "🛑 আজ সেচ দেবেন না — বৃষ্টির সম্ভাবনা আছে" : "✅ আজ জমিতে সেচ দিন",
      text: isRain ? `${weather.rainForecastWindow} সময়ে বৃষ্টির ${weather.rainProbability}% সম্ভাবনা রয়েছে।` : `মাটিতে আর্দ্রতা কমে ${soilMoisture}% হয়েছে।`,
      reason: isRain ? `বৃষ্টির আগে সেচ দিলে শিকড় পচে যাবে এবং সার ধুয়ে যাবে।` : `ফসলের বৃদ্ধির জন্য পানি প্রয়োজন।`,
      timing: isRain ? "বৃষ্টি থামার ২ দিন পর" : "সকাল বা বিকেলে",
      savings: isRain ? `💰 ~${waterSaved.toLocaleString()} লিটার পানি সাশ্রয়!` : "ফলন সুরক্ষিত রাখে।"
    }
  };

  const irInfo = irrigationTexts[language] || irrigationTexts.en;

  actions.push({
    id: 'act-irrigation',
    title: irInfo.title,
    category: 'irrigation',
    urgency: isRain ? 'critical' : soilMoisture < 45 ? 'critical' : 'optimal',
    actionText: irInfo.text,
    reasoning: irInfo.reason,
    timingWindow: irInfo.timing,
    savingsImpact: irInfo.savings,
    iconName: isRain ? 'DropletOff' : 'Droplets',
    details: [
      `Soil moisture: ${soilMoisture}%`,
      `Rain probability: ${weather.rainProbability}% (${weather.expectedRainfallMm} mm in ${weather.rainForecastWindow})`,
      `Farm area: ${totalAcreage} Acres (${district})`
    ]
  });

  // Action 2: Pest & Disease
  const pestTexts: Record<Language, { title: string; text: string; reason: string; timing: string; savings: string }> = {
    en: {
      title: isRain ? "🛑 DO NOT SPRAY PESTICIDES TODAY (RAIN WASHOUT RISK)" : "🔍 INSPECT PLANTS FOR SUCKING PESTS & WHITEFLIES",
      text: isRain 
        ? "Do not spray chemical insecticides or foliar sprays today. Rain will wash 90% of your expensive medicine straight into the mud."
        : "Walk your field and check under the bottom leaves of 10-15 random plants for tiny whiteflies and leaf curl.",
      reason: isRain 
        ? "Pesticides require at least 5-6 hours of dry sunshine to stick and kill insects. Rain makes sprays ineffective and breeds resistant pests."
        : "Early detection saves 3x spraying costs later.",
      timing: isRain ? "Wait for clear sun (Thursday 7:30 AM)" : "Today 8:00 AM - 11:00 AM",
      savings: isRain ? `💰 Saves ₹${medicineSaved} of wasted spray chemical!` : "Prevents severe crop damage."
    },
    hi: {
      title: isRain ? "🛑 आज कीटनाशक दवाई का छिड़काव न करें (बारिश से धुल जाएगी)" : "🔍 खेत में जाकर पत्तों के नीचे सफेद मक्खी व कीट की जांच करें",
      text: isRain 
        ? "आज कोई भी रासायनिक कीटनाशक न छिड़कें। बारिश से ९०% महंगी दवाई धुल जाएगी और कीड़े नहीं मरेंगे।"
        : "खेत में १०-१५ पौधों के निचले पत्तों को पलटकर सफेद मक्खी और पीले धब्बों की जांच करें।",
      reason: isRain 
        ? "दवाई को चिपकने के लिए कम से कम ५-६ घंटे तेज धूप चाहिए। बारिश से दवाई धुलने पर पैसे बर्बाद होते हैं।"
        : "शुरुआत में ही कीट पकड़ने से बाद का तिगुना खर्च बचता है।",
      timing: isRain ? "बारिश बाद साफ धूप में (गुरुवार सुबह ७:३० बजे)" : "आज सुबह ८ से ११ बजे",
      savings: isRain ? `💰 ₹${medicineSaved} की महंगी दवाई की बर्बादी से बचाव!` : "फसल सुरक्षा।"
    },
    mr: {
      title: isRain ? "🛑 आज कीटकनाशक फवारणी करू नका (पावसाने औषध वाहून जाईल)" : "🔍 शेतात जाऊन पांढरी माशी व कीड तपासा",
      text: isRain 
        ? "आज कोणतीही रासायनिक फवारणी करू नका. पावसामुळे औषध वाहून जाऊन पैसे वाया जातील."
        : "शेतातील १०-१५ झाडांच्या पानांखाली पांढरी माशी किंवा पिवळे डाग तपासा.",
      reason: isRain 
        ? "औषध टिकण्यासाठी ५-६ तास कडक ऊन आवश्यक असते. पावसामुळे फवारणी निष्फळ ठरते."
        : "सुरुवातीलाच कीड ओळखल्यास फवारणीचा खर्च वाचतो.",
      timing: isRain ? "पाऊस संपल्यावर गुरुवारी सकाळी" : "आज सकाळी ८ ते ११",
      savings: isRain ? `💰 ₹${medicineSaved} किमतीच्या औषधाची बचत!` : "पिकाचे रक्षण."
    },
    te: {
      title: isRain ? "🛑 ఈరోజు పురుగుమందు పిచికారీ చేయవద్దు" : "🔍 తెగుళ్లు మరియు పురుగులను పరిశీలించండి",
      text: isRain ? "వర్షం వల్ల 90% మందు కొట్టుకుపోతుంది." : "ఆకుల కింద తెల్లదోమ ఉందేమో చూడండి.",
      reason: isRain ? "మందు పనిచేయడానికి ఎండ అవసరం." : "ముందుగా గుర్తిస్తే ఖర్చు తగ్గుతుంది.",
      timing: isRain ? "వర్షం తగ్గిన తర్వాత" : "ఉదయం వేళ",
      savings: `💰 ₹${medicineSaved} ఆదా!`
    },
    ta: {
      title: isRain ? "🛑 இன்று பூச்சிக்கொல்லி தெளிக்க வேண்டாம்" : "🔍 இலைகளில் பூச்சிகளை ஆய்வு செய்யவும்",
      text: isRain ? "மழையால் மருந்து வீணாகும்." : "இலைகளுக்கு அடியில் வெள்ளை ஈக்கள் உள்ளதா என பார்க்கவும்.",
      reason: isRain ? "மருந்து செயல்பட வெயில் தேவை." : "ஆரம்பத்திலேயே கண்டறிந்தால் செலவு குறையும்.",
      timing: isRain ? "மழை நின்ற பிறகு" : "காலை நேரம்",
      savings: `💰 ₹${medicineSaved} சேமிப்பு!`
    },
    kn: {
      title: isRain ? "🛑 ಇಂದು ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಬೇಡಿ" : "🔍 ಗಿಡಗಳಲ್ಲಿ ಕೀಟಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
      text: isRain ? "ಮಳೆಯಿಂದ ಔಷಧಿ ಕೊಚ್ಚಿಹೋಗುತ್ತದೆ." : "ಎಲೆಗಳ ಕೆಳಗೆ ಬಿಳಿ ನೊಣಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ.",
      reason: isRain ? "ಔಷಧಿ ಪರಿಣಾಮಕ್ಕೆ ಬಿಸಿಲು ಬೇಕು." : "ಮುಂಚಿತವಾಗಿ ರೋಗ ತಡೆಯಬಹುದು.",
      timing: isRain ? "ಮಳೆ ನಿಂತ ನಂತರ" : "ಬೆಳಿಗ್ಗೆ",
      savings: `💰 ₹${medicineSaved} ಉಳಿತಾಯ!`
    },
    gu: {
      title: isRain ? "🛑 આજે દવાનો છંટકાવ ન કરો" : "🔍 છોડ પર જીવાતની તપાસ કરો",
      text: isRain ? "વરસાદથી દવા ધોવાઈ જશે." : "પાંદડા નીચે સફેદ માખીની તપાસ કરો.",
      reason: isRain ? "દવા માટે તડકો જરૂરી છે." : "શરૂઆતમાં રોકવાથી ખર્ચ બચે છે.",
      timing: isRain ? "વરસાદ પછી" : "સવારે",
      savings: `💰 ₹${medicineSaved} ની બચત!`
    },
    pa: {
      title: isRain ? "🛑 ਅੱਜ ਸਪਰੇਅ ਨਾ ਕਰੋ (ਮੀਂਹ ਨਾਲ ਧੁਲ ਜਾਵੇਗੀ)" : "🔍 ਪੱਤਿਆਂ ਦੀ ਜਾਂਚ ਕਰੋ",
      text: isRain ? "ਮੀਂਹ ਨਾਲ ਦਵਾਈ ਰੁੜ੍ਹ ਜਾਵੇਗੀ।" : "ਚਿੱਟੀ ਮੱਖੀ ਦੀ ਜਾਂਚ ਕਰੋ।",
      reason: isRain ? "ਦਵਾਈ ਲਈ ਧੁੱਪ ਦੀ ਲੋੜ ਹੈ।" : "ਖਰਚਾ ਬਚਦਾ ਹੈ।",
      timing: isRain ? "ਮੀਂਹ ਤੋਂ ਬਾਅਦ" : "ਸਵੇਰੇ",
      savings: `💰 ₹${medicineSaved} ਦੀ ਬੱਚਤ!`
    },
    bn: {
      title: isRain ? "🛑 আজ কীটনাশক স্প্রে করবেন না" : "🔍 গাছে পোকার আক্রমণ পরীক্ষা করুন",
      text: isRain ? "বৃষ্টিতে ওষুধ ধুয়ে নষ্ট হবে।" : "পাতার নিচে সাদা মাছি আছে কিনা দেখুন।",
      reason: isRain ? "ওষুধের জন্য রোদ দরকার।" : "খরচ বাঁচে।",
      timing: isRain ? "বৃষ্টির পর" : "সকালে",
      savings: `💰 ₹${medicineSaved} সাশ্রয়!`
    }
  };

  const pestInfo = pestTexts[language] || pestTexts.en;

  actions.push({
    id: 'act-pest',
    title: pestInfo.title,
    category: 'pest_disease',
    urgency: isRain ? 'critical' : 'warning',
    actionText: pestInfo.text,
    reasoning: pestInfo.reason,
    timingWindow: pestInfo.timing,
    savingsImpact: pestInfo.savings,
    iconName: isRain ? 'ShieldAlert' : 'Bug',
    details: [
      `Weather humidity: ${weather.humidity}%`,
      'Trap recommendation: 10 yellow sticky trap sheets per acre'
    ]
  });

  // Action 3: Schemes
  const schemeTitles: Record<Language, { title: string; text: string; reason: string }> = {
    en: {
      title: "💰 GET PMFBY CROP INSURANCE (LAST 17 DAYS LEFT)",
      text: `Enroll your ${cropNameEn} before September 15 for ₹${insurancePremium} to protect ₹${insuranceCover} harvest.`,
      reason: "Guarantees financial protection against floods, drought, and pest damage."
    },
    hi: {
      title: "💰 प्रधानमंत्री फसल बीमा योजना (PMFBY) — अंतिम १७ दिन शेष",
      text: `१५ सितंबर से पहले केवल ₹${insurancePremium} प्रीमियम देकर अपनी ₹${insuranceCover} की फसल का बीमा कराएं।`,
      reason: "भारी बारिश, सूखा या कीट प्रकोप से फसल नष्ट होने पर शत-प्रतिशत क्लेम सुरक्षा।"
    },
    mr: {
      title: "💰 प्रधानमंत्री पीक विमा योजना — शेवटचे १७ दिवस शिल्लक",
      text: `१५ सप्टेंबरपूर्वी फक्त ₹${insurancePremium} भरून आपल्या ₹${insuranceCover} किमतीच्या पिकाचा विमा उतरावा.`,
      reason: "अतिवृष्टी किंवा दुष्काळात होणाऱ्या नुकसानापासून १००% आर्थिक संरक्षण."
    },
    te: {
      title: "💰 PMFBY పంటల బీమా — చివరి 17 రోజులు",
      text: `సెప్టెంబర్ 15 లోపు ₹${insurancePremium} తో ₹${insuranceCover} విలువైన పంటకు బీమా చేయండి.`,
      reason: "ప్రకృతి వైపరీత్యాల నుండి ఆర్థిక రక్షణ."
    },
    ta: {
      title: "💰 பயிர் காப்பீடு திட்டம் — கடைசி 17 நாட்கள்",
      text: `செப்டம்பர் 15 க்குள் பயிர் காப்பீடு செய்து ₹${insuranceCover} இழப்பீட்டு பாதுகாப்பு பெறுங்கள்.`,
      reason: "இயற்கை சீற்றங்களிலிருந்து முழு பாதுகாப்பு."
    },
    kn: {
      title: "💰 ಬೆಳೆ ವಿಮೆ ಯೋಜನೆ — ಕೊನೆಯ 17 ದಿನಗಳು",
      text: `ಸೆಪ್ಟೆಂಬರ್ 15 ರೊಳಗೆ ₹${insurancePremium} ಕಟ್ಟಿ ₹${insuranceCover} ಬೆಳೆ ವಿಮೆ ಮಾಡಿಸಿ.`,
      reason: "ಅತಿವೃಷ್ಟಿ ಮತ್ತು ಅನಾವೃಷ್ಟಿಯಿಂದ ರಕ್ಷಣೆ."
    },
    gu: {
      title: "💰 પ્રધાનમંત્રી પાક વીમા યોજના — ૧૭ દિવસ બાકી",
      text: `૧૫ સપ્ટેમ્બર પહેલાં ₹${insurancePremium} ભરીને ₹${insuranceCover} પાક વીમો કરાવો.`,
      reason: "નુકસાન સામે સંપૂર્ણ સુરક્ષા."
    },
    pa: {
      title: "💰 ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ — ਆਖਰੀ 17 ਦਿਨ ਬਾਕੀ",
      text: `15 ਸਤੰਬਰ ਤੋਂ ਪਹਿਲਾਂ ਆਪਣੀ ਫਸਲ ਦਾ ਬੀਮਾ ਕਰਵਾਓ।`,
      reason: "ਨੁਕਸਾਨ ਤੋਂ ਬਚਾਅ।"
    },
    bn: {
      title: "💰 ফসল বীমা যোজনা — শেষ ১৭ দিন",
      text: `১৫ সেপ্টেম্বরের আগে ফসল বীমা করুন।`,
      reason: "প্রাকৃতিক দুর্যোগে সুরক্ষা।"
    }
  };

  const scInfo = schemeTitles[language] || schemeTitles.en;

  actions.push({
    id: 'act-scheme',
    title: scInfo.title,
    category: 'scheme',
    urgency: 'warning',
    actionText: scInfo.text,
    reasoning: scInfo.reason,
    timingWindow: "Deadline: 15 Sept 2026",
    savingsImpact: `Guarantees financial protection up to ₹${insuranceCover}!`,
    iconName: 'Landmark',
    details: [
      'Documents: Aadhaar Card, 7/12 Land Record, Bank Passbook',
      'Apply at nearest CSC Centre or Bank branch'
    ]
  });

  return actions;
}

export function runFarmSimulation(
  scenarioType: 'irrigate_today' | 'spray_pesticide_now' | 'delay_fertilizer_4d' | 'heavy_rain_unseasonal',
  farmer: FarmerProfile,
  language: Language = 'en'
): SimulationResult {
  const { weather, totalAcreage } = farmer;

  const isRain = weather.rainProbability >= 60 || weather.expectedRainfallMm >= 10;
  const waterWasted = Math.round(totalAcreage * 24000);
  const moneyLost = Math.round(totalAcreage * 450);
  const medicineLost = Math.round(totalAcreage * 1350);

  const verdictTitles: Record<Language, { notRec: string; rec: string; caution: string }> = {
    en: { notRec: "🛑 DO NOT DO THIS — HEAVY LOSS", rec: "✅ DO THIS TODAY — VERY BENEFICIAL", caution: "⏳ PROCEED WITH CAUTION" },
    hi: { notRec: "🛑 यह काम बिल्कुल न करें — भारी नुकसान", rec: "✅ आज यह काम जरूर करें — बहुत लाभदायक", caution: "⏳ सावधानीपूर्वक निर्णय लें" },
    mr: { notRec: "🛑 हे काम अजिबात करू नका — मोठे नुकसान", rec: "✅ आज हे काम नक्की करा — खूप फायदेशीर", caution: "⏳ विचारपूर्वक निर्णय घ्या" },
    te: { notRec: "🛑 ఈ పని చేయవద్దు — భారీ నష్టం", rec: "✅ ఈరోజు తప్పక చేయండి — మంచి లాభం", caution: "⏳ జాగ్రత్తగా నిర్ణయం తీసుకోండి" },
    ta: { notRec: "🛑 இதை செய்ய வேண்டாம் — நஷ்டம்", rec: "✅ இன்று இதை செய்யுங்கள் — நன்மை", caution: "⏳ கவனமாக இருங்கள்" },
    kn: { notRec: "🛑 ಇದನ್ನು ಮಾಡಬೇಡಿ — ಭಾರಿ ನಷ್ಟ", rec: "✅ ಇಂದು ಖಂಡಿತ ಮಾಡಿ — ಲಾಭದಾಯಕ", caution: "⏳ ಎಚ್ಚರಿಕೆಯಿಂದ ನಿರ್ಧರಿಸಿ" },
    gu: { notRec: "🛑 આ કામ ન કરો — ભારે નુકસાન", rec: "✅ આજે આ કામ જરૂર કરો — ફાયદાકારક", caution: "⏳ સાવચેતી રાખો" },
    pa: { notRec: "🛑 ਇਹ ਕੰਮ ਨਾ ਕਰੋ — ਨੁਕਸਾਨ ਹੋਵੇਗਾ", rec: "✅ ਅੱਜ ਇਹ ਕੰਮ ਜ਼ਰੂਰ ਕਰੋ — ਲਾਭ ਹੋਵੇਗਾ", caution: "⏳ ਸਾਵਧਾਨੀ ਵਰਤੋ" },
    bn: { notRec: "🛑 এই কাজ করবেন না — ক্ষতি হবে", rec: "✅ আজ এই কাজ করুন — লাভজনক", caution: "⏳ সতর্ক থাকুন" }
  };

  const vTitles = verdictTitles[language] || verdictTitles.en;

  switch (scenarioType) {
    case 'irrigate_today': {
      if (isRain) {
        return {
          scenarioId: 'irrigate_today',
          scenarioTitle: language === 'hi' ? 'अगर आज पानी दूं तो क्या होगा?' : language === 'mr' ? 'आज पाणी दिले तर काय होईल?' : 'What happens if I irrigate today?',
          verdict: 'not_recommended',
          verdictTitle: vTitles.notRec,
          verdictExplanation: language === 'hi' 
            ? `${weather.rainForecastWindow} में बारिश आने वाली है (${weather.rainProbability}% संभावना, ~${weather.expectedRainfallMm} mm)। आज पानी देने से कीचड़ भरेगा, जड़ें सड़ेंगी और खाद बह जाएगी।`
            : language === 'mr'
            ? `${weather.rainForecastWindow} दरम्यान पाऊस पडणार आहे. आज पाणी दिले तर पिकाची मुळे सडतील आणि खत वाहून जाईल.`
            : `Rain is expected in ${weather.rainForecastWindow} (${weather.rainProbability}% chance, ~${weather.expectedRainfallMm} mm). Watering today will flood the field, rot roots, and wash away fertilizer.`,
          metrics: {
            waterWastedLitrePerAcre: 24000,
            financialImpactRupees: moneyLost,
            diseaseRiskChangePercent: +35,
            yieldImpactPercent: -8,
            soilRunoffRisk: 'High'
          },
          keyTakeaways: [
            language === 'hi' ? `💧 पानी की बर्बादी: ~${waterWasted.toLocaleString()} लीटर भूजल बेकार बहेगा।` : `💧 Water Wasted: ~${waterWasted.toLocaleString()} Litres wasted.`,
            language === 'hi' ? `🌱 जड़ों का सड़ना: खेत में जलभराव से जड़ें सड़ेंगी।` : `🌱 Root Rotting: Saturated wet mud suffocates roots.`,
            language === 'hi' ? `⚡ पैसे का नुकसान: ₹${moneyLost} बिजली/डीजल खर्च बेकार।` : `⚡ Money Wasted: ₹${moneyLost} in electricity wasted.`
          ],
          bestAlternative: language === 'hi' ? 'बारिश रुकने के २४ से ४८ घंटे बाद ही नमी देखकर पानी दें।' : 'Wait 24–48 hours until rain stops before irrigating.'
        };
      } else {
        return {
          scenarioId: 'irrigate_today',
          scenarioTitle: 'What happens if I irrigate today?',
          verdict: 'highly_recommended',
          verdictTitle: vTitles.rec,
          verdictExplanation: language === 'hi' 
            ? `धूप खिली है और जमीन में नमी कम (${farmer.soilMoisture}%) है। आज पानी देना फसल के लिए अत्यंत गुणकारी है।`
            : `Weather is clear and soil is dry. Irrigating today is highly beneficial.`,
          metrics: {
            waterWastedLitrePerAcre: 0,
            financialImpactRupees: 0,
            diseaseRiskChangePercent: -5,
            yieldImpactPercent: +14,
            soilRunoffRisk: 'Low'
          },
          keyTakeaways: [
            '💧 Plants absorb 95% of water directly.',
            '🌱 Protects flowers from heat stress.'
          ],
          bestAlternative: 'Irrigate for 3-4 hours in morning.'
        };
      }
    }

    case 'spray_pesticide_now': {
      return {
        scenarioId: 'spray_pesticide_now',
        scenarioTitle: 'Should I spray pesticide medicine right now?',
        verdict: 'not_recommended',
        verdictTitle: vTitles.notRec,
        verdictExplanation: language === 'hi'
          ? `कल बारिश होने से ९०% महंगी दवाई धुल जाएगी। आज पीले चिपचिपे कार्ड लगाएं और बारिश बाद ही छिड़काव करें।`
          : `Rain will wash 90% of medicine into mud. Spray post-rain on Thursday.`,
        metrics: {
          waterWastedLitrePerAcre: 0,
          financialImpactRupees: medicineLost,
          diseaseRiskChangePercent: +15,
          yieldImpactPercent: -12,
          soilRunoffRisk: 'Severe'
        },
        keyTakeaways: [
          `💸 Money Lost: ₹${medicineLost} wasted in washed chemical.`,
          '🦟 Pests will survive and build resistance.'
        ],
        bestAlternative: 'Postpone spraying until Thursday morning.'
      };
    }

    case 'delay_fertilizer_4d': {
      return {
        scenarioId: 'delay_fertilizer_4d',
        scenarioTitle: 'What if I delay putting fertilizer by 4 days?',
        verdict: 'proceed_with_caution',
        verdictTitle: vTitles.caution,
        verdictExplanation: language === 'hi'
          ? `बारिश से पहले खाद न देकर बारिश के बाद देना बहुत बुद्धिमानी है, जिससे खाद नालियों में नहीं बहेगी।`
          : `Delaying fertilizer until after rain prevents fertilizer runoff.`,
        metrics: {
          waterWastedLitrePerAcre: 0,
          financialImpactRupees: -800,
          diseaseRiskChangePercent: 0,
          yieldImpactPercent: +5,
          soilRunoffRisk: 'Low'
        },
        keyTakeaways: [
          '💰 Saves fertilizer from washing away.',
          '🌾 Roots absorb double nutrients in soft moist soil.'
        ],
        bestAlternative: 'Apply Urea and Potash 24 hours after rain.'
      };
    }

    case 'heavy_rain_unseasonal': {
      return {
        scenarioId: 'heavy_rain_unseasonal',
        scenarioTitle: 'What if heavy unseasonal rain hits tomorrow?',
        verdict: 'not_recommended',
        verdictTitle: vTitles.notRec,
        verdictExplanation: language === 'hi'
          ? `भारी बारिश से निचले हिस्सों में पानी भरने का खतरा है। आज ही खेत की निकासी नाली साफ करें।`
          : `Risk of waterlogging in low-lying zones. Clear drainage outlets today.`,
        metrics: {
          waterWastedLitrePerAcre: 0,
          financialImpactRupees: 2200,
          diseaseRiskChangePercent: +45,
          yieldImpactPercent: -15,
          soilRunoffRisk: 'Severe'
        },
        keyTakeaways: [
          '🚨 Waterlogging risk in low-lying zones.',
          '🛠️ Action: Clear furrow drainage outlets today.'
        ],
        bestAlternative: 'Dig 6-inch drainage channels along field edge today.'
      };
    }
  }
}

export function calculateFarmRiskScore(farmer: FarmerProfile): FarmRiskScore {
  const { weather, soilMoisture } = farmer;

  let weatherRisk = 20;
  if (weather.rainProbability > 70) weatherRisk += 45;
  else if (weather.rainProbability > 40) weatherRisk += 25;
  if (weather.humidity > 80) weatherRisk += 20;
  weatherRisk = Math.min(95, weatherRisk);

  let pestRisk = 25;
  if (weather.humidity > 80 && weather.temp > 26) pestRisk += 45;
  if (farmer.zones.some(z => z.status === 'pest_alert')) pestRisk += 20;
  pestRisk = Math.min(90, pestRisk);

  let waterStress = 15;
  if (soilMoisture > 75) waterStress += 35;
  else if (soilMoisture < 45) waterStress += 40;
  waterStress = Math.min(85, waterStress);

  const unhealthyZones = farmer.zones.filter(z => z.status !== 'healthy');
  const cropHealthRisk = Math.min(90, Math.round((unhealthyZones.length / farmer.zones.length) * 60 + 15));
  const marketRisk = 30;

  const totalScore = Math.round(
    weatherRisk * 0.35 +
    pestRisk * 0.25 +
    waterStress * 0.20 +
    cropHealthRisk * 0.15 +
    marketRisk * 0.05
  );

  let status: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (totalScore >= 75) status = 'CRITICAL';
  else if (totalScore >= 55) status = 'HIGH';
  else if (totalScore >= 35) status = 'MEDIUM';

  let primaryRiskFactor = 'Normal crop condition';
  if (weatherRisk > pestRisk && weatherRisk > waterStress) {
    primaryRiskFactor = `Rain expected in ${weather.rainForecastWindow}`;
  } else if (pestRisk > weatherRisk) {
    primaryRiskFactor = `High humidity (${weather.humidity}%) creating pest threat`;
  } else {
    primaryRiskFactor = `Soil moisture imbalance (${soilMoisture}%)`;
  }

  return {
    totalScore,
    status,
    breakdown: {
      weatherRisk,
      pestRisk,
      waterStress,
      cropHealthRisk,
      marketRisk
    },
    primaryRiskFactor
  };
}

export function getProactiveAlerts(farmer: FarmerProfile, language: Language = 'en'): ProactiveAlert[] {
  const alerts: ProactiveAlert[] = [];
  const { weather, cropNameEn, state } = farmer;

  if (weather.rainProbability >= 60) {
    alerts.push({
      id: 'alt-rain-warning',
      timestamp: '10 mins ago',
      type: 'weather_warning',
      severity: 'critical',
      title: language === 'hi' ? `🚨 ${weather.rainForecastWindow} में भारी बारिश का अनुमान` : `🚨 Heavy Rain Expected in ${weather.rainForecastWindow}`,
      message: language === 'hi' 
        ? `बारिश की ${weather.rainProbability}% संभावना है (~${weather.expectedRainfallMm} mm बारिश)। आज अपनी ${cropNameEn} की फसल में पानी व दवाई न दें।`
        : `Rain probability is ${weather.rainProbability}% with ~${weather.expectedRainfallMm} mm downpour. Do not irrigate or spray chemical pesticides today on your ${cropNameEn}.`,
      actionPrompt: language === 'hi' ? 'खेत की निकासी नाली साफ करें ताकि पानी न भरे।' : 'Clear field drainage channels so water does not stand in the field.',
      resolved: false
    });
  }

  if (weather.humidity >= 80) {
    alerts.push({
      id: 'alt-pest-warning',
      timestamp: '45 mins ago',
      type: 'pest_outbreak',
      severity: 'warning',
      title: language === 'hi' ? `🐛 उच्च आर्द्रता (${weather.humidity}%): सफेद मक्खी व फफूंद का खतरा` : `🐛 High Humidity (${weather.humidity}%): Whitefly & Fungus Threat`,
      message: language === 'hi' ? `उमस भरे मौसम में रस चूसक कीट तेजी से फैलते हैं।` : `Sticky humid air creates high chance of sucking pests on ${cropNameEn}.`,
      actionPrompt: language === 'hi' ? '१०-१५ पौधों की जांच करें और पीले चिपचिपे कार्ड लगाएं।' : 'Check 10-15 plants. Use yellow sticky trap cards.',
      resolved: false
    });
  }

  alerts.push({
    id: 'alt-scheme-alert',
    timestamp: '2 hours ago',
    type: 'scheme_deadline',
    severity: 'info',
    title: language === 'hi' ? `💰 PMFBY फसल बीमा: अंतिम १७ दिन शेष` : `💰 PMFBY Crop Insurance: Only 17 Days Remaining`,
    message: language === 'hi' ? `१५ सितंबर से पहले अपनी ${cropNameEn} फसल का ₹७०० में बीमा कराएं।` : `Enroll your ${cropNameEn} before 15 September in ${state} for ₹700 to protect ₹35,000/acre harvest.`,
    actionPrompt: language === 'hi' ? 'आधार, खतौनी व पासबुक लेकर सीएससी जाएं।' : 'Visit CSC Kendra with 7/12 extract, Aadhaar, and Bank Passbook.',
    resolved: false
  });

  return alerts;
}
