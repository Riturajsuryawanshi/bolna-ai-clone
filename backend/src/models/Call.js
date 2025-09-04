class Call {
  constructor(data) {
    this.id = data.id;
    this.agentId = data.agentId;
    this.phoneNumber = data.phoneNumber;
    this.status = data.status || 'initiated';
    this.startTime = data.startTime || new Date().toISOString();
    this.endTime = data.endTime;
    this.duration = data.duration || 0;
    this.transcript = data.transcript || [];
    this.summary = data.summary;
    this.metadata = data.metadata || {};
  }

  addTranscriptEntry(entry) {
    this.transcript.push({
      timestamp: new Date().toISOString(),
      speaker: entry.speaker,
      text: entry.text
    });
  }

  endCall() {
    this.endTime = new Date().toISOString();
    this.duration = Math.floor((new Date(this.endTime) - new Date(this.startTime)) / 1000);
    this.status = 'completed';
  }

  toJSON() {
    return {
      id: this.id,
      agentId: this.agentId,
      phoneNumber: this.phoneNumber,
      status: this.status,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.duration,
      transcript: this.transcript,
      summary: this.summary,
      metadata: this.metadata
    };
  }
}

module.exports = Call;