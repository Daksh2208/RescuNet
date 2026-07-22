"use client";

import { useState } from "react";
import { PackageOpen, Wrench, Send, AlertCircle, MapPin } from "lucide-react";
import Link from "next/link";

export default function NewCommunityPostPage() {
  const [postType, setPostType] = useState<"offer" | "request">("offer");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">New Community Post</h1>
          <p className="text-slate-500 text-sm mt-1">Offer resources or request aid from neighbors</p>
        </div>
        <Link 
          href="/citizen/community"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200"
        >
          Cancel
        </Link>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex gap-3 shadow-sm">
        <AlertCircle className="h-6 w-6 text-orange-600 shrink-0" />
        <div className="text-sm text-orange-800 leading-relaxed">
          <strong>Community Guidelines:</strong> Only request what you absolutely need to survive (e.g., water, basic first aid, tools for extraction). Do not use this board for non-emergencies.
        </div>
      </div>

      <form className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        
        {/* Post Type */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-3">What do you want to do?</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPostType("offer")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                postType === "offer" 
                  ? "border-orange-600 bg-orange-50 text-orange-700 shadow-sm" 
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <Wrench className="h-6 w-6" />
              <span className="text-sm font-bold">Offer Resources</span>
            </button>
            <button
              type="button"
              onClick={() => setPostType("request")}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                postType === "request" 
                  ? "border-red-600 bg-red-50 text-red-700 shadow-sm" 
                  : "border-slate-200 hover:border-slate-300 text-slate-600"
              }`}
            >
              <PackageOpen className="h-6 w-6" />
              <span className="text-sm font-bold">Request Aid</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Title</label>
          <input 
            type="text" 
            placeholder={postType === "offer" ? "e.g., I have 3 cases of bottled water" : "e.g., Need first aid kit"}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Description</label>
          <textarea 
            rows={4}
            placeholder="Provide details about exactly what you have or what you need..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50 resize-none"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">Your Location</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Address or nearby landmark for meetup" 
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">Only share a public meetup spot if your home is unsafe.</p>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100">
          <button 
            type="button"
            className={`w-full text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm ${
              postType === "offer" ? "bg-orange-600 hover:bg-orange-700" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            <Send className="h-5 w-5" />
            {postType === "offer" ? "Post Offer to Community" : "Post Request for Aid"}
          </button>
        </div>
      </form>
    </div>
  );
}
