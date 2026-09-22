"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ThemeSettingsModal from "@/components/ThemeSettingsModal";
import AmbientBackgroundGrid from "@/components/AmbientBackgroundGrid";
import { useThemeTransition } from "@/lib/useThemeTransition";

export default function ExtensionPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);

  const {
    isDark,
    palette,
    language,
    toggleTheme,
    handlePaletteChange,
    handleLanguageChange,
  } = useThemeTransition();

  const screenshots = [
    {
      step: "01",
      badge: "SELECTION & AUTO-GRAB",
      title: "1-Click Text Selection & Auto-Grab",
      url: "/images/ext-screenshot-1.png",
      desc: "Highlight any suspicious job offer text or recruitment message on LinkedIn, WhatsApp Web, or job boards. Clicking AUTO-GRAB captures text directly into the ScamLess scanner.",
    },
    {
      step: "02",
      badge: "OSINT GATHERING",
      title: "OSINT Information Gathering & Background Scan",
      url: "/images/ext-screenshot-2.png",
      desc: "Executes real-time OSINT information gathering including WHOIS domain age checks, registrar infrastructure traces, email/phone contact evidence lookups, and threat intelligence pipelines.",
    },
    {
      step: "03",
      badge: "FULL SITE REPORT",
      title: "Instant Risk Score & Direct Full Report Access",
      url: "/images/ext-screenshot-3.png",
      desc: "Displays an immediate risk confidence gauge (0 Legitimate to 100 Scam), itemized score ledger justification, red flag breakdown, and a button that leads directly to the full report on our ScamLess site.",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans relative overflow-x-hidden">
      <AmbientBackgroundGrid />

      <ThemeSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentPalette={palette}
        onSelectPalette={handlePaletteChange}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* LIGHTBOX MODAL FOR EXTENSION SCREENSHOTS */}
      {activeScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-fade-rise">
          <div className="brutal-card bg-[var(--card-bg)] border-2 sm:border-4 border-[var(--border-color)] p-4 sm:p-6 max-w-3xl w-full max-h-[90vh] flex flex-col space-y-4 shadow-[10px_10px_0_var(--shadow-color)] overflow-hidden">
            <div className="flex items-center justify-between border-b-2 border-[var(--border-color)] pb-3">
              <span className="font-mono font-bold text-xs sm:text-sm uppercase text-[var(--foreground)] tracking-wider">
                ScamLess Extension Preview
              </span>
              <button
                type="button"
                onClick={() => setActiveScreenshot(null)}
                className="px-3 py-1.5 bg-[var(--foreground)] text-[var(--background)] font-mono font-bold text-xs uppercase border-2 border-[var(--border-color)] shadow-[2px_2px_0_var(--shadow-color)] hover:opacity-90 cursor-pointer transition-opacity"
              >
                CLOSE
              </button>
            </div>
            <div className="flex-1 overflow-y-auto flex items-center justify-center bg-black/10 p-3 border border-[var(--border-color)]">
              <img
                src={activeScreenshot}
                alt="Extension Screenshot Preview"
                className="max-w-full max-h-[65vh] object-contain shadow-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* GLOBAL NAVBAR */}
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleTheme={toggleTheme}
        isDark={isDark}
      />

      <main className="w-full max-w-5xl z-20 space-y-12 flex-1 pt-2">
        {/* HERO HEADER */}
        <section className="space-y-4 border-b-4 border-[var(--border-color)] pb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--foreground)]">
              <span className="font-extrabold uppercase tracking-widest bg-[var(--accent-color)] text-[var(--accent-text)] px-2.5 py-1 rounded-sm">
                BROWSER INTEGRATION
              </span>
              <span className="opacity-40">//</span>
              <span className="font-bold opacity-80 uppercase">MANIFEST V3 ARCHITECTURE</span>
            </div>
            <span className="text-[11px] font-mono tracking-wider opacity-60 uppercase font-bold">
              ADD-ON SHOWCASE
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-serif font-black text-[var(--foreground)] tracking-tight">
              ScamLess Browser Extension
            </h1>
            <p className="text-base sm:text-lg font-sans text-[var(--foreground)] opacity-90 leading-relaxed max-w-3xl">
              Inspect suspicious job solicitations, recruitment messages, and URLs directly inside your browser. ScamLess brings real-time OSINT threat intelligence to your daily web workflow.
            </p>
          </div>
        </section>

        {/* STORE SUBMISSION STATUS */}
        <section className="space-y-6">
          <div className="border-b-2 border-dashed border-[var(--border-color)] pb-2">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--foreground)] opacity-85">
              // STORE SUBMISSION VERIFICATION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Edge Card */}
            <div className="brutal-card bg-[var(--card-bg)] border-2 border-[var(--border-color)] p-6 space-y-3 shadow-[6px_6px_0_var(--shadow-color)]">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs uppercase opacity-60">EDGE ADD-ONS</span>
                <span className="font-mono font-bold text-[10px] uppercase px-2 py-0.5 border border-amber-500 bg-amber-500/10 text-amber-500">
                  UNDER REVIEW
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl text-[var(--foreground)]">Microsoft Edge</h3>
              <p className="text-xs font-sans text-[var(--foreground)] opacity-80 leading-relaxed">
                Submitted to Microsoft Partner Center for Edge Add-ons store listing certification.
              </p>
            </div>

            {/* Firefox Card */}
            <div className="brutal-card bg-[var(--card-bg)] border-2 border-emerald-500/50 p-6 space-y-3 shadow-[6px_6px_0_var(--shadow-color)] relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs uppercase opacity-60">FIREFOX ADD-ONS</span>
                <span className="font-mono font-bold text-[10px] uppercase px-2 py-0.5 border border-emerald-500 bg-emerald-500/10 text-emerald-500 font-bold">
                  VERIFIED & APPROVED
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl text-[var(--foreground)]">Mozilla Firefox</h3>
              <p className="text-xs font-sans text-[var(--foreground)] opacity-80 leading-relaxed">
                Approved and signed on Mozilla Developer Hub for Firefox Add-ons store distribution.
              </p>
              <div className="pt-2">
                <a
                  href="https://addons.mozilla.org/en-US/firefox/addon/scamless-job-scam-detector/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-mono font-bold text-xs uppercase tracking-wider border-2 border-[var(--border-color)] shadow-[3px_3px_0_var(--shadow-color)] hover:bg-emerald-700 cursor-pointer transition-colors"
                >
                  <span>GET FIREFOX EXTENSION ↗</span>
                </a>
              </div>
            </div>

            {/* Chrome Card */}
            <div className="brutal-card bg-[var(--card-bg)] border-2 border-[var(--border-color)] p-6 space-y-3 shadow-[6px_6px_0_var(--shadow-color)] opacity-85">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs uppercase opacity-60">CHROME STORE</span>
                <span className="font-mono font-bold text-[10px] uppercase px-2 py-0.5 border border-[var(--border-color)] bg-[var(--background)] opacity-60">
                  NOT APPLIED YET
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl text-[var(--foreground)]">Chrome Web Store</h3>
              <p className="text-xs font-sans text-[var(--foreground)] opacity-80 leading-relaxed">
                Application planned for Chrome Web Store following initial store approvals.
              </p>
            </div>
          </div>

          {/* EDITORIAL CALLOUT QUOTE */}
          <div className="border-l-4 border-emerald-500 pl-6 sm:pl-8 py-3 space-y-2 bg-emerald-500/5">
            <p className="text-[11px] font-mono font-bold tracking-[0.2em] text-emerald-500 uppercase">
              STORE VERIFICATION UPDATE
            </p>
            <p className="text-lg sm:text-2xl leading-relaxed font-serif italic text-[var(--foreground)] font-medium">
              &ldquo;Our Firefox Extension has officially been verified and approved on Mozilla Add-ons! You can install it directly from the link above. Edge and Chrome store listings will follow.&rdquo;
            </p>
          </div>
        </section>

        {/* WORKFLOW STEPS */}
        <section className="space-y-8 pt-4">
          <div className="flex items-center justify-between border-b-4 border-[var(--border-color)] pb-4">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl tracking-tight text-[var(--foreground)] flex items-center gap-3">
              <span className="inline-flex items-center justify-center px-3 py-1 bg-[var(--accent-color)] text-[var(--accent-text)] font-mono font-bold text-base border-2 border-[var(--border-color)]">
                WORKFLOW
              </span>
              How The Extension Works
            </h2>
          </div>

          <div className="space-y-8">
            {screenshots.map((shot, idx) => (
              <article
                key={idx}
                className="brutal-card bg-[var(--card-bg)] border-2 sm:border-4 border-[var(--border-color)] p-6 sm:p-8 space-y-6 shadow-[8px_8px_0_var(--shadow-color)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[var(--border-color)] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm px-3 py-1 bg-[var(--foreground)] text-[var(--background)]">
                      {shot.step}
                    </span>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-[var(--foreground)]">
                      {shot.title}
                    </h3>
                  </div>
                  <span className="font-mono font-bold text-xs uppercase px-2.5 py-1 border border-[var(--border-color)] bg-[var(--background)] text-[var(--foreground)]">
                    {shot.badge}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-5">
                    <p className="text-base font-sans leading-relaxed text-[var(--foreground)] opacity-90">
                      {shot.desc}
                    </p>
                    <div>
                      <button
                        type="button"
                        onClick={() => setActiveScreenshot(shot.url)}
                        className="px-5 py-3 brutal-btn font-mono font-bold text-xs uppercase tracking-wider cursor-pointer"
                      >
                        VIEW FULLSCREEN
                      </button>
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveScreenshot(shot.url)}
                    className="overflow-hidden cursor-zoom-in group shadow-[4px_4px_0_var(--shadow-color)] border-2 border-[var(--border-color)] bg-black/5"
                  >
                    <img
                      src={shot.url}
                      alt={shot.title}
                      className="w-full h-auto max-h-80 object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* RETURN TO SCANNER ACTION */}
        <div className="pt-6 flex justify-center">
          <Link
            href="/"
            className="py-4 px-8 brutal-btn font-bold text-sm tracking-widest uppercase flex items-center gap-2"
          >
            <span>&larr; RETURN TO MAIN SCANNER</span>
          </Link>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-5xl z-20 mt-16 py-8 border-t-4 border-[var(--border-color)] text-[var(--foreground)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif font-black text-xl sm:text-2xl tracking-tight uppercase">
              ScamLess
            </span>
            <span className="hidden sm:inline-block text-xs font-mono font-bold uppercase tracking-widest opacity-60 border-l-2 border-[var(--border-color)] pl-3">
              Anti-Scam Intelligence
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono font-bold uppercase tracking-wider">
            <Link href="/" className="hover:opacity-70 transition-opacity">
              Scanner
            </Link>
            <span className="opacity-30">&bull;</span>
            <Link href="/demo-cases" className="hover:opacity-70 transition-opacity">
              Demo Cases
            </Link>
            <span className="opacity-30">&bull;</span>
            <Link href="/extension" className="hover:opacity-70 transition-opacity font-extrabold">
              Extension
            </Link>
            <span className="opacity-30">&bull;</span>
            <a href="https://github.com/Dev-Ahmed-Hassan" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              GitHub ↗
            </a>
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t-2 border-dashed border-[var(--border-color)]/40 flex items-center justify-center text-[11px] font-mono font-bold uppercase tracking-widest text-[var(--foreground)] opacity-80">
          <span>Ahmed Hassan</span>
        </div>
      </footer>
    </div>
  );
}
