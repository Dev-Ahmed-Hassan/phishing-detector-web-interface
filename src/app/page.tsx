"use client";

import { useState, useEffect, useRef } from "react";
import type { AnalyzeV2Response, Lang } from "@/lib/report-types";
import DossierReport from "@/components/DossierReport";
import InvestigationProgress from "@/components/InvestigationProgress";

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
    settingsTitle: "Settings",
    languageLabel: "Language",
    themeLabel: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    closeBtn: "CLOSE",
    alertError: "An error occurred during analysis. Please try again.",
    alertConnect: "Failed to connect to the investigation server."
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
    settingsTitle: "ترتیبات",
    languageLabel: "زبان",
    themeLabel: "تھیم",
    themeLight: "روشن",
    themeDark: "تاریک",
    closeBtn: "بند کریں",
    alertError: "تجزیہ کے دوران ایک خرابی پیش آگئی۔ دوبارہ کوشش کریں۔",
    alertConnect: "سرور سے جڑنے میں ناکام۔"
  }
};

export default function Home() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [report, setReport] = useState<AnalyzeV2Response | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // State for Settings & Localization
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [language, setLanguage] = useState<Lang>("en");
  const [isDark, setIsDark] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const t = translations[language];
  const isUrdu = language === "ur";

  // Hydrate persistence from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("app_language") as Lang;
    if (savedLang && (savedLang === "en" || savedLang === "ur")) {
      setLanguage(savedLang);
    }

    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

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
    if (!text.trim() && !file) return;

    setIsSubmitting(true);
    setReport(null);
    setNotice(null);
    setError(null);

    const formData = new FormData();
    if (text) formData.append("text", text);
    if (file) formData.append("file", file);
    formData.append("user_id", "web_user_demo");

    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);

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
        setError(t.alertError);
      }
    } catch (err) {
      console.error(err);
      setError(t.alertConnect);
    } finally {
      setIsSubmitting(false);
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
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-[var(--background)] ${isUrdu ? "font-[Noto_Nastaliq_Urdu,serif]" : ""}`}>

      {/* Designed Background Layer */}
      <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] pointer-events-none z-0"></div>

      {/* Main Content */}
      <main className="w-full max-w-2xl brutal-card p-10 z-10 bg-[var(--card-bg)] relative">
        <header className={`mb-10 border-b-2 border-[var(--border-color)] pb-6 ${isUrdu ? "text-right" : "text-left"}`}>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-[var(--foreground)] uppercase">
            {t.title}
          </h1>
          <p className="text-[var(--foreground)] opacity-80 mt-3 text-sm font-medium tracking-wide">
            {t.subtitle}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8" dir={isUrdu ? "rtl" : "ltr"}>
          <div className="space-y-3">
            <label className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider block">
              {t.msgLabel}
            </label>
            <textarea
              className="w-full p-4 brutal-input text-sm resize-none text-[var(--foreground)] placeholder:text-[#888888]"
              rows={4}
              placeholder={t.msgPlaceholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider block">
              {t.evidenceLabel}
            </label>
            <div className="brutal-input p-2 flex items-center">
              <input
                type="file"
                className={`w-full text-sm text-[var(--foreground)] file:py-2 file:px-4 file:rounded-sm file:border-2 file:border-[var(--border-color)] file:text-sm file:font-bold file:bg-[var(--card-bg)] file:text-[var(--foreground)] hover:file:bg-[var(--background)] transition-colors cursor-pointer ${isUrdu ? "file:ml-4" : "file:mr-4"}`}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (!text.trim() && !file)}
            className="w-full py-4 px-6 brutal-btn font-bold text-sm tracking-widest mt-4 uppercase"
          >
            {isSubmitting ? t.btnAnalyze : t.btnScan}
          </button>
        </form>

        <div ref={resultsRef} className="scroll-mt-8">
          {isSubmitting && <InvestigationProgress lang={language} />}

          {notice && !isSubmitting && (
            <div
              className="mt-12 brutal-card p-8 fade-rise"
              style={{ backgroundColor: "var(--v-inc-bg)", color: "var(--v-inc-ink)" }}
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
              className="mt-12 brutal-card p-8 fade-rise"
              style={{ backgroundColor: "var(--v-scam-bg)", color: "var(--v-scam-ink)" }}
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

          {report && !isSubmitting && (
            <>
              <DossierReport data={report} lang={language} />
              <div className={`mt-10 flex ${isUrdu ? "justify-start" : "justify-center"}`}>
                <button onClick={startNewScan} className="py-4 px-8 brutal-btn font-bold text-sm tracking-widest uppercase">
                  {t.newScanBtn}
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Floating Settings Trigger */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 brutal-card bg-[var(--card-bg)] flex items-center justify-center z-40 cursor-pointer hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_var(--shadow-color)] active:translate-y-1 active:translate-x-1 active:shadow-[0px_0px_0px_var(--shadow-color)] transition-all"
        aria-label="Open Settings"
      >
        <svg className="w-6 h-6 text-[var(--foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Settings Side-Panel */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isSettingsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsSettingsOpen(false)}
      >
        <div
          className={`absolute top-0 right-0 h-full w-80 bg-[var(--card-bg)] border-l-4 border-[var(--border-color)] shadow-[-8px_0px_0px_rgba(0,0,0,1)] p-6 transition-transform duration-300 ease-out flex flex-col ${isSettingsOpen ? "translate-x-0" : "translate-x-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-8 border-b-2 border-[var(--border-color)] pb-4">
            <h2 className="text-xl font-bold uppercase tracking-widest text-[var(--foreground)]">{t.settingsTitle}</h2>
            <button onClick={() => setIsSettingsOpen(false)} className="text-[var(--foreground)] hover:opacity-70">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-8 flex-grow">
            {/* Language Selector */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-[var(--foreground)]">{t.languageLabel}</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`flex-1 py-2 font-bold border-2 border-[var(--border-color)] uppercase transition-colors ${language === "en" ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-[var(--card-bg)] text-[var(--foreground)] hover:bg-[var(--background)]"}`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange("ur")}
                  className={`flex-1 py-2 font-bold border-2 border-[var(--border-color)] transition-colors font-[Noto_Nastaliq_Urdu,serif] ${language === "ur" ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-[var(--card-bg)] text-[var(--foreground)] hover:bg-[var(--background)]"}`}
                >
                  اردو
                </button>
              </div>
            </div>

            {/* Theme Selector */}
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-[var(--foreground)]">{t.themeLabel}</label>
              <div className="flex gap-2">
                <button
                  onClick={toggleTheme}
                  disabled={!isDark}
                  className={`flex-1 py-2 font-bold border-2 border-[var(--border-color)] uppercase transition-colors ${!isDark ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-[var(--card-bg)] text-[var(--foreground)] hover:bg-[var(--background)]"}`}
                >
                  {t.themeLight}
                </button>
                <button
                  onClick={toggleTheme}
                  disabled={isDark}
                  className={`flex-1 py-2 font-bold border-2 border-[var(--border-color)] uppercase transition-colors ${isDark ? "bg-[var(--foreground)] text-[var(--background)]" : "bg-[var(--card-bg)] text-[var(--foreground)] hover:bg-[var(--background)]"}`}
                >
                  {t.themeDark}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="w-full py-4 brutal-btn font-bold text-sm tracking-widest uppercase mt-auto"
          >
            {t.closeBtn}
          </button>
        </div>
      </div>

    </div>
  );
}
