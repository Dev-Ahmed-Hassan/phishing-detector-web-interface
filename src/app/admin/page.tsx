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

  const handleAction = async (reportId: number, action: "approve" | "reject") => {
    setLoading(true);
    setStatusMsg("");

    try {
      const res = await fetch("/api/admin/verify-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_key: adminKey,
          report_id: reportId,
          action: action
        })
      });

      const data = await res.json();
      if (data.status === "success") {
        setStatusMsg(`Report #${reportId} successfully ${action}d!`);
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
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col font-sans">
      {/* Navbar */}
      <header className="border-b-2 border-zinc-800 bg-black px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="bg-white text-black font-black text-sm px-2 py-1 tracking-wider uppercase border border-black">
            NAUKRI NIGRAN
          </span>
          <span className="text-zinc-400 font-mono text-xs hidden sm:inline">ADMIN MODERATION QUEUE</span>
        </Link>
        <Link href="/" className="text-xs font-bold text-zinc-300 hover:text-white underline">
          &larr; BACK TO SCANNER
        </Link>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 flex flex-col">
        {!isAuthenticated ? (
          <div className="max-w-md w-full mx-auto my-auto border-4 border-white bg-black p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <span className="bg-white text-black font-black text-xs px-2 py-1 tracking-widest uppercase">
              ADMIN AUTHENTICATION
            </span>
            <h1 className="text-2xl font-black text-white mt-3 uppercase">ENTER ADMIN KEY</h1>
            <p className="text-xs text-zinc-400 mt-1 mb-6">
              Enter admin moderation secret key to review pending community scam reports.
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {errorMsg && (
                <div className="border border-red-500 bg-red-950/50 p-2 text-red-300 font-mono text-xs">
                  ERROR: {errorMsg}
                </div>
              )}
              <input
                type="password"
                required
                placeholder="Admin Secret Key"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="bg-zinc-950 border-2 border-zinc-700 text-white text-sm p-3 font-mono focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-white text-black font-black text-sm p-3 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)] hover:translate-x-[2px] hover:translate-y-[2px]"
              >
                {loading ? "AUTHENTICATING..." : "ACCESS MODERATION QUEUE &rarr;"}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="border-b-2 border-zinc-800 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="bg-emerald-600 text-white font-black text-xs px-2 py-1 tracking-widest uppercase">
                  MODERATION QUEUE ACTIVE
                </span>
                <h1 className="text-2xl font-black uppercase text-white mt-2">
                  PENDING COMMUNITY REPORTS ({reports.length})
                </h1>
              </div>
              <button
                onClick={() => handleLogin({ preventDefault: () => {} } as any)}
                className="bg-zinc-900 text-zinc-300 font-mono text-xs px-3 py-2 border border-zinc-700 hover:bg-zinc-800"
              >
                REFRESH QUEUE
              </button>
            </div>

            {statusMsg && (
              <div className="border-2 border-emerald-500 bg-emerald-950/50 p-3 text-emerald-300 font-mono text-xs">
                {statusMsg}
              </div>
            )}

            {reports.length === 0 ? (
              <div className="border-2 border-dashed border-zinc-800 bg-zinc-950 p-12 text-center text-zinc-500 font-mono text-xs">
                NO PENDING REPORTS REQUIRING REVIEW. ALL CLEAR!
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="border-3 border-white bg-black p-6 shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] flex flex-col gap-4"
                  >
                    <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 block">REPORT ID #{rep.id}</span>
                        <h2 className="text-xl font-black text-white uppercase">{rep.org_name}</h2>
                      </div>
                      <span className="font-mono text-[10px] bg-zinc-900 border border-zinc-700 text-zinc-400 px-2 py-1">
                        {new Date(rep.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <div>
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block">
                            SCAM CONTACT / CHANNEL
                          </span>
                          <span className="font-mono text-xs text-amber-400 bg-amber-950/30 px-2 py-1 border border-amber-800 inline-block">
                            {rep.scam_channel || "Not specified"}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider block mt-2">
                            PROOF STATEMENT
                          </span>
                          <p className="text-xs text-zinc-200 font-mono bg-zinc-950 p-3 border border-zinc-800 leading-relaxed">
                            {rep.proof_text}
                          </p>
                        </div>

                        {rep.reporter_contact && (
                          <div className="text-[11px] font-mono text-zinc-400">
                            Reporter: <span className="text-white">{rep.reporter_contact}</span>
                          </div>
                        )}
                      </div>

                      {/* Image Proof Preview */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                          SCREENSHOT PROOF ATTACHMENT
                        </span>
                        {rep.proof_image ? (
                          <div className="border border-zinc-700 bg-zinc-950 p-2 overflow-hidden max-h-48">
                            <img
                              src={rep.proof_image}
                              alt="Proof Screenshot"
                              className="w-full h-full object-contain cursor-pointer"
                              onClick={() => {
                                const w = window.open("");
                                w?.document.write(`<img src="${rep.proof_image}"/>`);
                              }}
                            />
                            <span className="text-[9px] font-mono text-zinc-500 block text-center mt-1">
                              (Click image to open full resolution)
                            </span>
                          </div>
                        ) : (
                          <div className="border border-dashed border-zinc-800 bg-zinc-950 p-6 text-center text-zinc-600 font-mono text-xs my-auto">
                            No Screenshot Image Attached
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Moderation Actions */}
                    <div className="flex gap-3 border-t border-zinc-800 pt-4 mt-2">
                      <button
                        onClick={() => handleAction(rep.id, "approve")}
                        disabled={loading}
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs py-3 border border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)]"
                      >
                        [ APPROVE & ADD TO THREAT INDEX ]
                      </button>
                      <button
                        onClick={() => handleAction(rep.id, "reject")}
                        disabled={loading}
                        className="bg-red-950 hover:bg-red-900 text-red-200 font-bold text-xs px-4 py-3 border border-red-700"
                      >
                        [ REJECT REPORT ]
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
