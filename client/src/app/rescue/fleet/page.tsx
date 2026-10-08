"use client";

import { useEffect, useState } from "react";
import { 
  Wrench, 
  Shield, 
  Navigation, 
  Settings, 
  Search, 
  MapPin, 
  Plus, 
  Loader2, 
  AlertTriangle,
  Radio,
  X
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

type FleetAsset = {
  id: string;
  name: string;
  assetCode: string;
  type: string;
  status: "AVAILABLE" | "DEPLOYED" | "MAINTENANCE" | "DECOMMISSIONED";
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  lastService?: string | null;
  notes?: string | null;
  assignedTo?: {
    id: string;
    fullName: string;
    phone: string;
  } | null;
};

const assetTypeIcons: Record<string, any> = {
  VEHICLE: Navigation,
  BOAT: Navigation,
  DRONE: Radio,
  TOOL: Wrench,
  COMMUNICATION: Radio,
  MEDICAL: Shield,
};

export default function FleetManagementPage() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [assets, setAssets] = useState<FleetAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<FleetAsset | null>(null);

  // Form states for creating asset
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formType, setFormType] = useState("VEHICLE");
  const [formLocation, setFormLocation] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [formStatus, setFormStatus] = useState<string>("AVAILABLE");
  const [submitting, setSubmitting] = useState(false);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError("");
      const params: Record<string, string> = {};
      if (filter !== "all") {
        params.status = filter.toUpperCase();
      }
      if (search.trim()) {
        params.search = search.trim();
      }
      const res = await api.get("/rescue/fleet", { params });
      setAssets(res.data.data || []);
    } catch (err: any) {
      console.error("Failed to fetch fleet assets:", err);
      setError(err.response?.data?.message || "Failed to load fleet assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [filter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAssets();
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formCode || !formLocation) {
      alert("Name, code, and location are required.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/rescue/fleet", {
        name: formName,
        assetCode: formCode,
        type: formType,
        location: formLocation,
        notes: formNotes || undefined,
      });
      setShowAddModal(false);
      setFormName("");
      setFormCode("");
      setFormLocation("");
      setFormNotes("");
      await fetchAssets();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create asset");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (assetId: string, newStatus: string) => {
    try {
      await api.patch(`/rescue/fleet/${assetId}`, { status: newStatus });
      await fetchAssets();
      if (selectedAsset?.id === assetId) {
        setShowEditModal(false);
        setSelectedAsset(null);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update asset status");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="h-6 w-6 text-blue-600" />
            Fleet & Equipment
          </h1>
          <p className="text-slate-500 text-sm mt-1">Track and manage specialized rescue assets</p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/rescue"
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0"
          >
            Back to Dashboard
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm shrink-0"
          >
            <Plus className="h-4 w-4" /> Add Asset
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-2 bg-slate-50 p-1 rounded-xl w-fit flex-wrap">
            {["all", "available", "deployed", "maintenance"].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-colors ${
                  filter === f ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code or name..." 
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </form>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading fleet assets...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-red-50 text-red-700">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="p-12 text-center">
            <Wrench className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-lg">No assets found</h3>
            <p className="text-sm text-slate-500 mt-1">Add your team's equipment or update filter parameters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-6 py-4">Asset</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Assignment & Location</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assets.map((asset) => {
                  const Icon = assetTypeIcons[asset.type] || Wrench;
                  const statusColors: Record<string, string> = {
                    AVAILABLE: "bg-emerald-50 text-emerald-700 border-emerald-200",
                    DEPLOYED: "bg-blue-50 text-blue-700 border-blue-200",
                    MAINTENANCE: "bg-orange-50 text-orange-700 border-orange-200",
                    DECOMMISSIONED: "bg-slate-50 text-slate-700 border-slate-200",
                  };

                  return (
                    <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg flex items-center justify-center border bg-blue-50 text-blue-600 border-blue-200 shrink-0">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{asset.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{asset.assetCode} • {asset.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${statusColors[asset.status] || ""}`}>
                          {asset.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium text-xs">
                            <Shield className="h-3.5 w-3.5 text-slate-400" />
                            {asset.assignedTo ? asset.assignedTo.fullName : "Unassigned"}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" /> {asset.location}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedAsset(asset);
                            setShowEditModal(true);
                          }}
                          className="text-slate-600 font-bold hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
                          title="Manage Asset"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">Add New Fleet Asset</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Asset Name</label>
                <input 
                  type="text" 
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Swift-water Inflatable Boat"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Asset Code</label>
                  <input 
                    type="text" 
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="e.g. BOAT-101"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Type</label>
                  <select 
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="VEHICLE">Vehicle</option>
                    <option value="BOAT">Boat</option>
                    <option value="DRONE">Drone</option>
                    <option value="TOOL">Tool</option>
                    <option value="COMMUNICATION">Communication</option>
                    <option value="MEDICAL">Medical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Base / Current Location</label>
                <input 
                  type="text" 
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Station Alpha Armory"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Notes / Description</label>
                <textarea 
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. 5-person capacity, fully fueled"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Save Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit / Manage Modal */}
      {showEditModal && selectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">Manage {selectedAsset.name}</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="bg-slate-50 p-3 rounded-xl border space-y-1">
                <p><strong>Code:</strong> {selectedAsset.assetCode}</p>
                <p><strong>Type:</strong> {selectedAsset.type}</p>
                <p><strong>Location:</strong> {selectedAsset.location}</p>
                {selectedAsset.notes && <p><strong>Notes:</strong> {selectedAsset.notes}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Update Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["AVAILABLE", "DEPLOYED", "MAINTENANCE", "DECOMMISSIONED"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedAsset.id, st)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                        selectedAsset.status === st
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
