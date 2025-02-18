"use client";

import Sidebar from "./components/Sidebar";
import { ValidAIs, Message as MessageType } from "./definitions/types";
import { useEffect, useState } from "react";
import Dropdown from "./components/Dropdown";
import Message from "./components/Message";
import { v4 as uuidv4 } from "uuid";
import TextBox from "./components/TextBox";
import { useWebSocket } from "./hooks/useWebSocket";

export default function Home() {
  const [modelId, setModelId] = useState<ValidAIs>("parrot-model");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);

  const { sendMessage, isConnected } = useWebSocket(
    selectedConversationId,
    (message) => {
      pushMessage(message);
    }
  );

  useEffect(() => {
    if (selectedConversationId) {
      fetchMessages();
    }
  }, [selectedConversationId]);

  useEffect(() => {
    setSelectedConversationId(null);
    setMessages([]);
  }, [modelId]);

  const pushMessage = (message: MessageType) => {
    setMessages((oldMessages) => {
      const newMessages = [...oldMessages, message];
      return newMessages.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
    });
  };

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/messages?conversation_id=${selectedConversationId}`
      );
      const messages: MessageType[] = await response.json();
      console.log(messages);
      setMessages(
        messages.map((message) => ({
          ...message,
          createdAt: new Date(message.createdAt),
        }))
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (message: string) => {
    pushMessage({
      id: uuidv4(),
      content: message,
      role: "user",
      createdAt: new Date(), // Local time is correct for new messages
    });
    sendMessage(message);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        modelId={modelId}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-gray-200 flex items-center px-4 shrink-0">
          <Dropdown selectedModel={modelId} onSelect={setModelId} />
        </header>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading messages...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <h1 className="text-2xl font-semibold mb-2">
                Welcome to AI Bots
              </h1>
              <p>Select a conversation or start a new one</p>
            </div>
          ) : (
            <div className="pb-32">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200">
          <TextBox
            onSubmit={handleSendMessage}
            disabled={!selectedConversationId || isLoading || !isConnected}
          />
        </div>
      </div>
    </div>
  );
}
