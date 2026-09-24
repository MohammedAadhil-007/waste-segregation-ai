import {
  BrainCircuit,
  Trash2,
} from "lucide-react";

interface HeaderProps {
  onClearSession: () => void;
}

export default function Header({
  onClearSession,
}: HeaderProps) {
  return (
    <header className="header">

      <div className="brand">

        <div className="brand-icon">
          <BrainCircuit size={26} />
        </div>

        <div>
          <h1>WasteSeg AI</h1>
          <p>Intelligent Waste Classification</p>
        </div>

      </div>

      <button
        className="clear-button"
        onClick={onClearSession}
      >
        <Trash2 size={17} />
        Clear Session
      </button>

    </header>
  );
}