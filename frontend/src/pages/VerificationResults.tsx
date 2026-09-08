import React from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Mail,
  ArrowRight
} from "lucide-react";
import { StatusBadge, CategoryBadge } from "../components/DiscrepancyBadge";
import { useVerification } from "../context/VerificationContext";

export const VerificationResults: React.FC = () => {
  const { currentSummary, discrepancies } = useVerification();

  const summary = currentSummary || {
    jobCode: "JOB-2026-0801",
    status: "REQUIRES_REVIEW",
    totalRecords: 12,
    matchedCount: 10,
    mismatchedCount: 2,
    missingCount: 0,
    extraCount: 0,
    duplicateCount: 0,
    humanReviewCount: 2,
    totalDisputedAmount: 350.00,
    currency: "USD",
    summaryNotes: "Multi-Layer Reconciliation complete. 2 confirmed mismatches (Case 1) and 2 cases requiring human review (Cases 3 & 4)."
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Multi-Layer Verification Results</h1>
            <StatusBadge status={summary.status} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Job Code: <span className="font-mono font-semibold text-slate-800">{summary.jobCode}</span> • Deterministic Rules + Dual AI Consensus Evaluated.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/errors"
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Discrepancy Decision Matrix ({summary.humanReviewCount})</span>
          </Link>
          <Link
            to="/query-generator"
            className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition"
          >
            <Mail className="w-4 h-4" />
            <span>Generate Agent Query</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-slate-500 uppercase">Records Checked</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{summary.totalRecords}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-emerald-700 uppercase">Verified (Case 2)</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{summary.matchedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-rose-700 uppercase">Confirmed Mismatch (Case 1)</p>
          <p className="text-2xl font-bold text-rose-700 mt-1">{summary.mismatchedCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/20 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-amber-800 uppercase">Human Review (Cases 3-4)</p>
          <p className="text-2xl font-bold text-amber-800 mt-1">{summary.humanReviewCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-slate-500 uppercase">Extra / Unquoted</p>
          <p className="text-2xl font-bold text-slate-700 mt-1">{summary.extraCount}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-sm text-center">
          <p className="text-[11px] font-semibold text-rose-700 uppercase">Disputed Variance</p>
          <p className="text-2xl font-bold text-rose-700 mt-1">${summary.totalDisputedAmount} <span className="text-xs font-normal">USD</span></p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Multi-Layer Verified Discrepancies</h2>
            <p className="text-xs text-slate-500">Every detected item with Deterministic Rule, AI Reviewer 1, Reviewer 2, and Consensus Status.</p>
          </div>
          <Link to="/errors" className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1">
            Open Full Decision Matrix <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {discrepancies.map((d) => (
            <div key={d.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {d.recordReference}
                  </span>
                  <span className="text-sm font-bold text-slate-800">{d.fieldName}</span>
                  <CategoryBadge category={d.discrepancyCategory} />
                  <StatusBadge status={d.consensusResult} />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 font-mono">
                  <span>Deterministic: <b className={d.deterministicResult === "MISMATCH" ? "text-rose-600" : "text-emerald-600"}>{d.deterministicResult}</b></span>
                  <span>•</span>
                  <span>AI Reviewer 1: <b className={d.reviewer1Result === "MISMATCH" ? "text-rose-600" : "text-emerald-600"}>{d.reviewer1Result}</b></span>
                  <span>•</span>
                  <span>AI Reviewer 2: <b className={d.reviewer2Result === "MISMATCH" ? "text-rose-600" : "text-emerald-600"}>{d.reviewer2Result}</b></span>
                </div>

                <p className="text-xs text-slate-600">{d.ruleDescription}</p>
                <p className="text-xs text-sky-800 font-medium bg-sky-50 p-2 rounded border border-sky-100">
                  <span className="font-semibold">Consensus Reasoning:</span> {d.aiExplanation}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs text-slate-500">Agreed vs SOA</div>
                <div className="text-sm font-bold text-slate-900">
                  ${d.databaseValue} <span className="text-slate-400 font-normal">vs</span> <span className="text-rose-600">${d.soaValue}</span>
                </div>
                <div className="text-xs font-bold text-rose-600">
                  Variance: +${d.varianceAmount} {d.currency}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
