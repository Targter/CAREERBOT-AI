import React from 'react';
import UserProfile from '../types/Community';

export  const UserCard: React.FC<{ user: UserProfile; onClick: (id: string) => void }> = ({ user, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl 
                transition-all duration-300 transform hover:-translate-y-2 
                cursor-pointer border border-gray-100"
      onClick={() => onClick(user.id)}
    >
      <div className="flex items-center space-x-4">
        <img 
          src={user.avatar} 
          alt={user.username} 
          className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
        />
        <div>
          <h3 className="text-xl font-bold text-gray-800">{user.username}</h3>
          <p className="text-blue-600 font-medium">{user.jobRole}</p>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {user.stack.map((tech) => (
            <span 
              key={tech}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
        
        <div className="mt-4">
          <h4 className="text-gray-700 font-semibold">Achievements:</h4>
          <ul className="list-disc list-inside text-gray-600">
            {user.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};