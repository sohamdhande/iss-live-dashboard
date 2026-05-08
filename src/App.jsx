import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';

/**
 * Root application component.
 * Renders the navigation bar, main dashboard route, and toast notifications.
 * The Chatbot is rendered inside Dashboard to receive real-time data.
 */
function App() {
  return (
    <div className="min-h-screen gradient-bg transition-colors duration-500">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(30, 41, 59, 0.9)',
            color: '#e2e8f0',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
    </div>
  );
}

export default App;

