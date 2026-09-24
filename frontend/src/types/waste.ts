export type WasteClass =
  | "Dry Waste"
  | "Wet Waste"
  | "Mixed Waste";

export interface WasteCounts {
  "Dry Waste": number;
  "Wet Waste": number;
  "Mixed Waste": number;
}

export interface PredictionResponse {
  prediction: WasteClass;
  confidence: number;
  probabilities: Record<WasteClass, number>;
}

export interface HistoryItem {
  id: number;
  prediction: WasteClass;
  confidence: number;
  time: string;
}