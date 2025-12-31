import { useState } from "react";
import NodeBase from "./NodeBase";

export const ImageNode = ({ id, data }) => {
  const [url, setUrl] = useState(data?.url || "");

  return (
    <NodeBase
      id={id}
      data={data}
      title="Image"
      handles={[{ id: "out", type: "source", position: "right" }]}
    >
      <div>
        <input
          placeholder="Image URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "100%" }}
        />
        {url ? (
          <img
            src={url}
            alt="preview"
            style={{ width: "100%", marginTop: 6 }}
          />
        ) : (
          <div style={{ marginTop: 6, color: "#666" }}>No preview</div>
        )}
      </div>
    </NodeBase>
  );
};

export default ImageNode;
