from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

# allow frontend dev to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PipelineModel(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]


@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


def is_dag(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> bool:
    # build adjacency and in-degree map using node ids
    node_ids = {n.get('id') for n in nodes}
    adj = {nid: [] for nid in node_ids}
    indeg = {nid: 0 for nid in node_ids}

    for e in edges:
        src = e.get('source')
        tgt = e.get('target')
        if src not in node_ids or tgt not in node_ids:
            # ignore edges referencing unknown nodes
            continue
        adj[src].append(tgt)
        indeg[tgt] = indeg.get(tgt, 0) + 1

    # Kahn's algorithm
    queue = [nid for nid, d in indeg.items() if d == 0]
    visited = 0
    from collections import deque
    dq = deque(queue)
    while dq:
        u = dq.popleft()
        visited += 1
        for v in adj.get(u, []):
            indeg[v] -= 1
            if indeg[v] == 0:
                dq.append(v)

    return visited == len(node_ids)


@app.post('/pipelines/parse')
def parse_pipeline(payload: PipelineModel):
    nodes = payload.nodes or []
    edges = payload.edges or []
    num_nodes = len(nodes)
    num_edges = len(edges)
    dag = is_dag(nodes, edges)
    return {'num_nodes': num_nodes, 'num_edges': num_edges, 'is_dag': dag}
