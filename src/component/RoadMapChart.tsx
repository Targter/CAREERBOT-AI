import React, {  useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

type RoadmapStep = {
  id?: string;
  label: string;
  completed: boolean;
};

const initialNodes: Node<RoadmapStep>[] = [
  { id: "1", position: { x: 100, y: 50 }, data: { label: "HTML & CSS", completed: true }, type: "input" },
  { id: "2", position: { x: 300, y: 150 }, data: { label: "JavaScript", completed: false }, type: "default" },
  { id: "3", position: { x: 500, y: 250 }, data: { label: "React.js", completed: false }, type: "default" },
  { id: "4", position: { x: 700, y: 350 }, data: { label: "Node.js", completed: false }, type: "default" },
  { id: "5", position: { x: 900, y: 450 }, data: { label: "MongoDB", completed: false }, type: "default" },
  { id: "6", position: { x: 1100, y: 550 }, data: { label: "Build Full-Stack Projects", completed: false }, type: "output" },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
  { id: "e3-4", source: "3", target: "4", animated: true },
  { id: "e4-5", source: "4", target: "5", animated: true },
  { id: "e5-6", source: "5", target: "6", animated: true },
];

export default function VisualRoadmap() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node<RoadmapStep>) => {
    event.preventDefault();
    setNodes((nds) =>
      nds.map((n) =>
        n.id === node.id ? { ...n, data: { ...n.data, completed: !n.data.completed } } : n
      )
    );
  }, []);

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col items-center justify-center text-white p-8">
      <h1 className="text-3xl font-bold mb-4">🚀 Career Roadmap</h1>
      {/* <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}> */}
        <div className="h-[600px] w-[90%] bg-white rounded-lg shadow-lg">
          <ReactFlow
            nodes={nodes.map((node) => ({
              ...node,
              data: { ...node.data },
              style: {
                backgroundColor: node.data.completed ? "#4CAF50" : "#1F2937",
                color: "#fff",
                padding: "10px",
                borderRadius: "8px",
                border: node.data.completed ? "2px solid #34D399" : "2px solid #374151",
              },
            }))}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      {/* </motion.div> */}
    </div>
  );
}
