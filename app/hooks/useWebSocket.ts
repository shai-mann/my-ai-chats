import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { Message, ApiMessage } from "../definitions/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const isValidMessage = (message: any): message is ApiMessage => {
  return (
    typeof message === "object" &&
    message !== null &&
    typeof message.id === "string" &&
    typeof message.content === "string" &&
    (message.role === "user" || message.role === "ai") &&
    !isNaN(parseInt(message.created_at))
  );
};

export function useWebSocket(
  conversationId: string | null,
  onMessage: (message: Message) => void
) {
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;

  const connect = useCallback(() => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    try {
      socketRef.current = io(API_URL!, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
      });

      socketRef.current.on("connect", () => {
        reconnectAttempts.current = 0;
      });

      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        reconnectAttempts.current++;
      });

      socketRef.current.on("disconnect", (reason) => {
        if (reason === "io server disconnect") {
          // Server disconnected us, try to reconnect
          connect();
        }
      });

      socketRef.current.on("message", (data: unknown) => {
        if (!isValidMessage(data)) {
          console.error("Received invalid message format:", data);
          return;
        }

        try {
          const message: Message = {
            ...data,
            createdAt: new Date(data.created_at),
          };
          onMessage(message);
        } catch (error) {
          console.error("Error processing message:", error);
        }
      });
    } catch (error) {
      console.error("Error creating socket connection:", error);
      reconnectAttempts.current++;
    }
  }, []);

  useEffect(() => {
    if (!socketRef.current) {
      connect();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connect]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current?.connected) {
        console.error("Socket not connected");
        return;
      }

      if (!conversationId) {
        console.error("No conversation ID");
        return;
      }

      try {
        socketRef.current.emit("send_message", {
          conversation_id: conversationId,
          content,
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },
    [conversationId]
  );

  return {
    sendMessage,
    isConnected: socketRef.current?.connected ?? false,
  };
}
