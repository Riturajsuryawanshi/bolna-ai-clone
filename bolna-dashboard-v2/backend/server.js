const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const agentRoutes = require('./routes/agents')
const callRoutes = require('./routes/calls')
const providerRoutes = require('./routes/providers')
const analyticsRoutes = require('./routes/analytics')
const chatRoutes = require('./routes/chat')
const knowledgeRoutes = require('./routes/knowledge')

const app = express()
const PORT = process.env.PORT || 5001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/agents', agentRoutes)
app.use('/api/calls', callRoutes)
app.use('/api/providers', providerRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/knowledge', knowledgeRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Dashboard: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
})