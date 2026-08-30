"use client";

import type { AnalyzeV2Response, Lang } from "@/lib/report-types";
import { isUrduScript } from "@/lib/report-utils";
import VerdictHero from "./report/VerdictHero";
import { RedFlags, VerifiedFacts } from "./report/EvidenceCards";
import {
  ActionChecklist,
  ForensicSection,
  LinksExplorer,
  ThreatVectors,
  TransparencySection,
  UncertaintiesSection,
} from "./report/DossierSections";
import { CheckIcon } from "./report/icons";

export default function DossierReport({
  data,
  lang,
}: {
  data: AnalyzeV2Response;
  lang: Lang;
}) {
  const report = data.report;
  if (!report) return null;

  const ufr = report.user_facing_report;
  const lede = ufr?.summary_paragraph;
  const ledeRtl = isUrduScript(lede);
  const checkedItems = ufr?.what_we_checked ?? [];

  return (
    <div className="mt-12 space-y-10" dir={lang === "ur" ? "rtl" : "ltr"}>
      <VerdictHero
        report={report}
        entities={data.extracted_entities}
        timings={data.timings}
        lang={lang}
      />

      {/* Editorial lede */}
      {lede && (
        <section className="fade-rise" style={{ animationDelay: "80ms" }}>
          <p
            dir={ledeRtl ? "rtl" : "ltr"}
            className={`text-base sm:text-lg leading-relaxed ${
              ledeRtl
                ? "font-[Noto_Nastaliq_Urdu,serif] text-right"
                : "font-serif drop-cap"
            }`}
          >
            {lede}
          </p>
          {checkedItems.length > 0 && (
            <ul className="mt-6 grid sm:grid-cols-2 gap-x-8 gap-y-2.5">
              {checkedItems.map((item, i) => {
                const itemRtl = isUrduScript(item);
                return (
                  <li
                    key={i}
                    dir={itemRtl ? "rtl" : "ltr"}
                    className={`flex items-start gap-2.5 text-xs font-bold uppercase tracking-wide opacity-80 ${
                      itemRtl ? "font-[Noto_Nastaliq_Urdu,serif] normal-case tracking-normal text-right" : ""
                    }`}
                  >
                    <CheckIcon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    <span className="leading-snug">{item}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      <RedFlags flags={report.red_flags} lang={lang} />
      <VerifiedFacts facts={report.verified_facts} lang={lang} />
      <ThreatVectors vectors={report.threat_vectors} lang={lang} />
      <LinksExplorer links={report.links_of_interest} lang={lang} />
      <UncertaintiesSection uncertainties={report.uncertainties} lang={lang} />
      <ActionChecklist actions={ufr?.what_you_should_do ?? []} lang={lang} />
      <TransparencySection discarded={report.discarded_evidence} lang={lang} />
      <ForensicSection report={report} timings={data.timings} lang={lang} />
    </div>
  );
}
