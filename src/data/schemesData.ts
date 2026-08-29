import { Scheme, FarmerProfile, SchemeMatchResult } from '../types';

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
    benefitsSummary: 'Comprehensive risk coverage from pre-sowing to post-harvest against unpreventable natural perils (drought, flood, unseasonal rain, pest outbreaks). Farmer premium only 1.5% - 2.0%.',
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
      'Quotation from Empanelled Micro-Irrigation vendor (Jain / Netafim)',
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
      'Aadhaar Card and Caste Certificate (if SC/ST/OBC bonus)',
      'Land Record 7/12 / 8A',
      'Bank Passbook photocopy',
      'Authorized Dealer Machinery Proforma Invoice'
    ],
    applicationDeadline: '2026-09-30',
    daysRemaining: 32,
    officialPortalUrl: 'https://agrimachinery.nic.in'
  },
  {
    id: 'pkvy-organic',
    code: 'PKVY',
    name: 'Paramparagat Krishi Vikas Yojana (Organic Farming Cluster)',
    category: 'organic',
    stateApplicability: ['ALL'],
    benefitsSummary: 'Financial assistance of ₹50,000 per hectare for 3 years, of which ₹31,000 is directly provided for organic inputs (bio-fertilizers, vermicompost, biopesticides).',
    maxBenefitAmount: '₹31,000 / ha for organic inputs',
    eligibilityCriteria: {
      maxLandAcre: 5.0,
      taxPayerAllowed: true,
      requiresAadhaarLinkedBank: true,
      allowedFarmerCategories: ['marginal_small', 'medium', 'women_sc_st', 'fpo_member']
    },
    requiredDocuments: [
      'Soil Health Card',
      'Cluster Membership verification form',
      'Pledge of zero synthetic chemical usage for 3 years',
      'Aadhaar & Bank details'
    ],
    applicationDeadline: '2026-10-15',
    daysRemaining: 47,
    officialPortalUrl: 'https://pgsindia-ncof.gov.in'
  },
  {
    id: 'mahadbt-cotton-pest',
    code: 'MAHA-AGRI',
    name: 'MahaDBT Integrated Cotton Pest & Sucking Pest Management Scheme',
    category: 'state',
    stateApplicability: ['Maharashtra'],
    benefitsSummary: 'Special 60% subsidy on Pheromone traps, Light traps, and Neem-based biopesticides for Vidarbha and Marathwada cotton farmers.',
    maxBenefitAmount: '60% Subsidy (₹4,800 / Acre)',
    subsidyPercentage: 60,
    eligibilityCriteria: {
      applicableCrops: ['cotton'],
      taxPayerAllowed: true,
      requiresAadhaarLinkedBank: true
    },
    requiredDocuments: [
      'MahaDBT Farmer Registration ID',
      '7/12 Extract with Cotton crop entry in e-Pik Pahani',
      'Aadhaar-linked Bank Account'
    ],
    applicationDeadline: '2026-09-20',
    daysRemaining: 22,
    officialPortalUrl: 'https://mahadbt.maharashtra.gov.in'
  },
  {
    id: 'rythu-bandhu-investment',
    code: 'RYTHU-BANDHU',
    name: 'Rythu Bandhu (Agriculture Investment Support Scheme)',
    category: 'state',
    stateApplicability: ['Telangana', 'Andhra Pradesh'],
    benefitsSummary: 'Financial investment support of ₹5,000 per acre per season (₹10,000/acre/year) for purchase of seeds, fertilizers, and field preparation.',
    maxBenefitAmount: '₹10,000 / Acre / Year',
    eligibilityCriteria: {
      taxPayerAllowed: true,
      requiresAadhaarLinkedBank: true
    },
    requiredDocuments: [
      'Pattadar Passbook / 1B Document',
      'Aadhaar Card',
      'Nationalized Bank Account Passbook'
    ],
    applicationDeadline: '2026-10-25',
    daysRemaining: 57,
    officialPortalUrl: 'https://rythubandhu.telangana.gov.in'
  }
];

export function matchSchemesForFarmer(farmer: FarmerProfile): SchemeMatchResult[] {
  return agriculturalSchemes.map(scheme => {
    let score = 100;
    const whyEligible: string[] = [];
    const whyNotEligible: string[] = [];

    // State check
    if (!scheme.stateApplicability.includes('ALL') && !scheme.stateApplicability.includes(farmer.state)) {
      score -= 50;
      whyNotEligible.push(`Scheme is exclusive to farmers in ${scheme.stateApplicability.join(', ')} (Your farm is registered in ${farmer.state}).`);
    } else {
      whyEligible.push(`Your state (${farmer.state}) is fully covered under the operational guidelines.`);
    }

    // Taxpayer check (PM-KISAN excludes income tax payers)
    if (scheme.eligibilityCriteria.taxPayerAllowed === false && farmer.isTaxPayer) {
      score -= 40;
      whyNotEligible.push(`Institutional landholders and income tax paying individuals are legally excluded under clause 4.2.`);
    } else if (scheme.eligibilityCriteria.taxPayerAllowed === false && !farmer.isTaxPayer) {
      whyEligible.push(`You meet the non-income tax payer criterion for 100% direct benefit pass-through.`);
    }

    // Land Size check
    if (scheme.eligibilityCriteria.maxLandAcre && farmer.totalAcreage > scheme.eligibilityCriteria.maxLandAcre) {
      score -= 30;
      whyNotEligible.push(`Your landholding (${farmer.totalAcreage} acres) exceeds the maximum ceiling of ${scheme.eligibilityCriteria.maxLandAcre} acres.`);
    } else if (scheme.eligibilityCriteria.maxLandAcre) {
      whyEligible.push(`Your landholding of ${farmer.totalAcreage} acres falls comfortably within the < ${scheme.eligibilityCriteria.maxLandAcre} acres limit.`);
    }

    // Crop match check
    if (scheme.eligibilityCriteria.applicableCrops && !scheme.eligibilityCriteria.applicableCrops.includes('ALL')) {
      if (scheme.eligibilityCriteria.applicableCrops.includes(farmer.crop)) {
        whyEligible.push(`Your sown crop (${farmer.cropNameEn}) is in the priority approved list for this benefit.`);
      } else {
        score -= 35;
        whyNotEligible.push(`Your current crop (${farmer.cropNameEn}) is not among the mandated crops (${scheme.eligibilityCriteria.applicableCrops.join(', ')}).`);
      }
    }

    // Farmer Category check
    if (scheme.eligibilityCriteria.allowedFarmerCategories && !scheme.eligibilityCriteria.allowedFarmerCategories.includes(farmer.farmerCategory)) {
      score -= 25;
      whyNotEligible.push(`This special tranche is prioritized for ${scheme.eligibilityCriteria.allowedFarmerCategories.join(', ')} farmers.`);
    } else if (scheme.eligibilityCriteria.allowedFarmerCategories) {
      whyEligible.push(`Your farmer classification (${farmer.farmerCategory.replace('_', ' ')}) qualifies for maximum subsidy slab.`);
    }

    // Irrigation setup
    if (scheme.eligibilityCriteria.requiredIrrigation && scheme.eligibilityCriteria.requiredIrrigation.includes(farmer.irrigationType)) {
      whyEligible.push(`Your irrigation method (${farmer.irrigationType}) matches the target equipment criteria.`);
    }

    // Document readiness
    if (farmer.hasSoilHealthCard && scheme.requiredDocuments.some(d => d.includes('Soil Health Card'))) {
      whyEligible.push(`Soil Health Card requirement already verified in your digital profile.`);
    }

    // Final score clamping
    score = Math.max(10, Math.min(98, score));
    const isEligible = whyNotEligible.length === 0 && score >= 70;

    const nextSteps = isEligible
      ? [
          `1. Prepare required KYC: ${scheme.requiredDocuments.slice(0, 2).join(', ')}.`,
          `2. Submit online e-KYC or visit nearest CSC / Rythu Seva Kendra before ${scheme.applicationDeadline}.`,
          `3. Keep track of DBT dispatch reference on ${scheme.code} portal.`
        ]
      : [
          `1. Resolve criteria discrepancy: ${whyNotEligible[0] || 'Update farm profile documents.'}`,
          `2. Check alternate state welfare schemes or consult District Agriculture Officer (DAO).`
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
