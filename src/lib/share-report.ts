import type { AnalyzeV2Response, JudgeReport, ContactTrace, ExtractedEntities, Timings } from "./report-types";

function withArray<T>(value: unknown, fallback: T[] = []): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function withString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function withNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function withObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

/**
 * Normalize a raw AnalyzeV2Response so every nested field has a safe default.
 * This prevents both the share-link restore path and the PDF renderer from
 * crashing when the backend returns a partial or malformed payload.
 */
export function sanitizeReport(raw: unknown): AnalyzeV2Response {
  if (!raw || typeof raw !== "object") {
    return { status: "error", report: null } as AnalyzeV2Response;
  }

  const input = raw as any;
  const rawReport = input.report;

  if (!rawReport || typeof rawReport !== "object") {
    return {
      status: withString(input.status, "error"),
      report: null,
      message: withString(input.message),
      extracted_entities: sanitizeExtractedEntities(input.extracted_entities),
      contact_traces: sanitizeContactTraces(input.contact_traces),
      timings: sanitizeTimings(input.timings),
    } as AnalyzeV2Response;
  }

  const r = rawReport as any;
  const rawMeta = withObject(r.metadata);
  const rawExec = withObject(r.executive_summary);
  const rawUfr = withObject(r.user_facing_report);

  const safeReport = {
    metadata: {
      input_language: withString(rawMeta.input_language),
      target_entity: withString(rawMeta.target_entity, "Unknown Entity"),
      model: withString(rawMeta.model),
      temperature: withNumber(rawMeta.temperature),
      total_facts: withNumber(rawMeta.total_facts),
      total_red_flags: withNumber(rawMeta.total_red_flags),
      total_links_of_interest: withNumber(rawMeta.total_links_of_interest),
      total_discarded: withNumber(rawMeta.total_discarded),
      ...rawMeta,
    },
    executive_summary: {
      verdict: withString(rawExec.verdict, "inconclusive"),
      confidence_score: withNumber(rawExec.confidence_score),
      primary_threat_vector: withString(rawExec.primary_threat_vector, "Unknown"),
      one_sentence_takeaway: {
        en: withString((rawExec.one_sentence_takeaway as any)?.en, "No executive summary available."),
        ur: withString((rawExec.one_sentence_takeaway as any)?.ur),
      },
    },
    user_facing_report: {
      title: withString(rawUfr.title),
      summary_paragraph: withString(rawUfr.summary_paragraph),
      what_we_checked: withArray<string>(rawUfr.what_we_checked),
      what_you_should_do: withArray<string>(rawUfr.what_you_should_do),
    },
    verified_facts: withArray(r.verified_facts).map((f: any) => ({
      claim: withString(f?.claim, "Unnamed fact"),
      evidence_status: withString(f?.evidence_status, "unverified"),
      snippet_quote: withString(f?.snippet_quote),
      source_url: withString(f?.source_url),
      source_type: withString(f?.source_type),
      search_intent: withString(f?.search_intent),
      weight: withString(f?.weight, "low"),
    })),
    red_flags: withArray(r.red_flags).map((f: any) => ({
      flag: withString(f?.flag, "Unnamed red flag"),
      technical_basis: withString(f?.technical_basis, "No technical basis provided."),
      snippet_quote: withString(f?.snippet_quote),
      source_url: withString(f?.source_url),
      source_type: withString(f?.source_type),
      weight: withString(f?.weight, "medium"),
    })),
    links_of_interest: (() => {
      const out: Record<string, any[]> = {};
      const rawLinks = withObject(r.links_of_interest);
      Object.entries(rawLinks).forEach(([category, items]) => {
        out[category] = withArray(items).map((link: any) => ({
          title: withString(link?.title, link?.url || "Untitled link"),
          url: withString(link?.url, "#"),
          category: withString(link?.category),
          explanation: withString(link?.explanation, "No explanation provided."),
        }));
      });
      return out;
    })(),
    threat_vectors: withArray(r.threat_vectors).map((v: any) => ({
      vector: withString(v?.vector, "Unnamed vector"),
      technical_grounding: withString(v?.technical_grounding, "No technical grounding provided."),
      contributing_evidence: withArray<string>(v?.contributing_evidence),
      severity: withString(v?.severity, "low"),
    })),
    uncertainties: withArray(r.uncertainties).map((u: any) => ({
      what_is_missing: withString(u?.what_is_missing, "Not specified."),
      why_it_matters: withString(u?.why_it_matters, "Not specified."),
      suggested_user_action: withString(u?.suggested_user_action, "None provided."),
    })),
    discarded_evidence: withArray(r.discarded_evidence).map((d: any) => ({
      source_url: withString(d?.source_url, "#"),
      title: withString(d?.title),
      reason: withString(d?.reason, "unknown"),
      note: withString(d?.note),
    })),
    confidence_justification: withString(r.confidence_justification),
  } as JudgeReport;

  return {
    status: withString(input.status, "success"),
    dossier_id: withString(input.dossier_id),
    report: safeReport,
    message: withString(input.message),
    extracted_entities: sanitizeExtractedEntities(input.extracted_entities),
    contact_traces: sanitizeContactTraces(input.contact_traces),
    timings: sanitizeTimings(input.timings),
  } as AnalyzeV2Response;
}

function sanitizeExtractedEntities(raw: unknown): ExtractedEntities | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const e = raw as any;
  return {
    organization_name: withString(e.organization_name),
    roles: withArray<string>(e.roles),
    salary_or_fee_claims: withString(e.salary_or_fee_claims),
    urls: withArray<string>(e.urls),
    emails: withArray<string>(e.emails),
    phones: withArray<string>(e.phones),
  };
}

function sanitizeContactTraces(raw: unknown): ContactTrace[] | undefined {
  const traces = withArray<any>(raw);
  if (!traces.length) return undefined;
  return traces.map((trace: any) => {
    const type = trace?.type === "phone" ? "phone" : "email";
    const value = withString(trace?.value, "N/A");

    if (type === "phone") {
      return {
        type,
        value,
        normalized: withString(trace?.normalized, value),
        search_status: withString(trace?.search_status, "unknown"),
        risk_signal: withString(trace?.risk_signal, "unknown"),
        findings: withArray(trace?.findings).map((f: any) => ({
          source_url: withString(f?.source_url, "#"),
          source_title: withString(f?.source_title),
          snippet: withString(f?.snippet, "No snippet available."),
        })),
      } as ContactTrace;
    }

    return {
      type,
      value,
      domain: withString(trace?.domain, value),
      whois_creation_date: withString(trace?.whois_creation_date),
      whois_lookup_status: withString(trace?.whois_lookup_status, "unknown"),
      risk_signal: withString(trace?.risk_signal, "unknown"),
    } as ContactTrace;
  });
}

function sanitizeTimings(raw: unknown): Timings | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const t = raw as any;
  return {
    extraction_s: withNumber(t.extraction_s),
    osint_collection_s: withNumber(t.osint_collection_s),
    judgment_s: withNumber(t.judgment_s),
    total_s: withNumber(t.total_s),
  };
}

/**
 * Encode a report payload into a URL-safe base64 string.
 * Uses encodeURIComponent to safely handle Unicode characters.
 */
export function encodeReport(data: AnalyzeV2Response): string {
  const json = JSON.stringify(data);
  if (typeof window !== "undefined") {
    return btoa(encodeURIComponent(json));
  }
  return Buffer.from(encodeURIComponent(json), "utf-8").toString("base64");
}

/**
 * Decode a URL-safe base64 string back into an AnalyzeV2Response.
 * Returns null if decoding fails.
 */
export function decodeReport(encoded: string): AnalyzeV2Response | null {
  try {
    const decoded = typeof window !== "undefined"
      ? decodeURIComponent(atob(encoded))
      : decodeURIComponent(Buffer.from(encoded, "base64").toString("utf-8"));
    return sanitizeReport(JSON.parse(decoded));
  } catch {
    return null;
  }
}

/**
 * Build a shareable URL for the current report.
 */
export function buildShareUrl(data: AnalyzeV2Response): string {
  if (typeof window === "undefined") return "";
  if (data.dossier_id) {
    const origin = window.location.origin;
    return `${origin}/report/${data.dossier_id}`;
  }
  const encoded = encodeReport(data);
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("r", encoded);
  return url.toString();
}

/**
 * Extract a shared report from the current URL, if present.
 */
export function readSharedReport(): AnalyzeV2Response | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("r");
  if (!encoded) return null;
  return decodeReport(encoded);
}
