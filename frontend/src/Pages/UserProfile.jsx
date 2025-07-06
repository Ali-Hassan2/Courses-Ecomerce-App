import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { UserContext } from '../../Utils/userContext';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const buttonAnim = {
  hover: {
    scale: 1.05,
    backgroundColor: '#dc2626', // red-600
    transition: { type: 'spring', stiffness: 300 },
  },
};

const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [userInfo, setUserInfo] = useState(user || null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    let timeoutId;

    if (!token) {
      toast.error('Kindly login first to access this page.');

      timeoutId = setTimeout(() => {
        navigate('/login');
      }, 3000);
    }

    if (!userInfo) {
      const localUser = localStorage.getItem('user');
      if (localUser) {
        setUserInfo(JSON.parse(localUser));
      }
    }

    return () => clearTimeout(timeoutId);
  }, [navigate, userInfo]);

  const logout = () => {
    if (!userInfo) return;

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully.');
    navigate('/login');
  };

  if (!userInfo) {
    return (
      <motion.div
        className="text-center py-10 text-red-500 text-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Loading user info...
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-800 to-gray-900 flex items-center justify-center px-4"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <motion.div
        className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-gray-800 dark:text-white"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700 dark:text-purple-400">
          Welcome, {userInfo.name} 
        </h2>

        <div className="space-y-4 text-lg">
          <div className="flex justify-between">
            <span className="font-semibold">Name:</span>
            <span>{userInfo.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Email:</span>
            <span>{userInfo.email}</span>
          </div>
        </div>

        <motion.button
          onClick={logout}
          className="mt-8 w-full py-3 rounded-lg bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 transition"
          variants={buttonAnim}
          whileHover="hover"
        >
          Logout
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default UserProfile;
