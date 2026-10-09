
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Camera,
  MapPin,
  Send,
  X,
} from "lucide-react";
import { reportPublicIncident } from "@/lib/incident";
import { uploadPublicImage } from "@/lib/upload";

type Target = "human" | "animal" | "both";

type EmergencyForm = {
  title: string;
  description: string;
  disasterType: string;
  severity: string;
  latitude: number;
  longitude: number;
  address: string;
};

const initialForm: EmergencyForm = {
  title: "",
  description: "",
  disasterType: "",
  severity: "MEDIUM",
  latitude: 0,
  longitude: 0,
  address: "",
};

export default function ReportEmergencyPage() {
  const [target, setTarget] = useState<Target>("human");
  const [form, setForm] = useState<EmergencyForm>(initialForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [reportId, setReportId] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (
    field: keyof EmergencyForm,
    value: string | number
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handlePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("The photo must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setError("");
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(String(reader.result ?? ""));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setImageFile(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setGettingLocation(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((previous) => ({
          ...previous,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));

        setGettingLocation(false);
      },
      () => {
        setError(
          "Could not get your location. Allow location access or enter the address manually."
        );
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
      }
    );
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");
    setReportId("");

    if (!form.title.trim() || !form.description.trim()) {
      setError("Enter an emergency title and description.");
      return;
    }

    if (!form.disasterType) {
      setError("Select an emergency category.");
      return;
    }

    if (!form.address.trim()) {
      setError("Enter the emergency location or address.");
      return;
    }

    if (
      !Number.isFinite(form.latitude) ||
      !Number.isFinite(form.longitude) ||
      form.latitude < -90 ||
      form.latitude > 90 ||
      form.longitude < -180 ||
      form.longitude > 180
    ) {
      setError("The location coordinates are invalid.");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = "";

      // Upload the optional photo first, without requiring login.
      if (imageFile) {
        imageUrl = await uploadPublicImage(imageFile);
      }

      const response = await reportPublicIncident({
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        address: form.address.trim(),
        imageUrl,
        target: target.toUpperCase(),
      });

      const data = response.data?.data ?? response.data;
      const newReportId = data?.id ?? data?.reportId;

      if (!newReportId) {
        throw new Error("The server did not return a report ID.");
      }

      setReportId(String(newReportId));
      setForm(initialForm);
      setTarget("human");
      removePhoto();
    } catch (err: any) {
      console.error("Failed to submit public emergency report:", err);

      setError(
        err?.response?.data?.message ??
          err?.message ??
          "Failed to submit the emergency report. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="text-sm font-medium text-blue-700 hover:underline"
        >
          ← Back to home
        </Link>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <AlertTriangle size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Report an Emergency
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Submit an emergency report without creating an account.
                You can also attach a photo.
              </p>
            </div>
          </div>

          {reportId && (
            <div
              role="status"
              className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4"
            >
              <h2 className="font-semibold text-green-800">
                Emergency report submitted successfully
              </h2>
              <p className="mt-1 text-sm text-green-800">
                Save this report ID for your reference:
              </p>
              <p className="mt-2 break-all font-mono font-bold text-green-900">
                {reportId}
              </p>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <section>
              <label className="mb-2 block font-semibold text-slate-800">
                Who needs help?
              </label>

              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    ["human", "People"],
                    ["animal", "Animals"],
                    ["both", "Both"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTarget(value)}
                    aria-pressed={target === value}
                    className={`rounded-lg border px-3 py-3 text-sm font-medium ${
                      target === value
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <label
                htmlFor="title"
                className="mb-2 block font-semibold text-slate-800"
              >
                Emergency title
              </label>
              <input
                id="title"
                required
                maxLength={150}
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Flooding near residential area"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </section>

            <section>
              <label
                htmlFor="disasterType"
                className="mb-2 block font-semibold text-slate-800"
              >
                Emergency category
              </label>
              <select
                id="disasterType"
                required
                value={form.disasterType}
                onChange={(e) =>
                  updateField("disasterType", e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="">Select a category</option>
                <option value="FLOOD">Flood</option>
                <option value="FIRE">Fire</option>
                <option value="EARTHQUAKE">Earthquake</option>
                <option value="CYCLONE">Cyclone / Storm</option>
                <option value="LANDSLIDE">Landslide</option>
                <option value="ACCIDENT">Accident</option>
                <option value="MEDICAL">Medical Emergency</option>
                <option value="OTHER">Other</option>
              </select>
              <p className="mt-1 text-xs text-slate-500">
                The selected value must match a category accepted by your
                backend validation.
              </p>
            </section>

            <section>
              <label
                htmlFor="severity"
                className="mb-2 block font-semibold text-slate-800"
              >
                Severity
              </label>
              <select
                id="severity"
                value={form.severity}
                onChange={(e) => updateField("severity", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </section>

            <section>
              <label
                htmlFor="address"
                className="mb-2 block font-semibold text-slate-800"
              >
                Emergency address / location
              </label>

              <textarea
                id="address"
                required
                rows={2}
                maxLength={500}
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Enter the location where help is needed"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />

              <button
                type="button"
                onClick={useCurrentLocation}
                disabled={gettingLocation}
                className="mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                <MapPin size={16} />
                {gettingLocation
                  ? "Getting location..."
                  : "Use my current GPS location"}
              </button>

              {form.latitude !== 0 || form.longitude !== 0 ? (
                <p className="mt-2 text-xs text-slate-600">
                  GPS coordinates: {form.latitude.toFixed(6)},{" "}
                  {form.longitude.toFixed(6)}
                </p>
              ) : (
                <p className="mt-2 text-xs text-slate-500">
                  GPS coordinates have not been set. Entering an address
                  alone does not automatically determine its coordinates.
                </p>
              )}
            </section>

            <section>
              <label
                htmlFor="description"
                className="mb-2 block font-semibold text-slate-800"
              >
                Describe the emergency
              </label>
              <textarea
                id="description"
                required
                rows={4}
                maxLength={5000}
                value={form.description}
                onChange={(e) =>
                  updateField("description", e.target.value)
                }
                placeholder="Explain what happened, how many people or animals may need help, and any immediate risks."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </section>

            <section>
              <label className="mb-2 block font-semibold text-slate-800">
                Add a photo (optional)
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
                id="emergency-photo"
              />

              {!imagePreview ? (
                <label
                  htmlFor="emergency-photo"
                  className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-slate-300 px-4 py-8 text-center hover:border-blue-400 hover:bg-blue-50/40"
                >
                  <Camera size={28} className="mb-2 text-slate-500" />
                  <span className="font-medium text-slate-800">
                    Choose an emergency photo
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    JPG, PNG, or WebP · Maximum 5 MB
                  </span>
                </label>
              ) : (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Emergency photo preview"
                    className="max-h-72 max-w-full rounded-xl border border-slate-200 object-contain"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    aria-label="Remove photo"
                    className="absolute right-2 top-2 rounded-full bg-white p-2 text-slate-700 shadow hover:bg-red-50 hover:text-red-600"
                  >
                    <X size={18} />
                  </button>
                  <p className="mt-2 max-w-full break-all text-xs text-slate-500">
                    {imageFile?.name}
                  </p>
                </div>
              )}
            </section>

            <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              Please provide accurate information. Submitting a report does
              not guarantee immediate rescue. For life-threatening
              emergencies, contact local emergency services as well.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send size={18} />
              {loading ? "Submitting report..." : "Submit Emergency Report"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
