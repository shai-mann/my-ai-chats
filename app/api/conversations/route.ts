import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const aiId = searchParams.get("aiId");

  if (!aiId) {
    return NextResponse.json({ error: "AI ID is required" }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_URL}/api/conversations?aiId=${aiId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch conversations");
    }

    const conversations = await response.json();
    return NextResponse.json(conversations);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const data = await request.json();

  try {
    const response = await fetch(`${API_URL}/api/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create conversation");
    }

    const conversation = await response.json();
    return NextResponse.json(conversation);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
