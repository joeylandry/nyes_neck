import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/products";
import { findUnavailableCartLines } from "@/lib/variantAvailability";

export const runtime = "nodejs";

const MAX_LINES = 100;

/**
 * Checks cart lines saved in a visitor's browser against the current catalog,
 * so items that were added before they sold out (or were hidden) are caught
 * before checkout instead of failing there.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ unavailable: [] }, { status: 400 });
  }
  const rawLines = (body as { lines?: unknown })?.lines;
  const lines = (Array.isArray(rawLines) ? rawLines : []).slice(0, MAX_LINES).flatMap((line) => {
    const { id, productId } = (line ?? {}) as { id?: unknown; productId?: unknown };
    return typeof id === "string" && typeof productId === "string" ? [{ id, productId }] : [];
  });
  if (!lines.length) return NextResponse.json({ unavailable: [] });

  const unavailable = findUnavailableCartLines(await getProducts(), lines);
  return NextResponse.json({ unavailable }, { headers: { "Cache-Control": "no-store" } });
}
