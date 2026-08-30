import type { Lang } from "./report-types";

export type { Lang } from "./report-types";

export const VERDICT_MAP: Record<
  string,
  { bgVar: string; inkVar: string; label: string; labelUr: string }
> = {
  likely_scam: {
    bgVar: "--v-scam-bg",
    inkVar: "--v-scam-ink",
    label: "LIKELY SCAM",
    labelUr: "ممکنہ فراڈ",
  },
  suspicious: {
    bgVar: "--v-susp-bg",
    inkVar: "--v-susp-ink",
    label: "SUSPICIOUS",
    labelUr: "مشکوک",
  },
  likely_legitimate: {
    bgVar: "--v-legit-bg",
    inkVar: "--v-legit-ink",
    label: "LIKELY LEGITIMATE",
    labelUr: "ممکنہ جائز",
  },
  inconclusive: {
    bgVar: "--v-inc-bg",
    inkVar: "--v-inc-ink",
    label: "INCONCLUSIVE",
    labelUr: "غیر یقینی",
  },
};

export function verdictStyle(verdict: string) {
  return VERDICT_MAP[verdict] ?? VERDICT_MAP.inconclusive;
}

const URDU_SCRIPT = /[\u0600-\u06FF]/;

export function isUrduScript(text: string | null | undefined): boolean {
  if (!text) return false;
  return URDU_SCRIPT.test(text);
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
}

export function pickTakeaway(map?: Record<string, string>): string {
  if (!map) return "";
  const preferred = ["user_language", "auto", "urdu", "roman_urdu", "en"];
  for (const k of preferred) {
    if (map[k]) return map[k];
  }
  const first = Object.values(map)[0];
  return first ?? "";
}

export interface ReportT {
  caseFile: string;
  filed: string;
  unknownEntity: string;
  primaryThreat: string;
  legitimacyScore: string;
  scaleHint: string;
  theTakeaway: string;
  statsFacts: string;
  statsFlags: string;
  statsLinks: string;
  statsDiscarded: string;
  extractedLabel: string;
  redFlagsTitle: string;
  verifiedFactsTitle: string;
  threatVectorsTitle: string;
  linksTitle: string;
  uncertaintiesTitle: string;
  actionsTitle: string;
  transparencyTitle: string;
  forensicTitle: string;
  evidenceLabel: string;
  sourceLabel: string;
  whyItMatters: string;
  contributingEvidence: string;
  statusLabel: string;
  whatIsMissing: string;
  suggestedAction: string;
  high: string;
  medium: string;
  low: string;
  confirmed: string;
  contradicted: string;
  unverified: string;
  doneLabel: string;
  discardedCount: (n: number) => string;
  reasonLabels: Record<string, string>;
  extractionLabel: string;
  osintLabel: string;
  judgmentLabel: string;
  totalLabel: string;
  confidenceLabel: string;
  modelLabel: string;
  languageLabel: string;
  secondsLabel: string;
}

const REPORT_EN: ReportT = {
  caseFile: "CASE FILE",
  filed: "FILED",
  unknownEntity: "UNIDENTIFIED ENTITY",
  primaryThreat: "PRIMARY THREAT",
  legitimacyScore: "LEGITIMACY SCORE",
  scaleHint: "0 = SCAM / 100 = LEGITIMATE",
  theTakeaway: "THE TAKEAWAY",
  statsFacts: "VERIFIED FACTS",
  statsFlags: "RED FLAGS",
  statsLinks: "LINKS REVIEWED",
  statsDiscarded: "DISCARDED",
  extractedLabel: "EXTRACTED FROM YOUR MESSAGE",
  redFlagsTitle: "RED FLAGS",
  verifiedFactsTitle: "VERIFIED FACTS",
  threatVectorsTitle: "THREAT ANALYSIS",
  linksTitle: "LINKS OF INTEREST",
  uncertaintiesTitle: "WHAT WE COULDN'T VERIFY",
  actionsTitle: "WHAT YOU SHOULD DO",
  transparencyTitle: "TRANSPARENCY LOG",
  forensicTitle: "FORENSIC LOG",
  evidenceLabel: "EVIDENCE",
  sourceLabel: "SOURCE",
  whyItMatters: "WHY IT MATTERS",
  contributingEvidence: "CONTRIBUTING EVIDENCE",
  statusLabel: "STATUS",
  whatIsMissing: "MISSING",
  suggestedAction: "RECOMMENDED",
  high: "HIGH",
  medium: "MEDIUM",
  low: "LOW",
  confirmed: "CONFIRMED",
  contradicted: "CONTRADICTED",
  unverified: "UNVERIFIED",
  doneLabel: "DONE",
  discardedCount: (n) => `${n} RESULT${n === 1 ? "" : "S"} DISCARDED`,
  reasonLabels: {
    entity_mismatch: "WRONG ENTITY",
    paywall: "PAYWALL",
    ad: "AD",
    unrelated: "UNRELATED",
    source_not_in_dossier: "UNVERIFIED SOURCE",
  },
  extractionLabel: "EXTRACTION",
  osintLabel: "OSINT",
  judgmentLabel: "JUDGMENT",
  totalLabel: "TOTAL",
  confidenceLabel: "SCORE BREAKDOWN",
  modelLabel: "MODEL",
  languageLabel: "INPUT LANGUAGE",
  secondsLabel: "s",
};

const REPORT_UR: ReportT = {
  caseFile: "کیس فائل",
  filed: "دارج",
  unknownEntity: "غیر شناختہ ادارہ",
  primaryThreat: "بنیادی خطرہ",
  legitimacyScore: "جائزگی اسکور",
  scaleHint: "۰ = فراڈ / ۱۰۰ = جائز",
  theTakeaway: "خلاصہ",
  statsFacts: "تصدیق شدہ حقائق",
  statsFlags: "خطرے کے نشانات",
  statsLinks: "جانچے گئے لنکس",
  statsDiscarded: "رَد شدہ",
  extractedLabel: "آپ کے پیغام سے اخذ شدہ",
  redFlagsTitle: "خطرے کے نشانات",
  verifiedFactsTitle: "تصدیق شدہ حقائق",
  threatVectorsTitle: "خطرے کا تجزیہ",
  linksTitle: "اہم لنکس",
  uncertaintiesTitle: "جو ہم تصدیق نہ کر سکے",
  actionsTitle: "آپ کو کیا کرنا چاہیے",
  transparencyTitle: "شفافیت کا ریکارڈ",
  forensicTitle: "فارنسک لاگ",
  evidenceLabel: "ثبوت",
  sourceLabel: "ذریعہ",
  whyItMatters: "یہ اہم کیوں ہے",
  contributingEvidence: "معاون ثبوت",
  statusLabel: "حالت",
  whatIsMissing: "غیر موجود",
  suggestedAction: "تجویز",
  high: "زیادہ",
  medium: "درمیانی",
  low: "کم",
  confirmed: "تصدیق شدہ",
  contradicted: "مسترد",
  unverified: "غیر تصدیق شدہ",
  doneLabel: "مکمل",
  discardedCount: (n) => `${n} نتائج رَد کیے گئے`,
  reasonLabels: {
    entity_mismatch: "غلط ادارہ",
    paywall: "پے وال",
    ad: "اشتہار",
    unrelated: "غیر متعلقہ",
    source_not_in_dossier: "غیر تصدیق شدہ ذریعہ",
  },
  extractionLabel: "اخراج",
  osintLabel: "ثبوت جمعی",
  judgmentLabel: "فیصلہ",
  totalLabel: "کل",
  confidenceLabel: "اسکور کی تفصیل",
  modelLabel: "ماڈل",
  languageLabel: "پیغام کی زبان",
  secondsLabel: " سیکنڈ",
};

export function getReportT(lang: Lang): ReportT {
  return lang === "ur" ? REPORT_UR : REPORT_EN;
}

export interface ProgressT {
  liveLabel: string;
  elapsedLabel: string;
  phase1: string;
  phase1Sub: string;
  phase2: string;
  phase2Subs: string[];
  phase3: string;
  phase3Sub: string;
  phaseWord: string;
}

export function getProgressT(lang: Lang): ProgressT {
  if (lang === "ur") {
    return {
      liveLabel: "براہِ راست تحقیق",
      elapsedLabel: "گزرا وقت",
      phase1: "معلومات کا اخراج",
      phase1Sub: "او سی آر · ادارے · دعوے",
      phase2: "ثبوت جمع کرنا",
      phase2Subs: [
        "کمیونٹی رپورٹس کی تلاش…",
        "ڈومین WHOIS ریکارڈ…",
        "فون اور ای میل کے سراغ…",
        "مشکوک صفحات کا گہرا مطالعہ…",
        "دعووں کی تصدیق…",
        "سرکاری موجودگی کی جانچ…",
      ],
      phase3: "اے آئی فیصلہ",
      phase3Sub: "ثبوتوں کا تجزیہ جاری ہے…",
      phaseWord: "مرحلہ",
    };
  }
  return {
    liveLabel: "LIVE INVESTIGATION",
    elapsedLabel: "ELAPSED",
    phase1: "ENTITY EXTRACTION",
    phase1Sub: "OCR · entities · claims",
    phase2: "OSINT EVIDENCE COLLECTION",
    phase2Subs: [
      "querying community reputation…",
      "running WHOIS domain lookups…",
      "scanning phone & email traces…",
      "deep-scraping suspect pages…",
      "cross-checking factual claims…",
      "verifying official presence…",
    ],
    phase3: "AI JUDGMENT",
    phase3Sub: "weighing evidence against intents…",
    phaseWord: "PHASE",
  };
}
