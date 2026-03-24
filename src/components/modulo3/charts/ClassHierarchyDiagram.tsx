"use client";

import { useMemo } from "react";
import dagre from "@dagrejs/dagre";
import type { DiagramNode, DiagramEdge } from "@/lib/fidc/types";

interface ClassHierarchyDiagramProps {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

const NODE_WIDTH = 160;
const NODE_HEIGHT = 50;

interface PositionedNode extends DiagramNode {
  x: number;
  y: number;
}

interface EdgePath {
  source: string;
  target: string;
  label?: string;
  d: string;
}

export default function ClassHierarchyDiagram({ nodes, edges }: ClassHierarchyDiagramProps) {
  const { positionedNodes, edgePaths, width, height } = useMemo(() => {
    if (nodes.length === 0) {
      return { positionedNodes: [], edgePaths: [], width: 0, height: 0 };
    }

    const g = new dagre.graphlib.Graph();
    g.setGraph({ rankdir: "TB", nodesep: 30, ranksep: 60 });
    g.setDefaultEdgeLabel(() => ({}));

    for (const node of nodes) {
      g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    }

    for (const edge of edges) {
      g.setEdge(edge.source, edge.target);
    }

    dagre.layout(g);

    const graphInfo = g.graph();
    const graphWidth = graphInfo.width ?? 400;
    const graphHeight = graphInfo.height ?? 300;

    const positioned: PositionedNode[] = nodes.map((node) => {
      const n = g.node(node.id);
      return { ...node, x: n.x, y: n.y };
    });

    const paths: EdgePath[] = edges.map((edge) => {
      const sourceNode = g.node(edge.source);
      const targetNode = g.node(edge.target);

      const x1 = sourceNode.x;
      const y1 = sourceNode.y + NODE_HEIGHT / 2;
      const x2 = targetNode.x;
      const y2 = targetNode.y - NODE_HEIGHT / 2;

      const midY = (y1 + y2) / 2;
      const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

      return { source: edge.source, target: edge.target, label: edge.label, d };
    });

    return {
      positionedNodes: positioned,
      edgePaths: paths,
      width: graphWidth,
      height: graphHeight,
    };
  }, [nodes, edges]);

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-xl border border-outline-variant/20 bg-surface-container/30">
        <div className="text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl text-outline-variant mb-2 block">account_tree</span>
          <p className="text-sm">Selecione ao menos uma classe de ativos</p>
        </div>
      </div>
    );
  }

  const padding = 40;
  const viewBoxWidth = width + padding * 2;
  const viewBoxHeight = height + padding * 2;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`${-padding} ${-padding} ${viewBoxWidth} ${viewBoxHeight}`}
        width="100%"
        style={{ minHeight: 240, maxHeight: 520 }}
        aria-label="Diagrama hierárquico de classes do FIDC"
        role="img"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon
              points="0 0, 8 3, 0 6"
              fill="#4a5568"
            />
          </marker>
        </defs>

        {/* Edges */}
        {edgePaths.map((edge) => (
          <path
            key={`${edge.source}-${edge.target}`}
            d={edge.d}
            fill="none"
            stroke="#4a5568"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            markerEnd="url(#arrowhead)"
            opacity={0.7}
          />
        ))}

        {/* Nodes */}
        {positionedNodes.map((node) => {
          const x = node.x - NODE_WIDTH / 2;
          const y = node.y - NODE_HEIGHT / 2;
          const fillColor = node.color + "20";
          const strokeColor = node.color;
          const isRoot = node.type === "root";
          const rx = isRoot ? 12 : 8;

          return (
            <g key={node.id}>
              <rect
                x={x}
                y={y}
                width={NODE_WIDTH}
                height={NODE_HEIGHT}
                rx={rx}
                ry={rx}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={isRoot ? 2 : 1.5}
              />
              {node.sublabel ? (
                <>
                  <text
                    x={node.x}
                    y={node.y - 7}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={node.color}
                    fontSize={isRoot ? 13 : 11}
                    fontWeight={isRoot ? "700" : "600"}
                    fontFamily="Manrope, sans-serif"
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 10}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={node.color}
                    fontSize={9}
                    fontWeight="400"
                    fontFamily="Manrope, sans-serif"
                    opacity={0.7}
                  >
                    {node.sublabel}
                  </text>
                </>
              ) : (
                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={node.color}
                  fontSize={isRoot ? 13 : node.type === "class" ? 11 : 10}
                  fontWeight={isRoot ? "700" : "600"}
                  fontFamily="Manrope, sans-serif"
                >
                  {node.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
