import { FarmerProfile, FarmLabourProfile } from './index';

export type UserRole = 'farmer' | 'labour' | 'both';

export interface AuthUser {
  id: string;
  role: UserRole;
  activeRoleMode: 'farmer' | 'labour';
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  avatar: string;
  farmerProfile?: FarmerProfile;
  labourProfile?: FarmLabourProfile;
}

export interface FarmJobOffer {
  id: string;
  farmerName: string;
  farmerPhone: string;
  farmerVillage: string;
  farmerDistrict: string;
  cropName: string;
  workType: string;
  workersNeeded: number;
  dailyWageOffered: number;
  durationDays: number;
  startDate: string;
  urgency: 'urgent' | 'regular';
  status: 'open' | 'accepted';
}
