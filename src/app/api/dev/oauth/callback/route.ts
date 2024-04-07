import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url || "");

  const newUrlToCall = new URL("http://localhost:3000/api/oauth/callback");
  const searchParamEntries = Array.from(url.searchParams.entries());
  for (const [key, value] of searchParamEntries)
    newUrlToCall.searchParams.append(key, value);

  const headers = { Location: newUrlToCall.href };

  return new Response("", {
    status: 301,
    headers,
  });
}
