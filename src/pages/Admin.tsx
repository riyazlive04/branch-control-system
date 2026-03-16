import React, { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff, RefreshCw, LogOut, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatIST } from "@/utils/formatIST";

// ─── Config ───────────────────────────────────────────────────────────────────

const SUPABASE_URL = "https://lbsiyqbhjatlmqphjitf.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxic2l5cWJoamF0bG1xcGhqaXRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MzYyMTgsImV4cCI6MjA4ODExMjIxOH0.iWUso735ZmnaqI-WxtlSvhboFFPDMRPzETlCN9wzYDI";

// SHA-256 of "admin:Happykid04"
const ADMIN_HASH =
  "c5c316e1cf572dceddc9ae3d624f7a1b2b1efd405e4a9249f4b73005033efb19";

const SESSION_KEY = "sirah_admin_auth";

const WEBHOOK_ATTENDED =
  "https://n8n.srv930949.hstgr.cloud/webhook/meeting-attended";
const WEBHOOK_NOT_ATTENDED =
  "https://n8n.srv930949.hstgr.cloud/webhook/meeting-not-attended";

// ─── Types ────────────────────────────────────────────────────────────────────

type AttendanceStatus = "not_attended" | "attended" | null;

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  country_code: string;
  business_type: string;
  meeting_time: string | null;
  created_at: string;
  attendance_status: AttendanceStatus;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function sha256Hex(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// formatDateTime delegates to shared IST formatter
const formatDateTime = formatIST;

function shortId(uuid: string): string {
  return uuid.replace(/-/g, "").slice(0, 5);
}

function formatPhone(countryCode: string, phone: string): string {
  const code = countryCode?.replace(/^\+/, "") ?? "";
  return code || phone ? `+${code}${phone}` : "—";
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const hash = await sha256Hex(`${username}:${password}`);
    if (hash === ADMIN_HASH) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onLogin();
    } else {
      setError("Invalid username or password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="border border-gray-200 rounded-2xl shadow-sm p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-sm text-gray-500 mt-1">
              Booking Admin · Sirah Digital
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "#16a34a" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // updatingId tracks which row has an in-progress status update
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    const { data } = await supabase
      .from("leads")
      .select(
        "id, name, email, phone, country_code, business_type, meeting_time, created_at, attendance_status"
      )
      .order("created_at", { ascending: false });

    setLeads((data as Lead[]) ?? []);
    if (!silent) setLoading(false);
    else setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateStatus = async (
    lead: Lead,
    clicked: AttendanceStatus
  ) => {
    // Toggle: clicking the active status clears it
    const newStatus: AttendanceStatus =
      lead.attendance_status === clicked ? null : clicked;

    // 1. Optimistic update
    setLeads((prev) =>
      prev.map((l) =>
        l.id === lead.id ? { ...l, attendance_status: newStatus } : l
      )
    );
    setUpdatingId(lead.id);

    // 2. Call edge function (bypasses RLS)
    try {
      const res = await fetch(
        `${SUPABASE_URL}/functions/v1/update-attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            apikey: SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ id: lead.id, attendance_status: newStatus }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error ?? "Update failed");
      }

      // 3. Fire webhook only when setting (not clearing) a status
      if (newStatus) {
        const webhookUrl =
          newStatus === "attended" ? WEBHOOK_ATTENDED : WEBHOOK_NOT_ATTENDED;
        fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            country_code: lead.country_code,
            business_type: lead.business_type,
            meeting_time: lead.meeting_time,
            attendance_status: newStatus,
            calendarLink: "https://branch-control-system.sirahagents.com/",
          }),
        }).catch((e) => console.error("Webhook error:", e));
      }

      // 4. Silent re-fetch to sync DB state
      await fetchLeads(true);
    } catch (err: unknown) {
      // Revert optimistic update
      setLeads((prev) =>
        prev.map((l) =>
          l.id === lead.id
            ? { ...l, attendance_status: lead.attendance_status }
            : l
        )
      );
      alert((err as Error).message ?? "Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9fafb" }}>
      {/* Header */}
      <header
        className="border-b px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: "#111827", borderColor: "#1f2937" }}
      >
        <span className="font-bold text-lg" style={{ color: "#22c55e" }}>
          Booking Admin
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchLeads(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 md:px-8 py-8">
        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Total Bookings
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your strategy session requests
            </p>
          </div>
          <span className="self-start sm:self-auto px-4 py-1.5 rounded-full text-sm font-semibold text-gray-700 border border-gray-300 bg-white whitespace-nowrap">
            Total: {leads.length}
          </span>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm">Loading…</span>
            </div>
          ) : leads.length === 0 ? (
            <div className="flex items-center justify-center py-20 text-sm text-gray-500">
              No bookings yet.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    "S.NO",
                    "ID",
                    "NAME",
                    "EMAIL",
                    "PHONE",
                    "DATE TIME",
                    "TYPE",
                    "ACTIONS",
                  ].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => {
                  const isUpdating = updatingId === lead.id;
                  return (
                    <tr
                      key={lead.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      {/* S.NO */}
                      <td className="px-4 py-3 text-gray-500">{i + 1}</td>

                      {/* ID */}
                      <td className="px-4 py-3 font-mono text-gray-500 text-xs">
                        {shortId(lead.id)}
                      </td>

                      {/* NAME */}
                      <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                        {lead.name || "—"}
                      </td>

                      {/* EMAIL */}
                      <td className="px-4 py-3 text-gray-600">
                        {lead.email || "—"}
                      </td>

                      {/* PHONE */}
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {formatPhone(lead.country_code, lead.phone)}
                      </td>

                      {/* DATE TIME */}
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {formatDateTime(lead.meeting_time ?? lead.created_at)}
                      </td>

                      {/* TYPE */}
                      <td className="px-4 py-3 text-gray-600">
                        {lead.business_type || "—"}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* Not Attended */}
                          <button
                            disabled={isUpdating}
                            onClick={() => updateStatus(lead, "not_attended")}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            style={
                              lead.attendance_status === "not_attended"
                                ? {
                                    backgroundColor: "#2563eb",
                                    color: "#ffffff",
                                    borderColor: "#2563eb",
                                  }
                                : {
                                    backgroundColor: "#ffffff",
                                    color: "#374151",
                                    borderColor: "#d1d5db",
                                  }
                            }
                          >
                            Not Attended
                          </button>

                          {/* Attended */}
                          <button
                            disabled={isUpdating}
                            onClick={() => updateStatus(lead, "attended")}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            style={
                              lead.attendance_status === "attended"
                                ? {
                                    backgroundColor: "#16a34a",
                                    color: "#ffffff",
                                    borderColor: "#16a34a",
                                  }
                                : {
                                    backgroundColor: "#ffffff",
                                    color: "#374151",
                                    borderColor: "#d1d5db",
                                  }
                            }
                          >
                            Attended
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

// ─── Admin (root) ─────────────────────────────────────────────────────────────

const Admin: React.FC = () => {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "1"
  );

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  return <Dashboard onLogout={handleLogout} />;
};

export default Admin;
