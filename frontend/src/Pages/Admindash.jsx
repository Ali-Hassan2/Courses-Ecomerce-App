import React, { useContext } from 'react'
import Box from '../Components/Box'
import { AdminContext } from '../../Utils/adminContext'
import { useNavigate, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

function Admindash() {
  const { admin, setadmin } = useContext(AdminContext)
  const navigate = useNavigate()

  const handlelogout = () => {
    localStorage.removeItem('admintoken')
    localStorage.removeItem('admin')
    setadmin(null)
    navigate('/adminsignup')
  }

  const data = [
    { label: 'Add a Course', des: 'Create a new course and add content.', route: '/admindashboard/addingcourse' },
    { label: 'View Courses', des: 'See all your listed courses.', route: '/admindashboard/coursemgmt' },
    { label: 'Purchased Courses', des: 'Review user purchases.', route: '/admindashboard/purchasemgmt' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 via-blue-50 to-gray-100 p-6">
      <nav className="flex justify-between items-center mb-6">
        {admin && <h1 className="text-2xl font-semibold text-blue-700">Welcome, {admin.name}</h1>}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlelogout}
          className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition"
        >
          Logout
        </motion.button>
      </nav>

      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((dt, index) => (
          <Box key={index} label={dt.label} des={dt.des} onClick={() => navigate(dt.route)} />
        ))}
      </main>

      <div className="mt-10">
        <Outlet />
      </div>
    </div>
  )
}

export default Admindash
