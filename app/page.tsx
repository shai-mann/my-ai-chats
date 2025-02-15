"use client";

import Sidebar from "./components/Sidebar";
import { ValidAIs } from "./definitions/types";
import { useState } from "react";
import Dropdown from "./components/Dropdown";

export default function Home() {
  const [modelId, setModelId] = useState<ValidAIs>("dog-cat-classifier");
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex h-full w-full">
        <Sidebar
          modelId={modelId}
          selectedConversationId={selectedConversationId}
          onSelectConversation={setSelectedConversationId}
        />
        <div className="relative flex flex-1 flex-col items-center justify-center h-full">
          <Dropdown
            selectedModel={modelId}
            onSelect={setModelId}
            className="absolute top-4 left-6"
          />
          <h1 className="text-4xl font-bold">Shai's AI Bots</h1>
          <p className="text-lg">Where fun goes to dAI</p>
          <p className="mt-8 text-gray-600">
            {selectedConversationId
              ? "Loading conversation..."
              : "Please select a conversation from the sidebar or create a new one to get started."}
          </p>
        </div>
      </div>
    </div>
  );
}
