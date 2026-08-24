import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DonationMapProps {
  donations: Array<{
    id: string;
    foodName: string;
    latitude: number;
    longitude: number;
    pickupAddress: string;
  }>;
  center?: [number, number];
}

const DonationMap: React.FC<DonationMapProps> = ({ donations, center = [51.505, -0.09] }) => {
  return (
    <div style={{ height: '400px', width: '100%' }}>
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {donations.map((d) => (
          <Marker key={d.id} position={[d.latitude, d.longitude]}>
            <Popup>
              <strong>{d.foodName}</strong>
              <br />
              {d.pickupAddress}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default DonationMap;
