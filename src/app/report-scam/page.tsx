"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ReportScamPage() {
  const [orgName, setOrgName] = useState("");
  const [scamChannel, setScamChannel] = useState("");
  const [proofText, setProofText] = useState("");
  const [reporterContact, setReporterContact] = useState("");
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit. Please upload a smaller image.");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProofImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !proofText.trim()) {
      setErrorMsg("Organization Name and Proof Statement are required.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/submit-community-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org_name: orgName,
          scam_channel: scamChannel,
          proof_text: proofText,
          proof_image: proofImage,
          reporter_contact: reporterContact
        })
      });

      const data = await res.json();
      if (data.status === "success") {
        setSuccess(true);
      } else {
        setErrorMsg(data.message || "Failed to submit report.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans relative overflow-x-hidden">
      
      {/* HEADER NAVBAR (Identical to Landing Page) */}
      <header className="w-full max-w-5xl z-30 mb-8 brutal-card bg-[var(--card-bg)] border-4 border-[var(--border-color)] p-4 shadow-[4px_4px_0_var(--shadow-color)]">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[var(--foreground)]">
              ScamLess
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <Link href="/#scanner" className="px-3 py-1.5 border-2 border-transparent hover:border-[var(--border-color)] transition-colors text-[var(--foreground)]">
              Scanner
            </Link>
            <Link href="/#demo" className="px-3 py-1.5 border-2 border-transparent hover:border-[var(--border-color)] transition-colors text-[var(--foreground)] opacity-70 hover:opacity-100">
              Demo Cases
            </Link>
            <Link href="/#whatsapp" className="px-3 py-1.5 border-2 border-transparent hover:border-[var(--border-color)] transition-colors text-[var(--foreground)] opacity-70 hover:opacity-100">
              WhatsApp Bot
            </Link>
            <Link href="/#extension" className="px-3 py-1.5 border-2 border-transparent hover:border-[var(--border-color)] transition-colors text-[var(--foreground)] opacity-70 hover:opacity-100">
              Extension
            </Link>
            <Link href="/report-scam" className="px-3 py-1.5 border-2 border-transparent hover:border-red-600 text-red-500 hover:text-red-400 font-bold transition-colors">
              Report Scam
            </Link>
            <a href="https://ahmed-hassan-portfoliosite.vercel.app/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border-2 border-transparent hover:border-[var(--border-color)] transition-colors text-[var(--foreground)] opacity-70 hover:opacity-100">
              Portfolio ↗
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3 py-1.5 text-xs font-mono font-bold border-2 border-[var(--border-color)] bg-[var(--card-bg)] shadow-[3px_3px_0_var(--shadow-color)] text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
            >
              &larr; BACK
            </Link>
          </div>
        </div>
      </header>

      {/* MAIN FORM CONTAINER */}
      <main className="w-full max-w-xl z-20 my-auto">
        <div className="brutal-card bg-[var(--card-bg)] border-4 border-[var(--border-color)] p-6 sm:p-8 shadow-[8px_8px_0_var(--shadow-color)]">
          
          <div className="border-b-2 border-[var(--border-color)] pb-4 mb-6">
            <h1 className="text-2xl font-black uppercase text-[var(--foreground)] tracking-tight">
              REPORT A SCAM
            </h1>
            <p className="text-xs font-mono text-[var(--foreground)] opacity-70 mt-1">
              Submit fraudulent company details or evidence for admin verification & community indexing.
            </p>
          </div>

          {success ? (
            <div className="border-2 border-[var(--border-color)] bg-[var(--card-bg)] p-6 flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-widest font-black text-emerald-500">
                REPORT SUBMITTED & QUEUED
              </span>
              <p className="text-xs leading-relaxed opacity-90 font-mono">
                Your report has been submitted to ScamLess administrators. Once verified, it will be added to the Community Threat Index.
              </p>
              <Link
                href="/"
                className="inline-block text-center bg-[var(--foreground)] text-[var(--background)] font-black text-xs px-4 py-3 border-2 border-[var(--border-color)] shadow-[4px_4px_0_var(--shadow-color)]"
              >
                RETURN TO SCANNER &rarr;
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {errorMsg && (
                <div className="border-2 border-red-500 p-3 text-red-500 font-mono text-xs">
                  ERROR: {errorMsg}
                </div>
              )}

              {/* Target Organization */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono font-bold uppercase tracking-wider opacity-80">
                  Target Organization *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CodeAlpha, Global Tech"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="bg-[var(--background)] border-2 border-[var(--border-color)] text-[var(--foreground)] text-sm p-3 font-mono focus:outline-none"
                />
              </div>

              {/* Scam Details */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono font-bold uppercase tracking-wider opacity-80">
                  Proof Statement / Details *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe what happened (e.g. demanded Rs 500 certificate fee)"
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  className="bg-[var(--background)] border-2 border-[var(--border-color)] text-[var(--foreground)] text-sm p-3 font-mono focus:outline-none leading-relaxed"
                />
              </div>

              {/* Scam Contact */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono font-bold uppercase tracking-wider opacity-80">
                  Scam Channel / Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. EasyPaisa 0300-1234567, WhatsApp, Email"
                  value={scamChannel}
                  onChange={(e) => setScamChannel(e.target.value)}
                  className="bg-[var(--background)] border-2 border-[var(--border-color)] text-[var(--foreground)] text-sm p-3 font-mono focus:outline-none"
                />
              </div>

              {/* Attachment */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-mono font-bold uppercase tracking-wider opacity-80">
                  Attach Screenshot (Optional, Max 2MB)
                </label>
                <div className="border-2 border-dashed border-[var(--border-color)] bg-[var(--background)] p-3 text-center">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="proof-image-input"
                  />
                  <label
                    htmlFor="proof-image-input"
                    className="cursor-pointer bg-[var(--card-bg)] text-[var(--foreground)] font-mono text-xs px-3 py-1.5 border border-[var(--border-color)] inline-block"
                  >
                    SELECT SCREENSHOT
                  </label>
                  {fileName && (
                    <span className="font-mono text-xs block text-emerald-500 mt-1">
                      SELECTED: {fileName}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="bg-[var(--foreground)] text-[var(--background)] font-black text-xs p-3.5 border-2 border-[var(--border-color)] shadow-[4px_4px_0_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? "SUBMITTING..." : "SUBMIT SCAM REPORT &rarr;"}
              </button>
            </form>
          )}

        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-5xl z-20 mt-12 pt-6 border-t-2 border-[var(--border-color)] text-center text-xs font-mono opacity-70">
        ScamLess Community Tip Line &copy; 2026
      </footer>
    </div>
  );
}
