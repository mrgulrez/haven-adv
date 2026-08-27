import { NextResponse } from "next/server";

type WindowState = { count: number; resetAt: number };

const buckets = new Map<string, WindowState>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

export const PUBLIC_FORM_MAX_BYTES = 16_384;

export function clientAddress(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export function enforcePublicFormLimit(request: Request, form: string): NextResponse | null {
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (Number.isFinite(contentLength) && contentLength > PUBLIC_FORM_MAX_BYTES) {
    return NextResponse.json({ error: "Request is too large" }, { status: 413 });
  }

  const now = Date.now();
  const key = `${form}:${clientAddress(request)}`;
  const current = buckets.get(key);
  const state = !current || current.resetAt <= now
    ? { count: 0, resetAt: now + WINDOW_MS }
    : current;

  state.count += 1;
  buckets.set(key, state);

  if (buckets.size > 1_000) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  if (state.count > MAX_REQUESTS) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again in a few minutes." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((state.resetAt - now) / 1_000)) },
      },
    );
  }

  return null;
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] || character);
}

export function plainTextToHtml(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

export function noStoreJson(body: object, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store");
  return NextResponse.json(body, { ...init, headers });
}
