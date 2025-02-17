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

const MAX_RECONNECT_ATTEMPTS = 3;

export function useWebSocket(
  conversationId: string | null,
  onMessage: (message: Message) => void
) {
  const socketRef = useRef<Socket | null>(null);
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
      throw new Error("Max reconnection attempts reached");
    }

    try {
      socketRef.current = io(API_URL!, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
        reconnectionDelay: 1000,
      });

      socketRef.current.on("connect", () => {
        reconnectAttempts.current = 0;
      });

      socketRef.current.on("connect_error", (error) => {
        reconnectAttempts.current++;
        throw new Error(`Socket connection error: ${error}`);
      });

      socketRef.current.on("disconnect", (reason) => {
        if (reason === "io server disconnect") {
          // Server disconnected us, try to reconnect
          connect();
        }
      });

      socketRef.current.on("message", (data: unknown) => {
        if (!isValidMessage(data)) {
          throw new Error(`Received invalid message format: ${data}`);
        }

        const message: Message = {
          ...data,
          createdAt: new Date(data.created_at),
        };
        onMessage(message);
      });

      socketRef.current.on("error", (error) => {
        throw error;
      });
    } catch (error) {
      throw new Error(`Error creating socket connection: ${error}`);
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
        throw new Error("Socket not connected");
      }

      if (!conversationId) {
        throw new Error("No conversation ID");
      }

      socketRef.current.emit("send_message", {
        conversation_id: conversationId,
        content,
      });
    },
    [conversationId]
  );

  return {
    sendMessage,
    isConnected: socketRef.current?.connected ?? false,
  };
}
