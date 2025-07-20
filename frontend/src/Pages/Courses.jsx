import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import { UserContext } from "../../Utils/userContext";
import { CartContext } from "../../Utils/cartContext";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/Main-layout";
function Courses() {
  const navigate = useNavigate();
  const { addtocart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:4001/cs/course/readcourse",
          {
            method: "GET",
            signal,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.message || "There is an error.");
        }

        const data = await response.json();
        setCourses(data?.data || []);
        setError("");
      } catch (error) {
        if (error.name !== "AbortError") {
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

  function handlecart(course) {
    if (!user) {
      alert("Please login first");
      return;
    } else {
      addtocart(course);
    }
  }

  return (
    <>
      <MainLayout>
        <div className="relative min-h-screen bg-white text-black px-4 py-10 overflow-hidden">
          <div className="absolute w-[500px] h-[500px] bg-yellow-200 opacity-30 rounded-full blur-3xl top-[-150px] left-[-100px] z-[-1]" />
          <div className="absolute w-[400px] h-[400px] bg-blue-300 opacity-30 rounded-full blur-2xl bottom-[-100px] right-[-120px] z-[-1]" />
          <div className="absolute w-[350px] h-[350px] bg-purple-200 opacity-20 rounded-full blur-2xl top-[250px] left-[40%] transform -translate-x-1/2 z-[-1]" />

          <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 tracking-wide text-gray-800">
            Our Available Courses
          </h1>

          {loading && (
            <div className="text-center text-gray-600 text-lg">
              Loading courses...
            </div>
          )}
          {error && (
            <div className="text-center text-red-500 text-lg">
              Error: {error}
            </div>
          )}
          {!loading && !error && !courses.length && (
            <div className="text-center text-gray-500 text-lg">
              No courses available.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden transform hover:scale-[1.03] transition-transform duration-300 flex flex-col justify-between"
              >
                <img
                  src={course.image?.url}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col justify-between flex-grow space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {course.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between pt-2 gap-2">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      Rs. {course.price}
                    </span>
                    <div className="flex gap-3">
                      <button
                        className="bg-blue-600 hover:from-purple-600 hover:to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-semibold transition duration-300"
                        onClick={() => handlebuy(course._id)}
                      >
                        Buy Now
                      </button>
                      <button
                        className="bg-blue-600 hover:from-blue-500 hover:to-green-400 text-white px-4 py-2 rounded-full text-sm font-semibold transition duration-300"
                        onClick={() => handlecart(course)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </MainLayout>
    </>
  );
}

export default Courses;
