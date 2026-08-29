import { DiseaseRecord, WeatherData } from '../types';

export const cropDiseasesDatabase: DiseaseRecord[] = [
  {
    id: 'cotton-leaf-curl',
    crop: 'cotton',
    name: 'Cotton Leaf Curl Virus (CLCuV)',
    scientificName: 'Begomovirus (Geminiviridae)',
    confidenceDefault: 94,
    severity: 'Severe',
    imageUrl: 'https://images.unsplash.com/photo-1598512752271-33f913a5af13?w=800&auto=format&fit=crop&q=80',
    symptoms: [
      'Upward and downward curling of leaf margins',
      'Thickening of veins with dark green enamel appearance on lower leaf surface',
      'Enation (cup-shaped leaf-like outgrowth) beneath leaves',
      'Stunted terminal plant growth and severe square shedding'
    ],
    causes: [
      'Transmitted by Silverleaf Whitefly (Bemisia tabaci)',
      'High relative humidity (> 80%) coupled with temperatures between 28°C - 34°C accelerates vector reproduction'
    ],
    immediateActions: [
      'Rogue out and bury severely infected stunted plants immediately to prevent vector spread',
      'Install yellow sticky traps @ 10 traps/acre at canopy height to monitor whitefly population',
      'Avoid high doses of nitrogenous fertilizers which promote lush foliage preferred by whiteflies'
    ],
    organicTreatment: {
      name: 'Neem Seed Kernel Extract (NSKE 5%) + Sticky Traps',
      dosage: '50 ml NSKE or Azadirachtin 10,000 ppm @ 2 ml/L water',
      frequency: 'Spray in early mornings every 7 days'
    },
    chemicalTreatment: {
      name: 'Diafenthiuron 50% WP or Afidopyropen 50 g/L DC',
      dosage: 'Diafenthiuron @ 1.2 g/L or Afidopyropen @ 1.0 ml/L water',
      safetyIntervalDays: 15
    },
    weatherIntegratedAdvice: {
      isSprayingRecommendedNow: false,
      rainWashoffRisk: 'Immediate Washout',
      sprayingWindowRecommendation: 'Heavy rain forecasted in next 24h. Rain will wash off systemic insecticides. Postpone spraying to Day 3 (Thursday 7:00 AM - 10:00 AM) when clear skies and low wind (< 8 km/h) are forecasted.',
      optimalTempAndWind: 'Temperature 24°C - 30°C, Wind < 10 km/h, Relative Humidity 60-70%'
    }
  },
  {
    id: 'rice-blast',
    crop: 'rice',
    name: 'Rice Blast (Magnaporthe oryzae)',
    scientificName: 'Pyricularia oryzae Cavara',
    confidenceDefault: 91,
    severity: 'Severe',
    imageUrl: 'https://images.unsplash.com/photo-1536939459926-301728717817?w=800&auto=format&fit=crop&q=80',
    symptoms: [
      'Spindle-shaped / diamond-shaped lesions on leaves with brownish-red margins and grey center',
      'Neck blast: Blackening of panicle neck node leading to complete grain sterility',
      'Nodes turning black and snapping easily under wind'
    ],
    causes: [
      'Excessive nitrogen application',
      'Prolonged leaf wetness (> 10 hours) and cool night temperatures (20-24°C) with high humidity'
    ],
    immediateActions: [
      'Drain standing water from the field temporarily for 2 days to aerate roots',
      'Withhold top-dressing of urea until infection is arrested',
      'Apply silicon fertilizer or potash to toughen leaf epidermis'
    ],
    organicTreatment: {
      name: 'Pseudomonas fluorescens 0.5% WP (Bio-fungicide)',
      dosage: '10 g/kg seed treatment or foliar spray @ 5 g/L water',
      frequency: 'Repeat after 10 days'
    },
    chemicalTreatment: {
      name: 'Tricyclazole 75% WP or Isoprothiolane 40% EC',
      dosage: 'Tricyclazole @ 0.6 g/L or Isoprothiolane @ 1.5 ml/L water',
      safetyIntervalDays: 21
    },
    weatherIntegratedAdvice: {
      isSprayingRecommendedNow: true,
      rainWashoffRisk: 'Low',
      sprayingWindowRecommendation: 'Clear dry window available today between 7:30 AM and 11:30 AM. Ensure adjuvant/sticker is added for maximum leaf adherence.',
      optimalTempAndWind: 'Temperature 26°C - 32°C, Wind < 12 km/h, No rain for next 8 hours'
    }
  },
  {
    id: 'wheat-yellow-rust',
    crop: 'wheat',
    name: 'Wheat Yellow / Stripe Rust',
    scientificName: 'Puccinia striiformis f. sp. tritici',
    confidenceDefault: 96,
    severity: 'Moderate',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=80',
    symptoms: [
      'Linear stripes of bright yellow-orange pustules arranged parallel to leaf veins',
      'Yellow powder stains fingers when touching infected leaves',
      'Severe drying up of leaves causing premature senescence and shriveled grains'
    ],
    causes: [
      'Airborne urediniospores carried by north-westerly cold winds',
      'Cool temperatures (10°C - 20°C) with high morning dew'
    ],
    immediateActions: [
      'Survey northern and shaded borders of the field for early focal patches (yellow spots)',
      'Spot spray infected patches immediately before spores become airborne across the field',
      'Avoid late evening irrigation which increases overnight leaf wetness duration'
    ],
    organicTreatment: {
      name: 'Fermented Butter Milk (Chhachh) + Neem Leaf Extract',
      dosage: '5 Litres sour buttermilk diluted in 100L water per acre',
      frequency: 'Every 7 days during foggy spells'
    },
    chemicalTreatment: {
      name: 'Propiconazole 25% EC (Tilt)',
      dosage: '1.0 ml / Litre of water (200 ml in 200 L water per acre)',
      safetyIntervalDays: 30
    },
    weatherIntegratedAdvice: {
      isSprayingRecommendedNow: true,
      rainWashoffRisk: 'Low',
      sprayingWindowRecommendation: 'Weather is clear with zero rain probability. Spray between 10:00 AM and 2:00 PM once morning fog and dew have fully evaporated from leaf surfaces.',
      optimalTempAndWind: 'Temperature 18°C - 22°C, Sunshine required to dry spray'
    }
  },
  {
    id: 'tomato-early-blight',
    crop: 'tomato',
    name: 'Tomato Early Blight & Target Spot',
    scientificName: 'Alternaria solani',
    confidenceDefault: 88,
    severity: 'Moderate',
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910a451?w=800&auto=format&fit=crop&q=80',
    symptoms: [
      'Concentric dark brown rings resembling a target board on older lower leaves',
      'Yellow chlorotic halos surrounding brown spots',
      'Stem collar rot and sunken dark leathery lesions at fruit calyx end'
    ],
    causes: [
      'Fungal spores splash from soil during heavy rain or overhead sprinkler irrigation',
      'Alternating wet and dry periods with warm temperatures (24°C - 29°C)'
    ],
    immediateActions: [
      'Prune off lower 12 inches of foliage touching wet soil and burn',
      'Apply straw or plastic mulch to prevent soil-to-leaf rain splash',
      'Switch from overhead watering to direct root drip fertigation'
    ],
    organicTreatment: {
      name: 'Trichoderma harzianum (2% WP) + Copper Soap',
      dosage: 'Trichoderma @ 5 g/L or Copper Octanoate @ 3 ml/L',
      frequency: 'Every 5-7 days after wet spells'
    },
    chemicalTreatment: {
      name: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)',
      dosage: '1.0 ml / Litre of water',
      safetyIntervalDays: 7
    },
    weatherIntegratedAdvice: {
      isSprayingRecommendedNow: false,
      rainWashoffRisk: 'High',
      sprayingWindowRecommendation: 'Thundershowers predicted this evening. Spraying fungicide right now will result in 80% chemical runoff into soil. Ideal spray window: Tomorrow at 8:00 AM after rain subsides.',
      optimalTempAndWind: 'Temperature 22°C - 28°C, Dry canopy condition'
    }
  },
  {
    id: 'cotton-pink-bollworm',
    crop: 'cotton',
    name: 'Pink Bollworm (Pectinophora gossypiella)',
    scientificName: 'Pectinophora gossypiella (Saunders)',
    confidenceDefault: 93,
    severity: 'Severe',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
    symptoms: [
      'Rosetted flowers that fail to open properly',
      'Small entry holes in green bolls with bore dust and brown frass',
      'Premature boll opening and discolored, stained lint fibers'
    ],
    causes: [
      'Moth nocturnal oviposition on squares and flowers',
      'Consecutive mono-cropping of Bt cotton without refuge strips'
    ],
    immediateActions: [
      'Deploy gossyplure pheromone traps @ 8 traps/acre for pest threshold monitoring',
      'Collect and destroy all rosetted flowers and dropped bolls in a sealed plastic bag under sun',
      'Release Trichogramma bactrae parasitoid egg cards @ 60,000/acre'
    ],
    organicTreatment: {
      name: 'Pheromone Mating Disruption Lures + Beauveria bassiana',
      dosage: 'PBW Pheromone Lures + Beauveria @ 5 g/L water',
      frequency: 'Replace lures every 25 days'
    },
    chemicalTreatment: {
      name: 'Chlorantraniliprole 18.5% SC or Emamectin Benzoate 5% SG',
      dosage: 'Chlorantraniliprole @ 0.3 ml/L or Emamectin Benzoate @ 0.5 g/L water',
      safetyIntervalDays: 14
    },
    weatherIntegratedAdvice: {
      isSprayingRecommendedNow: false,
      rainWashoffRisk: 'Immediate Washout',
      sprayingWindowRecommendation: 'Rain expected within 18 hours. Spraying contact/larvicidal insecticide is strictly not advised. Wait for 24h dry forecast post-rainfall before applying spray.',
      optimalTempAndWind: 'Calm evening hours 5:00 PM - 7:00 PM on dry days'
    }
  }
];

export function getDynamicWeatherAdvice(disease: DiseaseRecord, weather: WeatherData) {
  if (weather.rainProbability > 50 || weather.expectedRainfallMm > 10) {
    return {
      isSprayingRecommendedNow: false,
      rainWashoffRisk: 'Immediate Washout' as const,
      sprayingWindowRecommendation: `⚠️ Rain expected in ${weather.rainForecastWindow} (${weather.rainProbability}% probability, ~${weather.expectedRainfallMm} mm). Spraying now will wash away expensive chemicals into the soil. Postpone spraying by 24-48 hours until clear skies return.`,
      optimalTempAndWind: `Optimal window: After rain clears with wind < 10 km/h and dry foliage.`
    };
  } else {
    return {
      isSprayingRecommendedNow: true,
      rainWashoffRisk: 'Low' as const,
      sprayingWindowRecommendation: `✅ Weather window is optimal! Rain probability is low (${weather.rainProbability}%). Spray today between 7:30 AM - 10:30 AM or 4:30 PM - 6:30 PM for maximum chemical absorption and minimal drift.`,
      optimalTempAndWind: `Current Temp: ${weather.temp}°C, Wind: ${weather.windSpeedKmh} km/h (Safe threshold).`
    };
  }
}
