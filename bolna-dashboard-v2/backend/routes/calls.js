const express = require('express')
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')
const TwilioService = require('../services/TwilioService')

const router = express.Router()
const prisma = new PrismaClient()

// Get all calls for user
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, agentId } = req.query
    
    const where = { userId: req.user.id }
    if (status) where.status = status
    if (agentId) where.agentId = agentId

    const calls = await prisma.call.findMany({
      where,
      include: {
        agent: {
          select: { id: true, name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    })

    const total = await prisma.call.count({ where })

    res.json({
      calls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single call
router.get('/:id', auth, async (req, res) => {
  try {
    const call = await prisma.call.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
      include: {
        agent: true,
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      }
    })

    if (!call) {
      return res.status(404).json({ error: 'Call not found' })
    }

    res.json(call)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Start single call
router.post('/start', auth, async (req, res) => {
  try {
    const { agentId, toNumber, fromNumber } = req.body

    const agent = await prisma.agent.findFirst({
      where: { 
        id: agentId,
        userId: req.user.id 
      }
    })

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' })
    }

    // Create call record
    const call = await prisma.call.create({
      data: {
        direction: 'OUTBOUND',
        toNumber,
        fromNumber: fromNumber || agent.phoneNumber,
        status: 'PENDING',
        userId: req.user.id,
        agentId: agent.id
      }
    })

    // Initiate call via Twilio
    try {
      const twilioService = new TwilioService()
      const twilioCall = await twilioService.makeCall({
        to: toNumber,
        from: fromNumber || agent.phoneNumber,
        url: `${process.env.BASE_URL}/api/calls/${call.id}/webhook`
      })

      await prisma.call.update({
        where: { id: call.id },
        data: { 
          status: 'IN_PROGRESS',
          startedAt: new Date()
        }
      })

      res.json({ 
        message: 'Call initiated successfully',
        callId: call.id,
        twilioCallSid: twilioCall.sid
      })
    } catch (twilioError) {
      await prisma.call.update({
        where: { id: call.id },
        data: { status: 'FAILED' }
      })
      
      throw twilioError
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Start batch calls
router.post('/batch', auth, async (req, res) => {
  try {
    const { agentId, phoneNumbers, delay = 5000 } = req.body

    const agent = await prisma.agent.findFirst({
      where: { 
        id: agentId,
        userId: req.user.id 
      }
    })

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' })
    }

    const calls = []
    
    for (const phoneNumber of phoneNumbers) {
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
      calls.push(call)
    }

    // Process batch calls with delay
    setTimeout(async () => {
      const twilioService = new TwilioService()
      
      for (let i = 0; i < calls.length; i++) {
        const call = calls[i]
        
        try {
          await twilioService.makeCall({
            to: call.toNumber,
            from: call.fromNumber,
            url: `${process.env.BASE_URL}/api/calls/${call.id}/webhook`
          })

          await prisma.call.update({
            where: { id: call.id },
            data: { 
              status: 'IN_PROGRESS',
              startedAt: new Date()
            }
          })
        } catch (error) {
          await prisma.call.update({
            where: { id: call.id },
            data: { status: 'FAILED' }
          })
        }

        // Wait before next call
        if (i < calls.length - 1) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }, 1000)

    res.json({ 
      message: 'Batch calls initiated',
      totalCalls: calls.length,
      callIds: calls.map(c => c.id)
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// End call
router.post('/:id/end', auth, async (req, res) => {
  try {
    const call = await prisma.call.findFirst({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    })

    if (!call) {
      return res.status(404).json({ error: 'Call not found' })
    }

    const updatedCall = await prisma.call.update({
      where: { id: req.params.id },
      data: { 
        status: 'COMPLETED',
        endedAt: new Date()
      }
    })

    res.json(updatedCall)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Twilio webhook
router.post('/:id/webhook', async (req, res) => {
  try {
    const { CallStatus, CallDuration } = req.body
    
    const updateData = {}
    
    if (CallStatus === 'completed') {
      updateData.status = 'COMPLETED'
      updateData.endedAt = new Date()
      updateData.duration = parseInt(CallDuration) || 0
    } else if (CallStatus === 'failed' || CallStatus === 'busy' || CallStatus === 'no-answer') {
      updateData.status = 'FAILED'
      updateData.endedAt = new Date()
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.call.update({
        where: { id: req.params.id },
        data: updateData
      })
    }

    res.status(200).send('OK')
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).send('Error')
  }
})

module.exports = router