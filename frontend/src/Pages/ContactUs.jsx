import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const ContactUs = () => {
  const [swapped, setSwapped] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const toggleSwap = () => {
    setAnimating(true);
    setTimeout(() => {
      setSwapped((prev) => !prev);
      setAnimating(false);
    }, 400);
  };

  const animStyles = {
    transition: "transform 0.4s ease, opacity 0.4s ease",
    opacity: animating ? 0 : 1,
    transform: animating ? "translateX(-20px)" : "translateX(0)",
  };

  const animStylesReverse = {
    transition: "transform 0.4s ease, opacity 0.4s ease",
    opacity: animating ? 0 : 1,
    transform: animating ? "translateX(20px)" : "translateX(0)",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const controller = new AbortController();
    const signal = controller.signal;
    const timer = 15000;
    const timeout = setTimeout(() => controller.abort(), timer);

    try {
      const baseURL = "https://formspree.io/f/xkgzoypy";
      const response = await fetch(baseURL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        signal,
        body: JSON.stringify(formData),
      });
      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        toast.error("Something went wrong. Please try again.");
        throw new Error(errorData?.message || "Something went wrong.");
      } else {
        toast.success("Your message was sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      if (error.name === "AbortError") {
        toast.error("Request timed out. Please try again.");
      } else {
        toast.error(error?.message || "An unexpected error occurred.");
      }
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 relative">
      <Toaster position="top-center" reverseOrder={false} />
      <button
        onClick={toggleSwap}
        aria-label="Toggle form and image position"
        className="
          absolute top-2 left-1/2 transform -translate-x-1/2
          z-20 bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center
          text-white shadow-lg cursor-pointer
          transition-colors duration-300 ease-in-out
          hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 transform transition-transform duration-500 ${
            swapped ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div
        className={`max-w-6xl w-full bg-white rounded-lg shadow-xl flex overflow-hidden
          transition-all duration-700 ease-in-out
          ${swapped ? "flex-row-reverse" : "flex-row"}
        `}
      >
        <div
          style={swapped ? animStylesReverse : animStyles}
          className="w-full md:w-1/2 p-10 sm:p-16"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
            Contact Us
          </h2>
          <p className="text-gray-600 mb-10">
            Have questions or want to work together? Send us a message!
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              required
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full px-5 py-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
        <div
          style={swapped ? animStyles : animStylesReverse}
          className="hidden md:block md:w-1/2"
        >
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
            alt="Contact illustration"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
