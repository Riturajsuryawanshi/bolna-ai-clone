const express = require('express')
const OpenAI = require('openai')
const axios = require('axios')
const auth = require('../middleware/auth')

const router = express.Router()

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Chat with AI models
router.post('/', auth, async (req, res) => {
  try {
    const { message, model = 'gpt-3.5-turbo', provider = 'openai' } = req.body

    let response

    switch (provider) {
      case 'openai':
        response = await chatWithOpenAI(message, model)
        break
      case 'openrouter':
        response = await chatWithOpenRouter(message, model)
        break
      case 'deepseek':
        response = await chatWithDeepSeek(message, model)
        break
      default:
        return res.status(400).json({ error: 'Unsupported provider' })
    }

    res.json({ response })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

async function chatWithOpenAI(message, model) {
  const completion = await openai.chat.completions.create({
    model,
    messages: [{ role: 'user', content: message }],
    max_tokens: 1000
  })

  return completion.choices[0].message.content
}

async function chatWithOpenRouter(message, model) {
  const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
    model,
    messages: [{ role: 'user', content: message }],
    max_tokens: 1000
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json'
    }
  })

  return response.data.choices[0].message.content
}

async function chatWithDeepSeek(message, model) {
  const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
    model,
    messages: [{ role: 'user', content: message }],
    max_tokens: 1000
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json'
    }
  })

  return response.data.choices[0].message.content
}

module.exports = router