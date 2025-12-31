import { useState } from "react";
import NodeBase from "./NodeBase";

export const APINode = ({ id, data }) => {
  const [url, setUrl] = useState(data?.url || "");
  const [method, setMethod] = useState(data?.method || "GET");
  const [last, setLast] = useState("");

  const run = async () => {
    try {
      const res = await fetch(url, { method });
      const txt = await res.text();
      setLast(txt.slice(0, 200));
    } catch (e) {
      setLast("error");
    }
  };

  return (
    <NodeBase
      id={id}
      data={data}
      title="API"
      handles={[{ id: "out", type: "source", position: "right" }]}
    >
      <div>
        <input
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "100%" }}
        />
        <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option>GET</option>
            <option>POST</option>
          </select>
          <button onClick={run}>Run</button>
        </div>
        <div
          style={{
            marginTop: 6,
            maxHeight: 80,
            overflow: "auto",
            fontSize: 12,
          }}
        >
          {last}
        </div>
      </div>
    </NodeBase>
  );
};

export default APINode;
