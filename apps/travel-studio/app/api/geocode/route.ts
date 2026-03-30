import { runSearchRoute } from "../../../lib/api";

type GeocodeResult = {
  lat: number;
  lng: number;
  placeName: string;
};

export async function GET(request: Request) {
  return runSearchRoute<GeocodeResult[]>(request, {
    routePrefix: "geocode",
    routeLabel: "geocode",
    rules: {
      q: { required: true, maxLength: 300 },
    },
    providerErrorMessage: "Geocoding failed",
    run: async (params) => {
      const token = process.env.MAPBOX_ACCESS_TOKEN;
      if (!token) {
        throw new Error("MAPBOX_ACCESS_TOKEN is not configured");
      }

      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        params.q
      )}.json?access_token=${token}&limit=1`;

      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) {
        throw new Error(`Mapbox geocoding failed: ${res.status}`);
      }

      const data = (await res.json()) as {
        features?: {
          center?: [number, number];
          place_name?: string;
        }[];
      };

      if (!data.features?.length) return [];

      return data.features.slice(0, 5).map((f) => ({
        lng: f.center?.[0] ?? 0,
        lat: f.center?.[1] ?? 0,
        placeName: f.place_name ?? "",
      }));
    },
  });
}
