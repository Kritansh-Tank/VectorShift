# VectorShift

Lightweight visual pipeline editor (React frontend) + simple FastAPI backend for parsing pipelines.

## Overview

This workspace contains a React-based frontend (drag-and-drop nodes using React Flow) and a small FastAPI backend that inspects submitted pipelines.

- Frontend: `frontend/` — create-react-app with node-based UI in `src/`.
- Backend: `backend/` — FastAPI app in `backend/main.py` exposing a parsing endpoint.

## Prerequisites

- Node.js (16+ recommended) and npm
- Python 3.10+ and pip

## Backend — run locally

1. Create a Python virtual environment and install dependencies:

```bash
python -m venv .venv
.venv\Scripts\activate    # on Windows
pip install fastapi uvicorn pydantic
```

2. Start the FastAPI server:

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

3. Endpoints:

- `GET /` — simple health check returning `{"Ping":"Pong"}`
- `POST /pipelines/parse` — accepts JSON with shape `{ "nodes": [...], "edges": [...] }` and returns `{ "num_nodes": <int>, "num_edges": <int>, "is_dag": <bool> }`.

Example request body:

```json
{
  "nodes": [{ "id": "input-1", "type": "customInput", "data": {} }],
  "edges": [{ "source": "input-1", "target": "llm-1" }]
}
```

Notes: CORS is currently permissive (`allow_origins=["*"]`) to simplify local development. Lock this down before deploying.

## Frontend — run locally

1. Install dependencies and start the dev server:

```bash
cd frontend
npm install
npm start
```

2. The app runs at `http://localhost:3000` by default. The `Submit` button posts the current nodes/edges to the backend at `http://localhost:8000/pipelines/parse`.

## Project structure

- `backend/main.py` — FastAPI app and DAG-checking implementation (Kahn's algorithm).
- `frontend/src/` — React app source
  - `App.js` — root component wiring toolbar, UI and submit
  - `toolbar.js`, `draggableNode.js` — node palette
  - `ui.js` — React Flow canvas and drop handling
  - `store.js` — Zustand store for nodes/edges
  - `nodes/` — node components (LLM, Input, Output, Text, Math, Timer, Image, API, Note)

## Node reference

Each node component under `frontend/src/nodes/` implements a compact UI and exposes connection handles used by React Flow. Below are the main nodes and what they do:

- `InputNode` — represents an external input value. Exposes a `value` source handle on the right. Allows naming the input and selecting a type (Text/File). Useful as a data source for downstream nodes.

- `LLMNode` — a language-model processing node. Has two `target` handles on the left (`system`, `prompt`) and one `source` handle on the right (`response`). Intended to receive prompt content and system instructions and output model responses.

- `OutputNode` — terminal output node. Has a `value` target handle on the left. Used to collect final outputs from the graph; configurable name and output type.

- `TextNode` — templating node. Contains editable text supporting variable placeholders in the form `{{varName}}`. Dynamically creates `target` handles for each variable found in the text (left side) and a single `output` source handle (right) that emits the rendered text.

- `MathNode` — small arithmetic evaluator. Lets the user enter an expression (e.g. `1+2*3`) and computes the result locally. Exposes an `out` source handle with the computed value. Uses a restricted evaluation approach (new Function) for demo arithmetic only — avoid evaluating untrusted input in production.

- `TimerNode` — simple timer that emits elapsed time. Exposes an `out` source handle and provides start/stop controls. Useful for triggering time-based flows in demos.

- `ImageNode` — takes an image URL and previews it. Exposes an `out` source handle. Useful for embedding image references in the flow.

- `APINode` — calls an external HTTP API (configurable URL and method) and displays a short preview of the response; exposes an `out` source handle. Useful for integrating third-party data into the pipeline.

- `NoteNode` — free-form note with a textarea; has an `out` source handle for convenience. Useful as documentation or human-readable annotations inside the graph.

### Why `NodeBase` exists

All node components import and reuse `NodeBase` (`frontend/src/nodes/NodeBase.js`). `NodeBase` centralizes common UI and wiring concerns:

- Consistent visual style (dimensions, header, body, border, etc.) so all nodes look and behave uniformly.
- Centralized creation of `Handle` elements. Node components declare an array of `handles` (id, type, position, style) and `NodeBase` maps those to React Flow `Handle` components. That keeps node components focused on their specific content and state.
- Standardized id naming for handles: `NodeBase` creates handles with ids like `<nodeId>-<handleId>`. This avoids id collisions when multiple nodes use similarly named handles.

Using `NodeBase` reduces duplication and makes adding or updating node types straightforward: implement the node's UI and declare the handles and `NodeBase` will wire them consistently.

## Backend — DAG checking

The backend implementation in `backend/main.py` exposes `POST /pipelines/parse` which accepts a pipeline payload `{ nodes, edges }`. The server computes a few diagnostics including whether the directed graph defined by the nodes and edges is a DAG (directed acyclic graph).

### Implementation details:

- The server first constructs `node_ids` as the set of all node `id` values.
- It builds an adjacency list `adj` mapping each source node id to a list of target ids, and an in-degree map `indeg` for each node id.
- Edges that reference a `source` or `target` not present in `node_ids` are ignored (the code explicitly skips those edges).
- The DAG check uses Kahn's algorithm:
  1. Initialize a queue with all nodes whose in-degree is 0.
  2. Repeatedly pop nodes from the queue, increment a `visited` counter, and decrement the in-degree of their neighbors. When a neighbor's in-degree reaches 0, push it onto the queue.
  3. After processing, if `visited` equals the total number of nodes, the graph is acyclic (a DAG); otherwise a cycle exists.

### Why Kahn's algorithm?

- Time complexity: O(V + E) — linear in the number of nodes and edges — which is efficient for interactive UIs.
- Deterministic and iterative: it produces a valid topological ordering (if needed) and does not rely on recursion, so it's robust in environments where deep recursion might be undesirable.
- Clear cycle detection: if some nodes never reach in-degree zero during processing, a cycle is present.

Alternative (DFS-based) cycle-detection approaches exist (track recursion stack/visited sets) and are equally valid. Kahn's algorithm was chosen here for its clarity, non-recursive nature, and straightforward mapping to in-degree bookkeeping used by the app.
