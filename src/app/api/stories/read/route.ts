
import { getStories } from "../../../../server/stories";

const INSTAGRAM_STORIES_HOST = process.env.INSTAGRAM_STORIES_HOST || 'http://localhost:3001';
export async function GET() {
  const story = await getStories();
  
  if (story.length > 0) {
    return Response.json({
      storyUri: INSTAGRAM_STORIES_HOST
    })
  }

  return Response.json({
    success: true,
    story: story[0]
  })
}
