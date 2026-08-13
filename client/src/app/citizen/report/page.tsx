"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, MapPin, Camera, Send, PawPrint, Users } from "lucide-react";
import Link from "next/link";
import { reportIncident } from "@/lib/incident";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/lib/upload";
import { geocodeAddress } from "@/lib/geocode";

export default function ReportEmergencyPage() {
  const [target, setTarget] = useState<"human" | "animal" | "both">("human");

  const [form, setForm] = useState({
    title: "",
    description: "",
    disasterType: "",
    severity: "MEDIUM",
    latitude: 0,
    longitude: 0,
    address: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (!e.target.files?.length) return;

    setImageFile(e.target.files[0]);

  };


//   const handleSubmit = async (
//   e: React.FormEvent
// ) => {

//   e.preventDefault();

//   try {

//     setLoading(true);

//     let imageUrl = "";

//     if (imageFile) {

//       imageUrl = await uploadImage(imageFile);

//     }

//     await reportIncident({

//       ...form,

//       imageUrl,

//     });

//     setForm({

//       title: "",
//       description: "",
//       disasterType: "",
//       severity: "MEDIUM",
//       latitude: 0,
//       longitude: 0,
//       address: "",

//     });

//     setImageFile(null);

//     router.push("/citizen/reports");

//   }
//   catch (err) {

//     console.error(err);

//     alert("Failed to report incident");

//   }
//   finally {

//     setLoading(false);

//   }

// };


const handleSubmit = async (
  e: React.FormEvent
) => {

  e.preventDefault();

  try {

    setLoading(true);

    // 1. Validate address
    if (!form.address.trim()) {
      alert("Please enter the incident location");
      return;
    }

    // 2. Convert address into latitude & longitude
    const location = await geocodeAddress(
      form.address
    );

    console.log("Geocoded location:", location);

    // 3. Upload image if selected
    let imageUrl = "";

    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }

    // 4. Create incident with real coordinates
    const incidentData = {
      ...form,
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.formattedAddress,
      imageUrl,
    };

    console.log(
      "Sending incident:",
      incidentData
    );

    // 5. Send to existing incident API
    await reportIncident(incidentData);

    alert("Incident reported successfully!");

    // 6. Reset form
    setForm({
      title: "",
      description: "",
      disasterType: "",
      severity: "MEDIUM",
      latitude: 0,
      longitude: 0,
      address: "",
    });

    setImageFile(null);

    // 7. Go to reports
    router.push("/citizen/reports");

  } catch (err) {

    console.error(err);

    alert(
      "Could not find this location. Please enter a more specific address."
    );

  } finally {

    setLoading(false);

  }

};

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Report Emergency</h1>
          <p className="text-slate-500 text-sm mt-1">Submit an immediate SOS for rescue teams</p>
        </div>
        <Link
          href="/citizen"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
        <AlertTriangle className="h-6 w-6 text-red-600 shrink-0" />
        <div className="text-sm text-red-800">
          <strong>Warning:</strong> False reporting during a disaster is a punishable offense. Only use this form if human or animal lives are in immediate danger.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">

        {/* Target Selection */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">Who needs rescue?</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTarget("human")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${target === "human"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
            >
              <Users className="h-6 w-6" />
              <span className="text-sm font-medium">Human</span>
            </button>
            <button
              type="button"
              onClick={() => setTarget("animal")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${target === "animal"
                ? "border-orange-600 bg-orange-50 text-orange-700"
                : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
            >
              <PawPrint className="h-6 w-6" />
              <span className="text-sm font-medium">Animal</span>
            </button>
            <button
              type="button"
              onClick={() => setTarget("both")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${target === "both"
                ? "border-purple-600 bg-purple-50 text-purple-700"
                : "border-slate-200 hover:border-slate-300 text-slate-600"
                }`}
            >
              <div className="flex gap-1">
                <Users className="h-6 w-6" />
                <PawPrint className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Both</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Incident Title
          </label>

          <input
            type="text"
            value={form.title}
            onChange={(e) =>
              setForm(prev => ({
                ...prev,
                title: e.target.value,
              }))
            }
            placeholder="Short title"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
          />
        </div>

        {/* Disaster Type */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Disaster Type</label>
          <select
            value={form.disasterType}
            onChange={(e) =>
              setForm(prev => ({
                ...prev,
                disasterType: e.target.value,
              }))
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-slate-50"
          >
            <option value="">Select Disaster Type...</option>
            <option value="FLOOD">Flood / Water Logging</option>
            <option value="EARTHQUAKE">Earthquake / Structural Collapse</option>
            <option value="FIRE">Fire / Smoke</option>
            <option value="LANDSLIDE">Landslide / Mudslide</option>
            <option value="CYCLONE">Cyclone / Severe Storm</option>
            <option value="OTHER">Other Medical Emergency</option>
          </select>


        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Exact Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Searching for GPS signal..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-slate-50"
              value={form.address}
              // onChange={(e) =>
              //   setForm({
              //     ...form,
              //     address: e.target.value,
              //   })
              // }
              onChange={(e) =>
                setForm(prev => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
            />
            <button type="button" className="absolute inset-y-0 right-2 flex items-center px-3 text-sm font-medium text-blue-600 hover:text-blue-700">
              Use GPS
            </button>
          </div>
        </div>

        {/* Additional Details */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Situation Description</label>
          <textarea
            rows={4}
            placeholder="Describe the number of people/animals, injuries, and specific hazards..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-slate-50 resize-none"
            value={form.description}
            onChange={(e) =>
              setForm(prev => ({
                ...prev,
                description: e.target.value,
              }))
            }
          ></textarea>
        </div>

        {/* Photo Upload */}
        {/* <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Upload Photo (Optional)</label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8">

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {form.imageUrl && (

              <p className="text-green-600 mt-2">
                ✅ Image Uploaded
              </p>

            )}

          </div>
        </div> */}

        {/* Photo Upload */}

        <div>

          <label className="block text-sm font-bold text-slate-900 mb-2">
            Upload Photo (Optional)
          </label>

          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8">

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />

            {imageFile && (

              <p className="text-green-600 mt-2">
                ✅ {imageFile.name}
              </p>

            )}

          </div>

        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Send className="h-5 w-5" />
            {loading ? "Sending..." : "Send SOS Request"}
          </button>
        </div>
      </form >
    </div >
  );
}
