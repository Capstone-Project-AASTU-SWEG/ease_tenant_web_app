"use client";

import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export type MapLocationDisplayProps = {
  position: [number, number];
  zoom?: number;
  scrollWheelZoom?: boolean;
  markerText?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (position: [number, number]) => void;
  interactive?: boolean;
};

const LocationMarker: React.FC<{
  initialPosition: [number, number];
  markerText?: string;
  onClick?: (position: [number, number]) => void;
  interactive?: boolean;
}> = ({ initialPosition, markerText, onClick, interactive }) => {
  const [position, setPosition] = useState<[number, number] | null>(
    initialPosition,
  );

  useMapEvents({
    click(e) {
      if (!interactive) return;
      const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);
      if (onClick) {
        onClick(newPosition);
      }
    },
  });

  return position ? (
    <Marker position={position} icon={defaultIcon}>
      <Popup>
        {markerText ||
          `Lat: ${position[0].toFixed(4)}, Lng: ${position[1].toFixed(4)}`}
      </Popup>
    </Marker>
  ) : null;
};

const MapLocationDisplay: React.FC<MapLocationDisplayProps> = ({
  position,
  zoom = 13,
  scrollWheelZoom = false,
  markerText = "Location",
  className = "",
  style = {},
  onClick,
  interactive = false,
}) => {
  if (typeof window === "undefined") {
    return <div className={className} style={style} />;
  }

  return (
    <div className={className} style={style}>
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={scrollWheelZoom}
        style={{ height: "100%", width: "100%", minHeight: "300px" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          initialPosition={position}
          markerText={markerText}
          onClick={onClick}
          interactive={interactive}
        />
      </MapContainer>
    </div>
  );
};

export default MapLocationDisplay;
