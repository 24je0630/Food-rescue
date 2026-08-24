import api from './api';

export const createDonation = async (data: any) => {
  const res = await api.post('/donations', data);
  return res.data;
};

export const getMyDonations = async () => {
  const res = await api.get('/donations/my');
  return res.data;
};

export const getDonationDetails = async (id: string) => {
  const res = await api.get(`/donations/${id}`);
  return res.data;
};

export const cancelDonation = async (id: string) => {
  const res = await api.delete(`/donations/${id}`);
  return res.data;
};
