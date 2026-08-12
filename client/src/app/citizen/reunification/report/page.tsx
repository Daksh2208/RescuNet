"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  MapPin,
  Send,
  Users,
  PawPrint,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  createReunificationPost,
  type ReunificationType,
} from "@/lib/reunification";

import { uploadImage } from "@/lib/upload";

export default function ReportMissingPage() {

  const router = useRouter();

  const [type, setType] =
    useState<ReunificationType>("HUMAN");

  const [form, setForm] = useState({
    name: "",
    description: "",
    age: "",
    lastSeen: "",
    latitude: 0,
    longitude: 0,
  });

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);


  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (!e.target.files?.length) return;

    setImageFile(e.target.files[0]);

  };


  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      let imageUrl = "";

      // Upload image only if selected
      if (imageFile) {

        setUploading(true);

        imageUrl =
          await uploadImage(imageFile);

        setUploading(false);

      }


      await createReunificationPost({

        type,

        name: form.name,

        description:
          form.description || undefined,

        age:
          form.age || undefined,

        lastSeen: form.lastSeen,

        latitude:
          form.latitude || undefined,

        longitude:
          form.longitude || undefined,

        imageUrl:
          imageUrl || undefined,

      });


      alert(
        "Missing report submitted successfully."
      );

      router.push(
        "/citizen/reunification"
      );


    } catch (error) {

      console.error(error);

      alert(
        "Failed to submit missing report."
      );

    } finally {

      setLoading(false);
      setUploading(false);

    }

  };


  return (

    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-2xl font-bold text-slate-900">

            Report Missing

          </h1>

          <p className="text-slate-500 text-sm mt-1">

            Report a missing person or lost pet
            to help with reunification.

          </p>

        </div>


        <Link
          href="/citizen/reunification"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700"
        >

          <ArrowLeft className="h-4 w-4" />

          Back

        </Link>

      </div>


      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6"
      >

        {/* Type */}

        <div>

          <label className="block text-sm font-bold text-slate-900 mb-3">

            What are you reporting?

          </label>


          <div className="grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={() =>
                setType("HUMAN")
              }
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                type === "HUMAN"
                  ? "border-purple-600 bg-purple-50 text-purple-700"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >

              <Users className="h-7 w-7" />

              <span className="font-semibold">

                Missing Person

              </span>

            </button>


            <button
              type="button"
              onClick={() =>
                setType("PET")
              }
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                type === "PET"
                  ? "border-orange-600 bg-orange-50 text-orange-700"
                  : "border-slate-200 text-slate-500 hover:bg-slate-50"
              }`}
            >

              <PawPrint className="h-7 w-7" />

              <span className="font-semibold">

                Lost Pet

              </span>

            </button>

          </div>

        </div>


        {/* Name */}

        <div>

          <label
            htmlFor="name"
            className="block text-sm font-bold text-slate-900 mb-2"
          >

            Name

          </label>

          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) =>
              setForm(prev => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder={
              type === "HUMAN"
                ? "Person's full name"
                : "Pet's name"
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

        </div>


        {/* Age */}

        <div>

          <label
            htmlFor="age"
            className="block text-sm font-bold text-slate-900 mb-2"
          >

            Age / Description

          </label>

          <input
            id="age"
            type="text"
            value={form.age}
            onChange={(e) =>
              setForm(prev => ({
                ...prev,
                age: e.target.value,
              }))
            }
            placeholder={
              type === "HUMAN"
                ? "e.g. 8 years"
                : "e.g. Adult Golden Retriever"
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

        </div>


        {/* Details */}

        <div>

          <label
            htmlFor="description"
            className="block text-sm font-bold text-slate-900 mb-2"
          >

            Physical Description / Details

          </label>

          <textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm(prev => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder={
              type === "HUMAN"
                ? "Clothing, appearance, identifying marks, etc."
                : "Color, breed, collar, identifying marks, etc."
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

        </div>


        {/* Last Seen */}

        <div>

          <label
            htmlFor="lastSeen"
            className="block text-sm font-bold text-slate-900 mb-2"
          >

            Last Known Location

          </label>

          <div className="relative">

            <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

            <input
              id="lastSeen"
              type="text"
              required
              value={form.lastSeen}
              onChange={(e) =>
                setForm(prev => ({
                  ...prev,
                  lastSeen: e.target.value,
                }))
              }
              placeholder="Where were they last seen?"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

          </div>

        </div>


        {/* Image */}

        <div>

          <label className="block text-sm font-bold text-slate-900 mb-2">

            Photo (Optional)

          </label>


          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6">

            <div className="flex items-center gap-3">

              <Camera className="h-7 w-7 text-slate-400" />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />

            </div>


            {imageFile && (

              <p className="text-green-600 text-sm mt-3">

                ✅ {imageFile.name}

              </p>

            )}

          </div>

        </div>


        {/* Submit */}

        <div className="pt-4 border-t border-slate-100">

          <button
            type="submit"
            disabled={loading || uploading}
            className={`w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm ${
              type === "HUMAN"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-orange-600 hover:bg-orange-700"
            } disabled:opacity-50`}
          >

            <Send className="h-5 w-5" />

            {uploading
              ? "Uploading Photo..."
              : loading
                ? "Submitting..."
                : "Submit Missing Report"}

          </button>

        </div>

      </form>

    </div>

  );

}