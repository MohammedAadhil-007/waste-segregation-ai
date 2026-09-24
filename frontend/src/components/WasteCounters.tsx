import {
  Leaf,
  Droplets,
  Layers,
} from "lucide-react";

import type {
  WasteCounts,
} from "../types/waste";

interface WasteCountersProps {
  counts: WasteCounts;
}

export default function WasteCounters({
  counts,
}: WasteCountersProps) {
  return (
    <section className="counter-grid">

      <div className="counter-card dry">

        <div className="counter-icon">
          <Leaf size={24} />
        </div>

        <div>
          <p>Dry Waste</p>
          <h2>{counts["Dry Waste"]}</h2>
        </div>

      </div>

      <div className="counter-card wet">

        <div className="counter-icon">
          <Droplets size={24} />
        </div>

        <div>
          <p>Wet Waste</p>
          <h2>{counts["Wet Waste"]}</h2>
        </div>

      </div>

      <div className="counter-card mixed">

        <div className="counter-icon">
          <Layers size={24} />
        </div>

        <div>
          <p>Mixed Waste</p>
          <h2>{counts["Mixed Waste"]}</h2>
        </div>

      </div>

    </section>
  );
}