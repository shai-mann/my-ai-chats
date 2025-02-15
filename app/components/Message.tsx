import { Message as MessageType } from "../definitions/types";

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  return (
    <div
      className={`w-full px-4 py-8 flex ${
        message.role === "ai"
          ? "bg-gray-50 border-b border-black/10"
          : "bg-white"
      }`}
    >
      <div className="max-w-3xl mx-auto flex space-x-6 w-full">
        <div
          className={`w-8 h-8 rounded-sm flex items-center justify-center ${
            message.role === "ai" ? "bg-green-500" : "bg-blue-500"
          }`}
        >
          {message.role === "ai" ? "AI" : "U"}
        </div>
        <div className="flex-1 space-y-2">
          <p className="prose">{message.content}</p>
        </div>
      </div>
    </div>
  );
}
