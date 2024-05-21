// const twilio = require('twilio');
import twilio from "twilio";
const accountSid = 'ACb267057d33c06ee6438a3829dd255cfa'; // Your Account SID from www.twilio.com/console
const authToken = '3cabde909996cd8136fdaa5ffbded3e7';   // Your Auth Token from www.twilio.com/console
const twilioPhoneNumber = '+16264869770';

const client = twilio(accountSid, authToken);

const sendMessage = async (req, res) => {
  const { to, body } = req.body;
  console.log(to)
  try {
    const message = await client.messages.create({
      body: body,
      to: '+917801049826',
      from: twilioPhoneNumber
    });

    res.status(200).json({ success: true, messageSid: message.sid });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default sendMessage;
