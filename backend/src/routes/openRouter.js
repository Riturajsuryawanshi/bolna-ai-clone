const express = require('express');
const openRouterService = require('../services/openRouterService');
const router = express.Router();

// Get available models
router.get('/models', async (req, res) => {
  try {
    const models = await openRouterService.getAvailableModels();
    res.json({ success: true, models });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Chat with selected model
router.post('/chat', async (req, res) => {
  try {
    const { model, message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const result = await openRouterService.chat(model, message);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;