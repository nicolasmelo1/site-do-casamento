import type { NextRequest } from "next/server";

export default function GET(request: NextRequest) {
  const url = new URL(request.url || "");
  console.log(url);

  return new Response("ok", { status: 200 });
}
