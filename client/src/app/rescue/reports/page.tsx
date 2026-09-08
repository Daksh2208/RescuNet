"use client";

import { useState } from "react";
import { ClipboardType, Search, Download, FileText, CheckCircle2, Plus, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function ActionReportsPage() {
  const [isFiling, setIsFiling] = useState(false);

  const reports = [
    {
      id: "AAR-8091",
      missionId: "MSN-8091",
      title: "Sector 3 Water Rescue",
      date: "Sep 05, 2026",
      filedBy: "Unit Bravo-2",
      status: "APPROVED",
      casualties: 0,
      rescued: 4
    },
    {
      id: "AAR-8090",
      missionId: "MSN-8090",
      title: "Warehouse Fire Containment",
      date: "Sep 04, 2026",
      filedBy: "Unit Alpha-1",
      status: "PENDING_REVIEW",
      casualties: 1,
      rescued: 12
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ClipboardType className="h-6 w-6 text-blue-600" />
            After-Action Reports
          </h1>
          <p className="text-slate-500 text-sm mt-1">Official logs and casualty reports for completed missions</p>
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
                className="bg-blue-600 text-white font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
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
            <div className="flex gap-2 bg-slate-50 p-1 rounded-xl w-fit">
              <button className="px-4 py-2 rounded-lg text-sm font-bold bg-white text-blue-700 shadow-sm">All Reports</button>
              <button className="px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">Requires Review</button>
            </div>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Mission ID..." 
                className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {reports.map((report) => (
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
                      <span>{report.id}</span>
                      <span className="hidden sm:inline text-slate-300">•</span>
                      <span>Mission: {report.missionId}</span>
                      <span className="hidden sm:inline text-slate-300">•</span>
                      <span>Filed by: {report.filedBy}</span>
                      <span className="hidden sm:inline text-slate-300">•</span>
                      <span>{report.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="flex gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{report.rescued}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rescued</p>
                    </div>
                    <div className="w-px bg-slate-200"></div>
                    <div>
                      <p className={`text-2xl font-bold ${report.casualties > 0 ? 'text-red-600' : 'text-slate-900'}`}>{report.casualties}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Casualties</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 border-l border-slate-100 pl-6">
                    <button className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2">
                      Review <CheckCircle2 className="h-4 w-4" />
                    </button>
                    <button className="text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-2">
                      Export <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      ) : (
        /* FILE NEW REPORT FORM */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-blue-50/50">
            <h2 className="font-bold text-blue-900 text-lg">Official AAR Submission</h2>
            <p className="text-blue-700 text-sm mt-0.5">Please ensure all casualty and structural data is highly accurate before submitting to Command.</p>
          </div>
          
          <div className="p-6 md:p-8 space-y-8">
            {/* Section 1: Basic Info */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">1. Mission Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mission ID</label>
                  <input type="text" placeholder="e.g. MSN-8092" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Report Title</label>
                  <input type="text" placeholder="e.g. Flood Extraction Sector 4" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
              </div>
            </div>

            {/* Section 2: Metrics */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">2. Outcome Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Total Rescued</label>
                  <input type="number" min="0" defaultValue="0" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Casualties</label>
                  <input type="number" min="0" defaultValue="0" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-center text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Pets / Animals</label>
                  <input type="number" min="0" defaultValue="0" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Assets Lost</label>
                  <input type="number" min="0" defaultValue="0" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                </div>
              </div>
            </div>

            {/* Section 3: Summary */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">3. Narrative & Logs</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Operational Summary</label>
                  <textarea rows={4} placeholder="Describe the tactical approach, challenges faced, and sequence of events..." className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Structural / Hazard Notes (Optional)</label>
                  <textarea rows={2} placeholder="Note any ongoing hazards (e.g. 'South wall of warehouse is unstable')" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"></textarea>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
              <button 
                onClick={() => setIsFiling(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Discard Draft
              </button>
              <button 
                onClick={() => setIsFiling(false)}
                className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="h-4 w-4" /> Submit Report to Command
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
