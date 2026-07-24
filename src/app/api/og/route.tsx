import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "VersaVid";
  const description = searchParams.get("description") || "AI Video Studio for YouTube Creators";
  const type = searchParams.get("type") || "default";

  const backgrounds: Record<string, string> = {
    default: "linear-gradient(135deg, #06b6d4 0%, #e879f9 100%)",
    pricing: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    features: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    blog: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    compare: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  };

  const bg = backgrounds[type] || backgrounds.default;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="7" fill="#000" stroke="rgba(255,255,255,0.2)" />
              <path d="M12 9 L22 16 L12 23 Z" fill="#fff" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "white",
              letterSpacing: "-0.5px",
            }}
          >
            VersaVid
          </span>
        </div>

        <h1
          style={{
            fontSize: "64px",
            fontWeight: "800",
            color: "white",
            textAlign: "center",
            lineHeight: "1.1",
            maxWidth: "900px",
            marginBottom: "24px",
            textShadow: "0 4px 24px rgba(0,0,0,0.3)",
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.9)",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: "1.4",
            fontWeight: "400",
          }}
        >
          {description}
        </p>

        <div
          style={{
            marginTop: "48px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "rgba(255,255,255,0.7)",
            fontSize: "20px",
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#06b6d4" }} />
          <span>AI Video Studio for YouTube Creators</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}