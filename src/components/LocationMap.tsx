"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom marker icon (optional, to fix missing default marker issue in Leaflet)
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

export default function LocationMap() {
  // Coordinates from the OpenStreetMap XML data
  const latitude = 9.6394230;
  const longitude = 123.8442760;

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={15}
      scrollWheelZoom={false}
      className="w-full h-full"
    >
      {/* OpenStreetMap Tile Layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marker for the resort */}
      <Marker position={[latitude, longitude]} icon={customIcon}>
        <Popup>
          <strong>Casa Filomena</strong>
          <br />
          <a href="https://www.soledad-suites.com/" target="_blank" rel="noopener noreferrer">
            Visit Website
          </a>
          <br />
          Phone: +63 38 4160457
        </Popup>
      </Marker>
    </MapContainer>
  );
}