import { ImageResponse } from "next/og";

export const alt = "Naukri Nigran • AI Anti-Scam OSINT Scanner";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0d0e11",
          padding: "60px 70px",
          fontFamily: "sans-serif",
          color: "#f5f5f7",
          border: "12px solid #22252c",
        }}
      >
        {/* Top Header Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              backgroundColor: "#e11d48",
              color: "#ffffff",
              padding: "8px 18px",
              fontWeight: 900,
              fontSize: "20px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              borderRadius: "4px",
            }}
          >
            NAUKRI NIGRAN
          </div>
          <div
            style={{
              color: "#94a3b8",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            • ANTI-SCAM INTELLIGENCE ENGINE
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "950px" }}>
          <div
            style={{
              fontSize: "56px",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-1px",
              color: "#ffffff",
            }}
          >
            Autonomous AI Job Scam & Phishing Detector
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "#cbd5e1",
              lineHeight: 1.4,
              fontWeight: 400,
            }}
          >
            Instant OSINT verification for WhatsApp recruitment offers, fake virtual internships, and certificate fee traps.
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justify: "space-between",
            width: "100%",
            borderTop: "2px dashed #334155",
            paddingTop: "30px",
          }}
        >
          <div style={{ display: "flex", gap: "24px", fontSize: "18px", fontWeight: 700, color: "#e2e8f0" }}>
            <span>⚡ Multi-Agent OSINT</span>
            <span>🌐 Roman Urdu Support</span>
            <span>🛡️ Live Verification</span>
          </div>
          <div style={{ fontSize: "18px", fontWeight: 800, color: "#f43f5e" }}>
            ENGINEERED BY AHMED HASSAN ↗
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
