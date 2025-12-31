import { useState } from "react";
import NodeBase from "./NodeBase";

export const MathNode = ({ id, data }) => {
  const [expr, setExpr] = useState(data?.expr || "1+2*3");
  const [result, setResult] = useState("");

  const compute = () => {
    try {
      // small demo: evaluate basic arithmetic only
      // eslint-disable-next-line no-new-func
      const fn = new Function(`return (${expr})`);
      const res = fn();
      setResult(String(res));
    } catch (e) {
      setResult("error");
    }
  };

  return (
    <NodeBase
      id={id}
      data={data}
      title="Math"
      handles={[{ id: "out", type: "source", position: "right" }]}
    >
      <div>
        <input
          value={expr}
          onChange={(e) => setExpr(e.target.value)}
          style={{ width: "100%" }}
        />
        <div style={{ marginTop: 6 }}>
          <button onClick={compute}>Compute</button>
          <span style={{ marginLeft: 8 }}>{result}</span>
        </div>
      </div>
    </NodeBase>
  );
};

export default MathNode;
