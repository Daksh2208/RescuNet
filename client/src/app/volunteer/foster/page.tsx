"use client";

import { PawPrint, MapPin, Heart, Dog, Cat, Info, PhoneCall, CheckCircle2, Navigation } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface FosterItem {
  id: string;
  petName: string;
  animalType: string;
  breed?: string;
  description: string;
  location: string;
  status: string;
  shelter?: {
    id: string;
    name: string;
    contactNumber: string;
  };
}

export default function FosterCoordinationPage() {
  const [fosterRequests, setFosterRequests] = useState<FosterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const fetchFosterRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/foster");
      setFosterRequests(res.data.requests || []);
    } catch (err: any) {
      console.error("Failed to fetch foster requests", err);
      toast.error(err.response?.data?.message || "Failed to fetch foster requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFosterRequests();
  }, []);

  const handleApplyFoster = async (fosterId: string) => {
    setApplyingId(fosterId);
    try {
      await api.post(`/foster/${fosterId}/apply`);
      toast.success("Thank you! Your foster application has been submitted.");
      fetchFosterRequests();
    } catch (err: any) {
      console.error("Failed to apply for foster", err);
      toast.error(err.response?.data?.message || "Failed to submit foster application");
    } finally {
      setApplyingId(null);
    }
  };

  const getPetIcon = (type: string) => {
    return type === "CAT" ? Cat : Dog;
  };

  const getPetStyles = (type: string) => {
    return type === "CAT"
      ? { color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" }
      : { color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
  };

  const getDirectionsUrl = (location: string) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <PawPrint className="h-6 w-6 text-green-600" />
            Foster Coordination & Directions
          </h1>
          <p className="text-slate-500 text-sm mt-1">Provide temporary safe havens for displaced pets with location navigation</p>
        </div>
        <Link 
          href="/volunteer"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl flex items-start gap-3 shadow-sm">
        <Info className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
        <div className="text-sm text-orange-800">
          <strong>Emergency Foster Need:</strong> Local shelters are at high capacity due to recent evacuations. Fostering an animal for just 48 hours saves lives and frees up critical space.
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500 font-medium">Loading foster requests...</div>
      ) : fosterRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No open foster requests</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
            All animals currently have temporary shelter placements. Check back soon!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fosterRequests.map((req) => {
            const Icon = getPetIcon(req.animalType);
            const styles = getPetStyles(req.animalType);
            const isApplying = applyingId === req.id;

            return (
              <div key={req.id} className={`bg-white rounded-2xl border ${styles.border} shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow`}>
                <div className={`p-6 ${styles.bg} border-b ${styles.border} flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-sm ${styles.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg leading-tight">{req.petName}</h3>
                      <p className="text-xs font-semibold text-slate-600">{req.breed || req.animalType}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <p className="text-sm text-slate-700 font-medium leading-relaxed flex-1">
                    {req.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                    <span>Currently at: <span className="text-slate-900">{req.location}</span></span>
                  </div>

                  <div className="pt-2 grid grid-cols-3 gap-2">
                    <a 
                      href={`tel:${req.shelter?.contactNumber || ''}`}
                      className="bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
                    >
                      <PhoneCall className="h-3.5 w-3.5" /> Call
                    </a>
                    <a 
                      href={getDirectionsUrl(req.location)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-50 text-blue-700 border border-blue-200 font-bold py-2.5 rounded-xl text-xs hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <Navigation className="h-3.5 w-3.5" /> Map
                    </a>
                    <button 
                      onClick={() => handleApplyFoster(req.id)}
                      disabled={isApplying}
                      className="bg-green-600 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <Heart className="h-3.5 w-3.5" /> {isApplying ? "..." : "Foster"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
