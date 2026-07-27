import { useState } from 'react';
import axios from 'axios';

export default function FeedbackForm() {
  const [review, setReview] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    try {
      await axios.post('https://advancedfeedbacksystem.onrender.com/api/feedback', { review });
      setStatus('Thank you for your feedback!');
      setReview('');
    } catch (error) {
      setStatus('Failed to submit. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Restaurant Feedback</h2>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="How was your experience?"
          className="w-full border border-gray-300 p-3 rounded-md mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Submit Review
        </button>
        {status && <p className="mt-4 text-center font-medium text-gray-600">{status}</p>}
      </form>
    </div>
  );
}