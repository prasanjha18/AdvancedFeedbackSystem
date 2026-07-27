import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // 1. Fetch initial insights
    axios.get(`https://advancedfeedbacksystem.onrender.com/api/insights?token=${token}`)
      .then(res => setFeedbacks(res.data))
      .catch(() => navigate('/login')); 

    // 2. Connect to secure WebSocket for live updates
    const ws = new WebSocket('wss://advancedfeedbacksystem.onrender.com/ws/admin');
    
    ws.onmessage = (event) => {
      const newFeedback = JSON.parse(event.data);
      // Add new feedback to the top of the list
      setFeedbacks((prev) => [newFeedback, ...prev]);
    };

    return () => ws.close(); // Cleanup on unmount
  }, [navigate, token]);

  // --- NEW LOGOUT FUNCTION ---
  const handleLogout = () => {
    localStorage.removeItem('adminToken'); // Delete the token
    navigate('/'); // Redirect to the public feedback form (or '/login' if you prefer)
  };

  return (
    <div className="p-8 max-w-6xl mx-auto relative">
      
      {/* --- NEW LOGOUT BUTTON --- */}
      <div className="absolute top-8 right-8">
        <button 
          onClick={handleLogout}
          className="px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-md shadow-sm border border-red-100 text-red-600 font-bold hover:bg-red-50 hover:text-red-700 hover:shadow-md hover:scale-105 transition-all duration-300"
        >
          Logout 👋
        </button>
      </div>

      <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
        Live Feedback Dashboard
      </h1>
      
      <div className="grid gap-6">
        {feedbacks.map((fb) => (
          <div 
            key={fb.id} 
            className={`p-6 rounded-3xl shadow-lg bg-white/80 backdrop-blur-xl border-l-8 transition-transform hover:-translate-y-1 duration-300 ${
              fb.requiresAction ? 'border-red-500' : 
              fb.sentiment === 'Positive' ? 'border-green-400' : 
              fb.sentiment === 'Negative' ? 'border-orange-400' : 'border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <p className="text-xl font-medium text-gray-800 mb-4">{fb.rawText}</p>
              {fb.requiresAction && (
                <span className="bg-red-100 text-red-800 text-xs font-extrabold px-3 py-1.5 rounded-full animate-pulse shadow-sm">
                  ⚠️ URGENT ACTION
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 text-sm mt-2 items-center">
              <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-semibold shadow-inner border border-gray-200">
                Sentiment: <span className={
                  fb.sentiment === 'Positive' ? 'text-green-600' : 
                  fb.sentiment === 'Negative' ? 'text-orange-600' : 'text-gray-600'
                }>{fb.sentiment}</span>
              </span>
              
              {/* DEFENSIVE CODING APPLIED HERE */}
              {Array.isArray(fb.keyItems) && fb.keyItems.map((item, idx) => (
                <span key={idx} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-full font-medium shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}