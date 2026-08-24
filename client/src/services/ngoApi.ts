import api from './api';

export const getNearbyDonations = async () => {
  const res = await api.get('/ngo/donations/nearby');
  return res.data;
};

export const requestDonation = async (id: string, message?: string) => {
  const res = await api.post(`/ngo/donations/${id}/request`, { message });
  return res.data;
};

export const getMyRequests = async () => {
  const res = await api.get('/ngo/requests/my');
  return res.data;
};
