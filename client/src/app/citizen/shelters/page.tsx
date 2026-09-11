"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Search,
  Home,
  PawPrint,
  Navigation,
  Phone,
  ZoomIn,
  ZoomOut,
  Locate,
} from "lucide-react";
import Link from "next/link";
import {
  APIProvider,
  Map as GoogleMap,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";

import {
  getShelters,
  type Shelter,
} from "@/lib/shelter";

export default function SheltersPage() {
  const [filter, setFilter] = useState<"all" | "human" | "animal">("all");
  const [search, setSearch] = useState("");
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);

  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapZoom, setMapZoom] = useState(5);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Fetch shelters from backend
  const loadShelters = async (
    currentFilter = filter,
    currentSearch = search
  ) => {
    try {
      setLoading(true);
      setError("");

      let type: "HUMAN" | "ANIMAL" | "VET" | undefined;
      if (currentFilter === "human") {
        type = "HUMAN";
      } else if (currentFilter === "animal") {
        type = "ANIMAL";
      }

      const data = await getShelters(
        type,
        currentSearch.trim() || undefined
      );

      setShelters(data);

      if (data.length > 0 && data[0].latitude && data[0].longitude) {
        setMapCenter({ lat: data[0].latitude, lng: data[0].longitude });
        setMapZoom(12);
      }
    } catch (err) {
      console.error("Failed to fetch shelters:", err);
      setError("Failed to load shelters and veterinary facilities.");
      setShelters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShelters(filter, search);
  }, [filter]);

  const handleSearch = async () => {
    await loadShelters(filter, search);
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(loc);
        setMapCenter(loc);
        setMapZoom(15);
      },
      () => {}
    );
  };

  const handleZoomIn = () => setMapZoom((prev) => Math.min(prev + 1, 20));
  const handleZoomOut = () => setMapZoom((prev) => Math.max(prev - 1, 3));

  const handleFocusShelter = (shelter: Shelter) => {
    setSelectedShelter(shelter);
    if (shelter.latitude && shelter.longitude) {
      setMapCenter({ lat: shelter.latitude, lng: shelter.longitude });
      setMapZoom(16);
    }
  };

  const getIcon = (type: Shelter["type"]) => {
    if (type === "HUMAN") return Home;
    return PawPrint;
  };

  const getColors = (type: Shelter["type"]) => {
    if (type === "HUMAN") {
      return { color: "text-blue-600", bg: "bg-blue-50" };
    }
    return { color: "text-orange-600", bg: "bg-orange-50" };
  };

  const getTypeLabel = (type: Shelter["type"]) => {
    switch (type) {
      case "HUMAN":
        return "Human Emergency Shelter";
      case "ANIMAL":
        return "Animal Shelter";
      case "VET":
        return "Veterinary Care";
      default:
        return "Emergency Facility";
    }
  };

  const getAvailableCapacity = (shelter: Shelter) => {
    return Math.max(shelter.capacity - shelter.occupied, 0);
  };

  const getOccupancyPercentage = (shelter: Shelter) => {
    if (shelter.capacity <= 0) return 0;
    return Math.min(Math.round((shelter.occupied / shelter.capacity) * 100), 100);
  };

  const getDirectionsUrl = (latitude: number, longitude: number) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Find Shelters & Vets
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Locate nearby safe zones for humans and animals, zoom in on maps, and get live turn-by-turn directions
            </p>
          </div>

          <Link
            href="/citizen"
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Search by name or address..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-slate-800 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("human")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                filter === "human"
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Home className="h-4 w-4" />
              Human
            </button>
            <button
              onClick={() => setFilter("animal")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                filter === "animal"
                  ? "bg-orange-600 text-white"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <PawPrint className="h-4 w-4" />
              Animal
            </button>
          </div>
        </div>

        {/* Interactive Google Map View */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative h-[420px]">
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-white z-10">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
              <MapPin className="h-4 w-4 text-blue-600" /> Interactive Shelter Map
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                Zoom: {mapZoom}
              </span>
              <button
                onClick={handleMyLocation}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg border border-blue-200 transition-colors"
              >
                <Locate className="h-3.5 w-3.5" /> My Location
              </button>
            </div>
          </div>

          <div className="flex-1 relative w-full h-full">
            {/* Floating Zoom & Camera Controls Overlay */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-slate-200">
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-slate-100 text-slate-700 rounded-lg font-bold transition-colors flex items-center justify-center"
                title="Zoom In (+)"
              >
                <ZoomIn className="h-5 w-5 text-slate-800" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-slate-100 text-slate-700 rounded-lg font-bold transition-colors flex items-center justify-center"
                title="Zoom Out (-)"
              >
                <ZoomOut className="h-5 w-5 text-slate-800" />
              </button>
            </div>

            <GoogleMap
              center={mapCenter}
              zoom={mapZoom}
              onCameraChanged={(ev) => {
                setMapCenter(ev.detail.center);
                setMapZoom(ev.detail.zoom);
              }}
              gestureHandling="greedy"
              zoomControl={true}
              mapTypeControl={true}
              streetViewControl={false}
              fullscreenControl={true}
              minZoom={3}
              maxZoom={20}
              style={{ width: "100%", height: "100%" }}
            >
              {shelters.map((shelter) => (
                shelter.latitude && shelter.longitude ? (
                  <Marker
                    key={shelter.id}
                    position={{ lat: shelter.latitude, lng: shelter.longitude }}
                    title={shelter.name}
                    onClick={() => handleFocusShelter(shelter)}
                  />
                ) : null
              ))}

              {userLocation && (
                <Marker position={userLocation} title="Your Location" />
              )}

              {selectedShelter && selectedShelter.latitude && selectedShelter.longitude && (
                <InfoWindow
                  position={{ lat: selectedShelter.latitude, lng: selectedShelter.longitude }}
                  onCloseClick={() => setSelectedShelter(null)}
                >
                  <div className="p-2 min-w-[200px]">
                    <h4 className="font-bold text-sm text-slate-900 mb-1">{selectedShelter.name}</h4>
                    <p className="text-xs text-slate-600 mb-2">{selectedShelter.address}</p>
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => handleFocusShelter(selectedShelter)}
                        className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold py-1.5 px-3 rounded-lg border border-blue-200 flex items-center justify-center gap-1.5"
                      >
                        <ZoomIn className="h-3.5 w-3.5" /> Zoom In to Area
                      </button>
                      <a
                        href={getDirectionsUrl(selectedShelter.latitude, selectedShelter.longitude)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-blue-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1.5"
                      >
                        <Navigation className="h-3.5 w-3.5" /> Get Directions
                      </a>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <p className="text-slate-500">
              Loading shelters and veterinary facilities...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={() => loadShelters(filter, search)}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && shelters.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <MapPin className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700">No facilities found</h3>
            <p className="text-sm text-slate-500 mt-1">
              Try another search or change the selected filter.
            </p>
          </div>
        )}

        {/* Shelter List */}
        {!loading && !error && shelters.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shelters.map((shelter) => {
              const Icon = getIcon(shelter.type);
              const colors = getColors(shelter.type);
              const available = getAvailableCapacity(shelter);
              const occupancy = getOccupancyPercentage(shelter);
              const isSelected = selectedShelter?.id === shelter.id;

              return (
                <div
                  key={shelter.id}
                  className={`bg-white border p-5 rounded-2xl shadow-sm flex flex-col justify-between transition-all ${
                    isSelected ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center ${colors.bg} ${colors.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                        {occupancy}% full
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">
                      {shelter.name}
                    </h3>

                    <p className={`text-sm font-medium ${colors.color} mb-2`}>
                      {getTypeLabel(shelter.type)}
                    </p>

                    <p className="text-sm font-medium text-slate-600 mb-4">
                      {available > 0
                        ? `${available} spaces available`
                        : "Currently Full"}
                    </p>

                    <div className="space-y-2 text-sm text-slate-600 mb-6">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                        <span>{shelter.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{shelter.contactNumber}</span>
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Occupancy</span>
                        <span>
                          {shelter.occupied}/{shelter.capacity}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            occupancy >= 90
                              ? "bg-red-500"
                              : occupancy >= 70
                              ? "bg-orange-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${occupancy}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFocusShelter(shelter)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2 px-3 rounded-xl transition-colors text-xs flex items-center justify-center gap-1 border border-blue-200"
                      title="Zoom in on map to see location area"
                    >
                      <ZoomIn className="h-3.5 w-3.5" /> Zoom In
                    </button>
                    <a
                      href={`tel:${shelter.contactNumber}`}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-2 rounded-xl transition-colors text-xs flex items-center justify-center gap-1.5"
                    >
                      <Phone className="h-3.5 w-3.5" /> Call
                    </a>
                    <a
                      href={getDirectionsUrl(shelter.latitude, shelter.longitude)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-xl transition-colors text-xs flex items-center justify-center gap-1.5"
                    >
                      <Navigation className="h-3.5 w-3.5" /> Directions
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </APIProvider>
  );
}