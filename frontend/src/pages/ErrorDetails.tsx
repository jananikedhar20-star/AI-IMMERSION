import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Mail, AlertTriangle, Bot, FileWarning } from "lucide-react";
import { StatusBadge, CategoryBadge } from "../components/DiscrepancyBadge";
import { useVerification } from "../context/VerificationContext";

export const ErrorDetails: React.FC = () => {
  const { discrepancies, updateDiscrepancyStatus } = useVerification();

  const [filterGroup, setFilterGroup] = useState<string>("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const filteredDiscrepancies = discrepancies.filter((d) => {
    const matchGroup =
      filterGroup === "ALL" || d.fieldGroup === filterGroup;

    const matchCategory =
      filterCategory === "ALL" ||
      d.discrepancyCategory === filterCategory;

    return matchGroup && matchCategory;
  });

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return "bg-red-100 text-red-700 border-red-200";
      case "MEDIUM":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "LOW":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              Error Details
            </h1>

            <span className="bg-sky-100 text-sky-800 text-xs font-bold px-2.5 py-1 rounded-full">
              {filteredDiscrepancies.length} Issues
            </span>
          </div>

          <p className="text-sm text-slate-500 mt-1">
            Detailed explanation of every billing discrepancy detected
            during SOA verification.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          {/* FIELD GROUP FILTER */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400 mr-2" />

            <span className="text-xs text-slate-500 mr-2 font-medium">
              Group:
            </span>

            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Groups</option>
              <option value="COMMERCIAL">COMMERCIAL</option>
              <option value="CHARGES">CHARGES</option>
              <option value="IDENTIFICATION">IDENTIFICATION</option>
            </select>
          </div>

          {/* CATEGORY FILTER */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">

            <span className="text-xs text-slate-500 mr-2 font-medium">
              Category:
            </span>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="VALUE_MISMATCH">
                VALUE_MISMATCH
              </option>
              <option value="BUSINESS_RULE_VIOLATION">
                BUSINESS_RULE_VIOLATION
              </option>
              <option value="AI_REVIEW_CONFLICT">
                AI_REVIEW_CONFLICT
              </option>
              <option value="FIELD_MAPPING_UNCERTAIN">
                FIELD_MAPPING_UNCERTAIN
              </option>
              <option value="CALCULATION_ERROR">
                CALCULATION_ERROR
              </option>
            </select>
          </div>

          {/* QUERY BUTTON */}
          <Link
            to="/query-generator"
            className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition"
          >
            <Mail className="w-4 h-4" />
            Generate Query Notice
          </Link>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Total Discrepancies
              </p>

              <p className="text-xl font-bold text-slate-900">
                {discrepancies.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">

            <div className="p-2 bg-amber-50 rounded-lg">
              <FileWarning className="w-5 h-5 text-amber-600" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                High Severity
              </p>

              <p className="text-xl font-bold text-slate-900">
                {
                  discrepancies.filter(
                    (d) => d.severity === "HIGH"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">

            <div className="p-2 bg-sky-50 rounded-lg">
              <Bot className="w-5 h-5 text-sky-600" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Confirmed Mismatches
              </p>

              <p className="text-xl font-bold text-slate-900">
                {
                  discrepancies.filter(
                    (d) => d.consensusResult === "CONFIRMED_MISMATCH"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* DISCREPANCY CARDS */}
      <div className="space-y-4">

        {filteredDiscrepancies.map((d, index) => (

          <div
            key={d.id}
            className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
          >

            {/* CARD HEADER */}
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">

                <div className="flex items-center gap-3">

                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">

                      <span className="font-mono text-xs font-bold text-slate-500">
                        #{index + 1}
                      </span>

                      <span className="font-mono font-bold text-slate-900">
                        {d.recordReference}
                      </span>

                      <span className="text-slate-300">
                        /
                      </span>

                      <span className="font-bold text-slate-900">
                        {d.fieldName}
                      </span>

                    </div>

                    <div className="flex items-center gap-2 mt-1 flex-wrap">

                      <span className="text-[10px] font-semibold text-slate-400 uppercase">
                        {d.fieldGroup}
                      </span>

                      <CategoryBadge
                        category={d.discrepancyCategory}
                      />
                    </div>
                  </div>

                </div>

                <div className="flex items-center gap-2">

                  <span
                    className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${getSeverityClass(
                      d.severity
                    )}`}
                  >
                    {d.severity} SEVERITY
                  </span>

                  <StatusBadge status={d.finalDecision} />

                </div>

              </div>
            </div>

            {/* VALUES */}
            <div className="p-5">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                    Agreed Pricing DB
                  </p>

                  <p className="text-lg font-mono font-bold text-emerald-800 mt-1">
                    ${d.databaseValue}
                  </p>

                  <p className="text-xs text-emerald-600">
                    {d.currency}
                  </p>
                </div>

                <div className="rounded-lg border border-rose-200 bg-rose-50/40 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-rose-600">
                    SOA Invoiced
                  </p>

                  <p className="text-lg font-mono font-bold text-rose-800 mt-1">
                    ${d.soaValue}
                  </p>

                  <p className="text-xs text-rose-600">
                    {d.currency}
                  </p>
                </div>

                <div className="rounded-lg border border-orange-200 bg-orange-50/40 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-orange-600">
                    Variance
                  </p>

                  <p className="text-lg font-mono font-bold text-orange-800 mt-1">
                    +${d.varianceAmount}
                  </p>

                  <p className="text-xs text-orange-600">
                    {d.variancePercent}%
                  </p>
                </div>

              </div>

              {/* EXPLANATION */}
              <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">

                  <div className="flex items-center gap-2 mb-2">
                    <FileWarning className="w-4 h-4 text-slate-500" />

                    <h3 className="text-xs font-bold uppercase tracking-wide text-slate-600">
                      What went wrong
                    </h3>
                  </div>

                  <p className="text-sm text-slate-700 leading-6">
                    {d.ruleDescription ||
                      `${d.fieldName} differs between the agreed pricing and the Agent SOA.`}
                  </p>

                </div>

                <div className="rounded-lg border border-sky-200 bg-sky-50/50 p-4">

                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="w-4 h-4 text-sky-600" />

                    <h3 className="text-xs font-bold uppercase tracking-wide text-sky-700">
                      AI / Verification Explanation
                    </h3>
                  </div>

                  <p className="text-sm text-slate-700 leading-6">
                    {d.aiExplanation ||
                      "No additional AI explanation was provided."}
                  </p>

                </div>

              </div>

              {/* RULE + REVIEW */}
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">

                <div className="border border-slate-200 rounded-lg p-4">

                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Verification Rule
                  </p>

                  <p className="font-mono text-sm font-bold text-slate-800 mt-1">
                    {d.ruleCode}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">

                    <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-mono">
                      Deterministic: {d.deterministicResult}
                    </span>

                    <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-mono">
                      Reviewer 1: {d.reviewer1Result}
                    </span>

                    <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-mono">
                      Reviewer 2: {d.reviewer2Result}
                    </span>

                  </div>

                </div>

                <div className="border border-slate-200 rounded-lg p-4">

                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    Consensus
                  </p>

                  <div className="mt-2">
                    <StatusBadge status={d.consensusResult} />
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    Human review required:{" "}
                    <span className="font-semibold">
                      {d.humanReviewRequired ? "Yes" : "No"}
                    </span>
                  </p>

                </div>

              </div>

              {/* ACTIONS */}
              <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">

                <p className="text-xs text-slate-400">
                  Discrepancy ID:{" "}
                  <span className="font-mono">
                    {d.id}
                  </span>
                </p>

                <div className="flex flex-wrap gap-2">

                  <button
                    onClick={() =>
                      updateDiscrepancyStatus(
                        d.id,
                        "QUERY_RAISED",
                        "Raised query with agent for credit note"
                      )
                    }
                    className={`px-3 py-2 text-xs font-bold rounded-lg transition ${
                      d.humanReviewStatus === "QUERY_RAISED"
                        ? "bg-sky-600 text-white"
                        : "bg-sky-50 text-sky-700 hover:bg-sky-100"
                    }`}
                  >
                    Query Agent
                  </button>

                  <button
                    onClick={() =>
                      updateDiscrepancyStatus(
                        d.id,
                        "ACCEPTED",
                        "Approved as legitimate operational variance"
                      )
                    }
                    className={`px-3 py-2 text-xs font-bold rounded-lg transition ${
                      d.humanReviewStatus === "ACCEPTED"
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      updateDiscrepancyStatus(
                        d.id,
                        "DISMISSED",
                        "Dismissed by checker"
                      )
                    }
                    className={`px-3 py-2 text-xs font-bold rounded-lg transition ${
                      d.humanReviewStatus === "DISMISSED"
                        ? "bg-slate-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Dismiss
                  </button>

                </div>

              </div>

            </div>

          </div>

        ))}

        {filteredDiscrepancies.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto" />

            <p className="font-semibold text-slate-700 mt-3">
              No discrepancies found
            </p>

            <p className="text-xs text-slate-400 mt-1">
              Try changing the filters.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
