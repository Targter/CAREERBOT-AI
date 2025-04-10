// pages/Community.tsx
import React, { useState } from 'react';
// import { UserProfile } from '../types/community';
import UserProfile from '../types/Community';
// import StackFilter from '../components/StackFilter';
// import { StackFilter } from '../component/StackFilter';
import { StackFilter } from '../component/StackFilter';
// import {UserCard} from '../components/UserCard';
// import { UserCard } from '../component/CommunityPage';
import { UserCard } from '../component/UserCard';
// import {UserModal} from '../components/UserModal';
import { UserModal } from '../component/UserModel';


const Community: React.FC = () => {
  const [selectedStack, setSelectedStack] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Sample data (replace with your actual data source)
  const users: UserProfile[] = [
    {
      id: '1',
      username: 'Gaurav',
      email: 'gaurav@mail.com',
      stack: ['Data Science', 'Visualization Tools', 'Deep Learning', 'RAGs'],
      achievements: ['Developed AI models', 'Published research on RAGs'],
      jobRole: 'AI Researcher',
      avatar: 'image.png',
      bio: 'Exploring the future of AI and deep learning.'
    },
    {
      id: '2',
      username: 'Abhay Bansal',
      email: 'abhay@mail.com',
      stack: ['Frontend', 'React', 'Full Stack', 'Node.js', 'MongoDB', 'Express.js'],
      achievements: ['Built 5+ production apps', 'React Contributor', 'Led Full Stack Projects'],
      jobRole: 'Senior Full Stack Developer',
      avatar: 'image.png',
      bio: 'Passionate about creating scalable and efficient web applications.'
    },
    {
      id: '3',
      username: 'Yash Dhiman',
      email: 'yash@mail.com',
      stack: ['UI/UX Design', 'Figma', 'Adobe XD', 'Front-end Technologies', 'Interaction Design'],
      achievements: ['Designed award-winning UI', 'Contributed to open-source design systems'],
      jobRole: 'Product Designer',
      avatar: 'image.png',
      bio: 'Bringing intuitive and aesthetic design to digital products.'
    },
    {
      id: '4',
      username: 'Saurav',
      email: 'saurav@mail.com',
      stack: ['Backend Development', 'Django', 'PostgreSQL', 'Redis'],
      achievements: ['Optimized large-scale databases', 'Built high-performance APIs'],
      jobRole: 'Backend Engineer',
      avatar: 'image.png',
      bio: 'Building robust and scalable backend architectures.'
    },
    {
      id: '5',
      username: 'Asmit Rana',
      email: 'asmit@mail.com',
      stack: ['DevOps', 'AWS', 'Docker', 'Kubernetes'],
      achievements: ['Implemented CI/CD pipelines', 'Managed cloud infrastructures'],
      jobRole: 'DevOps Engineer',
      avatar: 'image.png',
      bio: 'Ensuring seamless deployment and infrastructure management.'
    }
  ];

  const filteredUsers = selectedStack
    ? users.filter(user => user.stack.includes(selectedStack))
    : users;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Our Amazing Community
        </h1>
        
        <StackFilter onFilter={setSelectedStack} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard 
              key={user.id} 
              user={user} 
              onClick={(id) => setSelectedUser(users.find(u => u.id === id) || null)}
            />
          ))}
        </div>

        {selectedUser && (
          <UserModal 
            user={selectedUser} 
            onClose={() => setSelectedUser(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Community;