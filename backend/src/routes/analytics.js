const express = require('express');
const router = express.Router();

// Mock analytics data
const generateMockAnalytics = () => {
  const now = new Date();
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    return {
      date: date.toISOString().split('T')[0],
      calls: Math.floor(Math.random() * 100) + 20,
      duration: Math.floor(Math.random() * 300) + 60,
      success_rate: Math.random() * 0.3 + 0.7
    };
  }).reverse();

  return {
    totalCalls: last30Days.reduce((sum, day) => sum + day.calls, 0),
    avgDuration: Math.floor(last30Days.reduce((sum, day) => sum + day.duration, 0) / last30Days.length),
    successRate: last30Days.reduce((sum, day) => sum + day.success_rate, 0) / last30Days.length,
    dailyStats: last30Days
  };
};

// GET /api/analytics/overview
router.get('/overview', (req, res) => {
  const analytics = generateMockAnalytics();
  
  res.json({
    success: true,
    data: {
      totalCalls: analytics.totalCalls,
      avgDuration: analytics.avgDuration,
      successRate: (analytics.successRate * 100).toFixed(1),
      activeAgents: Math.floor(Math.random() * 20) + 5,
      dailyStats: analytics.dailyStats
    }
  });
});

// GET /api/analytics/transcripts
router.get('/transcripts', (req, res) => {
  const { callId, agentId, limit = 10 } = req.query;
  
  const mockTranscripts = Array.from({ length: parseInt(limit) }, (_, i) => ({
    id: `transcript_${i + 1}`,
    callId: callId || `call_${i + 1}`,
    agentId: agentId || `agent_${Math.floor(Math.random() * 5) + 1}`,
    transcript: [
      { speaker: 'agent', text: 'Hello! How can I help you today?', timestamp: '2024-01-01T10:00:00Z' },
      { speaker: 'user', text: 'I need help with my account', timestamp: '2024-01-01T10:00:05Z' },
      { speaker: 'agent', text: 'I\'d be happy to help you with your account. Can you provide your account number?', timestamp: '2024-01-01T10:00:10Z' }
    ],
    summary: 'Customer inquiry about account assistance',
    sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
    duration: Math.floor(Math.random() * 300) + 60,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
  }));
  
  res.json({
    success: true,
    transcripts: mockTranscripts,
    total: mockTranscripts.length
  });
});

// GET /api/analytics/performance
router.get('/performance', (req, res) => {
  const { agentId, timeframe = '7d' } = req.query;
  
  const mockPerformance = {
    agentId: agentId || 'all',
    timeframe,
    metrics: {
      totalCalls: Math.floor(Math.random() * 1000) + 100,
      avgResponseTime: Math.floor(Math.random() * 500) + 200,
      customerSatisfaction: (Math.random() * 2 + 3).toFixed(1),
      resolutionRate: (Math.random() * 0.3 + 0.7).toFixed(2),
      avgCallDuration: Math.floor(Math.random() * 200) + 120
    },
    trends: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      calls: Math.floor(Math.random() * 50) + 10,
      avgDuration: Math.floor(Math.random() * 100) + 120,
      satisfaction: Math.random() * 2 + 3
    })).reverse()
  };
  
  res.json({
    success: true,
    performance: mockPerformance
  });
});

module.exports = router;