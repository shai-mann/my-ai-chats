"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  modelId: string;
}

interface SidebarProps {
  modelId: string;
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export default function Sidebar({
  modelId,
  selectedConversationId,
  onSelectConversation,
}: SidebarProps) {
  const pathname = usePathname();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/conversations?model_id=${modelId}`);
      if (!response.ok) throw new Error("Failed to fetch conversations");
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [modelId]);

  const createNewConversation = async () => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model_id: modelId, title: "New Conversation" }),
      });

      if (!response.ok) throw new Error("Failed to create conversation");
      await fetchConversations(); // Refetch the conversations list
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center px-4">
        <h1 className="text-xl font-bold">Conversations</h1>
      </div>

      <div className="px-4 py-2">
        <button
          onClick={createNewConversation}
          className="flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New Chat
        </button>
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
            const isActive = conversation.id === selectedConversationId;
            return (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="truncate">{conversation.title}</span>
                <span className="ml-auto text-xs text-gray-500">
                  {new Date(conversation.createdAt).toLocaleDateString()}
                </span>
              </button>
            );
          })
        )}
      </nav>
    </div>
  );
}
