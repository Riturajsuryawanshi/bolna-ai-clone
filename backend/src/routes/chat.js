const express = require('express');
const axios = require('axios');
const router = express.Router();

const MODELS = {
  'deepseek-v3.1': 'deepseek/deepseek-v3.1',
  'gpt-oss-120b': 'openai/gpt-oss-120b',
  'mistral-7b': 'mistralai/mistral-7b-instruct'
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const callOpenRouter = async (model, message, retryCount = 0) => {
  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: MODELS[model] || MODELS['deepseek-v3.1'],
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: message }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.HTTP_REFERER || 'http://localhost:3000',
        'X-Title': 'CallGenie',
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(`OpenRouter API error (attempt ${retryCount + 1}):`, {
      status: error.response?.status,
      message: error.response?.data?.error?.message || error.message,
      model: MODELS[model] || MODELS['deepseek-v3.1']
    });

    if (retryCount < 2) {
      await sleep(Math.pow(2, retryCount) * 1000);
      return callOpenRouter(model, message, retryCount + 1);
    }
    
    throw error;
  }
};

router.post('/chat', async (req, res) => {
  try {
    const { model = 'deepseek-v3.1', message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'OpenRouter API key not configured' });
    }

    console.log(`Chat request - Model: ${model}, Message length: ${message.length}`);

    const response = await callOpenRouter(model, message);
    
    console.log(`Chat response - Model: ${model}, Response length: ${response.length}`);
    
    res.json({ response });
  } catch (error) {
    console.error('Chat endpoint error:', error.message);
    res.status(500).json({ 
      error: 'Model is currently unavailable. Please try again.' 
    });
  }
});

module.exports = router;