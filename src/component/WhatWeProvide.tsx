// pages/features.tsx
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion'; // For animations
import { useInView } from 'react-intersection-observer'; // For scroll animations

// Define the Feature type
interface Feature {
  title: string;
  description: string;
  icon: string; // Placeholder for icon (you can use SVGs or icon libraries like Heroicons)
  points: string[];
}

const Features: React.FC = () => {
  // Sample feature data
  const features: Feature[] = [
    {
      title: 'Resume Analysis',
      description: 'Upload your resume and get instant insights about your skills, experience, qualifications.',
      icon: '📄', // Replace with a real icon
      points: ['Advanced skills extraction', 'Experience categorization', 'Secure data storage'],
    },
    {
      title: 'Job Profile Matching',
      description: 'Find jobs that perfectly match your skills and experience with our intelligent matching algorithms.',
      icon: '🔍',
      points: ['Smart skills compatibility', '500+ job profiles', 'Detailed match scoring'],
    },
    {
      title: 'Personalized Roadmaps',
      description: 'Get custom career development plans that bridge the gap between your current skills and job requirements.',
      icon: '📈',
      points: ['Step-by-step learning paths', 'Resource recommendations', 'Timeline estimations'],
    },
    {
      title: 'Progress Tracking',
      description: 'Monitor your skill development and career growth with detailed tracking and analytics.',
      icon: '📊',
      points: ['Visual progress charts', 'Achievement milestones', 'Regular progress reports'],
    },
    {
      title: 'Career Community',
      description: 'Connect with professionals in your field, share experiences, and get mentorship from industry experts.',
      icon: '👥',
      points: ['Discussion forums', 'Mentorship connections', 'Industry networking'],
    },
    {
      title: 'Advanced Job Matching',
      description: 'Customize your job search with detailed filters and receive instant notifications for matching positions.',
      icon: '💼',
      points: ['Custom search filters', 'Job alert notifications', 'Salary insights and comparisons'],
    },
  ];

  // Animation for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-whtie via-white to-purple-200 text-white py-16">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Powerful Features for Your Career Growth
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
          Everything you need to analyze your resume, find matching jobs, and develop your skills with personalized roadmaps.
        </p>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} variants={cardVariants} />
          ))}
        </div>
      </div>

      {/* Background Stars Effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-50 animate-twinkle"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Feature Card Component with Animation
const FeatureCard: React.FC<{ feature: Feature; variants: any }> = ({ feature, variants }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className="relative bg-gray-800 bg-opacity-80 backdrop-blur-md rounded-xl p-6 
                 shadow-lg hover:shadow-2xl transition-all duration-500 
                 transform hover:-translate-y-2 border border-gray-700 
                 group overflow-hidden"
    >
      {/* Glowing Border Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 
                      transition-all duration-500 rounded-xl" />

      {/* Card Content */}
      <div className="flex items-center space-x-4">
        <div className="text-4xl">{feature.icon}</div>
        <h3 className="text-2xl font-bold text-blue-400">{feature.title}</h3>
      </div>
      <p className="mt-3 text-gray-300">{feature.description}</p>
      <ul className="mt-4 space-y-2">
        {feature.points.map((point, index) => (
          <li key={index} className="flex items-center space-x-2">
            <span className="text-green-400">✔</span>
            <span className="text-gray-200">{point}</span>
          </li>
        ))}
      </ul>

      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 
                      group-hover:opacity-20 transition-opacity duration-500 rounded-xl" />
    </motion.div>
  );
};

export default Features;