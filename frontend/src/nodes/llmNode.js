import NodeBase from "./NodeBase";

export const LLMNode = ({ id, data }) => {
  const handles = [
    { id: "system", type: "target", position: "left", style: { top: "33%" } },
    { id: "prompt", type: "target", position: "left", style: { top: "66%" } },
    { id: "response", type: "source", position: "right" },
  ];

  return (
    <NodeBase id={id} data={data} title="LLM" handles={handles}>
      <div>This is a LLM.</div>
    </NodeBase>
  );
};

export default LLMNode;
