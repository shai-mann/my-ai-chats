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
  const [modelId, setModelId] = useState<ValidAIs>("dog-cat-classifier");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);

  const { sendMessage, isConnected } = useWebSocket(
    selectedConversationId,
    (message) => {
      console.log("Received message in page:", message);
      pushMessage(message);
    }
  );

  useEffect(() => {
    if (selectedConversationId) {
      setMessages([]);
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
      console.log("Messages:", messages);
      setMessages(
        messages.map((message) => ({
          ...message,
          // Ensure createdAt is a Date object
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
    console.log("Sending message:", message, messages);
    pushMessage({
      id: uuidv4(),
      content: message,
      role: "user",
      createdAt: new Date(),
    });
    sendMessage(message);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex h-full w-full">
        <Sidebar
          modelId={modelId}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
        />
        <div className="flex flex-1 flex-col h-full">
          <div className="flex justify-start p-4 w-full">
            <Dropdown
              selectedModel={modelId}
              onSelect={setModelId}
              className=""
            />
          </div>
          <div className="flex-1 overflow-y-auto pb-36">
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
            <TextBox
              onSubmit={handleSendMessage}
              disabled={!selectedConversationId || isLoading || !isConnected}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
