// Data Source Registry - Tracks all data sources with transparency
// Each source is marked as REAL (API/public data) or MODEL (calculated/derived)

export type DataSourceType = 'REAL' | 'MODEL' | 'HYBRID';

export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  description: string;
  url?: string;
  updateFrequency: string;
  notes?: string;
  modules: string[];
  requiresKey: boolean;
}

export const DATA_SOURCES: DataSource[] = [
  // Air Quality - REAL
  {
    id: 'open-meteo-aq',
    name: 'Open-Meteo Air Quality',
    type: 'REAL',
    description: 'Real-time air quality data including PM2.5, PM10, NO₂, SO₂, CO, O₃',
    url: 'https://open-meteo.com/en/docs/air-quality-api',
    updateFrequency: 'Hourly',
    notes: 'Free, no API key, CORS-enabled. Uses CAMS European air quality model with ground station calibration.',
    modules: ['Air Quality', 'Dashboard'],
    requiresKey: false,
  },

  // Weather - REAL
  {
    id: 'open-meteo-weather',
    name: 'Open-Meteo Weather',
    type: 'REAL',
    description: 'Temperature, humidity, wind speed, weather conditions, forecasts',
    url: 'https://open-meteo.com/en/docs',
    updateFrequency: 'Hourly',
    notes: 'Free, no API key. Aggregates multiple weather models including ECMWF, DWD ICON, NOAA GFS.',
    modules: ['Weather', 'Dashboard', 'City Model'],
    requiresKey: false,
  },

  // Traffic - MODEL
  {
    id: 'traffic-model',
    name: 'Traffic Congestion Model',
    type: 'MODEL',
    description: 'Congestion index derived from time-of-day patterns, road density, and zone characteristics',
    updateFrequency: 'Real-time calculation',
    notes: 'Model-derived using: peak hours (8-10 AM, 5-8 PM), zone commercial/residential mix, Delhi traffic patterns. NOT live traffic data.',
    modules: ['Traffic', 'Dashboard'],
    requiresKey: false,
  },

  // Power - HYBRID
  {
    id: 'power-data',
    name: 'Power Grid Data',
    type: 'HYBRID',
    description: 'Demand/supply from POSOCO base data, zone-split via population weighting',
    url: 'https://data.gov.in',
    updateFrequency: 'Calculated hourly',
    notes: 'Base data: Delhi peak ~7500 MW, base ~4500 MW. Zone distribution modeled from population and land-use.',
    modules: ['Power', 'Dashboard', 'City Model'],
    requiresKey: false,
  },

  // Water - HYBRID
  {
    id: 'water-data',
    name: 'Water Supply Data',
    type: 'HYBRID',
    description: 'Supply/demand based on Delhi Jal Board reported capacity',
    url: 'http://delhijalboard.nic.in/',
    updateFrequency: 'Calculated',
    notes: 'Base: ~900 MGD supply vs ~1200 MGD demand. Zone distribution from DJB service area data.',
    modules: ['Water', 'Dashboard', 'City Model'],
    requiresKey: false,
  },

  // Health - MODEL
  {
    id: 'health-data',
    name: 'Health Infrastructure',
    type: 'MODEL',
    description: 'Hospital beds, ambulance response from Delhi govt statistics',
    updateFrequency: 'Calculated',
    notes: 'Based on Delhi govt health bulletin statistics. ~50,000 govt hospital beds. Response times modeled.',
    modules: ['Health'],
    requiresKey: false,
  },

  // Safety - MODEL
  {
    id: 'safety-data',
    name: 'Safety & Crime Data',
    type: 'MODEL',
    description: 'Crime index and incident data based on NCRB statistics',
    updateFrequency: 'Calculated',
    notes: 'Based on NCRB district-wise crime data. Risk scores modeled on historical patterns.',
    modules: ['Safety'],
    requiresKey: false,
  },

  // Maps - REAL
  {
    id: 'osm',
    name: 'OpenStreetMap',
    type: 'REAL',
    description: 'Map tiles and geographic data',
    url: 'https://www.openstreetmap.org',
    updateFrequency: 'Continuous',
    notes: 'Free, open-source. No API key required.',
    modules: ['Maps'],
    requiresKey: false,
  },
];

export function getSourceBadge(type: DataSourceType): { label: string; color: string } {
  switch (type) {
    case 'REAL':
      return { label: 'Live Data', color: 'bg-success/10 text-success' };
    case 'MODEL':
      return { label: 'Model-Derived', color: 'bg-warning/10 text-warning' };
    case 'HYBRID':
      return { label: 'Hybrid', color: 'bg-info/10 text-info' };
  }
}
