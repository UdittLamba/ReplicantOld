
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'udittlamba',
  applicationName: 'replicant-app',
  appUid: 'KbDJ2vzdFwY0r1Xdzg',
  orgUid: 'SYWWwSfqRlb88mhVpb',
  deploymentUid: 'b14135b2-4bad-416c-9771-cb66bf60a929',
  serviceName: 'replicant',
  shouldLogMeta: true,
  shouldCompressLogs: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'dev',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '4.1.1',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 'replicant-dev-apiHandler', timeout: 30 };

try {
  const userHandler = require('./index.js');
  module.exports.handler = serverlessSDK.handler(userHandler.apiHandler, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}