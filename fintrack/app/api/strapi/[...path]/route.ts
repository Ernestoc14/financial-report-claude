import { NextRequest, NextResponse } from "next/server";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

async function proxy(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  method: string
) {
  const { path } = await context.params;
  const url = `${STRAPI_URL}/api/${path.join("/")}${req.nextUrl.search}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const auth = req.headers.get("authorization");
  if (auth) headers["Authorization"] = auth;

  const body =
    method !== "GET" && method !== "DELETE" ? await req.text() : undefined;

  const res = await fetch(url, { method, headers, body });
  const data = await res.json().catch(() => null);

  return NextResponse.json(data, { status: res.status });
}

export function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx, "GET");
}
export function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx, "POST");
}
export function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx, "PUT");
}
export function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  return proxy(req, ctx, "DELETE");
}
