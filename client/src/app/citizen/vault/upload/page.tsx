"use client";

import { useState } from "react";
import { Upload, Lock, FileText, HeartPulse, HardDrive, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function VaultUploadPage() {
  const [docCategory, setDocCategory] = useState<"personal" | "medical" | "">("");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Upload className="h-6 w-6 text-slate-800" /> Upload to Vault
          </h1>
          <p className="text-slate-500 text-sm mt-1">Secure a new document into your local encrypted cache</p>
        </div>
        <Link 
          href="/citizen/vault"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex gap-3 shadow-sm text-white">
        <Lock className="h-6 w-6 text-green-400 shrink-0" />
        <div className="text-sm text-slate-300 leading-relaxed">
          <strong>Local Encryption Active:</strong> Files uploaded here are encrypted using your device password and stored locally. They are accessible entirely offline and cannot be viewed by ResQNet administrators.
        </div>
      </div>

      <form className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        
        {/* Document Category */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">Document Category</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setDocCategory("personal")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                docCategory === "personal" 
                  ? "border-slate-800 bg-slate-50 text-slate-900 shadow-sm" 
                  : "border-slate-200 hover:border-slate-300 text-slate-500"
              }`}
            >
              <FileText className="h-6 w-6" />
              <span className="text-sm font-bold">Personal & ID</span>
            </button>
            <button
              type="button"
              onClick={() => setDocCategory("medical")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                docCategory === "medical" 
                  ? "border-slate-800 bg-slate-50 text-slate-900 shadow-sm" 
                  : "border-slate-200 hover:border-slate-300 text-slate-500"
              }`}
            >
              <HeartPulse className="h-6 w-6" />
              <span className="text-sm font-bold">Medical & Pet</span>
            </button>
          </div>
        </div>

        {/* Document Name */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Document Name</label>
          <input 
            type="text" 
            placeholder="e.g., Driver's License, Asthma Prescription"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-800 bg-slate-50"
          />
        </div>

        {/* Document Sub-type */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Specific Type</label>
          <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-800 bg-slate-50 appearance-none text-slate-700">
            <option value="">Select a specific type...</option>
            {docCategory === "personal" && (
              <>
                <option value="id">Government ID / Passport</option>
                <option value="insurance">Insurance Policy</option>
                <option value="deed">Property Deed / Title</option>
                <option value="other_personal">Other Personal Document</option>
              </>
            )}
            {docCategory === "medical" && (
              <>
                <option value="prescription">Prescription</option>
                <option value="vaccination">Vaccination Record</option>
                <option value="pet_record">Pet Microchip / Rabies Tag</option>
                <option value="other_medical">Other Medical Document</option>
              </>
            )}
            {docCategory === "" && (
              <option value="none" disabled>Please select a category first</option>
            )}
          </select>
        </div>

        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Upload File</label>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
            <HardDrive className="h-8 w-8 text-slate-400 mb-3" />
            <p className="text-sm font-bold text-slate-700">Click to browse or drag and drop</p>
            <p className="text-xs text-slate-500 mt-1">Supports PDF, JPG, PNG (Max 10MB per file)</p>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
          <button 
            type="button"
            className={`w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm ${
              docCategory !== "" ? "bg-slate-800 hover:bg-slate-900" : "bg-slate-300 cursor-not-allowed"
            }`}
            disabled={docCategory === ""}
          >
            <Lock className="h-5 w-5" />
            Encrypt and Save to Vault
          </button>
          <p className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
            <AlertCircle className="h-3 w-3" /> Note: This action happens entirely offline.
          </p>
        </div>
      </form>
    </div>
  );
}
