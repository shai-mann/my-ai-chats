export const VALID_AIS = ["dog-cat-classifier", "fake-ai"] as const;

export type ValidAIs = (typeof VALID_AIS)[number];
