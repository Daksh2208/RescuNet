"use client";

import { useState } from "react";
import {
  HeartHandshake,
  MapPin,
  Send,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  createCommunityPost,
  CommunityPostType,
} from "@/lib/community";

export default function CommunityPostPage() {

  const router = useRouter();

  const [type, setType] =
    useState<CommunityPostType>("OFFER");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    if (
      !form.title ||
      !form.description ||
      !form.category ||
      !form.location
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {

      setLoading(true);

      await createCommunityPost({
        title: form.title,
        description: form.description,
        type,
        category: form.category,
        location: form.location,

        latitude: form.latitude
          ? Number(form.latitude)
          : undefined,

        longitude: form.longitude
          ? Number(form.longitude)
          : undefined,
      });

      alert(
        "Community post created successfully!"
      );

      router.push("/citizen/community");

    } catch (error) {

      console.error(error);

      alert(
        "Failed to create community post."
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">

            <HeartHandshake className="h-6 w-6 text-orange-500" />

            New Community Post

          </h1>

          <p className="text-slate-500 text-sm mt-1">
            Offer help or request assistance from your community.
          </p>

        </div>

        <Link
          href="/citizen/community"
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

      </div>


      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6"
      >

        {/* Post Type */}

        <div>

          <label className="block text-sm font-bold text-slate-900 mb-3">
            What do you want to do?
          </label>

          <div className="grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={() => setType("OFFER")}
              className={`py-4 rounded-xl border-2 font-bold transition-colors ${
                type === "OFFER"
                  ? "border-orange-500 bg-orange-50 text-orange-700"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              Offer Help
            </button>

            <button
              type="button"
              onClick={() => setType("REQUEST")}
              className={`py-4 rounded-xl border-2 font-bold transition-colors ${
                type === "REQUEST"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-slate-200 text-slate-600"
              }`}
            >
              Request Help
            </button>

          </div>

        </div>


        {/* Title */}

        <div>

          <label className="block text-sm font-bold text-slate-900 mb-2">
            Title
          </label>

          <input
            required
            type="text"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            placeholder={
              type === "OFFER"
                ? "Example: Extra Bottled Water Available"
                : "Example: Need First Aid Supplies"
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

        </div>


        {/* Category */}

        <div>

          <label className="block text-sm font-bold text-slate-900 mb-2">
            Category
          </label>

          <select
            required
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                category: e.target.value,
              }))
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >

            <option value="">
              Select Category
            </option>

            <option value="Supplies">
              Supplies
            </option>

            <option value="Water">
              Water
            </option>

            <option value="Food">
              Food
            </option>

            <option value="Medical">
              Medical
            </option>

            <option value="Tools">
              Tools
            </option>

            <option value="Transport">
              Transport
            </option>

            <option value="Shelter">
              Shelter
            </option>

            <option value="Other">
              Other
            </option>

          </select>

        </div>


        {/* Description */}

        <div>

          <label className="block text-sm font-bold text-slate-900 mb-2">
            Description
          </label>

          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Provide details about the help or resource..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

        </div>


        {/* Location */}

        <div>

          <label className="block text-sm font-bold text-slate-900 mb-2">
            Location
          </label>

          <div className="relative">

            <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

            <input
              required
              type="text"
              value={form.location}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              placeholder="Example: Downtown Shelter"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

          </div>

        </div>


        {/* Optional Coordinates */}

        <div className="grid grid-cols-2 gap-4">

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Latitude
            </label>

            <input
              type="number"
              step="any"
              value={form.latitude}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  latitude: e.target.value,
                }))
              }
              placeholder="Optional"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
            />

          </div>

          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Longitude
            </label>

            <input
              type="number"
              step="any"
              value={form.longitude}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  longitude: e.target.value,
                }))
              }
              placeholder="Optional"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
            />

          </div>

        </div>


        {/* Submit */}

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors ${
            type === "OFFER"
              ? "bg-orange-600 hover:bg-orange-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >

          <Send className="h-5 w-5" />

          {loading
            ? "Posting..."
            : type === "OFFER"
              ? "Post Offer"
              : "Post Request"}

        </button>

      </form>

    </div>
  );
}