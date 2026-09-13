"use client";

import React from "react";

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPalette: string;
  onSelectPalette: (p: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  t?: any;
}

export default function ThemeSettingsModal({
  isOpen,
  onClose,
  currentPalette,
  onSelectPalette,
  isDark,
  onToggleTheme,
  t,
}: ThemeSettingsModalProps) {
  if (!isOpen) return null;

  const defaultT = {
    settingsTitle: "Display & Theme Preferences",
    appearanceMode: "Appearance Mode",
    colorPalette: "Color Palette & Paper Texture",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    doneBtn: "Done",
  };

  const modalT = t || defaultT;

  const palettes = [
    { id: "nordic", name: "Nordic Silk & Slate", desc: "Minimalist silk paper with royal slate blue accents", dot: "#2563EB" },
    { id: "sand", name: "Archival Linen & Crimson", desc: "Warm book paper & sepia ink with crimson stamp accents", dot: "#991B1B" },
    { id: "washi", name: "Japanese Washi & Sumi", desc: "Off-white washi paper with Sumi charcoal & bronze accents", dot: "#D97706" },
    { id: "gunmetal", name: "Tactical Platinum & Cyan", desc: "Platinum slate paper with phosphor cyan accents", dot: "#0EA5E9" },
    { id: "amber", name: "Tactical Amber", desc: "Warm alabaster & deep obsidian with gold amber accents", dot: "#F59E0B" },
    { id: "mono", name: "Mono Brutalist", desc: "Pure high-contrast stark monochrome", dot: "#09090B" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-[var(--card-bg)] text-[var(--foreground)] border-2 border-[var(--border-color)] p-6 space-y-6 rounded-lg shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-[var(--border-color)]/30 pb-4">
          <div>
            <h3 className="font-serif font-bold text-xl text-[var(--foreground)] tracking-tight">
              {modalT.settingsTitle}
            </h3>
            <p className="text-xs text-[var(--foreground)] opacity-60 font-sans mt-0.5">
              Customize appearance mode and color palette
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center font-sans font-semibold text-sm border border-[var(--border-color)]/40 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] opacity-60 font-sans">
            {modalT.appearanceMode}
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                if (isDark) onToggleTheme();
              }}
              className={`p-3 rounded-md border-2 font-sans text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                !isDark
                  ? "bg-[var(--accent-color)] text-[var(--accent-text)] border-[var(--accent-color)] shadow-sm"
                  : "bg-[var(--background)] text-[var(--foreground)] border-[var(--border-color)]/30 opacity-70 hover:opacity-100"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
              </svg>
              <span>{modalT.lightMode}</span>
            </button>
            <button
              onClick={() => {
                if (!isDark) onToggleTheme();
              }}
              className={`p-3 rounded-md border-2 font-sans text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isDark
                  ? "bg-[var(--accent-color)] text-[var(--accent-text)] border-[var(--accent-color)] shadow-sm"
                  : "bg-[var(--background)] text-[var(--foreground)] border-[var(--border-color)]/30 opacity-70 hover:opacity-100"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <span>{modalT.darkMode}</span>
            </button>
          </div>
        </div>

        <div className="space-y-2.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] opacity-60 font-sans">
            {modalT.colorPalette}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1">
            {palettes.map((p) => {
              const isActive = currentPalette === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPalette(p.id)}
                  className={`p-3.5 rounded-md border-2 text-left transition-all cursor-pointer space-y-1 ${
                    isActive
                      ? "border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-[var(--foreground)] shadow-xs"
                      : "border-[var(--border-color)]/30 bg-[var(--background)] text-[var(--foreground)] opacity-80 hover:opacity-100 hover:border-[var(--border-color)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border border-black/20 shrink-0" style={{ backgroundColor: p.dot }} />
                    <span className="font-serif font-bold text-sm leading-none">{p.name}</span>
                  </div>
                  <p className="text-[11px] opacity-75 font-sans leading-tight pl-5">{p.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-[var(--border-color)]/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-md font-sans text-xs font-bold uppercase tracking-wider bg-[var(--accent-color)] text-[var(--accent-text)] cursor-pointer hover:opacity-90 transition-opacity shadow-xs"
          >
            {modalT.doneBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
