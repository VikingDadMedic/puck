"use client";

import type { ComponentConfig } from "@/core";
import { createUsePuck } from "@/core";
import { useEffect, useMemo, useState } from "react";
import { color, radius } from "../../tokens";

const usePuck = createUsePuck();

export type Coordinates = { lat: number; lng: number };

export type ItineraryMapProps = {
  height: number;
  mapStyle: "streets" | "outdoors" | "light" | "satellite";
  showRoute: boolean;
};

type MapPoint = {
  id: string;
  title: string;
  type: string;
  coordinates: Coordinates;
  dayLabel?: string;
};

type PuckNode = {
  type: string;
  props?: Record<string, unknown>;
};

function extractMapPoints(content: unknown[]): MapPoint[] {
  const points: MapPoint[] = [];
  const walk = (nodes: unknown[], dayLabel?: string) => {
    if (!Array.isArray(nodes)) return;
    for (const node of nodes) {
      if (!node || typeof node !== "object") continue;
      const n = node as PuckNode;
      const props = n.props || {};

      if (n.type === "DaySection") {
        const label = typeof props.label === "string" ? props.label : undefined;
        for (const slot of ["morning", "afternoon", "evening"]) {
          if (Array.isArray(props[slot])) walk(props[slot] as unknown[], label);
        }
        continue;
      }

      const coords = props.coordinates as Coordinates | null | undefined;
      if (
        coords &&
        typeof coords.lat === "number" &&
        typeof coords.lng === "number"
      ) {
        points.push({
          id: (props.id as string) || `point-${points.length}`,
          title: (props.name as string) || (props.title as string) || n.type,
          type: n.type,
          coordinates: coords,
          dayLabel,
        });
      }

      if (n.type === "TransportCard") {
        const depCoords = props.departureCoordinates as
          | Coordinates
          | null
          | undefined;
        const arrCoords = props.arrivalCoordinates as
          | Coordinates
          | null
          | undefined;
        if (depCoords && typeof depCoords.lat === "number") {
          points.push({
            id: `${props.id || "transport"}-dep`,
            title: `${(props.departure as string) || "Departure"}`,
            type: "departure",
            coordinates: depCoords,
            dayLabel,
          });
        }
        if (arrCoords && typeof arrCoords.lat === "number") {
          points.push({
            id: `${props.id || "transport"}-arr`,
            title: `${(props.arrival as string) || "Arrival"}`,
            type: "arrival",
            coordinates: arrCoords,
            dayLabel,
          });
        }
      }

      if (props) {
        for (const v of Object.values(props)) {
          if (Array.isArray(v)) walk(v, dayLabel);
        }
      }
    }
  };
  walk(content);
  return points;
}

const MAPBOX_STYLES: Record<string, string> = {
  streets: "mapbox://styles/mapbox/streets-v12",
  outdoors: "mapbox://styles/mapbox/outdoors-v12",
  light: "mapbox://styles/mapbox/light-v11",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
};

const TYPE_COLORS: Record<string, string> = {
  StayCard: color.accent.blue,
  ActivityCard: color.accent.greenBright,
  RestaurantCard: color.accent.amber,
  CruiseCard: "#8b5cf6",
  departure: color.accent.red,
  arrival: color.accent.green,
  default: color.text.muted,
};

function MapFallback({ height, message }: { height: number; message: string }) {
  return (
    <div
      style={{
        height,
        background: color.bg.muted,
        borderRadius: radius.lg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: color.text.muted,
        fontSize: 14,
        border: `1px solid ${color.border.default}`,
      }}
    >
      {message}
    </div>
  );
}

function MapRenderer({
  points,
  height,
  mapStyle,
  showRoute,
  isInteractive,
}: {
  points: MapPoint[];
  height: number;
  mapStyle: string;
  showRoute: boolean;
  isInteractive: boolean;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mapMod, setMapMod] = useState<Record<string, any> | null>(null);
  const [selected, setSelected] = useState<MapPoint | null>(null);

  useEffect(() => {
    import("react-map-gl").then((mod) => {
      setMapMod(mod);
    });
  }, []);

  const bounds = useMemo(() => {
    if (points.length === 0) return null;
    let minLng = Infinity,
      maxLng = -Infinity,
      minLat = Infinity,
      maxLat = -Infinity;
    for (const p of points) {
      if (p.coordinates.lng < minLng) minLng = p.coordinates.lng;
      if (p.coordinates.lng > maxLng) maxLng = p.coordinates.lng;
      if (p.coordinates.lat < minLat) minLat = p.coordinates.lat;
      if (p.coordinates.lat > maxLat) maxLat = p.coordinates.lat;
    }
    const padLng = Math.max((maxLng - minLng) * 0.15, 0.01);
    const padLat = Math.max((maxLat - minLat) * 0.15, 0.01);
    return {
      longitude: (minLng + maxLng) / 2,
      latitude: (minLat + maxLat) / 2,
      zoom: points.length === 1 ? 12 : undefined,
      bounds:
        points.length > 1
          ? [
              [minLng - padLng, minLat - padLat],
              [maxLng + padLng, maxLat + padLat],
            ]
          : undefined,
    };
  }, [points]);

  const routeGeoJSON = useMemo(() => {
    if (!showRoute || points.length < 2) return null;
    return {
      type: "FeatureCollection" as const,
      features: [
        {
          type: "Feature" as const,
          geometry: {
            type: "LineString" as const,
            coordinates: points.map((p) => [
              p.coordinates.lng,
              p.coordinates.lat,
            ]),
          },
          properties: {},
        },
      ],
    };
  }, [points, showRoute]);

  if (!mapMod) {
    return <MapFallback height={height} message="Loading map..." />;
  }

  if (!bounds) {
    return <MapFallback height={height} message="No locations to display" />;
  }

  const token =
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    process.env.PUBLIC_MAPBOX_TOKEN ||
    "";

  const { Map, Marker, Popup, Source, Layer, NavigationControl } = mapMod;

  return (
    <Map
      initialViewState={{
        longitude: bounds.longitude,
        latitude: bounds.latitude,
        zoom: bounds.zoom ?? 5,
        ...(bounds.bounds
          ? { bounds: bounds.bounds as [[number, number], [number, number]] }
          : {}),
      }}
      style={{ width: "100%", height, borderRadius: radius.lg }}
      mapStyle={MAPBOX_STYLES[mapStyle] || MAPBOX_STYLES.streets}
      mapboxAccessToken={token}
      interactive={isInteractive}
      scrollZoom={isInteractive}
      dragPan={isInteractive}
    >
      {isInteractive && <NavigationControl position="top-right" />}

      {routeGeoJSON && (
        <Source id="route" type="geojson" data={routeGeoJSON}>
          <Layer
            id="route-line"
            type="line"
            paint={{
              "line-color": color.accent.blue,
              "line-width": 2.5,
              "line-dasharray": [2, 1],
            }}
          />
        </Source>
      )}

      {points.map((point, i) => {
        const markerColor = TYPE_COLORS[point.type] || TYPE_COLORS.default;
        return (
          <Marker
            key={point.id}
            longitude={point.coordinates.lng}
            latitude={point.coordinates.lat}
            anchor="bottom"
            onClick={(e: { originalEvent: MouseEvent }) => {
              e.originalEvent.stopPropagation();
              setSelected(point);
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: markerColor,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                border: "2px solid #fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                cursor: "pointer",
              }}
            >
              {i + 1}
            </div>
          </Marker>
        );
      })}

      {selected && (
        <Popup
          longitude={selected.coordinates.lng}
          latitude={selected.coordinates.lat}
          anchor="bottom"
          offset={30}
          onClose={() => setSelected(null)}
          closeOnClick={false}
        >
          <div style={{ fontSize: 13, maxWidth: 200 }}>
            <strong>{selected.title}</strong>
            {selected.dayLabel && (
              <div
                style={{ color: color.text.muted, fontSize: 11, marginTop: 2 }}
              >
                {selected.dayLabel}
              </div>
            )}
          </div>
        </Popup>
      )}
    </Map>
  );
}

function ItineraryMapRender({
  height,
  mapStyle,
  showRoute,
  puck,
}: ItineraryMapProps & {
  puck: { metadata?: Record<string, unknown>; isEditing?: boolean };
}) {
  const isClientView = puck.metadata?.target === "client_view";

  let appData: { content?: unknown[] } | null = null;
  try {
    const puckState = usePuck((s) => s.appState);
    appData = puckState?.data as { content?: unknown[] } | null;
  } catch {
    appData = null;
  }

  const content = (appData?.content ?? []) as unknown[];
  const points = useMemo(() => extractMapPoints(content), [content]);

  if (points.length === 0) {
    return (
      <MapFallback
        height={height}
        message="Add locations to your itinerary components to see them on the map"
      />
    );
  }

  return (
    <MapRenderer
      points={points}
      height={height}
      mapStyle={mapStyle}
      showRoute={showRoute}
      isInteractive={!isClientView}
    />
  );
}

export const ItineraryMap: ComponentConfig<ItineraryMapProps> = {
  fields: {
    height: { type: "number", min: 200, max: 800 },
    mapStyle: {
      type: "select",
      options: [
        { value: "streets", label: "Streets" },
        { value: "outdoors", label: "Outdoors" },
        { value: "light", label: "Light" },
        { value: "satellite", label: "Satellite" },
      ],
    },
    showRoute: {
      type: "radio",
      options: [
        { value: true, label: "Show route line" },
        { value: false, label: "Markers only" },
      ],
    },
  },
  defaultProps: {
    height: 400,
    mapStyle: "streets",
    showRoute: true,
  },
  render: (props) => <ItineraryMapRender {...props} />,
};

export default ItineraryMap;
