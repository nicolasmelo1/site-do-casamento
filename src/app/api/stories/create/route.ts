
import type { NextRequest } from "next/server";
import { saveStory } from "../../../../server/stories";

export async function POST(request: NextRequest) {
  const data = await request.json();

  await saveStory(data.fileName);
  return Response.json({
    success: true
  })
}