import {
  BrainCircuit,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import type {
  PredictionResponse,
} from "../types/waste";

interface PredictionResultProps {
  prediction: PredictionResponse | null;
}

export default function PredictionResult({
  prediction,
}: PredictionResultProps) {

  /*
   * =========================================
   * EMPTY STATE
   * =========================================
   */

  if (!prediction) {
    return (
      <section className="result-card result-empty">

        <div className="result-top">

          <span className="section-badge">
            AI PREDICTION
          </span>

          <div className="result-status">
            <span className="result-status-dot" />
            Ready
          </div>

        </div>

        <div className="empty-result-content">

          <div className="empty-result-icon">
            <BrainCircuit size={34} />
          </div>

          <h2>Prediction Result</h2>

          <p>
            Your AI classification result will
            appear here after you analyze an image.
          </p>

          <div className="result-hint">

            <Sparkles size={15} />

            <span>
              Upload a waste image to get started
            </span>

          </div>

        </div>

      </section>
    );
  }


  /*
   * =========================================
   * PREDICTION RESULT
   * =========================================
   */

  const confidencePercentage =
    Math.round(prediction.confidence * 100);


  return (
    <section className="result-card">

      <div className="result-top">

        <span className="section-badge">
          AI PREDICTION
        </span>

        <div className="result-status success">

          <CheckCircle2 size={14} />

          Analyzed

        </div>

      </div>


      <h2>{prediction.prediction}</h2>


      <div className="confidence-value">
        {confidencePercentage}%
      </div>

      <div className="confidence-label">
        Model Confidence
      </div>


      <div className="probabilities">

        {Object.entries(
          prediction.probabilities
        ).map(([label, probability]) => {

          const percentage =
            Math.round(
              Number(probability) * 100
            );

          return (
            <div
              className="probability"
              key={label}
            >

              <div className="probability-header">

                <span>
                  {label}
                </span>

                <span>
                  {percentage}%
                </span>

              </div>

              <div className="progress">

                <div
                  className="progress-fill"
                  style={{
                    width: `${percentage}%`,
                  }}
                />

              </div>

            </div>
          );

        })}

      </div>

    </section>
  );
}