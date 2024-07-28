
import { NextRequest, NextResponse } from "next/server";

const INSTAGRAM_STORIES_HOST = process.env.INSTAGRAM_STORIES_HOST || 'http://localhost:3001';

export const dynamic = 'force-dynamic'
export const revalidate = 0;

export async function GET(request: NextRequest, { params }: { params: { fileName: string }}) {  
    const res = await fetch(`${INSTAGRAM_STORIES_HOST}/get-stories/${params.fileName}`);
    const blob = await res.blob();
    const headers = new Headers();
    headers.set('Cache-Control', 'no-store')
    headers.set("Content-Type", "image/*");
    return new NextResponse(blob, { status: 200, statusText: "OK", headers });
}
    