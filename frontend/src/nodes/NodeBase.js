import { Handle, Position } from "reactflow";
import "./nodeStyles.css";

const posMap = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

export const NodeBase = ({
  id,
  data = {},
  title,
  icon,
  handles = [],
  children,
  className = "",
  style = {},
}) => {
  const nodeTitle = title || data?.title || "Node";

  return (
    <div className={`node-base ${className}`} style={style}>
      {handles.map((h) => (
        <Handle
          key={h.id}
          type={h.type}
          position={posMap[(h.position || "left").toLowerCase()]}
          id={`${id}-${h.id}`}
          style={h.style}
        />
      ))}

      <div className="node-header">
        {icon && <div className="node-icon">{icon}</div>}
        <div className="node-title">{nodeTitle}</div>
      </div>

      <div className="node-body">{children}</div>
    </div>
  );
};

export default NodeBase;
