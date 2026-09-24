import type {
  PredictionResponse,
} from "../types/waste";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

export const predictWaste = async (
  file: File
): Promise<PredictionResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    `${API_URL}/predict`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Prediction failed."
    );
  }

  return data as PredictionResponse;
};