"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { fetchWeatherData, WeatherData } from "./api/get-weather-data";

const Map = dynamic(() => import("@/app/components/map"), { ssr: false });

export default function Home() {
  const [coordinate, setCoordinate] = useState<[number, number]>([
    -8.4313706,
    114.2218971,
  ]);
  const [weatherData, setWeatherData] = useState<WeatherData>();

  useEffect(() => {
    async function loadWeather() {
      try {
        const data = await fetchWeatherData(coordinate[0], coordinate[1]);
        console.log("logged data: ", data)
        setWeatherData(data);
      } catch (err) {
        console.error("Failed to fetch weather data", err);
      }
    }
    loadWeather();
  }, [coordinate]);

  return (
    <div className="bg-amber-100 mx-auto my-5 w-[98%] h-[480px]">
      <Map posix={coordinate} weatherData={weatherData} />
    </div>
  );
}
