import api from '../utils/api';

const dashboardService = {
  getSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },

  getAllBadges: async () => {
    const response = await api.get('/dashboard/badges');
    return response.data;
  },
};

export default dashboardService;
