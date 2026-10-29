const {
  CloudWatchLogsClient,
  CreateLogGroupCommand,
  CreateLogStreamCommand,
  PutLogEventsCommand,
  DescribeLogStreamsCommand,
} = require("@aws-sdk/client-cloudwatch-logs");

const client = new CloudWatchLogsClient({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: process.env.AWS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  } : undefined,
});

const LOG_GROUP = "QFlowLogs";
const LOG_STREAM = "ServerLogs";

async function logToCloudWatch(message) {
  try {
    // Create Log Group
    try {
      await client.send(
        new CreateLogGroupCommand({
          logGroupName: LOG_GROUP,
        })
      );
    } catch (e) {}

    // Create Log Stream
    try {
      await client.send(
        new CreateLogStreamCommand({
          logGroupName: LOG_GROUP,
          logStreamName: LOG_STREAM,
        })
      );
    } catch (e) {}

    // Get Sequence Token
    let sequenceToken;

    try {
      const data = await client.send(
        new DescribeLogStreamsCommand({
          logGroupName: LOG_GROUP,
          logStreamNamePrefix: LOG_STREAM,
        })
      );

      if (
        data.logStreams &&
        data.logStreams.length > 0 &&
        data.logStreams[0].uploadSequenceToken
      ) {
        sequenceToken = data.logStreams[0].uploadSequenceToken;
      }
    } catch (e) {}

    // Send Log
    await client.send(
      new PutLogEventsCommand({
        logGroupName: LOG_GROUP,
        logStreamName: LOG_STREAM,
        sequenceToken,
        logEvents: [
          {
            timestamp: Date.now(),
            message,
          },
        ],
      })
    );

    console.log("✅ CloudWatch Log Sent");
  } catch (err) {
    console.error("CloudWatch Error:", err);
  }
}

module.exports = logToCloudWatch;