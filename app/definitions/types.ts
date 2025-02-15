export const VALID_AIS = ["dog-cat-classifier", "parrot-model"] as const;

export type ValidAIs = (typeof VALID_AIS)[number];

export interface Message {
  id: string;
  content: string;
  role: "user" | "ai";
  createdAt: string;
}
