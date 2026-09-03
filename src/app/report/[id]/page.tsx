"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Home from "@/app/page";

export default function SharedReportPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const reportId = resolvedParams.id;

  const [fetchedReport, setFetchedReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) {
      setError("Invalid Report ID");
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadReport() {
      try {
        const res = await fetch(`/api/report/${reportId}`);
        if (!res.ok) {
          throw new Error("Report not found or expired.");
        }

        const data = await res.json();
        if (data.status === "error" || !data.report) {
          throw new Error(data.message || "Report not found or expired.");
        }

        if (isMounted) {
          setFetchedReport(data);
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to load report.");
          setLoading(false);
        }
      }
    }

    loadReport();

    return () => {
      isMounted = false;
    };
  }, [reportId]);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-[var(--background,#09090B)] text-[var(--foreground,#FAFAFA)] flex flex-col items-center justify-center p-6 font-mono text-sm"
        dir="ltr"
      >
        <div className="border-4 border-[var(--border-color,#27272A)] bg-[var(--card-bg,#0F0F12)] p-8 shadow-[8px_8px_0_#F59E0B] rounded-md max-w-md w-full text-center space-y-4">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-[#F59E0B] border-t-transparent rounded-full" />
          <h2 className="font-serif font-bold text-xl tracking-tight">FETCHING INVESTIGATION DOSSIER</h2>
          <p className="text-xs text-[var(--foreground)] opacity-70">Querying Supabase threat database for ID: {reportId}...</p>
        </div>
      </div>
    );
  }

  if (error || !fetchedReport) {
    return (
      <div
        className="min-h-screen bg-[var(--background,#09090B)] text-[var(--foreground,#FAFAFA)] flex flex-col items-center justify-center p-6 font-mono text-sm"
        dir="ltr"
      >
        <div className="border-4 border-[var(--border-color,#27272A)] bg-[var(--card-bg,#0F0F12)] p-8 shadow-[8px_8px_0_#EF4444] rounded-md max-w-md w-full text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#EF4444] text-white font-bold text-xl rounded-full">
            !
          </div>
          <h2 className="font-serif font-bold text-2xl tracking-tight text-[#EF4444]">DOSSIER NOT FOUND</h2>
          <p className="text-xs text-[var(--foreground)] opacity-80 leading-relaxed">
            The requested intelligence dossier (<span className="text-[#EF4444] font-bold">{reportId}</span>) could not be found or has expired.
          </p>
          <div className="pt-4">
            <Link
              href="/"
              className="inline-block bg-[var(--accent-color,#3B82F6)] text-white font-bold px-6 py-3 border-2 border-black shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all uppercase tracking-wider text-xs"
            >
              ← RETURN TO SCANNER HOME
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render the full Home interface pre-populated with the fetched Supabase report!
  return <Home initialReport={fetchedReport} />;
}
