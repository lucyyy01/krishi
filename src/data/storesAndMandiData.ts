import { MandiLocationItem, SeedFertilizerItem } from '../types';

export const nearbyMandisList: MandiLocationItem[] = [
  {
    id: 'mandi-yavatmal',
    name: 'Yavatmal APMC Main Market Yard',
    district: 'Yavatmal',
    state: 'Maharashtra',
    distanceKm: 8.4,
    travelTimeMinutes: 18,
    contactNumber: '+91 7232 245102',
    address: 'Near Old Bus Stand, Arni Road, Yavatmal, MH - 445001',
    tradingHours: '08:00 AM - 04:30 PM (Mon-Sat)',
    dailyArrivalTonnes: 420,
    isAPMCApproved: true,
    commodities: [
      { crop: 'cotton', commodityName: 'Bt Cotton (Medium Staple)', modalPrice: 7450, minPrice: 7150, maxPrice: 7680, trend: 'up' },
      { crop: 'soybean', commodityName: 'Yellow Soybean JS-335', modalPrice: 4890, minPrice: 4650, maxPrice: 5020, trend: 'flat' },
      { crop: 'wheat', commodityName: 'Wheat Lokwan', modalPrice: 2450, minPrice: 2300, maxPrice: 2580, trend: 'up' }
    ]
  },
  {
    id: 'mandi-nagpur',
    name: 'Nagpur Cotton & Grain Terminal Yard (Kalamna)',
    district: 'Nagpur',
    state: 'Maharashtra',
    distanceKm: 42.0,
    travelTimeMinutes: 55,
    contactNumber: '+91 712 2680411',
    address: 'Kalamna Market, Central Avenue Road, Nagpur - 440008',
    tradingHours: '07:30 AM - 06:00 PM (All Days)',
    dailyArrivalTonnes: 1250,
    isAPMCApproved: true,
    commodities: [
      { crop: 'cotton', commodityName: 'Raw Cotton Long Staple', modalPrice: 7620, minPrice: 7280, maxPrice: 7850, trend: 'up' },
      { crop: 'chilli', commodityName: 'Dry Red Chilli Teja', modalPrice: 19400, minPrice: 18000, maxPrice: 20800, trend: 'up' },
      { crop: 'soybean', commodityName: 'Soybean Grade-A', modalPrice: 4950, minPrice: 4720, maxPrice: 5100, trend: 'up' }
    ]
  },
  {
    id: 'mandi-kakinada',
    name: 'Kakinada Commercial APMC Yard',
    district: 'East Godavari',
    state: 'Andhra Pradesh',
    distanceKm: 12.5,
    travelTimeMinutes: 24,
    contactNumber: '+91 884 2378901',
    address: 'Port Road, Kakinada, Andhra Pradesh - 533001',
    tradingHours: '08:00 AM - 05:00 PM',
    dailyArrivalTonnes: 680,
    isAPMCApproved: true,
    commodities: [
      { crop: 'rice', commodityName: 'Common Paddy Swarna', modalPrice: 2320, minPrice: 2280, maxPrice: 2350, trend: 'flat' },
      { crop: 'rice', commodityName: 'Fine Paddy BPT 5204 (Sona Masoori)', modalPrice: 2850, minPrice: 2700, maxPrice: 2950, trend: 'up' },
      { crop: 'maize', commodityName: 'Yellow Maize Hybrid', modalPrice: 2150, minPrice: 2000, maxPrice: 2220, trend: 'down' }
    ]
  },
  {
    id: 'mandi-kolar',
    name: 'Kolar APMC Tomato & Vegetable Market Yard',
    district: 'Kolar',
    state: 'Karnataka',
    distanceKm: 6.2,
    travelTimeMinutes: 14,
    contactNumber: '+91 8152 222340',
    address: 'APMC Yard, NH-75, Kolar, Karnataka - 563101',
    tradingHours: '05:00 AM - 02:00 PM (Daily)',
    dailyArrivalTonnes: 850,
    isAPMCApproved: true,
    commodities: [
      { crop: 'tomato', commodityName: 'Hybrid Tomato Arka Rakshak', modalPrice: 3200, minPrice: 2800, maxPrice: 3600, trend: 'up' },
      { crop: 'chilli', commodityName: 'Green Chilli Hybrid', modalPrice: 4200, minPrice: 3800, maxPrice: 4600, trend: 'up' }
    ]
  },
  {
    id: 'mandi-khanna',
    name: 'Khanna Asia Largest Grain Market',
    district: 'Ludhiana',
    state: 'Punjab',
    distanceKm: 14.8,
    travelTimeMinutes: 22,
    contactNumber: '+91 1628 226105',
    address: 'GT Road, Khanna, District Ludhiana, Punjab - 141401',
    tradingHours: '07:00 AM - 07:00 PM',
    dailyArrivalTonnes: 2100,
    isAPMCApproved: true,
    commodities: [
      { crop: 'wheat', commodityName: 'Wheat HD-3086 / PBW-725', modalPrice: 2475, minPrice: 2320, maxPrice: 2560, trend: 'up' },
      { crop: 'rice', commodityName: 'Basmati Paddy 1121', modalPrice: 4100, minPrice: 3850, maxPrice: 4350, trend: 'up' }
    ]
  }
];

export const seedsAndFertilizerInventory: SeedFertilizerItem[] = [
  {
    id: 'sf-urea',
    type: 'fertilizer',
    name: 'Neem Coated Urea (46% Nitrogen)',
    cropApplicability: 'All Crops (Cotton, Paddy, Wheat, Maize)',
    brandOrGovt: 'IFFCO / KRIBHCO (Govt Subsidized)',
    mrpRupees: 2450,
    subsidizedPriceRupees: 266.50, // Official Govt Subsidized bag price in India
    subsidyPercentage: 89,
    unit: '50 kg Bag',
    isGovtSubsidized: true,
    stockStatus: 'in_stock',
    dealerName: 'Kisan Seva Kendra & Sahakari Society',
    dealerDistanceKm: 2.1,
    dealerLocation: 'Ghatanji Main Chowk, Yavatmal',
    dealerPhone: '+91 98220 11223',
    verifiedDealer: true
  },
  {
    id: 'sf-dap',
    type: 'fertilizer',
    name: 'DAP (Di-Ammonium Phosphate 18:46:0)',
    cropApplicability: 'Basal application for all field crops',
    brandOrGovt: 'IFFCO / Coromandel Gromor',
    mrpRupees: 4070,
    subsidizedPriceRupees: 1350.00,
    subsidyPercentage: 67,
    unit: '50 kg Bag',
    isGovtSubsidized: true,
    stockStatus: 'in_stock',
    dealerName: 'Vidarbha Agri Inputs Agency',
    dealerDistanceKm: 3.8,
    dealerLocation: 'Near Tehsil Office, Yavatmal',
    dealerPhone: '+91 94228 77665',
    verifiedDealer: true
  },
  {
    id: 'sf-mop',
    type: 'fertilizer',
    name: 'MOP (Muriate of Potash 60% K2O)',
    cropApplicability: 'Cotton, Paddy, Sugarcane, Vegetables',
    brandOrGovt: 'IPL (Indian Potash Limited)',
    mrpRupees: 2800,
    subsidizedPriceRupees: 1700.00,
    subsidyPercentage: 39,
    unit: '50 kg Bag',
    isGovtSubsidized: true,
    stockStatus: 'limited',
    dealerName: 'Ghatanji Agro Centre',
    dealerDistanceKm: 1.5,
    dealerLocation: 'Market Yard Road, Yavatmal',
    dealerPhone: '+91 98901 33445',
    verifiedDealer: true
  },
  {
    id: 'sf-seed-cotton',
    type: 'seed',
    name: 'Certified Bt Cotton BG-II Hybrid Seed (Ajeet-155 / RCH-659)',
    cropApplicability: 'Kharif Cotton Sowing',
    brandOrGovt: 'Mahyco / Rasi Seeds (Govt Certified Price Cap)',
    mrpRupees: 950,
    subsidizedPriceRupees: 864.00,
    subsidyPercentage: 9,
    unit: '475g Packet (with refuge seeds)',
    isGovtSubsidized: true,
    stockStatus: 'in_stock',
    dealerName: 'Shri Ganesh Krishi Kendra',
    dealerDistanceKm: 2.4,
    dealerLocation: 'Station Road, Yavatmal',
    dealerPhone: '+91 94231 99881',
    verifiedDealer: true
  },
  {
    id: 'sf-seed-paddy',
    type: 'seed',
    name: 'Breeder & Foundation Swarna Paddy Seed (MTU 7029)',
    cropApplicability: 'Direct seeded / Transplanted Paddy',
    brandOrGovt: 'AP Seed Development Corp (APSSDC)',
    mrpRupees: 1400,
    subsidizedPriceRupees: 750.00,
    subsidyPercentage: 46,
    unit: '30 kg Bag',
    isGovtSubsidized: true,
    stockStatus: 'in_stock',
    dealerName: 'Rythu Bharosa Kendra (RBK)',
    dealerDistanceKm: 1.2,
    dealerLocation: 'Kadiam Village Centre, East Godavari',
    dealerPhone: '+91 94405 66778',
    verifiedDealer: true
  },
  {
    id: 'sf-seed-wheat',
    type: 'seed',
    name: 'Certified Wheat Seed HD-3086 (Pusa Gautami)',
    cropApplicability: 'Timely Sown Irrigated Wheat',
    brandOrGovt: 'Punjab State Seeds Corp (PUNSEED)',
    mrpRupees: 1800,
    subsidizedPriceRupees: 1000.00,
    subsidyPercentage: 44,
    unit: '40 kg Bag',
    isGovtSubsidized: true,
    stockStatus: 'in_stock',
    dealerName: 'Samrala Cooperative Agri Society',
    dealerDistanceKm: 3.0,
    dealerLocation: 'Samrala Main Road, Ludhiana',
    dealerPhone: '+91 98141 55667',
    verifiedDealer: true
  },
  {
    id: 'sf-bio-trichoderma',
    type: 'pesticide',
    name: 'Trichoderma Viride 1% WP (Bio-Fungicide)',
    cropApplicability: 'Soil treatment for Root Rot, Wilt, Damping-off',
    brandOrGovt: 'ICAR / State Bio-Control Lab',
    mrpRupees: 250,
    subsidizedPriceRupees: 110.00,
    subsidyPercentage: 56,
    unit: '1 kg Pack',
    isGovtSubsidized: true,
    stockStatus: 'in_stock',
    dealerName: 'District KVK Input Counter',
    dealerDistanceKm: 4.5,
    dealerLocation: 'KVK Complex, Yavatmal',
    dealerPhone: '+91 7232 251144',
    verifiedDealer: true
  }
];
