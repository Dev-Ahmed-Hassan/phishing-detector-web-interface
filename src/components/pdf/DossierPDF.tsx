import type { ReactNode } from "react";
import { Document, Page, Text, View, StyleSheet, Link, Font } from "@react-pdf/renderer";
import type { AnalyzeV2Response, ContactTrace, VerifiedFact, RedFlag, ThreatVector, LinkOfInterest, Uncertainty, DiscardedItem } from "@/lib/report-types";

// ---------------------------------------------------------------------------
// PROFESSIONAL DOSSIER PDF — Shodan/Nessus-style report adapted to site theme
// ---------------------------------------------------------------------------

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf", fontWeight: 700 },
    { src: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuBWYMZg.ttf", fontWeight: 900 },
  ],
});

// Playfair Display font removed: the previously registered URL 404'd at runtime,
// which caused @react-pdf/renderer to fail when generating the dossier. We now use
// Inter (already registered above) for all headings to keep PDF generation reliable.

const palette = {
  pageBg: "#FFFFFF",
  cardBg: "#FFFFFF",
  foreground: "#000000",
  ink: "#FFFFFF",
  border: "#000000",
  hairline: "#000000",
  accent: "#000000",
  accentText: "#FFFFFF",
  link: "#000000",
  scam: "#000000",
  scamInk: "#FFFFFF",
  susp: "#000000",
  suspInk: "#FFFFFF",
  legit: "#FFFFFF",
  legitInk: "#000000",
  inc: "#FFFFFF",
  incInk: "#000000",
};

const styles = StyleSheet.create({
  page: {
    padding: 44,
    paddingBottom: 64,
    fontFamily: "Inter",
    fontSize: 10,
    fontWeight: 600,
    lineHeight: 1.55,
    color: palette.foreground,
    backgroundColor: palette.pageBg,
  },
  headerBand: {
    backgroundColor: palette.foreground,
    color: palette.ink,
    padding: 14,
    margin: -44,
    marginBottom: 28,
    marginLeft: -44,
    marginRight: -44,
    paddingLeft: 44,
    paddingRight: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: palette.border,
  },
  headerBrand: {
    fontFamily: "Inter",
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: -0.5,
  },
  headerTag: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  footer: {
    position: "absolute",
    bottom: 22,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: palette.foreground,
    borderTopWidth: 1,
    borderTopColor: palette.hairline,
    paddingTop: 8,
  },
  coverTitle: {
    fontFamily: "Inter",
    fontSize: 26,
    fontWeight: 900,
    lineHeight: 1.25,
    marginBottom: 6,
    letterSpacing: -0.5,
    color: palette.foreground,
  },
  coverSubtitle: {
    fontSize: 11,
    fontWeight: 500,
    lineHeight: 1.4,
    color: palette.foreground,
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: palette.accent,
  },
  metaValue: {
    fontSize: 10,
    fontWeight: 700,
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: palette.accent,
    paddingBottom: 6,
    marginBottom: 12,
  },
  sectionNumber: {
    backgroundColor: palette.accent,
    color: palette.accentText,
    fontSize: 9,
    fontWeight: 900,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sectionTitle: {
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: 900,
    letterSpacing: -0.3,
  },
  verdictBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 11,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 1,
    alignSelf: "flex-start",
  },
  neoCardWrap: {
    marginBottom: 14,
  },
  neoShadow: {
    paddingRight: 5,
    paddingBottom: 5,
  },
  neoCardInner: {
    backgroundColor: palette.cardBg,
    borderWidth: 2,
    borderColor: palette.border,
    padding: 12,
  },
  cardTitle: {
    fontWeight: 900,
    fontSize: 11,
    marginBottom: 6,
    color: palette.foreground,
  },
  cardBody: {
    fontSize: 10,
    fontWeight: 600,
    color: palette.foreground,
  },
  cardMuted: {
    fontSize: 9,
    fontWeight: 600,
    color: palette.foreground,
    marginTop: 6,
  },
  label: {
    fontSize: 8,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    color: palette.accent,
    marginBottom: 3,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 6,
    gap: 8,
  },
  bullet: {
    fontFamily: "Inter",
    fontWeight: 900,
    color: palette.accent,
  },
  source: {
    fontSize: 8,
    fontWeight: 600,
    color: palette.foreground,
    marginTop: 4,
  },
  link: {
    color: palette.link,
    textDecoration: "underline",
    textDecorationColor: palette.link,
    fontWeight: 700,
  },
  twoCol: {
    flexDirection: "row",
    gap: 12,
  },
  col: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: palette.hairline,
    marginVertical: 10,
  },
  footnote: {
    fontSize: 8,
    color: palette.foreground,
    marginBottom: 2,
  },
});

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function verdictColors(verdict: string) {
  const v = verdict.toLowerCase();
  if (v.includes("scam")) return { bg: palette.scam, text: palette.scamInk };
  if (v.includes("susp")) return { bg: palette.susp, text: palette.suspInk };
  if (v.includes("legit")) return { bg: palette.legit, text: palette.legitInk };
  return { bg: palette.inc, text: palette.incInk };
}

function cleanUrl(url: string) {
  try {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  } catch {
    return url;
  }
}

function collectSources(report: NonNullable<AnalyzeV2Response["report"]>) {
  const sources = new Map<string, number>();
  let idx = 1;
  const add = (url?: string) => {
    if (!url) return 0;
    if (sources.has(url)) return sources.get(url)!;
    sources.set(url, idx);
    return idx++;
  };

  (report.verified_facts ?? []).forEach((f) => add(f.source_url));
  (report.red_flags ?? []).forEach((r) => add(r.source_url));
  (report.discarded_evidence ?? []).forEach((d) => add(d.source_url));

  Object.values(report.links_of_interest ?? {}).forEach((group) => {
    group.forEach((l) => add(l.url));
  });

  return sources;
}

type NeoCardVariant = "default" | "red" | "amber" | "green";

const neoShadowColor: Record<NeoCardVariant, string> = {
  default: palette.border,
  red: palette.border,
  amber: palette.border,
  green: palette.border,
};

function NeoCard({
  children,
  variant = "default",
  style,
}: {
  children: ReactNode;
  variant?: NeoCardVariant;
  style?: any;
}) {
  return (
    <View style={[styles.neoCardWrap, style]}>
      <View style={[styles.neoShadow, { backgroundColor: neoShadowColor[variant] }]}>
        <View style={styles.neoCardInner}>{children}</View>
      </View>
    </View>
  );
}

interface DossierPDFProps {
  data: AnalyzeV2Response;
}

export default function DossierPDF({ data }: DossierPDFProps) {
  const report = data.report;
  if (!report) return null;

  const summary = report.executive_summary ?? {
    verdict: "inconclusive",
    confidence_score: 0,
    primary_threat_vector: "Unknown",
    one_sentence_takeaway: { en: "No executive summary available." },
  } as any;
  const ufr = report.user_facing_report ?? {
    title: "",
    summary_paragraph: "",
    what_we_checked: [],
    what_you_should_do: [],
  } as any;
  const verdict = summary.verdict || "inconclusive";
  const colors = verdictColors(verdict);
  const entity = report.metadata?.target_entity || "Unknown Entity";
  const sources = collectSources(report);

  const SourceRef = ({ url }: { url?: string }) => {
    if (!url) return null;
    const n = sources.get(url);
    if (!n) return null;
    return (
      <Link src={url} style={styles.link}>
        <Text style={styles.source}>[{n}] {cleanUrl(url)}</Text>
      </Link>
    );
  };

  return (
    <Document title={`Naukri Nigran Report — ${entity}`} author="Naukri Nigran Intelligence">
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBand} fixed>
          <Text style={styles.headerBrand}>Naukri Nigran</Text>
          <Text style={styles.headerTag}>Anti-Scam Intelligence Report</Text>
        </View>

        <View style={{ marginTop: 12, marginBottom: 12 }}>
          <Text style={styles.coverTitle}>Investigation Dossier</Text>
          <Text style={styles.coverSubtitle}>Autonomous OSINT analysis of a suspected job-scam or phishing entity.</Text>
        </View>

        <NeoCard variant="default">
          <View style={styles.metaRow}>
            <View>
              <Text style={styles.metaLabel}>Target Entity</Text>
              <Text style={{ fontSize: 16, fontWeight: 900, fontFamily: "Inter" }}>{entity}</Text>
            </View>
            <View style={[styles.verdictBadge, { backgroundColor: colors.bg, color: colors.text }]}>
              <Text>{verdict.replace(/_/g, " ").toUpperCase()}</Text>
            </View>
          </View>
          <View style={styles.twoCol}>
            <View style={styles.col}>
              <Text style={styles.metaLabel}>Confidence Score</Text>
              <Text style={styles.metaValue}>{Math.round(summary.confidence_score)} / 100</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.metaLabel}>Primary Threat Vector</Text>
              <Text style={styles.metaValue}>{summary.primary_threat_vector}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.metaLabel}>Generated</Text>
              <Text style={styles.metaValue}>{formatDate()}</Text>
            </View>
          </View>
        </NeoCard>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionNumber}>01</Text>
            <Text style={styles.sectionTitle}>Executive Takeaway</Text>
          </View>
          <Text style={styles.cardBody}>{summary.one_sentence_takeaway?.en || "No executive summary available."}</Text>
        </View>

        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.label}>What We Checked</Text>
            {(ufr.what_we_checked ?? []).map((item, i) => (
              <View key={i} style={styles.listItem}>
                <Text style={styles.bullet}>›</Text>
                <Text style={{ flex: 1 }}>{item}</Text>
              </View>
            ))}
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>What You Should Do</Text>
            {(ufr.what_you_should_do ?? []).map((item, i) => (
              <View key={i} style={styles.listItem}>
                <Text style={styles.bullet}>›</Text>
                <Text style={{ flex: 1 }}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text>Naukri Nigran • Confidential OSINT Dossier</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.headerBand} fixed>
          <Text style={styles.headerBrand}>Naukri Nigran</Text>
          <Text style={styles.headerTag}>Anti-Scam Intelligence Report</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionNumber}>02</Text>
            <Text style={styles.sectionTitle}>Red Flags & Anomalies ({report.red_flags?.length ?? 0})</Text>
          </View>
          {(report.red_flags ?? []).map((flag, i) => (
            <NeoCard key={i} variant="red">
              <Text style={styles.cardTitle}>{flag.flag || "Unnamed red flag"}</Text>
              <Text style={styles.label}>Technical Basis</Text>
              <Text style={styles.cardBody}>{flag.technical_basis || "No technical basis provided."}</Text>
              {flag.snippet_quote && (
                <>
                  <Text style={styles.label}>Source Evidence</Text>
                  <Text style={styles.cardMuted}>“{flag.snippet_quote}”</Text>
                </>
              )}
              <SourceRef url={flag.source_url} />
            </NeoCard>
          ))}
        </View>

        <View style={styles.footer} fixed>
          <Text>Naukri Nigran • Confidential OSINT Dossier</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.headerBand} fixed>
          <Text style={styles.headerBrand}>Naukri Nigran</Text>
          <Text style={styles.headerTag}>Anti-Scam Intelligence Report</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionNumber}>03</Text>
            <Text style={styles.sectionTitle}>Verified Facts & Domain Records ({report.verified_facts?.length ?? 0})</Text>
          </View>
          {(report.verified_facts ?? []).map((fact, i) => (
            <NeoCard key={i} variant="green">
              <Text style={styles.cardTitle}>{fact.claim || "Unnamed fact"}</Text>
              <View style={styles.twoCol}>
                <View style={styles.col}>
                  <Text style={styles.label}>Evidence Status</Text>
                  <Text style={[styles.cardBody, { fontWeight: 900, textTransform: "uppercase" }]}>{fact.evidence_status || "N/A"}</Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.label}>Weight</Text>
                  <Text style={[styles.cardBody, { fontWeight: 900, textTransform: "uppercase" }]}>{fact.weight || "N/A"}</Text>
                </View>
              </View>
              {fact.snippet_quote && (
                <>
                  <Text style={styles.label}>Snippet</Text>
                  <Text style={styles.cardMuted}>“{fact.snippet_quote}”</Text>
                </>
              )}
              <SourceRef url={fact.source_url} />
            </NeoCard>
          ))}
        </View>

        {data.contact_traces && data.contact_traces.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionNumber}>04</Text>
              <Text style={styles.sectionTitle}>Contact Traces ({data.contact_traces?.length ?? 0})</Text>
            </View>
            {(data.contact_traces ?? []).map((trace, i) => (
              <NeoCard key={i}>
                <Text style={styles.cardTitle}>
                  {trace.type === "phone" ? "Phone Trace" : "Email Trace"}: {trace.value || "N/A"}
                </Text>
                {trace.type === "phone" ? (
                  <>
                    <Text style={styles.label}>Normalized</Text>
                    <Text style={styles.cardBody}>{trace.normalized || "N/A"}</Text>
                    <Text style={styles.label}>Risk Signal</Text>
                    <Text style={[styles.cardBody, { fontWeight: 900, textTransform: "uppercase" }]}>{trace.risk_signal || "N/A"}</Text>
                    {(trace.findings ?? []).length > 0 && (
                      <>
                        <Text style={styles.label}>Findings</Text>
                        {(trace.findings ?? []).map((f, j) => (
                          <Text key={j} style={styles.cardMuted}>• {f.snippet || "No snippet available."}</Text>
                        ))}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Text style={styles.label}>Domain</Text>
                    <Text style={styles.cardBody}>{trace.domain || "N/A"}</Text>
                    {trace.whois_creation_date && (
                      <>
                        <Text style={styles.label}>Domain Registered</Text>
                        <Text style={styles.cardBody}>{trace.whois_creation_date}</Text>
                      </>
                    )}
                    <Text style={styles.label}>Risk Signal</Text>
                    <Text style={[styles.cardBody, { fontWeight: 900, textTransform: "uppercase" }]}>{trace.risk_signal || "N/A"}</Text>
                  </>
                )}
              </NeoCard>
            ))}
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text>Naukri Nigran • Confidential OSINT Dossier</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>

      {((report.threat_vectors ?? []).length > 0 || Object.keys(report.links_of_interest ?? {}).length > 0 || (report.uncertainties ?? []).length > 0) && (
        <Page size="A4" style={styles.page}>
          <View style={styles.headerBand} fixed>
            <Text style={styles.headerBrand}>Naukri Nigran</Text>
            <Text style={styles.headerTag}>Anti-Scam Intelligence Report</Text>
          </View>

          {(report.threat_vectors ?? []).length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionNumber}>05</Text>
                <Text style={styles.sectionTitle}>Primary Threat Vectors</Text>
              </View>
              {(report.threat_vectors ?? []).map((v, i) => (
                <NeoCard key={i} variant="amber">
                  <Text style={styles.cardTitle}>{v.vector || "Unnamed vector"}</Text>
                  <Text style={styles.label}>Severity</Text>
                  <Text style={[styles.cardBody, { fontWeight: 900, textTransform: "uppercase" }]}>{v.severity || "N/A"}</Text>
                  <Text style={styles.label}>Technical Grounding</Text>
                  <Text style={styles.cardBody}>{v.technical_grounding || "No technical grounding provided."}</Text>
                </NeoCard>
              ))}
            </View>
          )}

          {Object.keys(report.links_of_interest ?? {}).length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionNumber}>06</Text>
                <Text style={styles.sectionTitle}>Evidentiary Links Explorer</Text>
              </View>
              {Object.entries(report.links_of_interest ?? {}).map(([category, items]) => (
                <NeoCard key={category}>
                  <Text style={styles.label}>{category || "Links"}</Text>
                  {(items ?? []).map((link, i) => (
                    <View key={i} style={{ marginBottom: 8 }}>
                      <Link src={link.url || "#"} style={styles.link}>
                        <Text>{link.title || link.url || "Untitled link"} ›</Text>
                      </Link>
                      <Text style={styles.cardMuted}>{link.explanation || "No explanation provided."}</Text>
                    </View>
                  ))}
                </NeoCard>
              ))}
            </View>
          )}

          {(report.uncertainties ?? []).length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionNumber}>07</Text>
                <Text style={styles.sectionTitle}>Unresolved Uncertainties</Text>
              </View>
              {(report.uncertainties ?? []).map((u, i) => (
                <NeoCard key={i} variant="amber">
                  <Text style={styles.label}>Missing Evidence</Text>
                  <Text style={styles.cardBody}>{u.what_is_missing || "Not specified."}</Text>
                  <Text style={styles.label}>Why It Matters</Text>
                  <Text style={styles.cardMuted}>{u.why_it_matters || "Not specified."}</Text>
                  <Text style={styles.label}>Recommended Action</Text>
                  <Text style={styles.cardBody}>{u.suggested_user_action || "None provided."}</Text>
                </NeoCard>
              ))}
            </View>
          )}

          <View style={styles.footer} fixed>
            <Text>Naukri Nigran • Confidential OSINT Dossier</Text>
            <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
          </View>
        </Page>
      )}

      <Page size="A4" style={styles.page}>
        <View style={styles.headerBand} fixed>
          <Text style={styles.headerBrand}>Naukri Nigran</Text>
          <Text style={styles.headerTag}>Anti-Scam Intelligence Report</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionNumber}>99</Text>
            <Text style={styles.sectionTitle}>Sources & References</Text>
          </View>
          {Array.from(sources.entries()).map(([url, n]) => (
            <View key={url} style={styles.listItem}>
              <Text style={{ fontWeight: 900, width: 20 }}>[{n}]</Text>
              <Link src={url} style={styles.link}>
                <Text>{url}</Text>
              </Link>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>Methodology</Text>
          <Text style={styles.cardBody}>
            This report was generated autonomously by the Naukri Nigran OSINT pipeline. Phase 1 extracts entities
            from the user-submitted message; Phase 2 queries public web, domain, phone, and community sources;
            Phase 3 applies a rule-augmented AI judgment engine to produce a confidence score and verdict.
            Results are advisory and should be cross-checked with official authorities before taking legal action.
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>Naukri Nigran • Confidential OSINT Dossier</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
