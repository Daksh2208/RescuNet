
"use client";

import { BrainCircuit, Database, Map, PieChart, Lock, Globe } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "AI-Assisted Prioritization",
      description: "Automatic severity classification and smart emergency summary generation to filter duplicate incidents instantly.",
      icon: <BrainCircuit className="h-6 w-6 text-teal-400" />,
      colSpan: "md:col-span-2",
    },
    {
      title: "Resource Management",
      description: "Live monitoring of human & animal shelter capacity, food, water, and veterinary supplies across the network.",
      icon: <Database className="h-6 w-6 text-indigo-400" />,
      colSpan: "md:col-span-1",
    },
    {
      title: "Google Maps Integration",
      description: "Interactive incident locations, shelter mapping, and optimized route navigation for rescue teams.",
      icon: <Map className="h-6 w-6 text-green-400" />,
      colSpan: "md:col-span-1",
    },
    {
      title: "Reports & Analytics",
      description: "Disaster category analysis, response time metrics, and resource utilization dashboards.",
      icon: <PieChart className="h-6 w-6 text-pink-400" />,
      colSpan: "md:col-span-2",
    },
    {
      title: "Enterprise Security",
      description: "Role-Based Access Control, JWT Authentication, and top-tier password encryption.",
      icon: <Lock className="h-6 w-6 text-yellow-400" />,
      colSpan: "md:col-span-2",
    },
    {
      title: "Multi-Disaster Support",
      description: "Tailored protocols for Floods, Earthquakes, Cyclones, Landslides, and Fires.",
      icon: <Globe className="h-6 w-6 text-cyan-400" />,
      colSpan: "md:col-span-1",
    },
  ];

  return (
    <section id="ai" className="py-24 bg-white relative">
      <div className="absolute inset-0 bg-grid-slate/[0.5] bg-[size:30px_30px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16">
          <div className="inline-block px-4 py-2 rounded-full border border-teal-200 bg-teal-50 mb-4">
            <span className="text-sm font-semibold text-teal-700">Powered by AI & Real-Time Data</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            Intelligent Features <br />
            for <span className="text-slate-600">Critical Response</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white border border-slate-100 shadow-sm rounded-3xl p-8 hover:shadow-md transition-shadow group ${feature.colSpan}`}
            >
              <div className="mb-6 p-3 bg-slate-50 border border-slate-100 rounded-xl inline-block group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
