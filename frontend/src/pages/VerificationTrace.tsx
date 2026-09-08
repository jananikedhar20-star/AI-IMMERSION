import React from "react";
import {
  FileSearch,
  Clock
} from "lucide-react";
import { useVerification } from "../context/VerificationContext";

export const VerificationTrace: React.FC = () => {
  const { steps } = useVerification();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <FileSearch className="w-6 h-6 text-sky-600" />
          <h1 className="text-2xl font-bold text-slate-900">Explainable Multi-Layer Audit Trace</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Step-by-step transparent record showing Deterministic rule execution, AI Reviewer 1, AI Reviewer 2, Consensus logic, and Human decisions.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="relative border-l-2 border-slate-200 ml-4 space-y-6">
          {steps.map((step) => (
            <div key={step.id} className="relative pl-6">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-sky-600 border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      Step {step.stepNumber}
                    </span>
                    <span className="text-sm font-bold text-slate-800">{step.stageName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {step.durationMs}ms
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded text-[11px]">
                      {step.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600">{step.details}</p>

                {step.stepNumber === 6 && (
                  <div className="bg-slate-900 text-slate-200 p-2.5 rounded-lg text-[11px] font-mono mt-2 border border-slate-800">
                    <span className="text-emerald-400 font-bold">DETERMINISTIC_RULE_AUTHORITY:</span> exact_calc(Qty * Rate == InvoicedTotal) =&gt; PASSED (10 records), MISMATCH (2 records with tariff delta). LLMs cannot modify this mathematical result.
                  </div>
                )}

                {step.stepNumber === 7 && (
                  <div className="bg-sky-950 text-sky-200 p-2.5 rounded-lg text-[11px] font-mono mt-2 border border-sky-900">
                    <span className="text-sky-400 font-bold">AI_REVIEWER_1 (Contract Baseline):</span> Verified contract clauses. Flagged unauthorized detention ($180.00 USD) and THC markup ($70.00 USD).
                  </div>
                )}

                {step.stepNumber === 8 && (
                  <div className="bg-indigo-950 text-indigo-200 p-2.5 rounded-lg text-[11px] font-mono mt-2 border border-indigo-900">
                    <span className="text-indigo-400 font-bold">AI_REVIEWER_2 (Operational Blind Review):</span> Evaluated container detention per diem and equipment size. Confirmed unauthorized line items without seeing Reviewer 1 answer.
                  </div>
                )}

                {step.stepNumber === 9 && (
                  <div className="bg-amber-950 text-amber-200 p-2.5 rounded-lg text-[11px] font-mono mt-2 border border-amber-900">
                    <span className="text-amber-400 font-bold">CONSENSUS_ENGINE:</span> Case 1 (Unanimous Mismatch) applied to 2 items. Case 3 (AI Conflict) escalated to Human Review queue.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
