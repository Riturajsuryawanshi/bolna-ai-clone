const axios = require('axios');

class OpenRouterService {
  constructor() {
    this.apiKey = process.env.OPENROUTER_API_KEY;
    this.baseURL = 'https://openrouter.ai/api/v1';
    this.defaultModel = 'deepseek/deepseek-v3.1';
  }

  async getAvailableModels() {
    const models = [
      { id: 'deepseek/deepseek-v3.1', name: 'DeepSeek V3.1' },
      { id: 'openai/gpt-oss-120b', name: 'OpenAI GPT-OSS-120B' },
      { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B Instruct' },
      { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
      { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B' }
    ];
    return models;
  }

  async chat(model, message) {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: model || this.defaultModel,
          messages: [{ role: 'user', content: message }],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        message: response.data.choices[0].message.content,
        model: model || this.defaultModel
      };
    } catch (error) {
      console.error('OpenRouter API Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Failed to get AI response'
      };
    }
  }
}

module.exports = new OpenRouterService();