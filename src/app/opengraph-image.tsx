import { ImageResponse } from "next/og";

export const alt = "Viven Gorantla — AI Systems, Developer Tools & Backend Engineering";
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
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#050608",
          color: "#f4f2ec",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle at 100% 0%, rgba(249, 115, 22, 0.3) 0%, rgba(245, 158, 11, 0.15) 40%, transparent 70%)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              padding: "10px 18px",
              background: "#181B22",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              borderRadius: "8px",
              fontSize: "22px",
              fontWeight: 700,
              color: "#F59E0B",
            }}
          >
            VG
          </div>
          <span
            style={{
              fontSize: "20px",
              letterSpacing: "4px",
              color: "#B7BDC7",
              textTransform: "uppercase",
            }}
          >
            VIVEN GORANTLA · SIGNAL LAB
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              color: "#F4F2EC",
              textTransform: "uppercase",
              maxWidth: "960px",
            }}
          >
            I BUILD SYSTEMS THAT MAKE AI USEFUL.
          </h1>
          <p
            style={{
              fontSize: "28px",
              color: "#B7BDC7",
              lineHeight: 1.4,
              maxWidth: "880px",
            }}
          >
            Student developer exploring agentic AI, developer tools, backend systems and cloud infrastructure.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(183, 189, 199, 0.2)",
            paddingTop: "28px",
            fontSize: "20px",
            color: "#F59E0B",
          }}
        >
          <span>GCET HYDERABAD · B.TECH 2025–2029</span>
          <span>1ST PLACE · BLACKBOX AI 1.0 (IEEE CS)</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
