class Agent {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type || 'conversational';
    this.prompt = data.prompt;
    this.voice = data.voice || 'alloy';
    this.language = data.language || 'en';
    this.providers = {
      telephony: data.providers?.telephony || 'twilio',
      llm: data.providers?.llm || 'openai',
      tts: data.providers?.tts || 'openai',
      asr: data.providers?.asr || 'deepgram'
    };
    this.settings = {
      maxCallDuration: data.settings?.maxCallDuration || 300,
      silenceTimeout: data.settings?.silenceTimeout || 30,
      interruptible: data.settings?.interruptible || true
    };
    this.status = data.status || 'active';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      prompt: this.prompt,
      voice: this.voice,
      language: this.language,
      providers: this.providers,
      settings: this.settings,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Agent;