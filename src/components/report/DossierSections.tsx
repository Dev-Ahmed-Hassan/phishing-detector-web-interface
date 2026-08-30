"use client";

import { useState } from "react";
import type {
  DiscardedItem,
  Lang,
  LinkOfInterest,
  ThreatVector,
  Uncertainty,
  JudgeReport,
  Timings,
  Weight,
} from "@/lib/report-types";
import { getDomain, getReportT, isUrduScript } from "@/lib/report-utils";
import SectionHeader from "./SectionHeader";
import { ArrowIcon, CheckIcon, ChevronIcon, ExternalIcon } from "./icons";

function SeverityBadge({ severity, lang }: { severity: Weight; lang: Lang }) {
  const t = getReportT(lang);
  const label =
    severity === "high" ? t.high : severity === "medium" ? t.medium : t.low;
  const filled = severity === "high";
  return (
    <span
      className={`shrink-0 text-[10px] font-bold uppercase tracking-widest px-2 py-1 border-2 border-[var(--border-color)] ${
        filled
          ? "bg-[var(--foreground)] text-[var(--background)]"
          : "bg-transparent text-[var(--foreground)]"
      }`}
    >
      {label}
    </span>
  );
}

export function ThreatVectors({ vectors, lang }: { vectors: ThreatVector[]; lang: Lang }) {
  const t = getReportT(lang);
  if (!vectors?.length) return null;
  return (
    <section id="vectors" className="fade-rise scroll-mt-6" style={{ animationDelay: "200ms" }}>
      <SectionHeader index="03" title={t.threatVectorsTitle} count={vectors.length} />
      <div className="space-y-4">
        {vectors.map((v, i) => {
          const rtl = isUrduScript(v.technical_grounding);
          return (
            <article
              key={i}
              className="border-2 border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-[3px_3px_0_var(--shadow-color)]"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-serif font-bold text-lg leading-snug">{v.vector}</h4>
                <SeverityBadge severity={v.severity} lang={lang} />
              </div>
              <p
                dir={rtl ? "rtl" : "ltr"}
                className={`mt-3 text-sm leading-relaxed ${
                  rtl ? "font-[Noto_Nastaliq_Urdu,serif] text-right" : ""
                }`}
              >
                {v.technical_grounding}
              </p>
              {v.contributing_evidence?.length > 0 && (
                <div className="mt-4 pt-3 border-t-2 border-dashed border-[var(--border-color)]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-2">
                    {t.contributingEvidence}
                  </p>
                  <div className="flex flex-wrap gap-2" dir="ltr">
                    {v.contributing_evidence.map((url, j) => (
                      <a
                        key={j}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider border-2 border-[var(--border-color)] px-2 py-1 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
                      >
                        {getDomain(url)}
                        <ExternalIcon className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function LinksExplorer({
  links,
  lang,
}: {
  links: Record<string, LinkOfInterest[]>;
  lang: Lang;
}) {
  const t = getReportT(lang);
  const entries = Object.entries(links ?? {}).filter(([, items]) => items?.length > 0);
  if (!entries.length) return null;
  const total = entries.reduce((acc, [, items]) => acc + items.length, 0);
  return (
    <section id="links" className="fade-rise scroll-mt-6" style={{ animationDelay: "240ms" }}>
      <SectionHeader index="04" title={t.linksTitle} count={total} />
      <div className="space-y-6">
        {entries.map(([category, items]) => (
          <div key={category}>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] opacity-70 mb-2.5">
              {category}
            </p>
            <div className="space-y-2.5">
              {items.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border-2 border-[var(--border-color)] bg-[var(--card-bg)] p-4 shadow-[2px_2px_0_var(--shadow-color)] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--shadow-color)] group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-bold text-sm leading-snug group-hover:underline underline-offset-4">
                      {link.title}
                    </h4>
                    <ArrowIcon className="w-4 h-4 shrink-0 mt-0.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all rtl:rotate-180" />
                  </div>
                  <p dir="ltr" className="mt-1.5 text-[11px] font-mono uppercase tracking-wider opacity-60">
                    {getDomain(link.url)}
                    {link.category ? ` · ${link.category}` : ""}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed opacity-90">{link.explanation}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function UncertaintiesSection({
  uncertainties,
  lang,
}: {
  uncertainties: Uncertainty[];
  lang: Lang;
}) {
  const t = getReportT(lang);
  if (!uncertainties?.length) return null;
  return (
    <section id="uncertainties" className="fade-rise scroll-mt-6" style={{ animationDelay: "280ms" }}>
      <SectionHeader index="05" title={t.uncertaintiesTitle} count={uncertainties.length} />
      <div className="space-y-4">
        {uncertainties.map((u, i) => {
          const rtl = isUrduScript(u.what_is_missing);
          return (
            <article
              key={i}
              className="border-2 border-dashed border-[var(--border-color)] bg-[var(--card-bg)] p-5"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-1.5">
                {t.whatIsMissing}
              </p>
              <p
                dir={rtl ? "rtl" : "ltr"}
                className={`font-bold text-sm leading-snug ${rtl ? "font-[Noto_Nastaliq_Urdu,serif] text-right" : ""}`}
              >
                {u.what_is_missing}
              </p>
              <p className="mt-3 text-sm leading-relaxed opacity-90">{u.why_it_matters}</p>
              {u.suggested_user_action && (
                <div
                  className={`mt-4 pt-3 border-t-2 border-dashed border-[var(--border-color)] flex gap-2.5 items-start`}
                >
                  <ArrowIcon className="w-4 h-4 shrink-0 mt-0.5 rtl:rotate-180" />
                  <p className="text-sm font-bold leading-relaxed">{u.suggested_user_action}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function ActionChecklist({ actions, lang }: { actions: string[]; lang: Lang }) {
  const t = getReportT(lang);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  if (!actions?.length) return null;

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <section id="actions" className="fade-rise scroll-mt-6" style={{ animationDelay: "320ms" }}>
      <SectionHeader
        index="06"
        title={t.actionsTitle}
        count={checked.size === actions.length ? undefined : actions.length}
      />
      {checked.size > 0 && (
        <p className="text-[11px] font-mono uppercase tracking-wider opacity-70 -mt-3 mb-3">
          {checked.size}/{actions.length} {t.doneLabel}
        </p>
      )}
      <div className="space-y-2.5">
        {actions.map((action, i) => {
          const rtl = isUrduScript(action);
          const isChecked = checked.has(i);
          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              dir={rtl ? "rtl" : "ltr"}
              className={`w-full text-start flex gap-3.5 items-start border-2 border-[var(--border-color)] bg-[var(--card-bg)] p-4 shadow-[2px_2px_0_var(--shadow-color)] transition-all hover:-translate-y-0.5 ${
                isChecked ? "opacity-60" : ""
              } cursor-pointer`}
            >
              <span
                className={`shrink-0 w-6 h-6 border-2 border-[var(--border-color)] flex items-center justify-center mt-0.5 transition-colors ${
                  isChecked ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-transparent"
                }`}
                aria-hidden
              >
                {isChecked && <CheckIcon className="w-3.5 h-3.5" />}
              </span>
              <span
                className={`text-sm font-bold leading-relaxed text-start ${
                  rtl ? "font-[Noto_Nastaliq_Urdu,serif]" : ""
                }`}
              >
                {action}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function TransparencySection({
  discarded,
  lang,
}: {
  discarded: DiscardedItem[];
  lang: Lang;
}) {
  const t = getReportT(lang);
  if (!discarded?.length) return null;
  return (
    <section id="transparency" className="fade-rise scroll-mt-6" style={{ animationDelay: "360ms" }}>
      <details className="group border-2 border-[var(--border-color)] bg-[var(--card-bg)]">
        <summary className="list-none cursor-pointer p-4 flex items-center justify-between gap-3 select-none hover:bg-[var(--background)] transition-colors">
          <span className="text-sm font-bold uppercase tracking-widest">
            {t.transparencyTitle}
            <span className="ml-3 text-[11px] font-mono opacity-70 normal-case tracking-wider">
              {t.discardedCount(discarded.length)}
            </span>
          </span>
          <ChevronIcon className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180" />
        </summary>
        <div className="px-4 pb-4 space-y-2.5 border-t-2 border-[var(--border-color)] pt-4">
          {discarded.map((d, i) => (
            <div key={i} className="border-2 border-dashed border-[var(--border-color)] p-3">
              <div className="flex items-start justify-between gap-3">
                <a
                  href={d.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className="text-xs font-mono font-bold break-all hover:underline underline-offset-2"
                >
                  {d.title || d.source_url}
                </a>
                <span className="shrink-0 text-[10px] font-bold uppercase tracking-widest border-2 border-[var(--border-color)] px-1.5 py-0.5">
                  {t.reasonLabels[d.reason] ?? d.reason}
                </span>
              </div>
              {d.note && <p className="mt-1.5 text-xs opacity-70 leading-relaxed">{d.note}</p>}
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}

export function ForensicSection({
  report,
  timings,
  lang,
}: {
  report: JudgeReport;
  timings?: Timings | null;
  lang: Lang;
}) {
  const t = getReportT(lang);
  const timingRows = [
    { label: t.extractionLabel, value: timings?.extraction_s },
    { label: t.osintLabel, value: timings?.osint_collection_s },
    { label: t.judgmentLabel, value: timings?.judgment_s },
    { label: t.totalLabel, value: timings?.total_s },
  ].filter((r) => r.value !== undefined);

  if (!report.confidence_justification && !timingRows.length && !report.metadata?.model) {
    return null;
  }

  return (
    <section className="fade-rise" style={{ animationDelay: "400ms" }}>
      <details className="group border-2 border-[var(--border-color)] bg-[var(--card-bg)]">
        <summary className="list-none cursor-pointer p-4 flex items-center justify-between gap-3 select-none hover:bg-[var(--background)] transition-colors">
          <span className="text-sm font-bold uppercase tracking-widest">{t.forensicTitle}</span>
          <ChevronIcon className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180" />
        </summary>
        <div
          dir="ltr"
          className="mx-4 mb-4 p-4 bg-[var(--foreground)] text-[var(--background)] font-mono text-xs border-2 border-[var(--foreground)] overflow-x-auto space-y-4"
        >
          {report.confidence_justification && (
            <div>
              <p className="uppercase tracking-widest opacity-60 mb-1.5">{t.confidenceLabel}</p>
              <p className="leading-relaxed">{report.confidence_justification}</p>
            </div>
          )}
          {timingRows.length > 0 && (
            <div>
              <p className="uppercase tracking-widest opacity-60 mb-1.5">{t.totalLabel}</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                {timingRows.map((r) => (
                  <div key={r.label} className="flex justify-between gap-4">
                    <span className="opacity-70">{r.label}</span>
                    <span>{r.value}s</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {report.metadata?.model && (
              <p>
                <span className="opacity-70">{t.modelLabel}: </span>
                {String(report.metadata.model)}
              </p>
            )}
            {report.metadata?.input_language && (
              <p>
                <span className="opacity-70">{t.languageLabel}: </span>
                {String(report.metadata.input_language)}
              </p>
            )}
            {report.metadata?.temperature !== undefined && (
              <p>
                <span className="opacity-70">TEMP: </span>
                {String(report.metadata.temperature)}
              </p>
            )}
          </div>
        </div>
      </details>
    </section>
  );
}
