"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Lang } from "@/lib/report-types";

interface NavbarProps {
  language: Lang;
  onLanguageChange: (lang: Lang) => void;
  onOpenSettings: () => void;
  onToggleTheme: () => void;
  isDark: boolean;
  t?: any;
}

export default function Navbar({
  language,
  onLanguageChange,
  onOpenSettings,
  onToggleTheme,
  isDark,
  t
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isDemoActive = pathname === "/demo-cases";
  const isExtensionActive = pathname === "/extension";
  const isWhatsappActive = pathname === "/whatsapp";
  const isReportActive = pathname === "/report-scam";

  const defaultT = {
    navScanner: "Scanner",
    navDemo: "Demo Cases",
    navWhatsapp: "WhatsApp Bot",
    navExtension: "Extension",
    navPortfolio: "Portfolio ↗"
  };

  const navT = t || defaultT;

  return (
    <header className="w-full max-w-5xl z-30 mb-6 sm:mb-8 brutal-card bg-[var(--card-bg)] border-2 sm:border-4 border-[var(--border-color)] p-2.5 sm:p-3.5 overflow-hidden">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[var(--foreground)] whitespace-nowrap hover:opacity-80 transition-opacity flex items-center gap-2"
          >
            ScamLess
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-[11px] xl:text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0">
          <Link
            href="/demo-cases"
            className={`px-3 py-1.5 border-2 transition-all whitespace-nowrap font-mono font-bold text-xs uppercase ${
              isDemoActive
                ? "border-[var(--border-color)] bg-[var(--foreground)] text-[var(--background)] shadow-[3px_3px_0_var(--shadow-color)] opacity-100 font-extrabold"
                : "border-transparent text-[var(--foreground)] opacity-75 hover:opacity-100 hover:border-[var(--border-color)]"
            }`}
          >
            {navT.navDemo || "Demo Cases"}
          </Link>
          <Link
            href="/whatsapp"
            className={`px-3 py-1.5 border-2 transition-all whitespace-nowrap font-mono font-bold text-xs uppercase ${
              isWhatsappActive
                ? "border-[var(--border-color)] bg-[var(--foreground)] text-[var(--background)] shadow-[3px_3px_0_var(--shadow-color)] opacity-100 font-extrabold"
                : "border-transparent text-[var(--foreground)] opacity-75 hover:opacity-100 hover:border-[var(--border-color)]"
            }`}
          >
            {navT.navWhatsapp || "WhatsApp Bot"}
          </Link>
          <Link
            href="/extension"
            className={`px-3 py-1.5 border-2 transition-all whitespace-nowrap font-mono font-bold text-xs uppercase ${
              isExtensionActive
                ? "border-[var(--border-color)] bg-[var(--foreground)] text-[var(--background)] shadow-[3px_3px_0_var(--shadow-color)] opacity-100 font-extrabold"
                : "border-transparent text-[var(--foreground)] opacity-75 hover:opacity-100 hover:border-[var(--border-color)]"
            }`}
          >
            {navT.navExtension || "Extension"}
          </Link>
          <Link
            href="/report-scam"
            className={`px-3 py-1.5 border-2 transition-all whitespace-nowrap font-mono font-bold text-xs uppercase ${
              isReportActive
                ? "border-red-600 bg-red-600 text-white shadow-[3px_3px_0_var(--shadow-color)]"
                : "border-transparent text-red-500 hover:border-red-600 hover:text-red-400"
            }`}
          >
            Report Scam
          </Link>
          <a
            href="https://github.com/Dev-Ahmed-Hassan"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 xl:px-3 py-1.5 border-2 border-transparent hover:border-[var(--border-color)] transition-colors text-[var(--foreground)] opacity-80 hover:opacity-100 whitespace-nowrap flex items-center gap-1.5"
            title="GitHub Profile (Dev-Ahmed-Hassan)"
            aria-label="GitHub Profile"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span className="font-bold">GitHub</span>
          </a>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center border-2 border-[var(--border-color)] bg-[var(--card-bg)] shadow-[2px_2px_0_var(--shadow-color)] sm:shadow-[3px_3px_0_var(--shadow-color)] rounded divide-x-2 divide-[var(--border-color)] overflow-hidden shrink-0">
            <button
              onClick={() => {
                const next: Record<string, Lang> = { en: "ur", ur: "roman_ur", roman_ur: "en" };
                onLanguageChange(next[language] || "en");
              }}
              className="px-3 py-1.5 text-xs font-mono font-bold text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors cursor-pointer flex items-center gap-1.5 group whitespace-nowrap shrink-0"
              title="Switch Language (EN / Urdu / Roman Urdu)"
            >
              <svg className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="whitespace-nowrap">{language === "en" ? "EN" : language === "ur" ? "اردو" : "ROMAN URDU"}</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="px-3 py-1.5 text-xs font-mono font-bold text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors cursor-pointer flex items-center gap-1.5 group whitespace-nowrap shrink-0"
              title="Open Theme & Display Preferences"
            >
              <svg className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2 2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span className="whitespace-nowrap">THEMES</span>
            </button>

            <button
              onClick={onToggleTheme}
              aria-label="Toggle Theme"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="px-3 py-1.5 text-xs text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors cursor-pointer flex items-center justify-center group shrink-0"
            >
              {isDark ? (
                <svg className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300 transition-colors shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 fill-current text-[var(--foreground)] group-hover:text-[var(--background)] transition-colors shrink-0" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden px-2.5 py-1.5 text-xs font-bold border-2 border-[var(--border-color)] uppercase bg-[var(--foreground)] text-[var(--background)] cursor-pointer shrink-0 ml-1"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="lg:hidden mt-4 pt-4 border-t-2 border-[var(--border-color)] flex flex-col gap-2 font-mono text-xs font-bold uppercase tracking-wider">
          <Link
            href="/demo-cases"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`p-2.5 border-2 border-[var(--border-color)] font-mono text-xs font-bold uppercase flex items-center justify-between transition-all ${
              isDemoActive
                ? "bg-[var(--foreground)] text-[var(--background)] shadow-[3px_3px_0_var(--shadow-color)] font-extrabold"
                : "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--card-bg)]"
            }`}
          >
            <span>{navT.navDemo || "Demo Cases"}</span>
          </Link>
          <Link
            href="/whatsapp"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`p-2.5 border-2 border-[var(--border-color)] font-mono text-xs font-bold uppercase flex items-center justify-between transition-all ${
              isWhatsappActive
                ? "bg-[var(--foreground)] text-[var(--background)] shadow-[3px_3px_0_var(--shadow-color)] font-extrabold"
                : "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--card-bg)]"
            }`}
          >
            <span>{navT.navWhatsapp || "WhatsApp Bot"}</span>
          </Link>
          <Link
            href="/extension"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`p-2.5 border-2 border-[var(--border-color)] font-mono text-xs font-bold uppercase flex items-center justify-between transition-all ${
              isExtensionActive
                ? "bg-[var(--foreground)] text-[var(--background)] shadow-[3px_3px_0_var(--shadow-color)] font-extrabold"
                : "bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--card-bg)]"
            }`}
          >
            <span>{navT.navExtension || "Extension"}</span>
          </Link>
          <Link
            href="/report-scam"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2.5 border-2 border-red-600 text-red-500 hover:bg-red-500/10 font-bold"
          >
            Report Scam
          </Link>
          <a
            href="https://github.com/Dev-Ahmed-Hassan"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2.5 border-2 border-[var(--border-color)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--card-bg)] flex items-center gap-2"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span>GitHub (Dev-Ahmed-Hassan) ↗</span>
          </a>
        </nav>
      )}
    </header>
  );
}

