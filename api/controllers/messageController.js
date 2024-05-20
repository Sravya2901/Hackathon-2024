//uncomment this code and run
// import 'dotenv/config';
// import twilio from 'twilio';

// // Now, you can directly access process.env
// const accountSid = '';
// const authToken = '';  
// const twilioPhoneNumber = '+16264869770';
// // Define sendMessage outside, so it's properly scoped and can be exported
// export async function sendMessage(to, body) {
//   const client = twilio(accountSid, authToken);
//   try {
//     const message = await client.messages.create({
//       body,
//       to, // Assuming 'to' is a parameter of sendMessage
//       from: twilioPhoneNumber
//     });
//     console.log('Message sent:', message.sid);
//     // Assuming you want to return this for chaining or await
//     return { success: true, messageSid: message.sid };
//   } catch (error) {
//     console.error('Error sending message:', error);
//     return { success: false, error: error.message };
//   }
// }

// // If you're using this in an Express app, you'd likely want to wrap this in another function
// // that handles the req, res objects, rather than exporting directly.
// // export default { sendMessage };