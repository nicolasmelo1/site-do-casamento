
import { getStories } from "../../../../server/stories";

const INSTAGRAM_STORIES_HOST = process.env.APP_URL || 'http://localhost:3000';
export async function GET() {
  const story = await getStories();
  
  if (story.length > 0) {
    return Response.json({
      storyUri: `${INSTAGRAM_STORIES_HOST}/get-story/${story[0].fileName}`
    })
  }

  return Response.json({
    success: true,
    story: story[0]
  })
}
