"use client";

import React, { useState, useEffect } from "react";
import { flushSync } from "react-dom";
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

export default function ReportScamPage() {
  const [step, setStep] = useState<number>(1);
  const [orgName, setOrgName] = useState("");
  const [scamChannel, setScamChannel] = useState("");
  const [proofText, setProofText] = useState("");
  const [reporterContact, setReporterContact] = useState("");
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
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
      flushSync(() => {
        applyTheme();
      });
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File size exceeds 5MB limit.");
      return;
    }

    setErrorMsg("");
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProofImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setProofImage(null);
    setFileName("");
  };

  const handleNext = () => {
    setErrorMsg("");
    if (step === 1) {
      if (!orgName.trim()) {
        setErrorMsg("Please specify the target company or platform name.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!proofText.trim()) {
        setErrorMsg("Please describe what happened or what details were requested.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handlePrev = () => {
    setErrorMsg("");
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!orgName.trim() || !proofText.trim()) {
      setErrorMsg("Please complete the required details before submitting.");
      setStep(1);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_name: orgName,
          scam_channel: scamChannel || "Unknown",
          proof_text: proofText,
          reporter_contact: reporterContact || "Anonymous",
          proof_image_base64: proofImage,
        }),
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        setSuccess(true);
      } else {
        setErrorMsg(data.message || "Failed to submit report.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans relative overflow-x-hidden">
      <AmbientBackgroundGrid />

      {/* Ambient Radial Mesh Layer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-red-600/5 blur-3xl pointer-events-none z-0" />

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

      {/* MAIN FORM CONTAINER */}
      <main className="w-full max-w-lg sm:max-w-xl z-20 my-auto py-4 sm:py-6">
        <div className="brutal-card bg-[var(--card-bg)] border-2 sm:border-4 border-[var(--border-color)] p-5 sm:p-8 shadow-[6px_6px_0_var(--shadow-color)] transition-all">
          
          {/* STEP HEADER TRACKER */}
          {!success && (
            <div className="flex items-center justify-between border-b-2 border-dashed border-[var(--border-color)] pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-bold text-xs uppercase tracking-widest text-[var(--foreground)] border-l-2 border-[var(--foreground)] pl-2 shrink-0">
                  STEP 0{step} / 04
                </span>
                <span className="text-xs font-mono font-bold text-[var(--foreground)] opacity-75 truncate">
                  {step === 1 && "TARGET ORGANIZATION"}
                  {step === 2 && "EVIDENCE & DETAILS"}
                  {step === 3 && "HANDLES & ATTACHMENT"}
                  {step === 4 && "FINAL REVIEW"}
                </span>
              </div>

              {/* Uniform Circular Step Dots */}
              <div className="flex items-center gap-2 shrink-0">
                {[1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      if (s < step || (s === 2 && orgName.trim()) || (s === 3 && orgName.trim() && proofText.trim()) || (s === 4 && orgName.trim() && proofText.trim())) {
                        setErrorMsg("");
                        setStep(s);
                      }
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      s === step
                        ? "bg-[var(--foreground)] ring-2 ring-[var(--foreground)]/40 scale-110"
                        : s < step
                        ? "bg-[var(--foreground)] opacity-70 hover:opacity-100"
                        : "bg-[var(--border-color)] opacity-40 hover:opacity-70"
                    }`}
                    title={`Step ${s}`}
                  />
                ))}
              </div>
            </div>
          )}

          {success ? (
            <div className="border-2 border-emerald-500 bg-emerald-500/10 p-5 sm:p-7 flex flex-col gap-4 text-[var(--foreground)] fade-rise">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-emerald-600 text-white font-mono font-black text-xs uppercase tracking-widest">
                  REPORT QUEUED & VERIFIED
                </span>
              </div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-emerald-600 dark:text-emerald-400">
                Thank you for protecting the community.
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed font-mono opacity-90">
                Your evidence has been submitted to ScamLess intelligence analysts. Once verified, the company credentials will be indexed in our real-time threat database.
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-block bg-[var(--foreground)] text-[var(--background)] font-mono font-bold text-xs px-5 py-3 border-2 border-[var(--border-color)] shadow-[3px_3px_0_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all uppercase tracking-wider"
                >
                  ← Return to Scanner Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {errorMsg && (
                <div className="border-2 border-red-500 bg-red-500/10 p-3.5 text-red-500 font-mono text-xs font-bold uppercase tracking-wider fade-rise">
                  ERR: {errorMsg}
                </div>
              )}

              {/* STEP 1: TARGET ORGANIZATION */}
              {step === 1 && (
                <div className="space-y-4 fade-rise">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--foreground)] opacity-85">
                        Target Organization / Entity
                      </label>
                      <span className="text-[10px] font-mono font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest opacity-90">
                        [ REQUIRED ]
                      </span>
                    </div>
                    <p className="text-[11px] font-mono opacity-60">
                      Specify the fraudulent company, recruitment portal, or website name.
                    </p>
                  </div>

                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. CodeAlpha, Vanguard Apex, Global Tech"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleNext();
                      }
                    }}
                    className="w-full bg-[var(--input-bg)] border-2 border-[var(--border-color)] text-[var(--foreground)] text-sm p-3.5 font-mono focus:border-red-500 focus:outline-none transition-colors"
                  />

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-3 brutal-btn bg-[var(--foreground)] text-[var(--background)] font-mono font-bold text-xs tracking-wider border-2 border-[var(--border-color)] shadow-[3px_3px_0_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer uppercase"
                    >
                      Next: Evidence & Details →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PROOF STATEMENT & DETAILS */}
              {step === 2 && (
                <div className="space-y-4 fade-rise">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--foreground)] opacity-85">
                        Proof Statement & Scam Description
                      </label>
                      <span className="text-[10px] font-mono font-bold text-rose-500 dark:text-rose-400 uppercase tracking-widest opacity-90">
                        [ REQUIRED ]
                      </span>
                    </div>
                    <p className="text-[11px] font-mono opacity-60">
                      Explain what happened (e.g. demanded Rs 500 certificate fee after issuing an unvetted offer letter).
                    </p>
                  </div>

                  <textarea
                    required
                    rows={4}
                    autoFocus
                    placeholder="Provide incident context, fee demands, or payment instructions..."
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    className="w-full bg-[var(--input-bg)] border-2 border-[var(--border-color)] text-[var(--foreground)] text-sm p-3.5 font-mono focus:border-red-500 focus:outline-none transition-colors leading-relaxed resize-none"
                  />

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-4 py-2.5 font-mono font-bold text-xs text-[var(--foreground)] opacity-70 hover:opacity-100 uppercase transition-opacity cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-3 brutal-btn bg-[var(--foreground)] text-[var(--background)] font-mono font-bold text-xs tracking-wider border-2 border-[var(--border-color)] shadow-[3px_3px_0_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer uppercase"
                    >
                      Next: Handles & Attachment →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: HANDLES, CONTACT & SCREENSHOT */}
              {step === 3 && (
                <div className="space-y-5 fade-rise">
                  {/* Scam Contact */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--foreground)] opacity-85">
                        Scam Channel / Payment Handle
                      </label>
                      <span className="text-[10px] font-mono font-bold opacity-50 uppercase tracking-widest">
                        [ OPTIONAL ]
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. EasyPaisa 0300-1234567, JazzCash, WhatsApp number"
                      value={scamChannel}
                      onChange={(e) => setScamChannel(e.target.value)}
                      className="bg-[var(--input-bg)] border-2 border-[var(--border-color)] text-[var(--foreground)] text-xs sm:text-sm p-3 font-mono focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Reporter Contact Info */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--foreground)] opacity-85">
                        Your Contact (For Admin Follow-up)
                      </label>
                      <span className="text-[10px] font-mono font-bold opacity-50 uppercase tracking-widest">
                        [ OPTIONAL ]
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. yourname@email.com or WhatsApp number"
                      value={reporterContact}
                      onChange={(e) => setReporterContact(e.target.value)}
                      className="bg-[var(--input-bg)] border-2 border-[var(--border-color)] text-[var(--foreground)] text-xs sm:text-sm p-3 font-mono focus:border-red-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Attachment */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--foreground)] opacity-85">
                        Attach Screenshot Evidence
                      </label>
                      <span className="text-[10px] font-mono font-bold opacity-50 uppercase tracking-widest">
                        [ MAX 5MB ]
                      </span>
                    </div>
                    
                    <div className="border-2 border-dashed border-[var(--border-color)] bg-[var(--input-bg)] p-3.5 text-center space-y-2">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="proof-image-input"
                      />
                      
                      {!fileName ? (
                        <label
                          htmlFor="proof-image-input"
                          className="cursor-pointer bg-[var(--card-bg)] text-[var(--foreground)] font-mono font-bold text-xs px-3.5 py-1.5 border border-[var(--border-color)] inline-block hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
                        >
                          [SELECT SCREENSHOT FILE]
                        </label>
                      ) : (
                        <div className="flex items-center justify-between p-2 border border-[var(--border-color)] bg-[var(--card-bg)] text-xs font-mono">
                          <div className="flex items-center gap-2 truncate">
                            <span className="px-1.5 py-0.5 border border-[var(--border-color)] text-[10px] font-mono font-bold">
                              [IMG]
                            </span>
                            <span className="truncate font-bold text-xs">{fileName}</span>
                          </div>
                          <button
                            type="button"
                            onClick={removeSelectedImage}
                            className="text-rose-500 hover:text-rose-700 font-bold px-2 py-0.5 text-xs cursor-pointer"
                          >
                            ✕ Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-4 py-2.5 font-mono font-bold text-xs text-[var(--foreground)] opacity-70 hover:opacity-100 uppercase transition-opacity cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-3 brutal-btn bg-[var(--foreground)] text-[var(--background)] font-mono font-bold text-xs tracking-wider border-2 border-[var(--border-color)] shadow-[3px_3px_0_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer uppercase"
                    >
                      Review Report →
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: FINAL REVIEW & SUBMISSION */}
              {step === 4 && (
                <div className="space-y-5 fade-rise">
                  <div className="p-4 border-2 border-[var(--border-color)] bg-[var(--input-bg)] space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-[var(--border-color)]/30 pb-2">
                      <span className="font-bold opacity-60 uppercase">SUMMARY REVIEW</span>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-[var(--foreground)] opacity-70 hover:opacity-100 font-bold underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="opacity-50 block text-[10px] uppercase">Target Organization:</span>
                        <span className="font-bold text-sm text-[var(--foreground)]">{orgName}</span>
                      </div>

                      <div>
                        <span className="opacity-50 block text-[10px] uppercase">Details / Proof Statement:</span>
                        <p className="font-sans text-xs leading-relaxed opacity-90 whitespace-pre-wrap">
                          {proofText}
                        </p>
                      </div>

                      {scamChannel && (
                        <div>
                          <span className="opacity-50 block text-[10px] uppercase">Channel / Payment Handle:</span>
                          <span className="font-bold">{scamChannel}</span>
                        </div>
                      )}

                      {reporterContact && (
                        <div>
                          <span className="opacity-50 block text-[10px] uppercase">Your Contact:</span>
                          <span className="font-bold">{reporterContact}</span>
                        </div>
                      )}

                      {fileName && (
                        <div>
                          <span className="opacity-50 block text-[10px] uppercase">Attachment:</span>
                          <span className="font-bold text-emerald-500">[IMG] {fileName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-4 py-2.5 font-mono font-bold text-xs text-[var(--foreground)] opacity-70 hover:opacity-100 uppercase transition-opacity cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3.5 px-6 brutal-btn bg-[var(--foreground)] text-[var(--background)] font-mono font-bold text-xs sm:text-sm tracking-widest border-2 border-[var(--border-color)] shadow-[4px_4px_0_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] hover:opacity-90 transition-all cursor-pointer uppercase disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <span>{loading ? "SUBMITTING REPORT..." : "SUBMIT SCAM REPORT →"}</span>
                    </button>
                  </div>
                </div>
              )}
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
