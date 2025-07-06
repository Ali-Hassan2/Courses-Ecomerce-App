import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar'
import toast from 'react-hot-toast';

const Purchased = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPurchasedCourses = async () => {
    const token = localStorage.getItem("token");
    console.log("Token found:", token);

    if (!token) {
      toast.error("Please login first");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:4001/auth/purchased", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.error?.name === 'TokenExpiredError') {
          toast.error("Session expired, please login again.");
          localStorage.removeItem("token");
          window.location.href = "/login";
        } else {
          throw new Error(data?.message || "Something went wrong");
        }
      }

      if (data.success && Array.isArray(data.purchasedcourses)) {
        console.log("Received purchased courses:", data.purchasedcourses);

        setCourses(data.purchasedcourses);
      } else {
        toast.error("No courses found");
      }

    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchasedCourses();
  }, []);

  if (loading) {
    return <p className="text-center text-white mt-10">Loading courses...</p>;
  }

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Purchased Courses</h2>

      {courses.length === 0 ? (
        <p className="text-center text-gray-400">You haven't purchased any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-2xl transition duration-300">
              {course.image?.url && (
                <img
                  src={course.image.url}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
              <p className="text-gray-300 mb-3">
                {course.description?.substring(0, 100) || 'No description available'}...
              </p>
              <div className="text-lg font-bold text-indigo-400">Rs. {course.price}</div>
            </div>
          ))}
        </div>
      )}
    </div>

    </>
  );
};

export default Purchased;
