"use client";

import dynamic from "next/dynamic";
import { MapLocationDisplayProps } from "./map-location-display";


const MapLocationDisplay = dynamic(
  () => import("./map-location-display"),
  { 
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-gray-100 flex items-center justify-center">Loading map...</div>
  }
);

export default function MapWrapper(props: MapLocationDisplayProps) {
  return <MapLocationDisplay {...props} />;
}