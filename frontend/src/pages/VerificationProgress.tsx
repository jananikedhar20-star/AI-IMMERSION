import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  Terminal,
  ShieldCheck
} from "lucide-react";
import { useVerification } from "../context/VerificationContext";

export const VerificationProgress: React.FC = () => {
  const { steps } = useVerification();
  const navigate = useNavigate();
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const stages = [
    { title: "File Ingestion", desc: "MIME and structural validation" },
    { title: "Data Extraction", desc: "Cell parsing and table layout extraction" },
    { title: "Field Mapping", desc: "AI semantic mapping to 5 canonical groups" },
    { title: "Data Normalization", desc: "Currency and ISO 8601 standardizations" },
    { title: "Record Matching", desc: "BL / Container key deterministic matching" },
    { title: "Deterministic Rules", desc: "Exact arithmetic (Qty * Rate), totals, and tariff ceilings" },
    { title: "AI Reviewer 1", desc: "Independent contract & tariff baseline evaluation" },
    { title: "AI Reviewer 2", desc: "Independent operational charge structure evaluation (blind)" },
    { title: "Consensus Engine", desc: "Multi-layer evaluation across Cases 1 to 4" },
    { title: "Human Review Routing", desc: "Escalation routing for disagreement/conflict items" },
    { title: "Final Verification", desc: "Reconciliation finalization & audit trace output" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        } else {
          setIsCompleted(true);
          clearInterval(timer);
          return prev;
        }
      });
    }, 350);

    return () => clearInterval(timer);
  }, []);

  const progressPercent = Math.round(((activeStepIndex + 1) / stages.length) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1 w-fit">
            <Layers className="w-3.5 h-3.5" /> {isCompleted ? "Pipeline Completed" : "Multi-Layer Verification in Progress"}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">11-Stage Multi-Layer Verification Pipeline</h1>
        </div>
        {isCompleted && (
          <button
            onClick={() => navigate("/results")}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition"
          >
            <span>View Summary Results</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
          <span>Verification Pipeline Execution</span>
          <span className="text-sky-600 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          <div
            className="bg-sky-600 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-sky-600" /> Pipeline Verification Stages
        </h2>
        <div className="space-y-2.5">
          {stages.map((stage, idx) => {
            const isDone = idx <= activeStepIndex;
            const isCurrent = idx === activeStepIndex && !isCompleted;

            return (
              <div
                key={stage.title}
                className={`p-3 rounded-lg border transition flex items-center justify-between ${
                  isCurrent
                    ? "bg-sky-50/80 border-sky-300 ring-1 ring-sky-300"
                    : isDone
                    ? "bg-emerald-50/30 border-emerald-200"
                    : "bg-slate-50/60 border-slate-200 text-slate-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Stage {idx + 1}: {stage.title}
                    </p>
                    <p className="text-[11px] text-slate-500">{stage.desc}</p>
                  </div>
                </div>

                <div className="text-xs font-semibold">
                  {isCurrent && (
                    <span className="text-sky-600 flex items-center gap-1 text-xs">
                      <Clock className="w-3 h-3 animate-spin" /> Running...
                    </span>
                  )}
                  {isDone && !isCurrent && (
                    <span className="text-emerald-700 text-xs">Verified</span>
                  )}
                  {!isDone && <span className="text-slate-400 text-xs">Pending</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 font-mono text-xs text-slate-300 shadow-md">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-slate-400 mb-3">
          <Terminal className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-semibold text-[11px] uppercase tracking-wider">Multi-Layer Audit Console Trace</span>
        </div>
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {steps.slice(0, activeStepIndex + 1).map((s, i) => (
            <div key={s.id || i} className="flex items-start gap-2">
              <span className="text-sky-400 shrink-0">[{s.timestamp || "12:00:00"}]</span>
              <span className="text-emerald-400 font-semibold shrink-0">[{s.stageName}]</span>
              <span className="text-slate-200">{s.details}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
