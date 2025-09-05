import React, { useState, useEffect, useRef } from 'react';
import openRouterService from '../services/openRouterService';

const AIChat = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('deepseek-v3.1');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadModels();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadModels = () => {
    try {
      const response = openRouterService.getModels();
      setModels(response.models);
    } catch (err) {
      setError('Failed to load models');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = { role: 'user', content: inputMessage, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setLoading(true);
    setError('');

    try {
      const response = await openRouterService.chat(selectedModel, currentMessage);
      const aiMessage = { 
        role: 'assistant', 
        content: response.message, 
        model: response.model,
        timestamp: Date.now() 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Chat with Multiple Models</h2>
        
        {/* Model Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose AI Model
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            Start a conversation with your selected AI model
          </div>
        )}
        
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-sm'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
              {message.model && message.role === 'assistant' && (
                <div className="text-xs text-gray-400 mt-2 border-t border-gray-100 pt-2">
                  {models.find(m => m.id === message.model)?.name || message.model}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="text-left mb-4">
            <div className="inline-block bg-white text-gray-800 border border-gray-200 px-4 py-3 rounded-lg rounded-bl-sm shadow-sm">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-3"></div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="flex gap-3">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default AIChat;