"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";
import { WeatherData } from "@/app/api/get-weather-data";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
  posix: LatLngExpression | LatLngTuple;
  zoom?: number;
  weatherData?: WeatherData;
}

const defaults = { zoom: 14 };

function getTemperatureColor(tempK: number): string {
  const tempC = tempK - 273.15;
  if (tempC < 10) return "blue";
  if (tempC < 20) return "green";
  if (tempC < 30) return "orange";
  return "red";
}

const Map = ({ zoom = defaults.zoom, posix, weatherData }: MapProps) => {
  const temperature = weatherData?.["temp-surface"]?.[0] ?? 300;
  const color = getTemperatureColor(temperature);

  return (
    <MapContainer
      attributionControl={false}
      center={posix}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <CircleMarker
        center={posix}
        radius={20}
        color={color}
        fillColor={color}
        fillOpacity={0.5}
      >
        <Popup>🌡 Temp: {(temperature - 273.15).toFixed(1)} °C</Popup>
      </CircleMarker>
    </MapContainer>
  );
};

export default Map;
