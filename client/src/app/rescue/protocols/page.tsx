"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Waves, 
  Flame, 
  Mountain, 
  CloudRain, 
  Zap, 
  ChevronDown, 
  ChevronUp, 
  Crosshair, 
  Loader2, 
  AlertTriangle 
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

type Protocol = {
  id: string;
  disasterType: string;
  title: string;
  description: string;
  before: string[];
  during: string[];
  after: string[];
};

const defaultProtocols: Protocol[] = [
  {
    id: "proto-1",
    disasterType: "FLOOD",
    title: "Swift Water Extraction & Boat Operations",
    description: "Tactical guidelines for executing rescues in moving floodwaters and submerged structures.",
    before: ["Deploy upstream spotters before entering water", "Check hydrological flow rate and debris presence"],
    during: ["Always use a tethered line system; never rely solely on swimming", "Approach victims from downstream to prevent sweeping them away", "Prioritize children, elderly, and hypothermic individuals"],
    after: ["Conduct medical decontamination and hypothermia check on extracted victims"]
  },
  {
    id: "proto-2",
    disasterType: "EARTHQUAKE",
    title: "Structural Collapse Search & Heavy Shoring",
    description: "Grid search methodology for unstable earthquake rubble, structural voids, and debris.",
    before: ["Halt all heavy machinery before initiating acoustic or thermal search", "Survey outer load-bearing columns"],
    during: ["Use 'Call and Listen' in synchronized 2-minute intervals", "Mark searched zones with standard search spray markings", "Shore up secondary load-bearing walls before deep penetration"],
    after: ["Establish continuous perimeter monitoring for secondary tremors"]
  },
  {
    id: "proto-3",
    disasterType: "OTHER",
    title: "Traumatized & Aggressive Animal Containment",
    description: "Procedures for securing and extracting traumatized or territorial pets during disaster evacuations.",
    before: ["Assess animal body language and prepare protective bite gauntlets"],
    during: ["Do not make sudden movements or maintain aggressive eye contact", "Use slip-leads or catchpoles only as a last resort", "Immediately transfer secured animals to dark, quiet transport crates"],
    after: ["Log microchips or physical characteristics and register in Reunification system"]
  }
];

const disasterIcons: Record<string, any> = {
  FLOOD: Waves,
  EARTHQUAKE: Mountain,
  FIRE: Flame,
  CYCLONE: CloudRain,
  LANDSLIDE: Mountain,
  OTHER: Crosshair,
};

export default function RescueProtocolsPage() {
  const [protocols, setProtocols] = useState<Protocol[]>(defaultProtocols);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("ALL");

  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/rescue/protocols");
        if (res.data.data && res.data.data.length > 0) {
          setProtocols(res.data.data);
        } else {
          // Keep default SOPs
          setProtocols(defaultProtocols);
        }
      } catch (err: any) {
        console.error("Failed to load protocols from backend, using standard SOPs:", err);
        setProtocols(defaultProtocols);
      } finally {
        setLoading(false);
      }
    };

    fetchProtocols();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filtered = filterType === "ALL" 
    ? protocols 
    : protocols.filter((p) => p.disasterType === filterType);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Rescue Protocols & SOPs
          </h1>
          <p className="text-slate-500 text-sm mt-1">Official tactical SOPs and safety directives for professional Rescue Units</p>
        </div>
        <Link 
          href="/rescue"
          className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-r-xl shadow-sm">
        <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">
          Command Directive
        </h3>
        <p className="text-sm text-blue-700 leading-relaxed font-medium">
          These tactical protocols govern hazardous rescue operations. Only attempt high-risk maneuvers if certified. Any tactical deviation requires direct authorization from Incident Command.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap bg-slate-100 p-1 rounded-xl w-fit">
        {["ALL", "FLOOD", "EARTHQUAKE", "FIRE", "CYCLONE", "OTHER"].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              filterType === t 
                ? "bg-white text-blue-700 shadow-sm" 
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading safety protocols...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((protocol) => {
            const isExpanded = expandedId === protocol.id;
            const Icon = disasterIcons[protocol.disasterType] || Zap;

            return (
              <div 
                key={protocol.id} 
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col"
              >
                <div className="relative z-10 flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border bg-blue-50 text-blue-600 border-blue-200 shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                        {protocol.disasterType}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{protocol.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1">{protocol.description}</p>
                  </div>
                </div>

                {isExpanded && (
                  <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 space-y-4">
                    {protocol.before && protocol.before.length > 0 && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Pre-Operation Checklist</h4>
                        <ul className="space-y-1 text-sm text-slate-800">
                          {protocol.before.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-600 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {protocol.during && protocol.during.length > 0 && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Active Extraction Procedures</h4>
                        <ul className="space-y-1 text-sm text-slate-800">
                          {protocol.during.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {protocol.after && protocol.after.length > 0 && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Post-Extraction Handover</h4>
                        <ul className="space-y-1 text-sm text-slate-800">
                          {protocol.after.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-purple-600 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="relative z-10 mt-4 pt-4 border-t border-slate-100 flex justify-end">
                  <button 
                    onClick={() => toggleExpand(protocol.id)}
                    className="text-sm font-bold flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
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
      )}
    </div>
  );
}
