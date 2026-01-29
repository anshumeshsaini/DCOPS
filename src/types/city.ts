// Delhi City Operations Platform - Type Definitions

export interface KPIData {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  status: 'good' | 'warning' | 'critical';
  lastUpdated: Date;
  source?: string;
}

export interface DelhiZone {
  id: string;
  name: string;
  code: string;
  population: number;
  area: number; // sq km
  coordinates: [number, number]; // [lng, lat]
}

export interface AirQualityData {
  zone: string;
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  timestamp: Date;
  source: string;
}

export interface TrafficData {
  zone: string;
  congestionIndex: number; // 0-100
  avgSpeed: number; // km/h
  incidents: number;
  timestamp: Date;
}

export interface PowerData {
  zone: string;
  demand: number; // MW
  supply: number; // MW
  peakLoad: number; // MW
  outages: number;
  renewablePercent: number;
  timestamp: Date;
}

export interface WaterData {
  zone: string;
  supply: number; // MLD (Million Liters per Day)
  demand: number; // MLD
  reservoirLevel: number; // percentage
  leakages: number;
  timestamp: Date;
}

export interface HealthData {
  zone: string;
  hospitalBeds: number;
  bedsOccupied: number;
  ambulances: number;
  avgResponseTime: number; // minutes
  emergencyCalls: number;
  timestamp: Date;
}

export interface SafetyData {
  zone: string;
  crimeIndex: number;
  incidents: number;
  patrolUnits: number;
  responseTime: number;
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface CitizenReport {
  id: string;
  category: 'infrastructure' | 'safety' | 'sanitation' | 'water' | 'power' | 'other';
  description: string;
  zone: string;
  location: [number, number];
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  department?: string;
}

export interface CityHealthIndex {
  overall: number; // 0-100
  components: {
    environment: number;
    infrastructure: number;
    safety: number;
    health: number;
    governance: number;
  };
  timestamp: Date;
}

// Scenario Simulation Types
export interface ScenarioParameters {
  rainfallIncrease: number; // percentage increase
  trafficSurge: number; // percentage increase
  powerDemandSpike: number; // percentage increase
  temperatureChange: number; // degrees Celsius
  eventType: 'none' | 'festival' | 'emergency' | 'strike';
}

export interface ScenarioImpact {
  floodRisk: number; // 0-100
  trafficDelayPercent: number;
  powerShortfall: number; // MW
  waterStressIndex: number; // 0-100
  emergencyLoadIncrease: number; // percentage
  affectedZones: string[];
  recommendations: string[];
}

// Delhi Zones - Official Municipal Zones
export const DELHI_ZONES: DelhiZone[] = [
  { id: 'north', name: 'North Delhi', code: 'NDL', population: 887978, area: 59.57, coordinates: [77.2167, 28.7041] },
  { id: 'south', name: 'South Delhi', code: 'SDL', population: 2731929, area: 250, coordinates: [77.2273, 28.5355] },
  { id: 'east', name: 'East Delhi', code: 'EDL', population: 1707725, area: 64, coordinates: [77.3060, 28.6280] },
  { id: 'west', name: 'West Delhi', code: 'WDL', population: 2543243, area: 129, coordinates: [77.0688, 28.6517] },
  { id: 'central', name: 'Central Delhi', code: 'CDL', population: 582320, area: 25, coordinates: [77.2090, 28.6358] },
  { id: 'newdelhi', name: 'New Delhi', code: 'NWD', population: 257803, area: 35, coordinates: [77.2090, 28.6139] },
  { id: 'northeast', name: 'North East Delhi', code: 'NED', population: 2241624, area: 60, coordinates: [77.2636, 28.6916] },
  { id: 'northwest', name: 'North West Delhi', code: 'NWD', population: 3656539, area: 440, coordinates: [77.0919, 28.7325] },
  { id: 'southeast', name: 'South East Delhi', code: 'SED', population: 1343515, area: 43, coordinates: [77.2778, 28.5503] },
  { id: 'southwest', name: 'South West Delhi', code: 'SWD', population: 2292958, area: 420, coordinates: [77.0573, 28.5644] },
  { id: 'shahdara', name: 'Shahdara', code: 'SHD', population: 2328152, area: 25, coordinates: [77.2917, 28.6731] },
];

// AQI Categories
export const AQI_CATEGORIES = [
  { min: 0, max: 50, label: 'Good', color: 'success' },
  { min: 51, max: 100, label: 'Satisfactory', color: 'success' },
  { min: 101, max: 200, label: 'Moderate', color: 'warning' },
  { min: 201, max: 300, label: 'Poor', color: 'warning' },
  { min: 301, max: 400, label: 'Very Poor', color: 'destructive' },
  { min: 401, max: 500, label: 'Severe', color: 'destructive' },
] as const;

export function getAQICategory(aqi: number) {
  return AQI_CATEGORIES.find(cat => aqi >= cat.min && aqi <= cat.max) || AQI_CATEGORIES[5];
}

export function getStatusColor(status: 'good' | 'warning' | 'critical'): string {
  const colors = {
    good: 'text-success',
    warning: 'text-warning',
    critical: 'text-destructive',
  };
  return colors[status];
}
