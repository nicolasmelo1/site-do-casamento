import { NextApiRequest } from "next";

export async function GET(request: NextApiRequest) {
  const url = new URL(request.url || "");
  const callbackToRedirectTo = url.searchParams.get("callbackUrl") as
    | string
    | undefined;

  return new Response(
    callbackToRedirectTo
      ? ""
      : "No url to redirect, set callbackUrl to redirect",
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
