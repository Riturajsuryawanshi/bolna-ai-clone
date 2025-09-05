const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, name, password } = req.body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        // Note: In production, store hashed password in separate table
      }
    })

    const token = generateToken(user.id)

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        balance: user.balance
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // TODO: Verify password (implement password hashing)
    
    const token = generateToken(user.id)

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        balance: user.balance
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}))

router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      const { profile } = req.user
      
      let user = await prisma.user.findUnique({
        where: { email: profile.emails[0].value }
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: profile.emails[0].value,
            name: profile.displayName,
            avatar: profile.photos[0]?.value,
            googleId: profile.id
          }
        })
      }

      const token = generateToken(user.id)
      
      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`)
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/auth/error`)
    }
  }
)

// GitHub OAuth
router.get('/github', passport.authenticate('github', {
  scope: ['user:email']
}))

router.get('/github/callback',
  passport.authenticate('github', { session: false }),
  async (req, res) => {
    try {
      const { profile } = req.user
      
      let user = await prisma.user.findUnique({
        where: { email: profile.emails[0].value }
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            email: profile.emails[0].value,
            name: profile.displayName || profile.username,
            avatar: profile.photos[0]?.value,
            githubId: profile.id
          }
        })
      }

      const token = generateToken(user.id)
      
      res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`)
    } catch (error) {
      res.redirect(`${process.env.FRONTEND_URL}/auth/error`)
    }
  }
)

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      balance: user.balance,
      avatar: user.avatar
    })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

module.exports = router