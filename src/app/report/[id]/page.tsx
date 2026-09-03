"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReportActions from "@/components/ReportActions";
import GroundedDossier from "@/components/GroundedDossier";
import { sanitizeReport } from "@/lib/share-report";
import type { AnalyzeV2Response } from "@/lib/report-types";

export default function SharedReportPage() {
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<AnalyzeV2Response | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchReport() {
      setLoading(true);
      try {
        const res = await fetch(`/api/report/${id}`);
        const json = await res.json();

        if (json.status === "success" && json.data) {
          setReportData(sanitizeReport(json.data));
        } else {
          setError(json.message || "Report not found or link expired.");
        }
      } catch (err: any) {
        setError("Failed to connect to intelligence database.");
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center justify-center p-6">
        <div className="brutal-card p-8 text-center max-w-md w-full border-4 border-[var(--border-color)]">
          <div className="w-8 h-8 border-4 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="font-serif font-bold text-xl uppercase tracking-wider">LOADING DOSSIER...</h2>
          <p className="font-mono text-xs opacity-70 mt-2">Fetching permalink report from database ({id})</p>
        </div>
      </div>
    );
  }

  if (error || !reportData || !reportData.report) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center justify-center p-6">
        <div className="brutal-card p-8 text-center max-w-md w-full border-4 border-[var(--border-color)]">
          <h2 className="font-serif font-bold text-2xl uppercase tracking-wider text-rose-500 mb-2">
            REPORT NOT FOUND
          </h2>
          <p className="font-mono text-xs opacity-80 mb-6">
            {error || "This permalink report does not exist or has expired."}
          </p>
          <Link
            href="/"
            className="py-3 px-6 brutal-btn font-bold text-xs tracking-widest uppercase inline-block"
          >
            RUN NEW SCAM SCAN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b-4 border-[var(--border-color)] pb-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest bg-[var(--accent-color)] text-[var(--accent-text)] px-3 py-1 font-bold">
              VERIFIED DOSSIER PERMALINK
            </span>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl mt-2 tracking-tight">
              {reportData.report.metadata.target_entity}
            </h1>
          </div>
          <Link href="/" className="py-2.5 px-5 brutal-btn font-bold text-xs tracking-widest uppercase">
            HOME SCANNER
          </Link>
        </div>

        {/* TOP REPORT ACTIONS: PDF & PERMALINK COPY */}
        <div className="flex justify-end">
          <ReportActions data={reportData} t={{}} />
        </div>

        {/* FULL DOSSIER UI */}
        <GroundedDossier report={reportData.report} t={{}} />
      </div>
    </div>
  );
}
