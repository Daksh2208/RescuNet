"use client";

import { useState } from "react";
import { Users, PawPrint, Camera, Send, MapPin, AlertCircle, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

type MissingEntity = {
  id: string;
  type: "human" | "pet";
};

export default function ReportMissingPage() {
  const [entities, setEntities] = useState<MissingEntity[]>([
    { id: "1", type: "human" }
  ]);

  const addEntity = (type: "human" | "pet") => {
    setEntities([...entities, { id: Math.random().toString(36).substr(2, 9), type }]);
  };

  const removeEntity = (id: string) => {
    if (entities.length > 1) {
      setEntities(entities.filter(e => e.id !== id));
    }
  };

  const updateEntityType = (id: string, newType: "human" | "pet") => {
    setEntities(entities.map(e => e.id === id ? { ...e, type: newType } : e));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Report Missing</h1>
          <p className="text-slate-500 text-sm mt-1">Post to the community reunification board</p>
        </div>
        <Link 
          href="/citizen/reunification"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex gap-3 shadow-sm">
        <AlertCircle className="h-6 w-6 text-purple-600 shrink-0" />
        <div className="text-sm text-purple-800">
          <strong>Bulk Reporting:</strong> During a disaster, entire families or multiple pets may go missing together. You can add multiple people and pets to a single report below.
        </div>
      </div>

      <form className="space-y-6">

        {/* Dynamic Entities List */}
        <div className="space-y-4">
          {entities.map((entity, index) => (
            <div key={entity.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative">
              
              {entities.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeEntity(entity.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                  title="Remove"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}

              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="bg-slate-100 text-slate-500 h-6 w-6 rounded-full flex items-center justify-center text-xs">
                  {index + 1}
                </span>
                Missing Record
              </h3>

              <div className="space-y-6">
                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => updateEntityType(entity.id, "human")}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      entity.type === "human" 
                        ? "border-purple-600 bg-purple-50 text-purple-700 shadow-sm" 
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <Users className="h-5 w-5" />
                    <span className="text-sm font-bold">Missing Person</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateEntityType(entity.id, "pet")}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      entity.type === "pet" 
                        ? "border-orange-600 bg-orange-50 text-orange-700 shadow-sm" 
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <PawPrint className="h-5 w-5" />
                    <span className="text-sm font-bold">Missing Pet</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      placeholder={entity.type === "human" ? "Full Name" : "Pet's Name"}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {entity.type === "human" ? "Age" : "Species / Breed"}
                    </label>
                    <input 
                      type="text" 
                      placeholder={entity.type === "human" ? "e.g., 34" : "e.g., Golden Retriever"}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Identifying Features</label>
                    <input 
                      type="text" 
                      placeholder={entity.type === "human" ? "e.g., Red Jacket, Glasses" : "e.g., Blue collar, chipped"}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 text-sm"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Last Known Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Specific address, shelter, or intersection where they were last seen..." 
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50 text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Photo Upload Inline */}
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
                  <Camera className="h-6 w-6 text-slate-400 mb-2" />
                  <p className="text-sm font-medium text-slate-700">Upload Photo</p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Add Another Actions */}
        <div className="flex gap-4 pt-2">
          <button 
            type="button"
            onClick={() => addEntity("human")}
            className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border-dashed"
          >
            <Plus className="h-4 w-4" /> Add Another Person
          </button>
          <button 
            type="button"
            onClick={() => addEntity("pet")}
            className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border-dashed"
          >
            <Plus className="h-4 w-4" /> Add Missing Pet
          </button>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-slate-200">
          <button 
            type="button"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm text-lg"
          >
            <Send className="h-5 w-5" />
            Post {entities.length} Record{entities.length > 1 ? 's' : ''} to Board
          </button>
        </div>
      </form>
    </div>
  );
}
