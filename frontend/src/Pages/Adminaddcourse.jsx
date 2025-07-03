import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

function Adminaddcourse() {
  const [title, settitle] = useState('')
  const [description, setdescription] = useState('')
  const [price, setprice] = useState('')
  const [image, setimage] = useState(null)
  const [loading, setloading] = useState(false)

  const handleuploading = async (e) => {
    e.preventDefault()
    setloading(true)

    if (!title || !description || !price || !image) {
      toast.error('All fields are required!')
      setloading(false)
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price)
    formData.append('image', image)

    try {
      const token = localStorage.getItem('admintoken')
      const controller = new AbortController()
      const signal = controller.signal

      const response = await fetch(`http://localhost:4001/cs/course/createcourse`, {
        method: 'POST',
        body: formData,
        signal: signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      toast.success('Course created successfully! ')
      settitle('')
      setdescription('')
      setprice('')
      setimage(null)
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error(error.message || 'Something went wrong')
      }
    } finally {
      setloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center px-4">
      <Toaster position="top-right" />
      <form
        onSubmit={handleuploading}
        className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl text-white font-bold text-center">Add New Course</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => settitle(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setdescription(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white outline-none resize-none h-24 focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <input
          type="number"
          placeholder="Price (e.g. 499)"
          value={price}
          onChange={(e) => setprice(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-700 text-white outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setimage(e.target.files[0])}
          className="w-full px-4 py-2 text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded font-semibold ${
            loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } text-white transition-all`}
        >
          {loading ? 'Uploading...' : 'Add Course'}
        </button>
      </form>
    </div>
  )
}

export default Adminaddcourse
