import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';

function Admincoursemgmt() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [confirmInput, setConfirmInput] = useState('');
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null); 

  useEffect(() => {
    const controller = new AbortController();

    const getCourses = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:4001/cs/course/readcourse', {
          method: 'GET',``
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Something went wrong');
        }

        if (!Array.isArray(data.data) || data.data.length === 0) {
          toast('No courses found!');
          setCourses([]);
        } else {
          setCourses(data.data);
          toast.success('Courses loaded successfully');
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error(`Failed to fetch courses: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    getCourses();
    return () => controller.abort();
  }, []);

  const handleDelete = async (id, title) => {
    if (confirmInput !== title) {
      setError('Course title not matched');
      return;
    }

    setDeletingId(id);
    try {
      const token = localStorage.getItem('admintoken');
      const response = await fetch(`http://localhost:4001/cs/course/deletecourse/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete course');
      }

      if (data.success) {
        toast.success('Course deleted!');
        setCourses((prev) => prev.filter((c) => c._id !== id));
        setConfirmId(null);
        setConfirmInput('');
        setError('');
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdate = (course) => {
    toast('Update coming soon!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold text-blue-800 mb-6">All Courses</h2>

      {loading ? (
        <p className="text-center text-blue-600">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-center text-gray-600">No courses available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((crs) => (
            <motion.div
              key={crs._id}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={crs.image?.url || 'https://via.placeholder.com/300'}
                alt={crs.title}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-semibold text-gray-800">Title: {crs.title}</h3>
              <p className="text-sm text-gray-600">Price: Rs {crs.price}</p>
              <p className="text-sm mt-2 text-gray-500">{crs.description}</p>

              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => handleUpdate(crs)}
                  className="px-4 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600"
                >
                  Update
                </button>

                {confirmId === crs._id ? (
                  <div className="border border-red-300 p-3 rounded bg-red-50">
                    <p className="text-sm">
                      Type <strong>{crs.title}</strong> to confirm deletion:
                    </p>
                    <input
                      type="text"
                      className="mt-1 p-1 border rounded w-full text-sm"
                      value={confirmInput}
                      onChange={(e) => setConfirmInput(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleDelete(crs._id, crs.title)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                      >
                        {deletingId === crs._id ? 'Deleting...' : 'Confirm Delete'}
                      </button>
                      <button
                        onClick={() => {
                          setConfirmId(null);
                          setConfirmInput('');
                          setError('');
                        }}
                        className="bg-gray-300 text-sm px-3 py-1 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setConfirmId(crs._id);
                      setConfirmInput('');
                      setError('');
                    }}
                    className="px-4 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Admincoursemgmt;
