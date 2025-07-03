import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();

    return () => controller.abort();
  }, [id]);

  if (loading) return <p className="text-white text-center mt-10">Loading course details...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
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
        onClick={() => alert('Proceeding to payment...')}
        className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-600 px-8 py-3 rounded-full text-xl font-semibold transition duration-300 shadow-lg"
      >
        Continue to Payment
      </button>
    </div>
  );
}

export default Buycourse;
