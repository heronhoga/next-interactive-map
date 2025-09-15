"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { fetchWeatherData, WeatherData } from "./api/get-weather-data";

const Map = dynamic(() => import("@/app/components/map"), { ssr: false });

export default function Home() {
  const [coordinate] = useState<[number, number]>([-8.4313706, 114.2218971]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [heatPoints, setHeatPoints] = useState<[number, number, number][]>([]);

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await fetchWeatherData(coordinate[0], coordinate[1]);
        setWeatherData(data);
        console.log(data["temp-surface"]);

        const temp = data["temp-surface"][0] ?? 0;

        const points: [number, number, number][] = [
          [coordinate[0], coordinate[1], temp / 300],
          [coordinate[0] + 0.05, coordinate[1], temp / 320],
          [coordinate[0], coordinate[1] + 0.05, temp / 310],
        ];
        setHeatPoints(points);
      } catch (err) {
        console.error("Failed to fetch weather data", err);
      }
    }
    loadWeather();
  }, [coordinate]);

  return (
    <div className="bg-amber-100 mx-auto my-5 w-[98%] h-[480px]">
      <Map posix={coordinate} heatPoints={heatPoints} />
    </div>
  );
}
