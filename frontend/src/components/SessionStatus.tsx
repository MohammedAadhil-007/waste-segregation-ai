interface SessionStatusProps {
  ready: boolean;
}

export default function SessionStatus({
  ready,
}: SessionStatusProps) {
  return (
    <div className="session-status">
      <span className="status-dot" />
      {ready ? "Session saved locally" : "Restoring session..."}
    </div>
  );
}