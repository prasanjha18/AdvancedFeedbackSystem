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
      .catch(() => navigate('/login')); // Kick out if token is invalid

    // 2. Connect to WebSocket for live updates (NOTE: using wss:// for secure connection)
    const ws = new WebSocket('wss://advancedfeedbacksystem.onrender.com/ws/admin');
    
    ws.onmessage = (event) => {
      const newFeedback = JSON.parse(event.data);
      // Add new feedback to the top of the list
      setFeedbacks((prev) => [newFeedback, ...prev]);
    };

    return () => ws.close(); // Cleanup on unmount
  }, [navigate, token]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Live Feedback Dashboard</h1>
      <div className="grid gap-4">
        {feedbacks.map((fb) => (
          <div 
            key={fb.id} 
            className={`p-4 rounded shadow bg-white border-l-4 ${
              fb.requiresAction ? 'border-red-500' : 
              fb.sentiment === 'Positive' ? 'border-green-500' : 
              fb.sentiment === 'Negative' ? 'border-orange-500' : 'border-gray-400'
            }`}
          >
            <div className="flex justify-between items-start">
              <p className="text-lg mb-2">{fb.rawText}</p>
              {fb.requiresAction && (
                <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded animate-pulse">
                  URGENT ACTION
                </span>
              )}
            </div>
            <div className="flex gap-2 text-sm mt-2">
              <span className="bg-gray-200 px-2 py-1 rounded">Sentiment: <b>{fb.sentiment}</b></span>
              
              {/* DEFENSIVE CODING APPLIED HERE */}
              {Array.isArray(fb.keyItems) && fb.keyItems.map((item, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
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