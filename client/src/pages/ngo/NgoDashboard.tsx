import { useEffect, useState } from 'react';
import { getNearbyDonations, requestDonation } from '../../services/ngoApi';

const NgoDashboard = () => {
  const [donations, setDonations] = useState<any[]>([]);

  useEffect(() => {
    getNearbyDonations().then(setDonations).catch(console.error);
  }, []);

  const handleRequest = async (id: string) => {
    try {
      await requestDonation(id, 'We need this food.');
      setDonations(donations.filter(d => d.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">NGO Dashboard</h1>
      <h2 className="text-xl mb-2">Nearby Available Donations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {donations.map(donation => (
          <div key={donation.id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{donation.foodName}</h3>
            <p>{donation.distance?.toFixed(2)} km away</p>
            <p>Quantity: {donation.quantity} {donation.quantityUnit}</p>
            <button
              onClick={() => handleRequest(donation.id)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Request
            </button>
          </div>
        ))}
        {donations.length === 0 && <p>No nearby donations available.</p>}
      </div>
    </div>
  );
};

export default NgoDashboard;
