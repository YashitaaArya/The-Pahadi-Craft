const twilio = require('twilio');

const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const formatPhoneNumber = (phone) => {
  // Remove any +91 prefix and clean the number
  return phone.replace(/^\+91|^91/, '').replace(/\D/g, '');
};

const sendSMS = async (to, message) => {
  try {
    const formattedNumber = formatPhoneNumber(to);
    if (!formattedNumber || formattedNumber.length !== 10) {
      throw new Error('Invalid phone number format');
    }

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${formattedNumber}`,
    });
    return true;
  } catch (err) {
    console.error('SMS Error:', err.message);
    return false;
  }
};

const sendWhatsApp = async (to, message) => {
  try {
    const formattedNumber = formatPhoneNumber(to);
    if (!formattedNumber || formattedNumber.length !== 10) {
      throw new Error('Invalid phone number format');
    }

    await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:+91${formattedNumber}`,
    });
    return true;
  } catch (err) {
    console.error('WhatsApp Error:', err.message);
    return false;
  }
};

module.exports = { sendSMS, sendWhatsApp };
