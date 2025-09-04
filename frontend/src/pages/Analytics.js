import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { analyticsAPI } from '../services/api';
import toast from 'react-hot-toast';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [transcripts, setTranscripts] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [timeframe, setTimeframe] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      const [analyticsRes, transcriptsRes, performanceRes] = await Promise.all([
        analyticsAPI.getOverview(),
        analyticsAPI.getTranscripts({ limit: 10 }),
        analyticsAPI.getPerformance({ timeframe })
      ]);

      setAnalytics(analyticsRes.data.data);
      setTranscripts(transcriptsRes.data.transcripts);
      setPerformance(performanceRes.data.performance);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const sentimentData = [
    { name: 'Positive', value: 65, color: '#10B981' },
    { name: 'Neutral', value: 25, color: '#F59E0B' },
    { name: 'Negative', value: 10, color: '#EF4444' }
  ];

  return (
    <div className="px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Insights into your voice AI performance</p>
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="input-field w-auto"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600">Total Calls</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{analytics?.totalCalls || 0}</p>
          <p className="text-sm text-green-600 mt-1">+12% from last period</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600">Avg Duration</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{analytics?.avgDuration || 0}s</p>
          <p className="text-sm text-blue-600 mt-1">+5% from last period</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600">Success Rate</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{analytics?.successRate || 0}%</p>
          <p className="text-sm text-green-600 mt-1">+2% from last period</p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600">Satisfaction</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{performance?.metrics?.customerSatisfaction || 0}</p>
          <p className="text-sm text-green-600 mt-1">+0.3 from last period</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Call Volume Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Call Volume Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performance?.trends || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="calls" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Average Duration */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Average Call Duration</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performance?.trends || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgDuration" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Analysis */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span>Response Time</span>
                <span>{performance?.metrics?.avgResponseTime || 0}ms</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${Math.min((performance?.metrics?.avgResponseTime || 0) / 1000 * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Resolution Rate</span>
                <span>{(performance?.metrics?.resolutionRate * 100 || 0).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(performance?.metrics?.resolutionRate * 100 || 0)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transcripts */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Call Transcripts</h3>
        <div className="space-y-4">
          {transcripts.map((transcript) => (
            <div key={transcript.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium">Call {transcript.callId}</h4>
                  <p className="text-sm text-gray-600">
                    {transcript.duration}s • {transcript.sentiment} sentiment
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(transcript.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Summary:</p>
                <p className="text-sm text-gray-600">{transcript.summary}</p>
              </div>

              <div className="space-y-2">
                {transcript.transcript.slice(0, 3).map((entry, index) => (
                  <div key={index} className="flex gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      entry.speaker === 'agent' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {entry.speaker}
                    </span>
                    <p className="text-sm text-gray-700 flex-1">{entry.text}</p>
                  </div>
                ))}
                {transcript.transcript.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    ... and {transcript.transcript.length - 3} more messages
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;