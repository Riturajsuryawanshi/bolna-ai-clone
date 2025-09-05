const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' })
  }
}

module.exports = auth