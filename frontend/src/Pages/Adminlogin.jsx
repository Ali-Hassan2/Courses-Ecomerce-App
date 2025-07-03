import { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {AdminContext} from '../../Utils/adminContext'


function Login() {
  const {setadmin}=useContext(AdminContext);
    const navigate = useNavigate();
    const [error,setError] = useState('');
    const [loading,setloading] = useState(false);
    const [email,setemail]=useState("");
    const [password,setpassword]=useState("");

    const login = async(e)=>{
      e.preventDefault();
      setloading('');
      setError('');
      const controller = new AbortController();
      const signal = controller.signal;
      const payload = {
        email:email.trim(),
        password:password.trim(),
      }
      try {
        const baseURL = `http://localhost:4001/admin/login`
        const response = await fetch(baseURL,{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          signal:signal,
          body:JSON.stringify(payload)
      })
      const data = await response.json();
      console.log("The data is:",data);
      console.log("The token is:",data.token);

      
      if(data.success){
        const fullname = `${data.admin.first_name} ${data.admin.last_name}`
        const user_to_store = {
          ...data.admin,
          name:fullname
        }
        console.log("The firstname is:",data.admin.first_name)
        console.log("The lastname is:",data.admin.last_name)

        localStorage.setItem('admintoken',data.token);
        localStorage.setItem('admin',JSON.stringify(user_to_store));
        setadmin(user_to_store);
      
      navigate('/admindashboard')
      }

      } catch (error) {
        
      }
    
    }
   

    console.log("This is the what.")


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
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Login</h1>

          <input
            type="text"
            placeholder="Your email"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setemail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Your password"
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setpassword(e.target.value)}
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
