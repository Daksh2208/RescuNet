"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Settings,
  Plus,
  Home,
  Package,
  Pencil,
  Trash2,
  X,
  MapPin,
  RefreshCw,
  Search,
  Warehouse,
  Users,
  Droplets,
  HeartPulse,
  Utensils,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

type ActiveTab = "shelters" | "resources";

type Shelter = {
  id: string;
  name: string;
  type: "HUMAN" | "ANIMAL" | "VET";
  address: string;
  latitude: number;
  longitude: number;
  capacity: number;
  occupied: number;
  contactNumber: string;
  needs: string[];
  createdAt: string;
  updatedAt: string;
};

type Resource = {
  id: string;
  name: string;
  category: "FOOD" | "WATER" | "MEDICINE" | "EQUIPMENT";
  quantity: number;
  unit: string;
  locationName: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
};

type ShelterForm = {
  name: string;
  type: "HUMAN" | "ANIMAL" | "VET";
  address: string;
  capacity: string;
  occupied: string;
  contactNumber: string;
  needs: string;
  latitude: string;
  longitude: string;
};

type ResourceForm = {
  name: string;
  category: "FOOD" | "WATER" | "MEDICINE" | "EQUIPMENT";
  quantity: string;
  unit: string;
  locationName: string;
  latitude: string;
  longitude: string;
};

const emptyShelterForm: ShelterForm = {
  name: "",
  type: "HUMAN",
  address: "",
  capacity: "",
  occupied: "0",
  contactNumber: "",
  needs: "",
  latitude: "",
  longitude: "",
};

const emptyResourceForm: ResourceForm = {
  name: "",
  category: "WATER",
  quantity: "",
  unit: "",
  locationName: "",
  latitude: "",
  longitude: "",
};

export default function AdminResourcesPage() {
  const [activeTab, setActiveTab] =
    useState<ActiveTab>("shelters");

  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  const [loadingShelters, setLoadingShelters] = useState(false);
  const [loadingResources, setLoadingResources] = useState(false);

  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] =
    useState<"create" | "edit">("create");

  const [editingShelterId, setEditingShelterId] =
    useState<string | null>(null);

  const [editingResourceId, setEditingResourceId] =
    useState<string | null>(null);

  const [shelterForm, setShelterForm] =
    useState<ShelterForm>(emptyShelterForm);

  const [resourceForm, setResourceForm] =
    useState<ResourceForm>(emptyResourceForm);

  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  /* =========================
     FETCH DATA
  ========================= */

  const fetchShelters = async () => {
    try {
      setLoadingShelters(true);
      setError("");

      const response = await api.get(
        "/admin/resources/shelters"
      );

      setShelters(response.data.data || []);
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load shelters"
      );
    } finally {
      setLoadingShelters(false);
    }
  };

  const fetchResources = async () => {
    try {
      setLoadingResources(true);
      setError("");

      const response = await api.get(
        "/admin/resources"
      );

      setResources(response.data.data || []);
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load resources"
      );
    } finally {
      setLoadingResources(false);
    }
  };

  useEffect(() => {
    fetchShelters();
    fetchResources();
  }, []);

  /* =========================
     FILTERING
  ========================= */

  const filteredShelters = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return shelters;

    return shelters.filter((shelter) =>
      [
        shelter.name,
        shelter.address,
        shelter.type,
        shelter.contactNumber,
        ...shelter.needs,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [shelters, searchTerm]);

  const filteredResources = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return resources;

    return resources.filter((resource) =>
      [
        resource.name,
        resource.category,
        resource.unit,
        resource.locationName,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [resources, searchTerm]);

  /* =========================
     MODAL HELPERS
  ========================= */

  const openCreateModal = () => {
    setModalMode("create");
    setEditingShelterId(null);
    setEditingResourceId(null);

    setShelterForm(emptyShelterForm);
    setResourceForm(emptyResourceForm);

    setIsModalOpen(true);
  };

  const openEditShelter = (shelter: Shelter) => {
    setActiveTab("shelters");
    setModalMode("edit");

    setEditingShelterId(shelter.id);
    setEditingResourceId(null);

    setShelterForm({
      name: shelter.name,
      type: shelter.type,
      address: shelter.address,
      capacity: String(shelter.capacity),
      occupied: String(shelter.occupied),
      contactNumber: shelter.contactNumber,
      needs: shelter.needs.join(", "),
      latitude: String(shelter.latitude),
      longitude: String(shelter.longitude),
    });

    setIsModalOpen(true);
  };

  const openEditResource = (resource: Resource) => {
    setActiveTab("resources");
    setModalMode("edit");

    setEditingResourceId(resource.id);
    setEditingShelterId(null);

    setResourceForm({
      name: resource.name,
      category: resource.category,
      quantity: String(resource.quantity),
      unit: resource.unit,
      locationName: resource.locationName,
      latitude: String(resource.latitude),
      longitude: String(resource.longitude),
    });

    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setIsModalOpen(false);
    setEditingShelterId(null);
    setEditingResourceId(null);
  };

  /* =========================
     SAVE SHELTER
  ========================= */

  const handleSaveShelter = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const capacity = Number(
        shelterForm.capacity
      );

      const occupied = Number(
        shelterForm.occupied
      );

      const latitude = Number(
        shelterForm.latitude
      );

      const longitude = Number(
        shelterForm.longitude
      );

      if (
        !shelterForm.name.trim() ||
        !shelterForm.address.trim() ||
        !shelterForm.contactNumber.trim()
      ) {
        alert(
          "Please fill all required shelter fields."
        );
        return;
      }

      if (!Number.isFinite(capacity) || capacity < 0) {
        alert("Please enter a valid capacity.");
        return;
      }

      if (
        !Number.isFinite(occupied) ||
        occupied < 0 ||
        occupied > capacity
      ) {
        alert(
          "Occupied capacity must be between 0 and total capacity."
        );
        return;
      }

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        alert("Please enter valid coordinates.");
        return;
      }

      const payload = {
        name: shelterForm.name.trim(),
        type: shelterForm.type,
        address: shelterForm.address.trim(),
        latitude,
        longitude,
        capacity,
        occupied,
        contactNumber:
          shelterForm.contactNumber.trim(),
        needs: shelterForm.needs
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      if (modalMode === "create") {
        await api.post(
          "/admin/resources/shelters",
          payload
        );
      } else if (editingShelterId) {
        await api.patch(
          `/admin/resources/shelters/${editingShelterId}`,
          payload
        );
      }

      await fetchShelters();

      closeModal();
    } catch (err: any) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to save shelter"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     SAVE RESOURCE
  ========================= */

  const handleSaveResource = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const quantity = Number(
        resourceForm.quantity
      );

      const latitude = Number(
        resourceForm.latitude
      );

      const longitude = Number(
        resourceForm.longitude
      );

      if (
        !resourceForm.name.trim() ||
        !resourceForm.unit.trim() ||
        !resourceForm.locationName.trim()
      ) {
        alert(
          "Please fill all required resource fields."
        );
        return;
      }

      if (
        !Number.isFinite(quantity) ||
        quantity < 0
      ) {
        alert("Please enter a valid quantity.");
        return;
      }

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        alert("Please enter valid coordinates.");
        return;
      }

      const payload = {
        name: resourceForm.name.trim(),
        category: resourceForm.category,
        quantity,
        unit: resourceForm.unit.trim(),
        locationName:
          resourceForm.locationName.trim(),
        latitude,
        longitude,
      };

      if (modalMode === "create") {
        await api.post(
          "/admin/resources",
          payload
        );
      } else if (editingResourceId) {
        await api.patch(
          `/admin/resources/${editingResourceId}`,
          payload
        );
      }

      await fetchResources();

      closeModal();
    } catch (err: any) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to save resource"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     DELETE SHELTER
  ========================= */

  const handleDeleteShelter = async (
    shelter: Shelter
  ) => {
    const confirmed = window.confirm(
      `Delete "${shelter.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(
        `/admin/resources/shelters/${shelter.id}`
      );

      await fetchShelters();
    } catch (err: any) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to delete shelter"
      );
    }
  };

  /* =========================
     DELETE RESOURCE
  ========================= */

  const handleDeleteResource = async (
    resource: Resource
  ) => {
    const confirmed = window.confirm(
      `Delete "${resource.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");

      await api.delete(
        `/admin/resources/${resource.id}`
      );

      await fetchResources();
    } catch (err: any) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to delete resource"
      );
    }
  };

  /* =========================
     DISPLAY HELPERS
  ========================= */

  const getShelterTypeLabel = (
    type: Shelter["type"]
  ) => {
    switch (type) {
      case "HUMAN":
        return "Human";
      case "ANIMAL":
        return "Animal";
      case "VET":
        return "Veterinary";
      default:
        return type;
    }
  };

  const getResourceIcon = (
    category: Resource["category"]
  ) => {
    switch (category) {
      case "WATER":
        return Droplets;
      case "MEDICINE":
        return HeartPulse;
      case "FOOD":
        return Utensils;
      case "EQUIPMENT":
        return Wrench;
      default:
        return Package;
    }
  };

  const getResourceColor = (
    category: Resource["category"]
  ) => {
    switch (category) {
      case "WATER":
        return "bg-blue-100 text-blue-600";
      case "MEDICINE":
        return "bg-red-100 text-red-600";
      case "FOOD":
        return "bg-amber-100 text-amber-600";
      case "EQUIPMENT":
        return "bg-purple-100 text-purple-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const refreshCurrentTab = async () => {
    if (activeTab === "shelters") {
      await fetchShelters();
    } else {
      await fetchResources();
    }
  };

  const isLoading =
    activeTab === "shelters"
      ? loadingShelters
      : loadingResources;

  return (
    <div className="space-y-6">
      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <Plus className="h-5 w-5 text-purple-600" />

                {modalMode === "create"
                  ? `Add New ${
                      activeTab === "shelters"
                        ? "Shelter"
                        : "Resource"
                    }`
                  : `Edit ${
                      activeTab === "shelters"
                        ? "Shelter"
                        : "Resource"
                    }`}
              </h2>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* SHELTER FORM */}

            {activeTab === "shelters" && (
              <form
                onSubmit={handleSaveShelter}
                className="p-6 space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Shelter Name
                    </label>

                    <input
                      type="text"
                      value={shelterForm.name}
                      onChange={(e) =>
                        setShelterForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="e.g. Downtown Community Center"
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Shelter Type
                    </label>

                    <select
                      value={shelterForm.type}
                      onChange={(e) =>
                        setShelterForm((prev) => ({
                          ...prev,
                          type: e.target.value as ShelterForm["type"],
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    >
                      <option value="HUMAN">
                        Human
                      </option>
                      <option value="ANIMAL">
                        Animal
                      </option>
                      <option value="VET">
                        Veterinary
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Contact Number
                    </label>

                    <input
                      type="text"
                      value={
                        shelterForm.contactNumber
                      }
                      onChange={(e) =>
                        setShelterForm((prev) => ({
                          ...prev,
                          contactNumber:
                            e.target.value,
                        }))
                      }
                      placeholder="e.g. 9876543210"
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Address
                    </label>

                    <input
                      type="text"
                      value={shelterForm.address}
                      onChange={(e) =>
                        setShelterForm((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="Full shelter address"
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Maximum Capacity
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={shelterForm.capacity}
                      onChange={(e) =>
                        setShelterForm((prev) => ({
                          ...prev,
                          capacity: e.target.value,
                        }))
                      }
                      placeholder="500"
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Currently Occupied
                    </label>

                    <input
                      type="number"
                      min="0"
                      value={shelterForm.occupied}
                      onChange={(e) =>
                        setShelterForm((prev) => ({
                          ...prev,
                          occupied: e.target.value,
                        }))
                      }
                      placeholder="0"
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Latitude
                    </label>

                    <input
                      type="number"
                      step="any"
                      value={shelterForm.latitude}
                      onChange={(e) =>
                        setShelterForm((prev) => ({
                          ...prev,
                          latitude: e.target.value,
                        }))
                      }
                      placeholder="21.7051"
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Longitude
                    </label>

                    <input
                      type="number"
                      step="any"
                      value={shelterForm.longitude}
                      onChange={(e) =>
                        setShelterForm((prev) => ({
                          ...prev,
                          longitude: e.target.value,
                        }))
                      }
                      placeholder="72.9959"
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Current Needs
                    </label>

                    <input
                      type="text"
                      value={shelterForm.needs}
                      onChange={(e) =>
                        setShelterForm((prev) => ({
                          ...prev,
                          needs: e.target.value,
                        }))
                      }
                      placeholder="Water, Blankets, First Aid"
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />

                    <p className="text-xs text-slate-400 mt-1">
                      Separate multiple needs with commas.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {modalMode === "create"
                        ? "Create Shelter"
                        : "Save Shelter Changes"}
                    </>
                  )}
                </button>
              </form>
            )}

            {/* RESOURCE FORM */}

            {activeTab === "resources" && (
              <form
                onSubmit={handleSaveResource}
                className="p-6 space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Resource Name
                    </label>

                    <input
                      type="text"
                      value={resourceForm.name}
                      onChange={(e) =>
                        setResourceForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="e.g. Drinking Water"
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Category
                    </label>

                    <select
                      value={resourceForm.category}
                      onChange={(e) =>
                        setResourceForm((prev) => ({
                          ...prev,
                          category:
                            e.target.value as ResourceForm["category"],
                        }))
                      }
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    >
                      <option value="WATER">
                        Water
                      </option>
                      <option value="FOOD">
                        Food
                      </option>
                      <option value="MEDICINE">
                        Medicine
                      </option>
                      <option value="EQUIPMENT">
                        Equipment
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Quantity
                    </label>

                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={resourceForm.quantity}
                      onChange={(e) =>
                        setResourceForm((prev) => ({
                          ...prev,
                          quantity: e.target.value,
                        }))
                      }
                      placeholder="1200"
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Unit
                    </label>

                    <input
                      type="text"
                      value={resourceForm.unit}
                      onChange={(e) =>
                        setResourceForm((prev) => ({
                          ...prev,
                          unit: e.target.value,
                        }))
                      }
                      placeholder="liters, kg, boxes..."
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Storage Location
                    </label>

                    <input
                      type="text"
                      value={
                        resourceForm.locationName
                      }
                      onChange={(e) =>
                        setResourceForm((prev) => ({
                          ...prev,
                          locationName:
                            e.target.value,
                        }))
                      }
                      placeholder="Central Warehouse"
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Latitude
                    </label>

                    <input
                      type="number"
                      step="any"
                      value={resourceForm.latitude}
                      onChange={(e) =>
                        setResourceForm((prev) => ({
                          ...prev,
                          latitude: e.target.value,
                        }))
                      }
                      placeholder="21.7051"
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Longitude
                    </label>

                    <input
                      type="number"
                      step="any"
                      value={resourceForm.longitude}
                      onChange={(e) =>
                        setResourceForm((prev) => ({
                          ...prev,
                          longitude: e.target.value,
                        }))
                      }
                      placeholder="72.9959"
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {modalMode === "create"
                        ? "Add Resource"
                        : "Save Resource Changes"}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="h-6 w-6 text-purple-600" />
            Master Infrastructure Registry
          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Manage shelters and disaster-response resources
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/admin"
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0 flex items-center justify-center"
          >
            Back to Dashboard
          </Link>

          <button
            onClick={openCreateModal}
            className="bg-purple-600 text-white font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="h-4 w-4" />
            Add New{" "}
            {activeTab === "shelters"
              ? "Shelter"
              : "Resource"}
          </button>
        </div>
      </div>

      {/* =========================
          TABS
      ========================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => {
            setActiveTab("shelters");
            setSearchTerm("");
          }}
          className={`cursor-pointer rounded-2xl p-6 border transition-all ${
            activeTab === "shelters"
              ? "bg-white border-purple-300 shadow-md ring-2 ring-purple-500/20"
              : "bg-slate-50 border-slate-200 hover:bg-white"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                activeTab === "shelters"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              <Home className="h-6 w-6" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900 text-lg">
                Shelter Database
              </h2>

              <p className="text-sm text-slate-500">
                Manage capacity, occupancy and shelter needs
              </p>
            </div>
          </div>
        </div>

        <div
          onClick={() => {
            setActiveTab("resources");
            setSearchTerm("");
          }}
          className={`cursor-pointer rounded-2xl p-6 border transition-all ${
            activeTab === "resources"
              ? "bg-white border-purple-300 shadow-md ring-2 ring-purple-500/20"
              : "bg-slate-50 border-slate-200 hover:bg-white"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                activeTab === "resources"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              <Package className="h-6 w-6" />
            </div>

            <div>
              <h2 className="font-bold text-slate-900 text-lg">
                Resource Inventory
              </h2>

              <p className="text-sm text-slate-500">
                Manage food, water, medicine and equipment
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          TOOLBAR
      ========================= */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder={
                activeTab === "shelters"
                  ? "Search shelters..."
                  : "Search resources..."
              }
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <button
            onClick={refreshCurrentTab}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                isLoading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm font-medium">
          {error}
        </div>
      )}

      {/* =========================
          SHELTERS
      ========================= */}

      {activeTab === "shelters" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900">
                Active Shelters
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                {filteredShelters.length} shelter
                {filteredShelters.length !== 1
                  ? "s"
                  : ""}{" "}
                registered
              </p>
            </div>

            <div className="h-9 w-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <Warehouse className="h-4 w-4" />
            </div>
          </div>

          <div className="p-6">
            {loadingShelters ? (
              <div className="flex items-center justify-center py-16 text-slate-500">
                <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                Loading shelters...
              </div>
            ) : filteredShelters.length === 0 ? (
              <div className="text-center py-16">
                <Home className="h-10 w-10 text-slate-300 mx-auto mb-3" />

                <h3 className="font-bold text-slate-700">
                  No shelters found
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  Add a shelter or change your search.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredShelters.map(
                  (shelter) => {
                    const percentage =
                      shelter.capacity > 0
                        ? Math.min(
                            100,
                            Math.round(
                              (shelter.occupied /
                                shelter.capacity) *
                                100
                            )
                          )
                        : 0;

                    const remaining =
                      Math.max(
                        0,
                        shelter.capacity -
                          shelter.occupied
                      );

                    return (
                      <div
                        key={shelter.id}
                        className="p-5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="h-11 w-11 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                              <Home className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-bold text-slate-900">
                                  {shelter.name}
                                </h3>

                                <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-1 rounded-md uppercase tracking-wider">
                                  {getShelterTypeLabel(
                                    shelter.type
                                  )}
                                </span>
                              </div>

                              <p className="text-xs text-slate-500 mt-1">
                                {shelter.address}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-2">
                                {shelter.needs
                                  .length > 0 ? (
                                  shelter.needs.map(
                                    (need) => (
                                      <span
                                        key={need}
                                        className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase tracking-wider"
                                      >
                                        {need}
                                      </span>
                                    )
                                  )
                                ) : (
                                  <span className="text-xs text-slate-400">
                                    No specific needs listed
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="w-full lg:w-64">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold text-slate-600">
                                Occupancy
                              </span>

                              <span className="text-xs font-bold text-slate-700">
                                {shelter.occupied} /{" "}
                                {shelter.capacity}
                              </span>
                            </div>

                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  percentage >= 90
                                    ? "bg-red-500"
                                    : percentage >=
                                      70
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                }`}
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>

                            <p className="text-[11px] text-slate-400 mt-1">
                              {remaining} spaces
                              remaining
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() =>
                                openEditShelter(
                                  shelter
                                )
                              }
                              className="flex items-center justify-center gap-2 text-purple-600 font-bold text-sm bg-purple-50 hover:bg-purple-100 px-4 py-2.5 rounded-lg transition-colors"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteShelter(
                                  shelter
                                )
                              }
                              className="flex items-center justify-center gap-2 text-red-600 font-bold text-sm bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {shelter.occupied} occupants
                          </span>

                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {shelter.latitude.toFixed(
                              4
                            )},{" "}
                            {shelter.longitude.toFixed(
                              4
                            )}
                          </span>

                          <span>
                            Contact:{" "}
                            {shelter.contactNumber}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================
          RESOURCES
      ========================= */}

      {activeTab === "resources" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900">
                Resource Inventory
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                {filteredResources.length} resource
                {filteredResources.length !== 1
                  ? "s"
                  : ""}{" "}
                registered
              </p>
            </div>

            <div className="h-9 w-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
              <Package className="h-4 w-4" />
            </div>
          </div>

          <div className="p-6">
            {loadingResources ? (
              <div className="flex items-center justify-center py-16 text-slate-500">
                <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                Loading resources...
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-10 w-10 text-slate-300 mx-auto mb-3" />

                <h3 className="font-bold text-slate-700">
                  No resources found
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  Add a resource or change your search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filteredResources.map(
                  (resource) => {
                    const Icon =
                      getResourceIcon(
                        resource.category
                      );

                    return (
                      <div
                        key={resource.id}
                        className="p-5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${getResourceColor(
                              resource.category
                            )}`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-bold text-slate-900">
                                {resource.name}
                              </h3>

                              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md uppercase tracking-wider">
                                {resource.category}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {
                                resource.locationName
                              }
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <div className="bg-slate-50 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Available
                            </p>

                            <p className="text-xl font-bold text-slate-900 mt-1">
                              {resource.quantity}
                            </p>

                            <p className="text-xs text-slate-500">
                              {resource.unit}
                            </p>
                          </div>

                          <div className="bg-slate-50 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Location
                            </p>

                            <p className="text-sm font-bold text-slate-900 mt-1 truncate">
                              {
                                resource.locationName
                              }
                            </p>

                            <p className="text-[11px] text-slate-400 mt-1">
                              {resource.latitude.toFixed(
                                4
                              )}
                              ,{" "}
                              {resource.longitude.toFixed(
                                4
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <button
                            onClick={() =>
                              openEditResource(
                                resource
                              )
                            }
                            className="flex-1 flex items-center justify-center gap-2 text-purple-600 font-bold text-sm bg-purple-50 hover:bg-purple-100 px-4 py-2.5 rounded-lg transition-colors"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteResource(
                                resource
                              )
                            }
                            className="flex items-center justify-center gap-2 text-red-600 font-bold text-sm bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-lg transition-colors px-5"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}