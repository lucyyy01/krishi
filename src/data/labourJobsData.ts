import { FarmJobOffer } from '../types';

export const sampleFarmJobOffers: FarmJobOffer[] = [
  {
    id: 'job-101',
    farmerName: 'Ramesh Patil',
    farmerPhone: '+91 98220 12345',
    farmerVillage: 'Sawangi',
    farmerDistrict: 'Yavatmal',
    cropName: 'Cotton (कपास)',
    workType: 'Cotton Square & Boll Picking (कपास चुनाई)',
    workersNeeded: 8,
    dailyWageOffered: 450,
    durationDays: 3,
    startDate: 'Tomorrow Morning (6:30 AM)',
    urgency: 'urgent',
    status: 'open'
  },
  {
    id: 'job-102',
    farmerName: 'Gajanan Deshmukh',
    farmerPhone: '+91 94228 33445',
    farmerVillage: 'Ghatanji',
    farmerDistrict: 'Yavatmal',
    cropName: 'Cotton & Soybean',
    workType: 'Power Sprayer Chemical & Neem Spraying (दवाई छिड़काव)',
    workersNeeded: 2,
    dailyWageOffered: 700,
    durationDays: 2,
    startDate: 'Thursday (Post-Rain Clear Weather)',
    urgency: 'regular',
    status: 'open'
  },
  {
    id: 'job-103',
    farmerName: 'Suresh Kumar Reddy',
    farmerPhone: '+91 94401 77889',
    farmerVillage: 'Kadiam',
    farmerDistrict: 'East Godavari',
    cropName: 'Paddy (వరి)',
    workType: 'Paddy Nursery Uprooting & Row Transplanting (వరి నాట్లు)',
    workersNeeded: 12,
    dailyWageOffered: 500,
    durationDays: 4,
    startDate: 'Monday Morning',
    urgency: 'urgent',
    status: 'open'
  },
  {
    id: 'job-104',
    farmerName: 'Balwinder Singh Dhillon',
    farmerPhone: '+91 98141 66778',
    farmerVillage: 'Samrala',
    farmerDistrict: 'Ludhiana',
    cropName: 'Wheat / Paddy Stubble',
    workType: 'Super Seeder & Tractor Operator for Sowing',
    workersNeeded: 1,
    dailyWageOffered: 850,
    durationDays: 5,
    startDate: 'Immediate',
    urgency: 'urgent',
    status: 'open'
  }
];
