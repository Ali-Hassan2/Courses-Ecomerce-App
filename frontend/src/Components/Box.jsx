import React from 'react'
import { motion } from 'framer-motion'

function Box({ label, des, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer border-2 border-blue-500 rounded-2xl p-6 shadow-lg bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition duration-300 ease-in-out"
    >
      <h1 className="text-2xl font-bold text-blue-700 mb-2">{label}</h1>
      <p className="text-gray-600 text-sm">{des}</p>
    </motion.div>
  )
}

export default Box
