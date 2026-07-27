import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://advancedfeedbacksystem.onrender.com/api/login', { username, password });
      localStorage.setItem('adminToken', res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen relative p-4">
      
      {/* Back to feedback form button */}
      <div className="absolute top-6 left-6">
        <Link 
          to="/" 
          className="px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-md shadow-sm border border-white/50 text-indigo-700 font-bold hover:bg-white hover:shadow-md hover:scale-105 transition-all duration-300"
        >
          ← Back to Feedback
        </Link>
      </div>

      <form onSubmit={handleLogin} className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/40 w-full max-w-md transition-transform hover:-translate-y-1 duration-500">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500">
            Admin Portal
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Sign in to view live insights</p>
        </div>

        {error && <p className="text-red-600 mb-6 font-bold text-center bg-red-100 py-3 rounded-xl border border-red-200">{error}</p>}
        
        <input
          type="text"
          placeholder="Username"
          className="w-full bg-white/50 border border-indigo-100 p-4 rounded-2xl mb-4 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all shadow-inner"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full bg-white/50 border border-indigo-100 p-4 rounded-2xl mb-8 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all shadow-inner"
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-bold text-lg py-3 rounded-2xl shadow-lg hover:shadow-xl hover:opacity-90 transform active:scale-95 transition-all">
          Secure Login
        </button>
      </form>
    </div>
  );
}