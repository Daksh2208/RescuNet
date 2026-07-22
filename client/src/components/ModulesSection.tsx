
"use client";

import { Users, Truck, ShieldCheck, CheckCircle2, HeartHandshake } from "lucide-react";

export default function ModulesSection() {
  const modules = [
    {
      title: "Citizen Module",
      icon: <Users className="h-8 w-8 text-red-500" />,
      color: "from-red-500/20 to-transparent border-red-500/20",
      description: "Empowering individuals to report emergencies, track status, and find safety.",
      features: [
        "Report Human & Animal Emergencies",
        "Live GPS Location Sharing",
        "View Nearby Shelters",
        "Disaster Safety Guidelines",
      ],
    },
    {
      title: "Rescue Team Module",
      icon: <Truck className="h-8 w-8 text-blue-500" />,
      color: "from-blue-500/20 to-transparent border-blue-500/20",
      description: "Equipping responders with real-time navigation and task management tools.",
      features: [
        "Accept & Manage Rescue Tasks",
        "Human & Animal Rescue Protocols",
        "Update Rescue Status",
        "Communicate with Admin",
      ],
    },
    {
      title: "Volunteer Module",
      icon: <HeartHandshake className="h-8 w-8 text-green-500" />,
      color: "from-green-500/20 to-transparent border-green-500/20",
      description: "Connecting compassionate individuals with shelters, logistics, and on-ground relief efforts.",
      features: [
        "Claim Relief & Supply Tasks",
        "Shelter Assistance Tracking",
        "Animal Foster Coordination",
        "Logistics & Transport Updates",
      ],
    },
    {
      title: "Administrator Module",
      icon: <ShieldCheck className="h-8 w-8 text-purple-500" />,
      color: "from-purple-500/20 to-transparent border-purple-500/20",
      description: "Centralized control for verification, dispatch, and resource management.",
      features: [
        "Incident Verification",
        "Assign Rescue & Vet Teams",
        "Shelter & Resource Management",
        "Emergency Announcements",
      ],
    },
  ];

  return (
    <section id="modules" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-b from-blue-50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
            Comprehensive <span className="text-gradient">Modules</span>
          </h2>
          <p className="text-lg text-slate-600">
            A unified ecosystem tailored for every role involved in disaster response and recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modules.map((mod, index) => (
            <div
              key={index}
              className={`bg-white shadow-sm border border-slate-100 rounded-3xl p-8 border-t-4 hover:-translate-y-1 transition-transform duration-300 ${mod.color}`}
            >
              <div className="mb-6 p-4 bg-slate-50 rounded-2xl inline-block border border-slate-100">
                {mod.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{mod.title}</h3>
              <p className="text-slate-600 mb-8">{mod.description}</p>
              
              <ul className="space-y-4">
                {mod.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
