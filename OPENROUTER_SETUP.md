# OpenRouter Multi-Model Chat Setup Guide

This guide will help you set up the OpenRouter integration for multi-model AI chat in your Bolna.ai project.

## 🔑 Getting Your OpenRouter API Key

1. **Visit OpenRouter**: Go to [https://openrouter.ai](https://openrouter.ai)
2. **Sign Up/Login**: Create an account or log in
3. **Get API Key**: Navigate to your dashboard and generate an API key
4. **Add Credits**: Add some credits to your account to use the models

## 🛠️ Backend Setup

### 1. Environment Configuration

Copy the environment example and add your OpenRouter API key:

```bash
cd backend
cp .env.example .env
```

Edit your `.env` file and add:

```env
# OpenRouter Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here
HTTP_REFERER=http://localhost:3000
```

### 2. Install Dependencies

Make sure all dependencies are installed:

```bash
npm install
```

### 3. Start the Backend Server

```bash
npm run dev
```

The backend will be available at `http://localhost:5001`

## 🎨 Frontend Setup

### 1. Environment Configuration

```bash
cd frontend
cp .env.example .env
```

The default configuration should work for local development:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Frontend

```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## 🤖 Available Models

The system supports these AI models:

| Display Name | Model ID | Provider |
|-------------|----------|----------|
| DeepSeek V3.1 | `deepseek/deepseek-v3.1` | DeepSeek |
| GPT-OSS 120B | `openai/gpt-oss-120b` | OpenAI |
| Mistral 7B Instruct | `mistralai/mistral-7b-instruct` | Mistral |

## 🧪 Testing the Integration

1. **Open the Frontend**: Navigate to `http://localhost:3000`
2. **Go to AI Chat**: Click on "AI Chat" in the navigation
3. **Select a Model**: Choose from the dropdown menu
4. **Send a Message**: Type a message and click "Send"
5. **View Response**: The AI response will appear on the left side

## 🚀 Production Deployment

### Backend (Node.js)

**For Render/Railway/Heroku:**

1. Set environment variables:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `HTTP_REFERER`: Your production domain (e.g., `https://yourdomain.com`)
   - `PORT`: Will be set automatically by the platform

2. Deploy the `backend` folder

**For Vercel (Serverless):**

Create `vercel.json` in the backend folder:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/src/server.js"
    }
  ]
}
```

### Frontend (React)

**For Vercel/Netlify:**

1. Update `.env.production`:
   ```env
   REACT_APP_API_URL=https://your-backend-domain.com/api
   ```

2. Build and deploy:
   ```bash
   npm run build
   ```

3. Deploy the `build` folder

## 🔧 Troubleshooting

### Common Issues

**1. "OpenRouter API key not configured"**
- Make sure `OPENROUTER_API_KEY` is set in your `.env` file
- Restart the backend server after adding the key

**2. "Model is currently unavailable"**
- Check your OpenRouter account has sufficient credits
- Verify the API key is correct
- Check the backend logs for detailed error messages

**3. CORS Issues**
- Make sure the backend is running on port 5001
- Check that `HTTP_REFERER` matches your frontend URL

**4. Network Timeouts**
- The system has built-in retry logic (up to 2 retries)
- Some models may take longer to respond

### Debugging

**Backend Logs:**
```bash
cd backend
npm run dev
```

Check the console for request/response logs and error messages.

**Frontend Network Tab:**
Open browser DevTools → Network tab to see API requests and responses.

## 💡 Tips for Best Results

1. **Model Selection**: Different models have different strengths:
   - DeepSeek V3.1: Great for reasoning and coding
   - GPT-OSS 120B: Excellent for general conversation
   - Mistral 7B: Fast and efficient for simple tasks

2. **Message Length**: Keep messages reasonable in length for better performance

3. **Rate Limits**: OpenRouter has rate limits, so avoid sending too many requests quickly

4. **Cost Management**: Monitor your OpenRouter usage to manage costs

## 📊 Monitoring Usage

1. **OpenRouter Dashboard**: Check your usage at [https://openrouter.ai/activity](https://openrouter.ai/activity)
2. **Backend Logs**: Monitor request logs for usage patterns
3. **Error Tracking**: Set up error monitoring for production deployments

## 🆘 Support

If you encounter issues:

1. Check the backend logs for detailed error messages
2. Verify your OpenRouter API key and credits
3. Test the API endpoints directly using tools like Postman
4. Check the GitHub issues for similar problems

---

**Happy Chatting! 🚀**