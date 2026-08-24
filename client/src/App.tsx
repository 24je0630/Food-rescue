import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/Layout/ProtectedRoute';

import DonorDashboard from './pages/donor/DonorDashboard';
import NgoDashboard from './pages/ngo/NgoDashboard';
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

import { useAuth } from './context/AuthContext';

const AppRoutes = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? (
        user?.role === 'DONOR' ? <Navigate to="/donor" /> :
        user?.role === 'NGO' ? <Navigate to="/ngo" /> :
        user?.role === 'VOLUNTEER' ? <Navigate to="/volunteer" /> :
        user?.role === 'ADMIN' ? <Navigate to="/admin" /> : <Landing />
      ) : <Landing />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute allowedRoles={['DONOR']} />}>
        <Route path="/donor" element={<DonorDashboard />} />
      </Route>
      
      <Route element={<ProtectedRoute allowedRoles={['NGO']} />}>
        <Route path="/ngo" element={<NgoDashboard />} />
      </Route>
      
      <Route element={<ProtectedRoute allowedRoles={['VOLUNTEER']} />}>
        <Route path="/volunteer" element={<VolunteerDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Fallback 404 */}
      <Route path="*" element={<div className="p-8 text-center">404 - Not Found</div>} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
