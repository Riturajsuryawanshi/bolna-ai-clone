import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, KeyIcon, CreditCardIcon, GlobeAltIcon, BellIcon } from '@heroicons/react/24/outline';

const Settings = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: user?.email || 'user@bolna.ai',
    company: 'Bolna AI',
    phone: '+1 (555) 123-4567'
  });

  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Production API Key', key: 'bln_prod_***', created: '2024-01-15', lastUsed: '2024-01-20' },
    { id: 2, name: 'Development API Key', key: 'bln_dev_***', created: '2024-01-10', lastUsed: '2024-01-19' }
  ]);

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    webhookFailures: true,
    dailyReports: true,
    weeklyReports: false
  });

  const handleProfileUpdate = () => {
    // Handle profile update
    console.log('Profile updated:', profile);
  };

  const generateApiKey = () => {
    const newKey = {
      id: Date.now(),
      name: 'New API Key',
      key: `bln_${Math.random().toString(36).substr(2, 9)}`,
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never'
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const deleteApiKey = (id) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data & Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-blue-600" />
                <CardTitle>Profile Information</CardTitle>
              </div>
              <CardDescription>
                Update your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <Input
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <Input
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleProfileUpdate}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <KeyIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>
                      Manage your API keys for programmatic access
                    </CardDescription>
                  </div>
                </div>
                <Button onClick={generateApiKey}>Generate New Key</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{key.name}</p>
                      <p className="text-sm text-gray-600 font-mono">{key.key}</p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(key.created).toLocaleDateString()} • 
                        Last used: {key.lastUsed}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Copy</Button>
                      <Button variant="outline" size="sm" onClick={() => deleteApiKey(key.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CreditCardIcon className="h-5 w-5 text-blue-600" />
                  <CardTitle>Current Plan</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-blue-900">Professional Plan</h3>
                    <p className="text-blue-700">$99/month • 10,000 calls included</p>
                  </div>
                  <Button variant="outline">Upgrade Plan</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Calls Made</span>
                    <span className="font-medium">7,234 / 10,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Next billing date: Feb 15, 2024</span>
                    <span>$99.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BellIcon className="h-5 w-5 text-blue-600" />
                <CardTitle>Notification Preferences</CardTitle>
              </div>
              <CardDescription>
                Choose how you want to be notified about important events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-sm text-gray-600">
                      {key === 'emailAlerts' && 'Receive email notifications for important events'}
                      {key === 'smsAlerts' && 'Get SMS notifications for critical alerts'}
                      {key === 'webhookFailures' && 'Notify when webhook deliveries fail'}
                      {key === 'dailyReports' && 'Daily summary of agent performance'}
                      {key === 'weeklyReports' && 'Weekly analytics and insights'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <GlobeAltIcon className="h-5 w-5 text-blue-600" />
                  <CardTitle>Data Residency</CardTitle>
                </div>
                <CardDescription>
                  Choose where your data is stored and processed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Region</label>
                    <select className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                      <option>United States (US-East)</option>
                      <option>Europe (EU-West)</option>
                      <option>Asia Pacific (AP-Southeast)</option>
                    </select>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your data will be stored and processed in the selected region for compliance and performance.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Export & Deletion</CardTitle>
                <CardDescription>
                  Export your data or request account deletion
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">Export Account Data</p>
                    <p className="text-sm text-gray-600">Download all your account data and call records</p>
                  </div>
                  <Button variant="outline">Export Data</Button>
                </div>
                <div className="flex justify-between items-center p-4 border border-red-200 rounded-lg bg-red-50">
                  <div>
                    <p className="font-medium text-red-900">Delete Account</p>
                    <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-100">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;