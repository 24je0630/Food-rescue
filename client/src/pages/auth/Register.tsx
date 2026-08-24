import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '', password: '', role: 'DONOR', name: '',
    organization: '', address: '', latitude: 0, longitude: 0, operatingRadius: 10
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', {
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        operatingRadius: Number(formData.operatingRadius)
      });
      login(res.data.token, res.data.user);
      
      const role = res.data.user.role;
      if (role === 'DONOR') navigate('/donor');
      else if (role === 'NGO') navigate('/ngo');
      else if (role === 'VOLUNTEER') navigate('/volunteer');
      else navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Name</label>
            <input type="text" name="name" required onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input type="email" name="email" required onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input type="password" name="password" required minLength={6} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block mb-1">Role</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border rounded">
              <option value="DONOR">Donor</option>
              <option value="NGO">NGO</option>
              <option value="VOLUNTEER">Volunteer</option>
            </select>
          </div>
          {formData.role !== 'VOLUNTEER' && (
            <>
              <div>
                <label className="block mb-1">Organization</label>
                <input type="text" name="organization" required onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              </div>
              <div>
                <label className="block mb-1">Address</label>
                <input type="text" name="address" required onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              </div>
            </>
          )}
          <div>
            <label className="block mb-1">Latitude</label>
            <input type="number" step="any" name="latitude" required onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block mb-1">Longitude</label>
            <input type="number" step="any" name="longitude" required onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          {formData.role === 'NGO' && (
            <div>
              <label className="block mb-1">Operating Radius (km)</label>
              <input type="number" name="operatingRadius" required onChange={handleChange} className="w-full px-3 py-2 border rounded" />
            </div>
          )}
          <button type="submit" className="w-full px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
