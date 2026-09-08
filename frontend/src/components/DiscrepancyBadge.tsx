import React from "react";

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case "CONFIRMED_MISMATCH":
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">Confirmed Mismatch</span>;
    case "VERIFIED":
    case "COMPLETED":
    case "VERIFIED_MATCH":
    case "PASS":
    case "SUCCESS":
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">Verified</span>;
    case "HUMAN_REVIEW_REQUIRED":
    case "REQUIRES_REVIEW":
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">Human Review Required</span>;
    case "QUERY_RAISED":
    case "QUERIED_BY_HUMAN":
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-300">Query Raised</span>;
    case "ACCEPTED":
    case "ACCEPTED_BY_HUMAN":
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">Accepted by Checker</span>;
    case "DISMISSED":
    case "DISMISSED_BY_HUMAN":
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">Dismissed</span>;
    case "PENDING":
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Pending Review</span>;
    case "MISMATCH":
    case "CRITICAL":
    case "HIGH":
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">{status}</span>;
    default:
      return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">{status}</span>;
  }
};

export const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-tight bg-slate-100 text-slate-700 border border-slate-200">
      {category}
    </span>
  );
};
