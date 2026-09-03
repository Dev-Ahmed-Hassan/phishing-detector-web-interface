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

    // Strict 2MB Limit Check
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
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col font-sans">
      <!-- Neo-Brutalist Top Navbar -->
      <header className="border-b-2 border-zinc-800 bg-black px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="bg-white text-black font-black text-sm px-2 py-1 tracking-wider uppercase border border-black">
            NAUKRI NIGRAN
          </span>
          <span className="text-zinc-400 font-mono text-xs hidden sm:inline">COMMUNITY SAFETY</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs font-bold text-zinc-300 hover:text-white underline">
            &larr; BACK TO SCANNER
          </Link>
          <Link href="/admin" className="text-xs font-mono text-zinc-500 hover:text-zinc-300">
            [ADMIN QUEUE]
          </Link>
        </div>
      </header>

      <!-- Main Form Container -->
      <main className="flex-1 max-w-2xl w-full mx-auto p-6 md:p-10 flex flex-col justify-center">
        <div className="border-4 border-white bg-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
          
          <div className="border-b-2 border-zinc-800 pb-4 mb-6">
            <span className="bg-red-600 text-white font-black text-xs px-2 py-1 tracking-widest uppercase border border-white">
              CYBERCRIME REPORT TIP LINE
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-3 uppercase">
              REPORT A SCAM OFFER TO AUTHORITIES
            </h1>
            <p className="text-xs font-semibold text-zinc-400 mt-1">
              Submit proof against fraudulent employers, certificate mills, or fee harvesters across Pakistan.
            </p>
          </div>

          {success ? (
            <div className="border-2 border-emerald-500 bg-emerald-950/40 p-6 text-emerald-200 flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-widest font-black text-emerald-400">
                STATUS: REPORT RECEIVED & QUEUED
              </span>
              <h2 className="text-xl font-bold text-white uppercase">
                THANK YOU FOR PROTECTING JOB SEEKERS
              </h2>
              <p className="text-xs leading-relaxed text-zinc-300">
                Your scam report and evidence statement have been submitted to the Naukri Nigran Admin Team. An admin will review your report and proof, and if verified, it will be added directly into our Community Threat Index to alert job seekers across Pakistan.
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-block bg-white text-black font-black text-xs px-4 py-3 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)] hover:translate-x-[2px] hover:translate-y-[2px]"
                >
                  RETURN TO HOME SCANNER &rarr;
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {errorMsg && (
                <div className="border-2 border-red-500 bg-red-950/50 p-3 text-red-300 font-mono text-xs">
                  ERROR: {errorMsg}
                </div>
              )}

              <!-- Company Name -->
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black tracking-wider uppercase text-zinc-300">
                  TARGET ORGANIZATION / COMPANY NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CodeAlpha, Global Tech Internships, Data Entry Co."
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="bg-zinc-950 border-2 border-zinc-700 text-white text-sm p-3 focus:border-white focus:outline-none font-mono"
                />
              </div>

              <!-- Scam Channel / Payment Number -->
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black tracking-wider uppercase text-zinc-300">
                  SCAM CONTACT / PAYMENT CHANNEL (WHATSAPP, EASYPAISA, EMAIL)
                </label>
                <input
                  type="text"
                  placeholder="e.g. EasyPaisa 0300-1234567, hr@fakecompany.com"
                  value={scamChannel}
                  onChange={(e) => setScamChannel(e.target.value)}
                  className="bg-zinc-950 border-2 border-zinc-700 text-white text-sm p-3 focus:border-white focus:outline-none font-mono"
                />
              </div>

              <!-- Detailed Proof Statement -->
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black tracking-wider uppercase text-zinc-300">
                  PROOF STATEMENT & SCAM DETAILS *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe what happened (e.g., 'Demanded Rs 500 registration fee for internship certificate after 1 day. Promised IIT certificate.')"
                  value={proofText}
                  onChange={(e) => setProofText(e.target.value)}
                  className="bg-zinc-950 border-2 border-zinc-700 text-white text-sm p-3 focus:border-white focus:outline-none font-mono leading-relaxed"
                />
              </div>

              <!-- Image Proof Upload (Max 2MB) -->
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black tracking-wider uppercase text-zinc-300">
                  ATTACH SCREENSHOT PROOF (MAX 2MB)
                </label>
                <div className="border-2 border-dashed border-zinc-700 bg-zinc-950 p-4 flex flex-col items-center justify-center gap-2 text-center">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="proof-image-input"
                  />
                  <label
                    htmlFor="proof-image-input"
                    className="cursor-pointer bg-zinc-800 text-white font-mono text-xs px-3 py-2 border border-zinc-600 hover:bg-zinc-700"
                  >
                    SELECT SCREENSHOT IMAGE
                  </label>
                  {fileName ? (
                    <span className="font-mono text-xs text-emerald-400">
                      SELECTED: {fileName}
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-zinc-500">
                      JPEG, PNG, or WEBP up to 2MB
                    </span>
                  )}
                </div>
              </div>

              <!-- Reporter Contact (Optional) -->
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black tracking-wider uppercase text-zinc-400">
                  YOUR CONTACT (OPTIONAL FOR ADMIN FOLLOWUP)
                </label>
                <input
                  type="text"
                  placeholder="Your Email or WhatsApp number (kept confidential)"
                  value={reporterContact}
                  onChange={(e) => setReporterContact(e.target.value)}
                  className="bg-zinc-950 border-2 border-zinc-700 text-white text-sm p-3 focus:border-white focus:outline-none font-mono"
                />
              </div>

              <!-- Notice -->
              <div className="bg-zinc-900 border border-zinc-800 p-3 text-[11px] font-mono text-zinc-400">
                ADMIN PROTECTION: All submissions are manually verified by Naukri Nigran administrators before entity threat indexing.
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-black text-sm p-4 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)] hover:translate-x-[2px] hover:translate-y-[2px] cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? "SUBMITTING REPORT..." : "SUBMIT SCAM PROOF TO ADMIN &rarr;"}
              </button>
            </form>
          )}

        </div>
      </main>

      <footer className="border-t border-zinc-800 py-4 px-6 text-center text-xs font-mono text-zinc-500">
        NAUKRI NIGRAN COMMUNITY CYBERCRIME TIP LINE &copy; 2026
      </footer>
    </div>
  );
}
