const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Call = require('../models/Call');
const TelephonyService = require('../services/TelephonyService');
const router = express.Router();

// In-memory storage
const calls = new Map();
const telephonyService = new TelephonyService();

// POST /api/call/start
router.post('/start', async (req, res) => {
  try {
    const { agentId, phoneNumber, metadata } = req.body;
    
    const callData = {
      id: uuidv4(),
      agentId,
      phoneNumber,
      metadata
    };
    
    const call = new Call(callData);
    calls.set(call.id, call);
    
    // Simulate call initiation
    const callResult = await telephonyService.initiateCall(call);
    
    res.status(201).json({
      success: true,
      call: call.toJSON(),
      callSid: callResult.callSid
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/call/batch
router.post('/batch', async (req, res) => {
  try {
    const { agentId, phoneNumbers, metadata } = req.body;
    const batchId = uuidv4();
    const batchCalls = [];
    
    for (const phoneNumber of phoneNumbers) {
      const callData = {
        id: uuidv4(),
        agentId,
        phoneNumber,
        metadata: { ...metadata, batchId }
      };
      
      const call = new Call(callData);
      calls.set(call.id, call);
      batchCalls.push(call.toJSON());
      
      // Simulate staggered call initiation
      setTimeout(() => {
        telephonyService.initiateCall(call);
      }, batchCalls.length * 1000);
    }
    
    res.status(201).json({
      success: true,
      batchId,
      calls: batchCalls,
      total: batchCalls.length
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/call/status/:id
router.get('/status/:id', (req, res) => {
  const call = calls.get(req.params.id);
  if (!call) {
    return res.status(404).json({
      success: false,
      error: 'Call not found'
    });
  }
  
  res.json({
    success: true,
    call: call.toJSON()
  });
});

// GET /api/call/list
router.get('/list', (req, res) => {
  const { agentId, status, limit = 50 } = req.query;
  let callList = Array.from(calls.values());
  
  if (agentId) {
    callList = callList.filter(call => call.agentId === agentId);
  }
  
  if (status) {
    callList = callList.filter(call => call.status === status);
  }
  
  callList = callList
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
    .slice(0, parseInt(limit))
    .map(call => call.toJSON());
  
  res.json({
    success: true,
    calls: callList,
    total: callList.length
  });
});

// POST /api/call/:id/end
router.post('/:id/end', (req, res) => {
  const call = calls.get(req.params.id);
  if (!call) {
    return res.status(404).json({
      success: false,
      error: 'Call not found'
    });
  }
  
  call.endCall();
  
  res.json({
    success: true,
    call: call.toJSON()
  });
});

module.exports = router;