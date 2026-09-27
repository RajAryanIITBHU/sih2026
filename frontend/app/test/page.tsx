"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

interface Asset {
  asset_id: string;
  name: string;
  department: string;
  asset_type: string;
  track_id: string;
  location_km: number;
  health_score: number;
  failure_probability: number;
  rul_days: number;
  criticality: number;
  overdue_days: number;
  priority_score: number;
  priority_level: string;
  updated_at?: string;
}

interface MaintenanceRequest {
  request_id: string;
  source_system: string;
  department: string;
  asset_id: string;
  track_id: string;
  description: string;
  requested_date: string;
  preferred_window_start: string;
  preferred_window_end: string;
  duration_minutes: number;
  priority_score: number;
  urgency: string;
  status: string;
  created_at?: string;
}

interface BlockRecommendation {
  recommendation_id: string;
  track_id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  participating_departments: string[];
  maintenance_request_ids: string[];
  expected_delay_minutes: number;
  status: string;
  reasons: string[];
  created_at?: string;
}

export default function DashboardPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [recommendations, setRecommendations] = useState<BlockRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [optimizing, setOptimizing] = useState<boolean>(false);
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const notify = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [assetsRes, reqsRes, recsRes] = await Promise.all([
        fetch(`${API_BASE}/assets`),
        fetch(`${API_BASE}/maintenance/requests`),
        fetch(`${API_BASE}/recommendations`),
      ]);

      if (assetsRes.ok && reqsRes.ok && recsRes.ok) {
        const [assetsData, reqsData, recsData] = await Promise.all([
          assetsRes.json(),
          reqsRes.json(),
          recsRes.json(),
        ]);
        setAssets(assetsData);
        setRequests(reqsData);
        setRecommendations(recsData);
        setApiConnected(true);
      } else {
        setApiConnected(false);
      }
    } catch (err) {
      console.error("Failed to fetch API data:", err);
      setApiConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setActionLoading(id);
      const res = await fetch(`${API_BASE}/recommendations/${id}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        notify(`Possession recommendation ${id} approved successfully!`);
        await loadData();
      } else {
        notify(`Failed to approve ${id}`, "error");
      }
    } catch (e) {
      notify("Network error on approval", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoading(id);
      const res = await fetch(`${API_BASE}/recommendations/${id}/reject`, {
        method: "POST",
      });
      if (res.ok) {
        notify(`Possession recommendation ${id} rejected.`, "success");
        await loadData();
      } else {
        notify(`Failed to reject ${id}`, "error");
      }
    } catch (e) {
      notify("Network error on reject", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRunOptimizer = async () => {
    try {
      setOptimizing(true);
      const res = await fetch(`${API_BASE}/optimize`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        notify(`CP-SAT Solver generated ${data.length} optimized possession windows!`);
        await loadData();
      } else {
        notify("Optimizer run failed", "error");
      }
    } catch (e) {
      notify("Error executing optimizer", "error");
    } finally {
      setOptimizing(false);
    }
  };

  const handleSimulateStorm = async (assetId: string) => {
    try {
      const res = await fetch(`${API_BASE}/events/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset_id: assetId,
          health: 22.5,
          vibration: 10.2,
          temperature: 49.0,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        notify(`Simulated storm impact on ${assetId}: Health dropped to 22.5%. Auto-generated maintenance possession!`);
        await loadData();
      }
    } catch (e) {
      notify("Error simulating storm telemetry", "error");
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (health >= 55) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    return "bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse";
  };

  const getPriorityBadge = (level: string) => {
    switch (level?.toUpperCase()) {
      case "CRITICAL":
        return "bg-red-950 text-red-400 border border-red-700 font-bold";
      case "HIGH":
        return "bg-orange-950 text-orange-400 border border-orange-700 font-semibold";
      case "MEDIUM":
        return "bg-amber-950 text-amber-400 border border-amber-800";
      default:
        return "bg-emerald-950 text-emerald-400 border border-emerald-800";
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-cyan-400">⚡ RailSync</span>
              <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                SIH PS-26027
              </span>
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                apiConnected
                  ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                  : "bg-rose-950/80 text-rose-400 border-rose-800"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  apiConnected ? "bg-emerald-400 animate-ping" : "bg-rose-400"
                }`}
              />
              {apiConnected ? "Core API Live" : "API Offline"}
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Corridor: <span className="text-slate-200 font-medium">New Delhi (NDLS) → Bareilly (BE) → Shahjahanpur (SPN)</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSimulateStorm("AST004")}
            className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Inject degradation telemetry into Ganga Bridge Pier to simulate a severe storm"
          >
            🌧️ Simulate Storm (AST004)
          </button>
          <button
            onClick={handleRunOptimizer}
            disabled={optimizing}
            className="px-4 py-2 text-xs md:text-sm font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white shadow-lg shadow-cyan-900/30 transition flex items-center gap-2"
          >
            {optimizing ? (
              <>
                <span className="animate-spin">⚙️</span> Solving CP-SAT...
              </>
            ) : (
              <>
                <span>⚡</span> Run CP-SAT Optimizer
              </>
            )}
          </button>
        </div>
      </header>

      {/* Alert / Notification Banner */}
      {notification && (
        <div
          className={`p-3 rounded-lg text-sm border flex items-center justify-between ${
            notification.type === "success"
              ? "bg-emerald-950/80 text-emerald-200 border-emerald-700"
              : "bg-rose-950/80 text-rose-200 border-rose-700"
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-xs opacity-75 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* Main 3-Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Panel 1: Assets Monitor (5 Cols) */}
        <section className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span>📍</span> Fixed Infrastructure Assets ({assets.length})
            </h2>
            <button
              onClick={loadData}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto max-h-[440px] overflow-y-auto pr-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Asset</th>
                  <th className="py-2.5 px-3">Dept</th>
                  <th className="py-2.5 px-3">Health</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {assets.map((asset) => (
                  <tr key={asset.asset_id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 font-medium text-white">
                      <div className="font-mono text-cyan-400 text-[11px]">{asset.asset_id}</div>
                      <div className="text-[11px] text-slate-300 truncate max-w-[150px]" title={asset.name}>
                        {asset.name}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                        {asset.department}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono border ${getHealthColor(
                          asset.health_score
                        )}`}
                      >
                        {asset.health_score.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] ${getPriorityBadge(
                          asset.priority_level
                        )}`}
                      >
                        {asset.priority_score > 0 ? `${asset.priority_score.toFixed(0)} - ` : ""}
                        {asset.priority_level}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        onClick={() => handleSimulateStorm(asset.asset_id)}
                        className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Simulate health drop"
                      >
                        Degrade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Panel 2: Maintenance Requests (6 Cols) */}
        <section className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span>📋</span> Maintenance Possession Queue ({requests.length})
            </h2>
            <span className="text-xs text-slate-400">TMS / SMMS / TDMS</span>
          </div>

          <div className="overflow-x-auto max-h-[440px] overflow-y-auto pr-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Req ID</th>
                  <th className="py-2.5 px-3">Track</th>
                  <th className="py-2.5 px-3">Dept</th>
                  <th className="py-2.5 px-3">Window</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {requests.map((req) => (
                  <tr key={req.request_id} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-3 font-mono text-[11px] text-cyan-400">
                      <div>{req.request_id}</div>
                      <div className="text-[10px] text-slate-400">{req.source_system}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">{req.track_id}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] text-slate-300">{req.department}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[10px] text-slate-400">
                      {req.preferred_window_start} - {req.preferred_window_end} ({req.duration_minutes}m)
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${getPriorityBadge(
                          req.urgency
                        )}`}
                      >
                        {req.priority_score.toFixed(0)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          req.status === "APPROVED"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : req.status === "SCHEDULED"
                            ? "bg-cyan-950 text-cyan-400 border border-cyan-800"
                            : "bg-slate-800 text-amber-400 border border-amber-900/50"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Panel 3: Recommended Blocks (Full Width) */}
      <section className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <span>🤖</span> CP-SAT Optimized Possession Blocks ({recommendations.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-department bundled closures aligned with train timetable and crew schedules. Controller review required.
            </p>
          </div>
          {recommendations.length === 0 && (
            <button
              onClick={handleRunOptimizer}
              className="text-xs px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white transition"
            >
              Generate Blocks with CP-SAT
            </button>
          )}
        </div>

        {recommendations.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-lg">
            No active possession recommendations. Click "Run CP-SAT Optimizer" above to compute optimal windows.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((rec) => {
              const startDate = new Date(rec.start_time);
              const endDate = new Date(rec.end_time);
              const timeString = `${startDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })} – ${endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

              return (
                <div
                  key={rec.recommendation_id}
                  className={`p-4 rounded-lg border transition space-y-3 flex flex-col justify-between ${
                    rec.status === "APPROVED"
                      ? "bg-emerald-950/20 border-emerald-800/60"
                      : rec.status === "REJECTED"
                      ? "bg-rose-950/20 border-rose-900/40 opacity-60"
                      : "bg-slate-800/50 border-slate-700/80 hover:border-slate-600"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          {rec.recommendation_id}
                        </span>
                        <div className="text-xs font-medium text-slate-300">
                          Corridor Track: <span className="text-white font-mono">{rec.track_id}</span>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          rec.status === "APPROVED"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : rec.status === "REJECTED"
                            ? "bg-rose-950 text-rose-400 border border-rose-800"
                            : "bg-amber-950 text-amber-400 border border-amber-800"
                        }`}
                      >
                        {rec.status}
                      </span>
                    </div>

                    <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800 space-y-1">
                      <div className="text-xs text-slate-400">Possession Window:</div>
                      <div className="text-sm font-bold text-white font-mono">{timeString}</div>
                      <div className="text-[11px] text-slate-400">
                        Duration: <span className="text-slate-200 font-medium">{rec.duration_minutes} mins</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Participating Departments:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {rec.participating_departments.map((dept) => (
                          <span
                            key={dept}
                            className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800"
                          >
                            ✓ {dept}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Optimizer Reasons:
                      </div>
                      <ul className="text-[11px] text-slate-400 space-y-0.5">
                        {rec.reasons.map((r, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <span className="text-cyan-400">▪</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Approve / Reject Controls */}
                  <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                    {rec.status === "PENDING" ? (
                      <>
                        <button
                          onClick={() => handleApprove(rec.recommendation_id)}
                          disabled={actionLoading === rec.recommendation_id}
                          className="flex-1 py-1.5 px-3 rounded text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow shadow-emerald-950 disabled:opacity-50"
                        >
                          {actionLoading === rec.recommendation_id ? "..." : "Approve"}
                        </button>
                        <button
                          onClick={() => handleReject(rec.recommendation_id)}
                          disabled={actionLoading === rec.recommendation_id}
                          className="py-1.5 px-3 rounded text-xs font-medium bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-800 transition disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <div className="w-full text-center text-xs py-1 text-slate-500 font-medium">
                        Action Recorded ({rec.status})
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
