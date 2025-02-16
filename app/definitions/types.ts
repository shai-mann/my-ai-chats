export const VALID_AIS = ["dog-cat-classifier", "parrot-model"] as const;

export type ValidAIs = (typeof VALID_AIS)[number];

export interface ApiMessage {
  id: string;
  content: string;
  role: "user" | "ai";
  created_at: number;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "ai";
  createdAt: Date;
}
