const {
  SNSClient,
  PublishCommand,
} = require("@aws-sdk/client-sns");

const sns = new SNSClient({
  region: process.env.AWS_REGION,
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