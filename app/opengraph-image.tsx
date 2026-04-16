import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NimmMeinAuto – modern · mobil · mühelos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1C1917 0%, #0f0e0c 100%)",
          position: "relative",
          fontFamily: "Arial Black, Arial, sans-serif",
        }}
      >
        {/* Amber top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background:
              "linear-gradient(90deg, transparent 0%, #F59E0B 30%, #F59E0B 70%, transparent 100%)",
          }}
        />

        {/* Corner bracket top-left */}
        <div
          style={{
            position: "absolute",
            top: 72,
            left: 72,
            width: 58,
            height: 58,
            borderTop: "2.5px solid rgba(245,158,11,0.45)",
            borderLeft: "2.5px solid rgba(245,158,11,0.45)",
            display: "flex",
          }}
        />
        {/* Corner bracket top-right */}
        <div
          style={{
            position: "absolute",
            top: 72,
            right: 72,
            width: 58,
            height: 58,
            borderTop: "2.5px solid rgba(245,158,11,0.45)",
            borderRight: "2.5px solid rgba(245,158,11,0.45)",
            display: "flex",
          }}
        />
        {/* Corner bracket bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: 72,
            left: 72,
            width: 58,
            height: 58,
            borderBottom: "2.5px solid rgba(245,158,11,0.45)",
            borderLeft: "2.5px solid rgba(245,158,11,0.45)",
            display: "flex",
          }}
        />
        {/* Corner bracket bottom-right */}
        <div
          style={{
            position: "absolute",
            bottom: 72,
            right: 72,
            width: 58,
            height: 58,
            borderBottom: "2.5px solid rgba(245,158,11,0.45)",
            borderRight: "2.5px solid rgba(245,158,11,0.45)",
            display: "flex",
          }}
        />

        {/* Amber glow */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "25%",
            width: "50%",
            height: "60%",
            background:
              "radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Logo text */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            fontSize: 120,
            fontWeight: 900,
            letterSpacing: "-2px",
            lineHeight: 1,
          }}
        >
          <span style={{ color: "#F5F5F4" }}>nimm</span>
          <span style={{ color: "#F59E0B" }}>mein</span>
          <span style={{ color: "#F5F5F4" }}>auto</span>
        </div>

        {/* Amber underline */}
        <div
          style={{
            width: 560,
            height: 3,
            background: "rgba(245,158,11,0.30)",
            borderRadius: 2,
            marginTop: 12,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 16,
            marginTop: 32,
            fontSize: 22,
            letterSpacing: "7px",
            fontWeight: 400,
          }}
        >
          <span style={{ color: "#78716C" }}>MODERN</span>
          <span style={{ color: "#57534E" }}>·</span>
          <span style={{ color: "#F59E0B" }}>MOBIL</span>
          <span style={{ color: "#57534E" }}>·</span>
          <span style={{ color: "#78716C" }}>MÜHELOS</span>
        </div>

        {/* Separator */}
        <div
          style={{
            position: "absolute",
            bottom: 110,
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, #292524 30%, #292524 70%, transparent 100%)",
            display: "flex",
          }}
        />

        {/* Bottom row: Austrian flag + domain */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
          }}
        >
          {/* Austrian flag */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <div style={{ width: 40, height: 5, background: "#ED2939", borderRadius: 1 }} />
            <div style={{ width: 40, height: 5, background: "#ffffff" }} />
            <div style={{ width: 40, height: 5, background: "#ED2939", borderRadius: 1 }} />
          </div>
          <span
            style={{
              color: "#44403C",
              fontSize: 19,
              letterSpacing: "1px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            nimmmeinauto.at
          </span>
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            fontSize: 15,
            color: "#44403C",
            letterSpacing: "1px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Österreichs schnellste Fahrzeugbewertung – kostenlos &amp; unverbindlich
        </div>
      </div>
    ),
    { ...size }
  );
}
