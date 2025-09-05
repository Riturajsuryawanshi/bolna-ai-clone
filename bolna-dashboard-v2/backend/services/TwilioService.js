const twilio = require('twilio')

class TwilioService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )
  }

  async makeCall({ to, from, url }) {
    try {
      const call = await this.client.calls.create({
        to,
        from,
        url,
        method: 'POST'
      })
      
      return call
    } catch (error) {
      throw new Error(`Twilio call failed: ${error.message}`)
    }
  }

  async getCall(callSid) {
    try {
      const call = await this.client.calls(callSid).fetch()
      return call
    } catch (error) {
      throw new Error(`Failed to fetch call: ${error.message}`)
    }
  }

  async endCall(callSid) {
    try {
      const call = await this.client.calls(callSid).update({
        status: 'completed'
      })
      return call
    } catch (error) {
      throw new Error(`Failed to end call: ${error.message}`)
    }
  }

  async getPhoneNumbers() {
    try {
      const phoneNumbers = await this.client.incomingPhoneNumbers.list()
      return phoneNumbers.map(number => ({
        sid: number.sid,
        phoneNumber: number.phoneNumber,
        friendlyName: number.friendlyName
      }))
    } catch (error) {
      throw new Error(`Failed to fetch phone numbers: ${error.message}`)
    }
  }
}

module.exports = TwilioService