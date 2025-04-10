import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { jobs } from "../types/Webscrap-company";
import { Link ,useNavigate} from "react-router-dom";
type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  posted: string;
  requirements: string;
  skills: string[];
  description: string;
  jobLink:string,
};

const categories = ["Frontend", "Backend", "Full Stack", "Data Science", "DevOps", "Mobile Development"];

export default function JobBoard() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>(categories);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showIntro, setShowIntro] = useState(true); // New state for intro animation
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.7]);
  const navigate = useNavigate(); // Add useNavigate for programmatic navigation
// 
const [showResumePrompt, setShowResumePrompt] = useState(false); // New state for resume prompt
  const [resume, setResume] = useState<File | null>(null); // New state for resume
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref for file input

  // Check for resume in localStorage on mount
  useEffect(() => {
    const storedResume = localStorage.getItem('resume');
    if (storedResume) {
      const byteString = atob(storedResume.split(',')[1]);
      const mimeString = storedResume.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      const storedFile = new File([blob], "resume.pdf", { type: mimeString });
      setResume(storedFile);
    }
  }, []);

  // 
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(true);
    if (query.length > 0) {
      const filteredSuggestions = categories.filter((category) =>
        category.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions(categories);
    }
  };

  const handleCategorySelect = (category: string) => {
    setSearchQuery(category);
    setShowSuggestions(false);
  };

  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = job.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  // 
  const handleGenerateRoadmap = (job: Job) => {
    const jobDesc = `Requirements: ${job.requirements}\nSkills: ${job.skills.join(", ")}`;
    navigate("/roadmap", { state: { jobDesc } });
  };

  // 
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
      <div className="container mx-auto pt-24 px-4 flex flex-col md:flex-row gap-6">
        {/* Job List Section */}
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-1/3 h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-900"
        >
          <div className="space-y-6 p-6 bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/30">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="🔍 Search the future..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={handleBlur}
                  className="w-full p-4 bg-black/40 border border-purple-500/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                />
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 right-0 mt-2 bg-black/80 border border-purple-500/50 rounded-xl shadow-2xl z-20 overflow-hidden"
                    >
                      {suggestions.map((suggestion, index) => (
                        <motion.li
                          key={index}
                          whileHover={{ backgroundColor: "rgba(147, 51, 234, 0.2)" }}
                          onClick={() => handleCategorySelect(suggestion)}
                          className="p-3 text-white cursor-pointer transition-colors"
                        >
                          {suggestion}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
              <input
                type="text"
                placeholder="📍 Location filter..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full p-4 bg-black/40 border border-purple-500/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
              />
            </motion.div>

            <div className="space-y-4">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)" }}
                  className={`p-5 rounded-xl cursor-pointer bg-black/30 border border-purple-500/20 transition-all duration-300 ${
                    selectedJob?.id === job.id ? "bg-purple-500/20 border-purple-500" : "hover:bg-purple-500/10"
                  }`}
                  onClick={() => setSelectedJob(job)}
                >
                  <h3 className="text-xl font-bold text-white">{job.title}</h3>
                  <p className="text-purple-200">{job.company}</p>
                  <div className="flex items-center gap-3 mt-3 text-sm text-gray-300">
                    <span>{job.location}</span>
                    <span className="w-1 h-1 bg-purple-500 rounded-full" />
                    <span>{job.posted}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                      {job.type}
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                      {job.experience}
                    </span>
                  </div>
                  <p className="text-sm mt-2 text-white font-semibold">{job.salary}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Section: Intro Animation + Job Details */}
        <div className="flex-1 h-[calc(100vh-10rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-900 relative md:block hidden">
          <AnimatePresence>
            {showIntro && !selectedJob && (
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 z-10"
                onClick={() => setShowIntro(false)} // Click to skip intro
              >
                <motion.h1
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 bg-clip-text text-transparent"
                >
                  Get Your Dream Job
                </motion.h1>
                <motion.p
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="text-xl text-gray-300 mt-4"
                >
                  Explore Opportunities Now
                </motion.p>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="mt-6 w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-2xl">💼</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedJob && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="p-8 bg-black/20 backdrop-blur-xl rounded-2xl border border-purple-500/30"
              >
                <div className="max-w-2xl mx-auto text-white space-y-8">
                  <motion.button
                    whileHover={{ x: -5 }}
                    onClick={() => setSelectedJob(null)}
                    className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors"
                  >
                    <span className="text-2xl">←</span>
                    <span>Back to Jobs</span>
                  </motion.button>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                      {selectedJob.title}
                    </h1>
                    <div className="flex items-center gap-4 mt-4 text-lg">
                      <span className="text-purple-200">{selectedJob.company}</span>
                      <span className="w-1 h-1 bg-purple-500 rounded-full" />
                      <span className="text-gray-300">{selectedJob.location}</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="grid grid-cols-2 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {[
                      { label: "Salary", value: selectedJob.salary },
                      { label: "Job Type", value: selectedJob.type },
                      { label: "Experience", value: selectedJob.experience },
                      { label: "Posted", value: selectedJob.posted },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        className="p-4 bg-black/40 rounded-xl border border-purple-500/20"
                      >
                        <h3 className="text-sm text-gray-400">{item.label}</h3>
                        <p className="text-lg font-semibold text-white">{item.value}</p>
                      </motion.div>
                    ))}
                  </motion.div>

                  <div className="space-y-8">
                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h2 className="text-2xl font-bold text-purple-300">Description</h2>
                      <p className="text-gray-200 mt-2">{selectedJob.description}</p>
                    </motion.section>

                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h2 className="text-2xl font-bold text-purple-300">Requirements</h2>
                      <p className="text-gray-200 mt-2">{selectedJob.requirements}</p>
                    </motion.section>

                    <motion.section
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h2 className="text-2xl font-bold text-purple-300">Skills Required</h2>
                      <div className="flex flex-wrap gap-3 mt-3">
                        {selectedJob.skills.map((skill) => (
                          <motion.span
                            key={skill}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="px-4 py-2 bg-purple-500/20 text-purple-200 rounded-full border border-purple-500/30"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </motion.section>
                    <a href={selectedJob.jobLink} target="_blank" className="mb-11">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)" }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg"
                      // onClick={() => alert("Application submitted!")}
                    >
                      Apply Now
                    </motion.button>
                    </a>
                    {/* <Link to="/roadmap" target="_blank"> */}
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)" }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg mt-7"
                      // onClick={() => alert("Application submitted!")}
                      onClick={() => handleGenerateRoadmap(selectedJob)}
                    >
                      Generate Your Personalized Roadmap
                    </motion.button>
                    {/* </Link> */}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Detail View */}
        < 
   
AnimatePresence>
          {selectedJob && (
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              className="md:hidden fixed inset-0 bg-black/90 p-6 overflow-y-auto z-50"
            >
              <div className="text-white space-y-6">
                <motion.button
                  whileHover={{ x: -5 }}
                  onClick={() => setSelectedJob(null)}
                  className="flex items-center gap-2 text-purple-300 hover:text-white"
                >
                  <span className="text-2xl">←</span>
                  <span>Back</span>
                </motion.button>

                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  {selectedJob.title}
                </h1>
                <div className="space-y-6">
                  <p className="text-purple-200">{selectedJob.company} • {selectedJob.location}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-black/40 rounded-xl">
                      <h3 className="text-xs text-gray-400">Salary</h3>
                      <p className="text-sm font-semibold">{selectedJob.salary}</p>
                    </div>
                    <div className="p-3 bg-black/40 rounded-xl">
                      <h3 className="text-xs text-gray-400">Type</h3>
                      <p className="text-sm font-semibold">{selectedJob.type}</p>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-purple-300">Description</h2>
                    <p className="text-gray-200">{selectedJob.description}</p>
                  </div>
                  <motion.button
                    // whileHover={{ scale: 1.05 }}
                    // whileTap={{ scale: 0.95 }}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold"
                    // onClick={() => alert("Application submitted!")}
                  >
                    <a href={selectedJob.jobLink} target="_blank">Apply Now</a>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold"
                    onClick={() => alert("Application submitted!")}
                  >
                    Generate Your personalized roadmap
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500 rounded-full opacity-20"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{
              y: [null, Math.random() * window.innerHeight - 100],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}