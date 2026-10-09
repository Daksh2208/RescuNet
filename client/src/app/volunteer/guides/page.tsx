"use client";

import { BookOpen, ShieldAlert, HeartPulse, HardHat, FileCheck2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function VolunteerGuidelinesPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const guidelines = [
    {
      id: 1,
      title: "Personal Safety First",
      desc: "Before assisting others, ensure your own safety. Never enter unstable structures, deep floodwaters, or active fire zones without explicit authorization and proper gear.",
      fullDetails: [
        "Your safety is paramount.",
        "Never wade into moving floodwaters above knee height.",
        "Do not enter any building marked with an 'X' by urban search and rescue teams.",
        "If you encounter downed power lines, maintain a minimum 30-foot perimeter and report immediately.",
        "Remember: Dead heroes cannot save lives."
      ],
      icon: ShieldAlert,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200"
    },
    {
      id: 2,
      title: "Medical Triage Protocol",
      desc: "Do not move severely injured individuals unless they are in immediate, life-threatening danger. Wait for certified EMS personnel. Apply basic first aid and control bleeding.",
      fullDetails: [
        "Follow the S.T.A.R.T. triage system if trained.",
        "Apply direct pressure to severe bleeding using clean dressings.",
        "Do not attempt to realign broken bones or remove impaled objects.",
        "For suspected spinal injuries, keep the victim's head and neck perfectly still.",
        "Call for professional transport and stay with the victim until help arrives."
      ],
      icon: HeartPulse,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200"
    },
    {
      id: 3,
      title: "Equipment & Gear Requirements",
      desc: "Always wear your high-visibility ResQNet vest, closed-toe steel boots, and heavy-duty gloves when operating in disaster zones. Keep your ID badge visible at all times.",
      fullDetails: [
        "Standard Issue Kit Requirements:",
        "High-visibility ResQNet vest and official ID badge",
        "N95/P100 respirator mask (required for fire/dust zones)",
        "Heavy leather work gloves and waterproof safety boots",
        "Headlamp with extra batteries and a fully charged power bank",
        "You will be denied entry to active hazard zones without this mandatory kit."
      ],
      icon: HardHat,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200"
    },
    {
      id: 4,
      title: "Chain of Command",
      desc: "Report directly to your assigned Zone Commander. Do not self-deploy to unassigned tasks unless you encounter an immediate civilian SOS that requires reporting.",
      fullDetails: [
        "All volunteers operate strictly under the Incident Command System (ICS).",
        "Upon arrival, you must check in with the Staging Area Manager.",
        "Never abandon your post or switch tasks without radioing your Zone Commander.",
        "Self-deploying causes logistics chaos and risks your life being unaccounted for.",
        "If you encounter an emergency while off-task, report it immediately via radio before engaging."
      ],
      icon: FileCheck2,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200"
    }
  ];

  const toggleExpand = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-green-600" />
            Protocols & Guidelines
          </h1>
          <p className="text-slate-500 text-sm mt-1">Standard operating procedures for ResQNet volunteers</p>
        </div>
        <Link 
          href="/volunteer"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Main Warning Banner */}
      <div className="bg-green-50 border-l-4 border-green-600 p-5 rounded-r-xl shadow-sm">
        <h3 className="text-sm font-bold text-green-800 uppercase tracking-wider mb-2">
          Core Directive
        </h3>
        <p className="text-sm text-green-700 leading-relaxed font-medium">
          As a ResQNet volunteer, you are an extension of the official emergency response team. Professionalism, calm under pressure, and adherence to safety protocols are mandatory. Failure to follow the chain of command can put both you and victims at risk.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {guidelines.map((guide) => {
          const isExpanded = expandedId === guide.id;
          return (
            <div key={guide.id} className={`bg-white rounded-2xl border ${guide.border} p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col`}>
              <div className={`absolute top-0 right-0 w-24 h-24 ${guide.bg} rounded-bl-full -mr-8 -mt-8 transition-transform z-0`} />
              
              <div className="relative z-10 flex items-start gap-4 mb-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border ${guide.border} bg-white shadow-sm ${guide.color}`}>
                  <guide.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 pt-2">{guide.title}</h3>
              </div>
              
              <p className="relative z-10 text-sm text-slate-600 leading-relaxed">
                {guide.desc}
              </p>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="relative z-10 mt-4 pt-4 border-t border-slate-100">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <ul className="space-y-2 text-sm text-slate-800 font-medium">
                      {guide.fullDetails.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className={`shrink-0 mt-1 ${guide.color}`}>•</span>
                          <span className="leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <div className="relative z-10 mt-auto pt-6">
                <button 
                  onClick={() => toggleExpand(guide.id)}
                  className={`text-sm font-bold flex items-center gap-2 ${guide.color} hover:opacity-80 transition-opacity`}
                >
                  {isExpanded ? (
                    <>Close Protocol <ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>Read Full Protocol <ChevronDown className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Training Resources */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Training Materials & Checklists</h3>
        <ul className="space-y-3">
          <li className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Evacuation Shelter Setup Checklist</p>
                <p className="text-xs text-slate-500">Required reading for logistics team</p>
              </div>
            </div>
            <a
              href="/evacuation-shelter-setup-checklist.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              View PDF
            </a>
          </li>
          
          <li className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Animal Handling in Crises</p>
                <p className="text-xs text-slate-500">Protocols for scared or aggressive pets</p>
              </div>
            </div>
            <a
              href="/animal-handling-in-crises-checklist.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              View PDF
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
