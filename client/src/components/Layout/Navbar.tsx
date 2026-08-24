import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-green-700">Food Rescue</Link>
      <div className="space-x-4">
        {user && <span className="font-medium text-gray-600">Role: {user.role}</span>}
        <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
