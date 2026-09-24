import type {
  HistoryItem,
} from "../types/waste";

interface PredictionHistoryProps {
  history: HistoryItem[];
}

export default function PredictionHistory({
  history,
}: PredictionHistoryProps) {
  return (
    <section className="history-card">

      <div className="section-title">

        <div>

          <span className="section-badge">
            SESSION
          </span>

          <h2>Recent Predictions</h2>

          <p>
            Your classification history is saved
            automatically.
          </p>

        </div>

      </div>


      {history.length === 0 ? (

        <div className="empty-history">
          No predictions yet.
        </div>

      ) : (

        <div className="history-list">

          {history.map((item) => (

            <div
              className="history-item"
              key={item.id}
            >

              {/* WASTE TYPE */}

              <div className="history-left">

                <div className="history-dot" />

                <strong>
                  {item.prediction}
                </strong>

              </div>


              {/* CONFIDENCE */}

              <strong className="history-confidence">
                {(item.confidence * 100).toFixed(1)}%
              </strong>


              {/* TIME */}

              <span className="history-time">
                {item.time}
              </span>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}