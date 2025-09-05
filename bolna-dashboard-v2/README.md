# Bolna AI Dashboard - Full Stack Voice AI Platform

A complete replica of the Bolna.ai dashboard built with modern technologies, featuring comprehensive voice AI orchestration capabilities.

## 🚀 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Framer Motion** - Animation library
- **Recharts** - Chart library for analytics

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication
- **Passport.js** - OAuth integration

### Integrations
- **Twilio** - Telephony services
- **OpenAI** - LLM and TTS
- **Deepgram** - Speech-to-text
- **ElevenLabs** - Voice synthesis
- **OpenRouter** - Multi-model AI access

## 📁 Project Structure

```
bolna-dashboard-v2/
├── frontend/                 # Next.js React application
│   ├── app/
│   │   ├── components/      # Reusable UI components
│   │   ├── dashboard/       # Dashboard pages
│   │   └── lib/            # Utilities and helpers
│   └── package.json
├── backend/                 # Express.js API server
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic services
│   ├── middleware/         # Custom middleware
│   └── package.json
├── database/               # Database schema and migrations
│   └── schema.prisma      # Prisma schema
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Git

### 1. Clone and Setup

```bash
git clone <repository-url>
cd bolna-dashboard-v2
```

### 2. Database Setup

```bash
cd database
cp .env.example .env
# Edit .env with your PostgreSQL connection string

# Generate Prisma client and push schema
npx prisma generate
npx prisma db push
```

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys and configuration

# Start development server
npm run dev
```

Backend will be available at `http://localhost:5001`

### 4. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend API URL

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 🎯 Features Implemented

### ✅ Dashboard Layout
- [x] Responsive sidebar navigation
- [x] Top bar with balance and user info
- [x] Mobile-friendly design
- [x] Modern UI with shadcn/ui components

### ✅ Agent Setup
- [x] Create/edit/delete agents
- [x] Multi-tab configuration interface
- [x] LLM provider selection (OpenAI, Azure, OpenRouter, DeepSeek)
- [x] Audio provider configuration (Deepgram, ElevenLabs, etc.)
- [x] Engine and call settings
- [x] Real-time parameter adjustment (temperature, buffer size)

### ✅ Authentication
- [x] JWT-based authentication
- [x] OAuth integration (Google, GitHub)
- [x] Protected routes and middleware
- [x] User session management

### ✅ Call Management
- [x] Single call initiation
- [x] Batch call processing
- [x] Call history and status tracking
- [x] Twilio integration for telephony
- [x] Real-time call status updates

### ✅ Database Schema
- [x] Comprehensive Prisma schema
- [x] User management
- [x] Agent configurations
- [x] Call records and analytics
- [x] Provider API key storage

### 🚧 In Progress
- [ ] Knowledge Base management
- [ ] Voice Lab features
- [ ] Advanced analytics dashboard
- [ ] Real-time WebSocket connections
- [ ] File upload for batch calls

### 📋 Planned Features
- [ ] Vector database integration (Pinecone)
- [ ] Advanced call analytics
- [ ] Custom voice training
- [ ] Webhook management
- [ ] API documentation
- [ ] Billing and usage tracking

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bolna_dashboard"

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Telephony
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token

# AI Providers
OPENAI_API_KEY=your-openai-api-key
DEEPGRAM_API_KEY=your-deepgram-api-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key
```

**Frontend (.env):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/github` - GitHub OAuth
- `GET /api/auth/me` - Get current user

### Agents
- `GET /api/agents` - List user agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/:id` - Get agent details
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent
- `POST /api/agents/:id/test` - Test agent call

### Calls
- `GET /api/calls` - List user calls
- `POST /api/calls/start` - Start single call
- `POST /api/calls/batch` - Start batch calls
- `GET /api/calls/:id` - Get call details
- `POST /api/calls/:id/end` - End call

### Chat
- `POST /api/chat` - Send message to AI model

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Render/Heroku)
```bash
cd backend
# Set environment variables in hosting platform
# Deploy backend API
```

### Database (Supabase/Neon)
- Create PostgreSQL database
- Update DATABASE_URL in environment variables
- Run migrations: `npx prisma db push`

## 🧪 Testing

### Test Agent Creation
1. Navigate to `/dashboard/agents`
2. Click "Create Agent"
3. Configure agent settings across tabs
4. Save and test with phone call

### Test Batch Calls
1. Create an agent
2. Navigate to batch calls
3. Upload phone numbers or enter manually
4. Monitor call progress

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: Check the API endpoints above
- **Issues**: Create GitHub issues for bugs
- **Features**: Submit feature requests via issues

---

Built with ❤️ using Next.js, Express.js, Prisma, and modern web technologies.