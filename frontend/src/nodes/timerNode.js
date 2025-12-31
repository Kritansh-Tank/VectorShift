import { useState, useRef } from "react";
import NodeBase from "./NodeBase";

export const TimerNode = ({ id, data }) => {
  const [running, setRunning] = useState(false);
  const [secs, setSecs] = useState(0);
  const intervalRef = useRef(null);

  const start = () => {
    if (running) return;
    setRunning(true);
    intervalRef.current = setInterval(() => setSecs((s) => s + 1), 1000);
  };
  const stop = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  return (
    <NodeBase
      id={id}
      data={data}
      title="Timer"
      handles={[{ id: "out", type: "source", position: "right" }]}
    >
      <div>
        <div style={{ marginBottom: 6 }}>Elapsed: {secs}s</div>
        <button onClick={start} disabled={running} style={{ marginRight: 6 }}>
          Start
        </button>
        <button onClick={stop} disabled={!running}>
          Stop
        </button>
      </div>
    </NodeBase>
  );
};

export default TimerNode;
