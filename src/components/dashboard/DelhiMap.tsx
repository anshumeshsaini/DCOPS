import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AirQualityData, DELHI_ZONES, getAQICategory } from '@/types/city';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface DelhiMapProps {
  airQualityData?: AirQualityData[];
  onZoneClick?: (zoneId: string) => void;
}

// Delhi zone coordinates
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

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#22c55e'; // green
  if (aqi <= 100) return '#84cc16'; // lime
  if (aqi <= 200) return '#eab308'; // yellow
  if (aqi <= 300) return '#f97316'; // orange
  if (aqi <= 400) return '#ef4444'; // red
  return '#7c2d12'; // dark red
}

export function DelhiMap({ airQualityData, onZoneClick }: DelhiMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map centered on Delhi
    const map = L.map(containerRef.current, {
      center: [28.6139, 77.2090], // New Delhi center
      zoom: 11,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add OpenStreetMap tiles (free, no API key)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when air quality data changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each zone with AQI data
    if (airQualityData) {
      airQualityData.forEach(data => {
        const coords = ZONE_COORDINATES[data.zone];
        if (!coords) return;

        const zone = DELHI_ZONES.find(z => z.id === data.zone);
        const category = getAQICategory(data.aqi);

        // Create circle marker
        const marker = L.circleMarker([coords.lat, coords.lng], {
          radius: 20,
          fillColor: getAQIColor(data.aqi),
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        });

        // Add popup with zone info
        marker.bindPopup(`
          <div style="min-width: 150px;">
            <strong style="font-size: 14px;">${zone?.name || data.zone}</strong>
            <div style="margin-top: 8px;">
              <div style="display: flex; justify-content: space-between;">
                <span>AQI:</span>
                <strong style="color: ${getAQIColor(data.aqi)}">${data.aqi}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Status:</span>
                <span>${category.label}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>PM2.5:</span>
                <span>${data.pm25} µg/m³</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>PM10:</span>
                <span>${data.pm10} µg/m³</span>
              </div>
            </div>
            <div style="margin-top: 8px; font-size: 10px; color: #666;">
              Source: Open-Meteo (Live)
            </div>
          </div>
        `);

        // Add click handler
        marker.on('click', () => {
          onZoneClick?.(data.zone);
        });

        marker.addTo(mapRef.current!);
        markersRef.current.push(marker);
      });
    } else {
      // Show zone markers without AQI data
      Object.entries(ZONE_COORDINATES).forEach(([zoneId, coords]) => {
        const zone = DELHI_ZONES.find(z => z.id === zoneId);
        
        const marker = L.circleMarker([coords.lat, coords.lng], {
          radius: 15,
          fillColor: '#94a3b8',
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.6,
        });

        marker.bindPopup(`
          <div>
            <strong>${zone?.name || zoneId}</strong>
            <div style="font-size: 12px; color: #666; margin-top: 4px;">
              Loading air quality data...
            </div>
          </div>
        `);

        marker.addTo(mapRef.current!);
        markersRef.current.push(marker);
      });
    }
  }, [airQualityData, onZoneClick]);

  return (
    <div className="module-section">
      <div className="module-header">
        <h3 className="text-sm font-medium text-foreground">Delhi Zone Map</h3>
        <span className="text-xs text-muted-foreground">OpenStreetMap • Click zones for details</span>
      </div>
      <div className="module-content p-0">
        <div 
          ref={containerRef} 
          className="h-[300px] w-full rounded-b-md"
          style={{ minHeight: '300px' }}
        />
      </div>
      
      {/* Legend */}
      <div className="px-4 py-2 border-t border-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">AQI Scale:</span>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }} />
              <span>Good</span>
            </div>
            <div className="flex items-center gap-0.5 ml-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#eab308' }} />
              <span>Moderate</span>
            </div>
            <div className="flex items-center gap-0.5 ml-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }} />
              <span>Poor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
