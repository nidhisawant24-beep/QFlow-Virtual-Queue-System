const {
  CloudWatchLogsClient,
} = require("@aws-sdk/client-cloudwatch-logs");

module.exports = new CloudWatchLogsClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});