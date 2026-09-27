"use client";

import * as React from "react";
import {
  AlertTriangle,
  CircleAlert,
  Fullscreen,
  Minus,
  Plus,
  TrainFront,
  Wrench,
} from "lucide-react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type AssetStatus =
  | "Healthy"
  | "Warning"
  | "Critical"
  | "Maintenance"
  | "Ongoing";

type Asset = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: AssetStatus;
  description?: string;
};

const corridor = [
  [28.6139, 77.209] as [number, number], // Delhi
  [28.4089, 77.3178] as [number, number], // Faridabad
  [28.367, 77.326] as [number, number],
  [28.147, 77.325] as [number, number], // Ballabhgarh
  [27.995, 77.673] as [number, number], // Hodal
  [27.492, 77.673] as [number, number], // Mathura
  [27.1767, 78.0081] as [number, number], // Agra
];

const stations = [
  { name: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "Tughlakabad", lat: 28.501, lng: 77.29 },
  { name: "Faridabad", lat: 28.4089, lng: 77.3178 },
  { name: "Ballabhgarh", lat: 28.3406, lng: 77.325 },
  { name: "Hodal", lat: 27.993, lng: 77.672 },
  { name: "Mathura", lat: 27.4924, lng: 77.6737 },
  { name: "Agra", lat: 27.1767, lng: 78.0081 },
];

const assets: Asset[] = [
  {
    id: "TRK-C01-024",
    name: "Track Segment",
    lat: 28.53,
    lng: 77.37,
    status: "Critical",
    description: "Track Km 102.4 – 103.1",
  },
  {
    id: "OHE-C01-118",
    name: "Maintenance Due",
    lat: 27.98,
    lng: 77.58,
    status: "Warning",
  },
  {
    id: "SIG-C01-031",
    name: "Critical Signal",
    lat: 27.37,
    lng: 77.78,
    status: "Critical",
  },
  {
    id: "BLK-C01-031",
    name: "Ongoing Work",
    lat: 27.78,
    lng: 77.61,
    status: "Ongoing",
  },
];

function createMarkerIcon(
  type: "station" | "healthy" | "warning" | "critical" | "maintenance"
) {
  const config = {
    station: { background: "#0284c7", icon: "●" },
    healthy: { background: "#16a34a", icon: "●" },
    warning: { background: "#f59e0b", icon: "!" },
    critical: { background: "#ef4444", icon: "!" },
    maintenance: { background: "#3b82f6", icon: "W" },
  };

  const selected = config[type];

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div
        style="
          width: 18px;
          height: 18px;
          border-radius: 999px;
          background: ${selected.background};
          border: 3px solid white;
          box-shadow: 0 1px 5px rgba(0,0,0,.25);
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-size:9px;
          font-weight:700;
        "
      >
        ${selected.icon}
      </div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function MapControls() {
  const map = useMap();

  return (
    <div className="absolute right-3 top-3 z-[1000] flex flex-col overflow-hidden rounded-md border bg-card shadow-sm">
      <button
        onClick={() => map.zoomIn()}
        className="flex size-8 items-center justify-center border-b hover:bg-muted"
      >
        <Plus className="size-4" />
      </button>

      <button
        onClick={() => map.zoomOut()}
        className="flex size-8 items-center justify-center border-b hover:bg-muted"
      >
        <Minus className="size-4" />
      </button>

      <button
        onClick={() => {
          map.fitBounds(corridor);
        }}
        className="flex size-8 items-center justify-center hover:bg-muted"
      >
        <Fullscreen className="size-3.5" />
      </button>
    </div>
  );
}

function MapLegend() {
  return (
    <div className="absolute right-14 top-3 z-[1000] w-[130px] rounded-lg border bg-card/95 p-3 shadow-sm backdrop-blur">
      <div className="space-y-2">
        <LegendItem type="line" label="Track" />
        <LegendItem type="station" label="Station" />
        <LegendItem type="healthy" label="Healthy Asset" />
        <LegendItem type="warning" label="Warning Asset" />
        <LegendItem type="critical" label="Critical Asset" />
        <LegendItem type="maintenance" label="Maintenance Work" />
        <LegendItem type="ongoing" label="Ongoing Block" />
        <LegendItem type="train" label="Train Live" />
      </div>
    </div>
  );
}

function LegendItem({
  type,
  label,
}: {
  type:
    | "line"
    | "station"
    | "healthy"
    | "warning"
    | "critical"
    | "maintenance"
    | "ongoing"
    | "train";
  label: string;
}) {
  const icon = {
    line: <span className="h-0.5 w-4 rounded-full bg-foreground" />,
    station: <span className="size-2 rounded-full border-2 border-sky-500" />,
    healthy: <span className="size-2 rounded-full bg-emerald-500" />,
    warning: <span className="size-2 rounded-full bg-amber-500" />,
    critical: <span className="size-2 rounded-full bg-destructive" />,
    maintenance: <span className="size-2 rounded-sm bg-sky-500" />,
    ongoing: <span className="size-2 rounded-sm bg-blue-500" />,
    train: <TrainFront className="size-3 text-sky-600" />,
  }[type];

  return (
    <div className="flex items-center gap-2 text-[8px]">
      <div className="flex w-4 justify-center">{icon}</div>
      <span>{label}</span>
    </div>
  );
}

function MapStat({
  value,
  label,
  danger = false,
}: {
  value: string;
  label: string;
  danger?: boolean;
}) {
  return (
    <div>
      <p className={`text-sm font-bold ${danger ? "text-destructive" : ""}`}>
        {value}
      </p>
      <p className="text-[7px] text-muted-foreground">{label}</p>
    </div>
  );
}

function MapCallout({
  className,
  type,
  title,
  subtitle,
}: {
  className: string;
  type: "critical" | "warning" | "ongoing";
  title: string;
  subtitle: string;
}) {
  const styles = {
    critical: "border-destructive/20 bg-destructive/95 text-white",
    warning: "border-amber-300 bg-amber-50 text-amber-900",
    ongoing: "border-sky-200 bg-sky-50 text-sky-900",
  };

  return (
    <div
      className={`absolute z-[900] flex items-center gap-1 rounded-md border px-2 py-1 shadow-sm ${styles[type]} ${className}`}
    >
      {type === "critical" && <AlertTriangle className="size-3" />}
      {type === "warning" && <CircleAlert className="size-3" />}
      {type === "ongoing" && <Wrench className="size-3" />}

      <div>
        <p className="text-[8px] font-semibold">{title}</p>
        <p className="text-[7px] opacity-80">{subtitle}</p>
      </div>
    </div>
  );
}

export function CorridorMap() {
  return (
    <div className="relative h-full min-h-[400px] overflow-hidden rounded-xl border bg-muted">
      <MapContainer
        center={[27.95, 77.55]}
        zoom={8}
        zoomControl={false}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Railway corridor */}
        <Polyline
          positions={corridor}
          pathOptions={{
            color: "#1f2937",
            weight: 4,
            opacity: 0.9,
          }}
        />

        {/* Stations */}
        {stations.map((station) => (
          <Marker
            key={station.name}
            position={[station.lat, station.lng]}
            icon={createMarkerIcon("station")}
          >
            <Popup>
              <div className="text-xs font-semibold">{station.name}</div>
              <p className="text-[10px] text-muted-foreground">
                C-01 Railway Station
              </p>
            </Popup>
          </Marker>
        ))}

        {/* Assets */}
        {assets.map((asset) => {
          const iconType =
            asset.status === "Critical"
              ? "critical"
              : asset.status === "Warning"
              ? "warning"
              : asset.status === "Ongoing"
              ? "maintenance"
              : "healthy";

          return (
            <Marker
              key={asset.id}
              position={[asset.lat, asset.lng]}
              icon={createMarkerIcon(iconType)}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="text-xs font-semibold">{asset.id}</p>
                  <p className="text-[10px]">{asset.name}</p>
                  {asset.description && (
                    <p className="text-[9px] text-muted-foreground">
                      {asset.description}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapControls />
      </MapContainer>

      <MapLegend />

      {/* Corridor summary */}
      <div className="absolute left-3 top-3 z-[1000] w-[290px] rounded-lg border bg-card/95 p-3 shadow-sm backdrop-blur">
        <p className="text-[9px] font-semibold">Corridor Overview – C-01</p>

        <div className="mt-2 grid grid-cols-5 gap-2">
          <MapStat value="124.8 km" label="Total Length" />
          <MapStat value="12" label="Stations" />
          <MapStat value="842" label="Assets" />
          <MapStat value="17" label="At Risk" danger />
          <MapStat value="3" label="Ongoing Works" />
        </div>
      </div>
    </div>
  );
}
