import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { parksApi } from '../api/parks.api';
import type { Park } from '../api/parks.api';

// Fix leaflet default marker icons (broken by Vite asset bundling)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)['_getIconUrl'];
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// On-brand pin: forest-green teardrop with a Meskel-gold center
const parkIcon = L.divIcon({
  className: '',
  html: `<svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 3px 4px rgba(0,0,0,0.3))">
    <path d="M15 0 C6.7 0 0 6.7 0 15 C0 26 15 40 15 40 C15 40 30 26 30 15 C30 6.7 23.3 0 15 0 Z" fill="#0A4D30"/>
    <circle cx="15" cy="15" r="5.5" fill="#F4B400"/>
  </svg>`,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
  popupAnchor: [0, -36],
});

export default function MapPage() {
  const [parks, setParks] = useState<Park[]>([]);

  useEffect(() => { parksApi.list().then((r) => setParks(r.data)); }, []);

  return (
    <div className="relative h-[calc(100vh-64px)]">
      {/* Branded overlay panel */}
      <div className="absolute top-4 left-4 z-[1000] max-w-[17rem]">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-black/5 p-5">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="h-px w-6 bg-accent-gold" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-green">
              Find your way
            </span>
          </div>
          <h1 className="font-display text-2xl leading-tight text-forest-ink mb-1.5">
            Explore the map
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            {parks.length > 0 ? `${parks.length} green spaces` : 'Green spaces'} across Addis Ababa.
            Tap a marker for details.
          </p>
        </div>
      </div>

      <MapContainer
        center={[9.0222, 38.7469]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <ZoomControl position="bottomright" />
        {parks.map((park) => (
          <Marker key={park.id} position={[park.latitude, park.longitude]} icon={parkIcon}>
            <Popup>
              <div className="min-w-[180px] p-1">
                <h3 className="font-display text-base text-forest-ink mb-1 leading-snug">{park.name}</h3>
                <p className="text-xs text-gray-500 mb-2.5 line-clamp-2 leading-relaxed">{park.description}</p>
                <Link
                  to={`/parks/${park.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-dark-forest hover:text-primary-green transition-colors"
                >
                  View details <ArrowRight size={12} />
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
