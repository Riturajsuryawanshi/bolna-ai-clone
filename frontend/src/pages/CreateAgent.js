import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PlayIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { agentAPI } from '../services/api';
import toast from 'react-hot-toast';

const AGENT_TYPES = ['conversational', 'sales', 'support', 'appointment', 'survey'];
const VOICES = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
const LANGUAGES = ['en', 'es', 'fr', 'de', 'it', 'pt', 'hi', 'ja', 'ko', 'zh'];

const PROVIDERS = {
  telephony: ['twilio', 'plivo', 'vonage'],
  llm: ['openai', 'anthropic', 'cohere'],
  tts: ['openai', 'elevenlabs', 'azure'],
  asr: ['deepgram', 'whisper', 'azure']
};

function CreateAgent() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [templates, setTemplates] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    type: 'conversational',
    prompt: '',
    voice: 'alloy',
    language: 'en',
    providers: {
      telephony: 'twilio',
      llm: 'openai',
      tts: 'openai',
      asr: 'deepgram'
    },
    settings: {
      maxCallDuration: 300,
      silenceTimeout: 30,
      interruptible: true
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
    if (isEdit) {
      fetchAgent();
    }
  }, [id, isEdit]);

  const fetchTemplates = async () => {
    try {
      const response = await agentAPI.getTemplates();
      setTemplates(response.data.templates);
    } catch (error) {
      console.error('Failed to load templates');
    }
  };

  const fetchAgent = async () => {
    try {
      const response = await agentAPI.get(id);
      setFormData(response.data.agent);
    } catch (error) {
      toast.error('Failed to load agent');
      navigate('/agents');
    }
  };

  const handleTemplateSelect = (templateKey) => {
    const template = templates[templateKey];
    if (template) {
      setFormData({
        ...formData,
        name: template.name,
        type: template.type,
        prompt: template.prompt
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        await agentAPI.update(id, formData);
        toast.success('Agent updated successfully');
      } else {
        await agentAPI.create(formData);
        toast.success('Agent created successfully');
      }
      navigate('/agents');
    } catch (error) {
      toast.error(isEdit ? 'Failed to update agent' : 'Failed to create agent');
    } finally {
      setLoading(false);
    }
  };

  const [testCallOpen, setTestCallOpen] = useState(false);
  const [testPhone, setTestPhone] = useState('');

  const handleTestCall = () => {
    toast.success(`Test call initiated to ${testPhone}`);
    setTestCallOpen(false);
    setTestPhone('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/agents')}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Agents
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEdit ? 'Edit Agent' : 'Create New Agent'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEdit ? 'Update your agent configuration' : 'Configure your AI voice agent with advanced settings'}
            </p>
          </div>
        </div>
        {isEdit && (
          <Dialog open={testCallOpen} onOpenChange={setTestCallOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <PlayIcon className="h-4 w-4" />
                Test Agent
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Test Your Agent</DialogTitle>
                <DialogDescription>
                  Enter a phone number to test your agent's performance
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <Input
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="+1234567890"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setTestCallOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleTestCall} disabled={!testPhone}>
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Start Test Call
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="llm">LLM</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="general" className="space-y-6">
            {/* Templates (only for new agents) */}
            {!isEdit && Object.keys(templates).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Start Templates</CardTitle>
                  <CardDescription>Choose a template to get started quickly</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(templates).map(([key, template]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleTemplateSelect(key)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition-colors"
                      >
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-gray-600 mt-1 capitalize">{template.type}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Configure your agent's basic settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name *</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="My Sales Assistant"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <Input
                      value={formData.phoneNumber || ''}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      placeholder="+1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({...formData, language: e.target.value})}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="hi">Hindi</option>
                      <option value="multilingual">Multilingual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Agent Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    >
                      {AGENT_TYPES.map(type => (
                        <option key={type} value={type} className="capitalize">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    placeholder="Describe what this agent does..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="llm" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Language Model Configuration</CardTitle>
                <CardDescription>Configure the AI model and conversation settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model Provider</label>
                    <select
                      value={formData.providers?.llm || 'openai'}
                      onChange={(e) => setFormData({
                        ...formData,
                        providers: { ...formData.providers, llm: e.target.value }
                      })}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    >
                      <option value="openai">OpenAI GPT</option>
                      <option value="anthropic">Anthropic Claude</option>
                      <option value="grok">Grok</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                    <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                      <option>gpt-4-turbo</option>
                      <option>gpt-3.5-turbo</option>
                      <option>claude-3-sonnet</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">System Prompt</label>
                  <textarea
                    value={formData.prompt}
                    onChange={(e) => setFormData({...formData, prompt: e.target.value})}
                    rows={8}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    placeholder="You are a helpful AI assistant. Your role is to..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Knowledge Base</label>
                  <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                    <option value="">Select knowledge base (optional)</option>
                    <option value="kb1">Product Documentation</option>
                    <option value="kb2">Customer Support Scripts</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Voice & Speech Configuration</CardTitle>
                <CardDescription>Configure text-to-speech and speech recognition settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TTS Provider</label>
                    <select
                      value={formData.providers?.tts || 'openai'}
                      onChange={(e) => setFormData({
                        ...formData,
                        providers: { ...formData.providers, tts: e.target.value }
                      })}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    >
                      <option value="openai">OpenAI TTS</option>
                      <option value="elevenlabs">ElevenLabs</option>
                      <option value="azure">Azure Speech</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Voice</label>
                    <select
                      value={formData.voice}
                      onChange={(e) => setFormData({...formData, voice: e.target.value})}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    >
                      {VOICES.map(voice => (
                        <option key={voice} value={voice} className="capitalize">
                          {voice}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ASR Provider</label>
                    <select
                      value={formData.providers?.asr || 'deepgram'}
                      onChange={(e) => setFormData({
                        ...formData,
                        providers: { ...formData.providers, asr: e.target.value }
                      })}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                    >
                      <option value="deepgram">Deepgram</option>
                      <option value="whisper">OpenAI Whisper</option>
                      <option value="azure">Azure Speech</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latency Mode</label>
                    <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                      <option value="low">Low Latency</option>
                      <option value="balanced">Balanced</option>
                      <option value="quality">High Quality</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Enable voice cloning</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Allow interruptions</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Workflows</CardTitle>
                <CardDescription>Configure conversation flows and call handling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Call Duration (minutes)</label>
                    <Input
                      type="number"
                      value={Math.floor((formData.settings?.maxCallDuration || 300) / 60)}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          maxCallDuration: parseInt(e.target.value) * 60
                        }
                      })}
                      min="1"
                      max="60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Silence Timeout (seconds)</label>
                    <Input
                      type="number"
                      value={formData.settings?.silenceTimeout || 30}
                      onChange={(e) => setFormData({
                        ...formData,
                        settings: {
                          ...formData.settings,
                          silenceTimeout: parseInt(e.target.value)
                        }
                      })}
                      min="5"
                      max="120"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Call Transfer Number</label>
                  <Input placeholder="+1234567890 (optional)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                  <Input placeholder="https://your-webhook-url.com (optional)" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Telephony & External Integrations</CardTitle>
                <CardDescription>Connect telephony providers and external services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telephony Provider</label>
                  <select
                    value={formData.providers?.telephony || 'twilio'}
                    onChange={(e) => setFormData({
                      ...formData,
                      providers: { ...formData.providers, telephony: e.target.value }
                    })}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="twilio">Twilio</option>
                    <option value="plivo">Plivo</option>
                    <option value="vonage">Vonage</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">External Integrations</h4>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Zapier webhook</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Make.com integration</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">CRM sync</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Your Agent</CardTitle>
                <CardDescription>Test your agent configuration before deployment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Call Simulator</h4>
                  <p className="text-sm text-gray-600 mb-4">Test your agent's responses in real-time</p>
                  <div className="space-y-3">
                    <Input placeholder="Enter test phone number" />
                    <Button className="w-full">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      Start Test Call
                    </Button>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Real-time Transcription</h4>
                  <div className="bg-white rounded border p-3 min-h-[100px] text-sm text-gray-600">
                    Transcription will appear here during test calls...
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : (isEdit ? 'Update Agent' : 'Create Agent')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/agents')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
}

export default CreateAgent;