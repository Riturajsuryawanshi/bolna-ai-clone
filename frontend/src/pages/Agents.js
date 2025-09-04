import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon, PlayIcon, UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { agentAPI, callAPI } from '../services/api';
import toast from 'react-hot-toast';

function Agents() {
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: 'Sales Assistant',
      type: 'sales',
      status: 'active',
      language: 'English',
      voice: 'alloy',
      prompt: 'You are a helpful sales assistant that helps customers with product inquiries and purchases.',
      lastDeployed: '2024-01-20',
      callsToday: 45,
      successRate: '96%'
    },
    {
      id: 2,
      name: 'Customer Support',
      type: 'support',
      status: 'active',
      language: 'English',
      voice: 'nova',
      prompt: 'You are a customer support agent that helps resolve customer issues and provides technical assistance.',
      lastDeployed: '2024-01-18',
      callsToday: 32,
      successRate: '94%'
    },
    {
      id: 3,
      name: 'Lead Qualifier',
      type: 'sales',
      status: 'inactive',
      language: 'English',
      voice: 'echo',
      prompt: 'You are a lead qualification specialist that identifies potential customers and their needs.',
      lastDeployed: '2024-01-15',
      callsToday: 0,
      successRate: '92%'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [testCallOpen, setTestCallOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await agentAPI.list();
      setAgents(response.data.agents);
    } catch (error) {
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const deleteAgent = async (id) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await agentAPI.delete(id);
        setAgents(agents.filter(agent => agent.id !== id));
        toast.success('Agent deleted successfully');
      } catch (error) {
        toast.error('Failed to delete agent');
      }
    }
  };

  const startTestCall = async () => {
    if (!phoneNumber) {
      toast.error('Please enter a phone number');
      return;
    }

    toast.success(`Test call initiated to ${phoneNumber} with ${selectedAgent.name}`);
    setTestCallOpen(false);
    setPhoneNumber('');
    setSelectedAgent(null);
  };

  const handleTestCall = (agent) => {
    setSelectedAgent(agent);
    setTestCallOpen(true);
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || agent.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Voice Agents</h1>
          <p className="text-gray-600 mt-2">Manage and deploy your AI voice agents</p>
        </div>
        <Link to="/agents/create">
          <Button className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Create Agent
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Agents Grid */}
      {filteredAgents.length === 0 ? (
        <div className="text-center py-12">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm ? 'No agents found' : 'No agents'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first agent.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Link to="/agents/create">
                <Button>Create Agent</Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <CardDescription className="capitalize">{agent.type}</CardDescription>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    agent.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {agent.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {agent.prompt}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Calls Today:</span>
                    <p className="font-medium">{agent.callsToday}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Success Rate:</span>
                    <p className="font-medium">{agent.successRate}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Voice:</span>
                    <p className="font-medium capitalize">{agent.voice}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Language:</span>
                    <p className="font-medium">{agent.language}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleTestCall(agent)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <PlayIcon className="h-4 w-4 mr-1" />
                    Test
                  </Button>
                  <Link to={`/agents/edit/${agent.id}`}>
                    <Button variant="ghost" size="sm">
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAgent(agent.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Test Call Dialog */}
      <Dialog open={testCallOpen} onOpenChange={setTestCallOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Call - {selectedAgent?.name}</DialogTitle>
            <DialogDescription>
              Enter a phone number to test your agent's performance
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <Input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1234567890"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setTestCallOpen(false)}>
                Cancel
              </Button>
              <Button onClick={startTestCall} disabled={!phoneNumber}>
                <PlayIcon className="h-4 w-4 mr-2" />
                Start Test Call
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Agents;