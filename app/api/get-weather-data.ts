export interface WeatherData {
  ts: number[];
  "temp-surface": number[];
  "wind_u-surface": number[];
  "wind_v-surface": number[];
  "pressure-surface": number[];
  units: Record<string, string>;
  warning?: string;
}

export async function fetchWeatherData(
  lat: number,
  lon: number
): Promise<WeatherData> {
  const apiKey = process.env.NEXT_PUBLIC_WINDY_API_KEY;
  const url = process.env.NEXT_PUBLIC_WINDY_API_URL;

  if (!apiKey || !url) {
    throw new Error(
      "Missing Windy API configuration in environment variables."
    );
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: apiKey,
        model: "gfs",
        parameters: ["temp", "wind", "pressure"],
        levels: ["surface"],
        lat: lat,
        lon: lon,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch weather data: ${res.status}`);
    }

    const data: WeatherData = await res.json();
    console.log("the data:", data);
    return data;
  } catch (err) {
    console.error("Error fetching weather data:", err);
    throw err;
  }
}
