import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import SetupMasterPassword from './pages/SetupMasterPassword';
import StartupLoader from './components/StartupLoader';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
 if (loading) return <StartupLoader />;
  return user ? children : <Navigate to="/login" />;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/dashboard" />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
      <Route path="/setup-master" element={<SetupMasterPassword />} />
    </Routes>
  );
}