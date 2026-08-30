"use client";

import type { Lang, RedFlag, VerifiedFact, Weight } from "@/lib/report-types";
import { getDomain, getReportT, isUrduScript } from "@/lib/report-utils";
import SectionHeader from "./SectionHeader";
import { ExternalIcon } from "./icons";

function WeightBadge({ weight, lang }: { weight: Weight; lang: Lang }) {
  const t = getReportT(lang);
  const label = weight === "high" ? t.high : weight === "medium" ? t.medium : t.low;
  const filled = weight === "high";
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

function StatusBadge({ status, lang }: { status: string; lang: Lang }) {
  const t = getReportT(lang);
  const label =
    status === "confirmed" ? t.confirmed : status === "contradicted" ? t.contradicted : t.unverified;
  const filled = status === "confirmed";
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

function Quote({ text }: { text: string }) {
  const rtl = isUrduScript(text);
  return (
    <blockquote
      dir={rtl ? "rtl" : "ltr"}
      className={`border-s-4 border-[var(--border-color)] ps-4 pe-2 py-1 my-3 text-sm leading-relaxed ${
        rtl ? "font-[Noto_Nastaliq_Urdu,serif]" : "font-serif italic"
      }`}
    >
      <span className="opacity-40">{"\u201C"}</span>
      {text}
      <span className="opacity-40">{"\u201D"}</span>
    </blockquote>
  );
}

function SourceLink({ url, label }: { url: string; label: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      dir="ltr"
      className="inline-flex items-center gap-1.5 mt-1 text-[11px] font-mono uppercase tracking-wider border-b-2 border-[var(--border-color)] px-1 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
    >
      {label}: {getDomain(url)}
      <ExternalIcon className="w-3 h-3" />
    </a>
  );
}

export function RedFlags({ flags, lang }: { flags: RedFlag[]; lang: Lang }) {
  const t = getReportT(lang);
  if (!flags?.length) return null;
  return (
    <section id="flags" className="fade-rise scroll-mt-6" style={{ animationDelay: "120ms" }}>
      <SectionHeader index="01" title={t.redFlagsTitle} count={flags.length} />
      <div className="space-y-4">
        {flags.map((f, i) => (
          <article
            key={i}
            className="border-2 border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-[3px_3px_0_var(--shadow-color)] transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <h4 className="font-bold uppercase tracking-wide text-sm leading-snug flex items-baseline gap-2.5 min-w-0">
                <span className="font-serif text-xl opacity-30 shrink-0" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {f.flag}
              </h4>
              <WeightBadge weight={f.weight} lang={lang} />
            </div>
            <Quote text={f.snippet_quote} />
            <SourceLink url={f.source_url} label={t.sourceLabel} />
            <div className="mt-4 pt-3 border-t-2 border-dashed border-[var(--border-color)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-1.5">
                {t.whyItMatters}
              </p>
              <p className="text-sm leading-relaxed">{f.technical_basis}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function VerifiedFacts({ facts, lang }: { facts: VerifiedFact[]; lang: Lang }) {
  const t = getReportT(lang);
  if (!facts?.length) return null;
  return (
    <section id="facts" className="fade-rise scroll-mt-6" style={{ animationDelay: "160ms" }}>
      <SectionHeader index="02" title={t.verifiedFactsTitle} count={facts.length} />
      <div className="space-y-4">
        {facts.map((f, i) => (
          <article
            key={i}
            className="border-2 border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-[3px_3px_0_var(--shadow-color)] transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <h4 className="font-bold uppercase tracking-wide text-sm leading-snug flex items-baseline gap-2.5 min-w-0">
                <span className="font-serif text-xl opacity-30 shrink-0" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {f.claim}
              </h4>
              <StatusBadge status={f.evidence_status} lang={lang} />
            </div>
            <Quote text={f.snippet_quote} />
            <SourceLink url={f.source_url} label={t.sourceLabel} />
          </article>
        ))}
      </div>
    </section>
  );
}
