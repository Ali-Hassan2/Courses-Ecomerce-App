import { useState } from 'react';
import Navbar from '../Components/Navbar';
import {Link} from 'react-router-dom'

function Signup() {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rpassword, setRPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success,setsuccess] = useState(false);

  const isPasswordMatch = password === rpassword;

  const signup = async (e) => {

    setsuccess(false);
    e.preventDefault();

    if (!isPasswordMatch) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    const controller = new AbortController();
    const signal = controller.signal;

    const baseURL = 'http://localhost:4001/auth/signup';

    try {
      const response = await fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
        body: JSON.stringify({
          first_name,
          last_name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || 'Something went wrong');
        return;
      }

      console.log('Signup successful:', data);
      setsuccess(true);
      alert('Registered successfully');
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error.message || 'Network error');
      }
    } finally {
      setLoading(false);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setRPassword('');
    }
  };

  return (
    <>
    
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gray-900 text-white">
      <div className="md:w-1/2 w-full h-64 md:h-auto flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
        <h2 className="text-3xl md:text-4xl font-bold tracking-wide text-center">
          Welcome to alito Store
        </h2>
      </div>

      <div className="md:w-1/2 w-full flex justify-center items-center py-12 px-6">
        <form
          onSubmit={signup}
          className="w-full max-w-md space-y-5 bg-gray-800 p-8 rounded-2xl shadow-xl"
        >
          <h1 className="text-2xl font-bold mb-4 text-center">Register Yourself</h1>

          <input
            type="text"
            placeholder="Your first name"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Your last name"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Your email"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Your password"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Retype password"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setRPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-500 font-medium text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? 'Registering...' : 'Signup'}
          </button>

          {success && (
            <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
          >
            <Link to='/login'>Login</Link>
          </button>
          )}


        </form>
      </div>
    </div>
    </>
  );
}

export default Signup;
