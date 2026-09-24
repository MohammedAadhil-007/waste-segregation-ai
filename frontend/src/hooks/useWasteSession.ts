import { useEffect, useState } from "react";

import type {
  HistoryItem,
  WasteClass,
  WasteCounts,
} from "../types/waste";

import {
  clearStoredSession,
  loadCounts,
  loadHistory,
  saveCounts,
  saveHistory,
} from "../utils/storage";

const DEFAULT_COUNTS: WasteCounts = {
  "Dry Waste": 0,
  "Wet Waste": 0,
  "Mixed Waste": 0,
};

export const useWasteSession = () => {
  /*
   * Load the saved counters immediately when React
   * creates the state.
   *
   * This means a browser refresh restores the session
   * without needing a setState() inside useEffect().
   */
  const [counts, setCounts] = useState<WasteCounts>(
    () => loadCounts() ?? DEFAULT_COUNTS
  );

  /*
   * Restore prediction history immediately as well.
   */
  const [history, setHistory] = useState<HistoryItem[]>(
    () => loadHistory()
  );

  /*
   * Persist counters whenever they change.
   */
  useEffect(() => {
    saveCounts(counts);
  }, [counts]);

  /*
   * Persist history whenever it changes.
   */
  useEffect(() => {
    saveHistory(history);
  }, [history]);

  /*
   * Add a new prediction to the current session.
   */
  const addPrediction = (
    prediction: WasteClass,
    confidence: number
  ) => {
    setCounts((previous) => {
      const updatedCounts: WasteCounts = {
        ...previous,
        [prediction]: previous[prediction] + 1,
      };

      // Save immediately as an additional safety measure.
      saveCounts(updatedCounts);

      return updatedCounts;
    });

    setHistory((previous) => {
      const newHistoryItem: HistoryItem = {
        id: Date.now(),
        prediction,
        confidence,
        time: new Date().toLocaleTimeString(),
      };

      const updatedHistory = [
        newHistoryItem,
        ...previous.slice(0, 9),
      ];

      // Save immediately.
      saveHistory(updatedHistory);

      return updatedHistory;
    });
  };

  /*
   * Completely reset the current session.
   */
  const clearSession = () => {
    setCounts(DEFAULT_COUNTS);
    setHistory([]);

    clearStoredSession();
  };

  return {
    counts,
    history,
    sessionReady: true,
    addPrediction,
    clearSession,
  };
};