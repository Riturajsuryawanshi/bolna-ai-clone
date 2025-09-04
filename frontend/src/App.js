import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Agents from './pages/Agents';
import CreateAgent from './pages/CreateAgent';
import Analytics from './pages/Analytics';
import BatchCalls from './pages/BatchCalls';
import APIIntegration from './pages/APIIntegration';
import KnowledgeBases from './pages/KnowledgeBases';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/agents/create" element={<CreateAgent />} />
        <Route path="/agents/edit/:id" element={<CreateAgent />} />
        <Route path="/knowledge-bases" element={<KnowledgeBases />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="/campaigns" element={<BatchCalls />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/api-integration" element={<APIIntegration />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;