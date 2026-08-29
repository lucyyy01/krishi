export type Language = 'en' | 'hi' | 'mr' | 'te' | 'ta' | 'kn' | 'gu' | 'pa' | 'bn';

export type CropType = 'cotton' | 'rice' | 'wheat' | 'tomato' | 'soybean' | 'sugarcane' | 'maize' | 'chilli';

export type CropStage = 
  | 'sowing' 
  | 'vegetative' 
  | 'tillering' 
  | 'flowering' 
  | 'fruiting' 
  | 'boll_formation' 
  | 'grain_filling' 
  | 'ripening' 
  | 'harvest_ready';

export type SoilType = 'black_cotton' | 'alluvial' | 'red_loamy' | 'sandy_loam' | 'clay_loam';

export type IrrigationType = 'drip' | 'sprinkler' | 'flood_furrow' | 'rainfed' | 'borewell_canal';

export type FarmerCategory = 'marginal_small' | 'medium' | 'large' | 'women_sc_st' | 'fpo_member';

export interface WeatherData {
  temp: number;
  condition: string;
  conditionIcon: string;
  rainProbability: number;
  expectedRainfallMm: number;
  rainForecastWindow: string;
  humidity: number;
  windSpeedKmh: number;
  uvIndex: number;
  soilMoisturePercent: number;
  forecastNext3Days: {
    day: string;
    tempMax: number;
    tempMin: number;
    rainProb: number;
    condition: string;
    rainfallMm: number;
  }[];
}

export interface FarmZone {
  id: string;
  name: string;
  crop: CropType;
  areaAcre: number;
  status: 'healthy' | 'water_stress' | 'pest_alert' | 'nutrient_deficiency' | 'harvest_ready';
  soilMoisture: number;
  ndviHealth: number;
  temp: number;
  notes: string;
  recommendedAction: string;
}

export interface FarmerProfile {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  state: string;
  district: string;
  village: string;
  crop: CropType;
  cropNameEn: string;
  variety: string;
  sowingDate: string;
  cropStage: CropStage;
  cropStageName: string;
  cropDays: number;
  totalAcreage: number;
  soilType: SoilType;
  soilMoisture: number;
  irrigationType: IrrigationType;
  farmerCategory: FarmerCategory;
  equipmentOwned: string[];
  hasSoilHealthCard: boolean;
  hasKisanCreditCard: boolean;
  isTaxPayer: boolean;
  weather: WeatherData;
  zones: FarmZone[];
}

export type ActionUrgency = 'critical' | 'warning' | 'optimal' | 'info';

export interface DailyAction {
  id: string;
  title: string;
  category: 'irrigation' | 'pest_disease' | 'fertilizer' | 'scheme' | 'harvest_market';
  urgency: ActionUrgency;
  actionText: string;
  reasoning: string;
  timingWindow: string;
  savingsImpact?: string;
  executed?: boolean;
  iconName: string;
  details?: string[];
}

export interface SimulationResult {
  scenarioId: string;
  scenarioTitle: string;
  verdict: 'not_recommended' | 'proceed_with_caution' | 'highly_recommended';
  verdictTitle: string;
  verdictExplanation: string;
  metrics: {
    waterWastedLitrePerAcre: number;
    financialImpactRupees: number;
    diseaseRiskChangePercent: number;
    yieldImpactPercent: number;
    soilRunoffRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  };
  keyTakeaways: string[];
  bestAlternative: string;
}

export interface Scheme {
  id: string;
  code: string;
  name: string;
  category: 'central' | 'state' | 'insurance' | 'subsidy' | 'organic';
  stateApplicability: string[];
  benefitsSummary: string;
  maxBenefitAmount: string;
  eligibilityCriteria: {
    maxLandAcre?: number;
    minLandAcre?: number;
    allowedFarmerCategories?: FarmerCategory[];
    requiredIrrigation?: IrrigationType[];
    applicableCrops?: ('ALL' | CropType)[];
    taxPayerAllowed?: boolean;
    requiresAadhaarLinkedBank?: boolean;
  };
  requiredDocuments: string[];
  applicationDeadline: string;
  daysRemaining: number;
  officialPortalUrl: string;
  subsidyPercentage?: number;
}

export interface SchemeMatchResult {
  scheme: Scheme;
  matchScore: number;
  isEligible: boolean;
  whyEligiblePoints: string[];
  whyNotEligiblePoints: string[];
  nextSteps: string[];
  potentialBenefit: string;
}

export interface DiseaseRecord {
  id: string;
  crop: CropType;
  name: string;
  scientificName: string;
  confidenceDefault: number;
  severity: 'Low' | 'Moderate' | 'Severe';
  imageUrl: string;
  symptoms: string[];
  causes: string[];
  immediateActions: string[];
  organicTreatment: {
    name: string;
    dosage: string;
    frequency: string;
  };
  chemicalTreatment: {
    name: string;
    dosage: string;
    safetyIntervalDays: number;
  };
  weatherIntegratedAdvice: {
    isSprayingRecommendedNow: boolean;
    rainWashoffRisk: 'Low' | 'High' | 'Immediate Washout';
    sprayingWindowRecommendation: string;
    optimalTempAndWind: string;
  };
}

export interface MandiItem {
  crop: CropType;
  commodityName: string;
  variety: string;
  marketName: string;
  state: string;
  currentModalPrice: number;
  mspPrice: number;
  priceChange7Days: number;
  priceTrend: 'rising' | 'falling' | 'stable';
  forecastPriceNextWeek: number;
  aiRecommendation: 'SELL_NOW' | 'HOLD_AND_STORE' | 'SELL_PARTIAL';
  aiReasoning: string;
  storageCostEstimatePerMonth: number;
}

export interface MandiLocationItem {
  id: string;
  name: string;
  district: string;
  state: string;
  distanceKm: number;
  travelTimeMinutes: number;
  contactNumber: string;
  address: string;
  tradingHours: string;
  dailyArrivalTonnes: number;
  isAPMCApproved: boolean;
  commodities: {
    crop: CropType;
    commodityName: string;
    modalPrice: number;
    minPrice: number;
    maxPrice: number;
    trend: 'up' | 'down' | 'flat';
  }[];
}

export interface SeedFertilizerItem {
  id: string;
  type: 'seed' | 'fertilizer' | 'pesticide' | 'equipment';
  name: string;
  cropApplicability: string;
  brandOrGovt: string;
  mrpRupees: number;
  subsidizedPriceRupees: number;
  subsidyPercentage: number;
  unit: string;
  isGovtSubsidized: boolean;
  stockStatus: 'in_stock' | 'limited' | 'out_of_stock';
  dealerName: string;
  dealerDistanceKm: number;
  dealerLocation: string;
  dealerPhone: string;
  verifiedDealer: boolean;
}

export interface P2PLoanRequest {
  id: string;
  borrowerName: string;
  borrowerAvatar: string;
  borrowerVillage: string;
  borrowerDistrict: string;
  borrowerState: string;
  crop: CropType;
  landAcre: number;
  kisanTrustScore: number; // 300 - 900
  loanAmountRupees: number;
  fundedAmountRupees: number;
  interestRateMonthlyPercent: number; // e.g. 1.0% - 1.5%
  durationMonths: number;
  purpose: 'Emergency Seeds' | 'Borewell / Drip Repair' | 'Organic Input Purchase' | 'Diesel & Harvesting' | 'Fertilizer Pre-booking';
  description: string;
  dateRequested: string;
  repaymentDeadline: string;
  status: 'active' | 'fully_funded' | 'repaid';
  lendersCount: number;
}

export interface CropYieldAnalytics {
  cropName: string;
  variety: string;
  totalAcreage: number;
  sowingDate: string;
  growthDaysElapsed: number;
  totalGrowthCycleDays: number;
  growthCompletionPercent: number;
  currentBiomassHealthNDVI: number;
  projectedYieldQuintals: number;
  projectedYieldPerAcre: number;
  districtAverageYieldPerAcre: number;
  stateAverageYieldPerAcre: number;
  yieldPerformanceRatio: number; // e.g. 1.22 (22% above average)
  historicalHarvests: {
    year: string;
    season: 'Kharif' | 'Rabi' | 'Zaid';
    yieldQuintals: number;
    revenueRupees: number;
    priceRealizedPerQtl: number;
  }[];
  inventoryDistribution: {
    soldTonnes: number;
    storedWarehouseTonnes: number;
    retainedForSeedTonnes: number;
  };
}

export interface IoTSensorData {
  deviceStatus: 'online' | 'offline' | 'battery_low';
  lastPingTime: string;
  soilMoisture15cm: number; // %
  soilMoisture30cm: number; // %
  soilTemperatureC: number;
  ambientTemperatureC: number;
  ambientHumidityPercent: number;
  leafWetnessPercent: number;
  solarRadiationLux: number;
  soilNitrogenMgKg: number;
  soilPhosphorusMgKg: number;
  soilPotassiumMgKg: number;
  soilPh: number;
  smartDripValveState: 'OPEN' | 'CLOSED';
  automatedRainCutoffArmed: boolean;
  batteryLevelPercent: number;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorLocation: string;
  authorRole: 'Farmer' | 'Agronomist' | 'KVK Expert' | 'FPO Lead';
  timestamp: string;
  cropTag: CropType | 'general';
  category: 'question' | 'success_story' | 'pest_alert' | 'buy_sell_equipment';
  title: string;
  content: string;
  imageUrl?: string;
  upvotes: number;
  hasUpvoted?: boolean;
  commentsCount: number;
  comments: {
    id: string;
    author: string;
    role: string;
    text: string;
    timestamp: string;
    isExpertReply?: boolean;
  }[];
  equipmentPrice?: string;
}

export interface FarmRiskScore {
  totalScore: number;
  status: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  breakdown: {
    weatherRisk: number;
    pestRisk: number;
    waterStress: number;
    cropHealthRisk: number;
    marketRisk: number;
  };
  primaryRiskFactor: string;
}

export interface ProactiveAlert {
  id: string;
  timestamp: string;
  type: 'weather_warning' | 'pest_outbreak' | 'scheme_deadline' | 'mandi_surge';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  actionPrompt: string;
  resolved: boolean;
}

export interface AppliedSchemeApplication {
  id: string;
  schemeId: string;
  schemeName: string;
  schemeCode: string;
  subsidyValue: string;
  applicantName: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  aadhaarLast4: string;
  khasraNumber: string;
  bankAccountLast4: string;
  ifscCode: string;
  submittedAt: string;
  status: 'submitted' | 'under_review' | 'physical_inspection' | 'approved_dbt_scheduled';
  statusLabelHindi: string;
  trackingStep: number; // 1: Submitted, 2: Document Verification, 3: Field Inspection, 4: Approved & DBT
  talukaOffice: string;
  estimatedDisbursementDate: string;
}

export * from './logisticsTypes';
export * from './authTypes';
