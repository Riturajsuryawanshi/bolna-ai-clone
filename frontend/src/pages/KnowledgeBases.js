import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { PlusIcon, DocumentIcon, TrashIcon, PencilIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

const KnowledgeBases = () => {
  const [knowledgeBases, setKnowledgeBases] = useState([
    {
      id: 1,
      name: 'Product Documentation',
      description: 'Complete product documentation and FAQs',
      type: 'documents',
      size: '2.4 MB',
      documents: 45,
      lastUpdated: '2024-01-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Customer Support Scripts',
      description: 'Standard responses and troubleshooting guides',
      type: 'text',
      size: '1.8 MB',
      documents: 32,
      lastUpdated: '2024-01-12',
      status: 'active'
    },
    {
      id: 3,
      name: 'Sales Playbook',
      description: 'Sales strategies and objection handling',
      type: 'documents',
      size: '3.1 MB',
      documents: 28,
      lastUpdated: '2024-01-10',
      status: 'processing'
    }
  ]);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newKB, setNewKB] = useState({ name: '', description: '', type: 'documents' });

  const handleCreate = () => {
    const kb = {
      id: Date.now(),
      ...newKB,
      size: '0 MB',
      documents: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'active'
    };
    setKnowledgeBases([...knowledgeBases, kb]);
    setNewKB({ name: '', description: '', type: 'documents' });
    setIsCreateOpen(false);
  };

  const handleDelete = (id) => {
    setKnowledgeBases(knowledgeBases.filter(kb => kb.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Bases</h1>
          <p className="text-gray-600 mt-2">Manage your AI agent's knowledge sources and training data</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Create Knowledge Base
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Knowledge Base</DialogTitle>
              <DialogDescription>
                Add a new knowledge base to train your AI agents with specific information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  value={newKB.name}
                  onChange={(e) => setNewKB({ ...newKB, name: e.target.value })}
                  placeholder="Enter knowledge base name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <Input
                  value={newKB.description}
                  onChange={(e) => setNewKB({ ...newKB, description: e.target.value })}
                  placeholder="Describe what this knowledge base contains"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newKB.type}
                  onChange={(e) => setNewKB({ ...newKB, type: e.target.value })}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="documents">Documents</option>
                  <option value="text">Text Content</option>
                  <option value="urls">Web URLs</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>
                  Create Knowledge Base
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Knowledge Bases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {knowledgeBases.map((kb) => (
          <Card key={kb.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <DocumentIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{kb.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        kb.status === 'active' ? 'bg-green-100 text-green-800' :
                        kb.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {kb.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(kb.id)}>
                    <TrashIcon className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{kb.description}</CardDescription>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Documents:</span>
                  <span>{kb.documents}</span>
                </div>
                <div className="flex justify-between">
                  <span>Size:</span>
                  <span>{kb.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span>{new Date(kb.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm" className="w-full">
                  <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Upload</CardTitle>
          <CardDescription>
            Drag and drop files here or click to browse. Supported formats: PDF, DOC, TXT, CSV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drop files here to upload</p>
            <Button variant="outline">
              Choose Files
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBases;