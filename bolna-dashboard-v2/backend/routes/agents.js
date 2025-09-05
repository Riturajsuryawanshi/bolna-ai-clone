const express = require('express')
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get all agents for user
router.get('/', auth, async (req, res) => {
  try {
    const agents = await prisma.agent.findMany({
      where: { userId: req.user.id },
      include: {
        calls: {
          select: { id: true, status: true }
        }
      }
    })

    const agentsWithStats = agents.map(agent => ({
      ...agent,
      totalCalls: agent.calls.length,
      activeCalls: agent.calls.filter(call => call.status === 'IN_PROGRESS').length
    }))

    res.json(agentsWithStats)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single agent
router.get('/:id', auth, async (req, res) => {
  try {
    const agent = await prisma.agent.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
      include: {
        calls: true
      }
    })

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' })
    }

    res.json(agent)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create agent
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      type,
      systemPrompt,
      llmProvider,
      llmModel,
      temperature,
      sttProvider,
      ttsProvider,
      voice,
      bufferSize,
      pipelineEngine,
      latencyMode,
      telephonyProvider,
      phoneNumber
    } = req.body

    const agent = await prisma.agent.create({
      data: {
        name,
        type,
        systemPrompt,
        llmProvider,
        llmModel,
        temperature,
        sttProvider,
        ttsProvider,
        voice,
        bufferSize,
        pipelineEngine,
        latencyMode,
        telephonyProvider,
        phoneNumber,
        userId: req.user.id
      }
    })

    res.status(201).json(agent)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update agent
router.put('/:id', auth, async (req, res) => {
  try {
    const agent = await prisma.agent.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    })

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' })
    }

    const updatedAgent = await prisma.agent.update({
      where: { id: req.params.id },
      data: req.body
    })

    res.json(updatedAgent)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete agent
router.delete('/:id', auth, async (req, res) => {
  try {
    const agent = await prisma.agent.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    })

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' })
    }

    await prisma.agent.delete({
      where: { id: req.params.id }
    })

    res.json({ message: 'Agent deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Test agent call
router.post('/:id/test', auth, async (req, res) => {
  try {
    const { phoneNumber } = req.body
    const agent = await prisma.agent.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    })

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' })
    }

    // Create test call record
    const call = await prisma.call.create({
      data: {
        direction: 'OUTBOUND',
        toNumber: phoneNumber,
        fromNumber: agent.phoneNumber,
        status: 'PENDING',
        userId: req.user.id,
        agentId: agent.id
      }
    })

    // TODO: Integrate with Twilio/Plivo to make actual call
    
    res.json({ 
      message: 'Test call initiated',
      callId: call.id 
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router