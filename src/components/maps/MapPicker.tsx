import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para iconos de marker en Leaflet con Webpack/Vite
import L from 'leaflet';
delete ((L.Icon.Default.prototype as unknown) as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapPickerProps {
  value: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number }) => void;
  enableGeolocate?: boolean;
}

const DEFAULT_CENTER = { lat: 40.4168, lng: -3.7038 }; // Madrid

const LocationMarker: React.FC<{
  value: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number }) => void;
}> = ({ value, onChange }) => {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return value ? <Marker position={value} /> : null;
};

export const MapPicker: React.FC<MapPickerProps> = ({
  value,
  onChange,
  enableGeolocate = true,
}) => {
  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          onChange({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => alert('No se pudo obtener tu ubicación')
      );
    }
  };

  return (
    <div>
      <MapContainer
        center={value || DEFAULT_CENTER}
        zoom={value ? 15 : 6}
        style={{ height: 350, width: '100%', minWidth: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker value={value} onChange={onChange} />
      </MapContainer>
      {enableGeolocate && (
        <button type="button" style={{ marginTop: 8 }} onClick={handleGeolocate}>
          Usar mi ubicación actual
        </button>
      )}
    </div>
  );
};