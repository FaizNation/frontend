import api from '../utils/api';

const checkinService = {
  getTodayStatus: async () => {
    const response = await api.get('/checkins/today');
    return response.data;
  },

  submitCheckin: async (checkinData) => {
    const response = await api.post('/checkins', checkinData);
    return response.data;
  },

  getHistory: async (month, year) => {
    const response = await api.get(`/checkins/history?month=${month}&year=${year}`);
    return response.data;
  },
};

export default checkinService;
