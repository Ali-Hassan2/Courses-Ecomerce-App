import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Buycourse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:4001/cs/course/coursedetails/${id}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.message || "There is an error.");
        }

        const data = await response.json();
        setCourse(data?.data || null);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Oops, there is an error");
          toast.error(err.message || "Oops, there is an error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
    return () => controller.abort();
  }, [id]);

  const handlebuying = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please Login first and then buy a course");
        return;
      }

      const response = await fetch(
        `http://localhost:4001/cs/course/buywstripe/${id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData?.message || "Something went wrong");
        throw new Error(errorData?.message || "Something went wrong");
      }

      const data = await response.json();
      if (data.success) toast.success(data.message);
    } catch (error) {
      if (error.name !== "AbortError") {
        setError(error.message || "Oops! Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const gotostripe = () => {
    navigate(`/stripe/${id}`);
  };

  if (loading && !course) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading course details...
      </p>
    );
  }

  if (error && !course) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  if (!course) return null;

  return (
    <div className="relative min-h-screen bg-white text-black flex flex-col items-center p-6 overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="absolute w-[450px] h-[450px] bg-yellow-200 opacity-30 rounded-full blur-3xl top-[-150px] left-[-100px] z-[-1]" />
      <div className="absolute w-[400px] h-[400px] bg-blue-300 opacity-30 rounded-full blur-2xl bottom-[-80px] right-[-120px] z-[-1]" />
      <div className="absolute w-[350px] h-[350px] bg-purple-200 opacity-20 rounded-full blur-2xl top-[220px] left-[50%] transform -translate-x-1/2 z-[-1]" />

      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        {course.title}
      </h1>

      <img
        src={course.image?.url}
        alt={course.title}
        className="w-full max-w-xl rounded-xl mb-6 object-cover border shadow-lg"
        style={{ maxHeight: "400px" }}
      />

      <p className="text-lg mb-4 max-w-2xl text-center text-gray-700">
        {course.description || "No description available."}
      </p>

      <div className="text-2xl font-semibold mb-8 text-gray-900">
        Price: Rs. {course.price}
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={handlebuying}
          disabled={loading}
          className={`px-8 py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:from-purple-600 hover:to-indigo-500 text-white cursor-pointer"
          }`}
        >
          {loading ? "Processing..." : "Continue to Payment"}
        </button>

        <button
          onClick={gotostripe}
          disabled={loading}
          className={`px-8 py-3 rounded-full text-lg cursor-pointer font-semibold transition duration-300 shadow-md ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:to-pink-500 text-white"
          }`}
        >
          Continue with Stripe
        </button>
      </div>
    </div>
  );
}

export default Buycourse;
