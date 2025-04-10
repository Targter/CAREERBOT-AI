import { useState } from "react";
import Confetti from "react-confetti";

const jobSkills = [
  "React.js",
  "Html Css",
  "Javascript",
  "Node.js",
  "Full Stack",
  "GraphQL",
  "Docker",
];

export default function SkillTracker() {
  const [completedSkills, setCompletedSkills] = useState<string[]>([]);

  // Toggle Skill Completion
  const toggleSkill = (skill: string) => {
    setCompletedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill) // Remove if already completed
        : [...prev, skill] // Add if newly completed
    );
  };

  // Calculate Progress Percentage
  const progress = (completedSkills.length / jobSkills.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-8 bg-red-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">
          🏆 Skill Progress Tracker
        </h1>

        {/* Progress Bar Section */}
        <div className="relative w-full bg-gray-600 h-6 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-green-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Skill List */}
        <ul className="space-y-3">
          {jobSkills.map((skill) => (
            <li
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`cursor-pointer flex items-center justify-between p-4 text-lg font-medium rounded-lg transition-all duration-300
                ${
                  completedSkills.includes(skill)
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
            >
              <span>{skill}</span>
              {completedSkills.includes(skill) ? "✅" : "🔲"}
            </li>
          ))}
        </ul>
      </div>

      {/* 🎉 Confetti Effect when 100% Progress */}
      {progress === 100 && <Confetti />}
    </div>
  );
}
