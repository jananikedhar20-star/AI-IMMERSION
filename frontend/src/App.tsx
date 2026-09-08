import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { UploadVerification } from "./pages/UploadVerification";
import { VerificationProgress } from "./pages/VerificationProgress";
import { VerificationResults } from "./pages/VerificationResults";
import { ErrorDetails } from "./pages/ErrorDetails";
import { VerificationTrace } from "./pages/VerificationTrace";
import { QueryGenerator } from "./pages/QueryGenerator";
import { VerificationProvider } from "./context/VerificationContext";

export const App: React.FC = () => {
  return (
    <VerificationProvider>
      <Router>
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/upload" element={<UploadVerification />} />
                <Route path="/progress" element={<VerificationProgress />} />
                <Route path="/results" element={<VerificationResults />} />
                <Route path="/errors" element={<ErrorDetails />} />
                <Route path="/trace" element={<VerificationTrace />} />
                <Route path="/query-generator" element={<QueryGenerator />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </VerificationProvider>
  );
};

export default App;
