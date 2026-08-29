import { CropType } from './index';

export interface RentalTruckVehicle {
  id: string;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  vehicleType: 'Mini Truck (Tata Ace / Bolero Pickup)' | 'Tractor Trolley (High Capacity)' | 'Medium Truck (Eicher 14ft)' | 'Heavy 10-Tonne Multi-Axle';
  vehicleNumber: string;
  capacityTonnes: number;
  ratePerKmRupees: number;
  baseFareRupees: number;
  currentLocation: string;
  district: string;
  distanceKm: number;
  availability: 'available_now' | 'booked_today' | 'on_trip';
  features: string[];
}

export interface FarmLabourProfile {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'crew_group';
  ageOrCrewSize: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  distanceKm: number;
  primarySkills: string[];
  expectedDailyWageRupees: number;
  experienceYears: number;
  kisanRating: number;
  availabilityStatus: 'available_today' | 'booked_this_week';
  preferredWork: 'Daily Wage (Dihadi)' | 'Contract Per Acre (Theka)' | 'Both';
  photoAvatar: string;
}
