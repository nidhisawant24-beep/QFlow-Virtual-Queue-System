const {
  SNSClient,
  PublishCommand,
} = require("@aws-sdk/client-sns");

const sns = new SNSClient({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: process.env.AWS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

const sendSMS = async (phone, message) => {
  const command = new PublishCommand({
    PhoneNumber: phone,
    Message: message,
  });

  return await sns.send(command);
};

module.exports = sendSMS;
console.log("sendSMS.js loaded");