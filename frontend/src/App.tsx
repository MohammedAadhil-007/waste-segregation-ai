import {
  useEffect,
  useState,
} from "react";

import Header from "./components/Header";
import ImageUploader from "./components/ImageUploader";
import PredictionHistory from "./components/PredictionHistory";
import PredictionResult from "./components/PredictionResult";
import SessionStatus from "./components/SessionStatus";
import WasteCounters from "./components/WasteCounters";

import { predictWaste } from "./services/wasteApi";

import type {
  PredictionResponse,
} from "./types/waste";

import { useWasteSession } from "./hooks/useWasteSession";

import {
  clearImage,
  loadImage,
  saveImage,
} from "./utils/imageStorage";

import "./App.css";


function App() {

  /*
   * ================================
   * SESSION
   * ================================
   */

  const {
    counts,
    history,
    sessionReady,
    addPrediction,
    clearSession: clearStoredSession,
  } = useWasteSession();


  /*
   * ================================
   * IMAGE STATE
   * ================================
   */

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string | null>(null);


  /*
   * ================================
   * PREDICTION STATE
   * ================================
   */

  const [prediction, setPrediction] =
    useState<PredictionResponse | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  /*
   * ================================
   * TOAST STATE
   * ================================
   */

  const [hasAnalyzedCurrentImage, setHasAnalyzedCurrentImage] =
    useState(false);

  const [toast, setToast] =
    useState<string | null>(null);


  /*
   * ================================
   * RESTORE IMAGE AFTER REFRESH
   * ================================
   */

  useEffect(() => {

    const restoreImage = async () => {

      try {

        const storedFile =
          await loadImage();

        if (!storedFile) {
          return;
        }

        setSelectedFile(storedFile);

        const imageUrl =
          URL.createObjectURL(storedFile);

        setPreview(imageUrl);

      } catch (error) {

        console.error(
          "Failed to restore uploaded image:",
          error
        );

      }

    };

    restoreImage();

  }, []);


  /*
   * ================================
   * TOAST FUNCTION
   * ================================
   */

  const showToast = (message: string) => {

    setToast(message);

    setTimeout(() => {
      setToast(null);
    }, 2500);

  };


  /*
   * ================================
   * FILE SELECTION
   * ================================
   */

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {

      setError(
        "Please upload a JPG, PNG or WebP image."
      );

      return;
    }


    /*
     * New image means
     * new prediction is allowed
     */

    setHasAnalyzedCurrentImage(false);

    setSelectedFile(file);

    setPrediction(null);

    setError("");


    /*
     * Create preview
     */

    const imageUrl =
      URL.createObjectURL(file);

    setPreview(imageUrl);


    /*
     * Save image for refresh persistence
     */

    try {

      await saveImage(file);

    } catch (error) {

      console.error(
        "Failed to save uploaded image:",
        error
      );

      setError(
        "Image selected, but could not be saved for refresh persistence."
      );

    }


    /*
     * Allows the same file
     * to be selected again later
     */

    event.target.value = "";

  };


  /*
   * ================================
   * PREDICT WASTE
   * ================================
   */

  const handlePredict = async () => {

    /*
     * No image selected
     */

    if (!selectedFile) {

      showToast(
        "Please upload an image first."
      );

      return;
    }


    /*
     * Prevent duplicate prediction
     * for the same image
     */

    if (hasAnalyzedCurrentImage) {

      showToast(
        "Please upload a new image."
      );

      return;
    }


    setLoading(true);

    setError("");


    try {

      /*
       * Send image to backend
       */

      const result =
        await predictWaste(selectedFile);


      /*
       * Mark current image
       * as already analyzed
       */

      setHasAnalyzedCurrentImage(true);


      /*
       * Show result
       */

      setPrediction(result);


      /*
       * Update session counters
       * and prediction history
       */

      addPrediction(
        result.prediction,
        result.confidence
      );

    } catch (error) {

      console.error(
        "Prediction error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to connect to the server."
      );

    } finally {

      setLoading(false);

    }

  };


  /*
   * ================================
   * CLEAR COMPLETE SESSION
   * ================================
   */

  const handleClearSession = async () => {

    /*
     * Clear React state
     */

    setSelectedFile(null);

    setPreview(null);

    setPrediction(null);

    setError("");

    setHasAnalyzedCurrentImage(false);


    /*
     * Clear counters and history
     */

    clearStoredSession();


    /*
     * Clear persisted image
     */

    try {

      await clearImage();

    } catch (error) {

      console.error(
        "Failed to clear stored image:",
        error
      );

    }

  };


  /*
   * ================================
   * UI
   * ================================
   */

  return (

    <div className="app">

      {/* HEADER */}

      <Header
        onClearSession={handleClearSession}
      />


      {/* SESSION STATUS */}

      <SessionStatus
        ready={sessionReady}
      />


      {/* COUNTERS */}

      <WasteCounters
        counts={counts}
      />


      {/* MAIN CONTENT */}

      <main className="main-content">

        {/* IMAGE UPLOADER */}

        <ImageUploader
          selectedFile={selectedFile}
          preview={preview}
          loading={loading}
          error={error}
          onFileChange={handleFileChange}
          onPredict={handlePredict}
        />


        {/* PREDICTION RESULT */}

        <PredictionResult
          prediction={prediction}
        />


        {/* HISTORY */}

        <PredictionHistory
          history={history}
        />

      </main>


      {/* FOOTER */}

      <footer>
        Powered by MobileNetV2 • FastAPI • React
      </footer>


      {/* TOAST */}

      {toast && (
        <div className="toast">
          <span className="toast-icon">!</span>
          <span>{toast}</span>
        </div>
      )}

    </div>

  );
}

export default App;