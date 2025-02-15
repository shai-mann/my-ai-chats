import { NextRequest, NextResponse } from "next/server";
import { Message, ApiMessage } from "@/app/definitions/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function convertApiMessage(apiMessage: ApiMessage): Message {
  return {
    id: apiMessage.id,
    content: apiMessage.content,
    role: apiMessage.role,
    createdAt: new Date(apiMessage.created_at).toISOString(),
  };
}

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
      .map(convertApiMessage)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
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

  try {
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

    if (!response.ok) {
      throw new Error("Failed to create message");
    }

    const apiMessage: ApiMessage = await response.json();
    const message: Message = convertApiMessage(apiMessage);

    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}
