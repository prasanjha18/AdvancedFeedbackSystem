import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function FeedbackForm() {
  const [review, setReview] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      await axios.post('https://advancedfeedbacksystem.onrender.com/api/feedback', { review });
      setStatus('Thank you for your feedback! 🌟');
      setReview('');
    } catch (error) {
      setStatus('Failed to submit. Please try again.');
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen relative p-4">
      
      {/* --- NEW ADMIN LOGIN BUTTON --- */}
      <div className="absolute top-6 right-6">
        <Link 
          to="/login" 
          className="px-5 py-2.5 rounded-full bg-white/70 backdrop-blur-md shadow-sm border border-white/50 text-purple-700 font-bold hover:bg-white hover:shadow-md hover:scale-105 transition-all duration-300"
        >
          🔒 Admin Login
        </Link>
      </div>

      {/* --- COLORFUL FORM CARD --- */}
      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/40 w-full max-w-lg transition-transform hover:-translate-y-1 duration-500">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 drop-shadow-sm">
            Share Your Experience
          </h2>
          <p className="text-gray-500 mt-2 font-medium">We value your thoughts and feedback!</p>
        </div>
        
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="How was the food, service, and ambiance?"
          className="w-full bg-white/50 border border-purple-100 p-4 rounded-2xl mb-6 h-40 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all resize-none shadow-inner"
          required
        />
        
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg py-3 px-4 rounded-2xl shadow-lg hover:shadow-xl hover:opacity-90 transform active:scale-95 transition-all"
        >
          ✨ Submit Review
        </button>
        
        {status && (
          <p className="mt-6 text-center font-bold text-purple-800 bg-purple-100 py-3 rounded-xl border border-purple-200 animate-pulse">
            {status}
          </p>
        )}
      </form>
    </div>
  );
}