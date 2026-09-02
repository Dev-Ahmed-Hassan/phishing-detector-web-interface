import { ImageResponse } from "next/og";

export const alt = "Naukri Nigran • Agentic OSINT Scam Detector";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  // Fetch Playfair Display (for main title), Inter (for subtext), and JetBrains Mono (for tagline) from JSDelivr
  const [playfairFont, interFont, monoFont] = await Promise.all([
    fetch("https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-900-normal.ttf").then((res) =>
      res.arrayBuffer()
    ),
    fetch("https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-600-normal.ttf").then((res) =>
      res.arrayBuffer()
    ),
    fetch("https://cdn.jsdelivr.net/fontsource/fonts/jetbrains-mono@latest/latin-800-normal.ttf").then((res) =>
      res.arrayBuffer()
    ),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#0F0F12",
          color: "#FAFAFA",
          padding: "76px 88px",
          fontFamily: '"Inter", sans-serif',
          border: "4px solid #27272A",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* CORNER FRAME BRACKETS (TACTICAL AMBER GOLD) */}
        <div
          style={{
            position: "absolute",
            top: "36px",
            left: "36px",
            width: "36px",
            height: "36px",
            borderLeft: "4px solid #F59E0B",
            borderTop: "4px solid #F59E0B",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "36px",
            right: "36px",
            width: "36px",
            height: "36px",
            borderRight: "4px solid #F59E0B",
            borderTop: "4px solid #F59E0B",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "36px",
            left: "36px",
            width: "36px",
            height: "36px",
            borderLeft: "4px solid #F59E0B",
            borderBottom: "4px solid #F59E0B",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "36px",
            right: "36px",
            width: "36px",
            height: "36px",
            borderRight: "4px solid #F59E0B",
            borderBottom: "4px solid #F59E0B",
          }}
        />

        {/* CENTER PURE CONTENT CORE */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "28px",
            width: "100%",
            maxWidth: "1040px",
          }}
        >
          {/* Main Title */}
          <div
            style={{
              fontSize: "128px",
              fontWeight: 900,
              fontFamily: '"Playfair Display", serif',
              letterSpacing: "-3px",
              color: "#FAFAFA",
              margin: 0,
              lineHeight: 0.95,
            }}
          >
            Naukri Nigran
          </div>

          {/* Primary Tagline (Tactical Amber Gold) */}
          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
              fontFamily: '"JetBrains Mono", monospace',
              color: "#F59E0B",
              letterSpacing: "2px",
              textTransform: "uppercase",
              lineHeight: 1.25,
            }}
          >
            VERIFY AUTHENTICITY OF JOBS, EMAILS & MESSAGES
          </div>

          {/* Sub-Tagline Description */}
          <div
            style={{
              fontSize: "25px",
              color: "#A1A1AA",
              margin: 0,
              lineHeight: 1.5,
              fontWeight: 500,
              maxWidth: "960px",
              fontFamily: '"Inter", sans-serif',
            }}
          >
            Autonomous OSINT agent verifying WhatsApp job offers, fake virtual internships, offer letters, and certificate fee traps.
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interFont,
          style: "normal",
          weight: 600,
        },
        {
          name: "JetBrains Mono",
          data: monoFont,
          style: "normal",
          weight: 800,
        },
        {
          name: "Playfair Display",
          data: playfairFont,
          style: "normal",
          weight: 900,
        },
      ],
    }
  );
}
