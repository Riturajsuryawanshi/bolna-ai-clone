import React, { useState, useEffect } from 'react';
import { PlayIcon, PauseIcon, DocumentArrowUpIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { agentAPI, callAPI } from '../services/api';
import toast from 'react-hot-toast';

function BatchCalls() {
  const [agents, setAgents] = useState([
    { id: 1, name: 'Sales Assistant' },
    { id: 2, name: 'Customer Support' },
    { id: 3, name: 'Lead Qualifier' }
  ]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [batchName, setBatchName] = useState('');
  const [delay, setDelay] = useState(5);
  const [scheduledTime, setScheduledTime] = useState('');
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAgents();
    fetchBatches();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await agentAPI.list();
      setAgents(response.data.agents);
    } catch (error) {
      toast.error('Failed to load agents');
    }
  };

  const fetchBatches = async () => {
    // Mock batch data - in real app, this would come from API
    setBatches([
      {
        id: 'batch_1',
        name: 'Sales Outreach Q1',
        agentId: 'agent_1',
        status: 'completed',
        totalCalls: 150,
        completedCalls: 150,
        successRate: 85,
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'batch_2',
        name: 'Customer Survey',
        agentId: 'agent_2',
        status: 'in_progress',
        totalCalls: 100,
        completedCalls: 45,
        successRate: 78,
        createdAt: '2024-01-20T14:30:00Z'
      }
    ]);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target.result;
        const lines = csv.split('\n').filter(line => line.trim());
        const numbers = lines.map(line => line.split(',')[0].trim()).filter(num => num);
        setPhoneNumbers(numbers.join('\n'));
        toast.success(`Loaded ${numbers.length} phone numbers`);
      };
      reader.readAsText(file);
    } else {
      toast.error('Please upload a CSV file');
    }
  };

  const startBatchCalls = async () => {
    if (!selectedAgent || !phoneNumbers.trim()) {
      toast.error('Please select an agent and provide phone numbers');
      return;
    }

    const numbers = phoneNumbers.split('\n').map(num => num.trim()).filter(num => num);
    if (numbers.length === 0) {
      toast.error('No valid phone numbers found');
      return;
    }

    setLoading(true);
    try {
      const response = await callAPI.batch({
        agentId: selectedAgent,
        phoneNumbers: numbers,
        metadata: {
          batchName: batchName || 'Untitled Batch',
          delay: delay * 1000
        }
      });

      toast.success(`Batch started with ${response.data.total} calls`);
      setBatchName('');
      setPhoneNumbers('');
      fetchBatches();
    } catch (error) {
      toast.error('Failed to start batch calls');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
        <p className="text-gray-600 mt-2">Execute bulk calling campaigns with your voice agents</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batch Setup */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold mb-6">Create New Batch</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Name
                  </label>
                  <input
                    type="text"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    placeholder="Sales Outreach Q1"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Agent
                  </label>
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Choose an agent...</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Numbers
                </label>
                <div className="space-y-2">
                  <textarea
                    value={phoneNumbers}
                    onChange={(e) => setPhoneNumbers(e.target.value)}
                    rows={8}
                    placeholder="+1234567890&#10;+1234567891&#10;+1234567892"
                    className="input-field"
                  />
                  <div className="flex items-center gap-2">
                    <label className="btn-secondary cursor-pointer flex items-center gap-2">
                      <DocumentArrowUpIcon className="h-4 w-4" />
                      Upload CSV
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-sm text-gray-500">
                      {phoneNumbers.split('\n').filter(n => n.trim()).length} numbers
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delay Between Calls (seconds)
                </label>
                <input
                  type="number"
                  value={delay}
                  onChange={(e) => setDelay(parseInt(e.target.value))}
                  min="1"
                  max="60"
                  className="input-field w-32"
                />
              </div>

              <button
                onClick={startBatchCalls}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <PlayIcon className="h-5 w-5" />
                {loading ? 'Starting Batch...' : 'Start Batch Calls'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Active Batches</span>
                <span className="font-semibold">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Calls Today</span>
                <span className="font-semibold">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-semibold text-green-600">82%</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Best Practices</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Keep delays between 5-10 seconds</li>
              <li>• Test with small batches first</li>
              <li>• Monitor compliance requirements</li>
              <li>• Use appropriate time zones</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Batch History */}
      <div className="mt-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-6">Batch History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Success Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {batches.map((batch) => (
                  <tr key={batch.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{batch.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(batch.status)}`}>
                        {batch.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {batch.completedCalls}/{batch.totalCalls}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(batch.completedCalls / batch.totalCalls) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {batch.successRate}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(batch.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {batch.status === 'in_progress' ? (
                        <button className="text-red-600 hover:text-red-900">
                          <PauseIcon className="h-4 w-4" />
                        </button>
                      ) : (
                        <button className="text-blue-600 hover:text-blue-900">
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BatchCalls;