"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import DossierPDF from "./pdf/DossierPDF";
import { buildShareUrl } from "@/lib/share-report";
import type { AnalyzeV2Response } from "@/lib/report-types";

interface ReportActionsProps {
  data: AnalyzeV2Response;
  t: Record<string, any>;
}

function slugifyEntity(name?: string) {
  if (!name) return "unknown";
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export default function ReportActions({ data, t }: ReportActionsProps) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    if (!data.report) return;
    setDownloading(true);
    try {
      const entity = data.report.metadata.target_entity || "investigation";
      const date = new Date().toISOString().slice(0, 10);
      const filename = `naukri-nigran-report-${slugifyEntity(entity)}-${date}.pdf`;
      const blob = await pdf(<DossierPDF data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const url = buildShareUrl(data);
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select text manually if clipboard fails.
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 fade-rise">
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="py-3 px-5 brutal-btn font-bold text-xs tracking-widest uppercase inline-flex items-center gap-2"
      >
        {downloading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            BUILDING PDF...
          </>
        ) : (
          <>
            <span>↓</span>
            DOWNLOAD PDF REPORT
          </>
        )}
      </button>

      <button
        onClick={handleShare}
        className="py-3 px-5 brutal-btn font-bold text-xs tracking-widest uppercase inline-flex items-center gap-2"
      >
        <span>{copied ? "✓" : "↗"}</span>
        {copied ? "LINK COPIED" : "COPY SHARE LINK"}
      </button>
    </div>
  );
}
