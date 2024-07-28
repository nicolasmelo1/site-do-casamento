
import { getStories } from "../../../../server/stories";

export const dynamic = 'force-dynamic'
export const revalidate = 0;

const APP_HOST = process.env.APP_URL || 'http://localhost:3000';
export async function GET() {
  const story = await getStories();
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store')

  if (story.length > 0) {
    return Response.json({
      storyUri: `${APP_HOST}/api/stories/get-story/${story[0].fileName}`
    }, { headers })
  }

  return Response.json({
    success: true,
  })
}
