"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/report-types";
import { getProgressT } from "@/lib/report-utils";
import { CheckIcon } from "./report/icons";

const PHASE1_SECONDS = 4;
const PHASE2_SECONDS = 45;
const EXPECTED_TOTAL = 55;

export default function InvestigationProgress({ lang }: { lang: Lang }) {
  const t = getProgressT(lang);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const activePhase = elapsed < PHASE1_SECONDS ? 1 : elapsed < PHASE2_SECONDS ? 2 : 3;
  const subIdx = Math.floor(Math.max(0, elapsed - PHASE1_SECONDS) / 5) % t.phase2Subs.length;
  const progress = Math.min(96, (elapsed / EXPECTED_TOTAL) * 100);
  const totalBlocks = 28;
  const filledBlocks = Math.floor((progress / 100) * totalBlocks);

  const phases = [
    { n: 1, title: t.phase1, sub: t.phase1Sub },
    { n: 2, title: t.phase2, sub: activePhase === 2 ? t.phase2Subs[subIdx] : t.phase2Subs[0] },
    { n: 3, title: t.phase3, sub: t.phase3Sub },
  ];

  return (
    <div
      className="mt-12 brutal-card p-6 sm:p-8 fade-rise"
      dir={lang === "ur" ? "rtl" : "ltr"}
      role="status"
      aria-live="polite"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-[var(--border-color)] pb-3 mb-6">
        <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em]">
          <span className="w-2.5 h-2.5 bg-[var(--foreground)] blink" aria-hidden />
          {t.liveLabel}
        </span>
        <span className="text-xs font-mono uppercase tracking-wider opacity-70" dir="ltr">
          {t.elapsedLabel} {elapsed}s
        </span>
      </div>

      {/* Phases */}
      <ol className="space-y-5">
        {phases.map((p) => {
          const done = activePhase > p.n;
          const active = activePhase === p.n;
          return (
            <li key={p.n} className="flex items-start gap-4">
              <span
                className={`shrink-0 w-7 h-7 border-2 border-[var(--border-color)] flex items-center justify-center mt-0.5 ${
                  done ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-transparent"
                }`}
                aria-hidden
              >
                {done ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-mono font-bold">{p.n}</span>
                )}
              </span>
              <div className="min-w-0">
                <p
                  className={`text-sm font-bold uppercase tracking-wider leading-snug ${
                    active ? "" : done ? "opacity-70" : "opacity-40"
                  }`}
                >
                  {p.title}
                  {active && <span className="ml-1 blink" aria-hidden> {"\u2588"}</span>}
                </p>
                <p
                  className={`mt-1 text-xs font-mono ${
                    active ? "opacity-70" : "opacity-35"
                  } ${lang === "ur" && p.n === 2 ? "font-[Noto_Nastaliq_Urdu,serif] text-sm" : ""}`}
                  dir={lang === "ur" && p.n === 2 ? "rtl" : "ltr"}
                >
                  {p.sub}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Progress blocks */}
      <div className="mt-7 flex gap-1" dir="ltr" aria-hidden>
        {Array.from({ length: totalBlocks }).map((_, i) => (
          <div
            key={i}
            className={`h-3 flex-1 border-2 border-[var(--border-color)] transition-colors duration-300 ${
              i < filledBlocks ? "bg-[var(--foreground)]" : "bg-transparent"
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-[10px] font-mono uppercase tracking-widest opacity-50 text-center" dir="ltr">
        {Math.round(progress)}%
      </p>
    </div>
  );
}
