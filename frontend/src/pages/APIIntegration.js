import React, { useState } from 'react';
import { ClipboardDocumentIcon, PlayIcon } from '@heroicons/react/24/outline';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { callAPI } from '../services/api';
import toast from 'react-hot-toast';

const API_EXAMPLES = {
  createAgent: {
    title: 'Create Agent',
    method: 'POST',
    endpoint: '/api/agent/create',
    code: `curl -X POST https://api.bolna.ai/agent/create \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "name": "Sales Assistant",
    "type": "sales",
    "prompt": "You are a helpful sales assistant...",
    "voice": "alloy",
    "language": "en",
    "providers": {
      "telephony": "twilio",
      "llm": "openai",
      "tts": "openai",
      "asr": "deepgram"
    }
  }'`
  },
  startCall: {
    title: 'Start Call',
    method: 'POST',
    endpoint: '/api/call/start',
    code: `curl -X POST https://api.bolna.ai/call/start \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "agentId": "agent_123",
    "phoneNumber": "+1234567890",
    "metadata": {
      "campaign": "Q1_Sales",
      "priority": "high"
    }
  }'`
  },
  batchCalls: {
    title: 'Batch Calls',
    method: 'POST',
    endpoint: '/api/call/batch',
    code: `curl -X POST https://api.bolna.ai/call/batch \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "agentId": "agent_123",
    "phoneNumbers": ["+1234567890", "+1234567891"],
    "metadata": {
      "batchName": "Customer Survey",
      "delay": 5000
    }
  }'`
  },
  getAnalytics: {
    title: 'Get Analytics',
    method: 'GET',
    endpoint: '/api/analytics/overview',
    code: `curl -X GET https://api.bolna.ai/analytics/overview \\
  -H "Authorization: Bearer YOUR_API_KEY"`
  }
};

const WEBHOOK_EXAMPLES = {
  callStatus: {
    title: 'Call Status Webhook',
    description: 'Receive real-time call status updates',
    code: `{
  "event": "call.status.updated",
  "callId": "call_123",
  "status": "completed",
  "duration": 180,
  "timestamp": "2024-01-01T12:00:00Z",
  "metadata": {
    "agentId": "agent_123",
    "phoneNumber": "+1234567890"
  }
}`
  },
  transcript: {
    title: 'Transcript Webhook',
    description: 'Receive call transcripts in real-time',
    code: `{
  "event": "call.transcript",
  "callId": "call_123",
  "transcript": [
    {
      "speaker": "agent",
      "text": "Hello, how can I help you?",
      "timestamp": "2024-01-01T12:00:00Z"
    },
    {
      "speaker": "user", 
      "text": "I need help with my account",
      "timestamp": "2024-01-01T12:00:05Z"
    }
  ]
}`
  }
};

function APIIntegration() {
  const [selectedExample, setSelectedExample] = useState('createAgent');
  const [testEndpoint, setTestEndpoint] = useState('');
  const [testPayload, setTestPayload] = useState('{}');
  const [testResponse, setTestResponse] = useState('');
  const [testing, setTesting] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const testAPI = async () => {
    if (!testEndpoint) {
      toast.error('Please enter an endpoint');
      return;
    }

    setTesting(true);
    try {
      // Mock API test - in real app, this would make actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResponse = {
        success: true,
        data: {
          id: 'test_123',
          status: 'success',
          message: 'API test completed successfully'
        },
        timestamp: new Date().toISOString()
      };
      
      setTestResponse(JSON.stringify(mockResponse, null, 2));
      toast.success('API test completed');
    } catch (error) {
      setTestResponse(JSON.stringify({ error: error.message }, null, 2));
      toast.error('API test failed');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">API Integration</h1>
        <p className="text-gray-600 mt-1">Integrate Bolna's voice AI into your applications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Examples */}
        <div className="lg:col-span-2 space-y-6">
          {/* Example Selector */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">API Examples</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(API_EXAMPLES).map(([key, example]) => (
                <button
                  key={key}
                  onClick={() => setSelectedExample(key)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedExample === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {example.title}
                </button>
              ))}
            </div>

            {/* Selected Example */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{API_EXAMPLES[selectedExample].title}</h4>
                    <p className="text-sm text-gray-600">
                      {API_EXAMPLES[selectedExample].method} {API_EXAMPLES[selectedExample].endpoint}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(API_EXAMPLES[selectedExample].code)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <ClipboardDocumentIcon className="h-4 w-4" />
                    Copy
                  </button>
                </div>
              </div>
              <SyntaxHighlighter
                language="bash"
                style={tomorrow}
                customStyle={{ margin: 0, background: '#1a1a1a' }}
              >
                {API_EXAMPLES[selectedExample].code}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* API Tester */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">API Tester</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endpoint
                </label>
                <input
                  type="text"
                  value={testEndpoint}
                  onChange={(e) => setTestEndpoint(e.target.value)}
                  placeholder="/api/agent/create"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Payload (JSON)
                </label>
                <textarea
                  value={testPayload}
                  onChange={(e) => setTestPayload(e.target.value)}
                  rows={6}
                  className="input-field font-mono text-sm"
                  placeholder='{"key": "value"}'
                />
              </div>

              <button
                onClick={testAPI}
                disabled={testing}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <PlayIcon className="h-4 w-4" />
                {testing ? 'Testing...' : 'Test API'}
              </button>

              {testResponse && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response
                  </label>
                  <SyntaxHighlighter
                    language="json"
                    style={tomorrow}
                    customStyle={{ fontSize: '12px' }}
                  >
                    {testResponse}
                  </SyntaxHighlighter>
                </div>
              )}
            </div>
          </div>

          {/* Webhooks */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Webhook Examples</h3>
            <div className="space-y-4">
              {Object.entries(WEBHOOK_EXAMPLES).map(([key, webhook]) => (
                <div key={key} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{webhook.title}</h4>
                        <p className="text-sm text-gray-600">{webhook.description}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(webhook.code)}
                        className="btn-secondary flex items-center gap-2"
                      >
                        <ClipboardDocumentIcon className="h-4 w-4" />
                        Copy
                      </button>
                    </div>
                  </div>
                  <SyntaxHighlighter
                    language="json"
                    style={tomorrow}
                    customStyle={{ margin: 0, fontSize: '12px' }}
                  >
                    {webhook.code}
                  </SyntaxHighlighter>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">
                📚 API Documentation
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">
                🔑 Get API Keys
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">
                💬 Discord Community
              </a>
              <a href="#" className="block text-blue-600 hover:text-blue-800 text-sm">
                🐛 Report Issues
              </a>
            </div>
          </div>

          {/* SDKs */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">SDKs & Libraries</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Python SDK</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Available</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Node.js SDK</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Available</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Go SDK</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Coming Soon</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">PHP SDK</span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Coming Soon</span>
              </div>
            </div>
          </div>

          {/* Rate Limits */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Rate Limits</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>API Calls</span>
                <span>1000/hour</span>
              </div>
              <div className="flex justify-between">
                <span>Concurrent Calls</span>
                <span>50</span>
              </div>
              <div className="flex justify-between">
                <span>Batch Size</span>
                <span>500</span>
              </div>
            </div>
          </div>

          {/* Support */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Our team is here to help you integrate successfully.
            </p>
            <button className="btn-primary w-full">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default APIIntegration;