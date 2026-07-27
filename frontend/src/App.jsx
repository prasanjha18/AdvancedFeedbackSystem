import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FeedbackForm from './components/FeedbackForm';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      {/* Replaced plain bg-gray-50 with a beautiful vibrant gradient */}
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-gray-800 font-sans selection:bg-purple-300">
        <Routes>
          <Route path="/" element={<FeedbackForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;