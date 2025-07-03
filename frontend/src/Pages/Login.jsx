import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../Utils/userContext';

function Login() {
  const navigate = useNavigate(); 
  const {setuser} = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const controller = new AbortController();
      const signal = controller.signal;

      const payload = {
        email: email.trim(),
        password: password.trim(),
      };

      const response = await fetch('http://localhost:4001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal,
      });

      const data = await response.json();
      console.log("The data of the user we got is:",data)
      console.log("The token of the user is:",data.token);


      if(data.success){
        const fullname = `${data.user.first_name} ${data.user.last_name}`
        const usertostore = {
          ...data.user,
          name:fullname
        }

        localStorage.setItem('token',data.token);
        localStorage.setItem('user',JSON.stringify(usertostore));
        setuser(usertostore)
        navigate('/');

      }


      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      console.log('Login success:', data);
      alert('Login successful!');
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log('Error during login:', error);
        setError(`OPS there is an error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gray-900 text-white">
      <div className="md:w-1/2 w-full h-64 md:h-auto flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
        <h2 className="text-3xl md:text-4xl font-bold tracking-wide text-center">
          Welcome to alito Store
        </h2>
      </div>

      <div className="md:w-1/2 w-full flex justify-center items-center py-12 px-6">
        <form
          onSubmit={login}
          className="w-full max-w-md space-y-5 bg-gray-800 p-8 rounded-2xl shadow-xl"
        >
          <h1 className="text-2xl font-bold mb-4 text-center">Login Here</h1>

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

          {error && (
            <p className="text-red-500 font-medium text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
