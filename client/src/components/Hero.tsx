

import Link from "next/link";
import { ArrowRight, Activity, MapPin, RadioReceiver } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-20">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-slate bg-[size:50px_50px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white shadow-sm mb-8 animate-fade-in-up">
          <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs sm:text-sm font-medium text-slate-600">
            Next-Gen Disaster Response Platform
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900">
          Coordinate Rescue with <br className="hidden md:block" />
          <span className="text-gradient-danger">Intelligent Precision</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10">
          ResQNet empowers citizens, rescue teams, and authorities with real-time tracking,
          AI-driven prioritization, and seamless communication for both human and animal emergencies.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold bg-red-600 hover:bg-red-700 text-white shadow-md transition-all flex items-center justify-center gap-2 group"
          >
            Report Emergency
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="#modules"
            className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 transition-all shadow-sm"
          >
            Explore Platform
          </Link>
        </div>

        {/* Floating Stats / Features Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
          <div className="bg-white p-6 rounded-2xl flex items-start gap-4 border border-slate-100 shadow-sm">
            <div className="p-3 bg-red-50 rounded-lg text-red-600">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Live Tracking</h3>
              <p className="text-sm text-slate-600">Real-time GPS status for incidents & teams.</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl flex items-start gap-4 border border-slate-100 shadow-sm">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
              <RadioReceiver className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">AI Prioritization</h3>
              <p className="text-sm text-slate-600">Smart severity classification & summaries.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl flex items-start gap-4 border border-slate-100 shadow-sm">
            <div className="p-3 bg-teal-50 rounded-lg text-teal-600">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Resource Routing</h3>
              <p className="text-sm text-slate-600">Find nearest shelters and supplies instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
