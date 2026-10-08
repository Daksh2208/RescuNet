"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { 
  ClipboardType, 
  Search, 
  FileText, 
  CheckCircle2, 
  Plus, 
  ArrowLeft, 
  Save, 
  Loader2, 
  AlertTriangle,
  X,
  Printer,
  ShieldAlert,
  Users,
  PawPrint,
  Truck,
  Calendar,
  Phone,
  User,
  HeartPulse
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";

type ActionReport = {
  id: string;
  reportCode: string;
  missionId?: string | null;
  title: string;
  summary: string;
  hazardNotes?: string | null;
  totalRescued: number;
  casualties: number;
  animalsRescued: number;
  assetsLost: number;
  status: "PENDING_REVIEW" | "APPROVED" | "REJECTED";
  createdAt: string;
  filedBy: {
    id: string;
    fullName: string;
    phone?: string | null;
    email?: string | null;
  };
  assignment?: {
    id: string;
    incident: {
      id: string;
      title: string;
      description?: string | null;
      disasterType: string;
      severity?: string | null;
      address: string;
      latitude?: number | null;
      longitude?: number | null;
      reportedBy?: {
        id: string;
        fullName: string;
        phone?: string | null;
      } | null;
    };
  } | null;
};

type CompletedMissionOption = {
  id: string;
  assignedAt: string;
  completedAt?: string | null;
  incident: {
    id: string;
    title: string;
    disasterType: string;
    severity?: string | null;
    address: string;
  };
};

function ActionReportsContent() {
  const searchParams = useSearchParams();
  const queryMissionId = searchParams.get("missionId");

  const [isFiling, setIsFiling] = useState(false);
  const [reports, setReports] = useState<ActionReport[]>([]);
  const [completedMissions, setCompletedMissions] = useState<CompletedMissionOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedReport, setSelectedReport] = useState<ActionReport | null>(null);

  // Filing form state
  const [formMissionId, setFormMissionId] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formSummary, setFormSummary] = useState("");
  const [formHazardNotes, setFormHazardNotes] = useState("");
  const [formRescued, setFormRescued] = useState<number>(0);
  const [formCasualties, setFormCasualties] = useState<number>(0);
  const [formAnimals, setFormAnimals] = useState<number>(0);
  const [formAssetsLost, setFormAssetsLost] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      const params: Record<string, string> = {};
      if (statusFilter !== "ALL") {
        params.status = statusFilter;
      }
      const res = await api.get("/rescue/reports", { params });
      setReports(res.data.data || []);
    } catch (err: any) {
      console.error("Failed to load reports:", err);
      setError(err.response?.data?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedMissions = async () => {
    try {
      const res = await api.get("/rescue/missions/completed");
      const list: CompletedMissionOption[] = res.data.data || [];
      setCompletedMissions(list);

      // Check if URL passed a missionId to file immediately
      if (queryMissionId) {
        setFormMissionId(queryMissionId);
        setIsFiling(true);
        const target = list.find((m) => m.id === queryMissionId);
        if (target) {
          setFormTitle(`After-Action Report: ${target.incident.title}`);
        }
      }
    } catch (err) {
      console.error("Failed to load completed missions:", err);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchCompletedMissions();
  }, [statusFilter]);

  // When dropdown selection changes, pre-fill title
  const handleMissionSelect = (missionId: string) => {
    setFormMissionId(missionId);
    const target = completedMissions.find((m) => m.id === missionId);
    if (target && !formTitle) {
      setFormTitle(`After-Action Report: ${target.incident.title}`);
    }
  };

  const handleFileReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSummary.trim()) {
      toast.error("Title and operational summary are required.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/rescue/reports", {
        missionId: formMissionId || undefined,
        title: formTitle.trim(),
        summary: formSummary.trim(),
        hazardNotes: formHazardNotes.trim() || undefined,
        totalRescued: Number(formRescued) || 0,
        casualties: Number(formCasualties) || 0,
        animalsRescued: Number(formAnimals) || 0,
        assetsLost: Number(formAssetsLost) || 0,
      });

      toast.success("After-Action Report submitted to Command Center!");

      // Reset form
      setFormMissionId("");
      setFormTitle("");
      setFormSummary("");
      setFormHazardNotes("");
      setFormRescued(0);
      setFormCasualties(0);
      setFormAnimals(0);
      setFormAssetsLost(0);
      setIsFiling(false);
      await fetchReports();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to file report");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReports = useMemo(() => {
    const term = search.toLowerCase().trim();
    return reports.filter((r) => {
      return (
        !term ||
        r.title.toLowerCase().includes(term) ||
        r.reportCode.toLowerCase().includes(term) ||
        (r.assignment?.incident.title && r.assignment.incident.title.toLowerCase().includes(term)) ||
        (r.assignment?.incident.disasterType && r.assignment.incident.disasterType.toLowerCase().includes(term))
      );
    });
  }, [reports, search]);

  // Operational Totals
  const totals = useMemo(() => {
    return reports.reduce(
      (acc, curr) => ({
        rescued: acc.rescued + (curr.totalRescued || 0),
        casualties: acc.casualties + (curr.casualties || 0),
        animals: acc.animals + (curr.animalsRescued || 0),
        assets: acc.assets + (curr.assetsLost || 0),
      }),
      { rescued: 0, casualties: 0, animals: 0, assets: 0 }
    );
  }, [reports]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <ClipboardType className="h-6 w-6 text-blue-600" />
            After-Action Reports (AAR) & Incident Dossiers
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Mandatory Incident Command System extraction logs, casualty tracking, and post-mission ground audits
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!isFiling ? (
            <>
              <Link 
                href="/rescue"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
              >
                Dashboard
              </Link>
              <button 
                onClick={() => setIsFiling(true)}
                className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2 text-xs"
              >
                <Plus className="h-4 w-4" /> File New AAR
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsFiling(false)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to All Reports
            </button>
          )}
        </div>
      </div>

      {/* Aggregate Impact KPI Ribbon */}
      {!isFiling && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-900">{totals.rescued}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Human Lives Rescued</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <PawPrint className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-900">{totals.animals}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Animals Extracted</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-black text-red-600">{totals.casualties}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Casualties Recorded</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-900">{reports.length}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Dossiers Filed</p>
            </div>
          </div>
        </div>
      )}

      {!isFiling ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Filtering toolbar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/50">
            <div className="flex gap-2 bg-white p-1 rounded-xl w-fit flex-wrap border border-slate-200">
              <button 
                onClick={() => setStatusFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "ALL" ? "bg-blue-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Reports ({reports.length})
              </button>
              <button 
                onClick={() => setStatusFilter("PENDING_REVIEW")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "PENDING_REVIEW" ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Pending Review
              </button>
              <button 
                onClick={() => setStatusFilter("APPROVED")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === "APPROVED" ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Approved by Command
              </button>
            </div>

            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dossiers, codes, disaster type..." 
                className="w-full sm:w-72 pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-2xs"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-16 text-center text-slate-500">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold">Synchronizing Incident Command dossiers...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-red-50 text-red-700 m-4 rounded-xl border border-red-200">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <p className="text-xs font-bold">{error}</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-16 text-center">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No After-Action Reports Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Completed mission logs and operational extraction briefs filed by your unit will appear here.
              </p>
              <button
                onClick={() => setIsFiling(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-blue-700 transition"
              >
                File Your First AAR
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredReports.map((report) => (
                <div key={report.id} className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                      <ClipboardType className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-slate-900 text-sm">{report.title}</h3>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                          report.status === 'APPROVED' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : report.status === 'REJECTED'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {report.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                        <span className="font-mono text-[11px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                          {report.reportCode.slice(0, 8)}
                        </span>
                        {report.assignment?.incident && (
                          <span>
                            Incident: <strong className="text-slate-700">{report.assignment.incident.title}</strong> ({report.assignment.incident.disasterType})
                          </span>
                        )}
                        <span>•</span>
                        <span>Officer: <strong className="text-slate-700">{report.filedBy.fullName}</strong></span>
                        <span>•</span>
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>

                      {report.summary && (
                        <p className="text-xs text-slate-600 line-clamp-1 mt-1">
                          {report.summary}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-emerald-50/70 border border-emerald-100 px-3 py-1 rounded-lg">
                        <p className="text-sm font-black text-emerald-700">{report.totalRescued}</p>
                        <p className="text-[9px] font-bold text-emerald-800 uppercase">Rescued</p>
                      </div>
                      <div className="bg-amber-50/70 border border-amber-100 px-3 py-1 rounded-lg">
                        <p className="text-sm font-black text-amber-700">{report.animalsRescued}</p>
                        <p className="text-[9px] font-bold text-amber-800 uppercase">Animals</p>
                      </div>
                      <div className="bg-red-50/70 border border-red-100 px-3 py-1 rounded-lg">
                        <p className={`text-sm font-black ${report.casualties > 0 ? 'text-red-600' : 'text-slate-700'}`}>{report.casualties}</p>
                        <p className="text-[9px] font-bold text-red-800 uppercase">Casualty</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedReport(report)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0"
                    >
                      <FileText className="h-3.5 w-3.5" /> Inspect Dossier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* FILE NEW AAR FORM */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-blue-50/50 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-blue-900 text-base flex items-center gap-2">
                <ClipboardType className="h-5 w-5 text-blue-600" />
                Official After-Action Report (AAR) Submission
              </h2>
              <p className="text-blue-700 text-xs mt-0.5">
                Submit post-mission casualty counts, extraction metrics, and lingering hazard warnings to Command
              </p>
            </div>
          </div>
          
          <form onSubmit={handleFileReport} className="p-6 md:p-8 space-y-7">
            {/* Section 1: Identification */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                1. Mission & Incident Linkage
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Linked Completed Mission
                  </label>
                  <select 
                    value={formMissionId}
                    onChange={(e) => handleMissionSelect(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="">-- Standalone Incident Dossier --</option>
                    {completedMissions.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.incident.title} ({m.incident.disasterType}) — {m.incident.address}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    AAR Report Title *
                  </label>
                  <input 
                    type="text" 
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Flash Flood Sector 4 Extraction Operations" 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Outcome Metrics */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                2. Casualty, Extraction & Loss Metrics
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                  <label className="block text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" /> Total Rescued (Humans)
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    value={formRescued}
                    onChange={(e) => setFormRescued(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg text-base font-black text-center text-emerald-800 focus:outline-none" 
                  />
                </div>

                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                  <label className="block text-[10px] font-extrabold text-amber-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <PawPrint className="h-3.5 w-3.5" /> Animals Saved
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    value={formAnimals}
                    onChange={(e) => setFormAnimals(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-amber-200 rounded-lg text-base font-black text-center text-amber-800 focus:outline-none" 
                  />
                </div>

                <div className="bg-red-50/50 p-4 rounded-xl border border-red-100">
                  <label className="block text-[10px] font-extrabold text-red-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <HeartPulse className="h-3.5 w-3.5" /> Casualties (Deceased)
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    value={formCasualties}
                    onChange={(e) => setFormCasualties(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-red-200 rounded-lg text-base font-black text-center text-red-700 focus:outline-none" 
                  />
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="block text-[10px] font-extrabold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5" /> Lost/Damaged Assets
                  </label>
                  <input 
                    type="number" 
                    min="0" 
                    value={formAssetsLost}
                    onChange={(e) => setFormAssetsLost(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-base font-black text-center text-slate-800 focus:outline-none" 
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Field Narrative */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                3. Tactical Narrative & Secondary Hazards
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Executive Operational Summary *
                  </label>
                  <textarea 
                    rows={4} 
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    placeholder="Document the extraction sequence, responder equipment deployed, citizen condition at handover, and overall outcome..." 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none leading-relaxed"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Lingering Hazards & Site Warnings (Optional)
                  </label>
                  <textarea 
                    rows={2} 
                    value={formHazardNotes}
                    onChange={(e) => setFormHazardNotes(e.target.value)}
                    placeholder="Note secondary threats for following squads (e.g. 'Live high-voltage wire submerged in western corridor', 'Gas leak detected')..." 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsFiling(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors text-xs"
              >
                Discard Draft
              </button>
              <button 
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2 text-xs disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Submit Dossier to Command
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FULL AFTER-ACTION DOSSIER INSPECTOR MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                  <ClipboardType className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-600 font-mono block">
                    DOSSIER #{selectedReport.reportCode}
                  </span>
                  <h3 className="font-extrabold text-lg text-slate-900 leading-tight">
                    {selectedReport.title}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReport(null)} 
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Dossier Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Humans Saved</span>
                <span className="text-xl font-black text-emerald-600">{selectedReport.totalRescued}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Animals Saved</span>
                <span className="text-xl font-black text-amber-600">{selectedReport.animalsRescued}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Fatal Casualties</span>
                <span className={`text-xl font-black ${selectedReport.casualties > 0 ? 'text-red-600' : 'text-slate-700'}`}>
                  {selectedReport.casualties}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Equipment Lost</span>
                <span className="text-xl font-black text-slate-800">{selectedReport.assetsLost}</span>
              </div>
            </div>

            {/* Incident Link Details */}
            {selectedReport.assignment?.incident && (
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 space-y-1.5 text-xs">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 block">
                  Associated Disaster Incident
                </span>
                <p className="font-bold text-slate-900">
                  {selectedReport.assignment.incident.title} ({selectedReport.assignment.incident.disasterType})
                </p>
                <p className="text-slate-600">
                  Location: {selectedReport.assignment.incident.address}
                </p>
              </div>
            )}

            {/* Executive Operational Summary */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Operational Narrative & Tactical Sequence
              </h4>
              <div className="text-xs text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed font-medium">
                {selectedReport.summary}
              </div>
            </div>

            {/* Lingering Hazard Notes */}
            {selectedReport.hazardNotes && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Lingering Hazards & Secondary Threat Warnings
                </h4>
                <div className="text-xs text-amber-900 bg-amber-50 p-3.5 rounded-xl border border-amber-200 leading-relaxed font-medium">
                  {selectedReport.hazardNotes}
                </div>
              </div>
            )}

            {/* Officer Signature & Status Footer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                <span>Reporting Officer: <strong className="text-slate-800">{selectedReport.filedBy.fullName}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Filed: {new Date(selectedReport.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" /> Print / Export AAR
              </button>

              <button 
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ActionReportsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-28 text-slate-500">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-3" />
          <p className="text-sm font-semibold tracking-wide uppercase">Loading After-Action Reports...</p>
        </div>
      }
    >
      <ActionReportsContent />
    </Suspense>
  );
}
