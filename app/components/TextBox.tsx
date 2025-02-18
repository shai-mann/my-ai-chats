"use client";

import { KeyboardEvent, useRef, useState } from "react";

interface TextBoxProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
}

export default function TextBox({ onSubmit, disabled = false }: TextBoxProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        onSubmit(message.trim());
        setMessage("");
        // Reset textarea height
        if (textareaRef.current) {
          textareaRef.current.style.height = "24px";
        }
      }
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to get the correct scrollHeight
      textarea.style.height = "24px";
      // Set new height based on content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder={
            disabled
              ? "Select a conversation to start chatting..."
              : "Send a message..."
          }
          className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 pr-20 
            text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 
            disabled:bg-gray-50 disabled:text-gray-500"
          style={{ minHeight: "24px", maxHeight: "200px" }}
          rows={1}
          disabled={disabled}
        />
        <button
          onClick={() => message.trim() && onSubmit(message.trim())}
          disabled={!message.trim() || disabled}
          className="absolute right-2 bottom-2 rounded-md bg-blue-500 px-3 py-1.5 text-xs 
            font-medium text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Send
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Press Enter to send, Ctrl+Enter for new line
      </p>
    </div>
  );
}
