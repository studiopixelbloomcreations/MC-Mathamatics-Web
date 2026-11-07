import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MC Mathematics | Maths is the question. MC is the answer.";
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
          background: "#070A13",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Glow ambient background circles */}
        <div
          style={{
            position: "absolute",
            top: "-15%",
            right: "-10%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "rgba(108, 92, 231, 0.35)",
            filter: "blur(120px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-15%",
            left: "-5%",
            width: "450px",
            height: "450px",
            borderRadius: "50%",
            background: "rgba(255, 200, 87, 0.25)",
            filter: "blur(140px)",
          }}
        />

        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              background: "#0E1424",
              border: "2px solid rgba(255, 200, 87, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              fontWeight: 900,
              color: "#FFC857",
            }}
          >
            MC
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "24px", fontWeight: "bold", color: "#F2F4FA" }}>
              MC Mathematics
            </span>
            <span style={{ fontSize: "14px", color: "#8B93A8", letterSpacing: "2px" }}>
              KURUNEGALA, SRI LANKA
            </span>
          </div>
        </div>

        {/* Hero Slogan */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "64px", fontWeight: 900, color: "#F2F4FA", lineHeight: 1.1 }}>
            Maths is the question.
          </div>
          <div style={{ fontSize: "68px", fontWeight: 900, color: "#FFC857", fontStyle: "italic", lineHeight: 1.1 }}>
            MC is the answer.
          </div>
        </div>

        {/* Bottom Credits & Highlights */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px",
          }}
        >
          <div style={{ fontSize: "18px", color: "#8B93A8" }}>
            Malinga C Dissanayake · O/L &amp; A/L Combined Maths
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#2DD4A0",
              background: "rgba(45, 212, 160, 0.1)",
              border: "1px solid rgba(45, 212, 160, 0.3)",
              padding: "8px 16px",
              borderRadius: "999px",
            }}
          >
            Free WhatsApp Diagnostic Reports
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
