import { ImageResponse } from "next/og";

export const alt = "Naukri Nigran • Agentic OSINT Scam Detector";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  // Fetch Playfair Display 900 TTF from JSDelivr Fontsource CDN (100% CORS & Serverless friendly)
  const fontData = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-900-normal.ttf"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#121316",
          color: "#F8FAFC",
          padding: "54px 64px",
          fontFamily: "sans-serif",
          border: "4px solid #28292E",
          boxSizing: "border-box",
        }}
      >
        {/* TOP BRAND BADGE BAR */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div
            style={{
              padding: "8px 20px",
              backgroundColor: "#3B82F6",
              color: "#FFFFFF",
              fontFamily: "monospace",
              fontWeight: 900,
              fontSize: "14px",
              letterSpacing: "2.5px",
              boxShadow: "3px 3px 0px #000000",
              textTransform: "uppercase",
            }}
          >
            AGENTIC OSINT ENGINE
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 22px",
              backgroundColor: "#1A1B20",
              border: "2px solid #28292E",
              boxShadow: "4px 4px 0px #3B82F6",
              fontSize: "14px",
              fontFamily: "monospace",
              fontWeight: 800,
              color: "#F8FAFC",
              letterSpacing: "1px",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "9999px",
                backgroundColor: "#3B82F6",
              }}
            />
            <span>REAL-TIME SCAM INVESTIGATION</span>
          </div>
        </div>

        {/* CENTER MAIN HIGHLIGHT: NAUKRI NIGRAN */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "1050px" }}>
          <div
            style={{
              fontSize: "96px",
              fontWeight: 900,
              fontFamily: '"Playfair Display"',
              letterSpacing: "-2.5px",
              color: "#F8FAFC",
              margin: 0,
              lineHeight: 0.95,
            }}
          >
            Naukri Nigran
          </div>

          <div
            style={{
              fontSize: "26px",
              fontWeight: 900,
              fontFamily: "monospace",
              color: "#3B82F6",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            VERIFY AUTHENTICITY OF JOBS, EMAILS & MESSAGES
          </div>

          <div
            style={{
              fontSize: "24px",
              color: "#94A3B8",
              margin: 0,
              lineHeight: 1.4,
              fontWeight: 500,
              maxWidth: "920px",
              fontFamily: "sans-serif",
            }}
          >
            Autonomous OSINT agent verifying WhatsApp job offers, fake virtual internships, offer letters, and certificate fee traps.
          </div>
        </div>

        {/* BOTTOM INPUT MODES */}
        <div
          style={{
            paddingTop: "24px",
            borderTop: "3px solid #28292E",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            fontFamily: "monospace",
            fontSize: "13px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* Input Chip 1 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 16px",
                backgroundColor: "#1A1B20",
                border: "2px solid #28292E",
                boxShadow: "3px 3px 0px #000000",
              }}
            >
              <div
                style={{
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  padding: "2px 8px",
                  fontSize: "12px",
                  fontWeight: 900,
                }}
              >
                01
              </div>
              <div style={{ color: "#F8FAFC" }}>MESSAGES & ROMAN URDU</div>
            </div>

            {/* Input Chip 2 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 16px",
                backgroundColor: "#1A1B20",
                border: "2px solid #28292E",
                boxShadow: "3px 3px 0px #000000",
              }}
            >
              <div
                style={{
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  padding: "2px 8px",
                  fontSize: "12px",
                  fontWeight: 900,
                }}
              >
                02
              </div>
              <div style={{ color: "#F8FAFC" }}>OFFER LETTERS & PDFS</div>
            </div>

            {/* Input Chip 3 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 16px",
                backgroundColor: "#1A1B20",
                border: "2px solid #28292E",
                boxShadow: "3px 3px 0px #000000",
              }}
            >
              <div
                style={{
                  backgroundColor: "#3B82F6",
                  color: "#FFFFFF",
                  padding: "2px 8px",
                  fontSize: "12px",
                  fontWeight: 900,
                }}
              >
                03
              </div>
              <div style={{ color: "#F8FAFC" }}>VOICE & AUDIO</div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#3B82F6",
              color: "#FFFFFF",
              border: "3px solid #000000",
              boxShadow: "5px 5px 0px #FFFFFF",
              padding: "10px 24px",
              fontFamily: "monospace",
              fontWeight: 900,
              fontSize: "15px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span>ENGINEERED BY AHMED HASSAN</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Playfair Display",
          data: fontData,
          style: "normal",
          weight: 900,
        },
      ],
    }
  );
}
