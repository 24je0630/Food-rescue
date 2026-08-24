import { useEffect, useState } from 'react';
import { getAdminStats } from '../../services/adminApi';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getAdminStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow">
          <h2 className="text-lg">Total Users</h2>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow">
          <h2 className="text-lg">Meals Saved</h2>
          <p className="text-2xl font-bold">{stats.mealsSaved}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded shadow">
          <h2 className="text-lg">Active Donations</h2>
          <p className="text-2xl font-bold">{stats.activeDonations}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded shadow">
          <h2 className="text-lg">Completed Deliveries</h2>
          <p className="text-2xl font-bold">{stats.completedDonations}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
