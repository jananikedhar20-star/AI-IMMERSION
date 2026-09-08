import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  Play,
  Database,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { createUploadJob, triggerJobVerification } from "../services/api";
import { useVerification } from "../context/VerificationContext";

export const UploadVerification: React.FC = () => {
  const [pricingFile, setPricingFile] = useState<File | null>(null);
  const [soaFile, setSoaFile] = useState<File | null>(null);
  const [useSampleData, setUseSampleData] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { selectJob, refreshData } = useVerification();

  const handleStartVerification = async () => {
    setIsSubmitting(true);
    try {
      const { jobId } = await createUploadJob(
        useSampleData ? undefined : (pricingFile || undefined),
        useSampleData ? undefined : (soaFile || undefined)
      );
      selectJob(jobId);
      await triggerJobVerification(jobId);
      await refreshData();
      navigate("/progress");
    } catch (err) {
      console.error(err);
      navigate("/progress");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upload & Initialize Multi-Layer Verification</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload Master Pricing Database and Agent SOA to execute the 11-stage Deterministic & Dual-AI Consensus pipeline.
        </p>
      </div>

      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex items-start gap-3 text-sky-900">
        <Sparkles className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold">Pre-loaded Synthetic Logistics Test Data (4 Consensus Cases Included)</p>
          <p className="text-sky-700 text-xs mt-0.5">
            100% Anonymized. Demonstrates Case 1 (Confirmed Mismatch), Case 2 (Verified Match), Case 3 (AI Conflict), and Case 4 (Deterministic Authority Guard).
          </p>
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => setUseSampleData(true)}
              className={`px-3 py-1 rounded text-xs font-semibold transition ${
                useSampleData ? "bg-sky-600 text-white" : "bg-sky-100 text-sky-800 hover:bg-sky-200"
              }`}
            >
              {useSampleData ? "✓ Synthetic Test Data Loaded" : "Load Synthetic Test Data"}
            </button>
            <span className="text-xs text-slate-500">or upload custom files</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`bg-white rounded-xl border-2 p-6 shadow-sm flex flex-col justify-between ${pricingFile ? "border-emerald-400 bg-emerald-50/10" : "border-dashed border-slate-300"}`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Database className="w-5 h-5 text-sky-600" />
                <span>1. Master Pricing Database</span>
              </div>
              <span className="text-[11px] font-semibold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                Required
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Agreed contractual rates, tariffs, POL/POD pairs, and standard charge heads.
            </p>
            
            <div className="border border-slate-200 rounded-lg p-4 text-center bg-slate-50 hover:bg-slate-100/60 transition cursor-pointer relative">
              <input
                type="file"
                accept=".csv,.xlsx,.json"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setPricingFile(e.target.files[0]);
                    setUseSampleData(false);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileSpreadsheet className="w-8 h-8 text-sky-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                {pricingFile ? pricingFile.name : useSampleData ? "pricing_database_sample.csv" : "Click or drag Pricing file here"}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Supported formats: CSV, XLSX, JSON</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Status:</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> File Ready
            </span>
          </div>
        </div>

        <div className={`bg-white rounded-xl border-2 p-6 shadow-sm flex flex-col justify-between ${soaFile ? "border-emerald-400 bg-emerald-50/10" : "border-dashed border-slate-300"}`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <FileText className="w-5 h-5 text-sky-600" />
                <span>2. Agent Statement of Account (SOA)</span>
              </div>
              <span className="text-[11px] font-semibold uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                Required
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Agent-submitted billing statement detailing job invoices, terminal charges & freight.
            </p>

            <div className="border border-slate-200 rounded-lg p-4 text-center bg-slate-50 hover:bg-slate-100/60 transition cursor-pointer relative">
              <input
                type="file"
                accept=".csv,.xlsx,.json"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setSoaFile(e.target.files[0]);
                    setUseSampleData(false);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <FileText className="w-8 h-8 text-sky-600 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                {soaFile ? soaFile.name : useSampleData ? "agent_soa_sample_with_discrepancies.csv" : "Click or drag SOA file here"}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Supported formats: CSV, XLSX, JSON</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Status:</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> File Ready
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-600" /> Multi-Layer Verification Principles
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">1. Deterministic Engine Authority</span>
            <p className="text-slate-500 text-[11px]">Strict authority over exact math, arithmetic (Qty * Rate), totals, duplicates, and missing records. No LLM arithmetic override.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">2. Blind Dual AI Reviewers & Consensus</span>
            <p className="text-slate-500 text-[11px]">AI Reviewer 1 (Tariff) and AI Reviewer 2 (Operational) review independently without seeing each other's output. Consensus Engine enforces human escalation upon conflict.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleStartVerification}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition disabled:opacity-50 text-sm"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{isSubmitting ? "Executing Multi-Layer Verification..." : "Start 11-Stage Verification Pipeline"}</span>
        </button>
      </div>
    </div>
  );
};
