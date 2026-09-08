import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, Database, FileText, Bell, RefreshCw, Cpu, Layers } from "lucide-react";
import { useVerification } from "../context/VerificationContext";

export const Navbar: React.FC = () => {
  const { currentJobId, jobs, selectJob, refreshData, isLoading } = useVerification();
  const location = useLocation();

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="bg-sky-500/20 p-2 rounded-lg border border-sky-400/30 text-sky-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <Link to="/" className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                SOA Guard <span className="bg-sky-500 text-xs font-semibold px-2 py-0.5 rounded text-white tracking-normal uppercase">AI</span>
              </Link>
              <p className="text-[11px] text-slate-400 font-mono leading-none">Logistics SOA Verification Engine</p>
            </div>
          </div>

          {/* Active Job Selector & Quick Status */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center bg-slate-800/80 rounded-lg px-3 py-1.5 border border-slate-700">
              <span className="text-xs text-slate-400 mr-2 font-medium">Active Job:</span>
              <select
                value={currentJobId}
                onChange={(e) => selectJob(e.target.value)}
                className="bg-transparent text-xs font-semibold text-sky-400 focus:outline-none cursor-pointer"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id} className="bg-slate-800 text-white">
                    {j.jobCode} — {j.status}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => refreshData()}
              disabled={isLoading}
              title="Refresh Verification Data"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-sky-400" : ""}`} />
            </button>
          </div>

          {/* User Profile & Operational Role */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-800/60 px-3 py-1 rounded-full border border-slate-700/60">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs text-slate-300 font-medium">SOA Checker Mode</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-xs text-sky-300">
              SC
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
