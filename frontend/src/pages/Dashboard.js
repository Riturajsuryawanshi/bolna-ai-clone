import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { PhoneIcon, UserGroupIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const stats = [
    { 
      title: 'Active Agents', 
      value: '12', 
      change: '+2 from last month',
      icon: UserGroupIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Total Calls Today', 
      value: '1,234', 
      change: '+15% from yesterday',
      icon: PhoneIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Success Rate', 
      value: '94.2%', 
      change: '+2.1% from last week',
      icon: CheckCircleIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Avg Duration', 
      value: '3m 42s', 
      change: '-12s from last week',
      icon: ClockIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
  ];

  const callData = [
    { name: 'Mon', calls: 145, success: 138 },
    { name: 'Tue', calls: 152, success: 144 },
    { name: 'Wed', calls: 138, success: 131 },
    { name: 'Thu', calls: 161, success: 152 },
    { name: 'Fri', calls: 155, success: 147 },
    { name: 'Sat', calls: 128, success: 121 },
    { name: 'Sun', calls: 133, success: 126 },
  ];

  const recentAgents = [
    { name: 'Sales Assistant', status: 'Active', calls: 45, successRate: '96%' },
    { name: 'Customer Support', status: 'Active', calls: 32, successRate: '94%' },
    { name: 'Lead Qualifier', status: 'Active', calls: 28, successRate: '92%' },
    { name: 'Appointment Setter', status: 'Inactive', calls: 0, successRate: '89%' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your voice agents.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Call Volume This Week</CardTitle>
            <CardDescription>Total calls and successful completions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={callData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#3B82F6" name="Total Calls" />
                <Bar dataKey="success" fill="#10B981" name="Successful" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Success rate over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={callData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="success" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Agent Overview and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Agents</CardTitle>
            <CardDescription>Your voice agents and their performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAgents.map((agent, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      agent.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{agent.name}</p>
                      <p className="text-sm text-gray-500">{agent.calls} calls today</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{agent.successRate}</p>
                    <p className="text-xs text-gray-500">Success rate</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events and system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '2 minutes ago', event: 'Sales Assistant completed call with +1234567890', status: 'success' },
                { time: '15 minutes ago', event: 'New agent "Support Bot" deployed successfully', status: 'info' },
                { time: '1 hour ago', event: 'Campaign "Q4 Outreach" started with 150 contacts', status: 'info' },
                { time: '2 hours ago', event: 'Customer Service agent updated with new knowledge base', status: 'success' },
                { time: '3 hours ago', event: 'Lead Qualifier processed 25 calls', status: 'success' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.event}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;