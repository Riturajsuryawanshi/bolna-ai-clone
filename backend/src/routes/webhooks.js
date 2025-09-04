const express = require('express');
const router = express.Router();

// POST /api/webhook/twilio
router.post('/twilio', (req, res) => {
  const { CallSid, CallStatus, From, To } = req.body;
  
  console.log('Twilio webhook received:', {
    CallSid,
    CallStatus,
    From,
    To,
    timestamp: new Date().toISOString()
  });
  
  // Process webhook based on call status
  switch (CallStatus) {
    case 'ringing':
      console.log(`Call ${CallSid} is ringing`);
      break;
    case 'in-progress':
      console.log(`Call ${CallSid} answered`);
      break;
    case 'completed':
      console.log(`Call ${CallSid} completed`);
      break;
    case 'failed':
      console.log(`Call ${CallSid} failed`);
      break;
  }
  
  res.status(200).send('OK');
});

// POST /api/webhook/plivo
router.post('/plivo', (req, res) => {
  const { CallUUID, Event, From, To } = req.body;
  
  console.log('Plivo webhook received:', {
    CallUUID,
    Event,
    From,
    To,
    timestamp: new Date().toISOString()
  });
  
  res.status(200).send('OK');
});

// POST /api/webhook/deepgram
router.post('/deepgram', (req, res) => {
  const { transcript, confidence, is_final } = req.body;
  
  if (is_final) {
    console.log('Deepgram transcript:', {
      text: transcript,
      confidence,
      timestamp: new Date().toISOString()
    });
  }
  
  res.status(200).send('OK');
});

module.exports = router;