"use client";

import Sidebar from "./components/Sidebar";
import { ValidAIs, Message as MessageType } from "./definitions/types";
import { useEffect, useState } from "react";
import Dropdown from "./components/Dropdown";
import Message from "./components/Message";
import { v4 as uuidv4 } from "uuid";
export default function Home() {
  const [modelId, setModelId] = useState<ValidAIs>("dog-cat-classifier");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages();
    }
  }, [selectedConversationId]);

  const fetchMessages = async () => {
    setIsLoading(true);
    const response = await fetch(
      `/api/messages?conversation_id=${selectedConversationId}`
    );
    const data = await response.json();
    setMessages(data);
    setIsLoading(false);
  };

  const handleSendMessage = async (message: string) => {
    setMessages([
      ...messages,
      {
        id: uuidv4(),
        content: message,
        role: "user",
        createdAt: new Date().toISOString(),
      },
    ]);
    const response = await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({ conversationId: selectedConversationId, message }),
    });
    const data = await response.json();
    setMessages([...messages, data]);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex h-full w-full">
        <Sidebar
          modelId={modelId}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
        />
        <div className="relative flex flex-1 flex-col h-full">
          <Dropdown
            selectedModel={modelId}
            onSelect={setModelId}
            className="absolute top-4 left-6"
          />
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <p className="text-center py-4 text-gray-600">
                Loading messages...
              </p>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold">Shai's AI Bots</h1>
                <p className="text-lg">Where fun goes to dAI</p>
              </div>
            ) : (
              messages.map((message) => (
                <Message key={message.id} message={message} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
