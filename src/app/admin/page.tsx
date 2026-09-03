"use client";

import React, { useState } from "react";
import Link from "next/link";

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

  // Editing state map for report cards
  const [editedFields, setEditedFields] = useState<Record<number, {
    org_name: string;
    scam_channel: string;
    proof_text: string;
    remove_media: boolean;
  }>>({});

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/admin/pending-reports?admin_key=${encodeURIComponent(adminKey)}`);
      if (!res.ok) {
        throw new Error("Invalid key or unauthorized");
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setReports(data);
        setIsAuthenticated(true);

        // Initialize editable states
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
      setErrorMsg("Failed to authenticate or fetch queue.");
    } finally {
      setLoading(false);
    }
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
        setStatusMsg(`Report #${reportId} successfully ${action}d & indexed!`);
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
      
      {/* HEADER NAVBAR */}
      <header className="w-full max-w-5xl z-30 mb-8 brutal-card bg-[var(--card-bg)] border-4 border-[var(--border-color)] p-4 shadow-[4px_4px_0_var(--shadow-color)]">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[var(--foreground)]">
              ScamLess
            </span>
            <span className="font-mono text-xs opacity-60 hidden sm:inline">[ADMIN MODERATION QUEUE]</span>
          </Link>

          <Link
            href="/"
            className="px-3 py-1.5 text-xs font-mono font-bold border-2 border-[var(--border-color)] bg-[var(--card-bg)] shadow-[3px_3px_0_var(--shadow-color)] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all duration-150 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
          >
            &larr; SCANNER
          </Link>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="w-full max-w-3xl z-20 my-auto">
        {!isAuthenticated ? (
          <div className="brutal-card bg-[var(--card-bg)] border-4 border-[var(--border-color)] p-6 sm:p-8 shadow-[8px_8px_0_var(--shadow-color)] max-w-md mx-auto">
            <span className="font-mono text-xs font-bold uppercase tracking-widest block opacity-70">
              ADMIN AUTHENTICATION
            </span>
            <h1 className="text-xl font-black uppercase text-[var(--foreground)] mt-2">
              ENTER ADMIN KEY
            </h1>

            <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
              {errorMsg && (
                <div className="border-2 border-red-500 p-2 text-red-500 font-mono text-xs">
                  ERROR: {errorMsg}
                </div>
              )}
              <input
                type="password"
                required
                placeholder="Admin Secret Key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="bg-[var(--background)] border-2 border-[var(--border-color)] text-[var(--foreground)] text-sm p-3 font-mono focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[var(--foreground)] text-[var(--background)] font-black text-xs p-3 border-2 border-[var(--border-color)] shadow-[4px_4px_0_var(--shadow-color)] transition-all duration-150 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                {loading ? "AUTHENTICATING..." : "ACCESS MODERATION QUEUE &rarr;"}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="border-b-2 border-[var(--border-color)] pb-4 flex justify-between items-center">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-500">
                  MODERATION QUEUE ACTIVE
                </span>
                <h1 className="text-2xl font-black uppercase text-[var(--foreground)] mt-1">
                  PENDING REPORTS ({reports.length})
                </h1>
              </div>
              <button
                onClick={() => handleLogin({ preventDefault: () => {} } as any)}
                className="font-mono text-xs px-3 py-1.5 border-2 border-[var(--border-color)] bg-[var(--card-bg)] shadow-[2px_2px_0_var(--shadow-color)] transition-all duration-150 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
              >
                REFRESH QUEUE
              </button>
            </div>

            {statusMsg && (
              <div className="border-2 border-emerald-500 p-3 text-emerald-500 font-mono text-xs">
                {statusMsg}
              </div>
            )}

            {reports.length === 0 ? (
              <div className="border-2 border-dashed border-[var(--border-color)] bg-[var(--card-bg)] p-8 text-center text-xs font-mono opacity-60">
                NO PENDING REPORTS REQUIRING REVIEW. ALL CLEAR!
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
                      className="brutal-card bg-[var(--card-bg)] border-3 border-[var(--border-color)] p-5 shadow-[4px_4px_0_var(--shadow-color)] flex flex-col gap-4"
                    >
                      <div className="flex justify-between items-start border-b border-[var(--border-color)] pb-3">
                        <div className="flex-1 pr-4">
                          <span className="text-[10px] font-mono opacity-60 block">REPORT ID #{rep.id} (EDITABLE)</span>
                          <input
                            type="text"
                            value={state.org_name}
                            onChange={(e) => handleFieldChange(rep.id, "org_name", e.target.value)}
                            className="text-lg font-black uppercase text-[var(--foreground)] bg-[var(--background)] border border-[var(--border-color)] p-1.5 w-full font-mono mt-1"
                            title="Edit Organization Name"
                          />
                        </div>
                        <span className="font-mono text-[10px] opacity-70">
                          {new Date(rep.created_at).toLocaleString()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-3 font-mono text-xs">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70 mb-1">
                              Scam Channel / Numbers
                            </span>
                            <input
                              type="text"
                              value={state.scam_channel}
                              onChange={(e) => handleFieldChange(rep.id, "scam_channel", e.target.value)}
                              placeholder="e.g. 0300-1234567, EasyPaisa"
                              className="font-mono text-xs text-amber-500 bg-[var(--background)] p-1.5 border border-[var(--border-color)] w-full"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70 mb-1">
                              Proof Details & Statement
                            </span>
                            <textarea
                              rows={3}
                              value={state.proof_text}
                              onChange={(e) => handleFieldChange(rep.id, "proof_text", e.target.value)}
                              className="bg-[var(--background)] p-2 border border-[var(--border-color)] text-xs font-mono w-full leading-relaxed"
                            />
                          </div>
                        </div>

                        {/* Image Proof & Removal Toggle */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-70">
                            Attachment Moderation
                          </span>
                          {rep.proof_image && !state.remove_media ? (
                            <div className="border border-[var(--border-color)] bg-[var(--background)] p-1 max-h-36 overflow-hidden flex flex-col items-center">
                              <img
                                src={rep.proof_image}
                                alt="Proof Screenshot"
                                className="w-full h-24 object-contain cursor-pointer"
                                onClick={() => {
                                  const w = window.open("");
                                  w?.document.write(`<img src="${rep.proof_image}"/>`);
                                }}
                              />
                              <button
                                onClick={() => handleFieldChange(rep.id, "remove_media", true)}
                                className="mt-2 text-[10px] font-mono font-bold text-red-500 bg-red-950/40 border border-red-800 px-2 py-1 transition-all duration-150 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 cursor-pointer"
                              >
                                [ REMOVE ATTACHMENT ]
                              </button>
                            </div>
                          ) : state.remove_media ? (
                            <div className="border border-red-800 bg-red-950/20 p-4 text-center text-xs font-mono text-red-400 flex flex-col items-center gap-2">
                              <span>ATTACHMENT STRIPPED FOR APPROVAL</span>
                              <button
                                onClick={() => handleFieldChange(rep.id, "remove_media", false)}
                                className="text-[10px] font-mono text-zinc-300 underline cursor-pointer"
                              >
                                RESTORE ATTACHMENT
                              </button>
                            </div>
                          ) : (
                            <div className="border border-dashed border-[var(--border-color)] p-4 text-center text-xs font-mono opacity-50 my-auto">
                              No Screenshot Attached
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Moderation Actions with Hover Animations */}
                      <div className="flex gap-3 border-t border-[var(--border-color)] pt-3">
                        <button
                          onClick={() => handleAction(rep.id, "approve")}
                          disabled={loading}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3 border-2 border-[var(--border-color)] shadow-[3px_3px_0_var(--shadow-color)] transition-all duration-150 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 hover:shadow-[5px_5px_0_var(--shadow-color)] cursor-pointer"
                        >
                          [ APPROVE & ADD TO THREAT INDEX ]
                        </button>
                        <button
                          onClick={() => handleAction(rep.id, "reject")}
                          disabled={loading}
                          className="bg-red-900 hover:bg-red-950 text-white font-bold text-xs px-4 py-3 border-2 border-[var(--border-color)] shadow-[3px_3px_0_var(--shadow-color)] transition-all duration-150 ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                        >
                          [ REJECT REPORT ]
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
