import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  // Publishing requires server-side credentials (e.g., GitHub token) and a chosen strategy.
  // This endpoint is intentionally scaffolded and disabled by default.
  const enabled = process.env.ENABLE_CONTENT_PUBLISH === "true";
  if (!enabled) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Publishing is not enabled. Set ENABLE_CONTENT_PUBLISH=true and configure a publish strategy.",
      },
      { status: 501 },
    );
  }

  return NextResponse.json(
    {
      ok: false,
      error:
        "Publish strategy not implemented yet. Implement GitHub/DB/CMS publish as per CONTENT_EDITOR_SPEC.md.",
    },
    { status: 501 },
  );
}

