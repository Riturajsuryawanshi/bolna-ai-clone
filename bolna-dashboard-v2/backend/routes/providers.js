const express = require('express')
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get all providers for user
router.get('/', auth, async (req, res) => {
  try {
    const providers = await prisma.provider.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        name: true,
        type: true,
        config: true,
        createdAt: true,
        updatedAt: true
        // Don't return API keys for security
      }
    })

    res.json(providers)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add/Update provider
router.post('/', auth, async (req, res) => {
  try {
    const { name, type, apiKey, config } = req.body

    const provider = await prisma.provider.upsert({
      where: {
        userId_name_type: {
          userId: req.user.id,
          name,
          type
        }
      },
      update: {
        apiKey,
        config
      },
      create: {
        name,
        type,
        apiKey,
        config,
        userId: req.user.id
      }
    })

    res.json({
      id: provider.id,
      name: provider.name,
      type: provider.type,
      config: provider.config
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete provider
router.delete('/:id', auth, async (req, res) => {
  try {
    const provider = await prisma.provider.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    })

    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' })
    }

    await prisma.provider.delete({
      where: { id: req.params.id }
    })

    res.json({ message: 'Provider deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Test provider connection
router.post('/:id/test', auth, async (req, res) => {
  try {
    const provider = await prisma.provider.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    })

    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' })
    }

    // TODO: Implement actual provider testing based on type
    let testResult = { success: true, message: 'Connection successful' }

    switch (provider.type) {
      case 'LLM':
        // Test LLM provider
        break
      case 'STT':
        // Test STT provider
        break
      case 'TTS':
        // Test TTS provider
        break
      case 'TELEPHONY':
        // Test telephony provider
        break
    }

    res.json(testResult)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router