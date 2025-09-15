"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { fetchWeatherData, WeatherData } from "./api/get-weather-data";

const Map = dynamic(() => import("@/app/components/map"), { ssr: false });

export default function Home() {
  const [coordinate] = useState<[number, number]>([-8.4313706, 114.2218971]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [heatPoints, setHeatPoints] = useState<[number, number, number][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeather() {
      try {
        setLoading(true);
        const data = await fetchWeatherData(coordinate[0], coordinate[1]);
        setWeatherData(data);
        console.log(data["temp-surface"]);

        const temp = data["temp-surface"][0] ?? 0;

        const points: [number, number, number][] = [
          [coordinate[0], coordinate[1], temp / 300],
        ];
        setHeatPoints(points);
      } catch (err) {
        console.error("Failed to fetch weather data", err);
      } finally {
        setLoading(false);
      }
    }
    loadWeather();
  }, [coordinate]);

  const getLatestValue = (dataArray: number[] | undefined): number => {
    return dataArray?.[0] ?? 0;
  };

  const formatTemperature = (temp: number): string => {
    return `${(temp - 273.15).toFixed(1)}°C`;
  };

  const formatPressure = (pressure: number): string => {
    return `${(pressure / 100).toFixed(1)} hPa`;
  };

  const formatWindSpeed = (u: number, v: number): string => {
    const speed = Math.sqrt(u * u + v * v);
    return `${speed.toFixed(1)} m/s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-amber-50 to-orange-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
            Weather Forecast
          </h1>
          <p className="text-gray-600 text-lg">
            Real-time weather forecasting system
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-orange-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Weather Cards */}
        {weatherData && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Temperature Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Temperature
                  </h3>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {formatTemperature(
                      getLatestValue(weatherData["temp-surface"])
                    )}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076A9.959 9.959 0 0110 14.25c1.993 0 3.9.233 5.742.666a.75.75 0 00.515-1.076A9.959 9.959 0 0110 8a6 6 0 00-6-6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Wind Speed Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Wind Speed
                  </h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {formatWindSpeed(
                      getLatestValue(weatherData["wind_u-surface"]),
                      getLatestValue(weatherData["wind_v-surface"])
                    )}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 000 2h11.586l-2.293 2.293a1 1 0 001.414 1.414l4-4a1 1 0 000-1.414l-4-4a1 1 0 10-1.414 1.414L14.586 4H3zM3 10a1 1 0 100 2h5.586l-2.293 2.293a1 1 0 001.414 1.414l4-4a1 1 0 000-1.414l-4-4a1 1 0 10-1.414 1.414L9.586 10H3z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pressure Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Pressure
                  </h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {formatPressure(
                      getLatestValue(weatherData["pressure-surface"])
                    )}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </h3>
                  <p className="text-lg font-semibold text-purple-600 mt-2">
                    Active
                  </p>
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map and Data Table Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Weather Map</h2>
                <p className="text-blue-100 text-sm">
                  Interactive heat map visualization
                </p>
              </div>
              <div className="p-4">
                <div className="bg-amber-100 rounded-xl h-[480px] relative overflow-hidden">
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading weather data...</p>
                      </div>
                    </div>
                  )}
                  <Map posix={coordinate} heatPoints={heatPoints} />
                </div>
              </div>
            </div>
          </div>

          {/* Data Table Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Weather Data</h2>
                <p className="text-orange-100 text-sm">Latest 10 readings</p>
              </div>
              <div className="p-4">
                {weatherData && !loading ? (
                  <div className="space-y-4 max-h-[420px] overflow-y-auto">
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-1 font-semibold text-gray-700">
                              #
                            </th>
                            <th className="text-left py-2 px-1 font-semibold text-gray-700">
                              Timestamp
                            </th>
                            <th className="text-left py-2 px-1 font-semibold text-gray-700">
                              Temp
                            </th>
                            <th className="text-left py-2 px-1 font-semibold text-gray-700">
                              Wind U
                            </th>
                            <th className="text-left py-2 px-1 font-semibold text-gray-700">
                              Wind V
                            </th>
                            <th className="text-left py-2 px-1 font-semibold text-gray-700">
                              Pressure
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.from({ length: 10 }).map((_, index) => (
                            <tr
                              key={index}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-2 px-1 text-gray-600">
                                {index + 1}
                              </td>
                              <td className="py-2 px-1 text-slate-600 font-medium">
                                {weatherData["ts"]?.[index]
                                  ? new Date(
                                      weatherData["ts"][index]
                                    ).toLocaleString()
                                  : "-"}
                              </td>

                              <td className="py-2 px-1 text-red-600 font-medium">
                                {weatherData["temp-surface"]?.[index]
                                  ? formatTemperature(
                                      weatherData["temp-surface"][index]
                                    )
                                  : "-"}
                              </td>
                              <td className="py-2 px-1 text-blue-600">
                                {weatherData["wind_u-surface"]?.[
                                  index
                                ]?.toFixed(1) ?? "-"}{" "}
                                m/s
                              </td>
                              <td className="py-2 px-1 text-blue-600">
                                {weatherData["wind_v-surface"]?.[
                                  index
                                ]?.toFixed(1) ?? "-"}{" "}
                                m/s
                              </td>
                              <td className="py-2 px-1 text-green-600">
                                {weatherData["pressure-surface"]?.[index]
                                  ? formatPressure(
                                      weatherData["pressure-surface"][index]
                                    )
                                  : "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <div className="text-center text-gray-500">
                      <div className="animate-pulse">Loading data...</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
