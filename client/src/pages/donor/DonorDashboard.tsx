import { useEffect, useState } from 'react';
import { getMyDonations } from '../../services/donationApi';

const DonorDashboard = () => {
  const [donations, setDonations] = useState<any[]>([]);

  useEffect(() => {
    getMyDonations().then(setDonations).catch(console.error);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Donor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {donations.map(donation => (
          <div key={donation.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{donation.foodName}</h2>
            <p>Status: {donation.status}</p>
            <p>Quantity: {donation.quantity} {donation.quantityUnit}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonorDashboard;
