import { FarmerProfile, Language } from '../types';
import { getFarmerIoTTelemetry } from '../data/iotData';
import { matchSchemesForFarmer } from '../data/schemesData';
import { cropDiseasesDatabase } from '../data/diseasesData';

export interface AIResponseWithAction {
  responseText: string;
  spokenText: string;
  suggestedAction?: {
    label: string;
    tabId: string;
    icon: string;
  };
}

export function generateSmartFarmerAIResponse(
  query: string,
  farmer: FarmerProfile,
  language: Language
): AIResponseWithAction {
  const q = query.toLowerCase().trim();
  const { weather, crop, cropNameEn, totalAcreage, soilMoisture, district, state, cropStageName, sowingDate, cropDays } = farmer;
  const iot = getFarmerIoTTelemetry(farmer);
  const schemes = matchSchemesForFarmer(farmer);

  // 1. IRRIGATION & WATER MANAGEMENT
  if (
    q.includes('pani') || q.includes('water') || q.includes('irrigate') || 
    q.includes('पानी') || q.includes('पाणी') || q.includes('सिंचाई') || 
    q.includes('నీరు') || q.includes('தண்ணீர்') || q.includes('ನೀರು') || 
    q.includes('motor') || q.includes('drip') || q.includes('पंप')
  ) {
    if (weather.rainProbability >= 60 || weather.expectedRainfallMm >= 10) {
      if (language === 'mr') {
        return {
          responseText: `🛑 **आज पाणी (सिंचन) अजिबात देऊ नका भाऊ!**\n\n• **कारण:** तुमच्या ${district} भागात पुढील २४ तासांत **${weather.expectedRainfallMm} mm मुसळधार पाऊस** पडण्याची शक्यता आहे (${weather.rainProbability}%).\n• **नुकसान:** जमिनीत आधीच ${soilMoisture}% ओलावा आहे. आज पाणी दिले तर पिकाची मुळे सडतील आणि खत वाहून जाईल.\n• **फायदा:** आज मोटर बंद ठेवल्याने तुमचे **₹1,100 वीज बिल** आणि **70,000 लिटर पाणी** वाचेल.\n• **पुढील तपासणी:** पाऊस थांबल्यानंतर २ दिवसांनी माती तपासा.`,
          spokenText: `आज पाणी अजिबात देऊ नका भाऊ! तुमच्या भागात उद्या मुसळधार पावसाची शक्यता आहे. आज पाणी दिले तर मुळे सडतील आणि खत वाहून जाईल. दोन दिवस थांबा.`,
          suggestedAction: { label: 'सिम्युलेटरमध्ये परिणाम पहा', tabId: 'what-if', icon: '🌦️' }
        };
      }
      return {
        responseText: `🛑 **आज खेत में पानी (सिंचाई) बिल्कुल मत दीजिए!**\n\n• **कारण:** आपके ${district} क्षेत्र में अगले २४ घंटों में **${weather.expectedRainfallMm} mm बारिश** आने की ${weather.rainProbability}% संभावना है।\n• **नुकसान:** जमीन में पहले से ${soilMoisture}% नमी है। आज पानी दिया तो खेत में कीचड़ भरेगा, जड़ें सड़ेंगी और खाद नालियों में बह जाएगी।\n• **बचत:** मोटर बंद रखने से आपके **₹1,100 बिजली खर्च** और **70,000 लीटर पानी** की सीधी बचत होगी!\n• **सलाह:** बारिश के २ दिन बाद जब धूप निकले तभी पानी दें।`,
        spokenText: `आज खेत में पानी बिल्कुल मत दीजिए! आपके क्षेत्र में कल भारी बारिश आने वाली है। आज पानी दिया तो जड़ें सड़ जाएंगी और खाद बह जाएगी। दो दिन रुकें।`,
        suggestedAction: { label: 'सिम्युलेटर में असर देखें', tabId: 'what-if', icon: '🌦️' }
      };
    } else if (soilMoisture < 45) {
      return {
        responseText: `✅ **हाँ, आज अपनी ${cropNameEn} की फसल को पानी जरूर दें!**\n\n• **नमी स्तर:** मिट्टी में नमी घटकर **${soilMoisture}%** रह गई है।\n• **सही समय:** सुबह ६ से ९ बजे या शाम को ५ से ७ बजे ड्रिप या मोटर चलाकर ३ से ४ घंटे पानी दें।\n• **फायदा:** फसल अभी '${cropStageName}' में है, पानी मिलने से फूल और फल मजबूत बनेंगे।`,
        spokenText: `हाँ, आज खेत में पानी जरूर दें। मिट्टी में नमी कम हो गई है। सुबह या शाम के समय ३ से ४ घंटे पानी चलाएं।`,
        suggestedAction: { label: 'स्मार्ट वाल्व चालू करें', tabId: 'iot', icon: '📡' }
      };
    } else {
      return {
        responseText: `🟢 **मिट्टी में नमी एकदम उत्तम (${soilMoisture}%) है!**\n\nआज अतिरिक्त पानी देने की आवश्यकता नहीं है। मौसम साफ है और फसल स्वस्थ है।`,
        spokenText: `मिट्टी में नमी एकदम उत्तम है। आज पानी देने की जरूरत नहीं है।`,
        suggestedAction: { label: 'आज की कार्ययोजना देखें', tabId: 'today', icon: '🌾' }
      };
    }
  }

  // 2. PESTS, LEAF YELLOWING & DISEASE REMEDIES
  if (
    q.includes('peele') || q.includes('yellow') || q.includes('leaf') || q.includes('curl') || 
    q.includes('पत्ते') || q.includes('रोग') || q.includes('कीड') || q.includes('पाने') || 
    q.includes('bollworm') || q.includes('whitefly') || q.includes('कीड़ा') || q.includes('दवाई') ||
    q.includes('spray') || q.includes('छिड़काव') || q.includes('फवारणी') || q.includes('मक्खी') ||
    q.includes('fungus') || q.includes('blast') || q.includes('rust')
  ) {
    if (weather.rainProbability >= 60) {
      return {
        responseText: `🛑 **आज कोई भी कीटनाशक दवाई मत छिड़किए!**\n\n• **कारण:** कल बारिश होने से ९०% महंगी दवाई धुल जाएगी और कीड़े नहीं मरेंगे।\n• **आज क्या करें:** खेत में प्रति एकड़ **१० पीले चिपचिपे कार्ड (Yellow Sticky Traps)** लगाएं जो सफेद मक्खियों को बिना दवाई पकड़ लेंगे।\n• **सुरक्षित छिड़काव समय:** बारिश रुकने के बाद गुरुवार सुबह (७:३० से १०:०० बजे)।\n• **दवाई की मात्रा:** १५ लीटर पंप टंकी में **५०ml नीम का तेल (NSKE 5%)** या **२०ml उलाला (Flonicamid)** मिलाएं।`,
        spokenText: `आज कोई भी दवाई मत छिड़किए क्योंकि कल बारिश से दवाई धुल जाएगी। खेत में पीले चिपचिपे कार्ड लगाएं और बारिश के बाद गुरुवार सुबह छिड़काव करें।`,
        suggestedAction: { label: 'रोग पहचान AI खोलें', tabId: 'diseases', icon: '📸' }
      };
    } else {
      return {
        responseText: `✅ **पत्ते पीले पड़ने व रस चूसक कीटों का सटीक उपचार:**\n\n• **रासायनिक उपाय:** १५ लीटर स्प्रे टंकी में **२०ml उलाला (Flonicamid 50 WG)** या **एसिटामिप्रिड (Acetamiprid) १० ग्राम** घोलकर छिड़कें।\n• **सस्ता जैविक उपाय:** १५ लीटर पानी में **५०ml नीम तेल (NSKE 5%)** मिलाकर सुबह के समय छिड़कें।\n• **सर्वोत्तम समय:** सुबह ७:३० से १०:३० बजे जब पत्तों पर ओस सूख जाए।`,
        spokenText: `पत्ते पीले पड़ने पर १५ लीटर पानी की टंकी में २०ml दवाई या ५०ml नीम का तेल मिलाकर सुबह के समय छिड़काव करें।`,
        suggestedAction: { label: 'पत्ती की फोटो से जांचें', tabId: 'diseases', icon: '📸' }
      };
    }
  }

  // 3. FERTILIZER (KHAD / NPK / UREA / DAP) DOSAGE
  if (
    q.includes('khad') || q.includes('fertilizer') || q.includes('urea') || q.includes('dap') || 
    q.includes('खाद') || q.includes('यूरिया') || q.includes('डीएपी') || q.includes('पोटाश') || 
    q.includes('npk') || q.includes('खत') || q.includes('ఎరువులు') || q.includes('उर्वरक')
  ) {
    if (weather.rainProbability >= 60) {
      return {
        responseText: `⏳ **खाद (यूरिया) बारिश के २४ घंटे बाद दें!**\n\n• **कारण:** सूखी जमीन पर बारिश से पहले खाद डालने पर पानी के तेज बहाव में खाद नालियों में बह जाती है।\n• **सही समय:** बारिश के बाद जब जमीन में नरम नमी हो, तब प्रति एकड़ **२५ किलो यूरिया + १५ किलो पोटाश** जड़ों के पास दें।\n• **फायदा:** नरम मिट्टी में जड़ें १००% पोषक तत्व सोख लेती हैं।`,
        spokenText: `यूरिया खाद बारिश के २४ घंटे बाद दें जब मिट्टी में नरम नमी हो। इससे खाद बहने से बचेगी और पौधे को पूरा पोषण मिलेगा।`,
        suggestedAction: { label: 'NPK गणक खोलें', tabId: 'fertilizer', icon: '🧪' }
      };
    } else {
      return {
        responseText: `🧪 **${cropNameEn} (${cropStageName}) के लिए खाद की मात्रा:**\n\n• **अनुशंसित खुराक:** प्रति एकड़ **२५ किलो यूरिया + २० किलो पोटाश (MOP)** का छिड़काव जड़ों के पास करें।\n• **सरकारी सब्सिडी दर:** यूरिया ₹२६६.५० प्रति बैग (५०kg) और डीएपी ₹१,३५० प्रति बैग निकटतम कृषि सेवा केंद्र पर उपलब्ध है।`,
        spokenText: `प्रति एकड़ २५ किलो यूरिया और २० किलो पोटाश जड़ों के पास दें। सब्सिडी वाली खाद कृषि केंद्र पर उपलब्ध है।`,
        suggestedAction: { label: 'खाद दुकान लोकेटर देखें', tabId: 'seeds-fertilizer', icon: '🌱' }
      };
    }
  }

  // 4. GOVERNMENT SCHEMES & SUBSIDIES (PM-KISAN, PMFBY, TRACTOR, DRIP)
  if (
    q.includes('scheme') || q.includes('subsidy') || q.includes('tractor') || q.includes('योजना') || 
    q.includes('अनुदान') || q.includes('सब्सिडी') || q.includes('ट्रैक्टर') || q.includes('pm kisan') || 
    q.includes('pmfby') || q.includes('बीमा') || q.includes('insurance') || q.includes('पैसा')
  ) {
    return {
      responseText: `💰 **${farmer.name} जी, आपके लिए ३ प्रमुख सरकारी योजनाएं सक्रिय हैं:**\n\n1. **SMAM कृषि यंत्रीकरण:** नए ट्रैक्टर और रोटावेटर पर **४०% से ५०% सब्सिडी (₹१.५ लाख तक)**।\n2. **PMFBY फसल बीमा (अंतिम १७ दिन शेष):** केवल **₹७००** प्रीमियम देकर अपने खेत की ₹३५,००० प्रति एकड़ फसल सुरक्षित करें।\n3. **PMKSY ड्रिप सिंचाई सब्सिडी:** सूक्ष्म सिंचाई लगाने पर **५५% सरकारी अनुदान**।\n\n📋 **आवश्यक कागजात:** आधार कार्ड, ७/१२ खतौनी और बैंक पासबुक।`,
      spokenText: `आपके लिए नए ट्रैक्टर पर ५०% सब्सिडी और फसल बीमा योजना खुली है। आवेदन के लिए आधार कार्ड और खतौनी लेकर सीएससी केंद्र जाएं।`,
      suggestedAction: { label: 'सभी योजनाएं देखें', tabId: 'schemes', icon: '💰' }
    };
  }

  // 5. APMC MANDI RATES & PRICE FORECAST
  if (
    q.includes('mandi') || q.includes('bhav') || q.includes('rate') || q.includes('price') || 
    q.includes('भाव') || q.includes('दाम') || q.includes('मंडी') || q.includes('बाजारभाव') || 
    q.includes('sell') || q.includes('bechna') || q.includes('बेचना')
  ) {
    return {
      responseText: `🏛️ **आज का ${cropNameEn} APMC मंडी भाव व सलाह:**\n\n• **आज का मॉडल भाव:** **₹७,४५० प्रति क्विंटल** (${district} मंडी में)।\n• **न्यूनतम भाव:** ₹७,१५० | **अधिकतम भाव:** ₹७,६८० प्रति क्विंटल।\n• **सरकारी MSP:** ₹७,१२१ प्रति क्विंटल (मंडी भाव MSP से अधिक है)।\n• **एआई सलाह (Hold vs Sell):** **अभी माल रोककर रखें (HOLD)!** अगले १५ दिनों में आवक कम होने पर भाव **₹७,६५०+** तक जाने की संभावना है।`,
      spokenText: `आज आपकी फसल का मंडी भाव ₹७,४५० प्रति क्विंटल है। सलाह है कि अभी माल रोककर रखें, १५ दिन बाद भाव और बढ़ने की उम्मीद है।`,
      suggestedAction: { label: 'मंडी GPS लोकेटर देखें', tabId: 'mandi-locator', icon: '🏛️' }
    };
  }

  // 6. IOT SENSORS & SOIL TELEMETRY
  if (
    q.includes('sensor') || q.includes('iot') || q.includes('telemetry') || q.includes('moisture') || 
    q.includes('सेंसर') || q.includes('नमी') || q.includes('तापमान') || q.includes('valve') || 
    q.includes('वाल्व') || q.includes('wetness')
  ) {
    return {
      responseText: `📡 **लाइव इन-फील्ड IoT सेंसर रिपोर्ट (${district}):**\n\n• **ऊपरी जड़ नमी (15cm):** ${iot.soilMoisture15cm}%\n• **गहरी मूसला जड़ नमी (30cm):** ${iot.soilMoisture30cm}%\n• **मिट्टी का तापमान:** ${iot.soilTemperatureC.toFixed(1)}°C\n• **पत्ती पर ओस (Leaf Wetness):** ${iot.leafWetnessPercent}%\n• **NPK पोषक तत्व:** नाइट्रोजन ${iot.soilNitrogenMgKg} mg/kg | फास्फोरस ${iot.soilPhosphorusMgKg} mg/kg | पोटाश ${iot.soilPotassiumMgKg} mg/kg\n• **ड्रिप वाल्व स्थिति:** ${iot.smartDripValveState === 'OPEN' ? 'चालू (खूला)' : 'सुरक्षित बंद'}`,
      spokenText: `आपके खेत के सेंसर के अनुसार १५ सेंटीमीटर पर नमी ${iot.soilMoisture15cm}% और ३० सेंटीमीटर पर ${iot.soilMoisture30cm}% है। फसल की स्थिति अच्छी है।`,
      suggestedAction: { label: 'IoT हब खोलें', tabId: 'iot', icon: '📡' }
    };
  }

  // 7. P2P KISAN LOANS & MICRO-CREDIT
  if (
    q.includes('loan') || q.includes('karz') || q.includes('credit') || q.includes('ऋण') || 
    q.includes('कर्ज') || q.includes('उधार') || q.includes('पैसा चाहिए') || q.includes('p2p')
  ) {
    return {
      responseText: `🤝 **किसान आपसी ऋण सहायता (P2P Loan Hub):**\n\n• **ब्याज दर:** केवल **१.०% प्रति माह (सरल ब्याज)**।\n• **आपका किसान क्रेडिट स्कोर:** **७८०/९०० (Pre-Approved)**।\n• **सुविधा:** बिना किसी साहूकार या बंधक के, सीधे साथी किसानों से ₹१०,००० से ₹५०,००० तक का त्वरित ऋण प्राप्त करें या ऋण देकर १% ब्याज कमाएं।`,
      spokenText: `आप सीधे ऐप पर १% मासिक ब्याज पर साथी किसानों से त्वरित ऋण ले सकते हैं। आपका क्रेडिट स्कोर बहुत अच्छा है।`,
      suggestedAction: { label: 'P2P लोन हब खोलें', tabId: 'p2p-loans', icon: '🤝' }
    };
  }

  // 8. CROP YIELD & PRODUCTION ("HOW MUCH GROWN")
  if (
    q.includes('yield') || q.includes('production') || q.includes('kitna') || q.includes('पैदावार') || 
    q.includes('उपज') || q.includes('उत्पादन') || q.includes('फसल कितनी हुई')
  ) {
    const projQtl = Math.round(totalAcreage * (crop === 'cotton' ? 8.8 : crop === 'rice' ? 24.5 : 22.0));
    return {
      responseText: `📊 **फसल वृद्धि व अनुमानित पैदावार विवरण:**\n\n• **बुआई से आज तक:** **${cropDays} दिन** (${cropStageName})\n• **वृद्धि पूर्णता:** **${Math.round((cropDays / 160) * 100)}% चक्र पूर्ण**\n• **अनुमानित कुल उपज:** **~${projQtl} क्विंटल** (${(projQtl * 0.1).toFixed(1)} मीट्रिक टन)\n• **जिले के औसत से तुलना:** आपका खेत जिले के औसत से **+२८% अधिक उपज** देने के लिए अग्रसर है!`,
      spokenText: `आपकी फसल की बुआई को ${cropDays} दिन हो चुके हैं और अनुमानित कुल पैदावार ${projQtl} क्विंटल होने की उम्मीद है, जो जिले के औसत से २८% ज्यादा है।`,
      suggestedAction: { label: 'उत्पादन ट्रैकर देखें', tabId: 'production', icon: '📊' }
    };
  }

  // 9. WEATHER & RAIN FORECAST
  if (
    q.includes('weather') || q.includes('rain') || q.includes('mausam') || q.includes('मौसम') || 
    q.includes('बारिश') || q.includes('पाऊस') || q.includes('हवामान') || q.includes('धूप')
  ) {
    return {
      responseText: `🌦️ **${district} का स्थानीय मौसम पूर्वानुमान:**\n\n• **तापमान:** ${weather.temp}°C (${weather.condition})\n• **बारिश का अनुमान:** **${weather.rainProbability}% संभावना** (~${weather.expectedRainfallMm} mm बारिश)\n• **पूर्वानुमान समय:** **${weather.rainForecastWindow}**\n• **सलाह:** बारिश आने तक सिंचाई और रासायनिक छिड़काव स्थगित रखें। खेत की मेड़ और निकासी नाली साफ रखें।`,
      spokenText: `आपके क्षेत्र में ${weather.rainForecastWindow} में ${weather.expectedRainfallMm} मिलीमीटर बारिश का अनुमान है। आज पानी और छिड़काव रोककर रखें।`,
      suggestedAction: { label: 'आज की कार्ययोजना देखें', tabId: 'today', icon: '🌾' }
    };
  }

  // 10. GREETINGS & GENERAL HELP
  return {
    responseText: `नमस्ते **${farmer.name} जी!** 🙏\n\nमैं आपका निजी **कृषि को-पायलट एआई सलाहकार** हूँ। आपके **${totalAcreage} एकड़ ${cropNameEn} (${district})** के खेत के लिए आज की सबसे बड़ी सलाह:\n\n• 🛑 कल बारिश आने वाली है, इसलिए आज सिंचाई और दवाई का छिड़काव रोककर अपने **₹१,५००** बचाएं।\n• 💰 फसल बीमा (PMFBY) के लिए १७ दिन बचे हैं।\n\nआप मुझसे मौसम, खाद की मात्रा, पत्तों के रोग, मंडी भाव या ट्रैक्टर सब्सिडी के बारे में कुछ भी पूछ सकते हैं!`,
    spokenText: `नमस्ते ${farmer.name} जी! कल बारिश आने वाली है, इसलिए आज पानी और छिड़काव रोककर रखें। आप मुझसे खाद, रोग, मंडी भाव या सब्सिडी के बारे में कुछ भी पूछ सकते हैं।`,
    suggestedAction: { label: 'आज की कार्ययोजना देखें', tabId: 'today', icon: '🌾' }
  };
}
