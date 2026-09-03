export type Lang = "en" | "ur";
export type Weight = "high" | "medium" | "low";
export type EvidenceStatus = "confirmed" | "contradicted" | "unverified";

export interface VerifiedFact {
  claim: string;
  evidence_status: EvidenceStatus;
  snippet_quote: string;
  source_url: string;
  source_type: string;
  search_intent: string;
  weight: Weight;
}

export interface RedFlag {
  flag: string;
  technical_basis: string;
  snippet_quote: string;
  source_url: string;
  source_type: string;
  weight: "high" | "medium";
}

export interface LinkOfInterest {
  title: string;
  url: string;
  category: string;
  explanation: string;
}

export interface ThreatVector {
  vector: string;
  technical_grounding: string;
  contributing_evidence: string[];
  severity: Weight;
}

export interface Uncertainty {
  what_is_missing: string;
  why_it_matters: string;
  suggested_user_action: string;
}

export interface DiscardedItem {
  source_url: string;
  title?: string | null;
  reason: string;
  note?: string | null;
}

export interface ReportMetadata {
  input_language?: string;
  target_entity?: string;
  model?: string;
  temperature?: number;
  total_facts?: number;
  total_red_flags?: number;
  total_links_of_interest?: number;
  total_discarded?: number;
  [key: string]: unknown;
}

export interface ExecutiveSummary {
  verdict: string;
  confidence_score: number;
  primary_threat_vector: string;
  one_sentence_takeaway: Record<string, string>;
}

export interface UserFacingReport {
  title: string;
  summary_paragraph: string;
  what_we_checked: string[];
  what_you_should_do: string[];
}

export interface JudgeReport {
  metadata: ReportMetadata;
  executive_summary: ExecutiveSummary;
  verified_facts: VerifiedFact[];
  red_flags: RedFlag[];
  links_of_interest: Record<string, LinkOfInterest[]>;
  threat_vectors: ThreatVector[];
  uncertainties: Uncertainty[];
  user_facing_report: UserFacingReport;
  discarded_evidence: DiscardedItem[];
  confidence_justification: string;
}

export interface ExtractedEntities {
  organization_name: string | null;
  roles: string[];
  salary_or_fee_claims: string | null;
  urls: string[];
  emails: string[];
  phones: string[];
}

export interface Timings {
  extraction_s?: number;
  osint_collection_s?: number;
  judgment_s?: number;
  total_s?: number;
}

export interface PhoneTrace {
  type: "phone";
  value: string;
  normalized: string;
  search_status: "ok" | "no_results" | "failed";
  findings: {
    source_url: string;
    source_title?: string;
    snippet?: string;
  }[];
  risk_signal: "flagged" | "clean" | "unknown";
}

export interface EmailTrace {
  type: "email";
  value: string;
  domain: string;
  whois_creation_date?: string;
  whois_lookup_status: "ok" | "failed";
  risk_signal: "new_domain" | "suspicious" | "clean" | "unknown";
}

export interface DatabaseMatchTrace {
  type: "database_match";
  value: string;
  entity_type?: string;
  search_status: "ok" | "no_results" | "failed";
  findings: {
    source_url: string;
    source_title?: string;
    snippet?: string;
  }[];
  risk_signal: "flagged" | "clean" | "unknown";
}

export type ContactTrace = PhoneTrace | EmailTrace | DatabaseMatchTrace;

export interface AnalyzeV2Response {
  status: string;
  report: JudgeReport | null;
  message?: string;
  extracted_entities?: ExtractedEntities;
  contact_traces?: ContactTrace[];
  timings?: Timings;
  dossier_id?: string;
}
