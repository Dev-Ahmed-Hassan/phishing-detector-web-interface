"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ThemeSettingsModal from "@/components/ThemeSettingsModal";
import AmbientBackgroundGrid from "@/components/AmbientBackgroundGrid";
import { useThemeTransition } from "@/lib/useThemeTransition";

export default function WhatsappBotPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    isDark,
    palette,
    language,
    toggleTheme,
    handlePaletteChange,
    handleLanguageChange,
  } = useThemeTransition();

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

      {/* GLOBAL NAVBAR */}
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleTheme={toggleTheme}
        isDark={isDark}
      />

      <main className="w-full max-w-5xl z-20 space-y-12 flex-1 pt-2">
        {/* OPEN HERO SECTION */}
        <section className="space-y-4 border-b-4 border-[var(--border-color)] pb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs text-[var(--foreground)]">
              <span className="font-extrabold uppercase tracking-widest bg-[var(--accent-color)] text-[var(--accent-text)] px-2.5 py-1 rounded-sm">
                WHATSAPP INTEGRATION
              </span>
              <span className="opacity-40">//</span>
              <span className="font-bold opacity-80 uppercase">AUTOMATED CHAT OSINT</span>
            </div>
            <span className="text-[11px] font-mono tracking-wider opacity-60 uppercase font-bold">
              SYSTEM OVERVIEW
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-serif font-black text-[var(--foreground)] tracking-tight">
              ScamLess WhatsApp Bot
            </h1>
            <p className="text-base sm:text-lg font-sans text-[var(--foreground)] opacity-90 leading-relaxed max-w-3xl">
              Forward suspicious job solicitations, flyers, and messages directly to ScamLess inside WhatsApp for instant automated OSINT investigation and verdict reports.
            </p>
          </div>
        </section>

        {/* ACCESS & DEPLOYMENT NOTICE */}
        <section className="space-y-6">
          <div className="border-b-2 border-dashed border-[var(--border-color)] pb-3">
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[var(--foreground)]">
              Deployment & Access Notice
            </h2>
          </div>

          {/* CLEAN EDITORIAL QUOTE */}
          <div className="border-l-4 border-[var(--border-color)] pl-6 sm:pl-8 py-3 space-y-2">
            <p className="text-[11px] font-mono font-bold tracking-[0.2em] text-[var(--foreground)] opacity-60 uppercase flex items-center gap-2">
              <span>✦</span> HACKATHON DEMO STATUS
            </p>
            <p className="text-lg sm:text-2xl leading-relaxed font-serif italic text-[var(--foreground)] font-medium">
              &ldquo;The ScamLess WhatsApp Bot is operational for testing. However, because it is currently linked to my private personal number for hackathon evaluation and live presentations, it cannot be shared publicly at this time. It is planned to scale to an official, dedicated WhatsApp Business number for public launch.&rdquo;
            </p>
          </div>
        </section>

        {/* SYSTEM CAPABILITIES & FEATURES */}
        <section className="space-y-8 pt-2">
          <div className="flex items-center justify-between border-b-4 border-[var(--border-color)] pb-4">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl tracking-tight text-[var(--foreground)] flex items-center gap-3">
              <span className="inline-flex items-center justify-center px-3 py-1 bg-[var(--accent-color)] text-[var(--accent-text)] font-mono font-bold text-base border-2 border-[var(--border-color)]">
                CAPABILITIES
              </span>
              How The WhatsApp Bot Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <article className="brutal-card bg-[var(--card-bg)] border-2 sm:border-4 border-[var(--border-color)] p-6 space-y-4 shadow-[6px_6px_0_var(--shadow-color)]">
              <div className="flex items-center justify-between border-b-2 border-[var(--border-color)] pb-3">
                <span className="font-mono font-black text-sm px-3 py-1 bg-[var(--foreground)] text-[var(--background)]">
                  01
                </span>
                <span className="font-mono font-bold text-[11px] uppercase tracking-wider opacity-70">
                  CHAT FORWARDING
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl text-[var(--foreground)]">
                Direct Message & Flyer Forwarding
              </h3>
              <p className="text-sm font-sans text-[var(--foreground)] opacity-85 leading-relaxed">
                Forward any suspicious recruiter text, offer flyer image, or phishing link directly to the ScamLess chat inside WhatsApp.
              </p>
            </article>

            {/* Feature 2 */}
            <article className="brutal-card bg-[var(--card-bg)] border-2 sm:border-4 border-[var(--border-color)] p-6 space-y-4 shadow-[6px_6px_0_var(--shadow-color)]">
              <div className="flex items-center justify-between border-b-2 border-[var(--border-color)] pb-3">
                <span className="font-mono font-black text-sm px-3 py-1 bg-[var(--foreground)] text-[var(--background)]">
                  02
                </span>
                <span className="font-mono font-bold text-[11px] uppercase tracking-wider opacity-70">
                  AUTOMATED OSINT
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl text-[var(--foreground)]">
                Real-Time OSINT Analysis
              </h3>
              <p className="text-sm font-sans text-[var(--foreground)] opacity-85 leading-relaxed">
                Triggers our automated backend engine in real-time, executing WHOIS domain lookups, contact traces, and Gemini 3.5 AI threat scoring.
              </p>
            </article>

            {/* Feature 3 */}
            <article className="brutal-card bg-[var(--card-bg)] border-2 sm:border-4 border-[var(--border-color)] p-6 space-y-4 shadow-[6px_6px_0_var(--shadow-color)]">
              <div className="flex items-center justify-between border-b-2 border-[var(--border-color)] pb-3">
                <span className="font-mono font-black text-sm px-3 py-1 bg-[var(--foreground)] text-[var(--background)]">
                  03
                </span>
                <span className="font-mono font-bold text-[11px] uppercase tracking-wider opacity-70">
                  INSTANT VERDICT
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl text-[var(--foreground)]">
                Automated Reply & PDF Dossier
              </h3>
              <p className="text-sm font-sans text-[var(--foreground)] opacity-85 leading-relaxed">
                Replies back instantly in WhatsApp with the risk score, primary red flags summary, and a downloadable PDF dossier attachment.
              </p>
            </article>

            {/* Feature 4 */}
            <article className="brutal-card bg-[var(--card-bg)] border-2 sm:border-4 border-[var(--border-color)] p-6 space-y-4 shadow-[6px_6px_0_var(--shadow-color)]">
              <div className="flex items-center justify-between border-b-2 border-[var(--border-color)] pb-3">
                <span className="font-mono font-black text-sm px-3 py-1 bg-[var(--foreground)] text-[var(--background)]">
                  04
                </span>
                <span className="font-mono font-bold text-[11px] uppercase tracking-wider opacity-70">
                  FUTURE SCALE
                </span>
              </div>
              <h3 className="font-serif font-bold text-xl text-[var(--foreground)]">
                Official Business Number Migration
              </h3>
              <p className="text-sm font-sans text-[var(--foreground)] opacity-85 leading-relaxed">
                Post-hackathon plans include deploying on WhatsApp Business Cloud API with a dedicated official public toll-free number for mass community protection.
              </p>
            </article>
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
            <Link href="/whatsapp" className="hover:opacity-70 transition-opacity font-extrabold">
              WhatsApp Bot
            </Link>
            <span className="opacity-30">&bull;</span>
            <Link href="/extension" className="hover:opacity-70 transition-opacity">
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
