import api from './api';

export const getAvailableTasks = async () => {
  const res = await api.get('/volunteer/tasks/available');
  return res.data;
};

export const acceptTask = async (id: string) => {
  const res = await api.post(`/volunteer/tasks/${id}/accept`);
  return res.data;
};

export const getMyTasks = async () => {
  const res = await api.get('/volunteer/tasks/my');
  return res.data;
};
