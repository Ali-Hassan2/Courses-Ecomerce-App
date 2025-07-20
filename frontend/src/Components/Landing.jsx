import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import book1 from '../assets/csone.jpg';
import book2 from '../assets/cstwo.jpg';
import book3 from '../assets/csthree.jpg';

const images = [book1, book2, book3];

export default function Landing() {
  const [current, setCurrent] = useState(0);

  /* ---------- Helpers ---------- */
  const next = useCallback(
    () => setCurrent((p) => (p + 1) % images.length),
    []
  );
  const prev = useCallback(
    () => setCurrent((p) => (p - 1 + images.length) % images.length),
    []
  );

  /* ---------- Autoplay ---------- */
  useEffect(() => {
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [next]);

  /* ---------- Variants ---------- */
  const slide = {
    enter: { opacity: 0, scale: 0.95 },
    center: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
    exit: { opacity: 0, scale: 1.05, transition: { duration: 0.4 } },
  };

  return (
    <section className="relative overflow-hidden min-h-screen bg-white text-black flex flex-col lg:flex-row items-center gap-8 px-6 md:px-12 py-16">
      {/* ----- Decorative lights (subtle) ----- */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 -left-48 w-[600px] h-[600px] rounded-full bg-yellow-200/30 blur-[140px]" />
        <div className="absolute bottom-[-200px] right-[-180px] w-[550px] h-[550px] rounded-full bg-blue-300/30 blur-[160px]" />
      </div>

      {/* ----- Copy ----- */}
      {/* 📢 Left Side Text */}
      <div className="flex-1 flex flex-col justify-center space-y-5">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-blue-900"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          Your Journey to Success <br /> Starts with the Right Course.
        </motion.h1>

        <motion.h2
          className="text-xl sm:text-2xl font-semibold text-gray-800"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          Learn. Grow. Succeed.
        </motion.h2>

        <motion.p
          className="text-lg sm:text-xl text-gray-700 max-w-xl"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        >
          Explore top-rated online courses designed by industry experts to boost your career and skills.
        </motion.p>

        <motion.button
          className="mt-4 px-8 py-4 bg-blue-600 hover:bg-blue-700 transition rounded-2xl text-white font-semibold text-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Courses
        </motion.button>
      </div>


      {/* ----- Slider ----- */}
      <div className="relative z-10 flex-1 w-full max-w-[720px]">
        {/* Arrows */}
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/70 backdrop-blur rounded-full shadow hover:scale-110 transition"
        >
          <HiChevronLeft size={28} />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/70 backdrop-blur rounded-full shadow hover:scale-110 transition"
        >
          <HiChevronRight size={28} />
        </button>

        {/* Slides */}
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            src={images[current]}
            alt={`Slide ${current + 1}`}
            className="w-full h-[320px] sm:h-[420px] object-cover rounded-3xl border-[6px] border-black shadow-2xl"
          />
        </AnimatePresence>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                current === i ? 'bg-black' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
