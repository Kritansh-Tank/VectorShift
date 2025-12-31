import { useState, useMemo } from 'react';
import NodeBase from './NodeBase';

const VAR_REGEX = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');

  const handleTextChange = (e) => setCurrText(e.target.value);

  // extract unique variable names
  const vars = useMemo(() => {
    const found = new Set();
    let m;
    while ((m = VAR_REGEX.exec(currText))) {
      found.add(m[1]);
    }
    return Array.from(found);
  }, [currText]);

  // layout sizes based on content
  const { widthPx, minHeightPx } = useMemo(() => {
    const lines = currText.split('\n');
    const longest = lines.reduce((max, l) => Math.max(max, l.length), 0);
    const approxCharPx = 8; // estimation
    const padding = 60; // header + padding allowance
    const w = Math.min(Math.max(longest * approxCharPx + padding, 140), 520);
    const rows = Math.min(Math.max(lines.length, 1), 10);
    const h = Math.min(120, rows * 20 + 36);
    return { widthPx: w, minHeightPx: h };
  }, [currText]);

  // create handles: variable targets on left, output on right
  const handles = useMemo(() => {
    const left = vars.map((v, i) => ({
      id: v,
      type: 'target',
      position: 'left',
      style: { top: `${((i + 1) * 100) / (vars.length + 1)}%` },
    }));
    return [...left, { id: 'output', type: 'source', position: 'right' }];
  }, [vars]);

  return (
    <NodeBase
      id={id}
      data={data}
      title="Text"
      handles={handles}
      style={{ position: 'relative', width: `${widthPx}px`, minHeight: `${minHeightPx}px` }}
    >
      <div>
        <label style={{ display: 'block' }}>
          Text:
          <textarea
            value={currText}
            onChange={handleTextChange}
            style={{ width: '100%', boxSizing: 'border-box', resize: 'none' }}
            rows={Math.min(Math.max(currText.split('\n').length, 1), 10)}
          />
        </label>
      </div>

      {/* render left-side variable labels aligned with handles */}
      {vars.map((v, i) => {
        const top = `${((i + 1) * 100) / (vars.length + 1)}%`;
        return (
          <div
            key={`label-${v}`}
            style={{ position: 'absolute', left: '100px', top: top, transform: 'translateY(-50%)', width: '80px', textAlign: 'right', fontSize: 12, color: '#666' }}
          >
            {v}
          </div>
        );
      })}
    </NodeBase>
  );
};
