import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  Position,
  useNodesState,
  useEdgesState,
  MarkerType,
  EdgeProps,
  NodeTypes,
  ReactFlowInstance,
  Handle
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";

type Skill = {
  id: string;
  label: string;
  description: string;
  topics: string[];
  ref:string;
  prerequisites: string[];
  category: "frontend" | "backend" | "core" | "fullstack";
  icon: string;
  notes?: string;
  completed?: boolean;
};

const skillsData: Skill[] = [
  {
    id: "1",
    label: "HTML & CSS",
    description: "Master web fundamentals and responsive design",
    topics: ["Semantic HTML", "CSS Grid", "Flexbox", "Animations"],
    ref:"https://www.w3school.com",
    prerequisites: [],
    category: "frontend",
    icon: "🌐",
  },
  {
    id: "2",
    label: "JavaScript",
    description: "Learn modern JavaScript and core concepts",
    topics: ["ES6+", "Async/Await", "DOM Manipulation", "APIs"],
    ref:"https://www.w3school.com",
    prerequisites: ["1"],
    category: "core",
    icon: "💻",
  },
  {
    id: "3",
    label: "React.js",
    description: "Build dynamic UIs with component architecture",
    topics: ["Hooks", "Context API", "React Router", "Performance"],
    ref:"https://www.w3school.com",
    prerequisites: ["2"],
    category: "frontend",
    icon: "⚛️",
  },
  {
    id: "4",
    label: "Node.js",
    description: "Create server-side applications with JavaScript",
    topics: ["Express", "REST APIs", "Authentication", "Database Integration"],
    ref:"https://www.w3school.com",
    prerequisites: ["2"],
    category: "backend",
    icon: "🖥️",
  },
  {
    id: "5",
    label: "Full-Stack",
    description: "Develop complete web applications",
    topics: ["MERN Stack", "State Management", "Deployment", "Testing"],
    ref:"https://www.w3school.com",
    prerequisites: ["3", "4"],
    category: "fullstack",
    icon: "🏗️",
  },
];

const getCategoryColor = (category: Skill["category"]) => {
  const colors = {
    frontend: "#3B82F6", // blue-500
    backend: "#10B981", // emerald-500
    core: "#F59E0B", // amber-500
    fullstack: "#8B5CF6", // violet-500
  };
  return colors[category];
};

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
}: EdgeProps) => {
  const edgePath = `M ${sourceX},${sourceY} C ${sourceX + 100},${sourceY} ${
    targetX - 100
  },${targetY} ${targetX},${targetY}`;

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: "#4B5563",
          strokeWidth: 2,
          strokeLinecap: "round",
        }}
      />
    </>
  );
};

const SkillNode = ({
  id,
  data,
  selected,
}: {
  id: string;
  data: Skill & { expanded: boolean };
  selected?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [notes, setNotes] = useState(data.notes || "");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const toggleCompletion = useCallback(() => {
    const updatedNotes = notes !== data.notes ? notes : undefined;
    const event = new CustomEvent("updateSkill", {
      detail: {
        id,
        updates: { completed: !data.completed, notes: updatedNotes },
      },
    });
    window.dispatchEvent(event);
  }, [data.completed, id, notes, data.notes]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const saveNotes = () => {
    setIsEditingNotes(false);
    const event = new CustomEvent("updateSkill", {
      detail: { id, updates: { notes } },
    });
    window.dispatchEvent(event);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >

<Handle
        type="source"
        position={Position.Right}
        id={`${id}-source`}
        style={{ background: '#555' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-target`}
        style={{ background: '#555' }}
      />
      <motion.div
        className={`p-4 rounded-xl shadow-2xl border-2 transition-all duration-300 ${
          data.expanded ? "w-80" : "w-64"
        } ${data.completed ? "border-green-500" : "border-gray-600"} ${
          selected ? "ring-2 ring-white ring-opacity-50" : ""
        }`}
        style={{
          backgroundColor: "#1F2937",
          minHeight: data.expanded ? 400 : 100,
        }}
        animate={{
          scale: isHovered || selected ? 1.05 : 1,
          borderColor: data.completed
            ? "#10B981"
            : getCategoryColor(data.category),
        }}
      >
        {/* Progress Check Button */}
        <button
          onClick={toggleCompletion}
          className={`absolute -top-3 -right-3 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            data.completed
              ? "bg-green-500 hover:bg-green-400 shadow-lg shadow-green-500/50"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
        >
          {data.completed ? "✓" : "+"}
        </button>

        {/* Node Header */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xl"
            style={{ backgroundColor: getCategoryColor(data.category) }}
          >
            {data.icon}
          </div>
          <h3 className="text-lg font-bold text-gray-100">{data.label}</h3>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {data.expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <p className="text-sm text-gray-300">{data.description}</p>
              
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-blue-400">TOPICS</h4>
                <div className="flex flex-wrap gap-2">
                  {data.topics.map((topic) => (
                    <motion.span
                      key={topic}
                      className="px-2 py-1 bg-gray-800 rounded-md text-xs text-gray-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      {topic}
                    </motion.span>
                  ))}
                </div>
              </div>

              {data.prerequisites.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-purple-400">
                    REQUIRES
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.prerequisites.map((prereq) => {
                      const prereqSkill = skillsData.find((s) => s.id === prereq);
                      return (
                        <span
                          key={prereq}
                          className="px-2 py-1 bg-gray-800 rounded-md text-xs text-gray-300"
                        >
                          {prereqSkill?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* 
               */}
            <div className="space-y-2">
                <h4 className="text-xs font-semibold text-green-400">REFERENCE</h4>
                <a
                  href={data.ref}   
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white hover:underline break-all"
                >
                  {data.ref}
                </a>
              </div>
              {/* // END CHANGED */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-yellow-400">NOTES</h4>
                {isEditingNotes ? (
                  <div className="flex flex-col gap-2">
                    <textarea
                      value={notes}
                      onChange={handleNoteChange}
                      className="w-full p-2 bg-gray-800 text-white rounded resize-none text-sm"
                      rows={3}
                      placeholder="Add your notes here..."
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveNotes}
                        className="px-3 py-1 bg-blue-600 rounded text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditingNotes(false)}
                        className="px-3 py-1 bg-gray-600 rounded text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="p-2 bg-gray-800 text-white rounded text-sm min-h-[80px] cursor-text"
                    onClick={() => setIsEditingNotes(true)}
                  >
                    {notes || <span className="text-gray-500">Click to add notes...</span>}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connection Hint */}
        {isHovered && !data.expanded && (
          <div className="absolute -bottom-8 left-0 right-0 flex justify-center space-x-2">
            {skillsData
              .filter((skill) => skill.prerequisites.includes(id))
              .map((nextSkill) => (
                <motion.div
                  key={nextSkill.id}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="px-2 py-1 bg-blue-600 rounded-md text-xs text-white flex items-center"
                >
                  <span>→</span>
                  <span className="ml-1">{nextSkill.label}</span>
                </motion.div>
              ))}
          </div>
        )}
      </motion.div>

      {/* Progress Glow */}
      {data.completed && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, rgba(16, 185, 129, 0.2) 0%, transparent 70%)`,
          }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
};

const nodeTypes: NodeTypes = {
  skillNode: SkillNode,
};


const calculateLayout = (isTimeline: boolean) => {
  const verticalSpacing = 200;
  const horizontalSpacing = 300;
  
  // Timeline view positions
  if (isTimeline) {
    const positions: Record<string, {x: number, y: number}> = {};
    let yPosition = 50;
    
    skillsData.forEach(skill => {
      positions[skill.id] = { x: 0, y: yPosition };
      yPosition += verticalSpacing;
    });

    return skillsData.map(skill => ({
      id: skill.id,
      position: positions[skill.id],
      data: { ...skill, expanded: false },
      type: "skillNode",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      draggable: true,
    }));
  }

  // Tree view positions
  const positions: Record<string, {x: number, y: number}> = {
    "1": { x: 0, y: 50 },
    "2": { x: 0, y: 250 },
    "3": { x: -300, y: 450 },
    "4": { x: 300, y: 450 },
    "5": { x: 0, y: 650 },
    "6": { x: 0, y: 850 },
  };

  // Calculate dynamic positions for any additional skills
  let currentY = 850;
  skillsData.forEach(skill => {
    if (!positions[skill.id]) {
      currentY += verticalSpacing;
      positions[skill.id] = { 
        x: 0, 
        y: currentY 
      };
    }
  });

  return skillsData.map(skill => ({
    id: skill.id,
    position: positions[skill.id] || { x: 0, y: 0 },
    data: { ...skill, expanded: false },
    type: "skillNode",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    draggable: true,
  }));
};

export default function InteractiveRoadmap() {
  const [isTimelineView, setIsTimelineView] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const updateSkill = useCallback((id: string, updates: Partial<Skill>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      )
    );
  }, []);

  useEffect(() => {
    const handleUpdateSkill = (e: CustomEvent) => {
      updateSkill(e.detail.id, e.detail.updates);
    };

    window.addEventListener("updateSkill", handleUpdateSkill as EventListener);
    return () => {
      window.removeEventListener("updateSkill", handleUpdateSkill as EventListener);
    };
  }, [updateSkill]);

  useEffect(() => {
    const initialNodes = calculateLayout(isTimelineView);
    const initialEdges = skillsData.flatMap((skill) =>
      skill.prerequisites.map((prereq) => ({
        id: `e${prereq}-${skill.id}`,
        source: prereq,
        sourceHandle: `${prereq}-source`,
        target: skill.id,
        targetHandle: `${skill.id}-target`,
        type: "custom",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: getCategoryColor(
            skillsData.find((s) => s.id === prereq)?.category || "core"
          ),
          width: 20,
          height: 20,
        },
        style: {
          stroke: getCategoryColor(
            skillsData.find((s) => s.id === prereq)?.category || "core"
          ),
          strokeWidth: 2,
        },
      }))
    );
  
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [isTimelineView, rfInstance]);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      // Don't collapse if clicking on notes or other interactive elements
      const target = _.target as HTMLElement;
      if (target.closest('textarea, button')) {
        return;
      }
      
      setActiveNode((prev) => (prev === node.id ? null : node.id));
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id
            ? { ...n, data: { ...n.data, expanded: !n.data.expanded } }
            : { ...n, data: { ...n.data, expanded: false } }
        )
      );
    },
    []
  );

  const onInit = (instance: ReactFlowInstance) => {
    setRfInstance(instance);
    instance.fitView({ padding: 0.5 });
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
        🚀 Interactive Learning Roadmap
      </h1>

      {/* View Toggle */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setIsTimelineView(false)}
          className={`px-4 py-2 rounded-lg transition-all ${
            !isTimelineView
              ? "bg-blue-600 shadow-lg shadow-blue-500/50"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          🌳 Tree View
        </button>
        <button
          onClick={() => setIsTimelineView(true)}
          className={`px-4 py-2 rounded-lg transition-all ${
            isTimelineView
              ? "bg-blue-600 shadow-lg shadow-blue-500/50"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          ⏳ Timeline View
        </button>
      </div>

      {/* Flow Canvas */}
      <div className="h-[calc(100vh-180px)] w-full bg-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
{/* Flow Canvas */}
<div className="h-[calc(100vh-180px)] w-full bg-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-visible">
  <ReactFlow
    nodes={nodes}
    edges={edges}
    nodeTypes={nodeTypes}
    edgeTypes={{ custom: CustomEdge }}
    onNodeClick={handleNodeClick}
    onNodesChange={onNodesChange}
    onEdgesChange={onEdgesChange}
    onInit={onInit}
    fitView
    fitViewOptions={{ padding: 0.5 }}
    nodesDraggable
  >
    <Background 
      variant="dots" 
      gap={40} 
      size={1} 
      color="#4B5563"
      style={{ backgroundColor: 'rgba(17, 24, 39, 0.8)' }}
    />
    <Controls
      className="bg-gray-700 p-1 rounded-lg shadow-lg"
      showInteractive={false}
    />
  </ReactFlow>
</div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex gap-4 text-sm">
        {Object.entries({
          frontend: "Frontend",
          backend: "Backend",
          core: "Core",
          fullstack: "Full-Stack",
        }).map(([category, label]) => (
          <div key={category} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: getCategoryColor(category as any) }}
            />
            <span className="text-gray-300">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}