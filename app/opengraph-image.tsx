import { ImageResponse } from "next/og";

// Build-time-generated 1200×630 social share image (PNG). Uses Latin/brand visuals only
// (no Hebrew → no external font fetch), so it works with `output: export` offline.
export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "בטון פלוס — ניסור בטון וקידוח יהלום";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #1F2A37 0%, #28333F 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        {/* brand mark: blade disc + amber plus */}
        <div
          style={{
            position: "relative",
            width: 160,
            height: 160,
            borderRadius: 9999,
            border: "8px dashed #2563EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <div style={{ position: "absolute", width: 26, height: 110, borderRadius: 8, background: "#F59E0B" }} />
          <div style={{ position: "absolute", width: 110, height: 26, borderRadius: 8, background: "#F59E0B" }} />
        </div>
        <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: -2 }}>BETON PLUS</div>
        <div style={{ fontSize: 36, color: "#F59E0B", marginTop: 8 }}>
          Precision Concrete Cutting &amp; Diamond Drilling
        </div>
        <div style={{ fontSize: 30, color: "rgba(255,255,255,0.75)", marginTop: 28 }}>
          Gush Dan &amp; Center · 055-6601006
        </div>
      </div>
    ),
    size,
  );
}
