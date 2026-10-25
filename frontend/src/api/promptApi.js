import api from './axiosInstance';

export const promptApi = {
  getPrompts: async (params = {}) => {
    const response = await api.get('/prompts', { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/prompts/stats');
    return response.data;
  },

  getPromptById: async (id) => {
    const response = await api.get(`/prompts/${id}`);
    return response.data;
  },

  createPrompt: async (promptData) => {
    const response = await api.post('/prompts', promptData);
    return response.data;
  },

  updatePrompt: async (id, promptData) => {
    const response = await api.put(`/prompts/${id}`, promptData);
    return response.data;
  },

  deletePrompt: async (id) => {
    const response = await api.delete(`/prompts/${id}`);
    return response.data;
  },

  toggleFavorite: async (id) => {
    const response = await api.patch(`/prompts/${id}/favorite`);
    return response.data;
  },

  seedPrompts: async () => {
    const response = await api.post('/prompts/seed');
    return response.data;
  }
};
