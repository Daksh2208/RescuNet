"use client";

import { useState } from "react";
import { Users, Waves, Flame, FileText, ChevronDown, ChevronUp, Crosshair } from "lucide-react";
import Link from "next/link";

export default function RescueProtocolsPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const protocols = [
    {
      id: 1,
      title: "Swift Water Extraction",
      desc: "Tactical guidelines for executing rescues in moving floodwaters above 2 feet.",
      fullDetails: [
        "Deploy upstream spotters before entering water.",
        "Always use a tethered line system; never rely solely on swimming.",
        "Approach victims from downstream to prevent sweeping them away.",
        "Prioritize children and elderly for immediate extraction."
      ],
      icon: Waves,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      border: "border-cyan-200"
    },
    {
      id: 2,
      title: "Structural Collapse Search",
      desc: "Grid search methodology for unstable earthquake rubble and debris.",
      fullDetails: [
        "Halt all heavy machinery before initiating acoustic search.",
        "Use 'Call and Listen' in 2-minute intervals.",
        "Mark searched zones with standard X-code spray paint.",
        "Shore up secondary load-bearing walls before deep penetration."
      ],
      icon: Flame,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-200"
    },
    {
      id: 3,
      title: "Aggressive Animal Containment",
      desc: "Procedures for handling traumatized or territorial pets during evacuation.",
      fullDetails: [
        "Do not make sudden movements or maintain aggressive eye contact.",
        "Use catchpoles only as a last resort to prevent injury.",
        "Deploy bite-resistant gauntlets when handling unfamiliar dogs.",
        "Once secured, immediately transfer to a dark, quiet transport crate."
      ],
      icon: Crosshair,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200"
    }
  ];

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Rescue Protocols
          </h1>
          <p className="text-slate-500 text-sm mt-1">Official tactical SOPs for professional Rescue Units</p>
        </div>
        <Link 
          href="/rescue"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-r-xl shadow-sm">
        <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">
          Command Directive
        </h3>
        <p className="text-sm text-blue-700 leading-relaxed font-medium">
          These protocols dictate extreme hazard operations. Only attempt these maneuvers if you are currently certified. Deviation from these SOPs requires direct authorization from Command HQ.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {protocols.map((protocol) => {
          const isExpanded = expandedId === protocol.id;
          return (
            <div key={protocol.id} className={`bg-white rounded-2xl border ${protocol.border} p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col`}>
              <div className={`absolute top-0 right-0 w-32 h-32 ${protocol.bg} rounded-bl-full -mr-12 -mt-12 z-0`} />
              
              <div className="relative z-10 flex items-start gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border ${protocol.border} bg-white shadow-sm ${protocol.color}`}>
                  <protocol.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-slate-900">{protocol.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mt-1">{protocol.desc}</p>
                </div>
              </div>

              {isExpanded && (
                <div className="relative z-10 mt-6 pt-4 border-t border-slate-100">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <ul className="space-y-2 text-sm text-slate-800 font-medium">
                      {protocol.fullDetails.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className={`shrink-0 mt-1 ${protocol.color}`}>•</span>
                          <span className="leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              <div className="relative z-10 mt-4 pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => toggleExpand(protocol.id)}
                  className={`text-sm font-bold flex items-center gap-2 ${protocol.color} hover:opacity-80 transition-opacity bg-white px-4 py-2 rounded-lg border ${protocol.border} shadow-sm`}
                >
                  {isExpanded ? (
                    <>Hide Protocol <ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>View Tactical SOP <ChevronDown className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
