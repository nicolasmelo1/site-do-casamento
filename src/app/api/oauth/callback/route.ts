import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url || "");

  const response = await fetch("https://api.instagram.com/oauth/access_token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: "346745791732892",
      redirect_uri: "https://www.vivianeenicolas.com.br/api/dev/oauth/callback",
      client_secret: "552f16f6ec6a71ad304e2d337d877961",
      grant_type: "authorization_code",
      code: url.searchParams.get("code") as string,
    }),
  });

  const data = await response.json();
  console.log(data);

  const userId = data.user_id;
  const accessToken = data.access_token;

  const searchParams = new URLSearchParams({
    fields: "media_url,media_type,is_shared_to_feed",
    access_token: accessToken,
  });
  const storiesResponse = await fetch(
    `https://graph.instagram.com/${userId}/media?${searchParams.toString()}`
  );

  const storiesData = await storiesResponse.json();
  console.log(storiesData);
  return new Response("ok", { status: 200 });
}
