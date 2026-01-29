// Open-Meteo API Integration - Free, No API Key Required, CORS Enabled
// Docs: https://open-meteo.com/

import { AirQualityData, DELHI_ZONES } from '@/types/city';

const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1';
const AIR_QUALITY_BASE = 'https://air-quality-api.open-meteo.com/v1';

// Delhi zone coordinates for API calls
const ZONE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  north: { lat: 28.7041, lng: 77.2167 },
  south: { lat: 28.5355, lng: 77.2273 },
  east: { lat: 28.6280, lng: 77.3060 },
  west: { lat: 28.6517, lng: 77.0688 },
  central: { lat: 28.6358, lng: 77.2090 },
  newdelhi: { lat: 28.6139, lng: 77.2090 },
  northeast: { lat: 28.6916, lng: 77.2636 },
  northwest: { lat: 28.7325, lng: 77.0919 },
  southeast: { lat: 28.5503, lng: 77.2778 },
  southwest: { lat: 28.5644, lng: 77.0573 },
  shahdara: { lat: 28.6731, lng: 77.2917 },
};

interface OpenMeteoAirQualityResponse {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    pm2_5: number;
    pm10: number;
    nitrogen_dioxide: number;
    sulphur_dioxide: number;
    carbon_monoxide: number;
    ozone: number;
    european_aqi: number;
    us_aqi: number;
  };
}

interface OpenMeteoWeatherResponse {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}

// Calculate AQI from PM2.5 (US EPA standard)
function calculateAQI(pm25: number): number {
  const breakpoints = [
    { bpLo: 0, bpHi: 12, aqiLo: 0, aqiHi: 50 },
    { bpLo: 12.1, bpHi: 35.4, aqiLo: 51, aqiHi: 100 },
    { bpLo: 35.5, bpHi: 55.4, aqiLo: 101, aqiHi: 150 },
    { bpLo: 55.5, bpHi: 150.4, aqiLo: 151, aqiHi: 200 },
    { bpLo: 150.5, bpHi: 250.4, aqiLo: 201, aqiHi: 300 },
    { bpLo: 250.5, bpHi: 350.4, aqiLo: 301, aqiHi: 400 },
    { bpLo: 350.5, bpHi: 500.4, aqiLo: 401, aqiHi: 500 },
  ];

  for (const bp of breakpoints) {
    if (pm25 >= bp.bpLo && pm25 <= bp.bpHi) {
      return Math.round(
        ((bp.aqiHi - bp.aqiLo) / (bp.bpHi - bp.bpLo)) * (pm25 - bp.bpLo) + bp.aqiLo
      );
    }
  }
  return pm25 > 500 ? 500 : 0;
}

// Fetch air quality for a single zone
async function fetchZoneAirQuality(zone: string, coords: { lat: number; lng: number }): Promise<AirQualityData | null> {
  try {
    const params = new URLSearchParams({
      latitude: coords.lat.toString(),
      longitude: coords.lng.toString(),
      current: 'pm2_5,pm10,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide,ozone,european_aqi,us_aqi',
      timezone: 'Asia/Kolkata',
    });

    const response = await fetch(`${AIR_QUALITY_BASE}/air-quality?${params}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: OpenMeteoAirQualityResponse = await response.json();
    
    return {
      zone,
      aqi: data.current.us_aqi || calculateAQI(data.current.pm2_5),
      pm25: Math.round(data.current.pm2_5),
      pm10: Math.round(data.current.pm10),
      no2: Math.round(data.current.nitrogen_dioxide),
      so2: Math.round(data.current.sulphur_dioxide),
      co: Math.round(data.current.carbon_monoxide / 1000), // Convert to ppm
      o3: Math.round(data.current.ozone),
      timestamp: new Date(data.current.time),
      source: 'Open-Meteo',
    };
  } catch (error) {
    console.error(`Error fetching air quality for ${zone}:`, error);
    return null;
  }
}

// Fetch air quality for all Delhi zones
export async function fetchDelhiAirQuality(): Promise<AirQualityData[]> {
  const zones = Object.entries(ZONE_COORDINATES);
  
  // Fetch all zones in parallel
  const results = await Promise.all(
    zones.map(([zone, coords]) => fetchZoneAirQuality(zone, coords))
  );
  
  // Filter out failed requests
  const validResults = results.filter((r): r is AirQualityData => r !== null);
  
  // If all requests failed, return empty array (component will show loading/error state)
  if (validResults.length === 0) {
    console.warn('All air quality requests failed');
    return [];
  }
  
  return validResults;
}

// Fetch current weather for Delhi (central point)
export async function fetchDelhiWeather(): Promise<OpenMeteoWeatherResponse['current'] | null> {
  try {
    const coords = ZONE_COORDINATES.central;
    const params = new URLSearchParams({
      latitude: coords.lat.toString(),
      longitude: coords.lng.toString(),
      current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
      timezone: 'Asia/Kolkata',
    });

    const response = await fetch(`${OPEN_METEO_BASE}/forecast?${params}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: OpenMeteoWeatherResponse = await response.json();
    return data.current;
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
}

// Weather code descriptions
export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return descriptions[code] || 'Unknown';
}
