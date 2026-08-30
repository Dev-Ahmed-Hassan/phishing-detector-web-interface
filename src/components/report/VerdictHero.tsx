"use client";

import type { ExtractedEntities, JudgeReport, Timings, Lang } from "@/lib/report-types";
import { getDomain, getReportT, isUrduScript, pickTakeaway, verdictStyle } from "@/lib/report-utils";

export default function VerdictHero({
  report,
  entities,
  timings,
  lang,
}: {
  report: JudgeReport;
  entities?: ExtractedEntities | null;
  timings?: Timings | null;
  lang: Lang;
}) {
  const t = getReportT(lang);
  const v = verdictStyle(report.executive_summary.verdict);
  const score = Math.round(report.executive_summary.confidence_score);
  const takeaway = pickTakeaway(report.executive_summary.one_sentence_takeaway);
  const takeawayRtl = isUrduScript(takeaway);

  const dateStr = new Date().toLocaleDateString(
    lang === "ur" ? "ur-PK" : "en-GB",
    { day: "2-digit", month: "short", year: "numeric" }
  );

  const blocks = 20;
  const filled = Math.round((Math.max(0, Math.min(100, score)) / 100) * blocks);

  const stats = [
    { n: report.metadata?.total_facts ?? report.verified_facts?.length ?? 0, label: t.statsFacts, href: "#facts" },
    { n: report.metadata?.total_red_flags ?? report.red_flags?.length ?? 0, label: t.statsFlags, href: "#flags" },
    { n: report.metadata?.total_links_of_interest ?? 0, label: t.statsLinks, href: "#links" },
    { n: report.metadata?.total_discarded ?? report.discarded_evidence?.length ?? 0, label: t.statsDiscarded, href: "#transparency" },
  ];

  const chips: string[] = [];
  if (entities?.organization_name) chips.push(entities.organization_name);
  if (entities?.roles?.length) chips.push(...entities.roles);
  if (entities?.urls?.length) chips.push(...entities.urls.map(getDomain));
  if (entities?.emails?.length) chips.push(...entities.emails);
  if (entities?.phones?.length) chips.push(...entities.phones);
  if (entities?.salary_or_fee_claims) chips.push(entities.salary_or_fee_claims);
  const uniqueChips = Array.from(new Set(chips)).slice(0, 8);

  return (
    <section
      className="brutal-card p-6 sm:p-8 fade-rise"
      style={{ backgroundColor: `var(${v.bgVar})`, color: `var(${v.inkVar})` }}
    >
      {/* Eyebrow / meta row */}
      <div
        className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b-2 pb-3 mb-6"
        style={{ borderColor: "currentColor" }}
      >
        <span className="text-xs font-bold uppercase tracking-[0.35em]">{t.caseFile}</span>
        <span className="text-[11px] font-mono uppercase tracking-wider opacity-80" dir="ltr">
          {t.filed} {dateStr}
          {report.metadata?.model ? ` · ${String(report.metadata.model).toUpperCase()}` : ""}
          {timings?.total_s !== undefined ? ` · ${timings.total_s}${t.secondsLabel || "s"}` : ""}
        </span>
      </div>

      {/* Entity + stamp */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-5">
        <div className="min-w-0">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl uppercase tracking-tight leading-tight break-words">
            {entities?.organization_name || report.metadata?.target_entity || t.unknownEntity}
          </h2>
          {report.user_facing_report?.title && (
            <p className="mt-2 text-xs sm:text-sm font-bold uppercase tracking-wider opacity-75">
              {report.user_facing_report.title}
            </p>
          )}
          {report.executive_summary.primary_threat_vector && (
            <p
              dir="ltr"
              className="mt-4 inline-block max-w-full text-[11px] font-mono uppercase tracking-wider bg-[var(--card-bg)] text-[var(--foreground)] border-2 border-[var(--border-color)] px-2.5 py-1.5 leading-snug"
            >
              <span className="opacity-60">{t.primaryThreat}: </span>
              {report.executive_summary.primary_threat_vector}
            </p>
          )}
        </div>
        <div
          className="stamp shrink-0 px-4 py-2 font-bold text-sm sm:text-base uppercase bg-transparent"
          aria-label={lang === "ur" ? v.labelUr : v.label}
        >
          {lang === "ur" ? v.labelUr : v.label}
        </div>
      </div>

      {/* Score gauge */}
      <div className="mt-6 bg-[var(--card-bg)] text-[var(--foreground)] border-2 border-[var(--border-color)] p-4 sm:p-5">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="flex items-baseline gap-2">
            <span
              className="font-serif font-bold text-5xl sm:text-6xl leading-none"
              style={{ color: `var(${v.inkVar})` }}
            >
              {score}
            </span>
            <span className="text-sm font-bold opacity-50">/100</span>
          </div>
          <div className={lang === "ur" ? "text-left" : "text-right"}>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-70">
              {t.legitimacyScore}
            </p>
            <p className="text-[10px] font-mono uppercase tracking-wider opacity-40 mt-1">
              {t.scaleHint}
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-1" dir="ltr" aria-hidden>
          {Array.from({ length: blocks }).map((_, i) => (
            <div
              key={i}
              className="h-3.5 flex-1 border-2 border-[var(--border-color)] transition-colors"
              style={i < filled ? { backgroundColor: `var(${v.inkVar})` } : undefined}
            />
          ))}
        </div>
      </div>

      {/* Takeaway */}
      {takeaway && (
        <div className="mt-4 bg-[var(--card-bg)] text-[var(--foreground)] border-2 border-[var(--border-color)] p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-60 mb-2">
            {t.theTakeaway}
          </p>
          <p
            dir={takeawayRtl ? "rtl" : "ltr"}
            className={`text-base sm:text-lg leading-relaxed ${
              takeawayRtl
                ? "font-[Noto_Nastaliq_Urdu,serif] text-right"
                : "font-serif italic"
            }`}
          >
            {takeaway}
          </p>
        </div>
      )}

      {/* Stats tiles */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {stats.map((s) => (
          <a
            key={s.href}
            href={s.href}
            className="bg-[var(--card-bg)] text-[var(--foreground)] border-2 border-[var(--border-color)] p-3 text-center hover:-translate-y-0.5 transition-transform"
          >
            <span className="block font-serif font-bold text-2xl leading-none">
              {String(s.n).padStart(2, "0")}
            </span>
            <span className="block text-[10px] font-bold uppercase tracking-widest mt-1.5 opacity-70 leading-tight">
              {s.label}
            </span>
          </a>
        ))}
      </div>

      {/* Extracted entities */}
      {uniqueChips.length > 0 && (
        <div className="mt-5 pt-4 border-t-2 border-dashed border-[var(--border-color)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-70 mb-2.5">
            {t.extractedLabel}
          </p>
          <div className="flex flex-wrap gap-2" dir="ltr">
            {uniqueChips.map((chip, i) => (
              <span
                key={i}
                className="bg-[var(--card-bg)] text-[var(--foreground)] border-2 border-[var(--border-color)] px-2 py-0.5 text-xs font-mono font-medium max-w-full truncate"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
