const axios = require('axios');
require('dotenv').config();

const testChat = async () => {
  try {
    console.log('Testing OpenRouter Chat Integration...\n');
    
    // Test the chat endpoint
    const response = await axios.post('http://localhost:5001/api/chat', {
      model: 'deepseek-v3.1',
      message: 'Hello! Can you tell me a short joke?'
    });
    
    console.log('✅ Chat test successful!');
    console.log('Response:', response.data.response);
    console.log('\n🎉 OpenRouter integration is working correctly!');
    
  } catch (error) {
    console.error('❌ Chat test failed:');
    console.error('Error:', error.response?.data?.error || error.message);
    
    if (error.response?.status === 500 && error.response?.data?.error?.includes('API key')) {
      console.log('\n💡 Make sure to set OPENROUTER_API_KEY in your .env file');
    }
  }
};

// Check if server is running
const checkServer = async () => {
  try {
    await axios.get('http://localhost:5001/health');
    console.log('✅ Backend server is running\n');
    return true;
  } catch (error) {
    console.error('❌ Backend server is not running');
    console.log('Please start the server with: npm run dev\n');
    return false;
  }
};

const runTests = async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testChat();
  }
};

runTests();