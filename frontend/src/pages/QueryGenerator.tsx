import React, { useState, useEffect } from "react";
import {
  Mail,
  Copy,
  Check,
  Sparkles
} from "lucide-react";
import { useVerification } from "../context/VerificationContext";
import { generateQueryDraft } from "../services/api";

export const QueryGenerator: React.FC = () => {
  const { currentJobId, discrepancies } = useVerification();
  const [agentName, setAgentName] = useState<string>("Pacific Ocean Logistics Pte Ltd");
  const [tone, setTone] = useState<string>("formal");
  const [copied, setCopied] = useState<boolean>(false);
  const [draft, setDraft] = useState<any>(null);

  const loadDraft = async () => {
    try {
      const res = await generateQueryDraft(currentJobId, agentName);
      setDraft(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDraft();
  }, [currentJobId, agentName]);

  const handleCopy = () => {
    if (draft?.fullDraft) {
      navigator.clipboard.writeText(draft.fullDraft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Mail className="w-6 h-6 text-sky-600" />
          <h1 className="text-2xl font-bold text-slate-900">AI Agent Dispute Query Generator</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Generate formal dispute notices with attached multi-layer verification consensus evidence.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Target Logistics Agent</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500 font-medium"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Communication Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-sky-500 font-medium bg-white"
            >
              <option value="formal">Formal & Polite (Standard)</option>
              <option value="urgent">Urgent / Payment Release Hold</option>
              <option value="concise">Concise Itemized Discrepancy Only</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold uppercase tracking-wider">AI Generated Query Notice Draft</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-xs font-semibold text-sky-300 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Copy Full Notice"}</span>
          </button>
        </div>

        <div className="p-6 space-y-4 font-sans text-sm text-slate-800">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase">Subject: </span>
            <span className="font-semibold text-slate-900">{draft?.subject}</span>
          </div>

          <div className="space-y-3 whitespace-pre-line leading-relaxed text-slate-700">
            <p className="font-semibold text-slate-900">{draft?.greeting}</p>
            <p>{draft?.bodyText}</p>
            
            <div className="my-4 overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="p-2 border border-slate-200">BL / Job Ref</th>
                    <th className="p-2 border border-slate-200">Discrepant Field</th>
                    <th className="p-2 border border-slate-200">Category</th>
                    <th className="p-2 border border-slate-200">Agreed Contract Rate</th>
                    <th className="p-2 border border-slate-200">Invoiced SOA</th>
                    <th className="p-2 border border-slate-200">Disputed Variance</th>
                    <th className="p-2 border border-slate-200">Consensus Status</th>
                  </tr>
                </thead>
                <tbody>
                  {discrepancies.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50 font-mono">
                      <td className="p-2 border border-slate-200 font-bold">{d.recordReference}</td>
                      <td className="p-2 border border-slate-200 font-sans">{d.fieldName}</td>
                      <td className="p-2 border border-slate-200 font-mono text-[11px]">{d.discrepancyCategory}</td>
                      <td className="p-2 border border-slate-200 text-emerald-700">${d.databaseValue} USD</td>
                      <td className="p-2 border border-slate-200 text-rose-700">${d.soaValue} USD</td>
                      <td className="p-2 border border-slate-200 text-rose-600 font-bold">+${d.varianceAmount} USD</td>
                      <td className="p-2 border border-slate-200 font-sans text-[11px]">{d.consensusResult}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>{draft?.closingText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
