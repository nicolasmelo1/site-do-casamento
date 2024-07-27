
import { NextRequest } from "next/server";

const INSTAGRAM_STORIES_HOST = process.env.INSTAGRAM_STORIES_HOST || 'http://localhost:3001';

export async function GET(request: NextRequest, { params }: { params: { fileName: string }}) {  
    
    return Response.redirect(`${INSTAGRAM_STORIES_HOST}/get-stories/${params.fileName}`)
}
    