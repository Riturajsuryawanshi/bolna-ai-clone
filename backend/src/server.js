const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const agentRoutes = require('./routes/agents');
const callRoutes = require('./routes/calls');
const analyticsRoutes = require('./routes/analytics');
const webhookRoutes = require('./routes/webhooks');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/agent', agentRoutes);
app.use('/api/call', callRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/webhook', webhookRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Bolna Backend running on port ${PORT}`);
});

module.exports = app;