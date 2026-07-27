import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FeedbackForm from './components/FeedbackForm';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-800">
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