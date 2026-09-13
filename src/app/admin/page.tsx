"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ThemeSettingsModal from "@/components/ThemeSettingsModal";
import AmbientBackgroundGrid from "@/components/AmbientBackgroundGrid";
import type { Lang } from "@/lib/report-types";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 86400000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  try {
    localStorage.setItem(name, value);
  } catch (e) {}
}

interface PendingReport {
  id: number;
  org_name: string;
  scam_channel: string;
  proof_text: string;
  proof_image: string | null;
  reporter_contact: string;
  status: string;
  created_at: string;
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reports, setReports] = useState<PendingReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const [language, setLanguage] = useState<Lang>("en");
  const [isDark, setIsDark] = useState(true);
  const [palette, setPalette] = useState("mono");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const savedMode = getCookie("app_mode") || localStorage.getItem("app_mode");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedMode ? savedMode === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", shouldBeDark);
    setIsDark(shouldBeDark);

    const savedPalette = getCookie("app_palette") || localStorage.getItem("app_palette") || "mono";
    setPalette(savedPalette);
    document.documentElement.setAttribute("data-palette", savedPalette);

    const savedLang = (getCookie("app_language") || localStorage.getItem("app_language")) as Lang;
    if (savedLang && (savedLang === "en" || savedLang === "ur" || savedLang === "roman_ur")) {
      setLanguage(savedLang);
    }
  }, []);

  const handlePaletteChange = (p: string) => {
    setPalette(p);
    document.documentElement.setAttribute("data-palette", p);
    setCookie("app_palette", p);
  };

  const toggleTheme = () => {
    const newTheme = !document.documentElement.classList.contains("dark");
    const modeStr = newTheme ? "dark" : "light";

    const applyTheme = () => {
      document.documentElement.classList.toggle("dark", newTheme);
      setIsDark(newTheme);
      setCookie("app_mode", modeStr);
    };

    if (!document.startViewTransition) {
      applyTheme();
      return;
    }

    document.startViewTransition(() => {
      applyTheme();
    });
  };

  // Editing state map for report cards
  const [editedFields, setEditedFields] = useState<Record<number, {
    org_name: string;
    scam_channel: string;
    proof_text: string;
    remove_media: boolean;
  }>>({});

  const fetchReports = async (key: string) => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/admin/pending-reports?admin_key=${encodeURIComponent(key)}`);
      if (!res.ok) {
        throw new Error("Invalid key or unauthorized");
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setReports(data);
        setIsAuthenticated(true);

        const initialEditMap: Record<number, any> = {};
        data.forEach((r: PendingReport) => {
          initialEditMap[r.id] = {
            org_name: r.org_name,
            scam_channel: r.scam_channel || "",
            proof_text: r.proof_text,
            remove_media: false
          };
        });
        setEditedFields(initialEditMap);
      } else if (data.status === "error") {
        setErrorMsg(data.message || "Unauthorized key");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to authenticate or fetch moderation queue.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;
    fetchReports(adminKey);
  };

  const handleFieldChange = (id: number, field: string, value: any) => {
    setEditedFields(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleAction = async (reportId: number, action: "approve" | "reject") => {
    setLoading(true);
    setStatusMsg("");

    const editState = editedFields[reportId] || {};

    try {
      const res = await fetch("/api/admin/verify-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_key: adminKey,
          report_id: reportId,
          action: action,
          edited_org_name: editState.org_name,
          edited_scam_channel: editState.scam_channel,
          edited_proof_text: editState.proof_text,
          remove_media: editState.remove_media
        })
      });

      const data = await res.json();
      if (data.status === "success") {
        setStatusMsg(`Report #${reportId} successfully ${action}d & indexed into database.`);
        setReports(prev => prev.filter(r => r.id !== reportId));
      } else {
        alert("Action Error: " + (data.message || "Failed"));
      }
    } catch (err) {
      console.error(err);
      alert("Network Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans relative overflow-x-hidden">
      <AmbientBackgroundGrid />

      {/* Ambient Radial Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[var(--accent-color)]/5 blur-3xl pointer-events-none z-0" />

      <ThemeSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentPalette={palette}
        onSelectPalette={handlePaletteChange}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* UNIVERSAL HEADER NAVBAR */}
      <Navbar
        language={language}
        onLanguageChange={(l) => {
          setLanguage(l);
          setCookie("app_language", l);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleTheme={toggleTheme}
        isDark={isDark}
      />

      {/* MAIN CONTENT AREA */}
      <main className="w-full max-w-3xl sm:max-w-4xl z-20 my-auto py-6">
        {!isAuthenticated ? (
          <div className="brutal-card bg-[var(--card-bg)] border-2 sm:border-4 border-[var(--border-color)] p-6 sm:p-8 shadow-[8px_8px_0_var(--shadow-color)] max-w-md mx-auto space-y-5 fade-rise">
            <div className="border-b-2 border-dashed border-[var(--border-color)] pb-4 space-y-1">
              <span className="font-mono font-bold text-xs uppercase tracking-widest text-[var(--foreground)] border-l-2 border-[var(--foreground)] pl-2 inline-block">
                ADMIN MODERATION // AUTHENTICATION
              </span>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[var(--foreground)] uppercase tracking-normal">
                Admin Authentication
              </h1>
              <p className="text-xs font-mono opacity-70">
                Enter your secret key to access pending community threat submissions.
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {errorMsg && (
                <div className="border-2 border-red-500 bg-red-500/10 p-3 text-red-500 font-mono text-xs font-bold uppercase tracking-wider">
                  ERR: {errorMsg}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--foreground)] opacity-85">
                  Secret Key
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  placeholder="Enter Admin Secret Key..."
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="bg-[var(--input-bg)] border-2 border-[var(--border-color)] text-[var(--foreground)] text-sm p-3.5 font-mono focus:border-[var(--foreground)] focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 brutal-btn bg-[var(--foreground)] text-[var(--background)] font-mono font-bold text-xs sm:text-sm tracking-widest border-2 border-[var(--border-color)] shadow-[4px_4px_0_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] hover:opacity-90 transition-all cursor-pointer uppercase disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
              >
                <span>{loading ? "AUTHENTICATING..." : "ACCESS MODERATION QUEUE →"}</span>
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-6 fade-rise">
            {/* QUEUE HEADER */}
            <div className="brutal-card bg-[var(--card-bg)] border-2 sm:border-4 border-[var(--border-color)] p-5 sm:p-6 shadow-[6px_6px_0_var(--shadow-color)] flex flex-wrap justify-between items-center gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-xs uppercase tracking-widest text-emerald-500 border-l-2 border-emerald-500 pl-2">
                    QUEUE ACTIVE
                  </span>
                  <span className="text-xs font-mono font-bold text-[var(--foreground)] opacity-70">
                    {reports.length} PENDING SUBMISSIONS
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-serif font-bold uppercase text-[var(--foreground)] mt-1.5 tracking-normal">
                  Threat Index Moderation
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchReports(adminKey)}
                  disabled={loading}
                  className="px-4 py-2 font-mono font-bold text-xs border-2 border-[var(--border-color)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] shadow-[2px_2px_0_var(--shadow-color)] transition-all cursor-pointer uppercase"
                >
                  ↺ Refresh Queue
                </button>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="px-3 py-2 font-mono font-bold text-xs border-2 border-red-600 text-red-500 hover:bg-red-600 hover:text-white transition-all cursor-pointer uppercase"
                >
                  Lock Session
                </button>
              </div>
            </div>

            {statusMsg && (
              <div className="border-2 border-emerald-500 bg-emerald-500/10 p-3.5 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
                ✓ {statusMsg}
              </div>
            )}

            {reports.length === 0 ? (
              <div className="brutal-card border-2 border-dashed border-[var(--border-color)] bg-[var(--card-bg)] p-10 text-center text-xs font-mono opacity-70 space-y-2">
                <p className="font-bold text-sm text-[var(--foreground)] uppercase">Queue Clear</p>
                <p>No pending community scam reports requiring verification right now.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {reports.map((rep) => {
                  const state = editedFields[rep.id] || {
                    org_name: rep.org_name,
                    scam_channel: rep.scam_channel || "",
                    proof_text: rep.proof_text,
                    remove_media: false
                  };

                  return (
                    <div
                      key={rep.id}
                      className="brutal-card bg-[var(--card-bg)] border-2 sm:border-4 border-[var(--border-color)] p-5 sm:p-7 shadow-[6px_6px_0_var(--shadow-color)] flex flex-col gap-5"
                    >
                      {/* CARD HEADER */}
                      <div className="flex flex-wrap justify-between items-start border-b-2 border-dashed border-[var(--border-color)] pb-4 gap-3">
                        <div className="flex-1 min-w-[240px]">
                          <span className="text-[10px] font-mono font-bold opacity-60 block uppercase tracking-widest">
                            REPORT ID #{rep.id} (EDITABLE DETAILS)
                          </span>
                          <input
                            type="text"
                            value={state.org_name}
                            onChange={(e) => handleFieldChange(rep.id, "org_name", e.target.value)}
                            className="text-lg font-serif font-bold uppercase text-[var(--foreground)] bg-[var(--input-bg)] border-2 border-[var(--border-color)] p-2 w-full font-mono mt-1 focus:border-emerald-500 focus:outline-none"
                            title="Edit Target Organization Name"
                          />
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 bg-[var(--background)] border border-[var(--border-color)] font-mono text-[10px] font-bold opacity-80 block">
                            {new Date(rep.created_at).toLocaleString()}
                          </span>
                          {rep.reporter_contact && (
                            <span className="text-[10px] font-mono opacity-70 block mt-1">
                              Contact: {rep.reporter_contact}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* EDITABLE FIELDS GRID */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-3 font-mono text-xs">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest block opacity-70 mb-1">
                              Scam Channel / Payment Handles
                            </span>
                            <input
                              type="text"
                              value={state.scam_channel}
                              onChange={(e) => handleFieldChange(rep.id, "scam_channel", e.target.value)}
                              placeholder="e.g. EasyPaisa 0300-1234567, WhatsApp"
                              className="font-mono text-xs text-[var(--foreground)] bg-[var(--input-bg)] p-2.5 border-2 border-[var(--border-color)] w-full focus:outline-none"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest block opacity-70 mb-1">
                              Proof Details & Statement
                            </span>
                            <textarea
                              rows={4}
                              value={state.proof_text}
                              onChange={(e) => handleFieldChange(rep.id, "proof_text", e.target.value)}
                              className="bg-[var(--input-bg)] p-2.5 border-2 border-[var(--border-color)] text-xs font-mono w-full leading-relaxed resize-none focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* ATTACHMENT MODERATION */}
                        <div className="flex flex-col gap-2 font-mono text-xs">
                          <span className="text-[10px] font-bold uppercase tracking-widest block opacity-70">
                            Attachment Moderation
                          </span>

                          {rep.proof_image && !state.remove_media ? (
                            <div className="border-2 border-[var(--border-color)] bg-[var(--input-bg)] p-2 flex flex-col items-center gap-2">
                              <img
                                src={rep.proof_image}
                                alt="Proof Screenshot"
                                className="w-full h-32 object-contain border border-[var(--border-color)] cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => {
                                  const w = window.open("");
                                  w?.document.write(`<img src="${rep.proof_image}"/>`);
                                }}
                                title="Click to open full resolution image"
                              />
                              <button
                                type="button"
                                onClick={() => handleFieldChange(rep.id, "remove_media", true)}
                                className="text-[10px] font-mono font-bold text-rose-500 border border-rose-500/50 bg-rose-500/10 px-3 py-1 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                              >
                                ✕ STRIP ATTACHMENT BEFORE APPROVAL
                              </button>
                            </div>
                          ) : state.remove_media ? (
                            <div className="border-2 border-dashed border-rose-500/50 bg-rose-500/10 p-4 text-center text-xs font-mono text-rose-400 flex flex-col items-center gap-2 my-auto">
                              <span className="font-bold">[ ATTACHMENT STRIPPED ]</span>
                              <button
                                type="button"
                                onClick={() => handleFieldChange(rep.id, "remove_media", false)}
                                className="text-[10px] font-mono text-[var(--foreground)] underline cursor-pointer"
                              >
                                Restore Attachment
                              </button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-[var(--border-color)] bg-[var(--input-bg)] p-6 text-center text-xs font-mono opacity-50 my-auto">
                              No Screenshot Attached
                            </div>
                          )}
                        </div>
                      </div>

                      {/* MODERATION ACTION BUTTONS */}
                      <div className="flex flex-wrap gap-3 border-t-2 border-dashed border-[var(--border-color)] pt-4">
                        <button
                          type="button"
                          onClick={() => handleAction(rep.id, "approve")}
                          disabled={loading}
                          className="flex-1 py-3 px-5 brutal-btn bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs sm:text-sm tracking-wider border-2 border-black shadow-[3px_3px_0_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer uppercase disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <span>✓ APPROVE & INDEX IN THREAT DATABASE</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAction(rep.id, "reject")}
                          disabled={loading}
                          className="py-3 px-5 brutal-btn bg-[var(--background)] text-[var(--foreground)] font-mono font-bold text-xs tracking-wider border-2 border-[var(--border-color)] shadow-[3px_3px_0_var(--shadow-color)] hover:bg-red-600 hover:text-white transition-all cursor-pointer uppercase disabled:opacity-50"
                        >
                          <span>✕ REJECT REPORT</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-5xl z-20 mt-12 pt-6 border-t-2 border-[var(--border-color)] text-center text-xs font-mono opacity-70">
        ScamLess Admin Moderation Queue &copy; 2026
      </footer>
    </div>
  );
}
