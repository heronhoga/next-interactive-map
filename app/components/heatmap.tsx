import L from "leaflet";
import "leaflet.heat";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

function HeatmapLayer({ points = [] }: { points: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const heatLayer = (L as any).heatLayer(points, {
      radius: 5,
      blur: 4,
      maxZoom: 11,
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, JSON.stringify(points)]);

  return null;
}

export default HeatmapLayer;
