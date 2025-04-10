import React, { useState, useEffect, useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Position,
  useNodesState,
  useEdgesState,
  MarkerType,
  EdgeProps,
  NodeTypes,
  ReactFlowInstance,
  Handle,
} from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { useRoadmapStore } from "../hooks/roadmapStore";

// Skill type with defaults
type Skill = {
  id: string;
  label: string;
  description?: string;
  topics?: string[];
  prerequisites?: string;
  category: "frontend" | "backend" | "core" | "fullstack";
  icon: string;
  notes?: string;
  completed?: boolean;
};

// Default skills data
const defaultSkillsData: Skill[] = [
  { id: "1", label: "HTML & CSS", description: "Master web fundamentals", topics: ["Semantic HTML", "CSS Grid"], prerequisites: "", category: "frontend", icon: "🌐" },
  { id: "2", label: "JavaScript", description: "Learn modern JS", topics: ["ES6+", "Async/Await"], prerequisites: "1", category: "core", icon: "💻" },
  { id: "3", label: "React.js", description: "Build dynamic UIs", topics: ["Hooks", "Context API"], prerequisites: "2", category: "frontend", icon: "⚛️" },
  { id: "4", label: "Node.js", description: "Server-side JS", topics: ["Express", "REST APIs"], prerequisites: "2", category: "backend", icon: "🖥️" },
  { id: "5", label: "Full-Stack", description: "Complete web apps", topics: ["MERN Stack", "Deployment"], prerequisites: "3,4", category: "fullstack", icon: "🏗️" },
];

const getCategoryColor = (category: Skill["category"]): string =>
  ({
    frontend: "#3B82F6",
    backend: "#10B981",
    core: "#F59E0B",
    fullstack: "#8B5CF6",
  }[category]);

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, markerEnd }: EdgeProps) => {
  const edgePath = `M ${sourceX},${sourceY} C ${sourceX + 100},${sourceY} ${targetX - 100},${targetY} ${targetX},${targetY}`;
  return <path id={id} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} style={{ stroke: "#4B5563", strokeWidth: 2 }} />;
};

const edgeTypes = { custom: CustomEdge };

const SkillNode = ({ id, data, selected, skillsData = [] }: { id: string; data: Skill & { expanded: boolean }; selected?: boolean; skillsData?: Skill[] }) => {
  const [isHovered, setIsHovered] = useState(false); 
  const [notes, setNotes] = useState(data.notes || "");
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const toggleCompletion = useCallback(() => {
    const updatedNotes = notes !== data.notes ? notes : undefined;
    window.dispatchEvent(new CustomEvent("updateSkill", { detail: { id, updates: { completed: !data.completed, notes: updatedNotes } } }));
  }, [data.completed, id, notes, data.notes]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value);
  const saveNotes = () => {
    setIsEditingNotes(false);
    window.dispatchEvent(new CustomEvent("updateSkill", { detail: { id, updates: { notes } } }));
  };

  const prerequisitesArray = (data.prerequisites || "").split(",").filter(Boolean);

  return (
    <div className="relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Handle type="source" position={Position.Right} id={`${id}-source`} style={{ background: "#555" }} />
      <Handle type="target" position={Position.Left} id={`${id}-target`} style={{ background: "#555" }} />
      <motion.div
        className={`p-4 rounded-xl shadow-2xl border-2 transition-all duration-300 ${data.expanded ? "w-80" : "w-64"} ${
          data.completed ? "border-green-500" : "border-gray-600"
        } ${selected ? "ring-2 ring-white ring-opacity-50" : ""}`}
        style={{ backgroundColor: "#1F2937", minHeight: data.expanded ? 340 : 100 }}
        animate={{ scale: isHovered || selected ? 1.05 : 1, borderColor: data.completed ? "#10B981" : getCategoryColor(data.category) }}
      >
        <button
          onClick={toggleCompletion}
          className={`absolute -top-3 -right-3 z-20 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            data.completed ? "bg-green-500 hover:bg-green-400 shadow-lg shadow-green-500/50" : "bg-gray-600 hover:bg-gray-500"
          }`}
        >
          {data.completed ? "✓" : "+"}
        </button>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: getCategoryColor(data.category) }}>
            {data.icon}
          </div>
          <h3 className="text-lg font-bold text-gray-100">{data.label}</h3>
        </div>
        <AnimatePresence>
          {data.expanded && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
              <p className="text-sm text-gray-300">{data.description || "No description available"}</p>
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-blue-400">TOPICS</h4>
                <div className="flex flex-wrap gap-2">
                  {(data.topics || []).map((topic) => (
                    <motion.span key={topic} className="px-2 py-1 bg-gray-800 rounded-md text-xs text-gray-300" whileHover={{ scale: 1.05 }}>
                      {topic}
                    </motion.span>
                  ))}
                </div>
              </div>
              {prerequisitesArray.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-purple-400">REQUIRES</h4>
                  <div className="flex flex-wrap gap-2">
                    {prerequisitesArray.map((prereq) => {
                      const prereqSkill = skillsData.find((s) => s.id === prereq);
                      return (
                        <span key={prereq} className="px-2 py-1 bg-gray-800 rounded-md text-xs text-gray-300">
                          {prereqSkill?.label || "Unknown"}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
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
                      <button onClick={saveNotes} className="px-3 py-1 bg-blue-600 rounded text-sm hover:bg-blue-500">Save</button>
                      <button onClick={() => setIsEditingNotes(false)} className="px-3 py-1 bg-gray-600 rounded text-sm hover:bg-gray-500">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 bg-gray-800 text-white rounded text-sm min-h-[80px] cursor-text" onClick={() => setIsEditingNotes(true)}>
                    {notes || <span className="text-gray-500">Click to add notes...</span>}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {isHovered && !data.expanded && (
          <div className="absolute -bottom-8 left-0 right-0 flex justify-center space-x-2">
            {skillsData
              .filter((skill) => (skill.prerequisites || "").split(",").includes(id))
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
      {data.completed && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ background: `radial-gradient(circle at center, rgba(16, 185, 129, 0.2) 0%, transparent 70%)` }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
};

const nodeTypes: NodeTypes = { skillNode: SkillNode };

const calculateLayout = (skills: Skill[], isTimeline: boolean): Node[] => {
  const verticalSpacing = 200;
  const horizontalSpacing = 300;

  if (isTimeline) {
    return skills.map((skill, index) => ({
      id: skill.id,
      position: { x: 0, y: 50 + index * verticalSpacing },
      data: { ...skill, expanded: false },
      type: "skillNode",
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      draggable: true,
    }));
  }

  const positions: Record<string, { x: number; y: number }> = {};
  const levels: Record<number, Skill[]> = {};

  const assignLevel = (skill: Skill, visited: Set<string> = new Set()): number => {
    if (visited.has(skill.id)) return 0;
    visited.add(skill.id);
    if (!skill.prerequisites) return 0;
    const prereqArray = skill.prerequisites.split(",").filter(Boolean);
    return Math.max(...prereqArray.map((prereq) => assignLevel(skills.find((s) => s.id === prereq) || skill, visited) + 1), 0);
  };

  skills.forEach((skill) => {
    const level = assignLevel(skill);
    levels[level] = levels[level] || [];
    levels[level].push(skill);
  });

  Object.entries(levels).forEach(([level, levelSkills]) => {
    const y = 50 + Number(level) * verticalSpacing;
    levelSkills.forEach((skill, index) => {
      const x = (index - (levelSkills.length - 1) / 2) * horizontalSpacing;
      positions[skill.id] = { x, y };
    });
  });

  return skills.map((skill) => ({
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
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const roadmapData = useRoadmapStore((state) => state.roadmapData);
  const skillsData = roadmapData?.skills_needed ?? defaultSkillsData;

  const updateSkill = useCallback((id: string, updates: Partial<Skill>) => {
    setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, ...updates } } : node)));
  }, [setNodes]);

  useEffect(() => {
    const handleUpdateSkill = (e: Event) => {
      const event = e as CustomEvent<{ id: string; updates: Partial<Skill> }>;
      updateSkill(event.detail.id, event.detail.updates);
    };
    window.addEventListener("updateSkill", handleUpdateSkill);
    return () => window.removeEventListener("updateSkill", handleUpdateSkill);
  }, [updateSkill]);

  const initialNodes = useMemo(() => calculateLayout(skillsData, isTimelineView), [skillsData, isTimelineView]);
  const initialEdges = useMemo(
    () =>
      skillsData.flatMap((skill:any) => {
        const prereqArray = (skill.prerequisites || "").split(",").filter(Boolean);
        return prereqArray.map((prereq:any) => ({
          id: `e${prereq}-${skill.id}`,
          source: prereq,
          target: skill.id,
          type: "custom",
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed, color: getCategoryColor(skillsData.find((s:any) => s.id === prereq)?.category || "core") },
          style: { stroke: getCategoryColor(skillsData.find((s:any) => s.id === prereq)?.category || "core"), strokeWidth: 2 },
        }));
      }),
    [skillsData]
  );

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    rfInstance?.fitView({ padding: 0.5 });
  }, [initialNodes, initialEdges, setNodes, setEdges, rfInstance]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const target = _.target as HTMLElement;
      if (target.closest("textarea, button")) return;
      setNodes((nds) => nds.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, expanded: !n.data.expanded } } : n)));
    },
    [setNodes]
  );

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
        🚀 Interactive Learning Roadmap
      </h1>
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setIsTimelineView(false)}
          className={`px-4 py-2 rounded-lg transition-all ${!isTimelineView ? "bg-blue-600 shadow-lg shadow-blue-500/50" : "bg-gray-700 hover:bg-gray-600"}`}
        >
          🌳 Tree View
        </button>
        <button
          onClick={() => setIsTimelineView(true)}
          className={`px-4 py-2 rounded-lg transition-all ${isTimelineView ? "bg-blue-600 shadow-lg shadow-blue-500/50" : "bg-gray-700 hover:bg-gray-600"}`}
        >
          ⏳ Timeline View
        </button>
      </div>
      <div className="h-[calc(100vh-180px)] w-full bg-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeClick={onNodeClick}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={setRfInstance}
          fitView
          fitViewOptions={{ padding: 0.5 }}
          nodesDraggable
        >
          {/* <Controls className="bg-gray-700 p-1 rounded-lg shadow-lg" showInteractive={false} /> */}
        </ReactFlow>
      </div>
      <div className="mt-6 flex gap-4 text-sm">
        {Object.entries({ frontend: "Frontend", backend: "Backend", core: "Core", fullstack: "Full-Stack" }).map(([category, label]) => (
          <div key={category} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: getCategoryColor(category as Skill["category"]) }} />
            <span className="text-gray-300">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}