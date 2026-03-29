import twilio from 'twilio';

// Initialize client lazily only when requested to prevent ES Module early read failures
let _client = null;

const getClient = () => {
  if (_client) return _client;
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (accountSid && authToken) {
    _client = twilio(accountSid, authToken);
  }
  return _client;
};

/**
 * Send a standard SMS message.
 */
export const sendSMS = async (to, body) => {
  const client = getClient();
  if (!client) throw new Error('Twilio not configured for Live Mode');
  return client.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
  });
};

/**
 * Trigger an outbound IVR call.
 */
export const startIVRCall = async (to, audioUrl, baseUrl) => {
  const client = getClient();
  if (!client) throw new Error('Twilio not configured for Live Mode');
  
  // If baseUrl provided, instruct Twilio to hit our language selection IVR
  if (baseUrl) {
    return client.calls.create({
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
      url: `${baseUrl}/comm/ivr/start`,
    });
  }

  const twiml = audioUrl 
    ? `<Response><Play>${audioUrl}</Play></Response>`
    : `<Response>
  <Say voice="Polly.Aditi" language="en-IN">
    Hello.
    <Pause length="1"/>
    This is Swasthya Sathi calling.
    <Pause length="1"/>
    You have a pending health checkup scheduled soon.
    <Pause length="1"/>
    Please make sure to visit your ASHA worker and follow the recommended guidelines.
    <Pause length="1"/>
    Thank you, and take care of your health.
  </Say>
</Response>`;

  return client.calls.create({
    to,
    from: process.env.TWILIO_PHONE_NUMBER,
    twiml,  
  });
};
