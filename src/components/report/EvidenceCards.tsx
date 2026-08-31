"use client";

import type { Lang, RedFlag, VerifiedFact } from "@/lib/report-types";
import { getDomain, getReportT, isUrduScript } from "@/lib/report-utils";
import SectionHeader from "./SectionHeader";
import { ExternalIcon } from "./icons";

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

// Shared quote callout for verified facts (light bg context)
function Quote({ text }: { text: string }) {
  const rtl = isUrduScript(text);
  return (
    <blockquote
      dir={rtl ? "rtl" : "ltr"}
      className={`border-s-[3px] border-[var(--border-color)] bg-[var(--foreground)] bg-opacity-[0.04] ps-3 pe-2 py-2 my-3 text-sm leading-relaxed ${
        rtl ? "font-[Noto_Nastaliq_Urdu,serif]" : "font-mono"
      }`}
    >
      {text}
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
            className="border-2 border-[var(--border-color)] bg-[var(--foreground)] text-[var(--background)] p-5 shadow-[3px_3px_0_var(--shadow-color)]"
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <h4 className="font-bold uppercase tracking-wide text-sm leading-snug flex items-baseline gap-2.5 min-w-0">
                <span className="font-serif text-xl opacity-25 shrink-0" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {f.flag}
              </h4>
              <span
                className={`shrink-0 text-[10px] font-bold uppercase tracking-widest px-2 py-1 border-2 ${
                  f.weight === "high"
                    ? "border-[var(--background)] bg-[var(--background)] text-[var(--foreground)]"
                    : "border-[var(--background)] border-opacity-50 bg-transparent text-[var(--background)]"
                }`}
              >
                {f.weight === "high" ? t.high : f.weight === "medium" ? t.medium : t.low}
              </span>
            </div>
            {/* Quote on inverted card — darker bg strip */}
            <blockquote
              dir={isUrduScript(f.snippet_quote) ? "rtl" : "ltr"}
              className={`border-s-[3px] border-[var(--background)] border-opacity-30 bg-[var(--background)] bg-opacity-10 ps-3 py-2 my-3 text-sm leading-relaxed ${
                isUrduScript(f.snippet_quote) ? "font-[Noto_Nastaliq_Urdu,serif]" : "font-mono"
              }`}
            >
              {f.snippet_quote}
            </blockquote>
            <a
              href={f.source_url}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
              className="inline-flex items-center gap-1.5 mt-1 text-[11px] font-mono uppercase tracking-wider border-b border-[var(--background)] border-opacity-40 px-1 hover:bg-[var(--background)] hover:text-[var(--foreground)] transition-colors opacity-75"
            >
              {t.sourceLabel}: {getDomain(f.source_url)}
              <ExternalIcon className="w-3 h-3" />
            </a>
            <div className="mt-4 pt-3 border-t border-dashed border-[var(--background)] border-opacity-20">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 mb-1.5">
                {t.whyItMatters}
              </p>
              <p className="text-sm leading-relaxed opacity-85">{f.technical_basis}</p>
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
      <div className="space-y-3">
        {facts.map((f, i) => (
          <article
            key={i}
            className="border-l-4 border-[var(--border-color)] bg-[var(--card-bg)] pl-4 pr-4 py-4"
          >
            <div className="flex items-start justify-between gap-3 mb-1">
              <h4 className="font-bold text-sm leading-snug min-w-0">{f.claim}</h4>
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
