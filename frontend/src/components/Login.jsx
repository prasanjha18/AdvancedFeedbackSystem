import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        {error && <p className="text-red-500 mb-4 text-sm text-center">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          className="w-full border p-2 mb-4 rounded"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-6 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-gray-800 text-white p-2 rounded hover:bg-gray-900">
          Login
        </button>
      </form>
    </div>
  );
}