import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { parksApi, Park } from '../api/parks.api';

// Fix leaflet default marker icons (broken by Vite asset bundling)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)['_getIconUrl'];
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapPage() {
  const [parks, setParks] = useState<Park[]>([]);

  useEffect(() => { parksApi.list().then((r) => setParks(r.data)); }, []);

  return (
    <div className="h-[calc(100vh-64px)]">
      <MapContainer
        center={[9.0222, 38.7469]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {parks.map((park) => (
          <Marker key={park.id} position={[park.latitude, park.longitude]}>
            <Popup>
              <div className="min-w-[160px]">
                <h3 className="font-semibold text-gray-900 mb-1">{park.name}</h3>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{park.description}</p>
                <Link to={`/parks/${park.slug}`} className="text-xs text-green-600 hover:underline">
                  View details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
