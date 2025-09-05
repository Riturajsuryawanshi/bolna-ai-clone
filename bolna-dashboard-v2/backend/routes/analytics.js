const express = require('express')
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Get overview metrics
router.get('/overview', auth, async (req, res) => {
  try {
    const userId = req.user.id

    // Get total calls
    const totalCalls = await prisma.call.count({
      where: { userId }
    })

    // Get successful calls
    const successfulCalls = await prisma.call.count({
      where: { 
        userId,
        status: 'COMPLETED'
      }
    })

    // Get total duration
    const callsWithDuration = await prisma.call.findMany({
      where: { 
        userId,
        duration: { not: null }
      },
      select: { duration: true }
    })

    const totalDuration = callsWithDuration.reduce((sum, call) => sum + (call.duration || 0), 0)
    const avgDuration = totalCalls > 0 ? totalDuration / totalCalls : 0

    // Get total cost (mock calculation)
    const totalCost = totalDuration * 0.02 // $0.02 per minute

    // Success rate
    const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0

    res.json({
      totalCalls,
      successfulCalls,
      successRate: Math.round(successRate * 100) / 100,
      totalDuration,
      avgDuration: Math.round(avgDuration),
      totalCost: Math.round(totalCost * 100) / 100
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get call volume trends
router.get('/trends', auth, async (req, res) => {
  try {
    const { days = 7 } = req.query
    const userId = req.user.id

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(days))

    const calls = await prisma.call.findMany({
      where: {
        userId,
        createdAt: { gte: startDate }
      },
      select: {
        createdAt: true,
        status: true,
        duration: true
      }
    })

    // Group by date
    const trends = {}
    calls.forEach(call => {
      const date = call.createdAt.toISOString().split('T')[0]
      if (!trends[date]) {
        trends[date] = { date, calls: 0, successful: 0, duration: 0 }
      }
      trends[date].calls++
      if (call.status === 'COMPLETED') {
        trends[date].successful++
        trends[date].duration += call.duration || 0
      }
    })

    const trendData = Object.values(trends).sort((a, b) => new Date(a.date) - new Date(b.date))

    res.json(trendData)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get cost breakdown
router.get('/costs', auth, async (req, res) => {
  try {
    const userId = req.user.id

    const calls = await prisma.call.findMany({
      where: { 
        userId,
        status: 'COMPLETED',
        duration: { not: null }
      },
      select: {
        duration: true,
        agent: {
          select: {
            llmProvider: true,
            sttProvider: true,
            ttsProvider: true,
            telephonyProvider: true
          }
        }
      }
    })

    let costs = {
      transcriber: 0,
      llm: 0,
      voice: 0,
      telephony: 0,
      platform: 0
    }

    calls.forEach(call => {
      const minutes = (call.duration || 0) / 60
      
      // Mock cost calculations (replace with actual provider pricing)
      costs.transcriber += minutes * 0.005  // $0.005 per minute
      costs.llm += minutes * 0.01          // $0.01 per minute
      costs.voice += minutes * 0.008       // $0.008 per minute
      costs.telephony += minutes * 0.015   // $0.015 per minute
      costs.platform += minutes * 0.002    // $0.002 per minute
    })

    // Round to 2 decimal places
    Object.keys(costs).forEach(key => {
      costs[key] = Math.round(costs[key] * 100) / 100
    })

    res.json(costs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get recent transcripts
router.get('/transcripts', auth, async (req, res) => {
  try {
    const { limit = 10 } = req.query
    const userId = req.user.id

    const calls = await prisma.call.findMany({
      where: {
        userId,
        transcript: { not: null }
      },
      include: {
        agent: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    })

    const transcripts = calls.map(call => ({
      id: call.id,
      agentName: call.agent?.name || 'Unknown',
      transcript: call.transcript,
      summary: call.summary,
      sentiment: call.sentiment,
      duration: call.duration,
      createdAt: call.createdAt
    }))

    res.json(transcripts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router