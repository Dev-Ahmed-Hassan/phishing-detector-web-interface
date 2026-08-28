"use client";

import { useState, useEffect } from "react";

const translations = {
  en: {
    title: "Verify Authenticity",
    subtitle: "Paste a suspicious message or upload a screenshot for editorial-grade analysis.",
    msgLabel: "Message Content",
    msgPlaceholder: "Paste the suspicious text here...",
    evidenceLabel: "Evidence (Screenshot / Audio)",
    btnAnalyze: "ANALYZING...",
    btnScan: "SCAN FOR SCAMS",
    riskTitle: "Risk Assessment",
    aiConfidence: "AI Confidence",
    analysisTitle: "Analysis",
    suspiciousLinksTitle: "Suspicious Links",
    actionTitle: "Action Required",
    sourcesTitle: "Sources & Evidence",
    settingsTitle: "Settings",
    languageLabel: "Language",
    themeLabel: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    closeBtn: "CLOSE",
    alertError: "An error occurred during analysis.",
    alertConnect: "Failed to connect to the server."
  },
  ur: {
    title: "تصدیق کریں",
    subtitle: "مشکوک پیغام پیسٹ کریں یا اعلیٰ معیار کے تجزیہ کے لیے اسکرین شاٹ اپ لوڈ کریں۔",
    msgLabel: "پیغام کا مواد",
    msgPlaceholder: "مشکوک متن یہاں پیسٹ کریں...",
    evidenceLabel: "ثبوت (اسکرین شاٹ / آڈیو)",
    btnAnalyze: "...تجزیہ جاری ہے",
    btnScan: "اسکیم اسکین کریں",
    riskTitle: "خطرے کی تشخیص",
    aiConfidence: "اے آئی کا اعتماد",
    analysisTitle: "تجزیہ",
    suspiciousLinksTitle: "مشکوک لنکس",
    actionTitle: "مطلوبہ کارروائی",
    sourcesTitle: "ذرائع اور ثبوت",
    settingsTitle: "ترتیبات",
    languageLabel: "زبان",
    themeLabel: "تھیم",
    themeLight: "روشن",
    themeDark: "تاریک",
    closeBtn: "بند کریں",
    alertError: "تجزیہ کے دوران ایک خرابی پیش آگئی۔",
    alertConnect: "سرور سے جڑنے میں ناکام۔"
  }
};

type Language = 'en' | 'ur';

export default function Home() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [report, setReport] = useState<any>(null);
  
  // State for Settings & Localization
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [isDark, setIsDark] = useState(false);

  // Hydrate persistence from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ur')) {
      setLanguage(savedLang);
    }
    
    // Read theme class from HTML element (set by toggleTheme earlier, or detect preference)
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app_language', lang);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    setIsSubmitting(true);
    setReport(null);

    const formData = new FormData();
    if (text) formData.append("text", text);
    if (file) formData.append("file", file);
    formData.append("user_id", "web_user_demo"); 

    try {
      const response = await fetch("/api/analyze-web", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      if (data.status === "success") {
        setReport(data.report);
      } else {
        alert(t.alertError);
      }
    } catch (error) {
      console.error(error);
      alert(t.alertConnect);
    } finally {
      setIsSubmitting(false);
    }
  };

  const t = translations[language];
  const isUrdu = language === 'ur';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-[var(--background)] ${isUrdu ? 'font-[Noto_Nastaliq_Urdu,serif]' : ''}`}>
      
      {/* Designed Background Layer */}
      <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)_100%)] pointer-events-none z-0"></div>

      {/* Main Content */}
      <main className="w-full max-w-2xl brutal-card p-10 z-10 bg-[var(--card-bg)] relative">
        <header className={`mb-10 border-b-2 border-[var(--border-color)] pb-6 ${isUrdu ? 'text-right' : 'text-left'}`}>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-[var(--foreground)] uppercase">
            {t.title}
          </h1>
          <p className="text-[var(--foreground)] opacity-80 mt-3 text-sm font-medium tracking-wide">
            {t.subtitle}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8" dir={isUrdu ? 'rtl' : 'ltr'}>
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
                className={`w-full text-sm text-[var(--foreground)] file:py-2 file:px-4 file:rounded-sm file:border-2 file:border-[var(--border-color)] file:text-sm file:font-bold file:bg-[var(--card-bg)] file:text-[var(--foreground)] hover:file:bg-[var(--background)] transition-colors cursor-pointer ${isUrdu ? 'file:ml-4' : 'file:mr-4'}`}
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

        {report && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500" dir={isUrdu ? 'rtl' : 'ltr'}>
            <div className="brutal-card p-8" style={{ backgroundColor: report.risk_level.toLowerCase() === 'high' ? '#f5d5d5' : report.risk_level.toLowerCase() === 'medium' ? '#f5e8ba' : '#d5ebd8', borderColor: 'var(--border-color)', color: 'var(--foreground)' }}>
              <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-[var(--border-color)]">
                <div>
                  <h3 className="text-xl font-serif font-bold uppercase tracking-widest text-[#2d2a26]">
                    {t.riskTitle}
                  </h3>
                  {report.confidence_score !== undefined && (
                    <p className="text-sm font-bold text-[#2d2a26] opacity-70 mt-1">
                      {t.aiConfidence}: {report.confidence_score}%
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
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#2d2a26] mb-2">{t.analysisTitle}</h4>
                  <p className="text-[#2d2a26] text-sm leading-relaxed font-medium font-serif">{report.specific_analysis}</p>
                </div>

                {report.detected_urls && report.detected_urls.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-[#2d2a26] mb-2">{t.suspiciousLinksTitle}</h4>
                    <ul className="list-disc list-inside space-y-1" dir="ltr">
                      {report.detected_urls.map((url: string, i: number) => (
                        <li key={i} className={`text-[#2d2a26] text-sm font-bold break-all ${isUrdu ? 'text-right' : 'text-left'}`}>
                          {url}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-[#2d2a26] mb-2">{t.actionTitle}</h4>
                  <p className="text-[var(--foreground)] text-sm leading-relaxed font-bold bg-[var(--card-bg)] p-3 border-2 border-[var(--border-color)] inline-block">{report.recommended_action}</p>
                </div>

                {report.sources && report.sources.length > 0 && (
                  <div className="mt-6 pt-6 border-t-2 border-[var(--border-color)]">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-[#2d2a26] mb-2">{t.sourcesTitle}</h4>
                    <ul className="list-disc list-inside space-y-2" dir="ltr">
                      {report.sources.map((url: string, i: number) => (
                        <li key={i} className={`text-[#2d2a26] text-sm font-bold break-all ${isUrdu ? 'text-right' : 'text-left'}`}>
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
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${isSettingsOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSettingsOpen(false)}
      >
        <div 
          className={`absolute top-0 right-0 h-full w-80 bg-[var(--card-bg)] border-l-4 border-[var(--border-color)] shadow-[-8px_0px_0px_rgba(0,0,0,1)] p-6 transition-transform duration-300 ease-out flex flex-col ${isSettingsOpen ? 'translate-x-0' : 'translate-x-full'}`}
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
                  onClick={() => handleLanguageChange('en')}
                  className={`flex-1 py-2 font-bold border-2 border-[var(--border-color)] uppercase transition-colors ${language === 'en' ? 'bg-[var(--foreground)] text-[var(--background)]' : 'bg-[var(--card-bg)] text-[var(--foreground)] hover:bg-[var(--background)]'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => handleLanguageChange('ur')}
                  className={`flex-1 py-2 font-bold border-2 border-[var(--border-color)] transition-colors font-[Noto_Nastaliq_Urdu,serif] ${language === 'ur' ? 'bg-[var(--foreground)] text-[var(--background)]' : 'bg-[var(--card-bg)] text-[var(--foreground)] hover:bg-[var(--background)]'}`}
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
                  className={`flex-1 py-2 font-bold border-2 border-[var(--border-color)] uppercase transition-colors ${!isDark ? 'bg-[var(--foreground)] text-[var(--background)]' : 'bg-[var(--card-bg)] text-[var(--foreground)] hover:bg-[var(--background)]'}`}
                >
                  {t.themeLight}
                </button>
                <button 
                  onClick={toggleTheme}
                  disabled={isDark}
                  className={`flex-1 py-2 font-bold border-2 border-[var(--border-color)] uppercase transition-colors ${isDark ? 'bg-[var(--foreground)] text-[var(--background)]' : 'bg-[var(--card-bg)] text-[var(--foreground)] hover:bg-[var(--background)]'}`}
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
