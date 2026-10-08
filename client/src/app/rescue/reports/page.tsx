"use client";

import { useEffect, useState } from "react";
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
  X
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

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
  };
  assignment?: {
    id: string;
    incident: {
      id: string;
      title: string;
      disasterType: string;
    };
  } | null;
};

type CompletedMissionOption = {
  id: string;
  incident: {
    title: string;
    disasterType: string;
  };
};

export default function ActionReportsPage() {
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
  const [formRescued, setFormRescued] = useState(0);
  const [formCasualties, setFormCasualties] = useState(0);
  const [formAnimals, setFormAnimals] = useState(0);
  const [formAssetsLost, setFormAssetsLost] = useState(0);
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
      setCompletedMissions(res.data.data || []);
    } catch (err) {
      console.error("Failed to load completed missions:", err);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchCompletedMissions();
  }, [statusFilter]);

  const handleFileReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSummary.trim()) {
      alert("Title and summary are required.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/rescue/reports", {
        missionId: formMissionId || undefined,
        title: formTitle.trim(),
        summary: formSummary.trim(),
        hazardNotes: formHazardNotes.trim() || undefined,
        totalRescued: Number(formRescued),
        casualties: Number(formCasualties),
        animalsRescued: Number(formAnimals),
        assetsLost: Number(formAssetsLost),
      });

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
      alert(err.response?.data?.message || "Failed to file report");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReports = reports.filter((r) => {
    const term = search.toLowerCase();
    return (
      r.title.toLowerCase().includes(term) ||
      r.reportCode.toLowerCase().includes(term) ||
      (r.assignment?.incident.title && r.assignment.incident.title.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardType className="h-6 w-6 text-blue-600" />
            After-Action Reports (AAR)
          </h1>
          <p className="text-slate-500 text-sm mt-1">Official extraction logs and casualty reports for completed missions</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {!isFiling ? (
            <>
              <Link 
                href="/rescue"
                className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
              >
                Back to Dashboard
              </Link>
              <button 
                onClick={() => setIsFiling(true)}
                className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Plus className="h-4 w-4" /> File New Report
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsFiling(false)}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Cancel Filing
            </button>
          )}
        </div>
      </div>

      {!isFiling ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-2 bg-slate-50 p-1 rounded-xl w-fit flex-wrap">
              <button 
                onClick={() => setStatusFilter("ALL")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  statusFilter === "ALL" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                All Reports
              </button>
              <button 
                onClick={() => setStatusFilter("PENDING_REVIEW")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  statusFilter === "PENDING_REVIEW" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Pending Review
              </button>
              <button 
                onClick={() => setStatusFilter("APPROVED")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  statusFilter === "APPROVED" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Approved
              </button>
            </div>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reports..." 
                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-500">Loading reports...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center bg-red-50 text-red-700">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <p className="text-sm font-bold">{error}</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-lg">No reports found</h3>
              <p className="text-sm text-slate-500 mt-1">
                Completed mission logs filed by your unit will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredReports.map((report) => (
                <div key={report.id} className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-lg">{report.title}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          report.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {report.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500 font-medium">
                        <span>Code: {report.reportCode.slice(0, 8)}</span>
                        {report.assignment && (
                          <>
                            <span className="hidden sm:inline text-slate-300">•</span>
                            <span>Mission: {report.assignment.incident.title}</span>
                          </>
                        )}
                        <span className="hidden sm:inline text-slate-300">•</span>
                        <span>Filed by: {report.filedBy.fullName}</span>
                        <span className="hidden sm:inline text-slate-300">•</span>
                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <div className="flex gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{report.totalRescued}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rescued</p>
                      </div>
                      <div className="w-px bg-slate-200"></div>
                      <div>
                        <p className={`text-2xl font-bold ${report.casualties > 0 ? 'text-red-600' : 'text-slate-900'}`}>{report.casualties}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Casualties</p>
                      </div>
                    </div>

                    <div className="border-l border-slate-100 pl-6">
                      <button 
                        onClick={() => setSelectedReport(report)}
                        className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg"
                      >
                        View Details <CheckCircle2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* FILE NEW REPORT FORM */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-blue-50/50">
            <h2 className="font-bold text-blue-900 text-lg">Official AAR Submission</h2>
            <p className="text-blue-700 text-sm mt-0.5">Please ensure all casualty and operational metrics are accurate before submitting to Command.</p>
          </div>
          
          <form onSubmit={handleFileReport} className="p-6 md:p-8 space-y-8">
            {/* Section 1: Basic Info */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">1. Mission Identification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Linked Mission (Optional)</label>
                  <select 
                    value={formMissionId}
                    onChange={(e) => setFormMissionId(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="">-- Standalone Report --</option>
                    {completedMissions.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.incident.title} ({m.incident.disasterType})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Report Title</label>
                  <input 
                    type="text" 
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Flood Extraction Sector 4 Operations" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Metrics */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">2. Outcome Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Total Rescued</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={formRescued}
                    onChange={(e) => setFormRescued(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Casualties</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={formCasualties}
                    onChange={(e) => setFormCasualties(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-center text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Animals Rescued</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={formAnimals}
                    onChange={(e) => setFormAnimals(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Assets Lost</label>
                  <input 
                    type="number" 
                    min="0" 
                    value={formAssetsLost}
                    onChange={(e) => setFormAssetsLost(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Summary */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">3. Tactical Narrative & Observations</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Operational Summary</label>
                  <textarea 
                    rows={4} 
                    value={formSummary}
                    onChange={(e) => setFormSummary(e.target.value)}
                    placeholder="Describe the tactical extraction steps, obstacles overcome, and outcome..." 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Hazard / Secondary Risk Notes (Optional)</label>
                  <textarea 
                    rows={2} 
                    value={formHazardNotes}
                    onChange={(e) => setFormHazardNotes(e.target.value)}
                    placeholder="Note lingering hazards (e.g. 'Structural compromise on second-story bridge')" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
              <button 
                type="button"
                onClick={() => setIsFiling(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors text-sm"
              >
                Discard Draft
              </button>
              <button 
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Submit Report to Command
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-lg text-slate-900">AAR: {selectedReport.title}</h3>
              <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-blue-600">Code: {selectedReport.reportCode}</span>
                <span className="font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                  {selectedReport.status}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center bg-slate-50 p-3 rounded-xl border">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Rescued</span>
                  <span className="text-lg font-bold text-slate-800">{selectedReport.totalRescued}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Casualties</span>
                  <span className="text-lg font-bold text-red-600">{selectedReport.casualties}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Animals</span>
                  <span className="text-lg font-bold text-slate-800">{selectedReport.animalsRescued}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Assets Lost</span>
                  <span className="text-lg font-bold text-slate-800">{selectedReport.assetsLost}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Operational Summary</h4>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border text-xs leading-relaxed">
                  {selectedReport.summary}
                </p>
              </div>

              {selectedReport.hazardNotes && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Hazard Notes</h4>
                  <p className="text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs leading-relaxed">
                    {selectedReport.hazardNotes}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t">
              <button 
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
