import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center p-4">
      <h1 className="text-4xl font-bold text-green-700 mb-4">Food Rescue Network</h1>
      <p className="text-lg text-gray-700 mb-8 max-w-2xl">
        Connecting food donors, NGOs, and volunteers to eliminate food waste and fight hunger.
      </p>
      <div className="flex gap-4">
        <Link to="/login" className="px-6 py-3 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
          Login
        </Link>
        <Link to="/register" className="px-6 py-3 bg-green-600 text-white rounded shadow hover:bg-green-700">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Landing;
