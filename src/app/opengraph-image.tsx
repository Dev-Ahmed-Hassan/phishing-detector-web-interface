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
          backgroundColor: "#F5F5F7",
          padding: "42px 58px",
          fontFamily: "sans-serif",
          color: "#09090B",
        }}
      >
        {/* Top Nav Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            backgroundColor: "#FFFFFF",
            border: "3px solid #09090B",
            boxShadow: "5px 5px 0px #09090B",
            padding: "14px 22px",
            marginBottom: "34px",
          }}
        >
          <div
            style={{
              fontSize: "26px",
              fontWeight: 900,
              fontFamily: "serif",
              letterSpacing: "-0.5px",
            }}
          >
            Naukri Nigran
          </div>

          <div
            style={{
              display: "flex",
              gap: "22px",
              fontSize: "13px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.6px",
            }}
          >
            <span>Scanner</span>
            <span>Demo Cases</span>
            <span>WhatsApp Bot</span>
            <span>Extension</span>
            <span>Portfolio ›</span>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <div
              style={{
                border: "2px solid #09090B",
                padding: "7px 12px",
                fontSize: "12px",
                fontWeight: 800,
                backgroundColor: "#FFFFFF",
              }}
            >
              EN
            </div>
            <div
              style={{
                border: "2px solid #09090B",
                padding: "7px 12px",
                fontSize: "12px",
                fontWeight: 800,
                backgroundColor: "#FFFFFF",
              }}
            >
              THEMES
            </div>
            <div
              style={{
                border: "2px solid #09090B",
                padding: "7px 12px",
                fontSize: "12px",
                fontWeight: 800,
                backgroundColor: "#FFFFFF",
              }}
            >
              ☾
            </div>
          </div>
        </div>

        {/* Hero Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "6px" }}>
          <div
            style={{
              fontSize: "54px",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-1.5px",
              fontFamily: "serif",
              color: "#09090B",
            }}
          >
            VERIFY AUTHENTICITY
          </div>
          <div
            style={{
              fontSize: "21px",
              color: "#3F3F46",
              lineHeight: 1.4,
              fontWeight: 500,
              maxWidth: "720px",
            }}
          >
            Paste a suspicious message or upload a screenshot for editorial-grade analysis.
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "3px",
            backgroundColor: "#09090B",
            width: "100%",
            margin: "22px 0 20px 0",
          }}
        />

        {/* Form UI */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Message Content
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "3px solid #09090B",
              boxShadow: "5px 5px 0px #09090B",
              padding: "18px 22px",
              fontSize: "18px",
              color: "#A1A1AA",
              minHeight: "72px",
              display: "flex",
              alignItems: "center",
            }}
          >
            Paste the suspicious text here...
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "4px",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Evidence (Screenshot / Audio)
            </div>
            <div style={{ fontSize: "13px", color: "#71717A", fontWeight: 700 }}>
              (0 / 3 FILES)
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#FFFFFF",
              border: "3px solid #09090B",
              boxShadow: "5px 5px 0px #09090B",
              padding: "14px 20px",
              fontSize: "16px",
              color: "#71717A",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                border: "2px solid #09090B",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 800,
                backgroundColor: "#FFFFFF",
              }}
            >
              Choose Files
            </div>
            <span>No file chosen</span>
          </div>

          <div
            style={{
              backgroundColor: "#0077B6",
              color: "#FFFFFF",
              border: "3px solid #09090B",
              boxShadow: "5px 5px 0px #09090B",
              padding: "18px",
              textAlign: "center",
              fontSize: "19px",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginTop: "6px",
            }}
          >
            Scan For Scams
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
