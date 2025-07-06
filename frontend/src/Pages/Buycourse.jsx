import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

function Buycourse() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchCourse = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`http://localhost:4001/cs/course/coursedetails/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.message || 'There is an error.');
        }

        const data = await response.json();
        setCourse(data?.data || null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Oops, there is an error');
          toast.error(err.message || 'Oops, there is an error');
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
    setError('');
    try {
      const controller = new AbortController();
      const signal = controller.signal;
      const token = localStorage.getItem('token');
      if(!token){
        toast.error("Please Login first and then buy a course");
        return;
      }

      const baseUrl = `http://localhost:4001/cs/course/buy/${id}`;
      const response = await fetch(baseUrl, {
        method: 'POST',
        signal: signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error_Data = await response.json();
        toast.error(error_Data?.message || 'Something went wrong');
        throw new Error(error_Data?.message || 'Something went wrong');
      }

      const data = await response.json();
      console.log('The result we got is:', data);

      if (data.success) {
        toast.success('Course Purchased successfully.');
        setError('');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log('There is an Internal Server Error');
        setError(error.message || 'Oops! Something went wrong.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !course) {
    return <p className="text-white text-center mt-10">Loading course details...</p>;
  }

  if (error && !course) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-4xl font-bold mb-6">{course.title}</h1>

      <img
        src={course.image?.url}
        alt={course.title}
        className="w-full max-w-xl rounded-lg mb-6 object-cover"
        style={{ maxHeight: '400px' }}
      />

      <p className="text-lg mb-4 max-w-xl">{course.description || 'No description available.'}</p>

      <div className="text-2xl font-semibold mb-8">Price: Rs. {course.price}</div>

      <button
        onClick={handlebuying}
        disabled={loading}
        className={`px-8 py-3 rounded-full text-xl font-semibold transition duration-300 shadow-lg ${
          loading
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-600'
        }`}
      >
        {loading ? 'Processing...' : 'Continue to Payment'}
      </button>
    </div>
  );
}

export default Buycourse;


