import { MandiItem, CropType } from '../types';

export const mandiRatesDatabase: MandiItem[] = [
  {
    crop: 'cotton',
    commodityName: 'Raw Cotton (Kapas Medium Staple)',
    variety: 'Bt Shankar-6 / Bunny',
    marketName: 'Yavatmal APMC Mandi',
    state: 'Maharashtra',
    currentModalPrice: 7450, // ₹/Quintal
    mspPrice: 7121,
    priceChange7Days: +4.2,
    priceTrend: 'rising',
    forecastPriceNextWeek: 7680,
    aiRecommendation: 'HOLD_AND_STORE',
    aiReasoning: 'Global textile demand is firming up and local arrivals are tapering by 18%. Monthly storage cost is approx ₹45/qtl while price gain is projected at +₹230/qtl over 14 days.',
    storageCostEstimatePerMonth: 45
  },
  {
    crop: 'rice',
    commodityName: 'Paddy Common (Dhan)',
    variety: 'Swarna / MTU 7029',
    marketName: 'Kakinada APMC Mandi',
    state: 'Andhra Pradesh',
    currentModalPrice: 2320,
    mspPrice: 2300,
    priceChange7Days: -1.1,
    priceTrend: 'stable',
    forecastPriceNextWeek: 2330,
    aiRecommendation: 'SELL_NOW',
    aiReasoning: 'Mandi price is hovering at par with government MSP. FCI procurement centers are operating with active direct bank credit. Avoid moisture weight loss by selling at current peak harvest window.',
    storageCostEstimatePerMonth: 30
  },
  {
    crop: 'wheat',
    commodityName: 'Wheat (Gehun Lokwan / Sharbati)',
    variety: 'HD-3086 / PBW-725',
    marketName: 'Khanna Grain Market',
    state: 'Punjab',
    currentModalPrice: 2475,
    mspPrice: 2275,
    priceChange7Days: +2.8,
    priceTrend: 'rising',
    forecastPriceNextWeek: 2540,
    aiRecommendation: 'HOLD_AND_STORE',
    aiReasoning: 'Flour mill demand from South Indian logistics corridors is pushing open market premiums ₹200 above MSP. Holding grain in dry warehouse yields net positive margin.',
    storageCostEstimatePerMonth: 35
  },
  {
    crop: 'tomato',
    commodityName: 'Hybrid Tomato',
    variety: 'Arka Rakshak / Abhinav',
    marketName: 'Kolar APMC Market Yard',
    state: 'Karnataka',
    currentModalPrice: 3200,
    mspPrice: 1600, // Market rate high
    priceChange7Days: +14.5,
    priceTrend: 'rising',
    forecastPriceNextWeek: 2850,
    aiRecommendation: 'SELL_NOW',
    aiReasoning: 'Tomato prices at Kolar have surged +14.5% due to temporary supply crunch in neighboring states. New crop arrivals from Nashik expected next week will cool prices. Sell harvest immediately!',
    storageCostEstimatePerMonth: 120 // Highly perishable cold storage
  },
  {
    crop: 'soybean',
    commodityName: 'Soybean (Yellow)',
    variety: 'JS-335 / JS-9560',
    marketName: 'Indore Mandi',
    state: 'Madhya Pradesh',
    currentModalPrice: 4890,
    mspPrice: 4892,
    priceChange7Days: +1.5,
    priceTrend: 'stable',
    forecastPriceNextWeek: 4950,
    aiRecommendation: 'SELL_PARTIAL',
    aiReasoning: 'Prices are tracking close to MSP. Liquidate 50% to cover input expenses and hold remaining 50% in warehouse receipt for festival oil rally.',
    storageCostEstimatePerMonth: 40
  },
  {
    crop: 'chilli',
    commodityName: 'Dry Red Chilli (Teja)',
    variety: 'Guntur Sannam (S4)',
    marketName: 'Guntur Mirchi Yard',
    state: 'Andhra Pradesh',
    currentModalPrice: 19800,
    mspPrice: 14500,
    priceChange7Days: +6.4,
    priceTrend: 'rising',
    forecastPriceNextWeek: 20500,
    aiRecommendation: 'HOLD_AND_STORE',
    aiReasoning: 'Export demand to Southeast Asia and spice extractors remains robust. Grade A Teja chillies commanding high premium in cold storage.',
    storageCostEstimatePerMonth: 85
  }
];
