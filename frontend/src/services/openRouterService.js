import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class OpenRouterService {
  getModels() {
    return {
      models: [
        { id: 'deepseek-v3.1', name: 'DeepSeek V3.1' },
        { id: 'gpt-oss-120b', name: 'GPT-OSS 120B' },
        { id: 'mistral-7b', name: 'Mistral 7B Instruct' }
      ]
    };
  }

  async chat(model, message) {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        model,
        message
      });
      return { message: response.data.response, model };
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Model is currently unavailable. Please try again.');
    }
  }
}

export default new OpenRouterService();