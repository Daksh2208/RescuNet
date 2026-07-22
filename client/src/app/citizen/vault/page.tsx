"use client";

import { useState } from "react";
import { Lock, FileText, Upload, ShieldCheck, HeartPulse, FilePlus, Download, Trash2, Smartphone, Eye } from "lucide-react";
import Link from "next/link";

export default function OfflineVaultPage() {
  const [activeTab, setActiveTab] = useState<"personal" | "medical">("personal");

  const personalDocs = [
    { id: "1", name: "Driver's License - John Doe", type: "ID", size: "2.4 MB", date: "Oct 12, 2025" },
    { id: "2", name: "Homeowners Insurance Policy", type: "Insurance", size: "8.1 MB", date: "Nov 03, 2025" },
    { id: "3", name: "Passport - Jane Doe", type: "ID", size: "3.2 MB", date: "Jan 15, 2026" },
  ];

  const medicalDocs = [
    { id: "4", name: "Max (Dog) Rabies Vaccination", type: "Pet Record", size: "1.1 MB", date: "May 20, 2026" },
    { id: "5", name: "Asthma Prescription - Jane", type: "Medical", size: "0.5 MB", date: "Jul 01, 2026" },
  ];

  const currentDocs = activeTab === "personal" ? personalDocs : medicalDocs;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Lock className="h-6 w-6 text-slate-800" /> Offline Document Vault
          </h1>
          <p className="text-slate-500 text-sm mt-1">Secure, local storage for critical IDs and medical records</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/citizen"
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center"
          >
            Back
          </Link>
          <Link 
            href="/citizen/vault/upload"
            className="px-4 py-2 text-sm font-bold text-white bg-slate-800 rounded-xl hover:bg-slate-900 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Upload className="h-4 w-4" /> Upload Document
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Vault Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                activeTab === "personal" 
                  ? "bg-slate-50 text-slate-800 border-b-2 border-slate-800" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <FileText className="h-4 w-4" /> Personal & ID
            </button>
            <button
              onClick={() => setActiveTab("medical")}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                activeTab === "medical" 
                  ? "bg-slate-50 text-slate-800 border-b-2 border-slate-800" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              <HeartPulse className="h-4 w-4" /> Medical & Pets
            </button>
          </div>

          {/* Document List */}
          <div className="flex-1 p-6 bg-slate-50 overflow-y-auto">
            {currentDocs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                <FilePlus className="h-10 w-10 text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-700">No Documents Found</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">Upload your critical documents here so you can access them even if cell service drops.</p>
                <button className="mt-4 px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {currentDocs.map((doc) => (
                  <div key={doc.id} className="group bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        {doc.type === "Medical" || doc.type === "Pet Record" ? <HeartPulse className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-tight">{doc.name}</h3>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                          {doc.type} • {doc.size} • Uploaded {doc.date}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Document">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Download Locally">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm text-white">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-lg">
              <ShieldCheck className="h-5 w-5 text-green-400" /> AES-256 Encryption
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              All documents are encrypted and stored <strong>locally on this device</strong>. They are never uploaded to the cloud without your explicit consent.
            </p>
            <p className="text-xs text-slate-400 bg-slate-800 p-3 rounded-lg border border-slate-700">
              Even if you lose internet access, you can securely open your ID or insurance policies from this vault to show to relief workers.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Smartphone className="h-5 w-5 text-slate-500" /> Storage Capacity
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Used</span>
                <span className="font-bold text-slate-900">15.3 MB</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="h-2 rounded-full bg-slate-800 w-[15%]"></div>
              </div>
              <div className="flex justify-between text-xs text-slate-400 pt-1">
                <span>Total Local Cache</span>
                <span>100 MB Limit</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
