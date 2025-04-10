// pages/Home.tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom'; // For React Router (use 'next/link' for Next.js)
import JobBoard from './JobSearch';
import Features from './WhatWeProvide';
import Community from '../Page.tsx/Community';
import { useRoadmapStore } from '../hooks/roadmapStore';

function Home() {
  const [resume, setResume] = useState<File | null>(null);
  const [careerTitle, setCareerTitle] = useState("");
  const [show, setShow] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmapUrl, setRoadmapUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setResume(e.target.files[0]);
  //   }
  // };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResume(file);
      // Store in localStorage
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          localStorage.setItem('resume', event.target.result as string);
          setShow(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const handleUpload = () => {
    if (resume) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          localStorage.setItem('resume', e.target.result as string);
        }
      };
      reader.readAsDataURL(resume);
      setShow(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume || !careerTitle) return;

    setIsGenerating(true);
    setRoadmapUrl(null);

    // Prepare FormData
    const formData = new FormData();
    formData.append('pdf', resume);
    formData.append('job_desc', careerTitle);

    try {
      // Simulate API call (replace with your actual API endpoint)
      const response = await fetch('https://api-882701280393.us-central1.run.app/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate roadmap');
      }
      
      const data = await response.json();
      console.log(data)
      // Assuming the API returns a URL to the roadmap
      // Example response: { roadmapUrl: "/roadmap/123" }
      // const { roadmapUrl } = data;

      // Simulate a delay for the "generating" effect
      setTimeout(() => {
        setIsGenerating(false);
        setRoadmapUrl('/InteractiveRoadmap'); // Fallback to a default URL
      }, 3000); // 3-second delay for demo purposes\

      useRoadmapStore.getState().setRoadmapData(data );
    } catch (error) {
      console.error('Error generating roadmap:', error);
      setIsGenerating(false);
      setRoadmapUrl(null);
      alert('Failed to generate roadmap. Please try again.');
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.error("Autoplay blocked:", err));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="container mx-auto p-8 flex flex-col lg:flex-row items-center gap-12"
      >
        {/* Left Section: Resume & Roadmap */}
        <div className="w-full lg:w-1/2 space-y-8">
          {/* Resume Upload */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-black/30 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/30 shadow-2xl"
          >
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-6">
              📄 Upload Your Resume
            </h1>
            <label
              htmlFor="resume-upload"
              className="border-2 border-dashed border-purple-500/50 p-8 flex flex-col items-center justify-center text-gray-400 rounded-xl cursor-pointer hover:border-purple-400 hover:text-white transition-all duration-300"
            >
              {resume ? (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-purple-400 font-semibold"
                >
                  {resume.name}
                </motion.span>
              ) : (
                <span>Drag & Drop or Click to Upload</span>
              )}
              <input 
                type="file" 
                id="resume-upload" 
                accept=".pdf" 
                onChange={handleFileChange} 
                className="hidden" 
              />
            </label>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(147, 51, 234, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpload}
              disabled={!resume}
              className={`mt-6 w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
                resume ? "bg-gradient-to-r from-purple-500 to-indigo-500" : "bg-gray-700 cursor-not-allowed"
              }`}
            >
              Upload Resume
            </motion.button>
          </motion.div>

          {/* Career Roadmap Form */}
          <AnimatePresence>
            {show && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="bg-black/30 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/30 shadow-2xl"
              >
                <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-6">
                  🚀 Career Roadmap
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    value={careerTitle}
                    onChange={(e) => setCareerTitle(e.target.value)}
                    placeholder="Enter your desired career title"
                    className="w-full px-4 py-3 bg-black/40 border border-purple-500/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(147, 51, 234, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={!careerTitle}
                    className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
                      careerTitle ? "bg-gradient-to-r from-purple-500 to-indigo-500" : "bg-gray-700 cursor-not-allowed"
                    }`}
                  >
                    Generate Roadmap
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Roadmap Generation Feedback */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="bg-black/30 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/30 shadow-2xl text-center"
              >
                <h2 className="text-2xl font-bold text-purple-400 mb-4">
                  Your roadmap is generating...
                </h2>
                <motion.div
                  className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Roadmap URL Display */}
          <AnimatePresence>
            {roadmapUrl && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="bg-black/30 backdrop-blur-xl p-8 rounded-2xl border border-purple-500/30 shadow-2xl text-center"
              >
                <h2 className="text-2xl font-bold text-purple-400 mb-4">
                  Your Roadmap is Ready!
                </h2>
                <p className="text-gray-300 mb-4">
                  Click the link below to view your personalized career roadmap.
                </p>
                <Link
                  to={roadmapUrl}
                  className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-300"
                >
                  View Your Roadmap
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Section: Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full lg:w-1/2 flex items-center justify-center"
        >
          <div className="relative">
            <motion.video
              ref={videoRef}
              src="/ab.mp4"
              className="rounded-[60px] w-[600px] h-[450px] object-cover shadow-2xl border border-purple-500/30"
              loop
              muted
              playsInline
              autoPlay
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-[60px]"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="absolute bottom-4 left-4 text-white text-lg font-semibold">
                Explore Your Future
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* What We Are Providing */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16"
      >
        <Features />
      </motion.div>

      {/* Job Board Section */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16"
      >
        <JobBoard />
      </motion.div>

      {/* Community Section */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16"
        id='#community'
      >
        <Community />
      </motion.div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
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
      <a href="https://ab-va.vercel.app/">
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [0, -10, 0] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    className="fixed bottom-11 right-11 w-24 h-24 rounded-full bg-[url('/robo.jpg')] bg-cover bg-center bg-red-500"
  />
</a>
    </div>
  );
}

export default Home;