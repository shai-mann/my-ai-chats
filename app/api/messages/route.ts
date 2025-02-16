import { NextRequest, NextResponse } from "next/server";
import { Message, ApiMessage } from "@/app/definitions/types";

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

  try {
    const response = await fetch(
      `${API_URL}/api/messages?conversation_id=${conversationId}`,
      { method: "GET" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    const apiMessages: ApiMessage[] = await response.json();

    const messages: Message[] = apiMessages
      .map((message) => ({
        ...message,
        created_at: undefined, // remove the created_at field
        createdAt: new Date(message.created_at),
      }))
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
