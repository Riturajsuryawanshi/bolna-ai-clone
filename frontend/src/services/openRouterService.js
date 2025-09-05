import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class OpenRouterService {
  async getModels() {
    try {
      const response = await axios.get(`${API_BASE_URL}/openrouter/models`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch models');
    }
  }

  async chat(model, message) {
    try {
      const response = await axios.post(`${API_BASE_URL}/openrouter/chat`, {
        model,
        message
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get AI response');
    }
  }
}

export default new OpenRouterService();