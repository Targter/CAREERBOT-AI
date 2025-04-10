import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

// Skill type definition
interface Skill {
  catogory: string;
  difficulty: string;
  discription: string;
  important_topics: string[];
  order: number;
  prerequisites: string;
  skill: string;
}

const SkillCosmosNavigator: React.FC = () => {
  const [completedSkills, setCompletedSkills] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [nextSkill, setNextSkill] = useState<Skill | null>(null);
  const [skillsData, setSkillsData] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [showForm, setShowForm] = useState(true);
  const [hasLocalResume, setHasLocalResume] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // For redirection

  useEffect(() => {
    const state = location.state as { jobDesc?: string } | null;
    if (state?.jobDesc) {
      setJobDesc(state.jobDesc);
      fetchSkills(state.jobDesc);
    }
    checkLocalResume(); // Check for local resume on mount
  }, [location.state]);

  // Check if resume exists on localhost
  const checkLocalResume = async () => {
    try {
      const response = await fetch("http://localhost:3000/resume.pdf"); // Adjust URL as needed
      if (response.ok) {
        const blob = await response.blob();
        setPdfFile(new File([blob], "resume.pdf", { type: "application/pdf" }));
        setHasLocalResume(true);
      }
    } catch (error) {
      console.log("No resume found on localhost:", error);
      setHasLocalResume(false);
    }
  };

  // Fetch skills from API
  const fetchSkills = async (overrideJobDesc?: string) => {
    if (!hasLocalResume && !pdfFile) {
      alert("Please upload a PDF resume!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (pdfFile) formData.append("pdf", pdfFile);
      formData.append("job_desc", overrideJobDesc || jobDesc);

      const response = await fetch("https://api-882701280393.us-central1.run.app/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("API request failed");
      const data = await response.json();
      setSkillsData(data.skills_needed);
      setShowForm(false);
    } catch (error) {
      console.error("Error fetching skills:", error);
      alert("Failed to load roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Determine next skill
  const getNextSkill = (completed: string[], skills: Skill[]): Skill | null => {
    const incompleteSkills = skills.filter((s) => !completed.includes(s.skill));
    for (const skill of incompleteSkills) {
      const prereqs = skill.prerequisites.split(", ").map((p) => p.trim());
      if (prereqs.every((p) => p === "None" || completed.includes(p) || p === "Basic programming knowledge")) {
        return skill;
      }
    }
    return null;
  };

  useEffect(() => {
    if (skillsData.length > 0) {
      setNextSkill(getNextSkill(completedSkills, skillsData));
    }
  }, [completedSkills, skillsData]);

  const categories = Array.from(new Set(skillsData.map((s) => s.catogory)));

  const handleNewRoadmap = () => {
    setSkillsData([]);
    setCompletedSkills([]);
    setNextSkill(null);
    setSelectedSkill(null);
    setPdfFile(null);
    setJobDesc("");
    setShowForm(true);
  };

  // Redirect to test or practice pages
//   const handleTestKnowledge = () => navigate("/test");
//   const handlePracticeSkills = () => navigate("/practice");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A23] to-[#1A1A2E] text-white font-sans overflow-hidden">
      {/* Header */}
      <header className="p-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-bold text-cyan-400"
        >
          Skill Cosmos Navigator
        </motion.h1>
        <p className="mt-2 text-lg text-gray-300">Your Journey to Mastery Awaits</p>
      </header>

      {/* Input Form */}
      <AnimatePresence>
        {showForm && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-6 flex flex-col items-center"
          >
            {!hasLocalResume && (
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                className="mb-4 text-gray-300"
              />
            )}
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Enter job description..."
              className="w-96 h-32 p-3 mb-4 bg-gray-800 text-white rounded-lg resize-none shadow-md"
            />
            <button
              onClick={() => fetchSkills()}
              className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all"
            >
              Generate Roadmap
            </button>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Loading Animation */}
      {loading && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-20 h-20 border-4 border-t-cyan-500 border-gray-700 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}

      {/* Roadmap Galaxy */}
      {!loading && skillsData.length > 0 && (
        <section className="relative h-[calc(100vh-200px)] flex flex-col items-center justify-center">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {skillsData.map((skill, i) => {
              const next = skillsData.find((s) => s.order > skill.order && s.prerequisites.includes(skill.skill));
              if (next) {
                const fromX = 100 + i * 150;
                const toX = 100 + skillsData.indexOf(next) * 150;
                const fromY = 200 + (skill.catogory.charCodeAt(0) % 3) * 100;
                const toY = 200 + (next.catogory.charCodeAt(0) % 3) * 100;
                return (
                  <motion.path
                    key={`${skill.skill}-${next.skill}`}
                    d={`M${fromX},${fromY} Q${(fromX + toX) / 2},${(fromY + toY) / 2 - 50} ${toX},${toY}`}
                    stroke={completedSkills.includes(skill.skill) ? "#00FF00" : "#00D4FF"}
                    strokeWidth="3"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: i * 0.3 }}
                  />
                );
              }
              return null;
            })}
          </svg>

          {categories.map((category, index) => (
            <motion.div
              key={category}
              className="relative mb-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.4, duration: 0.8 }}
            >
              <h2 className="text-2xl font-semibold text-yellow-300 text-center mb-6">{category}</h2>
              <div className="flex justify-center space-x-12">
                {skillsData
                  .filter((skill) => skill.catogory === category)
                  .map((skill) => (
                    <motion.div
                      key={skill.skill}
                      className={`w-28 h-28 rounded-full flex items-center justify-center cursor-pointer shadow-xl ${
                        completedSkills.includes(skill.skill)
                          ? "bg-gradient-to-br from-green-500 to-green-800"
                          : nextSkill?.skill === skill.skill
                          ? "bg-gradient-to-br from-yellow-500 to-yellow-800 animate-pulse"
                          : "bg-gradient-to-br from-cyan-500 to-blue-800"
                      }`}
                      whileHover={{ scale: 1.15, boxShadow: "0 0 25px rgba(0, 255, 255, 0.9)" }}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      onClick={() => setSelectedSkill(skill)}
                    >
                      <span className="text-sm text-center font-medium">{skill.skill}</span>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
          <a href="https://quizz4.streamlit.app/" target="_blank">
          <motion.button
            //   onClick={handleTestKnowledge}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Test Knowledge
            </motion.button>
          </a>

          <a href="https://leetsc.streamlit.app/" target="_blank">
            <motion.button
            //   onClick={handlePracticeSkills}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Practice Skills
            </motion.button>
            </a>
            <motion.button
              onClick={handleNewRoadmap}
              className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              New Roadmap
            </motion.button>
          </div>

          {nextSkill && (
            <p className="mt-4 text-sm text-yellow-300 text-center">
              Next Suggested Skill: <span className="font-semibold">{nextSkill.skill}</span>
            </p>
          )}
        </section>
      )}

      {/* Skill Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              className="bg-gray-900 p-8 rounded-lg max-w-lg w-full shadow-2xl"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-cyan-400">{selectedSkill.skill}</h2>
              <p className="mt-2 text-gray-300">{selectedSkill.discription}</p>
              <p className="mt-2 text-sm text-gray-400">Difficulty: {selectedSkill.difficulty}</p>
              <p className="mt-2 text-sm text-gray-400">Prerequisites: {selectedSkill.prerequisites}</p>
              <ul className="mt-4 list-disc list-inside text-gray-200">
                {selectedSkill.important_topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
              <div className="mt-6 flex space-x-4">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  onClick={() => {
                    if (!completedSkills.includes(selectedSkill.skill)) {
                      setCompletedSkills([...completedSkills, selectedSkill.skill]);
                    }
                  }}
                >
                  Mark as Completed
                </button>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  onClick={() => setSelectedSkill(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillCosmosNavigator;