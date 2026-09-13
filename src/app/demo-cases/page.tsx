"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ThemeSettingsModal from "@/components/ThemeSettingsModal";
import AmbientBackgroundGrid from "@/components/AmbientBackgroundGrid";
import { DEMO_CASES_LIST, type DemoCaseItem } from "@/lib/demo-cases-data";
import { useThemeTransition } from "@/lib/useThemeTransition";

export default function DemoCasesPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeFlyerItem, setActiveFlyerItem] = useState<DemoCaseItem | null>(null);

  const {
    isDark,
    palette,
    language,
    toggleTheme,
    handlePaletteChange,
    handleLanguageChange,
  } = useThemeTransition();

  const filteredCases = DEMO_CASES_LIST.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.target_entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.input_text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Split into left and right columns for staggered 2-column masonry grid
  const leftColumnCases = filteredCases.filter((_, idx) => idx % 2 === 0);
  const rightColumnCases = filteredCases.filter((_, idx) => idx % 2 !== 0);

  const handleRunSimulation = (item: DemoCaseItem) => {
    try {
      sessionStorage.setItem(
        "scamless_demo_payload",
        JSON.stringify({
          input_text: item.input_text,
          target_entity: item.target_entity,
          ad_image: item.ad_image,
          file_name: item.input_files[0]?.name,
        })
      );
    } catch (e) {}
    router.push("/");
  };

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

      {/* FLYER IMAGE LIGHTBOX MODAL */}
      {activeFlyerItem && activeFlyerItem.ad_image && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-fade-rise">
          <div className="brutal-card bg-[var(--card-bg)] border-2 sm:border-4 border-[var(--border-color)] p-4 sm:p-6 max-w-3xl w-full max-h-[90vh] flex flex-col space-y-4 shadow-[10px_10px_0_var(--shadow-color)] overflow-hidden">
            <div className="flex items-center justify-between border-b-2 border-[var(--border-color)] pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg sm:text-xl text-[var(--foreground)] uppercase">
                  {activeFlyerItem.target_entity} — Ad Flyer
                </h3>
                <p className="text-xs font-mono opacity-70">
                  {activeFlyerItem.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveFlyerItem(null)}
                className="px-3 py-1.5 bg-[var(--foreground)] text-[var(--background)] font-mono font-bold text-xs uppercase border-2 border-[var(--border-color)] shadow-[2px_2px_0_var(--shadow-color)] hover:opacity-90 cursor-pointer"
              >
                CLOSE ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto flex items-center justify-center bg-black/10 p-2 border border-[var(--border-color)]">
              <img
                src={activeFlyerItem.ad_image}
                alt={activeFlyerItem.title}
                className="max-w-full max-h-[60vh] object-contain shadow-md"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border-color)]">
              <span className="text-xs font-mono opacity-80 border-l-2 border-[var(--foreground)] pl-2 max-w-md truncate">
                &ldquo;{activeFlyerItem.verdict_line}&rdquo;
              </span>
              <button
                type="button"
                onClick={() => {
                  const item = activeFlyerItem;
                  setActiveFlyerItem(null);
                  handleRunSimulation(item);
                }}
                className="py-2.5 px-5 brutal-btn bg-[var(--foreground)] text-[var(--background)] font-mono font-bold text-xs tracking-wider border-2 border-[var(--border-color)] shadow-[3px_3px_0_var(--shadow-color)] uppercase flex items-center gap-2 cursor-pointer"
              >
                <span>RUN LIVE SCAN SIMULATION →</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UNIVERSAL HEADER NAVBAR */}
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleTheme={toggleTheme}
        isDark={isDark}
      />

      {/* MAIN CONTENT AREA */}
      <main className="w-full max-w-5xl z-20 space-y-10 py-4">
        {/* HEADER TITLE SECTION */}
        <header className="border-b-2 sm:border-b-4 border-[var(--border-color)] pb-6 space-y-3">
          <div className="flex items-center gap-2.5 font-mono text-xs text-[var(--foreground)]">
            <span className="font-bold uppercase tracking-widest border-l-2 border-[var(--foreground)] pl-2">
              CURATED THREAT INDEX
            </span>
            <span className="opacity-40">//</span>
            <span className="opacity-60 text-[11px] uppercase tracking-wider">
              REAL-WORLD INPUT PAYLOADS
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[var(--foreground)] tracking-tight uppercase leading-none">
            Curated Scenarios
          </h1>

          <p className="text-xs sm:text-sm font-sans text-[var(--foreground)] opacity-85 leading-relaxed max-w-2xl">
            Explore curated real-world scam input payloads across Pakistan and international channels. Click any flyer image or scenario to trigger a live OSINT verification scan.
          </p>
        </header>

        {/* CONTROLS BAR: CATEGORY FILTER TABS & SEARCH */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-dashed border-[var(--border-color)] pb-6">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 font-mono text-xs">
            {[
              { id: "all", label: "ALL SCENARIOS" },
              { id: "job", label: "JOB OFFERS" },
              { id: "whatsapp", label: "WHATSAPP TASKS" },
              { id: "phishing", label: "PHISHING URLS" },
              { id: "payment", label: "REFUND FRAUD" },
              { id: "legitimate", label: "VERIFIED SAFE" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 font-bold uppercase transition-all cursor-pointer text-xs ${
                  selectedCategory === cat.id
                    ? "border-2 border-[var(--foreground)] bg-[var(--card-bg)] text-[var(--foreground)] shadow-[2px_2px_0_var(--shadow-color)]"
                    : "border-2 border-transparent text-[var(--foreground)] opacity-60 hover:opacity-100"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-auto min-w-[240px]">
            <input
              type="text"
              placeholder="Search input text or company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--input-bg)] border-2 border-[var(--border-color)] text-[var(--foreground)] text-xs sm:text-sm p-2.5 font-mono focus:border-[var(--foreground)] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* STAGGERED 2-COLUMN MASONRY GRID (OPTIMIZED ELEGANT VISUAL STAGGER) */}
        {filteredCases.length === 0 ? (
          <div className="brutal-card border-2 border-dashed border-[var(--border-color)] bg-[var(--card-bg)] p-12 text-center text-xs font-mono opacity-70">
            No threat scenarios found matching the active filter query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 items-start">
            {/* LEFT COLUMN (CASES 1, 3, 5) */}
            <div className="space-y-10 sm:space-y-12">
              {leftColumnCases.map((item) => (
                <CaseShowcaseCard
                  key={item.id}
                  item={item}
                  onRunScan={handleRunSimulation}
                  onOpenFlyer={(item) => setActiveFlyerItem(item)}
                />
              ))}
            </div>

            {/* RIGHT COLUMN (CASCADING STAGGERED OFFSET - ~160px TIGHT MASONRY SHIFT) */}
            <div className="space-y-10 sm:space-y-12 md:mt-36 lg:mt-44">
              {rightColumnCases.map((item) => (
                <CaseShowcaseCard
                  key={item.id}
                  item={item}
                  onRunScan={handleRunSimulation}
                  onOpenFlyer={(item) => setActiveFlyerItem(item)}
                />
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM CALLOUT BANNER (Inspired by reference design) */}
        <section className="brutal-card bg-[var(--card-bg)] border-2 sm:border-4 border-[var(--border-color)] p-8 shadow-[8px_8px_0_var(--shadow-color)] text-center space-y-4 mt-12">
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--foreground)] opacity-70">
            // LIVE ANALYSIS ENGINE
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[var(--foreground)] uppercase tracking-tight">
            Have a Suspicious Link or Message?
          </h2>
          <p className="text-xs sm:text-sm font-sans opacity-85 max-w-xl mx-auto leading-relaxed">
            Paste any unverified job offer, WhatsApp recruiter text, or payment link to generate a comprehensive editorial OSINT report in seconds.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-block py-3.5 px-8 brutal-btn bg-[var(--foreground)] text-[var(--background)] font-mono font-bold text-xs sm:text-sm tracking-widest border-2 border-[var(--border-color)] shadow-[4px_4px_0_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer uppercase"
            >
              RUN CUSTOM SCAN NOW →
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full max-w-5xl z-20 mt-16 pt-6 border-t-2 border-[var(--border-color)] text-center text-xs font-mono opacity-70">
        ScamLess Curated Threat Cases Index &copy; 2026
      </footer>
    </div>
  );
}

{/* INDIVIDUAL CASE SHOWCASE CARD COMPONENT (LIGHTWEIGHT, ZERO EXTRA TAGS, MONOCHROME) */}
function CaseShowcaseCard({
  item,
  onRunScan,
  onOpenFlyer,
}: {
  item: DemoCaseItem;
  onRunScan: (item: DemoCaseItem) => void;
  onOpenFlyer: (item: DemoCaseItem) => void;
}) {
  return (
    <article className="brutal-card bg-[var(--card-bg)] border-2 border-[var(--border-color)] p-6 sm:p-7 shadow-[5px_5px_0_var(--shadow-color)] space-y-6 flex flex-col justify-between transition-all hover:translate-x-[1px] hover:translate-y-[1px]">
      <div className="space-y-4">
        {/* COMPANY / ENTITY NAME & VERDICT SUMMARY LINE */}
        <div className="space-y-1">
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[var(--foreground)] tracking-tight">
            {item.target_entity}
          </h2>
          <p className="text-xs sm:text-sm font-sans font-medium text-[var(--foreground)] opacity-70 leading-relaxed">
            &ldquo;{item.verdict_line}&rdquo;
          </p>
        </div>

        {/* REAL AD IMAGE PAYLOAD PREVIEW (CLICKABLE LIGHTBOX TRIGGER) */}
        {item.ad_image && (
          <div
            onClick={() => onOpenFlyer(item)}
            className="border-2 border-[var(--border-color)] overflow-hidden bg-[var(--background)] max-h-64 flex items-center justify-center relative group shadow-[3px_3px_0_var(--shadow-color)] cursor-zoom-in transition-all hover:brightness-105"
            title="Click to view full resolution flyer image"
          >
            <img
              src={item.ad_image}
              alt={item.title}
              className="w-full h-auto max-h-64 object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute top-2 right-2 bg-[var(--foreground)] text-[var(--background)] text-[10px] font-mono font-bold px-2 py-0.5 uppercase border border-[var(--border-color)] shadow-[2px_2px_0_var(--shadow-color)] pointer-events-none">
              VIEW AD FLYER 🔍
            </div>
          </div>
        )}

        {/* INPUT FIELDS SPEC CONTAINER (Sleek, lightweight payload box) */}
        <div className="border border-[var(--border-color)]/60 bg-[var(--input-bg)] p-4 space-y-3 text-xs text-[var(--foreground)]">
          {/* INPUT MESSAGE CONTENT */}
          <p className="opacity-90 leading-relaxed font-mono text-xs">
            &ldquo;{item.input_text}&rdquo;
          </p>

          {/* INPUT ATTACHMENTS & URL INLINE SPEC */}
          {(item.input_files.length > 0 || item.input_urls.length > 0) && (
            <div className="pt-2 border-t border-dashed border-[var(--border-color)]/30 space-y-1.5 font-mono text-[11px]">
              {item.input_files.map((file, idx) => (
                <div key={idx} className="flex items-center gap-2 truncate opacity-85">
                  <span className="font-bold opacity-60">[{file.type}]</span>
                  <span className="truncate font-medium">{file.name}</span>
                  <span className="opacity-50 text-[10px] shrink-0">({file.size})</span>
                </div>
              ))}

              {item.input_urls.map((url, idx) => (
                <div key={idx} className="flex items-center gap-2 truncate opacity-85">
                  <span className="font-bold opacity-60">[URL]</span>
                  <span className="truncate font-medium">{url}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ACTION TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => onRunScan(item)}
        className="w-full py-3 px-4 brutal-btn bg-[var(--foreground)] text-[var(--background)] font-mono font-bold text-xs tracking-wider border-2 border-[var(--border-color)] shadow-[3px_3px_0_var(--shadow-color)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer uppercase flex items-center justify-center gap-2"
      >
        <span>RUN LIVE SCAN SIMULATION →</span>
      </button>
    </article>
  );
}
