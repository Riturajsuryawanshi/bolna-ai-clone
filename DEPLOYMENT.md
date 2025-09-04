# Vercel Deployment Guide

## Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Create a Vercel account at https://vercel.com

## Deployment Steps

### 1. Login to Vercel
```bash
vercel login
```

### 2. Deploy from project root
```bash
cd d:\bolna_ai\bolna
vercel
```

### 3. Configure Environment Variables
In Vercel dashboard, add these environment variables:

**Required:**
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN` 
- `TWILIO_PHONE_NUMBER`
- `OPENAI_API_KEY`

**Optional:**
- `PLIVO_AUTH_ID`
- `PLIVO_AUTH_TOKEN`
- `ELEVENLABS_API_KEY`
- `DEEPGRAM_API_KEY`
- `ANTHROPIC_API_KEY`

### 4. Custom Domain (Optional)
- Go to Vercel dashboard → Project → Settings → Domains
- Add your custom domain

## Project Structure
- Frontend: React app served from `/`
- Backend: API routes served from `/api/*`
- Both deployed as single Vercel project

## Troubleshooting
- Check Vercel function logs for backend errors
- Ensure all environment variables are set
- Frontend API calls use relative paths (`/api/...`)