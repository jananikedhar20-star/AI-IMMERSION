import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UploadCloud,
  Activity,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  Mail,
  Sliders
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/upload", label: "Upload Verification", icon: UploadCloud },
    { to: "/progress", label: "Verification Progress", icon: Activity },
    { to: "/results", label: "Verification Results", icon: CheckCircle2 },
    { to: "/errors", label: "Error Details", icon: AlertTriangle },
    { to: "/trace", label: "Verification Trace", icon: FileSearch },
    { to: "/query-generator", label: "Query Generator", icon: Mail },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shadow-sm">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Verification Workflow
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sky-50 text-sky-700 font-semibold border-l-4 border-sky-600 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-semibold mb-1">
            <Sliders className="w-3.5 h-3.5 text-sky-600" />
            <span>Field Registry</span>
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            5 Configurable groups (Ref, Shpt, Cargo, Charges, Comm) enabled.
          </p>
        </div>
      </div>
    </aside>
  );
};
