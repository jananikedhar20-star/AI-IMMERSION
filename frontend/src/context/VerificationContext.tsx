import React, { createContext, useContext, useState, useEffect } from "react";
import { VerificationJob, VerificationSummary, Discrepancy, VerificationStep, HumanReviewDecision } from "../types";
import { fetchJobs, fetchJobSummary, fetchDiscrepancies, fetchVerificationTrace, updateDiscrepancyReviewStatus } from "../services/api";

interface VerificationContextType {
  jobs: VerificationJob[];
  currentJobId: string;
  currentSummary: VerificationSummary | null;
  discrepancies: Discrepancy[];
  steps: VerificationStep[];
  isLoading: boolean;
  selectJob: (jobId: string) => void;
  refreshData: () => Promise<void>;
  updateDiscrepancyStatus: (id: string, status: HumanReviewDecision, notes?: string) => Promise<void>;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<VerificationJob[]>([]);
  const [currentJobId, setCurrentJobId] = useState<string>("job-101");
  const [currentSummary, setCurrentSummary] = useState<VerificationSummary | null>(null);
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([]);
  const [steps, setSteps] = useState<VerificationStep[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async (jobId: string) => {
    setIsLoading(true);
    try {
      const allJobs = await fetchJobs();
      setJobs(allJobs);

      const targetId = jobId || (allJobs[0] ? allJobs[0].id : "job-101");
      setCurrentJobId(targetId);

      const [summary, disc, stepList] = await Promise.all([
        fetchJobSummary(targetId),
        fetchDiscrepancies(targetId),
        fetchVerificationTrace(targetId)
      ]);

      setCurrentSummary(summary);
      setDiscrepancies(disc);
      setSteps(stepList);
    } catch (err) {
      console.error("Error loading verification data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentJobId);
  }, [currentJobId]);

  const selectJob = (jobId: string) => {
    setCurrentJobId(jobId);
  };

  const refreshData = async () => {
    await loadData(currentJobId);
  };

  const updateStatus = async (id: string, status: HumanReviewDecision, notes?: string) => {
    await updateDiscrepancyReviewStatus(id, status, notes);
    setDiscrepancies(prev =>
      prev.map(d => {
        if (d.id === id) {
          const finalDec = status === "ACCEPTED" ? "ACCEPTED_BY_HUMAN"
            : status === "QUERY_RAISED" ? "QUERIED_BY_HUMAN"
            : status === "DISMISSED" ? "DISMISSED_BY_HUMAN"
            : d.finalDecision;
          return { ...d, humanReviewStatus: status, finalDecision: finalDec, humanReviewNotes: notes };
        }
        return d;
      })
    );
  };

  return (
    <VerificationContext.Provider
      value={{
        jobs,
        currentJobId,
        currentSummary,
        discrepancies,
        steps,
        isLoading,
        selectJob,
        refreshData,
        updateDiscrepancyStatus: updateStatus
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error("useVerification must be used within a VerificationProvider");
  }
  return context;
};
