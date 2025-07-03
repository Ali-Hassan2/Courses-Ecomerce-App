import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../Components/Navbar';
import { UserContext } from '../../Utils/userContext';
import { CartContext } from '../../Utils/cartContext';
import { useNavigate } from 'react-router-dom';
import {Link} from 'react-router-dom'

function Courses() {
  const navigate = useNavigate();
  const {addtocart} = useContext(CartContext); 
  const { user } = useContext(UserContext);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:4001/cs/course/readcourse', {
          method: 'GET',
          signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.message || "There is an error.");
        }

        const data = await response.json();
        setCourses(data?.data || []);
        setError('');
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error.message || "Oops, there is an error.");
        }
      } finally {
        setLoading(false);
      }
    };

    getCourses();
    return () => controller.abort();
  }, []);

  function handlebuy(courseId) {
    if (!user) {
      alert("Please login first.");
    } else {
      navigate(`/buycourse/${courseId}`);
    }
  }
  function handlecart(course){
    if(!user){
      alert("Please login first")
      return
    }
    else{
      addtocart(course);
    }
  }
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 tracking-wide">
          Our Available Courses
        </h1>

        {loading && <div className="text-center text-gray-300 text-lg">Loading courses...</div>}
        {error && <div className="text-center text-red-400 text-lg">Error: {error}</div>}
        {!loading && !error && !courses.length && (
          <div className="text-center text-gray-400 text-lg">No courses available.</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-gray-800 rounded-2xl shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col justify-between"
            >
              <img
                src={course.image?.url}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col justify-between flex-grow space-y-3">
                <div>
                  <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                  <p className="text-sm text-gray-300">{course.description}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Rs. {course.price}
                  </span>
                  <button
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold transition duration-300 relative left-[140px] cursor-pointer"
                    onClick={() => handlebuy(course._id)}
                  >
                    Buy Now
                  </button>
                  <button
                    className=" bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold transition duration-300 cursor-pointer" onClick={()=> handlecart(course)}
                  
                  >
                  Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Courses;
