'use client'

import { useState } from 'react'
import DashboardLayout from '../../components/dashboard-layout'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Input } from '../../components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Slider } from '../../components/ui/slider'
import { 
  Bot, 
  Plus, 
  Settings, 
  Play, 
  Pause, 
  Download, 
  Upload,
  Mic,
  Brain,
  Phone,
  Zap,
  BarChart3,
  PhoneIncoming
} from 'lucide-react'

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState('agent')
  const [temperature, setTemperature] = useState([0.7])
  const [bufferSize, setBufferSize] = useState([100])

  const agents = [
    { id: 1, name: 'Sales Assistant', type: 'sales', status: 'active', calls: 45 },
    { id: 2, name: 'Support Bot', type: 'support', status: 'inactive', calls: 23 },
    { id: 3, name: 'Lead Qualifier', type: 'lead', status: 'active', calls: 67 },
  ]

  return (
    <DashboardLayout currentPath="/dashboard/agents">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Agent Setup</h2>
            <p className="text-gray-600">Create and manage your voice AI agents</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import Agent
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Agent
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {agents.map((agent) => (
            <Card key={agent.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{agent.name}</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{agent.calls}</div>
                <p className="text-xs text-muted-foreground">
                  Total calls • {agent.status}
                </p>
                <div className="flex space-x-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agent Configuration</CardTitle>
            <CardDescription>
              Configure your agent settings across different modules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="agent" className="flex items-center">
                  <Bot className="h-4 w-4 mr-1" />
                  Agent
                </TabsTrigger>
                <TabsTrigger value="llm" className="flex items-center">
                  <Brain className="h-4 w-4 mr-1" />
                  LLM
                </TabsTrigger>
                <TabsTrigger value="audio" className="flex items-center">
                  <Mic className="h-4 w-4 mr-1" />
                  Audio
                </TabsTrigger>
                <TabsTrigger value="engine" className="flex items-center">
                  <Zap className="h-4 w-4 mr-1" />
                  Engine
                </TabsTrigger>
                <TabsTrigger value="call" className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="inbound" className="flex items-center">
                  <PhoneIncoming className="h-4 w-4 mr-1" />
                  Inbound
                </TabsTrigger>
              </TabsList>

              <TabsContent value="agent" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Agent Name</label>
                    <Input placeholder="Enter agent name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Agent Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales Assistant</SelectItem>
                        <SelectItem value="support">Support Bot</SelectItem>
                        <SelectItem value="lead">Lead Qualifier</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">System Prompt</label>
                  <textarea 
                    className="w-full h-32 p-3 border rounded-md resize-none"
                    placeholder="You are a helpful AI assistant..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="llm" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">LLM Provider</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="azure">Azure OpenAI</SelectItem>
                        <SelectItem value="openrouter">OpenRouter</SelectItem>
                        <SelectItem value="deepseek">DeepSeek</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Model</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="deepseek-chat">DeepSeek Chat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Temperature: {temperature[0]}</label>
                  <Slider
                    value={temperature}
                    onValueChange={setTemperature}
                    max={1}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </TabsContent>

              <TabsContent value="audio" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Speech-to-Text Provider</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select STT provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deepgram">Deepgram</SelectItem>
                        <SelectItem value="openai">OpenAI Whisper</SelectItem>
                        <SelectItem value="azure">Azure Speech</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Text-to-Speech Provider</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select TTS provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                        <SelectItem value="playht">Play.ht</SelectItem>
                        <SelectItem value="azure">Azure Speech</SelectItem>
                        <SelectItem value="openai">OpenAI TTS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Voice</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alloy">Alloy</SelectItem>
                      <SelectItem value="echo">Echo</SelectItem>
                      <SelectItem value="fable">Fable</SelectItem>
                      <SelectItem value="onyx">Onyx</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Buffer Size: {bufferSize[0]}ms</label>
                  <Slider
                    value={bufferSize}
                    onValueChange={setBufferSize}
                    max={500}
                    min={50}
                    step={10}
                    className="w-full"
                  />
                </div>
              </TabsContent>

              <TabsContent value="engine" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pipeline Engine</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select engine" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time Pipeline</SelectItem>
                        <SelectItem value="batch">Batch Processing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Latency Mode</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select latency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Latency</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="quality">Quality First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="call" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telephony Provider</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twilio">Twilio</SelectItem>
                        <SelectItem value="plivo">Plivo</SelectItem>
                        <SelectItem value="webrtc">WebRTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input placeholder="+1 (555) 123-4567" />
                  </div>
                </div>
                <Button className="w-full">
                  <Play className="h-4 w-4 mr-2" />
                  Test Call
                </Button>
              </TabsContent>

              <TabsContent value="tools" className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-gray-500">API integrations and tools coming soon</p>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-gray-500">Analytics configuration coming soon</p>
                </div>
              </TabsContent>

              <TabsContent value="inbound" className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-gray-500">Inbound call routing coming soon</p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline">Cancel</Button>
              <Button>Save Agent</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}