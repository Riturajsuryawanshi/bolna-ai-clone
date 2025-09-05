const express = require('express')
const multer = require('multer')
const { PrismaClient } = require('@prisma/client')
const auth = require('../middleware/auth')

const router = express.Router()
const prisma = new PrismaClient()

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'text/plain', 'application/msword']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'), false)
    }
  }
})

// Get all knowledge bases
router.get('/', async (req, res) => {
  try {
    const knowledgeBases = await prisma.knowledgeBase.findMany({
      orderBy: { createdAt: 'desc' }
    })

    res.json(knowledgeBases)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single knowledge base
router.get('/:id', async (req, res) => {
  try {
    const knowledgeBase = await prisma.knowledgeBase.findUnique({
      where: { id: req.params.id }
    })

    if (!knowledgeBase) {
      return res.status(404).json({ error: 'Knowledge base not found' })
    }

    res.json(knowledgeBase)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create knowledge base
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body

    const knowledgeBase = await prisma.knowledgeBase.create({
      data: {
        name,
        description,
        documents: []
      }
    })

    res.status(201).json(knowledgeBase)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Upload document to knowledge base
router.post('/:id/upload', auth, upload.single('document'), async (req, res) => {
  try {
    const knowledgeBase = await prisma.knowledgeBase.findUnique({
      where: { id: req.params.id }
    })

    if (!knowledgeBase) {
      return res.status(404).json({ error: 'Knowledge base not found' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // TODO: Process document and extract text
    // TODO: Generate embeddings and store in vector database
    
    const documentMetadata = {
      id: Date.now().toString(),
      filename: req.file.originalname,
      size: req.file.size,
      type: req.file.mimetype,
      uploadedAt: new Date().toISOString(),
      path: req.file.path
    }

    const updatedDocuments = [...knowledgeBase.documents, documentMetadata]

    const updatedKnowledgeBase = await prisma.knowledgeBase.update({
      where: { id: req.params.id },
      data: { documents: updatedDocuments }
    })

    res.json({
      message: 'Document uploaded successfully',
      document: documentMetadata,
      knowledgeBase: updatedKnowledgeBase
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete knowledge base
router.delete('/:id', auth, async (req, res) => {
  try {
    const knowledgeBase = await prisma.knowledgeBase.findUnique({
      where: { id: req.params.id }
    })

    if (!knowledgeBase) {
      return res.status(404).json({ error: 'Knowledge base not found' })
    }

    await prisma.knowledgeBase.delete({
      where: { id: req.params.id }
    })

    res.json({ message: 'Knowledge base deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Search knowledge base
router.post('/:id/search', auth, async (req, res) => {
  try {
    const { query } = req.body
    
    const knowledgeBase = await prisma.knowledgeBase.findUnique({
      where: { id: req.params.id }
    })

    if (!knowledgeBase) {
      return res.status(404).json({ error: 'Knowledge base not found' })
    }

    // TODO: Implement vector search using Pinecone/Weaviate
    // For now, return mock results
    const results = [
      {
        id: '1',
        content: 'Mock search result content...',
        score: 0.95,
        document: 'document1.pdf'
      }
    ]

    res.json({ results })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router