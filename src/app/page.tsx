"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    setIsSubmitting(true);
    setReport(null);

    const formData = new FormData();
    if (text) formData.append("text", text);
    if (file) formData.append("file", file);
    formData.append("user_id", "web_user_demo"); // Placeholder ID for the prototype

    try {
      const response = await fetch("/api/analyze-web", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      if (data.status === "success") {
        setReport(data.report);
      } else {
        alert("An error occurred during analysis.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTheme = () => {
    // Check for View Transitions API support
    if (!document.startViewTransition) {
      document.documentElement.classList.toggle("dark");
      return;
    }

    document.startViewTransition(() => {
      document.documentElement.classList.toggle("dark");
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-[var(--background)]">
      
      {/* Designed Background Layer */}
      <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] pointer-events-none z-0"></div>

      <main className="w-full max-w-2xl brutal-card p-10 z-10 bg-[var(--card-bg)] relative">
        
        <header className="mb-10 border-b-2 border-[var(--border-color)] pb-6">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-[var(--foreground)] uppercase">
            Verify Authenticity
          </h1>
          <p className="text-[var(--foreground)] opacity-80 mt-3 text-sm font-medium tracking-wide">
            Paste a suspicious message or upload a screenshot for editorial-grade analysis.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">
              Message Content
            </label>
            <textarea
              className="w-full p-4 brutal-input text-sm resize-none text-[var(--foreground)] placeholder:text-[#888888]"
              rows={4}
              placeholder="Paste the suspicious text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider">
              Evidence (Screenshot / Audio)
            </label>
            <div className="brutal-input p-2 flex items-center">
              <input
                type="file"
                className="w-full text-sm text-[var(--foreground)] file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-2 file:border-[var(--border-color)] file:text-sm file:font-bold file:bg-[var(--card-bg)] file:text-[var(--foreground)] hover:file:bg-[var(--background)] transition-colors cursor-pointer"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (!text.trim() && !file)}
            className="w-full py-4 px-6 brutal-btn font-bold text-sm tracking-widest mt-4"
          >
            {isSubmitting ? "ANALYZING..." : "SCAN FOR SCAMS"}
          </button>
        </form>

        {report && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="brutal-card p-8" style={{ backgroundColor: report.risk_level.toLowerCase() === 'high' ? '#f5d5d5' : report.risk_level.toLowerCase() === 'medium' ? '#f5e8ba' : '#d5ebd8', borderColor: 'var(--border-color)', color: 'var(--foreground)' }}>
              <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-[var(--border-color)]">
                <div>
                  <h3 className="text-xl font-serif font-bold uppercase tracking-widest text-[#2d2a26]">
                    Risk Assessment
                  </h3>
                  {report.confidence_score !== undefined && (
                    <p className="text-sm font-bold text-[#2d2a26] opacity-70 mt-1">
                      AI Confidence: {report.confidence_score}%
                    </p>
                  )}
                </div>
                <span className="px-4 py-1.5 border-2 border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--foreground)] font-bold text-xs uppercase tracking-widest">
                  {report.risk_level}
                </span>
              </div>

              {report.threat_vectors && report.threat_vectors.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {report.threat_vectors.map((vector: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-[#2d2a26] text-[#faf8f5] text-xs font-bold uppercase tracking-wider border-2 border-[#2d2a26]">
                      {vector}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#2d2a26] mb-2">Analysis</h4>
                  <p className="text-[#2d2a26] text-sm leading-relaxed font-medium font-serif">{report.specific_analysis}</p>
                </div>

                {report.detected_urls && report.detected_urls.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-[#2d2a26] mb-2">Suspicious Links</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {report.detected_urls.map((url: string, i: number) => (
                        <li key={i} className="text-[#2d2a26] text-sm font-bold break-all">
                          {url}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#2d2a26] mb-2">Action Required</h4>
                  <p className="text-[var(--foreground)] text-sm leading-relaxed font-bold bg-[var(--card-bg)] p-3 border-2 border-[var(--border-color)] inline-block">{report.recommended_action}</p>
                </div>

                {report.sources && report.sources.length > 0 && (
                  <div className="mt-6 pt-6 border-t-2 border-[var(--border-color)]">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-[#2d2a26] mb-2">Sources & Evidence</h4>
                    <ul className="list-disc list-inside space-y-2">
                      {report.sources.map((url: string, i: number) => (
                        <li key={i} className="text-[#2d2a26] text-sm font-bold break-all">
                          <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-600 transition-colors">
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Floating Theme Toggle */}
      <button 
        onClick={toggleTheme}
        className="fixed bottom-8 right-8 w-14 h-14 brutal-card bg-[var(--card-bg)] flex items-center justify-center z-50 cursor-pointer hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_var(--shadow-color)] active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_var(--shadow-color)] transition-all"
        aria-label="Toggle Theme"
      >
        <div className="relative w-6 h-6">
          {/* Sun Icon */}
          <svg className="w-6 h-6 text-[var(--foreground)] absolute inset-0 icon-sun" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          {/* Moon Icon */}
          <svg className="w-6 h-6 text-[var(--foreground)] absolute inset-0 icon-moon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </div>
      </button>

    </div>
  );
}
