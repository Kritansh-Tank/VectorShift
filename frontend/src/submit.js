import { useCallback } from "react";
import { useStore } from "./store";

export const SubmitButton = () => {
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);

  const handleSubmit = useCallback(async () => {
    try {
      const resp = await fetch("http://localhost:8000/pipelines/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!resp.ok) throw new Error(`Server returned ${resp.status}`);
      const data = await resp.json();
      const { num_nodes, num_edges, is_dag } = data;
      alert(
        `Pipeline parsed:\nNodes: ${num_nodes}\nEdges: ${num_edges}\nIs DAG: ${is_dag}`
      );
    } catch (e) {
      alert(`Error submitting pipeline: ${e.message}`);
    }
  }, [nodes, edges]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <button
        type="button"
        onClick={handleSubmit}
        className={
          "bg-black text-white px-6 min-w-[6rem] h-12 font-semibold text-base rounded-xl"
        }
      >
        Submit
      </button>
    </div>
  );
};

export default SubmitButton;
