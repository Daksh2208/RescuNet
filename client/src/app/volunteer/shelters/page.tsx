"use client";

import { Home, MapPin, Navigation2, CheckCircle2, Navigation, Phone, Locate } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  APIProvider,
  Map as GoogleMap,
  Marker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface ShelterItem {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  capacity: number;
  occupied: number;
  contactNumber: string;
  needs: string[];
}

export default function VolunteerSheltersPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [shelters, setShelters] = useState<ShelterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedShelter, setSelectedShelter] = useState<ShelterItem | null>(null);

  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [mapZoom, setMapZoom] = useState(5);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const fetchShelters = async () => {
    setLoading(true);
    try {
      const typeParam =
        activeFilter === "human"
          ? "?type=HUMAN"
          : activeFilter === "pet"
          ? "?type=ANIMAL"
          : "";
      const res = await api.get(`/shelters${typeParam}`);
      const data = res.data.data || [];
      setShelters(data);

      if (data.length > 0 && data[0].latitude && data[0].longitude) {
        setMapCenter({ lat: data[0].latitude, lng: data[0].longitude });
        setMapZoom(12);
      }
    } catch (err: any) {
      console.error("Failed to fetch shelters", err);
      toast.error(err.response?.data?.message || "Failed to fetch shelters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, [activeFilter]);

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(loc);
        setMapCenter(loc);
        setMapZoom(14);
        toast.success("Located your position!");
      },
      () => {
        toast.error("Unable to retrieve location permission");
      }
    );
  };

  const getShelterStatus = (occupied: number, capacity: number) => {
    if (capacity === 0) return { label: "UNKNOWN", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" };
    const ratio = occupied / capacity;
    if (ratio >= 0.95) return { label: "AT CAPACITY", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
    if (ratio >= 0.7) return { label: "NEAR CAPACITY", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
    return { label: "OPEN", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
  };

  const getDirectionsUrl = (lat: number, lng: number, address?: string) => {
    if (lat && lng) {
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address || "")}`;
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Home className="h-6 w-6 text-green-600" />
              Shelter Needs & Map Navigation
            </h1>
            <p className="text-slate-500 text-sm mt-1">Locate nearby shelters, check supply needs, and get live turn-by-turn navigation</p>
          </div>
          <Link 
            href="/volunteer"
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 min-h-[550px]">
          {/* Left Col: Interactive Google Map */}
          <div className="lg:w-2/3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative min-h-[450px]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 relative">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Navigation className="h-4 w-4 text-green-600" /> Live Shelter Navigation Map
              </h2>
              <button 
                onClick={handleMyLocation}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                title="Center on my location"
              >
                <Locate className="h-4 w-4" /> My Location
              </button>
            </div>

            <div className="flex-1 relative w-full h-full min-h-[400px]">
              <GoogleMap
                center={mapCenter}
                zoom={mapZoom}
                gestureHandling="greedy"
                disableDefaultUI={false}
                style={{ width: "100%", height: "100%" }}
              >
                {shelters.map((shelter) => (
                  shelter.latitude && shelter.longitude ? (
                    <Marker
                      key={shelter.id}
                      position={{ lat: shelter.latitude, lng: shelter.longitude }}
                      title={shelter.name}
                      onClick={() => setSelectedShelter(shelter)}
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
                      <h3 className="font-bold text-sm text-slate-900 mb-1">{selectedShelter.name}</h3>
                      <p className="text-xs text-slate-600 mb-2">{selectedShelter.address}</p>
                      <p className="text-xs font-semibold text-slate-700 mb-3">
                        Capacity: {selectedShelter.occupied} / {selectedShelter.capacity}
                      </p>
                      <a
                        href={getDirectionsUrl(selectedShelter.latitude, selectedShelter.longitude, selectedShelter.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 w-full bg-green-600 text-white text-xs font-bold py-1.5 px-3 rounded-lg hover:bg-green-700"
                      >
                        <Navigation className="h-3.5 w-3.5" /> Navigate in Google Maps
                      </a>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </div>
          </div>

          {/* Right Col: Shelter List */}
          <div className="lg:w-1/3 flex flex-col gap-4">
            <div className="flex gap-2 pb-2 overflow-x-auto">
              {["all", "human", "pet"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                    activeFilter === filter
                      ? "bg-slate-800 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {filter === "all" ? "All Shelters" : filter === "human" ? "Human" : "Animal"}
                </button>
              ))}
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[500px] pr-1">
              {loading ? (
                <div className="text-center py-8 text-slate-500 font-medium">Loading shelters...</div>
              ) : shelters.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                  <CheckCircle2 className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">No shelters found</p>
                </div>
              ) : (
                shelters.map((shelter) => {
                  const status = getShelterStatus(shelter.occupied, shelter.capacity);

                  return (
                    <div 
                      key={shelter.id} 
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between mb-3 pl-2">
                        <div>
                          <h3 className="font-bold text-slate-900 leading-tight pr-2">{shelter.name}</h3>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">{shelter.type} • {shelter.address}</p>
                        </div>
                        <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-md border ${status.border} ${status.bg} ${status.color} text-center`}>
                          {status.label}
                        </span>
                      </div>

                      <div className="pl-2 mb-4">
                        <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1">
                          <span>Capacity</span>
                          <span>{shelter.occupied} / {shelter.capacity}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full ${
                              shelter.capacity > 0 
                                ? (shelter.occupied / shelter.capacity > 0.9 ? 'bg-red-500' : shelter.occupied / shelter.capacity > 0.7 ? 'bg-orange-500' : 'bg-green-500') 
                                : 'bg-slate-300'
                            }`}
                            style={{ width: `${shelter.capacity > 0 ? (shelter.occupied / shelter.capacity) * 100 : 0}%` }}
                          />
                        </div>
                      </div>

                      {shelter.needs && shelter.needs.length > 0 && (
                        <div className="pl-2 space-y-2 mb-4">
                          <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Current Needs:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {shelter.needs.map((need, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-600 border border-slate-200 px-2 py-1 rounded-md text-[10px] font-semibold">
                                {need}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pl-2 grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                        <a 
                          href={`tel:${shelter.contactNumber}`}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition-colors border border-slate-200 flex items-center justify-center gap-1.5"
                        >
                          <Phone className="h-3.5 w-3.5" /> Call
                        </a>
                        <a 
                          href={getDirectionsUrl(shelter.latitude, shelter.longitude, shelter.address)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
                        >
                          <Navigation className="h-3.5 w-3.5" /> Directions
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </APIProvider>
  );
}
