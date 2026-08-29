import { FarmerProfile } from '../types';

export const farmerPresets: FarmerProfile[] = [
  {
    id: 'ramesh-cotton-mh',
    name: 'Ramesh Patil',
    avatar: '👨🏽‍🌾',
    phone: '+91 98221 45870',
    state: 'Maharashtra',
    district: 'Yavatmal (Vidarbha)',
    village: 'Ghatanji',
    crop: 'cotton',
    cropNameEn: 'Bt Cotton (Ajeet-155)',
    variety: 'Bollgard II Hybrid',
    sowingDate: '2026-06-15',
    cropStage: 'flowering',
    cropStageName: 'Square to Flowering Stage (68 Days)',
    cropDays: 68,
    totalAcreage: 3.2,
    soilType: 'black_cotton',
    soilMoisture: 64, // High moisture
    irrigationType: 'drip',
    farmerCategory: 'marginal_small',
    equipmentOwned: ['Knapsack Sprayer', 'Bullock Cart', 'Drip Lateral Setup'],
    hasSoilHealthCard: true,
    hasKisanCreditCard: true,
    isTaxPayer: false,
    weather: {
      temp: 29.4,
      condition: 'Overcast with Rain Impending',
      conditionIcon: 'cloud-rain',
      rainProbability: 78,
      expectedRainfallMm: 22,
      rainForecastWindow: 'Tomorrow 2:00 PM - 8:00 PM',
      humidity: 86,
      windSpeedKmh: 14,
      uvIndex: 4,
      soilMoisturePercent: 64,
      forecastNext3Days: [
        { day: 'Tomorrow', tempMax: 28, tempMin: 23, rainProb: 78, condition: 'Heavy Showers', rainfallMm: 22 },
        { day: 'Day 2', tempMax: 30, tempMin: 22, rainProb: 45, condition: 'Light Passing Showers', rainfallMm: 6 },
        { day: 'Day 3', tempMax: 32, tempMin: 21, rainProb: 15, condition: 'Clear Sunshine', rainfallMm: 0 }
      ]
    },
    zones: [
      {
        id: 'zone-a',
        name: 'Zone A - North Plot (Flowering)',
        crop: 'cotton',
        areaAcre: 1.0,
        status: 'healthy',
        soilMoisture: 62,
        ndviHealth: 0.82,
        temp: 29.1,
        notes: 'Good square retention. Canopy density high.',
        recommendedAction: 'Inspect for sucking pests beneath bottom canopy.'
      },
      {
        id: 'zone-b',
        name: 'Zone B - East Ridge (Waterlogged prone)',
        crop: 'cotton',
        areaAcre: 1.2,
        status: 'water_stress',
        soilMoisture: 72,
        ndviHealth: 0.74,
        temp: 28.6,
        notes: 'Low elevation slope. Rain tomorrow may pool water.',
        recommendedAction: 'Clear furrow drainage outlets today before 5 PM.'
      },
      {
        id: 'zone-c',
        name: 'Zone C - West Terrace (Bollworm Risk)',
        crop: 'cotton',
        areaAcre: 1.0,
        status: 'pest_alert',
        soilMoisture: 60,
        ndviHealth: 0.69,
        temp: 29.8,
        notes: 'Early yellowing on margin leaves. High humidity incubation.',
        recommendedAction: 'Check 20 plants for whitefly nymphs.'
      }
    ]
  },
  {
    id: 'suresh-paddy-ap',
    name: 'Suresh Reddy',
    avatar: '👨🏾‍🌾',
    phone: '+91 94401 78923',
    state: 'Andhra Pradesh',
    district: 'East Godavari',
    village: 'Kadiam',
    crop: 'rice',
    cropNameEn: 'Swarna Paddy (MTU 7029)',
    variety: 'Semi-Dwarf Medium Duration',
    sowingDate: '2026-07-02',
    cropStage: 'tillering',
    cropStageName: 'Active Tillering Phase (52 Days)',
    cropDays: 52,
    totalAcreage: 5.0,
    soilType: 'alluvial',
    soilMoisture: 82, // Standing water
    irrigationType: 'borewell_canal',
    farmerCategory: 'medium',
    equipmentOwned: ['Tractor (35 HP)', 'Power Weeder', 'Submersible Pump (7.5 HP)'],
    hasSoilHealthCard: true,
    hasKisanCreditCard: true,
    isTaxPayer: false,
    weather: {
      temp: 33.2,
      condition: 'Sunny with Moderate Humidity',
      conditionIcon: 'sun',
      rainProbability: 18,
      expectedRainfallMm: 0,
      rainForecastWindow: 'Clear Skies for next 4 days',
      humidity: 68,
      windSpeedKmh: 9,
      uvIndex: 8,
      soilMoisturePercent: 82,
      forecastNext3Days: [
        { day: 'Tomorrow', tempMax: 34, tempMin: 25, rainProb: 15, condition: 'Clear Sun', rainfallMm: 0 },
        { day: 'Day 2', tempMax: 34, tempMin: 26, rainProb: 20, condition: 'Partly Cloudy', rainfallMm: 0 },
        { day: 'Day 3', tempMax: 33, tempMin: 25, rainProb: 25, condition: 'Humid Sunny', rainfallMm: 2 }
      ]
    },
    zones: [
      {
        id: 'zone-p1',
        name: 'Parcel 1 - Canal Head',
        crop: 'rice',
        areaAcre: 2.5,
        status: 'healthy',
        soilMoisture: 85,
        ndviHealth: 0.88,
        temp: 32.8,
        notes: 'Optimal tillering (18-22 tillers per hill).',
        recommendedAction: 'Apply 2nd split Urea (30 kg/acre) with Zinc sulphate.'
      },
      {
        id: 'zone-p2',
        name: 'Parcel 2 - Tail-End Channel',
        crop: 'rice',
        areaAcre: 2.5,
        status: 'nutrient_deficiency',
        soilMoisture: 78,
        ndviHealth: 0.73,
        temp: 33.6,
        notes: 'Mild chlorosis observed on younger leaves (Zinc deficiency).',
        recommendedAction: 'Foliar spray of 0.5% ZnSO4 + 2% Urea.'
      }
    ]
  },
  {
    id: 'harpreet-wheat-pb',
    name: 'Harpreet Singh',
    avatar: '👳🏽‍♂️',
    phone: '+91 98140 33219',
    state: 'Punjab',
    district: 'Ludhiana',
    village: 'Samrala',
    crop: 'wheat',
    cropNameEn: 'Wheat (HD-3086 Pusa Gautami)',
    variety: 'High Yield Timely Sown',
    sowingDate: '2026-11-10',
    cropStage: 'tillering',
    cropStageName: 'Crown Root & Tillering Stage (42 Days)',
    cropDays: 42,
    totalAcreage: 8.5,
    soilType: 'sandy_loam',
    soilMoisture: 48,
    irrigationType: 'flood_furrow',
    farmerCategory: 'large',
    equipmentOwned: ['Tractor (55 HP 4WD)', 'Happy Seeder', 'Laser Land Leveler', 'Rotavator'],
    hasSoilHealthCard: true,
    hasKisanCreditCard: true,
    isTaxPayer: true,
    weather: {
      temp: 21.0,
      condition: 'Chilly Foggy Morning, Sunny Afternoon',
      conditionIcon: 'cloud-fog',
      rainProbability: 5,
      expectedRainfallMm: 0,
      rainForecastWindow: 'No rain expected this week',
      humidity: 74,
      windSpeedKmh: 6,
      uvIndex: 5,
      soilMoisturePercent: 48,
      forecastNext3Days: [
        { day: 'Tomorrow', tempMax: 22, tempMin: 8, rainProb: 5, condition: 'Fog to Sun', rainfallMm: 0 },
        { day: 'Day 2', tempMax: 21, tempMin: 7, rainProb: 10, condition: 'Cold Breeze', rainfallMm: 0 },
        { day: 'Day 3', tempMax: 20, tempMin: 6, rainProb: 10, condition: 'Mild Sunshine', rainfallMm: 0 }
      ]
    },
    zones: [
      {
        id: 'zone-w1',
        name: 'Block 1 - Main Highway Plot',
        crop: 'wheat',
        areaAcre: 4.5,
        status: 'healthy',
        soilMoisture: 49,
        ndviHealth: 0.85,
        temp: 20.8,
        notes: 'Dense crown root establishment. Zero weed infestation.',
        recommendedAction: 'Optimal condition for 1st top dressing urea (45 kg/acre).'
      },
      {
        id: 'zone-w2',
        name: 'Block 2 - Well Tubewell Sector',
        crop: 'wheat',
        areaAcre: 4.0,
        status: 'water_stress',
        soilMoisture: 42,
        ndviHealth: 0.77,
        temp: 21.4,
        notes: 'Soil surface cracking. Critical CRI irrigation window open.',
        recommendedAction: 'Schedule 1st CRI irrigation today before 4 PM.'
      }
    ]
  },
  {
    id: 'manjunath-tomato-ka',
    name: 'Manjunath Gowda',
    avatar: '👨🏾‍🌾',
    phone: '+91 97412 88102',
    state: 'Karnataka',
    district: 'Kolar',
    village: 'Mulbagal',
    crop: 'tomato',
    cropNameEn: 'Tomato (Arka Rakshak F1)',
    variety: 'Triple Disease Resistant Hybrid',
    sowingDate: '2026-07-20',
    cropStage: 'fruiting',
    cropStageName: 'Fruit Development & Early Ripening (62 Days)',
    cropDays: 62,
    totalAcreage: 2.0,
    soilType: 'red_loamy',
    soilMoisture: 56,
    irrigationType: 'drip',
    farmerCategory: 'marginal_small',
    equipmentOwned: ['Battery Knapsack Sprayer', 'Mulching Sheet Setup', 'Venturi Fertigation Unit'],
    hasSoilHealthCard: true,
    hasKisanCreditCard: false,
    isTaxPayer: false,
    weather: {
      temp: 27.5,
      condition: 'Humid with Afternoon Thundercloud Build-up',
      conditionIcon: 'cloud-sun',
      rainProbability: 62,
      expectedRainfallMm: 14,
      rainForecastWindow: 'Today 5:30 PM - 7:30 PM',
      humidity: 82,
      windSpeedKmh: 12,
      uvIndex: 6,
      soilMoisturePercent: 56,
      forecastNext3Days: [
        { day: 'Today PM', tempMax: 27, tempMin: 19, rainProb: 62, condition: 'Evening Thundershowers', rainfallMm: 14 },
        { day: 'Tomorrow', tempMax: 28, tempMin: 19, rainProb: 35, condition: 'Partly Sunny', rainfallMm: 4 },
        { day: 'Day 3', tempMax: 29, tempMin: 18, rainProb: 15, condition: 'Pleasant Sunshine', rainfallMm: 0 }
      ]
    },
    zones: [
      {
        id: 'zone-t1',
        name: 'Plot 1 - Trellised Tomato Block',
        crop: 'tomato',
        areaAcre: 1.0,
        status: 'pest_alert',
        soilMoisture: 58,
        ndviHealth: 0.76,
        temp: 27.2,
        notes: 'Early concentric ring spots observed on lower foliage (Early Blight).',
        recommendedAction: 'Hold copper oxychloride spray until tomorrow morning post-rain.'
      },
      {
        id: 'zone-t2',
        name: 'Plot 2 - Mulched Row Block',
        crop: 'tomato',
        areaAcre: 1.0,
        status: 'harvest_ready',
        soilMoisture: 54,
        ndviHealth: 0.86,
        temp: 27.8,
        notes: 'First picking cluster ready (breaker stage). Mandi price high at Kolar.',
        recommendedAction: 'Harvest breaker stage tomatoes today before 3 PM to avoid rain damage.'
      }
    ]
  }
];
