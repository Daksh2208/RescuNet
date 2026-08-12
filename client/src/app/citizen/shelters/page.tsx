"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Search,
  Home,
  PawPrint,
  Navigation,
  Phone,
} from "lucide-react";
import Link from "next/link";

import {
  getShelters,
  type Shelter,
} from "@/lib/shelter";

export default function SheltersPage() {
  const [filter, setFilter] = useState<
    "all" | "human" | "animal"
  >("all");

  const [search, setSearch] = useState("");
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch shelters from backend
  const loadShelters = async (
    currentFilter = filter,
    currentSearch = search
  ) => {
    try {
      setLoading(true);
      setError("");

      let type:
        | "HUMAN"
        | "ANIMAL"
        | "VET"
        | undefined;

      if (currentFilter === "human") {
        type = "HUMAN";
      } else if (currentFilter === "animal") {
        // We don't send VET here because the backend
        // animal filter should return both ANIMAL and VET.
        type = "ANIMAL";
      }

      const data = await getShelters(
        type,
        currentSearch.trim() || undefined
      );

      setShelters(data);
    } catch (err) {
      console.error("Failed to fetch shelters:", err);

      setError(
        "Failed to load shelters and veterinary facilities."
      );

      setShelters([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load + filter changes
  useEffect(() => {
    loadShelters(filter, search);
  }, [filter]);

  // Search when Enter is pressed
  const handleSearch = async () => {
    await loadShelters(filter, search);
  };

  // Get appropriate icon
  const getIcon = (type: Shelter["type"]) => {
    if (type === "HUMAN") {
      return Home;
    }

    return PawPrint;
  };

  // Get appropriate colors
  const getColors = (type: Shelter["type"]) => {
    if (type === "HUMAN") {
      return {
        color: "text-blue-600",
        bg: "bg-blue-50",
      };
    }

    return {
      color: "text-orange-600",
      bg: "bg-orange-50",
    };
  };

  // Get readable facility type
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

  // Calculate available capacity
  const getAvailableCapacity = (shelter: Shelter) => {
    return Math.max(
      shelter.capacity - shelter.occupied,
      0
    );
  };

  // Calculate occupancy percentage
  const getOccupancyPercentage = (
    shelter: Shelter
  ) => {
    if (shelter.capacity <= 0) {
      return 0;
    }

    return Math.min(
      Math.round(
        (shelter.occupied / shelter.capacity) * 100
      ),
      100
    );
  };

  // Google Maps directions
  const getDirectionsUrl = (
    latitude: number,
    longitude: number
  ) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Find Shelters & Vets
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Locate nearby safe zones for humans and animals
          </p>
        </div>

        <Link
          href="/citizen"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">

        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            placeholder="Search by name or address..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">

          {/* All */}
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

          {/* Human */}
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

          {/* Animal */}
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

      {/* Map Placeholder */}
      <div className="bg-slate-200 w-full h-64 rounded-2xl border border-slate-300 flex items-center justify-center relative overflow-hidden">

        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

        <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-xl shadow-sm text-center z-10 border border-slate-200">

          <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />

          <h3 className="font-bold text-slate-900">
            Live Map View
          </h3>

          <p className="text-sm text-slate-500">
            Map integration will be added with Live Hazard Radar
          </p>
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
          <p className="text-red-600 font-medium">
            {error}
          </p>

          <button
            onClick={() =>
              loadShelters(filter, search)
            }
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        shelters.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <MapPin className="h-10 w-10 text-slate-300 mx-auto mb-3" />

            <h3 className="font-semibold text-slate-700">
              No facilities found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Try another search or change the selected filter.
            </p>
          </div>
        )}

      {/* Shelter List */}
      {!loading &&
        !error &&
        shelters.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {shelters.map((shelter) => {
              const Icon = getIcon(shelter.type);

              const colors =
                getColors(shelter.type);

              const available =
                getAvailableCapacity(shelter);

              const occupancy =
                getOccupancyPercentage(shelter);

              return (
                <div
                  key={shelter.id}
                  className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col justify-between"
                >

                  <div>

                    {/* Icon */}
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

                    {/* Name */}
                    <h3 className="font-bold text-lg text-slate-900 leading-tight mb-1">
                      {shelter.name}
                    </h3>

                    {/* Type */}
                    <p
                      className={`text-sm font-medium ${colors.color} mb-2`}
                    >
                      {getTypeLabel(shelter.type)}
                    </p>

                    {/* Capacity */}
                    <p className="text-sm font-medium text-slate-600 mb-4">
                      {available > 0
                        ? `${available} spaces available`
                        : "Currently Full"}
                    </p>

                    {/* Location */}
                    <div className="space-y-2 text-sm text-slate-600 mb-6">

                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />

                        <span>
                          {shelter.address}
                        </span>
                      </div>

                      {/* Contact */}
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />

                        <span>
                          {shelter.contactNumber}
                        </span>
                      </div>

                    </div>

                    {/* Capacity Bar */}
                    <div className="mb-5">

                      <div className="flex justify-between text-xs text-slate-500 mb-1">

                        <span>
                          Occupancy
                        </span>

                        <span>
                          {shelter.occupied}/
                          {shelter.capacity}
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
                          style={{
                            width: `${occupancy}%`,
                          }}
                        />

                      </div>

                    </div>

                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">

                    <a
                      href={`tel:${shelter.contactNumber}`}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </a>

                    <a
                      href={getDirectionsUrl(
                        shelter.latitude,
                        shelter.longitude
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                    >
                      <Navigation className="h-4 w-4" />
                      Directions
                    </a>

                  </div>

                </div>
              );
            })}

          </div>
        )}

    </div>
  );
}