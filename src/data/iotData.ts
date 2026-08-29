import { IoTSensorData, FarmerProfile } from '../types';

export function getFarmerIoTTelemetry(farmer: FarmerProfile): IoTSensorData {
  const isWet = farmer.soilMoisture > 70;
  return {
    deviceStatus: 'online',
    lastPingTime: '12 seconds ago (4G LoRaWAN Gateway)',
    soilMoisture15cm: farmer.soilMoisture,
    soilMoisture30cm: Math.max(35, farmer.soilMoisture - 6),
    soilTemperatureC: farmer.weather.temp - 2.8,
    ambientTemperatureC: farmer.weather.temp,
    ambientHumidityPercent: farmer.weather.humidity,
    leafWetnessPercent: farmer.weather.humidity > 80 ? 78 : 24,
    solarRadiationLux: farmer.weather.rainProbability > 50 ? 28000 : 74000,
    soilNitrogenMgKg: 142, // Available N
    soilPhosphorusMgKg: 28,  // Available P
    soilPotassiumMgKg: 215, // Available K
    soilPh: 7.2,
    smartDripValveState: isWet ? 'CLOSED' : 'OPEN',
    automatedRainCutoffArmed: true,
    batteryLevelPercent: 94
  };
}
