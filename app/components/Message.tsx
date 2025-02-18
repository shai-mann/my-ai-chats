import { Message as MessageType } from "../definitions/types";

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  return (
    <div
      className={`py-6 ${message.role === "ai" ? "bg-gray-50" : "bg-white"}`}
    >
      <div className="max-w-3xl mx-auto px-4 flex gap-4">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm text-white shrink-0
            ${message.role === "ai" ? "bg-emerald-500" : "bg-blue-500"}`}
        >
          {message.role === "ai" ? "AI" : "U"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="prose max-w-none">{message.content}</div>
          <div className="mt-2 text-xs text-gray-500">
            {message.createdAt.toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
}
