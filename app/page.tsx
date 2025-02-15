"use client";

import Sidebar from "./components/Sidebar";
import { ValidAIs } from "./definitions/types";
import { useState } from "react";
import AiDropdown from "./components/Dropdown";

export default function Home() {
  const [ai, setAi] = useState<ValidAIs>("dog-cat-classifier");

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex h-full w-full">
        <Sidebar aiId={ai} />
        <div className="relative flex flex-1 flex-col items-center justify-center h-full">
          <AiDropdown
            selectedAi={ai}
            onSelect={setAi}
            className="absolute top-4 left-6"
          />
          <h1 className="text-4xl font-bold">Shai's AI Bots</h1>
          <p className="text-lg">Where fun goes to dAI</p>
          <p className="mt-8 text-gray-600">
            Please select a conversation from the sidebar or create a new one to
            get started.
          </p>
        </div>
      </div>
    </div>
  );
}
