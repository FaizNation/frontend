import api from '../utils/api';

const groupService = {
  getAllGroups: async (search = '', category = '') => {
    let url = '/groups?';
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (category) url += `category=${encodeURIComponent(category)}&`;
    const response = await api.get(url);
    return response.data;
  },

  getJoinedGroups: async () => {
    const response = await api.get('/groups/joined');
    return response.data;
  },

  joinByCode: async (inviteCode) => {
    const response = await api.post('/groups/join-by-code', { invite_code: inviteCode });
    return response.data;
  },

  getGroupDetail: async (id) => {
    const response = await api.get(`/groups/${id}`);
    return response.data;
  },

  joinGroup: async (id) => {
    const response = await api.post(`/groups/${id}/join`);
    return response.data;
  },

  createGroup: async (groupData) => {
    const response = await api.post('/groups', groupData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateGroup: async (id, groupData) => {
    const response = await api.patch(`/groups/${id}`, groupData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  removeMember: async (groupId, userId) => {
    const response = await api.delete(`/groups/${groupId}/members/${userId}`);
    return response.data;
  },

  getGroupReport: async (id) => {
    const response = await api.get(`/groups/${id}/report`);
    return response.data;
  },
};

export default groupService;
