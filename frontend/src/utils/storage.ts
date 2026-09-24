import type {
  HistoryItem,
  WasteCounts,
} from "../types/waste";

const COUNTS_KEY = "wasteCounts";
const HISTORY_KEY = "wasteHistory";

export const saveCounts = (
  counts: WasteCounts
): void => {
  localStorage.setItem(
    COUNTS_KEY,
    JSON.stringify(counts)
  );
};

export const loadCounts = (): WasteCounts | null => {
  try {
    const saved = localStorage.getItem(COUNTS_KEY);

    if (!saved) return null;

    const parsed = JSON.parse(saved);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof parsed["Dry Waste"] !== "number" ||
      typeof parsed["Wet Waste"] !== "number" ||
      typeof parsed["Mixed Waste"] !== "number"
    ) {
      return null;
    }

    return parsed as WasteCounts;
  } catch {
    return null;
  }
};

export const saveHistory = (
  history: HistoryItem[]
): void => {
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(history)
  );
};

export const loadHistory = (): HistoryItem[] => {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
};

export const clearStoredSession = (): void => {
  localStorage.removeItem(COUNTS_KEY);
  localStorage.removeItem(HISTORY_KEY);
};