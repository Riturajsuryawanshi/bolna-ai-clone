# OpenRouter Integration Setup

## 1. Get OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai)
2. Sign up for an account
3. Go to [API Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Copy the API key (starts with `sk-or-v1-...`)

## 2. Configure Environment Variables

Add your OpenRouter API key to the backend `.env` file:

```env
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
```

## 3. Install Dependencies

Backend dependencies are already included in package.json:
- `axios` for API calls
- `express` for routing
- `cors` for cross-origin requests

## 4. Start the Application

### Backend:
```bash
cd backend
npm install
npm run dev
```

### Frontend:
```bash
cd frontend
npm install
npm start
```

## 5. Access AI Chat

1. Open your browser to `http://localhost:3000`
2. Navigate to "AI Chat" in the sidebar
3. Select an AI model from the dropdown
4. Start chatting!

## 6. Available Models

The system includes these popular models:
- **DeepSeek V3.1** - Fast and efficient
- **OpenAI GPT-OSS-120B** - High-quality responses
- **Mistral 7B Instruct** - Good balance of speed/quality
- **Claude 3 Haiku** - Anthropic's fast model
- **Llama 3.1 8B** - Meta's open-source model

## 7. API Endpoints

- `GET /api/openrouter/models` - Get available models
- `POST /api/openrouter/chat` - Send chat message

## 8. Pricing

OpenRouter uses pay-per-use pricing. Check [OpenRouter Pricing](https://openrouter.ai/docs#models) for current rates.

## 9. Troubleshooting

- **"Failed to fetch models"**: Check your API key in `.env`
- **CORS errors**: Ensure backend is running on port 5001
- **API errors**: Check OpenRouter API status and your account balance