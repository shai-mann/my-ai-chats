"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  aiId: string;
}

export default function Sidebar({ aiId }: { aiId: string }) {
  const pathname = usePathname();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(`/api/conversations?aiId=${aiId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [aiId]);

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center px-4">
        <h1 className="text-xl font-bold">Conversations</h1>
      </div>

      <div className="px-4 py-2">
        <Link
          href={`/chat/${aiId}/new`}
          className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New Chat
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="text-gray-400">Loading...</div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-4 text-gray-400">
            No conversations yet
          </div>
        ) : (
          conversations.map((conversation) => {
            const isActive = pathname === `/chat/${aiId}/${conversation.id}`;
            return (
              <Link
                key={conversation.id}
                href={`/chat/${aiId}/${conversation.id}`}
                className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="truncate">{conversation.title}</span>
                <span className="ml-auto text-xs text-gray-500">
                  {new Date(conversation.createdAt).toLocaleDateString()}
                </span>
              </Link>
            );
          })
        )}
      </nav>
    </div>
  );
}
