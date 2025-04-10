// components/Navbar.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // For React Router (use 'next/link' for Next.js)
import { motion, AnimatePresence } from 'framer-motion';

// Placeholder logo (replace with your actual logo image)
const logoPlaceholder = 'https://via.placeholder.com/40'; // Replace with your logo URL

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // For mobile menu toggle
  const location = useLocation(); // To highlight active route

  // Animation variants for navbar
  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // Animation variants for mobile menu
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
  };

  // Navigation links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Job Tracking', path: '/job-tracking' },
    { name: 'Community', path: '/community' },
    { name: 'Personalized Roadmap', path: '/InteractiveRoadmap' },
    { name: 'Progress Tracking', path: '/SkillTracker' },
  ];

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 backdrop-blur-md z-50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and App Name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              {/* <img
                src={logoPlaceholder}
                alt="CareerBoost Logo"
                className="h-10 w-10 rounded-full object-cover"
              /> */}
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                CareerPathAI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-gray-300 hover:text-white transition-colors duration-300 
                  ${location.pathname === link.path ? 'text-white' : ''}`}
              >
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  className="inline-block"
                >
                  {link.name}
                </motion.span>
                {/* Underline effect on hover */}
                <motion.div
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              <motion.svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </motion.svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="md:hidden bg-gray-800 bg-opacity-90"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)} // Close menu on link click
                    className={`block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md 
                      ${location.pathname === link.path ? 'text-white bg-gray-700' : ''}`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;