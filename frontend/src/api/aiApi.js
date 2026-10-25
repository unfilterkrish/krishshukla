import api from './axiosInstance';

export const aiApi = {
  // Improve prompt (requires auth)
  improvePrompt: async ({ prompt, category, aiModel }) => {
    const response = await api.post('/ai/improve', { prompt, category, aiModel });
    return response.data;
  },

  // Public interactive demo (no auth needed)
  improveDemo: async ({ prompt, category, aiModel }) => {
    const response = await api.post('/ai/demo', { prompt, category, aiModel });
    return response.data;
  }
};
