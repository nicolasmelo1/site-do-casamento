/**
 * Asaas API does not accept to set `http://localhost:3000` as a callback url on the payment creation.
 *
 * Because of that we have created this route (to be used ONLY during development)
 */
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url || "");
  const callbackToRedirectTo = url.searchParams.get("url") as
    | string
    | undefined;

  return new Response(
    callbackToRedirectTo
      ? ""
      : "No url to redirect, set the 'url' query param to redirect to",
    {
      status: 301,
      headers: callbackToRedirectTo
        ? {
            Location: callbackToRedirectTo,
          }
        : undefined,
    }
  );
}
