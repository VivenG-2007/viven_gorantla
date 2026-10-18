import React from "react";
import Link from "next/link";
import { ArrowLeft, Radio } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        background: "var(--c-bg)",
        position: "relative",
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.4rem 0.8rem",
          background: "rgba(244, 114, 208, 0.1)",
          border: "1px solid rgba(244, 114, 208, 0.3)",
          borderRadius: "9999px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          color: "var(--c-magenta)",
          marginBottom: "1.5rem",
        }}
      >
        <Radio size={14} />
        <span>SIGNAL LOSS 404: PACKET UNROUTABLE</span>
      </div>

      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(3rem, 10vw, 8rem)",
          fontWeight: 800,
          color: "var(--c-text)",
          lineHeight: 1,
          marginBottom: "1rem",
        }}
      >
        404
      </h1>

      <p
        style={{
          fontSize: "1.125rem",
          color: "var(--c-text-dim)",
          maxWidth: "540px",
          lineHeight: 1.6,
          marginBottom: "2.5rem",
        }}
      >
        The requested endpoint does not map to any active telemetry route or case study in the signal registry.
      </p>

      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.875rem 1.75rem",
          background: "var(--c-cyan)",
          color: "#050608",
          borderRadius: "4px",
          fontFamily: "var(--font-mono)",
          fontSize: "0.875rem",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        <ArrowLeft size={16} />
        <span>RETURN TO SIGNAL BASE</span>
      </Link>
    </div>
  );
}
