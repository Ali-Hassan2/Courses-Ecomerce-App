import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import book1 from '../assets/csone.jpg';
import book2 from '../assets/cstwo.jpg';
import book3 from '../assets/csthree.jpg';

const images = [book1, book2, book3];

function Landing() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 md:px-12 py-10 flex flex-col lg:flex-row items-center gap-8">
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Your Journey to Success <br /> Starts with the Right Course.
        </motion.h1>

        <motion.p
          className="text-lg text-gray-300 max-w-md"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Explore top-rated online courses crafted for your career growth.
        </motion.p>

        <motion.button
          className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-xl text-white font-semibold w-fit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Courses
        </motion.button>
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <motion.img
          key={current}
          src={images[current]}
          alt="Course Slide"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[700px] h-[300px] sm:h-[400px] object-cover rounded-2xl border-4 border-black shadow-[0_0_60px_rgba(0,0,255,0.3)]"
        />
      </div>
    </div>
  );
}

export default Landing;
