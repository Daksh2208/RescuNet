"use client";

import { useEffect, useState } from "react";
import {
  Radar,
  MapPin,
  Navigation2,
  Droplet,
  Flame,
  Map,
  AlertTriangle,
  Mountain,
  Wind,
  Activity,
} from "lucide-react";
import Link from "next/link";

import {
  APIProvider,
  Map as GoogleMap,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";

import { getRadarIncidents } from "@/lib/incident";

interface RadarIncident {
  id: string;
  title: string;
  description: string;
  disasterType:
    | "FLOOD"
    | "EARTHQUAKE"
    | "FIRE"
    | "CYCLONE"
    | "LANDSLIDE"
    | "OTHER";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status:
    | "PENDING"
    | "VERIFIED"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "REJECTED";
  latitude: number;
  longitude: number;
  address: string;
  createdAt: string;
}

export default function HazardRadarPage() {
  const [hazards, setHazards] = useState<RadarIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedHazard, setSelectedHazard] =
    useState<RadarIncident | null>(null);

  const [mapCenter, setMapCenter] = useState({
    lat: 20.5937,
    lng: 78.9629,
  });

  const [mapZoom, setMapZoom] = useState(5);

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  useEffect(() => {
    const loadRadar = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getRadarIncidents();

        const validHazards = data.filter(
          (incident: RadarIncident) =>
            incident.latitude !== 0 &&
            incident.longitude !== 0
        );

        setHazards(validHazards);

        if (validHazards.length > 0) {
          setMapCenter({
            lat: validHazards[0].latitude,
            lng: validHazards[0].longitude,
          });

          setMapZoom(13);
        }
      } catch (err) {
        console.error("Failed to load radar:", err);
        setError("Unable to load live hazard data.");
      } finally {
        setLoading(false);
      }
    };

    loadRadar();
  }, []);

  const getHazardIcon = (
    type: RadarIncident["disasterType"]
  ) => {
    switch (type) {
      case "FLOOD":
        return Droplet;

      case "FIRE":
        return Flame;

      case "EARTHQUAKE":
        return Activity;

      case "LANDSLIDE":
        return Mountain;

      case "CYCLONE":
        return Wind;

      default:
        return AlertTriangle;
    }
  };

  const getHazardStyle = (
    type: RadarIncident["disasterType"]
  ) => {
    switch (type) {
      case "FLOOD":
        return {
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-200",
        };

      case "FIRE":
        return {
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
        };

      case "EARTHQUAKE":
        return {
          color: "text-purple-600",
          bg: "bg-purple-50",
          border: "border-purple-200",
        };

      case "LANDSLIDE":
        return {
          color: "text-orange-600",
          bg: "bg-orange-50",
          border: "border-orange-200",
        };

      case "CYCLONE":
        return {
          color: "text-cyan-600",
          bg: "bg-cyan-50",
          border: "border-cyan-200",
        };

      default:
        return {
          color: "text-rose-600",
          bg: "bg-rose-50",
          border: "border-rose-200",
        };
    }
  };

  const getSeverityColor = (
    severity: RadarIncident["severity"]
  ) => {
    switch (severity) {
      case "CRITICAL":
        return "#dc2626";

      case "HIGH":
        return "#ea580c";

      case "MEDIUM":
        return "#ca8a04";

      default:
        return "#16a34a";
    }
  };

  const getSeverityStyle = (
    severity: RadarIncident["severity"]
  ) => {
    switch (severity) {
      case "CRITICAL":
        return "text-red-700 bg-red-100 border-red-200";

      case "HIGH":
        return "text-orange-700 bg-orange-100 border-orange-200";

      case "MEDIUM":
        return "text-yellow-700 bg-yellow-100 border-yellow-200";

      default:
        return "text-green-700 bg-green-100 border-green-200";
    }
  };

  const formatTime = (date: string) => {
    const created = new Date(date);
    const now = new Date();

    const diffMs = now.getTime() - created.getTime();
    const diffMinutes = Math.floor(
      diffMs / (1000 * 60)
    );

    if (diffMinutes < 1) {
      return "Just now";
    }

    if (diffMinutes < 60) {
      return `${diffMinutes} min ago`;
    }

    const diffHours = Math.floor(
      diffMinutes / 60
    );

    if (diffHours < 24) {
      return `${diffHours} hr ago`;
    }

    const diffDays = Math.floor(
      diffHours / 24
    );

    return `${diffDays} day${
      diffDays > 1 ? "s" : ""
    } ago`;
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setUserLocation(location);
        setMapCenter(location);
        setMapZoom(15);
      },
      () => {
        alert(
          "Unable to access your current location. Please allow location permission."
        );
      }
    );
  };

  const resetMap = () => {
    if (hazards.length > 0) {
      setMapCenter({
        lat: hazards[0].latitude,
        lng: hazards[0].longitude,
      });

      setMapZoom(13);
    } else {
      setMapCenter({
        lat: 20.5937,
        lng: 78.9629,
      });

      setMapZoom(5);
    }

    setSelectedHazard(null);
  };

  return (
    <APIProvider
      apiKey={
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
      }
    >
      <div className="max-w-6xl mx-auto space-y-6 h-[calc(100vh-8rem)] flex flex-col">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">

          <div>

            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Radar className="h-6 w-6 text-rose-500" />
              Live Hazard Radar
            </h1>

            <p className="text-slate-500 text-sm mt-1">
              Crowdsourced danger map to help you navigate safely
            </p>

          </div>

          <div className="flex gap-3">

            <Link
              href="/citizen"
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Back
            </Link>

            <Link
              href="/citizen/report"
              className="px-4 py-2 text-sm font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <AlertTriangle className="h-4 w-4" />
              Report Emergency
            </Link>

          </div>

        </div>


        {/* Main */}

        <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">

          {/* GOOGLE MAP */}

          <div className="flex-1 relative min-h-[400px]">

            <GoogleMap
              center={mapCenter}
              zoom={mapZoom}
              gestureHandling="greedy"
              disableDefaultUI={false}
              mapTypeControl={true}
              streetViewControl={false}
              fullscreenControl={true}
              style={{
                width: "100%",
                height: "100%",
              }}
            >

              {/* Hazard Markers */}

              {hazards.map((hazard) => (

                <Marker
                  key={hazard.id}
                  position={{
                    lat: hazard.latitude,
                    lng: hazard.longitude,
                  }}
                  title={hazard.title}
                  onClick={() =>
                    setSelectedHazard(hazard)
                  }
                />

              ))}


              {/* User Location */}

              {userLocation && (

                <Marker
                  position={userLocation}
                  title="Your Location"
                />

              )}


              {/* Selected Hazard Info */}

              {selectedHazard && (

                <InfoWindow
                  position={{
                    lat: selectedHazard.latitude,
                    lng: selectedHazard.longitude,
                  }}
                  onCloseClick={() =>
                    setSelectedHazard(null)
                  }
                >

                  <div className="min-w-[230px] p-1">

                    <h3 className="font-bold text-slate-900 text-sm mb-1">
                      {selectedHazard.title}
                    </h3>

                    <div className="flex items-center gap-2 mb-2">

                      <span className="text-xs font-semibold text-slate-600">
                        {selectedHazard.disasterType}
                      </span>

                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          color: getSeverityColor(
                            selectedHazard.severity
                          ),
                          backgroundColor:
                            "#f8fafc",
                        }}
                      >
                        {selectedHazard.severity}
                      </span>

                    </div>

                    <p className="text-xs text-slate-600 mb-2">
                      {selectedHazard.description}
                    </p>

                    <p className="text-xs text-slate-500">
                      📍 {selectedHazard.address}
                    </p>

                    <p className="text-[10px] text-slate-400 mt-1">
                      {selectedHazard.status} •{" "}
                      {formatTime(
                        selectedHazard.createdAt
                      )}
                    </p>

                  </div>

                </InfoWindow>

              )}

            </GoogleMap>


            {/* Map Status */}

            <div className="absolute top-4 left-4 bg-white/95 shadow-md px-3 py-2 rounded-lg backdrop-blur-sm border border-slate-200 z-10">

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />

                <span className="text-xs font-bold text-slate-700">
                  {loading
                    ? "Loading hazards..."
                    : `${hazards.length} active hazard${
                        hazards.length !== 1
                          ? "s"
                          : ""
                      }`}
                </span>

              </div>

            </div>


            {/* Custom Map Controls */}

            <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">

              <button
                onClick={handleMyLocation}
                className="h-10 w-10 bg-white hover:bg-slate-50 shadow-md rounded-lg flex items-center justify-center border border-slate-200 transition-colors"
                title="My Location"
              >
                <Navigation2 className="h-5 w-5 text-blue-600" />
              </button>

              <button
                onClick={resetMap}
                className="h-10 w-10 bg-white hover:bg-slate-50 shadow-md rounded-lg flex items-center justify-center border border-slate-200 transition-colors"
                title="Reset Map"
              >
                <Map className="h-5 w-5 text-slate-700" />
              </button>

            </div>

          </div>


          {/* SIDEBAR */}

          <div className="w-full md:w-[400px] border-l border-slate-200 bg-slate-50 flex flex-col overflow-hidden shrink-0">

            <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">

              <h2 className="font-bold text-slate-900">
                Active Hazards ({hazards.length})
              </h2>

              <span className="flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">

                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />

                Live Feed

              </span>

            </div>


            <div className="flex-1 overflow-y-auto p-4 space-y-3">

              {loading && (

                <div className="text-center py-10 text-sm text-slate-500">
                  Loading hazards...
                </div>

              )}


              {!loading && error && (

                <div className="text-center py-10">

                  <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />

                  <p className="text-sm font-medium text-red-600">
                    {error}
                  </p>

                </div>

              )}


              {!loading &&
                !error &&
                hazards.length === 0 && (

                  <div className="text-center py-10">

                    <Radar className="h-8 w-8 text-slate-300 mx-auto mb-2" />

                    <p className="text-sm font-medium text-slate-600">
                      No active hazards found.
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Stay safe!
                    </p>

                  </div>

                )}


              {!loading &&
                !error &&
                hazards.map((hazard) => {

                  const Icon = getHazardIcon(
                    hazard.disasterType
                  );

                  const style = getHazardStyle(
                    hazard.disasterType
                  );

                  return (

                    <button
                      key={hazard.id}
                      onClick={() => {
                        setSelectedHazard(hazard);

                        setMapCenter({
                          lat: hazard.latitude,
                          lng: hazard.longitude,
                        });

                        setMapZoom(15);
                      }}
                      className="w-full text-left p-4 rounded-xl border bg-white border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all"
                    >

                      <div className="flex items-start gap-3">

                        <div
                          className={`mt-0.5 h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border ${style.border} ${style.bg} ${style.color}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">

                          <div className="flex items-center justify-between gap-2 mb-1">

                            <h3 className="font-bold text-slate-900 text-sm truncate">
                              {hazard.title}
                            </h3>

                            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">
                              {formatTime(
                                hazard.createdAt
                              )}
                            </span>

                          </div>

                          <div className="flex items-center gap-2 mb-2">

                            <span className="text-[10px] font-bold text-slate-500">
                              {hazard.disasterType}
                            </span>

                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityStyle(
                                hazard.severity
                              )}`}
                            >
                              {hazard.severity}
                            </span>

                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed mb-2 line-clamp-2">
                            {hazard.description}
                          </p>

                          <div className="flex items-center justify-between gap-2">

                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 min-w-0">

                              <MapPin className="h-3 w-3 shrink-0" />

                              <span className="truncate">
                                {hazard.address}
                              </span>

                            </div>

                            <span className="text-[10px] font-bold text-slate-400 ml-2 whitespace-nowrap">
                              {hazard.status}
                            </span>

                          </div>

                        </div>

                      </div>

                    </button>

                  );
                })}

            </div>

          </div>

        </div>

      </div>
    </APIProvider>
  );
}