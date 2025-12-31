import { useState } from "react";
import NodeBase from "./NodeBase";

export const NoteNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || "Take a note...");

  return (
    <NodeBase
      id={id}
      data={data}
      title="Note"
      handles={[{ id: "out", type: "source", position: "right" }]}
    >
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "100%", minHeight: 60 }}
        />
      </div>
    </NodeBase>
  );
};

export default NoteNode;
