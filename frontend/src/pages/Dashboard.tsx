import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  CheckCircle,
  AlertOctagon,
  UserCheck,
  PlusCircle,
  ArrowRight,
  Layers
} from "lucide-react";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/DiscrepancyBadge";
import { useVerification } from "../context/VerificationContext";

export const Dashboard: React.FC = () => {
  const { jobs, selectJob } = useVerification();
  const navigate = useNavigate();

  const totalFiles = jobs.length * 2;
  const verifiedJobs = jobs.filter(j => j.status === "COMPLETED").length;
  const mismatchedJobs = jobs.filter(j => j.mismatchedCount > 0).length;
  const pendingHumanReview = jobs.reduce((acc, curr) => acc + curr.humanReviewCount, 0);

  const handleInspectJob = (jobId: string) => {
    selectJob(jobId);
    navigate("/results");
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-sky-500/20 text-sky-300 text-xs font-semibold px-3 py-1 rounded-full border border-sky-400/30 uppercase tracking-wide flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Multi-Layer Verification Architecture
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
              Deterministic Authority
            </span>
          </div>
          <h1 className="text-2xl font-bold mt-2">Logistics Statement of Account Verification</h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            11-Stage pipeline: Deterministic Rule Engine + Dual Independent AI Reviewers + Consensus Engine + Human Decision Guard.
          </p>
        </div>
        <Link
          to="/upload"
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold px-5 py-2.5 rounded-xl shadow transition"
        >
          <PlusCircle className="w-5 h-5" />
          <span>New Verification</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Files Processed"
          value={totalFiles}
          subtitle="Pricing DBs & Agent SOAs"
          icon={FileText}
          colorClass="text-blue-600 bg-blue-50"
          trend="Synthetic Logistics Datasets"
        />
        <StatCard
          title="Consensus Verified"
          value={verifiedJobs}
          subtitle="Unanimous Pass (Case 2)"
          icon={CheckCircle}
          colorClass="text-emerald-600 bg-emerald-50"
          trend="Immediate Clearance"
        />
        <StatCard
          title="Confirmed Mismatches"
          value={mismatchedJobs}
          subtitle="Unanimous Mismatch (Case 1)"
          icon={AlertOctagon}
          colorClass="text-rose-600 bg-rose-50"
          trend="Dispute Evidence Attached"
        />
        <StatCard
          title="Human Review Queue"
          value={pendingHumanReview}
          subtitle="Disagreement / Conflict Cases"
          icon={UserCheck}
          colorClass="text-amber-600 bg-amber-50"
          trend="Human Authority Guard"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Multi-Layer Verification Jobs</h2>
            <p className="text-xs text-slate-500">Cross-reconciliation audit logs with consensus classifications</p>
          </div>
          <Link
            to="/upload"
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
          >
            Start New Job <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Job Reference</th>
                <th className="px-6 py-3">Consensus Status</th>
                <th className="px-6 py-3">Records Checked</th>
                <th className="px-6 py-3">Matched</th>
                <th className="px-6 py-3">Mismatches</th>
                <th className="px-6 py-3">Human Review</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-mono font-medium text-slate-900">
                    {job.jobCode}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-6 py-4">{job.totalRecords}</td>
                  <td className="px-6 py-4 text-emerald-600 font-semibold">{job.matchedCount}</td>
                  <td className="px-6 py-4">
                    {job.mismatchedCount > 0 ? (
                      <span className="text-rose-600 font-bold">+{job.mismatchedCount}</span>
                    ) : (
                      <span className="text-slate-400">0</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {job.humanReviewCount > 0 ? (
                      <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                        {job.humanReviewCount} cases
                      </span>
                    ) : (
                      <span className="text-emerald-600 text-xs font-semibold">0 pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleInspectJob(job.id)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                    >
                      View Results
                    </button>
                    <button
                      onClick={() => {
                        selectJob(job.id);
                        navigate("/trace");
                      }}
                      className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-semibold rounded-lg transition"
                    >
                      Audit Trace
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
