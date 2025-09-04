# Bolna AI Platform Frontend

A complete replica of the Bolna AI platform's frontend built with React, Tailwind CSS, and Shadcn UI components.

## Features

- **Authentication**: Login/logout with JWT token management
- **Dashboard**: Overview of agents, calls, and analytics with interactive charts
- **Agent Management**: Create, edit, delete, and test voice agents
- **Knowledge Bases**: Upload and manage training data for agents
- **Integrations**: Connect various AI and telephony providers
- **Campaigns**: Bulk calling campaigns with progress tracking
- **Analytics**: Detailed performance metrics and call transcripts
- **Settings**: User profile, API keys, billing, and preferences

## Tech Stack

- **React 18** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Modern component library
- **Recharts** - Charts and data visualization
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── ui/           # Shadcn UI components
│   └── Layout.js     # Main layout component
├── contexts/
│   └── AuthContext.js # Authentication context
├── pages/
│   ├── Login.js      # Login page
│   ├── Dashboard.js  # Main dashboard
│   ├── Agents.js     # Agent management
│   ├── CreateAgent.js # Agent creation/editing
│   ├── KnowledgeBases.js # Knowledge base management
│   ├── Integrations.js # Provider integrations
│   ├── BatchCalls.js # Campaign management
│   ├── Analytics.js  # Analytics and reports
│   └── Settings.js   # User settings
├── services/
│   └── api.js        # API service layer
├── lib/
│   └── utils.js      # Utility functions
└── App.js            # Main app component
```

## Key Features

### Authentication
- Mock JWT authentication
- Protected routes
- User session management

### Agent Management
- Tabbed interface for agent configuration
- Template-based quick setup
- Real-time testing capabilities
- Provider selection (OpenAI, Anthropic, etc.)

### Modern UI/UX
- Blue-themed color scheme matching Bolna's branding
- Responsive design for all screen sizes
- Smooth animations and transitions
- Accessible components with ARIA labels

### Integration Ready
- API service layer for backend integration
- WebSocket support for real-time updates
- Modular component architecture

## Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5001/api
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Customization

The application is designed to be easily customizable:

1. **Colors**: Update the Tailwind config for different color schemes
2. **Components**: Modify Shadcn UI components in `src/components/ui/`
3. **API**: Update `src/services/api.js` for your backend endpoints
4. **Branding**: Change logos and text in the Layout component

## Production Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your hosting service (Vercel, Netlify, AWS S3, etc.)

3. **Update environment variables** for production API endpoints

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the MIT License.