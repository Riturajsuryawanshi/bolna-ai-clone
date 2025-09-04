const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Agent = require('../models/Agent');
const router = express.Router();

// In-memory storage (replace with database in production)
const agents = new Map();

// Agent templates
const templates = {
  sales: {
    name: 'Sales Assistant',
    prompt: 'You are a friendly sales assistant. Help customers understand our products and guide them through the purchase process.',
    type: 'sales'
  },
  support: {
    name: 'Customer Support',
    prompt: 'You are a helpful customer support agent. Assist customers with their questions and resolve issues professionally.',
    type: 'support'
  },
  appointment: {
    name: 'Appointment Scheduler',
    prompt: 'You are an appointment scheduling assistant. Help customers book appointments and manage their calendar.',
    type: 'appointment'
  }
};

// GET /api/agent/templates
router.get('/templates', (req, res) => {
  res.json({ templates });
});

// POST /api/agent/create
router.post('/create', (req, res) => {
  try {
    const agentData = {
      id: uuidv4(),
      ...req.body
    };
    
    const agent = new Agent(agentData);
    agents.set(agent.id, agent);
    
    res.status(201).json({
      success: true,
      agent: agent.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/agent/list
router.get('/list', (req, res) => {
  const agentList = Array.from(agents.values()).map(agent => agent.toJSON());
  res.json({
    success: true,
    agents: agentList,
    total: agentList.length
  });
});

// GET /api/agent/:id
router.get('/:id', (req, res) => {
  const agent = agents.get(req.params.id);
  if (!agent) {
    return res.status(404).json({
      success: false,
      error: 'Agent not found'
    });
  }
  
  res.json({
    success: true,
    agent: agent.toJSON()
  });
});

// PUT /api/agent/:id
router.put('/:id', (req, res) => {
  const agent = agents.get(req.params.id);
  if (!agent) {
    return res.status(404).json({
      success: false,
      error: 'Agent not found'
    });
  }
  
  try {
    const updatedAgent = new Agent({
      ...agent.toJSON(),
      ...req.body,
      id: req.params.id
    });
    
    agents.set(req.params.id, updatedAgent);
    
    res.json({
      success: true,
      agent: updatedAgent.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/agent/:id
router.delete('/:id', (req, res) => {
  const deleted = agents.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({
      success: false,
      error: 'Agent not found'
    });
  }
  
  res.json({
    success: true,
    message: 'Agent deleted successfully'
  });
});

module.exports = router;