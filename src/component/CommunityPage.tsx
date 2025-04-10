
//   import React from 'react';
  
//   export const UserCard: React.FC<{ user: UserProfile; onClick: (id: string) => void }> = ({ user, onClick }) => {
//     return (
//       <div 
//         className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl 
//                   transition-all duration-300 transform hover:-translate-y-2 
//                   cursor-pointer border border-gray-100"
//         onClick={() => onClick(user.id)}
//       >
//         <div className="flex items-center space-x-4">
//           <img 
//             src={user.avatar} 
//             alt={user.username} 
//             className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
//           />
//           <div>
//             <h3 className="text-xl font-bold text-gray-800">{user.username}</h3>
//             <p className="text-blue-600 font-medium">{user.jobRole}</p>
//           </div>
//         </div>
        
//         <div className="mt-4">
//           <div className="flex flex-wrap gap-2">
//             {user.stack.map((tech) => (
//               <span 
//                 key={tech}
//                 className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
//               >
//                 {tech}
//               </span>
//             ))}
//           </div>
          
//           <div className="mt-4">
//             <h4 className="text-gray-700 font-semibold">Achievements:</h4>
//             <ul className="list-disc list-inside text-gray-600">
//               {user.achievements.map((achievement, index) => (
//                 <li key={index}>{achievement}</li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//     );
//   };
  
//   // components/UserModal.tsx
//   import React from 'react';
// import UserProfile from '../types/Community';
  
//   const UserModal: React.FC<{ user: UserProfile; onClose: () => void }> = ({ user, onClose }) => {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-xl p-8 max-w-md w-full m-4">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
//             <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//               ✕
//             </button>
//           </div>
          
//           <img 
//             src={user.avatar} 
//             alt={user.username} 
//             className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-500"
//           />
          
//           <p className="text-center text-blue-600 font-medium mb-2">{user.jobRole}</p>
//           <p className="text-center text-gray-600 mb-4">{user.bio}</p>
          
//           <div className="space-y-4">
//             <div>
//               <h4 className="font-semibold text-gray-700">Tech Stack:</h4>
//               <div className="flex flex-wrap gap-2">
//                 {user.stack.map((tech) => (
//                   <span key={tech} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
//                     {tech}
//                   </span>
//                 ))}
//               </div>
//             </div>
            
//             <div>
//               <h4 className="font-semibold text-gray-700">Achievements:</h4>
//               <ul className="list-disc list-inside text-gray-600">
//                 {user.achievements.map((achievement, index) => (
//                   <li key={index}>{achievement}</li>
//                 ))}
//               </ul>
//             </div>
            
//             <a
//               href={`mailto:${user.email}`}
//               className="block w-full text-center py-3 bg-gradient-to-r from-blue-500 to-purple-600 
//                         text-white rounded-lg hover:from-blue-600 hover:to-purple-700 
//                         transition-all duration-300"
//             >
//               Connect via Email
//             </a>
//           </div>
//         </div>
//       </div>
//     );
//   };
  