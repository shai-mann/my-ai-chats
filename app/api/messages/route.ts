import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const conversationId = searchParams.get("conversation_id");

  if (!conversationId) {
    return NextResponse.json(
      { error: "Conversation ID is required" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `${API_URL}/api/messages?conversation_id=${conversationId}`
  );
  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const conversationId = searchParams.get("conversation_id");

  if (!conversationId) {
    return NextResponse.json(
      { error: "Conversation ID is required" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const response = await fetch(
    `${API_URL}/api/messages?conversation_id=${conversationId}`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return NextResponse.json(data);
}
