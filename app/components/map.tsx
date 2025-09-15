"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import L from "leaflet";
import { useEffect } from "react";

interface MapProps {
  posix: [number, number];
  heatPoints?: [number, number, number][];
}

function HeatmapLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // @ts-ignore
    const heatLayer = L.heatLayer(points, {
      radius: 50,
      blur: 0,
      maxZoom: 17,
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

export default function Map({ posix, heatPoints }: MapProps) {
  return (
    <MapContainer
      center={posix}
      zoom={11}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {heatPoints && <HeatmapLayer points={heatPoints} />}
    </MapContainer>
  );
}
