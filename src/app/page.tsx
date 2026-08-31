"use client";

import { useState, useEffect, useRef } from "react";
import type { AnalyzeV2Response, Lang, RedFlag, VerifiedFact, ThreatVector, LinkOfInterest, Uncertainty, DiscardedItem } from "@/lib/report-types";
import { getDomain, isUrduScript } from "@/lib/report-utils";
import InvestigationProgress from "@/components/InvestigationProgress";

// ============================================================================
// FABRICATED DEMO PAYLOAD FOR NEUTRAL MOCK EVALUATION (SAFE & FABRICATED)
// ============================================================================
const FABRICATED_DOSSIER = {
  metadata: {
    input_language: "english",
    target_entity: "Vanguard Apex Solutions",
    model: "gemini-2.5-flash",
    temperature: 0.0,
    total_facts: 2,
    total_red_flags: 2,
    total_links_of_interest: 3,
    total_discarded: 3
  },
  executive_summary: {
    verdict: "suspicious",
    confidence_score: 24,
    primary_threat_vector: "Virtual Certificate Fee Trap & Mass Unvetted Offer Letters",
    one_sentence_takeaway: {
      en: "Vanguard Apex Solutions operates a mass virtual internship portal issuing automated offer letters without screening, but candidate reports highlight compulsory fee demands to release internship completion certificates.",
      ur: "وینگارڈ ایپیکس سلوشنز بغیر کسی تفتیش کے خودکار انٹرنشپ آفر لیٹر جاری کرتا ہے، لیکن امیدواروں کی رپورٹس سرٹیفکیٹ حاصل کرنے کے لیے لازمی فیس کے مطالبات کو ظاہر کرتی ہیں۔"
    }
  },
  user_facing_report: {
    title: "High-Risk Virtual Internship & Certificate Fee Warning",
    summary_paragraph: "Investigation into Vanguard Apex Solutions indicates a high likelihood of an unvetted certificate monetization scheme. Candidates receive instant acceptance letters without interviews, followed by compulsory fee demands to obtain completion certificates.",
    what_we_checked: [
      "Official Domain Registry & Web Infrastructure",
      "Candidate Feedback & Public Community Warnings",
      "Corporate Entity Records & Regulatory Filings"
    ],
    what_you_should_do: [
      "Do not pay any money to secure or receive internship completion certificates.",
      "Be skeptical of internship offers that require zero screening or technical interviews.",
      "Verify company registration credentials on official government business registries."
    ]
  },
  verified_facts: [
    {
      claim: "Vanguard Apex Solutions maintains a corporate directory listing with over 15,000 registered applicants.",
      evidence_status: "confirmed",
      snippet_quote: "Vanguard Apex Solutions — Online Learning & Virtual Internship Portal",
      source_url: "https://vanguardapex.tech/about",
      source_type: "website",
      search_intent: "Find official corporate website for 'Vanguard Apex Solutions'",
      weight: "high"
    },
    {
      claim: "Vanguard Apex's primary web domain vanguardapex.tech was registered in November 2024.",
      evidence_status: "confirmed",
      snippet_quote: "Domain: vanguardapex.tech | Created Date: 2024-11-12",
      source_url: "https://whois.example.com/vanguardapex.tech",
      source_type: "whois",
      search_intent: "Verify domain registration date for vanguardapex.tech",
      weight: "high"
    }
  ],
  red_flags: [
    {
      flag: "Automated instant offer letters issued without technical screening or interviews",
      technical_basis: "Unvetted mass enrollment pipelines indicate a low-barrier lead generation scheme rather than genuine merit-based employment.",
      snippet_quote: "Applicants receive instant PDF offer letters within 5 minutes of submitting a form with no interview or assessment.",
      source_url: "https://forum.example.com/reviews/vanguard-apex",
      source_type: "community_forum",
      weight: "high"
    },
    {
      flag: "Mandatory verification fee required to unlock and issue official completion credentials",
      technical_basis: "Conditioning internship completion credentials on mandatory monetary payments is a primary indicator of a fee-trap certificate mill.",
      snippet_quote: "Upon completing assigned tasks, interns are instructed to pay a mandatory processing fee of $25 to receive their signed certificate.",
      source_url: "https://forum.example.com/reviews/vanguard-apex",
      source_type: "community_forum",
      weight: "critical"
    }
  ],
  links_of_interest: {
    "Official Presence": [
      {
        title: "Vanguard Apex Portal",
        url: "https://vanguardapex.tech",
        category: "Official Website",
        explanation: "The primary web portal used for candidate registration."
      }
    ],
    "Community Reviews": [
      {
        title: "Independent Safety Report for Vanguard Apex",
        url: "https://scam-detector.example.com/check/vanguardapex.tech",
        category: "Safety Evaluation",
        explanation: "Community review thread outlining mass offer letters and certificate fee complaints."
      }
    ]
  },
  threat_vectors: [
    {
      vector: "Certificate Mill & Fee Monetization",
      technical_grounding: "The entity issues automated unvetted offer letters and conditions internship completion credentials on mandatory secondary processing payments.",
      contributing_evidence: [
        "https://forum.example.com/reviews/vanguard-apex"
      ],
      severity: "high"
    }
  ],
  uncertainties: [
    {
      what_is_missing: "Official corporate tax identification and registered office filings",
      why_it_matters: "Without registered business tax identifiers, entity authenticity cannot be verified against official corporate registries.",
      suggested_user_action: "Request official corporate registration numbers prior to accepting virtual assignments."
    }
  ],
  discarded_evidence: [
    {
      source_url: "https://example.com/vanguard-logistics-uk",
      title: "Vanguard Apex Logistics UK Ltd",
      reason: "entity_mismatch",
      note: "Refers to a registered UK freight logistics corporation, completely unrelated to the virtual internship portal."
    },
    {
      source_url: "https://example.com/apex-esports-team",
      title: "Vanguard Apex Gaming Clan",
      reason: "entity_mismatch",
      note: "Refers to a competitive esports gaming team based in California."
    },
    {
      source_url: "https://example.com/apex-sports-gear",
      title: "Apex Vanguard Athletic Equipment",
      reason: "unrelated",
      note: "Refers to a sporting goods manufacturing brand."
    }
  ],
  confidence_justification: "Base score: 50. Domain registered recently: -10. Automated unvetted offer letters: -11. Mandatory certificate fee demand: -15. Final score: 24."
};

const MOCK_DATA: AnalyzeV2Response = {
  status: "success",
  report: FABRICATED_DOSSIER as any,
  extracted_entities: {
    organization_name: FABRICATED_DOSSIER.metadata.target_entity,
    roles: ["Virtual Intern"],
    salary_or_fee_claims: "$25 Certification Fee",
    urls: ["https://vanguardapex.tech"],
    emails: ["support@vanguardapex.tech"],
    phones: [],
  },
  timings: { extraction_s: 0.9, osint_collection_s: 6.2, judgment_s: 4.8, total_s: 11.9 },
};

// ============================================================================
// COMPREHENSIVE BILINGUAL TRANSLATIONS (EVERY HEADING & ELEMENT)
// ============================================================================
const translations = {
  en: {
    title: "Verify Authenticity",
    subtitle: "Paste a suspicious message or upload a screenshot for editorial-grade analysis.",
    msgLabel: "Message Content",
    msgPlaceholder: "Paste the suspicious text here...",
    evidenceLabel: "Evidence (Screenshot / Audio)",
    btnAnalyze: "ANALYZING...",
    btnScan: "SCAN FOR SCAMS",
    noticeTitle: "NOTHING TO INVESTIGATE",
    errorTitle: "INVESTIGATION FAILED",
    retryBtn: "RETRY SCAN",
    newScanBtn: "START NEW SCAN",
    settingsTitle: "Display & Theme Preferences",
    appearanceMode: "Appearance Mode",
    colorPalette: "Color Palette & Paper Texture",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    doneBtn: "Done",

    // Section Titles & Badges
    caseFile: "CASE FILE",
    primaryThreat: "PRIMARY THREAT:",
    scoreLedgerTitle: "Evidence Factor / Audit Item",
    scoreDelta: "Score Delta",
    executiveTakeaway: "EXECUTIVE TAKEAWAY",
    
    sec01Title: "Red Flags & Anomalies",
    sec01Badge: (n: number) => `[ ${n} FLAGS DETECTED ]`,
    techAnalysisLabel: "Technical Analysis & Impact:",
    sourceEvidenceLabel: "Source Evidence:",

    sec02Title: "Verified Facts & Domain Records",
    sec02Badge: (n: number) => `[ ${n} CONFIRMED ]`,

    sec03Title: "Primary Threat Vectors",
    sec04Title: "Evidentiary Links Explorer",
    sec05Title: "Unresolved Uncertainties",
    missingEvidenceLabel: "Missing Evidence Item:",
    whyItMattersLabel: "Why it matters:",
    recActionLabel: "Recommended Action:",

    sec06Title: "What You Should Do Next",
    sec06Badge: (c: number, t: number) => `[ ${c} / ${t} COMPLETED ]`,
    sec06ProgressTitle: "Action Checklist Progress",
    sec06CompletePercent: (p: number) => `${p}% Complete`,

    sec07Title: "Transparency Log",
    sec07Badge: (n: number) => `[ ${n} DISCARDED ]`,
    sec07DiscardedCount: (n: number) => `${n} RESULT${n === 1 ? "" : "S"} DISCARDED`,

    sec08Title: "Pipeline Performance & System Logs",
    sec08TotalBadge: (t: number) => `[ ${t}s TOTAL ]`,
    sec08Header: "PIPELINE PERFORMANCE METRICS",
    phase1: "Phase 1 (Entity Extraction):",
    phase2: "Phase 2 (Multi-Source Collection):",
    phase3: "Phase 3 (AI Judgment Engine):",
    totalPipeline: "TOTAL PIPELINE EXECUTION:",

    // Navigation & Footer
    navScanner: "Scanner",
    navDemo: "Demo Cases",
    navWhatsapp: "WhatsApp Bot",
    navExtension: "Extension",
    navPortfolio: "Portfolio ↗",
    designerSignature: "DESIGNED & ENGINEERED BY AHMED HASSAN",
    antiScamTag: "Anti-Scam Intelligence",

    // Timeline tracker
    tlHero: "Verdict & Case Overview",
    tlFlags: "Red Flags",
    tlFacts: "Verified Facts",
    tlVectors: "Threat Vectors",
    tlLinks: "Evidentiary Links",
    tlUncertainties: "Uncertainties",
    tlActions: "What You Should Do",
    tlTransparency: "Transparency Log",
    tlLogs: "System Logs",
  },
  ur: {
    title: "تصدیق کریں",
    subtitle: "مشکوک پیغام پیسٹ کریں یا اعلیٰ معیار کے تجزیہ کے لیے اسکرین شاٹ اپ لوڈ کریں۔",
    msgLabel: "پیغام کا مواد",
    msgPlaceholder: "مشکوک متن یہاں پیسٹ کریں...",
    evidenceLabel: "ثبوت (اسکرین شاٹ / آڈیو)",
    btnAnalyze: "...تجزیہ جاری ہے",
    btnScan: "اسکیم اسکین کریں",
    noticeTitle: "تحقیق کے لیے کچھ نہیں ملا",
    errorTitle: "تحقیق ناکام رہی",
    retryBtn: "دوبارہ کوشش کریں",
    newScanBtn: "نئی جانچ شروع کریں",
    settingsTitle: "ڈسپلے اور تھیم کی ترجیحات",
    appearanceMode: "ظاہری شکل",
    colorPalette: "رنگوں کا انتخاب اور تھیم",
    lightMode: "روشن موڈ",
    darkMode: "تاریک موڈ",
    doneBtn: "مکمل",

    // Section Titles & Badges
    caseFile: "کیس فائل",
    primaryThreat: "بنیادی خطرہ:",
    scoreLedgerTitle: "تفتیشی عنصر / آڈٹ ائٹم",
    scoreDelta: "اسکور کا فرق",
    executiveTakeaway: "اہم خلاصہ",
    
    sec01Title: "خطرناک نشانیاں اور بے ضابطگیاں",
    sec01Badge: (n: number) => `[ ${n} خطرے کی نشانیاں ]`,
    techAnalysisLabel: "تکنیکی تجزیہ اور اثرات:",
    sourceEvidenceLabel: "ثبوت کا ذریعہ:",

    sec02Title: "تصدیق شدہ حقائق اور ڈومین ریکارڈ",
    sec02Badge: (n: number) => `[ ${n} تصدیق شدہ ]`,

    sec03Title: "بنیادی خطرے کے طریقے",
    sec04Title: "ثبوتی لنکس کی تفصیلات",
    sec05Title: "غیر حل شدہ غیر یقینی امور",
    missingEvidenceLabel: "گم شدہ ثبوتی عنصر:",
    whyItMattersLabel: "یہ کیوں اہم ہے:",
    recActionLabel: "تجویز کردہ کارروائی:",

    sec06Title: "آپ کو آگے کیا کرنا چاہیے",
    sec06Badge: (c: number, t: number) => `[ ${c} / ${t} مکمل ]`,
    sec06ProgressTitle: "کارروائی کی پیشرفت",
    sec06CompletePercent: (p: number) => `${p}% مکمل`,

    sec07Title: "شفافیت لاگ (رَد شدہ ڈیٹا)",
    sec07Badge: (n: number) => `[ ${n} رَد شدہ ]`,
    sec07DiscardedCount: (n: number) => `${n} نتائج رَد کیے گئے`,

    sec08Title: "سسٹم کی کارکردگی اور لاگز",
    sec08TotalBadge: (t: number) => `[ کل وقت: ${t} سیکنڈ ]`,
    sec08Header: "پائپ لائن کی کارکردگی کے میٹرکس",
    phase1: "مرحلہ 1 (معلومات کا استخراج):",
    phase2: "مرحلہ 2 (مختلف ذرائع سے ڈیٹا کا حصول):",
    phase3: "مرحلہ 3 (مصنوعی ذہانت کا فیصلہ ساز انجن):",
    totalPipeline: "کل عمل درآمد کا وقت:",

    // Navigation & Footer
    navScanner: "اسکینر",
    navDemo: "نمونہ کیسز",
    navWhatsapp: "واٹس ایپ باٹ",
    navExtension: "ایکٹینشن",
    navPortfolio: "پورٹ فولیو ↗",
    designerSignature: "احمد حسن کی طرف سے تیار کردہ",
    antiScamTag: "اینٹی اسکیم انٹیلی جنس",

    // Timeline tracker
    tlHero: "فیصلہ اور جائزہ",
    tlFlags: "خطرناک نشانیاں",
    tlFacts: "تصدیق شدہ حقائق",
    tlVectors: "خطرے کے طریقے",
    tlLinks: "ثبوتی لنکس",
    tlUncertainties: "غیر یقینی امور",
    tlActions: "تجویز کردہ کارروائی",
    tlTransparency: "شفافیت لاگ",
    tlLogs: "سسٹم لاگز",
  }
};

// ============================================================================
// CLEAN EDITORIAL STATUS BADGE COMPONENT
// ============================================================================
function StatusBadge({
  children,
  rx = "0.6rem",
  className = "",
}: {
  children: React.ReactNode;
  rx?: string;
  className?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider border-2 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--foreground)] shadow-[2px_2px_0_var(--shadow-color)] transition-all cursor-default select-none ${className}`}
      style={{ borderRadius: rx }}
    >
      <span>{children}</span>
    </div>
  );
}

// ============================================================================
// ITEMIZED SCORE CALCULUS LEDGER TABLE
// ============================================================================
function ScoreLedgerTable({ justification, t }: { justification: string; t: any }) {
  if (!justification) return null;

  // Smart splitting engine: works with period separation OR continuous colon-number patterns
  let rawItems = justification
    .split(/(?:\.|\n)+/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter(Boolean);

  // If period splitting yields <= 1 item but contains multiple score deltas, extract via regex
  if (rawItems.length <= 1) {
    const regexMatches = justification.match(/([^:]+:\s*[+-]?\d+)/gi);
    if (regexMatches && regexMatches.length > 0) {
      rawItems = regexMatches.map((m) => m.trim());
    }
  }

  const items = rawItems.map((sentence) => {
    const match = sentence.match(/^(.*?):\s*([+-]?\d+)/i);
    if (match) {
      return { label: match[1].trim(), delta: parseInt(match[2], 10), rawDelta: match[2].trim() };
    }
    return { label: sentence, delta: null, rawDelta: "" };
  });

  return (
    <div className="bg-[var(--background)] p-4 font-mono text-xs space-y-2.5" dir="ltr">
      <div className="flex items-center justify-between border-b-2 border-[var(--border-color)]/30 pb-2 font-bold tracking-wider text-[var(--foreground)] text-[10px]">
        <span>{t.scoreLedgerTitle}</span>
        <span>{t.scoreDelta}</span>
      </div>

      <div className="space-y-1.5 pt-1">
        {items.map((item, idx) => {
          const isFinal = item.label.toLowerCase().includes("final");

          if (isFinal) {
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-[var(--foreground)] text-[var(--background)] font-bold text-xs uppercase tracking-wider mt-3"
              >
                <span>{item.label}</span>
                <span className="text-sm font-black">{item.rawDelta}</span>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className="flex items-center justify-between p-1.5 border-b border-dashed border-[var(--border-color)]/20 text-[var(--foreground)]"
            >
              <span className="font-sans font-medium text-xs text-[var(--foreground)] opacity-90">
                {item.label}
              </span>
              <span
                className="font-mono font-bold px-2 py-0.5 text-xs shrink-0 ml-4 bg-[var(--card-bg)] text-[var(--foreground)]"
              >
                {item.rawDelta || item.delta}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// SEMI-CIRCULAR ARC GAUGE COMPONENT
// ============================================================================
function ArcGauge({ score }: { score: number }) {
  const normalizedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = 251.3 - (normalizedScore / 100) * 251.3;

  return (
    <div className="flex flex-col items-center justify-center p-4" dir="ltr">
      <div className="relative w-48 h-28 flex items-end justify-center">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="var(--border-color)"
            strokeWidth="14"
            strokeLinecap="round"
            className="opacity-20"
          />
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="var(--foreground)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="251.3"
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute bottom-1 flex flex-col items-center">
          <span className="font-serif font-bold text-5xl text-[var(--foreground)] leading-none">
            {score}
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-col items-center gap-1 font-mono font-bold uppercase text-[var(--foreground)] text-center" dir="ltr">
        <span className="text-xs opacity-60">/ 100</span>
        <span className="text-[10px] tracking-widest opacity-80">0 SCAM &mdash; 100 LEGIT</span>
      </div>
    </div>
  );
}

// ============================================================================
// BULLETPROOF HIGH-CONTRAST VERDICT HERO
// ============================================================================
function CustomVerdictHero({ data, lang, t }: { data: AnalyzeV2Response; lang: Lang; t: any }) {
  const report = data.report;
  if (!report) return null;
  const score = Math.round(report.executive_summary.confidence_score);
  const isUrdu = lang === "ur";

  return (
    <section id="hero" className="brutal-card p-6 sm:p-8 fade-rise bg-[var(--card-bg)] text-[var(--foreground)] border-4 border-[var(--border-color)] scroll-mt-24">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b-2 border-[var(--border-color)] pb-3 mb-6">
        <span className="text-xs font-bold tracking-[0.35em] text-[var(--foreground)]">{t.caseFile}</span>
        <span className="text-[11px] font-mono tracking-wider text-[var(--foreground)] opacity-80">
          FILED {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · {report.metadata?.model?.toUpperCase()} · {data.timings?.total_s}s
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-[var(--border-color)] pb-6">
        <div className="space-y-2">
          <h2 className="font-serif font-black text-3xl sm:text-5xl tracking-tight text-[var(--foreground)] leading-tight">
            {data.extracted_entities?.organization_name || report.metadata?.target_entity}
          </h2>
          <p className="text-sm sm:text-base font-medium tracking-wide text-[var(--foreground)] opacity-85 leading-relaxed">
            {report.user_facing_report?.title}
          </p>
          {report.executive_summary.primary_threat_vector && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--foreground)] opacity-90">
              <span className="font-bold text-[var(--accent-color)]">{t.primaryThreat}</span>
              <span className="font-bold border-b-2 border-dashed border-[var(--border-color)] pb-0.5">{report.executive_summary.primary_threat_vector}</span>
            </div>
          )}
        </div>

        <div className="shrink-0 sm:self-start inline-flex items-center gap-2 px-4 py-2 font-mono font-black text-xs sm:text-sm uppercase tracking-widest border-2 border-[var(--border-color)] bg-[var(--accent-color)] text-[var(--accent-text)] -rotate-1 shadow-[4px_4px_0_var(--shadow-color)] hover:rotate-0 transition-transform cursor-default">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent-text)] animate-pulse" />
          <span>{report.executive_summary.verdict.replace("_", " ").toUpperCase()}</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 items-stretch" dir="ltr">
        <div className="bg-[var(--background)] p-6 flex flex-col items-center justify-center border-2 border-[var(--border-color)]">
          <ArcGauge score={score} />
        </div>

        <div>
          {report.confidence_justification && (
            <ScoreLedgerTable justification={report.confidence_justification} t={t} />
          )}
        </div>
      </div>

      {report.executive_summary.one_sentence_takeaway && (
        <div className="mt-8 brutal-card p-6 bg-[var(--background)] text-[var(--foreground)] border-2 border-[var(--border-color)] space-y-2 shadow-[4px_4px_0_var(--shadow-color)]">
          <p className="text-[11px] font-mono font-bold tracking-[0.25em] text-[var(--foreground)] opacity-60 uppercase flex items-center gap-2">
            <span>✦</span> {t.executiveTakeaway}
          </p>
          <p className="text-lg sm:text-xl leading-relaxed font-serif italic text-[var(--foreground)] font-medium">
            &ldquo;{isUrdu && report.executive_summary.one_sentence_takeaway.ur ? report.executive_summary.one_sentence_takeaway.ur : report.executive_summary.one_sentence_takeaway.en}&rdquo;
          </p>
        </div>
      )}
    </section>
  );
}

// ============================================================================
// BULLETPROOF HIGH-CONTRAST RED FLAGS
// ============================================================================
function CustomRedFlags({ flags, t }: { flags: RedFlag[]; t: any }) {
  if (!flags?.length) return null;
  return (
    <section id="flags" className="space-y-6 scroll-mt-24">
      <div className="flex items-center justify-between border-b-4 border-[var(--border-color)] pb-3 mb-6">
        <h3 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-[var(--foreground)] flex items-center gap-3">
          <StatusBadge rx="0.5rem" className="bg-[var(--accent-color)] text-[var(--accent-text)] px-3.5 py-2 text-sm sm:text-base font-bold">
            01
          </StatusBadge>
          {t.sec01Title}
        </h3>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--foreground)] opacity-70">
          {t.sec01Badge(flags.length)}
        </span>
      </div>

      <div className="space-y-6">
        {flags.map((f, i) => {
          const isHigh = f.weight.toLowerCase() === 'high' || f.weight.toLowerCase() === 'critical';
          const isMed = f.weight.toLowerCase() === 'medium';
          const badgeClass = isHigh
            ? "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40"
            : isMed
            ? "bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40"
            : "bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40";

          return (
            <article
              key={i}
              className="border-2 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--foreground)] p-6 sm:p-8 shadow-[6px_6px_0_var(--shadow-color)] space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <h4 className="font-serif font-bold tracking-tight text-xl sm:text-2xl leading-snug flex items-center gap-3 text-[var(--foreground)]">
                  <span className="font-mono text-xs opacity-50 font-normal">{String(i + 1).padStart(2, "0")}</span>
                  {f.flag}
                </h4>
                <StatusBadge rx="0.4rem" className={`shrink-0 ${badgeClass}`}>
                  {f.weight.toUpperCase()}
                </StatusBadge>
              </div>

              <blockquote className="border-2 border-[var(--border-color)] bg-[var(--background)] text-[var(--foreground)] p-5 sm:p-6 font-serif italic text-base sm:text-lg leading-relaxed">
                <mark className="editorial-mark">
                  <span>&quot;{f.snippet_quote}&quot;</span>
                </mark>
              </blockquote>

              <a
                href={f.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono tracking-wider border-b-2 border-[var(--border-color)] pb-0.5 text-[var(--foreground)] font-bold hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
              >
                {t.sourceEvidenceLabel} {getDomain(f.source_url)} &rsaquo;
              </a>

              <div className="pt-4 border-t-2 border-dashed border-[var(--border-color)] space-y-2">
                <p className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] opacity-60">
                  {t.techAnalysisLabel}
                </p>
                <p className="text-base sm:text-lg leading-relaxed text-[var(--foreground)] opacity-95">{f.technical_basis}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ============================================================================
// BULLETPROOF HIGH-CONTRAST VERIFIED FACTS
// ============================================================================
function CustomVerifiedFacts({ facts, t }: { facts: VerifiedFact[]; t: any }) {
  if (!facts?.length) return null;
  return (
    <section id="facts" className="space-y-6 scroll-mt-24">
      <div className="flex items-center justify-between border-b-4 border-[var(--border-color)] pb-3 mb-6">
        <h3 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-[var(--foreground)] flex items-center gap-3">
          <StatusBadge rx="0.5rem" className="bg-[var(--accent-color)] text-[var(--accent-text)] px-3.5 py-2 text-sm sm:text-base font-bold">
            02
          </StatusBadge>
          {t.sec02Title}
        </h3>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--foreground)] opacity-70">
          {t.sec02Badge(facts.length)}
        </span>
      </div>

      <div className="space-y-4">
        {facts.map((f, i) => (
          <article
            key={i}
            className="border-2 border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-[4px_4px_0_var(--shadow-color)] space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <h4 className="font-serif font-bold text-base sm:text-lg leading-snug text-[var(--foreground)]">{f.claim}</h4>
              <StatusBadge rx="0.4rem" className="shrink-0 bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40">
                {f.evidence_status.toUpperCase()}
              </StatusBadge>
            </div>

            <blockquote className="border-2 border-[var(--border-color)] bg-[var(--background)] text-[var(--foreground)] p-4 font-serif italic text-sm leading-relaxed">
              <mark className="editorial-mark">
                <span>&quot;{f.snippet_quote}&quot;</span>
              </mark>
            </blockquote>

            <a
              href={f.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-mono tracking-wider border-b-2 border-[var(--border-color)] pb-0.5 text-[var(--foreground)] font-bold hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
            >
              {t.sourceEvidenceLabel} {getDomain(f.source_url)} &rsaquo;
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// INTERACTIVE LINKED ACTION CHECKLIST COMPONENT
// ============================================================================
function InteractiveActionChecklist({ items, t }: { items: string[]; t: any }) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  if (!items?.length) return null;

  const total = items.length;
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / total) * 100);

  const toggleItem = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div id="actions" className="space-y-6 scroll-mt-24">
      <div className="flex items-center justify-between border-b-4 border-[var(--border-color)] pb-3 mb-6">
        <h3 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-[var(--foreground)] flex items-center gap-3">
          <StatusBadge rx="0.5rem" className="bg-[var(--accent-color)] text-[var(--accent-text)] px-3.5 py-2 text-sm sm:text-base font-bold">
            06
          </StatusBadge>
          {t.sec06Title}
        </h3>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--foreground)] opacity-70">
          {t.sec06Badge(completedCount, total)}
        </span>
      </div>

      <div className="border-4 border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 space-y-5 shadow-[6px_6px_0_var(--shadow-color)]">
        <div className="space-y-2 pb-2 border-b-2 border-dashed border-[var(--border-color)]">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider text-[var(--foreground)]">
            <span>{t.sec06ProgressTitle}</span>
            <span>{t.sec06CompletePercent(progressPercent)}</span>
          </div>
          <div className="w-full bg-[var(--background)] h-3 border-2 border-[var(--border-color)] overflow-hidden rounded-full p-0.5">
            <div
              className="bg-[var(--accent-color)] h-full transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {items.map((act, i) => {
            const isChecked = Boolean(checkedItems[i]);
            return (
              <div
                key={i}
                onClick={() => toggleItem(i)}
                className={`group border-2 border-[var(--border-color)] p-4 sm:p-5 transition-all cursor-pointer select-none space-y-2 ${
                  isChecked
                    ? "bg-[var(--accent-color)]/10 border-[var(--accent-color)]"
                    : "bg-[var(--background)] hover:bg-[var(--card-bg)] shadow-[3px_3px_0_var(--shadow-color)]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-6 h-6 rounded border-2 border-[var(--border-color)] flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isChecked
                        ? "bg-[var(--accent-color)] text-[var(--accent-text)] border-[var(--accent-color)] shadow-xs"
                        : "bg-[var(--card-bg)] group-hover:border-[var(--accent-color)]"
                    }`}
                  >
                    {isChecked ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="font-mono text-xs font-bold text-[var(--foreground)] opacity-50">{i + 1}</span>
                    )}
                  </div>

                  <div className="space-y-1 flex-1">
                    <p
                      className={`text-base sm:text-lg font-medium leading-relaxed transition-all ${
                        isChecked ? "line-through opacity-50 text-[var(--foreground)]" : "text-[var(--foreground)] font-semibold"
                      }`}
                    >
                      {act}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ELEGANT TRANSPARENCY LOG SECTION
// ============================================================================
function TransparencyLogSection({ discarded, t }: { discarded: DiscardedItem[]; t: any }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!discarded || discarded.length === 0) return null;

  return (
    <section id="transparency" className="space-y-6 scroll-mt-24">
      <div className="flex items-center justify-between border-b-4 border-[var(--border-color)] pb-3 mb-6">
        <h3 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-[var(--foreground)] flex items-center gap-3">
          <StatusBadge rx="0.5rem" className="bg-[var(--accent-color)] text-[var(--accent-text)] px-3.5 py-2 text-sm sm:text-base font-bold">
            07
          </StatusBadge>
          {t.sec07Title}
        </h3>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--foreground)] opacity-70">
          {t.sec07Badge(discarded.length)}
        </span>
      </div>

      <div className="border-4 border-[var(--border-color)] bg-[var(--card-bg)] shadow-[6px_6px_0_var(--shadow-color)] overflow-hidden">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-full p-4 sm:p-5 bg-[var(--card-bg)] text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--background)] transition-colors border-b-2 border-[var(--border-color)]"
        >
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-[var(--foreground)]">
            <span>{t.sec07Title}</span>
            <span className="text-[11px] opacity-60 font-semibold">
              {t.sec07DiscardedCount(discarded.length)}
            </span>
          </div>
          <span className="font-mono text-sm font-bold text-[var(--foreground)] shrink-0">
            {isOpen ? "▲" : "▼"}
          </span>
        </button>

        {isOpen && (
          <div className="p-5 sm:p-6 space-y-4 bg-[var(--background)]">
            {discarded.map((item, i) => (
              <div
                key={i}
                className="border-2 border-dashed border-[var(--border-color)] p-4 sm:p-5 bg-[var(--card-bg)] space-y-2.5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h4 className="font-mono font-bold text-xs sm:text-sm uppercase tracking-wider text-[var(--foreground)]">
                    {item.title || item.source_url}
                  </h4>
                  <span className="px-2 py-0.5 border-2 border-[var(--border-color)] font-mono text-[10px] font-bold uppercase tracking-wider bg-[var(--card-bg)] text-[var(--foreground)] shrink-0">
                    {item.reason === "entity_mismatch" ? "WRONG ENTITY" : item.reason?.toUpperCase().replace("_", " ") || "EXCLUDED"}
                  </span>
                </div>
                {item.note && (
                  <p className="text-sm font-sans leading-relaxed text-[var(--foreground)] opacity-75">
                    {item.note}
                  </p>
                )}
                {item.source_url && (
                  <a
                    href={item.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[11px] font-mono text-[var(--foreground)] opacity-60 hover:opacity-100 hover:underline"
                  >
                    {item.source_url}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ============================================================================
// PIPELINE PERFORMANCE METRICS COMPONENT
// ============================================================================
function PipelineMetricsSection({ timings, t }: { timings?: any; t: any }) {
  if (!timings) return null;

  const total = timings.total_s || 1;
  const extractionPct = Math.min(100, Math.max(8, Math.round((timings.extraction_s / total) * 100)));
  const collectionPct = Math.min(100, Math.max(8, Math.round((timings.osint_collection_s / total) * 100)));
  const judgmentPct = Math.min(100, Math.max(8, Math.round((timings.judgment_s / total) * 100)));

  return (
    <section id="logs" className="space-y-6 scroll-mt-24">
      <div className="flex items-center justify-between border-b-4 border-[var(--border-color)] pb-3 mb-6">
        <h3 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-[var(--foreground)] flex items-center gap-3">
          <StatusBadge rx="0.5rem" className="bg-[var(--accent-color)] text-[var(--accent-text)] px-3.5 py-2 text-sm sm:text-base font-bold">
            08
          </StatusBadge>
          {t.sec08Title}
        </h3>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--foreground)] opacity-70">
          {t.sec08TotalBadge(timings.total_s)}
        </span>
      </div>

      <div className="border-4 border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-8 space-y-6 shadow-[6px_6px_0_var(--shadow-color)] rounded-sm">
        <div className="flex items-center gap-2.5 border-b-2 border-[var(--border-color)] pb-4">
          <svg className="w-5 h-5 text-[var(--foreground)]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 16 14" />
          </svg>
          <h4 className="font-mono font-bold text-xs sm:text-sm uppercase tracking-widest text-[var(--foreground)]">
            {t.sec08Header}
          </h4>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs sm:text-sm font-bold text-[var(--foreground)]">
              <span className="opacity-90">{t.phase1}</span>
              <span className="font-mono text-sm">{timings.extraction_s}s</span>
            </div>
            <div className="w-full bg-[var(--background)] h-3 border-2 border-[var(--border-color)] overflow-hidden rounded-full p-0.5">
              <div
                className="bg-[var(--accent-color)] h-full rounded-full transition-all duration-500"
                style={{ width: `${extractionPct}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs sm:text-sm font-bold text-[var(--foreground)]">
              <span className="opacity-90">{t.phase2}</span>
              <span className="font-mono text-sm">{timings.osint_collection_s}s</span>
            </div>
            <div className="w-full bg-[var(--background)] h-3 border-2 border-[var(--border-color)] overflow-hidden rounded-full p-0.5">
              <div
                className="bg-[var(--accent-color)] h-full rounded-full transition-all duration-500"
                style={{ width: `${collectionPct}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs sm:text-sm font-bold text-[var(--foreground)]">
              <span className="opacity-90">{t.phase3}</span>
              <span className="font-mono text-sm">{timings.judgment_s}s</span>
            </div>
            <div className="w-full bg-[var(--background)] h-3 border-2 border-[var(--border-color)] overflow-hidden rounded-full p-0.5">
              <div
                className="bg-[var(--accent-color)] h-full rounded-full transition-all duration-500"
                style={{ width: `${judgmentPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t-2 border-[var(--border-color)] flex items-center justify-between font-mono font-bold text-xs sm:text-sm uppercase tracking-widest text-[var(--foreground)]">
          <span>{t.totalPipeline}</span>
          <span className="text-base sm:text-lg">{timings.total_s}s</span>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FRAMELESS STICKY TIMELINE TRACKER
// ============================================================================
function RightTimelineTracker({ activeSection, t }: { activeSection: string; t: any }) {
  const sections = [
    { id: "hero", num: "00", name: t.tlHero },
    { id: "flags", num: "01", name: t.tlFlags },
    { id: "facts", num: "02", name: t.tlFacts },
    { id: "vectors", num: "03", name: t.tlVectors },
    { id: "links", num: "04", name: t.tlLinks },
    { id: "uncertainties", num: "05", name: t.tlUncertainties },
    { id: "actions", num: "06", name: t.tlActions },
    { id: "transparency", num: "07", name: t.tlTransparency },
    { id: "logs", num: "08", name: t.tlLogs },
  ];

  const activeIdx = Math.max(0, sections.findIndex((s) => s.id === activeSection));
  const activePercent = (activeIdx / (sections.length - 1)) * 100;

  return (
    <div className="hidden lg:block absolute left-full ml-6 sm:ml-8 top-0 bottom-0 pointer-events-none">
      <aside className="sticky top-24 h-[calc(100vh-7rem)] max-h-[750px] min-h-[450px] pointer-events-auto select-none flex flex-col justify-between items-center py-2">
        <div className="absolute top-6 bottom-6 w-0.5 bg-[var(--border-color)] opacity-30 -z-10">
          <div
            className="w-full bg-[var(--accent-color)] transition-all duration-300 ease-out"
            style={{ height: `${activePercent}%` }}
          />

          <div
            className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full border-2 border-[var(--border-color)] bg-[var(--accent-color)] opacity-20 transition-all duration-400 ease-out pointer-events-none"
            style={{ top: `${activePercent}%` }}
          />
        </div>

        <nav className="h-full flex flex-col justify-between items-center w-full">
          {sections.map((sec, idx) => {
            const isActive = activeIdx === idx;
            return (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(sec.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="group relative flex items-center justify-center cursor-pointer"
              >
                <span className="absolute left-12 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--accent-color)] text-[var(--accent-text)] border-2 border-[var(--border-color)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20 shadow-[2px_2px_0_var(--shadow-color)]">
                  {sec.num}. {sec.name}
                </span>

                <div
                  className={`w-9 h-9 rounded-full border-2 border-[var(--border-color)] flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-[var(--accent-color)] text-[var(--accent-text)] scale-125 z-10 shadow-[2px_2px_0_var(--shadow-color)]"
                      : "bg-[var(--card-bg)] text-[var(--foreground)] opacity-70 hover:opacity-100 hover:scale-110"
                  }`}
                >
                  {sec.num}
                </div>
              </a>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}

// ============================================================================
// AMBIENT MAGNETIC BACKGROUND GRID
// ============================================================================
function AmbientBackgroundGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface DotNode {
      gx: number;
      gy: number;
      radius: number;
      phase: number;
      speed: number;
      orbitRadius: number;
      alpha: number;
    }

    let dots: DotNode[] = [];
    const spacing = 38;

    const buildGrid = () => {
      width = canvas.width = document.documentElement.clientWidth || window.innerWidth;
      height = canvas.height = window.innerHeight;
      dots = [];

      let idx = 0;
      for (let x = spacing / 2; x < width; x += spacing) {
        for (let y = spacing / 2; y < height; y += spacing) {
          const seed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
          const pseudoRand = seed - Math.floor(seed);
          
          let radius = 1.2;
          let alpha = 0.7;
          if (pseudoRand > 0.82) {
            radius = 2.6;
            alpha = 1.0;
          } else if (pseudoRand > 0.5) {
            radius = 1.7;
            alpha = 0.85;
          } else if (pseudoRand < 0.2) {
            radius = 0.9;
            alpha = 0.5;
          }

          dots.push({
            gx: x,
            gy: y,
            radius,
            phase: pseudoRand * Math.PI * 2,
            speed: 0.0006 + (pseudoRand * 0.0008),
            orbitRadius: 2.0 + pseudoRand * 3.0,
            alpha,
          });
          idx++;
        }
      }
    };

    buildGrid();
    window.addEventListener("resize", buildGrid);

    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let shockwave = { x: -1000, y: -1000, radius: 0, active: false };
    const handleClick = (e: MouseEvent) => {
      shockwave = { x: e.clientX, y: e.clientY, radius: 0, active: true };
    };
    window.addEventListener("click", handleClick, { passive: true });

    const pullRadius = 120;
    const maxPull = 16;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");
      const baseRgb = isDark ? "250, 250, 250" : "9, 9, 11";
      const time = Date.now();

      if (shockwave.active) {
        shockwave.radius += 14;
        if (shockwave.radius > 400) {
          shockwave.active = false;
        }
      }

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        const ambientX = dot.gx + Math.cos(time * dot.speed + dot.phase) * dot.orbitRadius;
        const ambientY = dot.gy + Math.sin(time * dot.speed * 1.2 + dot.phase) * dot.orbitRadius;

        let drawX = ambientX;
        let drawY = ambientY;

        const dx = mouse.x - ambientX;
        const dy = mouse.y - ambientY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < pullRadius) {
          const force = (1 - dist / pullRadius) * maxPull;
          const angle = Math.atan2(dy, dx);
          drawX += Math.cos(angle) * force;
          drawY += Math.sin(angle) * force;
        }

        if (shockwave.active) {
          const sdx = shockwave.x - ambientX;
          const sdy = shockwave.y - ambientY;
          const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
          const diff = Math.abs(sdist - shockwave.radius);
          if (diff < 45) {
            const waveForce = (1 - diff / 45) * 18;
            const sangle = Math.atan2(sdy, sdx);
            drawX -= Math.cos(sangle) * waveForce;
            drawY -= Math.sin(sangle) * waveForce;
          }
        }

        ctx.fillStyle = `rgba(${baseRgb}, ${dot.alpha * 0.18})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, dot.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", buildGrid);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}

// ============================================================================
// DISPLAY & ACCENT THEME PREFERENCES MODAL
// ============================================================================
function ThemeSettingsModal({
  isOpen,
  onClose,
  currentPalette,
  onSelectPalette,
  isDark,
  onToggleTheme,
  t,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentPalette: string;
  onSelectPalette: (p: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  t: any;
}) {
  if (!isOpen) return null;

  const palettes = [
    { id: "nordic", name: "Nordic Silk & Slate", desc: "Minimalist silk paper with royal slate blue accents", dot: "#2563EB" },
    { id: "sand", name: "Archival Linen & Crimson", desc: "Warm book paper & sepia ink with crimson stamp accents", dot: "#991B1B" },
    { id: "washi", name: "Japanese Washi & Sumi", desc: "Off-white washi paper with Sumi charcoal & bronze accents", dot: "#D97706" },
    { id: "gunmetal", name: "Tactical Platinum & Cyan", desc: "Platinum slate paper with phosphor cyan accents", dot: "#0EA5E9" },
    { id: "amber", name: "Tactical Amber", desc: "Warm alabaster & deep obsidian with gold amber accents", dot: "#F59E0B" },
    { id: "mono", name: "Mono Brutalist", desc: "Pure high-contrast stark monochrome", dot: "#09090B" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-[var(--card-bg)] text-[var(--foreground)] border-2 border-[var(--border-color)] p-6 space-y-6 rounded-lg shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-[var(--border-color)]/30 pb-4">
          <div>
            <h3 className="font-serif font-bold text-xl text-[var(--foreground)] tracking-tight">{t.settingsTitle}</h3>
            <p className="text-xs text-[var(--foreground)] opacity-60 font-sans mt-0.5">Customize appearance mode and color palette</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center font-sans font-semibold text-sm border border-[var(--border-color)]/40 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] opacity-60 font-sans">
            {t.appearanceMode}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { if (isDark) onToggleTheme(); }}
              className={`p-3 rounded-md border-2 font-sans text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                !isDark
                  ? "bg-[var(--accent-color)] text-[var(--accent-text)] border-[var(--accent-color)] shadow-sm"
                  : "bg-[var(--background)] text-[var(--foreground)] border-[var(--border-color)]/30 opacity-70 hover:opacity-100"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
              </svg>
              <span>{t.lightMode}</span>
            </button>
            <button
              onClick={() => { if (!isDark) onToggleTheme(); }}
              className={`p-3 rounded-md border-2 font-sans text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isDark
                  ? "bg-[var(--accent-color)] text-[var(--accent-text)] border-[var(--accent-color)] shadow-sm"
                  : "bg-[var(--background)] text-[var(--foreground)] border-[var(--border-color)]/30 opacity-70 hover:opacity-100"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <span>{t.darkMode}</span>
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] opacity-60 font-sans">
            {t.colorPalette}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1">
            {palettes.map((p) => {
              const isActive = currentPalette === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPalette(p.id)}
                  className={`p-3.5 rounded-md border-2 text-left transition-all cursor-pointer space-y-1 ${
                    isActive
                      ? "border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-[var(--foreground)] shadow-xs"
                      : "border-[var(--border-color)]/30 bg-[var(--background)] text-[var(--foreground)] opacity-80 hover:opacity-100 hover:border-[var(--border-color)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: p.dot }} />
                    <span className="font-serif font-bold text-sm leading-none">{p.name}</span>
                  </div>
                  <p className="text-[11px] opacity-75 font-sans leading-tight pl-5">{p.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-[var(--border-color)]/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-md font-sans text-xs font-bold uppercase tracking-wider bg-[var(--accent-color)] text-[var(--accent-text)] cursor-pointer hover:opacity-90 transition-opacity shadow-xs"
          >
            {t.doneBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================
export default function Home() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [report, setReport] = useState<AnalyzeV2Response | null>(MOCK_DATA);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Lang>("en");
  const [isDark, setIsDark] = useState(false);
  const [palette, setPalette] = useState<string>("mono");
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    const savedPalette = localStorage.getItem("app_palette") || "mono";
    setPalette(savedPalette);
    document.documentElement.setAttribute("data-palette", savedPalette);
  }, []);

  const handlePaletteChange = (p: string) => {
    setPalette(p);
    document.documentElement.setAttribute("data-palette", p);
    localStorage.setItem("app_palette", p);
  };

  const resultsRef = useRef<HTMLDivElement>(null);

  const t = translations[language];
  const isUrdu = language === "ur";

  useEffect(() => {
    const savedLang = localStorage.getItem("app_language") as Lang;
    if (savedLang && (savedLang === "en" || savedLang === "ur")) {
      setLanguage(savedLang);
    }
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    if (!report) return;

    const sectionIds = ["hero", "flags", "facts", "vectors", "links", "uncertainties", "actions", "transparency", "logs"];

    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const scrollPos = window.scrollY || document.documentElement.scrollTop || 0;
      const totalHeight = document.documentElement.scrollHeight;

      if (viewportHeight + scrollPos >= totalHeight - 100) {
        setActiveSection("logs");
        return;
      }

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 100) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [report]);

  useEffect(() => {
    if (!report) return;

    const marks = document.querySelectorAll("mark.editorial-mark");
    if (!marks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-highlighted");
          } else {
            entry.target.classList.remove("is-highlighted");
          }
        });
      },
      { threshold: 0.15 }
    );

    marks.forEach((m) => observer.observe(m));
    return () => observer.disconnect();
  }, [report]);

  const handleLanguageChange = (lang: Lang) => {
    setLanguage(lang);
    localStorage.setItem("app_language", lang);
  };

  const toggleTheme = () => {
    const newTheme = !document.documentElement.classList.contains("dark");
    if (!document.startViewTransition) {
      document.documentElement.classList.toggle("dark", newTheme);
      setIsDark(newTheme);
      return;
    }

    document.startViewTransition(() => {
      document.documentElement.classList.toggle("dark", newTheme);
      setIsDark(newTheme);
    });
  };

  const runScan = async () => {
    setIsSubmitting(true);
    setReport(null);
    setNotice(null);
    setError(null);

    if (text.trim() || file) {
      const formData = new FormData();
      if (text) formData.append("text", text);
      if (file) formData.append("file", file);
      formData.append("user_id", "web_user_demo");

      try {
        const response = await fetch("/api/analyze-v2", {
          method: "POST",
          body: formData,
        });

        const data: AnalyzeV2Response = await response.json();
        if (data.status === "success" && data.report) {
          setReport(data);
          setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
        } else if (data.status === "success") {
          setNotice(data.message || t.noticeTitle);
        } else {
          setError(isUrdu ? "تجزیہ کے دوران ایک خرابی پیش آگئی۔ دوبارہ کوشش کریں۔" : "An error occurred during analysis. Please try again.");
        }
      } catch (err) {
        console.error(err);
        setError(isUrdu ? "سرور سے جڑنے میں ناکام۔" : "Failed to connect to the investigation server.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setTimeout(() => {
        setReport(MOCK_DATA);
        setIsSubmitting(false);
      }, 1200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runScan();
  };

  const startNewScan = () => {
    setReport(null);
    setNotice(null);
    setError(null);
    setText("");
    setFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 relative bg-[var(--background)] w-full ${isUrdu ? "font-[Noto_Nastaliq_Urdu,serif]" : ""}`}>
      <AmbientBackgroundGrid />

      <ThemeSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentPalette={palette}
        onSelectPalette={handlePaletteChange}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        t={t}
      />

      <div className="absolute inset-0 bg-mesh opacity-0 pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] opacity-0 pointer-events-none z-0"></div>

      {/* TOP NAVIGATION BAR */}
      <header className="w-full max-w-5xl z-30 mb-8 brutal-card bg-[var(--card-bg)] border-4 border-[var(--border-color)] p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[var(--foreground)]">
              Naukri Nigran
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <a href="#scanner" className="px-3 py-1.5 border-2 border-transparent hover:border-[var(--border-color)] transition-colors text-[var(--foreground)]">
              {t.navScanner}
            </a>
            <a href="#demo" className="px-3 py-1.5 border-2 border-transparent hover:border-[var(--border-color)] transition-colors text-[var(--foreground)] opacity-70 hover:opacity-100">
              {t.navDemo}
            </a>
            <a href="#whatsapp" className="px-3 py-1.5 border-2 border-transparent hover:border-[var(--border-color)] transition-colors text-[var(--foreground)] opacity-70 hover:opacity-100">
              {t.navWhatsapp}
            </a>
            <a href="#extension" className="px-3 py-1.5 border-2 border-transparent hover:border-[var(--border-color)] transition-colors text-[var(--foreground)] opacity-70 hover:opacity-100">
              {t.navExtension}
            </a>
            <a href="https://ahmed-hassan-portfoliosite.vercel.app/" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 border-2 border-transparent hover:border-[var(--border-color)] transition-colors text-[var(--foreground)] opacity-70 hover:opacity-100">
              {t.navPortfolio}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex items-center border-2 border-[var(--border-color)] bg-[var(--card-bg)] shadow-[3px_3px_0_var(--shadow-color)] rounded divide-x-2 divide-[var(--border-color)] overflow-hidden">
              <button
                onClick={() => handleLanguageChange(language === "en" ? "ur" : "en")}
                className="px-3 py-1.5 text-xs font-mono font-bold text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors cursor-pointer flex items-center gap-1.5 group"
                title="Switch Language"
              >
                <svg className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span>{language === "en" ? "EN" : "UR"}</span>
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-3 py-1.5 text-xs font-mono font-bold text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors cursor-pointer flex items-center gap-1.5 group"
                title="Open Theme & Display Preferences"
              >
                <svg className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2 2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>THEMES</span>
              </button>

              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="px-3 py-1.5 text-xs text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors cursor-pointer flex items-center justify-center group"
              >
                {isDark ? (
                  <svg className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
                  <svg className="w-3.5 h-3.5 text-[var(--foreground)] group-hover:text-[var(--background)] transition-colors" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden px-2.5 py-1.5 text-xs font-bold border-2 border-[var(--border-color)] uppercase bg-[var(--foreground)] text-[var(--background)] cursor-pointer"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t-2 border-[var(--border-color)] flex flex-col gap-2 font-mono text-xs font-bold uppercase tracking-wider">
            <a
              href="#scanner"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 border-2 border-[var(--border-color)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--card-bg)]"
            >
              {t.navScanner}
            </a>
            <a
              href="#demo"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 border-2 border-[var(--border-color)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--card-bg)]"
            >
              {t.navDemo}
            </a>
            <a
              href="#whatsapp"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 border-2 border-[var(--border-color)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--card-bg)]"
            >
              {t.navWhatsapp}
            </a>
            <a
              href="#extension"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 border-2 border-[var(--border-color)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--card-bg)]"
            >
              {t.navExtension}
            </a>
            <a
              href="https://ahmed-hassan-portfoliosite.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 border-2 border-[var(--border-color)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--card-bg)]"
            >
              {t.navPortfolio}
            </a>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main id="scanner" className="w-full max-w-4xl z-10 relative space-y-8 my-auto">
        <header className={`mb-10 border-b-4 border-[var(--border-color)] pb-8 ${isUrdu ? "text-right" : "text-left"}`}>
          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-[var(--foreground)] leading-tight uppercase">
            {t.title}
          </h1>
          <p className="text-[var(--foreground)] opacity-85 mt-3 text-base sm:text-lg font-medium leading-relaxed max-w-2xl">
            {t.subtitle}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8" dir={isUrdu ? "rtl" : "ltr"}>
          <div className="space-y-3">
            <label className="text-base sm:text-lg font-bold text-[var(--foreground)] uppercase tracking-wider block">
              {t.msgLabel}
            </label>
            <textarea
              className="w-full p-5 brutal-input text-base sm:text-lg leading-relaxed resize-none text-[var(--foreground)] placeholder:text-[#888888] bg-[var(--input-bg)] border-2 border-[var(--border-color)]"
              rows={4}
              placeholder={t.msgPlaceholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-3">
            <label className="text-base sm:text-lg font-bold text-[var(--foreground)] uppercase tracking-wider block">
              {t.evidenceLabel}
            </label>
            <div className="brutal-input p-3 flex items-center bg-[var(--input-bg)] border-2 border-[var(--border-color)]">
              <input
                type="file"
                className={`w-full text-base text-[var(--foreground)] file:py-2.5 file:px-5 file:rounded-sm file:border-2 file:border-[var(--border-color)] file:text-base file:font-bold file:bg-[var(--card-bg)] file:text-[var(--foreground)] hover:file:bg-[var(--background)] transition-colors cursor-pointer ${isUrdu ? "file:ml-4" : "file:mr-4"}`}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4.5 px-8 brutal-btn font-bold text-base sm:text-lg tracking-widest mt-4 uppercase cursor-pointer"
          >
            <span>{isSubmitting ? t.btnAnalyze : t.btnScan}</span>
          </button>
        </form>

        <div ref={resultsRef} className="scroll-mt-8">
          {isSubmitting && <InvestigationProgress lang={language} />}

          {notice && !isSubmitting && (
            <div
              className="mt-12 brutal-card p-8 fade-rise bg-[var(--card-bg)] text-[var(--foreground)] border-4 border-[var(--border-color)]"
              dir={isUrdu ? "rtl" : "ltr"}
            >
              <h3 className="text-xl font-serif font-bold uppercase tracking-widest">{t.noticeTitle}</h3>
              <p className={`mt-3 text-sm font-bold leading-relaxed ${isUrdu ? "text-right" : ""}`}>{notice}</p>
              <button onClick={startNewScan} className="mt-6 py-3 px-6 brutal-btn font-bold text-xs tracking-widest uppercase">
                {t.newScanBtn}
              </button>
            </div>
          )}

          {error && !isSubmitting && (
            <div
              className="mt-12 brutal-card p-8 fade-rise bg-rose-50 text-rose-950 border-4 border-rose-600 dark:bg-rose-950 dark:text-rose-100"
              dir={isUrdu ? "rtl" : "ltr"}
            >
              <h3 className="text-xl font-serif font-bold uppercase tracking-widest">{t.errorTitle}</h3>
              <p className={`mt-3 text-sm font-bold leading-relaxed ${isUrdu ? "text-right" : ""}`}>{error}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={runScan} className="py-3 px-6 brutal-btn font-bold text-xs tracking-widest uppercase">
                  {t.retryBtn}
                </button>
                <button onClick={startNewScan} className="py-3 px-6 brutal-btn font-bold text-xs tracking-widest uppercase">
                  {t.newScanBtn}
                </button>
              </div>
            </div>
          )}

          {report && report.report && !isSubmitting && (() => {
            const judgeReport = report.report;
            return (
              <div className="space-y-10 mt-10 relative" dir={isUrdu ? "rtl" : "ltr"}>
                <RightTimelineTracker activeSection={activeSection} t={t} />

                <div className="space-y-10">
                  <CustomVerdictHero data={report} lang={language} t={t} />

                  {judgeReport.user_facing_report?.summary_paragraph && (
                    <section className="brutal-card p-6 bg-[var(--card-bg)] border-4 border-[var(--border-color)] fade-rise">
                      <p className="text-lg sm:text-xl font-serif leading-relaxed text-[var(--foreground)]">
                        {judgeReport.user_facing_report.summary_paragraph}
                      </p>
                      {judgeReport.user_facing_report.what_we_checked && judgeReport.user_facing_report.what_we_checked.length > 0 && (
                        <ul className="mt-4 space-y-2 border-t-2 border-dashed border-[var(--border-color)] pt-4">
                          {judgeReport.user_facing_report.what_we_checked.map((item, i) => (
                            <li key={i} className="text-xs sm:text-sm font-bold text-[var(--foreground)] opacity-85 flex items-center gap-2">
                              <span className="font-mono text-xs text-[var(--foreground)]">&rsaquo;</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  )}

                  <CustomRedFlags flags={judgeReport.red_flags ?? []} t={t} />

                  <CustomVerifiedFacts facts={judgeReport.verified_facts ?? []} t={t} />

                  {judgeReport.threat_vectors && judgeReport.threat_vectors.length > 0 && (
                    <div id="vectors" className="space-y-6 scroll-mt-24">
                      <div className="flex items-center justify-between border-b-4 border-[var(--border-color)] pb-3 mb-6">
                        <h3 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-[var(--foreground)] flex items-center gap-3">
                          <StatusBadge rx="0.5rem" className="bg-[var(--accent-color)] text-[var(--accent-text)] px-3.5 py-2 text-sm sm:text-base font-bold">
                            03
                          </StatusBadge>
                          {t.sec03Title}
                        </h3>
                      </div>
                      {judgeReport.threat_vectors.map((v, i) => {
                        const isHigh = v.severity.toLowerCase() === 'high' || v.severity.toLowerCase() === 'critical';
                        const isMed = v.severity.toLowerCase() === 'medium';
                        const badgeClass = isHigh
                          ? "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40"
                          : isMed
                          ? "bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40"
                          : "bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40";

                        return (
                          <article key={i} className="border-2 border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-7 shadow-[6px_6px_0_var(--shadow-color)] space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <h4 className="font-serif font-bold text-xl sm:text-2xl leading-snug text-[var(--foreground)]">{v.vector}</h4>
                              <StatusBadge rx="0.4rem" className={`shrink-0 ${badgeClass}`}>
                                {v.severity.toUpperCase()}
                              </StatusBadge>
                            </div>
                            <p className="text-base sm:text-lg leading-relaxed text-[var(--foreground)] opacity-95">{v.technical_grounding}</p>
                          </article>
                        );
                      })}
                    </div>
                  )}

                  {judgeReport.links_of_interest && Object.keys(judgeReport.links_of_interest).length > 0 && (
                    <div id="links" className="space-y-6 scroll-mt-24">
                      <div className="flex items-center justify-between border-b-4 border-[var(--border-color)] pb-3 mb-6">
                        <h3 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-[var(--foreground)] flex items-center gap-3">
                          <StatusBadge rx="0.5rem" className="bg-[var(--accent-color)] text-[var(--accent-text)] px-3.5 py-2 text-sm sm:text-base font-bold">
                            04
                          </StatusBadge>
                          {t.sec04Title}
                        </h3>
                      </div>
                      {Object.entries(judgeReport.links_of_interest).map(([category, items]) => (
                        <div key={category} className="border-2 border-[var(--border-color)] bg-[var(--card-bg)] p-6 space-y-4">
                          <h4 className="font-mono font-bold text-xs uppercase tracking-widest text-[var(--foreground)] border-b-2 border-[var(--border-color)] pb-2 opacity-80">
                            {category}
                          </h4>
                          <div className="space-y-3">
                            {items.map((link, i) => (
                              <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[var(--background)] border-2 border-[var(--border-color)]">
                                <div className="space-y-1">
                                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="font-serif font-bold text-base text-[var(--foreground)] hover:underline">
                                    {link.title} &rsaquo;
                                  </a>
                                  <p className="text-xs sm:text-sm text-[var(--foreground)] opacity-85 leading-relaxed">{link.explanation}</p>
                                </div>
                                <span className="shrink-0 text-[10px] font-mono font-bold uppercase px-2.5 py-1 border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--foreground)]">
                                  {link.category}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {judgeReport.uncertainties && judgeReport.uncertainties.length > 0 && (
                    <div id="uncertainties" className="space-y-6 scroll-mt-24">
                      <div className="flex items-center justify-between border-b-4 border-[var(--border-color)] pb-3 mb-6">
                        <h3 className="font-serif font-bold text-2xl sm:text-3xl tracking-tight text-[var(--foreground)] flex items-center gap-3">
                          <StatusBadge rx="0.5rem" className="bg-[var(--accent-color)] text-[var(--accent-text)] px-3.5 py-2 text-sm sm:text-base font-bold">
                            05
                          </StatusBadge>
                          {t.sec05Title}
                        </h3>
                      </div>
                      {judgeReport.uncertainties.map((u, i) => (
                        <article key={i} className="border-2 border-[var(--border-color)] bg-[var(--card-bg)] p-6 sm:p-7 shadow-[6px_6px_0_var(--shadow-color)] space-y-4">
                          <h4 className="font-serif font-bold text-base sm:text-lg text-[var(--foreground)]"><span className="text-[11px] uppercase font-mono tracking-widest opacity-60 block mb-1">{t.missingEvidenceLabel}</span> {u.what_is_missing}</h4>
                          <p className="text-sm sm:text-base text-[var(--foreground)] opacity-90 leading-relaxed"><span className="font-bold">{t.whyItMattersLabel}</span> {u.why_it_matters}</p>
                          <p className="text-sm font-bold text-[var(--foreground)] bg-[var(--background)] p-4 border-2 border-[var(--border-color)] leading-relaxed"><span className="opacity-75 font-mono text-xs uppercase tracking-wider block mb-0.5">{t.recActionLabel}</span> {u.suggested_user_action}</p>
                        </article>
                      ))}
                    </div>
                  )}

                  {judgeReport.user_facing_report?.what_you_should_do && judgeReport.user_facing_report.what_you_should_do.length > 0 && (
                    <InteractiveActionChecklist items={judgeReport.user_facing_report.what_you_should_do} t={t} />
                  )}

                  <TransparencyLogSection discarded={judgeReport.discarded_evidence ?? (report as any).discarded_evidence ?? []} t={t} />

                  <PipelineMetricsSection timings={report.timings} t={t} />
                </div>

                <div className={`mt-10 flex ${isUrdu ? "justify-start" : "justify-center"}`}>
                  <button onClick={startNewScan} className="py-4 px-8 brutal-btn font-bold text-sm tracking-widest uppercase">
                    {t.newScanBtn}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      </main>

      {/* ULTRA-CLEAN MODERN FOOTER */}
      <footer className="w-full max-w-5xl z-20 mt-16 py-8 border-t-4 border-[var(--border-color)] text-[var(--foreground)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif font-black text-xl sm:text-2xl tracking-tight uppercase">
              Naukri Nigran
            </span>
            <span className="hidden sm:inline-block text-xs font-mono font-bold uppercase tracking-widest opacity-60 border-l-2 border-[var(--border-color)] pl-3">
              {t.antiScamTag}
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono font-bold uppercase tracking-wider">
            <a href="#scanner" className="hover:opacity-70 transition-opacity">
              {t.navScanner}
            </a>
            <span className="opacity-30">&bull;</span>
            <a href="#demo" className="hover:opacity-70 transition-opacity">
              {t.navDemo}
            </a>
            <span className="opacity-30">&bull;</span>
            <a href="#whatsapp" className="hover:opacity-70 transition-opacity">
              {t.navWhatsapp}
            </a>
            <span className="opacity-30">&bull;</span>
            <a href="#extension" className="hover:opacity-70 transition-opacity">
              {t.navExtension}
            </a>
            <span className="opacity-30">&bull;</span>
            <a href="https://ahmed-hassan-portfoliosite.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
              {t.navPortfolio}
            </a>
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t-2 border-dashed border-[var(--border-color)]/40 flex items-center justify-center text-[11px] font-mono font-bold uppercase tracking-widest text-[var(--foreground)] opacity-80">
          <span>{t.designerSignature}</span>
        </div>
      </footer>
    </div>
  );
}
